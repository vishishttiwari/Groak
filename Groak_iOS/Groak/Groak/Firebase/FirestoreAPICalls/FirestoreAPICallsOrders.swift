//
//  FirestoreAPICallsOrders.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/5/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import Firebase

internal class FirestoreAPICallsOrders {
    private let db = Firebase.db;
    
    var dataReceivedForFetchOrder: ((_ order: Order?) -> ())?
    var dataReceivedForAddOrder: ((_ success: Bool) -> ())?
    
    // Fetch all order info from orderId
    func fetchOrderFirestoreAPI() {
        
        LocalStorage.order.orderReference?.addSnapshotListener { documentSnapshot, error in
            guard let document = documentSnapshot else {
                self.dataReceivedForFetchOrder?(nil)
                return
            }
            let requests = Order.init(order: document.data() ?? [:])
            self.dataReceivedForFetchOrder?(requests)
        }
    }
    
    func addOrdersFirestoreAPI() {
        let order = Order.init(cart: LocalStorage.cart)
        
        if !order.success() {
            dataReceivedForAddOrder?(false)
            return
        }
        
        guard let orderReference = LocalStorage.order.orderReference else {
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
            
            
            savedOrder.comments.append(contentsOf: order.comments)
            savedOrder.dishes.append(contentsOf: order.dishes)

            transaction.updateData(["comments": newComments, "dishes": newDishes, "status": TableStatus.ordered.rawValue, "updated": Timestamp.init(), "items": savedOrder.items + order.items], forDocument: orderReference)
            
            return nil
        }) { (object, error) in
            if error != nil {
                self.dataReceivedForAddOrder?(false)
            } else {
                self.dataReceivedForAddOrder?(true)
            }
        }
    }
}
