//
//  FirebaseMessaging.swift
//  Groak
//
//  Created by Vishisht Tiwari on 1/15/20.
//  Copyright © 2020 Groak. All rights reserved.
//

import Foundation
import FirebaseMessaging

internal class FirebaseMessaging {
    
    static let shared = FirebaseMessaging()
    let messaging = Messaging.messaging()
    
    private init() {}
    
    func subscribe(orderId: String) {
        messaging.subscribe(toTopic: orderId)
    }
    
    func unsubscribe(orderId: String) {
        print("Unsubscribe Start")
        messaging.unsubscribe(fromTopic: orderId)
        print("Unsubscribe End")
    }
}
