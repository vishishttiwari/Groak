//
//  Menu.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/8/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This view controller is used for showing the menus

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
        
        downloadMenu()
        
        self.view.addSubview(UIView().customActivityIndicator())
    }
    
    private func setupHeader(restaurant: Restaurant) {
        header = MenuHeaderView.init(restaurant: restaurant)
        self.view.addSubview(header!)
        
        header?.menuSectionChanged = { (_ section: Int) -> () in
            self.menu?.sectionChanged(section: section)
        }
        header?.dismiss = { () -> () in
            LocalRestaurant.askToLeaveRestaurant()
        }
        header?.find = { () -> () in
            let controller = SearchViewController(restaurant: restaurant, categories: self.categories)

            controller.modalTransitionStyle = .crossDissolve
            controller.modalPresentationStyle = .overCurrentContext

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
        
        // When dish is selected...if there is no info to show for the dish except the image
        // then the user is taken directly to ordering..otherwise infor is shown first
        menu?.dishSelected = { (_ dish: Dish) -> () in
            let controller: UIViewController?
            if dish.ingredients.count == 0 &&
                dish.dishDescription.count == 0 &&
                !dish.restrictionsExist() &&
                !dish.nutritionExist()
            {
                controller = AddToCartViewController.init(restaurant: restaurant, dish: dish)
            } else {
                controller = DishViewController.init(restaurant: restaurant, dish: dish)
            }
            if let controller = controller {
                self.view.coverHorizontalPresent()
                controller.modalPresentationStyle = .overCurrentContext

                DispatchQueue.main.async {
                    self.present(controller, animated: false, completion: nil)
                }
            }
        }
        // This is used for changing the cell selected in header when the menu category being shown is changed
        menu?.menuSectionChanged = { (_ section: Int) -> () in
            self.header?.sectionChanged(section: section)
        }
        menu?.specialRequests = { () -> () in
            let controller = SpecialRequestsViewController(restaurant: restaurant)

            self.view.coverHorizontalPresent()
            controller.modalPresentationStyle = .overCurrentContext

            DispatchQueue.main.async {
                self.present(controller, animated: false, completion: nil)
            }
        }
        
        menu?.translatesAutoresizingMaskIntoConstraints = false
        menu?.topAnchor.constraint(equalTo: header!.bottomAnchor).isActive = true
        menu?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        menu?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        menu?.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    // This function is used for downloading the menu...it also deletes the loading indicator.
    private func downloadMenu() {
        let fsRestaurant = FirestoreAPICallsRestaurants.init();
        
        fsRestaurant.fetchRestaurantCategoriesFirestoreAPI()
        
        fsRestaurant.dataReceivedForFetchRestaurantCategories = { (_ categories: [MenuCategory]) -> () in
            self.view.hideLoader(hideFrom: self.view)
            self.categories = categories
            self.header?.reloadData(categories: categories)
            self.menu?.reloadData(categories: categories)
        }
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
