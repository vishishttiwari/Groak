/**
 * This component is used to represent each table in Orders Table
 */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@material-ui/core';
import { context } from '../../../../globalState/globalState';

import { differenceInMinutesFromNow, getTimeInAMPMFromTimeStamp } from '../../../../catalog/TimesDates';
import { refreshPeriod, useInterval, calculatePriceFromDishesWithTax } from '../../../../catalog/Others';

const OrdersTable = (props) => {
    const { title, button, orders = [], onClick, onButtonClick, serveTime } = props;
    const [timeLeft, setTimeLeft] = useState([]);
    const { globalState } = useContext(context);

    /**
     * Following describe the different columns that are there when lets say button is provided etc.
     */
    let columns = {
        table: { label: 'Table', width: '50%', align: 'center' },
        items: { label: 'Items', width: '25%', align: 'center' },
        price: { label: 'Total', width: '25%', align: 'center', format: (value) => { return value.toFixed(2); } },
    };
    if (!serveTime && !button) {
        columns = {
            table: { label: 'Table', width: '50%', align: 'center' },
            items: { label: 'Items', width: '25%', align: 'center' },
            price: { label: 'Total', width: '25%', align: 'center', format: (value) => { return value.toFixed(2); } },
        };
    }
    if (serveTime && !button) {
        columns = {
            table: { label: 'Table', width: '30%', align: 'center' },
            items: { label: 'Items', width: '18%', align: 'center' },
            price: { label: 'Total', width: '17%', align: 'center', format: (value) => { return value.toFixed(2); } },
            serveTime: { label: 'Serve Time', width: '18%', align: 'center' },
            minutesLeft: { label: 'Minutes Left', width: '17%', align: 'center' },
        };
    }
    if (!serveTime && button) {
        columns = {
            table: { label: 'Table', width: '35%', align: 'center' },
            items: { label: 'Items', width: '20%', align: 'center' },
            price: { label: 'Total', width: '20%', align: 'center', format: (value) => { return value.toFixed(2); } },
            action: { label: button, width: '25%', align: 'center' },
        };
    }
    if (serveTime && button) {
        columns = {
            table: { label: 'Table', width: '20%', align: 'center' },
            items: { label: 'Items', width: '12%', align: 'center' },
            price: { label: 'Total', width: '13%', align: 'center', format: (value) => { return value.toFixed(2); } },
            serveTime: { label: 'Serve Time', width: '17%', align: 'center' },
            minutesLeft: { label: 'Minutes Left', width: '18%', align: 'center' },
            action: { label: button, width: '20%', align: 'center' },
        };
    }

    /**
     * This function is used for calculating time left for order delivery
     */
    function setTimeLeftFunc() {
        if (serveTime) {
            return orders.map((order) => {
                return (differenceInMinutesFromNow(order.serveTime));
            });
        }
        return [];
    }

    useEffect(() => {
        // This has been included here otherwise have to include in
        // dependency array abd if I do that, that causes infinite renders
        function setTimeLeftFuncUseEffect() {
            if (serveTime) {
                return orders.map((order) => {
                    return (differenceInMinutesFromNow(order.serveTime));
                });
            }
            return [];
        }
        setTimeLeft(setTimeLeftFuncUseEffect(serveTime, orders));
    }, [serveTime, orders]);

    useInterval(() => {
        setTimeLeft(setTimeLeftFunc(serveTime, orders));
    }, refreshPeriod);

    return (
        <div className="orders-table">
            <h3>{title}</h3>
            <Paper>
                <div className="table-header">
                    <Table>
                        <TableHead>
                            <TableRow>
                                {Object.keys(columns).map((column) => {
                                    return (
                                        <TableCell
                                            key={column}
                                            align={columns[column].align}
                                            width={columns[column].width}
                                        >
                                            {columns[column].label}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                    </Table>
                </div>
                <div className="table-body">
                    <Table>
                        <TableBody>
                            {orders.map((order, index) => {
                                return (
                                    <TableRow key={order.id} className="table-row" onClick={() => { onClick(order.id); }}>
                                        <TableCell width={columns.table.width} align={columns.table.align}>
                                            {order.table}
                                        </TableCell>
                                        <TableCell width={columns.items.width} align={columns.items.align}>
                                            {order.items}
                                        </TableCell>
                                        <TableCell width={columns.price.width} align={columns.price.align}>
                                            {`$${calculatePriceFromDishesWithTax(order.dishes, globalState.restaurantPortal.salesTax)}`}
                                        </TableCell>
                                        {serveTime ? (
                                            <>
                                                <TableCell width={columns.serveTime.width} align={columns.serveTime.align}>
                                                    {getTimeInAMPMFromTimeStamp(order.serveTime)}
                                                </TableCell>
                                                <TableCell width={columns.minutesLeft.width} align={columns.minutesLeft.align} style={{ color: (timeLeft[index] <= 5) ? 'red' : 'black' }}>
                                                    {`${timeLeft[index]} mins`}
                                                </TableCell>
                                            </>
                                        ) : null}
                                        {button ? (
                                            <TableCell width={columns.action.width} align={columns.action.align}>
                                                <Button variant="contained" onClick={(event) => { onButtonClick(event, order.id); }}>
                                                    {button}
                                                </Button>
                                            </TableCell>
                                        ) : null}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        </div>
    );
};

OrdersTable.propTypes = {
    title: PropTypes.string.isRequired,
    button: PropTypes.string,
    orders: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    onButtonClick: PropTypes.func,
    serveTime: PropTypes.bool,
};

OrdersTable.defaultProps = {
    button: '',
    onButtonClick: () => {},
    serveTime: false,
};

export default React.memo(OrdersTable);
