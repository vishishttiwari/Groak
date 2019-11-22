//
//  Dish.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/18/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import Firebase

internal class Dish {
    var reference: DocumentReference?
    var name: String
    var imageLink: String
    var price: Double
    var shortInfo: String
    var dishDescription: String
    var ingredients: [String]
    var restaurantReference: DocumentReference?
    var available: Bool
    var restrictions: [String: String]
    var nutrition: [String: Double]
    var extras: [DishCategory]
    
    init() {
        reference = nil
        name = ""
        imageLink = ""
        price = -1
        shortInfo = ""
        dishDescription = ""
        ingredients = []
        restaurantReference = nil
        available = false
        restrictions = [:]
        nutrition = [:]
        extras = []
    }
    
    init(dish: [String: Any]) {
        reference = dish["reference"] as? DocumentReference
        name = dish["name"] as? String ?? ""
        imageLink = dish["image"] as? String ?? ""
        price = dish["price"] as? Double ?? -1
        shortInfo = dish["shortInfo"] as? String ?? ""
        dishDescription = dish["description"] as? String ?? ""
        ingredients = dish["ingredients"] as? [String] ?? []
        restaurantReference = dish["restaurantReference"] as? DocumentReference
        available = dish["available"] as? Bool ?? false
        restrictions = dish["restrictions"] as? [String: String] ?? [:]
        nutrition = dish["nutrition"] as? [String: Double] ?? [:]
        let tempExtras = dish["extras"] as? [[String:Any]] ?? []
        extras = []
        for extra in tempExtras {
            extras.append(DishCategory.init(dishCategory: extra))
        }
    }
    
    func success() -> Bool {
        if (reference == nil) {
            return false;
        } else if (price < 0) {
            return false;
        } else if (name.count == 0) {
            return false;
        } else if (restaurantReference == nil) {
            return false;
        }
        
        return true;
    }
    
    var description: String {
        var str = "Dish Name: \(name)\n"
        str += "Dish Image Link: \(imageLink)\n"
        str += "Price: \(price)\n"
        str += "Short Info: \(shortInfo)\n"
        str += "Description: \(dishDescription)\n"
        str += "Ingredients:\n"
        for ingredient in ingredients {
            str += "\t\(ingredient)\n"
        }
        str += "Available: \(available)\n"
        str += "Restrictions:\n"
        for (restriction, isit) in restrictions {
            str += "\t\(restriction): \(isit)\n"
        }
        str += "Nutrition:\n"
        for (nut, value) in nutrition {
            str += "\t\(nut): \(value)\n"
        }
        str += "Extras:\n"
        for extra in extras {
            str += "\t\(extra.description):\n"
        }
        return str;
    }
}
