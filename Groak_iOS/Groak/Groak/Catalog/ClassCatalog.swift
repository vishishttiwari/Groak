//
//  ClassCatalog.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class UITableViewHeader: UITableViewHeaderFooterView {
    private let background: UIView = UIView()
    internal let title: UILabel = UILabel()
    
    override init(reuseIdentifier: String?) {
        super.init(reuseIdentifier: reuseIdentifier)
        setupViews()
        setupInitialLayout()
    }
    
    private func setupViews() {
        background.backgroundColor = .white
        
        title.numberOfLines = 1
        title.textAlignment = .left
        title.textColor = .black
        title.font = UIFont(name: FontCatalog.fontLevels[3], size: 25)
        title.backgroundColor = .white
        
        self.addSubview(background)
        self.addSubview(title)
    }
    
    private func setupInitialLayout() {
        background.translatesAutoresizingMaskIntoConstraints = false
        title.translatesAutoresizingMaskIntoConstraints = false
        
        background.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        background.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        background.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        background.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
        
        title.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        title.leftAnchor.constraint(equalTo: self.leftAnchor, constant: 10).isActive = true
        title.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -10).isActive = true
        title.heightAnchor.constraint(equalToConstant: DimensionsCatalog.tableHeaderHeight).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}


internal class UITableViewCellWithArrow: UITableViewCell {
    internal let title: UILabel = UILabel()
    private let arrow: UIImageView = UIImageView()
    
    private let distanceBetweenElements: CGFloat = 40
    private let buttonDimensions: CGFloat = 20
    private let rowHeight: CGFloat = 70
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.selectedColor()
        
        title.textColor = .black
        title.font = UIFont(name: FontCatalog.fontLevels[1], size: 18)
        
        arrow.image = #imageLiteral(resourceName: "go")
        
        self.addSubview(title)
        self.addSubview(arrow)
    }
    
    private func setupInitialLayout() {
        title.translatesAutoresizingMaskIntoConstraints = false
        arrow.translatesAutoresizingMaskIntoConstraints = false
        
        title.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        title.leftAnchor.constraint(equalTo: self.leftAnchor, constant: distanceBetweenElements).isActive = true
        title.rightAnchor.constraint(equalTo: arrow.leftAnchor, constant: -10).isActive = true
        title.heightAnchor.constraint(equalToConstant: rowHeight).isActive = true
        title.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
        
        arrow.topAnchor.constraint(equalTo: self.topAnchor, constant: (rowHeight - buttonDimensions)/2).isActive = true
        arrow.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -distanceBetweenElements).isActive = true
        arrow.widthAnchor.constraint(equalToConstant: buttonDimensions).isActive = true
        arrow.heightAnchor.constraint(equalToConstant: buttonDimensions).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
