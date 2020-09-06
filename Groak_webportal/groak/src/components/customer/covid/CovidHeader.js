import React from 'react';

const MenuHeader = () => {
    return (
        <div className="header">
            <div className="header-content">
                <p className="header-title">COVID-19</p>
            </div>
        </div>
    );
};

export default React.memo(MenuHeader);
