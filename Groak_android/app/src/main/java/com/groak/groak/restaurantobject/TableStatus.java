package com.groak.groak.restaurantobject;

public enum TableStatus {
    available,
    seated,
    ordered,
    approved,
    served,
    payment;

    public boolean equals(String str) {
        switch(this) {
            case available:
                return ("available".equals(str));
            case seated:
                return ("seated".equals(str));
            case ordered:
                return ("ordered".equals(str));
            case approved:
                return ("approved".equals(str));
            case served:
                return ("served".equals(str));
            case payment:
                return ("payment".equals(str));
        }
        return false;
    }

    public static TableStatus fromString(String str) {
        if (str.equals("available")) return TableStatus.available;
        else if (str.equals("seated")) return TableStatus.seated;
        else if (str.equals("ordered")) return TableStatus.ordered;
        else if (str.equals("approved")) return TableStatus.approved;
        else if (str.equals("served")) return TableStatus.served;
        else if (str.equals("payment")) return TableStatus.payment;

        return null;
    }
}
