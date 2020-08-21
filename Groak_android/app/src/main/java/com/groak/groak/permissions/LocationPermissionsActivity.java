/**
 * This class is called when location permission is not given. This is used all over the project.
 */
package com.groak.groak.permissions;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.R;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;

public class LocationPermissionsActivity extends Activity {
    private ConstraintLayout layout;

    private ImageView noLocation;
    private TextView noLocationChat;
    private Button onLocationButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setupViews();

        setupInitialLayout();
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
        noLocationChat.setText("Groak can't retrieve your location. We need this to find out which restaurant you are at. To fix this, please allow Groak to access your location");
        noLocationChat.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        onLocationButton = new Button(getContext());
        onLocationButton.setId(View.generateViewId());
        onLocationButton.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        onLocationButton.setTextSize(DimensionsCatalog.headerTextSize);
        onLocationButton.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        onLocationButton.setTextColor(ColorsCatalog.whiteColor);
        onLocationButton.setGravity(Gravity.CENTER);
        onLocationButton.setMaxLines(1);
        onLocationButton.setEllipsize(TextUtils.TruncateAt.END);
        onLocationButton.setText("Go to Settings");
        GradientDrawable shape = new GradientDrawable();
        shape.setShape(GradientDrawable.RECTANGLE);
        shape.setColor(ColorsCatalog.themeColor);
        shape.setCornerRadius(15);
        onLocationButton.setBackground(shape);

        onLocationButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent();
                intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                Uri uri = Uri.fromParts("package", getContext().getPackageName(), null);
                intent.setData(uri);
                getContext().startActivity(intent);
            }
        });

        layout.addView(noLocation);
        layout.addView(noLocationChat);
        layout.addView(onLocationButton);
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

        set.connect(onLocationButton.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(onLocationButton.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(onLocationButton.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(onLocationButton.getId(), DimensionsCatalog.getHeaderHeight(getContext()));

        set.applyTo(layout);
    }

    private Context getContext() {
        return this;
    }
}
