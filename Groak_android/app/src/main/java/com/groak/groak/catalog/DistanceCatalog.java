/**
 * The functions here are distance related, used all across the project
 */
package com.groak.groak.catalog;

import android.app.Activity;
import android.content.Context;
import android.location.Location;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.groak.groak.restaurantobject.restaurant.Restaurant;

import java.util.ArrayList;
import java.util.Collections;

public class DistanceCatalog {
    /**
     * Distance around user till which restaurant is allowed in feet. This will most probably be 200 feet
     */
    public static double distanceBufferInFeet = 500;
    private static double feetLatitude = 0.000002747252747;
    private static double feetLongitude= 0.00000346981263;

    public static float getDistanceBetweenCoordinates(Location loc1, Location loc2) {
        return loc1.distanceTo(loc2);
    }

    /**
     * Min geo point from current location using feet
     *
     * @param location
     * @return
     */
    public static Location getMinGeoPoint(Location location) {
        return createLocation(location.getLatitude() - (distanceBufferInFeet * feetLatitude), location.getLongitude() - (distanceBufferInFeet * feetLongitude));
    }

    /**
     * Max geo point from current location using feet
     *
     * @param location
     * @return
     */
    public static Location getMaxGeoPoint(Location location) {
        return createLocation(location.getLatitude() + (distanceBufferInFeet * feetLatitude), location.getLongitude() + (distanceBufferInFeet * feetLongitude));
    }

    public static Location createLocation(double latitude, double longitude) {
        Location location =  new Location("");
        location.setLatitude(latitude);
        location.setLongitude(longitude);

        return location;
    }

    public static double meterToFeet(double meter) {
        return meter * 3.28084;
    }

    public static double feetToMeter(double feet) {
        return feet/3.28084;
    }

    /**
     * This gets the closest location in ascending order from the nearest
     *
     * @param restaurants
     * @param minLocation
     * @param maxLocation
     * @param currentLocation
     * @return
     */
    public static ArrayList<Restaurant> getRestaurantNearCurrentLocation(ArrayList<Restaurant> restaurants, Location minLocation, Location maxLocation, final Location currentLocation) {
        ArrayList<Restaurant> newRestaurants = new ArrayList<>();
        for (Restaurant restaurant: restaurants) {
            if (restaurant.getLatitude() <= maxLocation.getLatitude()
                && restaurant.getLongitude() <= maxLocation.getLongitude()
                && restaurant.getLatitude() >= minLocation.getLatitude()
                && restaurant.getLongitude() >= minLocation.getLongitude()) {
                newRestaurants.add(restaurant);
            }
        }

        Collections.sort(newRestaurants, (Restaurant r1, Restaurant r2) -> Double.compare(getDistanceBetweenCoordinates(createLocation(r1.getLatitude(), r1.getLongitude()), currentLocation), (getDistanceBetweenCoordinates(createLocation(r2.getLatitude(), r2.getLongitude()), currentLocation))));

        return newRestaurants;
    }
}
