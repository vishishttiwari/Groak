//
//  Restaurant.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Restaurant class used to refer to a restaurant

import UIKit
import Firebase

internal class Restaurant {
    var restaurantReference: DocumentReference?
    var restaurantName: String
    var restaurantType: [String]
    var restaurantLogo: String
    var restaurantLatitude: Double
    var restaurantLongitude: Double
    
    init() {
        restaurantReference = nil
        restaurantName = ""
        restaurantType = []
        restaurantLogo = ""
        restaurantLatitude = 0
        restaurantLongitude = 0
    }
    
    init(restaurant: [String: Any]) {
        restaurantReference = restaurant["reference"] as? DocumentReference
        restaurantName = restaurant["name"] as? String ?? ""
        restaurantType = restaurant["type"] as? [String] ?? []
        restaurantLogo = restaurant["logo"] as? String ?? ""
        restaurantLatitude = (restaurant["address"] as? [String: Any] ?? [:])["latitude"] as? Double ?? -1000
        restaurantLongitude = (restaurant["address"] as? [String: Any] ?? [:])["longitude"] as? Double ?? -1000
    }
    
    func success() -> Bool {
        if (restaurantReference == nil) {
            return false;
        } else if (restaurantName.count == 0) {
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
        str += "Restaurant Logo: \(restaurantLogo)\n"
        str += "Restaurant Latitude: \(restaurantLatitude)\n"
        str += "Restaurant Longitude: \(restaurantLongitude)"
        
        return str;
    }
}
