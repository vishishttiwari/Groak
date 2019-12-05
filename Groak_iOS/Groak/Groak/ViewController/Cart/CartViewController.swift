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
    internal let cartView: CartView = CartView.init()
    private let footer: CartFooterView = CartFooterView.init()
    
    required init() {
        super.init(nibName: nil, bundle: nil)
        
        self.view.backgroundColor = .white
        
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
        cartView.cartItemSelected = { (_ cartItem: CartItem, _ indexInCart: Int) -> () in
            let controller = CartDetailsViewController(cartItem: cartItem, indexInCart: indexInCart)

            controller.modalTransitionStyle = .coverVertical
            controller.modalPresentationStyle = UIModalPresentationStyle.overCurrentContext

            DispatchQueue.main.async {
                self.present(controller, animated: true, completion: nil)
            }
        }
//        cartView.orderCompleted = { (_ successfully: Bool) -> () in
//            let customViewController = self.presentingViewController as? MenuViewController
//            self.dismiss(animated: true, completion: {
//                if (successfully) {
//                    Catalog.alert(vc: customViewController, title: "Order Placed", message: "Your Order has been placed")
//                } else {
//                    Catalog.alert(vc: customViewController, title: "Error while placing order", message: "An error occurred while placing order. Please try again.")
//                }
//                customViewController?.checkIfCartOrOrderExists()
//            })
//        }
//        cartView.deleted = { () -> () in
//            let customViewController = self.presentingViewController as? MenuViewController
//
//            self.dismiss(animated: true, completion: {
//                customViewController?.checkIfCartOrOrderExists()
//            })
//        }
        
        cartView.translatesAutoresizingMaskIntoConstraints = false
        cartView.topAnchor.constraint(equalTo: header.bottomAnchor).isActive = true
        cartView.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        cartView.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        cartView.bottomAnchor.constraint(equalTo: footer.topAnchor).isActive = true
    }
    
    private func setupFooter() {
        self.view.addSubview(footer)
        
        footer.order = { () -> () in
//            self.cartView.order()
        }
        
        footer.translatesAutoresizingMaskIntoConstraints = false
        footer.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        footer.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        footer.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.heightNormal).isActive = true
        footer.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    private func deleteCart() {
        LocalStorage.cartItems = []
        let customViewController1 = self.presentingViewController as? MenuViewController
        
        self.dismiss(animated: true, completion: {
            customViewController1?.checkIfCartOrOrderExists()
        })
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
