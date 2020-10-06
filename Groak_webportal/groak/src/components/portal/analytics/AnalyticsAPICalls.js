import { ErrorFetchingAnalytics } from '../../../catalog/NotificationsComments';
import { frontDoorQRMenuPageId, viewOnlyQRMenuPageId } from '../../../catalog/Others';
import { fetchAnalyticsFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsAnalytics';
import { fetchDishFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { fetchQRCodeFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsQRCodes';
import { fetchTableFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsTables';

export const getDatesInArray = (dateRange) => {
    const month = [];
    month[0] = 'Jan';
    month[1] = 'Feb';
    month[2] = 'Mar';
    month[3] = 'Apr';
    month[4] = 'May';
    month[5] = 'Jun';
    month[6] = 'Jul';
    month[7] = 'Aug';
    month[8] = 'Sep';
    month[9] = 'Oct';
    month[10] = 'Nov';
    month[11] = 'Dec';
    const dates = [];
    const currentDate = new Date(dateRange.startDate);
    while (currentDate <= dateRange.endDate) {
        dates.push(`${month[currentDate.getMonth()]}-${currentDate.getDate()}-${currentDate.getFullYear()}`);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
};

export const fetchAnalyticsAPI = async (restaurantId, dateRange, setState, snackbar) => {
    const labels = getDatesInArray(dateRange);
    // Users
    let totalUsers = 0;
    let totalScans = 0;
    const totalUsersArray = new Array(labels.length).fill(0);
    const totalScansArray = new Array(labels.length).fill(0);
    const qrCodesIds = [];
    const qrCodesLabels = [];
    const qrCodesValues = [];
    const tableCodesIds = [];
    const tableCodesLabels = [];
    const tableCodesValues = [];

    // Orders
    let totalOrders = 0;
    let priceOrders = 0;
    const totalOrdersArray = new Array(labels.length).fill(0);
    const priceOrdersArray = new Array(labels.length).fill(0);
    const dishesOrdersTotalIds = [];
    const dishesOrdersTotalLabels = [];
    const dishesOrdersTotalValues = [];
    const dishesOrdersPriceIds = [];
    const dishesOrdersPriceLabels = [];
    const dishesOrdersPriceValues = [];
    const tableOrdersTotalIds = [];
    const tableOrdersTotalLabels = [];
    const tableOrdersTotalValues = [];
    const tableOrdersPriceIds = [];
    const tableOrdersPriceLabels = [];
    const tableOrdersPriceValues = [];

    // Dishes
    const dishesIds = [];
    const dishesLabels = [];
    const dishesLikes = [];

    // Restaurant
    let toalRatingEntries = 0;
    let totalRating = 0;
    const totalRatingEntriesArray = new Array(labels.length).fill(0);
    const totalRatingArray = new Array(labels.length).fill(0);
    const messages = [];

    const qrCodesMap = new Map();
    const tableCodesMap = new Map();
    const dishesOrdersTotalMap = new Map();
    const dishesOrdersPriceMap = new Map();
    const tableOrdersTotalMap = new Map();
    const tableOrdersPriceMap = new Map();
    const dishesMap = new Map();
    await fetchAnalyticsFirestoreAPI(restaurantId, dateRange)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // Users
                if (doc.data().userWeb && doc.data().userWeb.total) {
                    totalUsers += doc.data().userWeb.total;
                    totalUsersArray[labels.indexOf(doc.id)] = doc.data().userWeb.total;
                }
                if (doc.data().qrCodeScannedWeb && doc.data().qrCodeScannedWeb.total) {
                    totalScans += doc.data().qrCodeScannedWeb.total;
                    totalScansArray[labels.indexOf(doc.id)] = doc.data().qrCodeScannedWeb.total;
                }
                if (doc.data().qrCodeScannedWeb && doc.data().qrCodeScannedWeb.qrCodes) {
                    Object.keys(doc.data().qrCodeScannedWeb.qrCodes).forEach((qrCodeId) => {
                        if (qrCodesMap.get(qrCodeId)) {
                            qrCodesMap.set(qrCodeId, qrCodesMap.get(qrCodeId) + doc.data().qrCodeScannedWeb.qrCodes[qrCodeId]);
                        } else {
                            qrCodesMap.set(qrCodeId, doc.data().qrCodeScannedWeb.qrCodes[qrCodeId]);
                        }
                    });
                }
                if (doc.data().qrCodeScannedWeb && doc.data().qrCodeScannedWeb.tables) {
                    Object.keys(doc.data().qrCodeScannedWeb.tables).forEach((tableId) => {
                        if (tableCodesMap.get(tableId)) {
                            tableCodesMap.set(tableId, tableCodesMap.get(tableId) + doc.data().qrCodeScannedWeb.tables[tableId]);
                        } else {
                            tableCodesMap.set(tableId, doc.data().qrCodeScannedWeb.tables[tableId]);
                        }
                    });
                }

                // Orders
                if (doc.data().orderPlacedWeb && doc.data().orderPlacedWeb.total) {
                    totalOrders += doc.data().orderPlacedWeb.total;
                    totalOrdersArray[labels.indexOf(doc.id)] = doc.data().orderPlacedWeb.total;
                }
                if (doc.data().orderPlacedWeb && doc.data().orderPlacedWeb.price) {
                    priceOrders += doc.data().orderPlacedWeb.price;
                    priceOrdersArray[labels.indexOf(doc.id)] = doc.data().orderPlacedWeb.price;
                }
                if (doc.data().orderPlacedWeb && doc.data().orderPlacedWeb.dishesTotal) {
                    Object.keys(doc.data().orderPlacedWeb.dishesTotal).forEach((dishId) => {
                        if (dishesOrdersTotalMap.get(dishId)) {
                            dishesOrdersTotalMap.set(dishId, dishesOrdersTotalMap.get(dishId) + doc.data().orderPlacedWeb.dishesTotal[dishId]);
                        } else {
                            dishesOrdersTotalMap.set(dishId, doc.data().orderPlacedWeb.dishesTotal[dishId]);
                        }
                    });
                }
                if (doc.data().orderPlacedWeb && doc.data().orderPlacedWeb.dishesPrice) {
                    Object.keys(doc.data().orderPlacedWeb.dishesPrice).forEach((dishId) => {
                        if (dishesOrdersPriceMap.get(dishId)) {
                            dishesOrdersPriceMap.set(dishId, dishesOrdersPriceMap.get(dishId) + doc.data().orderPlacedWeb.dishesPrice[dishId]);
                        } else {
                            dishesOrdersPriceMap.set(dishId, doc.data().orderPlacedWeb.dishesPrice[dishId]);
                        }
                    });
                }
                if (doc.data().orderPlacedWeb && doc.data().orderPlacedWeb.tablesTotal) {
                    Object.keys(doc.data().orderPlacedWeb.tablesTotal).forEach((tableId) => {
                        if (tableOrdersTotalMap.get(tableId)) {
                            tableOrdersTotalMap.set(tableId, tableOrdersTotalMap.get(tableId) + doc.data().orderPlacedWeb.tablesTotal[tableId]);
                        } else {
                            tableOrdersTotalMap.set(tableId, doc.data().orderPlacedWeb.tablesTotal[tableId]);
                        }
                    });
                }
                if (doc.data().orderPlacedWeb && doc.data().orderPlacedWeb.tablesPrice) {
                    Object.keys(doc.data().orderPlacedWeb.tablesPrice).forEach((tableId) => {
                        if (tableOrdersPriceMap.get(tableId)) {
                            tableOrdersPriceMap.set(tableId, tableOrdersPriceMap.get(tableId) + doc.data().orderPlacedWeb.tablesPrice[tableId]);
                        } else {
                            tableOrdersPriceMap.set(tableId, doc.data().orderPlacedWeb.tablesPrice[tableId]);
                        }
                    });
                }

                // Dishes
                if (doc.data().dishes) {
                    const { dishes } = doc.data();
                    Object.keys(dishes).forEach((dishId) => {
                        if (dishesMap.get(dishId)) {
                            dishesMap.set(dishId, { likes: dishesMap.get(dishId).likes + dishes[dishId].likes, dislikes: dishesMap.get(dishId).dislikes + dishes[dishId].dislikes });
                        } else {
                            dishesMap.set(dishId, { likes: dishes[dishId].likes, dislikes: dishes[dishId].dislikes });
                        }
                    });
                }

                // Restaurant
                if (doc.data().restaurant) {
                    const { restaurant } = doc.data();
                    if (restaurant.rating && restaurant.totalRatingEntries) {
                        totalRating = ((restaurant.rating * restaurant.totalRatingEntries) + (totalRating * toalRatingEntries)) / (toalRatingEntries + restaurant.totalRatingEntries);
                    }
                    if (restaurant.totalRatingEntries) {
                        toalRatingEntries += restaurant.totalRatingEntries;
                    }
                    totalRatingEntriesArray[labels.indexOf(doc.id)] = restaurant.totalRatingEntries;
                    totalRatingArray[labels.indexOf(doc.id)] = restaurant.rating;
                    if (restaurant && restaurant.messages) {
                        messages.push(...restaurant.messages.reverse());
                    }
                }
            });
        })
        .catch(() => {
            snackbar(ErrorFetchingAnalytics, { variant: 'error' });
        });

    // Users
    qrCodesMap.forEach((value, id) => {
        qrCodesValues.push(value);
        qrCodesIds.push(id);
    });
    tableCodesMap.forEach((value, id) => {
        tableCodesValues.push(value);
        tableCodesIds.push(id);
    });
    dishesOrdersTotalMap.forEach((value, id) => {
        dishesOrdersTotalValues.push(value);
        dishesOrdersTotalIds.push(id);
    });
    dishesOrdersPriceMap.forEach((value, id) => {
        dishesOrdersPriceValues.push(value);
        dishesOrdersPriceIds.push(id);
    });
    tableOrdersTotalMap.forEach((value, id) => {
        tableOrdersTotalValues.push(value);
        tableOrdersTotalIds.push(id);
    });
    tableOrdersPriceMap.forEach((value, id) => {
        tableOrdersPriceValues.push(value);
        tableOrdersPriceIds.push(id);
    });
    dishesMap.forEach((value, id) => {
        dishesLikes.push(value);
        dishesIds.push(id);
    });

    // Users
    await Promise.all(tableCodesIds.map(async (tableId) => {
        if (tableId === viewOnlyQRMenuPageId) {
            tableCodesLabels.push('View Only Menu');
        } else if (tableId === frontDoorQRMenuPageId) {
            tableCodesLabels.push('Front Door Menu');
        } else {
            const tableDoc = await fetchTableFirestoreAPI(restaurantId, tableId);
            if (tableDoc && tableDoc.data() && tableDoc.data().name) {
                tableCodesLabels.push(tableDoc.data().name);
            } else {
                tableCodesLabels.push('Unavaialable');
            }
        }
    }));
    await Promise.all(qrCodesIds.map(async (qrCodeId) => {
        const qrCodeDoc = await fetchQRCodeFirestoreAPI(restaurantId, qrCodeId);
        if (qrCodeDoc && qrCodeDoc.data() && qrCodeDoc.data().name) {
            qrCodesLabels.push(qrCodeDoc.data().name);
        } else {
            qrCodesLabels.push('Unavaialable');
        }
    }));

    // Orders
    await Promise.all(tableOrdersTotalIds.map(async (tableId) => {
        if (tableId === viewOnlyQRMenuPageId) {
            tableOrdersTotalLabels.push('View Only Menu');
        } else if (tableId === frontDoorQRMenuPageId) {
            tableOrdersTotalLabels.push('Front Door Menu');
        } else {
            const tableDoc = await fetchTableFirestoreAPI(restaurantId, tableId);
            if (tableDoc && tableDoc.data() && tableDoc.data().name) {
                tableOrdersTotalLabels.push(tableDoc.data().name);
            } else {
                tableOrdersTotalLabels.push('Unavaialable');
            }
        }
    }));
    await Promise.all(tableOrdersPriceIds.map(async (tableId) => {
        if (tableId === viewOnlyQRMenuPageId) {
            tableOrdersPriceLabels.push('View Only Menu');
        } else if (tableId === frontDoorQRMenuPageId) {
            tableOrdersPriceLabels.push('Front Door Menu');
        } else {
            const tableDoc = await fetchTableFirestoreAPI(restaurantId, tableId);
            if (tableDoc && tableDoc.data() && tableDoc.data().name) {
                tableOrdersPriceLabels.push(tableDoc.data().name);
            } else {
                tableOrdersPriceLabels.push('Unavaialable');
            }
        }
    }));
    await Promise.all(dishesOrdersTotalIds.map(async (dishId) => {
        const dishDoc = await fetchDishFirestoreAPI(restaurantId, dishId);
        if (dishDoc && dishDoc.data() && dishDoc.data().name) {
            dishesOrdersTotalLabels.push(dishDoc.data().name);
        } else {
            dishesOrdersTotalLabels.push('Unavaialable');
        }
    }));
    await Promise.all(dishesOrdersPriceIds.map(async (dishId) => {
        const dishDoc = await fetchDishFirestoreAPI(restaurantId, dishId);
        if (dishDoc && dishDoc.data() && dishDoc.data().name) {
            dishesOrdersPriceLabels.push(dishDoc.data().name);
        } else {
            dishesOrdersPriceLabels.push('Unavaialable');
        }
    }));
    await Promise.all(dishesIds.map(async (dishId) => {
        const dishDoc = await fetchDishFirestoreAPI(restaurantId, dishId);
        if (dishDoc && dishDoc.data() && dishDoc.data().name) {
            dishesLabels.push(dishDoc.data());
        } else {
            dishesLabels.push({ name: 'Unavaialable', reference: null });
        }
    }));

    setState({
        type: 'setAnalytics',
        labels,
        totalUsers,
        totalScans,
        totalUsersArray,
        totalScansArray,
        qrCodesLabels,
        qrCodesValues,
        tableCodesLabels,
        tableCodesValues,

        totalOrders,
        priceOrders,
        totalOrdersArray,
        priceOrdersArray,
        dishesOrdersTotalLabels,
        dishesOrdersTotalValues,
        dishesOrdersPriceLabels,
        dishesOrdersPriceValues,
        tableOrdersTotalLabels,
        tableOrdersTotalValues,
        tableOrdersPriceLabels,
        tableOrdersPriceValues,

        dishesLabels,
        dishesLikes,

        totalRating,
        toalRatingEntries,
        totalRatingEntriesArray,
        totalRatingArray,
        messages,
    });
};
