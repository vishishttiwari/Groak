//
//  DistanceCatalog.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/7/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import CoreLocation
import Firebase

internal class DistanceCatalog {
    
    private static let distanceBufferInFeet: Double = 20000
    private static let distanceChangeBufferInMeters: Double = feetToMeter(meter: distanceBufferInFeet)
    private static let feetLatitude: Double = 0.000002747252747
    private static let feetLongitude: Double = 0.00000346981263
    
    static func getMinGeoPoint(currentLocation: CLLocationCoordinate2D) -> GeoPoint {
        return GeoPoint.init(latitude: currentLocation.latitude - (distanceBufferInFeet * feetLatitude),
                             longitude: currentLocation.longitude - (distanceBufferInFeet * feetLongitude))
    }
    
    static func getMaxGeoPoint(currentLocation: CLLocationCoordinate2D) -> GeoPoint {
        return GeoPoint.init(latitude: currentLocation.latitude + (distanceBufferInFeet * feetLatitude),
                             longitude: currentLocation.longitude + (distanceBufferInFeet * feetLongitude))
    }
    
    static func getDistance(location1: CLLocation, location2: CLLocation) -> Double {
        return location1.distance(from: location2)
    }
    
    static func createCLLocation(geoPoint: GeoPoint) -> CLLocation {
        return CLLocation.init(latitude: geoPoint.latitude, longitude: geoPoint.longitude)
    }
    
    static func createCLLocation(latitude: Double, longitude: Double) -> CLLocation {
        return CLLocation.init(latitude: latitude, longitude: longitude)
    }
    
    static func shouldLocationBeUpdated(location1: CLLocation, location2: CLLocation) -> Bool {
        let distance = getDistance(location1: location1, location2: location2)
        return distance > distanceChangeBufferInMeters
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
