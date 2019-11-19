//
//  CategoryHeader.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/18/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class CategoryHeader: UITableViewHeaderFooterView {
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
