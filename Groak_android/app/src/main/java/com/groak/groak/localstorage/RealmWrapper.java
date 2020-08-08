package com.groak.groak.localstorage;

import android.content.Context;

import com.groak.groak.catalog.Catalog;
import com.groak.groak.restaurantobject.order.Order;
import com.groak.groak.restaurantobject.order.OrderComment;
import com.groak.groak.restaurantobject.order.OrderCommentSavedInRealm;
import com.groak.groak.restaurantobject.order.OrderDish;
import com.groak.groak.restaurantobject.order.OrderDishSavedInRealm;

import java.util.ArrayList;
import java.util.List;

import io.realm.Realm;
import io.realm.RealmResults;

public class RealmWrapper {

    public static void addDishesAndComments(final Context context, Order order) {
        Realm.init(context);
        Realm realm = Realm.getDefaultInstance();

        final List<OrderDishSavedInRealm> dishes = new ArrayList<>();
        final List<OrderCommentSavedInRealm> comments = new ArrayList<>();

        for (OrderDish dish: order.getDishes())
            dishes.add(new OrderDishSavedInRealm(dish));

        for (OrderComment comment: order.getComments())
            comments.add(new OrderCommentSavedInRealm(comment));

        realm.executeTransactionAsync(new Realm.Transaction() {
            @Override
            public void execute(Realm bgRealm) {
                bgRealm.insert(dishes);
                bgRealm.insert(comments);
            }
        }, new Realm.Transaction.OnSuccess() {
            @Override
            public void onSuccess() {
            }
        }, new Realm.Transaction.OnError() {
            @Override
            public void onError(Throwable error) {
                Catalog.alert(context, "Error adding this order locally", "This order will not be saved as your order but will still be sent to the restaurant on behalf of your table. Please contact the restaurant regarding this", null);
            }
        });
    }

    public static void addComment(final Context context, OrderComment comment) {
        Realm.init(context);
        Realm realm = Realm.getDefaultInstance();

        final List<OrderCommentSavedInRealm> comments = new ArrayList<>();

        comments.add(new OrderCommentSavedInRealm(comment));

        realm.executeTransactionAsync(new Realm.Transaction() {
            @Override
            public void execute(Realm bgRealm) {
                bgRealm.insert(comments);
            }
        }, new Realm.Transaction.OnSuccess() {
            @Override
            public void onSuccess() {
            }
        }, new Realm.Transaction.OnError() {
            @Override
            public void onError(Throwable error) {
                Catalog.alert(context, "Error adding this comment locally", "This comment will not be saved as your comment but will still be sent to the restaurant on behalf of your table", null);
            }
        });
    }

    public static void downloadDishesAndComments(Context context, Order order) {
        Realm.init(context);
        Realm realm = Realm.getDefaultInstance();

        for (OrderDish dish: order.getDishes()) {
            RealmResults<OrderDishSavedInRealm> savedDishes = realm.where(OrderDishSavedInRealm.class)
                    .equalTo("reference", dish.getReference())
                    .findAll();

            if (savedDishes.isLoaded() && !savedDishes.isEmpty()) dish.setLocal(true);
        }

        for (OrderComment comment: order.getComments()) {
            RealmResults<OrderCommentSavedInRealm> savedComments = realm.where(OrderCommentSavedInRealm.class)
                    .equalTo("reference", comment.getReference())
                    .findAll();

            if (savedComments.isLoaded() && !savedComments.isEmpty()) comment.setLocal(true);
        }
    }
}
