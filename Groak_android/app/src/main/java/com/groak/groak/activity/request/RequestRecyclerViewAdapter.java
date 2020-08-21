/**
 * This class is used for recyclerview in request activity
 */
package com.groak.groak.activity.request;

import android.content.Context;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.localstorage.LocalRestaurant;

public class RequestRecyclerViewAdapter extends RecyclerView.Adapter<RequestCell> {
    Context context;

    public RequestRecyclerViewAdapter(Context context) {
        this.context = context;
    }

    public void refresh() {
        this.notifyDataSetChanged();
    }

    @NonNull
    @Override
    public RequestCell onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ConstraintLayout cellLayout = new ConstraintLayout(parent.getContext());
        cellLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));

        return new RequestCell(cellLayout);
    }

    @Override
    public void onBindViewHolder(@NonNull RequestCell holder, final int position) {
        holder.setRequestByUser(LocalRestaurant.requests.getRequests().get(position));
    }

    @Override
    public int getItemCount() {
        return LocalRestaurant.requests.getRequests().size();
    }
}
