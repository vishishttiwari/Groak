/**
 * This component is used to represent the menu items except menu(dishes/categories)
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

import DropDownNavigationItems from '../DropDownNavigationItems';

const TopNavigationItem = (props) => {
    const { link, item, exact } = props;

    return (
        <li className="top-navigation-item">
            {item !== 'Menu' ? (
                <NavLink
                    to={link}
                    exact={exact}
                    className="navigation-item"
                >
                    <Button className="navigation-button">
                        {item}
                    </Button>
                </NavLink>
            ) : <DropDownNavigationItems options={[item]} buttonType="onlyMenu" />}
        </li>
    );
};

TopNavigationItem.propTypes = {
    exact: PropTypes.bool,
    link: PropTypes.string.isRequired,
    item: PropTypes.string.isRequired,
};

TopNavigationItem.defaultProps = {
    exact: false,
};

export default TopNavigationItem;
