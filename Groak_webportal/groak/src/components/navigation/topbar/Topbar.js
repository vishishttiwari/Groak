/**
 * This component is used to represent the top bar
 */
import React from 'react';

import { AppBar, Toolbar, Typography } from '@material-ui/core';
import TopNavigationItems from './topbarItems/TopNavigationItems';
import './css/Topbar.css';

const Topbar = () => {
    return (
        <header>
            <AppBar>
                <Toolbar className="topbar">
                    <Typography className="logo">Menu Door</Typography>
                    <TopNavigationItems />
                </Toolbar>
            </AppBar>
        </header>
    );
};

export default Topbar;
