//
//  BottomSheetView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
// This sets up the bottom sheet that shows the closest restaurants

import Foundation
import UIKit
import Firebase
import CoreLocation

internal class BottomSheetView: UIView, CLLocationManagerDelegate {
    
    // Optional Closures
    internal var restaurantFound: ((_ restaurant: Restaurant) -> ())?
    
    // UI Elements in this view
    private let welcomeTitle: UILabel = UILabel()
    private let restaurantTitle: UILabel = UILabel()
    private let restaurantLogo: UIImageView = UIImageView()
    private let loadingIndicator: UIActivityIndicatorView = UIActivityIndicatorView.init(style: .gray)
    
    // Dimensions used in this view
    private let threshold: CGFloat = 200
    private let cornerRadius: CGFloat = 40
    private let headerHeight: CGFloat = 80
    private let distanceBetweenElements: CGFloat = 10
    private let titleFont: UIFont = UIFont(name: FontCatalog.fontLevels[3], size: 30)!
    private let restaurantHeight: CGFloat = 80
    
    // Variables used for location
    private let locationManager = CLLocationManager()
    private var previousLocation: CLLocation? = nil
    
    // Initialize variable for finding the closest restaurant
    private let fsRestaurant = FirestoreAPICallsRestaurants.init();
    
    required init() {
        super.init(frame: .zero)
        
        setupViews()
        
        setupInitialLayout()
        
        setupLocation()
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.roundCorners([.layerMaxXMinYCorner, .layerMinXMinYCorner ], radius: cornerRadius)
        
        welcomeTitle.text = "Welcome to"
        welcomeTitle.textAlignment = .center
        welcomeTitle.backgroundColor = .clear
        welcomeTitle.font = titleFont
        welcomeTitle.textColor = .black
        welcomeTitle.isHidden = true
        
        restaurantTitle.textAlignment = .center
        restaurantTitle.backgroundColor = .clear
        restaurantTitle.font = titleFont
        restaurantTitle.textColor = .black
        restaurantTitle.isHidden = true
        
        restaurantLogo.backgroundColor = .clear
        restaurantLogo.contentMode = .scaleAspectFit
        restaurantLogo.isHidden = true
        
        loadingIndicator.isHidden = false
        loadingIndicator.hidesWhenStopped = true
        loadingIndicator.startAnimating()
        
        self.addSubview(welcomeTitle)
        self.addSubview(restaurantTitle)
        self.addSubview(restaurantLogo)
        self.addSubview(loadingIndicator)
    }
    
    private func setupInitialLayout() {
        welcomeTitle.translatesAutoresizingMaskIntoConstraints = false
        restaurantTitle.translatesAutoresizingMaskIntoConstraints = false
        restaurantLogo.translatesAutoresizingMaskIntoConstraints = false
        loadingIndicator.translatesAutoresizingMaskIntoConstraints = false
        
        welcomeTitle.topAnchor.constraint(equalTo: self.topAnchor, constant: distanceBetweenElements).isActive = true
        welcomeTitle.leftAnchor.constraint(equalTo: self.leftAnchor, constant: distanceBetweenElements).isActive = true
        welcomeTitle.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -distanceBetweenElements).isActive = true
        welcomeTitle.heightAnchor.constraint(equalToConstant: titleFont.lineHeight).isActive = true
        
        restaurantTitle.topAnchor.constraint(equalTo: welcomeTitle.bottomAnchor, constant: distanceBetweenElements).isActive = true
        restaurantTitle.leftAnchor.constraint(equalTo: self.leftAnchor, constant: distanceBetweenElements).isActive = true
        restaurantTitle.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -distanceBetweenElements).isActive = true
        restaurantTitle.heightAnchor.constraint(equalToConstant: restaurantHeight).isActive = true
        
        restaurantLogo.topAnchor.constraint(equalTo: welcomeTitle.bottomAnchor, constant: distanceBetweenElements).isActive = true
        restaurantLogo.leftAnchor.constraint(equalTo: self.leftAnchor, constant: distanceBetweenElements).isActive = true
        restaurantLogo.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -distanceBetweenElements).isActive = true
        restaurantLogo.heightAnchor.constraint(equalToConstant: restaurantHeight).isActive = true
        
        loadingIndicator.centerYAnchor.constraint(equalTo: self.centerYAnchor).isActive = true
        loadingIndicator.centerXAnchor.constraint(equalTo: self.centerXAnchor).isActive = true
        loadingIndicator.heightAnchor.constraint(equalToConstant: restaurantHeight).isActive = true
        loadingIndicator.widthAnchor.constraint(equalToConstant: restaurantHeight).isActive = true
    }
    
    // This sets up the location manager for getting the current position of user
    private func setupLocation() {
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
    }
    
    // This function is called everytime the user changes position
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let location = locations[0]
        
        // If the previous location is within 30 meters of the current location then the closest restaurant is not fetched
        if let previousLocation = previousLocation {
            if !DistanceCatalog.shouldLocationBeUpdated(location1: locations[0], location2: previousLocation) {
                return
            }
        }
        
        // Find the closest restaurant to the current coordinate. if a restaurant is found then return back with the
        // restaurant. Otherwise show that restaurant is not close to this position.
        fsRestaurant.fetchClosestRestaurantFirestoreAPI(currentLocation: location.coordinate)
        fsRestaurant.dataReceivedForFetchRestaurant = { (_ restaurant: Restaurant?) -> () in
            self.loadingIndicator.stopAnimating()
            if let restaurant = restaurant, restaurant.success() {
                self.welcomeTitle.isHidden = false
                if (restaurant.restaurantLogo.count == 0) {
                    self.restaurantTitle.text = restaurant.restaurantName
                    self.restaurantTitle.isHidden = false
                } else {
                    self.restaurantLogo.loadImageUsingCache(url: restaurant.restaurantLogo)
                    self.restaurantLogo.isHidden = false
                }
                self.restaurantFound?(restaurant)
            } else {
                self.restaurantTitle.text = "Restaurants not found near you"
                self.restaurantTitle.isHidden = false
            }
        }
        
        previousLocation = locations[0]
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
