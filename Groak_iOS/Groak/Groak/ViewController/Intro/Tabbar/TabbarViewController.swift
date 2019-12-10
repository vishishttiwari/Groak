//
//  TabbarViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/9/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class TabbarViewController: UITabBarController {
        
    init(restaurant: Restaurant) {
        super.init(nibName: nil, bundle: nil)

        DimensionsCatalog.tabBarHeight = tabBar.frame.height + DimensionsCatalog.bottomSafeArea

        self.view.backgroundColor = .white

        tabBar.tintColor = ColorsCatalog.themeColor
        tabBar.barTintColor = .white
        tabBar.isTranslucent = false
        
        let cart = CartViewController()
        let cartIcon = UITabBarItem(title: "Cart", image: #imageLiteral(resourceName: "cart"), selectedImage: #imageLiteral(resourceName: "cart"))
        cart.tabBarItem = cartIcon
        
        let menu = MenuViewController.init(restaurant: restaurant)
        let menuIcon = UITabBarItem(title: "Menu", image: #imageLiteral(resourceName: "menu"), selectedImage: #imageLiteral(resourceName: "menu"))
        menu.tabBarItem = menuIcon
        
        let order = OrderViewController.init()
        let orderIcon = UITabBarItem(title: "Table Order", image: #imageLiteral(resourceName: "table"), selectedImage: #imageLiteral(resourceName: "table"))
        order.tabBarItem = orderIcon
        
        let controllers = [cart, menu, order]
        self.viewControllers = controllers
        
        selectedIndex = 1
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
