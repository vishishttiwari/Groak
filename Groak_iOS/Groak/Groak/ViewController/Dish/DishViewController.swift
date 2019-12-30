//
//  DishViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/19/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class DishViewController: ViewControllerWithPan {
    private var header: DishHeaderView?
    private var dishDetail: DishDetailsView?
    private var footer: DishFooterView = DishFooterView.init()
    
    init(restaurant: Restaurant, dish: Dish) {
        super.init(nibName: nil, bundle: nil)
        
        self.view.backgroundColor = .white
        
        setupHeader(dish: dish)
        setupFooter(restaurant: restaurant, dish: dish)
        setupDishDetail(dish: dish)
    }
    
    private func setupHeader(dish: Dish) {
        header = DishHeaderView.init(dish: dish)
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
    
    private func setupFooter(restaurant: Restaurant, dish: Dish) {
        self.view.addSubview(footer)
        
        footer.order = { () -> () in
            let controller = AddToCartViewController.init(restaurant: restaurant, dish: dish)

            self.view.coverHorizontalPresent()
            controller.modalPresentationStyle = .overCurrentContext

            DispatchQueue.main.async {
                self.present(controller, animated: false, completion: nil)
            }
        }
        
        footer.translatesAutoresizingMaskIntoConstraints = false
        footer.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        footer.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        footer.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.heightNormal).isActive = true
        footer.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    private func setupDishDetail(dish: Dish) {
        dishDetail = DishDetailsView.init(dish: dish)
        self.view.addSubview(dishDetail!)
        
        dishDetail?.ingredients = { () -> () in
            let controller = IngredientsViewController.init(dish: dish)

            self.view.coverHorizontalPresent()
            controller.modalPresentationStyle = .overCurrentContext

            DispatchQueue.main.async {
                self.present(controller, animated: false, completion: nil)
            }
        }
        
        dishDetail?.translatesAutoresizingMaskIntoConstraints = false
        dishDetail?.topAnchor.constraint(equalTo: header!.bottomAnchor).isActive = true
        dishDetail?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        dishDetail?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        dishDetail?.bottomAnchor.constraint(equalTo: footer.topAnchor).isActive = true
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
