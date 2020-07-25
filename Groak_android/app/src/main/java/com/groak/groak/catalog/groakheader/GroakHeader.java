package com.groak.groak.catalog.groakheader;

import android.content.Context;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;

public class GroakHeader extends ConstraintLayout {

    protected TextView header;

    protected int headerHeight = DimensionsCatalog.headerHeight;
    protected int iconHeight = DimensionsCatalog.headerIconHeight;
    protected int leaveHeight = DimensionsCatalog.headerIconHeight + 50;

    public GroakHeader(Context context, String header) {
        super(context);

        setupViews();
        setupInitialLayout();

        this.header.setText(header);
    }

    private void setupViews() {
        setBackgroundColor(ColorsCatalog.headerGrayShade);

        header = new TextView(getContext());
        header.setId(View.generateViewId());
        header.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        header.setTextSize(DimensionsCatalog.headerTextSize);
        header.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        header.setTextColor(ColorsCatalog.blackColor);
        header.setGravity(Gravity.CENTER);
        header.setMaxLines(1);
        header.setEllipsize(TextUtils.TruncateAt.END);

        setElevation(DimensionsCatalog.elevation);

        addView(header);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.centerVertically(header.getId(), ConstraintSet.PARENT_ID);
        set.connect(header.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.distanceBetweenElements + iconHeight);
        set.connect(header.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.distanceBetweenElements + iconHeight);
        set.constrainHeight(header.getId(), headerHeight);

        set.applyTo(this);
    }

    public void setHeader(String header) {
        this.header.setText(header);
    }
}