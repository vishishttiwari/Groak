import React from 'react';
import PropTypes from 'prop-types';
import CustomerTopic from '../ui/topic/CustomerTopic';
import CovidHeader from './CovidHeader';
import './css/Covid.css';
import CustomerInfo from '../ui/info/CustomerInfo';

const Covid = (props) => {
    const { restaurant } = props;

    return (
        <div className="covid">
            <CovidHeader />
            <div className="content">
                <CustomerTopic header="Restaurant Message" subheader="Measures taken by restaurant to reduce the spread" />
                <CustomerInfo info={restaurant.covidMessage} />
                {restaurant.covidGuidelines ? (
                    <>
                        <CustomerTopic header="Covid Guidelines" subheader="Covid guidelines in your area" />
                        <CustomerInfo info={restaurant.covidGuidelines} />
                    </>
                ) : null}

            </div>
        </div>
    );
};

Covid.propTypes = {
    restaurant: PropTypes.object.isRequired,
};

export default React.memo(Covid);
