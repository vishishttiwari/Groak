package com.groak.groak.activity.tabbar;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.LinearLayout;

import com.google.android.material.bottomnavigation.BottomNavigationItemView;
import com.google.android.material.bottomnavigation.BottomNavigationMenuView;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.bottomnavigation.LabelVisibilityMode;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.groak.groak.R;
import com.groak.groak.activity.request.RequestActivity;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.CartBadgeView;
import com.groak.groak.catalog.groakUIClasses.LoadingView;
import com.groak.groak.catalog.groakUIClasses.RequestButton;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.restaurantobject.restaurant.Restaurant;
import com.groak.groak.restaurantobject.restaurant.RestaurantDeserializer;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.fragment.app.FragmentPagerAdapter;

public class TabbarActivity extends AppCompatActivity {

    private ConstraintLayout layout;

    private NonSwipeableViewPager mainContent;
    private BottomNavigationView tabbar;

    private RequestButton requestButton;

    private CartBadgeView cartBadgeView;

    private BroadcastReceiver broadcastReceiver;

    private AlertDialog loadingSpinner;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getSupportActionBar().hide();

        if (LocalRestaurant.restaurant == null)
            setupRestaurant();

        setupViews();
        setupInitialLayout();
        initBroadcast();
        registerBroadcast();
    }

    private void setupViews() {
        layout = new ConstraintLayout(this);
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        mainContent = new NonSwipeableViewPager(this);
        TabbarViewPagerAdapter adapter = new TabbarViewPagerAdapter(getSupportFragmentManager(), FragmentPagerAdapter.BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT);
        mainContent.setAdapter(adapter);
        mainContent.setId(View.generateViewId());
        mainContent.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        tabbar = new BottomNavigationView(this);
        tabbar.setId(View.generateViewId());
        tabbar.setLayoutParams(new LinearLayout.LayoutParams(0,0));
        Menu menu = tabbar.getMenu();
        menu.add(0, 1, 0, "Menu").setIcon(R.drawable.menu);
        menu.add(0, 2, 0, "Cart").setIcon(R.drawable.cart);
        menu.add(0, 3, 0, "Table Order").setIcon(R.drawable.table);
        menu.add(0, 4, 0, "Covid").setIcon(R.drawable.covid);
        tabbar.setBackgroundColor(ColorsCatalog.headerGrayShade);
        tabbar.setLabelVisibilityMode(LabelVisibilityMode.LABEL_VISIBILITY_LABELED);

        BottomNavigationMenuView bottomNavigationMenuView = (BottomNavigationMenuView) tabbar.getChildAt(0);
        View v = bottomNavigationMenuView.getChildAt(1);
        BottomNavigationItemView itemView = (BottomNavigationItemView) v;


        tabbar.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
                switch (menuItem.getItemId()) {
                    case 1:
                        mainContent.setCurrentItem(0);
                        return true;
                    case 2:
                        mainContent.setCurrentItem(1);
                        return true;
                    case 3:
                        mainContent.setCurrentItem(2);
                        return true;
                    case 4:
                        mainContent.setCurrentItem(3);
                        return true;
                }
                return false;
            }
        });
        tabbar.setElevation(DimensionsCatalog.elevation);
        initBadge();

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

        layout.addView(mainContent);
        layout.addView(tabbar);
        layout.addView(requestButton);

        setContentView(layout);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(mainContent.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 0);
        set.connect(mainContent.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 0);
        set.connect(mainContent.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 0);
        set.connect(mainContent.getId(), ConstraintSet.BOTTOM, tabbar.getId(), ConstraintSet.TOP, 0);

        set.connect(tabbar.getId(), ConstraintSet.TOP, mainContent.getId(), ConstraintSet.BOTTOM, 0);
        set.connect(tabbar.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 0);
        set.connect(tabbar.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 0);
        set.connect(tabbar.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 0);
        set.constrainHeight(tabbar.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(requestButton.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.getRequestButtonMarginFromBottom(getContext()));
        set.connect(requestButton.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getRequestButtonMarginFromRight(getContext()));
        set.constrainHeight(requestButton.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(requestButton.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }

    private void setupRestaurant() {
        loadingSpinner = Catalog.loading(getContext(), "Fetching menus");

        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Restaurant.class, new RestaurantDeserializer());
        final Gson gson = builder.create();

        Intent i = getIntent();
        Restaurant restaurant = gson.fromJson(i.getStringExtra("restaurant"), Restaurant.class);
        String tableId = i.getStringExtra("tableId");
        String qrCodeId = i.getStringExtra("qrCodeId");

        LocalRestaurant.enterRestaurant(this, restaurant, tableId, qrCodeId, new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                loadingSpinner.dismiss();
                Intent intent = new Intent("refresh_menu");
                sendBroadcast(intent);
            }

            @Override
            public void onFailure(Exception e) {
                loadingSpinner.dismiss();
                Catalog.toast(getContext(), "Error fetching menu");
            }
        });
    }

    private void initBadge() {
        BottomNavigationMenuView bottomNavigationMenuView = (BottomNavigationMenuView) tabbar.getChildAt(0);
        View v = bottomNavigationMenuView.getChildAt(1);
        BottomNavigationItemView cartIconView = (BottomNavigationItemView) v;

        cartBadgeView = new CartBadgeView(this);
        cartBadgeView.setId(View.generateViewId());
        cartBadgeView.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        cartIconView.addView(cartBadgeView);
    }

    private Context getContext() {
        return this;
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        View view = getCurrentFocus();
        if (view != null && (ev.getAction() == MotionEvent.ACTION_UP || ev.getAction() == MotionEvent.ACTION_MOVE) && view instanceof EditText && !view.getClass().getName().startsWith("android.webkit.")) {
            int scrcoords[] = new int[2];
            view.getLocationOnScreen(scrcoords);
            float x = ev.getRawX() + view.getLeft() - scrcoords[0];
            float y = ev.getRawY() + view.getTop() - scrcoords[1];
            if (x < view.getLeft() || x > view.getRight() || y < view.getTop() || y > view.getBottom())
                ((InputMethodManager)this.getSystemService(Context.INPUT_METHOD_SERVICE)).hideSoftInputFromWindow((this.getWindow().getDecorView().getApplicationWindowToken()), 0);
        }
        return super.dispatchTouchEvent(ev);
    }

    private void initBroadcast() {
        broadcastReceiver = new BroadcastReceiver() {

            @Override
            public void onReceive(Context arg0, Intent intent) {
                String action = intent.getAction();
                if (action.equals("change_tab_to_order")) {
                    BottomNavigationMenuView bottomNavigationMenuView = (BottomNavigationMenuView) tabbar.getChildAt(0);
                    View v = bottomNavigationMenuView.getChildAt(2);
                    BottomNavigationItemView cartIconView = (BottomNavigationItemView) v;

                    tabbar.setSelectedItemId(cartIconView.getId());
                }
            }
        };
    }

    private void registerBroadcast() {
        if (broadcastReceiver != null) {
            registerReceiver(broadcastReceiver, new IntentFilter("change_tab_to_order"));
            cartBadgeView.registerBroadcast();
            requestButton.registerBroadcast();
        }
    }

    private void unRegisterBroadcast() {
        if (broadcastReceiver != null) {
            unregisterReceiver(broadcastReceiver);
            cartBadgeView.unRegisterBroadcast();
            requestButton.unRegisterBroadcast();
        }
    }

    @Override
    protected void onDestroy() {
        unRegisterBroadcast();
        super.onDestroy();
    }
}