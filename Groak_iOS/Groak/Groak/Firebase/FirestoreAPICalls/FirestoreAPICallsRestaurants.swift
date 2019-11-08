//
//  FirestoreAPICallsRestaurants.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
// Contains all API calls for fetching restaurant information

import Foundation
import Firebase
import CoreLocation

internal class FirestoreAPICallsRestaurants {
    private let db = Firebase.db;
    
    var dataReceivedForFetchRestaurant: ((_ restaurant: Restaurant?) -> ())?
    
    // Fetch all restaurant info from restaurantId
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
    
    // Fetch all restaurant info from restaurant reference
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
    
    // Fetch the closest restaurant to the user coordinate
    // TODO: This is not taking into consideration the longitude. Make sure you implement this later
    func fetchClosestRestaurantFirestoreAPI(currentLocation: CLLocationCoordinate2D) {
        let minGeoPoint = DistanceCatalog.getMinGeoPoint(currentLocation: currentLocation)
        let maxGeoPoint = DistanceCatalog.getMaxGeoPoint(currentLocation: currentLocation)
        
        let restaurantReferences = db.collection("/restaurants")
            .whereField("location", isGreaterThanOrEqualTo: minGeoPoint)
            .whereField("location", isLessThanOrEqualTo: maxGeoPoint)
        
        restaurantReferences.getDocuments() { (querySnapshot, err) in
            guard let snapshot = querySnapshot else {
                self.dataReceivedForFetchRestaurant?(nil)
                return;
            }
            
            if let _ = err {
                self.dataReceivedForFetchRestaurant?(nil)
            } else {
                if (snapshot.documents.count <= 0) {
                    self.dataReceivedForFetchRestaurant?(nil)
                } else {
                    let restaurant = Restaurant.init(restaurant: snapshot.documents[0].data())
                    self.dataReceivedForFetchRestaurant?(restaurant)
                }
            }
        }
    }
}
