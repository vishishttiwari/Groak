/**
 * This component is used to represent the buttons and server time and comments card on the order details page
 */
import React, { useState, useEffect, useContext, createRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import { Button, Card, CardHeader, CardContent, Typography, TextField, InputAdornment, IconButton } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { context } from '../../../../globalState/globalState';
import { updateOrderAPI, updateRequestAPI } from '../OrdersAPICalls';
import styles from '../../../../globalCSS/_globalCSS.scss';
import SureImage from '../../../../assets/icons/suggestions/sure1.png';
import WeHaveImage from '../../../../assets/icons/suggestions/weHave1.png';
import WeDontHaveImage from '../../../../assets/icons/suggestions/weDontHave1.png';
import ComeImage from '../../../../assets/icons/suggestions/come.png';
import GetImage from '../../../../assets/icons/suggestions/get.png';

import { getCurrentDateTime, getTimeInAMPM, getCurrentDateTimePlusMinutes, differenceInMinutesFromNow, getTimeInAMPMFromTimeStamp } from '../../../../catalog/TimesDates';
import { randomNumber, calculatePriceFromDishes, calculateSalesTaxFromDishes, calculatePriceFromDishesWithTax, getPrice, TextFieldLabelStyles, textFieldLabelProps, TableStatus } from '../../../../catalog/Others';


const OrderOthers = (props) => {
    const { history, classes, orderId, status, comments, request, dishes, serveTimeFromServer } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [serveTime, setServeTime] = useState(30);
    const [requestReply, setRequestReply] = useState('');
    const { globalState } = useContext(context);

    // This ref is for the text field for comments for scrolling at the bottom
    const requestEndRef = createRef()

    const suggestionsImage = {
        sure: SureImage,
        weHave: WeHaveImage,
        weDontHave: WeDontHaveImage,
        come: ComeImage,
        get: GetImage,
    };

    const suggestions = {
        sure: "Sure, got it. We will get this done.",
        weHave: "We do have that",
        weDontHave: "Unfortunately, we dont have that",
        come: "A waiter is on their way to your table.",
        get: "Sure, we will get it to your table right away.",
    };

    useEffect(() => {
        if (serveTimeFromServer && serveTimeFromServer.seconds)
            setServeTime(differenceInMinutesFromNow(serveTimeFromServer));
    }, [serveTimeFromServer]);

    useEffect(() => {
        if (request && request.length > 0)
            requestEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    }, [request, requestEndRef]);

    /**
     * This function is used for getting time in AM PM from time stamp as it is received from the server.
     */
    function getServeTime() {
        return getTimeInAMPM(getCurrentDateTimePlusMinutes(serveTime));
    }

    /**
     * This function is called when the time is changed. It does not allow
     * the minutes to be less than 0 or more than 180 mins
     *
     * @param {*} event contains the new minutes
     */
    const timeChangeHandler = (event) => {
        if (event.target.value.length <= 0) {
            setServeTime(0);
        } else if (event.target.value <= 0) {
            setServeTime(0);
        } else if (event.target.value >= 180) {
            setServeTime(0);
        } else {
            setServeTime(parseFloat(event.target.value));
        }
    };

    /**
     * This function is used to update the serverTime
     *
     * @param {*} serveTime this is the new Serve Time
     */
    const setServeTimeHandler = async () => {
        const serveDate = getCurrentDateTimePlusMinutes(serveTime);
        const data = { serveTime: serveDate, status: TableStatus.approved };
        history.goBack();
        await updateOrderAPI(globalState.restaurantId, orderId, data, enqueueSnackbar);
    };

    /**
     * This function is used change the status to approve without changing serve time
     *
     */
    const setApprovedHandler = async () => {
        const data = { status: TableStatus.approved };
        history.goBack();
        await updateOrderAPI(globalState.restaurantId, orderId, data, enqueueSnackbar);
    };

    /**
     * This function is used for going back
     */
    const goBackHandler = async () => {
        history.goBack();
    };

    /**
     * This function is called when the served button is clicked on table
     *
     * @param {*} event contains action of the button
     * @param {*} id order for which srrved was used
     */
    const servedClickHandler = async () => {
        const data = { status: TableStatus.served };
        history.goBack();
        await updateOrderAPI(globalState.restaurantId, orderId, data, enqueueSnackbar);
    };

    /**
     * This function is for deleting an order by changing the status at table to available
     */
    const makeAvailableHandler = async () => {
        const data = { status: TableStatus.available };
        history.goBack();
        await updateOrderAPI(globalState.restaurantId, orderId, data, enqueueSnackbar);
    };

    const sendRequest = async () => {
        const requests = [...request, { created: getCurrentDateTime(), request: requestReply, createdByUser: false }];
        const data = { requests: requests };
        await updateRequestAPI(globalState.restaurantId, orderId, data, enqueueSnackbar)
        setRequestReply('')
    }

    return (
        <div className="order-others">
            {status === TableStatus.payment ? (
                <Button
                    className="success-buttons"
                    variant="contained"
                    onClick={makeAvailableHandler}
                >
                    Paid
                </Button>
            ) : null}
            {status === TableStatus.approved ? (
                <Button
                    className="success-buttons"
                    variant="contained"
                    onClick={servedClickHandler}
                >
                    Served
                </Button>
            ) : null}
            <Button
                className="cancel-buttons"
                variant="contained"
                onClick={goBackHandler}
            >
                Go Back
            </Button>
            {status === TableStatus.ordered ? (
                <Button
                    className="success-buttons"
                    variant="contained"
                    onClick={setApprovedHandler}
                >
                    Approve
                </Button>
            ) : null}
            {status === TableStatus.ordered || status === TableStatus.approved ? (
                <>
                    <Button
                        className="success-buttons"
                        variant="contained"
                        onClick={setServeTimeHandler}
                    >
                        Set Serve Time
                    </Button>
                    <Card className="card">
                        <CardHeader
                            title="Serve Time"
                        />
                        <CardContent>
                            <Typography
                                variant="body1"
                                color="textPrimary"
                                component="p"
                            >
                                {getServeTime()}
                            </Typography>
                            <TextField
                                label="Serve in"
                                type="number"
                                placeholder="Ex: 20"
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                error={serveTime <= 0 || serveTime >= 180}
                                value={serveTime}
                                onChange={(event) => { timeChangeHandler(event); }}
                                InputLabelProps={textFieldLabelProps(classes)}
                                InputProps={{ endAdornment: <InputAdornment position="end">mins</InputAdornment> }}
                            />
                        </CardContent>
                    </Card>
                </>
            ) : null}
            {request ? (
                <Card className="card">
                    <CardHeader
                        title="Special Requests"
                    />
                    <CardContent style={{maxHeight: 300, overflow: 'auto'}}>
                        {request.map((request) => {
                            return (
                                <div className="comment" key={randomNumber()} 
                                    style={request.createdByUser ? 
                                        {marginLeft: 'auto', marginRight: '5px', color: 'black', backgroundColor: styles.secondaryColor} : 
                                        {marginLeft: '5px', marginRight: 'auto', color: 'white', backgroundColor: styles.primaryColor}}>
                                    <p className="comment-comment">{request.request}</p>
                                    <p className="comment-created">{getTimeInAMPMFromTimeStamp(request.created)}</p>
                                </div>
                            );
                        })}
                        <TextField
                            label="Your reply"
                            type="text"
                            placeholder="Sure, we will get that to you"
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            value={requestReply}
                            onChange={(event) => { setRequestReply(event.target.value); }}
                            InputProps={{
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <IconButton onClick={() => {sendRequest()}} >
                                        <Send />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                        />
                        <div className="suggestions" ref={requestEndRef}>
                            {Object.keys(suggestions).map((suggestion) => {
                                return (
                                    <div className="suggestion" key={randomNumber()} onClick={() => {setRequestReply(suggestions[suggestion]); }}>
                                        <img draggable="false" className="suggestion-suggestion" src={suggestionsImage[suggestion]} alt={suggestions[suggestion]} />
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            ) : null}
            {comments ? (
                <Card className="card">
                    <CardHeader
                        title="Comments"
                    />
                    <CardContent>
                        {comments.map((comment) => {
                            return (
                                <div key={randomNumber()}>
                                    <Typography
                                        variant="body1"
                                        color="textPrimary"
                                        component="p"
                                    >
                                        {comment.comment}
                                    </Typography>
                                    <Typography
                                        className="sub-header"
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                    >
                                        {`Commented at: ${getTimeInAMPMFromTimeStamp(comment.created)}`}
                                    </Typography>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            ) : null}
            <Card className="card">
                <CardHeader
                    title="Total"
                    subheader={`$${calculatePriceFromDishes(dishes)} + $${calculateSalesTaxFromDishes(dishes, globalState.restaurant.salesTax)} = $${calculatePriceFromDishesWithTax(dishes, globalState.restaurant.salesTax)}`}
                />
                <CardContent>
                    {dishes.map((dish) => {
                        return (
                            <div key={randomNumber()}>
                                <Typography
                                    variant="body1"
                                    color="textPrimary"
                                    component="p"
                                >
                                    {dish.name}
                                </Typography>
                                <Typography
                                    className="price"
                                    variant="body2"
                                    color="textSecondary"
                                    component="p"
                                >
                                    {`$${getPrice(dish.price)}`}
                                </Typography>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
            <Button
                className="delete-buttons"
                variant="contained"
                onClick={makeAvailableHandler}
            >
                Make Table Available
            </Button>
        </div>
    );
};

OrderOthers.propTypes = {
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    orderId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    requests: PropTypes.array,
    dishes: PropTypes.array.isRequired,
    serveTimeFromServer: PropTypes.object,
};

OrderOthers.defaultProps = {
    serveTimeFromServer: {},
    requests: []
};

export default withRouter(React.memo(withStyles(TextFieldLabelStyles)(OrderOthers)));
