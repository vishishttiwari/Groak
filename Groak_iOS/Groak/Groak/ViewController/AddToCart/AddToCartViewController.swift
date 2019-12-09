//
//  AddToCartViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit
import CoreData

internal class AddToCartViewController: UIViewController {
    private var header: AddToCartHeaderView?
    private var addToCartExtras: AddToCartExtrasView?
    private var footer: AddToCartFooterView?
    
    private var tapGestureRecognizer: UITapGestureRecognizer?
    
    required init(restaurant: Restaurant, dish: Dish) {
        super.init(nibName: nil, bundle: nil)
        
        self.view.backgroundColor = .white
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(keyboardWillShow),
            name: UIResponder.keyboardWillShowNotification,
            object: nil
        )
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(keyboardWillHide),
            name: UIResponder.keyboardWillHideNotification,
            object: nil
        )
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(keyboardDidHide),
            name: UIResponder.keyboardDidHideNotification,
            object: nil
        )
        tapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(self.handleTap(_:)))
        tapGestureRecognizer!.cancelsTouchesInView = false
        self.view.addGestureRecognizer(tapGestureRecognizer!)
        
        header = AddToCartHeaderView.init(dish: dish)
        footer = AddToCartFooterView.init(dish: dish)
        addToCartExtras = AddToCartExtrasView.init(dish: dish, viewController: self)
        
        setupHeader()
        setupFooter(dish: dish)
        setupDishDescription(restaurant: restaurant)
    }
    
    private func setupHeader() {
        self.view.addSubview(header!)
        
        header?.dismiss = { () -> () in
            self.dismiss(animated: true, completion: nil)
        }
        
        header?.translatesAutoresizingMaskIntoConstraints = false
        header?.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        header?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        header?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        header?.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.heightNormal).isActive = true
    }
    
    private func setupFooter(dish: Dish) {
        self.view.addSubview(footer!)
        
        footer?.order = { (_ quantity: Int, _ dishPrice: Double) -> () in
            if let extras = self.addToCartExtras!.getSelections() {
                let cartDish: CartDish = CartDish.init(dishName: dish.name, pricePerItem: dishPrice, quantity: quantity, extras: extras)
                LocalStorage.cart.dishes.append(cartDish)
                
                let customViewController1 = self.presentingViewController as? DishViewController
                let customViewController2 = customViewController1?.presentingViewController as? MenuViewController
                
                self.dismiss(animated: false, completion: {
                    customViewController2?.checkIfCartOrOrderExists()
                    customViewController1?.dismiss(animated: true, completion: nil)
                })
            } else {
                Catalog.alert(vc: self, title: "Error adding to cart", message: "There was an error while adding \(dish.name) to cart. Please try again.")
            }
        }
        
        footer?.translatesAutoresizingMaskIntoConstraints = false
        footer?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        footer?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        footer?.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.heightExtended).isActive = true
        footer?.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    private func setupDishDescription(restaurant: Restaurant) {
        self.view.addSubview(addToCartExtras!)
        
        addToCartExtras?.cartAltered = { (_ price: Double) -> () in
            self.footer?.orderAltered(alteredPrice: price)
        }
        
        addToCartExtras?.frame.size.width = DimensionsCatalog.screenSize.width
        addToCartExtras?.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - DimensionsCatalog.viewControllerFooterDimensions.heightExtended
        addToCartExtras?.frame.origin.x = 0
        addToCartExtras?.frame.origin.y = DimensionsCatalog.viewControllerHeaderDimensions.heightNormal
    }
    
    // Function called when background is tapped
    @objc func handleTap(_ sender: UITapGestureRecognizer) {
        addToCartExtras?.endEditing(true)
    }
    
    @objc func keyboardWillShow(_ notification: Notification) {
        if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
            tapGestureRecognizer!.cancelsTouchesInView = true

            self.addToCartExtras?.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - keyboardFrame.cgRectValue.height
            self.addToCartExtras?.scrollToBottom()
        }
    }
    
    @objc func keyboardWillHide(_ notification: Notification) {
        addToCartExtras?.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - DimensionsCatalog.viewControllerFooterDimensions.heightExtended
    }
    
    @objc func keyboardDidHide(_ notification: Notification) {
        tapGestureRecognizer!.cancelsTouchesInView = false
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
