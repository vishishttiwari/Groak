//
//  SpecialRequestsCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/25/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class SpecialRequestsCell: UITableViewCell {
    private let container: UIView = UIView()
    private let requestString: UILabel = UILabel()
    private let created: UILabel = UILabel()
    private var isUserRequest: Bool?
    
    private var leadingConstraint: NSLayoutConstraint?
    private var trailingConstraint: NSLayoutConstraint?
    
    internal var request: Request = Request.init() {
        didSet {
            requestString.text = request.request
            created.text = TimeCatalog.getTimeFromTimestamp(timestamp: request.created)
            
            if !request.createdByUser {
                container.backgroundColor = ColorsCatalog.shadesOfGray[2]
                requestString.textColor = .black
                created.textColor = .black
                
                leadingConstraint?.isActive = true
                trailingConstraint?.isActive = false
            } else {
                container.backgroundColor = ColorsCatalog.themeColor
                requestString.textColor = .white
                created.textColor = .white
                
                leadingConstraint?.isActive = false
                trailingConstraint?.isActive = true
            }
        }
    }
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.isUserInteractionEnabled = false
        
        requestString.font = UIFont(name: FontCatalog.fontLevels[1], size: 15)
        requestString.numberOfLines = 0
        requestString.backgroundColor = .clear
        requestString.textAlignment = .left
        requestString.clipsToBounds = true
        container.addSubview(requestString)
        
        created.isTime()
        container.addSubview(created)
        
        container.backgroundColor = .clear
        container.layer.cornerRadius = DimensionsCatalog.cornerRadius
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        requestString.translatesAutoresizingMaskIntoConstraints = false
        created.translatesAutoresizingMaskIntoConstraints = false
        container.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        container.widthAnchor.constraint(lessThanOrEqualToConstant: 2*DimensionsCatalog.screenSize.width/3).isActive = true
        
        leadingConstraint = container.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements)
        leadingConstraint?.priority = UILayoutPriority.init(999)
        trailingConstraint = container.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements)
        trailingConstraint?.priority = UILayoutPriority.init(999)
        
        requestString.topAnchor.constraint(equalTo: container.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        requestString.leftAnchor.constraint(equalTo: container.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        requestString.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        created.topAnchor.constraint(equalTo: requestString.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        created.leftAnchor.constraint(equalTo: container.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        created.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        created.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements/2).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
