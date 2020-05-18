//
//  FirebaseMessaging.swift
//  Groak
//
//  Created by Vishisht Tiwari on 1/15/20.
//  Copyright © 2020 Groak. All rights reserved.
//

import Foundation
import FirebaseMessaging
import CoreData

internal class FirebaseMessaging {
    
    static let shared = FirebaseMessaging()
    let messaging = Messaging.messaging()
    
    private init() {}
    
    func subscribe(orderId: String) {
        messaging.subscribe(toTopic: orderId)
        let _ = addOrderIdToCoreData(orderId: orderId)
    }
    
    func unsubscribe(orderId: String? = nil) {
        if let orderId = orderId {
            messaging.unsubscribe(fromTopic: orderId)
        }
        let orderIds = downloadOrderIdsFromCoreData()
        for orderId in orderIds {
            if let orderIdFinal = orderId.orderId {
                messaging.unsubscribe(fromTopic: orderIdFinal)
            }
        }
    }
    
    // add orderId reference to coredata
    private func addOrderIdToCoreData(orderId: String) -> Bool {
        let delegate = UIApplication.shared.delegate as? AppDelegate
        if let context = delegate?.persistentContainer.viewContext {
            let coreDataOrderId = NSEntityDescription.insertNewObject(forEntityName: "CoreDataOrderIdSubscribed", into: context) as! CoreDataOrderIdSubscribed
            
            coreDataOrderId.orderId = orderId
            coreDataOrderId.created = Date()
            
            do {
                try context.save()
            } catch {
                return false
            }
        }
        
        return true
    }
    
    // get all orderIds and subscribe
    private func downloadOrderIdsFromCoreData() -> [CoreDataOrderIdSubscribed] {
        let delegate = UIApplication.shared.delegate as? AppDelegate
        
        if let context = delegate?.persistentContainer.viewContext {
            let fetchOrderIds = NSFetchRequest<NSFetchRequestResult>.init(entityName: "CoreDataOrderIdSubscribed")
            fetchOrderIds.sortDescriptors = [NSSortDescriptor.init(key: "created", ascending: true)]
            
            do {
                let orderIds: [CoreDataOrderIdSubscribed] = try(context.fetch(fetchOrderIds)) as? [CoreDataOrderIdSubscribed] ?? []
                
                for orderId in orderIds {
                    if let created = orderId.created, let previousDay = Calendar.current.date(byAdding: .year, value: -1, to: Date()) {
                        if created < previousDay {
                            context.delete(orderId)
                        }
                    }
                }

                return orderIds
            } catch {
                return []
            }
        }
        return []
    }
}
