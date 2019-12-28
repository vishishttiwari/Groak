//
//  DishInfoCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/27/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class DishInfoCell: UITableViewCell {
    
    private let viewHeight: CGFloat = 20
    
    internal var dishRestrictions: [String: String] = [:] {
        didSet {
            if let vegan = dishRestrictions["vegan"], vegan == "Yes" {
                vegViewFullHeightConstraint?.isActive = true
                vegViewNoHeightConstraint?.isActive = false
                vegSymbol.isRestrictions(symbol: .VV, height: viewHeight)
                vegLabel.text = "Vegan"
            } else if let vegetarian = dishRestrictions["vegetarian"], vegetarian == "Yes" {
                vegViewFullHeightConstraint?.isActive = true
                vegViewNoHeightConstraint?.isActive = false
                vegSymbol.isRestrictions(symbol: .V, height: viewHeight)
                vegLabel.text = "Vegetarian"
            } else if let vegetarian = dishRestrictions["vegetarian"], vegetarian == "No" {
                vegViewFullHeightConstraint?.isActive = true
                vegViewNoHeightConstraint?.isActive = false
                vegSymbol.isRestrictions(symbol: .NV, height: viewHeight)
                vegLabel.text = "Non Vegetarian"
            } else {
                vegViewFullHeightConstraint?.isActive = false
                vegViewNoHeightConstraint?.isActive = true
            }
            if let glutenFree = dishRestrictions["glutenFree"], glutenFree == "Yes" {
                glutenFreeViewFullHeightConstraint?.isActive = true
                glutenFreeViewNoHeightConstraint?.isActive = false
                glutenFreeSymbol.isRestrictions(symbol: .GF, height: viewHeight)
                glutenFreeLabel.text = "Gluten Free"
            } else if let glutenFree = dishRestrictions["glutenFree"], glutenFree == "No" {
                glutenFreeViewFullHeightConstraint?.isActive = true
                glutenFreeViewNoHeightConstraint?.isActive = false
                glutenFreeSymbol.isRestrictions(symbol: .G, height: viewHeight)
                glutenFreeLabel.text = "Contains Gluten"
            } else {
                glutenFreeViewFullHeightConstraint?.isActive = false
                glutenFreeViewNoHeightConstraint?.isActive = true
            }
            if let kosher = dishRestrictions["kosher"], kosher == "Yes" {
                kosherViewFullHeightConstraint?.isActive = true
                kosherViewNoHeightConstraint?.isActive = false
                kosherSymbol.isRestrictions(symbol: .K, height: viewHeight)
                kosherLabel.text = "Kosher"
            } else if let kosher = dishRestrictions["kosher"], kosher == "No" {
                kosherViewFullHeightConstraint?.isActive = true
                kosherViewNoHeightConstraint?.isActive = false
                kosherSymbol.isRestrictions(symbol: .NK, height: viewHeight)
                kosherLabel.text = "Not Kosher"
            } else {
                kosherViewFullHeightConstraint?.isActive = false
                kosherViewNoHeightConstraint?.isActive = true
            }
        }
    }
    private let vegView: UIView = UIView()
    private let vegSymbol: UILabel = UILabel()
    private let vegLabel: UILabel = UILabel()
    private var vegViewFullHeightConstraint: NSLayoutConstraint?
    private var vegViewNoHeightConstraint: NSLayoutConstraint?
    
    private let glutenFreeView: UIView = UIView()
    private let glutenFreeSymbol: UILabel = UILabel()
    private let glutenFreeLabel: UILabel = UILabel()
    private var glutenFreeViewFullHeightConstraint: NSLayoutConstraint?
    private var glutenFreeViewNoHeightConstraint: NSLayoutConstraint?
    
    private let kosherView: UIView = UIView()
    private let kosherSymbol: UILabel = UILabel()
    private let kosherLabel: UILabel = UILabel()
    private var kosherViewFullHeightConstraint: NSLayoutConstraint?
    private var kosherViewNoHeightConstraint: NSLayoutConstraint?
    
    private let container: UIView = UIView()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.selectionStyle = .none
        self.isUserInteractionEnabled = false
        
        vegLabel.font = UIFont(name: FontCatalog.fontLevels[2], size: viewHeight - 3)
        vegLabel.numberOfLines = 0
        vegLabel.textColor = .black
        vegLabel.backgroundColor = .clear
        vegLabel.lineBreakMode = .byTruncatingTail
        vegLabel.textAlignment = .left
        vegView.addSubview(vegSymbol)
        vegView.addSubview(vegLabel)
        container.addSubview(vegView)
        
        glutenFreeLabel.font = UIFont(name: FontCatalog.fontLevels[2], size: viewHeight - 3)
        glutenFreeLabel.numberOfLines = 0
        glutenFreeLabel.textColor = .black
        glutenFreeLabel.backgroundColor = .clear
        glutenFreeLabel.lineBreakMode = .byTruncatingTail
        glutenFreeLabel.textAlignment = .left
        glutenFreeView.addSubview(glutenFreeSymbol)
        glutenFreeView.addSubview(glutenFreeLabel)
        container.addSubview(glutenFreeView)
        
        kosherLabel.font = UIFont(name: FontCatalog.fontLevels[2], size: viewHeight - 3)
        kosherLabel.numberOfLines = 0
        kosherLabel.textColor = .black
        kosherLabel.backgroundColor = .clear
        kosherLabel.lineBreakMode = .byTruncatingTail
        kosherLabel.textAlignment = .left
        kosherView.addSubview(kosherSymbol)
        kosherView.addSubview(kosherLabel)
        container.addSubview(kosherView)
        
        container.backgroundColor = .white
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        vegView.translatesAutoresizingMaskIntoConstraints = false
        vegSymbol.translatesAutoresizingMaskIntoConstraints = false
        vegLabel.translatesAutoresizingMaskIntoConstraints = false
        glutenFreeView.translatesAutoresizingMaskIntoConstraints = false
        glutenFreeSymbol.translatesAutoresizingMaskIntoConstraints = false
        glutenFreeLabel.translatesAutoresizingMaskIntoConstraints = false
        kosherView.translatesAutoresizingMaskIntoConstraints = false
        kosherSymbol.translatesAutoresizingMaskIntoConstraints = false
        kosherLabel.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        vegView.topAnchor.constraint(equalTo: container.topAnchor).isActive = true
        vegView.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        vegView.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        vegView.heightAnchor.constraint(equalToConstant: viewHeight).isActive = true
        
        vegViewFullHeightConstraint = vegView.heightAnchor.constraint(equalToConstant: viewHeight)
        vegViewFullHeightConstraint?.priority = UILayoutPriority.init(999)
        vegViewNoHeightConstraint = vegView.heightAnchor.constraint(equalToConstant: 0)
        vegViewNoHeightConstraint?.priority = UILayoutPriority.init(999)
        
        vegSymbol.topAnchor.constraint(equalTo: vegView.topAnchor).isActive = true
        vegSymbol.leftAnchor.constraint(equalTo: vegView.leftAnchor).isActive = true
        vegSymbol.widthAnchor.constraint(equalToConstant: viewHeight).isActive = true
        vegSymbol.bottomAnchor.constraint(equalTo: vegView.bottomAnchor).isActive = true
        
        vegLabel.topAnchor.constraint(equalTo: vegView.topAnchor).isActive = true
        vegLabel.leftAnchor.constraint(equalTo: vegSymbol.rightAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        vegLabel.rightAnchor.constraint(equalTo: vegView.rightAnchor).isActive = true
        vegLabel.bottomAnchor.constraint(equalTo: vegView.bottomAnchor).isActive = true
        
        glutenFreeView.topAnchor.constraint(equalTo: vegView.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        glutenFreeView.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        glutenFreeView.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        glutenFreeView.heightAnchor.constraint(equalToConstant: viewHeight).isActive = true
        
        glutenFreeViewFullHeightConstraint = glutenFreeView.heightAnchor.constraint(equalToConstant: viewHeight)
        glutenFreeViewFullHeightConstraint?.priority = UILayoutPriority.init(999)
        glutenFreeViewNoHeightConstraint = glutenFreeView.heightAnchor.constraint(equalToConstant: 0)
        glutenFreeViewNoHeightConstraint?.priority = UILayoutPriority.init(999)
        
        glutenFreeSymbol.topAnchor.constraint(equalTo: glutenFreeView.topAnchor).isActive = true
        glutenFreeSymbol.leftAnchor.constraint(equalTo: glutenFreeView.leftAnchor).isActive = true
        glutenFreeSymbol.widthAnchor.constraint(equalToConstant: viewHeight).isActive = true
        glutenFreeSymbol.bottomAnchor.constraint(equalTo: glutenFreeView.bottomAnchor).isActive = true
        
        glutenFreeLabel.topAnchor.constraint(equalTo: glutenFreeView.topAnchor).isActive = true
        glutenFreeLabel.leftAnchor.constraint(equalTo: glutenFreeSymbol.rightAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        glutenFreeLabel.rightAnchor.constraint(equalTo: glutenFreeView.rightAnchor).isActive = true
        glutenFreeLabel.bottomAnchor.constraint(equalTo: glutenFreeView.bottomAnchor).isActive = true
        
        kosherView.topAnchor.constraint(equalTo: glutenFreeView.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        kosherView.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        kosherView.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        kosherView.heightAnchor.constraint(equalToConstant: viewHeight).isActive = true
        kosherView.bottomAnchor.constraint(equalTo: container.bottomAnchor).isActive = true
        
        kosherViewFullHeightConstraint = glutenFreeView.heightAnchor.constraint(equalToConstant: viewHeight)
        kosherViewFullHeightConstraint?.priority = UILayoutPriority.init(999)
        kosherViewNoHeightConstraint = glutenFreeView.heightAnchor.constraint(equalToConstant: 0)
        kosherViewNoHeightConstraint?.priority = UILayoutPriority.init(999)
        
        kosherSymbol.topAnchor.constraint(equalTo: kosherView.topAnchor).isActive = true
        kosherSymbol.leftAnchor.constraint(equalTo: kosherView.leftAnchor).isActive = true
        kosherSymbol.widthAnchor.constraint(equalToConstant: viewHeight).isActive = true
        kosherSymbol.bottomAnchor.constraint(equalTo: kosherView.bottomAnchor).isActive = true
        
        kosherLabel.topAnchor.constraint(equalTo: kosherView.topAnchor).isActive = true
        kosherLabel.leftAnchor.constraint(equalTo: kosherSymbol.rightAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        kosherLabel.rightAnchor.constraint(equalTo: kosherView.rightAnchor).isActive = true
        kosherLabel.bottomAnchor.constraint(equalTo: kosherView.bottomAnchor).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
