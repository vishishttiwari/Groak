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
    
    private let fsOrders = FirestoreAPICallsOrders.init();
    
    private var tapGestureRecognizer: UITapGestureRecognizer?
    
    required init() {
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
        
        setupHeader()
        setupFooter()
        setupCartView()
    }
    
    private func setupHeader() {
        self.view.addSubview(header)
        
        header.dismiss = { () -> () in
            let customViewController1 = self.presentingViewController as? MenuViewController
            
            self.dismiss(animated: true, completion: {
                customViewController1?.checkIfCartOrOrderExists()
            })
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
            let customViewController1 = self.presentingViewController as? MenuViewController
            
            self.dismiss(animated: true, completion: {
                customViewController1?.checkIfCartOrOrderExists()
            })
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
        cartView.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - DimensionsCatalog.viewControllerFooterDimensions.heightExtended
        cartView.frame.origin.x = 0
        cartView.frame.origin.y = DimensionsCatalog.viewControllerHeaderDimensions.heightNormal
    }
    
    private func setupFooter() {
        self.view.addSubview(footer)
        
        footer.order = { () -> () in
            self.fsOrders.addOrdersFirestoreAPI()
            self.fsOrders.dataReceivedForAddOrder = { (_ success: Bool) -> () in
                if success {
                    LocalStorage.cart.delete()
                    let customViewController1 = self.presentingViewController as? MenuViewController
                    self.dismiss(animated: true, completion: {
                        customViewController1?.checkIfCartOrOrderExists()
                    })
                } else {
                    Catalog.alert(vc: self, title: "Error placing order", message: "Error placing order. Please try again.")
                }
            }
        }
        
        footer.translatesAutoresizingMaskIntoConstraints = false
        footer.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        footer.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        footer.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.heightExtended).isActive = true
        footer.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    // Function called when background is tapped
    @objc func handleTap(_ sender: UITapGestureRecognizer) {
        cartView.endEditing(true)
    }
    
    @objc func keyboardWillShow(_ notification: Notification) {
        if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
            tapGestureRecognizer!.cancelsTouchesInView = true
            
            print(keyboardFrame.cgRectValue.height)
            
            cartView.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - keyboardFrame.cgRectValue.height
            cartView.scrollToBottom()
        }
    }
    
    @objc func keyboardWillHide(_ notification: Notification) {
        cartView.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - DimensionsCatalog.viewControllerFooterDimensions.heightExtended
    }
    
    @objc func keyboardDidHide(_ notification: Notification) {
        tapGestureRecognizer!.cancelsTouchesInView = false
    }
    
    private func deleteCart() {
        LocalStorage.cart.delete()
        let customViewController1 = self.presentingViewController as? MenuViewController
        
        self.dismiss(animated: true, completion: {
            customViewController1?.checkIfCartOrOrderExists()
        })
    }
    
    func reload() {
        cartView.reloadData()
        footer.reload()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
