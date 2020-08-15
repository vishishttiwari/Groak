package com.groak.groak.activity.addtocart;

import android.view.Gravity;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.R;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.restaurantobject.dish.dishextra.dishextraoption.DishExtraOption;

public class OptionCell extends RecyclerView.ViewHolder {

    private ConstraintLayout layout;

    private TextView option;
    private TextView price;
    private ImageView selectBox;

    private boolean multipleSelections;

    public OptionCell(ConstraintLayout layout) {
        super(layout);

        this.layout = layout;
        this.multipleSelections = false;

        setupViews();
        setupInitialLayout();
    }

    public void setOption(DishExtraOption optionText, boolean multipleSelections) {
        this.option.setText(optionText.getTitle());
        this.price.setText(Catalog.priceInString(optionText.getPrice()));
        this.multipleSelections = multipleSelections;
    }

    private void setupViews() {
        option = new TextView(layout.getContext());
        option.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        option.setId(View.generateViewId());
        option.setTextSize(18);
        option.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        option.setTextColor(ColorsCatalog.blackColor);
        option.setGravity(Gravity.LEFT);

        price = new TextView(layout.getContext());
        price.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        price.setId(View.generateViewId());
        price.setTextSize(18);
        price.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        price.setTextColor(ColorsCatalog.grayColor);
        price.setGravity(Gravity.RIGHT);

        selectBox = new ImageView(layout.getContext());
        selectBox.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        selectBox.setId(View.generateViewId());

        layout.addView(option);
        layout.addView(price);
        layout.addView(selectBox);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(option.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 2*DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(option.getId(), ConstraintSet.LEFT, selectBox.getId(), ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(option.getId(), ConstraintSet.RIGHT, price.getId(), ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(option.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2*DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.constrainHeight(option.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(price.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 2*DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(price.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(price.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2*DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.constrainHeight(price.getId(), ConstraintSet.WRAP_CONTENT);

        set.centerVertically(selectBox.getId(), option.getId());
        set.connect(selectBox.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.constrainWidth(selectBox.getId(), 60);
        set.constrainHeight(selectBox.getId(), 60);

        set.applyTo(layout);
    }

    public void select(boolean val) {
        if (multipleSelections) {
            if (val)
                selectBox.setImageResource(R.drawable.checkbox);
            else
                selectBox.setImageResource(R.drawable.uncheckbox);
        } else {
            if (val)
                selectBox.setImageResource(R.drawable.checkcircle);
            else
                selectBox.setImageResource(R.drawable.uncheckcircle);
        }
    }
}