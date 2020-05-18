//
//  FirestoreAPICallsOrders.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/5/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Contains all API calls for fetching orders information. There will always be only one instance of this
//  in the project because this is a snapshor listener. So all the instances have to be unsubscribed before leaving.

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
    
    // Add all order to to server from cart
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
        guard let tableReference = LocalRestaurant.table.table?.reference else {
            dataReceivedForAddOrder?(false)
            return
        }
        guard let tableOriginalReference = LocalRestaurant.table.table?.originalReference else {
            dataReceivedForAddOrder?(false)
            return
        }
        
        if (order.comments.count == 0 || !order.comments[0].success()) {
            let _ = self.addDishReferenceToCoreData(order: order)
        } else {
            let _ = self.addDishReferenceToCoreData(order: order)
            let _ = self.addCommentReferenceToCoreData(orderComment: order.comments[0])
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

            if savedOrder.status == TableStatus.seated || savedOrder.status == TableStatus.available {
                transaction.updateData(["comments": newComments, "dishes": newDishes, "status": TableStatus.ordered.rawValue, "updated": Timestamp.init(), "serveTime": TimeCatalog.addThirtyMinutesToTimestamp(), "items": savedOrder.items + order.items], forDocument: orderReference)
            } else {
                transaction.updateData(["comments": newComments, "dishes": newDishes, "status": TableStatus.ordered.rawValue, "updated": Timestamp.init(), "items": savedOrder.items + order.items], forDocument: orderReference)
            }
            transaction.updateData(["status": TableStatus.ordered.rawValue], forDocument: tableReference)
            transaction.updateData(["status": TableStatus.ordered.rawValue], forDocument: tableOriginalReference)
            
            return nil
        }) { (object, error) in
            if error != nil {
                self.dataReceivedForAddOrder?(false)
            } else {
                if (order.comments.count == 0 || !order.comments[0].success()) {
                    if self.addDishReferenceToCoreData(order: order) {
                        self.dataReceivedForAddOrder?(true)
                    } else {
                        Catalog.alert(vc: viewController, title: "Error adding this order locally", message: "This order will not be saved as your order but will still be sent to the restaurant on behalf of your table. Please contact the restaurant regarding this")
                        self.dataReceivedForAddOrder?(true)
                    }
                } else {
                    if (self.addDishReferenceToCoreData(order: order) && self.addCommentReferenceToCoreData(orderComment: order.comments[0])) {
                        self.dataReceivedForAddOrder?(true)
                    } else {
                        Catalog.alert(vc: viewController, title: "Error adding this order locally", message: "This order will not be saved as your order but will still be sent to the restaurant on behalf of your table. Please contact the restaurant regarding this")
                        self.dataReceivedForAddOrder?(true)
                    }
                }
            }
        }
    }
    
    // Add comment to order
    func addCommentFirestoreAPI(viewController: UIViewController?, comment: String) {
        let commentObject = OrderComment.init(comment: comment)
        
        guard let orderReference = LocalRestaurant.order.orderReference else {
            dataReceivedForAddOrder?(false)
            return
        }
        guard let tableReference = LocalRestaurant.table.table?.reference else {
            dataReceivedForAddOrder?(false)
            return
        }
        guard let tableOriginalReference = LocalRestaurant.table.table?.originalReference else {
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

            transaction.updateData(["updated": Timestamp.init(), "comments": newComments, "status": TableStatus.ordered.rawValue], forDocument: orderReference)
            transaction.updateData(["status": TableStatus.ordered.rawValue], forDocument: tableReference)
            transaction.updateData(["status": TableStatus.ordered.rawValue], forDocument: tableOriginalReference)
            
            return nil
        }) { (object, error) in
            if error != nil {
                self.dataReceivedForAddOrder?(false)
            } else {
                if !self.addCommentReferenceToCoreData(orderComment: commentObject) {
                    if let viewController = viewController {
                        Catalog.alert(vc: viewController, title: "Error adding this comment locally", message: "This comment will not be saved as your comment but will still be sent to the restaurant on behalf of your table")
                    }
                }
                self.dataReceivedForAddOrder?(true)
            }
        }
    }
    
    // add order reference to coredata
    private func addDishReferenceToCoreData(order: Order) -> Bool {
        let delegate = UIApplication.shared.delegate as? AppDelegate
        if let context = delegate?.persistentContainer.viewContext {
            for dish in order.dishes {
                let coreDataDishReference = NSEntityDescription.insertNewObject(forEntityName: "CoreDataDishReference", into: context) as! CoreDataDishReference
                
                coreDataDishReference.reference = dish.reference
                coreDataDishReference.created = dish.created.dateValue()
            }
            do {
                try context.save()
            } catch {
                return false
            }
        }
        
        return true
    }
    
    // add comment reference to coredata
    private func addCommentReferenceToCoreData(orderComment: OrderComment) -> Bool {
        let delegate = UIApplication.shared.delegate as? AppDelegate
        if let context = delegate?.persistentContainer.viewContext {
            let coreDataCommentReference = NSEntityDescription.insertNewObject(forEntityName: "CoreDataCommentReference", into: context) as! CoreDataCommentReference
            
            coreDataCommentReference.reference = orderComment.reference
            coreDataCommentReference.created = orderComment.created.dateValue()
            
            do {
                try context.save()
            } catch {
                return false
            }
        }
        
        return true
    }
}
