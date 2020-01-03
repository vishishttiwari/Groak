//
//  CategoryCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/18/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class is used to represent the cell of each category in the menu header

import Foundation
import UIKit

internal class CategoryCell: UICollectionViewCell {
    internal let category: UILabel = UILabel()
    internal let container: UIView = UIView()
    
    internal var categoryHeight: CGFloat = 40
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        category.font = UIFont(name: FontCatalog.fontLevels[1], size: 18)
        category.textAlignment = .center
        category.clipsToBounds = true
        category.textColor = .black
        category.backgroundColor = .clear
        
        container.backgroundColor = .clear
        container.layer.cornerRadius = categoryHeight/2
        
        container.addSubview(category)
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        category.translatesAutoresizingMaskIntoConstraints = false
        container.translatesAutoresizingMaskIntoConstraints = false
        
        category.topAnchor.constraint(equalTo: container.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        category.leftAnchor.constraint(equalTo: container.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        category.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        category.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        container.topAnchor.constraint(equalTo: self.topAnchor, constant: 5).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -5).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
