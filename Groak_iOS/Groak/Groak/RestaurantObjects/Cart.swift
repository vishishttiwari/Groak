//
//  Cart.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This file has classes for cart, dishes in cart, extra and options of dishes

import Foundation
import Firebase

internal class Cart {
    var dishes: [CartDish] = []
    var comment: String = ""
    
    init() {
    }
    
    init(dishes: [CartDish], comment: String) {
        self.dishes = dishes
        self.comment = comment
    }
    
    init(newDishes: [CartDish], newComment: String) {
        self.dishes.append(contentsOf: newDishes)
        self.comment = newComment
    }
    
    init(newDishes: [CartDish]) {
        self.dishes.append(contentsOf: newDishes)
    }
    
    init(newComment: String) {
        self.comment = newComment
    }
    
    init(dish: CartDish) {
        dishes.append(dish)
    }
    
    func delete() {
        dishes = []
        comment = ""
    }
    
    func success() -> Bool {
        for dish in dishes {
            if !dish.success() {
                return false
            }
        }
        if comment.count == 0 {
            return false
        }
        
        return true
    }
    
    var description: String {
        var str = "Dishes: \n"
        for dish in dishes {
            str += "\t\(dish.description)\n"
        }
        str += "Comment: \(comment)\n"
        
        return str
    }
    
    var exists: Bool {
        if dishes.count > 0 {
            return true
        }
        return false
    }
}

internal class CartDish {
    var name: String
    var dishReference: DocumentReference?
    var price: Double
    var quantity: Int
    var pricePerItem: Double
    var extras: [CartDishExtra]
    
    init() {
        name = ""
        dishReference = nil
        price = -1
        quantity = -1
        pricePerItem = -1
        extras = []
    }
    
    init(cartDish: CartDish) {
        self.name = cartDish.name
        self.dishReference = cartDish.dishReference
        self.price = cartDish.price
        self.quantity = cartDish.quantity
        self.pricePerItem = cartDish.pricePerItem
        self.extras = []
        for extra in cartDish.extras {
            self.extras.append(CartDishExtra.init(cartDishExtra: extra))
        }
    }
    
    init(dishName: String, dishReference: DocumentReference?, pricePerItem: Double, quantity: Int, extras: [CartDishExtra]) {
        self.name = dishName
        self.dishReference = dishReference
        self.price =  Catalog.calculateTotalPriceOfDish(pricePerItem: pricePerItem, quantity: quantity)
        self.quantity = quantity
        self.pricePerItem = pricePerItem
        self.extras = []
        for extra in extras {
            self.extras.append(CartDishExtra.init(cartDishExtra: extra))
        }
    }
    
    func success() -> Bool {
        if (name.count == 0) {
            return false;
        }
        if (price < 0) {
            return false;
        }
        if (quantity < 0) {
            return false;
        }
        if (pricePerItem < 0) {
            return false;
        }
        
        return true;
    }
    
    var description: String {
        var str = "Dish Name: \(name)\n"
        str += "Price: \(price)\n"
        str += "Quantity: \(quantity)\n"
        str += "Price Per Item: \(pricePerItem)\n"
        str += "Extras: \n"
        for extra in extras {
            str += "\tExtra: \(extra.description)"
        }
        
        return str;
    }
}

internal class CartDishExtra {
    var title: String
    var options: [CartDishExtraOption]
    
    init() {
        title = ""
        options = []
    }
    
    init(cartDishExtra: CartDishExtra) {
        self.title = cartDishExtra.title
        self.options = []
        for option in cartDishExtra.options {
            self.options.append(CartDishExtraOption.init(cartDishExtraOption: option))
        }
    }
    
    init(title: String) {
        self.title = title
        options = []
    }
    
    init(title: String, options: [CartDishExtraOption]) {
        self.title = title
        self.options = []
        for option in options {
            self.options.append(CartDishExtraOption.init(cartDishExtraOption: option))
        }
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

internal class CartDishExtraOption {
    var title: String
    var price: Double
    var optionIndex: Int
    
    init() {
        title = ""
        price = -1
        optionIndex = -1
    }
    
    init(cartDishExtraOption: CartDishExtraOption) {
        self.title = cartDishExtraOption.title
        self.price = cartDishExtraOption.price
        self.optionIndex = cartDishExtraOption.optionIndex
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
        if (price < 0) {
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
