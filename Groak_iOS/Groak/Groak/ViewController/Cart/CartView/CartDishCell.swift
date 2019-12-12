//
//  CartDishCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class CartDishCell: UITableViewCell {
    private let container: UIView = UIView()
    private let quantity: UILabel = UILabel()
    private let name: UILabel = UILabel()
    private let price: UILabel = UILabel()
    private let details: UILabel = UILabel()
    internal var dish: CartDish = CartDish.init() {
        didSet {
            name.text = dish.name
            quantity.text = "\(dish.quantity)"
            price.text = dish.price.priceInString

            var extras: [DishExtra] = []
            for extra in dish.extras {
                extras.append(DishExtra.init(cartDishExtra: extra))
            }
            details.text = Catalog.showExtras(dishExtras: extras, showSpecialInstructions: true)
        }
    }
    
    private let dishHeight: CGFloat = 20
    private let commentsHeight: CGFloat = 15
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.selectedColor()
        self.isUserInteractionEnabled = true
        
        quantity.text = ""
        quantity.font = UIFont(name: FontCatalog.fontLevels[3], size: dishHeight)
        quantity.numberOfLines = 0
        quantity.textColor = .black
        quantity.lineBreakMode = .byTruncatingTail
        quantity.textAlignment = .left
        quantity.sizeToFit()
        container.addSubview(quantity)
        
        name.text = ""
        name.font = UIFont(name: FontCatalog.fontLevels[1], size: dishHeight)
        name.numberOfLines = 0
        name.textColor = .black
        name.lineBreakMode = .byTruncatingTail
        name.textAlignment = .left
        name.sizeToFit()
        container.addSubview(name)
        
        price.text = ""
        price.font = UIFont(name: FontCatalog.fontLevels[1], size: dishHeight)
        price.numberOfLines = 0
        price.textColor = .black
        price.lineBreakMode = .byTruncatingTail
        price.textAlignment = .right
        price.sizeToFit()
        container.addSubview(price)
        
        details.text = ""
        details.font = UIFont(name: FontCatalog.fontLevels[1], size: commentsHeight)
        details.numberOfLines = 0
        details.textColor = ColorsCatalog.grayColor
        details.lineBreakMode = .byTruncatingTail
        details.textAlignment = .left
        details.sizeToFit()
        container.addSubview(details)
        
        container.backgroundColor = .white
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        quantity.translatesAutoresizingMaskIntoConstraints = false
        name.translatesAutoresizingMaskIntoConstraints = false
        price.translatesAutoresizingMaskIntoConstraints = false
        details.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
        
        quantity.topAnchor.constraint(equalTo: container.topAnchor, constant: 2*DimensionsCatalog.distanceBetweenElements).isActive = true
        quantity.leftAnchor.constraint(equalTo: container.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        quantity.heightAnchor.constraint(equalToConstant: dishHeight).isActive = true
        quantity.widthAnchor.constraint(equalToConstant: DimensionsCatalog.screenSize.width/10).isActive = true
        
        name.topAnchor.constraint(equalTo: container.topAnchor, constant: 2*DimensionsCatalog.distanceBetweenElements).isActive = true
        name.leftAnchor.constraint(equalTo: quantity.rightAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        name.heightAnchor.constraint(equalToConstant: dishHeight).isActive = true
        name.widthAnchor.constraint(equalToConstant: 2*DimensionsCatalog.screenSize.width/3).isActive = true
        name.bottomAnchor.constraint(equalTo: details.topAnchor, constant: -2*DimensionsCatalog.distanceBetweenElements).isActive = true
        
        price.topAnchor.constraint(equalTo: container.topAnchor, constant: 2*DimensionsCatalog.distanceBetweenElements).isActive = true
        price.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        price.heightAnchor.constraint(equalToConstant: dishHeight).isActive = true
        price.widthAnchor.constraint(equalToConstant: DimensionsCatalog.screenSize.width/4).isActive = true
        
        details.leftAnchor.constraint(equalTo: container.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        details.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        details.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
    }
}
