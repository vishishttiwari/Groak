package com.groak.groak.notification;

import android.content.Intent;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.groak.groak.catalog.Catalog;

public class UserNotification extends FirebaseMessagingService {

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        final RemoteMessage.Notification notification = remoteMessage.getNotification();

        if (notification != null) {
            Handler handler = new Handler(Looper.getMainLooper());
            handler.post(new Runnable() {
                public void run() {
                    if (notification.getTag().equals("request")) {
                        Catalog.toast(getApplicationContext(), notification.getTitle() + ": \"" + notification.getBody() + "\"");
                    } else if (notification.getTag().equals("order")) {
                        Catalog.toast(getApplicationContext(),   notification.getTitle() + ".  " + notification.getBody());
                    } else if (notification.getTag().equals("reset")) {
                        Catalog.toast(getApplicationContext(), notification.getBody());
                    }
                }
            });
        }
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
