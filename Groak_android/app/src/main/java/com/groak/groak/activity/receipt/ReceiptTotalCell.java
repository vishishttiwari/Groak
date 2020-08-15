package com.groak.groak.activity.receipt;

import android.content.Context;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.localstorage.LocalRestaurant;

public class ReceiptTotalCell extends ConstraintLayout {

    private TextView total;
    private TextView totalValue;
    private TextView subtotal;
    private TextView subtotalValue;
    private TextView tax;
    private TextView taxValue;

    public ReceiptTotalCell(Context context) {
        super(context);

        setupViews();

        setupInitialLayout();
    }

    private void setupViews() {
        setBackgroundColor(ColorsCatalog.whiteColor);

        total = new TextView(getContext());
        total.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        total.setId(View.generateViewId());
        total.setTextSize(30);
        total.setTypeface(FontCatalog.fontLevels(getContext(), 3));
        total.setTextColor(ColorsCatalog.blackColor);
        total.setText("Total");
        total.setGravity(Gravity.LEFT);

        totalValue = new TextView(getContext());
        totalValue.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        totalValue.setId(View.generateViewId());
        totalValue.setTextSize(30);
        totalValue.setTypeface(FontCatalog.fontLevels(getContext(), 3));
        totalValue.setTextColor(ColorsCatalog.blackColor);
        totalValue.setGravity(Gravity.RIGHT);

        subtotal = new TextView(getContext());
        subtotal.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        subtotal.setId(View.generateViewId());
        subtotal.setTextSize(18);
        subtotal.setTypeface(FontCatalog.fontLevels(getContext(), 2));
        subtotal.setTextColor(ColorsCatalog.blackColor);
        subtotal.setText("Total");
        subtotal.setGravity(Gravity.LEFT);

        subtotalValue = new TextView(getContext());
        subtotalValue.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        subtotalValue.setId(View.generateViewId());
        subtotalValue.setTextSize(18);
        subtotalValue.setTypeface(FontCatalog.fontLevels(getContext(), 2));
        subtotalValue.setTextColor(ColorsCatalog.blackColor);
        subtotalValue.setGravity(Gravity.RIGHT);

        tax = new TextView(getContext());
        tax.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        tax.setId(View.generateViewId());
        tax.setTextSize(18);
        tax.setTypeface(FontCatalog.fontLevels(getContext(), 2));
        tax.setTextColor(ColorsCatalog.blackColor);
        tax.setText("Sales Tax");
        tax.setGravity(Gravity.LEFT);

        taxValue = new TextView(getContext());
        taxValue.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        taxValue.setId(View.generateViewId());
        taxValue.setTextSize(18);
        taxValue.setTypeface(FontCatalog.fontLevels(getContext(), 2));
        taxValue.setTextColor(ColorsCatalog.blackColor);
        taxValue.setGravity(Gravity.RIGHT);

        addView(total);
        addView(totalValue);
        addView(subtotal);
        addView(subtotalValue);
        addView(tax);
        addView(taxValue);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(total.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(total.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainPercentWidth(total.getId(), 60);
        set.constrainHeight(total.getId(), ConstraintSet.WRAP_CONTENT);

        set.centerVertically(totalValue.getId(), total.getId());
        set.connect(totalValue.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainPercentWidth(totalValue.getId(), 30);
        set.constrainHeight(totalValue.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(subtotal.getId(), ConstraintSet.TOP, total.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(subtotal.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainPercentWidth(subtotal.getId(), 60);
        set.constrainHeight(subtotal.getId(), ConstraintSet.WRAP_CONTENT);

        set.centerVertically(subtotalValue.getId(), subtotal.getId());
        set.connect(subtotalValue.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainPercentWidth(subtotalValue.getId(), 30);
        set.constrainHeight(subtotalValue.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(tax.getId(), ConstraintSet.TOP, subtotal.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(tax.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(tax.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainPercentWidth(tax.getId(), 60);
        set.constrainHeight(tax.getId(), ConstraintSet.WRAP_CONTENT);

        set.centerVertically(taxValue.getId(), tax.getId());
        set.connect(taxValue.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainPercentWidth(taxValue.getId(), 30);
        set.constrainHeight(taxValue.getId(), ConstraintSet.WRAP_CONTENT);


        set.applyTo(this);
    }

    public void setTotalValue(double value) {
        double finalTax = (double)LocalRestaurant.restaurant.getSalesTax()/100;
        totalValue.setText(Catalog.priceInString((1 + finalTax) * value));
        subtotalValue.setText(Catalog.priceInString(value));
        taxValue.setText(Catalog.priceInString(finalTax * value));
    }
}
