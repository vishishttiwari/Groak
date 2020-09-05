/**
 * This component is used to implement the days part of dish details
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { FormControlLabel, Checkbox, TextField } from '@material-ui/core';
import { CheckBox } from '@material-ui/icons';
import { getTimeIn24FromMinutes } from '../../../../catalog/TimesDates';
import { TextFieldLabelStyles, textFieldLabelPropsShrink } from '../../../../catalog/Others';

const CategoryDays = (props) => {
    const { classes, days, startTime, endTime, setState } = props;

    /**
     * This function changes the status of days in the state depending on if the check box is checked
     *
     * @param {*} event this tells if the checkbox is checked or not checked
     * @param {*} day this tells which day is being checked/unchecked
     */
    const checked = (event, day) => {
        const updatedDays = { ...days };
        updatedDays[day] = event.target.checked;
        setState({ type: 'setDays', days: updatedDays });
    };

    /**
     * This function is called when the start time is changed
     *
     * @param {*} event contains the new time
     */
    const startTimeChangeHandler = (event, dayUpdated) => {
        const newStartTime = { ...startTime };
        newStartTime[dayUpdated] = parseFloat(event.target.value.substring(0, 2)) * 60 + parseFloat(event.target.value.substring(3));
        setState({
            type: 'setStartTime',
            startTime: newStartTime,
        });
    };

    /**
     * This function is called when the end time is changed
     *
     * @param {*} event contains the new time
     */
    const endTimeChangeHandler = (event, dayUpdated) => {
        const newEndTime = { ...endTime };
        newEndTime[dayUpdated] = parseFloat(event.target.value.substring(0, 2)) * 60 + parseFloat(event.target.value.substring(3));
        setState({
            type: 'setEndTime',
            endTime: newEndTime,
        });
    };

    return (
        <div className="category-days">
            <h2>Active Days and Timings:</h2>
            <div className="days">
                {Object.keys(days).map((day) => {
                    return (
                        <div className="day" key={day}>
                            <FormControlLabel
                                style={{ textTransform: 'capitalize', width: '150px' }}

                                control={(
                                    <Checkbox
                                        className="check-box"
                                        checkedIcon={<CheckBox className="check-box" />}
                                        checked={days[day]}
                                        onChange={(event) => { checked(event, day); }}
                                    />
                                )}
                                label={day}
                            />
                            <TextField
                                style={{ marginLeft: 10 }}
                                label="Start Time"
                                type="time"
                                variant="outlined"
                                margin="normal"
                                value={getTimeIn24FromMinutes(startTime[day])}
                                onChange={(event) => { startTimeChangeHandler(event, day); }}
                                InputLabelProps={textFieldLabelPropsShrink(classes)}
                                inputProps={{ step: 300 }}
                            />
                            <TextField
                                style={{ marginLeft: 10 }}
                                label="End Time"
                                type="time"
                                variant="outlined"
                                margin="normal"
                                value={getTimeIn24FromMinutes(endTime[day])}
                                onChange={(event) => { endTimeChangeHandler(event, day); }}
                                InputLabelProps={textFieldLabelPropsShrink(classes)}
                                inputProps={{ step: 300 }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

CategoryDays.propTypes = {
    classes: PropTypes.object.isRequired,
    days: PropTypes.object.isRequired,
    startTime: PropTypes.object.isRequired,
    endTime: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(withStyles(TextFieldLabelStyles)(CategoryDays));
