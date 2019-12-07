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

internal enum BottomSheetState {
    case RestaurantFound
    case RestaurantNotFound
}

internal class BottomSheetView: UIView, CLLocationManagerDelegate {
    
    // Optional Closures
    internal var restaurantFound: ((_ state: BottomSheetState, _ restaurant: Restaurant) -> ())?
    
    private var state: BottomSheetState = BottomSheetState.RestaurantNotFound
    
    private let header: BottomSheetHeaderView = BottomSheetHeaderView.init()
    private let restaurantsList: RestaurantsListView = RestaurantsListView.init()
    private let restaurantFullView: RestaurantFullView = RestaurantFullView.init()
    
    // Variables used for location
    private let locationManager = CLLocationManager()
    private var previousLocation: CLLocation? = nil
    
    // Initialize variable for finding the closest restaurant
    private let fsRestaurant = FirestoreAPICallsRestaurants.init();
    
    required init() {
        super.init(frame: .zero)
        
        self.backgroundColor = .white
        
        setupHeader()
        
        setupRestauarantsList()
        setupRestauarantsFullView()
        
        setupLocation()
    }
    
    private func setupHeader() {
        self.addSubview(header)
        header.clipsToBounds = true
        
        header.frame.origin.x = 0
        header.frame.origin.y = 0
        header.frame.size.width = DimensionsCatalog.screenSize.width
        header.frame.size.height = DimensionsCatalog.viewControllerHeaderDimensions.heightNormal
    }
    
    private func setupRestauarantsList() {
        self.addSubview(restaurantsList)
        
        restaurantsList.translatesAutoresizingMaskIntoConstraints = false
        restaurantsList.topAnchor.constraint(equalTo: header.bottomAnchor).isActive = true
        restaurantsList.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        restaurantsList.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        restaurantsList.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
        
        restaurantsList.restaurantSelected = { (_ restaurant: Restaurant) -> () in
            self.state = BottomSheetState.RestaurantFound
            self.restaurantsList.isHidden = true
            self.restaurantFullView.restaurant = restaurant
            self.restaurantFullView.isHidden = false
            self.header.stateChanged(state: self.state)
            self.restaurantFound?(self.state, restaurant)
            
            DispatchQueue.main.async {
                UIView.animate(withDuration: TimeCatalog.animateTime, animations: {
                    self.header.frame.size.height = DimensionsCatalog.viewControllerHeaderDimensions.heightNormal - (DimensionsCatalog.viewControllerHeaderDimensions.distanceFromTop - DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements)
                })
            }
        }
    }
    
    private func setupRestauarantsFullView() {
        self.addSubview(restaurantFullView)
        restaurantFullView.isHidden = true
        
        restaurantFullView.translatesAutoresizingMaskIntoConstraints = false
        restaurantFullView.topAnchor.constraint(equalTo: header.bottomAnchor).isActive = true
        restaurantFullView.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        restaurantFullView.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        restaurantFullView.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
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
        fsRestaurant.dataReceivedForFetchRestaurants = { (_ restaurants: [Restaurant]?) -> () in
            if let restaurants = restaurants {
                self.restaurantsList.reloadData(restaurants: restaurants)
            }
        }

        previousLocation = locations[0]
    }
    
    func setBackToRestaurantNotFound() {
        self.state = BottomSheetState.RestaurantNotFound
        self.restaurantsList.isHidden = true
        self.restaurantFullView.restaurant = Restaurant.init()
        self.restaurantFullView.isHidden = false
        self.header.stateChanged(state: self.state)
        
        DispatchQueue.main.async {
            self.header.frame.size.height = DimensionsCatalog.viewControllerHeaderDimensions.heightNormal
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
