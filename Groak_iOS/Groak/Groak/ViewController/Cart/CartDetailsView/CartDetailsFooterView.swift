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
    
    private let price: UILabel = UILabel()
    private let updateCartButton: UIButton = UIButton()
    
    private var cartDish: CartDish = CartDish.init()
    
    required init(cartDish: CartDish) {
        super.init(frame: .zero)
        
        self.cartDish = cartDish
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        price.text = "$\(cartDish.totalPrice)"
        price.isPrice()
        self.addSubview(price)
        
        updateCartButton.footerButton(title: "Update Cart")
        updateCartButton.addTarget(self, action: #selector(orderTapped), for: .touchUpInside)
        self.addSubview(updateCartButton)
    }
    
    private func setupInitialLayout() {
        price.translatesAutoresizingMaskIntoConstraints = false
        updateCartButton.translatesAutoresizingMaskIntoConstraints = false
        
        price.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        price.centerXAnchor.constraint(equalTo: self.centerXAnchor).isActive = true
        price.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.priceSize).isActive = true
        
        updateCartButton.topAnchor.constraint(equalTo: price.bottomAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        updateCartButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        updateCartButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        updateCartButton.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceFromBottom).isActive = true
    }
    
    @objc func orderTapped() {
        update?()
    }
    
    internal func orderAltered(cartDish: CartDish) {
        self.cartDish = cartDish
        price.text = "$\(cartDish.totalPrice)"
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
