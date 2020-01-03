//
//  DistanceCatalog.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/7/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Catalog file is used to access random distance related information all across the project

import CoreLocation
import Firebase

internal class DistanceCatalog {
    
    // Distance around user till which restaurant is allowed in feet. This will most probably be 200 feet
    private static let distanceBufferInFeet: Double = 20000
    // Each latitude and longitude change in feet
    private static let feetLatitude: Double = 0.000002747252747
    private static let feetLongitude: Double = 0.00000346981263
    
    // Get geopoint below which restaurant will not be allowed
    static func getMinGeoPoint(currentLocation: CLLocationCoordinate2D) -> GeoPoint {
        return GeoPoint.init(latitude: currentLocation.latitude - (distanceBufferInFeet * feetLatitude),
                             longitude: currentLocation.longitude - (distanceBufferInFeet * feetLongitude))
    }
    
    // Get geopoint above which restaurant will not be allowed
    static func getMaxGeoPoint(currentLocation: CLLocationCoordinate2D) -> GeoPoint {
        return GeoPoint.init(latitude: currentLocation.latitude + (distanceBufferInFeet * feetLatitude),
                             longitude: currentLocation.longitude + (distanceBufferInFeet * feetLongitude))
    }
    
    // Distance between two coordinates
    static func getDistance(location1: CLLocation, location2: CLLocation) -> Double {
        return location1.distance(from: location2)
    }
    
    // Create a CLLocation from geopoint
    static func createCLLocation(geoPoint: GeoPoint) -> CLLocation {
        return CLLocation.init(latitude: geoPoint.latitude, longitude: geoPoint.longitude)
    }
    
    // Create a CLLocation from latitude and longitude
    static func createCLLocation(latitude: Double, longitude: Double) -> CLLocation {
        return CLLocation.init(latitude: latitude, longitude: longitude)
    }
    
    // This tells if the location needs to be changed because the distance between previous location of
    // user and new location of user has changed a lot
    static func shouldLocationBeUpdated(location1: CLLocation, location2: CLLocation) -> Bool {
        let distance = getDistance(location1: location1, location2: location2)
        return distance > feetToMeter(meter: distanceBufferInFeet)
    }
    
    static func meterToFeet(meter: Double) -> Double {
        return meter * 3.28084
    }
    
    static func feetToMeter(meter: Double) -> Double {
        return meter/3.28084
    }
    
    // TODO: Sort them in ascending order
    static func getRestaurantsNearCurrentLocation(restaurants: [Restaurant], minGeoPoint: GeoPoint, maxGeoPoint: GeoPoint) -> [Restaurant] {
        var selectedRestaurants: [Restaurant] = []
        for restaurant in restaurants {
            if restaurant.latitude > minGeoPoint.latitude &&
                restaurant.latitude < maxGeoPoint.latitude &&
                restaurant.longitude > minGeoPoint.longitude &&
                restaurant.longitude < maxGeoPoint.longitude {
                selectedRestaurants.append(restaurant)
            }
        }
        
        return selectedRestaurants
    }
}
