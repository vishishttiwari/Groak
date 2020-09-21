/**
 * This component is used to represent the top bar
 */
import React from 'react';

import { AppBar, Toolbar } from '@material-ui/core';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TopNavigationItems from './topbarItems/TopNavigationItems';
import './css/Topbar.css';
import Icon from '../../../assets/images/orange_name_icon.png';

const Topbar = (props) => {
    const { history, exact } = props;

    const optionsShouldBeVisible = () => {
        const path = history.location.pathname.split('/')[1];
        if (path === 'customer') {
            return false;
        }
        return true;
    };

    return (
        <header>
            <AppBar>
                <Toolbar className={optionsShouldBeVisible() ? 'topbar' : 'topbar-customer'}>
                    <NavLink to="/" exact={exact}>
                        <img draggable="false" className="logo" src={Icon} alt="icon" />
                    </NavLink>
                    {optionsShouldBeVisible() ? <TopNavigationItems /> : null}
                </Toolbar>
            </AppBar>
        </header>
    );
};

Topbar.propTypes = {
    history: PropTypes.object.isRequired,
    exact: PropTypes.bool,
};

Topbar.defaultProps = {
    exact: false,
};

export default withRouter(React.memo(Topbar));
