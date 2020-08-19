package com.groak.groak.catalog;

import com.google.firebase.Timestamp;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class TimeCatalog {
    public static String getDay() {
        Calendar calendar = Calendar.getInstance();
        int day = calendar.get(Calendar.DAY_OF_WEEK);

        switch (day) {
            case Calendar.SUNDAY:
                return "sunday";
            case Calendar.MONDAY:
                return "monday";
            case Calendar.TUESDAY:
                return "tuesday";
            case Calendar.WEDNESDAY:
                return "wednesday";
            case Calendar.THURSDAY:
                return "thursday";
            case Calendar.FRIDAY:
                return "friday";
            case Calendar.SATURDAY:
                return "saturday";
        }

        return "";
    }

    public static String getTimeFromTimestamp(Timestamp timestamp) {
        SimpleDateFormat sdf = new SimpleDateFormat("hh:mm aa");
        Date dt = timestamp.toDate();
        return sdf.format(dt);
    }

    public static String getCurrentDate() {
        DateFormat dateFormat = new SimpleDateFormat("hh:mm aa MMMM dd, yyyy");
        Date date = new Date();
        return dateFormat.format(date);
    }

    public static int getTimeInMinutes() {
        Calendar calendar = Calendar.getInstance();
        int hour = calendar.get(Calendar.HOUR);
        int minute = calendar.get(Calendar.MINUTE);

        return 60*hour + minute;
    }

    public static Date getYesterdayDate() {
        return new Date(System.currentTimeMillis() - 1000L * 60L * 60L * 24L);
    }

    public static Timestamp addThirtyMinutesToTimestamp() {
        Timestamp timestamp = new Timestamp(Timestamp.now().getSeconds() + 30*60, 0);

        return timestamp;
    }
}
