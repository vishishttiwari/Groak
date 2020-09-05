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
    localStorage.clear(`groak-${restaurantId}-cart`);
};

export const deleteCartItem = (restaurantId, index) => {
    const cart = JSON.parse(localStorage.getItem(`groak-${restaurantId}-cart`));
    cart.splice(index, 1);
    deleteCart(restaurantId);
    localStorage.setItem(`groak-${restaurantId}-cart`, JSON.stringify(cart));
};
