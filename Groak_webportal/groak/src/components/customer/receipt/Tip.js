/**
 * Used for representing for asking tips
 */
import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

import { Dialog, DialogActions, DialogContent, TextField, InputAdornment, Button } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { calculatePriceFromDishes, getPrice, randomNumber } from '../../../catalog/Others';
import ReceiptPriceCell from './ReceiptPriceCell';

const initialState = { tipIndex: -1, tipValue: 0, tipPercentage: 0 };

function reducer(state, action) {
    let tipPercentage;
    let tipValue;
    switch (action.type) {
        case 'changeTipIndex':
            if (action.tipIndex === null || action.tipIndex < 0) {
                return initialState;
            } if (action.tipIndex !== 3) {
                return { ...state, tipIndex: action.tipIndex, tipValue: action.tipValue, tipPercentage: action.tipPercentage };
            }
            return { ...state, tipIndex: action.tipIndex, tipValue: 0, tipPercentage: 0 };
        case 'changeTipValue':
            if (action.tipValue.length > 0 && parseFloat(action.tipValue) > 0) {
                tipPercentage = parseFloat(((parseFloat(action.tipValue) * 100) / action.totalPrice).toFixed(2));
                return { ...state, tipValue: parseFloat(action.tipValue), tipPercentage };
            }
            return { ...state, tipValue: 0, tipPercentage: 0 };
        case 'changeTipPercentage':
            if (action.tipPercentage.length > 0 && parseFloat(action.tipPercentage) > 0) {
                tipValue = parseFloat(((parseFloat(action.tipPercentage) * action.totalPrice) / 100).toFixed(2));
                return { ...state, tipPercentage: parseFloat(action.tipPercentage), tipValue };
            }
            return { ...state, tipValue: 0, tipPercentage: 0 };
        default:
            return initialState;
    }
}

const Tip = (props) => {
    const { dishes, tips, tipIndex, tipConfirmation, setState } = props;
    const [state, setStateLocal] = useReducer(reducer, initialState);

    useEffect(() => {
        setStateLocal({ type: 'changeTipIndex', tipIndex, tipValue: parseFloat((calculatePriceFromDishes(dishes) * (tips.values[tipIndex] / 100)).toFixed(2)), tipPercentage: tips.values[tipIndex] });
    }, []);

    const close = () => {
        setState({ type: 'showHideTip', show: false });
    };

    const setTip = () => {
        setState({ type: 'changeTip', tipIndex: state.tipIndex, tipValue: state.tipValue });
    };

    const changeTipIndex = (tipIndexLocal) => {
        setStateLocal({ type: 'changeTipIndex', tipIndex: tipIndexLocal, tipValue: parseFloat((calculatePriceFromDishes(dishes) * (tips.values[tipIndexLocal] / 100)).toFixed(2)), tipPercentage: tips.values[tipIndexLocal] });
    };

    return (
        <Dialog
            className="popup"
            open={tipConfirmation}
            onClose={close}
        >
            <p className="popup-title">Tips</p>
            <DialogContent className="popup-content">
                <ToggleButtonGroup
                    value={state.tipIndex}
                    exclusive
                    onChange={(event, tipIndexLocal) => { changeTipIndex(tipIndexLocal); }}
                >
                    {tips.values.map((tipLocal, index) => {
                        return (
                            <ToggleButton key={randomNumber()} value={index} aria-label="bold">
                                <div className="popup-tip">
                                    <p className="popup-tip-content">{`${tipLocal}%`}</p>
                                    <p className="popup-tip-content">{getPrice(calculatePriceFromDishes(dishes) * (tipLocal / 100))}</p>
                                </div>
                            </ToggleButton>
                        );
                    })}
                    <ToggleButton value={3} aria-label="bold">
                        <div className="popup-tip">
                            <p className="popup-tip-content">Others</p>
                        </div>
                    </ToggleButton>
                </ToggleButtonGroup>
                {state.tipIndex === 3 ? (
                    <div className="popup-other-tips">
                        <TextField
                            variant="outlined"
                            type="number"
                            className="popup-other-tip"
                            value={state.tipValue}
                            onChange={(event) => { setStateLocal({ type: 'changeTipValue', tipValue: event.target.value, totalPrice: calculatePriceFromDishes(dishes) }); }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                        <TextField
                            variant="outlined"
                            type="number"
                            className="popup-other-tip"
                            value={state.tipPercentage}
                            onChange={(event) => { setStateLocal({ type: 'changeTipPercentage', tipPercentage: event.target.value, totalPrice: calculatePriceFromDishes(dishes) }); }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">%</InputAdornment>,
                            }}
                        />
                    </div>
                ) : null}
                <ReceiptPriceCell tableReceipt="table" dishes={dishes} tip={state.tipValue} />
            </DialogContent>
            <DialogActions className="popup-actions">
                <Button
                    onClick={setTip}
                    className={state.tipIndex === -1 ? 'popup-button popup-button-disabled' : 'popup-button'}
                    disabled={state.tipIndex === -1}
                >
                    Set Tip
                </Button>
            </DialogActions>
        </Dialog>
    );
};

Tip.propTypes = {
    dishes: PropTypes.array.isRequired,
    tips: PropTypes.object.isRequired,
    tipConfirmation: PropTypes.bool.isRequired,
    tipIndex: PropTypes.number.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(Tip);
