//
//  DishImageCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class is used to represent the dish image cell in the dish details view

import Foundation
import UIKit

internal class DishImageCell: UITableViewCell {
    internal var dishAvailable: Bool = Bool.init()
    internal var dishImageLink: String = "" {
        didSet {
            dishImage.loadImageUsingCache(url: dishImageLink, available: dishAvailable)
        }
    }
    private let dishImage = UIImageView()
    private let container: UIView = UIView()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    // Set the display of all the elements
    private func setupViews() {
        self.isUserInteractionEnabled = false
        
        dishImage.backgroundColor = .gray
        dishImage.clipsToBounds = true
        dishImage.contentMode = .scaleToFill
        container.addSubview(dishImage)
        
        container.backgroundColor = .white
        self.addSubview(container)
    }
    
    // Sets the contraints
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        dishImage.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        container.heightAnchor.constraint(equalToConstant: DimensionsCatalog.imageHeights).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
        
        dishImage.topAnchor.constraint(equalTo: container.topAnchor).isActive = true
        dishImage.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        dishImage.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        dishImage.bottomAnchor.constraint(equalTo: container.bottomAnchor).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
