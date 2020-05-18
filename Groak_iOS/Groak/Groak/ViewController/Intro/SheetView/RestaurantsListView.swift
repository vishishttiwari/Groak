//
//  RestaurantsListView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class contains all the restaurant around user is a UITableVIew form

import Foundation
import UIKit

internal class RestaurantsListView: UITableView {
    
    // Optional Closures
    internal var restaurantSelected: ((_ restaurant: Restaurant) -> ())?
    
    private let noRestaurant: UIImageView = UIImageView()
    
    private let cellId: String = "cellId"
    
    private var restaurants: [Restaurant] = []
    
    required init() {
        super.init(frame: .zero, style: .grouped)
        
        setupViews()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        noRestaurant.image = UIImage.init(named: "noRestaurant")
        noRestaurant.contentMode = .scaleAspectFit
        noRestaurant.layer.zPosition = -10
        noRestaurant.isHidden = true
        self.addSubview(noRestaurant)
        noRestaurant.translatesAutoresizingMaskIntoConstraints = false
        noRestaurant.centerXAnchor.constraint(equalTo: self.centerXAnchor).isActive = true
        noRestaurant.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.screenSize.width/3).isActive = true
        noRestaurant.heightAnchor.constraint(equalToConstant: 4*DimensionsCatalog.screenSize.width/5).isActive = true
        noRestaurant.widthAnchor.constraint(equalToConstant: 4*DimensionsCatalog.screenSize.width/5).isActive = true
        
        self.separatorStyle = .singleLine
        self.estimatedRowHeight = self.rowHeight
        self.rowHeight = UITableView.automaticDimension
        let insets = UIEdgeInsets(top: DimensionsCatalog.tableViewInsetDistance, left: 0, bottom: DimensionsCatalog.tableViewInsetDistance, right: 0)
        self.contentInset = insets
        
        self.register(RestaurantCell.self, forCellReuseIdentifier: cellId)
        
        self.dataSource = self
        self.delegate = self
        
        self.showsVerticalScrollIndicator = false
    }
    
    internal func reloadData(restaurants: [Restaurant]) {
        self.restaurants = restaurants
        
        if (restaurants.count == 0) {
            noRestaurant.isHidden = false
        } else {
            noRestaurant.isHidden = true
        }

        reloadData()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension RestaurantsListView: UITableViewDataSource, UITableViewDelegate, UIScrollViewDelegate {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return restaurants.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: cellId, for: indexPath) as! RestaurantCell
        
        cell.restaurant = restaurants[indexPath.row]
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
    
        restaurantSelected?(restaurants[indexPath.row])
    }
}
