/**
 * This function creates demo items that are added to the backend whenever an account is created.
 * It also contains items that are added as placeholders in text fields.
 */
import { getCurrentDateTime, createGeoPoint } from '../firebase/FirebaseLibrary';
import { createOrderReference } from '../firebase/FirestoreAPICalls/FirestoreAPICallsOrders';
import { createDishReference } from '../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { createCategoryReference } from '../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';
import { createTableReferenceInTableCollections, createTableReferenceInRestaurantCollections } from '../firebase/FirestoreAPICalls/FirestoreAPICallsTables';
import { createRequestReference } from '../firebase/FirestoreAPICalls/FirestoreAPICallsRequests';
import { TableStatus } from './Others';
import { getCurrentDateTimePlusMinutes } from './TimesDates';
import { createRestaurantReference } from '../firebase/FirestoreAPICalls/FirestoreAPICallsRestaurants';
import { createQRCodeReference } from '../firebase/FirestoreAPICalls/FirestoreAPICallsQRCodes';

export const DemoRestaurantType = ['Pizza'];
export const DemoRestaurantSalesTax = 9;
export const DemoRestaurantQRStylePage = {
    format: 'Format 1',
    pageSize: 'A4',
    pageBackgroundColor: '#ffffff',
    qrStyleImage: 'Fruits',
    font: 'Poiret_One',
    textColor: '#000000',
    logoWidth: 90,
    includeTable: true,
    restaurantImageWidth: 50,
    restaurantImageHeight: 100,
    restaurantImageBackgroundColor: '#808080',
};

export const DemoRestaurantCovidGuidelines = '';
export const DemoRestaurantCovidMessage = 'We are using Groak to minimize your interaction with waiters and to avoid cross-contamination through menus';

export const DemoDishName = 'Tomato Soup';
export const DemoDishPrice = 5.50;
export const DemoDishIngredents = ['Tomatoes', 'Olive oil', 'Butter', 'Onion', 'Garlic', 'Oregano', 'Garlic', 'Flour', 'Sugar', 'Salt', 'Black Pepper'];
export const DemoDishImage = 'https://firebasestorage.googleapis.com/v0/b/groak-1.appspot.com/o/demo%2FdemoDishImage.jpg?alt=media&token=bc1c8787-1e39-4568-8360-41f9b5d724db';
export const DemoDishDescription = 'Tomato soup is a soup made with tomatoes as the primary ingredient. It may be served hot or cold in a bowl, and may be made in a variety of ways. It may be smooth in texture, and there are also recipes which include chunks of tomato, cream and chicken or vegetable stock. Popular toppings for tomato soup include sour cream or croutons. In the United States, the soup is frequently served with crackers, which may be crumbled onto the soup by the diner, and a grilled cheese sandwich. Tomato soup is one of the top comfort foods in Poland and the United States. It can be made fresh by blanching tomatoes, removing the skins, then blending them into a puree.';
export const DemoDishShortInfo = 'Rich and fragmant tomato soup, flavored with loads of garlic, oregano and gresh garlic.';
export const DemoDishCalories = 30;
export const DemoDishCarbs = 7;
export const DemoDishFats = 0.3;
export const DemoDishProtein = 0.8;
export const DemoDishExtraTitle = 'Spicy?';
export const DemoDishExtraOptions1 = { price: 1, title: 'Hot' };
export const DemoDishExtraOptions2 = { price: 0.5, title: 'Medium' };
export const DemoDishExtraOptions3 = { price: 0, title: 'Mild' };

export const DemoCategoryName = 'Starters';
export const DemoCategoryStartTime = 0;
export const DemoCategoryEndTime = 1439;

export const DemoTableName = 'Demo Table 1';

export const DemoQRCodeName = 'Dish Menu';

export const DemoOrderComments = [{ comment: 'Please make Tomato Soup extra spicy', created: getCurrentDateTime() }];
// Once you have placed order for a dish, you cant add comments in the dish, you have to add it in order comments
export const createDemoOrderDishes = (restaurantId, dishId) => {
    return [{
        extras: [{ title: DemoDishExtraTitle, options: [DemoDishExtraOptions1] }],
        created: getCurrentDateTime(),
        name: DemoDishName,
        price: DemoDishPrice,
        quantity: 1,
        reference: createDishReference(restaurantId, dishId),
    }];
};

export const DemoRequest = [{
    request: 'Welcome. Is there anything we can help you with?',
    created: getCurrentDateTime(),
    createdByUser: false,
}];

/**
 * This function creates a demo restaurant
 *
 * @param {*} restaurantId id of the restaurant where the demo needs to be added
 * @param {*} restaurantName name of the restaurant to be added
 * @param {*} address address of the restaurant
 * @param {*} qrCodeId demo qrcode id
 */
export const createDemoRestaurant = (restaurantId, restaurantName, address, qrCodeId, dishId, categoryId) => {
    const ref = createRestaurantReference(restaurantId);
    return {
        name: restaurantName,
        address,
        qrStylePage: DemoRestaurantQRStylePage,
        reference: ref,
        logo: '',
        image: '',
        type: DemoRestaurantType,
        salesTax: DemoRestaurantSalesTax,
        covidGuidelines: DemoRestaurantCovidGuidelines,
        covidMessage: DemoRestaurantCovidMessage,
        qrCodes: [createQRCodeReference(restaurantId, qrCodeId)],
        dishes: [createDishReference(restaurantId, dishId)],
        categories: [createCategoryReference(restaurantId, categoryId)],
        location: createGeoPoint(address.latitude, address.longitude),
    };
};

/**
 * This function creates a demo dish
 *
 * @param {*} restaurantId id of the restaurant where the demo needs to be added
 * @param {*} restaurantName name of the restaurant to be added
 * @param {*} dishId id of the item to be added
 */
export const createDemoDish = (restaurantId, restaurantName, dishId) => {
    return {
        available: true,
        created: getCurrentDateTime(),
        description: DemoDishDescription,
        image: DemoDishImage,
        ingredients: DemoDishIngredents,
        name: DemoDishName,
        nutrition: {
            calories: DemoDishCalories,
            carbs: DemoDishCarbs,
            fats: DemoDishFats,
            protein: DemoDishProtein,
        },
        restrictions: {
            glutenFree: 'Yes',
            kosher: 'Yes',
            vegan: 'Yes',
            vegetarian: 'Yes',
        },
        price: DemoDishPrice,
        reference: createDishReference(restaurantId, dishId),
        restaurantReference: createRestaurantReference(restaurantId),
        restaurantName,
        shortInfo: DemoDishShortInfo,
        extras: [{
            title: DemoDishExtraTitle,
            multipleSelections: false,
            minOptionsSelect: 0,
            maxOptionsSelect: 0,
            options: [{
                price: DemoDishExtraOptions1.price,
                title: DemoDishExtraOptions1.title,
            }, {
                price: DemoDishExtraOptions2.price,
                title: DemoDishExtraOptions2.title,
            }, {
                price: DemoDishExtraOptions3.price,
                title: DemoDishExtraOptions3.title,
            }],
        }],
    };
};

/**
 * This function creates a demo category
 *
 * @param {*} restaurantId id of the restaurant where the demo needs to be added
 * @param {*} restaurantName name of the restaurant to be added
 * @param {*} categoryId id of the item to be added
 * @param {*} dishId id of the item of dish added to this category
 */
export const createDemoCategory = (restaurantId, restaurantName, categoryId, dishId) => {
    return {
        available: true,
        name: DemoCategoryName,
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        dishes: [createDishReference(restaurantId, dishId)],
        created: getCurrentDateTime(),
        startTime: {
            sunday: DemoCategoryStartTime,
            monday: DemoCategoryStartTime,
            tuesday: DemoCategoryStartTime,
            wednesday: DemoCategoryStartTime,
            thursday: DemoCategoryStartTime,
            friday: DemoCategoryStartTime,
            saturday: DemoCategoryStartTime,
        },
        endTime: {
            sunday: DemoCategoryEndTime,
            monday: DemoCategoryEndTime,
            tuesday: DemoCategoryEndTime,
            wednesday: DemoCategoryEndTime,
            thursday: DemoCategoryEndTime,
            friday: DemoCategoryEndTime,
            saturday: DemoCategoryEndTime,
        },
        reference: createCategoryReference(restaurantId, categoryId),
        restaurantReference: createRestaurantReference(restaurantId),
        restaurantName,
    };
};

/**
 * This function creates demo table
 *
 * @param {*} restaurantId id of the restaurant where the demo needs to be added
 * @param {*} restaurantName name of the restaurant to be added
 * @param {*} tableId id of the item to be added
 */
export const createDemoTable = (restaurantId, restaurantName, tableId, qrCodeId) => {
    // Whenever you change anything here, also change it in FirestoreAPICallsTables in addTableFirestoreAPI
    return {
        name: DemoTableName,
        created: getCurrentDateTime(),
        restaurantId,
        id: tableId,
        reference: createTableReferenceInRestaurantCollections(restaurantId, tableId),
        originalReference: createTableReferenceInTableCollections(tableId),
        restaurantReference: createRestaurantReference(restaurantId),
        orderReference: createOrderReference(restaurantId, tableId),
        requestReference: createRequestReference(restaurantId, tableId),
        restaurantName,
        status: TableStatus.ordered,
        newRequest: false,
        serveTime: getCurrentDateTimePlusMinutes(30),
        x: 0,
        y: 0,
        qrCodes: [createQRCodeReference(restaurantId, qrCodeId)],
    };
};

/**
 * This function creates demo table
 *
 * @param {*} restaurantId id of the restaurant where the demo needs to be added
 * @param {*} restaurantName name of the restaurant to be added
 * @param {*} orderId id of the table for which order is placed. This is same as order id
 * @param {*} dishId id of the dish which is placed in the order
 */
export const createDemoOrder = (restaurantId, restaurantName, orderId, dishId) => {
    // Whenever you change anything here, also change it in FirestoreAPICallsTables in addTableFirestoreAPI
    return {
        comments: DemoOrderComments,
        dishes: createDemoOrderDishes(restaurantId, dishId),
        items: 0,
        updated: getCurrentDateTime(),
        status: TableStatus.ordered,
        serveTime: getCurrentDateTimePlusMinutes(30),
        newRequest: false,
        table: DemoTableName,
        reference: createOrderReference(restaurantId, orderId),
        restaurantReference: createRestaurantReference(restaurantId),
        restaurantName,
        tableReference: createTableReferenceInRestaurantCollections(restaurantId, orderId),
        tableOriginalReference: createTableReferenceInTableCollections(orderId),
        requestReference: createRequestReference(restaurantId, orderId),
    };
};

/**
 * This function creates demo request
 *
 * @param {*} restaurantId id of the restaurant where the demo needs to be added
 * @param {*} restaurantName name of the restaurant to be added
 * @param {*} requestId id of the request for which order is placed. This is same as order id
 */
export const createDemoRequest = (restaurantId, restaurantName, requestId) => {
    // Whenever you change anything here, also change it in FirestoreAPICallsTables in addTableFirestoreAPI
    return {
        reference: createRequestReference(restaurantId, requestId),
        restaurantReference: createRestaurantReference(restaurantId),
        restaurantName,
        requests: DemoRequest,
    };
};

/**
 * This function creates demo qr code
 *
 * @param {*} restaurantId id of the restaurant where the demo needs to be added
 * @param {*} restaurantName name of the restaurant to be added
 * @param {*} qrcodeId id of the qrcode
 * @param {*} caegoryId category id included in the qrcode
 */
export const createDemoQRCode = (restaurantId, restaurantName, qrcodeId, categoryId) => {
    return {
        reference: createQRCodeReference(restaurantId, qrcodeId),
        restaurantReference: createRestaurantReference(restaurantId),
        restaurantName,
        name: DemoQRCodeName,
        available: true,
        categories: [createCategoryReference(restaurantId, categoryId)],
    };
};
