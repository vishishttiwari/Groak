/* eslint-disable import/no-unresolved */
import React, { useEffect, useReducer, createRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { AppBar, Tabs, Tab, Box } from '@material-ui/core';
import './css/Menu.css';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { context } from '../../../globalState/globalStateCustomer';

import MenuDish from './MenuDish';
import { fetchCategoriesAPI } from './MenuAPICalls';
import Spinner from '../../ui/spinner/Spinner';
import { randomNumber, frontDoorQRMenuPageId } from '../../../catalog/Others';
import { RestaurantNotFound, MenuNotFound, ImageSubjectToChange } from '../../../catalog/Comments';
import MenuHeader from './MenuHeader';
import CustomerNotFound from '../ui/customerNotFound/CustomerNotFound';

const initialState = { menuItems: new Map(), categoryNames: [], restaurant: {}, loadingSpinner: true, tabValue: 0, restaurantNotFound: false, categoriesNotFound: false };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchMenuItems':
            return { ...state, menuItems: action.menuItems, categoryNames: action.categoryNames, restaurant: action.restaurant, loadingSpinner: false, restaurantNotFound: false, categoriesNotFound: false, tabValue: 0 };
        case 'changeTabValue':
            if (action.tabValue !== state.tabValue) {
                return { ...state, tabValue: action.tabValue };
            }
            return { ...state };
        case 'restaurantNotFound':
            return { ...state, restaurantNotFound: true, loadingSpinner: false };
        case 'categoriesNotFound':
            return { ...state, categoriesNotFound: true, loadingSpinner: false };
        default:
            return initialState;
    }
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node.isRequired,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const Menu = (props) => {
    const { history, match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { setGlobalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();
    const top = createRef(null);

    /**
     * This function is called when each dish is pressed.
     *
     * @param {*} dish this is the dish that is passed
     */
    function menuDishHandler(dish) {
        let showDish = false;

        if (dish.calories && dish.calories > 0) {
            showDish = true;
        }
        if (dish.fats && dish.fats > 0) {
            showDish = true;
        }
        if (dish.protein && dish.protein > 0) {
            showDish = true;
        }
        if (dish.carbs && dish.carbs > 0) {
            showDish = true;
        }

        if (dish.vegetarian && dish.vegetarian !== 'Not Sure') {
            showDish = true;
        }
        if (dish.vegan && dish.vegan !== 'Not Sure') {
            showDish = true;
        }
        if (dish.glutenFree && dish.glutenFree !== 'Not Sure') {
            showDish = true;
        }
        if (dish.kosher && dish.kosher !== 'Not Sure') {
            showDish = true;
        }

        if (dish.description && dish.description.length > 0) {
            showDish = true;
        }

        if (showDish) {
            history.push(`/customer/dish/${match.params.restaurantid}/${dish.id}`);
        } else {
            history.push(`/customer/addtocart/${match.params.restaurantid}/${dish.id}`);
        }
    }

    useEffect(() => {
        top.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
        });
        async function fetchDishes() {
            await fetchCategoriesAPI(match.params.restaurantid, match.params.qrcodeid, match.params.tableid === frontDoorQRMenuPageId, setState, setGlobalState, enqueueSnackbar);
        }
        fetchDishes();
    }, [enqueueSnackbar]);

    return (
        <div className="menu">
            <p ref={top}> </p>
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <>
                    {state.restaurantNotFound || state.categoriesNotFound ? (
                        <CustomerNotFound text={state.restaurantNotFound ? RestaurantNotFound : MenuNotFound} />
                    ) : (
                        <>
                            <MenuHeader restaurantName={state.restaurant.name} />
                            <div className="content">
                                {state.restaurant.logo ? <img className="menu-restaurant-logo" src={state.restaurant.logo} alt={state.restaurant.name} /> : null }
                                <AppBar className="menu-appbar" position="static" color="secondary">
                                    <Tabs
                                        value={state.tabValue}
                                        onChange={(event, newValue) => { setState({ type: 'changeTabValue', tabValue: newValue }); }}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        variant="scrollable"
                                        scrollButtons="on"
                                        aria-label="scrollable force tabs example"
                                    >
                                        {Array.from(state.categoryNames).map((categoryName, index) => {
                                            return (
                                                <Tab
                                                    style={{ paddingLeft: '30px', paddingRight: '30px' }}
                                                    key={randomNumber()}
                                                    label={categoryName}
                                                    {...a11yProps(index)}
                                                />
                                            );
                                        })}
                                    </Tabs>
                                </AppBar>
                                {Array.from(state.menuItems.keys()).map((menuItem, index) => {
                                    return (
                                        <TabPanel key={randomNumber()} value={state.tabValue} index={index}>
                                            <div className="menu-items">
                                                {state.menuItems.get(menuItem).map((dish) => {
                                                    return (
                                                        <MenuDish
                                                            key={randomNumber()}
                                                            dishItem={dish}
                                                            clickHandler={() => { menuDishHandler(dish); }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </TabPanel>
                                    );
                                })}
                                <div className="image-change">
                                    <ErrorOutlineIcon style={{ marginRight: '5px', marginLeft: '5px' }} />
                                    <p>
                                        {ImageSubjectToChange}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </>
            ) : null}
        </div>
    );
};

Menu.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(Menu));
