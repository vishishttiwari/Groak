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
    var totalPrice: Double
    var quantity: Int
    var pricePerItem: Double
    var extras: [CartItemExtra]
    
    init() {
        dishName = ""
        totalPrice = 0
        quantity = 0
        pricePerItem = 0
        extras = []
    }
    
    init(dishName: String, pricePerItem: Double, quantity: Int, extras: [CartItemExtra]) {
        self.dishName = dishName
        self.totalPrice =  Catalog.calculateTotalPriceOfDish(pricePerItem: pricePerItem, quantity: quantity)
        self.quantity = quantity
        self.pricePerItem = pricePerItem
        self.extras = extras
    }
    
    func success() -> Bool {
        if (dishName.count == 0) {
            return false;
        }
        
        return true;
    }
    
    var description: String {
        var str = "Dish Name: \(dishName)\n"
        str += "Price: \(totalPrice)\n"
        str += "Quantity: \(quantity)\n"
        str += "Price Per Item: \(pricePerItem)\n"
        str += "Extras: \n"
        for extra in extras {
            str += "\tExtra: \(extra.description)"
        }
        
        return str;
    }
}

internal class CartItemExtra {
    var title: String
    var options: [CartItemsExtraOption]
    
    init() {
        title = ""
        options = []
    }
    
    init(title: String) {
        self.title = title
        options = []
    }
    
    func success() -> Bool {
        if (title.count == 0) {
            return false;
        }
        for option in options {
            if !option.success() {
                return false
            }
        }
        
        return true;
    }
    
    var description: String {
        var str = "Title: \(title)\n"
        for option in options {
            str += "\tExtra: \(option.description)"
        }
        
        return str;
    }
}

internal class CartItemsExtraOption {
    var title: String
    var price: Double
    var optionIndex: Int
    
    init() {
        title = ""
        price = 0
        optionIndex = -1
    }
    
    init(title: String, price: Double, optionIndex: Int) {
        self.title = title
        self.price = price
        self.optionIndex = optionIndex
    }
    
    init(dishExtraOption: DishExtraOption, optionIndex: Int) {
        self.title = dishExtraOption.title
        self.price = dishExtraOption.price
        self.optionIndex = optionIndex
    }
    
    func success() -> Bool {
        if (title.count == 0) {
            return false
        }
        if (optionIndex < 0) {
            return false
        }
        
        return true;
    }
    
    var description: String {
        var str = "Title: \(title)\n"
        str += "Price: \(price)\n"
        
        return str;
    }
}
