//
//  OrderView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/5/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit
import Firebase

internal class OrderView: UITableView {
    internal var instructionSent: (() -> ())?

    private let headerCellId = "headerCellId"
    private let orderDishCellId = "orderDishCellId"
    private let orderCommentCellId = "orderCommentCellId"
    private let specialInstructionsCellId = "specialInstructionsCellId"
    private let statusCellId = "statusCellId"
    
    private let order: Order = LocalStorage.tableOrder

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
        self.register(OrderDishCell.self, forCellReuseIdentifier: orderDishCellId)
        self.register(OrderCommentCell.self, forCellReuseIdentifier: orderCommentCellId)
        self.register(SpecialInstructionsOrderCell.self, forCellReuseIdentifier: specialInstructionsCellId)
        self.register(OrderStatusCell.self, forCellReuseIdentifier: statusCellId)
        self.delegate = self
        self.dataSource = self
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension OrderView: UITableViewDataSource, UITableViewDelegate {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 3
    }

    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let header = tableView.dequeueReusableHeaderFooterView(withIdentifier: headerCellId) as! UITableViewHeader
        if section == 0 { header.title.text = "Order Status" }
        else if section == 1 { header.title.text = "Order" }
        else if section == 2 { header.title.text = "Special Instructions" }
        return header
    }

    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return DimensionsCatalog.tableHeaderHeight
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if section == 0 { return 1 }
        else if section == 1 { return order.dishes.count }
        else if section == 2 { return 1 + order.comments.count }
        else { return 0 }
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if indexPath.section == 0 {
            let cell = tableView.dequeueReusableCell(withIdentifier: statusCellId, for: indexPath) as! OrderStatusCell

            if self.order.status == TableStatus.requested {
                cell.status.text = "Your order has been requested. Pending for approval."
            } else if self.order.status == TableStatus.approved {
                cell.status.text = TimeCatalog.getTimeFromTimestamp(timestamp: self.order.serveTime)
            } else if self.order.status == TableStatus.served {
                cell.status.text = "Your order has been served. Enjoy!"
            } else {
                cell.status.text = "Your order has been requested. Pending for approval."
            }

            return cell
        } else if indexPath.section == 1 {
            let cell = tableView.dequeueReusableCell(withIdentifier: orderDishCellId, for: indexPath) as! OrderDishCell

            cell.name.text = order.dishes[indexPath.row].name
            cell.quantity.text = "\(order.dishes[indexPath.row].quantity)"
            cell.price.text = order.dishes[indexPath.row].price.priceInString

            var str = ""
            for extra in order.dishes[indexPath.row].extras {
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
        } else if indexPath.section == 2 {
            if indexPath.row == 0 {
                let cell = tableView.dequeueReusableCell(withIdentifier: specialInstructionsCellId, for: indexPath) as! SpecialInstructionsOrderCell
                return cell
            } else {
                let cell = tableView.dequeueReusableCell(withIdentifier: orderCommentCellId, for: indexPath) as! OrderCommentCell
                
                cell.comment.text = order.comments[indexPath.row - 1].comment
                
                return cell
            }
        } else {
            return UITableViewCell.init()
        }
    }
    
    func scrollToBottom(){
        let indexPath = IndexPath(row: 0, section: 2)
        self.scrollToRow(at: indexPath, at: .bottom, animated: false)
    }
}
