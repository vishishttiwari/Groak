//
//  CategoryCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/18/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class CategoryCell: UICollectionViewCell {
    internal let category: UILabel = UILabel()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        category.font = UIFont(name: FontCatalog.fontLevels[1], size: 18)
        category.textAlignment = .center
        category.clipsToBounds = true
        category.layer.cornerRadius = 20
        category.textColor = .black
        category.backgroundColor = ColorsCatalog.headerGrayShade
        
        self.addSubview(category)
    }
    
    private func setupInitialLayout() {
        category.translatesAutoresizingMaskIntoConstraints = false
        
        category.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        category.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        category.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        category.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
