//
//  AddToCartFooterView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Footer of the add to cart view controller

import Foundation
import UIKit

internal class AddToCartFooterView: UIView {
    
    // Optional Closures
    internal var order: ((_ quantity: Int, _ dishPrice: Double) -> ())?
    
    private let price: UILabel = UILabel()
    private let addToCartButton: UIButton = UIButton()
    private let addDishButton: UIButton = UIButton()
    private let reduceDishButton: UIButton = UIButton()
    
    private var dishPrice: Double = 0
    
    private var quantity: Int = 1
    
    required init(dish: Dish) {
        super.init(frame: .zero)
        
        self.dishPrice = dish.price
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        price.isPrice(price: Double(quantity) * dishPrice)
        self.addSubview(price)
        
        addToCartButton.footerButton(title: "Add \(quantity) to Cart")
        addToCartButton.addTarget(self, action: #selector(orderTapped), for: .touchUpInside)
        self.addSubview(addToCartButton)
        
        addDishButton.setImage(#imageLiteral(resourceName: "plus"), for: .normal)
        addDishButton.addTarget(self, action: #selector(add), for: .touchUpInside)
        self.addSubview(addDishButton)
        
        reduceDishButton.setImage(#imageLiteral(resourceName: "minus"), for: .normal)
        reduceDishButton.addTarget(self, action: #selector(reduce), for: .touchUpInside)
        self.addSubview(reduceDishButton)
    }
    
    private func setupInitialLayout() {
        price.translatesAutoresizingMaskIntoConstraints = false
        addToCartButton.translatesAutoresizingMaskIntoConstraints = false
        addDishButton.translatesAutoresizingMaskIntoConstraints = false
        reduceDishButton.translatesAutoresizingMaskIntoConstraints = false
        
        price.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        price.leftAnchor.constraint(equalTo: reduceDishButton.rightAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        price.rightAnchor.constraint(equalTo: addDishButton.leftAnchor, constant: -DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        price.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.priceSize).isActive = true
        
        addToCartButton.topAnchor.constraint(equalTo: price.bottomAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        addToCartButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        addToCartButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        addToCartButton.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceFromBottom).isActive = true
        
        addDishButton.centerYAnchor.constraint(equalTo: price.centerYAnchor).isActive = true
        addDishButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -(2*DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements)).isActive = true
        addDishButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.priceSize).isActive = true
        addDishButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.priceSize).isActive = true
        
        reduceDishButton.centerYAnchor.constraint(equalTo: price.centerYAnchor).isActive = true
        reduceDishButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: 2*DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        reduceDishButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.priceSize).isActive = true
        reduceDishButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.priceSize).isActive = true
    }
    
    internal func orderAltered(alteredPrice: Double) {
        dishPrice = alteredPrice
        price.text = Catalog.calculateTotalPriceOfDish(pricePerItem: dishPrice, quantity: quantity).priceInString
    }
    
    @objc func orderTapped() {
        order?(quantity, dishPrice)
    }
    
    // This function is called when add button is pressed
    @objc func add() {
        quantity += 1
        addToCartButton.setTitle("Add \(quantity) to Cart", for: .normal)
        price.text = Catalog.calculateTotalPriceOfDish(pricePerItem: dishPrice, quantity: quantity).priceInString
    }
    
    // This function is called when reduce button is pressed
    @objc func reduce() {
        if (quantity > 1) {
            quantity -= 1
            addToCartButton.setTitle("Add \(quantity) to Cart", for: .normal)
            price.text = Catalog.calculateTotalPriceOfDish(pricePerItem: dishPrice, quantity: quantity).priceInString
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
