/**
 * This only has a header title. Nothing else.
 */
package com.groak.groak.catalog.groakUIClasses.groakheader;

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

    protected int headerHeight;
    protected int iconHeight;
    protected int leaveHeight;

    public GroakHeader(Context context, String header) {
        super(context);

        headerHeight = DimensionsCatalog.getHeaderHeight(context);
        iconHeight = DimensionsCatalog.getHeaderIconHeight(context);
        leaveHeight = DimensionsCatalog.getHeaderLeaveHeight(context);

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

        set.connect(header.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(header.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(header.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()) + iconHeight);
        set.connect(header.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()) + iconHeight);
        set.constrainHeight(header.getId(), headerHeight);

        set.applyTo(this);
    }

    public void setHeader(String header) {
        this.header.setText(header);
    }
}