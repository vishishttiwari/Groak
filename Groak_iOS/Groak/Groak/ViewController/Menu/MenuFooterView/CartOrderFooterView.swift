//
//  CartOrderFooterView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal enum OrderOrCartState {
    case None
    case Order
    case Cart
    case OrderCart
}

internal class CartOrderFooterView: UIView {
    // Optional Closures
    internal var buttonTapped: ((_ state: OrderOrCartState) -> ())?
    
    private let cartButton: UIButton = UIButton()
    private let orderButton: UIButton = UIButton()
    
    required init() {
        super.init(frame: .zero)
        
        setupViews()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        cartButton.footerButton(title: "Your Cart")
        cartButton.backgroundColor = ColorsCatalog.greenColor
        cartButton.addTarget(self, action: #selector(cartTapped), for: .touchUpInside)
        self.addSubview(cartButton)
        
        orderButton.footerButton(title: "Table Order")
        orderButton.backgroundColor = ColorsCatalog.greenColor
        orderButton.addTarget(self, action: #selector(orderTapped), for: .touchUpInside)
        self.addSubview(orderButton)
    }
    
    internal func present(state: OrderOrCartState) {
        if (state == OrderOrCartState.Cart) {
            self.cartButton.frame.origin.x = DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements
            self.cartButton.frame.origin.y = DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements
            self.cartButton.frame.size.width = DimensionsCatalog.screenSize.width - 2*(DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements)
            self.cartButton.frame.size.height = self.frame.height - (DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements + DimensionsCatalog.bottomSafeArea)
        } else if (state == OrderOrCartState.Order) {
            self.orderButton.frame.origin.x = DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements
            self.orderButton.frame.origin.y = DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements
            self.orderButton.frame.size.width = DimensionsCatalog.screenSize.width - 2*(DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements)
            self.orderButton.frame.size.height = self.frame.height - (DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements + DimensionsCatalog.bottomSafeArea)
        } else if (state == OrderOrCartState.OrderCart) {
            cartButton.setTitle("Cart", for: .normal)
            self.cartButton.frame.origin.x = DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements
            self.cartButton.frame.origin.y = DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements
            self.cartButton.frame.size.width = DimensionsCatalog.screenSize.width/2 - 1.5*(DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements)
            self.cartButton.frame.size.height = self.frame.height - (DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements + DimensionsCatalog.bottomSafeArea)
            
            orderButton.setTitle("Order", for: .normal)
            self.orderButton.frame.origin.x = DimensionsCatalog.screenSize.width/2 + 0.5*(DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements)
            self.orderButton.frame.origin.y = DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements
            self.orderButton.frame.size.width = DimensionsCatalog.screenSize.width/2 - 1.5*(DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements)
            self.orderButton.frame.size.height = self.frame.height - (DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements + DimensionsCatalog.bottomSafeArea)
        }
        DispatchQueue.main.async {
            UIView.animate(withDuration: TimeCatalog.animateTime, animations: {
                self.frame.origin.y = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerFooterDimensions.heightNormal
            })
        }
    }
    
    internal func dismiss() {
        DispatchQueue.main.async {
            UIView.animate(withDuration: TimeCatalog.animateTime, animations: {
                self.frame.origin.y = DimensionsCatalog.screenSize.height
            })
        }
    }
    
    @objc func cartTapped() {
        buttonTapped?(OrderOrCartState.Cart)
    }
    
    @objc func orderTapped() {
        buttonTapped?(OrderOrCartState.Order)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
