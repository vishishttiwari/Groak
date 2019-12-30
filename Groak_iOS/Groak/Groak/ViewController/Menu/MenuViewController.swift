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
        
        menu?.dishSelected = { (_ dish: Dish) -> () in            
            let controller: UIViewController?
            if dish.ingredients.count == 0 &&
                dish.dishDescription.count == 0 &&
                dish.restrictions.count == 0 &&
                dish.nutrition.count == 0 &&
                dish.imageLink.count == 0
            {
                controller = AddToCartViewController.init(restaurant: restaurant, dish: dish)
            } else {
                controller = DishViewController.init(restaurant: restaurant, dish: dish)
            }
            if let controller = controller {
                controller.modalTransitionStyle = .coverVertical
                controller.modalPresentationStyle = UIModalPresentationStyle.overCurrentContext

                DispatchQueue.main.async {
                    self.present(controller, animated: true, completion: nil)
                }
            }
        }
        menu?.menuSectionChanged = { (_ section: Int) -> () in
            self.header?.sectionChanged(section: section)
        }
        menu?.specialRequests = { () -> () in
            let controller = SpecialRequestsViewController(restaurant: restaurant)

            controller.modalTransitionStyle = .coverVertical
            controller.modalPresentationStyle = UIModalPresentationStyle.overCurrentContext

            DispatchQueue.main.async {
                self.present(controller, animated: true, completion: nil)
            }
        }
        
        menu?.translatesAutoresizingMaskIntoConstraints = false
        menu?.topAnchor.constraint(equalTo: header!.bottomAnchor).isActive = true
        menu?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        menu?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        menu?.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
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
