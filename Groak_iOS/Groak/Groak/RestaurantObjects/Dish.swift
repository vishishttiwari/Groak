//
//  Dish.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/18/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This file contains classes for dish, dish extra and dish extra options

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
    var extras: [DishExtra]
    
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
            extras.append(DishExtra.init(dishExtra: extra))
        }
    }
    
    func restrictionsExist() -> Bool {
        if restrictions.count == 0 {
            return false
        }
        for (_, isit) in restrictions {
            if isit != "Not Sure" {
                return true
            }
        }
        return false
    }
    
    func nutritionExist() -> Bool {
        if nutrition.count == 0 {
            return false
        }
        for (_, value) in nutrition {
            if value > 0 {
                return true
            }
        }
        return false
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

internal class DishExtra {
    var title: String
    var multipleSelections: Bool
    var minOptionsSelect: Int
    var maxOptionsSelect: Int
    var options: [DishExtraOption]
    
    init(dishExtra: [String: Any]) {
        title = dishExtra["title"] as? String ?? ""
        multipleSelections = dishExtra["multipleSelections"] as? Bool ?? true
        minOptionsSelect = dishExtra["minOptionsSelect"] as? Int ?? -1
        maxOptionsSelect = dishExtra["maxOptionsSelect"] as? Int ?? -1
        let tempOptions = dishExtra["options"] as? [[String:Any]] ?? []
        options = []
        for option in tempOptions {
            options.append(DishExtraOption.init(dishExtraOption: option))
        }
    }
    
    init(cartDishExtra: CartDishExtra) {
        self.title = cartDishExtra.title
        self.options = []
        for option in cartDishExtra.options {
            self.options.append(DishExtraOption.init(title: option.title, price: option.price))
        }
        multipleSelections = true
        minOptionsSelect = -1
        maxOptionsSelect = -1
    }
    
    init(orderDishExtra: OrderDishExtra) {
        self.title = orderDishExtra.title
        self.options = []
        for option in orderDishExtra.options {
            self.options.append(DishExtraOption.init(title: option.title, price: option.price))
        }
        multipleSelections = true
        minOptionsSelect = -1
        maxOptionsSelect = -1
    }
    
    func success() -> Bool {
        if (title.count == 0) {
            return false;
        } else if (minOptionsSelect == -1) {
            return false;
        } else if (maxOptionsSelect == -1) {
            return false;
        }
        
        return true;
    }
    
    var description : String {
        var str = "Dish Extra Name: \(title)\n"
        str += "Dish Extra Multiple Selections : \(multipleSelections)\n"
        str += "Dish Extra Min Options Select: \(minOptionsSelect)\n"
        str += "Dish Extra Max Options Select: \(maxOptionsSelect)\n"
        str += "Dish Extra Options: \(options)\n"
        str += "Dish Extra Options :\n"
        for option in options {
            str += "\t\(option.description)\n"
        }
        
        return str;
    }
}

internal class DishExtraOption {
    var title: String
    var price: Double
    
    init(dishExtraOption: [String: Any]) {
        title = dishExtraOption["title"] as? String ?? ""
        price = dishExtraOption["price"] as? Double ?? -1
    }
    
    init(title: String, price: Double) {
        self.title = title
        self.price = price
    }
    
    func success() -> Bool {
        if (title.count == 0) {
            return false;
        } else if (price < 0) {
            return false;
        }
        
        return true;
    }
    
    var description : String {
        var str = "Dish Extra Option Title: \(title)\n"
        str += "Dish Extra Option Price: \(price)"
        
        return str;
    }
}
