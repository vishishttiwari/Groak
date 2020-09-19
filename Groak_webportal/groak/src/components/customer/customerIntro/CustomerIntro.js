/* eslint-disable no-nested-ternary */
/**
 * This class is used to represent the intro screen including tab bars
 */
import React, { useReducer, useContext, useEffect, createRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { context } from '../../../globalState/globalState';

import CustomerTabBarWithOrdering from '../ui/tabBar/CustomerTabBarWithOrdering';
import CustomerTabBarWithoutOrdering from '../ui/tabBar/CustomerTabBarWithoutOrdering';
import CustomerNotFound from '../ui/notFound/CustomerNotFound';
import Menu from '../menu/Menu';
import Cart from '../cart/Cart';
import Order from '../order/Order';
import Covid from '../covid/Covid';
import { fetchCategoriesAPI, unsubscribeFetchOrderAPI } from './CustomerIntroAPICalls';
import Spinner from '../../ui/spinner/Spinner';
import { frontDoorQRMenuPageId, groakTesting } from '../../../catalog/Others';
import { RestaurantNotFound, CategoriesNotFound } from '../../../catalog/Comments';
import CustomerRequestButton from '../ui/requestButton/CustomerRequestButton';
import { timeoutValueForCustomer } from '../../../catalog/TimesDates';
import { deleteAllLocalStorageAfter6Hours } from '../../../catalog/LocalStorage';
import { analytics } from '../../../firebase/FirebaseLibrary';

const initialState = { menuItems: new Map(), categoryNames: [], restaurant: {}, order: {}, updated: true, loadingSpinner: true, restaurantNotFound: false, categoriesNotFound: false, startTime: 0, endTime: 1439 };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchMenuItems':
            return { ...state, menuItems: action.menuItems, categoryNames: action.categoryNames, restaurant: action.restaurant, order: action.order, loadingSpinner: false, restaurantNotFound: false, categoriesNotFound: false };
        case 'fetchOrder':
            return { ...state, order: action.order };
        case 'updated':
            return { ...state, updated: !state.updated };
        case 'restaurantNotFound':
            return { ...state, restaurantNotFound: true, loadingSpinner: false };
        case 'categoriesNotFound':
            return { ...state, categoriesNotFound: true, loadingSpinner: false, startTime: action.startTime, endTime: action.endTime };
        default:
            return initialState;
    }
}

const CustomerIntro = (props) => {
    const { history, match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState, setGlobalState } = useContext(context);
    const top = createRef(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        top.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
        });
    }, [top]);

    useEffect(() => {
        if (groakTesting) {
            analytics.logEvent('code_scanned_web_testing', { restaurantId: match.params.restaurantid, tableId: match.params.tableid, qrCodeId: match.params.qrcodeid });
        } else {
            analytics.logEvent('code_scanned_web', { restaurantId: match.params.restaurantid, tableId: match.params.tableid, qrCodeId: match.params.qrcodeid });
        }

        async function fetchCategoriesAndRestaurant() {
            await fetchCategoriesAPI(match.params.restaurantid, match.params.tableid, match.params.qrcodeid, match.params.tableid === frontDoorQRMenuPageId, setState, setGlobalState, enqueueSnackbar);
        }
        fetchCategoriesAndRestaurant();

        setTimeout(() => {
            history.replace('/');
        }, timeoutValueForCustomer);

        deleteAllLocalStorageAfter6Hours(match.params.restaurantid);

        return () => {
            unsubscribeFetchOrderAPI(enqueueSnackbar);
        };
    }, [enqueueSnackbar, history, match.params.restaurantid, match.params.tableid, match.params.qrcodeid, setGlobalState]);

    /**
     * Used for showing which component will be showin in each tab
     */
    const getTabPanel = () => {
        if (globalState) {
            if (globalState.orderAllowedCustomer) {
                if (globalState.tabValueCustomer === 0) {
                    return <Menu menuItems={state.menuItems} categoryNames={state.categoryNames} restaurant={state.restaurant} />;
                } if (globalState.tabValueCustomer === 1) {
                    return <Cart setState={setState} />;
                } if (globalState.tabValueCustomer === 2) {
                    return <Order order={state.order} />;
                } if (globalState.tabValueCustomer === 3) {
                    return <Covid restaurant={state.restaurant} />;
                }
                return null;
            }
            if (globalState.tabValueCustomer === 0) {
                return <Menu menuItems={state.menuItems} categoryNames={state.categoryNames} restaurant={state.restaurant} />;
            } if (globalState.tabValueCustomer === 1) {
                return <Covid restaurant={state.restaurant} />;
            }
            return null;
        }
        return null;
    };

    /**
     * This function converts minutes into AM/PM time format
     *
     * @param {*} minutes to be converted
     */
    const getTimeInAMPMFromMinutesComplete = (minutes) => {
        let hour = Math.floor(minutes / 60).toFixed(0);
        const minute = (minutes % 60).toFixed(0);
        const PM = hour > 11;
        if (parseFloat(hour) === 0) {
            hour = 12;
        } else { hour -= hour > 12 ? 12 : 0; }
        return `${hour < 10 ? '0' : ''}${hour.toString()}:${minute < 10 ? '0' : ''}${minute.toString()}${PM ? 'PM' : 'AM'}`;
    };

    return (
        <div className="customer intro">
            <p ref={top}> </p>
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <>
                    {state.restaurantNotFound || state.categoriesNotFound ? (
                        <>
                            {state.restaurantNotFound
                                ? <CustomerNotFound text={RestaurantNotFound} />
                                : <CustomerNotFound text={CategoriesNotFound(getTimeInAMPMFromMinutesComplete(state.startTime), getTimeInAMPMFromMinutesComplete(state.endTime), state.startTime, state.endTime)} />}
                        </>
                    ) : (
                        <>
                            {getTabPanel()}
                            {globalState ? (
                                <>
                                    {globalState.orderAllowedCustomer ? (
                                        <>
                                            <CustomerRequestButton restaurantId={match.params.restaurantid} tableId={match.params.tableid} visible={state && state.order && state.order.newRequestForUser} />
                                            <CustomerTabBarWithOrdering restaurantId={match.params.restaurantid} visible={state && state.order && state.order.newOrderUpdateForUser} />
                                        </>
                                    )
                                        : globalState.covidInformationCustomer
                                            ? <CustomerTabBarWithoutOrdering />
                                            : null}
                                </>

                            ) : null}
                        </>
                    )}
                </>
            ) : null}
        </div>
    );
};

CustomerIntro.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(CustomerIntro));
