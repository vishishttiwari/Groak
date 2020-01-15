/**
 * Random function used through out the project
 */
/* eslint-disable consistent-return */
import { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CSSVariables from '../globalCSS/_globalCSS.scss';

export const restaurantName = 'The Yellow Chilli';
export const androidAppLink = 'android';
export const iosAppLink = 'https://apps.apple.com/us/app/menu-door-menu-explorer/id1469002039';
export const refreshPeriod = 5000;
export const cuisines = ['Asian Fusion', 'Bagels', 'Bakery', 'Bar/Lounge/Pub', 'Barbeque', 'Breakfast', 'British', 'Brunch', 'Buffets', 'Burgers', 'Cajun/Creole', 'Caribbean', 'Chinese', 'Coffee/Espresso', 'Country Food', 'Cuban', 'Deli', 'Doughnuts', 'Family Fare', 'Fast Food', 'Fine Dining', 'Food Trucks', 'French', 'German', 'Gluten-free', 'Greek', 'Hot Dogs', 'Ice Cream', 'Indian', 'Irish', 'Italian', 'Japanese', 'Latin American', 'Live Entertainment', 'Mediterranean', 'Mexican', 'Nouvelle', 'Pancakes/Waffles', 'Pizza', 'Polish', 'Sandwiches', 'Seafood', 'Soul Food', 'Soup & Salad', 'Southern', 'Spanish', 'Sports Bar', 'Steaks', 'Sushi', 'Tapas', 'Thai', 'Vegan Friendly', 'Vegetarian'];

// This cell is used as a special id for special instructions cell in the whole project
export const specialInstructionsId = 'specialInstructionsCellIdABCD1234';

export const TableStatus = {
    available: 'available',
    seated: 'seated',
    ordered: 'ordered',
    approved: 'approved',
    served: 'served',
    payment: 'payment',
};

export const TableStatusText = {
    available: 'Table Available',
    seated: 'Customers are seated',
    ordered: 'Order Requested',
    approved: 'Order Approved',
    served: 'Order Served',
    payment: 'Ready for Payment',
};

export const TableStatusStyle = {
    available: { backgroundColor: CSSVariables.tableGreenColor },
    seated: { backgroundColor: CSSVariables.tableOrangeColor },
    ordered: { backgroundColor: CSSVariables.tableRedColor },
    requested: { backgroundColor: CSSVariables.tableRedColor },
    approved: { backgroundColor: CSSVariables.tableOrangeColor },
    served: { backgroundColor: CSSVariables.tableOrangeColor },
    payment: { backgroundColor: CSSVariables.tableRedColor },
};

/**
 * This hook is used for interval for changing time left in orders
 *
 * @param {*} callback function to be called after time out
 * @param {*} delay amount of time for interval
 */
export const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => { return clearInterval(id); };
        }
    }, [delay]);
};

/**
 * This function creates random alpha numeric string for keys in maps and ids of items
 */
export const randomNumber = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Calculate prices of all dishes by adding them
 *
 * @param {*} dishes all the dishes for which the total price needs to be added
 */
export const calculatePriceFromDishes = (dishes) => {
    let price = 0;
    dishes.forEach((dish) => {
        price += dish.price;
    });
    return price.toFixed(2);
};

/**
 * Calculate sales tax of all dishes
 *
 * @param {*} dishes all the dishes for which the total price needs to be added
 * @param {*} salesTax sales tax of the restaurant
 */
export const calculateSalesTaxFromDishes = (dishes, salesTax) => {
    let price = 0;
    dishes.forEach((dish) => {
        price += dish.price;
    });
    const totalPrice = price;
    price += price * (salesTax / 100);
    price -= totalPrice;
    return price.toFixed(2);
};

/**
 * Calculate prices of all dishes by adding them and also add the tax at the end
 *
 * @param {*} dishes all the dishes for which the total price needs to be added
 * @param {*} salesTax sales tax of the restaurant
 */
export const calculatePriceFromDishesWithTax = (dishes, salesTax) => {
    let price = 0;
    dishes.forEach((dish) => {
        price += dish.price;
    });
    price += price * (salesTax / 100);
    return price.toFixed(2);
};

/**
 * This function gets price in right format
 *
 * @param {*} price
 */
export const getPrice = (price) => {
    return price.toFixed(2);
};

/**
 * This gets all the fonts in the fonts folder
 */
export const getFonts = () => {
    const path = require.context('../assets/fonts');
    const fonts = {};
    path.keys().forEach((item) => {
        let font = item;
        font = font.replace('./', '');
        font = font.replace('.ttf', '');
        fonts[font] = path(item);
    });
    return fonts;
};

/**
 * This gets all the images in QR Style Images
 */
export const getQRStyleImages = () => {
    const path = require.context('../assets/qrStyleImages');
    const images = {};
    path.keys().forEach((item) => {
        let image = item;
        image = image.replace('./', '');
        image = image.replace('.png', '');
        images[image] = path(item);
    });
    return images;
};

/**
 * This provides white backfround to label of text fielc
 */
export const TextFieldLabelStyles = {
    labelRoot: {
        padding: '0 10px',
        backgroundColor: 'white',
    },
};

/**
 * This provides white backfround to label of text fielc and also always shrinks it
 */
export const textFieldLabelPropsShrink = (classes) => {
    return {
        classes: {
            root: classes.labelRoot,
        },
        shrink: true,
    };
};

/**
 * This provides white backfround to label of text fielc
 */
export const textFieldLabelProps = (classes) => {
    return {
        classes: {
            root: classes.labelRoot,
        },
    };
};

/**
 * This is used for all items that contain delete icon. This is used for
 * distance between the delete icon and the text in the button.
 */
export const uploadButtonStyle = makeStyles((theme) => {
    return {
        rightIcon: {
            marginLeft: theme.spacing(1),
        },
    };
});
