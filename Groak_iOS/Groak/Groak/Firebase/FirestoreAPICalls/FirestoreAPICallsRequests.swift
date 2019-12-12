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
    var dataReceivedForAddRequests: ((_ success: Bool) -> ())?
    
    var listener: ListenerRegistration?
    
    func fetchRequestsFirestoreAPI() {
        listener  = LocalRestaurant.requests.requestsReference?.addSnapshotListener { documentSnapshot, error in
            guard let document = documentSnapshot else {
                self.dataReceivedForFetchRequests?(nil)
                return
            }
            let requests = Requests.init(requests: document.data() ?? [:])
            self.dataReceivedForFetchRequests?(requests)
        }
    }
    
    func unsubscribe() {
        listener?.remove()
    }
    
    func addRequestsFirestoreAPI(request: Request) {
        guard let requestsReference = LocalRestaurant.requests.requestsReference else {
            dataReceivedForAddRequests?(false)
            return
        }
        guard let orderReference = LocalRestaurant.order.orderReference else {
            dataReceivedForAddRequests?(false)
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
                self.dataReceivedForAddRequests?(false)
            } else {
                self.dataReceivedForAddRequests?(true)
            }
        }
    }
}
