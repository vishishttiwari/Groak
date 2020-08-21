/**
 * This class is used for getting location using google play services
 */
package com.groak.groak.location;

import android.Manifest;
import android.app.Activity;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Build;
import android.os.IBinder;
import android.os.Looper;

import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.groak.groak.R;
import com.groak.groak.catalog.DistanceCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.permissions.GooglePlayServicesPermission;
import com.groak.groak.permissions.LocationPermissionsActivity;

public class GooglePlayServicesLocationListener extends Service {

    private static Context context;

    /**
     * The variables below:
     *
     * RestaurantListActivity is used for only that activity. This is stopped as soon as the RestaurantListActivity is paused
     * Project is used all over the project.
     */
    private static FusedLocationProviderClient fusedLocationClient;
    private static LocationRequest locationRequestForRestaurantsListActivity;
    private static LocationRequest locationRequestForProject;

    private static LocationCallback locationCallbackForRestaurantsListActivity;
    private static LocationCallback locationCallbackForProject;

    /**
     * This is used for the service in manifest file. This is mandatory is you are using
     * a class as a service
     */
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

    public static void startLocationUpdates(int REQUEST_LOCATION_PERMISSION_RESULT) {
        if (!checkGooglePlayServices()) {
            Intent intent = new Intent(context, GooglePlayServicesPermission.class);
            context.startActivity(intent);
            ((Activity) context).overridePendingTransition(R.anim.slide_in_up, R.anim.slide_out_down);
            return;
        }


        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                ((Activity)context).requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, REQUEST_LOCATION_PERMISSION_RESULT);
            } else {
                Intent intent = new Intent(context, LocationPermissionsActivity.class);
                context.startActivity(intent);
                ((Activity)context).overridePendingTransition(R.anim.slide_in_up, R.anim.slide_out_down);
            }
            return;
        }
        fusedLocationClient.requestLocationUpdates(locationRequestForRestaurantsListActivity, locationCallbackForRestaurantsListActivity, Looper.getMainLooper());
        fusedLocationClient.requestLocationUpdates(locationRequestForProject, locationCallbackForProject, Looper.getMainLooper());
    }

    public static void stopLocationUpdates() {
        fusedLocationClient.removeLocationUpdates(locationCallbackForRestaurantsListActivity);
    }

    /**
     * This is used in almost every activity to first check if google play services and location is on
     * and if it is on then it requests for location updates.
     *
     * @param context
     */
    public static void checkLocationPermissions(Context context) {
        if (!checkGooglePlayServices()) {
            Intent intent = new Intent(context, GooglePlayServicesPermission.class);
            context.startActivity(intent);
            ((Activity)context).overridePendingTransition(R.anim.slide_in_up, R.anim.slide_out_down);
            return;
        }
        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            Intent intent = new Intent(context, LocationPermissionsActivity.class);
            context.startActivity(intent);
            ((Activity)context).overridePendingTransition(R.anim.slide_in_up, R.anim.slide_out_down);
        }
        fusedLocationClient.requestLocationUpdates(locationRequestForProject, locationCallbackForProject, Looper.getMainLooper());
    }

    private static boolean checkGooglePlayServices() {
        GoogleApiAvailability api = GoogleApiAvailability.getInstance();
        int resultCode = api.isGooglePlayServicesAvailable(context);
        if (resultCode != ConnectionResult.SUCCESS)
            return false;
        return true;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
