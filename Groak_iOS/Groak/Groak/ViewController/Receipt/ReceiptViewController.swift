//
//  ReceiptViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/13/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit
import Photos

internal class ReceiptViewController: ViewControllerWithPan {
    private let header: ReceiptHeaderView = ReceiptHeaderView.init()
    internal var receiptView: ReceiptView = ReceiptView.init()
    private var text: UILabel = UILabel.init()
    private let footer: ReceiptFooterView = ReceiptFooterView.init()
    
    required init() {
        super.init(nibName: nil, bundle: nil)
        
        self.view.backgroundColor = ColorsCatalog.headerGrayShade
        
        setupHeader()
        setupText()
        setupFooter()
        setupReceiptView()
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
            let photos = PHPhotoLibrary.authorizationStatus()
            if photos == .notDetermined || photos == .denied || photos == .restricted {
                DispatchQueue.main.async {
                    PHPhotoLibrary.requestAuthorization({status in
                        if status == .authorized {
                            Catalog.alert(vc: self, title: "Receipt saved to camera roll", message: "Your receipt has been saved to camera roll.")
                            UIImageWriteToSavedPhotosAlbum(self.receiptView.asImage(), nil, nil, nil)
                        } else {
                            Catalog.alert(vc: self, title: "Error saving receipt", message: "Error saving receipt to camera roll.")
                        }
                    })
                }
            } else if photos == .authorized {
                UIImageWriteToSavedPhotosAlbum(self.receiptView.asImage(), nil, nil, nil)
            }
        }
        
        footer.translatesAutoresizingMaskIntoConstraints = false
        footer.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        footer.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        footer.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.heightNormalWithBarItem).isActive = true
        footer.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
