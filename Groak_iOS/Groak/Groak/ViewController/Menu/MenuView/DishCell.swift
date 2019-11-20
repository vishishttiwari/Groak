//
//  DishCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/18/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class DishCell: UITableViewCell {
    private let container: UIView = UIView()
    private let dishPhoto: UIImageView = UIImageView()
    private let dishName: UILabel = UILabel()
    internal var highlightString: String = ""
    private let dishPrice: UILabel = UILabel()
    private let dishCalorie: UILabel = UILabel()
    private let dishInfo: UILabel = UILabel()
    
    private let titleDimensions: CGFloat = 18
    private let otherDimensions: CGFloat = 15
    private let distanceBetweenElements: CGFloat = 10
    
    internal var dish: Dish = Dish.init() {
        didSet {
            let s = dish.name as NSString
            let att = NSMutableAttributedString(string: s as String)
            let r = s.range(of: highlightString, options: .caseInsensitive, range: .init(location: 0, length: s.length))
            if r.length > 0 {
                att.addAttribute(.backgroundColor, value: ColorsCatalog.themeColor!, range: r)
                att.addAttribute(.foregroundColor, value: UIColor.white, range: r)
            }
            
            dishPhoto.loadImageUsingCache(url: dish.imageLink, available: dish.available)
            dishName.attributedText = att
            dishPrice.text = "$\(String(dish.price))"
            
            let calories = Int(dish.nutrition["calories"] ?? 0)
            if (calories > 0) {
                dishCalorie.text = "\(calories) kCal"
            } else {
                dishCalorie.text = ""
            }
            
            dishInfo.text = self.dish.shortInfo
        }
    }
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.selectedColor()
        
        dishPhoto.backgroundColor = .clear
        dishPhoto.contentMode = .scaleToFill
        container.addSubview(dishPhoto)

        dishName.numberOfLines = 1
        dishName.textAlignment = .left
        dishName.textColor = ColorsCatalog.themeColor
        dishName.font = UIFont(name: FontCatalog.fontLevels[3], size: titleDimensions)
        container.addSubview(dishName)
        
        dishPrice.numberOfLines = 1
        dishPrice.textAlignment = .right
        dishPrice.textColor = ColorsCatalog.themeColor
        dishPrice.font = UIFont(name: FontCatalog.fontLevels[3], size: titleDimensions)
        container.addSubview(dishPrice)
        
        dishCalorie.numberOfLines = 1
        dishCalorie.textAlignment = .right
        dishCalorie.textColor = ColorsCatalog.grayColor
        dishCalorie.font = UIFont(name: FontCatalog.fontLevels[1], size: otherDimensions)
        container.addSubview(dishCalorie)
        
        dishInfo.numberOfLines = 3
        dishInfo.textAlignment = .left
        dishInfo.textColor = ColorsCatalog.grayColor
        dishInfo.font = UIFont(name: FontCatalog.fontLevels[1], size: otherDimensions)
        container.addSubview(dishInfo)
        
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        dishPhoto.translatesAutoresizingMaskIntoConstraints = false
        dishName.translatesAutoresizingMaskIntoConstraints = false
        dishPrice.translatesAutoresizingMaskIntoConstraints = false
        dishCalorie.translatesAutoresizingMaskIntoConstraints = false
        dishInfo.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
        
        dishPhoto.topAnchor.constraint(equalTo: self.topAnchor, constant: distanceBetweenElements).isActive = true
        dishPhoto.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        dishPhoto.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        dishPhoto.heightAnchor.constraint(equalToConstant: DimensionsCatalog.imageHeights).isActive = true
        
        dishName.topAnchor.constraint(equalTo: dishPhoto.bottomAnchor, constant: distanceBetweenElements).isActive = true
        dishName.leftAnchor.constraint(equalTo: container.leftAnchor, constant: distanceBetweenElements).isActive = true
        dishName.widthAnchor.constraint(equalToConstant: self.frame.width/2).isActive = true
        dishName.heightAnchor.constraint(equalToConstant: titleDimensions).isActive = true
        
        dishPrice.topAnchor.constraint(equalTo: dishPhoto.bottomAnchor, constant: distanceBetweenElements).isActive = true
        dishPrice.widthAnchor.constraint(equalToConstant: self.frame.width/3).isActive = true
        dishPrice.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -distanceBetweenElements).isActive = true
        dishPrice.heightAnchor.constraint(equalToConstant: titleDimensions).isActive = true
        
        dishCalorie.topAnchor.constraint(equalTo: dishPrice.bottomAnchor, constant: distanceBetweenElements).isActive = true
        dishCalorie.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -distanceBetweenElements).isActive = true
        dishCalorie.widthAnchor.constraint(equalToConstant: self.frame.width/4).isActive = true
        dishCalorie.heightAnchor.constraint(equalToConstant: otherDimensions).isActive = true
        
        dishInfo.topAnchor.constraint(equalTo: dishCalorie.bottomAnchor, constant: distanceBetweenElements).isActive = true
        dishInfo.leftAnchor.constraint(equalTo: container.leftAnchor, constant: distanceBetweenElements).isActive = true
        dishInfo.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -distanceBetweenElements).isActive = true
        dishInfo.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -distanceBetweenElements).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
