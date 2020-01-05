/**
 * This component is used to notofication badge for each table
 */
import React from 'react';
import PropTypes from 'prop-types';

import { TableStatus } from '../../../catalog/Others';
import FoodBadgeImage from '../../../assets/icons/tableBadge/food7.png';
import RequestBadgeImage from '../../../assets/icons/tableBadge/request1.png';
import PaymentBadgeImage from '../../../assets/icons/tableBadge/payment1.png';
import OverdueBadgeImage from '../../../assets/icons/tableBadge/overdue1.png';

const TableBadge = (props) => {
    const { table, overdue } = props;

    var image
    if (table.status === TableStatus.ordered || table.status === TableStatus.updated) 
        image = <img draggable="false" className="table-badge-image" src={FoodBadgeImage} alt={"foodBadgeImage"} />
    else if (table.status === TableStatus.requested) 
        image = <img draggable="false" className="table-badge-image" src={RequestBadgeImage} alt={"requestbadgeImage"} />
    else if (table.status === TableStatus.payment) 
        image = <img draggable="false" className="table-badge-image" src={PaymentBadgeImage} alt={"paymentbadgeImage"} />
    else if (table.status === TableStatus.approved && overdue) 
        image = <img draggable="false" className="table-badge-image" src={OverdueBadgeImage} alt={"overduebadgeImage"} />   

    return (
        <div className="table-badge">
            {image}
        </div>
    );
};

TableBadge.propTypes = {
    table: PropTypes.object.isRequired,
    overdue: PropTypes.bool.isRequired
};

export default React.memo(TableBadge);