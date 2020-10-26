/**
 * Popups used in Groak customer interface
 */
import React, { useReducer, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Popper } from '@material-ui/core';
import Arrow from '../../../../assets/icons/down-arrow2.png';
import CSSVariables from '../../../../globalCSS/_globalCSS.scss';
import { context } from '../../../../globalState/globalState';

const initialState = {
    popover: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'setPopover':
            return { ...state, popover: action.popover };
        default:
            return { ...state };
    }
}

const PopoverGroak = (props) => {
    const { elRef, direction, text } = props;
    const { globalState } = useContext(context);
    const [state, setState] = useReducer(reducer, initialState);

    useEffect(() => {
        setState({ type: 'setPopover', popover: true });
    }, []);

    const getPlacement = () => {
        if (direction === 'right') {
            return 'top-end';
        }
        return 'top';
    };

    return (
        <>
            <Popper
                style={{
                    zIndex: '40',
                    maxWidth: '90%',
                }}
                id="simple-popper"
                open={!globalState.popoverShown && state.popover}
                anchorEl={elRef.current}
                placement={getPlacement()}
                transition
                onClick={() => { setState({ type: 'setPopover', popover: false }); }}
            >
                <Paper>
                    <Typography style={{
                        padding: '5px',
                        backgroundColor: CSSVariables.primaryColor,
                        color: 'white',
                        borderRadius: 5,
                    }}
                    >
                        {text}
                    </Typography>
                </Paper>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}
                >
                    <img
                        src={Arrow}
                        alt="arrow"
                        style={{
                            width: '20px',
                            height: '15px',
                            marginRight: direction === 'right' ? '20px' : 'auto',
                            marginLeft: 'auto',
                            marginTop: 0,
                            marginBottom: 0,
                        }}
                    />
                </div>
            </Popper>
        </>
    );
};

PopoverGroak.propTypes = {
    elRef: PropTypes.object.isRequired,
    direction: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

export default React.memo(PopoverGroak);
