//
//  RestaurantInfo.swift
//  Groak
//
//  Created by Vishisht Tiwari on 1/13/20.
//  Copyright © 2020 Groak. All rights reserved.
//

import Foundation
import UIKit
import Firebase

internal class RestaurantInfo: UIView {
    private let restaurantName: UILabel = UILabel()
    private let restaurantLogo: UIImageView = UIImageView()
    private let restaurantAddress: UILabel = UILabel()
    private let currentDateTime: UILabel = UILabel()
    
    private let restaurantTitleHeight: CGFloat = 30
    private let restaurantTitleImageHeight: CGFloat = 100
    private let restaurantAddressHeight: CGFloat = 20
    private let currentDateTimeHeight: CGFloat = 20
    
    required init() {
        super.init(frame: CGRect.init(x: 0, y: 0, width: DimensionsCatalog.screenSize.width, height: restaurantTitleImageHeight + restaurantAddressHeight + currentDateTimeHeight))
        
        setupViews()
        
        setupInitialLayout()
    }
    
    func getHeight() -> CGFloat {
        return restaurantTitleImageHeight + restaurantAddressHeight + currentDateTimeHeight
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        
        restaurantName.text = LocalRestaurant.restaurant.restaurant?.name
        restaurantName.textAlignment = .center
        restaurantName.backgroundColor = .clear
        restaurantName.font = UIFont(name: FontCatalog.fontLevels[1], size: restaurantTitleHeight)!
        restaurantName.textColor = .black
        self.addSubview(restaurantName)
        
        restaurantAddress.text = LocalRestaurant.restaurant.restaurant?.address["formattedAddress"] as? String
        restaurantAddress.font = UIFont(name: FontCatalog.fontLevels[1], size: restaurantAddressHeight - 5)
        restaurantAddress.numberOfLines = 0
        restaurantAddress.textColor = .black
        restaurantAddress.lineBreakMode = .byTruncatingTail
        restaurantAddress.textAlignment = .center
        self.addSubview(restaurantAddress)
        
        currentDateTime.text = TimeCatalog.getDateTimeFromTimestamp(timestamp: Timestamp.init())
        currentDateTime.font = UIFont(name: FontCatalog.fontLevels[1], size: currentDateTimeHeight - 5)
        currentDateTime.numberOfLines = 0
        currentDateTime.textColor = .black
        currentDateTime.lineBreakMode = .byTruncatingTail
        currentDateTime.textAlignment = .center
        self.addSubview(currentDateTime)
    }
    
    private func setupInitialLayout() {
        restaurantName.frame.size.width = DimensionsCatalog.screenSize.width - 2*DimensionsCatalog.distanceBetweenElements
        restaurantName.frame.size.height = restaurantTitleImageHeight
        restaurantName.frame.origin.x = DimensionsCatalog.distanceBetweenElements
        restaurantName.frame.origin.y = 0
        
        restaurantAddress.frame.size.width = DimensionsCatalog.screenSize.width - 2*DimensionsCatalog.distanceBetweenElements
        restaurantAddress.frame.size.height = restaurantAddressHeight
        restaurantAddress.frame.origin.x = DimensionsCatalog.distanceBetweenElements
        restaurantAddress.frame.origin.y = restaurantName.frame.origin.y + restaurantName.frame.size.height
        
        currentDateTime.frame.size.width = DimensionsCatalog.screenSize.width - 2*DimensionsCatalog.distanceBetweenElements
        currentDateTime.frame.size.height = currentDateTimeHeight
        currentDateTime.frame.origin.x = DimensionsCatalog.distanceBetweenElements
        currentDateTime.frame.origin.y = restaurantAddress.frame.origin.y + restaurantAddress.frame.size.height
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
