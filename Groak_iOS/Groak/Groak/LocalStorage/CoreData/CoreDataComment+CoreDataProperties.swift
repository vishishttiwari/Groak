//
//  CoreDataComment+CoreDataProperties.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/12/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//

import Foundation
import CoreData


extension CoreDataComment {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<CoreDataComment> {
        return NSFetchRequest<CoreDataComment>(entityName: "CoreDataComment")
    }

    @NSManaged public var comment: String?
    @NSManaged public var created: Date?
    @NSManaged public var restaurantName: String?
    @NSManaged public var restaurantDocumentId: String?

}
