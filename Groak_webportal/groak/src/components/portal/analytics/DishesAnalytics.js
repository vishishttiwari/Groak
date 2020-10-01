/**
 * This component is used for the dishes analytics in analytics page
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './css/Analytics.css';
import { LinearProgress } from '@material-ui/core';
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import { withRouter } from 'react-router-dom';
import { context } from '../../../globalState/globalState';

const DishesAnalytics = (props) => {
    const { history, dishesLabels, dishesLikes } = props;
    const { globalState } = useContext(context);

    const getPercentageValue = (dishLikes) => {
        return (100 * dishLikes.likes) / (dishLikes.likes + dishLikes.dislikes);
    };

    return (
        <>
            {!globalState.restaurantPortal || !globalState.restaurantPortal.allowOrdering || !globalState.restaurantPortal.allowOrdering.restaurant ? (
                <p>These analytics are only available if you have subscribed to our ordering model. To get these analytics, use Groak for ordering at your restaurant.</p>
            ) : null}
            <h2 style={{ marginTop: '0px' }}>Feedback on Dishes</h2>
            <TableContainer component={Paper}>
                <Table aria-label="users analytics table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="dishes-analytics-heading">Dishes</TableCell>
                            <TableCell className="dishes-analytics-heading" align="right">Feedback</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dishesLabels.map((labels, index) => {
                            return (
                                <TableRow
                                    key={labels.reference.id}
                                    className="dishes-analytics-row"
                                    onClick={() => {
                                        history.push(`/dishes/${labels.reference.id}`);
                                    }}
                                >
                                    <TableCell className="dishes-analytics-text" component="th" scope="row">
                                        {labels.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className="dishes-analytics-thumbs">
                                            <div className="dishes-analytics-thumb">
                                                <ThumbUpRoundedIcon style={{ magin: '5px' }} />
                                                <p style={{ padding: '5px' }}>{dishesLikes[index].likes}</p>
                                            </div>
                                            <div className="dishes-analytics-thumb">
                                                <ThumbDownRoundedIcon />
                                                <p style={{ padding: '5px' }}>{dishesLikes[index].dislikes}</p>
                                            </div>
                                        </div>
                                        <LinearProgress
                                            className="dishes-analytics-linear-progress"
                                            variant="determinate"
                                            value={getPercentageValue(dishesLikes[index])}
                                        />
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

DishesAnalytics.propTypes = {
    history: PropTypes.object.isRequired,
    dishesLabels: PropTypes.array.isRequired,
    dishesLikes: PropTypes.array.isRequired,
};

export default withRouter(React.memo(DishesAnalytics));
