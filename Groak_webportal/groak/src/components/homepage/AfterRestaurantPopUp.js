/**
 * Used for confirming with user if they are ok with asking for waiter
 */
import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { IconButton, Button, TextField, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
import Rating from '@material-ui/lab/Rating';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import './css/HomePage.css';
import { restaurantFeedbackSubmitted } from '../../firebase/FirestoreAPICalls/FirestoreAPICallsAnalytics';
import { groakTesting } from '../../catalog/Others';
import { analytics } from '../../firebase/FirebaseLibrary';

const initialState = {
    rating: 3,
    rated: false,
    message: '',
};

function reducer(state, action) {
    switch (action.type) {
        case 'setRating':
            return { ...state, rating: action.rating };
        case 'setMessage':
            return { ...state, message: action.message };
        default:
            return { ...state };
    }
}

const customIcons = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon
            style={{ height: '50px', width: '50px' }}
        />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon
            style={{ height: '50px', width: '50px' }}
        />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon
            style={{ height: '50px', width: '50px' }}
        />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon
            style={{ height: '50px', width: '50px' }}
        />,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon
            style={{ height: '50px', width: '50px' }}
        />,
        label: 'Very Satisfied',
    },
};

function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
};

const AfterRestaurantPopUp = (props) => {
    const { restaurantId, restaurantName, orderingAllowed, afterRestaurantPopUp, setState } = props;
    const [state, setStateLocal] = useReducer(reducer, initialState);
    const [scroll, setScroll] = React.useState('body');
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setScroll('body');
    }, []);

    const hideAfterRestaurantPopUp = () => {
        setState({ type: 'hideAfterRestaurantPopUp' });
    };

    const sumbitFeedback = () => {
        enqueueSnackbar('Thank you for your feedback', { variant: 'success' });
        setState({ type: 'hideAfterRestaurantPopUp' });
        if (restaurantId && restaurantId.length) {
            if (groakTesting) {
                analytics.logEvent('restaurant_feedback_submitted_web_testing', { restaurantId, rating: state.rating, messageWritten: state.message && state.message.length > 0 });
            } else {
                restaurantFeedbackSubmitted(restaurantId, state.rating, state.message);
                analytics.logEvent('restaurant_feedback_submitted_web', { restaurantId, rating: state.rating, messageWritten: state.message && state.message.length > 0 });
            }
        }
    };

    return (
        <Dialog
            className="pop-up-after-restaurant"
            open={afterRestaurantPopUp}
            onClose={hideAfterRestaurantPopUp}
            scroll={scroll}
        >
            <div className="pop-up-after-restaurant-title">
                <p>{`Thank you for visiting ${restaurantName}!`}</p>
                <IconButton onClick={hideAfterRestaurantPopUp}>
                    <CloseRounded className="pop-up-after-restaurant-title-close" />
                </IconButton>
            </div>
            <DialogContent className="pop-up-after-restaurant-content">
                {orderingAllowed
                    ? 'If you would like to pay, have a look at your order again or download your receipt then please scan any QR Code on the table again.'
                    : ''}
            </DialogContent>
            <DialogActions className="pop-up-after-restaurant-actions">
                <Box
                    className="pop-up-after-restaurant-actions-box"
                    component="fieldset"
                    mb={3}
                    borderColor="transparent"
                >
                    <Typography
                        className="pop-up-after-restaurant-actions-box-typography"
                        component="legend"
                    >
                        Please rate your visit!
                    </Typography>
                    <div className="pop-up-after-restaurant-actions-box-rating-and-text">
                        <Rating
                            name="restaurant-rating"
                            className="pop-up-after-restaurant-actions-box-rating"
                            value={state.rating}
                            defaultValue={3}
                            size="large"
                            getLabelText={(value) => { return customIcons[value].label; }}
                            IconContainerComponent={IconContainer}
                            onChange={(event, newValue) => {
                                setStateLocal({ type: 'setRating', rating: newValue });
                            }}
                        />
                    </div>
                </Box>
                <TextField
                    className="pop-up-after-restaurant-actions-message"
                    label="Message for Restaurant?"
                    placeholder="Great food, nice ambience :)"
                    fullWidth
                    multiline
                    variant="filled"
                    value={state.message}
                    onChange={(event) => {
                        setStateLocal({ type: 'setMessage', message: event.target.value });
                    }}
                />
                <Button
                    className="pop-up-after-restaurant-actions-button"
                    type="button"
                    onClick={sumbitFeedback}
                >
                    Submit feedback
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AfterRestaurantPopUp.propTypes = {
    restaurantId: PropTypes.string,
    restaurantName: PropTypes.string,
    orderingAllowed: PropTypes.bool,
    afterRestaurantPopUp: PropTypes.bool.isRequired,
    setState: PropTypes.func.isRequired,
};

AfterRestaurantPopUp.defaultProps = {
    restaurantId: '',
    restaurantName: '',
    orderingAllowed: false,
};

export default React.memo(AfterRestaurantPopUp);
