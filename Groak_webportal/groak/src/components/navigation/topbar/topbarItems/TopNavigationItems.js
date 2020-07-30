/**
 * This component is used to represent the menu items in top bar
 */
import React, { useContext } from 'react';

import './css/TopNavigationItems.css';
import { context } from '../../../../globalState/globalState';
import TopNavigationItem from './TopNavigationItemDesktop/TopNavigationItem';
import DropDownNavigationItems from './DropDownNavigationItems';

const TopNavigationItems = () => {
    const { globalState } = useContext(context);

    const NAV_OPTIONS_IF_AUTHENTICATED = ['Orders', 'Tables', 'Menu', 'QR codes', 'Settings'];
    const NAV_OPTIONS_IF_NOT_AUTHENTICATED = ['Sign in', 'Contact us'];

    console.log(NAV_OPTIONS_IF_AUTHENTICATED[3].toLowerCase().replace(/\s/g, ''));

    return (
        <>
            <ul className="top-navigation-items-desktop">
                {globalState.user == null || !globalState.user
                    ? NAV_OPTIONS_IF_NOT_AUTHENTICATED.map((item) => {
                        return (
                            <TopNavigationItem
                                className="item"
                                key={item}
                                link={`/${item.toLowerCase().replace(/\s/g, '')}`}
                                item={item}
                            />
                        );
                    }) : NAV_OPTIONS_IF_AUTHENTICATED.map((item) => {
                        return (
                            <TopNavigationItem
                                className="item"
                                key={item}
                                link={`/${item.toLowerCase().replace(/\s/g, '')}`}
                                item={item}
                            />
                        );
                    })}
            </ul>
            <div className="top-navigation-items-mobile">
                <DropDownNavigationItems
                    options={
                        globalState.user == null
                        || !globalState.user
                            ? NAV_OPTIONS_IF_NOT_AUTHENTICATED
                            : NAV_OPTIONS_IF_AUTHENTICATED
                    }
                    buttonType="allOptions"
                />
            </div>
        </>
    );
};

export default TopNavigationItems;
