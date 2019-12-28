//
//  DishDescriptionCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class DishDescriptionCell: UITableViewCell {
    internal let dishDescription: UILabel = UILabel()
    private let container: UIView = UIView()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.selectionStyle = .none
        self.isUserInteractionEnabled = false
        
        dishDescription.text = ""
        dishDescription.font = UIFont(name: FontCatalog.fontLevels[1], size: 15)
        dishDescription.numberOfLines = 0
        dishDescription.textColor = .black
        dishDescription.lineBreakMode = .byTruncatingTail
        dishDescription.textAlignment = .left
        dishDescription.sizeToFit()
        container.addSubview(dishDescription)
        
        container.backgroundColor = .white
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        dishDescription.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        dishDescription.topAnchor.constraint(equalTo: container.topAnchor).isActive = true
        dishDescription.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        dishDescription.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        dishDescription.bottomAnchor.constraint(equalTo: container.bottomAnchor).isActive = true
    }
        
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
