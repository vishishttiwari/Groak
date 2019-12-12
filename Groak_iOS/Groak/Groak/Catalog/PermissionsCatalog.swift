//
//  PermissionsCatalog.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/10/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import AVFoundation
import UIKit
import CoreLocation

internal class PermissionsCatalog {
    
    init() {
    }
    
    var cameraPermissionGranted: ((_ granted: Bool) -> ())?
    
    // This function asks for camera permission
    func askCameraPermission(viewController: UIViewController) -> Bool {
        if AVCaptureDevice.authorizationStatus(for: AVMediaType.video) ==  AVAuthorizationStatus.authorized {
            return true
        } else {
            AVCaptureDevice.requestAccess(for: AVMediaType.video, completionHandler: { (granted: Bool) -> Void in
                if granted == true {
                    self.cameraPermissionGranted?(true)
                } else {
                    DispatchQueue.main.async {
                        let controller = AllowCameraViewController()
                        
                        controller.modalTransitionStyle = .coverVertical
                        controller.modalPresentationStyle = UIModalPresentationStyle.overCurrentContext
                        
                        viewController.present(controller, animated: true, completion: nil)
                    }
                }
            })
        }
        return false
    }
    
    static func askLocationPermission(viewController: UIViewController) {
        if CLLocationManager.locationServicesEnabled() {
            switch CLLocationManager.authorizationStatus() {
                case .notDetermined, .restricted, .denied:
                    DispatchQueue.main.async {
                        let controller = AllowLocationViewController()
                        
                        controller.modalTransitionStyle = .coverVertical
                        controller.modalPresentationStyle = UIModalPresentationStyle.overCurrentContext
                        
                        viewController.present(controller, animated: true, completion: nil)
                    }
                default:
                    break
            }
        } else {
            DispatchQueue.main.async {
                let controller = AllowLocationViewController()
                
                controller.modalTransitionStyle = .coverVertical
                controller.modalPresentationStyle = UIModalPresentationStyle.overCurrentContext
                
                viewController.present(controller, animated: true, completion: nil)
            }
        }
    }
}
