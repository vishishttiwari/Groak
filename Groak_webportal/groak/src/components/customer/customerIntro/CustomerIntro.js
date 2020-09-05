import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import CustomerTabBar from '../ui/customerTabBar/CustomerTabBar';
import Menu from '../menu/Menu';
import Cart from '../cart/Cart';

const initialState = { tabValue: 0, updated: true };

function reducer(state, action) {
    switch (action.type) {
        case 'changeTabValue':
            if (action.tabValue !== state.tabValue) {
                return { ...state, tabValue: action.tabValue };
            }
            return { ...state };
        case 'updated':
            return { ...state, updated: !state.updated };
        default:
            return initialState;
    }
}

const CustomerIntro = (props) => {
    const { match } = props;
    const [state, setState] = useReducer(reducer, initialState);

    const getTabPanel = () => {
        if (state.tabValue === 0) {
            return <Menu />;
        } if (state.tabValue === 1) {
            return <Cart setState={setState} />;
        }
        return null;
    };

    return (
        <div className="customer intro">
            {getTabPanel()}
            <CustomerTabBar restaurantId={match.params.restaurantid} value={state.tabValue} setState={setState} />
        </div>
    );
};

CustomerIntro.propTypes = {
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(CustomerIntro));
