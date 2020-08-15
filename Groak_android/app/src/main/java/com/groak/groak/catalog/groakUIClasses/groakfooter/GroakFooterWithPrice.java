package com.groak.groak.catalog.groakUIClasses.groakfooter;

import android.content.Context;
import android.text.TextUtils;
import android.view.Gravity;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;

public class GroakFooterWithPrice extends GroakFooter {

    protected TextView subheader;

    public GroakFooterWithPrice(Context context, String footerButtonText, double totalPrice, GroakCallback callback) {
        super(context, footerButtonText, callback);

        setupViews();
        setupInitialLayout();

        changePrice(totalPrice);
    }

    private void setupViews() {
        subheader = new TextView(getContext());
        subheader.setId(generateViewId());
        subheader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        subheader.setTextSize(DimensionsCatalog.headerTextSize + 5);
        subheader.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        subheader.setTextColor(ColorsCatalog.themeColor);
        subheader.setGravity(Gravity.CENTER);
        subheader.setMaxLines(1);
        subheader.setEllipsize(TextUtils.TruncateAt.END);

        addView(subheader);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();

        set.connect(subheader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(subheader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(subheader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(subheader.getId(), footerButtonHeight);

        set.connect(button.getId(), ConstraintSet.TOP, subheader.getId(), ConstraintSet.BOTTOM);
        set.connect(button.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(button.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(button.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(button.getId(), footerButtonHeight);

        set.applyTo(this);
    }

    public void changePrice(double totalPrice) {
        subheader.setText(Catalog.priceInString(totalPrice));
    }
}
