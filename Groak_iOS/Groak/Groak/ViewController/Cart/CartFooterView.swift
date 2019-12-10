//
//  CartFooterView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class CartFooterView: UIView {
    // Optional Closures
    internal var order: (() -> ())?
    
    private let price: UILabel = UILabel()
    private let orderButton: UIButton = UIButton()
    
    required init() {
        super.init(frame: .zero)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        price.isPrice(price: calculateTotalPrice())
        self.addSubview(price)
        
        orderButton.footerButton(title: "Order")
        orderButton.addTarget(self, action: #selector(orderTapped), for: .touchUpInside)
        self.addSubview(orderButton)
    }
    
    private func setupInitialLayout() {
        price.translatesAutoresizingMaskIntoConstraints = false
        orderButton.translatesAutoresizingMaskIntoConstraints = false
        
        price.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        price.centerXAnchor.constraint(equalTo: self.centerXAnchor).isActive = true
        price.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.priceSize).isActive = true
        
        orderButton.topAnchor.constraint(equalTo: price.bottomAnchor, constant: DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        orderButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        orderButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        orderButton.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
    }
    
    @objc func orderTapped() {
        order?()
    }
    
    private func calculateTotalPrice() -> Double {
        var totalPrice: Double = 0
        for dish in LocalStorage.cart.dishes {
            totalPrice += dish.totalPrice
        }
        
        return totalPrice
    }
    
    func reload() {
        price.text = calculateTotalPrice().priceInString
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
