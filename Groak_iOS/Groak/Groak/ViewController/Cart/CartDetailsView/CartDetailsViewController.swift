//
//  CartDetailViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class represents the details view of each dish in cart

import Foundation
import UIKit

internal class CartDetailsViewController: ViewControllerWithPan {
    private var header: CartDetailsHeaderView?
    private var cartDetailsView: CartDetailsView?
    private var footer: CartDetailsFooterView?
    
    private var tapGestureRecognizer: UITapGestureRecognizer?
    
    init(cartDish: CartDish, indexInCart: Int) {
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
        
        setupHeader(dish: cartDish.name)
        setupFooter(cartDish: cartDish, indexInCart: indexInCart)
        setupCartDetails(cartDish: cartDish)
    }
    
    private func setupHeader(dish: String) {
        header = CartDetailsHeaderView.init(dishString: dish)
        self.view.addSubview(header!)
        
        header?.dismiss = { () -> () in
            self.view.coverHorizontalDismiss()
            self.dismiss(animated: false, completion: nil)
        }
        
        header?.translatesAutoresizingMaskIntoConstraints = false
        header?.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        header?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        header?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        header?.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.heightNormal).isActive = true
    }
    
    private func setupFooter(cartDish: CartDish, indexInCart: Int) {
        footer = CartDetailsFooterView.init(cartDish: cartDish)
        self.view.addSubview(footer!)
        
        footer?.update = { (_ cartDish: CartDish) -> () in
            LocalRestaurant.cart.dishes[indexInCart] = cartDish
            
            let customViewController1 = self.presentingViewController as? TabbarViewController
            let customViewController2 = customViewController1?.viewControllers?[1] as? CartViewController
            
            self.dismiss(animated: false, completion: {
                if let customViewController = customViewController2 {
                    customViewController.reload()
                }
            })
        }
        
        footer?.translatesAutoresizingMaskIntoConstraints = false
        footer?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        footer?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        footer?.heightAnchor.constraint(equalToConstant:  DimensionsCatalog.viewControllerFooterDimensions.heightExtended).isActive = true
        footer?.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    private func setupCartDetails(cartDish: CartDish) {
        cartDetailsView = CartDetailsView.init(cartDish: cartDish)
        self.view.addSubview(cartDetailsView!)
        
        cartDetailsView?.orderAltered = { (_ cartDish: CartDish) -> () in
            self.footer?.orderAltered(cartDish: cartDish)
        }
        
        cartDetailsView?.frame.size.width = DimensionsCatalog.screenSize.width
        cartDetailsView?.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - DimensionsCatalog.viewControllerFooterDimensions.heightExtended
        cartDetailsView?.frame.origin.x = 0
        cartDetailsView?.frame.origin.y = DimensionsCatalog.viewControllerHeaderDimensions.heightNormal
    }
    
    // Function called when background is tapped
    @objc func handleTap(_ sender: UITapGestureRecognizer) {
        cartDetailsView?.endEditing(true)
    }
    
    // This changes the dimension of the view so that the textview is visible when the keyboard shows up
    @objc func keyboardWillShow(_ notification: Notification) {
        if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
            tapGestureRecognizer!.cancelsTouchesInView = true

            self.cartDetailsView?.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - keyboardFrame.cgRectValue.height
            self.cartDetailsView?.scrollToBottom()
        }
    }
    
    // When keyboard is hid...this returns the dimensions to previous dimensions
    @objc func keyboardWillHide(_ notification: Notification) {
        cartDetailsView?.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - DimensionsCatalog.viewControllerFooterDimensions.heightExtended
    }
    
    // Cancels all the tap gestures
    @objc func keyboardDidHide(_ notification: Notification) {
        tapGestureRecognizer!.cancelsTouchesInView = false
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
