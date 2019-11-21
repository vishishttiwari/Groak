//
//  IngredientWebHeaderView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class IngredientWebHeaderView: UIView {
    // Optional Closures
    internal var dismiss: (() -> ())?
    
    private let backButton: UIButton = UIButton()
    private let ingredientLabel: UILabel = UILabel()
    
    private let font: UIFont = UIFont(name: FontCatalog.fontLevels[1], size: 25)!
    private let buttonDimensions: CGFloat = 25
    private let distanceFromTop: CGFloat = DimensionsCatalog.topSafeArea + 5
    
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
        
        ingredientLabel.text = ingredientName
        ingredientLabel.font = font
        ingredientLabel.numberOfLines = 1
        ingredientLabel.textColor = .black
        ingredientLabel.textAlignment = .center
        self.addSubview(ingredientLabel)
    }
    
    private func setupInitialLayout() {
        backButton.translatesAutoresizingMaskIntoConstraints = false
        ingredientLabel.translatesAutoresizingMaskIntoConstraints = false
        
        backButton.topAnchor.constraint(equalTo: self.topAnchor, constant: distanceFromTop).isActive = true
        backButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: buttonDimensions).isActive = true
        backButton.widthAnchor.constraint(equalToConstant: buttonDimensions).isActive = true
        backButton.heightAnchor.constraint(equalToConstant: buttonDimensions).isActive = true
        
        ingredientLabel.topAnchor.constraint(equalTo: self.topAnchor, constant: distanceFromTop).isActive = true
        ingredientLabel.leftAnchor.constraint(equalTo: self.leftAnchor, constant: (2*buttonDimensions + 10)).isActive = true
        ingredientLabel.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -(2*buttonDimensions + 10)).isActive = true
        ingredientLabel.heightAnchor.constraint(equalToConstant: buttonDimensions).isActive = true
    }
    
    @objc func back() {
        dismiss?()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
