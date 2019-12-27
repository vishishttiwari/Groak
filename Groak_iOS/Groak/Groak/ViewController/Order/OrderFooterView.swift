//
//  OrderFooterView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/5/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class OrderFooterView: UIView {
    // Optional Closures
    internal var pay: (() -> ())?
    
    private let price: UILabel = UILabel()
    private let paymentButton: UIButton = UIButton()
    
    required init() {
        super.init(frame: .zero)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        price.isPrice(price: calculateTotalPrice(index: 0))
        self.addSubview(price)
        
        paymentButton.footerButton(title: "Ready to Pay?")
        paymentButton.addTarget(self, action: #selector(payTapped), for: .touchUpInside)
        self.addSubview(paymentButton)
    }
    
    private func setupInitialLayout() {
        price.translatesAutoresizingMaskIntoConstraints = false
        paymentButton.translatesAutoresizingMaskIntoConstraints = false
        
        price.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        price.centerXAnchor.constraint(equalTo: self.centerXAnchor).isActive = true
        price.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.priceSize).isActive = true
        
        paymentButton.topAnchor.constraint(equalTo: price.bottomAnchor, constant: DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        paymentButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        paymentButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        paymentButton.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
    }
    
    @objc func payTapped() {
        pay?()
    }
    
    private func calculateTotalPrice(index: Int) -> Double {
        var totalPrice: Double = 0
        if index == 0 {
            for dish in LocalRestaurant.tableOrder.dishes {
                totalPrice += dish.price
            }
        } else if index == 1 {
            for dish in LocalRestaurant.tableOrder.dishes {
                if dish.local {
                    totalPrice += dish.price
                }
            }
        }
        
        return totalPrice
    }
    
    func reload() {
        price.text = calculateTotalPrice(index: 0).priceInString
    }
    
    func orderChanged(index: Int) {
        price.text = calculateTotalPrice(index: index).priceInString
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
