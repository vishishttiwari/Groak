//
//  CoreDataDish+CoreDataProperties.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/12/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//

import Foundation
import CoreData


extension CoreDataDish {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<CoreDataDish> {
        return NSFetchRequest<CoreDataDish>(entityName: "CoreDataDish")
    }

    @NSManaged public var created: Date?
    @NSManaged public var name: String?
    @NSManaged public var price: Double
    @NSManaged public var quantity: Int16
    @NSManaged public var restaurantName: String?
    @NSManaged public var restaurantDocumentId: String?
    @NSManaged public var extras: NSSet?

}

// MARK: Generated accessors for extras
extension CoreDataDish {

    @objc(addExtrasObject:)
    @NSManaged public func addToExtras(_ value: CoreDataDishExtra)

    @objc(removeExtrasObject:)
    @NSManaged public func removeFromExtras(_ value: CoreDataDishExtra)

    @objc(addExtras:)
    @NSManaged public func addToExtras(_ values: NSSet)

    @objc(removeExtras:)
    @NSManaged public func removeFromExtras(_ values: NSSet)

}
