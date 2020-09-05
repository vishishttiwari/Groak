import { createContext } from 'react';

const initialState = {
    restaurantId: '',
    restaurant: null,
};

function reducerLocal(state, action) {
    switch (action.type) {
        case 'setRestaurant':
            return { ...state, restaurantId: action.restaurantId, restaurant: action.restaurant };
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
