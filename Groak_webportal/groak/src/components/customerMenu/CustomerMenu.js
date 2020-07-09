/* eslint-disable import/no-unresolved */
import React, { useEffect, useReducer, createRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { AppBar, Tabs, Tab, Box } from '@material-ui/core';

import './css/CustomerMenu.css';
import CustomerMenuDish from './CustomerMenuDish';
import { fetchCategoriesAPI } from './CustomerMenuAPICalls';
import Heading from '../ui/heading/Heading';
import Spinner from '../ui/spinner/Spinner';
import { randomNumber } from '../../catalog/Others';
import Empty from '../../assets/others/empty.png';
import Advertisement from '../../assets/others/advertisement_2.png';
import AppleDownload from '../../assets/images/homepage/apple_download_black.png';
import DownArrow from '../../assets/icons/down_arrow.png';

const initialState = { menuItems: new Map(), categoryNames: new Map(), restaurant: {}, loadingSpinner: true, tabValue: 0, error: false };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchMenuItems':
            return { ...state, menuItems: action.menuItems, categoryNames: action.categoryNames, restaurant: action.restaurant, loadingSpinner: false, tabValue: 0 };
        case 'changeTabValue':
            if (action.tabValue !== state.tabValue) {
                return { ...state, tabValue: action.tabValue };
            }
            return { ...state };
        case 'error':
            return { ...state, error: true, loadingSpinner: false };
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

const CustomerMenu = (props) => {
    const { match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { enqueueSnackbar } = useSnackbar();
    const top = createRef(null);

    useEffect(() => {
        top.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
        });
        async function fetchDishes() {
            await fetchCategoriesAPI(match.params.id1, setState, enqueueSnackbar);
        }
        fetchDishes();
    }, [enqueueSnackbar, match.params.id1]);

    return (
        <div className="customerMenu">
            {/* <div className="advertisement">
                <div className="first-part">
                    <img className="advertisement-image" draggable="false" src={Advertisement} alt="GroakAdvertisement" />
                    <div className="first-first-part">
                        <p className="advertisement-text">Smart ordering is now available through our app. Get features such as ordering, special requests and receipt through our app</p>
                        <a className="advertisement-apple-app" href="https://apps.apple.com/in/app/groak-app/id1513988662">
                            <img draggable="false" src={AppleDownload} alt="GroakAdvertisement" />
                        </a>
                    </div>
                </div>
                <div className="second-part">
                    <p className="advertisement-scroll">Scroll down to see the menu</p>
                    <img className="advertisement-down-arrow" draggable="false" src={DownArrow} alt="DownArrow" />
                </div>
            </div> */}
            <p ref={top}> </p>
            {state.restaurant.logo ? <img className="customerMenu-restaurantLogo" src={state.restaurant.logo} alt={state.restaurant.name} /> : <Heading heading={state.error ? '' : state.restaurant.name} />}
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <>
                    {!state.error ? (
                        <>
                            <AppBar className="customerMenu-appbar" position="static" color="secondary">
                                <Tabs
                                    value={state.tabValue}
                                    onChange={(event, newValue) => { setState({ type: 'changeTabValue', tabValue: newValue }); }}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="scrollable"
                                    scrollButtons="on"
                                    aria-label="scrollable force tabs example"
                                >
                                    {Array.from(state.categoryNames.keys()).map((categoryId, index) => {
                                        return (
                                            <Tab
                                                style={{ paddingLeft: '30px', paddingRight: '30px' }}
                                                key={randomNumber()}
                                                label={state.categoryNames.get(categoryId)}
                                                {...a11yProps(index)}
                                            />
                                        );
                                    })}
                                </Tabs>
                            </AppBar>
                            {Array.from(state.menuItems.keys()).map((categoryName, index) => {
                                return (
                                    <TabPanel key={randomNumber()} value={state.tabValue} index={index}>
                                        <div className="customerMenu-items">
                                            {state.menuItems.get(categoryName).map((dish) => {
                                                return (
                                                    <CustomerMenuDish
                                                        key={randomNumber()}
                                                        dishItem={dish}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </TabPanel>
                                );
                            })}
                        </>
                    ) : (
                        <div className="restaurantNotFound">
                            <p className="restaurantNotFound-text">Restaurant Not Found</p>
                            <img className="restaurantNotFound-image" draggable="false" src={Empty} alt="RestaurantNotFound" />
                        </div>
                    )}
                </>
            ) : null}
        </div>
    );
};

CustomerMenu.propTypes = {
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(CustomerMenu));