//
//  AddToCartOptionsView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit
import Firebase

internal class AddToCartOptionsView: UITableView {
    
    // Optional Closures
    internal var cartAltered: ((_ price: Double) -> ())?
    
    private let headerCellId = "headerCellId"
    private let optionsCellId = "optionsCellId"
    
    private var viewController: UIViewController?
    private var dishCategories: [DishCategory] = []
    // Make an object for this and put all of these in an object including price, row number and comments
    private var categoryIndex: [String: Int] = [:]
    private var categorySelected: [String: [Int]] = [:]
    private var categoryString: [String: [String]] = [:]

    private var price: Double = 0
    
    required init(dish: Dish, viewController: UIViewController) {
        super.init(frame: .zero, style: .grouped)
        
        self.viewController = viewController
        self.dishCategories = dish.extras
        self.price = dish.price
        
        initializeSelectedMaps()
        setupViews()
    }
    
    private func setupViews() {
        self.separatorStyle = .singleLine
        self.allowsMultipleSelection = true
        
        self.register(UITableViewHeader.self, forHeaderFooterViewReuseIdentifier: headerCellId)
        self.register(AddToCartOptionsCell.self, forCellReuseIdentifier: optionsCellId)
        self.register(SpecialInstructionsCell.self, forCellReuseIdentifier: Catalog.specialInstructionsId)
        self.delegate = self
        self.dataSource = self
    }
    
    private func initializeSelectedMaps() {
        for (index, category) in dishCategories.enumerated() {
            categorySelected[category.title] = []
            categoryString[category.title] = []
            categoryIndex[category.title] = index
        }
        categoryString[Catalog.specialInstructionsId] = []
    }
    
    internal func getSelections() -> [String: [String]]? {
        for dishCategory in dishCategories {
            if let optionsSelected = categorySelected[dishCategory.title] {
                if !dishCategory.multipleSelections {
                    if optionsSelected.count != 1 {
                        Catalog.alert(vc: viewController, title: "Option not selected", message: "Please select an option for \(dishCategory.title)")
                        return nil
                    }
                } else {
                    if optionsSelected.count < dishCategory.minOptionsSelect || optionsSelected.count > dishCategory.maxOptionsSelect {
                        Catalog.alert(vc: viewController, title: "Enough options not selected", message: "Atleast \(dishCategory.minOptionsSelect) option(s) required for \(dishCategory.title)")
                        return nil
                    }
                }
            }
        }

        
        for (categoryTitle, rows) in categorySelected {
            if let index = categoryIndex[categoryTitle] {
                let dishCategory = dishCategories[index]
                for row in rows {
                    categoryString[categoryTitle]?.append("\(dishCategory.options[row].title): $\(dishCategory.options[row].price)")
                }
            }
        }
        return categoryString
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

// MARK: - UITableView functions

extension AddToCartOptionsView: UITableViewDataSource, UITableViewDelegate {
    func numberOfSections(in tableView: UITableView) -> Int {
        return dishCategories.count + 1
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let header = tableView.dequeueReusableHeaderFooterView(withIdentifier: headerCellId) as! UITableViewHeader
        if (section < dishCategories.count) {
            header.title.text = dishCategories[section].title
            if !dishCategories[section].multipleSelections {
                header.subTitle.text = "Required"
            } else {
                var str = "Please select"
                if dishCategories[section].minOptionsSelect > 0 {
                    str += " atleast \(dishCategories[section].minOptionsSelect) and"
                }
                if dishCategories[section].maxOptionsSelect > 0 {
                    str += " up to \(dishCategories[section].maxOptionsSelect) "
                }
                header.subTitle.text = str
            }
        } else {
            header.title.text = "Special Instructions"
            header.subTitle.text = ""
        }
        return header
    }
    
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        if (section < dishCategories.count) {
            return 80
        } else {
            return 50
        }
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if (indexPath.section < dishCategories.count) {
            return 50
        } else {
            return 100
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if (section < dishCategories.count) {
            return dishCategories[section].options.count
        } else {
            return 1
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if (indexPath.section < dishCategories.count) {
            let cell = tableView.dequeueReusableCell(withIdentifier: optionsCellId, for: indexPath) as! AddToCartOptionsCell
            
            cell.label.text = dishCategories[indexPath.section].options[indexPath.row].title
            if (dishCategories[indexPath.section].options[indexPath.row].price == 0) {
                cell.price.text = ""
            } else {
                cell.price.text = "+$\(dishCategories[indexPath.section].options[indexPath.row].price)"
            }
            
            cell.singleSelectSectinon = !dishCategories[indexPath.section].multipleSelections
            
            return cell
        } else {
            let cell = tableView.dequeueReusableCell(withIdentifier: Catalog.specialInstructionsId, for: indexPath) as! SpecialInstructionsCell
            
            cell.commentAdded = { (_ comment: String) -> () in
                self.categoryString[Catalog.specialInstructionsId] = [comment]
            }
            
            return cell
        }
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if (indexPath.section < dishCategories.count) {
            let sec = indexPath.section
            let row = indexPath.row
            let dishCategory = dishCategories[sec]
            let categoryTitle = dishCategory.title
            
            if !dishCategory.multipleSelections {
                if let rows = categorySelected[categoryTitle], rows.count > 0 {
                    for tempRow in rows {
                        deselectRow(at: IndexPath.init(row: tempRow, section: sec), animated: true)
                        price -= dishCategory.options[tempRow].price
                    }
                    categorySelected[categoryTitle] = []
                }
                categorySelected[categoryTitle]?.append(row)
                price += dishCategory.options[row].price
                cartAltered?(price)
            } else {
                if let rows = categorySelected[categoryTitle], rows.count >= dishCategory.maxOptionsSelect   {
                    deselectRow(at: IndexPath.init(row: row, section: sec), animated: true)
                    Catalog.alert(vc: viewController, title: "Maximum options selected", message: "Up to \(dishCategory.maxOptionsSelect) option(s) required for \(dishCategory.title)")
                } else {
                    categorySelected[categoryTitle]?.append(row)
                    price += dishCategory.options[row].price
                    cartAltered?(price)
                }
            }
        }
    }
    
    func tableView(_ tableView: UITableView, didDeselectRowAt indexPath: IndexPath) {
        if (indexPath.section < dishCategories.count) {
            let sec = indexPath.section
            let row = indexPath.row
            let dishCategory = dishCategories[sec]
            let categoryTitle = dishCategory.title
            
            categorySelected[categoryTitle] = categorySelected[categoryTitle]?.filter {$0 != row}
            price -= dishCategory.options[row].price
            cartAltered?(price)
        }
    }
}
