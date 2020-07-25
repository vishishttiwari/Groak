package com.groak.groak.catalog.groakfooter;

import android.content.Context;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;

import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.R;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.GroakCallback;

import java.util.ArrayList;

public class GroakFooterWithPriceAndQuantity extends GroakFooterWithPrice {
    private ImageView addDish;
    private ImageView reduceDish;

    private String firstPart = "";
    private String secondPart = "";
    private double price = 0;
    private int quantity = 1;
    private double totalPrice = 0;

    protected int iconHeight = DimensionsCatalog.headerIconHeight;

    public GroakFooterWithPriceAndQuantity(Context context, String firstPart, String secondPart, int quantity, double pricePerItem, GroakCallback callback) {
        super(context, firstPart + quantity + secondPart, Catalog.calculateTotalPriceOfDish(pricePerItem, quantity), callback);

        this.firstPart = firstPart;
        this.secondPart = secondPart;
        this.quantity = quantity;
        this.price = pricePerItem;
        this.groakCallback = callback;

        setupViews();
        setupInitialLayout();

        calculateTotalPrice();
    }

    private void setupViews() {
        button.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                ArrayList<Double> temp = new ArrayList();
                temp.add((double)quantity);
                temp.add(price);
                groakCallback.onSuccess(temp);
            }
        });

        addDish = new ImageView(getContext());
        addDish.setId(View.generateViewId());
        addDish.setImageResource(R.drawable.plus);
        addDish.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        addDish.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                quantity++;
                calculateTotalPrice();
            }
        });

        reduceDish = new ImageView(getContext());
        reduceDish.setId(View.generateViewId());
        reduceDish.setImageResource(R.drawable.minus);
        reduceDish.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        reduceDish.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                if (quantity > 1) {
                    quantity--;
                    calculateTotalPrice();
                }
            }
        });

        addView(addDish);
        addView(reduceDish);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(subheader.getId(), ConstraintSet.LEFT, reduceDish.getId(), ConstraintSet.RIGHT, 2*DimensionsCatalog.distanceBetweenElements);
        set.connect(subheader.getId(), ConstraintSet.RIGHT, addDish.getId(), ConstraintSet.LEFT, 2*DimensionsCatalog.distanceBetweenElements);

        set.connect(addDish.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.distanceBetweenElements);
        set.centerVertically(addDish.getId(), subheader.getId());
        set.constrainHeight(addDish.getId(), iconHeight + 30);
        set.constrainWidth(addDish.getId(), iconHeight + 30);

        set.connect(reduceDish.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.distanceBetweenElements);
        set.centerVertically(reduceDish.getId(), subheader.getId());
        set.constrainHeight(reduceDish.getId(), iconHeight + 30);
        set.constrainWidth(reduceDish.getId(), iconHeight + 30);

        set.applyTo(this);
    }

    public void changePrice(double priceDelta) {
        this.price += priceDelta;
        calculateTotalPrice();
    }

    private void calculateTotalPrice() {
        this.totalPrice = Catalog.calculateTotalPriceOfDish(this.price, quantity);
        button.setText(firstPart + quantity + secondPart);
        subheader.setText(Catalog.priceInString(this.totalPrice));
    }
}
