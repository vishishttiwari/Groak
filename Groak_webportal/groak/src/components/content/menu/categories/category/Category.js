/**
 * This component is used to represent each category card in dishes
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Typography, CardActions, Button, IconButton } from '@material-ui/core';
import { ArrowForwardRounded, ArrowBackRounded } from '@material-ui/icons';

import { getTimeInAMPMFromMinutesComplete } from '../../../../../catalog/TimesDates';

const Category = (props) => {
    const { categoryItem, availableCategoryHandler, clickHandler, index, movePrior, moveNext } = props;

    return (
        <Card className="card" onClick={clickHandler}>
            <CardHeader
                title={categoryItem.name}
                subheader={`Includes ${categoryItem.dishes.length} ${categoryItem.dishes.length <= 1 ? 'dish' : 'dishes'} `}
            />
            <CardContent>
                <Typography variant="body1" color="textPrimary" component="p">
                    Timings:
                </Typography>
                <Typography
                    className="days-time"
                    variant="body2"
                    color="textSecondary"
                    component="p"
                >
                    {`${getTimeInAMPMFromMinutesComplete(categoryItem.startTime)} - ${getTimeInAMPMFromMinutesComplete(categoryItem.endTime)}`}
                </Typography>
                <Typography variant="body1" color="textPrimary" component="p">
                    Days Active:
                </Typography>
                {categoryItem.days.map((day) => {
                    return (
                        <Typography
                            key={day}
                            className="days-time"
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            {day}
                        </Typography>
                    );
                })}
            </CardContent>
            <CardActions className="actions">
                <IconButton
                    onClick={(event) => { movePrior(event, categoryItem.order, index); }}
                >
                    <ArrowBackRounded />
                </IconButton>
                <Button
                    className={categoryItem.available ? 'normal-buttons' : 'cancel-buttons'}
                    variant="contained"
                    onClick={(event) => {
                        event.stopPropagation();
                        categoryItem.available = !categoryItem.available;
                        availableCategoryHandler(categoryItem);
                    }}
                >
                    {categoryItem.available ? 'Available' : 'Unavailable'}
                </Button>
                <IconButton
                    onClick={(event) => { moveNext(event, categoryItem.order, index); }}
                >
                    <ArrowForwardRounded />
                </IconButton>
            </CardActions>
        </Card>
    );
};

Category.propTypes = {
    categoryItem: PropTypes.object.isRequired,
    availableCategoryHandler: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    clickHandler: PropTypes.func.isRequired,
    movePrior: PropTypes.func.isRequired,
    moveNext: PropTypes.func.isRequired,
};

export default React.memo(Category);
