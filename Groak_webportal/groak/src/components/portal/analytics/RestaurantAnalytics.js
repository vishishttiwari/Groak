/**
 * This component is used for the restaurant analytics in analytics page
 */
import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './css/Analytics.css';
import { Line } from 'react-chartjs-2';
import { randomNumber } from '../../../catalog/Others';
import { getDateTimeInStringFormat } from '../../../catalog/TimesDates';

const RestaurantAnalytics = (props) => {
    const { totalRating, toalRatingEntries, totalRatingEntriesArray, totalRatingArray, messages } = props;

    return (
        <>
            <h2 style={{ marginTop: '0px' }}>{`Final Average Rating: ${totalRating.toFixed(2)}/5`}</h2>
            <Line
                data={totalRatingArray}
                redraw
                legend={{
                    display: false,
                }}
                options={{
                    scales: {
                        xAxes: [{
                            gridLines: {
                                color: 'rgba(0, 0, 0, 0)',
                            },
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                            },
                        }],
                    },
                    maintainAspectRatio: true }}
            />
            <div className="horizontal-line" />
            <h2>{`Total Rating Submitted: ${toalRatingEntries}`}</h2>
            <Line
                data={totalRatingEntriesArray}
                redraw
                legend={{
                    display: false,
                }}
                options={{
                    scales: {
                        xAxes: [{
                            gridLines: {
                                color: 'rgba(0, 0, 0, 0)',
                            },
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                            },
                        }],
                    },
                    maintainAspectRatio: true }}
            />
            <div className="horizontal-line" />
            <h2>Customer Feedback</h2>
            <TableContainer component={Paper}>
                <Table aria-label="users analytics table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="dishes-analytics-heading">Customer Feedback</TableCell>
                            <TableCell className="dishes-analytics-heading" align="right">Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {messages.map((message) => {
                            return (
                                <TableRow
                                    key={randomNumber()}
                                    className="dishes-analytics-row"
                                >
                                    <TableCell className="dishes-analytics-text" component="th" scope="row">
                                        {message.message}
                                    </TableCell>
                                    <TableCell style={{ fontSize: '12px' }} className="dishes-analytics-text" component="th" scope="row" align="right">
                                        {getDateTimeInStringFormat(message.created)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

RestaurantAnalytics.propTypes = {
    totalRating: PropTypes.number.isRequired,
    toalRatingEntries: PropTypes.number.isRequired,
    totalRatingEntriesArray: PropTypes.object.isRequired,
    totalRatingArray: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired,
};

export default React.memo(RestaurantAnalytics);
