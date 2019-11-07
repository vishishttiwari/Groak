//
//  FirestoreAPICallsTables.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import Firebase

internal class FirestoreAPICallsTables {
    private let db = Firebase.db;
    
    var dataReceivedForFetchTable: ((_ table: Table?) -> ())?
    
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
}
