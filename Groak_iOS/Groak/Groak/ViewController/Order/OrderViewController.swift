//
//  OrderViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/5/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal enum OrderStatus: String {
    case Requested = "Requested"
    case Accepted = "Accepted"
    case Delivered = "Delivered"
}

internal class OrderViewController: UIViewController {
    private let header: OrderHeaderView = OrderHeaderView.init()
    internal var orderView: OrderView?
    private let footer: OrderFooterView = OrderFooterView.init()
    
    private var tapGestureRecognizer: UITapGestureRecognizer?
    
    required init() {
        super.init(nibName: nil, bundle: nil)
        
        self.view.backgroundColor = ColorsCatalog.headerGrayShade
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(keyboardWillShow),
            name: UIResponder.keyboardWillShowNotification,
            object: nil
        )
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(keyboardWillHide),
            name: UIResponder.keyboardWillHideNotification,
            object: nil
        )
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(keyboardDidHide),
            name: UIResponder.keyboardDidHideNotification,
            object: nil
        )
        tapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(self.handleTap(_:)))
        tapGestureRecognizer?.cancelsTouchesInView = false
        self.view.addGestureRecognizer(tapGestureRecognizer!)
        
        setupHeader()
        setupFooter()
        setupOrderView()
        downloadOrder()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        if LocalRestaurant.tableOrder.exists {
            orderView?.isHidden = false
            footer.isHidden = false
            orderView?.order = LocalRestaurant.tableOrder
            orderView?.reloadData()
        } else {
            orderView?.isHidden = true
            footer.isHidden = true
        }
    }
    
    private func setupHeader() {
        self.view.addSubview(header)
        
        header.dismiss = { () -> () in
            LocalRestaurant.askToLeaveRestaurant()
        }
        
        header.translatesAutoresizingMaskIntoConstraints = false
        header.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        header.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        header.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        header.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.heightNormal).isActive = true
    }
    
    private func setupOrderView() {
        orderView = OrderView.init(viewController: self)
        self.view.addSubview(orderView!)
        
        orderView?.instructionSent = { () -> () in
            Catalog.alert(vc: self, title: "Instruction Sent", message: "Restaurant has been notified")
        }
        
        orderView?.frame.size.width = DimensionsCatalog.screenSize.width
        orderView?.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - DimensionsCatalog.viewControllerFooterDimensions.heightNormalWithBarItem - DimensionsCatalog.tabBarHeight
        orderView?.frame.origin.x = 0
        orderView?.frame.origin.y = DimensionsCatalog.viewControllerHeaderDimensions.heightNormal
    }
    
    private func setupFooter() {
        self.view.addSubview(footer)
        
        footer.pay = { () -> () in
            let controller = ReceiptViewController.init()

            controller.modalTransitionStyle = .coverVertical
            controller.modalPresentationStyle = UIModalPresentationStyle.overCurrentContext

            DispatchQueue.main.async {
                self.present(controller, animated: true, completion: nil)
            }
        }
        
        footer.translatesAutoresizingMaskIntoConstraints = false
        footer.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        footer.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        footer.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.heightNormalWithBarItem).isActive = true
        footer.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    // Function called when background is tapped
    @objc func handleTap(_ sender: UITapGestureRecognizer) {
        orderView?.endEditing(true)
    }
    
    @objc func keyboardWillShow(_ notification: Notification) {
        if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
            tapGestureRecognizer?.cancelsTouchesInView = true
            
            orderView?.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - keyboardFrame.cgRectValue.height
            orderView?.scrollToSpecialInstructions()
        }
    }
    
    @objc func keyboardWillHide(_ notification: Notification) {
        orderView?.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - DimensionsCatalog.viewControllerFooterDimensions.heightNormalWithBarItem - DimensionsCatalog.tabBarHeight
    }
    
    @objc func keyboardDidHide(_ notification: Notification) {
        tapGestureRecognizer?.cancelsTouchesInView = false
    }
    
    private func downloadOrder() {
        let fsOrder = LocalRestaurant.fsOrders
        
        fsOrder?.fetchOrderFirestoreAPI()
        
        fsOrder?.dataReceivedForFetchOrder = { (_ order: Order?) -> () in
            LocalRestaurant.setTableOrder(viewController: self, order: order ?? Order.init())
            self.orderView?.order = LocalRestaurant.tableOrder
            self.orderView?.reloadData()
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
