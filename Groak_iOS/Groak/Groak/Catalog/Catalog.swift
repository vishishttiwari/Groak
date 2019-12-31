//
//  Catalog.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import AVFoundation
import UIKit

internal class Catalog {
    
    // This cell is used as a special id for special instructions cell in the whole project
    static let specialInstructionsId = "specialInstructionsCellIdABCD1234"
    
    enum RestrictionsSymbol: String {
        case U
        case V
        case VV
        case NV
        case G
        case GF
        case K
        case NK
    };
    
    // Simple alert views. Nothing special
    static func alert(vc: UIViewController?, title: String, message: String) {
        guard let view = vc else { return }
        
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Ok", style: .cancel, handler: nil))
        view.present(alert, animated: true, completion: nil)
    }
    
    static func calculateTotalPriceOfDish(pricePerItem: Double, quantity: Int) -> Double {
        return round(Double(quantity) * pricePerItem * 100)/100
    }
    
    static func showExtras(dishExtras: [DishExtra], showSpecialInstructions: Bool) -> String {
        var str = ""
        for extra in dishExtras {
            if (extra.options.count > 0) {
                if (extra.title != Catalog.specialInstructionsId) {
                    str += "\(extra.title):\n"
                    for option in extra.options {
                        str += "\t- \(option.title): \(option.price.priceInString)\n"
                    }
                } else {
                    if showSpecialInstructions {
                        str += "Special Instructions:\n"
                        for option in extra.options {
                            str += "\t- \(option.title)\n"
                        }
                    }
                }
            }
        }
        
        let index = str.index(str.endIndex, offsetBy: -1)
        
        if str.count > 2 && str.suffix(from: index) == "\n" {
            return String(str.dropLast(1))
        } else {
            return str
        }
    }
}
