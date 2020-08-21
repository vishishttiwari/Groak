/**
 * This class is used to represent the special instructions in order view
 */
package com.groak.groak.activity.order;

import android.content.Context;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;

import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.RecyclerViewHeader;
import com.groak.groak.catalog.groakUIClasses.SpecialInstructions;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsOrders;
import com.groak.groak.restaurantobject.order.OrderComment;

public class OrderSpecialInstructions extends SpecialInstructions {

    private Button sendButton;

    public OrderSpecialInstructions(Context context, GroakCallback callback) {
        super(context);

        setupViews(callback);
        setupInitialLayout();
    }

    public RecyclerViewHeader getSpecialInstructionsHeader() {
        return specialInstructionsHeader;
    }

    public EditText getSpecialInstructions() {
        return specialInstructions;
    }

    private void setupViews(final GroakCallback callback) {
        setBackgroundColor(ColorsCatalog.whiteColor);

        sendButton = new Button(getContext());
        sendButton.setId(View.generateViewId());
        sendButton.setText("Send");
        sendButton.setTextSize(DimensionsCatalog.headerTextSize - 12);
        sendButton.setGravity(Gravity.CENTER);
        sendButton.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        sendButton.setTextColor(ColorsCatalog.themeColor);
        sendButton.setMaxLines(1);
        sendButton.setBackgroundColor(ColorsCatalog.whiteColor);
        sendButton.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        sendButton.setElevation(0);
        sendButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                OrderComment comment = new OrderComment(specialInstructions.getText().toString());
                FirestoreAPICallsOrders.addCommentFirestoreAPI(getContext(), comment, new GroakCallback() {
                    @Override
                    public void onSuccess(Object object) {
                        callback.onSuccess("Sent");

                        specialInstructions.setText("");
                    }

                    @Override
                    public void onFailure(Exception e) {
                        callback.onFailure(null);
                    }
                });
            }
        });

        addView(sendButton);
    }

    private void setupInitialLayout() {
        ConstraintSet set1 = new ConstraintSet();
        set1.clone(this);

        set1.connect(sendButton.getId(), ConstraintSet.TOP, specialInstructions.getId(), ConstraintSet.BOTTOM);
        set1.connect(sendButton.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.connect(sendButton.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set1.constrainHeight(sendButton.getId(), ConstraintSet.WRAP_CONTENT);
        set1.constrainWidth(sendButton.getId(), ConstraintSet.WRAP_CONTENT);

        set1.applyTo(this);
    }
}
