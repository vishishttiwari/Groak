//
//  AddToCartExtraOptionCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  The extra options cell is represented in this class.

import Foundation
import UIKit

internal class AddToCartExtraOptionCell: UITableViewCell {
    private let container: UIView = UIView()
    internal let label: UILabel = UILabel()
    internal let price: UILabel = UILabel()
    internal let selectBox: UIImageView = UIImageView()
    internal var singleSelectSectinon: Bool = false {
        didSet {
            if (singleSelectSectinon) {
                selectBox.image = #imageLiteral(resourceName: "uncheckCircle")
                selectBox.highlightedImage = #imageLiteral(resourceName: "checkCircle")
            } else {
                selectBox.image = #imageLiteral(resourceName: "uncheckBox")
                selectBox.highlightedImage = #imageLiteral(resourceName: "checkBox")
            }
        }
    }
    override var isSelected: Bool {
        didSet {
            if (isSelected) {
                selectBox.isHighlighted = true
            } else {
                selectBox.isHighlighted = false
            }
        }
    }
    
    private let buttonDimensions: CGFloat = 20
    private let textHeight: CGFloat = 15
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)

        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.selectedColor()
        self.backgroundColor = .white
        container.addSubview(selectBox)
        
        label.text = ""
        label.font = UIFont(name: FontCatalog.fontLevels[1], size: textHeight)
        label.textAlignment = .left
        label.textColor = .black
        container.addSubview(label)
        
        price.text = ""
        price.font = UIFont(name: FontCatalog.fontLevels[1], size: textHeight)
        price.textAlignment = .right
        price.textColor = .gray
        container.addSubview(price)
        
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        selectBox.translatesAutoresizingMaskIntoConstraints = false
        label.translatesAutoresizingMaskIntoConstraints = false
        price.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
        
        selectBox.centerYAnchor.constraint(equalTo: label.centerYAnchor).isActive = true
        selectBox.leftAnchor.constraint(equalTo: container.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        selectBox.widthAnchor.constraint(equalToConstant: buttonDimensions).isActive = true
        selectBox.heightAnchor.constraint(equalToConstant: buttonDimensions).isActive = true
        
        label.topAnchor.constraint(equalTo: container.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        label.leftAnchor.constraint(equalTo: selectBox.rightAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        label.widthAnchor.constraint(equalToConstant: 2*self.frame.width/3).isActive = true
        label.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        price.centerYAnchor.constraint(equalTo: label.centerYAnchor).isActive = true
        price.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        price.widthAnchor.constraint(equalToConstant: self.frame.width/4).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
