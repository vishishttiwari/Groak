/**
 * This component is used to represent each category card in dishes
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Typography, CardActions, Checkbox } from '@material-ui/core';
import { CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';

import { getTimeInAMPMFromMinutesComplete } from '../../../../catalog/TimesDates';

const Category = (props) => {
    const { categoryItem, alreadyChecked, checkCategoryHandler, clickHandler } = props;

    return (
        <Card className="card card-gray" onClick={clickHandler}>
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
                <Checkbox
                    className="check-box"
                    icon={<CheckBoxOutlineBlank fontSize="large" />}
                    checkedIcon={<CheckBox className="check-box" fontSize="large" />}
                    checked={alreadyChecked}
                    onChange={(event) => { checkCategoryHandler(event, categoryItem.reference.path); }}
                    onClick={(event) => { event.stopPropagation(); }}
                />
            </CardActions>
        </Card>
    );
};

Category.propTypes = {
    categoryItem: PropTypes.object.isRequired,
    alreadyChecked: PropTypes.bool.isRequired,
    checkCategoryHandler: PropTypes.func.isRequired,
    clickHandler: PropTypes.func.isRequired,
};

export default React.memo(Category);
