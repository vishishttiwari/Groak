import { getCurrentDateTime } from './TimesDates';

export const saveToCart = (restaurantId, item) => {
    let cart = JSON.parse(localStorage.getItem(`groak-${restaurantId}-cart`));
    if (!cart) {
        cart = [];
    }
    cart.push(item);
    localStorage.setItem(`groak-${restaurantId}-cart`, JSON.stringify(cart));
    localStorage.setItem(`groak-${restaurantId}-time`, JSON.stringify(getCurrentDateTime()));
};

export const fetchCart = (restaurantId) => {
    let cart = JSON.parse(localStorage.getItem(`groak-${restaurantId}-cart`));
    if (!cart) {
        cart = [];
    }
    return cart;
};

export const fetchCartItem = (restaurantId, index) => {
    let cart = JSON.parse(localStorage.getItem(`groak-${restaurantId}-cart`));
    if (!cart) {
        cart = [];
    }
    if (index >= cart.length) return {};
    return cart[index];
};

export const updateCartItem = (restaurantId, index, item) => {
    const cart = JSON.parse(localStorage.getItem(`groak-${restaurantId}-cart`));
    if (!cart || cart.length <= 0) {
        return;
    }
    cart.splice(index, 1, item);
    localStorage.setItem(`groak-${restaurantId}-cart`, JSON.stringify(cart));
};

export const deleteCart = (restaurantId) => {
    localStorage.removeItem(`groak-${restaurantId}-cart`);
};

export const deleteCartItem = (restaurantId, index) => {
    const cart = JSON.parse(localStorage.getItem(`groak-${restaurantId}-cart`));
    cart.splice(index, 1);
    deleteCart(restaurantId);
    localStorage.setItem(`groak-${restaurantId}-cart`, JSON.stringify(cart));
};

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

export const fetchOrder = (restaurantId) => {
    let order = JSON.parse(localStorage.getItem(`groak-${restaurantId}-order`));
    if (!order) {
        order = [];
    }
    return order;
};

export const checkOrderLocallity = (restaurantId, orderReference) => {
    let order = JSON.parse(localStorage.getItem(`groak-${restaurantId}-order`));
    if (!order) {
        order = [];
    }
    return (order.includes(orderReference));
};

export const deleteOrder = (restaurantId) => {
    localStorage.removeItem(`groak-${restaurantId}-order`);
};

export const deleteAllLocalStorageAfter6Hours = (restaurantId) => {
    const updatedTime = new Date(JSON.parse(localStorage.getItem(`groak-${restaurantId}-time`)));
    updatedTime.setHours(updatedTime.getHours() + 6);
    if (updatedTime <= getCurrentDateTime()) {
        localStorage.clear();
    }
};
