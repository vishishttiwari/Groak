/**
 * This component is used to represent the top bar
 */
import React from 'react';

import { AppBar, Toolbar } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import TopNavigationItems from './topbarItems/TopNavigationItems';
import './css/Topbar.css';
import Icon from '../../../assets/images/white_name_icon.png';

const Topbar = (props) => {
    const { exact } = props;

    return (
        <header>
            <AppBar>
                <Toolbar className="topbar">
                    <NavLink to="/" exact={exact}>
                        <img draggable="false" className="logo" src={Icon} alt="icon" />
                    </NavLink>
                    <TopNavigationItems />
                </Toolbar>
            </AppBar>
        </header>
    );
};

Topbar.propTypes = {
    exact: PropTypes.bool,
};

Topbar.defaultProps = {
    exact: false,
};

export default Topbar;
