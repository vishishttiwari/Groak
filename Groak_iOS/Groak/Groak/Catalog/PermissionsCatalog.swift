//
//  PermissionsCatalog.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/10/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Catalog file is used to create random premission checks used all across the project

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
                        controller.modalPresentationStyle = .overCurrentContext
                        
                        viewController.present(controller, animated: true, completion: nil)
                    }
                }
            })
        }
        return false
    }
    
    // This function asks for location permission
    static func askLocationPermission() {
        if CLLocationManager.locationServicesEnabled() {
            switch CLLocationManager.authorizationStatus() {
                case .restricted, .denied:
                    askLocation()
                default:
                    break
            }
        } else {
            askLocation()
        }
    }
    
    // This function is used for to raise the alert view for taking user to the settings of this app
    private static func askLocation() {
        DispatchQueue.main.async {
            let alert = UIAlertController(title: "Location is turned off", message: "Groak would like to access the location to find the restaurants around you. Please go to settings to allow location use.", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Go To Settings", style: .cancel, handler: { (UIAlertAction) in
                if let bundleId = Bundle.main.bundleIdentifier,
                  let url = URL(string: "\(UIApplication.openSettingsURLString)&path=LOCATION/\(bundleId)") {
                  UIApplication.shared.open(url, options: [:], completionHandler: nil)
                }
            }))
            if var topController = UIApplication.shared.keyWindow?.rootViewController {
                while let presentedViewController = topController.presentedViewController {
                    topController = presentedViewController
                }
                topController.present(alert, animated: true, completion: nil)
            }
        }
    }
}
