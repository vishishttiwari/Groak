//
//  IntroViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This sets up the intro view controller. Thi first view controller the user will see

import Foundation
import UIKit

class IntroViewController: UIViewController {
    
    private var cameraView: CameraQRCodeView?
    private var bottomSheetView: BottomSheetView?
    
    private var selectedRestaurant: Restaurant? = nil
    
    private var permissions = PermissionsCatalog.init()
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        print("IntroViewController")
        
        setTopBottomSafeArea()
        
        if permissions.askCameraPermission(viewController: self) {
            setupCameraQRCodeView()
            setupBottomSheetView()
        } else {
            permissions.cameraPermissionGranted = { (_ granted: Bool) -> () in
                if granted {
                    DispatchQueue.main.async {
                        self.setupCameraQRCodeView()
                        self.setupBottomSheetView()
                    }
                }
            }
        }
        
        PermissionsCatalog.askLocationPermission(viewController: self)
        
        
        
        
        
        
        
        
//        let restaurant = Restaurant.init("jk")
//        let controller = TabbarViewController(restaurant: restaurant)
//
//        controller.modalTransitionStyle = .coverVertical
//        controller.modalPresentationStyle = UIModalPresentationStyle.overCurrentContext
//
//        DispatchQueue.main.async {
//            self.present(controller, animated: true, completion: nil)
//        }
        
        
        
        
        
        
        
        
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
        cameraView = CameraQRCodeView()
        self.view.addSubview(cameraView!)
        
//      When the qrcode of a restaurant is found, check if it is same as the closest restaurant. If yes then the
//      user is at the restaurant. Otherwise the user is not at restaurant. Once the restaurants are matched then
//      the camera stops scanning for qr codes
        cameraView?.restaurantFound = { (_ table: Table, _ restaurant: Restaurant) -> () in
            if restaurant.reference?.documentID == self.selectedRestaurant?.reference?.documentID {
                LocalRestaurant.createRestaurant(restaurant: restaurant, table: table)
                if LocalRestaurant.isRestaurantCreationSuccessful() {
                
                    self.cameraView?.stopScanningForQR()
                    self.bottomSheetView?.stopUpdatingLocation()
                    
                    AppDelegate.resetTimer()

                    let controller = TabbarViewController.init(restaurant: restaurant)

                    controller.modalTransitionStyle = .coverVertical
                    controller.modalPresentationStyle = UIModalPresentationStyle.overCurrentContext

                    DispatchQueue.main.async {
                        self.present(controller, animated: true, completion: nil)
                    }
                } else {
                    self.bottomSheetView?.setRestaurantNotFound()
                    Catalog.alert(vc: self, title: "Error finding table", message: "Error finding table. Please contact the restaurant and we will get this sorted")
                }
            }
        }
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
        bottomSheetView!.stateChanged = { (_ state: BottomSheetState, _ restaurant: Restaurant?) -> () in
            
            if state == BottomSheetState.RestaurantFound, let restaurant = restaurant {
                self.cameraView?.startScanningForQR()
                
                self.selectedRestaurant = restaurant
                
                DispatchQueue.main.async {
                    UIView.animate(withDuration: TimeCatalog.animateTime, animations: {
                        self.bottomSheetView!.frame.origin.x = 0
                        self.bottomSheetView!.frame.origin.y = DimensionsCatalog.bottomSheetHeight
                        self.bottomSheetView!.frame.size.height = DimensionsCatalog.screenSize.height - DimensionsCatalog.bottomSheetHeight
                        self.bottomSheetView!.roundCorners([.layerMaxXMinYCorner, .layerMinXMinYCorner ], radius: 2*DimensionsCatalog.cornerRadius)
                    })
                }
            } else {
                self.cameraView?.stopScanningForQR()

                DispatchQueue.main.async {
                    UIView.animate(withDuration: TimeCatalog.animateTime, animations: {
                        self.bottomSheetView!.frame.origin.x = 0
                        self.bottomSheetView!.frame.origin.y = 0
                        self.bottomSheetView!.frame.size.height = DimensionsCatalog.screenSize.height
                        self.bottomSheetView!.layer.cornerRadius = 0
                    })
                }
            }
        }
    }
    
    func returningToIntro() {
        bottomSheetView?.setRestaurantNotFound()
        AppDelegate.stopTimer()
    }
}
