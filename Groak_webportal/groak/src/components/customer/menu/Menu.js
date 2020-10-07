/**
 * The cart is used for representing menu
 */
import React, { useReducer, useContext, createRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Box } from '@material-ui/core';
import './css/Menu.css';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { context } from '../../../globalState/globalState';

import MenuDish from './MenuDish';
import { randomNumber, showDishDetails } from '../../../catalog/Others';
import { ImageSubjectToChange } from '../../../catalog/Comments';
import MenuHeader from './MenuHeader';
import DishRestrictionsIndex from './DishRestrictionsIndex';

const initialState = { tabValue: 0 };

function reducer(state, action) {
    switch (action.type) {
        case 'changeTabValue':
            if (action.tabValue !== state.tabValue) {
                return { ...state, tabValue: action.tabValue };
            }
            return { ...state };
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

const Menu = (props) => {
    const { history, match, menuItems, categoryNames, restaurant } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const top = createRef(null);

    /**
     * This function is called when each dish is pressed.
     *
     * @param {*} dish this is the dish that is passed
     */
    function menuDishHandler(dish) {
        if (globalState && globalState.orderAllowedCustomer) {
            if (showDishDetails(dish)) {
                history.push(`/customer/dish/${match.params.restaurantid}/${dish.id}`);
            } else {
                history.push(`/customer/addtocart/${match.params.restaurantid}/${dish.id}`);
            }
        }
    }

    /**
     * This function is used to call the search screen
     */
    const searchHandler = () => {
        history.push(`/customer/search/${match.params.restaurantid}/${match.params.tableid}/${match.params.qrcodeid}`);
    };

    const changeTab = (newValue) => {
        setState({ type: 'changeTabValue', tabValue: newValue });
        top.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
        });
    };

    return (
        <div className="menu">
            <MenuHeader
                restaurantName={restaurant.name}
                searchHandler={searchHandler}
                tabValue={state.tabValue}
                changeTab={changeTab}
                categoryNames={categoryNames}
            />
            <div className="content">
                <p ref={top}> </p>
                {restaurant.logo ? <img className="menu-restaurant-logo" src={restaurant.logo} alt={restaurant.name} /> : null }

                {Array.from(menuItems.keys()).map((menuItem, index) => {
                    return (
                        <TabPanel key={randomNumber()} value={state.tabValue} index={index}>
                            <div className="menu-items">
                                {menuItems.get(menuItem).map((dish) => {
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
                <DishRestrictionsIndex />
                <div className="image-change">
                    <ErrorOutlineIcon style={{ marginRight: '5px', marginLeft: '5px' }} />
                    <p>
                        {ImageSubjectToChange}
                    </p>
                </div>
            </div>
        </div>
    );
};

Menu.propTypes = {
    menuItems: PropTypes.instanceOf(Map).isRequired,
    categoryNames: PropTypes.array.isRequired,
    restaurant: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(Menu));
