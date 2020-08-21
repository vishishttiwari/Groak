/**
 * This class is used for a scroll view to determine when the scroll view has stopped scrolling.
 * Used in menu view to scroll the categories view in the header.
 */
package com.groak.groak.catalog.groakUIClasses;

import android.content.Context;

import androidx.core.widget.NestedScrollView;

public class CustomNestedScrollView extends NestedScrollView {

    private Runnable scrollerTask;
    private int initialPosition;

    private int newCheck = 100;
    private static final String TAG = "MyScrollView";

    public interface OnScrollStoppedListener{
        void onScrollStopped(int scrollY);
    }

    private OnScrollStoppedListener onScrollStoppedListener;

    public CustomNestedScrollView(Context context) {
        super(context);

        scrollerTask = new Runnable() {

            public void run() {

                int newPosition = getScrollY();
                if(initialPosition - newPosition == 0){//has stopped

                    if(onScrollStoppedListener!=null){

                        onScrollStoppedListener.onScrollStopped(newPosition);
                    }
                }else{
                    initialPosition = getScrollY();
                    CustomNestedScrollView.this.postDelayed(scrollerTask, newCheck);
                }
            }
        };
    }

    public void setOnScrollStoppedListener(CustomNestedScrollView.OnScrollStoppedListener listener){
        onScrollStoppedListener = listener;
    }

    public void startScrollerTask(){

        initialPosition = getScrollY();
        CustomNestedScrollView.this.postDelayed(scrollerTask, newCheck);
    }

}
