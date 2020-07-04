/**
 * This component is used to represent each dish card in customerMenu
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardMedia, CardContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import NoImage from '../../assets/icons/camera.png';

const CustomerMenuDishItem = (props) => {
    const { dishItem } = props;

    return (
        <Card className="card">
            <CardHeader
                title={dishItem.name}
                subheader={`$ ${dishItem.price.toFixed(2)}`}
            />
            {dishItem.image ? (
                <CardMedia
                    className="media"
                    image={(dishItem.image) ? dishItem.image : NoImage}
                    title={dishItem.name}
                />
            ) : null}
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {dishItem.shortInfo}
                </Typography>
            </CardContent>
        </Card>
    );
};

CustomerMenuDishItem.propTypes = {
    dishItem: PropTypes.object.isRequired,
};

export default React.memo(CustomerMenuDishItem);
