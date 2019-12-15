//
//  CoreDataDishExtra+CoreDataProperties.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/12/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//

import Foundation
import CoreData


extension CoreDataDishExtra {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<CoreDataDishExtra> {
        return NSFetchRequest<CoreDataDishExtra>(entityName: "CoreDataDishExtra")
    }

    @NSManaged public var title: String?
    @NSManaged public var dish: CoreDataDish?
    @NSManaged public var options: NSSet?

}

// MARK: Generated accessors for options
extension CoreDataDishExtra {

    @objc(addOptionsObject:)
    @NSManaged public func addToOptions(_ value: CoreDataDishExtraOption)

    @objc(removeOptionsObject:)
    @NSManaged public func removeFromOptions(_ value: CoreDataDishExtraOption)

    @objc(addOptions:)
    @NSManaged public func addToOptions(_ values: NSSet)

    @objc(removeOptions:)
    @NSManaged public func removeFromOptions(_ values: NSSet)

}
