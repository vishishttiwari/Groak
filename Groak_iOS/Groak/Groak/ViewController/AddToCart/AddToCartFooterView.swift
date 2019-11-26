//
//  AddToCartFooterView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class AddToCartFooterView: UIView {
    // Optional Closures
    internal var order: ((_ count: Int, _ dishCost: Double) -> ())?
    
    private let price: UILabel = UILabel()
    private let addToCartButton: UIButton = UIButton()
    private let addDishButton: UIButton = UIButton()
    private let reduceDishButton: UIButton = UIButton()
    
    private var dishCost: Double = 0
    
    private let priceSize: CGFloat = 40
    
    private var count: Int = 1
    
    required init(dish: Dish) {
        super.init(frame: .zero)
        
        self.dishCost = dish.price
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        price.text = "$\(Double(count) * dishCost)"
        price.font = UIFont(name: FontCatalog.fontLevels[0], size: priceSize)
        price.numberOfLines = 0
        price.textColor = .black
        price.backgroundColor = .clear
        price.lineBreakMode = .byTruncatingTail
        price.textAlignment = .center
        self.addSubview(price)
        
        addToCartButton.footerButton(title: "Add \(count) to Cart")
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
        price.heightAnchor.constraint(equalToConstant: priceSize).isActive = true
        
        addToCartButton.topAnchor.constraint(equalTo: price.bottomAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        addToCartButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        addToCartButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        addToCartButton.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceFromBottom).isActive = true
        
        addDishButton.centerYAnchor.constraint(equalTo: price.centerYAnchor).isActive = true
        addDishButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -(2*DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements)).isActive = true
        addDishButton.widthAnchor.constraint(equalToConstant: priceSize).isActive = true
        addDishButton.heightAnchor.constraint(equalToConstant: priceSize).isActive = true
        
        reduceDishButton.centerYAnchor.constraint(equalTo: price.centerYAnchor).isActive = true
        reduceDishButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: 2*DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        reduceDishButton.widthAnchor.constraint(equalToConstant: priceSize).isActive = true
        reduceDishButton.heightAnchor.constraint(equalToConstant: priceSize).isActive = true
    }
    
    internal func orderAltered(alteredPrice: Double) {
        dishCost = alteredPrice
        price.text = "$\(round(Double(count) * dishCost * 100)/100)"
    }
    
    @objc func orderTapped() {
        order?(count, dishCost)
    }
    
    @objc func add() {
        count += 1
        addToCartButton.setTitle("Add \(count) to Order", for: .normal)
        price.text = "$\(round(Double(count) * dishCost * 100)/100)"
    }
    
    @objc func reduce() {
        if (count > 1) {
            count -= 1
            addToCartButton.setTitle("Add \(count) to Order", for: .normal)
            price.text = "$\(round(Double(count) * dishCost * 100)/100)"
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
