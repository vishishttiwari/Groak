/**
 * Tab bar for customers
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Paper, Tabs, Tab, Badge } from '@material-ui/core';
import { context } from '../../../../globalState/globalState';

import './css/CustomTabBar.css';
import Menu from '../../../../assets/icons/tabbar/menu.png';
import Cart from '../../../../assets/icons/tabbar/waiter.png';
import Table from '../../../../assets/icons/tabbar/dinner.png';
import Covid from '../../../../assets/icons/tabbar/corona.png';
import { fetchCart } from '../../../../catalog/LocalStorage';

const CustomerTabBarWithOrdering = (props) => {
    const { restaurantId, visible } = props;
    const { globalState, setGlobalState } = useContext(context);

    return (
        <Paper square className="tabbar">
            <Tabs
                value={globalState.tabValueCustomer}
                onChange={(event, newValue) => {
                    setGlobalState({ type: 'setTabValueCustomer', tabValue: newValue });
                }}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                aria-label="icon label tabs example"
            >
                <Tab icon={<img className="icons" src={Menu} alt="Menu" />} label="Menu" />
                <Tab
                    icon={(
                        <Badge
                            badgeContent={fetchCart(restaurantId).length}
                            color="primary"
                        >
                            <img className="icons" src={Cart} alt="Cart" />
                        </Badge>
                    )}
                    label="Cart"
                />
                <Tab
                    icon={(
                        <Badge
                            color="primary"
                            invisible={!visible}
                        >
                            <img className="icons" src={Table} alt="Order" />
                        </Badge>
                    )}
                    label="Order"
                />
                {globalState.covidInformationCustomer ? (
                    <Tab icon={<img className="icons" src={Covid} alt="Covid" />} label="Covid" />
                ) : null}
            </Tabs>
        </Paper>
    );
};

CustomerTabBarWithOrdering.propTypes = {
    restaurantId: PropTypes.string.isRequired,
    visible: PropTypes.bool,
};

CustomerTabBarWithOrdering.defaultProps = {
    visible: false,
};

export default React.memo(CustomerTabBarWithOrdering);
