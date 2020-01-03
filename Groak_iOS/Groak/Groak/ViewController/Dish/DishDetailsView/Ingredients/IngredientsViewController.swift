//
//  IngredientsViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class is used to represent the ingredients view controller

import Foundation
import UIKit

internal class IngredientsViewController: ViewControllerWithPan {
    private var header: IngredientsHeaderView?
    private var ingredients: IngredientsView?
    
    init(dish: Dish) {
        super.init(nibName: nil, bundle: nil)
        
        self.view.backgroundColor = .white
        
        setupHeader(dishName: dish.name)
        setupIngredients(dishIngredients: dish.ingredients)
    }
    
    private func setupHeader(dishName: String) {
        header = IngredientsHeaderView.init(dishNameString: dishName)
        self.view.addSubview(header!)
        
        header?.dismiss = { () -> () in
            self.view.coverHorizontalDismiss()
            self.dismiss(animated: false, completion: nil)
        }
        
        header?.translatesAutoresizingMaskIntoConstraints = false
        header?.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        header?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        header?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        header?.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.heightExtended).isActive = true
    }
    
    private func setupIngredients(dishIngredients: [String]) {
        ingredients = IngredientsView.init(dishIngredients: dishIngredients)
        self.view.addSubview(ingredients!)
        
        ingredients?.ingredientWebView = { (_ ingredientName: String) -> () in
            let controller = IngredientWebViewController.init(ingredientName: ingredientName)

            self.view.coverHorizontalPresent()
            controller.modalPresentationStyle = .overCurrentContext

            DispatchQueue.main.async {
                self.present(controller, animated: false, completion: nil)
            }
        }
        
        ingredients?.translatesAutoresizingMaskIntoConstraints = false
        ingredients?.topAnchor.constraint(equalTo: header!.bottomAnchor).isActive = true
        ingredients?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        ingredients?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        ingredients?.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
