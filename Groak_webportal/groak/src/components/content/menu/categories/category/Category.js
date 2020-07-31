/**
 * This component is used to represent each category card in dishes
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Typography, CardActions, Button } from '@material-ui/core';

import { getTimeInAMPMFromMinutesComplete } from '../../../../../catalog/TimesDates';

const Category = (props) => {
    const { categoryItem, availableCategoryHandler, clickHandler } = props;

    return (
        <Card className="card card-white" onClick={clickHandler}>
            <CardHeader
                title={categoryItem.name}
                subheader={`Includes ${categoryItem.dishes.length} ${categoryItem.dishes.length <= 1 ? 'dish' : 'dishes'} `}
            />
            <CardContent>
                <Typography variant="body1" color="textPrimary" component="p">
                    Timings:
                </Typography>
                <Typography
                    className="subtopics"
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
                            className="subtopics"
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            {day}
                        </Typography>
                    );
                })}
            </CardContent>
            <CardActions className="actions actions-vertical">
                <Button
                    className={categoryItem.available ? 'normal-buttons buttons' : 'cancel-buttons buttons'}
                    variant="contained"
                    onClick={(event) => {
                        event.stopPropagation();
                        categoryItem.available = !categoryItem.available;
                        availableCategoryHandler(categoryItem);
                    }}
                >
                    {categoryItem.available ? 'Available' : 'Unavailable'}
                </Button>
            </CardActions>
        </Card>
    );
};

Category.propTypes = {
    categoryItem: PropTypes.object.isRequired,
    availableCategoryHandler: PropTypes.func.isRequired,
    clickHandler: PropTypes.func.isRequired,
};

export default React.memo(Category);
