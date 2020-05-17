//
//  BottomSheetHeaderView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This has the header of the bottom sheet view. When a restaurant is found it contains Welcome to
//  and when a restaurant is not found, it contains groak

import Foundation
import UIKit

internal class BottomSheetHeaderView: UIView {
    private let groak: UILabel = UILabel()
    
    required init() {
        super.init(frame: .zero)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        groak.viewControllerHeaderTitle(title: "Select your restaurant")
        self.addSubview(groak)
    }
    
    private func setupInitialLayout() {
        groak.frame.origin.x = DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements
        groak.frame.origin.y = DimensionsCatalog.viewControllerHeaderDimensions.distanceFromTop
        groak.frame.size.width = DimensionsCatalog.screenSize.width - 2*(DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements)
        groak.frame.size.height = DimensionsCatalog.viewControllerHeaderDimensions.titleSize
    }
    
    func stateChanged(state: BottomSheetState) {
        if state == BottomSheetState.RestaurantFound {
            DispatchQueue.main.async {
                UIView.animate(withDuration: TimeCatalog.animateTime, animations: {
                    self.groak.text = "Welcome to"
                    self.groak.frame.origin.y = DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements
                    self.roundCorners([.layerMaxXMinYCorner, .layerMinXMinYCorner ], radius: 2*DimensionsCatalog.cornerRadius)
                })
            }
        } else if state == BottomSheetState.RestaurantNotFound {
            DispatchQueue.main.async {
                self.groak.text = "Select your restaurant"
                self.groak.frame.origin.y = DimensionsCatalog.viewControllerHeaderDimensions.distanceFromTop
            }
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
