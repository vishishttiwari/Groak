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
    
    var specialRequestButton: SpecialRequestButton?
        
    init(restaurant: Restaurant) {
        super.init(nibName: nil, bundle: nil)

        DimensionsCatalog.tabBarHeight = tabBar.frame.height + DimensionsCatalog.bottomSafeArea

        self.view.backgroundColor = .white

        tabBar.tintColor = ColorsCatalog.themeColor
        tabBar.barTintColor = .white
        tabBar.isTranslucent = false
        
        let menu = MenuViewController.init(restaurant: restaurant)
        let menuIcon = UITabBarItem(title: "Menu", image: #imageLiteral(resourceName: "menu2"), selectedImage: #imageLiteral(resourceName: "menu2"))
        menu.tabBarItem = menuIcon
        
        let cart = CartViewController()
        let cartIcon = UITabBarItem(title: "Cart", image: #imageLiteral(resourceName: "cart4"), selectedImage: #imageLiteral(resourceName: "cart4"))
        cart.tabBarItem = cartIcon
        cart.tabBarItem.badgeColor = ColorsCatalog.themeColor
        cart.tabBarItem.badgeValue = String(LocalRestaurant.cart.dishes.count)
        
        let order = OrderViewController.init(restaurant: restaurant)
        let orderIcon = UITabBarItem(title: "Table Order", image: #imageLiteral(resourceName: "table"), selectedImage: #imageLiteral(resourceName: "table"))
        order.tabBarItem = orderIcon
        
        let covid = CovidViewController.init(restaurant: restaurant)
        let covidIcon = UITabBarItem(title: "Covid", image: #imageLiteral(resourceName: "covid"), selectedImage: #imageLiteral(resourceName: "covid"))
        covid.tabBarItem = covidIcon
        
        let controllers = [menu, cart, order, covid]
        self.viewControllers = controllers
        
        selectedIndex = 0
        
        specialRequestButton = SpecialRequestButton(viewController: self, restaurant: restaurant)
        specialRequestButton?.badge = AppDelegate.badgeCountRequest
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
        let tabBarItem = tabBar.items?[1]
        tabBarItem?.badgeValue = String(LocalRestaurant.cart.dishes.count)
        let subView = tabBar.subviews[2].subviews.first as! UIImageView
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
    func updateCart() {
        let tabBarItem = tabBar.items?[1]
        tabBarItem?.badgeValue = String(LocalRestaurant.cart.dishes.count)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
