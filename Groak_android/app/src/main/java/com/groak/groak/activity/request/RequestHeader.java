/**
 * This class is used to represent the header in request activity.
 */
package com.groak.groak.activity.request;

import android.app.Activity;
import android.content.Context;
import android.view.View;

import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.groakheader.GroakOtherHeader;

public class RequestHeader extends GroakOtherHeader {
    public RequestHeader(Context context, String header, GroakCallback callback) {
        super(context, header, callback);

        back.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                groakCallback.onSuccess("back");
                ((Activity)getContext()).finish();
            }
        });
    }
}
