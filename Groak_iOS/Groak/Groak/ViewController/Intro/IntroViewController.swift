//
//  IntroViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This sets up the intro view controller. Thi first view controller the user will see


import UIKit

class IntroViewController: UIViewController {
    
//    private var cameraView: CameraQRCodeView = CameraQRCodeView()
    private var bottomSheetView: BottomSheetView?
    
    private var closestRestaurant: Restaurant? = nil
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated);
        
        setTopBottomSafeArea()
//        setupCameraQRCodeView()
        setupBottomSheetView()
        
        
        
        
        
        
        
        let restaurant = Restaurant.init("jk")
        let controller = MenuViewController(restaurant: restaurant)

        controller.modalTransitionStyle = .coverVertical
        controller.modalPresentationStyle = UIModalPresentationStyle.overCurrentContext

        DispatchQueue.main.async {
            self.present(controller, animated: true, completion: nil)
        }
        
        
        
        
        
        
        
        
    }
    
    // Setup the top and bottom safe area when the first view controller loads up
    private func setTopBottomSafeArea() {
        if #available(iOS 11.0, *) {
            let window = UIApplication.shared.windows[0]
            let safeFrame = window.safeAreaLayoutGuide.layoutFrame
            DimensionsCatalog.topSafeArea = safeFrame.minY
            DimensionsCatalog.bottomSafeArea = window.frame.maxY - safeFrame.maxY
        }
        else {
            DimensionsCatalog.topSafeArea = topLayoutGuide.length
            DimensionsCatalog.bottomSafeArea = bottomLayoutGuide.length
        }
    }
    
    // This sets up the camera view with qr code scanner
    private func setupCameraQRCodeView() {
//        self.view.addSubview(cameraView)
        
        // When the qrcode of a restaurant is found, check if it is same as the closest restaurant. If yes then the
        // user is at the restaurant. Otherwise the user is not at restaurant. Once the restaurants are matched then
        // the camera stops scanning for qr codes
//        cameraView.restaurantFound = { (_ restaurant: Restaurant) -> () in
//            if restaurant.reference?.documentID == self.closestRestaurant?.reference?.documentID {
//                self.cameraView.stopScanningForQR()
//
//                let controller = MenuViewController(restaurant: restaurant)
//
//                controller.modalTransitionStyle = .coverVertical
//                controller.modalPresentationStyle = UIModalPresentationStyle.overCurrentContext
//
//                DispatchQueue.main.async {
//                    self.present(controller, animated: true, completion: nil)
//                }
//            }
//        }
    }
    
    // This sets up the view at the bottom
    private func setupBottomSheetView() {
        bottomSheetView = BottomSheetView()
        
        self.view.addSubview(bottomSheetView!)
        
        bottomSheetView!.frame.origin.x = 0
        bottomSheetView!.frame.origin.y = 0
        bottomSheetView!.frame.size.width = DimensionsCatalog.screenSize.width
        bottomSheetView!.frame.size.height = DimensionsCatalog.screenSize.height
        
        // When a restaurant is found near you then start scanning for barcodes because you are at a restaurant that uses groak
        bottomSheetView!.restaurantFound = { (_ restaurant: Restaurant) -> () in
//            self.cameraView.startScanningForQR()
            
            self.closestRestaurant = restaurant
            
            DispatchQueue.main.async {
                UIView.animate(withDuration: TimeCatalog.animateTime, animations: {
                    self.bottomSheetView!.frame.origin.y = DimensionsCatalog.bottomSheetHeight
                    self.bottomSheetView!.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.bottomSheetHeight
                })
            }
        }
    }
}
