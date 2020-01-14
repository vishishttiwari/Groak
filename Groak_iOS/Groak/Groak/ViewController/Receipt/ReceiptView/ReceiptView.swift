//
//  ReceiptView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/12/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class represents the receipt view inside receipt view controllee

import Foundation
import UIKit
import Firebase

internal class ReceiptView: UITableView {
    internal var instructionSent: (() -> ())?

    private let restaurantInfoCellId = "restaurantInfoCellId"
    private let orderPriceCellId = "orderPriceCellId"
    private let receiptOrderDishCellId = "receiptOrderDishCellId"
    
    internal var order = LocalRestaurant.tableOrder

    required init() {
        super.init(frame: .zero, style: .grouped)
        
        setupViews()
    }

    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        self.separatorStyle = .singleLine
        self.estimatedRowHeight = self.rowHeight
        self.rowHeight = UITableView.automaticDimension
        let insets = UIEdgeInsets(top: DimensionsCatalog.tableViewInsetDistance, left: 0, bottom: DimensionsCatalog.tableViewInsetDistance, right: 0)
        self.contentInset = insets

        self.register(RestaurantInfoCell.self, forCellReuseIdentifier: restaurantInfoCellId)
        self.register(OrderPriceCell.self, forCellReuseIdentifier: orderPriceCellId)
        self.register(ReceiptOrderDishCell.self, forCellReuseIdentifier: receiptOrderDishCellId)
        self.delegate = self
        self.dataSource = self
    }
    
    func receiptChanged(index: Int) {
        if index == 0 {
            order = LocalRestaurant.tableOrder
        } else if index == 1 {
            order = Order.init()
            for dish in LocalRestaurant.tableOrder.dishes {
                if dish.local {
                    order.dishes.append(dish)
                }
            }
        }
        reloadData()
    }
    
    func createImage() -> UIImage? {
        var totalHeight: CGFloat = 0
        let receiptInfo = RestaurantInfo.init()
        let orderPrice = OrderPrice.init(order: order)
        totalHeight += receiptInfo.getHeight() + orderPrice.getHeight()
        for dish in order.dishes {
            let receiptOrderDish = ReceiptOrderDish.init(dish: dish)
            totalHeight += receiptOrderDish.getHeight()
        }
        
        UIGraphicsBeginImageContextWithOptions(CGSize.init(width: DimensionsCatalog.screenSize.width, height: totalHeight), true, 0)
        if let _ = UIGraphicsGetCurrentContext() {
            var height: CGFloat = 0
            
            receiptInfo.asImage().draw(in: CGRect.init(x: 0, y: height, width: DimensionsCatalog.screenSize.width, height: receiptInfo.getHeight()))
            height += receiptInfo.getHeight()
            orderPrice.asImage().draw(in: CGRect.init(x: 0, y: height, width: DimensionsCatalog.screenSize.width, height: orderPrice.getHeight()))
            height += orderPrice.getHeight()
            
            for dish in order.dishes {
                let receiptOrderDish = ReceiptOrderDish.init(dish: dish)
                receiptOrderDish.asImage().draw(in: CGRect.init(x: 0, y: height, width: DimensionsCatalog.screenSize.width, height: receiptOrderDish.getHeight()))
                height += receiptOrderDish.getHeight()
            }
            
            let image = UIGraphicsGetImageFromCurrentImageContext()
            UIGraphicsEndImageContext()
            return image
        } else {
            UIGraphicsEndImageContext()
            return nil
        }
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension ReceiptView: UITableViewDataSource, UITableViewDelegate {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 2 + order.dishes.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if indexPath.row == 0 {
            let cell = tableView.dequeueReusableCell(withIdentifier: restaurantInfoCellId, for: indexPath) as! RestaurantInfoCell
            return cell
        } else if indexPath.row == 1 {
            let cell = tableView.dequeueReusableCell(withIdentifier: orderPriceCellId, for: indexPath) as! OrderPriceCell
            
            cell.order = order
            
            return cell
        } else {
            let cell = tableView.dequeueReusableCell(withIdentifier: receiptOrderDishCellId, for: indexPath) as! ReceiptOrderDishCell
            
            cell.dish = order.dishes[indexPath.row - 2]
            
            return cell
        }
    }
}
