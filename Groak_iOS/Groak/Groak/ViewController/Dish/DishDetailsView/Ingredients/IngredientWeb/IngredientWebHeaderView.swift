//
//  IngredientWebHeaderView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This show the web view where google is shown showing the details of any ingredient

import Foundation
import UIKit

internal class IngredientWebHeaderView: UIView {
    
    // Optional Closures
    internal var dismiss: (() -> ())?
    
    private let backButton: UIButton = UIButton()
    private let ingredientTitle: UILabel = UILabel()
    
    required init(ingredientName: String) {
        super.init(frame: .zero)
        
        setupViews(ingredientName: ingredientName)
        
        setupInitialLayout()
    }
    
    private func setupViews(ingredientName: String) {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        backButton.addTarget(self, action: #selector(back), for: .touchUpInside)
        backButton.setImage(#imageLiteral(resourceName: "back"), for: .normal)
        self.addSubview(backButton)
        
        ingredientTitle.viewControllerHeaderTitle(title: ingredientName)
        self.addSubview(ingredientTitle)
    }
    
    private func setupInitialLayout() {
        backButton.translatesAutoresizingMaskIntoConstraints = false
        ingredientTitle.translatesAutoresizingMaskIntoConstraints = false
        
        backButton.centerYAnchor.constraint(equalTo: ingredientTitle.centerYAnchor).isActive = true
        backButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        backButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        backButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        
        ingredientTitle.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceFromTop).isActive = true
        ingredientTitle.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize + DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        ingredientTitle.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -(DimensionsCatalog.viewControllerHeaderDimensions.titleSize + DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements)).isActive = true
        ingredientTitle.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
    }
    
    @objc func back() {
        dismiss?()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
