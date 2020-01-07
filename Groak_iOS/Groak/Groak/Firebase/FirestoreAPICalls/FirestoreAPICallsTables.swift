//
//  FirestoreAPICallsTables.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Contains all API calls for fetching table information

import Foundation
import Firebase

internal class FirestoreAPICallsTables {
    private let db = Firebase.db;
    
    var dataReceivedForFetchTable: ((_ table: Table?) -> ())?
    var dataReceivedSetStatus: ((_ success: Bool) -> ())?
    
    // Fetch table from tableId
    func fetchTableFirestoreAPI(tableId: String) {
        if (!tableId.isAlphanumeric) {
            self.dataReceivedForFetchTable?(nil)
            return;
        }
        db.collection("tables").document(tableId).getDocument{(document, error) in
            if let document = document, document.exists {
                let table = Table.init(table: document.data() ?? [:])
                self.dataReceivedForFetchTable?(table)
            } else {
                self.dataReceivedForFetchTable?(nil)
            }
        }
    }
    
    func setSeatedStatusFirestoreAPI(orderReference: DocumentReference?, tableReference: DocumentReference?, tableOriginalReference: DocumentReference?) {
        guard let orderReference = orderReference else {
            dataReceivedSetStatus?(false)
            return
        }
        guard let tableReference = tableReference else {
            dataReceivedSetStatus?(false)
            return
        }
        guard let tableOriginalReference = tableOriginalReference else {
            dataReceivedSetStatus?(false)
            return
        }
        
        db.runTransaction({ (transaction, errorPointer) in
            let orderDocument: DocumentSnapshot
            do {
                try orderDocument = transaction.getDocument(orderReference)
            } catch let fetchError as NSError {
                errorPointer?.pointee = fetchError
                return nil
            }

            let currentStatus = orderDocument.data()?["status"] as? String
            if let currentStatus = currentStatus, let currentTableSatus = TableStatus.init(rawValue: currentStatus) {
                if currentTableSatus == TableStatus.available {
                    transaction.updateData(["status": TableStatus.seated.rawValue, "updated": Timestamp.init()], forDocument: orderReference)
                    transaction.updateData(["status": TableStatus.seated.rawValue], forDocument: tableReference)
                    transaction.updateData(["status": TableStatus.seated.rawValue], forDocument: tableOriginalReference)
                } else {
                    // This is done because firestore wants me to update the document that was read. It would not allow it otherwise
                    transaction.updateData(["reference": orderReference], forDocument: orderReference)
                }
            } else {
                // If the status was something alien then set it to available
                // Another reason for doing this was that firestore wants me to update the document that was read. It would not allow it otherwise
                transaction.updateData(["status": TableStatus.available.rawValue, "updated": Timestamp.init()], forDocument: orderReference)
                transaction.updateData(["status": TableStatus.available.rawValue], forDocument: tableReference)
                transaction.updateData(["status": TableStatus.available.rawValue], forDocument: tableOriginalReference)
                self.dataReceivedSetStatus?(false)
            }
            
            return nil
        }) { (object, error) in
            if error != nil {
                self.dataReceivedSetStatus?(false)
            } else {
                self.dataReceivedSetStatus?(true)
            }
        }
    }
    
    func setPaymentStatusFirestoreAPI(orderReference: DocumentReference?, tableReference: DocumentReference?, tableOriginalReference: DocumentReference?) {
        guard let orderReference = orderReference else {
            dataReceivedSetStatus?(false)
            return
        }
        guard let tableReference = tableReference else {
            dataReceivedSetStatus?(false)
            return
        }
        guard let tableOriginalReference = tableOriginalReference else {
            dataReceivedSetStatus?(false)
            return
        }
        
        db.runTransaction({ (transaction, errorPointer) in
            let orderDocument: DocumentSnapshot
            do {
                try orderDocument = transaction.getDocument(orderReference)
            } catch let fetchError as NSError {
                errorPointer?.pointee = fetchError
                return nil
            }

            let currentStatus = orderDocument.data()?["status"] as? String
            if let currentStatus = currentStatus, let currentTableSatus = TableStatus.init(rawValue: currentStatus) {
                if currentTableSatus == TableStatus.ordered || currentTableSatus == TableStatus.approved || currentTableSatus == TableStatus.served || currentTableSatus == TableStatus.payment {
                    transaction.updateData(["status": TableStatus.payment.rawValue], forDocument: orderReference)
                    transaction.updateData(["status": TableStatus.payment.rawValue], forDocument: tableReference)
                    transaction.updateData(["status": TableStatus.payment.rawValue], forDocument: tableOriginalReference)
                } else {
                    // This is done because firestore wants me to update the document that was read. It would not allow it otherwise
                    transaction.updateData(["reference": orderReference], forDocument: orderReference)
                }
            } else {
                // This is done because firestore wants me to update the document that was read. It would not allow it otherwise
                transaction.updateData(["reference": orderReference], forDocument: orderReference)
            }
            
            return nil
        }) { (object, error) in
            if error != nil {
                self.dataReceivedSetStatus?(false)
            } else {
                self.dataReceivedSetStatus?(true)
            }
        }
    }
}
