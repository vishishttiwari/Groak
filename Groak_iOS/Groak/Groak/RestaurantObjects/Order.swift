//
//  Order.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This file has classes for order, dishes in order, extra and options of dishes and order comments

import Foundation
import Firebase

internal class Order {
    var reference: DocumentReference?
    var comments: [OrderComment]
    var dishes: [OrderDish]
    var items: Int
    var restaurantReference: DocumentReference?
    var tableName: String
    var tableReference: DocumentReference?
    var requestReference: DocumentReference?
    var updated: Timestamp
    var status: TableStatus
    var newRequest: Bool
    var serveTime: Timestamp
    
    init() {
        reference = nil
        comments = []
        dishes = []
        items = -1
        restaurantReference = nil
        tableName = ""
        tableReference = nil
        requestReference = nil
        updated = Timestamp.init()
        status = TableStatus.available
        newRequest = false
        serveTime = Timestamp.init()
    }
    
    init(order: [String: Any]) {
        reference = order["reference"] as? DocumentReference
        comments = []
        let tempComments = order["comments"] as? [[String: Any]] ?? []
        for tempComment in tempComments {
            comments.append(OrderComment.init(orderComment: tempComment))
        }
        dishes = []
        let tempDishes = order["dishes"] as? [[String: Any]] ?? []
        for tempDish in tempDishes {
            dishes.append(OrderDish.init(orderDish: tempDish))
        }
        items = order["items"] as? Int ?? -1
        restaurantReference = order["restaurantReference"] as? DocumentReference
        requestReference = order["requestReference"] as? DocumentReference
        tableName = order["tableName"] as? String ?? ""
        tableReference = order["tableReference"] as? DocumentReference
        updated = order["updated"] as? Timestamp ?? Timestamp.init()
        status = (order["status"] as? String).map { (TableStatus(rawValue: $0) ?? TableStatus.available) } ?? TableStatus.available
        newRequest = order["newRequest"] as? Bool ?? false
        serveTime = order["serveTime"] as? Timestamp ?? Timestamp.init()
    }
    
    init(cart: Cart) {
        reference = nil
        restaurantReference = nil
        tableName = ""
        tableReference = nil
        updated = Timestamp.init()
        status = TableStatus.ordered
        newRequest = false
        serveTime = Timestamp.init()
        
        comments = []
        if (cart.comment.count > 0) {
            comments.append(OrderComment.init(comment: cart.comment))
        }
        dishes = []
        for dish in cart.dishes {
            dishes.append(OrderDish.init(cartDish: dish))
        }
        items = cart.dishes.count
    }
    
    func success() -> Bool {
        if items < 0 {
            return false
        }
        for comment in comments {
            if !comment.success() {
                return false
            }
        }
        for dish in dishes {
            if !dish.success() {
                return false
            }
        }
        
        return true;
    }
    
    var description: String {
        var str = "Order Reference: \(reference?.documentID ?? "Order reference not present")\n"
        str += "Comments:\n"
        for comment in comments {
            str += "\t\(comment.description)\n"
        }
        str += "Dishes:\n"
        for dish in dishes {
            str += "\t\(dish.description)\n"
        }
        str += "Items: \(items)\n"
        str += "Serve Time: \(serveTime)\n"
        str += "Restaurant Reference: \(restaurantReference?.documentID ?? "Restaurant reference not present")\n"
        str += "Table Name: \(tableName)\n"
        str += "Table Reference: \(tableReference?.documentID ?? "Table reference not present")\n"
        str += "Updated: \(updated)\n"
        str += "Status: \(status)\n"
        
        return str;
    }
    
    var exists: Bool {
        if status == TableStatus.ordered || status == TableStatus.served || status == TableStatus.approved || status == TableStatus.payment {
            return true
        }
        return false
    }
}

internal class OrderComment {
    var reference: String?
    var comment: String
    var created: Timestamp
    var local: Bool
    
    init() {
        reference = nil
        comment = ""
        created = Timestamp.init()
        local = false
    }
    
    init(orderComment: [String: Any]) {
        reference = orderComment["reference"] as? String
        comment = orderComment["comment"] as? String ?? ""
        created = orderComment["created"] as? Timestamp ?? Timestamp.init()
        local = false
    }
    
    init(comment: String) {
        self.reference = UUID().uuidString
        self.comment = comment
        self.created = Timestamp.init()
        local = false
    }
    
    func equals(coreDataCommentReference: CoreDataCommentReference) -> Bool {
        if self.reference != coreDataCommentReference.reference {
            return false
        }
        
        return true
    }
    
    func success() -> Bool {
        guard let reference = self.reference else {
            return false;
        }
        if (reference.count == 0) {
            return false
        }
        if (comment.count == 0) {
            return false
        }
        
        return true;
    }
    
    var description: String {
        var str = "Comment: \(comment)\n"
        str += "Reference: \(reference ?? "")"
        str += "Created: \(created)\n"

        return str;
    }
    
    var dictionary: [String: Any] {
        var dict: [String: Any] = [:]
        dict["reference"] = reference
        dict["comment"] = comment
        dict["created"] = created
        
        return dict
    }
}

internal class OrderDish {
    var reference: String?
    var name: String
    var dishReference: DocumentReference?
    var price: Double
    var quantity: Int
    var extras: [OrderDishExtra]
    var created: Timestamp
    var local: Bool
    
    init() {
        reference = nil
        name = ""
        dishReference = nil
        price = -1
        quantity = -1
        extras = []
        created = Timestamp.init()
        local = false
    }
    
    init(orderDish: [String: Any]) {
        reference = orderDish["reference"] as? String
        name = orderDish["name"] as? String ?? ""
        dishReference = orderDish["reference"] as? DocumentReference
        price = orderDish["price"] as? Double ?? -1
        quantity = orderDish["quantity"] as? Int ?? -1
        let tempExtras = orderDish["extras"] as? [[String: Any]] ?? []
        extras = []
        for tempExtra in tempExtras {
            extras.append(OrderDishExtra.init(orderDishExtra: tempExtra))
        }
        created = orderDish["created"] as? Timestamp ?? Timestamp.init()
        local = false
    }
    
    init(cartDish: CartDish) {
        self.reference = UUID().uuidString
        self.name = cartDish.name
        self.dishReference = cartDish.dishReference
        self.price = cartDish.price
        self.quantity = cartDish.quantity
        self.extras = []
        for extra in cartDish.extras {
            self.extras.append(OrderDishExtra.init(cartDishExtra: extra))
        }
        created = Timestamp.init()
        local = false
    }
    
    func equals(coreDataDishReference: CoreDataDishReference) -> Bool {
        if self.reference != coreDataDishReference.reference {
            return false
        }
        
        return true
    }
    
    func success() -> Bool {
        guard let reference = self.reference else {
            return false;
        }
        if (reference.count == 0) {
            return false
        }
        if (name.count == 0) {
            return false
        }
        if (price < 0) {
            return false
        }
        for extra in extras {
            if !extra.success() {
                return false
            }
        }
        
        return true;
    }
    
    var description: String {
        var str = "Name: \(name)\n"
        str +=  "Reference: \(reference ?? "")"
        str += "Dish Reference: \(dishReference?.documentID ?? "Dish reference not present")\n"
        str += "Price: \(price)\n"
        str += "Quantity: \(quantity)\n"
        str += "Created: \(created)\n"
        str += "Local: \(local)\n"
        str += "Extras:\n"
        for extra in extras {
            str += "\t\(extra.description)\n"
        }

        return str;
    }
    
    var dictionary: [String: Any] {
        var dict: [String: Any] = [:]
        dict["name"] = name
        dict["reference"] = reference
        dict["dishReference"] = dishReference
        dict["price"] = price
        dict["quantity"] = quantity
        
        var extrasDict: [[String: Any]] = []
        for extra in extras {
            extrasDict.append(extra.dictionary)
        }
        dict["extras"] = extrasDict
        dict["created"] = created
        
        return dict
    }
}

internal class OrderDishExtra {
    var title: String
    var options: [OrderDishExtraOption]
    
    init() {
        title = ""
        options = []
    }
    
    init(orderDishExtra: [String: Any]) {
        title = orderDishExtra["title"] as? String ?? ""
        let tempOptions = orderDishExtra["options"] as? [[String: Any]] ?? []
        options = []
        for tempOption in tempOptions {
            options.append(OrderDishExtraOption.init(orderDishExtraOption: tempOption))
        }
    }
    
    init(cartDishExtra: CartDishExtra) {
        title = cartDishExtra.title
        options = []
        for option in cartDishExtra.options {
            options.append(OrderDishExtraOption.init(cartDishExtraOption: option))
        }
    }
    
    func success() -> Bool {
        if (title.count == 0) {
            return false
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
        str += "Options:\n"
        for option in options {
            str += "\t\(option.description)\n"
        }

        return str;
    }
    
    var dictionary: [String: Any] {
        var dict: [String: Any] = [:]
        dict["title"] = title
        
        var optionsDict: [[String: Any]] = []
        for option in options {
            optionsDict.append(option.dictionary)
        }
        dict["options"] = optionsDict
        
        return dict
    }
}

internal class OrderDishExtraOption {
    var title: String
    var price: Double
    
    init() {
        title = ""
        price = -1
    }
    
    init(orderDishExtraOption: [String: Any]) {
        title = orderDishExtraOption["title"] as? String ?? ""
        price = orderDishExtraOption["price"] as? Double ?? -1
    }
    
    init(cartDishExtraOption: CartDishExtraOption) {
        title = cartDishExtraOption.title
        price = cartDishExtraOption.price
    }
    
    func success() -> Bool {
        if (title.count == 0) {
            return false
        }
        if (price < 0) {
            return false
        }
        
        return true;
    }
    
    var description: String {
        var str = "Title: \(title)\n"
        str += "Price: \(price)\n"

        return str;
    }
    
    var dictionary: [String: Any] {
        var dict: [String: Any] = [:]
        dict["title"] = title
        dict["price"] = price
        
        return dict
    }
}
