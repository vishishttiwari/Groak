/**
 * Class is used to represent restaurant cell in receipt
 */
import React, { useContext } from 'react';
import './css/Receipt.css';
import { context } from '../../../globalState/globalState';
import { getCurrentDateTimeInStringFormat } from '../../../catalog/TimesDates';

const ReceiptRestaurantCell = () => {
    const { globalState } = useContext(context);

    return (
        <>
            {globalState && globalState.restaurantCustomer ? (
                <div className="receipt-restaurant-cell">
                    <img className="receipt-restaurant-cell-image" src={globalState.restaurantCustomer.logo} alt={globalState.restaurantCustomer.name} />
                    <p className="receipt-restaurant-cell-address">{globalState.restaurantCustomer.address.displayAddress}</p>
                    <p className="receipt-restaurant-cell-time">{getCurrentDateTimeInStringFormat()}</p>
                </div>
            ) : null}
        </>
    );
};

export default React.memo(ReceiptRestaurantCell);
