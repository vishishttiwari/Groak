/**
 * Class is used to price cell in receipt
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import './css/Receipt.css';
import { context } from '../../../globalState/globalState';
import { calculatePriceFromDishes, calculatePriceFromDishesWithPayment, calculatePriceFromDishesWithPayments, getPrice, randomNumber } from '../../../catalog/Others';

const ReceiptPriceCell = (props) => {
    const { tableReceipt, dishes, tip } = props;
    const { globalState } = useContext(context);

    return (
        <>
            {globalState && globalState.restaurantCustomer ? (
                <div className="receipt-price-cell">
                    <div className="receipt-price-cell-content">
                        <p className="receipt-price-cell-title">Total</p>
                        <p className="receipt-price-cell-price">{getPrice(calculatePriceFromDishesWithPayments(dishes, globalState.restaurantCustomer.payments, tip, tableReceipt))}</p>
                    </div>
                    <div className="receipt-price-cell-content-1">
                        <p className="receipt-price-cell-title">Subtotal</p>
                        <p className="receipt-price-cell-price">{getPrice(calculatePriceFromDishes(dishes, tableReceipt))}</p>
                    </div>
                    {globalState.restaurantCustomer.payments.map((payment) => {
                        return (
                            <div key={randomNumber()}>
                                {payment.id !== 'tips' ? (
                                    <div key={randomNumber()} className="receipt-price-cell-content-1">
                                        <p className="receipt-price-cell-title">{!payment.percentage && tableReceipt === 'your' ? `${payment.title}(not inclusive because this is a fixed fee for the entire table)` : payment.title}</p>
                                        <p className="receipt-price-cell-price">{getPrice(calculatePriceFromDishesWithPayment(dishes, payment, tableReceipt))}</p>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                    {tip > 0 ? (
                        <div className="receipt-price-cell-content-1">
                            <p className="receipt-price-cell-title">{tableReceipt === 'your' ? 'Tip(not inclusive because this is for the entire table)' : 'Tip'}</p>
                            <p className="receipt-price-cell-price">{getPrice(tip)}</p>
                        </div>
                    ) : null}

                </div>
            ) : null}
        </>
    );
};

ReceiptPriceCell.propTypes = {
    tableReceipt: PropTypes.string.isRequired,
    dishes: PropTypes.array.isRequired,
    tip: PropTypes.number,
};

ReceiptPriceCell.defaultProps = {
    tip: 0,
};

export default React.memo(ReceiptPriceCell);
