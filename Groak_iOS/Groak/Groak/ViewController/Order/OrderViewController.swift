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
    
    required init() {
        super.init(nibName: nil, bundle: nil)
        
        self.view.backgroundColor = .white
        
        setupHeader()
        setupFooter()
        setupOrderView()
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
        
        orderView.translatesAutoresizingMaskIntoConstraints = false
        orderView.topAnchor.constraint(equalTo: header.bottomAnchor).isActive = true
        orderView.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        orderView.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        orderView.bottomAnchor.constraint(equalTo: footer.topAnchor).isActive = true
    }
    
    private func setupFooter() {
        self.view.addSubview(footer)
        
        footer.translatesAutoresizingMaskIntoConstraints = false
        footer.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        footer.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        footer.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.heightNormal).isActive = true
        footer.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
