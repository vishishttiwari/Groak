//
//  FirestoreAPICallsRequests.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/25/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import Firebase

internal class FirestoreAPICallsRequests {
    private let db = Firebase.db;
    
    var dataReceivedForFetchRequests: ((_ requests: Requests?) -> ())?
    var dataAddedForAddRequests: ((_ success: Bool) -> ())?
    
    func fetchRequestsFirestoreAPI(restaurant: Restaurant, requestsId: String) {
        restaurant.reference?.collection("requests").document(requestsId)
        .addSnapshotListener { documentSnapshot, error in
            guard let document = documentSnapshot else {
                self.dataReceivedForFetchRequests?(nil)
                return
            }
            let requests = Requests.init(requests: document.data() ?? [:])
            self.dataReceivedForFetchRequests?(requests)
        }
    }
    
    func addRequestsFirestoreAPI(restaurant: Restaurant, requestsId: String, request: Request) {
        guard let requestsReference = restaurant.reference?.collection("requests").document(requestsId) else {
            dataAddedForAddRequests?(false)
            return
        }
        guard let orderReference = restaurant.reference?.collection("orders").document(requestsId) else {
            dataAddedForAddRequests?(false)
            return
        }
        
        db.runTransaction({ (transaction, errorPointer) in
            let requestsDocument: DocumentSnapshot
            do {
                try requestsDocument = transaction.getDocument(requestsReference)
            } catch let fetchError as NSError {
                errorPointer?.pointee = fetchError
                return nil
            }

            let requests = Requests.init(requests: requestsDocument.data() ?? [:])
            if !requests.success() {
                return nil
            }
            
            requests.requests.append(request)

            transaction.updateData(["requests": requests.convertRequestsToDictionary()], forDocument: requestsReference)
            transaction.updateData(["status": TableStatus.requested.rawValue], forDocument: orderReference)
            
            return nil
        }) { (object, error) in
            if error != nil {
                self.dataAddedForAddRequests?(false)
            } else {
                self.dataAddedForAddRequests?(true)
            }
        }
    }
}
