//
//  DishNutritionCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class DishNutritionCell: UITableViewCell {
    internal var dishNutrition: [String: Float] = [:] {
        didSet {
            var str = ""
            if let cal = dishNutrition["calories"], cal > 0 {
                str += "Calories: \(Int(cal)) kCal   "
            }
            if let fats = dishNutrition["fats"], fats > 0 {
                str += "Fats: \(Int(fats)) g   "
            }
            if let carbs = dishNutrition["carbs"], carbs > 0 {
                str += "Carbs: \(Int(carbs)) g   "
            }
            if let protein = dishNutrition["protein"], protein > 0 {
                str += "Protein: \(Int(protein)) g   "
            }
            dishNutritionLabel.text = str
            dishNutritionLabel.boldSubString(originalString: str, substrings: ["calories", "fats", "carbs", "protein"], font: UIFont(name: FontCatalog.fontLevels[2], size: 18)!)
        }
    }
    internal let dishNutritionLabel: UILabel = UILabel()
    private let container: UIView = UIView()
    
    private let distanceBetweenElements: CGFloat = 10
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.selectionStyle = .none
        self.isUserInteractionEnabled = false
        
        dishNutritionLabel.font = UIFont(name: FontCatalog.fontLevels[1], size: 18)
        dishNutritionLabel.numberOfLines = 0
        dishNutritionLabel.textColor = .black
        dishNutritionLabel.backgroundColor = .clear
        dishNutritionLabel.lineBreakMode = .byTruncatingTail
        dishNutritionLabel.textAlignment = .left
        container.addSubview(dishNutritionLabel)
        
        container.backgroundColor = .white
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        dishNutritionLabel.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
        
        dishNutritionLabel.topAnchor.constraint(equalTo: container.topAnchor).isActive = true
        dishNutritionLabel.leftAnchor.constraint(equalTo: container.leftAnchor, constant: distanceBetweenElements).isActive = true
        dishNutritionLabel.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -distanceBetweenElements).isActive = true
        dishNutritionLabel.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -distanceBetweenElements).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
