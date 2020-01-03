//
//  IngredientWebViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This function is used to show the detailed data from google for any ingredient

import Foundation
import UIKit

internal class IngredientWebViewController: ViewControllerWithPan {
    private var header: IngredientWebHeaderView?
    private var ingredientWebView: IngredientWebView?
    
    init(ingredientName: String) {
        super.init(nibName: nil, bundle: nil)
        
        self.view.backgroundColor = .white
        
        setupHeader(ingredientName: ingredientName)
        setupIngredientWebView(ingredientName: ingredientName)
    }
    
    private func setupHeader(ingredientName: String) {
        header = IngredientWebHeaderView.init(ingredientName: ingredientName)
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
    
    private func setupIngredientWebView(ingredientName: String) {
        ingredientWebView = IngredientWebView.init(ingredientName: ingredientName)
        self.view.addSubview(ingredientWebView!)
        
        ingredientWebView?.translatesAutoresizingMaskIntoConstraints = false
        ingredientWebView?.topAnchor.constraint(equalTo: header!.bottomAnchor).isActive = true
        ingredientWebView?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        ingredientWebView?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        ingredientWebView?.bottomAnchor.constraint(equalTo: self.view.bottomAnchor, constant: DimensionsCatalog.bottomSafeArea).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
