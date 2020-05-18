//
//  CoreDataCommentReference+CoreDataProperties.swift
//  Groak
//
//  Created by Vishisht Tiwari on 5/17/20.
//  Copyright © 2020 Groak. All rights reserved.
//
//

import Foundation
import CoreData


extension CoreDataCommentReference {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<CoreDataCommentReference> {
        return NSFetchRequest<CoreDataCommentReference>(entityName: "CoreDataCommentReference")
    }

    @NSManaged public var reference: String?
    @NSManaged public var created: Date?

}
