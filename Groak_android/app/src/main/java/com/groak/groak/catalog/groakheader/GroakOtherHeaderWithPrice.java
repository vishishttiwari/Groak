package com.groak.groak.catalog.groakheader;

import android.content.Context;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;

public class GroakOtherHeaderWithPrice extends GroakOtherHeader {

    private TextView subheader;

    public GroakOtherHeaderWithPrice(Context context, String header, String subheader, GroakCallback callback) {
        super(context, header, callback);

        setupViews();
        setupInitialLayout();

        this.subheader.setText(subheader);
    }

    private void setupViews() {
        subheader = new TextView(getContext());
        subheader.setId(View.generateViewId());
        subheader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        subheader.setTextSize(DimensionsCatalog.headerTextSize - 5);
        subheader.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        subheader.setTextColor(ColorsCatalog.themeColor);
        subheader.setGravity(Gravity.CENTER);
        subheader.setMaxLines(1);
        subheader.setEllipsize(TextUtils.TruncateAt.END);

        addView(subheader);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();

        set.connect(header.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(header.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.distanceBetweenElements + iconHeight);
        set.connect(header.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.distanceBetweenElements + iconHeight);
        set.constrainHeight(header.getId(), headerHeight);

        set.centerVertically(back.getId(), header.getId());
        set.connect(back.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.distanceBetweenElements);
        set.constrainWidth(back.getId(), iconHeight);
        set.constrainHeight(back.getId(), iconHeight);

        set.connect(subheader.getId(), ConstraintSet.TOP, header.getId(), ConstraintSet.BOTTOM);
        set.connect(subheader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.distanceBetweenElements);
        set.connect(subheader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set.constrainHeight(subheader.getId(), headerHeight - 50);

        set.applyTo(this);
    }

    public void setHeader(String header, String subheader) {
        this.header.setText(header);
        this.subheader.setText(subheader);
    }

    public void setSubheader(String subheader) {
        this.subheader.setText(subheader);
    }
}
