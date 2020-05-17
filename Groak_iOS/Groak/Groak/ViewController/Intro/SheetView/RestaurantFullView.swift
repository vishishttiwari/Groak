//
//  RestaurantFullView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Class contains the view when restaurant is found either by location or clicking a restaurant

import Foundation
import UIKit

internal class RestaurantFullView: UIView {
    
    // Optional Closures
    internal var notCorrectRestaurantClosure: (() -> ())?
    
    private let restaurantName: UILabel = UILabel()
    private let restaurantLogo: UIImageView = UIImageView()
    private let notCorrectRestaurant: UIButton = UIButton()
    internal var restaurant: Restaurant = Restaurant.init() {
        didSet {
            if (restaurant.logo.count != 0) {
                restaurantLogo.isHidden = false
                restaurantLogo.loadImageUsingCache(url: restaurant.logo)
            }  else {
                restaurantLogo.isHidden = true
            }
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
        
        notCorrectRestaurant.footerButton(title: "Different Restaurant?")
        notCorrectRestaurant.titleLabel?.font = UIFont(name: FontCatalog.fontLevels[1], size: 15)!
        notCorrectRestaurant.addTarget(self, action: #selector(notCorrectRestaurantTapped), for: .touchUpInside)
        self.addSubview(notCorrectRestaurant)
    }
    
    private func setupInitialLayout() {
        restaurantName.translatesAutoresizingMaskIntoConstraints = false
        restaurantLogo.translatesAutoresizingMaskIntoConstraints = false
        notCorrectRestaurant.translatesAutoresizingMaskIntoConstraints = false
        
        restaurantName.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantName.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantName.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantName.heightAnchor.constraint(equalToConstant: restaurantTitleHeight + 5).isActive = true
        
        restaurantLogo.topAnchor.constraint(equalTo: restaurantName.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantLogo.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantLogo.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantLogo.bottomAnchor.constraint(equalTo: notCorrectRestaurant.topAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        notCorrectRestaurant.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        notCorrectRestaurant.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        notCorrectRestaurant.heightAnchor.constraint(equalToConstant: restaurantTitleHeight).isActive = true
        notCorrectRestaurant.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.bottomSafeArea).isActive = true
    }
    
    @objc func notCorrectRestaurantTapped() {
        notCorrectRestaurantClosure?()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
