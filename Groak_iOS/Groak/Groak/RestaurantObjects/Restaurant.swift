//
//  Restaurant.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Restaurant class used to refer to a restaurant

internal class Restaurant {
    var restaurantName: String
    var restaurantType: [String]
    var restaurantLatitude: Double
    var restaurantLongitude: Double
    
    init() {
        restaurantName = ""
        restaurantType = []
        restaurantLatitude = 0
        restaurantLongitude = 0
    }
    
    init(restaurant: [String: Any]) {
        restaurantName = restaurant["name"] as? String ?? ""
        restaurantType = restaurant["type"] as? [String] ?? []
        restaurantLatitude = (restaurant["address"] as? [String: Any] ?? [:])["latitude"] as? Double ?? -1000
        restaurantLongitude = (restaurant["address"] as? [String: Any] ?? [:])["longitude"] as? Double ?? -1000
    }
    
    func success() -> Bool {
        if (restaurantName.count == 0) {
            return false;
        } else if (restaurantLatitude == -1000) {
            return false;
        } else if (restaurantLongitude == -1000) {
            return false;
        }
        return true;
    }
    
    var description : String {
        var str = "Restaurant Name: \(restaurantName)\n"
        str += "Restaurant Type: \(restaurantType)\n"
        str += "Restaurant Latitude: \(restaurantLatitude)\n"
        str += "Restaurant Longitude: \(restaurantLongitude)"
        
        return str;
    }
}
