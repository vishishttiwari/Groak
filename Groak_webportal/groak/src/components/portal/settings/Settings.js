/**
 * This component is used for the settings page.
 */
import React, { useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import RestaurantSettings from './RestaurantSettings';

import Heading from '../../ui/heading/Heading';
import Spinner from '../../ui/spinner/Spinner';
import { context } from '../../../globalState/globalState';

import './css/Settings.css';
import AccountSettings from './AccountSettings';

function localReducer(state, action) {
    let updatedRestaurant;
    let updatedPayments;
    let updatedPayment;
    let updatedPaymentMethods;
    switch (action.type) {
        case 'setName':
            updatedRestaurant = { ...state.restaurant, name: action.name };
            return { ...state, restaurant: updatedRestaurant };
        case 'setType':
            updatedRestaurant = { ...state.restaurant, type: action.cuisineType };
            return { ...state, restaurant: updatedRestaurant };
        case 'setTips':
            updatedPayments = state.restaurant.payments.filter((payment) => {
                if (payment.id === 'tips') {
                    updatedPayment = { ...payment };
                    updatedPayment.values[action.index] = parseFloat(action.value);
                    return updatedPayment;
                }
                return payment;
            });
            updatedRestaurant = { ...state.restaurant, payments: updatedPayments };
            return { ...state, restaurant: updatedRestaurant };
        case 'addPayment':
            updatedPayments = [...state.restaurant.payments];
            updatedPayments.push({ id: uuidv4(), title: '', percentage: true, value: 0 });
            updatedRestaurant = { ...state.restaurant, payments: updatedPayments };
            return { ...state, restaurant: updatedRestaurant };
        case 'setPaymentTitle':
            updatedPayments = [...state.restaurant.payments];
            updatedPayments[action.index].title = action.title;
            updatedRestaurant = { ...state.restaurant, payments: updatedPayments };
            return { ...state, restaurant: updatedRestaurant };
        case 'setPaymentPercentage':
            updatedPayments = [...state.restaurant.payments];
            updatedPayments[action.index].percentage = action.percentage === 'true';
            updatedRestaurant = { ...state.restaurant, payments: updatedPayments };
            return { ...state, restaurant: updatedRestaurant };
        case 'setPaymentValue':
            updatedPayments = [...state.restaurant.payments];
            updatedPayments[action.index].value = parseFloat(action.value);
            updatedRestaurant = { ...state.restaurant, payments: updatedPayments };
            return { ...state, restaurant: updatedRestaurant };
        case 'deletePayment':
            updatedPayments = [...state.restaurant.payments];
            updatedPayments.splice(action.index, 1);
            updatedRestaurant = { ...state.restaurant, payments: updatedPayments };
            return { ...state, restaurant: updatedRestaurant };
        case 'setVenmo':
            updatedPaymentMethods = { ...state.restaurant.paymentMethods, venmo: action.venmo };
            updatedRestaurant = { ...state.restaurant, paymentMethods: updatedPaymentMethods };
            return { ...state, restaurant: updatedRestaurant };
        case 'setCovidMessage':
            updatedRestaurant = { ...state.restaurant, covidMessage: action.covidMessage };
            return { ...state, restaurant: updatedRestaurant };
        case 'setCovidGuidelines':
            updatedRestaurant = { ...state.restaurant, covidGuidelines: action.covidGuidelines };
            return { ...state, restaurant: updatedRestaurant };
        case 'setAllowOrdering':
            updatedRestaurant = { ...state.restaurant, allowOrdering: { restaurant: action.allowOrdering, groak: state.restaurant.allowOrdering.groak } };
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
