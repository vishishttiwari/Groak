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
}

internal class CartOrderFooterView: UIView {
    // Optional Closures
    internal var buttonTapped: ((_ state: OrderOrCartState) -> ())?
    
    private let button: UIButton = UIButton()
    
    private var state: OrderOrCartState = OrderOrCartState.None
    private let cornerRadius: CGFloat = 10
    private let distanceFromEdge: CGFloat = 20
    
    required init() {
        super.init(frame: .zero)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        button.setTitle("", for: .normal)
        button.titleLabel?.font = FontCatalog.buttonFont
        button.backgroundColor = ColorsCatalog.greenColor
        button.titleLabel?.textColor = .white
        button.layer.cornerRadius = cornerRadius
        button.addTarget(self, action: #selector(orderTapped), for: .touchUpInside)
        self.addSubview(button)
    }
    
    internal func setupInitialLayout() {
        button.translatesAutoresizingMaskIntoConstraints = false
        
        button.topAnchor.constraint(equalTo: self.topAnchor, constant: distanceFromEdge).isActive = true
        button.leftAnchor.constraint(equalTo: self.leftAnchor, constant: distanceFromEdge).isActive = true
        button.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -distanceFromEdge).isActive = true
        button.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.bottomSafeArea).isActive = true
    }
    
    internal func present(state: OrderOrCartState) {
        self.state = state
        if (state == OrderOrCartState.Cart) {
            self.button.setTitle("Show Cart", for: .normal)
        } else {
            self.button.setTitle("Show Order", for: .normal)
        }
        DispatchQueue.main.async {
            UIView.animate(withDuration: TimeCatalog.animateTime, animations: {
                self.frame.origin.y = DimensionsCatalog.screenSize.height - (80 + DimensionsCatalog.bottomSafeArea)
            })
        }
    }
    
    internal func dismiss() {
        self.state = OrderOrCartState.None
        self.button.setTitle("", for: .normal)
        DispatchQueue.main.async {
            UIView.animate(withDuration: TimeCatalog.animateTime, animations: {
                self.frame.origin.y = DimensionsCatalog.screenSize.height
            })
        }
    }
    
    @objc func orderTapped() {
        buttonTapped?(self.state)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
