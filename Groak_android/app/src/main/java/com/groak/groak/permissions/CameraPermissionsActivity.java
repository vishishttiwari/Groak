/**
 * This class is called when camera permission is not allowed. Only in CameraActivity
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

public class CameraPermissionsActivity extends Activity {
    private ConstraintLayout layout;

    private ImageView noCamera;
    private TextView noCameraChat;
    private Button onCameraButton;

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

        noCamera = new ImageView(getContext());
        noCamera.setId(View.generateViewId());
        noCamera.setImageResource(R.drawable.nocamera);
        noCamera.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        noCameraChat = new TextView(getContext());
        noCameraChat.setId(View.generateViewId());
        noCameraChat.setTextSize(DimensionsCatalog.headerTextSize);
        noCameraChat.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        noCameraChat.setTextColor(ColorsCatalog.blackColor);
        noCameraChat.setGravity(Gravity.CENTER);
        noCameraChat.setText("Groak can't scan the qr code. To fix this, please allow Groak to access the camera");
        noCameraChat.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        onCameraButton = new Button(getContext());
        onCameraButton.setId(View.generateViewId());
        onCameraButton.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        onCameraButton.setTextSize(DimensionsCatalog.headerTextSize);
        onCameraButton.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        onCameraButton.setTextColor(ColorsCatalog.whiteColor);
        onCameraButton.setGravity(Gravity.CENTER);
        onCameraButton.setMaxLines(1);
        onCameraButton.setEllipsize(TextUtils.TruncateAt.END);
        onCameraButton.setText("Go to Settings");
        GradientDrawable shape = new GradientDrawable();
        shape.setShape(GradientDrawable.RECTANGLE);
        shape.setColor(ColorsCatalog.themeColor);
        shape.setCornerRadius(15);
        onCameraButton.setBackground(shape);

        onCameraButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent();
                intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                Uri uri = Uri.fromParts("package", getContext().getPackageName(), null);
                intent.setData(uri);
                getContext().startActivity(intent);
            }
        });

        layout.addView(noCamera);
        layout.addView(noCameraChat);
        layout.addView(onCameraButton);
        setContentView(layout);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(noCamera.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 4*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(noCamera.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(noCamera.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(noCamera.getId(), DimensionsCatalog.getValueInDP(200, getContext()));
        set.constrainWidth(noCamera.getId(), DimensionsCatalog.getValueInDP(200, getContext()));

        set.connect(noCameraChat.getId(), ConstraintSet.TOP, noCamera.getId(), ConstraintSet.BOTTOM, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(noCameraChat.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(noCameraChat.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(noCameraChat.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(onCameraButton.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(onCameraButton.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(onCameraButton.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(onCameraButton.getId(), DimensionsCatalog.getHeaderHeight(getContext()));

        set.applyTo(layout);
    }

    private Context getContext() {
        return this;
    }
}
