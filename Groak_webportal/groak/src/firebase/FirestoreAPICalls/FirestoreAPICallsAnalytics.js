import { saveAndCheckNewUser } from '../../catalog/LocalStorage';
import { getTotalQuantityFromCart } from '../../catalog/Others';
import { getCurrentDateTime, db } from '../FirebaseLibrary';

const getCurrentDateInStringFormat = () => {
    const myDate = new Date();
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
    return `${month[myDate.getMonth()]}-${myDate.getDate()}-${myDate.getFullYear()}`;
};

export const createAnalyticsReference = (restaurantId) => {
    return db.collection(`restaurants/${restaurantId}/analytics`).doc(getCurrentDateInStringFormat());
};

export const fetchAnalyticsFirestoreAPI = (restaurantId, dateRange) => {
    return db.collection(`restaurants/${restaurantId}/analytics`)
        .where('timestamp', '>=', dateRange.startDate)
        .where('timestamp', '<=', dateRange.endDate).get();
};

/**
 * Whenever someone scans a qr code, this function is called
 *
 * @param {*} restaurantId
 * @param {*} tableId
 * @param {*} qrCodeId
 */
export const incrementUserWebFirestoreAPI = (restaurantId) => {
    if (saveAndCheckNewUser(restaurantId)) {
        const analyticsReference = createAnalyticsReference(restaurantId);
        return db.runTransaction(async (transaction) => {
            const analyticsDoc = await transaction.get(analyticsReference);

            // If the document for code scanning exists
            if (analyticsDoc.exists) {
                const { userWeb } = analyticsDoc.data();
                const newUserWeb = { ...userWeb, total: userWeb.total + 1 };
                return transaction.update(createAnalyticsReference(restaurantId), { userWeb: newUserWeb, timestamp: getCurrentDateTime() });
            }
            const newQRCodeScannedWeb = {
                total: 0,
                tables: { },
                qrCodes: { } };
            const newUserWeb = { total: 1 };
            const newOrderPlacedWeb = {
                total: 0,
                price: 0,
                tablesTotal: { },
                tablesPrice: { },
                dishesTotal: { },
                dishesPrice: { },
            };
            const newDishes = {};
            const newRestaurant = { foodRating: 0, serverRating: 0, totalRatingEntries: 0, messages: [] };
            return transaction.set(createAnalyticsReference(restaurantId), {
                qrCodeScannedWeb: newQRCodeScannedWeb,
                userWeb: newUserWeb,
                orderPlacedWeb: newOrderPlacedWeb,
                dishes: newDishes,
                restaurant: newRestaurant,
                timestamp: getCurrentDateTime() });
        });
    }
    return null;
};

/**
 * Whenever someone scans a qr code, this function is called
 *
 * @param {*} restaurantId
 * @param {*} tableId
 * @param {*} qrCodeId
 */
export const incrementCodeScannedWebFirestoreAPI = (restaurantId, tableId, qrCodeId) => {
    const analyticsReference = createAnalyticsReference(restaurantId);
    return db.runTransaction(async (transaction) => {
        const analyticsDoc = await transaction.get(analyticsReference);

        // If the document for code scanning exists
        if (analyticsDoc.exists) {
            const { qrCodeScannedWeb } = analyticsDoc.data();
            const newQRCodeScannedWeb = { ...qrCodeScannedWeb,
                total: qrCodeScannedWeb.total + 1,
                tables: { ...qrCodeScannedWeb.tables, [tableId]: qrCodeScannedWeb.tables[tableId] ? qrCodeScannedWeb.tables[tableId] + 1 : 1 },
                qrCodes: { ...qrCodeScannedWeb.qrCodes, [qrCodeId]: qrCodeScannedWeb.qrCodes[qrCodeId] ? qrCodeScannedWeb.qrCodes[qrCodeId] + 1 : 1 } };
            return transaction.update(createAnalyticsReference(restaurantId), { qrCodeScannedWeb: newQRCodeScannedWeb, timestamp: getCurrentDateTime() });
        }
        const newQRCodeScannedWeb = {
            total: 1,
            tables: { [tableId]: 1 },
            qrCodes: { [qrCodeId]: 1 } };
        const newUserWeb = { total: 0 };
        const newOrderPlacedWeb = {
            total: 0,
            price: 0,
            tablesTotal: { },
            tablesPrice: { },
            dishesTotal: { },
            dishesPrice: { },
        };
        const newDishes = {};
        const newRestaurant = { foodRating: 0, serverRating: 0, totalRatingEntries: 0, messages: [] };
        return transaction.set(createAnalyticsReference(restaurantId), {
            qrCodeScannedWeb: newQRCodeScannedWeb,
            userWeb: newUserWeb,
            orderPlacedWeb: newOrderPlacedWeb,
            dishes: newDishes,
            restaurant: newRestaurant,
            timestamp: getCurrentDateTime() });
    });
};

export const restaurantFeedbackSubmitted = (restaurantId, foodRating, serverRating, message) => {
    const analyticsReference = createAnalyticsReference(restaurantId);
    return db.runTransaction(async (transaction) => {
        const analyticsDoc = await transaction.get(analyticsReference);

        // If the document for code scanning exists
        if (analyticsDoc.exists) {
            const { restaurant } = analyticsDoc.data();
            if (restaurant) {
                let newFoodRating = restaurant.foodRating ? restaurant.foodRating : 0;
                let newServerRating = restaurant.serverRating ? restaurant.serverRating : 0;
                let newTotalRatingEntries = restaurant.totalRatingEntries ? restaurant.totalRatingEntries : 0;
                newFoodRating = ((newFoodRating * newTotalRatingEntries) + newFoodRating) / (newTotalRatingEntries + 1);
                newServerRating = ((newServerRating * newTotalRatingEntries) + newServerRating) / (newTotalRatingEntries + 1);

                newTotalRatingEntries += 1;
                if (message && message.length > 0) {
                    const newMessages = restaurant.messages ? restaurant.messages : [];
                    newMessages.push({ message, created: getCurrentDateTime() });
                    const newRestaurant = { ...restaurant, foodRating: newFoodRating, serverRating: newServerRating, totalRatingEntries: newTotalRatingEntries, messages: newMessages };
                    return transaction.update(createAnalyticsReference(restaurantId), { restaurant: newRestaurant, timestamp: getCurrentDateTime() });
                }
                const newRestaurant = { ...restaurant, foodRating: newFoodRating, serverRating: newServerRating, totalRatingEntries: newTotalRatingEntries };
                return transaction.update(createAnalyticsReference(restaurantId), { restaurant: newRestaurant, timestamp: getCurrentDateTime() });
            }
            let newFoodRating = 0;
            let newServerRating = 0;
            let newTotalRatingEntries = 0;
            newFoodRating = ((newFoodRating * newTotalRatingEntries) + newFoodRating) / (newTotalRatingEntries + 1);
            newServerRating = ((newServerRating * newTotalRatingEntries) + newServerRating) / (newTotalRatingEntries + 1);
            newTotalRatingEntries += 1;
            if (message && message.length > 0) {
                const newMessages = [];
                newMessages.push({ message, created: getCurrentDateTime() });
                const newRestaurant = { foodRating: newFoodRating, serverRating: newServerRating, totalRatingEntries: newTotalRatingEntries, messages: newMessages };
                return transaction.update(createAnalyticsReference(restaurantId), { restaurant: newRestaurant, timestamp: getCurrentDateTime() });
            }
            const newRestaurant = { foodRating: newFoodRating, serverRating: newServerRating, totalRatingEntries: newTotalRatingEntries };
            return transaction.update(createAnalyticsReference(restaurantId), { restaurant: newRestaurant, timestamp: getCurrentDateTime() });
        }
        const newQRCodeScannedWeb = {
            total: 1,
            tables: { },
            qrCodes: { } };
        const newUserWeb = { total: 0 };
        const newOrderPlacedWeb = {
            total: 0,
            price: 0,
            tablesTotal: { },
            tablesPrice: { },
            dishesTotal: { },
            dishesPrice: { },
        };
        const newDishes = {};
        let newRestaurant = {};
        if (message && message.length > 0) {
            newRestaurant = { foodRating, serverRating, totalRatingEntries: 1, messages: [{ message, created: getCurrentDateTime() }] };
        } else {
            newRestaurant = { foodRating, serverRating, totalRatingEntries: 1, messages: [] };
        }
        return transaction.set(createAnalyticsReference(restaurantId), {
            qrCodeScannedWeb: newQRCodeScannedWeb,
            userWeb: newUserWeb,
            orderPlacedWeb: newOrderPlacedWeb,
            dishes: newDishes,
            restaurant: newRestaurant,
            timestamp: getCurrentDateTime() });
    });
};

export const dishLikedFirestoreAPI = (restaurantId, dishId, like) => {
    const analyticsReference = createAnalyticsReference(restaurantId);
    return db.runTransaction(async (transaction) => {
        const analyticsDoc = await transaction.get(analyticsReference);

        // If the document for code scanning exists
        if (analyticsDoc.exists) {
            const { dishes } = analyticsDoc.data();
            if (dishes) {
                if (dishes[dishId]) {
                    if (like) {
                        const newDishes = { ...dishes, [dishId]: { ...dishes[dishId], likes: dishes[dishId].likes ? dishes[dishId].likes + 1 : 1 } };
                        return transaction.update(createAnalyticsReference(restaurantId), { dishes: newDishes, timestamp: getCurrentDateTime() });
                    }
                    const newDishes = { ...dishes, [dishId]: { ...dishes[dishId], dislikes: dishes[dishId].dislikes ? dishes[dishId].dislikes + 1 : 1 } };
                    return transaction.update(createAnalyticsReference(restaurantId), { dishes: newDishes, timestamp: getCurrentDateTime() });
                }
                if (like) {
                    const newDishes = { ...dishes, [dishId]: { likes: 1, dislikes: 0 } };
                    return transaction.update(createAnalyticsReference(restaurantId), { dishes: newDishes, timestamp: getCurrentDateTime() });
                }
                const newDishes = { ...dishes, [dishId]: { likes: 0, dislikes: 1 } };
                return transaction.update(createAnalyticsReference(restaurantId), { dishes: newDishes, timestamp: getCurrentDateTime() });
            }
            if (like) {
                const newDishes = { [dishId]: { likes: 1, dislikes: 0 } };
                return transaction.update(createAnalyticsReference(restaurantId), { dishes: newDishes, timestamp: getCurrentDateTime() });
            }
            const newDishes = { [dishId]: { likes: 0, dislikes: 1 } };
            return transaction.update(createAnalyticsReference(restaurantId), { dishes: newDishes, timestamp: getCurrentDateTime() });
        }
        const newQRCodeScannedWeb = {
            total: 1,
            tables: { },
            qrCodes: { } };
        const newUserWeb = { total: 0 };
        const newOrderPlacedWeb = {
            total: 0,
            price: 0,
            tablesTotal: { },
            tablesPrice: { },
            dishesTotal: { },
            dishesPrice: { },
        };
        const newDishes = {};
        if (like) {
            newDishes[dishId] = { likes: 1, dislikes: 0 };
        } else {
            newDishes[dishId] = { likes: 0, dislikes: 1 };
        }
        const newRestaurant = { foodRating: 0, serverRating: 0, totalRatingEntries: 0, messages: [] };
        return transaction.set(createAnalyticsReference(restaurantId), {
            qrCodeScannedWeb: newQRCodeScannedWeb,
            userWeb: newUserWeb,
            orderPlacedWeb: newOrderPlacedWeb,
            dishes: newDishes,
            restaurant: newRestaurant,
            timestamp: getCurrentDateTime() });
    });
};

export const orderPlacedWebFirestoreAPI = (restaurantId, tableId, cart, price) => {
    const analyticsReference = createAnalyticsReference(restaurantId);
    return db.runTransaction(async (transaction) => {
        const analyticsDoc = await transaction.get(analyticsReference);

        // If the document for code scanning exists
        if (analyticsDoc.exists) {
            const { orderPlacedWeb } = analyticsDoc.data();
            const newOrderPlacedWeb = { ...orderPlacedWeb,
                total: orderPlacedWeb.total + getTotalQuantityFromCart(cart),
                price: orderPlacedWeb.price + price,
                tablesTotal: { ...orderPlacedWeb.tablesTotal, [tableId]: orderPlacedWeb.tablesTotal[tableId] ? orderPlacedWeb.tablesTotal[tableId] + getTotalQuantityFromCart(cart) : getTotalQuantityFromCart(cart) },
                tablesPrice: { ...orderPlacedWeb.tablesPrice, [tableId]: orderPlacedWeb.tablesPrice[tableId] ? orderPlacedWeb.tablesPrice[tableId] + price : price },
                dishesTotal: { ...orderPlacedWeb.dishesTotal },
                dishesPrice: { ...orderPlacedWeb.dishesPrice },
            };

            cart.forEach((item) => {
                if (newOrderPlacedWeb.dishesTotal[item.dishId]) {
                    newOrderPlacedWeb.dishesTotal[item.dishId] += item.quantity;
                } else {
                    newOrderPlacedWeb.dishesTotal[item.dishId] = item.quantity;
                }
            });

            cart.forEach((item) => {
                if (newOrderPlacedWeb.dishesPrice[item.dishId]) {
                    newOrderPlacedWeb.dishesPrice[item.dishId] += item.price;
                } else {
                    newOrderPlacedWeb.dishesPrice[item.dishId] = item.price;
                }
            });
            return transaction.update(createAnalyticsReference(restaurantId), { orderPlacedWeb: newOrderPlacedWeb, timestamp: getCurrentDateTime() });
        }
        const newQRCodeScannedWeb = {
            total: 0,
            tables: { },
            qrCodes: { },
        };
        const newUserWeb = { total: 0 };
        const newOrderPlacedWeb = {
            total: getTotalQuantityFromCart(cart),
            price,
            tablesTotal: { [tableId]: getTotalQuantityFromCart(cart) },
            tablesPrice: { [tableId]: price },
            dishesTotal: { },
            dishesPrice: { },
        };
        cart.forEach((item) => {
            if (newOrderPlacedWeb.dishesTotal[item.dishId]) {
                newOrderPlacedWeb.dishesTotal[item.dishId] += item.quantity;
            } else {
                newOrderPlacedWeb.dishesTotal[item.dishId] = item.quantity;
            }
        });

        cart.forEach((item) => {
            if (newOrderPlacedWeb.dishesPrice[item.dishId]) {
                newOrderPlacedWeb.dishesPrice[item.dishId] += item.price;
            } else {
                newOrderPlacedWeb.dishesPrice[item.dishId] = item.price;
            }
        });
        const newDishes = {};
        const newRestaurant = { foodRating: 0, serverRating: 0, totalRatingEntries: 0, messages: [] };
        return transaction.set(createAnalyticsReference(restaurantId), {
            qrCodeScannedWeb: newQRCodeScannedWeb,
            userWeb: newUserWeb,
            orderPlacedWeb: newOrderPlacedWeb,
            dishes: newDishes,
            restaurant: newRestaurant,
            timestamp: getCurrentDateTime() });
    });
};
