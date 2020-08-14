package com.groak.groak.activity.restaurant;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;

import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.core.app.ActivityCompat;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.groak.groak.R;
import com.groak.groak.activity.camera.CameraActivity;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.groakheader.GroakHeader;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsRestaurants;
import com.groak.groak.restaurantobject.restaurant.Restaurant;
import com.groak.groak.restaurantobject.restaurant.RestaurantSerializer;

import java.util.ArrayList;

public class RestaurantListActivity extends Activity {
    private ConstraintLayout layout;

    private GroakHeader restaurantHeader;
    private RecyclerView restaurantView;
    private ImageView noRestaurantFound;

    private LocationManager locationManager;
    private LocationListener locationListener;

    private ArrayList<Restaurant> restaurants = new ArrayList<>();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setupViews();

        setupInitialLayout();

        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
    }

    private void startLocationListening() {

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }

        locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                FirestoreAPICallsRestaurants.fetchClosestRestaurantFirestoreAPI(location, new GroakCallback() {
                    @Override
                    public void onSuccess(Object object) {
                        ArrayList<Restaurant> restaurants = (ArrayList<Restaurant>)object;
                        if (restaurants.size() == 0) {
                            restaurantView.setVisibility(View.GONE);
                            noRestaurantFound.setVisibility(View.VISIBLE);
                        } else if (restaurants.size() == 1) {
                            restaurantView.setVisibility(View.VISIBLE);
                            noRestaurantFound.setVisibility(View.GONE);

                            GsonBuilder builder = new GsonBuilder();
                            builder.registerTypeAdapter(Restaurant.class, new RestaurantSerializer());
                            final Gson gson = builder.create();

                            Intent intent = new Intent(getContext(), CameraActivity.class);

                            intent.putExtra("restaurant", gson.toJson(restaurants.get(0)));
                            getContext().startActivity(intent);
                        } else {
                            restaurantView.setVisibility(View.VISIBLE);
                            noRestaurantFound.setVisibility(View.GONE);

                            ((RestaurantRecyclerViewAdapter) restaurantView.getAdapter()).refresh(restaurants);
                        }
                    }

                    @Override
                    public void onFailure(Exception e) {
                    }
                });
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
        };

        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 500, 10, locationListener);
    }

    @Override
    protected void onResume() {
        super.onResume();
        startLocationListening();
    }

    @Override
    protected void onPause() {
        if (locationManager != null && locationListener != null) {
            locationManager.removeUpdates(locationListener);
        }
        super.onPause();
    }

    private void setupViews() {
        layout = new ConstraintLayout(this);
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        restaurantHeader = new GroakHeader(this, "Restaurants around you");
        restaurantHeader.setId(View.generateViewId());
        restaurantHeader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        restaurantView = new RecyclerView(this);
        restaurantView.setId(View.generateViewId());
        restaurantView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        restaurantView.setLayoutManager(new LinearLayoutManager(this));
        restaurantView.setAdapter(new RestaurantRecyclerViewAdapter(this, restaurants, null));
        restaurantView.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.VERTICAL));
        restaurantView.setNestedScrollingEnabled(false);
        restaurantView.setBackgroundColor(ColorsCatalog.whiteColor);
        restaurantView.setVisibility(View.GONE);

        noRestaurantFound = new ImageView(getContext());
        noRestaurantFound.setId(View.generateViewId());
        noRestaurantFound.setImageResource(R.drawable.norestaurant);
        noRestaurantFound.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        noRestaurantFound.setVisibility(View.GONE);

        layout.addView(restaurantHeader);
        layout.addView(restaurantView);
        layout.addView(noRestaurantFound);
        setContentView(layout);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(restaurantHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(restaurantHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(restaurantHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(restaurantHeader.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(restaurantView.getId(), ConstraintSet.TOP, restaurantHeader.getId(), ConstraintSet.BOTTOM);
        set.connect(restaurantView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(restaurantView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(restaurantView.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);

        set.connect(noRestaurantFound.getId(), ConstraintSet.TOP, restaurantHeader.getId(), ConstraintSet.BOTTOM, 2* DimensionsCatalog.distanceBetweenElements);
        set.connect(noRestaurantFound.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2* DimensionsCatalog.distanceBetweenElements);
        set.connect(noRestaurantFound.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2* DimensionsCatalog.distanceBetweenElements);
        set.constrainHeight(noRestaurantFound.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }

    private Context getContext() {
        return this;
    }
}
