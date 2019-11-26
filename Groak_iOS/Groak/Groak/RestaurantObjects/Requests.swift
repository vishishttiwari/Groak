//
//  Requests.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/25/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import Firebase

internal class Requests {
    var reference: DocumentReference?
    var requests: [Request]
    
    init() {
        reference = nil
        requests = []
    }
    
    init(requests: [String: Any]) {
        self.reference = requests["reference"] as? DocumentReference
        self.requests = []
        
        let requestsMap = requests["requests"] as? [[String: Any]] ?? []
        for requestMap in requestsMap {
            self.requests.append(Request.init(request: requestMap))
        }
    }
    
    func success() -> Bool {
        if (reference == nil) {
            return false;
        }
        for request in requests {
            if !request.success() {
                return false;
            }
        }
        return true;
    }
    
    func convertRequestsToDictionary() -> [[String: Any]] {
        var requestsInDictionary: [[String: Any]] = []
        for request in requests {
            requestsInDictionary.append(request.convertRequestToDictionary())
        }
        
        return requestsInDictionary
    }
    
    var description : String {
        var str = "Requests\n"
        for request in requests {
            str += "\t\(request)\n"
        }
        
        return str;
    }
}

internal class Request {
    var created: Timestamp
    var createdByUser: Bool
    var request: String
    
    init() {
        self.created = Timestamp.init()
        self.createdByUser = true
        self.request = ""
    }
    
    init(request: String) {
        self.created = Timestamp.init(date: Date.init())
        self.createdByUser = true
        self.request = request
    }
    
    init(request: [String: Any]) {
        self.created = request["created"] as? Timestamp ?? Timestamp.init()
        self.createdByUser = request["createdByUser"] as? Bool ?? true
        self.request = request["request"] as? String ?? ""
    }
    
    func success() -> Bool {
        if (request.count == 0) {
            return false;
        }
        return true;
    }
    
    func convertRequestToDictionary() -> [String: Any] {
        var requestInDictionary: [String: Any] = [:]
        requestInDictionary["created"] = self.created
        requestInDictionary["createdByUser"] = self.createdByUser
        requestInDictionary["request"] = self.request
        
        return requestInDictionary
    }
    
    var description : String {
        var str = "Request: \(request)\n"
        str += "Created by user: \(createdByUser)\n"
        str += "Created at time: \(created)\n"
        
        return str;
    }
}
