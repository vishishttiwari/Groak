/**
 * Used for confirming with user if they are ok with venmo payment
 */
import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { context } from '../../../globalState/globalState';

import { VenmoMessage } from '../../../catalog/Comments';
import Venmo from '../../../assets/others/venmo_logo_white.png';
import { calculatePriceFromDishes, calculatePriceFromDishesWithPayment, calculatePriceFromDishesWithPayments, getPrice, randomNumber } from '../../../catalog/Others';

const VenmoPayment = (props) => {
    const { dishes, tip, venmoConfirmation, venmoHandler, setState } = props;
    const [scroll, setScroll] = React.useState('body');
    const { globalState } = useContext(context);

    useEffect(() => {
        setScroll('body');
    }, []);

    const hideVenmo = () => {
        setState({ type: 'hideVenmo' });
    };

    const calculatePriceFromDishesWithPaymentsIncludingFixedFees = () => {
        const dishesPrices = calculatePriceFromDishes(dishes, 'your');
        let finalPrices = dishesPrices;
        globalState.restaurantCustomer.payments.forEach((payment) => {
            if (payment.id !== 'tips') {
                finalPrices += calculatePriceFromDishesWithPayment(dishes, payment, 'your');
            }
        });
        if (tip && tip > 0) {
            finalPrices += parseFloat(tip);
        }
        return parseFloat(finalPrices.toFixed(2));
    };

    return (
        <Dialog
            className="popup"
            open={venmoConfirmation}
            onClose={hideVenmo}
            scroll={scroll}
        >
            <p className="popup-title">Ready for payment?</p>
            <DialogContent dividers={scroll === 'paper'} className="popup-content">
                <div className="receipt-price-cell" style={{ marginTop: '20px', borderStyle: 'none' }}>
                    <div className="receipt-price-cell-content">
                        <p className="receipt-price-cell-title">Table Total</p>
                        <p className="receipt-price-cell-price">{getPrice(calculatePriceFromDishesWithPayments(dishes, globalState.restaurantCustomer.payments, tip, 'table'))}</p>
                    </div>
                    <div className="receipt-price-cell-content-1">
                        <p className="receipt-price-cell-title">Your Total without tips and other fixed fees</p>
                        <p className="receipt-price-cell-price">{getPrice(calculatePriceFromDishesWithPayments(dishes, globalState.restaurantCustomer.payments, tip, 'your'))}</p>
                    </div>
                    {globalState.restaurantCustomer.payments.map((payment) => {
                        return (
                            <div key={randomNumber()}>
                                {payment.id !== 'tips' && !payment.percentage ? (
                                    <div key={randomNumber()} className="receipt-price-cell-content-1">
                                        <p className="receipt-price-cell-title">{payment.title}</p>
                                        <p className="receipt-price-cell-price">{getPrice(calculatePriceFromDishesWithPayment(dishes, payment, 'your'))}</p>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                    {tip > 0 ? (
                        <div className="receipt-price-cell-content-1">
                            <p className="receipt-price-cell-title">Tip</p>
                            <p className="receipt-price-cell-price">{getPrice(tip)}</p>
                        </div>
                    ) : null}
                    <div className="receipt-price-cell-content" style={{ marginBottom: '10px', borderBottomStyle: 'solid', borderWidth: '1px', borderColor: 'silver' }}>
                        <p className="receipt-price-cell-title">Your Full Total</p>
                        <p className="receipt-price-cell-price">{getPrice(calculatePriceFromDishesWithPaymentsIncludingFixedFees())}</p>
                    </div>
                    {VenmoMessage}
                </div>
            </DialogContent>
            <DialogActions className="popup-actions">
                <Button onClick={hideVenmo} className="popup-button popup-button-cancel">
                    Cancel
                </Button>
                <div onClick={venmoHandler} className="popup-venmo-button">
                    <img className="popup-venmo-image" src={Venmo} alt="Venmo" />
                </div>
                {/* <p style={{ color: 'grey', margin: '20px', textAlign: 'center' }}>{VenmoUsageMessage}</p> */}
            </DialogActions>
        </Dialog>
    );
};

VenmoPayment.propTypes = {
    dishes: PropTypes.array.isRequired,
    tip: PropTypes.number.isRequired,
    venmoConfirmation: PropTypes.bool.isRequired,
    venmoHandler: PropTypes.func.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(VenmoPayment);
