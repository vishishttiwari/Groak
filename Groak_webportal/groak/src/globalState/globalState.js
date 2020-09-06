import { createContext } from 'react';

const initialState = {
    userPortal: false,
    restaurantIdPortal: '',
    emailPortal: '',
    restaurantPortal: null,

    restaurantIdCustomer: '',
    restaurantCustomer: null,
};

function reducerLocal(state, action) {
    let updatedRestaurant;
    switch (action.type) {
        case 'fetchUserPortal':
            return { ...state, userPortal: action.user, restaurantIdPortal: action.restaurantId, emailPortal: action.email, restaurantPortal: action.restaurant };
        case 'setRestaurantPortal':
            return { ...state, restaurantPortal: action.restaurant, restaurantIdPortal: action.restaurantId };
        case 'setRestaurantCustomer':
            return { ...state, restaurantCustomer: action.restaurant, restaurantIdCustomer: action.restaurantId };
        case 'setQRStylePagePortal':
            updatedRestaurant = { ...state.restaurant, qrStylePage: action.qrStylePage };
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
