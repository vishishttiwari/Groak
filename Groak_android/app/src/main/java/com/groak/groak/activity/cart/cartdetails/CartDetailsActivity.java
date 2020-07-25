package com.groak.groak.activity.cart.cartdetails;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.R;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.RecyclerViewHeader;
import com.groak.groak.catalog.SpecialInstructions;
import com.groak.groak.catalog.groakfooter.GroakFooterWithPriceAndQuantity;
import com.groak.groak.catalog.groakheader.GroakOtherHeader;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.restaurantobject.dish.cart.CartDish;

import java.util.ArrayList;

public class CartDetailsActivity extends Activity {
    private ConstraintLayout layout;

    private GroakOtherHeader dishHeader;
    private ScrollView scrollView;
    private ConstraintLayout scrollViewLayout;
    private GroakFooterWithPriceAndQuantity dishFooter;

    private RecyclerViewHeader orderDetailsHeader;
    private TextView orderDetails;
    private SpecialInstructions specialInstructions;

    private int infoDimensions = 15;

    private int position;
    private CartDish dish;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent i = getIntent();
        position = i.getIntExtra("position", 0);
        dish = LocalRestaurant.cart.getDishes().get(position);
        System.out.println(dish.getPricePerItem());

        setupViews();

        setupInitialLayout();
    }

    private void setupViews() {
        layout = new ConstraintLayout(this);
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        dishHeader = new GroakOtherHeader(this, dish.getName(), new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
            }

            @Override
            public void onFailure(Exception e) {
            }
        });
        dishHeader.setId(View.generateViewId());
        dishHeader.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));

        dishFooter = new GroakFooterWithPriceAndQuantity(this, "Update ", " to cart", dish.getQuantity(), dish.getPricePerItem(), new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                double quantity = ((ArrayList<Double>)object).get(0);
                double pricePerItem = ((ArrayList<Double>)object).get(1);

                CartDish cartDish = new CartDish(dish.getName(), dish.getDishReference(), (int)quantity, pricePerItem, dish.getExtras());
                Catalog.changeSpecialInstructions(dish.getExtras(), specialInstructions.getSpecialInstructions().getText().toString());
                LocalRestaurant.cart.getDishes().set(position, cartDish);

                finish();
                overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
        dishFooter.setId(View.generateViewId());
        dishFooter.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        scrollView = new ScrollView(this);
        scrollView.setId(View.generateViewId());
        scrollView.setLayoutParams(new RelativeLayout.LayoutParams(0, 0));
        scrollView.setNestedScrollingEnabled(false);
        scrollView.setBackgroundColor(ColorsCatalog.headerGrayShade);

        scrollViewLayout = new ConstraintLayout(this);
        scrollViewLayout.setId(View.generateViewId());
        scrollViewLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        scrollViewLayout.setBackgroundColor(ColorsCatalog.headerGrayShade);
        scrollViewLayout.setPadding(0, 0, 0, 600);

        orderDetailsHeader = new RecyclerViewHeader(this, "Order Details", "");
        orderDetailsHeader.setId(View.generateViewId());
        orderDetailsHeader.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));

        orderDetails = new TextView(layout.getContext());
        orderDetails.setBackgroundColor(ColorsCatalog.whiteColor);
        orderDetails.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        orderDetails.setId(View.generateViewId());
        orderDetails.setTextSize(infoDimensions);
        orderDetails.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        orderDetails.setTextColor(ColorsCatalog.blackColor);
        orderDetails.setGravity(Gravity.LEFT);
        orderDetails.setPadding(DimensionsCatalog.distanceBetweenElements, 0, DimensionsCatalog.distanceBetweenElements, DimensionsCatalog.distanceBetweenElements);
        orderDetails.setText(Catalog.showExtras(dish.getExtras(), false));

        specialInstructions = new SpecialInstructions(this);
        specialInstructions.setId(View.generateViewId());
        specialInstructions.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        String extras = Catalog.showSpecialInstructions(dish.getExtras());
        specialInstructions.getSpecialInstructions().setText(extras == null ? "" : extras);

        layout.addView(dishHeader);
        layout.addView(scrollView);
        layout.addView(dishFooter);
        scrollView.addView(scrollViewLayout);
        scrollViewLayout.addView(orderDetailsHeader);
        scrollViewLayout.addView(orderDetails);
        scrollViewLayout.addView(specialInstructions);
        setContentView(layout);
    }

    private void setupInitialLayout() {
        ConstraintSet set1 = new ConstraintSet();
        set1.clone(scrollViewLayout);

        set1.connect(orderDetailsHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 0);
        set1.connect(orderDetailsHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 0);
        set1.connect(orderDetailsHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 0);

        set1.connect(orderDetails.getId(), ConstraintSet.TOP, orderDetailsHeader.getId(), ConstraintSet.BOTTOM, 0);
        set1.connect(orderDetails.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 0);
        set1.connect(orderDetails.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 0);

        set1.connect(specialInstructions.getId(), ConstraintSet.TOP, orderDetails.getId(), ConstraintSet.BOTTOM, 2* DimensionsCatalog.distanceBetweenElements);
        set1.connect(specialInstructions.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 0);
        set1.connect(specialInstructions.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 0);

        set1.applyTo(scrollViewLayout);

        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(dishHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 0);
        set.connect(dishHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 0);
        set.connect(dishHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 0);

        set.connect(dishFooter.getId(), ConstraintSet.TOP, scrollView.getId(), ConstraintSet.BOTTOM, 0);
        set.connect(dishFooter.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 0);
        set.connect(dishFooter.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 0);
        set.connect(dishFooter.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 0);
        set.constrainWidth(dishFooter.getId(), ConstraintSet.PARENT_ID);
        set.constrainHeight(dishFooter.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(scrollView.getId(), ConstraintSet.TOP, dishHeader.getId(), ConstraintSet.BOTTOM, 0);
        set.connect(scrollView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 0);
        set.connect(scrollView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 0);
        set.connect(scrollView.getId(), ConstraintSet.BOTTOM, dishFooter.getId(), ConstraintSet.TOP, 0);

        set.applyTo(layout);
    }

    @Override
    public void onUserInteraction() {
        if (getCurrentFocus() != null) {
            InputMethodManager inputMethodManager =(InputMethodManager)getSystemService(Activity.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), 0);
        }
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
    }
}
