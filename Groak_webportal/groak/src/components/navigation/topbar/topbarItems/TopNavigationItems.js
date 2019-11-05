/**
 * This component is used to represent the menu items in top bar
 */
import React from 'react';

import './css/TopNavigationItems.css';
import TopNavigationItem from './TopNavigationItemDesktop/TopNavigationItem';
import DropDownNavigationItems from './DropDownNavigationItems';

const TopNavigationItems = () => {
    const NAV_OPTIONS = ['orders', 'tables', 'menu', 'settings'];

    return (
        <>
            <ul className="top-navigation-items-desktop">
                {NAV_OPTIONS.map((item) => {
                    return (
                        <TopNavigationItem
                            className="item"
                            key={item}
                            link={`/${item}`}
                            item={item}
                        />
                    );
                })}
            </ul>
            <div className="top-navigation-items-mobile">
                <DropDownNavigationItems options={NAV_OPTIONS} buttonType="allOptions" />
            </div>
        </>
    );
};

export default TopNavigationItems;
