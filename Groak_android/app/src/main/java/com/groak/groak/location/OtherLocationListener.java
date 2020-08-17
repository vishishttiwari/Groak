package com.groak.groak.location;

import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.os.Bundle;

import com.groak.groak.catalog.DistanceCatalog;
import com.groak.groak.localstorage.LocalRestaurant;

public class OtherLocationListener implements LocationListener {

    private Context context;

    public OtherLocationListener(Context context) {
        this.context = context;
    }

    @Override
    public void onLocationChanged(Location location) {
        System.out.println("#####");
        System.out.println(location);
        System.out.println("#####");
        if (LocalRestaurant.restaurant == null) {
            return;
        }
        double restaurantLatitude = LocalRestaurant.restaurant.getLatitude();
        double restaurantLongitude = LocalRestaurant.restaurant.getLongitude();

        double feet = DistanceCatalog.meterToFeet(
                DistanceCatalog.getDistanceBetweenCoordinates(location,
                        DistanceCatalog.createLocation(restaurantLatitude, restaurantLongitude)));

        if (feet > DistanceCatalog.distanceBufferInFeet)
            LocalRestaurant.leaveRestaurantWithoutAsking(context);
    }

    @Override
    public void onStatusChanged(String s, int i, Bundle bundle) {

    }

    @Override
    public void onProviderEnabled(String s) {

    }

    @Override
    public void onProviderDisabled(String s) {

    }
}
