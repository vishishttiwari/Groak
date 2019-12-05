//
//  CartItem.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation

internal class CartItem {
    var dishName: String
    var totalCost: Double
    var quantity: Int
    var costPerItem: Double
    var options: [String: [String]]
    
    init() {
        dishName = ""
        totalCost = 0
        quantity = 0
        costPerItem = 0
        options = [:]
    }
    
    init(dishName: String, costPerItem: Double, quantity: Int, options: [String: [String]]) {
        self.dishName = dishName
        self.totalCost =  round(Double(quantity) * costPerItem * 100)/100
        self.quantity = quantity
        self.costPerItem = costPerItem
        self.options = options
    }
    
    func success() -> Bool {
        if (dishName.count == 0) {
            return false;
        }
        
        return true;
    }
    
    var description: String {
        var str = "Dish Name: \(dishName)\n"
        str += "Cost: \(totalCost)\n"
        str += "Quantity: \(quantity)\n"
        str += "Cost Per Item: \(costPerItem)\n"
        str += "Options: \n"
        for (option, rows) in options {
            str += "\tOption: \(option)"
            for row in rows {
                str += "\t\t\(row)"
            }
        }
        
        return str;
    }
}
