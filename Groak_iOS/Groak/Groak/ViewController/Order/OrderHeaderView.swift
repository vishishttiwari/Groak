//
//  OrderHeaderView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/5/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class represents the header of order view

import Foundation
import UIKit

internal class OrderHeaderView: UIView {
    
    // Optional Closures
    internal var dismiss: (() -> ())?
    internal var orderChanged: ((_ index: Int) -> ())?
    
    private let backButton: UIButton = UIButton()
    private let title: UILabel = UILabel()
    var showWhichOrder: UISegmentedControl?
    
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
        
        title.viewControllerHeaderTitle(title: "Order")
        self.addSubview(title)
        
        showWhichOrder = UISegmentedControl.init(items: ["Table Order", "Your Order"])
        showWhichOrder?.isUserInteractionEnabled = false
        showWhichOrder?.selectedSegmentIndex = 0
        showWhichOrder?.tintColor = ColorsCatalog.themeColor
        showWhichOrder?.backgroundColor = ColorsCatalog.themeColor
        showWhichOrder?.addTarget(self, action: #selector(indexChanged(_:)), for: .valueChanged)
        self.addSubview(showWhichOrder!)
    }
    
    private func setupInitialLayout() {
        backButton.translatesAutoresizingMaskIntoConstraints = false
        title.translatesAutoresizingMaskIntoConstraints = false
        showWhichOrder?.translatesAutoresizingMaskIntoConstraints = false
        
        title.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceFromTop).isActive = true
        title.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize + DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        title.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -(DimensionsCatalog.viewControllerHeaderDimensions.titleSize + DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements)).isActive = true
        title.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        
        backButton.centerYAnchor.constraint(equalTo: title.centerYAnchor).isActive = true
        backButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        backButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        backButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        
        showWhichOrder?.topAnchor.constraint(equalTo: title.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        showWhichOrder?.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        showWhichOrder?.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        showWhichOrder?.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
    }
    
    @objc func back() {
        dismiss?()
    }
    
    // When the segment control changes..it sends the info to callback function
    @objc func indexChanged(_ sender: UISegmentedControl) {
        switch sender.selectedSegmentIndex{
            case 0:
                orderChanged?(0)
            case 1:
                orderChanged?(1)
            default:
                break
            }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
