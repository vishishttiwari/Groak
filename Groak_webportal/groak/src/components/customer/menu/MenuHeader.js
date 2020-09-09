/**
 * This class is used for representing the header of menu
 */
import React from 'react';
import PropTypes from 'prop-types';

import SearchIcon from '@material-ui/icons/Search';

const MenuHeader = (props) => {
    const { restaurantName, searchHandler } = props;

    return (
        <div className="header">
            <div className="header-content">
                <p className="header-title">{restaurantName}</p>
            </div>
            <SearchIcon
                className="header-right-icon"
                onClick={() => {
                    searchHandler();
                }}
            />
        </div>
    );
};

MenuHeader.propTypes = {
    restaurantName: PropTypes.string.isRequired,
    searchHandler: PropTypes.func.isRequired,
};

export default React.memo(MenuHeader);
