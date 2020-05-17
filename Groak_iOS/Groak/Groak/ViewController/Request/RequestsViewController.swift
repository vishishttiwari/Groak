//
//  RequestViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/24/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  The class is used for the special requests view controller

import Foundation
import UIKit

internal class RequestViewController: UIViewController {
    private var header: RequestHeaderView?
    private var specialRequestsView: RequestView?
    private var footer: RequestFooterView = RequestFooterView()
    
    private var tapGestureRecognizer: UITapGestureRecognizer?
    
    required init(restaurant: Restaurant) {
        super.init(nibName: nil, bundle: nil)
        
        AppDelegate.badgeCountRequest = 0
        UIApplication.shared.applicationIconBadgeNumber = AppDelegate.badgeCountRequest + AppDelegate.badgeCountOrder
        
        self.view.backgroundColor = .white
        
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
        tapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(self.handleTap(_:)))
        
        header = RequestHeaderView.init(restaurant: restaurant)
        specialRequestsView = RequestView.init()
        
        setupHeader()
        setupFooter(restaurant: restaurant)
        setupSpecialRequests(restaurant: restaurant)
        
        downloadRequests(restaurant: restaurant)
    }
    
    private func setupHeader() {
        self.view.addSubview(header!)
        
        header?.dismiss = { () -> () in
            if let customViewController = self.presentingViewController as? TabbarViewController {
                customViewController.specialRequestButton?.badge = AppDelegate.badgeCountRequest
            } else if let customViewController = self.presentingViewController as? DishViewController {
                customViewController.specialRequestButton?.badge = AppDelegate.badgeCountRequest
            } else if let customViewController = self.presentingViewController as? AddToCartViewController {
                customViewController.specialRequestButton?.badge = AppDelegate.badgeCountRequest
            } else if let customViewController = self.presentingViewController as? ReceiptViewController {
                customViewController.specialRequestButton?.badge = AppDelegate.badgeCountRequest
            }
            self.dismiss(animated: true, completion: nil)
        }
        
        header?.translatesAutoresizingMaskIntoConstraints = false
        header?.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        header?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        header?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        header?.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.heightNormal).isActive = true
    }
    
    private func setupFooter(restaurant: Restaurant) {
        self.view.addSubview(footer)
        
        let fsRequests = LocalRestaurant.fsRequests;
        
        footer.sendRequest = { (_ request: String) -> () in
            let requestObject = Request.init(request: request)
            fsRequests?.addRequestFirestoreAPI(request: requestObject)
        }
        
        footer.frame.size.width = DimensionsCatalog.screenSize.width
        footer.frame.size.height = DimensionsCatalog.viewControllerFooterDimensions.distanceFromBottom + footer.suggestionsHeight + footer.textInputHeight
        footer.frame.origin.x = 0
        footer.frame.origin.y = DimensionsCatalog.screenSize.height - footer.frame.size.height
    }
    
    private func setupSpecialRequests(restaurant: Restaurant) {
        self.view.addSubview(specialRequestsView!)
        
        specialRequestsView?.addGestureRecognizer(tapGestureRecognizer!)
        
        specialRequestsView?.scrollToBottom()
        
        specialRequestsView?.frame.size.width = DimensionsCatalog.screenSize.width
        specialRequestsView?.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - footer.layer.frame.height
        specialRequestsView?.frame.origin.x = 0
        specialRequestsView?.frame.origin.y = DimensionsCatalog.viewControllerHeaderDimensions.heightNormal
    }
    
    private func downloadRequests(restaurant: Restaurant) {
        let fsRequests = LocalRestaurant.fsRequests
        
        fsRequests?.fetchRequestFirestoreAPI()
        
        fsRequests?.dataReceivedForFetchRequests = { (_ requests: Requests?) -> () in
            if let requests = requests, requests.success() {
                self.specialRequestsView?.reloadData(requests: requests)
            }
        }
    }
    
    // Function called when background is tapped
    @objc func handleTap(_ sender: UITapGestureRecognizer) {
        footer.resignKeyboard()
    }
    
    // When the keyboard is shown...this function makes sure that the area that is going to be written is shown and keyboard does not go over it
    @objc func keyboardWillShow(_ notification: Notification) {
        if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
            footer.frame.origin.y = DimensionsCatalog.screenSize.height - footer.frame.size.height + DimensionsCatalog.bottomSafeArea - keyboardFrame.cgRectValue.height - DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements
            specialRequestsView?.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - footer.layer.frame.height + DimensionsCatalog.bottomSafeArea - keyboardFrame.cgRectValue.height - DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements
            specialRequestsView?.scrollToBottom()
        }
    }
    
    // When the keyboard hides then the change in dimensions that was done when keyboard was shown is returned
    @objc func keyboardWillHide(_ notification: Notification) {
        self.footer.frame.origin.y = DimensionsCatalog.screenSize.height - self.footer.frame.size.height
        self.specialRequestsView?.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - self.footer.layer.frame.height
        specialRequestsView?.scrollToBottom()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

//            let size: CGFloat = 26
//            let digits = CGFloat("\(AppDelegate.badgeCountRequest)".count) // digits in the label
//            let width = max(size, 0.7 * size * digits) // perfect circle is smallest allowed
//            let badge = UILabel(frame: CGRect.init(x: 0, y: 0, width: width, height: size))
//            badge.text = "\(AppDelegate.badgeCountRequest)"
//            badge.layer.cornerRadius = size / 2
//            badge.layer.masksToBounds = true
//            badge.textAlignment = .center
//            badge.textColor = .white
//            badge.backgroundColor = ColorsCatalog.themeColor
//            cell.accessoryView = badge // !! change this line
