import React, { useReducer, useContext, useEffect, createRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { context } from '../../../globalState/globalState';

import CustomerTabBar from '../ui/tabBar/CustomerTabBar';
import CustomerNotFound from '../ui/notFound/CustomerNotFound';
import Menu from '../menu/Menu';
import Cart from '../cart/Cart';
import Order from '../order/Order';
import Covid from '../covid/Covid';
import { fetchCategoriesAPI, unsubscribeFetchOrderAPI } from './CustomerIntroAPICalls';
import Spinner from '../../ui/spinner/Spinner';
import { frontDoorQRMenuPageId } from '../../../catalog/Others';
import { RestaurantNotFound, CategoriesNotFound } from '../../../catalog/Comments';
import CustomerRequestButton from '../ui/requestButton/CustomerRequestButton';
import { timeoutValueForCustomer } from '../../../catalog/TimesDates';
import { deleteAllLocalStorageAfter6Hours } from '../../../catalog/LocalStorage';
import { analytics } from '../../../firebase/FirebaseLibrary';

const initialState = { menuItems: new Map(), categoryNames: [], restaurant: {}, order: {}, updated: true, loadingSpinner: true, restaurantNotFound: false, categoriesNotFound: false };

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
            return { ...state, categoriesNotFound: true, loadingSpinner: false };
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
        analytics.logEvent('code_scanned_web', { restaurantId: match.params.restaurantid, tableId: match.params.tableid, qrCodeId: match.params.qrcodeid });

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

    const getTabPanel = () => {
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
                                : <CustomerNotFound text={CategoriesNotFound} />}
                        </>
                    ) : (
                        <>
                            {getTabPanel()}
                            {globalState && globalState.orderAllowedCustomer ? (
                                <>
                                    <CustomerRequestButton restaurantId={match.params.restaurantid} tableId={match.params.tableid} visible={state && state.order && state.order.newRequestForUser} />
                                    <CustomerTabBar restaurantId={match.params.restaurantid} visible={state && state.order && state.order.newOrderUpdateForUser} />
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
