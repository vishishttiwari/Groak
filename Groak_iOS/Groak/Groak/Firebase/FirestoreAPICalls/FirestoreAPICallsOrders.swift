//
//  FirestoreAPICallsOrders.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/5/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import Firebase
import CoreData

internal class FirestoreAPICallsOrders {
    private let db = Firebase.db;
    
    var dataReceivedForFetchOrder: ((_ order: Order?) -> ())?
    var dataReceivedForAddOrder: ((_ success: Bool) -> ())?
    
    var listener: ListenerRegistration?
    
    // Fetch all order info from orderId
    func fetchOrderFirestoreAPI() {
        listener = LocalRestaurant.order.orderReference?.addSnapshotListener { documentSnapshot, error in
            guard let document = documentSnapshot else {
                self.dataReceivedForFetchOrder?(nil)
                return
            }
            let requests = Order.init(order: document.data() ?? [:])
            self.dataReceivedForFetchOrder?(requests)
        }
    }
    
    func unsubscribe() {
        listener?.remove()
    }
    
    func addOrdersFirestoreAPI(viewController: UIViewController) {
        let order = Order.init(cart: LocalRestaurant.cart)
        
        if !order.success() {
            dataReceivedForAddOrder?(false)
            return
        }
        
        guard let orderReference = LocalRestaurant.order.orderReference else {
            dataReceivedForAddOrder?(false)
            return
        }
        
        db.runTransaction({ (transaction, errorPointer) in
            let orderDocument: DocumentSnapshot
            do {
                try orderDocument = transaction.getDocument(orderReference)
            } catch let fetchError as NSError {
                errorPointer?.pointee = fetchError
                return nil
            }

            let savedOrder = Order.init(order: orderDocument.data() ?? [:])
            if !savedOrder.success() {
                return nil
            }
            
            
            var newComments: [[String: Any]] = []
            for comment in savedOrder.comments {
                newComments.append(comment.dictionary)
            }
            for comment in order.comments {
                newComments.append(comment.dictionary)
            }
            
            var newDishes: [[String: Any]] = []
            for dish in savedOrder.dishes {
                newDishes.append(dish.dictionary)
            }
            for dish in order.dishes {
                newDishes.append(dish.dictionary)
            }

            transaction.updateData(["comments": newComments, "dishes": newDishes, "status": TableStatus.ordered.rawValue, "updated": Timestamp.init(), "items": savedOrder.items + order.items], forDocument: orderReference)
            
            return nil
        }) { (object, error) in
            if error != nil {
                self.dataReceivedForAddOrder?(false)
            } else {
                if !self.addOrderToCoreData(order: order) {
                    Catalog.alert(vc: viewController, title: "Error adding this order locally", message: "This order will not be saved as your order but will still be sent to the restaurant on behalf of your table. Please contact the restaurant regarding this.")
                }
                self.dataReceivedForAddOrder?(true)
            }
        }
    }
    
    func addCommentFirestoreAPI(viewController: UIViewController?, comment: String) {
        let commentObject = OrderComment.init(comment: comment)
        
        guard let orderReference = LocalRestaurant.order.orderReference else {
            dataReceivedForAddOrder?(false)
            return
        }
        
        db.runTransaction({ (transaction, errorPointer) in
            let orderDocument: DocumentSnapshot
            do {
                try orderDocument = transaction.getDocument(orderReference)
            } catch let fetchError as NSError {
                errorPointer?.pointee = fetchError
                return nil
            }

            let savedOrder = Order.init(order: orderDocument.data() ?? [:])
            if !savedOrder.success() {
                return nil
            }
            
            
            var newComments: [[String: Any]] = []
            for comment in savedOrder.comments {
                newComments.append(comment.dictionary)
            }
            newComments.append(commentObject.dictionary)

            transaction.updateData(["comments": newComments], forDocument: orderReference)
            
            return nil
        }) { (object, error) in
            if error != nil {
                self.dataReceivedForAddOrder?(false)
            } else {
                if !self.addCommentToCoreData(orderComment: commentObject) {
                    if let viewController = viewController {
                        Catalog.alert(vc: viewController, title: "Error adding this comment locally", message: "This comment will not be saved as your comment but will still be sent to the restaurant on behalf of your table.")
                    }
                }
                self.dataReceivedForAddOrder?(true)
            }
        }
    }
    
    private func addOrderToCoreData(order: Order) -> Bool {
        for dish in order.dishes {
            
            let delegate = UIApplication.shared.delegate as? AppDelegate
            
            if let context = delegate?.persistentContainer.viewContext {
                let coreDataDish = NSEntityDescription.insertNewObject(forEntityName: "CoreDataDish", into: context) as! CoreDataDish
                
                coreDataDish.name = dish.name
                coreDataDish.quantity = Int16(dish.quantity)
                coreDataDish.price = dish.price
                coreDataDish.created = dish.created.dateValue()
                coreDataDish.restaurantName = LocalRestaurant.restaurant.restaurant?.name
                coreDataDish.restaurantDocumentId = LocalRestaurant.restaurant.restaurant?.reference?.documentID
                
                for extra in dish.extras {
                    let coreDataDishExtra = NSEntityDescription.insertNewObject(forEntityName: "CoreDataDishExtra", into: context) as! CoreDataDishExtra
                    
                    coreDataDishExtra.title = extra.title
                    coreDataDishExtra.dish = coreDataDish
                    
                    for option in extra.options {
                        let coreDataDishExtraOption = NSEntityDescription.insertNewObject(forEntityName: "CoreDataDishExtraOption", into: context) as! CoreDataDishExtraOption
                        
                        coreDataDishExtraOption.title = option.title
                        coreDataDishExtraOption.price = option.price
                        coreDataDishExtraOption.extra = coreDataDishExtra
                        
                        coreDataDishExtra.addToOptions(coreDataDishExtraOption)
                    }
                    
                    coreDataDish.addToExtras(coreDataDishExtra)
                }
                do {
                    try context.save()
                } catch {
                    return false
                }
            }
        }
        
        for comment in order.comments {
            if !addCommentToCoreData(orderComment: comment) {
                return false
            }
        }
        return true
    }
    
    private func addCommentToCoreData(orderComment: OrderComment) -> Bool {
        let delegate = UIApplication.shared.delegate as? AppDelegate
        
        if let context = delegate?.persistentContainer.viewContext {
            let coreDataComment = NSEntityDescription.insertNewObject(forEntityName: "CoreDataComment", into: context) as! CoreDataComment
            
            coreDataComment.comment = orderComment.comment
            coreDataComment.created = orderComment.created.dateValue()
            coreDataComment.restaurantName = LocalRestaurant.restaurant.restaurant?.name
            coreDataComment.restaurantDocumentId = LocalRestaurant.restaurant.restaurant?.reference?.documentID
            
            do {
                try context.save()
            } catch {
                return false
            }
        }
        return true
    }
}
