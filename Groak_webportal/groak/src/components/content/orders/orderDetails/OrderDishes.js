/**
 * This component is used to represent the dishes in the order details
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core';

import { getPrice, randomNumber } from '../../../../catalog/Others';
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
                                    Object.keys(dish.extras).map((extra) => {
                                        return (
                                            <div key={randomNumber()}>
                                                <Typography variant="body1" color="textPrimary" component="p">
                                                    {extra}
                                                </Typography>
                                                <Typography className="sub-header" variant="body2" color="textSecondary" component="p">
                                                    {dish.extras[extra]}
                                                </Typography>
                                            </div>
                                        );
                                    }) : null }
                                    <div key={randomNumber()}>
                                        <Typography variant="body1" color="textPrimary" component="p">
                                            Price
                                        </Typography>
                                        <Typography className="sub-header" variant="body2" color="textSecondary" component="p">
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
