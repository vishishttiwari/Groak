//
//  AllowLocationViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/10/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit
import CoreLocation

internal class AllowLocationViewController: UIViewController, CLLocationManagerDelegate {
    
    // UI Elements declared
    private let noLocation: UIImageView! = UIImageView()
    private let titleLabel: UILabel! = UILabel()
    private let descriptionLabel: UILabel! = UILabel()
    private let settingsButton: UIButton! = UIButton()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupViews()
        
        setupLayout()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        let locationManager = CLLocationManager()
        locationManager.delegate = self
        locationManager.requestAlwaysAuthorization()
        
        if CLLocationManager.locationServicesEnabled() {
            switch CLLocationManager.authorizationStatus() {
                case .authorizedAlways, .authorizedWhenInUse:
                    self.dismiss(animated: true, completion: nil)
                default:
                    break
            }
        }
    }
    
    // Set the display of all the elements
    private func setupViews() {
        self.view.backgroundColor = UIColor.white
        
        noLocation.image = UIImage.init(named: "noCamera")
        noLocation.contentMode = .scaleAspectFit
        self.view.addSubview(noLocation)
        
        titleLabel.viewControllerHeaderTitle(title: "Location permissions are not allowed")
        titleLabel.numberOfLines = 0
        self.view.addSubview(titleLabel)
        
        descriptionLabel.text = "Groak can't retrieve your location. We need this to find out which restaurant you are at. To fix this, please allow Groak to access your location"
        descriptionLabel.font = UIFont(name: FontCatalog.fontLevels[1], size: 18)
        descriptionLabel.textColor = .black
        descriptionLabel.numberOfLines = 0
        descriptionLabel.textAlignment = .center
        self.view.addSubview(descriptionLabel)
        
        settingsButton.footerButton(title: "Go to Settings")
        settingsButton.addTarget(self, action: #selector(settings), for: .touchUpInside)
        self.view.addSubview(settingsButton)
    }
    
    // Sets the contraints
    private func setupLayout() {
        noLocation.translatesAutoresizingMaskIntoConstraints = false
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        settingsButton.translatesAutoresizingMaskIntoConstraints = false
        
        noLocation.centerXAnchor.constraint(equalTo: self.view.centerXAnchor).isActive = true
        noLocation.topAnchor.constraint(equalTo: self.view.topAnchor, constant: DimensionsCatalog.topSafeArea).isActive = true
        noLocation.heightAnchor.constraint(equalToConstant: 100).isActive = true
        noLocation.widthAnchor.constraint(equalToConstant: 100).isActive = true
        
        titleLabel.topAnchor.constraint(equalTo: noLocation.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        titleLabel.leftAnchor.constraint(equalTo: self.view.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        titleLabel.rightAnchor.constraint(equalTo: self.view.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        descriptionLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        descriptionLabel.leftAnchor.constraint(equalTo: self.view.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        descriptionLabel.rightAnchor.constraint(equalTo: self.view.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        settingsButton.topAnchor.constraint(equalTo: descriptionLabel.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        settingsButton.heightAnchor.constraint(equalToConstant: 70).isActive = true
        settingsButton.leftAnchor.constraint(equalTo: self.view.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        settingsButton.rightAnchor.constraint(equalTo: self.view.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        settingsButton.bottomAnchor.constraint(equalTo: self.view.bottomAnchor, constant: -DimensionsCatalog.bottomSafeArea).isActive = true
    }
    
    // Button to go directly to the setting of this app
    @objc func settings() {
        if let bundleId = Bundle.main.bundleIdentifier,
            let url = URL(string: "\(UIApplication.openSettingsURLString)&path=LOCATION/\(bundleId)") {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        }
    }
}
