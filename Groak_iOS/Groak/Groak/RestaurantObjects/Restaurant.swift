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
    var reference: DocumentReference?
    var name: String
    var type: [String]
    var logo: String
    var latitude: Double
    var longitude: Double
    
    init() {
        reference = nil
        name = ""
        type = []
        logo = ""
        latitude = 0
        longitude = 0
    }
    
    init(_ temp: String) {
        let db = Firebase.db;
        
        reference = db.collection("/restaurants").document("nlPL7XcUGbgIAVCQZhpZ")
        name = "The Yellow Chilli"
        type = []
        logo = ""
        latitude = 0
        longitude = 0
    }
    
    init(restaurant: [String: Any]) {
        reference = restaurant["reference"] as? DocumentReference
        name = restaurant["name"] as? String ?? ""
        type = restaurant["type"] as? [String] ?? []
        logo = restaurant["logo"] as? String ?? ""
        latitude = (restaurant["address"] as? [String: Any] ?? [:])["latitude"] as? Double ?? -1000
        longitude = (restaurant["address"] as? [String: Any] ?? [:])["longitude"] as? Double ?? -1000
    }
    
    func success() -> Bool {
        if (reference == nil) {
            return false;
        } else if (name.count == 0) {
            return false;
        } else if (latitude == -1000) {
            return false;
        } else if (longitude == -1000) {
            return false;
        }
        return true;
    }
    
    var description : String {
        var str = "Restaurant Name: \(name)\n"
        str += "Restaurant Type: \(type)\n"
        str += "Restaurant Logo: \(logo)\n"
        str += "Restaurant Latitude: \(latitude)\n"
        str += "Restaurant Longitude: \(longitude)"
        
        return str;
    }
}
