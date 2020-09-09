/**
 * This class is used as footer of dish
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { Button } from '@material-ui/core';

const MenuDishFooter = (props) => {
    const { history, restaurantId, dishId } = props;

    return (
        <div className="footer">
            <Button
                variant="contained"
                className="footer-button"
                onClick={() => {
                    history.push(`/customer/addtocart/${restaurantId}/${dishId}`);
                }}
            >
                Ready To Order?
            </Button>
        </div>
    );
};

MenuDishFooter.propTypes = {
    history: PropTypes.object.isRequired,
    restaurantId: PropTypes.string.isRequired,
    dishId: PropTypes.string.isRequired,
};

export default withRouter(React.memo(MenuDishFooter));
