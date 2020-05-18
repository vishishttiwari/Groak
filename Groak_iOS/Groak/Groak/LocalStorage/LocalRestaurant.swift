//
//  LocalRestaurant.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Whenever a restaurant qr code is scanned, the values in following file get loaded uo

import Foundation
import Firebase
import CoreData

internal class LocalRestaurant {
    
    static var fsOrders: FirestoreAPICallsOrders?
    static var fsRequests: FirestoreAPICallsRequests?
    
    // Because orders and requests use snapshot listener, orders and requests are in the firebase are initialized here
    static func createRestaurant(restaurant: Restaurant, table: Table) {
        self.restaurant.restaurant = restaurant
        
        fsOrders = FirestoreAPICallsOrders.init();
        fsRequests = FirestoreAPICallsRequests.init();
        self.table.table = table
        order.orderReference = table.orderReference
        request.requestReference = table.requestReference
        
        if let orderReference =  order.orderReference {
            FirebaseMessaging.shared.subscribe(orderId: orderReference.documentID)
        }
    }
    
    // This removes the restaurant info, table info, order info and requests info. This also removes the cart and order. This also unsubscribes from the two snapshot listeners
    static func deleteRestaurant() {
        if let orderReference =  order.orderReference {
            FirebaseMessaging.shared.unsubscribe(orderId: orderReference.documentID)
        }
        
        AppDelegate.badgeCountRequest = 0
        AppDelegate.badgeCountOrder = 0
        UIApplication.shared.applicationIconBadgeNumber = AppDelegate.badgeCountRequest + AppDelegate.badgeCountOrder
        
        restaurant.restaurant = nil
        table.table = nil
        order.orderReference = nil
        request.requestReference = nil
        
        cart = Cart.init()
        tableOrder = Order.init()
        
        fsOrders?.unsubscribe()
        fsRequests?.unsubscribe()
        
        fsOrders = nil
        fsRequests = nil
    }
    
    static func leaveRestaurantWithoutAsking() {
        let (_, rootViewController) = Catalog.getTopAndRootViewControllers()
        deleteRestaurant()
        rootViewController?.dismiss(animated: false) {
            rootViewController?.returningToIntro()
        }
    }
    
    // Function called when the user either goes away from the restaurant or enough time has passed since the code was scanned
    static func leaveRestaurant(title: String = "Scan QR code again", message: String = "Please scan your QR code again to order") {
        deleteRestaurant()
        
        let (topViewController, rootViewController) = Catalog.getTopAndRootViewControllers()
        
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction.init(title: "Ok", style: .cancel, handler: { (UIAlertAction) in
            rootViewController?.dismiss(animated: false) {
                rootViewController?.returningToIntro()
            }
        }))
        topViewController?.present(alert, animated: true, completion: nil)
    }
    
    // Function called when the user presses the button to leave the restaurant
    static func askToLeaveRestaurant(title: String = "Leaving restaurant?", message: String = "Are you sure you would like to leave the restaurant?. Your cart will be lost") {
        let (topViewController, rootViewController) = Catalog.getTopAndRootViewControllers()
        
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        alert.addAction(UIAlertAction.init(title: "Yes", style: .default, handler: { (UIAlertAction) in
            rootViewController?.dismiss(animated: false) {
                deleteRestaurant()
                rootViewController?.returningToIntro()
            }
        }))
        topViewController?.present(alert, animated: true, completion: nil)
    }
    
    // This checks if the restaurant creation was successful
    static func isRestaurantCreationSuccessful() -> Bool {
        if let _ = restaurant.restaurant, let _ = table.table, let _ = order.orderReference, let _ =  request.requestReference {
            return true
        }
        
        deleteRestaurant()
        
        return false
    }
    
    struct restaurant {
        static var restaurant: Restaurant? = nil
    }
    
    struct table {
        static var table: Table? = nil
    }
    
    struct order {
        static var orderReference: DocumentReference? = nil
    }
    
    struct request {
        static var requestReference: DocumentReference? = nil
    }
    
    static var cart: Cart = Cart.init()
    
    static var tableOrder: Order = Order.init()
    
    // This sets all the table orders that were local. It does this by seeing all orders which are local. If any of them are exactly same as the one locally then it sets the local variable as true
    static func setLocalTableOrder(viewController: UIViewController, order: Order) {
        LocalRestaurant.tableOrder = order
        let localDishes = self.downloadDishesFromCoreData(viewController: viewController)
        let localComments = self.downloadCommentsFromCoreData(viewController: viewController)
        
        for localDish in localDishes {
            for dish in LocalRestaurant.tableOrder.dishes {
                if dish.equals(coreDataDishReference: localDish) {
                    dish.local = true
                }
            }
        }
        for localComment in localComments {
            for comment in LocalRestaurant.tableOrder.comments {
                if comment.equals(coreDataCommentReference: localComment) {
                    comment.local = true
                }
            }
        }
    }
    
    // Download local dishes from coredata. If any of the dish is older than 24 hours then it deletes it from the local core data
    private static func downloadDishesFromCoreData(viewController: UIViewController) -> [CoreDataDishReference] {
        let delegate = UIApplication.shared.delegate as? AppDelegate
        
        if let context = delegate?.persistentContainer.viewContext {
            let fetchDishes = NSFetchRequest<NSFetchRequestResult>.init(entityName: "CoreDataDishReference")
            fetchDishes.sortDescriptors = [NSSortDescriptor.init(key: "created", ascending: true)]
            
            do {
                let dishes: [CoreDataDishReference] = try(context.fetch(fetchDishes)) as? [CoreDataDishReference] ?? []
                for dish in dishes {
                    if let created = dish.created, let previousDay = Calendar.current.date(byAdding: .hour, value: -24, to: Date()) {
                        if created < previousDay {
                            context.delete(dish)
                        }
                    }
                }
                return dishes
            } catch {
                Catalog.alert(vc: viewController, title: "Error loading your order", message: "There was an error loading your order")
            }
        }
        return []
    }
    
    // Download local comments from coredata. If any of the dish is older than 24 hours then it deletes it from the local core data
    private static func downloadCommentsFromCoreData(viewController: UIViewController) -> [CoreDataCommentReference] {
        let delegate = UIApplication.shared.delegate as? AppDelegate
        
        if let context = delegate?.persistentContainer.viewContext {
            let fetchDishes = NSFetchRequest<NSFetchRequestResult>.init(entityName: "CoreDataCommentReference")
            fetchDishes.sortDescriptors = [NSSortDescriptor.init(key: "created", ascending: true)]
            
            do {
                let comments: [CoreDataCommentReference] = try(context.fetch(fetchDishes)) as? [CoreDataCommentReference] ?? []
                for comment in comments {
                    if let created = comment.created, let previousDay = Calendar.current.date(byAdding: .hour, value: -24, to: Date()) {
                        if created < previousDay {
                            context.delete(comment)
                        }
                    }
                }
                return comments
            } catch {
                Catalog.alert(vc: viewController, title: "Error loading your comments", message: "There was an error loading your comments")
            }
        }
        return []
    }
}
