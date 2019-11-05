/**
 * This component is used to implement the days part of dish details
 */
import React from 'react';
import PropTypes from 'prop-types';

import { FormControlLabel, Checkbox } from '@material-ui/core';
import { CheckBox } from '@material-ui/icons';

const CategoryDays = (props) => {
    const { days, setState } = props;

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

    return (
        <div className="category-days">
            <h2>Active Days:</h2>
            <div className="days">
                {Object.keys(days).map((day) => {
                    return (
                        <FormControlLabel
                            style={{ textTransform: 'capitalize' }}
                            key={day}
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
                    );
                })}
            </div>
        </div>
    );
};

CategoryDays.propTypes = {
    days: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(CategoryDays);
