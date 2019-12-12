//
//  LocalRestaurant.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import Firebase

internal class LocalRestaurant {
    
    static var fsOrders: FirestoreAPICallsOrders?
    static var fsRequests: FirestoreAPICallsRequests?
    
    static func leaveRestaurant() {
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
        
        let alert = UIAlertController(title: "Scan QR code again", message: "Please scan your QR code again to order", preferredStyle: .alert)
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
}
