//
//  AddToCartExtrasView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  All the extras are shown in this view in UITableView form

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
    private var extrasSelected: [CartDishExtra] = []

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
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        self.keyboardDismissMode = .onDrag
        
        self.separatorStyle = .singleLine
        self.allowsMultipleSelection = true
        let insets = UIEdgeInsets(top: 0, left: 0, bottom: DimensionsCatalog.tableViewInsetDistance, right: 0)
        self.contentInset = insets
        
        self.register(UITableViewHeader.self, forHeaderFooterViewReuseIdentifier: headerCellId)
        self.register(AddToCartExtraOptionCell.self, forCellReuseIdentifier: optionsCellId)
        self.register(SpecialInstructionsCell.self, forCellReuseIdentifier: Catalog.specialInstructionsId)
        self.delegate = self
        self.dataSource = self
    }
    
    // This initializes the selected map with the right keys
    private func initializeSelectedMaps() {
        for extra in dishExtras {
            extrasSelected.append(CartDishExtra.init(title: extra.title))
        }
        extrasSelected.append(CartDishExtra.init(title: Catalog.specialInstructionsId))
    }
    
    // This function is called to get all the sections made in this view. If the selections are less or more than what they should be then this raises an alert view.
    internal func getSelections() -> [CartDishExtra]? {
        for (index, dishExtra) in dishExtras.enumerated() {
            let extraSelected = extrasSelected[index]
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
        
        var finalExtrasSelected: [CartDishExtra] = []
        for extra in extrasSelected {
            if (extra.title == Catalog.specialInstructionsId)  {
                finalExtrasSelected.append(extra)
            } else if (extra.options.count > 0) {
                finalExtrasSelected.append(extra)
            }
        }
        
        return finalExtrasSelected
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

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
                cell.price.text = "+\(dishExtras[indexPath.section].options[indexPath.row].price.priceInString)"
            }
            
            cell.singleSelectSectinon = !dishExtras[indexPath.section].multipleSelections
            
            return cell
        } else {
            let cell = tableView.dequeueReusableCell(withIdentifier: Catalog.specialInstructionsId, for: indexPath) as! SpecialInstructionsCell
            
            cell.commentAdded = { (_ comment: String) -> () in
                if (comment.count == 0) {
                    self.extrasSelected.last?.options.removeAll()
                } else {
                    if (self.extrasSelected.last?.options.count == 0) {
                        self.extrasSelected.last?.options.append( CartDishExtraOption.init(title: comment, price: 0, optionIndex: 0))
                    } else {
                        self.extrasSelected.last?.options[0] = CartDishExtraOption.init(title: comment, price: 0, optionIndex: 0)
                    }
                }
            }
            
            return cell
        }
    }
    
    // When an option is selected then its option price is added...the rwo is selected. If multiple selections
    // are allowed then the the user can select until the maximum options is reached, after which is alert view is raised.
    // If only one is allowed then it deselects the previous selected row in the same section. This also adds the selected row to the map
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if (indexPath.section < dishExtras.count) {
            let sec = indexPath.section
            let row = indexPath.row
            let dishExtra = dishExtras[sec]
            
            if !dishExtra.multipleSelections {
                if let lastOption = extrasSelected[sec].options.last, extrasSelected[sec].options.count > 0 {
                    deselectRow(at: IndexPath.init(row: lastOption.optionIndex, section: sec), animated: true)
                    price -= lastOption.price
                    extrasSelected[sec].options = []
                }
                extrasSelected[sec].options.append(CartDishExtraOption.init(dishExtraOption: dishExtra.options[row], optionIndex: row))
                price += dishExtra.options[row].price
                cartAltered?(price)
            } else {
                if extrasSelected[sec].options.count >= dishExtra.maxOptionsSelect   {
                    deselectRow(at: IndexPath.init(row: row, section: sec), animated: true)
                    Catalog.alert(vc: viewController, title: "Maximum options selected", message: "Up to \(dishExtra.maxOptionsSelect) option(s) required for \(dishExtra.title)")
                } else {
                    extrasSelected[sec].options.append(CartDishExtraOption.init(dishExtraOption: dishExtra.options[row], optionIndex: row))
                    price += dishExtra.options[row].price
                    cartAltered?(price)
                }
            }
        }
    }
    
    // This also deletes the selected row from map and als reduces the overall price
    func tableView(_ tableView: UITableView, didDeselectRowAt indexPath: IndexPath) {
        if (indexPath.section < dishExtras.count) {
            let sec = indexPath.section
            let row = indexPath.row
            let dishExtra = dishExtras[sec]
            
            for (index, option) in extrasSelected[sec].options.enumerated() {
                if option.optionIndex == row {
                    extrasSelected[sec].options.remove(at: index)
                    price -= dishExtra.options[row].price
                    cartAltered?(price)
                    break
                }
            }
        }
    }
    
    func scrollToBottom(){
        let indexPath = IndexPath(row: 0, section: self.dishExtras.count)
        self.scrollToRow(at: indexPath, at: .bottom, animated: false)
    }
}
