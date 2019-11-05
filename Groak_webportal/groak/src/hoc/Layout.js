/**
 * This function shows all the components. This checks the authentication and if user is not authenticated
 * then it redirects it to sign in, otherwise it just shows the spinner
 */
import React, { useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import Topbar from '../components/navigation/topbar/Topbar';
import { context } from '../globalState/globalState';

import './css/Layout.css';
import Spinner from '../components/ui/spinner/Spinner';
import { checkAuthentication } from '../components/content/authentication/AuthenticationAPICalls';

const Layout = (props) => {
    const { children, history } = props;
    const { globalState, setGlobalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        checkAuthentication(history, setGlobalState, enqueueSnackbar);
    }, [history, setGlobalState, enqueueSnackbar]);

    return (
        <div className="main-container">
            <Topbar />
            <main>
                {globalState.user !== false ? children : <Spinner show />}
            </main>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    history: PropTypes.object.isRequired,
};


export default withRouter(React.memo(Layout));
