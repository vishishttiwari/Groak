//
//  DishFooterView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/19/19.
//  Copyright © 2019 Groak. All rights reserved.
//
// Footer of the dish info. Also has the button to take user to all the options of the dish

import Foundation
import UIKit

internal class DishFooterView: UIView {
    
    // Optional Closures
    internal var order: (() -> ())?
    
    private let orderButton: UIButton = UIButton()
    
    required init() {
        super.init(frame: .zero)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        orderButton.footerButton(title: "Ready to Order?")
        orderButton.addTarget(self, action: #selector(orderTapped), for: .touchUpInside)
        self.addSubview(orderButton)
    }
    
    private func setupInitialLayout() {
        orderButton.translatesAutoresizingMaskIntoConstraints = false
        
        orderButton.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        orderButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        orderButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        orderButton.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceFromBottom).isActive = true
    }
    
    @objc func orderTapped() {
        order?()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
