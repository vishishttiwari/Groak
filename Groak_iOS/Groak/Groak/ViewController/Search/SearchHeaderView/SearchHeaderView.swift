//
//  SearchHeaderView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/19/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class SearchHeaderView: UIView {
    
    // Optional Closures
    internal var searchBarEdited: ((_ searchText: String) -> ())?
    internal var dismiss: (() -> ())?
    
    private let backButton: UIButton = UIButton()
    private let restaurantTitle: UILabel = UILabel()
    private let searchBar: UITextField = UITextField()
    private let searchIcon: UIImageView = UIImageView()
    
    private let titleDimensions: CGFloat = 25
    private let searchDimensions: CGFloat = 20
    private let distanceBetweenElements: CGFloat = 20
    private let distanceFromTop: CGFloat = DimensionsCatalog.topSafeArea + 10
    
    required init(restaurant: Restaurant) {
        super.init(frame: .zero)
        
        setupViews(restaurant: restaurant)
        
        setupInitialLayout()
    }
    
    private func setupViews(restaurant: Restaurant) {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        backButton.addTarget(self, action: #selector(back), for: .touchUpInside)
        backButton.setTitle("Cancel", for: .normal)
        backButton.setTitleColor(ColorsCatalog.themeColor, for: .normal)
        backButton.contentHorizontalAlignment = .right
        backButton.titleLabel?.font = UIFont(name: FontCatalog.fontLevels[1], size: 15)
        self.addSubview(backButton)
        
        restaurantTitle.text = restaurant.name
        restaurantTitle.font = UIFont(name: FontCatalog.fontLevels[1], size: titleDimensions)
        restaurantTitle.numberOfLines = 1
        restaurantTitle.textColor = .black
        restaurantTitle.textAlignment = .left
        self.addSubview(restaurantTitle)
        
        searchIcon.image = #imageLiteral(resourceName: "search")
        self.addSubview(searchIcon)
        
        searchBar.backgroundColor = .clear
        searchBar.font = UIFont(name: FontCatalog.fontLevels[1], size: searchDimensions)
        searchBar.textColor = ColorsCatalog.themeColor
        searchBar.autocorrectionType = .no
        searchBar.keyboardAppearance = .dark
        searchBar.contentVerticalAlignment = .top
        searchBar.clearButtonMode = .whileEditing
        searchBar.attributedPlaceholder = NSAttributedString(string: "Search menu",
                                                             attributes: [NSAttributedString.Key.foregroundColor: ColorsCatalog.shadesOfGray[10] as UIColor])
        searchBar.addTarget(self, action: #selector(search(_ :)), for: .editingChanged)
        searchBar.becomeFirstResponder()
        self.addSubview(searchBar)
    }
    
    private func setupInitialLayout() {
        restaurantTitle.translatesAutoresizingMaskIntoConstraints = false
        backButton.translatesAutoresizingMaskIntoConstraints = false
        searchIcon.translatesAutoresizingMaskIntoConstraints = false
        searchBar.translatesAutoresizingMaskIntoConstraints = false
        
        restaurantTitle.topAnchor.constraint(equalTo: self.topAnchor, constant: distanceFromTop).isActive = true
        restaurantTitle.leftAnchor.constraint(equalTo: self.leftAnchor, constant: distanceBetweenElements).isActive = true
        restaurantTitle.rightAnchor.constraint(equalTo: backButton.leftAnchor, constant: -distanceBetweenElements).isActive = true
        restaurantTitle.heightAnchor.constraint(equalToConstant: titleDimensions).isActive = true
        
        backButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -distanceBetweenElements).isActive = true
        backButton.widthAnchor.constraint(equalToConstant: 100).isActive = true
        backButton.heightAnchor.constraint(equalToConstant: titleDimensions).isActive = true
        backButton.centerYAnchor.constraint(equalTo: restaurantTitle.centerYAnchor).isActive = true
        
        searchIcon.leftAnchor.constraint(equalTo: self.leftAnchor, constant: distanceBetweenElements).isActive = true
        searchIcon.widthAnchor.constraint(equalToConstant: searchDimensions).isActive = true
        searchIcon.centerYAnchor.constraint(equalTo: searchBar.centerYAnchor).isActive = true
        searchIcon.heightAnchor.constraint(equalToConstant: searchDimensions).isActive = true
        
        searchBar.topAnchor.constraint(equalTo: restaurantTitle.bottomAnchor, constant: distanceBetweenElements).isActive = true
        searchBar.leftAnchor.constraint(equalTo: searchIcon.rightAnchor, constant: distanceBetweenElements).isActive = true
        searchBar.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -distanceBetweenElements).isActive = true
        searchBar.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -distanceBetweenElements).isActive = true
    }
    
    @objc func search(_ textField: UITextField) {
        searchBarEdited?(textField.text!)
    }
    
    @objc func back() {
        dismiss?()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
