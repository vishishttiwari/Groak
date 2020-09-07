import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import './css/Receipt.css';
import { context } from '../../../globalState/globalState';

const ReceiptPriceCell = (props) => {
    const { totalPrice } = props;
    const { globalState } = useContext(context);

    const calculateSalesTax = () => {
        return (globalState.restaurantCustomer.salesTax * totalPrice) / 100;
    };

    const calculateTotal = () => {
        return (1 + globalState.restaurantCustomer.salesTax / 100) * totalPrice;
    };

    return (
        <>
            {globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.salesTax ? (
                <div className="receipt-price-cell">
                    <div className="receipt-price-cell-content">
                        <p className="receipt-price-cell-title">Total</p>
                        <p className="receipt-price-cell-price">{`$ ${calculateTotal().toFixed(2)}`}</p>
                    </div>
                    <div className="receipt-price-cell-content-1">
                        <p className="receipt-price-cell-title">Subtotal</p>
                        <p className="receipt-price-cell-price">{`$ ${totalPrice.toFixed(2)}`}</p>
                    </div>
                    <div className="receipt-price-cell-content-1">
                        <p className="receipt-price-cell-title">Sales Tax</p>
                        <p className="receipt-price-cell-price">{`$ ${calculateSalesTax().toFixed(2)}`}</p>
                    </div>
                </div>
            ) : null}
        </>
    );
};

ReceiptPriceCell.propTypes = {
    totalPrice: PropTypes.number.isRequired,
};

export default React.memo(ReceiptPriceCell);
