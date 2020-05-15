//
//  CartHeaderView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class the represents the header view of cart view

import Foundation
import UIKit

internal class CartHeaderView: UIView {
    
    // Optional Closures
    internal var dismiss: (() -> ())?
    internal var delete: (() -> ())?
    
    private let backButton: UIButton = UIButton()
    internal let deleteButton: UIButton = UIButton()
    private let title: UILabel = UILabel()
    
    required init() {
        super.init(frame: .zero)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        backButton.addTarget(self, action: #selector(back), for: .touchUpInside)
        backButton.setTitle("Leave", for: .normal)
        backButton.setTitleColor(ColorsCatalog.themeColor, for: .normal)
        backButton.titleLabel?.font = UIFont(name: FontCatalog.fontLevels[1], size: 18)
        self.addSubview(backButton)
        
        deleteButton.addTarget(self, action: #selector(deleteCart), for: .touchUpInside)
        deleteButton.setImage(#imageLiteral(resourceName: "delete"), for: .normal)
        self.addSubview(deleteButton)
        
        title.viewControllerHeaderTitle(title: "Your Cart")
        self.addSubview(title)
    }
    
    private func setupInitialLayout() {
        backButton.translatesAutoresizingMaskIntoConstraints = false
        deleteButton.translatesAutoresizingMaskIntoConstraints = false
        title.translatesAutoresizingMaskIntoConstraints = false
        
        title.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceFromTop).isActive = true
        title.leftAnchor.constraint(equalTo: backButton.rightAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        title.rightAnchor.constraint(equalTo: deleteButton.leftAnchor, constant: -DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        title.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        
        backButton.centerYAnchor.constraint(equalTo: title.centerYAnchor).isActive = true
        backButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        backButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize + 20).isActive = true
        backButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        
        deleteButton.centerYAnchor.constraint(equalTo: title.centerYAnchor).isActive = true
        deleteButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        deleteButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        deleteButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
    }
    
    @objc func back() {
        dismiss?()
    }
    
    @objc func deleteCart() {
        delete?()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
