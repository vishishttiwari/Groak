//
//  FirestoreAPICallsDishes.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/18/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import Firebase

internal class FirestoreAPICallsDishes {
    private let db = Firebase.db;
    
    var dataReceivedForFetchDish: ((_ dish: Dish?) -> ())?
    
    func fetchDishFirestoreAPI(dishReference: DocumentReference) {
        dishReference.getDocument{(document, error) in
            if let document = document, document.exists {
                let dish = Dish.init(dish: document.data() ?? [:])
                self.dataReceivedForFetchDish?(dish)
            } else {
                self.dataReceivedForFetchDish?(nil)
            }
        }
    }
}
