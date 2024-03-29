//
//  Table.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Table class used to refer to a table

import Firebase

// Different table status of a table
internal enum TableStatus: String {
    case available
    case seated
    case ordered
    case approved
    case served
    case payment
};

internal class Table {
    var name: String
    var reference: DocumentReference?
    var originalReference: DocumentReference?
    var orderReference: DocumentReference?
    var requestReference: DocumentReference?
    var restaurantReference: DocumentReference?
    var status: TableStatus
    var newRequest: Bool
    var serveTime: Timestamp
    
    init() {
        name = ""
        reference = nil
        orderReference = nil
        originalReference = nil
        requestReference = nil
        restaurantReference = nil
        status = TableStatus.available
        newRequest = false
        serveTime = Timestamp.init()
    }
    
    init(table: [String: Any]) {
        name = table["name"] as? String ?? ""
        reference = table["reference"] as? DocumentReference
        orderReference = table["orderReference"] as? DocumentReference
        originalReference = table["originalReference"] as? DocumentReference
        requestReference = table["requestReference"] as? DocumentReference
        restaurantReference = table["restaurantReference"] as? DocumentReference
        status = (table["status"] as? String).map { (TableStatus(rawValue: $0) ?? TableStatus.available) } ?? TableStatus.available
        newRequest = table["newRequest"] as? Bool ?? false
        serveTime = table["serveTime"] as? Timestamp ?? Timestamp.init()
    }
    
    func success() -> Bool {
        if (name.count == 0) {
            return false;
        } else if (reference == nil) {
            return false;
        } else if (originalReference == nil) {
            return false;
        } else if (orderReference == nil) {
            return false;
        } else if (requestReference == nil) {
            return false;
        } else if (restaurantReference == nil) {
            return false;
        }
        return true;
    }
    
    var description : String {
        var str = "Table Name: \(name)\n"
        str += "Table Reference: \(reference?.documentID ?? "Table reference not present")\n"
        str += "Table Original Reference: \(originalReference?.documentID ?? "Table  original reference not present")\n"
        str += "Order Reference: \(orderReference?.documentID ?? "Order reference not present")\n"
        str += "Requests Reference: \(requestReference?.documentID ?? "Requests reference not present")\n"
        str += "Restaurant Reference: \(restaurantReference?.documentID ?? "Restaurant reference not present")\n"
        str += "Table Status: \(status)"
        str += "New Request: \(newRequest)"
        str += "Serve Time: \(serveTime)"
        
        return str;
    }
}


