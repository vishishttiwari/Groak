//
//  DishCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/18/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class is used to represent the dish cell in menu

import Foundation
import UIKit

internal class DishCell: UITableViewCell {
    private let container: UIView = UIView()
    private let dishImage: UIImageView = UIImageView()
    private let dishName: UILabel = UILabel()
    internal var highlightString: String = ""
    private let dishPrice: UILabel = UILabel()
    private let restrictions: UIView = UIView()
    private var vegRestriction: UILabel = UILabel()
    private var glutenFreeRestriction: UILabel = UILabel()
    private var kosherRestriction: UILabel = UILabel()
    private let dishCalorie: UILabel = UILabel()
    private let dishInfo: UILabel = UILabel()
    
    private let titleDimensions: CGFloat = 20
    private let otherDimensions: CGFloat = 20
    private let infoDimensions: CGFloat = 15
    
    private var dishImageFullHeightConstraint: NSLayoutConstraint?
    private var dishImageNoHeightConstraint: NSLayoutConstraint?
    private var restrictionsFullHeightConstraint: NSLayoutConstraint?
    private var restrictionsNoHeightConstraint: NSLayoutConstraint?
    private var dishCalorieFullHeightConstraint: NSLayoutConstraint?
    private var dishCalorieNoHeightConstraint: NSLayoutConstraint?
    
    internal var dish: Dish = Dish.init() {
        didSet {
            if dish.imageLink.count > 0 {
                dishImage.loadImageUsingCache(url: dish.imageLink, available: dish.available)
                dishImageFullHeightConstraint?.isActive = true
                dishImageNoHeightConstraint?.isActive = false
            } else {
                dishImageFullHeightConstraint?.isActive = false
                dishImageNoHeightConstraint?.isActive = true
            }
            dishName.colorBackgroundForegroundOfSubString(originalString: dish.name, substrings: [highlightString], backgroundColor: ColorsCatalog.themeColor, foregroundColor: .white)
            dishPrice.text = dish.price.priceInString
            
            let calories = Int(dish.nutrition["calories"] ?? 0)
            if calories > 0 || dish.restrictionsExist() {
               restrictionsFullHeightConstraint?.isActive = true
               restrictionsNoHeightConstraint?.isActive = false
               
               dishCalorieFullHeightConstraint?.isActive = true
               dishCalorieNoHeightConstraint?.isActive = false
           } else {
               restrictionsFullHeightConstraint?.isActive = false
               restrictionsNoHeightConstraint?.isActive = true
               
               dishCalorieFullHeightConstraint?.isActive = false
               dishCalorieNoHeightConstraint?.isActive = true
           }
            if calories > 0 {
                dishCalorie.text = "\(calories) kCal"
            } else {
                dishCalorie.text = ""
            }
            
            // This variable is used to see where each of restrictions badge will be placed
            var x: CGFloat = 0
            
            vegRestriction.frame.origin.x = 0
            vegRestriction.frame.origin.y = 0
            vegRestriction.frame.size.height = otherDimensions
            vegRestriction.frame.size.width = 0
            if dish.restrictions["vegan"] == "Yes" {
                vegRestriction.isRestrictions(symbol: .VV, height: otherDimensions)
                vegRestriction.frame.origin.x = x
                vegRestriction.frame.size.width = otherDimensions
                x += otherDimensions*1.5
            } else if dish.restrictions["vegetarian"] == "Yes" {
                vegRestriction.isRestrictions(symbol: .V, height: otherDimensions)
                vegRestriction.frame.origin.x = x
                vegRestriction.frame.size.width = otherDimensions
                x += otherDimensions*1.5
            } else if dish.restrictions["vegetarian"] == "No" {
                vegRestriction.isRestrictions(symbol: .NV, height: otherDimensions)
                vegRestriction.frame.origin.x = x
                vegRestriction.frame.size.width = otherDimensions
                x += otherDimensions*1.5
            }
            
            glutenFreeRestriction.frame.origin.x = x
            glutenFreeRestriction.frame.origin.y = 0
            glutenFreeRestriction.frame.size.height = otherDimensions
            glutenFreeRestriction.frame.size.width = 0
            if dish.restrictions["glutenFree"] == "Yes" {
                glutenFreeRestriction.isRestrictions(symbol: .GF, height: otherDimensions)
                glutenFreeRestriction.frame.origin.x = x
                glutenFreeRestriction.frame.size.width = otherDimensions
                x += otherDimensions*1.5
            } else if dish.restrictions["glutenFree"] == "No" {
                glutenFreeRestriction.isRestrictions(symbol: .G, height: otherDimensions)
                glutenFreeRestriction.frame.origin.x = x
                glutenFreeRestriction.frame.size.width = otherDimensions
                x += otherDimensions*1.5
            }

            kosherRestriction.frame.origin.x = x
            kosherRestriction.frame.origin.y = 0
            kosherRestriction.frame.size.height = otherDimensions
            kosherRestriction.frame.size.width = 0
            if dish.restrictions["kosher"] == "Yes" {
                kosherRestriction.isRestrictions(symbol: .K, height: otherDimensions)
                kosherRestriction.frame.origin.x = x
                kosherRestriction.frame.size.width = otherDimensions
                x += otherDimensions*1.5
            } else if dish.restrictions["kosher"] == "No" {
                kosherRestriction.isRestrictions(symbol: .NK, height: otherDimensions)
                kosherRestriction.frame.origin.x = x
                kosherRestriction.frame.size.width = otherDimensions
                x += otherDimensions*1.5
            }
            
            dishInfo.text = dish.shortInfo
            if dish.available { self.selectedColor() }
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
        
        dishImage.backgroundColor = .gray
        dishImage.contentMode = .scaleToFill
        container.addSubview(dishImage)

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
        
        restrictions.addSubview(vegRestriction)
        restrictions.addSubview(glutenFreeRestriction)
        restrictions.addSubview(kosherRestriction)
        container.addSubview(restrictions)
        
        dishCalorie.numberOfLines = 0
        dishCalorie.textAlignment = .right
        dishCalorie.textColor = ColorsCatalog.grayColor
        dishCalorie.font = UIFont(name: FontCatalog.fontLevels[1], size: otherDimensions)
        container.addSubview(dishCalorie)
        
        dishInfo.numberOfLines = 0
        dishInfo.textAlignment = .left
        dishInfo.textColor = ColorsCatalog.grayColor
        dishInfo.font = UIFont(name: FontCatalog.fontLevels[1], size: infoDimensions)
        dishInfo.lineBreakMode = .byTruncatingTail
        dishInfo.sizeToFit()
        container.addSubview(dishInfo)
        
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        dishImage.translatesAutoresizingMaskIntoConstraints = false
        dishName.translatesAutoresizingMaskIntoConstraints = false
        dishPrice.translatesAutoresizingMaskIntoConstraints = false
        restrictions.translatesAutoresizingMaskIntoConstraints = false
        dishCalorie.translatesAutoresizingMaskIntoConstraints = false
        dishInfo.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        dishImage.topAnchor.constraint(equalTo: container.topAnchor).isActive = true
        dishImage.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        dishImage.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        
        dishImageFullHeightConstraint = dishImage.heightAnchor.constraint(equalToConstant: DimensionsCatalog.imageHeights)
        dishImageFullHeightConstraint?.priority = UILayoutPriority.init(999)
        dishImageNoHeightConstraint = dishImage.heightAnchor.constraint(equalToConstant: 0)
        dishImageNoHeightConstraint?.priority = UILayoutPriority.init(999)
        
        dishName.topAnchor.constraint(equalTo: dishImage.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        dishName.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        dishName.widthAnchor.constraint(equalToConstant: 3*self.frame.width/4).isActive = true
        
        dishPrice.topAnchor.constraint(equalTo: dishImage.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        dishPrice.widthAnchor.constraint(equalToConstant: self.frame.width/3).isActive = true
        dishPrice.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        
        restrictions.topAnchor.constraint(equalTo: dishPrice.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        restrictions.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        restrictions.rightAnchor.constraint(equalTo: dishCalorie.leftAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        restrictionsFullHeightConstraint = restrictions.heightAnchor.constraint(equalToConstant: otherDimensions)
        restrictionsFullHeightConstraint?.priority = UILayoutPriority.init(999)
        restrictionsNoHeightConstraint = restrictions.heightAnchor.constraint(equalToConstant: 0)
        restrictionsNoHeightConstraint?.priority = UILayoutPriority.init(999)
        
        dishCalorie.topAnchor.constraint(equalTo: dishPrice.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        dishCalorie.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        dishCalorie.widthAnchor.constraint(equalToConstant: self.frame.width/4).isActive = true
        
        dishCalorieFullHeightConstraint = dishCalorie.heightAnchor.constraint(equalToConstant: otherDimensions)
        dishCalorieFullHeightConstraint?.priority = UILayoutPriority.init(999)
        dishCalorieNoHeightConstraint = dishCalorie.heightAnchor.constraint(equalToConstant: 0)
        dishCalorieNoHeightConstraint?.priority = UILayoutPriority.init(999)
        
        dishInfo.topAnchor.constraint(equalTo: dishCalorie.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        dishInfo.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        dishInfo.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        dishInfo.bottomAnchor.constraint(equalTo: container.bottomAnchor).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
