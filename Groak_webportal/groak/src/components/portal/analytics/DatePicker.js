/**
 * This component is used for the date picker part on the analytics page
 */
import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker } from '@matharumanpreet00/react-daterange-picker';
import './css/Analytics.css';
import { Button, Select } from '@material-ui/core';
import { getCurrentDateTime, getDateInStringFormat } from '../../../catalog/TimesDates';

const initialState = { dateRangeOpen: false, label: 'Today' };

function reducer(state, action) {
    switch (action.type) {
        case 'setLabel':
            if (action.range.label) {
                return { ...state, label: action.range.label, dateRangeOpen: false };
            }
            return { ...state, label: `${getDateInStringFormat(action.range.startDate)} --> ${getDateInStringFormat(action.range.endDate)}`, dateRangeOpen: false };
        case 'setLabelFromSelect':
            return { ...state, label: action.label, dateRangeOpen: false };
        case 'setDateRangeOpen':
            return { ...state, dateRangeOpen: !state.dateRangeOpen };
        default:
            return state;
    }
}

const DatePicker = (props) => {
    const { onDateChange } = props;
    const [state, setState] = useReducer(reducer, initialState);

    const getInitialDateRange = () => {
        const startDate = getCurrentDateTime();
        startDate.setHours(0);
        startDate.setMinutes(0);

        const endDate = getCurrentDateTime();
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);

        return {
            startDate,
            endDate,
        };
    };

    const getTodayDateRange = () => {
        const startDate = getCurrentDateTime();
        startDate.setHours(0);
        startDate.setMinutes(0);

        const endDate = getCurrentDateTime();
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);

        return {
            label: 'Today',
            startDate,
            endDate,
        };
    };

    const getYesterdayDateRange = () => {
        const startDate = getCurrentDateTime();
        startDate.setDate(getCurrentDateTime().getDate() - 1);
        startDate.setHours(0);
        startDate.setMinutes(0);

        const endDate = getCurrentDateTime();
        endDate.setDate(getCurrentDateTime().getDate() - 1);
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);

        return {
            label: 'Yesterday',
            startDate,
            endDate,
        };
    };

    const last7DaysDateRange = () => {
        const startDate = getCurrentDateTime();
        startDate.setDate(getCurrentDateTime().getDate() - 7);
        startDate.setHours(0);
        startDate.setMinutes(0);

        const endDate = getCurrentDateTime();
        endDate.setDate(getCurrentDateTime().getDate());
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);

        return {
            label: 'Last 7 Days',
            startDate,
            endDate,
        };
    };

    const thisMonthDateRange = () => {
        const startDate = getCurrentDateTime();
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setDate(1);

        const endDate = getCurrentDateTime();
        endDate.setDate(getCurrentDateTime().getDate());
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);

        return {
            label: 'This Month',
            startDate,
            endDate,
        };
    };

    const lastMonthDateRange = () => {
        const startDate = getCurrentDateTime();
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setDate(1);
        startDate.setMonth(startDate.getMonth() - 1);

        const endDate = getCurrentDateTime();
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);
        endDate.setDate(0);

        return {
            label: 'Last Month',
            startDate,
            endDate,
        };
    };

    const thisYearDateRange = () => {
        const startDate = getCurrentDateTime();
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setDate(1);
        startDate.setMonth(0);

        const endDate = getCurrentDateTime();
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);

        return {
            label: 'This Year',
            startDate,
            endDate,
        };
    };

    return (
        <div className="datepicker">
            <Button
                className="datepicker-button"
                variant="contained"
                onClick={() => { setState({ type: 'setDateRangeOpen' }); }}
            >
                {state.label}
            </Button>
            <DateRangePicker
                className="datepicker-datepicker"
                initialDateRange={getInitialDateRange()}
                open={state.dateRangeOpen}
                onChange={(range) => {
                    setState({
                        type: 'setLabel',
                        range,
                    });
                    onDateChange({
                        type: 'setDateRange',
                        dateRange: range,
                    });
                }}
                definedRanges={
                    [getTodayDateRange(),
                        getYesterdayDateRange(),
                        last7DaysDateRange(),
                        thisMonthDateRange(),
                        lastMonthDateRange(),
                        thisYearDateRange()]
                }
            />
            <Select
                className="datepicker-select"
                variant="outlined"
                native
                value={state.label}
                onChange={(event) => {
                    const label = event.target.value;
                    setState({
                        type: 'setLabelFromSelect',
                        label,
                    });

                    if (label === 'Today') {
                        onDateChange({
                            type: 'setDateRange',
                            dateRange: getTodayDateRange(),
                        });
                    } else if (label === 'Yesterday') {
                        onDateChange({
                            type: 'setDateRange',
                            dateRange: getYesterdayDateRange(),
                        });
                    } else if (label === 'Last 7 Days') {
                        onDateChange({
                            type: 'setDateRange',
                            dateRange: last7DaysDateRange(),
                        });
                    } else if (label === 'This Month') {
                        onDateChange({
                            type: 'setDateRange',
                            dateRange: thisMonthDateRange(),
                        });
                    } else if (label === 'Last Month') {
                        onDateChange({
                            type: 'setDateRange',
                            dateRange: lastMonthDateRange(),
                        });
                    } else if (label === 'This Year') {
                        onDateChange({
                            type: 'setDateRange',
                            dateRange: thisYearDateRange(),
                        });
                    }
                }}
            >
                <option aria-label="None" value="" />
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="This Year">This Year</option>
            </Select>
        </div>
    );
};

DatePicker.propTypes = {
    onDateChange: PropTypes.func.isRequired,
};

export default React.memo(DatePicker);
