/**
 * This component is used to notofication badge for each table
 */
import React from 'react';
import PropTypes from 'prop-types';

import { TableStatus } from '../../../catalog/Others';
import FoodBadgeImage from '../../../assets/icons/tableBadge/food6.png';
import RequestBadgeImage from '../../../assets/icons/tableBadge/request1.png';
import PaymentBadgeImage from '../../../assets/icons/tableBadge/payment1.png';
import OverdueBadgeImage from '../../../assets/icons/tableBadge/overdue1.png';
import SeatedBadgeImage from '../../../assets/icons/tableBadge/seated.png';
import ApprovedBadgeImage from '../../../assets/icons/tableBadge/approved.png';
import ServedBadgeImage from '../../../assets/icons/tableBadge/served.png';

const TableBadge = (props) => {
    const { table, overdue } = props;

    var image
    if (table.status === TableStatus.ordered)
        image = <img draggable="false" className="table-badge-image" src={FoodBadgeImage} alt={"foodBadgeImage"} />
    else if (table.status === TableStatus.approved && table.newRequest)
        image = <img draggable="false" className="table-badge-image" src={RequestBadgeImage} alt={"requestbadgeImage"} />
    else if (table.status === TableStatus.payment)
        image = <img draggable="false" className="table-badge-image" src={PaymentBadgeImage} alt={"paymentbadgeImage"} />
    else if (table.status === TableStatus.approved && overdue)
        image = <img draggable="false" className="table-badge-image" src={OverdueBadgeImage} alt={"overduebadgeImage"} />
    else if (table.status === TableStatus.seated)
        image = <img draggable="false" className="table-badge-image" src={SeatedBadgeImage} alt={"seatedbadgeImage"} />
    else if (table.status === TableStatus.approved && !overdue)
        image = <img draggable="false" className="table-badge-image" src={ApprovedBadgeImage} alt={"approvedbadgeImage"} />
    else if (table.status === TableStatus.served)
        image = <img draggable="false" className="table-badge-image" src={ServedBadgeImage} alt={"servedbadgeImage"} />

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