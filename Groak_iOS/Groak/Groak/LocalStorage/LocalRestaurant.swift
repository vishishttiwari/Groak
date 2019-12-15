//
//  LocalRestaurant.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import Firebase
import CoreData

internal class LocalRestaurant {
    
    static var fsOrders: FirestoreAPICallsOrders?
    static var fsRequests: FirestoreAPICallsRequests?
    
    static func leaveRestaurant(title: String = "Scan QR code again", message: String = "Please scan your QR code again to order") {
        restaurant.restaurant = nil
        table.table = nil
        order.orderReference = nil
        requests.requestsReference = nil
        
        cart = Cart.init()
        tableOrder = Order.init()
        
        fsOrders?.unsubscribe()
        fsRequests?.unsubscribe()
        
        fsOrders = nil
        fsRequests = nil
        
        let rootViewController = UIApplication.shared.keyWindow?.rootViewController as? IntroViewController
        var topViewController = UIApplication.shared.keyWindow?.rootViewController
        while let presentedViewController = topViewController?.presentedViewController {
            topViewController = presentedViewController
        }
        
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction.init(title: "Ok", style: .cancel, handler: { (UIAlertAction) in
            rootViewController?.dismiss(animated: false) {
                rootViewController?.returningToIntro()
            }
        }))
        topViewController?.present(alert, animated: true, completion: nil)
    }
    
    static func askToLeaveRestaurant(title: String = "Leaving restaurant?", message: String = "Are you sure you would like to leave the restaurant?. Your cart will be lost.") {
        restaurant.restaurant = nil
        table.table = nil
        order.orderReference = nil
        requests.requestsReference = nil
        
        cart = Cart.init()
        tableOrder = Order.init()
        
        fsOrders?.unsubscribe()
        fsRequests?.unsubscribe()
        
        fsOrders = nil
        fsRequests = nil
        
        let rootViewController = UIApplication.shared.keyWindow?.rootViewController as? IntroViewController
        var topViewController = UIApplication.shared.keyWindow?.rootViewController
        while let presentedViewController = topViewController?.presentedViewController {
            topViewController = presentedViewController
        }
        
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        alert.addAction(UIAlertAction.init(title: "Ok", style: .cancel, handler: { (UIAlertAction) in
            rootViewController?.dismiss(animated: false) {
                rootViewController?.returningToIntro()
            }
        }))
        topViewController?.present(alert, animated: true, completion: nil)
    }
    
    static func restaurantFoundSuccessful() -> Bool {
        if let _ = restaurant.restaurant, let _ = table.table, let _ = order.orderReference, let _ =  requests.requestsReference {
            return true
        }
        
        restaurant.restaurant = nil
        table.table = nil
        order.orderReference = nil
        requests.requestsReference = nil
        
        cart = Cart.init()
        tableOrder = Order.init()
        
        fsOrders?.unsubscribe()
        fsRequests?.unsubscribe()
        
        fsOrders = nil
        fsRequests = nil
        
        return false
    }
    
    struct restaurant {
        static var restaurant: Restaurant? = nil
    }
    
    struct table {
        static var table: Table? = nil
        static func setTable(table: Table) {
            fsOrders = FirestoreAPICallsOrders.init();
            fsRequests = FirestoreAPICallsRequests.init();
            self.table = table
            order.orderReference = table.orderReference
            requests.requestsReference = table.requestsReference
        }
    }
    
    struct order {
        static var orderReference: DocumentReference? = nil
    }
    
    struct requests {
        static var requestsReference: DocumentReference? = nil
    }
    
    static var cart: Cart = Cart.init()
    
    static var tableOrder: Order = Order.init()
    
    static func setTableOrder(viewController: UIViewController, order: Order) {
        LocalRestaurant.tableOrder = order
        let localDishes = self.downloadDishesFromCoreData(viewController: viewController)
        let localComments = self.downloadCommentsFromCoreData(viewController: viewController)
        
        for localDish in localDishes {
            for dish in LocalRestaurant.tableOrder.dishes {
                if dish.equals(coreDataDish: localDish) {
                    dish.local = true
                }
            }
        }
        for localComment in localComments {
            for comment in LocalRestaurant.tableOrder.comments {
                if comment.equals(coreDataComment: localComment) {
                    comment.local = true
                }
            }
        }
    }
    
    private static func downloadDishesFromCoreData(viewController: UIViewController) -> [CoreDataDish] {
        let delegate = UIApplication.shared.delegate as? AppDelegate
        
        if let context = delegate?.persistentContainer.viewContext {
            let fetchDishes = NSFetchRequest<NSFetchRequestResult>.init(entityName: "CoreDataDish")
            fetchDishes.sortDescriptors = [NSSortDescriptor.init(key: "created", ascending: true)]
            
            do {
                let dishes: [CoreDataDish] = try(context.fetch(fetchDishes)) as? [CoreDataDish] ?? []
                for dish in dishes {
                    if let created = dish.created, let previousDay = Calendar.current.date(byAdding: .hour, value: -24, to: Date()) {
                        if created < previousDay {
                            print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
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
    
    private static func downloadCommentsFromCoreData(viewController: UIViewController) -> [CoreDataComment] {
        let delegate = UIApplication.shared.delegate as? AppDelegate
        
        if let context = delegate?.persistentContainer.viewContext {
            let fetchDishes = NSFetchRequest<NSFetchRequestResult>.init(entityName: "CoreDataComment")
            fetchDishes.sortDescriptors = [NSSortDescriptor.init(key: "created", ascending: true)]
            
            do {
                let comments: [CoreDataComment] = try(context.fetch(fetchDishes)) as? [CoreDataComment] ?? []
                for comment in comments {
                    if let created = comment.created, let previousDay = Calendar.current.date(byAdding: .hour, value: -24, to: Date()) {
                        if created < previousDay {
                            print("#################################################################################################")
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
