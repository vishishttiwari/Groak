/**
 * Random function used through out the project
 */
/* eslint-disable consistent-return */
import { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CSSVariables from '../globalCSS/_globalCSS.scss';
import { getDay, getMinutesFromMidnight } from './TimesDates';

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

export const frontDoorQRMenuPageId = 'front-door-qr-menupage';
export const frontDoorInstructions = 'Scan to see the menu';

export const TableStatusStyle = {
    available: { backgroundColor: CSSVariables.tableGreenColor },
    seated: { backgroundColor: CSSVariables.tableOrangeColor },
    ordered: { backgroundColor: CSSVariables.tableRedColor },
    requested: { backgroundColor: CSSVariables.tableRedColor },
    approved: { backgroundColor: CSSVariables.tableOrangeColor },
    served: { backgroundColor: CSSVariables.tableOrangeColor },
    payment: { backgroundColor: CSSVariables.tableRedColor },
};

export const checkQRCodeAvailability = (qrCode) => {
    return qrCode.available;
};

export const checkCategoryAvailability = (category) => {
    if (!category.available) return false;
    const day = getDay();
    if (!category.days.includes(day)) return false;
    const startTime = category.startTime[day];
    const endTime = category.endTime[day];
    const currentTime = getMinutesFromMidnight();
    if (currentTime >= startTime && currentTime <= endTime) return true;
    return false;
};

export const checkDishAvailability = (dish) => {
    return dish.available;
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
export const calculatePriceFromDishes = (dishes, tableOrYour) => {
    let price = 0;
    dishes.forEach((dish) => {
        if (tableOrYour) {
            if (tableOrYour === 'table') {
                price += dish.price;
            } else if (dish.local) {
                price += dish.price;
            }
        } else {
            price += dish.price;
        }
    });
    return parseFloat(price.toFixed(2));
};

/**
 * Calculate percentage payments of all dishes
 *
 * @param {*} dishes all the dishes for which the total price needs to be added
 * @param {*} payment payment of the restaurant
 */
export const calculatePriceFromDishesWithPayment = (dishes, payment, tableOrYour) => {
    const dishesPrices = calculatePriceFromDishes(dishes, tableOrYour);
    let finalPrice = 0;
    if (payment.percentage) {
        finalPrice += dishesPrices * (payment.value / 100);
    } else {
        finalPrice += payment.value;
    }
    return parseFloat(finalPrice.toFixed(2));
};

/**
 * Calculate prices of all dishes by adding them and also add the tax at the end
 *
 * @param {*} dishes all the dishes for which the total price needs to be added
 * @param {*} payments payments of the restaurant
 * @param {*} tip tip
 */
export const calculatePriceFromDishesWithPayments = (dishes, payments, tip, tableOrYour) => {
    const dishesPrices = calculatePriceFromDishes(dishes, tableOrYour);
    let finalPrices = dishesPrices;
    payments.forEach((payment) => {
        if (payment.id !== 'tips') {
            if (tableOrYour === 'your' && payment.percentage) {
                finalPrices += calculatePriceFromDishesWithPayment(dishes, payment, tableOrYour);
            } else if (tableOrYour === 'table') {
                finalPrices += calculatePriceFromDishesWithPayment(dishes, payment, tableOrYour);
            }
        }
    });
    if (tableOrYour && tableOrYour === 'table' && tip && tip > 0) {
        finalPrices += parseFloat(tip);
    }
    return parseFloat(finalPrices.toFixed(2));
};

/**
 * This function gets price in right format
 *
 * @param {*} price
 */
export const getPrice = (price) => {
    return `$${price.toFixed(2)}`;
};

/**
 * This function is used to show all the extras selected for a dish in cart and in order
 *
 * @param dishExtras
 * @param showSpecialInstructions
 * @return
 */
export const showExtras = (extras, showSpecialInstructions) => {
    let str = '';
    extras.forEach((extra) => {
        if (extra.options.length > 0) {
            if (extra.title !== specialInstructionsId) {
                str += `${extra.title}:\n`;
                extra.options.forEach((option) => {
                    str += `\t-${option.title}: ${getPrice(option.price)}\n`;
                });
            } else if (showSpecialInstructions) {
                str += 'Special Instructions:\n';
                extra.options.forEach((option) => {
                    str += `\t-${option.title}: ${getPrice(option.price)}\n`;
                });
            }
        }
    });

    if (str.length > 2) {
        if (str.endsWith('\n')) return str.substring(0, str.length - 1);
        return str;
    }
    return str;
};

/**
 * This function is called when each dish is pressed.
 *
 * @param {*} dish this is the dish that is passed
 */
export const showDishDetails = (dish) => {
    if (dish.calories && dish.calories > 0) {
        return true;
    }
    if (dish.fats && dish.fats > 0) {
        return true;
    }
    if (dish.protein && dish.protein > 0) {
        return true;
    }
    if (dish.carbs && dish.carbs > 0) {
        return true;
    }

    if (dish.vegetarian && dish.vegetarian !== 'Not Sure') {
        return true;
    }
    if (dish.vegan && dish.vegan !== 'Not Sure') {
        return true;
    }
    if (dish.glutenFree && dish.glutenFree !== 'Not Sure') {
        return true;
    }
    if (dish.kosher && dish.kosher !== 'Not Sure') {
        return true;
    }

    if (dish.description && dish.description.length > 0) {
        return true;
    }

    return false;
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
        image = image.replace('.jpg', '');
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

/**
     * Dummy is added in links with firebasestorage to disable caching.
     * Otherwise images are not updated whenever the page appears.
     */
export const getImageLink = (link) => {
    if (link.startsWith('http')) { return `${link}?dummy=${randomNumber()}`; }
    return link;
};
