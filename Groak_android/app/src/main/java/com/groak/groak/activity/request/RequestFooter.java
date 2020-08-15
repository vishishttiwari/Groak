package com.groak.groak.activity.request;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;

public class RequestFooter extends ConstraintLayout {

    private RecyclerView suggestionsView;
    private EditText requestTextInput;
    private Button sendButton;

    protected GroakCallback groakCallback;

    public RequestFooter(Context context, GroakCallback callback) {
        super(context);

        this.groakCallback = callback;

        setupViews();
        setupInitialLayout();

//        suggestionsView.requestLayout();
//        suggestionsView.invalidate();

        requestLayout();
    }

    private void setupViews() {
        setBackgroundColor(ColorsCatalog.headerGrayShade);

        suggestionsView = new RecyclerView(getContext());
        suggestionsView.setId(View.generateViewId());
        suggestionsView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        suggestionsView.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        suggestionsView.setAdapter(new SuggestionsRecyclerViewAdapter(getContext(), new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                String str = (String)object;
                requestTextInput.setText(str);
            }
            @Override
            public void onFailure(Exception e) {
            }
        }));

        requestTextInput = new EditText(getContext());
        requestTextInput.setId(View.generateViewId());
        requestTextInput.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        requestTextInput.setBackgroundColor(ColorsCatalog.headerGrayShade);
        requestTextInput.setPadding(DimensionsCatalog.getDistanceBetweenElements(getContext()), 0, DimensionsCatalog.getDistanceBetweenElements(getContext()), DimensionsCatalog.getDistanceBetweenElements(getContext()));
        requestTextInput.setLines(5);
        requestTextInput.setGravity(Gravity.TOP);
        requestTextInput.setTextSize(18);
        requestTextInput.setImeOptions(EditorInfo.IME_ACTION_DONE);
        requestTextInput.setRawInputType(InputType.TYPE_CLASS_TEXT);
        requestTextInput.setHint("Anything we can help you with?");
        requestTextInput.setPadding(20, 20, 20, 20);
        GradientDrawable gd = new GradientDrawable();
        gd.setCornerRadius(10);
        gd.setStroke(2, Color.GRAY);
        requestTextInput.setBackground(gd);

        sendButton = new Button(getContext());
        sendButton.setId(View.generateViewId());
        sendButton.setText("Send");
        sendButton.setTextSize(15);
        sendButton.setGravity(Gravity.CENTER);
        sendButton.setTypeface(FontCatalog.fontLevels(getContext(), 2));
        sendButton.setTextColor(ColorsCatalog.themeColor);
        sendButton.setMaxLines(1);
        sendButton.setBackgroundColor(Color.TRANSPARENT);
        sendButton.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        sendButton.setElevation(0);
        sendButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                groakCallback.onSuccess(requestTextInput.getText().toString());
            }
        });

        setElevation(DimensionsCatalog.elevation);

        addView(suggestionsView);
        addView(requestTextInput);
        addView(sendButton);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(suggestionsView.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(suggestionsView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(suggestionsView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(suggestionsView.getId(), ConstraintSet.BOTTOM, requestTextInput.getId(), ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(suggestionsView.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(requestTextInput.getId(), ConstraintSet.TOP, suggestionsView.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(requestTextInput.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(requestTextInput.getId(), ConstraintSet.RIGHT, sendButton.getId(), ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(requestTextInput.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(requestTextInput.getId(), 200);

        set.connect(sendButton.getId(), ConstraintSet.TOP, requestTextInput.getId(), ConstraintSet.TOP);
        set.connect(sendButton.getId(), ConstraintSet.LEFT, requestTextInput.getId(), ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(sendButton.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(sendButton.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(sendButton.getId(), 150);

        set.applyTo(this);
    }

    public void setText(String str) {
        requestTextInput.setText(str);
    }
}
