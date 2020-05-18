//
//  CoreDataDishReference+CoreDataProperties.swift
//  Groak
//
//  Created by Vishisht Tiwari on 5/17/20.
//  Copyright © 2020 Groak. All rights reserved.
//
//

import Foundation
import CoreData


extension CoreDataDishReference {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<CoreDataDishReference> {
        return NSFetchRequest<CoreDataDishReference>(entityName: "CoreDataDishReference")
    }

    @NSManaged public var reference: String?
    @NSManaged public var created: Date?

}
