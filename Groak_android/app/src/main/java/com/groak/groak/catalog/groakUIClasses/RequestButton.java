package com.groak.groak.catalog.groakUIClasses;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import androidx.annotation.Nullable;

import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.groak.groak.R;
import com.groak.groak.activity.request.RequestActivity;

public class RequestButton extends FloatingActionButton {

    private Context context;

    public RequestButton(Context context) {
        super(context);

        this.context = context;

        setupViews();
    }

    private void setupViews() {
        setElevation(100);
        setImageResource(R.drawable.chat_white);
    }
}
