//
//  IngredientsHeaderView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class IngredientsHeaderView: UIView {
    // Optional Closures
    internal var dismiss: (() -> ())?
    
    private let backButton: UIButton = UIButton()
    private let dishTitle: UILabel = UILabel()
    private let ingredientTitle: UILabel = UILabel()
    
    required init(dishNameString: String) {
        super.init(frame: .zero)
        
        setupViews(dishNameString: dishNameString)
        
        setupInitialLayout()
    }
    
    private func setupViews(dishNameString: String) {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        backButton.addTarget(self, action: #selector(back), for: .touchUpInside)
        backButton.setImage(#imageLiteral(resourceName: "back"), for: .normal)
        self.addSubview(backButton)
        
        dishTitle.viewControllerHeaderTitle(title: dishNameString)
        self.addSubview(dishTitle)
        
        ingredientTitle.viewControllerHeaderTitle(title: "Main Ingredients")
        ingredientTitle.font = UIFont(name: FontCatalog.fontLevels[1], size: 20)!
        self.addSubview(ingredientTitle)
    }
    
    private func setupInitialLayout() {
        backButton.translatesAutoresizingMaskIntoConstraints = false
        dishTitle.translatesAutoresizingMaskIntoConstraints = false
        ingredientTitle.translatesAutoresizingMaskIntoConstraints = false
        
        backButton.centerYAnchor.constraint(equalTo: dishTitle.centerYAnchor).isActive = true
        backButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        backButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        backButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true

        dishTitle.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceFromTop).isActive = true
        dishTitle.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize + DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        dishTitle.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -(DimensionsCatalog.viewControllerHeaderDimensions.titleSize + DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements)).isActive = true
        dishTitle.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize + 5).isActive = true

        ingredientTitle.topAnchor.constraint(equalTo: dishTitle.bottomAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        ingredientTitle.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize + DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        ingredientTitle.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -(DimensionsCatalog.viewControllerHeaderDimensions.titleSize + DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements)).isActive = true
        ingredientTitle.heightAnchor.constraint(equalToConstant: 20 + 5).isActive = true
    }
    
    @objc func back() {
        dismiss?()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
