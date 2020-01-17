//
//  Catalog.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Catalog file is used to access random information all across the project

import AVFoundation
import UIKit

internal class Catalog {
    
    // This cell is used as a special id for special instructions cell in the whole project
    static let specialInstructionsId = "specialInstructionsCellIdABCD1234"
    
    // Different restrictions sumbol for vegetarian, gluten-free etc.
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
    
    static func message(vc: UIViewController?, message: String) {
        guard let view = vc else { return }
        
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        view.present(alert, animated: true)

        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + TimeCatalog.messageTime) {
            alert.dismiss(animated: true)
        }
    }
    
    // Calculate the price in two decimal places
    static func calculateTotalPriceOfDish(pricePerItem: Double, quantity: Int) -> Double {
        return round(Double(quantity) * pricePerItem * 100)/100
    }
    
    // This function is used to show all the xtras selected for a dish in cart and in order
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
        
        if str.count > 2 {
            let index = str.index(str.endIndex, offsetBy: -1)
            
            if str.suffix(from: index) == "\n" {
                return String(str.dropLast(1))
            } else {
                return str
            }
        } else {
            return str
        }
    }
}
