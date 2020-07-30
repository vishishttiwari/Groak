/**
 * This component is used to represent the menu items specially menu(dishes/categories)
 */
import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, MenuItem, Popper, Grow, Paper, MenuList } from '@material-ui/core';
import { ArrowDropDown, MenuRounded } from '@material-ui/icons';
import PropTypes from 'prop-types';

const DropDownNavigationItems = (props) => {
    const { options, buttonType } = props;
    const [menuOpen, setMenuOpen] = useState(false);
    const anchorRef = useRef(null);

    /**
     * This function is used for opening and closing dishes and categories when menu is pressed
     */
    function handleToggle() {
        setMenuOpen((prevOpen) => { return !prevOpen; });
    }

    /**
     * This function is called when close is called on dishes and categories
     */
    function handleClose(event) {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setMenuOpen(false);
    }

    function getButtonType() {
        if (buttonType === 'onlyMenu') {
            return (
                <Button ref={anchorRef} className="navigation-button" onClick={handleToggle} onBlur={() => { setMenuOpen(false); }}>
                    Menu
                    {' '}
                    <ArrowDropDown />
                </Button>
            );
        }
        return (
            <Button ref={anchorRef} className="navigation-button" onClick={handleToggle} onBlur={() => { setMenuOpen(false); }}>
                <MenuRounded />
            </Button>
        );
    }

    return (
        <div className="navigation-item">
            {getButtonType()}
            <Popper open={menuOpen} anchorEl={anchorRef.current} transition disablePortal>
                {({ TransitionProps, placement }) => {
                    return (
                        <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper>
                                <MenuList>
                                    {options.map((item) => {
                                        return (item !== 'Menu'
                                            ? (
                                                <NavLink
                                                    key={item}
                                                    style={{ textDecoration: 'none', color: 'black' }}
                                                    to={`/${item.toLowerCase().replace(/\s/g, '')}`}
                                                    exact
                                                >
                                                    <MenuItem onClick={handleClose}>{item}</MenuItem>
                                                </NavLink>
                                            )
                                            : (
                                                <div key={item}>
                                                    <NavLink
                                                        style={{ textDecoration: 'none', color: 'black' }}
                                                        to="/dishes"
                                                        exact
                                                    >
                                                        <MenuItem onClick={handleClose}>Dishes</MenuItem>
                                                    </NavLink>
                                                    <NavLink
                                                        style={{ textDecoration: 'none', color: 'black' }}
                                                        to="/categories"
                                                        exact
                                                    >
                                                        <MenuItem onClick={handleClose}>Categories</MenuItem>
                                                    </NavLink>
                                                </div>
                                            ));
                                    })}
                                </MenuList>
                            </Paper>
                        </Grow>
                    );
                }}
            </Popper>
        </div>
    );
};

DropDownNavigationItems.propTypes = {
    options: PropTypes.array.isRequired,
    buttonType: PropTypes.string.isRequired,
};

export default DropDownNavigationItems;
