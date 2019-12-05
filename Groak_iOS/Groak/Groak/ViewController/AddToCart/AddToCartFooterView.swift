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
    
    private let cost: UILabel = UILabel()
    private let addToCartButton: UIButton = UIButton()
    private let addDishButton: UIButton = UIButton()
    private let reduceDishButton: UIButton = UIButton()
    
    private var dishCost: Double = 0
    
    private var count: Int = 1
    
    required init(dish: Dish) {
        super.init(frame: .zero)
        
        self.dishCost = dish.price
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        cost.text = "$\(Double(count) * dishCost)"
        cost.font = UIFont(name: FontCatalog.fontLevels[0], size: DimensionsCatalog.viewControllerFooterDimensions.costSize)
        cost.numberOfLines = 0
        cost.textColor = .black
        cost.backgroundColor = .clear
        cost.lineBreakMode = .byTruncatingTail
        cost.textAlignment = .center
        self.addSubview(cost)
        
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
        cost.translatesAutoresizingMaskIntoConstraints = false
        addToCartButton.translatesAutoresizingMaskIntoConstraints = false
        addDishButton.translatesAutoresizingMaskIntoConstraints = false
        reduceDishButton.translatesAutoresizingMaskIntoConstraints = false
        
        cost.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        cost.leftAnchor.constraint(equalTo: reduceDishButton.rightAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        cost.rightAnchor.constraint(equalTo: addDishButton.leftAnchor, constant: -DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        cost.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.costSize).isActive = true
        
        addToCartButton.topAnchor.constraint(equalTo: cost.bottomAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        addToCartButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        addToCartButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        addToCartButton.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceFromBottom).isActive = true
        
        addDishButton.centerYAnchor.constraint(equalTo: cost.centerYAnchor).isActive = true
        addDishButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -(2*DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements)).isActive = true
        addDishButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.costSize).isActive = true
        addDishButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.costSize).isActive = true
        
        reduceDishButton.centerYAnchor.constraint(equalTo: cost.centerYAnchor).isActive = true
        reduceDishButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: 2*DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        reduceDishButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.costSize).isActive = true
        reduceDishButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.costSize).isActive = true
    }
    
    internal func orderAltered(alteredPrice: Double) {
        dishCost = alteredPrice
        cost.text = "$\(round(Double(count) * dishCost * 100)/100)"
    }
    
    @objc func orderTapped() {
        order?(count, dishCost)
    }
    
    @objc func add() {
        count += 1
        addToCartButton.setTitle("Add \(count) to Order", for: .normal)
        cost.text = "$\(round(Double(count) * dishCost * 100)/100)"
    }
    
    @objc func reduce() {
        if (count > 1) {
            count -= 1
            addToCartButton.setTitle("Add \(count) to Order", for: .normal)
            cost.text = "$\(round(Double(count) * dishCost * 100)/100)"
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
