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
    internal var order: (() -> ())?
    
    private let paymentButton: UIButton = UIButton()
    
    required init() {
        super.init(frame: .zero)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        paymentButton.footerButton(title: "Ready to Pay?")
        paymentButton.addTarget(self, action: #selector(orderTapped), for: .touchUpInside)
        self.addSubview(paymentButton)
    }
    
    private func setupInitialLayout() {
        paymentButton.translatesAutoresizingMaskIntoConstraints = false
        
        paymentButton.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        paymentButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        paymentButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        paymentButton.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
    }
    
    @objc func orderTapped() {
        order?()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
