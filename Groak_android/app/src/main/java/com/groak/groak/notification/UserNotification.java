package com.groak.groak.notification;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.groak.groak.R;
import com.groak.groak.activity.request.RequestActivity;
import com.groak.groak.activity.restaurant.RestaurantListActivity;
import com.groak.groak.activity.tabbar.TabbarActivity;
import com.groak.groak.localstorage.LocalRestaurant;

import java.util.Map;

public class UserNotification extends FirebaseMessagingService {

    public static boolean isRequestShowing = false;
    public static int count = 0;
    public static boolean alreadyExecuted = false;

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        final Map<String, String> notification = remoteMessage.getData();

        if (LocalRestaurant.restaurant == null) return;

        if (notification != null && notification.get("title") != null && notification.get("body") != null && notification.get("tag") != null) {
            String title = notification.get("title");
            String body = notification.get("body");
            String tag = notification.get("tag");

            if (!alreadyExecuted) {
                if (!tag.equals("request") || !isRequestShowing) {
                    sendNotification(title, body, tag);
                }
                alreadyExecuted = true;
                new java.util.Timer().schedule(
                        new java.util.TimerTask() {
                            @Override
                            public void run() {
                                alreadyExecuted = false;
                            }
                        },
                        3000
                );

                Handler handler = new Handler(Looper.getMainLooper());
                handler.post(new Runnable() {
                    public void run() {
                        if (tag.equals("request")) {
//                        if (!isRequestShowing)
//                            Catalog.toast(getApplicationContext(), title + ": \"" + body + "\"");
                        } else if (tag.equals("order")) {
//                        Catalog.toast(getApplicationContext(),   title + ".  " + body);
                        } else if (tag.equals("reset")) {
//                        Catalog.toast(getApplicationContext(), body);

                            LocalRestaurant.resetRestaurant();

                            Intent intent = new Intent(getApplicationContext(), RestaurantListActivity.class);
                            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                            intent.putExtra("EXIT", true);
                            getApplicationContext().startActivity(intent);
                        }
                    }
                });
            }
        }
    }

    private void sendNotification(String title, String body, String tag) {
        NotificationManager manager;

        count++;

        System.out.println(count);

        Intent intent;
        if (tag.equals("request")) {
            intent = new Intent(getApplicationContext(), RequestActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        } else if (tag.equals("order")) {
            intent = new Intent(getApplicationContext(), TabbarActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        } else if (tag.equals("reset")) {
            intent = new Intent(getApplicationContext(), RestaurantListActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.putExtra("EXIT", true);
        }
        else {
            intent = new Intent(getApplicationContext(), RestaurantListActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.putExtra("EXIT", true);
        }
        PendingIntent pendingIntent = PendingIntent.getActivity(getApplicationContext(), 0, intent, 0);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(getApplicationContext(), "groak_channel_id");

        NotificationCompat.BigTextStyle bigText = new NotificationCompat.BigTextStyle();
        bigText.setBigContentTitle(title);
        bigText.bigText(body);
        bigText.setSummaryText(body);

        builder.setContentIntent(pendingIntent);
        builder.setSmallIcon(R.drawable.groakroundedicon);
        builder.setColor(Color.rgb(128, 128, 128));
        builder.setPriority(NotificationCompat.PRIORITY_HIGH);
        builder.setAutoCancel(true);
        builder.setNumber(count);
        builder.setContentTitle(title);
        builder.setContentText(body);
        builder.setStyle(bigText);

        manager = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
        {
            String channelId = "groak_channel_id";
            NotificationChannel channel = new NotificationChannel(
                    channelId,
                    "Groak Channel Id",
                    NotificationManager.IMPORTANCE_HIGH);
            channel.setDescription(body);
            channel.setShowBadge(true);
            channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            manager.createNotificationChannel(channel);
            builder.setChannelId(channelId);
        }

        manager.notify(0 /*ID of notification*/, builder.build());
    }

    public static void subscribe(String topic) {
        FirebaseMessaging.getInstance().subscribeToTopic(topic)
                .addOnCompleteListener(new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                    }
                });
    }

    public static void unsubscribe(String topic) {
        FirebaseMessaging.getInstance().unsubscribeFromTopic(topic);
    }
}
