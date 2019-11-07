//
//  FirestoreAPICallsRestaurants.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import Firebase

internal class FirestoreAPICallsRestaurants {
    private let db = Firebase.db;
    
    var dataReceivedForFetchRestaurant: ((_ restaurant: Restaurant?) -> ())?
    
    func fetchRestaurantFirestoreAPI(restaurantId: String) {
        if (!restaurantId.isAlphanumeric) {
            self.dataReceivedForFetchRestaurant?(nil)
            return;
        }
        db.collection("restaurants").document(restaurantId).getDocument{(document, error) in
            if let document = document, document.exists {
                let restaurant = Restaurant.init(restaurant: document.data() ?? [:])
                self.dataReceivedForFetchRestaurant?(restaurant)
            } else {
                self.dataReceivedForFetchRestaurant?(nil)
            }
        }
    }
    
    func fetchRestaurantFirestoreAPI(restaurantReference: DocumentReference) {
        restaurantReference.getDocument{(document, error) in
            if let document = document, document.exists {
                let restaurant = Restaurant.init(restaurant: document.data() ?? [:])
                self.dataReceivedForFetchRestaurant?(restaurant)
            } else {
                self.dataReceivedForFetchRestaurant?(nil)
            }
        }
    }
}
