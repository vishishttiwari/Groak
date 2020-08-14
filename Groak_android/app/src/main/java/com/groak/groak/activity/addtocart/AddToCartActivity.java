package com.groak.groak.activity.addtocart;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.core.widget.NestedScrollView;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.groak.groak.R;
import com.groak.groak.activity.request.RequestActivity;
import com.groak.groak.activity.tabbar.TabbarActivity;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.RecyclerViewHeader;
import com.groak.groak.catalog.groakUIClasses.RequestButton;
import com.groak.groak.catalog.groakUIClasses.SpecialInstructions;
import com.groak.groak.catalog.groakUIClasses.groakfooter.GroakFooterWithPriceAndQuantity;
import com.groak.groak.catalog.groakUIClasses.groakheader.GroakOtherHeader;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.restaurantobject.dish.Dish;
import com.groak.groak.restaurantobject.dish.DishDeserializer;
import com.groak.groak.restaurantobject.cart.CartDish;
import com.groak.groak.restaurantobject.cart.CartDishExtra;
import com.groak.groak.restaurantobject.cart.CartDishExtraOption;
import com.groak.groak.restaurantobject.dish.dishextra.DishExtra;

import java.util.ArrayList;

public class AddToCartActivity extends Activity {
    private ConstraintLayout layout;

    private GroakOtherHeader addToCartHeader;
    private NestedScrollView scrollView;
    private ConstraintLayout scrollViewLayout;
    private GroakFooterWithPriceAndQuantity addToCartFooter;

    private ArrayList<RecyclerViewHeader> optionViewHeaders = new ArrayList<>();
    private ArrayList<RecyclerView> optionViews = new ArrayList<>();

    private SpecialInstructions specialInstructions;

    private RequestButton requestButton;

    private Dish dish;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Dish.class, new DishDeserializer());
        final Gson gson = builder.create();

        Intent i = getIntent();
        dish = gson.fromJson(i.getStringExtra("dish"), Dish.class);

        setupViews();

        setupOptions();

        requestButton.registerBroadcast();
    }

    private void setupViews() {
        layout = new ConstraintLayout(this);
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);
        layout.setClickable(true);
        layout.setFocusableInTouchMode(true);
        layout.setFocusable(true);

        addToCartHeader = new GroakOtherHeader(this, dish.getName(), new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                String str = (String)object;
                if (str.equals("back"))
                    requestButton.unRegisterBroadcast();
            }

            @Override
            public void onFailure(Exception e) {
            }
        });
        addToCartHeader.setId(View.generateViewId());
        addToCartHeader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        addToCartFooter = new GroakFooterWithPriceAndQuantity(this, "Add ", " to cart", 1, dish.getPrice(),  new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                double quantity = ((ArrayList<Double>)object).get(0);
                double pricePerItem = ((ArrayList<Double>)object).get(1);
                CartDish cartDish = new CartDish(dish.getName(), dish.getReference(), (int)quantity, pricePerItem, new ArrayList<CartDishExtra>());
                boolean success = true;
                for (RecyclerView optionView: optionViews) {
                    CartDishExtra cartDishExtra = ((AddToCartRecyclerViewAdapter) optionView.getAdapter()).getExtraItem();
                    if (cartDishExtra == null) {
                        success = false;
                        break;
                    }
                    cartDish.addExtra(cartDishExtra);
                }
                if (specialInstructions != null && specialInstructions.getSpecialInstructions().getText() != null && specialInstructions.getSpecialInstructions().getText().toString() != null && specialInstructions.getSpecialInstructions().getText().toString().length() != 0) {
                    CartDishExtraOption specialInstructionsOption = new CartDishExtraOption(specialInstructions.getSpecialInstructions().getText().toString(), 0, 0);
                    ArrayList<CartDishExtraOption> optionList = new ArrayList<>();
                    optionList.add(specialInstructionsOption);
                    cartDish.addExtra(new CartDishExtra(Catalog.specialInstructionsId, optionList));
                }
                if (success) {
                    LocalRestaurant.cart.addDish(cartDish);
                    finish();
                    Intent intent = new Intent("finish_activity");
                    sendBroadcast(intent);

                    Intent intent1 = new Intent("change_cart_badge");
                    sendBroadcast(intent1);

                    requestButton.unRegisterBroadcast();

                    overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
                }
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
        addToCartFooter.setId(View.generateViewId());
        addToCartFooter.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        scrollView = new NestedScrollView(this);
        scrollView.setId(View.generateViewId());
        scrollView.setLayoutParams(new RelativeLayout.LayoutParams(0, 0));
        scrollView.setNestedScrollingEnabled(false);
        scrollView.setBackgroundColor(ColorsCatalog.headerGrayShade);

        scrollViewLayout = new ConstraintLayout(this);
        scrollViewLayout.setId(View.generateViewId());
        scrollViewLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        scrollViewLayout.setBackgroundColor(ColorsCatalog.headerGrayShade);
        scrollViewLayout.setClickable(true);
        scrollViewLayout.setFocusableInTouchMode(true);
        scrollViewLayout.setFocusable(true);

        specialInstructions = new SpecialInstructions(this);
        specialInstructions.setId(View.generateViewId());
        specialInstructions.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

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

        layout.addView(addToCartHeader);
        layout.addView(scrollView);
        layout.addView(addToCartFooter);
        layout.addView(requestButton);
        scrollView.addView(scrollViewLayout);
        scrollViewLayout.addView(specialInstructions);
        setContentView(layout);
    }

    private void setupOptions() {
        for (DishExtra extra: dish.getExtras()) {
            setupRecyclerViewHeader(extra);
            setupRecyclerViewViews(extra);
        }
        setupInitialLayout();
    }

    private void setupRecyclerViewHeader(DishExtra dishExtra) {
        RecyclerViewHeader menuViewHeader = new RecyclerViewHeader(this, dishExtra.getTitle(), dishExtra.isMultipleSelections() ? "" : "Required");

        menuViewHeader.setId(View.generateViewId());

        menuViewHeader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        optionViewHeaders.add(menuViewHeader);

        scrollViewLayout.addView(menuViewHeader);
    }

    private void setupRecyclerViewViews(DishExtra dishExtra) {
        RecyclerView menuView = new RecyclerView(scrollViewLayout.getContext());

        menuView.setId(View.generateViewId());

        menuView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        menuView.setLayoutManager(new LinearLayoutManager(this));

        menuView.setAdapter(new AddToCartRecyclerViewAdapter(this, dishExtra, new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                addToCartFooter.changePrice((double)object);
            }
            @Override
            public void onFailure(Exception e) {
            }
        }));
        menuView.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.VERTICAL));
        menuView.setNestedScrollingEnabled(false);
        menuView.setBackgroundColor(ColorsCatalog.whiteColor);

        optionViews.add(menuView);

        scrollViewLayout.addView(menuView);
    }

    private void setupInitialLayout() {
        ConstraintSet set1 = new ConstraintSet();
        set1.clone(scrollViewLayout);

        for (int i = 0; i < optionViewHeaders.size(); i++) {
            RecyclerViewHeader optionViewHeader = optionViewHeaders.get(i);
            RecyclerView optionView = optionViews.get(i);

            if (i == 0) {
                set1.connect(optionViewHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
            } else {
                set1.connect(optionViewHeader.getId(), ConstraintSet.TOP, optionViews.get(i - 1).getId(), ConstraintSet.BOTTOM, 2* DimensionsCatalog.distanceBetweenElements);
            }

            set1.connect(optionViewHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
            set1.connect(optionViewHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
            set1.constrainHeight(optionViewHeader.getId(), ConstraintSet.WRAP_CONTENT);

            set1.connect(optionView.getId(), ConstraintSet.TOP, optionViewHeader.getId(), ConstraintSet.BOTTOM);
            set1.connect(optionView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
            set1.connect(optionView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
            set1.constrainHeight(optionView.getId(), ConstraintSet.WRAP_CONTENT);
        }

        if (optionViewHeaders.size() <= 0)
            set1.connect(specialInstructions.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        else
            set1.connect(specialInstructions.getId(), ConstraintSet.TOP, optionViews.get(optionViews.size() - 1).getId(), ConstraintSet.BOTTOM, 2* DimensionsCatalog.distanceBetweenElements);

        set1.connect(specialInstructions.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(specialInstructions.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(specialInstructions.getId(), ConstraintSet.WRAP_CONTENT);

        set1.applyTo(scrollViewLayout);

        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(addToCartHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(addToCartHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(addToCartHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(addToCartHeader.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(scrollView.getId(), ConstraintSet.TOP, addToCartHeader.getId(), ConstraintSet.BOTTOM);
        set.connect(scrollView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(scrollView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(scrollView.getId(), ConstraintSet.BOTTOM, addToCartFooter.getId(), ConstraintSet.TOP);

        set.connect(addToCartFooter.getId(), ConstraintSet.TOP, scrollView.getId(), ConstraintSet.BOTTOM);
        set.connect(addToCartFooter.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set.connect(addToCartFooter.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(addToCartFooter.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(addToCartFooter.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(requestButton.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 400);
        set.connect(requestButton.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 100);
        set.constrainHeight(requestButton.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(requestButton.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }

    private Context getContext() {
        return this;
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
