//
//  OrderPrice.swift
//  Groak
//
//  Created by Vishisht Tiwari on 1/13/20.
//  Copyright © 2020 Groak. All rights reserved.
//

import Foundation
import UIKit
import Firebase

internal class OrderPrice: UIView {
    private let totalLabel: UILabel = UILabel()
    private let total: UILabel = UILabel()
    private let subtotalLabel: UILabel = UILabel()
    private let subtotal: UILabel = UILabel()
    private let salesTaxLabel: UILabel = UILabel()
    private let salesTax: UILabel = UILabel()
    private var order: Order
    
    private let totalSize: CGFloat = 35
    private let othersSize: CGFloat = 20
    
    required init(order: Order) {
        self.order = order
        
        super.init(frame: CGRect.init(x: 0, y: 0, width: DimensionsCatalog.screenSize.width, height: totalSize + 2 * othersSize + 5*DimensionsCatalog.distanceBetweenElements))
        
        setupViews()
        
        setupInitialLayout()
        
        var totalPrice: Double = 0
        for dish in order.dishes {
            totalPrice += dish.price
        }
        subtotal.text = totalPrice.priceInString
        total.text = (totalPrice + (totalPrice * (LocalRestaurant.restaurant.restaurant?.salesTax ?? 9)/100)).priceInString
        salesTax.text = ((totalPrice + (totalPrice * (LocalRestaurant.restaurant.restaurant?.salesTax ?? 9)/100)) - totalPrice).priceInString
    }
    
    func getHeight() -> CGFloat {
        return totalSize + 2 * othersSize + 5*DimensionsCatalog.distanceBetweenElements
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.isUserInteractionEnabled = false
        
        totalLabel.text = "Total"
        totalLabel.textAlignment = .left
        totalLabel.backgroundColor = .clear
        totalLabel.font = UIFont(name: FontCatalog.fontLevels[2], size: totalSize - 5)!
        totalLabel.textColor = .black
        self.addSubview(totalLabel)
        
        total.textAlignment = .right
        total.backgroundColor = .clear
        total.font = UIFont(name: FontCatalog.fontLevels[1], size: totalSize - 5)!
        total.textColor = .black
        self.addSubview(total)
        
        subtotalLabel.text = "Subtotal"
        subtotalLabel.textAlignment = .left
        subtotalLabel.backgroundColor = .clear
        subtotalLabel.font = UIFont(name: FontCatalog.fontLevels[1], size: othersSize - 5)!
        subtotalLabel.textColor = .black
        self.addSubview(subtotalLabel)
        
        subtotal.textAlignment = .right
        subtotal.backgroundColor = .clear
        subtotal.font = UIFont(name: FontCatalog.fontLevels[1], size: othersSize - 5)!
        subtotal.textColor = .black
        self.addSubview(subtotal)
        
        salesTaxLabel.text = "Sales Tax"
        salesTaxLabel.textAlignment = .left
        salesTaxLabel.backgroundColor = .clear
        salesTaxLabel.font = UIFont(name: FontCatalog.fontLevels[1], size: othersSize - 5)!
        salesTaxLabel.textColor = .black
        self.addSubview(salesTaxLabel)
        
        salesTax.textAlignment = .right
        salesTax.backgroundColor = .clear
        salesTax.font = UIFont(name: FontCatalog.fontLevels[1], size: othersSize - 5)!
        salesTax.textColor = .black
        self.addSubview(salesTax)
    }
    
    private func setupInitialLayout() {
        totalLabel.frame.size.width = DimensionsCatalog.screenSize.width/2
        totalLabel.frame.size.height = totalSize
        totalLabel.frame.origin.x = DimensionsCatalog.distanceBetweenElements
        totalLabel.frame.origin.y = 3*DimensionsCatalog.distanceBetweenElements
        
        total.frame.size.width = DimensionsCatalog.screenSize.width/3
        total.frame.size.height = totalLabel.frame.size.height
        total.frame.origin.x = DimensionsCatalog.screenSize.width - total.frame.size.width - DimensionsCatalog.distanceBetweenElements
        total.frame.origin.y = totalLabel.frame.origin.y
        
        subtotalLabel.frame.size.width = DimensionsCatalog.screenSize.width/2
        subtotalLabel.frame.size.height = othersSize
        subtotalLabel.frame.origin.x = DimensionsCatalog.distanceBetweenElements
        subtotalLabel.frame.origin.y = totalLabel.frame.origin.y + totalLabel.frame.size.height + DimensionsCatalog.distanceBetweenElements
        
        subtotal.frame.size.width = DimensionsCatalog.screenSize.width/3
        subtotal.frame.size.height = subtotalLabel.frame.size.height
        subtotal.frame.origin.x = DimensionsCatalog.screenSize.width - subtotal.frame.size.width - DimensionsCatalog.distanceBetweenElements
        subtotal.frame.origin.y = subtotalLabel.frame.origin.y
        
        salesTaxLabel.frame.size.width = DimensionsCatalog.screenSize.width/2
        salesTaxLabel.frame.size.height = othersSize
        salesTaxLabel.frame.origin.x = DimensionsCatalog.distanceBetweenElements
        salesTaxLabel.frame.origin.y = subtotalLabel.frame.origin.y + salesTaxLabel.frame.size.height + DimensionsCatalog.distanceBetweenElements
        
        salesTax.frame.size.width = DimensionsCatalog.screenSize.width/3
        salesTax.frame.size.height = salesTaxLabel.frame.size.height
        salesTax.frame.origin.x = DimensionsCatalog.screenSize.width - salesTax.frame.size.width - DimensionsCatalog.distanceBetweenElements
        salesTax.frame.origin.y = salesTaxLabel.frame.origin.y
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
