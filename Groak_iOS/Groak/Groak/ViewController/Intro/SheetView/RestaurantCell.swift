//
//  RestaurantCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Class defines each cell of the Restaurant List View

import Foundation
import UIKit

internal class RestaurantCell: UITableViewCell {
    private let container: UIView = UIView()
    private let restaurantLogo: UIImageView = UIImageView()
    private let restaurantName: UILabel = UILabel()
    
    internal var restaurant: Restaurant = Restaurant.init() {
        didSet {
            restaurantLogo.loadImageUsingCache(url: restaurant.logo)
            restaurantName.text = restaurant.name
        }
    }
    
    private let textHeight: CGFloat = 20
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.selectedColor()
        
        restaurantLogo.backgroundColor = .clear
        restaurantLogo.contentMode = .scaleAspectFit
        container.addSubview(restaurantLogo)
        
        restaurantName.text = ""
        restaurantName.backgroundColor = .clear
        restaurantName.font = UIFont(name: FontCatalog.fontLevels[1], size: textHeight)
        restaurantName.numberOfLines = 0
        restaurantName.textColor = .black
        restaurantName.lineBreakMode = .byTruncatingTail
        restaurantName.textAlignment = .center
        restaurantName.sizeToFit()
        container.addSubview(restaurantName)
        
        container.backgroundColor = .white
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        restaurantLogo.translatesAutoresizingMaskIntoConstraints = false
        restaurantName.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
        
        restaurantLogo.topAnchor.constraint(equalTo: container.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantLogo.leftAnchor.constraint(equalTo: container.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantLogo.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantLogo.heightAnchor.constraint(equalToConstant: 120).isActive = true
        
        restaurantName.topAnchor.constraint(equalTo: restaurantLogo.bottomAnchor, constant: 3*DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantName.leftAnchor.constraint(equalTo: container.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantName.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantName.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
