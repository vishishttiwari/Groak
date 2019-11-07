//
//  IntroViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import UIKit

class IntroViewController: UIViewController {
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated);
        
        setupCameraQRCodeView()
    }
    
    // This sets up the camera view with qr code scanner
    private func setupCameraQRCodeView() {
        let cameraView: CameraQRCodeView = CameraQRCodeView()
        
        self.view.addSubview(cameraView)
        cameraView.restaurantFound = { (_ restaurant: Restaurant) -> () in
//            let controller = MenuViewController(restaurant: restaurant)
//
//            controller.modalTransitionStyle = .coverVertical
//            controller.modalPresentationStyle = UIModalPresentationStyle.overCurrentContext
//
//            DispatchQueue.main.async {
//                self.present(controller, animated: true, completion: nil)
//            }
        }
    }
}
