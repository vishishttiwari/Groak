//
//  DishDetailsView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/19/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class represents all the details of the dish such as content, image, description etc.

import Foundation
import UIKit

internal class DishDetailsView: UITableView {
    
    // Optional Closures
    internal var ingredients: (() -> ())?
    internal var order: (() -> ())?
    
    private let headerCellId = "headerCellId"
    private let imageCellId = "imageCellId"
    private let ingredientCellId = "ingredientCellId"
    private let infoCellId = "infoCellId"
    private let contentCellId = "contentCellId"
    private let descriptionCellId = "descriptionCellId"
    
    private var dish: Dish = Dish()
    
    private var totalSections = 5
    private var imageSectionNumber = 0
    private var ingredientsSectionNumber = 1
    private var infoSectionNumber = 2
    private var contentsSectionNumber = 3
    private var descriptionSectionNumber = 4
    
    required init(dish: Dish) {
        super.init(frame: .zero, style: .grouped)
        
        self.dish = dish
        
        findSectionNumbers(dish: dish)
        
        setupViews()
    }
    
    // This function finds teh section number of each sections.
    // If the data for specific section is not present then this function
    // will make the section number -1 and hence it will not be shown in the view.
    // It also reduces the total sections if some dish data is not present
    private func findSectionNumbers(dish: Dish) {        
        if dish.imageLink.count == 0 {
            totalSections -= 1
            imageSectionNumber = -1
            ingredientsSectionNumber -= 1
            infoSectionNumber -= 1
            contentsSectionNumber -= 1
            descriptionSectionNumber -= 1
        }
        
        if dish.ingredients.count == 0 {
            totalSections -= 1
            ingredientsSectionNumber = -1
            infoSectionNumber -= 1
            contentsSectionNumber -= 1
            descriptionSectionNumber -= 1
        }
        
        if !dish.restrictionsExist() {
            totalSections -= 1
            infoSectionNumber = -1
            contentsSectionNumber -= 1
            descriptionSectionNumber -= 1
        }
        
        if !dish.nutritionExist() {
            totalSections -= 1
            contentsSectionNumber = -1
            descriptionSectionNumber -= 1
        }
        
        if dish.dishDescription.count == 0 {
            totalSections -= 1
            descriptionSectionNumber = -1
        }
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        self.separatorStyle = .none
        self.estimatedRowHeight = self.rowHeight
        self.rowHeight = UITableView.automaticDimension
        let insets = UIEdgeInsets(top: 0, left: 0, bottom: DimensionsCatalog.tableViewInsetDistance, right: 0)
        self.contentInset = insets
        
        self.register(UITableViewHeader.self, forHeaderFooterViewReuseIdentifier: headerCellId)
        self.register(DishImageCell.self, forCellReuseIdentifier: imageCellId)
        self.register(UITableViewCellWithArrow.self, forCellReuseIdentifier: ingredientCellId)
        self.register(DishInfoCell.self, forCellReuseIdentifier: infoCellId)
        self.register(DishContentCell.self, forCellReuseIdentifier: contentCellId)
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
        return totalSections
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        if section == infoSectionNumber {
            let header = tableView.dequeueReusableHeaderFooterView(withIdentifier: headerCellId) as! UITableViewHeader
            header.title.text = "Info"
            return header
        } else if section == contentsSectionNumber {
            let header = tableView.dequeueReusableHeaderFooterView(withIdentifier: headerCellId) as! UITableViewHeader
            header.title.text = "Content"
            return header
        } else if section == descriptionSectionNumber {
            let header = tableView.dequeueReusableHeaderFooterView(withIdentifier: headerCellId) as! UITableViewHeader
            header.title.text = "Description"
            return header
        } else {
            return nil
        }
    }
    
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        if section == infoSectionNumber {
           return DimensionsCatalog.tableHeaderHeight
        } else if section == contentsSectionNumber {
           return DimensionsCatalog.tableHeaderHeight
        } else if section == descriptionSectionNumber {
           return DimensionsCatalog.tableHeaderHeight
        } else {
           return 0
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if (indexPath.section == imageSectionNumber) {
            let cell = tableView.dequeueReusableCell(withIdentifier: imageCellId, for: indexPath) as! DishImageCell
            
            cell.dishAvailable = dish.available
            cell.dishImageLink = dish.imageLink
            
            return cell
        } else if (indexPath.section == ingredientsSectionNumber) {
            let cell = tableView.dequeueReusableCell(withIdentifier: ingredientCellId, for: indexPath) as! UITableViewCellWithArrow
            
            cell.title.text = "Ingredients"
            
            return cell
        } else if (indexPath.section == infoSectionNumber) {
            let cell = tableView.dequeueReusableCell(withIdentifier: infoCellId, for: indexPath) as! DishInfoCell
            
            cell.dishRestrictions = dish.restrictions
            
            return cell
        } else if (indexPath.section == contentsSectionNumber) {
            let cell = tableView.dequeueReusableCell(withIdentifier: contentCellId, for: indexPath) as! DishContentCell
            
            cell.dishNutrition = dish.nutrition
            
            return cell
        } else if (indexPath.section == descriptionSectionNumber) {
            let cell = tableView.dequeueReusableCell(withIdentifier: descriptionCellId, for: indexPath) as! DishDescriptionCell
            
            cell.dishDescription.text = dish.dishDescription
            
            return cell
        }
        
        return UITableViewCell.init()
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        if (indexPath.section == ingredientsSectionNumber) {
            ingredients?()
        }
    }
}
