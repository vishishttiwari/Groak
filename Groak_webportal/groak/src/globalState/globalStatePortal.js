import { createContext } from 'react';

const initialState = {
    user: false,
    restaurantId: '',
    email: '',
    restaurant: null,
};

function reducerLocal(state, action) {
    let updatedRestaurant;
    switch (action.type) {
        case 'fetchUser':
            return { ...state, user: action.user, restaurantId: action.restaurantId, email: action.email, restaurant: action.restaurant };
        case 'setRestaurant':
            return { ...state, restaurant: action.restaurant };
        case 'setQRStylePage':
            updatedRestaurant = { ...state.restaurant, qrStylePage: action.qrStylePage };
            return { ...state, restaurant: updatedRestaurant };
        case 'removeUser':
            return { ...state, user: null, restaurantId: '', email: '', restaurant: null };
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
