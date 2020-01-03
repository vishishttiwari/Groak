//
//  ReceiptHeaderView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/12/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class represents the header of the receipt view controller

import Foundation
import UIKit

internal class ReceiptHeaderView: UIView {
    
    // Optional Closures
    internal var dismiss: (() -> ())?
    internal var leave: (() -> ())?
    internal var receiptChanged: ((_ index: Int) -> ())?
    
    private let backButton: UIButton = UIButton()
    private let title: UILabel = UILabel()
    private let leaveRestaurantButton: UIButton = UIButton()
    private var showWhichOrder: UISegmentedControl?
    
    required init() {
        super.init(frame: .zero)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        backButton.addTarget(self, action: #selector(back), for: .touchUpInside)
        backButton.setImage(#imageLiteral(resourceName: "back"), for: .normal)
        self.addSubview(backButton)
        
        title.viewControllerHeaderTitle(title: "Receipt")
        self.addSubview(title)
        
        leaveRestaurantButton.addTarget(self, action: #selector(leaveRestaurant), for: .touchUpInside)
        leaveRestaurantButton.setTitle("Leave", for: .normal)
        leaveRestaurantButton.setTitleColor(ColorsCatalog.themeColor, for: .normal)
        leaveRestaurantButton.contentHorizontalAlignment = .right
        leaveRestaurantButton.titleLabel?.font = UIFont(name: FontCatalog.fontLevels[1], size: 20)
        self.addSubview(leaveRestaurantButton)
        
        showWhichOrder = UISegmentedControl.init(items: ["Table Receipt", "Your Receipt"])
        showWhichOrder?.selectedSegmentIndex = 0
        showWhichOrder?.tintColor = ColorsCatalog.themeColor
        showWhichOrder?.backgroundColor = ColorsCatalog.themeColor
        showWhichOrder?.addTarget(self, action: #selector(indexChanged(_:)), for: .valueChanged)
        self.addSubview(showWhichOrder!)
    }
    
    private func setupInitialLayout() {
        backButton.translatesAutoresizingMaskIntoConstraints = false
        title.translatesAutoresizingMaskIntoConstraints = false
        leaveRestaurantButton.translatesAutoresizingMaskIntoConstraints = false
        showWhichOrder?.translatesAutoresizingMaskIntoConstraints = false
        
        title.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceFromTop).isActive = true
        title.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize + DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        title.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -(DimensionsCatalog.viewControllerHeaderDimensions.titleSize + DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements)).isActive = true
        title.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        
        backButton.centerYAnchor.constraint(equalTo: title.centerYAnchor).isActive = true
        backButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        backButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        backButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        
        leaveRestaurantButton.centerYAnchor.constraint(equalTo: title.centerYAnchor).isActive = true
        leaveRestaurantButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        leaveRestaurantButton.widthAnchor.constraint(equalToConstant: 100).isActive = true
        leaveRestaurantButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        
        showWhichOrder?.topAnchor.constraint(equalTo: title.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        showWhichOrder?.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        showWhichOrder?.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        showWhichOrder?.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
    }
    
    @objc func back() {
        dismiss?()
    }
    
    @objc func leaveRestaurant() {
        leave?()
    }
    
    @objc func indexChanged(_ sender: UISegmentedControl) {
        switch sender.selectedSegmentIndex{
            case 0:
                receiptChanged?(0)
            case 1:
                receiptChanged?(1)
            default:
                break
            }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
