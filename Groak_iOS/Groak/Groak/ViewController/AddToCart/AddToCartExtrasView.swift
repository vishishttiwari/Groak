//
//  AddToCartExtrasView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit
import Firebase

internal class AddToCartExtrasView: UITableView {
    
    // Optional Closures
    internal var cartAltered: ((_ price: Double) -> ())?
    
    private let headerCellId = "headerCellId"
    private let optionsCellId = "optionsCellId"
    
    private var viewController: UIViewController?
    private var dishExtras: [DishExtra] = []
    private var extras: [CartItemExtra] = []

    private var price: Double = 0
    
    required init(dish: Dish, viewController: UIViewController) {
        super.init(frame: .zero, style: .grouped)
        
        self.viewController = viewController
        self.dishExtras = dish.extras
        self.price = dish.price
        
        initializeSelectedMaps()
        setupViews()
    }
    
    private func setupViews() {
        self.separatorStyle = .singleLine
        self.allowsMultipleSelection = true
        
        self.register(UITableViewHeader.self, forHeaderFooterViewReuseIdentifier: headerCellId)
        self.register(AddToCartExtraOptionCell.self, forCellReuseIdentifier: optionsCellId)
        self.register(SpecialInstructionsCell.self, forCellReuseIdentifier: Catalog.specialInstructionsId)
        self.delegate = self
        self.dataSource = self
    }
    
    private func initializeSelectedMaps() {
        for extra in dishExtras {
            extras.append(CartItemExtra.init(title: extra.title))
        }
        extras.append(CartItemExtra.init(title: Catalog.specialInstructionsId))
    }
    
    internal func getSelections() -> [CartItemExtra]? {
        for (index, dishExtra) in dishExtras.enumerated() {
            let extraSelected = extras[index]
            if !dishExtra.multipleSelections {
                if extraSelected.options.count != 1 {
                    Catalog.alert(vc: viewController, title: "Option not selected", message: "Please select an option for \(dishExtra.title)")
                    return nil
                }
            } else {
                if extraSelected.options.count < dishExtra.minOptionsSelect {
                    Catalog.alert(vc: viewController, title: "Enough options not selected", message: "Atleast \(dishExtra.minOptionsSelect) option(s) required for \(dishExtra.title)")
                    return nil
                }
                if extraSelected.options.count > dishExtra.maxOptionsSelect {
                    Catalog.alert(vc: viewController, title: "Too many options not selected", message: "Up to \(dishExtra.maxOptionsSelect) option(s) can be selected for \(dishExtra.title)")
                    return nil
                }
            }
        }

        return extras
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

// MARK: - UITableView functions

extension AddToCartExtrasView: UITableViewDataSource, UITableViewDelegate {
    func numberOfSections(in tableView: UITableView) -> Int {
        return dishExtras.count + 1
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let header = tableView.dequeueReusableHeaderFooterView(withIdentifier: headerCellId) as! UITableViewHeader
        if (section < dishExtras.count) {
            header.title.text = dishExtras[section].title
            if !dishExtras[section].multipleSelections {
                header.subTitle.text = "Required"
            } else {
                var str = "Please select"
                if dishExtras[section].minOptionsSelect > 0 {
                    str += " atleast \(dishExtras[section].minOptionsSelect) and"
                }
                if dishExtras[section].maxOptionsSelect > 0 {
                    str += " up to \(dishExtras[section].maxOptionsSelect) "
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
        if (section < dishExtras.count) {
            return 80
        } else {
            return 50
        }
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if (indexPath.section < dishExtras.count) {
            return 50
        } else {
            return 100
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if (section < dishExtras.count) {
            return dishExtras[section].options.count
        } else {
            return 1
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if (indexPath.section < dishExtras.count) {
            let cell = tableView.dequeueReusableCell(withIdentifier: optionsCellId, for: indexPath) as! AddToCartExtraOptionCell
            
            cell.label.text = dishExtras[indexPath.section].options[indexPath.row].title
            if (dishExtras[indexPath.section].options[indexPath.row].price == 0) {
                cell.price.text = ""
            } else {
                cell.price.text = "+$\(dishExtras[indexPath.section].options[indexPath.row].price)"
            }
            
            cell.singleSelectSectinon = !dishExtras[indexPath.section].multipleSelections
            
            return cell
        } else {
            let cell = tableView.dequeueReusableCell(withIdentifier: Catalog.specialInstructionsId, for: indexPath) as! SpecialInstructionsCell
            
            cell.commentAdded = { (_ comment: String) -> () in
                self.extras.last?.options.append(CartItemsExtraOption.init(title: comment, price: 0, optionIndex: 0))
            }
            
            return cell
        }
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if (indexPath.section < dishExtras.count) {
            let sec = indexPath.section
            let row = indexPath.row
            let dishExtra = dishExtras[sec]
            
            if !dishExtra.multipleSelections {
                if let lastOption = extras[sec].options.last, extras[sec].options.count > 0 {
                    deselectRow(at: IndexPath.init(row: lastOption.optionIndex, section: sec), animated: true)
                    price -= lastOption.price
                    extras[sec].options = []
                }
                extras[sec].options.append(CartItemsExtraOption.init(dishExtraOption: dishExtra.options[row], optionIndex: row))
                price += dishExtra.options[row].price
                cartAltered?(price)
            } else {
                if extras[sec].options.count >= dishExtra.maxOptionsSelect   {
                    deselectRow(at: IndexPath.init(row: row, section: sec), animated: true)
                    Catalog.alert(vc: viewController, title: "Maximum options selected", message: "Up to \(dishExtra.maxOptionsSelect) option(s) required for \(dishExtra.title)")
                } else {
                    extras[sec].options.append(CartItemsExtraOption.init(dishExtraOption: dishExtra.options[row], optionIndex: row))
                    price += dishExtra.options[row].price
                    cartAltered?(price)
                }
            }
        }
    }
    
    func tableView(_ tableView: UITableView, didDeselectRowAt indexPath: IndexPath) {
        if (indexPath.section < dishExtras.count) {
            let sec = indexPath.section
            let row = indexPath.row
            let dishExtra = dishExtras[sec]
            
            for (index, option) in extras[sec].options.enumerated() {
                if option.optionIndex == row {
                    extras[sec].options.remove(at: index)
                    price -= dishExtra.options[row].price
                    cartAltered?(price)
                    break
                }
            }
        }
    }
}
