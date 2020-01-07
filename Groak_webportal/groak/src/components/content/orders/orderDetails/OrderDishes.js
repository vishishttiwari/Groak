/**
 * This component is used to represent the dishes in the order details
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core';

import { getPrice, randomNumber, specialInstructionsId } from '../../../../catalog/Others';
import { getDateTimeFromTimeStamp, getTimeInAMPM } from '../../../../catalog/TimesDates';

const OrderDishes = (props) => {
    const { dishes } = props;

    return (
        <div className="order-dishes">
            {dishes.map((dish) => {
                return (
                    <Card key={randomNumber()} className="card">
                        <CardHeader title={dish.name} subheader={`Ordered at: ${getTimeInAMPM(getDateTimeFromTimeStamp(dish.created))}`} />
                            <CardContent>
                                {dish.extras ? 
                                    dish.extras.map((extra) => {
                                        return (
                                            extra.options && extra.options.length > 0 ? 
                                                <div className="dish-extra" key={randomNumber()}>
                                                    <Typography variant="body1" className="dish-extra-title" color="textPrimary" component="p">
                                                        {extra.title === specialInstructionsId ? "Special Instructions" : extra.title}
                                                    </Typography>
                                                        {extra.options.map((option) => {
                                                            return (
                                                                <Typography key={randomNumber()} className="dish-extra-options" variant="body2" color="textSecondary" component="p">
                                                                    {option.title}
                                                                </Typography>
                                                            )
                                                        })}
                                                </div>
                                            : null
                                        );
                                    }) : null 
                                }
                                <div key={randomNumber()}>
                                    <Typography variant="body1" color="textPrimary" component="p">
                                        Price
                                    </Typography>
                                    <Typography className="dish-price" variant="body2" color="textSecondary" component="p">
                                        {`$${getPrice(dish.price)}`}
                                    </Typography>
                                </div>
                            </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

OrderDishes.propTypes = {
    dishes: PropTypes.array.isRequired,
};

export default React.memo(OrderDishes);
