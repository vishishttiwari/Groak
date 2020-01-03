//
//  TabbarViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/9/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This sets up the tabbarview controller which is used for showing cart, order and menu

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
        let cartIcon = UITabBarItem(title: "Cart", image: #imageLiteral(resourceName: "cart4"), selectedImage: #imageLiteral(resourceName: "cart4"))
        cart.tabBarItem = cartIcon
        cart.tabBarItem.badgeColor = ColorsCatalog.themeColor
        cart.tabBarItem.badgeValue = String(LocalRestaurant.cart.dishes.count)
        
        let menu = MenuViewController.init(restaurant: restaurant)
        let menuIcon = UITabBarItem(title: "Menu", image: #imageLiteral(resourceName: "menu2"), selectedImage: #imageLiteral(resourceName: "menu2"))
        menu.tabBarItem = menuIcon
        
        let order = OrderViewController.init()
        let orderIcon = UITabBarItem(title: "Table Order", image: #imageLiteral(resourceName: "table"), selectedImage: #imageLiteral(resourceName: "table"))
        order.tabBarItem = orderIcon
        
        let controllers = [cart, menu, order]
        self.viewControllers = controllers
        
        selectedIndex = 1
    }
    
    override func tabBar(_ tabBar: UITabBar, didSelect item: UITabBarItem) {

        let index = self.tabBar.items?.firstIndex(of: item)
        let subView = tabBar.subviews[index!+1].subviews.first as! UIImageView
        self.performSpringAnimation(tabImageView: subView)
    }
    
    // Func to perform spring animation on imageview
    private func performSpringAnimation(tabImageView: UIImageView) {

        UIView.animate(withDuration: 0.5, delay: 0, usingSpringWithDamping: 0.5, initialSpringVelocity: 0.5, options: .curveEaseInOut, animations: {

            tabImageView.transform = CGAffineTransform.init(scaleX: 1.4, y: 1.4)

            //reducing the size
            UIView.animate(withDuration: 0.5, delay: 0.2, usingSpringWithDamping: 0.5, initialSpringVelocity: 0.5, options: .curveEaseInOut, animations: {
                tabImageView.transform = CGAffineTransform.init(scaleX: 1, y: 1)
            })
        })
    }
    
    // Func called when item added to cart
    func addToCart() {
        let tabBarItem = tabBar.items?[0]
        tabBarItem?.badgeValue = String(LocalRestaurant.cart.dishes.count)
        let subView = tabBar.subviews[1].subviews.first as! UIImageView
        self.addToCartAnimation(tabImageView: subView)
    }
    
    // Func to perform spring animation when something is added to cart
    private func addToCartAnimation(tabImageView: UIImageView) {
        UIView.animate(withDuration: 0.5, delay: 0, usingSpringWithDamping: 0.5, initialSpringVelocity: 0.5, options: .curveEaseInOut, animations: {

            tabImageView.transform = CGAffineTransform.init(scaleX: 2, y: 2)

            //reducing the size
            UIView.animate(withDuration: 0.5, delay: 0.2, usingSpringWithDamping: 0.5, initialSpringVelocity: 0.5, options: .curveEaseInOut, animations: {
                tabImageView.transform = CGAffineTransform.init(scaleX: 1, y: 1)
            })
        })
    }
    
    // Func called when order is placed or cart is deleted
    func deleteCart() {
        let tabBarItem = tabBar.items?[0]
        tabBarItem?.badgeValue = String(LocalRestaurant.cart.dishes.count)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
