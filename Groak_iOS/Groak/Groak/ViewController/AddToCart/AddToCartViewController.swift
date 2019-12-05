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
    private var addToCartOptions: AddToCartOptionsView?
    private var footer: AddToCartFooterView?
    
    required init(restaurant: Restaurant, dish: Dish) {
        super.init(nibName: nil, bundle: nil)
        
        self.view.backgroundColor = .white
        
        header = AddToCartHeaderView.init(dish: dish)
        footer = AddToCartFooterView.init(dish: dish)
        addToCartOptions = AddToCartOptionsView.init(dish: dish, viewController: self)
        
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
        
        footer?.order = { (_ count: Int, _ dishCost: Double) -> () in
            if let options = self.addToCartOptions!.getSelections() {
                let cartItem: CartItem = CartItem.init(dishName: dish.name, costPerItem: dishCost, quantity: count, options:options)
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
        self.view.addSubview(addToCartOptions!)

        addToCartOptions?.cartAltered = { (_ price: Double) -> () in
            self.footer?.orderAltered(alteredPrice: price)
        }
        
        addToCartOptions?.translatesAutoresizingMaskIntoConstraints = false
        addToCartOptions?.topAnchor.constraint(equalTo: header!.bottomAnchor).isActive = true
        addToCartOptions?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        addToCartOptions?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        addToCartOptions?.bottomAnchor.constraint(equalTo: footer!.topAnchor).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

