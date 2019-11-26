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
    private var container: UIView = UIView()
    private var requestString: UILabel = UILabel()
    private var time: UILabel = UILabel()
    private var isUserRequest: Bool = true
    internal var request: Request = Request.init() {
        didSet {
            requestString.text = request.request
            time.text = TimeCatalog.getTimeFromTimestamp(timestamp: request.created)
            if !request.createdByUser {
                container.backgroundColor = ColorsCatalog.shadesOfGray[2]
                requestString.textColor = .black
                time.textColor = .black
                container.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
                container.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
                container.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -10*DimensionsCatalog.distanceBetweenElements).isActive = true
                container.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
            } else {
                container.backgroundColor = ColorsCatalog.themeColor
                requestString.textColor = .white
                time.textColor = .white
                container.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
                container.leftAnchor.constraint(equalTo: self.leftAnchor, constant: 10*DimensionsCatalog.distanceBetweenElements).isActive = true
                container.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
                container.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
            }
        }
    }
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.isUserInteractionEnabled = false
        
        requestString.font = UIFont(name: FontCatalog.fontLevels[1], size: 15)
        requestString.numberOfLines = 0
        requestString.backgroundColor = .clear
        requestString.textAlignment = .left
        requestString.clipsToBounds = true
        container.addSubview(requestString)
        
        time.font = UIFont(name: FontCatalog.fontLevels[1], size: 12)
        time.backgroundColor = .clear
        time.textAlignment = .right
        time.clipsToBounds = true
        container.addSubview(time)
        
        container.backgroundColor = .clear
        container.layer.cornerRadius = DimensionsCatalog.cornerRadius
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        requestString.translatesAutoresizingMaskIntoConstraints = false
        time.translatesAutoresizingMaskIntoConstraints = false
        container.translatesAutoresizingMaskIntoConstraints = false
        
        requestString.topAnchor.constraint(equalTo: container.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        requestString.leftAnchor.constraint(equalTo: container.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        requestString.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        time.topAnchor.constraint(equalTo: requestString.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        time.leftAnchor.constraint(equalTo: container.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        time.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        time.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
