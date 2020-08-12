package com.groak.groak.activity.request;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.catalog.GroakCallback;

public class SuggestionsRecyclerViewAdapter extends RecyclerView.Adapter<SuggestionCell> {
    Context context;
    String[] suggestion;
    String[] fullSuggestion;

    GroakCallback callback;

    public SuggestionsRecyclerViewAdapter(Context context, GroakCallback callback) {
        this.context = context;
        this.suggestion = new String[9];
        this.fullSuggestion = new String[9];
        this.callback = callback;

        this.suggestion[0] = "💧";
        this.suggestion[1] = "🍴";
        this.suggestion[2] = "🍷";
        this.suggestion[3] = "\uD83C\uDF7D";
        this.suggestion[4] = "Specials?";
        this.suggestion[5] = "Chef's recommendation?";
        this.suggestion[6] = "Suggest spicy dishes";
        this.suggestion[7] = "Suggest gluten free dishes";
        this.suggestion[8] = "Suggest food for nut allergies";

        this.fullSuggestion[0] = "Can we have some water please?";
        this.fullSuggestion[1] = "Can we get some cutlery please?";
        this.fullSuggestion[2] = "Can we get a refill on our drinks?";
        this.fullSuggestion[3] = "Can we get some extra plates?";
        this.fullSuggestion[4] = "Could you tell me about the specials?";
        this.fullSuggestion[5] = "What are the chef's recommendation?";
        this.fullSuggestion[6] = "Can you suggest some spicy dishes?";
        this.fullSuggestion[7] = "Can you suggest some gluten free dishes?";
        this.fullSuggestion[8] = "Can you suggest some dishes for someone with nut allergies?";
    }

    public void refresh() {
        this.notifyDataSetChanged();
    }

    @NonNull
    @Override
    public SuggestionCell onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ConstraintLayout cellLayout = new ConstraintLayout(parent.getContext());
        cellLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.MATCH_PARENT));

        return new SuggestionCell(cellLayout);
    }

    @Override
    public void onBindViewHolder(@NonNull SuggestionCell holder, final int position) {
        holder.setSuggestion(this.suggestion[position]);

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                callback.onSuccess(fullSuggestion[position]);
            }
        });
    }

    @Override
    public int getItemCount() {
        return suggestion.length;
    }
}
