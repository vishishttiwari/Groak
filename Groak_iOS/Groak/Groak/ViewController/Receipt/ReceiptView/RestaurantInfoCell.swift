//
//  RestaurantInfoCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/12/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class represents the info cell inside receipt view controller which contains restaurant name, address and time

import Foundation
import UIKit
import Firebase

internal class RestaurantInfoCell: UITableViewCell {
    private let container: UIView = UIView()
    private let restaurantName: UILabel = UILabel()
    private let restaurantLogo: UIImageView = UIImageView()
    private let restaurantAddress: UILabel = UILabel()
    private let currentDateTime: UILabel = UILabel()
    
    private let restaurantTitleHeight: CGFloat = 30
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.isUserInteractionEnabled = false
        
        restaurantName.isHidden = LocalRestaurant.restaurant.restaurant?.logo.count != 0
        restaurantName.textAlignment = .center
        restaurantName.backgroundColor = .clear
        restaurantName.font = UIFont(name: FontCatalog.fontLevels[1], size: restaurantTitleHeight)!
        restaurantName.textColor = .black
        container.addSubview(restaurantName)
        
        restaurantLogo.loadImageUsingCache(url: LocalRestaurant.restaurant.restaurant?.logo ?? "")
        restaurantLogo.isHidden = LocalRestaurant.restaurant.restaurant?.logo.count == 0
        restaurantLogo.backgroundColor = .clear
        restaurantLogo.contentMode = .scaleAspectFit
        container.addSubview(restaurantLogo)
        
        restaurantAddress.text = LocalRestaurant.restaurant.restaurant?.address["formattedAddress"] as? String
        restaurantAddress.font = UIFont(name: FontCatalog.fontLevels[1], size: 15)
        restaurantAddress.numberOfLines = 0
        restaurantAddress.textColor = .black
        restaurantAddress.lineBreakMode = .byTruncatingTail
        restaurantAddress.textAlignment = .center
        restaurantAddress.sizeToFit()
        container.addSubview(restaurantAddress)
        
        currentDateTime.text = TimeCatalog.getDateTimeFromTimestamp(timestamp: Timestamp.init())
        currentDateTime.font = UIFont(name: FontCatalog.fontLevels[1], size: 15)
        currentDateTime.numberOfLines = 0
        currentDateTime.textColor = .black
        currentDateTime.lineBreakMode = .byTruncatingTail
        currentDateTime.textAlignment = .center
        currentDateTime.sizeToFit()
        container.addSubview(currentDateTime)
        
        container.backgroundColor = .white
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        restaurantName.translatesAutoresizingMaskIntoConstraints = false
        restaurantLogo.translatesAutoresizingMaskIntoConstraints = false
        restaurantAddress.translatesAutoresizingMaskIntoConstraints = false
        currentDateTime.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        restaurantName.topAnchor.constraint(equalTo: container.topAnchor).isActive = true
        restaurantName.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        restaurantName.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        restaurantName.heightAnchor.constraint(equalToConstant: 100).isActive = true
        
        restaurantLogo.topAnchor.constraint(equalTo: container.topAnchor).isActive = true
        restaurantLogo.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        restaurantLogo.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        restaurantLogo.heightAnchor.constraint(equalToConstant: 100).isActive = true
        
        restaurantAddress.topAnchor.constraint(equalTo: restaurantLogo.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        restaurantAddress.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        restaurantAddress.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        
        currentDateTime.topAnchor.constraint(equalTo: restaurantAddress.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        currentDateTime.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        currentDateTime.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        currentDateTime.bottomAnchor.constraint(equalTo: container.bottomAnchor).isActive = true
    }
}
