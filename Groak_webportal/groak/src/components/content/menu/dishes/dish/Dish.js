/**
 * This component is used to represent each dish card in dishes
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import NoImage from '../../../../../assets/icons/camera.png';

const Dish = (props) => {
    const { dishItem, availableDishHandler, clickHandler } = props;

    return (
        <Card className="card card-white" onClick={clickHandler}>
            <CardHeader
                title={dishItem.name}
                subheader={`$ ${dishItem.price.toFixed(2)}`}
            />
            <CardMedia
                className="media"
                image={(dishItem.image) ? dishItem.image : NoImage}
                title={dishItem.name}
                onError={(e) => {
                    setTimeout(() => {
                        e.target.src = (dishItem.image) ? dishItem.image : NoImage;
                    }, 5000);
                }}
            />
            <CardContent onClick={clickHandler}>
                <Typography variant="body2" color="textSecondary" component="p">
                    {dishItem.shortInfo}
                </Typography>
            </CardContent>
            <CardActions className="actions actions-vertical">
                <Button
                    variant="contained"
                    className={dishItem.available ? 'normal-buttons buttons' : 'cancel-buttons buttons'}
                    onClick={(event) => {
                        event.stopPropagation();
                        dishItem.available = !dishItem.available;
                        availableDishHandler(dishItem);
                    }}
                >
                    {dishItem.available ? 'Available' : 'Unavailable'}
                </Button>
            </CardActions>
        </Card>
    );
};

Dish.propTypes = {
    dishItem: PropTypes.object.isRequired,
    availableDishHandler: PropTypes.func.isRequired,
    clickHandler: PropTypes.func.isRequired,
};

export default React.memo(Dish);
