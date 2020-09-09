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
