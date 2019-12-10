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
    internal let orderView: OrderView = OrderView.init()
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
        tapGestureRecognizer!.cancelsTouchesInView = false
        self.view.addGestureRecognizer(tapGestureRecognizer!)
        
        setupHeader()
        setupFooter()
        setupOrderView()
        downloadOrder()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        if LocalStorage.tableOrder.dishes.count <= 0 {
            orderView.isHidden = true
            footer.isHidden = true
        } else {
            orderView.isHidden = false
            footer.isHidden = false
            orderView.order = LocalStorage.tableOrder
            orderView.reloadData()
        }
    }
    
    private func setupHeader() {
        self.view.addSubview(header)
        
        header.dismiss = { () -> () in
            self.dismiss(animated: true, completion: nil)
        }
        
        header.translatesAutoresizingMaskIntoConstraints = false
        header.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        header.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        header.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        header.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.heightNormal).isActive = true
    }
    
    private func setupOrderView() {
        self.view.addSubview(orderView)
        
        orderView.instructionSent = { () -> () in
            Catalog.alert(vc: self, title: "Instruction Sent", message: "Restaurant has been notified")
        }
        
        orderView.frame.size.width = DimensionsCatalog.screenSize.width
        orderView.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - DimensionsCatalog.viewControllerFooterDimensions.heightNormalWithBarItem - DimensionsCatalog.tabBarHeight
        orderView.frame.origin.x = 0
        orderView.frame.origin.y = DimensionsCatalog.viewControllerHeaderDimensions.heightNormal
    }
    
    private func setupFooter() {
        self.view.addSubview(footer)
        
        footer.translatesAutoresizingMaskIntoConstraints = false
        footer.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        footer.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        footer.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.heightNormalWithBarItem).isActive = true
        footer.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    // Function called when background is tapped
    @objc func handleTap(_ sender: UITapGestureRecognizer) {
        orderView.endEditing(true)
    }
    
    @objc func keyboardWillShow(_ notification: Notification) {
        if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
            tapGestureRecognizer!.cancelsTouchesInView = true
            
            orderView.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - keyboardFrame.cgRectValue.height
            orderView.scrollToBottom()
        }
    }
    
    @objc func keyboardWillHide(_ notification: Notification) {
        orderView.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - DimensionsCatalog.viewControllerFooterDimensions.heightNormalWithBarItem - DimensionsCatalog.tabBarHeight
    }
    
    @objc func keyboardDidHide(_ notification: Notification) {
        tapGestureRecognizer!.cancelsTouchesInView = false
    }
    
    private func downloadOrder() {
        let fsOrder = FirestoreAPICallsOrders.init();
        
        fsOrder.fetchOrderFirestoreAPI()
        
        fsOrder.dataReceivedForFetchOrder = { (_ order: Order?) -> () in
            LocalStorage.tableOrder = order ?? Order.init()
            self.orderView.order = LocalStorage.tableOrder
            self.orderView.reloadData()
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
