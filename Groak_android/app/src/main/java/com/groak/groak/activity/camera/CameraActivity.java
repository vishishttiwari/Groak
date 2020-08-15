package com.groak.groak.activity.camera;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.LinearLayout;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.groak.groak.R;
import com.groak.groak.activity.tabbar.TabbarActivity;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.restaurantobject.restaurant.Restaurant;
import com.groak.groak.restaurantobject.restaurant.RestaurantDeserializer;
import com.groak.groak.restaurantobject.restaurant.RestaurantSerializer;

public class CameraActivity extends Activity {
    private ConstraintLayout layout;

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
//                        enterRestaurant("r18cb7350q82598q0cczmo");
//                    }
//                },
//                10000
//        );
    }

    @Override
    protected void onResume() {
        super.onResume();
        cameraPreview.onResume();
        initiatedEnterRestaurant = false;
    }

    @Override
    protected void onPause() {
        cameraPreview.onPause();
        super.onPause();
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

        cameraPreview = new CameraPreview(this, restaurant.getReference().getId(), new GroakCallback() {

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
        cameraPreview.setBackgroundColor(ColorsCatalog.headerGrayShade);

        bottomSheet = new BottomSheet(this);
        bottomSheet.setId(View.generateViewId());
        bottomSheet.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        bottomSheet.setBackgroundColor(ColorsCatalog.headerGrayShade);

        layout.addView(cameraPreview);
        layout.addView(bottomSheet);
        setContentView(layout);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

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

    private void enterRestaurant(String tableId) {
        if (!initiatedEnterRestaurant) {
            initiatedEnterRestaurant = true;
            GsonBuilder builder = new GsonBuilder();
            builder.registerTypeAdapter(Restaurant.class, new RestaurantSerializer());
            final Gson gson = builder.create();

            Intent intent = new Intent(getContext(), TabbarActivity.class);
            intent.putExtra("restaurant", gson.toJson(restaurant));
            intent.putExtra("tableId", tableId);
            System.out.println("Here");
            getContext().startActivity(intent);
        }
    }

    public void checkGroakElements(String url) {
        String[] urlElements = url.split("/");

        String restaurantId = urlElements[2];
        String tableId = urlElements[3];
        String qrCodeId = urlElements[4];

        enterRestaurant(tableId);
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
