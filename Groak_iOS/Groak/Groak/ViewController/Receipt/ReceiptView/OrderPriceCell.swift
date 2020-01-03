//
//  OrderPriceCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/12/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class represents the total price cell inside receipt view controller

import Foundation
import UIKit
import Firebase

internal class OrderPriceCell: UITableViewCell {
    private let container: UIView = UIView()
    private let totalLabel: UILabel = UILabel()
    private let total: UILabel = UILabel()
    private let subtotalLabel: UILabel = UILabel()
    private let subtotal: UILabel = UILabel()
    private let salesTaxLabel: UILabel = UILabel()
    private let salesTax: UILabel = UILabel()
    
    internal var order: Order = Order.init() {
        didSet {
            var totalPrice: Double = 0
            for dish in order.dishes {
                totalPrice += dish.price
            }
            subtotal.text = totalPrice.priceInString
            salesTax.text = (totalPrice * (LocalRestaurant.restaurant.restaurant?.salesTax ?? 9)/100).priceInString
            total.text = (totalPrice + (totalPrice * (LocalRestaurant.restaurant.restaurant?.salesTax ?? 9)/100)).priceInString
        }
    }
    
    private let totalSize: CGFloat = 30
    private let othersSize: CGFloat = 15
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.isUserInteractionEnabled = false
        
        totalLabel.text = "Total"
        totalLabel.textAlignment = .left
        totalLabel.backgroundColor = .clear
        totalLabel.font = UIFont(name: FontCatalog.fontLevels[2], size: totalSize)!
        totalLabel.textColor = .black
        container.addSubview(totalLabel)
        
        total.textAlignment = .right
        total.backgroundColor = .clear
        total.font = UIFont(name: FontCatalog.fontLevels[1], size: totalSize)!
        total.textColor = .black
        container.addSubview(total)
        
        subtotalLabel.text = "Subtotal"
        subtotalLabel.textAlignment = .left
        subtotalLabel.backgroundColor = .clear
        subtotalLabel.font = UIFont(name: FontCatalog.fontLevels[1], size: othersSize)!
        subtotalLabel.textColor = .black
        container.addSubview(subtotalLabel)
        
        subtotal.textAlignment = .right
        subtotal.backgroundColor = .clear
        subtotal.font = UIFont(name: FontCatalog.fontLevels[1], size: othersSize)!
        subtotal.textColor = .black
        container.addSubview(subtotal)
        
        salesTaxLabel.text = "Sales Tax"
        salesTaxLabel.textAlignment = .left
        salesTaxLabel.backgroundColor = .clear
        salesTaxLabel.font = UIFont(name: FontCatalog.fontLevels[1], size: othersSize)!
        salesTaxLabel.textColor = .black
        container.addSubview(salesTaxLabel)
        
        salesTax.textAlignment = .right
        salesTax.backgroundColor = .clear
        salesTax.font = UIFont(name: FontCatalog.fontLevels[1], size: othersSize)!
        salesTax.textColor = .black
        container.addSubview(salesTax)
        
        container.backgroundColor = .clear
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        totalLabel.translatesAutoresizingMaskIntoConstraints = false
        total.translatesAutoresizingMaskIntoConstraints = false
        subtotalLabel.translatesAutoresizingMaskIntoConstraints = false
        subtotal.translatesAutoresizingMaskIntoConstraints = false
        salesTaxLabel.translatesAutoresizingMaskIntoConstraints = false
        salesTax.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor, constant: 3*DimensionsCatalog.distanceBetweenElements).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -3*DimensionsCatalog.distanceBetweenElements).isActive = true
        
        totalLabel.topAnchor.constraint(equalTo: container.topAnchor).isActive = true
        totalLabel.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        
        total.centerYAnchor.constraint(equalTo: totalLabel.centerYAnchor).isActive = true
        total.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        total.leftAnchor.constraint(equalTo: totalLabel.rightAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        
        subtotalLabel.topAnchor.constraint(equalTo: totalLabel.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        subtotalLabel.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        
        subtotal.centerYAnchor.constraint(equalTo: subtotalLabel.centerYAnchor).isActive = true
        subtotal.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        subtotal.leftAnchor.constraint(equalTo: subtotalLabel.rightAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        
        salesTaxLabel.topAnchor.constraint(equalTo: subtotalLabel.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        salesTaxLabel.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        salesTaxLabel.bottomAnchor.constraint(equalTo: container.bottomAnchor).isActive = true
        
        salesTax.centerYAnchor.constraint(equalTo: salesTaxLabel.centerYAnchor).isActive = true
        salesTax.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        salesTax.leftAnchor.constraint(equalTo: salesTaxLabel.rightAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
    }
}
