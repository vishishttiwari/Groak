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
    internal var cartItemSelected: ((_ cartItem: CartItem, _ indexInCart: Int) -> ())?
    
    private let headerCellId = "headerCellId"
    private let cartCellId = "cartCellId"
    private let specialInstructionsCellId = "specialInstructionsCellId"
    
    private var cart: [CartItem] = LocalStorage.cartItems
    
    required init() {
        super.init(frame: .zero, style: .grouped)
        
        setupViews()
    }
    
    private func setupViews() {
        self.separatorStyle = .singleLine
        self.estimatedRowHeight = self.rowHeight
        self.rowHeight = UITableView.automaticDimension
        
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
        if (section == 0) { return cart.count}
        else if (section == 1) { return 1 }
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if (indexPath.section == 0) {
            let cell = tableView.dequeueReusableCell(withIdentifier: cartCellId, for: indexPath) as! CartCell
            
            cell.name.text = cart[indexPath.row].dishName
            cell.quantity.text = "\(cart[indexPath.row].quantity)"
            cell.cost.text = "$\(cart[indexPath.row].totalCost)"

            var str = ""
            for (option, comments) in cart[indexPath.row].options {
                if (option != Catalog.specialInstructionsId) {
                    str += "\(option):\n"
                    for comment in comments {
                        str += "\t-\(comment)\n"
                    }
                } else {
                    if (comments.count != 0) {
                        str += "Special Instructions:\n"
                        for comment in comments {
                            str += "\t-\(comment)\n"
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
            cartItemSelected?(cart[indexPath.row], indexPath.row)
        }
    }
    
    func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        return true
    }
    
    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if (editingStyle == .delete) {
            cart.remove(at: indexPath.row)
            LocalStorage.cartItems.remove(at: indexPath.row)
            if (LocalStorage.cartItems.count > 0) {
                self.reloadData()
            } else {
                dismiss?()
            }
        }
    }
}
