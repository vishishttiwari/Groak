//
//  CoreDataDishExtraOption+CoreDataProperties.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/12/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//

import Foundation
import CoreData


extension CoreDataDishExtraOption {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<CoreDataDishExtraOption> {
        return NSFetchRequest<CoreDataDishExtraOption>(entityName: "CoreDataDishExtraOption")
    }

    @NSManaged public var title: String?
    @NSManaged public var price: Double
    @NSManaged public var extra: CoreDataDishExtra?

}
