//
//  ReceiptViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/13/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class represents the receipt view controller

import Foundation
import UIKit
import Photos

internal class ReceiptViewController: ViewControllerWithPan {
    var specialRequestButton: SpecialRequestButton?
    private let header: ReceiptHeaderView = ReceiptHeaderView.init()
    internal var receiptView: ReceiptView = ReceiptView.init()
    private var text: UILabel = UILabel.init()
    private let footer: ReceiptFooterView = ReceiptFooterView.init()
    
    required init(restaurant: Restaurant) {
        super.init(nibName: nil, bundle: nil)
        
        self.view.backgroundColor = ColorsCatalog.headerGrayShade
        
        setupHeader()
        setupText()
        setupFooter()
        setupReceiptView()
        
        specialRequestButton = SpecialRequestButton(viewController: self, restaurant: restaurant)
        specialRequestButton?.badge = AppDelegate.badgeCountRequest
    }
    
    private func setupHeader() {
        self.view.addSubview(header)
        
        header.dismiss = { () -> () in
            self.view.coverHorizontalDismiss()
            self.dismiss(animated: false, completion: nil)
        }
        header.leave = { () -> () in
            LocalRestaurant.askToLeaveRestaurant()
        }
        header.receiptChanged = { (_ index: Int) -> () in
            self.receiptView.receiptChanged(index: index)
        }
        
        header.translatesAutoresizingMaskIntoConstraints = false
        header.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        header.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        header.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        header.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.heightExtended).isActive = true
    }
    
    private func setupText() {
        text.text = "Someone will be with you shortly for payment"
        text.font = UIFont(name: FontCatalog.fontLevels[1], size: 20)
        text.numberOfLines = 0
        text.textColor = .black
        text.lineBreakMode = .byTruncatingTail
        text.textAlignment = .center
        text.sizeToFit()
        self.view.addSubview(text)
        
        text.translatesAutoresizingMaskIntoConstraints = false
        text.topAnchor.constraint(equalTo: self.header.bottomAnchor).isActive = true
        text.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        text.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
    }
    
    private func setupReceiptView() {
        self.view.addSubview(receiptView)
        
        receiptView.translatesAutoresizingMaskIntoConstraints = false
        receiptView.topAnchor.constraint(equalTo: self.text.bottomAnchor).isActive = true
        receiptView.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        receiptView.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        receiptView.bottomAnchor.constraint(equalTo: self.footer.topAnchor).isActive = true
    }
    
    private func setupFooter() {
        self.view.addSubview(footer)
        
        footer.saveToCameraRoll = { () -> () in
            guard let image = self.receiptView.createImage() else {
                Catalog.alert(vc: self, title: "Error saving receipt", message: "Error saving receipt to camera roll")
                return
            }
            
            let photos = PHPhotoLibrary.authorizationStatus()
            if photos == .notDetermined || photos == .denied || photos == .restricted {
                PHPhotoLibrary.requestAuthorization({status in
                    if status == .authorized {
                        DispatchQueue.main.async {
                            UIImageWriteToSavedPhotosAlbum(image, self, #selector(self.savedImage), nil)
                        }
                    } else {
                        DispatchQueue.main.async {
                            let alert = UIAlertController(title: "Access to camera roll not authorized", message: "Groak would like to access the camera roll to save receipts", preferredStyle: .alert)
                            alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
                            alert.addAction(UIAlertAction(title: "Go To Settings", style: .default, handler: { (UIAlertAction) in
                                if let bundleId = Bundle.main.bundleIdentifier,
                                  let url = URL(string: "\(UIApplication.openSettingsURLString)&path=LOCATION/\(bundleId)") {
                                  UIApplication.shared.open(url, options: [:], completionHandler: nil)
                                }
                            }))
                            self.present(alert, animated: true, completion: nil)
                        }
                    }
                })
            } else if photos == .authorized {
                UIImageWriteToSavedPhotosAlbum(image, self, #selector(self.savedImage), nil)
            }
        }
        
        footer.translatesAutoresizingMaskIntoConstraints = false
        footer.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        footer.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        footer.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.heightNormalWithBarItem).isActive = true
        footer.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    @objc func savedImage(_ im:UIImage, error:Error?, context:UnsafeMutableRawPointer?) {
        if let _ = error {
            Catalog.alert(vc: self, title: "Error saving receipt", message: "Error saving receipt to camera roll")
            return
        }
        Catalog.alert(vc: self, title: "Receipt saved to camera roll", message: "Your receipt has been saved to camera roll")
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
