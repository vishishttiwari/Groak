//
//  BottomSheetView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit
import Firebase

internal class BottomSheetView: UIView {
    private let bar: UIView = UIView()
    private let title: UILabel = UILabel()
    private let header: UIView = UIView()
    
    private let threshold: CGFloat = 200
    private let cornerRadius: CGFloat = 40
    private let headerHeight: CGFloat = 80
    private let distanceBetweenElements: CGFloat = 10
    private let titleFont: UIFont = UIFont(name: Catalog.fontLevels[3], size: 30)!

    
    required init() {
        super.init(frame: .zero)
        
        setupViews()
        
        setupInitialLayout()
        
        downloadNearbyRestaurants()
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.roundCorners([.layerMaxXMinYCorner, .layerMinXMinYCorner ], radius: cornerRadius)
        
        bar.backgroundColor = Catalog.shadesOfGray[9]
        bar.layer.cornerRadius = 3
        
        title.text = "Nearby Restaurants"
        title.textAlignment = .left
        title.backgroundColor = .clear
        title.font = titleFont
        title.textColor = .black
        
        header.backgroundColor = Catalog.headerGrayShade
        header.roundCorners([.layerMaxXMinYCorner, .layerMinXMinYCorner], radius: cornerRadius)
        header.clipsToBounds = true
        
        header.addSubview(bar)
        header.addSubview(title)
        self.addSubview(header)
    }
    
    private func setupInitialLayout() {
        bar.translatesAutoresizingMaskIntoConstraints = false
        title.translatesAutoresizingMaskIntoConstraints = false
        header.translatesAutoresizingMaskIntoConstraints = false
        
        bar.topAnchor.constraint(equalTo: header.topAnchor, constant: distanceBetweenElements).isActive = true
        bar.leftAnchor.constraint(equalTo: header.leftAnchor, constant: Catalog.screenSize.width/3).isActive = true
        bar.rightAnchor.constraint(equalTo: header.rightAnchor, constant: -Catalog.screenSize.width/3).isActive = true
        bar.heightAnchor.constraint(equalToConstant: 5).isActive = true
        
        title.topAnchor.constraint(equalTo: bar.bottomAnchor, constant: 20).isActive = true
        title.leftAnchor.constraint(equalTo: header.leftAnchor, constant: distanceBetweenElements).isActive = true
        title.rightAnchor.constraint(equalTo: header.rightAnchor, constant: -distanceBetweenElements).isActive = true
        title.bottomAnchor.constraint(equalTo: header.bottomAnchor).isActive = true
        
        header.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        header.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        header.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        header.heightAnchor.constraint(equalToConstant: headerHeight).isActive = true
    }
    
    // Download nearby restaurants
    private func downloadNearbyRestaurants() {
        let fb = Firebase()
        fb.getNearbyRestaurants(collection: "restaurants")
        
        fb.dataReceivedForGetNearbyRestaurants = { (_ data: [[String: Any]]) -> () in
            for rest in data {
                self.restaurants.append(Restaurant.init(restaurant: rest))
            }
            DispatchQueue.main.async {
                self.restaurantsTableView.reloadData()
            }
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
