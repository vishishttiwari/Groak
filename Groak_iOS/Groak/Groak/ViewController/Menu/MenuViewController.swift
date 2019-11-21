//
//  Menu.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/8/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class MenuViewController: UIViewController {
    
    private var header: MenuHeaderView?
    private var menu: MenuView?
    
    private var categories: [MenuCategory] = []
    
    init(restaurant: Restaurant) {
        super.init(nibName: nil, bundle: nil)
        
        self.view.backgroundColor = .white
        
        setupHeader(restaurant: restaurant)
        setupMenu(restaurant: restaurant)
        
        downloadMenu(restaurant: restaurant)
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    private func setupHeader(restaurant: Restaurant) {
        header = MenuHeaderView.init(restaurant: restaurant)
        self.view.addSubview(header!)
        
        header?.menuSectionChanged = { (_ section: Int) -> () in
            self.menu?.sectionChanged(section: section)
        }
        header?.dismiss = { () -> () in
            self.dismiss(animated: true, completion: nil)
        }
        header?.find = { () -> () in
            let controller = SearchViewController(restaurant: restaurant, categories: self.categories)

            controller.modalTransitionStyle = .crossDissolve
            controller.modalPresentationStyle = UIModalPresentationStyle.overCurrentContext

            DispatchQueue.main.async {
                self.present(controller, animated: true, completion: nil)
            }
        }
        
        header?.translatesAutoresizingMaskIntoConstraints = false
        header?.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        header?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        header?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        header?.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.heightExtended).isActive = true
    }
    
    private func setupMenu(restaurant: Restaurant) {
        menu = MenuView.init()
        self.view.addSubview(menu!)
        
        menu?.dishChosen = { (_ dish: Dish) -> () in
            let controller = DishViewController.init(restaurant: restaurant, dish: dish)
            
            controller.modalTransitionStyle = .coverVertical
            controller.modalPresentationStyle = UIModalPresentationStyle.overCurrentContext
            
            self.present(controller, animated: true, completion: nil)
        }
        menu?.menuSectionChanged = { (_ section: Int) -> () in
            self.header?.sectionChanged(section: section)
        }
        
        menu?.translatesAutoresizingMaskIntoConstraints = false
        menu?.topAnchor.constraint(equalTo: header!.bottomAnchor).isActive = true
        menu?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        menu?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        menu?.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    private func downloadMenu(restaurant: Restaurant) {
        let fsRestaurant = FirestoreAPICallsRestaurants.init();
        
        fsRestaurant.fetchRestaurantCategoriesFirestoreAPI(restaurantReference: restaurant.reference!)
        
        fsRestaurant.dataReceivedForFetchRestaurantCategories = { (_ categories: [MenuCategory]) -> () in
            self.categories = categories
            self.header?.reloadData(categories: categories)
            self.menu?.reloadData(categories: categories)
        }
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
