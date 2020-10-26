/**
 * Request button for calling waiter
 */
import React, { useRef, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { Badge, Button, Fab, Dialog, DialogContent, DialogActions, IconButton } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import Waiter from '../../../../assets/icons/waiter.png';
import { updateOrderWhenWaiterIsCalledFirestoreAPI } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsOrders';
import { context } from '../../../../globalState/globalState';
import { isNearRestaurant } from '../../../../catalog/Distance';
import { NotAtRestaurant, WaiterSent } from '../../../../catalog/NotificationsComments';
import { analytics } from '../../../../firebase/FirebaseLibrary';
import { groakTesting } from '../../../../catalog/Others';
import Spinner from '../../../ui/spinner/Spinner';
import { CallOrChatWithWaiter, CallWaiter } from '../../../../catalog/Comments';
import PopoverGroak from '../popup/PopoverGroak';

const initialState = {
    open: false,
    loadingSpinner: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'setOpen':
            return { ...state, open: action.open };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        default:
            return { ...state };
    }
}

const CustomerWaiterRequestButton = (props) => {
    const { history, restaurantId, tableId, visible } = props;
    const { globalState } = useContext(context);
    const [state, setState] = useReducer(reducer, initialState);
    const { enqueueSnackbar } = useSnackbar();
    const elRef = useRef(null);

    const fabClicked = () => {
        if (groakTesting) {
            analytics.logEvent('clicked_waiter_button_web_testing', { restaurantId });
        } else {
            analytics.logEvent('clicked_waiter_button_web', { restaurantId });
        }
        if (globalState.orderAllowedCustomer && globalState.waiterAllowedCustomer) {
            setState({ type: 'setOpen', open: true });
        } else if (globalState.waiterAllowedCustomer) {
            setState({ type: 'setOpen', open: true });
        } else if (globalState.orderAllowedCustomer) {
            history.push(`/customer/requests/${restaurantId}/${tableId}`);
        }
    };

    const hidePopUp = () => {
        setState({ type: 'setOpen', open: false });
    };

    const callWaiter = async () => {
        if (globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.location && globalState.restaurantCustomer.location.latitude && globalState.restaurantCustomer.location.longitude) {
            setState({ type: 'setLoadingSpinner', loadingSpinner: true });
            isNearRestaurant(globalState.restaurantCustomer.location.latitude, globalState.restaurantCustomer.location.longitude, enqueueSnackbar)
                .then(async (nearRestaurant) => {
                    if (nearRestaurant) {
                        if (groakTesting) {
                            analytics.logEvent('called_waiter_web_testing', { restaurantId });
                        } else {
                            analytics.logEvent('called_waiter_web', { restaurantId });
                        }
                        await updateOrderWhenWaiterIsCalledFirestoreAPI(restaurantId, tableId, true);
                        setState({ type: 'setLoadingSpinner', loadingSpinner: false });
                        hidePopUp();
                        enqueueSnackbar(WaiterSent, { variant: 'success' });
                    } else {
                        enqueueSnackbar(NotAtRestaurant, { variant: 'error' });
                        setState({ type: 'setLoadingSpinner', loadingSpinner: false });
                    }
                })
                .catch(() => {
                    setState({ type: 'setLoadingSpinner', loadingSpinner: false });
                });
        }
    };

    const popoverContent = () => {
        if (globalState.orderAllowedCustomer && globalState.waiterAllowedCustomer) {
            return <PopoverGroak elRef={elRef} direction="right" text="Call or send a message to your server" />;
        } if (globalState.waiterAllowedCustomer) {
            return <PopoverGroak elRef={elRef} direction="right" text="Call your server" />;
        } if (globalState.orderAllowedCustomer) {
            return <PopoverGroak elRef={elRef} direction="right" text="Send a message to your server" />;
        }
        return null;
    };

    const dialogTitle = () => {
        if (globalState.orderAllowedCustomer && globalState.waiterAllowedCustomer) {
            return 'Call or send a message to your server';
        } if (globalState.waiterAllowedCustomer) {
            return 'Call your server';
        } if (globalState.orderAllowedCustomer) {
            return 'Send a message to your server';
        }
        return null;
    };

    const dialogContent = () => {
        if (globalState.orderAllowedCustomer && globalState.waiterAllowedCustomer) {
            return CallOrChatWithWaiter;
        } if (globalState.waiterAllowedCustomer) {
            return CallWaiter;
        }
        return null;
    };

    const dialogButtons = () => {
        if (!state.loadingSpinner) {
            if (globalState.orderAllowedCustomer && globalState.waiterAllowedCustomer) {
                return (
                    <>
                        <Button
                            className="pop-up-after-restaurant-actions-button"
                            type="button"
                            onClick={() => { callWaiter(); }}
                        >
                            Call your server
                        </Button>
                        <Button
                            className="pop-up-after-restaurant-actions-button"
                            type="button"
                            onClick={() => {
                                history.push(`/customer/requests/${restaurantId}/${tableId}`);
                                hidePopUp();
                            }}
                        >
                            Send a message
                        </Button>
                    </>
                );
            } if (globalState.waiterAllowedCustomer) {
                return (
                    <Button
                        className="pop-up-after-restaurant-actions-button"
                        type="button"
                        onClick={() => { callWaiter(); }}
                    >
                        Yes
                    </Button>
                );
            }
        } else {
            return (
                <Spinner show={state.loadingSpinner} />
            );
        }
        return null;
    };

    return (
        <>
            {popoverContent()}
            <Fab
                style={{
                    width: '70px',
                    height: '70px',
                    position: 'fixed',
                    right: '20px',
                    bottom: '150px',
                    zIndex: '30',
                }}
                color="secondary"
                onClick={() => { fabClicked(); }}
                ref={elRef}
            >
                <Badge
                    color="primary"
                    invisible={!visible}
                    style={{ width: '60%' }}
                >
                    <img style={{ width: '100%', height: '100%' }} src={Waiter} alt="Waiter" />
                </Badge>
            </Fab>
            <Dialog
                className="pop-up-after-restaurant"
                open={state.open}
                onClose={hidePopUp}
            >
                <div className="pop-up-after-restaurant-title">
                    <p>{dialogTitle()}</p>
                    <IconButton onClick={hidePopUp}>
                        <CloseRounded className="pop-up-after-restaurant-title-close" />
                    </IconButton>
                </div>
                <DialogContent className="pop-up-after-restaurant-content">
                    {dialogContent()}
                </DialogContent>
                <DialogActions className="pop-up-after-restaurant-actions">
                    {dialogButtons()}
                </DialogActions>
            </Dialog>
        </>
    );
};

CustomerWaiterRequestButton.propTypes = {
    history: PropTypes.object.isRequired,
    restaurantId: PropTypes.string.isRequired,
    tableId: PropTypes.string.isRequired,
    visible: PropTypes.bool,
};

CustomerWaiterRequestButton.defaultProps = {
    visible: false,
};

export default withRouter(React.memo(CustomerWaiterRequestButton));
