import React from 'react';
import PropTypes from 'prop-types';

import SearchIcon from '@material-ui/icons/Search';

const MenuHeader = (props) => {
    const { restaurantName } = props;

    return (
        <div className="header">
            <div className="header-content">
                <p className="header-title">{restaurantName}</p>
            </div>
            <SearchIcon
                className="header-right-icon"
                onClick={() => {
                }}
            />
        </div>
    );
};

MenuHeader.propTypes = {
    restaurantName: PropTypes.string.isRequired,
};

export default React.memo(MenuHeader);
