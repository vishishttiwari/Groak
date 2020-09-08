/**
 * This component is used to represent the dishes in the order details
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Typography, CardActions, Button } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { context } from '../../../../globalState/globalState';

import { getPrice, randomNumber, showExtras } from '../../../../catalog/Others';
import { getDateTimeFromTimeStamp, getTimeInAMPM } from '../../../../catalog/TimesDates';
import { updateOrderAPI } from '../OrdersAPICalls';

const OrderDishes = (props) => {
    const { dishes, orderId, status } = props;
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    /**
     * This function is called when the delete dish button is called for each order dish
     *
     * @param {*} event contains action of the button
     * @param {*} id order for which served was used
     */
    const deleteClickHandler = async (index) => {
        const updatedDishes = [...dishes];
        updatedDishes.splice(index, 1);
        const data = { dishes: updatedDishes, items: updatedDishes.length, status };
        await updateOrderAPI(globalState.restaurantIdPortal, orderId, data, enqueueSnackbar);
    };

    return (
        <div className="order-dishes">
            {dishes.map((dish, index) => {
                return (
                    <Card key={randomNumber()} className="card">
                        <CardHeader title={`${dish.quantity} ${dish.name}`} subheader={`Ordered at: ${getTimeInAMPM(getDateTimeFromTimeStamp(dish.created))}`} />
                        <CardContent className="card-content">
                            {dish.extras
                                ? showExtras(dish.extras, true)
                                : null}
                        </CardContent>
                        <CardActions className="actions">
                            <Typography className="dish-price" variant="body1" color="textPrimary" component="p">
                                {`Price: ${getPrice(dish.price)}`}
                            </Typography>
                            <Button
                                variant="contained"
                                className="cancel-buttons"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    deleteClickHandler(index);
                                }}
                            >
                                Delete
                            </Button>
                        </CardActions>
                    </Card>
                );
            })}
        </div>
    );
};

OrderDishes.propTypes = {
    dishes: PropTypes.array.isRequired,
    orderId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
};

export default React.memo(OrderDishes);
