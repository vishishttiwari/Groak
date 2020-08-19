package com.groak.groak.activity.camera;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.groak.groak.R;
import com.groak.groak.activity.restaurant.RestaurantListActivity;
import com.groak.groak.activity.tabbar.TabbarActivity;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.DistanceCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.location.GooglePlayServicesLocationListener;
import com.groak.groak.permissions.CameraPermissionsActivity;
import com.groak.groak.restaurantobject.restaurant.Restaurant;
import com.groak.groak.restaurantobject.restaurant.RestaurantDeserializer;
import com.groak.groak.restaurantobject.restaurant.RestaurantSerializer;

public class CameraActivity extends Activity {
    private ConstraintLayout layout;

    private static final int REQUEST_CAMERA_PERMISSION_RESULT = 0;

    private TextView scanQR;
    private CameraPreview cameraPreview;
    private BottomSheet bottomSheet;

    private Restaurant restaurant;

    private boolean initiatedEnterRestaurant = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Restaurant.class, new RestaurantDeserializer());
        final Gson gson = builder.create();

        Intent i = getIntent();
        restaurant = gson.fromJson(i.getStringExtra("restaurant"), Restaurant.class);

        setupViews();
        setupInitialLayout();
        updateRestaurant();
//        new java.util.Timer().schedule(
//                new java.util.TimerTask() {
//                    @Override
//                    public void run() {
//                        enterRestaurant("r18cb7350q82598q0cczmo", "uhp40oq9w8ifsl5xeax13p");
//                    }
//                },
//                1000
//        );
    }

    @Override
    protected void onResume() {
        super.onResume();
        GooglePlayServicesLocationListener.checkLocationPermissions(getContext());
        LocalRestaurant.resetRestaurant();
        cameraPreview.onResume();
        initiatedEnterRestaurant = false;
    }

    @Override
    protected void onPause() {
        cameraPreview.onPause();
        super.onPause();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_CAMERA_PERMISSION_RESULT) {
            if (grantResults[0] != PackageManager.PERMISSION_GRANTED) {
                Intent intent = new Intent(getContext(), CameraPermissionsActivity.class);
                getContext().startActivity(intent);
                ((Activity)getContext()).overridePendingTransition(R.anim.slide_in_up, R.anim.slide_out_down);
            }
        }
    }

    private void updateRestaurant() {
        if (restaurant != null) {
            bottomSheet.updateRestaurant(restaurant);
        }
    }

    private void setupViews() {
        layout = new ConstraintLayout(this);
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        scanQR = new TextView(this);
        scanQR.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        scanQR.setId(View.generateViewId());
        scanQR.setTextSize(15);
        scanQR.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        scanQR.setTextColor(ColorsCatalog.whiteColor);
        scanQR.setGravity(Gravity.CENTER);
        scanQR.setPadding(50, 20, 50, 20);
        scanQR.setText("Scan QR Code");
        GradientDrawable shape = new GradientDrawable();
        shape.setShape(GradientDrawable.RECTANGLE);
        shape.setColor(ColorsCatalog.grayColor);
        shape.setCornerRadius(50);
        scanQR.setBackground(shape);
        scanQR.setElevation(100);

        cameraPreview = new CameraPreview(this, restaurant.getReference().getId(), REQUEST_CAMERA_PERMISSION_RESULT, new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                String url = (String)object;
                checkGroakElements(url);
            }

            @Override
            public void onFailure(Exception e) {

            }
        });
        cameraPreview.setId(View.generateViewId());
        cameraPreview.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        cameraPreview.setBackgroundColor(ColorsCatalog.blackColor);

        bottomSheet = new BottomSheet(this);
        bottomSheet.setId(View.generateViewId());
        bottomSheet.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        bottomSheet.setBackgroundColor(ColorsCatalog.headerGrayShade);

        layout.addView(scanQR);
        layout.addView(cameraPreview);
        layout.addView(bottomSheet);
        setContentView(layout);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(scanQR.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(this));
        set.connect(scanQR.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(this));
        set.connect(scanQR.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(this));
        set.constrainHeight(scanQR.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(scanQR.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(cameraPreview.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(cameraPreview.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(cameraPreview.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(cameraPreview.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);

        set.connect(bottomSheet.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(bottomSheet.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(bottomSheet.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set.constrainHeight(bottomSheet.getId(), DimensionsCatalog.screenHeight/2 + DimensionsCatalog.getSoftButtonsBarSizePort(this));

        set.applyTo(layout);
    }

    private void enterRestaurant(String tableId, String qrCodeId) {
        if (!initiatedEnterRestaurant) {
            initiatedEnterRestaurant = true;
            GsonBuilder builder = new GsonBuilder();
            builder.registerTypeAdapter(Restaurant.class, new RestaurantSerializer());
            final Gson gson = builder.create();

            Intent intent = new Intent(getContext(), TabbarActivity.class);
            intent.putExtra("restaurant", gson.toJson(restaurant));
            intent.putExtra("tableId", tableId);
            intent.putExtra("qrCodeId", qrCodeId);
            getContext().startActivity(intent);
        }
    }

    public void checkGroakElements(String url) {
        String[] urlElements = url.split("/");

        String restaurantId = urlElements[2];
        String tableId = urlElements[3];
        String qrCodeId = urlElements[4];

        enterRestaurant(tableId, qrCodeId);
    }

    private Context getContext() {
        return this;
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        overridePendingTransition(R.anim.slide_in_up, R.anim.slide_out_down);
    }
}
