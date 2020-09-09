/**
 * This class is used as covid screen
 */
import React from 'react';
import PropTypes from 'prop-types';
import CustomerTopic from '../ui/topic/CustomerTopic';
import CovidHeader from './CovidHeader';
import './css/Covid.css';
import CustomerInfo from '../ui/info/CustomerInfo';
import { CovidMessageSubheader, CovidGuidelineSubheader } from '../../../catalog/Comments';

const Covid = (props) => {
    const { restaurant } = props;

    return (
        <div className="covid">
            <CovidHeader />
            <div className="content">
                <CustomerTopic header="Restaurant Message" subheader={CovidMessageSubheader} />
                <CustomerInfo info={restaurant.covidMessage} />
                {restaurant.covidGuidelines ? (
                    <>
                        <CustomerTopic header="Covid Guidelines" subheader={CovidGuidelineSubheader} />
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
