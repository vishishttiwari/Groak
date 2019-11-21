//
//  DishDetailsView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/19/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class DishDetailsView: UITableView {
    // Optional Closures
    internal var ingredients: (() -> ())?
    
    private let headerCellId = "headerCellId"
    private let imageCellId = "imageCellId"
    private let ingredientCellId = "ingredientCellId"
    private let nutritionCellId = "nutritionCellId"
    private let descriptionCellId = "descriptionCellId"
    
    private var dish: Dish = Dish()
    
    required init(dish: Dish) {
        super.init(frame: .zero, style: .grouped)
        
        self.dish = dish
        
        setupViews()
    }
    
    private func setupViews() {
        self.separatorStyle = .none
        self.estimatedRowHeight = self.rowHeight
        self.rowHeight = UITableView.automaticDimension
        let insets = UIEdgeInsets(top: 0, left: 0, bottom: 50, right: 0)
        self.contentInset = insets
        
        self.register(UITableViewHeader.self, forHeaderFooterViewReuseIdentifier: headerCellId)
        self.register(DishImageCell.self, forCellReuseIdentifier: imageCellId)
        self.register(UITableViewCellWithArrow.self, forCellReuseIdentifier: ingredientCellId)
        self.register(DishNutritionCell.self, forCellReuseIdentifier: nutritionCellId)
        self.register(DishDescriptionCell.self, forCellReuseIdentifier: descriptionCellId)
        
        self.delegate = self
        self.dataSource = self
        
        self.showsVerticalScrollIndicator = false
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension DishDetailsView: UITableViewDataSource, UITableViewDelegate {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 4
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        if (section != 0 || section != 1) {
            let header = tableView.dequeueReusableHeaderFooterView(withIdentifier: headerCellId) as! UITableViewHeader
            if (section == 2) {
                header.title.text = "Nutritional Content"
            }
            else if (section == 3) {
                header.title.text = "Description"
            }
            return header
        } else {
            return nil
        }
    }
    
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        if (section == 0 || section == 1) {
            return 0
        } else {
            return DimensionsCatalog.tableHeaderHeight
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if (indexPath.section == 0) {
            let cell = tableView.dequeueReusableCell(withIdentifier: imageCellId, for: indexPath) as! DishImageCell
            
            cell.dishAvailable = dish.available
            cell.dishImageLink = dish.imageLink
            
            return cell
        } else if (indexPath.section == 1) {
            let cell = tableView.dequeueReusableCell(withIdentifier: ingredientCellId, for: indexPath) as! UITableViewCellWithArrow
            
            cell.title.text = "Ingredients"
            
            return cell
        } else if (indexPath.section == 2) {
            let cell = tableView.dequeueReusableCell(withIdentifier: nutritionCellId, for: indexPath) as! DishNutritionCell
            
            cell.dishNutrition = dish.nutrition
            
            return cell
        } else if (indexPath.section == 3) {
            let cell = tableView.dequeueReusableCell(withIdentifier: descriptionCellId, for: indexPath) as! DishDescriptionCell
            
            cell.dishDescription.text = dish.dishDescription
            
            return cell
        }
        
        return UITableViewCell.init()
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        if (indexPath.section == 1) {
            ingredients?()
        }
    }
}
