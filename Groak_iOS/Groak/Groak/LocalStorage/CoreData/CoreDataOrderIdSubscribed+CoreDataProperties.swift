//
//  CoreDataOrderIdSubscribed+CoreDataProperties.swift
//  Groak
//
//  Created by Vishisht Tiwari on 5/18/20.
//  Copyright © 2020 Groak. All rights reserved.
//
//

import Foundation
import CoreData


extension CoreDataOrderIdSubscribed {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<CoreDataOrderIdSubscribed> {
        return NSFetchRequest<CoreDataOrderIdSubscribed>(entityName: "CoreDataOrderIdSubscribed")
    }

    @NSManaged public var created: Date?
    @NSManaged public var orderId: String?

}
