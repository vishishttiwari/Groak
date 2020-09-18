/**
 * Tab bar for customers
 */
import React, { useContext } from 'react';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { context } from '../../../../globalState/globalState';

import './css/CustomTabBar.css';
import Menu from '../../../../assets/icons/tabbar/menu.png';
import Covid from '../../../../assets/icons/tabbar/corona.png';

const CustomerTabBarWithoutOrdering = () => {
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
                <Tab icon={<img className="icons" src={Covid} alt="Covid" />} label="Covid" />
            </Tabs>
        </Paper>
    );
};

export default React.memo(CustomerTabBarWithoutOrdering);
