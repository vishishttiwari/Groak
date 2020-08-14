package com.groak.groak.activity.request;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.LinearLayout;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsOrders;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsRequests;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.restaurantobject.request.Request;

public class RequestActivity extends Activity {
    private ConstraintLayout layout;

    private RequestHeader requestHeader;
    private RecyclerView requestView;
    private RequestFooter requestFooter;

    private BroadcastReceiver broadcastReceiver;

    private boolean refreshedOnce = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setupViews();

        setupInitialLayout();

        initBroadcast();
    }

    @Override
    protected void onResume() {
        super.onResume();

        registerBroadcast();

        refresh();

        LocalRestaurant.requestNotifications = false;
        FirestoreAPICallsOrders.newRequestForUserSeen();
    }

    @Override
    protected void onPause() {
        unRegisterBroadcast();
        super.onPause();
    }

    public void refresh() {
        ((RequestRecyclerViewAdapter) requestView.getAdapter()).refresh();
        if (LocalRestaurant.requests == null || LocalRestaurant.requests.getRequests() == null || LocalRestaurant.requests.getRequests().size() == 0) {
            requestView.setVisibility(View.GONE);
        } else {
            requestView.setVisibility(View.VISIBLE);
            if (!refreshedOnce) {
                requestView.scrollToPosition(LocalRestaurant.requests.getRequests().size() - 1);
                refreshedOnce = true;
            } else {
                requestView.smoothScrollToPosition(LocalRestaurant.requests.getRequests().size() - 1);
            }
        }
    }

    private void setupViews() {
        layout = new ConstraintLayout(this);
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        requestHeader = new RequestHeader(this, LocalRestaurant.restaurant.getName(), new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
        requestHeader.setId(View.generateViewId());
        requestHeader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        requestView = new RecyclerView(getContext());
        requestView.setId(View.generateViewId());
        requestView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        requestView.setLayoutManager(new LinearLayoutManager(getContext()));
        requestView.setAdapter(new RequestRecyclerViewAdapter(getContext()));
        requestView.setBackgroundColor(ColorsCatalog.whiteColor);
        requestView.setVisibility(View.GONE);

        requestFooter = new RequestFooter(this, new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                String str = (String)object;
                Request request = new Request(str);
                FirestoreAPICallsRequests.addRequestFirestoreAPI(request, new GroakCallback() {
                    @Override
                    public void onSuccess(Object object) {
                        requestFooter.setText("");
                    }
                    @Override
                    public void onFailure(Exception e) {
                        Catalog.toast(getContext(), "Error sending request");
                    }
                });
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
        requestFooter.setId(View.generateViewId());
        requestFooter.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        layout.addView(requestHeader);
        layout.addView(requestView);
        layout.addView(requestFooter);
        setContentView(layout);
    }


    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(requestHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(requestHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(requestHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(requestHeader.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(requestView.getId(), ConstraintSet.TOP, requestHeader.getId(), ConstraintSet.BOTTOM);
        set.connect(requestView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(requestView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(requestView.getId(), ConstraintSet.BOTTOM, requestFooter.getId(), ConstraintSet.TOP);

        set.connect(requestFooter.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(requestFooter.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(requestFooter.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set.constrainHeight(requestFooter.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }

    private void initBroadcast() {
        broadcastReceiver = new BroadcastReceiver() {

            @Override
            public void onReceive(Context arg0, Intent intent) {
                String action = intent.getAction();
                if (action.equals("refresh_request")) {
                    refresh();
                    LocalRestaurant.requestNotifications = false;
                    FirestoreAPICallsOrders.newRequestForUserSeen();
                }
            }
        };
    }

    private void registerBroadcast() {
        if (broadcastReceiver != null) {
            getContext().registerReceiver(broadcastReceiver, new IntentFilter("refresh_request"));
        }
    }

    private void unRegisterBroadcast() {
        if (broadcastReceiver != null) {
            getContext().unregisterReceiver(broadcastReceiver);
        }
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
}
