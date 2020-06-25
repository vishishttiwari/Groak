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
    var salesTax: Double
    var address: [String: Any]
    var latitude: Double
    var longitude: Double
    var maximumOccupancy: Int
    var currentOccupancy: Int
    var occupancy: [String: Int]
    var covidGuidelines: String
    var covidMessage: String
    
    init() {
        reference = nil
        name = ""
        type = []
        logo = ""
        salesTax = -1
        address = [:]
        latitude = -1000
        longitude = -1000
        maximumOccupancy = 10
        currentOccupancy = 0
        occupancy = [:]
        covidGuidelines = ""
        covidMessage = ""
    }
    
    init(_ temp: String) {
        let db = Firebase.db;
        
        reference = db.collection("/restaurants").document("361mKaKkOCW73UYueUs6eSHhOC92")
        name = "The Yellow Chilli"
        type = []
        logo = ""
        salesTax = -1
        address = [:]
        latitude = -1000
        longitude = -1000
        maximumOccupancy = 10
        currentOccupancy = 0
        occupancy = [:]
        covidGuidelines = ""
        covidMessage = ""
    }
    
    init(restaurant: [String: Any]) {
        reference = restaurant["reference"] as? DocumentReference
        name = restaurant["name"] as? String ?? ""
        type = restaurant["type"] as? [String] ?? []
        logo = restaurant["logo"] as? String ?? ""
        salesTax = restaurant["salesTax"] as? Double ?? -1
        address = restaurant["address"] as? [String: Any] ?? [:]
        latitude = (restaurant["address"] as? [String: Any] ?? [:])["latitude"] as? Double ?? -1000
        longitude = (restaurant["address"] as? [String: Any] ?? [:])["longitude"] as? Double ?? -1000
        maximumOccupancy = restaurant["maximumOccupancy"] as? Int ?? 10
        currentOccupancy = restaurant["currentOccupancy"] as? Int ?? 0
        occupancy = restaurant["occupancy"] as? [String: Int] ?? [:]
        covidGuidelines = restaurant["covidGuidelines"] as? String ?? ""
        covidMessage = restaurant["covidMessage"] as? String ?? ""
    }
    
    func success() -> Bool {
        if (reference == nil) {
            return false;
        } else if (name.count == 0) {
            return false;
        }  else if (salesTax < 0) {
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
