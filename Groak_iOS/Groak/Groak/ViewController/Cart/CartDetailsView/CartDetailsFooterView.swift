//
//  CartDetailFooterView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class CartDetailsFooterView: UIView {
    // Optional Closures
    internal var update: (() -> ())?
    
    private let cost: UILabel = UILabel()
    private let updateCartButton: UIButton = UIButton()
    
    private var cartItem: CartItem = CartItem.init()
    
    required init(cartItem: CartItem) {
        super.init(frame: .zero)
        
        self.cartItem = cartItem
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        cost.text = "$\(cartItem.totalCost)"
        cost.font = UIFont(name: FontCatalog.fontLevels[0], size: DimensionsCatalog.viewControllerFooterDimensions.costSize)
        cost.numberOfLines = 0
        cost.textColor = .black
        cost.backgroundColor = .clear
        cost.lineBreakMode = .byTruncatingTail
        cost.textAlignment = .center
        self.addSubview(cost)
        
        updateCartButton.footerButton(title: "Update Cart")
        updateCartButton.addTarget(self, action: #selector(orderTapped), for: .touchUpInside)
        self.addSubview(updateCartButton)
    }
    
    private func setupInitialLayout() {
        cost.translatesAutoresizingMaskIntoConstraints = false
        updateCartButton.translatesAutoresizingMaskIntoConstraints = false
        
        cost.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        cost.centerXAnchor.constraint(equalTo: self.centerXAnchor).isActive = true
        cost.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.costSize).isActive = true
        
        updateCartButton.topAnchor.constraint(equalTo: cost.bottomAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        updateCartButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        updateCartButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        updateCartButton.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceFromBottom).isActive = true
    }
    
    @objc func orderTapped() {
        update?()
    }
    
    internal func orderAltered(cartItem: CartItem) {
        self.cartItem = cartItem
        cost.text = "$\(cartItem.totalCost)"
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
