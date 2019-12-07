//
//  LocalStorage.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import Firebase

internal class LocalStorage {
    
    struct restaurant {
        static let name: String = "The Yellow Chilli"
        static let reference: DocumentReference? = Firebase.db.collection("/restaurants").document("361mKaKkOCW73UYueUs6eSHhOC92")
    }
    
    struct table {
        static let name: String = "Demo Table 1"
        static let reference: DocumentReference? = restaurant.reference?.collection("/tables").document("qgu4upijbrocvlypj53jq")
    }
    
    struct order {
        static let orderReference: DocumentReference? = restaurant.reference?.collection("/orders").document("qgu4upijbrocvlypj53jq")
    }
    
    struct requests {
        static let requestsReference: DocumentReference? = restaurant.reference?.collection("/requests").document("qgu4upijbrocvlypj53jq")
    }
    
    static var cart: Cart = Cart.init()
    
    static var tableOrder: Order = Order.init()
}
