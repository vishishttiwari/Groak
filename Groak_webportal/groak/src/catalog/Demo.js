/**
 * This function creates demo items that are added to the backend whenever an account is created.
 * It also contains items that are added as placeholders in text fields.
 */
import { db, getCurrentDateTime } from '../firebase/Firebase';
import { createOrderReference } from '../firebase/FirestoreAPICalls/FirestoreAPICallsOrders';
import { createDishReference } from '../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { createCategoryReference } from '../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';
import { createTableReferenceInTableCollections, createTableReferenceInRestaurantCollections } from '../firebase/FirestoreAPICalls/FirestoreAPICallsTables';
import { OrderStatus } from './Others';

export const DemoRestaurantQRStylePage = {
    pageSize: 'A4',
    qrStyleImage: 'Strawberries',
    font: 'Poiret_One',
    width: 90,
    includeTable: true,
};

export const DemoDishName = 'Tomato Soup';
export const DemoDishPrice = 5.50;
export const DemoDishIngredents = ['Tomatoes', 'Olive oil', 'Butter', 'Onion', 'Garlic', 'Oregano', 'Garlic', 'Flour', 'Sugar', 'Salt', 'Black Pepper'];
export const DemoDishImage = 'https://firebasestorage.googleapis.com/v0/b/finedine-1.appspot.com/o/demo%2FdemoDishImage.jpg?alt=media&token=81e83ffb-4b5a-4f6b-9a77-ad8bc981db15';
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
export const DemoCategoryStartTime = 540;
export const DemoCategoryEndTime = 1320;

export const DemoTableName = 'Demo Table 1';

export const DemoOrderComments = [{ comment: 'Please make Tomato Soup extra spicy', created: getCurrentDateTime() }];
// Once you have placed order for a dish, you cant add comments in the dish, you have to add it in order comments
export const DemoOrderDishes = [{
    comments: { 'Spicy?': DemoDishExtraOptions1.title },
    created: getCurrentDateTime(),
    name: DemoDishName,
    price: DemoDishPrice,
}];
export const DemoOrderRequests = [{
    request: 'Can I please get some water?',
    created: getCurrentDateTime(),
}];

/**
 * This function creates a restaurant reference
 *
 * @param {*} restaurantId id of the restaurant where the demo needs to be added
 */
const createRestaurantReference = (restaurantId) => {
    return db.collection('restaurants').doc(restaurantId);
};

/**
 * This function creates a demo restaurant
 *
 * @param {*} restaurantId id of the restaurant where the demo needs to be added
 * @param {*} restaurantName name of the restaurant to be added
 * @param {*} address address of the restaurant
 */
export const createDemoRestaurant = (restaurantId, restaurantName, address) => {
    const ref = createRestaurantReference(restaurantId);
    return { name: restaurantName, address, qrStylePage: DemoRestaurantQRStylePage, reference: ref, logo: '', type: ['Pizza'] };
};

/**
 * This function creates a demo dish
 *
 * @param {*} restaurantId id of the restaurant where the demo needs to be added
 * @param {*} dishId id of the item to be added
 */
export const createDemoDish = (restaurantId, dishId) => {
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
 * @param {*} categoryId id of the item to be added
 * @param {*} dishId id of the item of dish added to this category
 */
export const createDemoCategory = (restaurantId, categoryId, dishId) => {
    return {
        available: true,
        name: DemoCategoryName,
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        dishes: [createDishReference(restaurantId, dishId)],
        created: getCurrentDateTime(),
        startTime: DemoCategoryStartTime,
        endTime: DemoCategoryEndTime,
        order: 0,
        reference: createCategoryReference(restaurantId, categoryId),
        restaurantReference: createRestaurantReference(restaurantId),
    };
};

/**
 * This function creates demo table
 *
 * @param {*} restaurantId id of the restaurant where the demo needs to be added
 * @param {*} tableId id of the item to be added
 */
export const createDemoTable = (restaurantId, tableId) => {
    return {
        name: DemoTableName,
        created: getCurrentDateTime(),
        restaurantId,
        reference: createTableReferenceInRestaurantCollections(restaurantId, tableId),
        originalReference: createTableReferenceInTableCollections(tableId),
        restaurantReference: createRestaurantReference(restaurantId),
        orderReference: createOrderReference(restaurantId, tableId),
        status: OrderStatus.available,
        x: 0,
        y: 0,
    };
};

/**
 * This function creates demo table
 *
 * @param {*} restaurantId id of the restaurant where the demo needs to be added
 * @param {*} tableId id of the table for which order is placed. This is same as order id
 */
export const createDemoOrder = (restaurantId, tableId) => {
    return {
        comments: DemoOrderComments,
        dishes: DemoOrderDishes,
        requests: DemoOrderRequests,
        items: 0,
        updated: getCurrentDateTime(),
        reference: createTableReferenceInRestaurantCollections(restaurantId, tableId),
        restaurantReference: createRestaurantReference(restaurantId),
        status: OrderStatus.available,
        table: DemoTableName,
        tableReference: createTableReferenceInTableCollections(tableId),
    };
};
