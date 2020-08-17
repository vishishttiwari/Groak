package com.groak.groak.location;

import android.Manifest;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.IBinder;
import android.os.Looper;

import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.groak.groak.catalog.DistanceCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.localstorage.LocalRestaurant;

public class GooglePlayServicesLocationListener extends Service {

    private Context context;

    private FusedLocationProviderClient fusedLocationClient;
    private LocationRequest locationRequestForRestaurantsListActivity;
    private LocationRequest locationRequestForProject;

    private LocationCallback locationCallbackForRestaurantsListActivity;
    private LocationCallback locationCallbackForProject;

    public GooglePlayServicesLocationListener() {
    }

    public GooglePlayServicesLocationListener(Context context, GroakCallback groakCallback) {
        this.context = context;

        locationRequestForRestaurantsListActivity = LocationRequest.create();
        locationRequestForRestaurantsListActivity.setInterval(1000);
        locationRequestForRestaurantsListActivity.setFastestInterval(500);
        locationRequestForRestaurantsListActivity.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);

        locationRequestForProject = LocationRequest.create();
        locationRequestForProject.setInterval(3000);
        locationRequestForProject.setFastestInterval(1000);
        locationRequestForProject.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(context);

        locationCallbackForRestaurantsListActivity = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (locationResult == null) {
                    return;
                }
                for (Location location : locationResult.getLocations()) {
                    groakCallback.onSuccess(location);
                    break;
                }
            }
        };

        locationCallbackForProject = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (locationResult == null) {
                    return;
                }
                for (Location location : locationResult.getLocations()) {
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

                    break;
                }
            }
        };
    }

    public void startLocationUpdates() {
        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }

        fusedLocationClient.requestLocationUpdates(locationRequestForRestaurantsListActivity, locationCallbackForRestaurantsListActivity, Looper.getMainLooper());
        fusedLocationClient.requestLocationUpdates(locationRequestForProject, locationCallbackForProject, Looper.getMainLooper());
    }

    public void stopLocationUpdates() {
        fusedLocationClient.removeLocationUpdates(locationCallbackForRestaurantsListActivity);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
