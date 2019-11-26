//
//  SuggestionsCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/24/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class SuggestionsCell: UICollectionViewCell {
    internal let suggestion: UILabel = UILabel()
    private let container: UIView = UIView()
    
    internal var suggestionHeight: CGFloat = 20
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        suggestion.font = UIFont(name: FontCatalog.fontLevels[1], size: suggestionHeight)
        suggestion.textAlignment = .center
        suggestion.clipsToBounds = true
        suggestion.textColor = .black
        suggestion.textColor = .white
        
        container.backgroundColor = ColorsCatalog.themeColor
        container.layer.cornerRadius = suggestionHeight
        
        container.addSubview(suggestion)
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        suggestion.translatesAutoresizingMaskIntoConstraints = false
        container.translatesAutoresizingMaskIntoConstraints = false
        
        suggestion.topAnchor.constraint(equalTo: container.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        suggestion.leftAnchor.constraint(equalTo: container.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        suggestion.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        suggestion.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        container.topAnchor.constraint(equalTo: self.topAnchor, constant: 5).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -5).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
