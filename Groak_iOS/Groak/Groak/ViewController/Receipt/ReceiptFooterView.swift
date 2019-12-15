//
//  ReceiptFooterView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/12/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class ReceiptFooterView: UIView {
    // Optional Closures
    internal var saveToCameraRoll: (() -> ())?
    
    private let saveToCameraRollButton: UIButton = UIButton()
    
    required init() {
        super.init(frame: .zero)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        saveToCameraRollButton.footerButton(title: "Save to camera roll ")
        saveToCameraRollButton.addTarget(self, action: #selector(orderTapped), for: .touchUpInside)
        self.addSubview(saveToCameraRollButton)
    }
    
    private func setupInitialLayout() {
        saveToCameraRollButton.translatesAutoresizingMaskIntoConstraints = false
        
        saveToCameraRollButton.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        saveToCameraRollButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        saveToCameraRollButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        saveToCameraRollButton.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
    }
    
    @objc func orderTapped() {
        saveToCameraRoll?()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
