/**
 * This class is used to represent the menu un tab bar
 */
package com.groak.groak.activity.menu;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.core.widget.NestedScrollView;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.groak.groak.R;
import com.groak.groak.activity.search.SearchActivity;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.CustomNestedScrollView;
import com.groak.groak.catalog.groakUIClasses.RecyclerViewHeader;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.restaurantobject.dish.Dish;
import com.groak.groak.restaurantobject.MenuCategory;

import java.util.ArrayList;

public class MenuFragment extends Fragment {
    private ConstraintLayout layout;

    private MenuHeader menuHeader;
    private CustomNestedScrollView scrollView;
    private ConstraintLayout scrollViewLayout;

    private ArrayList<RecyclerView> menuViews = new ArrayList<>();
    private ArrayList<RecyclerViewHeader> menuViewHeaders = new ArrayList<>();

    private TextView noMenuText;
    private ImageView noMenuImage;

    private BroadcastReceiver broadcastReceiver;

    private boolean loaded = false;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        setupViews();

        initBroadcast();

        return layout;
    }

    @Override
    public void onResume() {
        super.onResume();
        if (loaded) getCategories();
        else {
//            menuViewHeaders.clear();
//            menuViews.clear();
//            for (MenuCategory category : LocalRestaurant.categories) {
//                setupRecyclerViewHeader(category);
//                setupRecyclerViewViews(category.getDishes());
//            }
//            if (LocalRestaurant.restaurant != null && LocalRestaurant.restaurant.getName() != null)
//                menuHeader.refresh();
//            setupInitialLayout();
            loaded = true;
        }
        menuHeader.disableScrolling = false;
        registerBroadcast();
    }

    @Override
    public void onPause() {
        unRegisterBroadcast();
        super.onPause();
    }

    /**
     * This function gets categories from LocalRestaurant and then populates the recycler views
     */
    private void getCategories() {
        menuViewHeaders.clear();
        menuViews.clear();
        if (LocalRestaurant.categories != null && LocalRestaurant.categories.size() != 0) {
            for (MenuCategory category : LocalRestaurant.categories) {
                setupRecyclerViewHeader(category);
                setupRecyclerViewViews(category.getDishes());
            }
            noMenuText.setVisibility(View.GONE);
            noMenuImage.setVisibility(View.GONE);
            scrollView.setVisibility(View.VISIBLE);
            menuHeader.refresh();
        } else {
            noMenuText.setVisibility(View.VISIBLE);
            noMenuImage.setVisibility(View.VISIBLE);
            scrollView.setVisibility(View.GONE);
            menuHeader.setHeader(LocalRestaurant.restaurant.getName());
        }
        setupInitialLayout();
    }

    private void setupViews() {
        layout = new ConstraintLayout(getContext());
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        menuHeader = new MenuHeader(getContext(), "", new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                String str = (String)object;
                if (str.equals("search")) {
                    Intent intent =  new Intent(getContext(), SearchActivity.class);

                    getContext().startActivity(intent);
                } else {
                    Integer position = Integer.parseInt((String) object);
                    int scrollTo = menuViewHeaders.get(position).getTop();
                    scrollView.smoothScrollTo(0, scrollTo);
                }
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
        menuHeader.setId(View.generateViewId());
        menuHeader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        scrollView = new CustomNestedScrollView(getContext());
        scrollView.setId(View.generateViewId());
        scrollView.setLayoutParams(new RelativeLayout.LayoutParams(0,0));
        scrollView.setNestedScrollingEnabled(false);
        scrollView.setBackgroundColor(ColorsCatalog.headerGrayShade);
        scrollView.setOnTouchListener(new View.OnTouchListener() {
            public boolean onTouch(View v, MotionEvent event) {
                if (event.getAction() == MotionEvent.ACTION_UP)
                    scrollView.startScrollerTask();
                return false;
            }
        });
        scrollView.setOnScrollStoppedListener(new CustomNestedScrollView.OnScrollStoppedListener() {
            @Override
            public void onScrollStopped(int scrollY) {
                for (int i = menuViewHeaders.size() - 1; i >= 0; i--) {
                    if (scrollY >= menuViewHeaders.get(i).getTop()) {
                        menuHeader.scrollTo(i);
                        break;
                    }
                }
            }
        });

        scrollViewLayout = new ConstraintLayout(getContext());
        scrollViewLayout.setId(View.generateViewId());
        scrollViewLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        scrollViewLayout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        noMenuText = new TextView(getContext());
        noMenuText.setId(View.generateViewId());
        noMenuText.setTextSize(DimensionsCatalog.headerTextSize);
        noMenuText.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        noMenuText.setTextColor(ColorsCatalog.blackColor);
        noMenuText.setGravity(Gravity.CENTER);
        noMenuText.setText("Menu not available right now");
        noMenuText.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        noMenuText.setVisibility(View.GONE);

        noMenuImage = new ImageView(getContext());
        noMenuImage.setId(View.generateViewId());
        noMenuImage.setImageResource(R.drawable.waiter);
        noMenuImage.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        noMenuImage.setVisibility(View.GONE);

        layout.addView(menuHeader);
        layout.addView(scrollView);
        layout.addView(noMenuImage);
        layout.addView(noMenuText);
        scrollView.addView(scrollViewLayout);
    }

    private void setupRecyclerViewHeader(MenuCategory menuCategory) {
        RecyclerViewHeader menuViewHeader = new RecyclerViewHeader(getContext(), menuCategory.getName(), "");

        menuViewHeader.setId(View.generateViewId());

        menuViewHeader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        menuViewHeaders.add(menuViewHeader);

        scrollViewLayout.addView(menuViewHeader);
    }

    private void setupRecyclerViewViews(Dish[] dishes) {
        RecyclerView menuView = new RecyclerView(scrollViewLayout.getContext());

        menuView.setId(View.generateViewId());

        menuView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        menuView.setLayoutManager(new LinearLayoutManager(getContext()));

        menuView.setAdapter(new MenuRecyclerViewAdapter(getContext(), dishes, null));
        menuView.addItemDecoration(new DividerItemDecoration(getContext(), DividerItemDecoration.VERTICAL));
        menuView.setNestedScrollingEnabled(false);
        menuView.setBackgroundColor(ColorsCatalog.whiteColor);

        menuViews.add(menuView);

        scrollViewLayout.addView(menuView);
    }

    private void setupInitialLayout() {
        ConstraintSet set1 = new ConstraintSet();
        set1.clone(scrollViewLayout);

        for (int i = 0; i < menuViewHeaders.size(); i++) {
            RecyclerViewHeader menuViewHeader = menuViewHeaders.get(i);
            RecyclerView menuView = menuViews.get(i);

            if (i == 0)
                set1.connect(menuViewHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
            else
                set1.connect(menuViewHeader.getId(), ConstraintSet.TOP, menuViews.get(i - 1).getId(), ConstraintSet.BOTTOM, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));

            set1.connect(menuViewHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
            set1.connect(menuViewHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
            set1.constrainHeight(menuViewHeader.getId(), ConstraintSet.WRAP_CONTENT);

            set1.connect(menuView.getId(), ConstraintSet.TOP, menuViewHeader.getId(), ConstraintSet.BOTTOM);
            set1.connect(menuView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
            set1.connect(menuView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
            set1.constrainHeight(menuView.getId(), ConstraintSet.WRAP_CONTENT);
        }

        set1.applyTo(scrollViewLayout);

        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(menuHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(menuHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(menuHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(menuHeader.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(noMenuText.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(noMenuText.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(noMenuText.getId(), ConstraintSet.BOTTOM, noMenuImage.getId(), ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(noMenuText.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(noMenuImage.getId(), ConstraintSet.TOP, noMenuText.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(noMenuImage.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(noMenuImage.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.centerVertically(noMenuImage.getId(), ConstraintSet.PARENT_ID);
        set.constrainHeight(noMenuImage.getId(), DimensionsCatalog.screenHeight/4);

        set.connect(scrollView.getId(), ConstraintSet.TOP, menuHeader.getId(), ConstraintSet.BOTTOM);
        set.connect(scrollView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(scrollView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(scrollView.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);

        set.applyTo(layout);
    }

    /**
     * This broadcast is called to refresh menu. This is called from Tabbar when the enterRestaurant function is called.
     */
    private void initBroadcast() {
        broadcastReceiver = new BroadcastReceiver() {

            @Override
            public void onReceive(Context arg0, Intent intent) {
                String action = intent.getAction();
                if (action.equals("refresh_menu")) {
                    getCategories();
                }
            }
        };
    }

    private void registerBroadcast() {
        if (broadcastReceiver != null) {
            getContext().registerReceiver(broadcastReceiver, new IntentFilter("refresh_menu"));
        }
    }

    private void unRegisterBroadcast() {
        if (broadcastReceiver != null) {
            getContext().unregisterReceiver(broadcastReceiver);
        }
    }
}