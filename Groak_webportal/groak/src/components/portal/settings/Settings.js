/**
 * This component is used for the settings page.
 */
import React, { useContext, useReducer } from 'react';
import RestaurantSettings from './RestaurantSettings';

import Heading from '../../ui/heading/Heading';
import Spinner from '../../ui/spinner/Spinner';
import { context } from '../../../globalState/globalState';

import './css/Settings.css';
import AccountSettings from './AccountSettings';

function localReducer(state, action) {
    let updatedRestaurant;
    switch (action.type) {
        case 'setName':
            updatedRestaurant = { ...state.restaurant, name: action.name };
            return { ...state, restaurant: updatedRestaurant };
        case 'setType':
            updatedRestaurant = { ...state.restaurant, type: action.cuisineType };
            return { ...state, restaurant: updatedRestaurant };
        case 'setCovidMessage':
            updatedRestaurant = { ...state.restaurant, covidMessage: action.covidMessage };
            return { ...state, restaurant: updatedRestaurant };
        case 'setLogo':
            return { ...state, logo: action.logo };
        case 'setImage':
            return { ...state, image: action.image };
        case 'setEmail':
            return { ...state, email: action.email };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        default:
            return state;
    }
}

const Settings = () => {
    const { globalState } = useContext(context);
    const [state, setState] = useReducer(localReducer, { restaurant: globalState.restaurantPortal, logo: { file: null, link: globalState.restaurantPortal.logo }, image: { file: null, link: globalState.restaurantPortal.image }, email: globalState.emailPortal, loadingSpinner: false });

    return (
        <div className="settings">
            <Heading heading="Settings" />
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <form>
                    <RestaurantSettings state={state} setState={setState} />
                    <AccountSettings />
                </form>
            ) : null}
        </div>
    );
};

export default React.memo(Settings);
