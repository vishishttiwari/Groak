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
    const { restaurant, scrollHandler } = props;

    return (
        <div className="covid" onPointerDown={scrollHandler}>
            <CovidHeader />
            <div className="content">
                <CustomerTopic header="Restaurant Message" subheader={CovidMessageSubheader(restaurant.name)} />
                <CustomerInfo info={restaurant.covidMessage} />
                {restaurant.covidGuidelines ? (
                    <>
                        <CustomerTopic header="Covid Directives" subheader={CovidGuidelineSubheader} />
                        <CustomerInfo info={restaurant.covidGuidelines} />
                    </>
                ) : null}

            </div>
        </div>
    );
};

Covid.propTypes = {
    restaurant: PropTypes.object.isRequired,
    scrollHandler: PropTypes.func.isRequired,
};

export default React.memo(Covid);
