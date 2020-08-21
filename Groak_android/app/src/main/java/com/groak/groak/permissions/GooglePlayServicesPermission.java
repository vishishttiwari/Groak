/**
 * This class is called when google play services is not available. This is used all over the project.
 */
package com.groak.groak.permissions;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.groak.groak.R;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;

public class GooglePlayServicesPermission extends Activity {
    private ConstraintLayout layout;

    private ImageView noLocation;
    private TextView noLocationChat;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setupViews();

        setupInitialLayout();

        checkGooglePlayServices();
    }

    private void setupViews() {
        layout = new ConstraintLayout(this);
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        noLocation = new ImageView(getContext());
        noLocation.setId(View.generateViewId());
        noLocation.setImageResource(R.drawable.nolocation);
        noLocation.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        noLocationChat = new TextView(getContext());
        noLocationChat.setId(View.generateViewId());
        noLocationChat.setTextSize(DimensionsCatalog.headerTextSize);
        noLocationChat.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        noLocationChat.setTextColor(ColorsCatalog.blackColor);
        noLocationChat.setGravity(Gravity.CENTER);
        noLocationChat.setText("Groak won't work unless you enable Google Play Services. This is needed to fetch location");
        noLocationChat.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        layout.addView(noLocation);
        layout.addView(noLocationChat);
        setContentView(layout);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(noLocation.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 4*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(noLocation.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(noLocation.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(noLocation.getId(), DimensionsCatalog.getValueInDP(200, getContext()));
        set.constrainWidth(noLocation.getId(), DimensionsCatalog.getValueInDP(200, getContext()));

        set.connect(noLocationChat.getId(), ConstraintSet.TOP, noLocation.getId(), ConstraintSet.BOTTOM, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(noLocationChat.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(noLocationChat.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(noLocationChat.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }

    private boolean checkGooglePlayServices() {
        final int PLAY_SERVICES_RESOLUTION_REQUEST = 9000;
        GoogleApiAvailability api = GoogleApiAvailability.getInstance();
        int resultCode = api.isGooglePlayServicesAvailable(getContext());
        if (resultCode != ConnectionResult.SUCCESS) {
            if (api.isUserResolvableError(resultCode))
                api.getErrorDialog(((Activity) getContext()), resultCode, PLAY_SERVICES_RESOLUTION_REQUEST).show();
            else {
                Catalog.alert(getContext(), "Device not supported", "This device does not support Google Play Services. Groak cannot be used on this device.", new GroakCallback() {
                    @Override
                    public void onSuccess(Object object) {
                    }
                    @Override
                    public void onFailure(Exception e) {
                    }
                });
            }
            return false;
        }
        return true;
    }

    private Context getContext() {
        return this;
    }
}
