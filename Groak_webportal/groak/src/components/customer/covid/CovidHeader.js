/**
 * This class is used as header of covid
 */
import React from 'react';

const CovidHeader = () => {
    return (
        <div className="header">
            <div className="header-content">
                <p className="header-title">COVID-19</p>
            </div>
        </div>
    );
};

export default React.memo(CovidHeader);
