//
//  SearchViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/19/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class is used to represent the Search view controller

import Foundation
import UIKit

internal class SearchViewController: UIViewController {
    
    private var header: SearchHeaderView?
    private var darkBackground: UIView = UIView()
    private var menu: SearchMenuView?
    
    init(restaurant: Restaurant, categories: [MenuCategory]) {
        super.init(nibName: nil, bundle: nil)
        
        setupHeader(restaurant: restaurant, categories: categories)
        setupDarkBackground()
        setupMenu(restaurant: restaurant)
    }
    
    private func setupHeader(restaurant: Restaurant, categories: [MenuCategory]) {
        header = SearchHeaderView.init(restaurant: restaurant)
        header?.isHidden = false
        self.view.addSubview(header!)
        
        // When it is edited and there are more than 2 letters then the matching dishes are shown
        header?.searchBarEdited = { (_ searchText: String) -> () in
            if searchText.count >= 2 {
                let newCategories = self.getAllDishes(searchText: searchText, categories: categories)
                if newCategories.count <= 0 {
                    self.menu?.isHidden = true
                } else {
                    self.menu?.isHidden = false
                    self.menu?.reloadData(categories: newCategories, searchText: searchText)
                }
            } else {
                self.menu?.isHidden = true
            }
        }
        header?.dismiss = { () -> () in
            self.dismiss(animated: true, completion: nil)
        }
        
        header?.translatesAutoresizingMaskIntoConstraints = false
        header?.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        header?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        header?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        header?.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.heightExtended).isActive = true
    }
    
    // Sets up the dark background. It also has a tap handler which dismisses the view controller
    private func setupDarkBackground() {
        darkBackground.addDarkInBackground(alpha: 0.5)
        let tap = UITapGestureRecognizer(target: self, action: #selector(self.handleTap(_:)))
        darkBackground.addGestureRecognizer(tap)
        self.view.addSubview(darkBackground)
        
        darkBackground.translatesAutoresizingMaskIntoConstraints = false
        darkBackground.topAnchor.constraint(equalTo: header!.bottomAnchor).isActive = true
        darkBackground.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        darkBackground.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        darkBackground.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    private func setupMenu(restaurant: Restaurant) {
        menu = SearchMenuView.init()
        menu?.isHidden = true
        self.view.addSubview(menu!)
        
        menu?.dishSelected = { (_ dish: Dish) -> () in
            let controller = DishViewController.init(restaurant: restaurant, dish: dish)
            
            self.view.coverHorizontalPresent()
            controller.modalPresentationStyle = .overCurrentContext
            
            self.present(controller, animated: false, completion: nil)
        }
        menu?.removeKeyboard = { () -> () in
            self.view.endEditing(true)
        }
        
        menu?.translatesAutoresizingMaskIntoConstraints = false
        menu?.topAnchor.constraint(equalTo: header!.bottomAnchor).isActive = true
        menu?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        menu?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        menu?.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    // This gets all the categories with dishes that match the text anywhere in the name
    private func getAllDishes(searchText: String, categories: [MenuCategory]) -> [MenuCategory] {
        var newCategories: [MenuCategory] = []
        for category in categories {
            
            let newCategory: MenuCategory = MenuCategory.init()
            newCategory.name = category.name
            
            for dish in category.dishes {
                if dish.name.lowercased().contains(searchText.lowercased()) {
                    newCategory.dishes.append(dish)
                }
            }
            
            if newCategory.dishes.count > 0 {
                newCategories.append(newCategory)
            }
        }
        return newCategories
    }
    
    @objc func handleTap(_ sender: UITapGestureRecognizer){
        self.dismiss(animated: true, completion: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
