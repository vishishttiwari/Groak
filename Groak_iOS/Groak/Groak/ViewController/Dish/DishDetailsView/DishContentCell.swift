//
//  DishContentCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class is used to represent the dish content cell in the dish details view

import Foundation
import UIKit

internal class DishContentCell: UITableViewCell {
    internal var dishNutrition: [String: Double] = [:] {
        didSet {
            var str = ""
            if let cal = dishNutrition["calories"], cal > 0 {
                str += "Calories:\(Int(cal))kCal   "
            }
            if let fats = dishNutrition["fats"], fats > 0 {
                str += "Fats:\(fats)g   "
            }
            if let carbs = dishNutrition["carbs"], carbs > 0 {
                str += "Carbs:\(carbs)g   "
            }
            if let protein = dishNutrition["protein"], protein > 0 {
                str += "Protein:\(protein)g"
            }
            dishNutritionLabel.text = str
            dishNutritionLabel.boldSubString(originalString: str, substrings: ["calories", "fats", "carbs", "protein"], font: UIFont(name: FontCatalog.fontLevels[2], size: 18)!)
        }
    }
    internal let dishNutritionLabel: UILabel = UILabel()
    private let container: UIView = UIView()
    
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
        container.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        dishNutritionLabel.topAnchor.constraint(equalTo: container.topAnchor).isActive = true
        dishNutritionLabel.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        dishNutritionLabel.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        dishNutritionLabel.bottomAnchor.constraint(equalTo: container.bottomAnchor).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
