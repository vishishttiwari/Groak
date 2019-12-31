//
//  RestaurantCategories.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/18/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import Firebase

internal class MenuCategory {
    // Optional Closures
    var categoryLoaded: (() -> ())?
    
    var reference: DocumentReference?
    var name: String
    var dishes: [Dish]
    var dishesReference: [DocumentReference]
    var daysAvailable: [String]
    var startTime: Int
    var endTime: Int
    var available: Bool
    
    init() {
        reference = nil
        name = ""
        dishes = []
        dishesReference = []
        daysAvailable = []
        startTime = -1
        endTime = -1
        available = false
    }
    
    init(menuCategory: [String: Any], downloadDishes: Bool = true) {
        reference = menuCategory["reference"] as? DocumentReference
        name = menuCategory["name"] as? String ?? ""
        dishes = []
        dishesReference = menuCategory["dishes"] as? [DocumentReference] ?? []
        daysAvailable = menuCategory["days"] as? [String] ?? []
        startTime = menuCategory["startTime"] as? Int ?? -1
        endTime = menuCategory["endTime"] as? Int ?? -1
        available = menuCategory["available"] as? Bool ?? false
        
        if downloadDishes {
            var downloaded = 0
            for dishReference in dishesReference {
                dishReference.getDocument{(document, error) in
                    if let document = document, document.exists {
                        let dish = Dish.init(dish: document.data() ?? [:])
                        self.dishes.append(dish)
                        downloaded += 1
                        if (downloaded == self.dishesReference.count) {
                            self.categoryLoaded?()
                        }
                    }
                }
            }
        }
    }
    
    func downloadDishes() {
        var downloaded = 0
        for dishReference in dishesReference {
            dishReference.getDocument{(document, error) in
                if let document = document, document.exists {
                    let dish = Dish.init(dish: document.data() ?? [:])
                    self.dishes.append(dish)
                    downloaded += 1
                    if (downloaded == self.dishesReference.count) {
                        self.categoryLoaded?()
                    }
                }
            }
        }
    }
    
    func checkIfCategoryIsAvailable(day: String, minutes: Int) -> Bool {
        if !success() {
            return false;
        } else if !daysAvailable.contains(day) {
            return false;
        } else if startTime > minutes {
            return false;
        } else if endTime < minutes {
            return false;
        }
        return available;
    }
    
    func success() -> Bool {
        if (reference == nil) {
            return false;
        } else if (name.count == 0) {
            return false;
        } else if (startTime == -1) {
            return false;
        } else if (endTime == -1) {
            return false;
        }
        
        return true;
    }
    
    var description : String {
        var str = "Restaurant Category Name: \(name)\n"
        str += "Restaurant Category Dishes :\n"
        for dish in dishes {
            str += "\t\(dish.description)\n"
        }
        str += "Restaurant Category Days Available:\n"
        for day in daysAvailable {
            str += "\t\(day)\n"
        }
        str += "Restaurant Category Start Time: \(startTime)\n"
        str += "Restaurant Category End Time: \(endTime)\n"
        str += "Restaurant Category Available: \(available)\n"
        
        return str;
    }
}
