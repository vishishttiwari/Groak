//
//  RestaurantFullView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class RestaurantFullView: UIView {
    private let restaurantName: UILabel = UILabel()
    private let restaurantLogo: UIImageView = UIImageView()
    internal var restaurant: Restaurant = Restaurant.init() {
        didSet {
            restaurantLogo.loadImageUsingCache(url: restaurant.logo)
            restaurantName.text = restaurant.name
        }
    }
    
    private let restaurantTitleHeight: CGFloat = 30
    
    required init() {
        super.init(frame: .zero)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        
        restaurantName.textAlignment = .center
        restaurantName.backgroundColor = .clear
        restaurantName.font = UIFont(name: FontCatalog.fontLevels[1], size: restaurantTitleHeight)!
        restaurantName.textColor = .black
        self.addSubview(restaurantName)
        
        restaurantLogo.backgroundColor = .clear
        restaurantLogo.contentMode = .scaleAspectFit
        self.addSubview(restaurantLogo)
    }
    
    private func setupInitialLayout() {
        restaurantName.translatesAutoresizingMaskIntoConstraints = false
        restaurantLogo.translatesAutoresizingMaskIntoConstraints = false
        
        restaurantName.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantName.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantName.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantName.heightAnchor.constraint(equalToConstant: restaurantTitleHeight).isActive = true
        
        restaurantLogo.topAnchor.constraint(equalTo: restaurantName.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantLogo.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantLogo.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantLogo.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
