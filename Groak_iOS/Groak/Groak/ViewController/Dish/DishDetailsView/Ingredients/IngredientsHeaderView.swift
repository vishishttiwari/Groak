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
    private let title: UILabel = UILabel()
    private let dishName: UILabel = UILabel()
    
    private let font: UIFont = UIFont(name: FontCatalog.fontLevels[1], size: 25)!
    private let buttonDimensions: CGFloat = 25
    private let distanceFromTop: CGFloat = DimensionsCatalog.topSafeArea + 5
    
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
        
        title.text = "Main Ingredients"
        title.font = UIFont(name: FontCatalog.fontLevels[1], size: 20)!
        title.numberOfLines = 1
        title.textColor = .black
        title.textAlignment = .center
        self.addSubview(title)
        
        dishName.text = dishNameString
        dishName.font = font
        dishName.numberOfLines = 1
        dishName.textColor = .black
        dishName.textAlignment = .center
        self.addSubview(dishName)
    }
    
    private func setupInitialLayout() {
        backButton.translatesAutoresizingMaskIntoConstraints = false
        title.translatesAutoresizingMaskIntoConstraints = false
        dishName.translatesAutoresizingMaskIntoConstraints = false
        
        backButton.topAnchor.constraint(equalTo: self.topAnchor, constant: distanceFromTop).isActive = true
        backButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: buttonDimensions).isActive = true
        backButton.widthAnchor.constraint(equalToConstant: buttonDimensions).isActive = true
        backButton.heightAnchor.constraint(equalToConstant: buttonDimensions).isActive = true
        
        dishName.topAnchor.constraint(equalTo: self.topAnchor, constant: distanceFromTop).isActive = true
        dishName.leftAnchor.constraint(equalTo: self.leftAnchor, constant: (2*buttonDimensions + 10)).isActive = true
        dishName.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -(2*buttonDimensions + 10)).isActive = true
        dishName.heightAnchor.constraint(equalToConstant: buttonDimensions).isActive = true
        
        title.topAnchor.constraint(equalTo: dishName.bottomAnchor, constant: 15).isActive = true
        title.leftAnchor.constraint(equalTo: self.leftAnchor, constant: buttonDimensions).isActive = true
        title.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -buttonDimensions).isActive = true
        title.heightAnchor.constraint(equalToConstant: buttonDimensions).isActive = true
    }
    
    @objc func back() {
        dismiss?()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
