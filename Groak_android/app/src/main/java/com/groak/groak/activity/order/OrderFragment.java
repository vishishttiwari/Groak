package com.groak.groak.activity.order;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.core.widget.NestedScrollView;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.R;
import com.groak.groak.activity.receipt.ReceiptActivity;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.TimeCatalog;
import com.groak.groak.catalog.groakUIClasses.RecyclerViewHeader;
import com.groak.groak.catalog.groakUIClasses.groakfooter.GroakFooterWithPrice;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.restaurantobject.TableStatus;

public class OrderFragment extends Fragment {
    private ConstraintLayout layout;

    private OrderHeader orderHeader;
    private NestedScrollView scrollView;
    private ConstraintLayout scrollViewLayout;
    private GroakFooterWithPrice orderFooter;

    private RecyclerViewHeader orderStatusViewHeader;
    private TextView orderStatusView;

    private RecyclerViewHeader orderViewHeader;
    private RecyclerView orderView;

    private OrderSpecialInstructions specialInstructions;
    private RecyclerView specialInstructionsView;

    private BroadcastReceiver broadcastReceiver;

    boolean tableOrder = true;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        setupViews();

        setupInitialLayout();

        initBroadcast();

        return layout;
    }

    @Override
    public void onResume() {
        super.onResume();
        registerBroadcast();
        refresh(true);
    }

    @Override
    public void onPause() {
        unRegisterBroadcast();
        super.onPause();
    }

    public void refresh(boolean tableOrder) {
        ((OrderRecyclerViewAdapter) orderView.getAdapter()).refresh(tableOrder);
        ((InstructionsRecyclerViewAdapter) specialInstructionsView.getAdapter()).refresh(tableOrder);
        orderFooter.changePrice(LocalRestaurant.calculateOrderTotalPrice(tableOrder));

        if (LocalRestaurant.order.getStatus() == TableStatus.ordered)
            orderStatusView.setText("Your order has been requested. Pending for approval.");
        else if (LocalRestaurant.order.getStatus() == TableStatus.served)
            orderStatusView.setText("Your order has been served. Enjoy!");
        else if (LocalRestaurant.order.getStatus() == TableStatus.payment)
            orderStatusView.setText("You have requested for payment. Someone will be at your table soon.");
        else if (LocalRestaurant.order.getStatus() == TableStatus.available)
            orderStatusView.setText("You can start ordering. Your orders will appear below.");
        else if (LocalRestaurant.order.getStatus() == TableStatus.approved)
            orderStatusView.setText("Your order will be served at " + TimeCatalog.getTimeFromTimestamp(LocalRestaurant.order.getServeTime()));
        else
            orderStatusView.setText("");

        if (LocalRestaurant.order == null || LocalRestaurant.order.getDishes().size() == 0) {
            orderStatusViewHeader.setVisibility(View.GONE);
            orderStatusView.setVisibility(View.GONE);
            orderViewHeader.setVisibility(View.GONE);
            orderView.setVisibility(View.GONE);
            specialInstructions.setVisibility(View.GONE);
            specialInstructionsView.setVisibility(View.GONE);
            orderFooter.setVisibility(View.GONE);
        } else {
            orderStatusViewHeader.setVisibility(View.VISIBLE);
            orderStatusView.setVisibility(View.VISIBLE);
            orderViewHeader.setVisibility(View.VISIBLE);
            orderView.setVisibility(View.VISIBLE);
            specialInstructions.setVisibility(View.VISIBLE);
            specialInstructionsView.setVisibility(View.VISIBLE);
            orderFooter.setVisibility(View.VISIBLE);
        }
    }

    private void setupViews() {
        layout = new ConstraintLayout(getContext());
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        orderHeader = new OrderHeader(getContext(), "Order", new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                if (((String)object).equals("Your Order")) {
                    tableOrder = true;
                    refresh(false);
                } else if (((String)object).equals("Your Order")) {
                    tableOrder = false;
                    refresh(true);
                }
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
        orderHeader.setId(View.generateViewId());
        orderHeader.setLayoutParams(new LinearLayout.LayoutParams(0,0));

        orderFooter = new GroakFooterWithPrice(getContext(), "View Receipt", LocalRestaurant.calculateOrderTotalPrice(tableOrder), new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                Intent intent =  new Intent(getContext(), ReceiptActivity.class);
                getContext().startActivity(intent);
                ((Activity)getContext()).overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
        orderFooter.setId(View.generateViewId());
        orderFooter.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        scrollView = new NestedScrollView(getContext());
        scrollView.setId(View.generateViewId());
        scrollView.setLayoutParams(new RelativeLayout.LayoutParams(0, 0));
        scrollView.setNestedScrollingEnabled(false);
        scrollView.setBackgroundColor(ColorsCatalog.headerGrayShade);

        scrollViewLayout = new ConstraintLayout(getContext());
        scrollViewLayout.setId(View.generateViewId());
        scrollViewLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        scrollViewLayout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        orderStatusViewHeader = new RecyclerViewHeader(getContext(), "Order Status", "");
        orderStatusViewHeader.setId(View.generateViewId());
        orderStatusViewHeader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        orderStatusViewHeader.setVisibility(View.GONE);

        orderStatusView = new TextView(getContext());
        orderStatusView.setId(View.generateViewId());
        orderStatusView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        orderStatusView.setBackgroundColor(ColorsCatalog.whiteColor);
        orderStatusView.setTextSize(20);
        orderStatusView.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        orderStatusView.setTextColor(ColorsCatalog.blackColor);
        orderStatusView.setGravity(Gravity.CENTER);
        orderStatusView.setPadding(0, 0, 0, 10);
        orderStatusView.setText("Your order has been requested. Pending for approval.");
        orderStatusView.setVisibility(View.GONE);

        orderViewHeader = new RecyclerViewHeader(getContext(), "Order", "");
        orderViewHeader.setId(View.generateViewId());
        orderViewHeader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        orderViewHeader.setVisibility(View.GONE);

        orderView = new RecyclerView(getContext());
        orderView.setId(View.generateViewId());
        orderView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        orderView.setLayoutManager(new LinearLayoutManager(getContext()));
        orderView.setAdapter(new OrderRecyclerViewAdapter(getContext()));
        orderView.addItemDecoration(new DividerItemDecoration(getContext(), DividerItemDecoration.VERTICAL));
        orderView.setNestedScrollingEnabled(false);
        orderView.setBackgroundColor(ColorsCatalog.whiteColor);
        orderView.setVisibility(View.GONE);

        specialInstructions = new OrderSpecialInstructions(getContext(), new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                Catalog.toast(getContext(), "Instruction Sent");
            }
            @Override
            public void onFailure(Exception e) {
                Catalog.toast(getContext(), "Error sending instruction");
            }
        });
        specialInstructions.setId(View.generateViewId());
        specialInstructions.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        specialInstructions.setVisibility(View.GONE);

        specialInstructionsView = new RecyclerView(getContext());
        specialInstructionsView.setId(View.generateViewId());
        specialInstructionsView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        specialInstructionsView.setLayoutManager(new LinearLayoutManager(getContext()));
        specialInstructionsView.setAdapter(new InstructionsRecyclerViewAdapter(getContext()));
        specialInstructionsView.addItemDecoration(new DividerItemDecoration(getContext(), DividerItemDecoration.VERTICAL));
        specialInstructionsView.setNestedScrollingEnabled(false);
        specialInstructionsView.setBackgroundColor(ColorsCatalog.whiteColor);
        specialInstructionsView.setVisibility(View.GONE);

        scrollViewLayout.addView(orderStatusViewHeader);
        scrollViewLayout.addView(orderStatusView);
        scrollViewLayout.addView(orderViewHeader);
        scrollViewLayout.addView(orderView);
        scrollViewLayout.addView(specialInstructions);
        scrollViewLayout.addView(specialInstructionsView);
        layout.addView(orderHeader);
        layout.addView(scrollView);
        layout.addView(orderFooter);
        scrollView.addView(scrollViewLayout);
    }

    private void setupInitialLayout() {
        ConstraintSet set1 = new ConstraintSet();
        set1.clone(scrollViewLayout);

        set1.connect(orderStatusViewHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set1.connect(orderStatusViewHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(orderStatusViewHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(orderStatusViewHeader.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(orderStatusView.getId(), ConstraintSet.TOP, orderStatusViewHeader.getId(), ConstraintSet.BOTTOM);
        set1.connect(orderStatusView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(orderStatusView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(orderStatusView.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(orderViewHeader.getId(), ConstraintSet.TOP, orderStatusView.getId(), ConstraintSet.BOTTOM, 2* DimensionsCatalog.distanceBetweenElements);
        set1.connect(orderViewHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(orderViewHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(orderViewHeader.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(orderView.getId(), ConstraintSet.TOP, orderViewHeader.getId(), ConstraintSet.BOTTOM);
        set1.connect(orderView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(orderView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(orderView.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(specialInstructions.getId(), ConstraintSet.TOP, orderView.getId(), ConstraintSet.BOTTOM, 2* DimensionsCatalog.distanceBetweenElements);
        set1.connect(specialInstructions.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(specialInstructions.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(specialInstructions.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(specialInstructionsView.getId(), ConstraintSet.TOP, specialInstructions.getId(), ConstraintSet.BOTTOM, 3);
        set1.connect(specialInstructionsView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(specialInstructionsView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(specialInstructionsView.getId(), ConstraintSet.WRAP_CONTENT);

        set1.applyTo(scrollViewLayout);

        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(orderHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(orderHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(orderHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(orderHeader.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(scrollView.getId(), ConstraintSet.TOP, orderHeader.getId(), ConstraintSet.BOTTOM);
        set.connect(scrollView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(scrollView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(scrollView.getId(), ConstraintSet.BOTTOM, orderFooter.getId(), ConstraintSet.TOP);

        set.connect(orderFooter.getId(), ConstraintSet.TOP, scrollView.getId(), ConstraintSet.BOTTOM);
        set.connect(orderFooter.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(orderFooter.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(orderFooter.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set.constrainHeight(orderFooter.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }

    private void initBroadcast() {
        broadcastReceiver = new BroadcastReceiver() {

            @Override
            public void onReceive(Context arg0, Intent intent) {
                String action = intent.getAction();
                if (action.equals("refresh_order")) {
                    refresh(tableOrder);
                }
            }
        };
    }

    private void registerBroadcast() {
        if (broadcastReceiver != null) {
            getContext().registerReceiver(broadcastReceiver, new IntentFilter("refresh_order"));
        }
    }

    private void unRegisterBroadcast() {
        if (broadcastReceiver != null) {
            getContext().unregisterReceiver(broadcastReceiver);
        }
    }
}
