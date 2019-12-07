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
    
    private static let distanceBufferInFeet: Double = 10000
    private static let distanceChangeBufferInMeters: Double = 30
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
    
    static func shouldLocationBeUpdated(location1: CLLocation, location2: CLLocation) -> Bool {
        let distance = getDistance(location1: location1, location2: location2)
        return distance > distanceChangeBufferInMeters
    }
    
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
