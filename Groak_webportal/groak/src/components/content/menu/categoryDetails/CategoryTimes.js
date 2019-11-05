/**
 * This componnet is used to represent the start time and end time in categories details
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { TextField } from '@material-ui/core';
import { getTimeIn24FromMinutes } from '../../../../catalog/TimesDates';
import { TextFieldLabelStyles, textFieldLabelPropsShrink } from '../../../../catalog/Others';

const CategoryTimes = (props) => {
    const { classes, startTime, endTime, setState } = props;

    /**
     * This function is called when the start time is changed
     *
     * @param {*} event contains the new time
     */
    const startTimeChangeHandler = (event) => {
        setState({
            type: 'setStartTime',
            startTime: parseFloat(event.target.value.substring(0, 2)) * 60 + parseFloat(event.target.value.substring(3)),
        });
    };

    /**
     * This function is called when the end time is changed
     *
     * @param {*} event contains the new time
     */
    const endTimeChangeHandler = (event) => {
        setState({
            type: 'setEndTime',
            endTime: parseFloat(event.target.value.substring(0, 2)) * 60 + parseFloat(event.target.value.substring(3)),
        });
    };

    return (
        <div className="category-times">
            <h2>Timings:</h2>
            <div className="times">
                <TextField
                    style={{ marginLeft: 10 }}
                    label="Start Time"
                    type="time"
                    variant="outlined"
                    margin="normal"
                    value={getTimeIn24FromMinutes(startTime)}
                    onChange={startTimeChangeHandler}
                    InputLabelProps={textFieldLabelPropsShrink(classes)}
                    inputProps={{ step: 300 }}
                />
                <TextField
                    style={{ marginLeft: 10 }}
                    label="End Time"
                    type="time"
                    variant="outlined"
                    margin="normal"
                    value={getTimeIn24FromMinutes(endTime)}
                    onChange={endTimeChangeHandler}
                    InputLabelProps={textFieldLabelPropsShrink(classes)}
                    inputProps={{ step: 300 }}
                />
            </div>
        </div>
    );
};

CategoryTimes.propTypes = {
    classes: PropTypes.object.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(withStyles(TextFieldLabelStyles)(CategoryTimes));
