package com.groak.groak.catalog.groakUIClasses;

import android.content.Context;
import android.graphics.drawable.GradientDrawable;
import android.text.TextUtils;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;

public class RestrictionsSymbol extends ConstraintLayout {

    private int height;
    private int textSize = 15;

    private Button view;

    public RestrictionsSymbol(Context context, String str, int color) {
        super(context);

        height = DimensionsCatalog.getValueInDP(40, context);

        setupViews(str, color);

        setupInitialLayout();
    }

    private void setupViews(String str, int color) {
        view = new Button(getContext());
        view.setId(View.generateViewId());
        view.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        view.setTextSize(textSize);
        view.setTypeface(FontCatalog.fontLevels(getContext(), 3));
        view.setTextColor(ColorsCatalog.whiteColor);
        view.setGravity(Gravity.CENTER);
        view.setMaxLines(1);
        view.setText(str);
        view.setEllipsize(TextUtils.TruncateAt.END);
        view.setElevation(0);
        GradientDrawable shape = new GradientDrawable();
        shape.setShape(GradientDrawable.RECTANGLE);
        shape.setColor(color);
        shape.setCornerRadius(height/2);
        view.setBackground(shape);

        addView(view);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(view.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(view.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.constrainHeight(view.getId(), height);
        set.constrainWidth(view.getId(), height);

        set.applyTo(this);
    }
}
