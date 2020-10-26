/**
 * This component is used to represent the each table in table canvas
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { Badge } from '@material-ui/core';

import TableImage from '../../../assets/icons/table1.png';
import { TableStatusStyle, TableStatusText, TableStatus, useInterval, refreshPeriod } from '../../../catalog/Others';
import { getTimeInAMPMFromTimeStamp, differenceInMinutesFromNow } from '../../../catalog/TimesDates';
import { OrderLate } from '../../../catalog/NotificationsComments';
import TableBadge from './TableBadge';

const Table = (props) => {
    const { table } = props;
    const [overdue, setOverdue] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (table.status === TableStatus.approved && table.serveTime && differenceInMinutesFromNow(table.serveTime) < 0) {
            if (!overdue) {
                setOverdue(true);
            }
        }
    }, [overdue, table.status, table.serveTime]);

    /**
     * Called every 5 seconds
     */
    useInterval(() => {
        if (table.status === TableStatus.approved && table.serveTime && differenceInMinutesFromNow(table.serveTime) < 0) {
            if (!overdue) {
                setOverdue(true);
                enqueueSnackbar(OrderLate(table.name), { variant: 'error' });
            }
        }
    }, refreshPeriod);

    const getStyles = (overdueHere, tableHere) => {
        if (tableHere.allowOrdering !== undefined ? tableHere.allowOrdering : true) {
            if (tableHere.newRequest || tableHere.callWaiter || overdueHere) {
                return TableStatusStyle.requested;
            }
            return TableStatusStyle[tableHere.status];
        }
        return TableStatusStyle.notAllowed;
    };

    const getTableDescription = (overdueHere, tableHere) => {
        if (tableHere.allowOrdering !== undefined ? tableHere.allowOrdering : true) {
            if (overdueHere) {
                return 'Order Overdue';
            }
            if (tableHere.callWaiter) {
                return 'Server Called';
            }
            if (tableHere.newRequest) {
                return 'New Request';
            }
            return TableStatusText[table.status];
        }
        return 'Ordering Unavailable';
    };

    const getTableStatus = (tableHere) => {
        if (tableHere.allowOrdering !== undefined ? tableHere.allowOrdering : true) {
            if (tableHere.status === TableStatus.approved && tableHere.serveTime) {
                return (<p className="table-time">{getTimeInAMPMFromTimeStamp(table.serveTime)}</p>);
            }
        }
        return null;
    };

    return (
        <div className="table" style={getStyles(overdue, table)}>
            <Badge badgeContent={<TableBadge table={table} overdue={overdue} />} color="primary" invisible={table.status === TableStatus.available && !overdue && !table.newRequest}>
                <div className="table-inside">
                    <p className="table-name">{table.name}</p>
                    <p className="table-desc">{getTableDescription(overdue, table)}</p>
                    {getTableStatus(table)}
                    <img draggable="false" className="table-image" src={TableImage} alt={table.name} />
                </div>
            </Badge>
        </div>
    );
};

Table.propTypes = {
    table: PropTypes.object.isRequired,
};

export default React.memo(Table);
