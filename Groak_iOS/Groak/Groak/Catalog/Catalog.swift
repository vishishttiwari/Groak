//
//  Catalog.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class Catalog {
    
    // This cell is used as a special id for special instructions cell in the whole project
    static let specialInstructionsId = "specialInstructionsCellIdABCD1234"
    
    // Simple alert views. Nothing special
    static func alert(vc: UIViewController?, title: String, message: String) {
        guard let view = vc else { return }
        
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Ok", style: .cancel, handler: nil))
        view.present(alert, animated: true, completion: nil)
    }
}
