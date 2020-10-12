/**
 * This class is used as rating screen
 */
import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { TextField } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import Box from '@material-ui/core/Box';
import RatingHeader from './RatingHeader';
import { groakTesting } from '../../../catalog/Others';
import { analytics } from '../../../firebase/FirebaseLibrary';
import { restaurantFeedbackSubmitted } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsAnalytics';
import RatingFooter from './RatingFooter';
import './css/Rating.css';
import CustomerTopic from '../ui/topic/CustomerTopic';
import { fetchRestaurantFeedback, saveRestaurantFeedback } from '../../../catalog/LocalStorage';
import CustomerNotFound from '../ui/notFound/CustomerNotFound';
import { FeedbackMessagePlaceholder, FeedbackSubmitted } from '../../../catalog/Comments';

const initialState = {
    rating: 3,
    rated: false,
    message: '',
    submitted: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'setRating':
            return { ...state, rating: action.rating };
        case 'setMessage':
            return { ...state, message: action.message };
        case 'setSubmitted':
            return { ...state, submitted: action.submitted };
        default:
            return { ...state };
    }
}

const customIcons = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon
            style={{ height: '80px', width: '50px' }}
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

const Covid = (props) => {
    const { restaurantId } = props;
    const [state, setStateLocal] = useReducer(reducer, initialState);
    const { enqueueSnackbar } = useSnackbar();

    const submitFeedback = () => {
        enqueueSnackbar('Thank you for your feedback', { variant: 'success' });
        saveRestaurantFeedback(restaurantId);
        setStateLocal({ type: 'setSubmitted', submitted: true });
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
        <div className="rating">
            <RatingHeader />
            {state.submitted || fetchRestaurantFeedback(restaurantId) ? (
                <div className="content-not-found">
                    <CustomerNotFound text={FeedbackSubmitted} />
                </div>
            ) : (
                <>
                    <div className="content">
                        <CustomerTopic header="Please rate your visit!" />
                        <Box
                            className="ratings-box"
                            component="fieldset"
                            mb={3}
                            borderColor="transparent"
                        >
                            <div className="ratings">
                                <Rating
                                    name="restaurant-rating"
                                    className="rating"
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
                        <CustomerTopic header="Message for Restaurant?" />
                        <div className="ratings-message-wrapper">
                            <TextField
                                className="ratings-message"
                                label="Message for Restaurant?"
                                placeholder={FeedbackMessagePlaceholder}
                                fullWidth
                                multiline
                                rows={4}
                                value={state.message}
                                onChange={(event) => {
                                    setStateLocal({ type: 'setMessage', message: event.target.value });
                                }}
                            />
                        </div>
                    </div>
                    <RatingFooter submitFeedback={submitFeedback} />
                </>
            )}

        </div>
    );
};

Covid.propTypes = {
    restaurantId: PropTypes.string.isRequired,
};

export default React.memo(Covid);
