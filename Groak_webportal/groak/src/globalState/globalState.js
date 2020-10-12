import { createContext } from 'react';

const initialState = {
    userPortal: false,
    restaurantIdPortal: '',
    emailPortal: '',
    restaurantPortal: null,
    registrationTokenPortal: '',

    scannedCustomer: false,
    tabValueCustomer: 0,
    restaurantIdCustomer: '',
    restaurantCustomer: null,
    orderAllowedCustomer: false,
    ratingAllowedCustomer: false,
    covidInformationCustomer: false,
};

function reducerLocal(state, action) {
    let updatedRestaurant;
    let updatedCovidInformation;
    let updatedRatingInformation = false;
    switch (action.type) {
        case 'fetchUserPortal':
            return { ...state, userPortal: action.user, restaurantIdPortal: action.restaurantId, emailPortal: action.email, restaurantPortal: action.restaurant };
        case 'setRestaurantPortal':
            return { ...state, restaurantPortal: action.restaurant, restaurantIdPortal: action.restaurantId };
        case 'setRegistrationTokenPortal':
            return { ...state, registrationTokenPortal: action.registrationToken };
        case 'setRestaurantCustomer':
            updatedCovidInformation = ((action.restaurant.covidMessage && action.restaurant.covidMessage.length > 0) || (action.restaurant.covidGuidelines && action.restaurant.covidGuidelines.length > 0));
            if (action.restaurant.allowRating) {
                if (action.restaurant.allowRating.restaurant && action.restaurant.allowRating.groak) {
                    updatedRatingInformation = true;
                }
            }
            return { ...state, restaurantCustomer: action.restaurant, restaurantIdCustomer: action.restaurantId, orderAllowedCustomer: action.orderAllowed, ratingAllowedCustomer: updatedRatingInformation, scannedCustomer: true, covidInformationCustomer: updatedCovidInformation };
        case 'setTabValueCustomer':
            if (action.tabValue !== state.tabValueCustomer) {
                return { ...state, tabValueCustomer: action.tabValue };
            }
            return { ...state };
        case 'setOrderAllowedCustomer':
            return { ...state, orderAllowedCustomer: action.orderAllowed };
        case 'setQRStylePagePortal':
            updatedRestaurant = { ...state.restaurantPortal, qrStylePage: action.qrStylePage };
            return { ...state, restaurantPortal: updatedRestaurant };
        case 'removeUserPortal':
            return { ...state, userPortal: null, restaurantIdPortal: '', emailPortal: '', restaurantPortal: null };
        default:
            return initialState;
    }
}

const StateContext = createContext({
    state: initialState,
    dispatch: () => { return 0; },
});

export const { Provider } = StateContext; // To pass down state and dispatcher

export const reducer = reducerLocal; // We can use it in the main file with useReducer

export const context = StateContext; // useContext

export const defaultState = initialState; // useContext
