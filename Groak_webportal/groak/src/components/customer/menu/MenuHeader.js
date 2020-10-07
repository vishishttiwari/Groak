/**
 * This class is used for representing the header of menu
 */
import React from 'react';
import PropTypes from 'prop-types';

import SearchIcon from '@material-ui/icons/Search';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { randomNumber } from '../../../catalog/Others';

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const MenuHeader = (props) => {
    const { restaurantName, searchHandler, tabValue, changeTab, categoryNames } = props;

    return (
        <div className="header" style={{ paddingBottom: 0 }}>
            <div className="header-content">
                <p className="header-title">{restaurantName}</p>
            </div>
            <SearchIcon
                className="header-right-icon"
                style={{ top: '30px' }}
                onClick={() => {
                    searchHandler();
                }}
            />
            <AppBar className="menu-appbar" position="static" color="secondary">
                <Tabs
                    value={tabValue}
                    onChange={(event, newValue) => { changeTab(newValue); }}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="on"
                    aria-label="scrollable force tabs example"
                >
                    {Array.from(categoryNames).map((categoryName, index) => {
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
        </div>
    );
};

MenuHeader.propTypes = {
    tabValue: PropTypes.number.isRequired,
    changeTab: PropTypes.func.isRequired,
    categoryNames: PropTypes.array.isRequired,
    restaurantName: PropTypes.string.isRequired,
    searchHandler: PropTypes.func.isRequired,
};

export default React.memo(MenuHeader);
