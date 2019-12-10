//
//  CartView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class CartView: UITableView {
    internal var dismiss: (() -> ())?
    internal var cartDishSelected: ((_ cartDish: CartDish, _ indexInCart: Int) -> ())?
    
    private let headerCellId = "headerCellId"
    private let cartCellId = "cartCellId"
    private let specialInstructionsCellId = "specialInstructionsCellId"
    
    internal var cart = LocalStorage.cart
    
    required init() {
        super.init(frame: .zero, style: .grouped)
        
        setupViews()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        self.keyboardDismissMode = .onDrag
        
        self.separatorStyle = .singleLine
        self.estimatedRowHeight = self.rowHeight
        self.rowHeight = UITableView.automaticDimension
        let insets = UIEdgeInsets(top: 0, left: 0, bottom: DimensionsCatalog.tableViewInsetDistance, right: 0)
        self.contentInset = insets
        
        self.register(UITableViewHeader.self, forHeaderFooterViewReuseIdentifier: headerCellId)
        self.register(SpecialInstructionsCartCell.self, forCellReuseIdentifier: specialInstructionsCellId)
        self.register(CartCell.self, forCellReuseIdentifier: cartCellId)
        self.delegate = self
        self.dataSource = self
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension CartView: UITableViewDataSource, UITableViewDelegate {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 2
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let header = tableView.dequeueReusableHeaderFooterView(withIdentifier: headerCellId) as! UITableViewHeader
        if (section == 0) {
            header.title.text = "Cart"
        } else if (section == 1) {
            header.title.text = "Special Instructions"
        }
        return header
    }
    
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return DimensionsCatalog.tableHeaderHeight
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if (section == 0) { return cart.dishes.count}
        else if (section == 1) { return 1 }
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if (indexPath.section == 0) {
            let cell = tableView.dequeueReusableCell(withIdentifier: cartCellId, for: indexPath) as! CartCell
            
            cell.name.text = cart.dishes[indexPath.row].dishName
            cell.quantity.text = "\(cart.dishes[indexPath.row].quantity)"
            cell.price.text = cart.dishes[indexPath.row].totalPrice.priceInString

            var str = ""
            for extra in cart.dishes[indexPath.row].extras {
                if (extra.title != Catalog.specialInstructionsId) {
                    str += "\(extra.title):\n"
                    for option in extra.options {
                        str += "\t- \(option.title): \(option.price.priceInString)\n"
                    }
                } else {
                    if (extra.options.count > 0) {
                        str += "Special Instructions:\n"
                        for option in extra.options {
                            str += "\t-\(option)\n"
                        }
                    }
                }
            }
            cell.details.text = str
            
            return cell
        } else if (indexPath.section == 1) {
            let cell = tableView.dequeueReusableCell(withIdentifier: specialInstructionsCellId, for: indexPath) as! SpecialInstructionsCartCell
            
            return cell
        }
        return UITableViewCell.init()
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        if (indexPath.section == 0) {
            cartDishSelected?(cart.dishes[indexPath.row], indexPath.row)
        }
    }
    
    func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        return true
    }
    
    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if (editingStyle == .delete) {
            cart.dishes.remove(at: indexPath.row)
            LocalStorage.cart.dishes.remove(at: indexPath.row)
            if (LocalStorage.cart.dishes.count > 0) {
                self.reloadData()
            } else {
                dismiss?()
            }
        }
    }
    
    func scrollToBottom() {
        let indexPath = IndexPath(row: 0, section: 1)
        self.scrollToRow(at: indexPath, at: .bottom, animated: false)
    }
}
