package com.groak.groak.localstorage;

import android.content.Context;

import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.restaurantobject.order.Order;
import com.groak.groak.restaurantobject.order.OrderComment;
import com.groak.groak.restaurantobject.order.OrderCommentSavedInRealm;
import com.groak.groak.restaurantobject.order.OrderDish;
import com.groak.groak.restaurantobject.order.OrderDishSavedInRealm;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import io.realm.Realm;
import io.realm.RealmConfiguration;
import io.realm.RealmResults;

public class RealmWrapper {

    public static void addDishesAndComments(final Context context, Order order) {
        Realm.init(context);
        RealmConfiguration config = new RealmConfiguration.Builder()
                .deleteRealmIfMigrationNeeded()
                .build();
        Realm.setDefaultConfiguration(config);
        Realm realm = Realm.getInstance(config);

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
                Catalog.alert(context, "Error adding this order locally", "This order will not be saved as your order but will still be sent to the restaurant on behalf of your table. Please contact the restaurant regarding this", new GroakCallback() {
                    @Override
                    public void onSuccess(Object object) {
                    }
                    @Override
                    public void onFailure(Exception e) {
                    }
                });
            }
        });
    }

    public static void addComment(final Context context, OrderComment comment) {
        Realm.init(context);
        RealmConfiguration config = new RealmConfiguration.Builder()
                .deleteRealmIfMigrationNeeded()
                .build();
        Realm.setDefaultConfiguration(config);
        Realm realm = Realm.getInstance(config);

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
                Catalog.alert(context, "Error adding this comment locally", "This comment will not be saved as your comment but will still be sent to the restaurant on behalf of your table", new GroakCallback() {
                    @Override
                    public void onSuccess(Object object) {
                    }
                    @Override
                    public void onFailure(Exception e) {
                    }
                });
            }
        });
    }

    public static void downloadDishesAndComments(Context context, Order order) {
        Realm.init(context);
        RealmConfiguration config = new RealmConfiguration.Builder()
                .deleteRealmIfMigrationNeeded()
                .build();
        Realm.setDefaultConfiguration(config);
        Realm realm = Realm.getInstance(config);

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

    public static void deleteOldDishesAndComments(Context context) {
        Realm.init(context);
        RealmConfiguration config = new RealmConfiguration.Builder()
                .deleteRealmIfMigrationNeeded()
                .build();
        Realm.setDefaultConfiguration(config);
        Realm realm = Realm.getInstance(config);

        realm.executeTransaction(new Realm.Transaction() {
            @Override
            public void execute(Realm bgRealm) {
                Date yesterday = new Date(System.currentTimeMillis() - 1000L * 60L * 60L * 24L);
                RealmResults<OrderDishSavedInRealm> oldDishes = bgRealm.where(OrderDishSavedInRealm.class)
                        .lessThan("created", yesterday)
                        .findAll();

                RealmResults<OrderCommentSavedInRealm> oldComments = bgRealm.where(OrderCommentSavedInRealm.class)
                        .lessThan("created", new Date())
                        .findAll();

                oldDishes.deleteAllFromRealm();
                oldComments.deleteAllFromRealm();
            }
        });
    }
}
