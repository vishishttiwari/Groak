import React from 'react';
import PropTypes from 'prop-types';
import './css/Order.css';

const OrderDishCell = (props) => {
    const { comment, localBadge, created } = props;

    return (
        <div className="order-comment-cell">
            <p className="order-comment-cell-comment">{comment}</p>
            <div className="order-comment-cell-content">
                {localBadge ? <p className="order-comment-cell-local-badge">Your Instruction</p> : null}
                <p className="order-comment-cell-created">{created}</p>
            </div>
        </div>
    );
};

OrderDishCell.propTypes = {
    comment: PropTypes.string.isRequired,
    localBadge: PropTypes.bool.isRequired,
    created: PropTypes.string.isRequired,
};

export default React.memo(OrderDishCell);
