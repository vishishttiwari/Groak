/**
 * This component is used to represent the dishes in the order details
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core';

import { randomNumber } from '../../../../catalog/Others';
import { getDateTimeFromTimeStamp, getTimeInAMPM } from '../../../../catalog/TimesDates';

const OrderDishes = (props) => {
    const { dishes } = props;

    return (
        <div className="order-dishes">
            {dishes.map((dish) => {
                return (
                    <Card key={randomNumber()} className="card">
                        <CardHeader title={dish.name} subheader={`Ordered at: ${getTimeInAMPM(getDateTimeFromTimeStamp(dish.created))}`} />
                        {dish.comments ? (
                            <CardContent>
                                {Object.keys(dish.comments).map((comment) => {
                                    return (
                                        <div key={randomNumber()}>
                                            <Typography variant="body1" color="textPrimary" component="p">
                                                {comment}
                                            </Typography>
                                            <Typography className="sub-header" variant="body2" color="textSecondary" component="p">
                                                {dish.comments[comment]}
                                            </Typography>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        ) : null}
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
