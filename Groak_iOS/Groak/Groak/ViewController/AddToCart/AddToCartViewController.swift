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
    
    required init(restaurant: Restaurant, dish: Dish) {
        super.init(nibName: nil, bundle: nil)
        
        self.view.backgroundColor = .white
        
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
                let cartItem: CartItem = CartItem.init(dishName: dish.name, pricePerItem: dishPrice, quantity: quantity, extras: extras)
                LocalStorage.cartItems.append(cartItem)
                
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
        
        addToCartExtras?.translatesAutoresizingMaskIntoConstraints = false
        addToCartExtras?.topAnchor.constraint(equalTo: header!.bottomAnchor).isActive = true
        addToCartExtras?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        addToCartExtras?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        addToCartExtras?.bottomAnchor.constraint(equalTo: footer!.topAnchor).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

