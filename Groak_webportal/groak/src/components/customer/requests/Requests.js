/**
 * Used for representing requests/chat
 */
import React, { createRef, useReducer, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import './css/Requests.css';
import { withRouter } from 'react-router-dom';
import RequestsHeader from './RequestsHeader';
import Spinner from '../../ui/spinner/Spinner';
import { fetchRequestAPI, unsubscribeFetchRequestAPI, updateRequestAPI, updateRequestWhenSeenAPI } from './RequestsAPICalls';
import RequestsFooter from './RequestsFooter';
import { randomNumber } from '../../../catalog/Others';
import { getTimeInAMPMFromTimeStamp, timeoutValueForCustomer } from '../../../catalog/TimesDates';
import { getCurrentDateTime, analytics } from '../../../firebase/FirebaseLibrary';
import { context } from '../../../globalState/globalState';
import { isNearRestaurant } from '../../../catalog/Distance';
import { NotAtRestaurant } from '../../../catalog/NotificationsComments';

const initialState = { requests: [], requestField: '', loadingSpinner: true, loadingSpinner1: false };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchRequests':
            return { ...state, requests: action.requests, loadingSpinner: false };
        case 'changeRequestField':
            return { ...state, requestField: action.requestField };
        case 'restaurantNotFound':
            return { ...state, restaurantNotFound: true, loadingSpinner: false };
        case 'changeLoadingSpinner1':
            return { ...state, loadingSpinner1: action.loadingSpinner };
        default:
            return initialState;
    }
}

const Requests = (props) => {
    const { history, match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const requestEndRef = createRef();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!globalState.scannedCustomer || !globalState.orderAllowedCustomer) {
            history.replace('/');
        }

        async function fetchRequest() {
            await fetchRequestAPI(match.params.restaurantid, match.params.tableid, setState, enqueueSnackbar);
        }
        fetchRequest();

        async function updateRequest() {
            await updateRequestWhenSeenAPI(match.params.restaurantid, match.params.tableid);
        }
        updateRequest();

        setTimeout(() => {
            history.replace('/');
        }, timeoutValueForCustomer);

        return () => {
            unsubscribeFetchRequestAPI(enqueueSnackbar);
        };
    }, [enqueueSnackbar, globalState.orderAllowedCustomer, globalState.scannedCustomer, history, match.params.restaurantid, match.params.tableid]);

    useEffect(() => {
        if (state.requests && state.requests.length) {
            if (requestEndRef && requestEndRef.current) {
                const elmnt = document.getElementById('groak-requests-content');
                window.scrollTo({
                    top: elmnt.offsetHeight,
                    left: 0,
                    behavior: 'smooth',
                });
            }
        }
    }, [state.requests, requestEndRef]);

    /**
     * Called when send button is clicked.
     * It first checks the location and then sends message
     */
    const sendHandler = async () => {
        if (globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.location && globalState.restaurantCustomer.location.latitude && globalState.restaurantCustomer.location.longitude) {
            setState({ type: 'changeLoadingSpinner1', loadingSpinner: true });
            isNearRestaurant(globalState.restaurantCustomer.location.latitude, globalState.restaurantCustomer.location.longitude, enqueueSnackbar)
                .then(async (nearRestaurant) => {
                    if (nearRestaurant) {
                        const requests = [...state.requests, { created: getCurrentDateTime(), request: state.requestField, createdByUser: true }];
                        const data = { requests };
                        await updateRequestAPI(match.params.restaurantid, match.params.tableid, data, enqueueSnackbar);
                        setState({ type: 'changeRequestField', requestField: '' });
                        setState({ type: 'changeLoadingSpinner1', loadingSpinner: false });
                        analytics.logEvent('request_from_user_web_testing', { restaurantId: match.params.restaurantid, tableId: match.params.tableid });
                    } else {
                        enqueueSnackbar(NotAtRestaurant, { variant: 'error' });
                        setState({ type: 'changeLoadingSpinner1', loadingSpinner: false });
                    }
                })
                .catch(() => {
                    setState({ type: 'changeLoadingSpinner1', loadingSpinner: false });
                });
        }
    };

    return (
        <div className="customer requests">
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <>

                    <RequestsHeader restaurantName={globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.name ? globalState.restaurantCustomer.name : 'Chat'} />
                    <div className="content" id="groak-requests-content">
                        {state.requests.map((request) => {
                            return (
                                <div key={randomNumber()} className={request.createdByUser ? 'request user' : 'request not-user'}>
                                    <p className="request-request">{request.request}</p>
                                    <p className="request-created">{getTimeInAMPMFromTimeStamp(request.created)}</p>
                                </div>
                            );
                        })}
                    </div>
                    <p ref={requestEndRef}> </p>
                    <RequestsFooter
                        requestField={state.requestField}
                        loadingSpinner={state.loadingSpinner1}
                        setState={setState}
                        sendHandler={() => { sendHandler(); }}
                    />
                </>
            ) : null}
        </div>
    );
};

Requests.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(Requests));
