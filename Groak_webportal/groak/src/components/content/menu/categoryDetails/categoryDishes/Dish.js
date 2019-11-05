/**
 * This component is used to represent the selected dish cards in dish details
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardMedia, CardActions, Checkbox, IconButton } from '@material-ui/core';
import { CheckBox, CheckBoxOutlineBlank, ArrowBackRounded, ArrowForwardRounded } from '@material-ui/icons';

import NoImage from '../../../../../assets/icons/camera.png';

const Dish = (props) => {
    const { dishItem, index, alreadyChecked, checkDishHandler, arrows, moveDishPrior, moveDishNext } = props;

    return (
        dishItem ? (
            <Card className="card">
                <CardHeader
                    title={dishItem.name}
                    subheader={`$ ${dishItem.price}`}
                />
                <CardMedia
                    className="media"
                    image={(dishItem.image) ? dishItem.image : NoImage}
                    title={dishItem.name}
                />
                <CardActions className="actions">
                    {arrows ? (
                        <IconButton onClick={() => { moveDishPrior(index); }}>
                            <ArrowBackRounded />
                        </IconButton>
                    ) : null}
                    <Checkbox
                        className="check-box"
                        icon={<CheckBoxOutlineBlank fontSize="large" />}
                        checkedIcon={<CheckBox className="check-box" fontSize="large" />}
                        checked={alreadyChecked}
                        onChange={(event) => { checkDishHandler(event, dishItem.id); }}
                    />
                    {arrows ? (
                        <IconButton onClick={() => { moveDishNext(index); }}>
                            <ArrowForwardRounded />
                        </IconButton>
                    ) : null}
                </CardActions>
            </Card>
        ) : null
    );
};

Dish.propTypes = {
    dishItem: PropTypes.object,
    index: PropTypes.number,
    alreadyChecked: PropTypes.bool.isRequired,
    checkDishHandler: PropTypes.func.isRequired,
    arrows: PropTypes.bool.isRequired,
    moveDishPrior: PropTypes.func,
    moveDishNext: PropTypes.func,
};

Dish.defaultProps = {
    dishItem: null,
    index: -1,
    moveDishPrior: () => {},
    moveDishNext: () => {},
};

export default React.memo(Dish);
