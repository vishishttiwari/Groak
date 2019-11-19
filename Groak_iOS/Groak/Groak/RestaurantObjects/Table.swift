//
//  Table.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Restaurant class used to refer to a restaurant

import Firebase

internal enum TableStatus {
    case available
    case seated
    case ordered
    case updated
    case requested
    case approved
    case served
    case payment
};

internal class Table {
    var name: String
    var reference: DocumentReference?
    var orderReference: DocumentReference?
    var restaurantReference: DocumentReference?
    var status: TableStatus
    
    init() {
        name = ""
        reference = nil
        orderReference = nil
        restaurantReference = nil
        status = TableStatus.available
    }
    
    init(table: [String: Any]) {
        name = table["name"] as? String ?? ""
        reference = table["originalReference"] as? DocumentReference
        orderReference = table["orderReference"] as? DocumentReference
        restaurantReference = table["restaurantReference"] as? DocumentReference
        status = table["status"] as? TableStatus ?? TableStatus.available
    }
    
    func success() -> Bool {
        if (name.count == 0) {
            return false;
        } else if (reference == nil) {
            return false;
        } else if (orderReference == nil) {
            return false;
        } else if (restaurantReference == nil) {
            return false;
        }
        return true;
    }
    
    var description : String {
        var str = "Table Name: \(name)\n"
        str += "Table Reference: \(reference?.documentID ?? "Table reference not present")\n"
        str += "Order Reference: \(orderReference?.documentID ?? "Order reference not present")\n"
        str += "Restaurant Reference: \(restaurantReference?.documentID ?? "Restaurant reference not present")\n"
        str += "Table Status: \(status)"
        
        return str;
    }
}


