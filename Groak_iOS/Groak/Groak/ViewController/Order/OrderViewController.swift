//
//  OrderViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/5/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class represents the Order View Controller

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
        header.orderChanged = { (_ index: Int) -> () in
            self.orderChanged(index: index)
        }
        
        header.translatesAutoresizingMaskIntoConstraints = false
        header.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        header.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        header.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        header.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.heightExtended).isActive = true
    }
    
    private func setupOrderView() {
        orderView = OrderView.init(viewController: self)
        self.view.addSubview(orderView!)
        orderView?.newRefreshControl.addTarget(self, action: #selector(downloadOrder), for: .valueChanged)
        
        orderView?.instructionSent = { () -> () in
            Catalog.alert(vc: self, title: "Instruction Sent", message: "Restaurant has been notified")
        }
        
        orderView?.frame.size.width = DimensionsCatalog.screenSize.width
        orderView?.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightExtended - DimensionsCatalog.viewControllerFooterDimensions.heightExtendedWithBarItem - DimensionsCatalog.tabBarHeight
        orderView?.frame.origin.x = 0
        orderView?.frame.origin.y = DimensionsCatalog.viewControllerHeaderDimensions.heightExtended
    }
    
    private func setupFooter() {
        self.view.addSubview(footer)
        
        footer.pay = { () -> () in
            if LocalRestaurant.tableOrder.dishes.count == 0 {
                Catalog.alert(vc: self, title: "No orders", message: "Please order dishes before paying")
            } else {
                let controller = ReceiptViewController.init()

                self.view.coverHorizontalPresent()
                controller.modalPresentationStyle = .overCurrentContext

                DispatchQueue.main.async {
                    self.present(controller, animated: true, completion: nil)
                }
            }
        }
        
        footer.translatesAutoresizingMaskIntoConstraints = false
        footer.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        footer.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        footer.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.heightExtendedWithBarItem).isActive = true
        footer.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    // When segment control is changed...price and order is changed through this function
    private func orderChanged(index: Int) {
        orderView?.orderChanged(index: index)
        footer.orderChanged(index: index)
    }
    
    // Function called when background is tapped
    @objc func handleTap(_ sender: UITapGestureRecognizer) {
        orderView?.endEditing(true)
    }
    
    // This changes the dimension of the view so that the textview is visible when the keyboard shows up
    @objc func keyboardWillShow(_ notification: Notification) {
        if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
            tapGestureRecognizer?.cancelsTouchesInView = true
            
            orderView?.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightExtended - keyboardFrame.cgRectValue.height
            orderView?.scrollToSpecialInstructions()
        }
    }
    
    // When keyboard is hid...this returns the dimensions to previous dimensions
    @objc func keyboardWillHide(_ notification: Notification) {
        orderView?.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightExtended - DimensionsCatalog.viewControllerFooterDimensions.heightExtendedWithBarItem - DimensionsCatalog.tabBarHeight
    }
    
    // Cancels all the tap gestures
    @objc func keyboardDidHide(_ notification: Notification) {
        tapGestureRecognizer?.cancelsTouchesInView = false
    }
    
    // This function downloads the order at start and also at refresh
    // TODO: I think I dont need to do pull to refresh because order has a snapshot receiver so it should be updated on its own
    @objc private func downloadOrder() {
        let fsOrder = LocalRestaurant.fsOrders
        
        fsOrder?.fetchOrderFirestoreAPI()
        
        fsOrder?.dataReceivedForFetchOrder = { (_ order: Order?) -> () in
            LocalRestaurant.setLocalTableOrder(viewController: self, order: order ?? Order.init())
            self.orderView?.order = LocalRestaurant.tableOrder
            self.orderView?.reloadData()
            self.footer.reload()
            self.header.showWhichOrder?.isUserInteractionEnabled = true
        }
        if self.orderView?.refreshControl?.isRefreshing ?? false
        {
            self.orderView?.refreshControl?.endRefreshing()
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
