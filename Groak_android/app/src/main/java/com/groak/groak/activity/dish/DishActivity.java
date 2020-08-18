package com.groak.groak.activity.dish;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.text.Html;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.core.widget.NestedScrollView;

import com.bumptech.glide.Glide;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.groak.groak.R;
import com.groak.groak.activity.addtocart.AddToCartActivity;
import com.groak.groak.activity.request.RequestActivity;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.RecyclerViewHeader;
import com.groak.groak.catalog.groakUIClasses.RequestButton;
import com.groak.groak.catalog.groakUIClasses.groakfooter.GroakFooter;
import com.groak.groak.catalog.groakUIClasses.groakheader.GroakOtherHeaderWithPrice;
import com.groak.groak.location.GooglePlayServicesLocationListener;
import com.groak.groak.restaurantobject.dish.Dish;
import com.groak.groak.restaurantobject.dish.DishDeserializer;
import com.groak.groak.restaurantobject.dish.DishSerializer;

public class DishActivity extends Activity {
    private ConstraintLayout layout;

    private GroakOtherHeaderWithPrice dishHeader;
    private NestedScrollView scrollView;
    private ConstraintLayout scrollViewLayout;
    private GroakFooter dishFooter;

    private ImageView imageView;
    private RecyclerViewHeader infoHeaderView;
    private ConstraintLayout infoView;
    private RestrictionsView veganRestriction;
    private RestrictionsView vegRestriction;
    private RestrictionsView nonVegRestriction;
    private RestrictionsView kosherRestriction;
    private RestrictionsView glutenFreeRestriction;
    private RecyclerViewHeader contentHeaderView;
    private TextView contentView;
    private RecyclerViewHeader shortInfoHeaderView;
    private TextView shortInfoView;
    private RecyclerViewHeader descriptionHeaderView;
    private TextView descriptionView;

    private RequestButton requestButton;

    private Dish dish;

    private BroadcastReceiver broadcastReceiver;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Dish.class, new DishDeserializer());
        final Gson gson = builder.create();

        Intent i = getIntent();
        dish = gson.fromJson(i.getStringExtra("dish"), Dish.class);

        setupViews();
        setupInitialLayout();
        initBroadcast();
        requestButton.registerBroadcast();
    }

    @Override
    protected void onResume() {
        super.onResume();

        GooglePlayServicesLocationListener.checkLocationPermissions(getContext());
    }

    private void setupViews() {
        layout = new ConstraintLayout(this);
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        dishHeader = new GroakOtherHeaderWithPrice(this, dish.getName(), Catalog.priceInString(dish.getPrice()), new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                String str = (String)object;
                if (str.equals("back"))
                    requestButton.unRegisterBroadcast();
            }
            @Override
            public void onFailure(Exception e) { }
        });
        dishHeader.setId(View.generateViewId());
        dishHeader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        dishFooter = new GroakFooter(this, "Ready to Order?", new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                if (((String)object).equals("click")) {
                    Context context = getContext();

                    GsonBuilder builder = new GsonBuilder();
                    builder.registerTypeAdapter(Dish.class, new DishSerializer());
                    final Gson gson = builder.create();

                    Intent intent =  new Intent(context, AddToCartActivity.class);

                    intent.putExtra("dish", gson.toJson(dish));
                    context.startActivity(intent);
                    registerFinishActivityBroadcast();
                    ((Activity)context).overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
                }
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
        dishFooter.setId(View.generateViewId());
        dishFooter.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        scrollView = new NestedScrollView(this);
        scrollView.setId(View.generateViewId());
        scrollView.setLayoutParams(new RelativeLayout.LayoutParams(0, 0));
        scrollView.setNestedScrollingEnabled(false);
        scrollView.setBackgroundColor(ColorsCatalog.headerGrayShade);

        scrollViewLayout = new ConstraintLayout(this);
        scrollViewLayout.setId(View.generateViewId());
        scrollViewLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        scrollViewLayout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        imageView = new ImageView(this);
        imageView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        imageView.setId(View.generateViewId());
        imageView.setScaleType(ImageView.ScaleType.FIT_XY);
        imageView.setBackgroundColor(ColorsCatalog.themeColor);
        if (dish == null || dish.getImageLink() == null || dish.getImageLink().length() == 0)
            imageView.setVisibility(View.GONE);
        else {
            imageView.setVisibility(View.VISIBLE);
            Glide.with(layout.getContext()).load(dish.getImageLink()).override(320, 240).into(imageView);
        }

        infoHeaderView = new RecyclerViewHeader(this, "Info", "");
        infoHeaderView.setId(View.generateViewId());
        infoHeaderView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        infoView = new ConstraintLayout(this);
        infoView.setId(View.generateViewId());
        infoView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        infoView.setBackgroundColor(ColorsCatalog.whiteColor);
        infoView.setPadding(DimensionsCatalog.getDistanceBetweenElements(this), 0, DimensionsCatalog.getDistanceBetweenElements(this), DimensionsCatalog.getDistanceBetweenElements(this));
        if (dish == null || dish.getRestrictions() == null || dish.getRestrictions().size() == 0) {
            infoHeaderView.setVisibility(View.GONE);
            infoView.setVisibility(View.GONE);
        } else if (dish.getRestrictions().get("vegan").equals("Not Sure") && dish.getRestrictions().get("vegetarian").equals("Not Sure") && dish.getRestrictions().get("kosher").equals("Not Sure") && dish.getRestrictions().get("glutenFree").equals("Not Sure")) {
            infoHeaderView.setVisibility(View.GONE);
            infoView.setVisibility(View.GONE);
        } else {
            infoHeaderView.setVisibility(View.VISIBLE);
            infoView.setVisibility(View.VISIBLE);
        }
        veganRestriction = new RestrictionsView(this, "VV", ColorsCatalog.greenColor, "Vegan");
        veganRestriction.setId(View.generateViewId());
        veganRestriction.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        vegRestriction = new RestrictionsView(this, "V", ColorsCatalog.greenColor, "Vegetarian");
        vegRestriction.setId(View.generateViewId());
        vegRestriction.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        nonVegRestriction = new RestrictionsView(this, "NV", ColorsCatalog.themeColor, "Non Vegetarian");
        nonVegRestriction.setId(View.generateViewId());
        nonVegRestriction.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        kosherRestriction = new RestrictionsView(this, "K", ColorsCatalog.themeColor, "Kosher");
        kosherRestriction.setId(View.generateViewId());
        kosherRestriction.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        glutenFreeRestriction = new RestrictionsView(this, "GF", ColorsCatalog.themeColor, "Gluten Free");
        glutenFreeRestriction.setId(View.generateViewId());
        glutenFreeRestriction.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        if (dish.getRestrictions().get("vegan").equals("Yes"))
            infoView.addView(veganRestriction);
        else if (dish.getRestrictions().get("vegetarian").equals("Yes"))
            infoView.addView(vegRestriction);
        else if (dish.getRestrictions().get("vegetarian").equals("No"))
            infoView.addView(nonVegRestriction);
        if (dish.getRestrictions().get("kosher").equals("Yes"))
            infoView.addView(kosherRestriction);
        if (dish.getRestrictions().get("glutenFree").equals("Yes"))
            infoView.addView(glutenFreeRestriction);

        contentHeaderView = new RecyclerViewHeader(this, "Content", "");
        contentHeaderView.setId(View.generateViewId());
        contentHeaderView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        contentView = new TextView(this);
        contentView.setId(View.generateViewId());
        contentView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        contentView.setTextColor(ColorsCatalog.blackColor);
        contentView.setTypeface(FontCatalog.fontLevels(this, 1));
        contentView.setTextSize(18);
        contentView.setBackgroundColor(ColorsCatalog.whiteColor);
        contentView.setPadding(DimensionsCatalog.getDistanceBetweenElements(this), 0, DimensionsCatalog.getDistanceBetweenElements(this), DimensionsCatalog.getDistanceBetweenElements(this));
        String content = "";
        try {
            if ((Double) dish.getNutrition().get("calories") > 0) {
                content += "<b>Calories:</b> " + Math.round((Double)dish.getNutrition().get("calories")) + "kCal&#160&#160";
            }
        } catch (Exception e) {
            if ((Long) dish.getNutrition().get("calories") > 0) {
                content += "<b>Calories:</b> " + Math.round((Long)dish.getNutrition().get("calories")) + "kCal&#160&#160";
            }
        }
        try {
            if ((Double) dish.getNutrition().get("fats") > 0) {
                content += "<b>Calories:</b> " + Math.round((Double)dish.getNutrition().get("fats")) + "g&#160&#160";
            }
        } catch (Exception e) {
            if ((Long) dish.getNutrition().get("fats") > 0) {
                content += "<b>Calories:</b> " + Math.round((Long)dish.getNutrition().get("fats")) + "g&#160&#160";
            }
        }
        try {
            if ((Double) dish.getNutrition().get("carbs") > 0) {
                content += "<b>Calories:</b> " + Math.round((Double)dish.getNutrition().get("carbs")) + "g&#160&#160";
            }
        } catch (Exception e) {
            if ((Long) dish.getNutrition().get("carbs") > 0) {
                content += "<b>Calories:</b> " + Math.round((Long)dish.getNutrition().get("carbs")) + "g&#160&#160";
            }
        }
        try {
            if ((Double) dish.getNutrition().get("protein") > 0) {
                content += "<b>Calories:</b> " + Math.round((Double)dish.getNutrition().get("protein")) + "g";
            }
        } catch (Exception e) {
            if ((Long) dish.getNutrition().get("protein") > 0) {
                content += "<b>Calories:</b> " + Math.round((Long)dish.getNutrition().get("protein")) + "g";
            }
        }
        if (dish == null || content == null || content.length() == 0) {
            contentHeaderView.setVisibility(View.GONE);
            contentView.setVisibility(View.GONE);
        } else {
            contentHeaderView.setVisibility(View.VISIBLE);
            contentView.setVisibility(View.VISIBLE);
            contentView.setText(Html.fromHtml(content));
        }

        shortInfoHeaderView = new RecyclerViewHeader(this, "Short Info", "");
        shortInfoHeaderView.setId(View.generateViewId());
        shortInfoHeaderView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        shortInfoView = new TextView(this);
        shortInfoView.setId(View.generateViewId());
        shortInfoView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        shortInfoView.setTextColor(ColorsCatalog.blackColor);
        shortInfoView.setTypeface(FontCatalog.fontLevels(this, 1));
        shortInfoView.setTextSize(18);
        shortInfoView.setBackgroundColor(ColorsCatalog.whiteColor);
        shortInfoView.setPadding(DimensionsCatalog.getDistanceBetweenElements(this), 0, DimensionsCatalog.getDistanceBetweenElements(this), DimensionsCatalog.getDistanceBetweenElements(this));
        if (dish == null || dish.getShortInfo() == null || dish.getShortInfo().length() == 0) {
            shortInfoHeaderView.setVisibility(View.GONE);
            shortInfoView.setVisibility(View.GONE);
        } else {
            shortInfoHeaderView.setVisibility(View.VISIBLE);
            shortInfoView.setVisibility(View.VISIBLE);
            shortInfoView.setText(dish.getShortInfo());
        }

        descriptionHeaderView = new RecyclerViewHeader(this, "Description", "");
        descriptionHeaderView.setId(View.generateViewId());
        descriptionHeaderView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        descriptionView = new TextView(this);
        descriptionView.setId(View.generateViewId());
        descriptionView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        descriptionView.setTextColor(ColorsCatalog.blackColor);
        descriptionView.setTypeface(FontCatalog.fontLevels(this, 1));
        descriptionView.setTextSize(18);
        descriptionView.setBackgroundColor(ColorsCatalog.whiteColor);
        descriptionView.setPadding(DimensionsCatalog.getDistanceBetweenElements(this), 0, DimensionsCatalog.getDistanceBetweenElements(this), DimensionsCatalog.getDistanceBetweenElements(this));
        if (dish == null || dish.getDescription() == null || dish.getDescription().length() == 0) {
            descriptionHeaderView.setVisibility(View.GONE);
            descriptionView.setVisibility(View.GONE);
        } else {
            descriptionHeaderView.setVisibility(View.VISIBLE);
            descriptionView.setVisibility(View.VISIBLE);
            descriptionView.setText(dish.getDescription());
        }

        requestButton = new RequestButton(this);
        requestButton.setId(View.generateViewId());
        requestButton.setLayoutParams(new LinearLayout.LayoutParams(0,0));
        requestButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent =  new Intent(getContext(), RequestActivity.class);
                getContext().startActivity(intent);
            }
        });

        layout.addView(dishHeader);
        layout.addView(scrollView);
        layout.addView(dishFooter);
        layout.addView(requestButton);
        scrollView.addView(scrollViewLayout);
        scrollViewLayout.addView(imageView);
        scrollViewLayout.addView(infoHeaderView);
        scrollViewLayout.addView(infoView);
        scrollViewLayout.addView(contentHeaderView);
        scrollViewLayout.addView(contentView);
        scrollViewLayout.addView(shortInfoHeaderView);
        scrollViewLayout.addView(shortInfoView);
        scrollViewLayout.addView(descriptionHeaderView);
        scrollViewLayout.addView(descriptionView);
        setContentView(layout);
    }

    private void setupInitialLayout() {
        ConstraintSet set2 = new ConstraintSet();
        set2.clone(infoView);

        set2.connect(veganRestriction.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set2.connect(veganRestriction.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set2.connect(veganRestriction.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set2.constrainHeight(veganRestriction.getId(), ConstraintSet.WRAP_CONTENT);

        set2.connect(vegRestriction.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set2.connect(vegRestriction.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set2.connect(vegRestriction.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set2.constrainHeight(vegRestriction.getId(), ConstraintSet.WRAP_CONTENT);

        set2.connect(nonVegRestriction.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set2.connect(nonVegRestriction.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set2.connect(nonVegRestriction.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set2.constrainHeight(nonVegRestriction.getId(), ConstraintSet.WRAP_CONTENT);

        if (veganRestriction.getVisibility() == View.VISIBLE)
            set2.connect(kosherRestriction.getId(), ConstraintSet.TOP, veganRestriction.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(this));
        else if (vegRestriction.getVisibility() == View.VISIBLE)
            set2.connect(kosherRestriction.getId(), ConstraintSet.TOP, vegRestriction.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(this));
        else if (nonVegRestriction.getVisibility() == View.VISIBLE)
            set2.connect(kosherRestriction.getId(), ConstraintSet.TOP, nonVegRestriction.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(this));
        else
            set2.connect(kosherRestriction.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(this));

        set2.connect(kosherRestriction.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set2.connect(kosherRestriction.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set2.constrainHeight(kosherRestriction.getId(), ConstraintSet.WRAP_CONTENT);

        set2.connect(glutenFreeRestriction.getId(), ConstraintSet.TOP, kosherRestriction.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(this));
        set2.connect(glutenFreeRestriction.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set2.connect(glutenFreeRestriction.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set2.constrainHeight(glutenFreeRestriction.getId(), ConstraintSet.WRAP_CONTENT);

        set2.applyTo(infoView);

        ConstraintSet set1 = new ConstraintSet();
        set1.clone(scrollViewLayout);

        set1.connect(imageView.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set1.connect(imageView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(imageView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(imageView.getId(), DimensionsCatalog.imageHeights);

        set1.connect(infoHeaderView.getId(), ConstraintSet.TOP, imageView.getId(), ConstraintSet.BOTTOM, (imageView.getVisibility() == View.VISIBLE) ? 2*DimensionsCatalog.getDistanceBetweenElements(this) : 0);
        set1.connect(infoHeaderView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(infoHeaderView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(infoHeaderView.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(infoView.getId(), ConstraintSet.TOP, infoHeaderView.getId(), ConstraintSet.BOTTOM);
        set1.connect(infoView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(infoView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(infoView.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(contentHeaderView.getId(), ConstraintSet.TOP, infoView.getId(), ConstraintSet.BOTTOM, (infoView.getVisibility() == View.VISIBLE) ? 2*DimensionsCatalog.getDistanceBetweenElements(this) : 0);
        set1.connect(contentHeaderView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(contentHeaderView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(contentHeaderView.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(contentView.getId(), ConstraintSet.TOP, contentHeaderView.getId(), ConstraintSet.BOTTOM);
        set1.connect(contentView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(contentView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(contentView.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(shortInfoHeaderView.getId(), ConstraintSet.TOP, contentView.getId(), ConstraintSet.BOTTOM, (contentView.getVisibility() == View.VISIBLE) ? 2*DimensionsCatalog.getDistanceBetweenElements(this) : 0);
        set1.connect(shortInfoHeaderView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(shortInfoHeaderView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(shortInfoHeaderView.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(shortInfoView.getId(), ConstraintSet.TOP, shortInfoHeaderView.getId(), ConstraintSet.BOTTOM);
        set1.connect(shortInfoView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(shortInfoView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(shortInfoView.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(descriptionHeaderView.getId(), ConstraintSet.TOP, shortInfoView.getId(), ConstraintSet.BOTTOM, (shortInfoView.getVisibility() == View.VISIBLE) ? 2*DimensionsCatalog.getDistanceBetweenElements(this) : 0);
        set1.connect(descriptionHeaderView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(descriptionHeaderView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(descriptionHeaderView.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(descriptionView.getId(), ConstraintSet.TOP, descriptionHeaderView.getId(), ConstraintSet.BOTTOM);
        set1.connect(descriptionView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(descriptionView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(descriptionView.getId(), ConstraintSet.WRAP_CONTENT);

        set1.applyTo(scrollViewLayout);

        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(dishHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(dishHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(dishHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(dishHeader.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(scrollView.getId(), ConstraintSet.TOP, dishHeader.getId(), ConstraintSet.BOTTOM);
        set.connect(scrollView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(scrollView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(scrollView.getId(), ConstraintSet.BOTTOM, dishFooter.getId(), ConstraintSet.TOP);

        set.connect(dishFooter.getId(), ConstraintSet.TOP, scrollView.getId(), ConstraintSet.BOTTOM);
        set.connect(dishFooter.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(dishFooter.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(dishFooter.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set.constrainHeight(dishFooter.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(requestButton.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.getRequestButtonMarginFromBottom(getContext()));
        set.connect(requestButton.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getRequestButtonMarginFromRight(getContext()));
        set.constrainHeight(requestButton.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(requestButton.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }

    private Context getContext() {
        return this;
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
    }

    private void initBroadcast() {
        broadcastReceiver = new BroadcastReceiver() {

            @Override
            public void onReceive(Context arg0, Intent intent) {
                String action = intent.getAction();
                if (action.equals("finish_activity")) {
                    unRegisterFinishActivityBroadcast();
                    requestButton.unRegisterBroadcast();
                    finish();
                }
            }
        };
    }

    private void registerFinishActivityBroadcast() {
        if (broadcastReceiver != null) {
            registerReceiver(broadcastReceiver, new IntentFilter("finish_activity"));
        }
    }

    private void unRegisterFinishActivityBroadcast() {
        if (broadcastReceiver != null) {
            unregisterReceiver(broadcastReceiver);
        }
    }
}
