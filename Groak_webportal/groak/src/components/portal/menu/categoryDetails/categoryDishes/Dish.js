/**
 * This component is used to represent the selected dish cards in dish details
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardMedia, CardActions, Checkbox } from '@material-ui/core';
import { CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';

import NoImage from '../../../../../assets/icons/camera.png';
import { getPrice } from '../../../../../catalog/Others';

const Dish = (props) => {
    const { dishItem, alreadyChecked, checkDishHandler, clickHandler } = props;

    return (
        dishItem ? (
            <Card className="card card-gray" onClick={clickHandler}>
                <CardHeader
                    title={dishItem.name}
                    subheader={getPrice(dishItem.price)}
                />
                <CardMedia
                    className="media"
                    image={(dishItem.image) ? dishItem.image : NoImage}
                    title={dishItem.name}
                />
                <CardActions className="actions actions-vertical">
                    <Checkbox
                        className="check-box"
                        icon={<CheckBoxOutlineBlank fontSize="large" />}
                        checkedIcon={<CheckBox className="check-box" fontSize="large" />}
                        checked={alreadyChecked}
                        onChange={(event) => { checkDishHandler(event, dishItem.reference.path); }}
                        onClick={(event) => { event.stopPropagation(); }}
                    />
                </CardActions>
            </Card>
        ) : null
    );
};

Dish.propTypes = {
    dishItem: PropTypes.object,
    alreadyChecked: PropTypes.bool.isRequired,
    checkDishHandler: PropTypes.func.isRequired,
    clickHandler: PropTypes.func.isRequired,
};

Dish.defaultProps = {
    dishItem: null,
};

export default React.memo(Dish);
