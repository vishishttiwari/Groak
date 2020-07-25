package com.groak.groak.catalog.groakfooter;

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

public class GroakFooter extends ConstraintLayout {

    protected Button button;
    protected GroakCallback groakCallback;

    protected int footerButtonHeight = DimensionsCatalog.headerHeight;

    public GroakFooter(Context context, String footerButtonText, GroakCallback callback) {
        super(context);

        this.groakCallback = callback;

        setupViews();
        setupInitialLayout();

        button.setText(footerButtonText);
    }

    private void setupViews() {
        setBackgroundColor(ColorsCatalog.headerGrayShade);

        button = new Button(getContext());
        button.setId(View.generateViewId());
        button.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        button.setTextSize(DimensionsCatalog.headerTextSize);
        button.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        button.setTextColor(ColorsCatalog.whiteColor);
        button.setGravity(Gravity.CENTER);
        button.setMaxLines(1);
        button.setEllipsize(TextUtils.TruncateAt.END);
        GradientDrawable shape = new GradientDrawable();
        shape.setShape(GradientDrawable.RECTANGLE);
        shape.setColor(ColorsCatalog.themeColor);
        shape.setCornerRadius(15);
        button.setBackground(shape);

        button.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                groakCallback.onSuccess("click");
            }
        });

        setElevation(DimensionsCatalog.elevation);

        addView(button);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(button.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 2*DimensionsCatalog.distanceBetweenElements);
        set.connect(button.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.distanceBetweenElements);
        set.connect(button.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.distanceBetweenElements);
        set.connect(button.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2*DimensionsCatalog.distanceBetweenElements);
        set.constrainHeight(button.getId(), footerButtonHeight);

        set.applyTo(this);

    }
}
