//
//  DimensionsCatalog.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/7/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Catalog file is used to access random dimension related information all across the project

import UIKit

internal class DimensionsCatalog {
    // Top and bottom safe area
    static var topSafeArea: CGFloat! = 0
    static var bottomSafeArea: CGFloat! = 0
    static var tabBarHeight: CGFloat! = 0
    
    // Sizes for different things used in project
    static let screenSize = UIScreen.main.bounds.size
    static let tableHeaderHeight: CGFloat = 50
    static let tableHeaderWithSubtitleHeight: CGFloat = 80
    static let imageHeights = 50 + round(screenSize.width/200)*100
    static let optionsViewWidth = 3 * screenSize.width/4
    static let distanceBetweenElements: CGFloat = 10
    static let cornerRadius: CGFloat = 10
    static let tableViewInsetDistance: CGFloat = -36
    static let UITableViewCellWithArrowHeight: CGFloat = 70
    
    // Sizes for headers used across project
    struct viewControllerHeaderDimensions {
        static let heightExtended: CGFloat = 100 + topSafeArea
        static let heightNormal: CGFloat = 50 + topSafeArea
        static let distanceFromTop: CGFloat = topSafeArea + 10
        static let distanceBetweenElements: CGFloat = 20
        static let titleSize: CGFloat = 30
    }
    
    // Sizes for footers used across project
    struct viewControllerFooterDimensions {
        static let heightExtended: CGFloat = 140 + bottomSafeArea
        static let heightNormal: CGFloat = 80 + bottomSafeArea
        static let heightExtendedWithBarItem: CGFloat = 140 + viewControllerFooterDimensions.distanceBetweenElements
        static let heightNormalWithBarItem: CGFloat = 80 + viewControllerFooterDimensions.distanceBetweenElements
        static let priceSize: CGFloat = 40
        static let distanceFromBottom: CGFloat = bottomSafeArea
        static let distanceBetweenElements: CGFloat = 20
    }
    
    // Size for the height of the bottom sheet in the intro screen
    static let bottomSheetHeight = screenSize.height/2
}
