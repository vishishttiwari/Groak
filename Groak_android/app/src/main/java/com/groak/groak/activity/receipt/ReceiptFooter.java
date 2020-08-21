/**
 * This class is used to represent the footer of the receipt activity
 */
package com.groak.groak.activity.receipt;

import android.content.Context;
import android.graphics.drawable.GradientDrawable;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;

public class ReceiptFooter extends ConstraintLayout {
    protected Button save;
    protected Button pay;
    protected GroakCallback groakCallback;

    protected int footerButtonHeight;

    public ReceiptFooter(Context context, GroakCallback callback) {
        super(context);

        footerButtonHeight = DimensionsCatalog.getHeaderHeight(context);

        this.groakCallback = callback;

        setupViews();
        setupInitialLayout();
    }

    private void setupViews() {
        setBackgroundColor(ColorsCatalog.headerGrayShade);

        save = new Button(getContext());
        save.setId(View.generateViewId());
        save.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        save.setTextSize(DimensionsCatalog.headerTextSize);
        save.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        save.setTextColor(ColorsCatalog.whiteColor);
        save.setGravity(Gravity.CENTER);
        save.setMaxLines(1);
        save.setEllipsize(TextUtils.TruncateAt.END);
        GradientDrawable shape = new GradientDrawable();
        shape.setShape(GradientDrawable.RECTANGLE);
        shape.setColor(ColorsCatalog.themeColor);
        shape.setCornerRadius(15);
        save.setBackground(shape);
        save.setText("Save Receipt");
        save.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                groakCallback.onSuccess("save");
            }
        });

        pay = new Button(getContext());
        pay.setId(View.generateViewId());
        pay.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        pay.setTextSize(DimensionsCatalog.headerTextSize);
        pay.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        pay.setTextColor(ColorsCatalog.whiteColor);
        pay.setGravity(Gravity.CENTER);
        pay.setMaxLines(1);
        pay.setEllipsize(TextUtils.TruncateAt.END);
        pay.setBackground(shape);
        pay.setText("Ready for Payment?");
        pay.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                groakCallback.onSuccess("pay");
            }
        });

        setElevation(DimensionsCatalog.elevation);

        addView(pay);
        addView(save);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(save.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(save.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(save.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(save.getId(), ConstraintSet.BOTTOM, pay.getId(), ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(save.getId(), footerButtonHeight);

        set.connect(pay.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(pay.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(pay.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(pay.getId(), footerButtonHeight);

        set.applyTo(this);
    }
}
