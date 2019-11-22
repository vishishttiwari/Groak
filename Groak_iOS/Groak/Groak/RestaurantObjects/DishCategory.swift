//
//  DishCategory.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/21/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import Firebase

internal class DishCategory {
    var title: String
    var multipleSelections: Bool
    var minOptionsSelect: Int
    var maxOptionsSelect: Int
    var options: [DishCategoryOption]
    
    init(dishCategory: [String: Any]) {
        title = dishCategory["title"] as? String ?? ""
        multipleSelections = dishCategory["multipleSelections"] as? Bool ?? true
        minOptionsSelect = dishCategory["minOptionsSelect"] as? Int ?? -1
        maxOptionsSelect = dishCategory["maxOptionsSelect"] as? Int ?? -1
        let tempOptions = dishCategory["options"] as? [[String:Any]] ?? []
        options = []
        for option in tempOptions {
            options.append(DishCategoryOption.init(dishCategoryOption: option))
        }
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
        var str = "Dish Category Name: \(title)\n"
        str += "Dish Category Multiple Selections : \(multipleSelections)\n"
        str += "Dish Category Min Options Select: \(minOptionsSelect)\n"
        str += "Dish Category Max Options Select: \(maxOptionsSelect)\n"
        str += "Dish Category Options: \(options)\n"
        str += "Dish Category Options :\n"
        for option in options {
            str += "\t\(option.description)\n"
        }
        
        return str;
    }
}

internal class DishCategoryOption {
    var title: String
    var price: Double
    
    init(dishCategoryOption: [String: Any]) {
        title = dishCategoryOption["title"] as? String ?? ""
        price = dishCategoryOption["price"] as? Double ?? -1
    }
    
    func success() -> Bool {
        if (title.count == 0) {
            return false;
        } else if (price == -1) {
            return false;
        }
        
        return true;
    }
    
    var description : String {
        var str = "Dish Category Option Title: \(title)\n"
        str += "Dish Category Option Price: \(price)"
        
        return str;
    }
}
