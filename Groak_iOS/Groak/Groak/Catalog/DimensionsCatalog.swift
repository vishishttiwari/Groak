//
//  DimensionsCatalog.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/7/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import UIKit

internal class DimensionsCatalog {
    // Top and bottom safe area
    static var topSafeArea: CGFloat! = 0
    static var bottomSafeArea: CGFloat! = 0
    
    // Sizes for different things used in project
    static let screenSize = UIScreen.main.bounds.size
    static let tableHeaderHeight: CGFloat = 50
    static let imageHeights = 50 + screenSize.width/2
    static let optionsViewWidth = 3 * screenSize.width/4
    static let distanceBetweenElements: CGFloat = 10
    
    struct viewControllerHeaderDimensions {
        static let heightExtended: CGFloat = 100 + DimensionsCatalog.topSafeArea
        static let heightNormal: CGFloat = 50 + DimensionsCatalog.topSafeArea
        static let titleDistanceFromTop: CGFloat = topSafeArea + 10
        static let distanceBetweenElements: CGFloat = 20
        static let titleSize: CGFloat = 25
    }
    
    struct viewControllerFooterDimensions {
        static let heightExtended: CGFloat = 140 + DimensionsCatalog.topSafeArea
        static let heightNormal: CGFloat = 80 + DimensionsCatalog.topSafeArea
        static let distanceBetweenElements: CGFloat = 20
    }
    
    
    // Size for the height of the bottom sheet in the intro screen
    static let bottomSheetHeight = screenSize.height/2
}
