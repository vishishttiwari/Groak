//
//  TextCovidCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 6/21/20.
//  Copyright © 2020 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class TextCovidCell: UITableViewCell {
    internal var label: UILabel = UILabel.init()
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
        
        label.text = ""
        label.font = UIFont(name: FontCatalog.fontLevels[1], size: 20)
        label.numberOfLines = 0
        label.textColor = .black
        label.lineBreakMode = .byTruncatingTail
        label.textAlignment = .left
        label.sizeToFit()
        container.addSubview(label)
        
        container.backgroundColor = .white
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        label.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        label.topAnchor.constraint(equalTo: container.topAnchor).isActive = true
        label.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        label.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        label.bottomAnchor.constraint(equalTo: container.bottomAnchor).isActive = true
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
