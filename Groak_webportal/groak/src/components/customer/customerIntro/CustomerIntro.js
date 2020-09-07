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
import { fetchCategoriesAPI, fetchOrderAPI, unsubscribeFetchOrderAPI, updateOrderAPI } from './CustomerIntroAPICalls';
import Spinner from '../../ui/spinner/Spinner';
import { frontDoorQRMenuPageId, TableStatus } from '../../../catalog/Others';
import { RestaurantNotFound, CategoriesNotFound } from '../../../catalog/Comments';
import CustomerRequestButton from '../ui/requestButton/CustomerRequestButton';

const initialState = { menuItems: new Map(), categoryNames: [], restaurant: {}, order: {}, tabValue: 0, updated: true, loadingSpinner: true, restaurantNotFound: false, categoriesNotFound: false };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchMenuItems':
            return { ...state, menuItems: action.menuItems, categoryNames: action.categoryNames, restaurant: action.restaurant, loadingSpinner: false, restaurantNotFound: false, categoriesNotFound: false };
        case 'fetchOrder':
            return { ...state, order: action.order };
        case 'changeTabValue':
            if (action.tabValue !== state.tabValue) {
                return { ...state, tabValue: action.tabValue };
            }
            return { ...state };
        case 'updated':
            return { ...state, updated: !state.updated };
        case 'updatedCart':
            return { ...state, updated: !state.updated, tabValue: 0 };
        case 'restaurantNotFound':
            return { ...state, restaurantNotFound: true, loadingSpinner: false };
        case 'categoriesNotFound':
            return { ...state, categoriesNotFound: true, loadingSpinner: false };
        default:
            return initialState;
    }
}

const CustomerIntro = (props) => {
    const { match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { setGlobalState } = useContext(context);
    const top = createRef(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        top.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
        });

        async function fetchCategoriesAndRestaurant() {
            await fetchCategoriesAPI(match.params.restaurantid, match.params.qrcodeid, match.params.tableid === frontDoorQRMenuPageId, setState, setGlobalState, enqueueSnackbar);
        }
        async function fetchOrder() {
            await fetchOrderAPI(match.params.restaurantid, match.params.tableid, setState, enqueueSnackbar);
        }
        async function updateOrder() {
            await updateOrderAPI(match.params.restaurantid, match.params.tableid, TableStatus.seated, enqueueSnackbar);
        }
        fetchCategoriesAndRestaurant();
        fetchOrder();
        updateOrder();

        return () => {
            unsubscribeFetchOrderAPI(enqueueSnackbar);
        };
    }, []);

    const getTabPanel = () => {
        if (state.tabValue === 0) {
            return <Menu menuItems={state.menuItems} categoryNames={state.categoryNames} restaurant={state.restaurant} />;
        } if (state.tabValue === 1) {
            return <Cart setState={setState} />;
        } if (state.tabValue === 2) {
            return <Order order={state.order} />;
        } if (state.tabValue === 3) {
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
                            <CustomerRequestButton restaurantId={match.params.restaurantid} tableId={match.params.tableid} />
                            <CustomerTabBar restaurantId={match.params.restaurantid} value={state.tabValue} setState={setState} />
                        </>
                    )}
                </>
            ) : null}
        </div>
    );
};

CustomerIntro.propTypes = {
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(CustomerIntro));
