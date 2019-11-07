/**
 * This component is used to represent the buttons and server time and comments card on the order details page
 */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import { Button, Card, CardHeader, CardContent, Typography, TextField, InputAdornment } from '@material-ui/core';
import { context } from '../../../../globalState/globalState';
import { updateOrderAPI } from '../OrdersAPICalls';

import { getTimeInAMPM, getCurrentDateTimePlusMinutes, differenceInMinutesFromNow, getTimeInAMPMFromTimeStamp } from '../../../../catalog/TimesDates';
import { randomNumber, calculateCostFromDishes, TextFieldLabelStyles, textFieldLabelProps, TableStatus } from '../../../../catalog/Others';


const OrderOthers = (props) => {
    const { history, classes, orderId, status, comments, requests, dishes, serveTimeFromServer } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [serveTime, setServeTime] = useState(30);
    const { globalState } = useContext(context);

    useEffect(() => {
        if (serveTimeFromServer && serveTimeFromServer.seconds) {
            setServeTime(differenceInMinutesFromNow(serveTimeFromServer));
        }
    }, [serveTimeFromServer]);

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

    return (
        <div className="order-others">
            <Button
                className="success-buttons"
                variant="contained"
                onClick={setServeTimeHandler}
            >
                Set Serve Time
            </Button>
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
            {status === TableStatus.ordered || status === TableStatus.updated || status === TableStatus.requested || status === TableStatus.approved ? (
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
            {requests ? (
                <Card className="card">
                    <CardHeader
                        title="Special Requests"
                    />
                    <CardContent>
                        {requests.map((request) => {
                            return (
                                <div key={randomNumber()}>
                                    <Typography
                                        variant="body1"
                                        color="textPrimary"
                                        component="p"
                                    >
                                        {request.request}
                                    </Typography>
                                    <Typography
                                        className="sub-header"
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                    >
                                        {`Requested at: ${getTimeInAMPMFromTimeStamp(request.created)}`}
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
                    subheader={`$${calculateCostFromDishes(dishes)}`}
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
                                    {`$${dish.price}`}
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
    requests: PropTypes.array.isRequired,
    dishes: PropTypes.array.isRequired,
    serveTimeFromServer: PropTypes.object,
};

OrderOthers.defaultProps = {
    serveTimeFromServer: {},
};

export default withRouter(React.memo(withStyles(TextFieldLabelStyles)(OrderOthers)));
