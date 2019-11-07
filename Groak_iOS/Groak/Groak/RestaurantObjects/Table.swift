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
    var tableReference: DocumentReference
    var orderReference: DocumentReference
    var restaurantReference: DocumentReference
    var tableStatus: TableStatus
    
    init() {
        let db = Firebase.db;
        
        tableName = ""
        tableReference = db.collection("temp").document("temp")
        orderReference = db.collection("temp").document("temp")
        restaurantReference = db.collection("temp").document("temp")
        tableStatus = TableStatus.available
    }
    
    init(table: [String: Any]) {
        let db = Firebase.db;
        
        tableName = table["name"] as? String ?? ""
        tableReference = table["tableReference"] as? DocumentReference ?? db.collection("temp").document("temp")
        orderReference = table["orderReference"] as? DocumentReference ?? db.collection("temp").document("temp")
        restaurantReference = table["restaurantReference"] as? DocumentReference ?? db.collection("temp").document("temp")
        tableStatus = table["status"] as? TableStatus ?? TableStatus.available
    }
    
    func success() -> Bool {
        if (tableName.count == 0) {
            return false;
        } else if (tableReference.documentID == "temp") {
            return false;
        } else if (orderReference.documentID == "temp") {
            return false;
        } else if (restaurantReference.documentID == "temp") {
            return false;
        }
        return true;
    }
    
    var description : String {
        var str = "Table Name: \(tableName)\n"
        str += "Table Reference: \(tableReference.documentID)\n"
        str += "Order Reference: \(orderReference.documentID)\n"
        str += "Restaurant Reference: \(restaurantReference.documentID)\n"
        str += "Table Status: \(tableStatus)"
        
        return str;
    }
}


