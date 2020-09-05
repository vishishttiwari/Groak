import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const AddToCartFooter = (props) => {
    const { dishPrice, quantity, setState, addToCartHandler } = props;

    return (
        <div className="footer">
            <div className="footer-content">
                <RemoveCircleOutlineIcon
                    className="footer-left-icon"
                    onClick={() => {
                        setState({
                            type: 'changeQuantity',
                            quantity: Math.max(quantity - 1, 1),
                        });
                    }}
                />
                <p className="footer-title">{`$ ${(quantity * dishPrice).toFixed(2)}`}</p>
                <AddCircleOutlineIcon
                    className="footer-right-icon"
                    onClick={() => {
                        setState({
                            type: 'changeQuantity',
                            quantity: quantity + 1,
                        });
                    }}
                />
            </div>
            <Button
                variant="contained"
                className="footer-button"
                onClick={() => {
                    addToCartHandler();
                }}
            >
                {`Add ${quantity} To Cart`}
            </Button>
        </div>
    );
};

AddToCartFooter.propTypes = {
    dishPrice: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    setState: PropTypes.func.isRequired,
    addToCartHandler: PropTypes.func.isRequired,
};

export default React.memo(AddToCartFooter);
