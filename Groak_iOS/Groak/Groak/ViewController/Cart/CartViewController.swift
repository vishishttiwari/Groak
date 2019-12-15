//
//  CartViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class CartViewController: UIViewController {
    private let header: CartHeaderView = CartHeaderView.init()
    private let cartView: CartView = CartView.init()
    private let footer: CartFooterView = CartFooterView.init()
    
    private let fsOrders = LocalRestaurant.fsOrders
    
    private var tapGestureRecognizer: UITapGestureRecognizer?
    
    required init() {
        super.init(nibName: nil, bundle: nil)
        
        self.view.backgroundColor = ColorsCatalog.headerGrayShade
        
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
        
        setupHeader()
        setupFooter()
        setupCartView()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        
        PermissionsCatalog.askLocationPermission(viewController: self)
        
        if LocalRestaurant.cart.exists {
            cartView.isHidden = false
            footer.isHidden = false
            header.deleteButton.isHidden = false
            reload()
        } else {
            cartView.isHidden = true
            footer.isHidden = true
            header.deleteButton.isHidden = true
        }
    }
    
    private func setupHeader() {
        self.view.addSubview(header)
        
        header.dismiss = { () -> () in            
            LocalRestaurant.askToLeaveRestaurant()
        }
        header.delete = { () -> () in
            let alert = UIAlertController(title: "Clean the Cart", message: "Would you like to empty the cart?", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
            alert.addAction(UIAlertAction(title: "Yes", style: .default, handler: { (action) in
                self.deleteCart()
            }))
            self.present(alert, animated: true, completion: nil)
        }
        
        header.translatesAutoresizingMaskIntoConstraints = false
        header.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        header.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        header.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        header.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.heightNormal).isActive = true
    }
    
    private func setupCartView() {
        self.view.addSubview(cartView)
        
        cartView.dismiss = { () -> () in
            self.dismiss(animated: true, completion: nil)
        }
        cartView.cartDishSelected = { (_ cartDish: CartDish, _ indexInCart: Int) -> () in
            let controller = CartDetailsViewController(cartDish: cartDish, indexInCart: indexInCart)

            controller.modalTransitionStyle = .coverVertical
            controller.modalPresentationStyle = UIModalPresentationStyle.overCurrentContext

            DispatchQueue.main.async {
                self.present(controller, animated: true, completion: nil)
            }
        }
        
        cartView.frame.size.width = DimensionsCatalog.screenSize.width
        cartView.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - DimensionsCatalog.viewControllerFooterDimensions.heightExtendedWithBarItem - DimensionsCatalog.tabBarHeight
        cartView.frame.origin.x = 0
        cartView.frame.origin.y = DimensionsCatalog.viewControllerHeaderDimensions.heightNormal
    }
    
    private func setupFooter() {
        self.view.addSubview(footer)
        
        footer.order = { () -> () in
            if LocalRestaurant.cart.exists {
                self.view.addSubview(UIView().customActivityIndicator())
                self.fsOrders?.addOrdersFirestoreAPI(viewController: self)
                self.fsOrders?.dataReceivedForAddOrder = { (_ success: Bool) -> () in
                    if success {
                        LocalRestaurant.cart.delete()
                        self.view.hideLoader(hideFrom: self.view)
                        self.reload()
                        self.tabBarController?.selectedIndex = 1
                    } else {
                        Catalog.alert(vc: self, title: "Error placing order", message: "Error placing order. Please try again.")
                    }
                }
            }
            else {
                Catalog.alert(vc: self, title: "No dishes in cart", message: "Please add dishes to cart before ordering")
            }
        }
        
        footer.translatesAutoresizingMaskIntoConstraints = false
        footer.leftAnchor.constraint(equalTo: view.leftAnchor).isActive = true
        footer.rightAnchor.constraint(equalTo: view.rightAnchor).isActive = true
        footer.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.heightExtendedWithBarItem).isActive = true
        footer.bottomAnchor.constraint(equalTo: view.bottomAnchor).isActive = true
    }
    
    // Function called when background is tapped
    @objc func handleTap(_ sender: UITapGestureRecognizer) {
        cartView.endEditing(true)
    }
    
    @objc func keyboardWillShow(_ notification: Notification) {
        if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
            tapGestureRecognizer!.cancelsTouchesInView = true
            
            cartView.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - keyboardFrame.cgRectValue.height
            cartView.scrollToBottom()
        }
    }
    
    @objc func keyboardWillHide(_ notification: Notification) {
        cartView.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - DimensionsCatalog.viewControllerFooterDimensions.heightExtendedWithBarItem - DimensionsCatalog.tabBarHeight
    }
    
    @objc func keyboardDidHide(_ notification: Notification) {
        tapGestureRecognizer!.cancelsTouchesInView = false
    }
    
    private func deleteCart() {
        LocalRestaurant.cart.delete()
        reload()

        self.tabBarController?.selectedIndex = 1
    }
    
    func reload() {
        cartView.cart = LocalRestaurant.cart
        cartView.reloadData()
        footer.reload()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
