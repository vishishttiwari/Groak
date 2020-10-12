import { getCurrentDateTime } from './TimesDates';

/**
 * Saving cart to local storge
 *
 * @param {*} restaurantId
 * @param {*} item
 */
export const saveToCart = (restaurantId, item) => {
    let cart = JSON.parse(localStorage.getItem(`groak-${restaurantId}-cart`));
    if (!cart) {
        cart = [];
    }
    cart.push(item);
    localStorage.setItem(`groak-${restaurantId}-cart`, JSON.stringify(cart));
    localStorage.setItem(`groak-${restaurantId}-time`, JSON.stringify(getCurrentDateTime()));
};

/**
 * Fetching cart from local storage
 *
 * @param {*} restaurantId
 */
export const fetchCart = (restaurantId) => {
    let cart = JSON.parse(localStorage.getItem(`groak-${restaurantId}-cart`));
    if (!cart) {
        cart = [];
    }
    return cart;
};

/**
 * Fetch cart item at an index for cart details
 *
 * @param {*} restaurantId
 * @param {*} index
 */
export const fetchCartItem = (restaurantId, index) => {
    let cart = JSON.parse(localStorage.getItem(`groak-${restaurantId}-cart`));
    if (!cart) {
        cart = [];
    }
    if (index >= cart.length) return {};
    return cart[index];
};

/**
 * Update cart item at an index
 *
 * @param {*} restaurantId
 * @param {*} index
 * @param {*} item
 */
export const updateCartItem = (restaurantId, index, item) => {
    const cart = JSON.parse(localStorage.getItem(`groak-${restaurantId}-cart`));
    if (!cart || cart.length <= 0) {
        return;
    }
    cart.splice(index, 1, item);
    localStorage.setItem(`groak-${restaurantId}-cart`, JSON.stringify(cart));
};

/**
 * Delete cart
 *
 * @param {*} restaurantId
 */
export const deleteCart = (restaurantId) => {
    localStorage.removeItem(`groak-${restaurantId}-cart`);
};

/**
 * Delete cart at a specific index
 *
 * @param {*} restaurantId
 * @param {*} index
 */
export const deleteCartItem = (restaurantId, index) => {
    const cart = JSON.parse(localStorage.getItem(`groak-${restaurantId}-cart`));
    cart.splice(index, 1);
    deleteCart(restaurantId);
    localStorage.setItem(`groak-${restaurantId}-cart`, JSON.stringify(cart));
};

/**
 * Save order and dish reference and comments reference for each order places from the device
 *
 * @param {*} restaurantId
 * @param {*} itemIds
 */
export const saveOrder = (restaurantId, itemIds) => {
    let order = JSON.parse(localStorage.getItem(`groak-${restaurantId}-order`));
    if (!order) {
        order = [];
    }
    itemIds.forEach((item) => {
        order.push(item);
    });
    localStorage.setItem(`groak-${restaurantId}-order`, JSON.stringify(order));
    localStorage.setItem(`groak-${restaurantId}-time`, JSON.stringify(getCurrentDateTime()));
};

/**
 * Fetch all references of orders places from device
 *
 * @param {*} restaurantId
 */
export const fetchOrder = (restaurantId) => {
    let order = JSON.parse(localStorage.getItem(`groak-${restaurantId}-order`));
    if (!order) {
        order = [];
    }
    return order;
};

/**
 * Check if an order was placed from this device
 *
 * @param {*} restaurantId
 * @param {*} orderReference
 */
export const checkOrderLocallity = (restaurantId, orderReference) => {
    let order = JSON.parse(localStorage.getItem(`groak-${restaurantId}-order`));
    if (!order) {
        order = [];
    }
    return (order.includes(orderReference));
};

/**
 * Delete all order
 *
 * @param {*} restaurantId
 */
export const deleteOrder = (restaurantId) => {
    localStorage.removeItem(`groak-${restaurantId}-order`);
};

/**
 * New order id is refreshed every time a table becomes available. This checks if a newOrderId already exists or not.
 * If not then it adds it else it says that user is returning by returning boolean
 *
 * @param {*} restaurantId
 * @param {*} newOrderId
 */
export const saveAndCheckNewUser = (restaurantId) => {
    const lastScanTimeString = localStorage.getItem(`groak-${restaurantId}-lastScanTime`);
    if (lastScanTimeString === null) {
        localStorage.setItem(`groak-${restaurantId}-lastScanTime`, JSON.stringify(getCurrentDateTime()));
        localStorage.setItem(`groak-${restaurantId}-time`, JSON.stringify(getCurrentDateTime()));
        return true;
    }
    const lastScanTime = new Date(lastScanTimeString);
    lastScanTime.setHours(lastScanTime.getHours() + 2);
    if (lastScanTime <= getCurrentDateTime()) {
        localStorage.setItem(`groak-${restaurantId}-lastScanTime`, JSON.stringify(getCurrentDateTime()));
        localStorage.setItem(`groak-${restaurantId}-time`, JSON.stringify(getCurrentDateTime()));
        return true;
    }
    return false;
};

/**
 * This function is used for saving liked images
 *
 * @param {*} restaurantId
 * @param {*} dishId
 * @param {*} like
 */
export const saveLikedDishes = (restaurantId, dishId, like) => {
    let items = JSON.parse(localStorage.getItem(`groak-${restaurantId}-likes`));
    if (!items) {
        items = [];
    }
    const item = {};
    item.dishId = dishId;
    item.like = like;
    items.push(item);
    localStorage.setItem(`groak-${restaurantId}-likes`, JSON.stringify(items));
    localStorage.setItem(`groak-${restaurantId}-time`, JSON.stringify(getCurrentDateTime()));
};

/**
 * This function is used to see if a feed back for a dish Id has already been provided
 *
 * @param {*} restaurantId
 * @param {*} dishId
 */
export const fetchLikedImages = (restaurantId, dishId) => {
    let items = JSON.parse(localStorage.getItem(`groak-${restaurantId}-likes`));
    if (!items) {
        items = [];
    }
    let finalItem = {};
    items.forEach((item) => {
        if (item.dishId === dishId) {
            finalItem = item;
        }
    });
    if (finalItem.dishId) {
        return finalItem;
    }
    return null;
};

/**
 * This function is used for saving restaurant feedback
 *
 * @param {*} restaurantId
 */
export const saveRestaurantFeedback = (restaurantId) => {
    let feedback = JSON.parse(localStorage.getItem(`groak-${restaurantId}-feedback`));
    if (feedback === undefined || feedback === null) {
        feedback = true;
    }
    localStorage.setItem(`groak-${restaurantId}-feedback`, JSON.stringify(feedback));
    localStorage.setItem(`groak-${restaurantId}-time`, JSON.stringify(getCurrentDateTime()));
};

/**
 * This function is used to see if a feed back for a restaurant has already been provided
 *
 * @param {*} restaurantId
 */
export const fetchRestaurantFeedback = (restaurantId) => {
    let feedback = JSON.parse(localStorage.getItem(`groak-${restaurantId}-feedback`));
    if (feedback === undefined || feedback === null) {
        feedback = false;
    }
    return feedback;
};

/**
 * Delete all orders if the last update was more than 6 hours ago
 *
 * @param {*} restaurantId
 */
export const deleteAllLocalStorageAfter6Hours = (restaurantId) => {
    const updatedTime = new Date(JSON.parse(localStorage.getItem(`groak-${restaurantId}-time`)));
    updatedTime.setHours(updatedTime.getHours() + 6);
    if (updatedTime <= getCurrentDateTime()) {
        localStorage.clear();
    }
};
