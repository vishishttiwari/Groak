package com.groak.groak.catalog;

import java.util.Calendar;

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

    public static int getTimeInMinutes() {
        Calendar calendar = Calendar.getInstance();
        int hour = calendar.get(Calendar.HOUR);
        int minute = calendar.get(Calendar.MINUTE);

        return 60*hour + minute;
    }
}
