/**
 * This function is used for the page adapter for tab bar
 */
package com.groak.groak.activity.tabbar;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import com.groak.groak.activity.cart.CartFragment;
import com.groak.groak.activity.covid.CovidFragment;
import com.groak.groak.activity.menu.MenuFragment;
import com.groak.groak.activity.order.OrderFragment;

public class TabbarViewPagerAdapter extends FragmentPagerAdapter {

    public TabbarViewPagerAdapter(@NonNull FragmentManager fm, int behavior) {
        super(fm, behavior);
    }

    @NonNull
    @Override
    public Fragment getItem(int position) {
        switch (position) {
            case 0:
                return new MenuFragment();
            case 1:
                return new CartFragment();
            case 2:
                return new OrderFragment();
            case 3:
                return new CovidFragment();
        }
        return null;
    }

    @Override
    public int getCount() {
        return 4;
    }
}
