package com.groak.groak.activity.menu;

import android.text.Spannable;
import android.text.SpannableString;
import android.text.SpannableStringBuilder;
import android.text.style.BackgroundColorSpan;
import android.text.style.ForegroundColorSpan;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.groakUIClasses.RestrictionsSymbol;
import com.groak.groak.restaurantobject.dish.Dish;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DishCell extends RecyclerView.ViewHolder {

    private ConstraintLayout layout;

    private ImageView imageView;
    private TextView dishName;
    private TextView dishPrice;
    private RestrictionsSymbol vegIcon;
    private RestrictionsSymbol veganIcon;
    private RestrictionsSymbol nonvegIcon;
    private RestrictionsSymbol gfIcon;
    private RestrictionsSymbol kosherIcon;
    private ConstraintLayout restrictionsLayout;
    private TextView dishCalories;
    private TextView dishInfo;

    private int titleDimensions = 20;
    private int otherDimensions = 20;
    private int infoDimensions = 15;

    public DishCell(ConstraintLayout layout) {
        super(layout);

        this.layout = layout;

        setupViews();
        setupInitialLayout();
    }

    public void setDish(Dish dish, String searchTerm) {
        if (dish == null || dish.getImageLink() == null || dish.getImageLink().length() == 0)
            imageView.setVisibility(View.GONE);
        else {
            imageView.setVisibility(View.VISIBLE);
            Glide.with(layout.getContext()).load(dish.getImageLink()).override(320, 240).into(imageView);
        }

        if (searchTerm != null) {
            SpannableStringBuilder sb = new SpannableStringBuilder(dish.getName());
            Pattern p = Pattern.compile("\\b"+searchTerm, Pattern.CASE_INSENSITIVE);
            Matcher m = p.matcher(dish.getName());
            while (m.find())
                sb.setSpan(new ForegroundColorSpan(ColorsCatalog.themeColor), m.start(), m.end(), Spannable.SPAN_INCLUSIVE_INCLUSIVE);
            dishName.setTextColor(ColorsCatalog.shadesOfGray[8]);
            dishName.setText(sb);
        } else {
            dishName.setTextColor(ColorsCatalog.themeColor);
            dishName.setText(dish.getName());
        }
        dishPrice.setText(Catalog.priceInString(dish.getPrice()));

        if (dish == null || dish.getShortInfo() == null || dish.getShortInfo().length() == 0)
            dishInfo.setVisibility(View.GONE);
        else {
            dishInfo.setVisibility(View.VISIBLE);
            dishInfo.setText(dish.getShortInfo());
        }

        if (dish != null && dish.getRestrictions() != null && dish.getRestrictions().get("vegan") != null && dish.getRestrictions().get("vegan").equals("Yes")) {
            vegIcon.setVisibility(View.GONE);
            veganIcon.setVisibility(View.VISIBLE);
            nonvegIcon.setVisibility(View.GONE);
        }
        else if (dish != null && dish.getRestrictions() != null && dish.getRestrictions().get("vegetarian") != null && dish.getRestrictions().get("vegetarian").equals("Yes")) {
            vegIcon.setVisibility(View.VISIBLE);
            veganIcon.setVisibility(View.GONE);
            nonvegIcon.setVisibility(View.GONE);
        } else if (dish != null && dish.getRestrictions() != null && dish.getRestrictions().get("vegetarian") != null && dish.getRestrictions().get("vegetarian").equals("No")) {
            vegIcon.setVisibility(View.GONE);
            veganIcon.setVisibility(View.GONE);
            nonvegIcon.setVisibility(View.VISIBLE);
        }
        if (dish != null && dish.getRestrictions() != null && dish.getRestrictions().get("kosher") != null && dish.getRestrictions().get("kosher").equals("Yes")) {
            kosherIcon.setVisibility(View.VISIBLE);
        }
        if (dish != null && dish.getRestrictions() != null && dish.getRestrictions().get("glutenFree") != null && dish.getRestrictions().get("glutenFree").equals("Yes")) {
            gfIcon.setVisibility(View.VISIBLE);
        }

        Long calories = (long)0;
        if (dish != null && dish.getNutrition() != null && dish.getNutrition().get("calories") != null) {
            try {
                calories = (Long) dish.getNutrition().get("calories");
            } catch (ClassCastException e) {
                calories = (Long) dish.getNutrition().get("calories");
            }
        }

        if (calories != 0) {
            dishCalories.setVisibility(View.VISIBLE);
            dishCalories.setText(Catalog.nutritionInString(calories));
        } else {
            dishCalories.setVisibility(View.GONE);
        }

        if (dish == null) {
            restrictionsLayout.setVisibility(View.GONE);
        } else if (dish == null || dish.getRestrictions() == null) {
            restrictionsLayout.setVisibility(View.GONE);
        } else if (dish.getRestrictions().get("vegan") == null || dish.getRestrictions().get("vegetarian") == null || dish.getRestrictions().get("kosher") == null || dish.getRestrictions().get("glutenFree") == null) {
            restrictionsLayout.setVisibility(View.GONE);
        } else if (!dish.getRestrictions().get("vegan").equals("Yes") &&
                dish.getRestrictions().get("vegetarian").equals("Not Sure") &&
                !dish.getRestrictions().get("kosher").equals("Yes") &&
                !dish.getRestrictions().get("glutenFree").equals("Yes") &&
                calories == 0) {
            restrictionsLayout.setVisibility(View.GONE);
        }
    }

    private void setupViews() {
        imageView = new ImageView(layout.getContext());
        imageView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        imageView.setId(View.generateViewId());
        imageView.setScaleType(ImageView.ScaleType.FIT_XY);

        dishName = new TextView(layout.getContext());
        dishName.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        dishName.setId(View.generateViewId());
        dishName.setTextSize(titleDimensions);
        dishName.setTypeface(FontCatalog.fontLevels(layout.getContext(), 3));
        dishName.setTextColor(ColorsCatalog.themeColor);
        dishName.setGravity(Gravity.LEFT);

        dishPrice = new TextView(layout.getContext());
        dishPrice.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        dishPrice.setId(View.generateViewId());
        dishPrice.setTextSize(titleDimensions);
        dishPrice.setTypeface(FontCatalog.fontLevels(layout.getContext(), 3));
        dishPrice.setTextColor(ColorsCatalog.themeColor);
        dishPrice.setGravity(Gravity.RIGHT);

        dishCalories = new TextView(layout.getContext());
        dishCalories.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        dishCalories.setId(View.generateViewId());
        dishCalories.setTextSize(titleDimensions);
        dishCalories.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        dishCalories.setTextColor(ColorsCatalog.grayColor);
        dishCalories.setGravity(Gravity.RIGHT);
        dishCalories.setGravity(Gravity.CENTER);
        dishCalories.setVisibility(View.GONE);

        dishInfo = new TextView(layout.getContext());
        dishInfo.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT));
        dishInfo.setId(View.generateViewId());
        dishInfo.setTextSize(infoDimensions);
        dishInfo.setTypeface(FontCatalog.fontLevels(layout.getContext(), 2));
        dishInfo.setTextColor(ColorsCatalog.grayColor);
        dishInfo.setGravity(Gravity.LEFT);

        vegIcon = new RestrictionsSymbol(layout.getContext(), "V", ColorsCatalog.greenColor);
        vegIcon.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        vegIcon.setId(View.generateViewId());
        vegIcon.setVisibility(View.GONE);

        veganIcon = new RestrictionsSymbol(layout.getContext(), "V V", ColorsCatalog.greenColor);
        veganIcon.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        veganIcon.setId(View.generateViewId());
        veganIcon.setVisibility(View.GONE);

        nonvegIcon = new RestrictionsSymbol(layout.getContext(), "NV", ColorsCatalog.themeColor);
        nonvegIcon.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        nonvegIcon.setId(View.generateViewId());
        nonvegIcon.setVisibility(View.GONE);

        gfIcon = new RestrictionsSymbol(layout.getContext(), "GF", ColorsCatalog.themeColor);
        gfIcon.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        gfIcon.setId(View.generateViewId());
        gfIcon.setVisibility(View.GONE);

        kosherIcon = new RestrictionsSymbol(layout.getContext(), "K", ColorsCatalog.themeColor);
        kosherIcon.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        kosherIcon.setId(View.generateViewId());
        kosherIcon.setVisibility(View.GONE);

        restrictionsLayout = new ConstraintLayout(layout.getContext());
        restrictionsLayout.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        restrictionsLayout.setId(View.generateViewId());

        layout.addView(imageView);
        layout.addView(dishName);
        layout.addView(dishPrice);
        layout.addView(dishCalories);
        layout.addView(dishInfo);

        restrictionsLayout.addView(vegIcon);
        restrictionsLayout.addView(veganIcon);
        restrictionsLayout.addView(nonvegIcon);
        restrictionsLayout.addView(gfIcon);
        restrictionsLayout.addView(kosherIcon);
        layout.addView(restrictionsLayout);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(imageView.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 0);
        set.connect(imageView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 0);
        set.connect(imageView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 0);
        set.constrainHeight(imageView.getId(), DimensionsCatalog.imageHeights);

        set.connect(dishName.getId(), ConstraintSet.TOP, imageView.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.distanceBetweenElements);
        set.connect(dishName.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.distanceBetweenElements);
        set.constrainWidth(dishName.getId(), 3*DimensionsCatalog.screenWidth/4);
        set.constrainHeight(dishName.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(dishPrice.getId(), ConstraintSet.TOP, imageView.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.distanceBetweenElements);
        set.connect(dishPrice.getId(), ConstraintSet.LEFT, dishName.getId(), ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set.connect(dishPrice.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set.constrainHeight(dishPrice.getId(), 90);

        set.connect(restrictionsLayout.getId(), ConstraintSet.TOP, dishName.getId(), ConstraintSet.BOTTOM);
        set.connect(restrictionsLayout.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.constrainPercentWidth(restrictionsLayout.getId(), 70);
        set.constrainHeight(restrictionsLayout.getId(), 90);

        set.connect(dishCalories.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set.centerVertically(dishCalories.getId(), restrictionsLayout.getId());
        set.constrainPercentWidth(dishCalories.getId(), 25);
        set.constrainHeight(dishCalories.getId(), 90);

        set.connect(dishInfo.getId(), ConstraintSet.TOP, restrictionsLayout.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.distanceBetweenElements);
        set.connect(dishInfo.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.distanceBetweenElements);
        set.connect(dishInfo.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set.connect(dishInfo.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.distanceBetweenElements);

        set.applyTo(layout);

        ConstraintSet set1 = new ConstraintSet();
        set1.clone(restrictionsLayout);

        set1.connect(vegIcon.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set1.connect(vegIcon.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.distanceBetweenElements);
        set1.constrainHeight(vegIcon.getId(), ConstraintSet.WRAP_CONTENT);
        set1.constrainWidth(vegIcon.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(veganIcon.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set1.connect(veganIcon.getId(), ConstraintSet.LEFT, vegIcon.getId(), ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set1.constrainHeight(veganIcon.getId(), ConstraintSet.WRAP_CONTENT);
        set1.constrainWidth(veganIcon.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(nonvegIcon.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set1.connect(nonvegIcon.getId(), ConstraintSet.LEFT, veganIcon.getId(), ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set1.constrainHeight(nonvegIcon.getId(), ConstraintSet.WRAP_CONTENT);
        set1.constrainWidth(nonvegIcon.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(gfIcon.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set1.connect(gfIcon.getId(), ConstraintSet.LEFT, nonvegIcon.getId(), ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set1.constrainHeight(gfIcon.getId(), ConstraintSet.WRAP_CONTENT);
        set1.constrainWidth(gfIcon.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(kosherIcon.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set1.connect(kosherIcon.getId(), ConstraintSet.LEFT, gfIcon.getId(), ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set1.constrainHeight(kosherIcon.getId(), ConstraintSet.WRAP_CONTENT);
        set1.constrainWidth(vegIcon.getId(), ConstraintSet.WRAP_CONTENT);

        set1.applyTo(restrictionsLayout);
    }

    public void setHighLightedText(TextView tv, String textToHighlight) {
        String tvt = tv.getText().toString();
        int ofe = tvt.indexOf(textToHighlight, 0);
        Spannable wordToSpan = new SpannableString(tv.getText());
        for (int ofs = 0; ofs < tvt.length() && ofe != -1; ofs = ofe + 1) {
            ofe = tvt.indexOf(textToHighlight, ofs);
            if (ofe == -1)
                break;
            else {
                // set color here
                wordToSpan.setSpan(new BackgroundColorSpan(0x800000), ofe, ofe + textToHighlight.length(), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
                tv.setText(wordToSpan, TextView.BufferType.SPANNABLE);
            }
        }
    }
}