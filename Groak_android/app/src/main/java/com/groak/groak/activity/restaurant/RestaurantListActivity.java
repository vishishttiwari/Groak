package com.groak.groak.activity.restaurant;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.R;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.groakheader.GroakHeader;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsRestaurants;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.location.GooglePlayServicesLocationListener;
import com.groak.groak.permissions.CameraPermissionsActivity;
import com.groak.groak.permissions.LocationPermissionsActivity;
import com.groak.groak.restaurantobject.restaurant.Restaurant;

import java.util.ArrayList;

public class RestaurantListActivity extends Activity {
    private ConstraintLayout layout;

    private GroakHeader restaurantHeader;
    private RecyclerView restaurantView;
    private ImageView noRestaurantFound;

    private AlertDialog loadingSpinner;

    private ArrayList<Restaurant> restaurants = new ArrayList<>();

    private GooglePlayServicesLocationListener locationListener;

    private static final int REQUEST_LOCATION_PERMISSION_RESULT = 1;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setupViews();

        setupInitialLayout();

        setupLocation();
    }

    @Override
    protected void onResume() {
        super.onResume();
        LocalRestaurant.resetRestaurant();
        locationListener.startLocationUpdates(REQUEST_LOCATION_PERMISSION_RESULT);
    }

    @Override
    protected void onPause() {
        locationListener.stopLocationUpdates();
        super.onPause();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == REQUEST_LOCATION_PERMISSION_RESULT) {
            if (grantResults[0] != PackageManager.PERMISSION_GRANTED) {
                Intent intent = new Intent(getContext(), LocationPermissionsActivity.class);
                getContext().startActivity(intent);
                ((Activity)getContext()).overridePendingTransition(R.anim.slide_in_up, R.anim.slide_out_down);
                return;
            }
        }
    }

    private void setupViews() {
        layout = new ConstraintLayout(this);
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        loadingSpinner = Catalog.loading(getContext(), "Fetching restaurants around you");

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

        set.connect(noRestaurantFound.getId(), ConstraintSet.TOP, restaurantHeader.getId(), ConstraintSet.BOTTOM, 2* DimensionsCatalog.getDistanceBetweenElements(this));
        set.connect(noRestaurantFound.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2* DimensionsCatalog.getDistanceBetweenElements(this));
        set.connect(noRestaurantFound.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2* DimensionsCatalog.getDistanceBetweenElements(this));
        set.constrainHeight(noRestaurantFound.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }

    private void setupLocation() {
        locationListener = new GooglePlayServicesLocationListener(this, new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                Location location = (Location) object;

                FirestoreAPICallsRestaurants.fetchClosestRestaurantFirestoreAPI(location, new GroakCallback() {
                    @Override
                    public void onSuccess(Object object) {
                        loadingSpinner.dismiss();
                        ArrayList<Restaurant> restaurants = (ArrayList<Restaurant>) object;
                        if (restaurants.size() == 0) {
                            restaurantView.setVisibility(View.GONE);
                            noRestaurantFound.setVisibility(View.VISIBLE);
                            restaurantHeader.setHeader("Groak");
                        } else {
                            restaurantView.setVisibility(View.VISIBLE);
                            noRestaurantFound.setVisibility(View.GONE);
                            restaurantHeader.setHeader("Restaurants around you");

                            ((RestaurantRecyclerViewAdapter) restaurantView.getAdapter()).refresh(restaurants);
                        }
                    }
                    @Override
                    public void onFailure(Exception e) {
                        loadingSpinner.dismiss();
                        restaurantView.setVisibility(View.GONE);
                        noRestaurantFound.setVisibility(View.VISIBLE);
                        restaurantHeader.setHeader("Groak");
                    }
                });
            }
            @Override
            public void onFailure(Exception e) {
                loadingSpinner.dismiss();
                restaurantView.setVisibility(View.GONE);
                noRestaurantFound.setVisibility(View.VISIBLE);
                restaurantHeader.setHeader("Groak");
            }
        });
    }

    private Context getContext() {
        return this;
    }
}
