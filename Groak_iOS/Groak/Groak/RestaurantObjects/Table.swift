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
    var tableName: String
    var tableReference: DocumentReference?
    var orderReference: DocumentReference?
    var restaurantReference: DocumentReference?
    var tableStatus: TableStatus
    
    init() {
        tableName = ""
        tableReference = nil
        orderReference = nil
        restaurantReference = nil
        tableStatus = TableStatus.available
    }
    
    init(table: [String: Any]) {
        tableName = table["name"] as? String ?? ""
        tableReference = table["originalReference"] as? DocumentReference
        orderReference = table["orderReference"] as? DocumentReference
        restaurantReference = table["restaurantReference"] as? DocumentReference
        tableStatus = table["status"] as? TableStatus ?? TableStatus.available
    }
    
    func success() -> Bool {
        if (tableName.count == 0) {
            return false;
        } else if (tableReference == nil) {
            return false;
        } else if (orderReference == nil) {
            return false;
        } else if (restaurantReference == nil) {
            return false;
        }
        return true;
    }
    
    var description : String {
        var str = "Table Name: \(tableName)\n"
        str += "Table Reference: \(tableReference?.documentID ?? "Table reference not present")\n"
        str += "Order Reference: \(orderReference?.documentID ?? "Order reference not present")\n"
        str += "Restaurant Reference: \(restaurantReference?.documentID ?? "Restaurant reference not present")\n"
        str += "Table Status: \(tableStatus)"
        
        return str;
    }
}


