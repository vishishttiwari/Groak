/**
 * This class is used as header of rating screen
 */
import React from 'react';

const RatingHeader = () => {
    return (
        <div className="header">
            <div className="header-content">
                <p className="header-title">Rating</p>
            </div>
        </div>
    );
};

export default React.memo(RatingHeader);
