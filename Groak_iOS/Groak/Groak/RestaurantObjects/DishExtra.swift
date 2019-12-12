//
//  DishExtra.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/21/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import Firebase

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
