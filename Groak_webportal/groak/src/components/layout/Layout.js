/**
 * This function shows all the components. This checks the authentication and if user is not authenticated
 * then it redirects it to sign in, otherwise it just shows the spinner
 */
import React, { useEffect, useContext, useReducer } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import Topbar from '../navigation/topbar/Topbar';
import { context } from '../../globalState/globalState';

import './css/Layout.css';
import Spinner from '../ui/spinner/Spinner';
import { checkAuthentication } from '../portal/authentication/AuthenticationAPICalls';

const initialState = { allowedURLSegmentsState: false };

function reducer(state, action) {
    switch (action.type) {
        case 'allowedURLSegmentsState':
            return { allowedURLSegmentsState: true };
        case 'notAllowedURLSegmentsState':
            return { allowedURLSegmentsState: false };
        default:
            return initialState;
    }
}

const Layout = (props) => {
    const { allowedURLSegments, children, history } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState, setGlobalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const firstSegment = history.location.pathname.split('/')[1];
        if (!allowedURLSegments.includes(firstSegment)) {
            setState({ type: 'notAllowedURLSegmentsState' });
            checkAuthentication(history, setGlobalState, enqueueSnackbar);
        } else {
            setState({ type: 'allowedURLSegmentsState' });
        }
    }, [history, setGlobalState, enqueueSnackbar]);

    return (
        <div className="main-container">
            <Topbar />
            <main>
                {(globalState.userPortal !== false || state.allowedURLSegmentsState) ? children : <Spinner show />}
            </main>
        </div>
    );
};

Layout.propTypes = {
    allowedURLSegments: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(Layout));
