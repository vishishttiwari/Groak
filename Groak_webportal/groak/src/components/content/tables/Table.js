/**
 * This component is used to represent the each table in table canvas
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import TableImage from '../../../assets/icons/table1.png';
import { TableStatusStyle, TableStatusText, TableStatus, useInterval, refreshPeriod } from '../../../catalog/Others';
import { getTimeInAMPMFromTimeStamp, differenceInMinutesFromNow } from '../../../catalog/TimesDates';
import { OrderLate } from '../../../catalog/NotificationsComments';

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
    }, []);

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

    return (
        <div className="table" style={overdue ? TableStatusStyle.requested : TableStatusStyle[table.status]}>
            <p className="table-name">{table.name}</p>
            <p className="table-desc">{overdue ? 'Order Overdue' : TableStatusText[table.status]}</p>
            {table.status === TableStatus.approved ? <p className="table-time">{getTimeInAMPMFromTimeStamp(table.serveTime)}</p> : null}
            <img draggable="false" className="table-image" src={TableImage} alt={table.name} />
        </div>
    );
};

Table.propTypes = {
    table: PropTypes.object.isRequired,
};

export default React.memo(Table);
