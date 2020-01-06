//
//  SpecialRequestsViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/24/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  The class is used for the special requests view controller

import Foundation
import UIKit

internal class SpecialRequestsViewController: ViewControllerWithPan {
    private var header: SpecialRequestsHeaderView?
    private var specialRequestsView: SpecialRequestsView?
    private var footer: SpecialReqiestsFooterView = SpecialReqiestsFooterView()
    
    private var tapGestureRecognizer: UITapGestureRecognizer?
    
    required init(restaurant: Restaurant) {
        super.init(nibName: nil, bundle: nil)
        
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
        
        header = SpecialRequestsHeaderView.init(restaurant: restaurant)
        specialRequestsView = SpecialRequestsView.init()
        
        setupHeader()
        setupFooter(restaurant: restaurant)
        setupSpecialRequests(restaurant: restaurant)
        
        downloadRequests(restaurant: restaurant)
    }
    
    private func setupHeader() {
        self.view.addSubview(header!)
        
        header?.dismiss = { () -> () in
            self.view.coverHorizontalDismiss()
            self.dismiss(animated: false, completion: nil)
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
