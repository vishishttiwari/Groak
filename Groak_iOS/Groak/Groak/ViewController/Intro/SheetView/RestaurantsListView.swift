//
//  RestaurantsListView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class RestaurantsListView: UITableView {
    
    // Optional Closures
    internal var restaurantSelected: ((_ restaurant: Restaurant) -> ())?
    
    private let cellId: String = "cellId"
    
    private var restaurants: [Restaurant] = []
    
    required init() {
        super.init(frame: .zero, style: .grouped)
        
        setupViews()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        self.separatorStyle = .none
        self.estimatedRowHeight = self.rowHeight
        self.rowHeight = UITableView.automaticDimension
        let insets = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
        self.contentInset = insets
        
        self.register(RestaurantCell.self, forCellReuseIdentifier: cellId)
        
        self.dataSource = self
        self.delegate = self
        
        self.showsVerticalScrollIndicator = false
    }
    
    internal func reloadData(restaurants: [Restaurant]) {
        self.restaurants = restaurants

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
