import React from 'react';
import PropTypes from 'prop-types';

import { Paper, Tabs, Tab, Badge } from '@material-ui/core';
import './css/CustomTabBar.css';
import Menu from '../../../../assets/icons/tabbar/menu.png';
import Cart from '../../../../assets/icons/tabbar/waiter.png';
import Table from '../../../../assets/icons/tabbar/dinner.png';
import Covid from '../../../../assets/icons/tabbar/corona.png';
import { fetchCart } from '../../../../catalog/LocalStorage';

const CustomerTabBar = (props) => {
    const { restaurantId, value, setState } = props;

    return (
        <Paper square className="tabbar">
            <Tabs
                value={value}
                onChange={(event, newValue) => { setState({ type: 'changeTabValue', tabValue: newValue }); }}
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
                <Tab icon={<img className="icons" src={Table} alt="Order" />} label="Order" />
                <Tab icon={<img className="icons" src={Covid} alt="Covid" />} label="Covid" />
            </Tabs>
        </Paper>
    );
};

CustomerTabBar.propTypes = {
    restaurantId: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(CustomerTabBar);
