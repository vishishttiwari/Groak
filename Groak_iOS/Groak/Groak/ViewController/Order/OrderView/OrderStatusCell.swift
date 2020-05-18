//
//  OrderStatusCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/5/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class represents the status cell in order view

import Foundation
import UIKit
import Firebase

internal class OrderStatusCell: UITableViewCell {
    private let container: UIView = UIView()
    internal let status: UILabel = UILabel()
    
    private let distanceBetweenElements: CGFloat = 10
    private let textHeight: CGFloat = 20
    
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
        self.isUserInteractionEnabled = false
        
        status.text = "Your order has been requested. Pending for approval."
        status.font = UIFont(name: FontCatalog.fontLevels[1], size: textHeight)
        status.numberOfLines = 0
        status.textColor = .black
        status.lineBreakMode = .byTruncatingTail
        status.textAlignment = .center
        status.sizeToFit()
        container.addSubview(status)
        
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        status.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
        
        status.topAnchor.constraint(equalTo: container.topAnchor, constant: distanceBetweenElements).isActive = true
        status.leftAnchor.constraint(equalTo: container.leftAnchor, constant: distanceBetweenElements).isActive = true
        status.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -distanceBetweenElements).isActive = true
        status.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -distanceBetweenElements).isActive = true
    }
}
