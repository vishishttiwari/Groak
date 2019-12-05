//
//  CartDetailViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class CartDetailsViewController: UIViewController {
    private var header: CartDetailsHeaderView?
    private var cartDetailsView: CartDetailsView?
    private var footer: CartDetailsFooterView?
    
    init(cartItem: CartItem, indexInCart: Int) {
        super.init(nibName: nil, bundle: nil)
        
        setupHeader(dish: cartItem.dishName)
        setupFooter(cartItem: cartItem)
        setupCartDetails(cartItem: cartItem, indexInCart: indexInCart)
    }
    
    private func setupHeader(dish: String) {
        header = CartDetailsHeaderView.init(dishString: dish)
        self.view.addSubview(header!)
        
        header?.dismiss = { () -> () in
            self.dismiss(animated: true, completion: nil)
        }
        
        header?.translatesAutoresizingMaskIntoConstraints = false
        header?.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        header?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        header?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        header?.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.heightNormal).isActive = true
    }
    
    private func setupFooter(cartItem: CartItem) {
        footer = CartDetailsFooterView.init(cartItem: cartItem)
        self.view.addSubview(footer!)
        
        footer?.update = { () -> () in
            let customViewController1 = self.presentingViewController as? CartViewController
            
            self.dismiss(animated: true, completion: {
                customViewController1?.reload()
            })
        }
        
        footer?.translatesAutoresizingMaskIntoConstraints = false
        footer?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        footer?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        footer?.heightAnchor.constraint(equalToConstant:  DimensionsCatalog.viewControllerFooterDimensions.heightExtended).isActive = true
        footer?.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    private func setupCartDetails(cartItem: CartItem, indexInCart: Int) {
        cartDetailsView = CartDetailsView.init(cartItem: cartItem)
        self.view.addSubview(cartDetailsView!)
        
        cartDetailsView?.orderAltered = { (_ cartItem: CartItem) -> () in
            self.footer?.orderAltered(cartItem: cartItem)
            LocalStorage.cartItems[indexInCart] = cartItem
        }
        
        cartDetailsView?.translatesAutoresizingMaskIntoConstraints = false
        cartDetailsView?.topAnchor.constraint(equalTo: header!.bottomAnchor).isActive = true
        cartDetailsView?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        cartDetailsView?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        cartDetailsView?.bottomAnchor.constraint(equalTo: footer!.topAnchor).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
