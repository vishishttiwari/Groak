export const saveToCart = (restaurantId, item) => {
    let cart = JSON.parse(localStorage.getItem(`groak-${restaurantId}-cart`));
    if (!cart) {
        cart = [];
    }
    cart.push(item);
    localStorage.setItem(`groak-${restaurantId}-cart`, JSON.stringify(cart));
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

export const deleteAllLocalStorageAfter6Hours = () => {
    // see the timings and delete all local storage items before 6 hours
};
