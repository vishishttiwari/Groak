//
//  FirestoreAPICallsRestaurants.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Contains all API calls for fetching restaurant information

import Foundation
import Firebase
import CoreLocation

internal class FirestoreAPICallsRestaurants {
    private let db = Firebase.db;
    
    var dataReceivedForFetchRestaurant: ((_ restaurant: Restaurant?) -> ())?
    var dataReceivedForFetchRestaurants: ((_ restaurants: [Restaurant]?) -> ())?
    var dataReceivedForFetchRestaurantCategories: ((_ categories: [MenuCategory]) -> ())?
    
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
    func fetchClosestRestaurantFirestoreAPI(currentLocation: CLLocationCoordinate2D) {
        let minGeoPoint = DistanceCatalog.getMinGeoPoint(currentLocation: currentLocation)
        let maxGeoPoint = DistanceCatalog.getMaxGeoPoint(currentLocation: currentLocation)
        
        let restaurantReferences = db.collection("/restaurants")
            .whereField("location", isGreaterThanOrEqualTo: minGeoPoint)
            .whereField("location", isLessThanOrEqualTo: maxGeoPoint)
        
        restaurantReferences.getDocuments() { (querySnapshot, err) in
            guard let snapshot = querySnapshot else {
                self.dataReceivedForFetchRestaurants?(nil)
                return;
            }
            
            if let _ = err {
                self.dataReceivedForFetchRestaurants?(nil)
            } else {
                if (snapshot.documents.count <= 0) {
                    self.dataReceivedForFetchRestaurants?(nil)
                } else {
                    var restaurants: [Restaurant] = []
                    for document in snapshot.documents {
                        let restaurant = Restaurant.init(restaurant: document.data())
                        restaurants.append(restaurant)
                    }
                    
                    let closeRestaurants = DistanceCatalog.getRestaurantsNearCurrentLocation(restaurants: restaurants, minGeoPoint: minGeoPoint, maxGeoPoint: maxGeoPoint, currentUserLocation: CLLocation.init(latitude: currentLocation.latitude, longitude: currentLocation.longitude))
                    
                    self.dataReceivedForFetchRestaurants?(closeRestaurants)
                }
            }
        }
    }
    
    // Fetch all restaurant categories and see which one will be seen according to available, startime and end time.
    // Each of the category, also simultaneously downloads the dishes inside them. It uses dispatch group to see
    // when all the dishes in each category has been downloaded
    func fetchRestaurantCategoriesFirestoreAPI() {
        let day = TimeCatalog.getDay()
        let minutes = TimeCatalog.getTimeInMinutes()
        
        let categoryReferences = LocalRestaurant.restaurant.restaurant?.reference?.collection("/categories")
            .whereField("days", arrayContains: day)
            .whereField("startTime", isLessThanOrEqualTo: minutes)
        
        categoryReferences?.order(by: "startTime").order(by: "order").getDocuments() { (querySnapshot, err) in
            guard let snapshot = querySnapshot else {
                self.dataReceivedForFetchRestaurantCategories?([])
                return;
            }
            
            if let _ = err {
                self.dataReceivedForFetchRestaurantCategories?([])
                return
            }
            
            var categories: [MenuCategory] = []
            let dishesDownloadGroup = DispatchGroup()
            for document in snapshot.documents {
                let category = MenuCategory.init(menuCategory: document.data(), downloadDishes: false)
                if category.checkIfCategoryIsAvailable(day: day, minutes: minutes) {
                    dishesDownloadGroup.enter()
                    category.downloadDishesFunc()
                    categories.append(category)
                    category.categoryLoaded = { () -> () in
                        dishesDownloadGroup.leave()
                   }
                }
            }
            
            // This function is called when all the leaves of dishesDownloadGroup is called for all enters
            dishesDownloadGroup.notify(queue: .main) {
                self.dataReceivedForFetchRestaurantCategories?(categories)
            }
        }
    }
}
