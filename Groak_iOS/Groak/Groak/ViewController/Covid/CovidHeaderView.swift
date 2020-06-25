//
//  CovidHeaderView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 6/21/20.
//  Copyright © 2020 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class CovidHeaderView: UIView {
    
    // Optional Closures
    internal var dismiss: (() -> ())?
    
    private let backButton: UIButton = UIButton()
    private let title: UILabel = UILabel()
    
    private let titleValue: String = "Covid Response"
    
    required init() {
        super.init(frame: .zero)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        backButton.addTarget(self, action: #selector(back), for: .touchUpInside)
        backButton.setTitle("Leave", for: .normal)
        backButton.setTitleColor(ColorsCatalog.themeColor, for: .normal)
        backButton.titleLabel?.font = UIFont(name: FontCatalog.fontLevels[1], size: 18)
        self.addSubview(backButton)
        
        title.viewControllerHeaderTitle(title: titleValue)
        self.addSubview(title)
    }
    
    private func setupInitialLayout() {
        backButton.translatesAutoresizingMaskIntoConstraints = false
        title.translatesAutoresizingMaskIntoConstraints = false
        
        title.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceFromTop).isActive = true
        title.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize + 2*DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        title.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -(DimensionsCatalog.viewControllerHeaderDimensions.titleSize + 2*DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements)).isActive = true
        title.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        
        backButton.centerYAnchor.constraint(equalTo: title.centerYAnchor).isActive = true
        backButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        backButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize + 20).isActive = true
        backButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
    }
    
    @objc func back() {
        dismiss?()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
