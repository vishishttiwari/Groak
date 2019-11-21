//
//  DishHeaderView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/19/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class DishHeaderView: UIView {
    // Optional Closures
    internal var dismiss: (() -> ())?
    
    private let backButton: UIButton = UIButton()
    private let dishTitle: UILabel = UILabel()
    private let dishPrice: UILabel = UILabel()
    
    required init(dish: Dish) {
        super.init(frame: .zero)
        
        setupViews(dish: dish)
        
        setupInitialLayout()
    }
    
    private func setupViews(dish: Dish) {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        backButton.addTarget(self, action: #selector(back), for: .touchUpInside)
        backButton.setImage(#imageLiteral(resourceName: "back"), for: .normal)
        self.addSubview(backButton)
        
        dishTitle.viewControllerHeaderTitle(title: dish.name)
        self.addSubview(dishTitle)
        
        dishPrice.viewControllerHeaderTitle(title: "Price: $\(dish.price)")
        dishPrice.font = UIFont(name: FontCatalog.fontLevels[1], size: DimensionsCatalog.viewControllerHeaderDimensions.titleSize - 4)
        dishPrice.textColor = ColorsCatalog.themeColor
        self.addSubview(dishPrice)
    }
    
    private func setupInitialLayout() {
        backButton.translatesAutoresizingMaskIntoConstraints = false
        dishTitle.translatesAutoresizingMaskIntoConstraints = false
        dishPrice.translatesAutoresizingMaskIntoConstraints = false
        
        dishTitle.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.titleDistanceFromTop).isActive = true
        dishTitle.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize + DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        dishTitle.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -(DimensionsCatalog.viewControllerHeaderDimensions.titleSize + DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements)).isActive = true
        dishTitle.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize + 5).isActive = true
        
        backButton.centerYAnchor.constraint(equalTo: dishTitle.centerYAnchor).isActive = true
        backButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        backButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        backButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        
        dishPrice.topAnchor.constraint(equalTo: dishTitle.bottomAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        dishPrice.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        dishPrice.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        dishPrice.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
    }
    
    @objc func back() {
        dismiss?()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
