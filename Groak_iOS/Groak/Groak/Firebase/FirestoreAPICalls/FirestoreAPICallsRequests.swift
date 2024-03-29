//
//  FirestoreAPICallsRequests.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/25/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Contains all API calls for fetching request information. There will always be only one instance of this
//  in the project because this is a snapshor listener. So all the instances have to be unsubscribed before leaving.

import Foundation
import Firebase

internal class FirestoreAPICallsRequests {
    private let db = Firebase.db;
    
    var dataReceivedForFetchRequests: ((_ requests: Requests?) -> ())?
    var dataReceivedForAddRequests: ((_ success: Bool) -> ())?
    
    var listener: ListenerRegistration?
    
    // Used for fetching requests
    func fetchRequestFirestoreAPI() {
        listener  = LocalRestaurant.request.requestReference?.addSnapshotListener { documentSnapshot, error in
            guard let document = documentSnapshot else {
                self.dataReceivedForFetchRequests?(nil)
                return
            }
            let requests = Requests.init(requests: document.data() ?? [:])
            self.dataReceivedForFetchRequests?(requests)
        }
    }
    
    // Used for unsubscribing the snapshot listener
    func unsubscribe() {
        listener?.remove()
    }
    
    // Used for adding a request message to the server
    func addRequestFirestoreAPI(request: Request) {
        guard let requestsReference = LocalRestaurant.request.requestReference else {
            dataReceivedForAddRequests?(false)
            return
        }
        guard let orderReference = LocalRestaurant.order.orderReference else {
            dataReceivedForAddRequests?(false)
            return
        }
        guard let tableReference = LocalRestaurant.table.table?.reference else {
            dataReceivedForAddRequests?(false)
            return
        }
        guard let tableOriginalReference = LocalRestaurant.table.table?.originalReference else {
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
            transaction.updateData(["newRequest": true, "updated": Timestamp.init()], forDocument: orderReference)
            transaction.updateData(["newRequest": true], forDocument: tableReference)
            transaction.updateData(["newRequest": true], forDocument: tableOriginalReference)
            
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
