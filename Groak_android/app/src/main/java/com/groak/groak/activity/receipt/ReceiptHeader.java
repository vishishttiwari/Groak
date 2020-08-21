/**
 * This class is used to represent the header of receipt
 */
package com.groak.groak.activity.receipt;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.groakheader.GroakOtherHeader;

public class ReceiptHeader extends GroakOtherHeader {

    private ConstraintLayout buttonLayout;
    private Button tableOrder;
    private Button yourOrder;

    private int buttonHeight;

    public ReceiptHeader(Context context, String header, GroakCallback callback) {
        super(context, header, callback);

        buttonHeight = DimensionsCatalog.getHeaderOtherHeight(context);

        setupViews(callback);

        setupInitialLayout();
    }

    private void setupViews(final GroakCallback callback) {
        setBackgroundColor(ColorsCatalog.headerGrayShade);

        buttonLayout = new ConstraintLayout(getContext());
        buttonLayout.setId(View.generateViewId());
        buttonLayout.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        buttonLayout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        tableOrder = new Button(getContext());
        tableOrder.setId(View.generateViewId());
        tableOrder.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        tableOrder.setText("Table Receipt");
        tableOrder.setTextColor(ColorsCatalog.whiteColor);
        tableOrder.setTypeface(FontCatalog.fontLevels(getContext(), 2));
        final GradientDrawable gd = new GradientDrawable();
        gd.setCornerRadii(new float[]{20, 20, 0, 0, 0, 0, 20, 20});
        gd.setColor(ColorsCatalog.themeColor);
        gd.setStroke(5, ColorsCatalog.themeColor);
        tableOrder.setBackground(gd);

        yourOrder = new Button(getContext());
        yourOrder.setId(View.generateViewId());
        yourOrder.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        yourOrder.setText("Your Receipt");
        yourOrder.setTypeface(FontCatalog.fontLevels(getContext(), 2));
        final GradientDrawable gd1 = new GradientDrawable();
        gd1.setCornerRadii(new float[]{0, 0, 20, 20, 20, 20, 0, 0});
        gd1.setStroke(5, ColorsCatalog.themeColor);
        yourOrder.setBackground(gd1);
        tableOrder.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                gd.setColor(ColorsCatalog.themeColor);
                tableOrder.setTextColor(ColorsCatalog.whiteColor);

                gd1.setColor(Color.TRANSPARENT);
                yourOrder.setTextColor(ColorsCatalog.blackColor);

                callback.onSuccess("Table Order");
            }
        });
        yourOrder.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                gd1.setColor(ColorsCatalog.themeColor);
                yourOrder.setTextColor(ColorsCatalog.whiteColor);

                gd.setColor(Color.TRANSPARENT);
                tableOrder.setTextColor(ColorsCatalog.blackColor);

                callback.onSuccess("Your Order");
            }
        });

        addView(buttonLayout);
        buttonLayout.addView(tableOrder);
        buttonLayout.addView(yourOrder);
    }

    private void setupInitialLayout() {
        ConstraintSet set1 = new ConstraintSet();
        set1.clone(buttonLayout);

        set1.connect(tableOrder.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set1.connect(tableOrder.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(tableOrder.getId(), ConstraintSet.RIGHT, yourOrder.getId(), ConstraintSet.LEFT);
        set1.connect(tableOrder.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set1.constrainHeight(tableOrder.getId(), buttonHeight);

        set1.connect(yourOrder.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set1.connect(yourOrder.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.connect(yourOrder.getId(), ConstraintSet.LEFT, tableOrder.getId(), ConstraintSet.RIGHT);
        set1.connect(yourOrder.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set1.constrainHeight(yourOrder.getId(), buttonHeight);

        set1.applyTo(buttonLayout);

        ConstraintSet set = new ConstraintSet();

        set.connect(header.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(header.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2* DimensionsCatalog.getDistanceBetweenElements(getContext()) + iconHeight);
        set.connect(header.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()) + iconHeight);
        set.constrainHeight(header.getId(), headerHeight);

        set.centerVertically(back.getId(), header.getId());
        set.connect(back.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainWidth(back.getId(), iconHeight);
        set.constrainHeight(back.getId(), iconHeight);

        set.connect(buttonLayout.getId(), ConstraintSet.TOP, header.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(buttonLayout.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(buttonLayout.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(buttonLayout.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(buttonLayout.getId(), buttonHeight);

        set.applyTo(this);
    }
}

