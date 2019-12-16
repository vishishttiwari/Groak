//
//  AllowCameraViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/10/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Class used up for setting up the screen that will show up if camera permissions is not allowed

import AVFoundation
import UIKit

internal class AllowCameraViewController: UIViewController {
    
    // UI Elements declared
    private let noCamera: UIImageView! = UIImageView()
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

        if AVCaptureDevice.authorizationStatus(for: AVMediaType.video) ==  AVAuthorizationStatus.authorized {
            self.dismiss(animated: false, completion: nil)
        }
    }
    
    // Set the display of all the elements
    private func setupViews() {
        self.view.backgroundColor = UIColor.white
        
        noCamera.image = UIImage.init(named: "noCamera")
        noCamera.contentMode = .scaleAspectFit
        self.view.addSubview(noCamera)
        
        titleLabel.viewControllerHeaderTitle(title: "Camera permissions are not allowed")
        titleLabel.numberOfLines = 0
        self.view.addSubview(titleLabel)
        
        descriptionLabel.text = "Groak can't scan the qr code. To fix this, please allow Groak to access the camera"
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
        noCamera.translatesAutoresizingMaskIntoConstraints = false
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        settingsButton.translatesAutoresizingMaskIntoConstraints = false
        
        noCamera.centerXAnchor.constraint(equalTo: self.view.centerXAnchor).isActive = true
        noCamera.topAnchor.constraint(equalTo: self.view.topAnchor, constant: DimensionsCatalog.topSafeArea).isActive = true
        noCamera.heightAnchor.constraint(equalToConstant: 100).isActive = true
        noCamera.widthAnchor.constraint(equalToConstant: 100).isActive = true
        
        titleLabel.topAnchor.constraint(equalTo: noCamera.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
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
