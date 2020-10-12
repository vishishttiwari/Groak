/**
 * Used for representing dish cell in order
 */
import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import './css/Order.css';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import { showExtras, getPrice, groakTesting } from '../../../catalog/Others';
import { fetchLikedImages, saveLikedDishes } from '../../../catalog/LocalStorage';
import { dishLikedFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsAnalytics';
import { analytics } from '../../../firebase/FirebaseLibrary';

const initialState = {
    responded: false,
    liked: false,
    disliked: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'likedTrue':
            return { ...state, liked: true, disliked: false, responded: true };
        case 'likedFalse':
            return { ...state, liked: false };
        case 'disLikedTrue':
            return { ...state, disliked: true, liked: false, responded: true };
        case 'disLikedFalse':
            return { ...state, disliked: false };
        default:
            return initialState;
    }
}

const OrderDishCell = (props) => {
    const { restaurantId, dishId, name, price, quantity, extras, localBadge, created, showLikes, ratingAllowedCustomer } = props;
    const [state, setState] = useReducer(reducer, initialState);

    useEffect(() => {
        const like = fetchLikedImages(restaurantId, dishId);
        if (like !== null) {
            if (like) {
                setState({ type: 'likedTrue' });
            } else {
                setState({ type: 'disLikedTrue' });
            }
        }
    }, []);

    const liked = () => {
        if (state.liked) {
            setState({ type: 'likedFalse' });
        } else {
            setState({ type: 'likedTrue' });
            if (groakTesting) {
                analytics.logEvent('dish_liked_web_testing', { restaurantId, dishId, like: true });
            } else {
                saveLikedDishes(restaurantId, dishId, true);
                dishLikedFirestoreAPI(restaurantId, dishId, true);
                analytics.logEvent('dish_liked_web', { restaurantId, dishId, like: true });
            }
        }
    };

    const disLiked = () => {
        if (state.disliked) {
            setState({ type: 'disLikedFalse' });
        } else {
            setState({ type: 'disLikedTrue' });
            if (groakTesting) {
                analytics.logEvent('dish_liked_web_testing', { restaurantId, dishId, like: false });
            } else {
                saveLikedDishes(restaurantId, dishId, false);
                dishLikedFirestoreAPI(restaurantId, dishId, false);
                analytics.logEvent('dish_liked_web', { restaurantId, dishId, like: false });
            }
        }
    };

    return (
        <div className="order-dish-cell">
            <div className="order-dish-cell-content">
                <p className="order-dish-cell-quantity">{quantity}</p>
                <p className="order-dish-cell-name">{name}</p>
                <p className="order-dish-cell-price">{getPrice(price)}</p>
            </div>
            <p className="order-dish-cell-extras">{showExtras(extras, true)}</p>
            <div className="order-dish-cell-content-1">
                {localBadge ? <p className="order-dish-cell-local-badge">Your Order</p> : null}
                <p className="order-dish-cell-created">{created}</p>
            </div>
            {showLikes && ratingAllowedCustomer ? (
                <div className="order-dish-cell-content-2">
                    {state.responded
                        ? (
                            <>
                                <p className="order-dish-cell-like-text">Thank you for your feedback!</p>
                                {state.liked ? (
                                    <ThumbUpRoundedIcon
                                        className="order-dish-cell-like-symbol-clicked-done"
                                    />
                                ) : (
                                    <ThumbDownRoundedIcon
                                        className="order-dish-cell-like-symbol-clicked-done"
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                <p className="order-dish-cell-like-text">Liked it?</p>
                                <div className="order-dish-cell-like-symbols">
                                    {state.liked ? (
                                        <ThumbUpRoundedIcon
                                            onClick={liked}
                                            className="order-dish-cell-like-symbol-clicked"
                                        />
                                    ) : (
                                        <ThumbUpOutlinedIcon
                                            onClick={liked}
                                            className="order-dish-cell-like-symbol"
                                        />
                                    )}
                                    {state.disliked ? (
                                        <ThumbDownRoundedIcon
                                            onClick={disLiked}
                                            className="order-dish-cell-like-symbol-clicked"
                                        />
                                    ) : (
                                        <ThumbDownOutlinedIcon
                                            onClick={disLiked}
                                            className="order-dish-cell-like-symbol"
                                        />
                                    )}
                                </div>
                            </>
                        )}

                </div>
            ) : null}

        </div>
    );
};

OrderDishCell.propTypes = {
    restaurantId: PropTypes.string,
    dishId: PropTypes.string,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    extras: PropTypes.array.isRequired,
    localBadge: PropTypes.bool.isRequired,
    created: PropTypes.string.isRequired,
    showLikes: PropTypes.bool,
    ratingAllowedCustomer: PropTypes.bool,
};

OrderDishCell.defaultProps = {
    restaurantId: '',
    dishId: '',
    showLikes: false,
    ratingAllowedCustomer: false,
};

export default React.memo(OrderDishCell);
