import React, { createRef, useReducer, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import './css/Requests.css';
import { withRouter } from 'react-router-dom';
import RequestsHeader from './RequestsHeader';
import Spinner from '../../ui/spinner/Spinner';
import { fetchRequestAPI, unsubscribeFetchRequestAPI, updateRequestAPI } from './RequestsAPICalls';
import RequestsFooter from './RequestsFooter';
import { randomNumber } from '../../../catalog/Others';
import { getTimeInAMPMFromTimeStamp } from '../../../catalog/TimesDates';
import { getCurrentDateTime } from '../../../firebase/FirebaseLibrary';
import { context } from '../../../globalState/globalState';
import { isNearRestaurant } from '../../../catalog/Distance';

const initialState = { requests: [], requestField: '', loadingSpinner: true };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchRequests':
            return { ...state, requests: action.requests, loadingSpinner: false };
        case 'changeRequestField':
            return { ...state, requestField: action.requestField };
        case 'restaurantNotFound':
            return { ...state, restaurantNotFound: true, loadingSpinner: false };
        default:
            return initialState;
    }
}

const Requests = (props) => {
    const { match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const top = createRef(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        top.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
        });

        async function fetchOrder() {
            await fetchRequestAPI(match.params.restaurantid, match.params.tableid, setState, enqueueSnackbar);
        }
        fetchOrder();

        return () => {
            unsubscribeFetchRequestAPI(enqueueSnackbar);
        };
    }, [enqueueSnackbar]);

    const sendHandler = async () => {
        if (globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.location && globalState.restaurantCustomer.location.latitude && globalState.restaurantCustomer.location.longitude) {
            isNearRestaurant(globalState.restaurantCustomer.location.latitude, globalState.restaurantCustomer.location.longitude, enqueueSnackbar)
                .then(async (nearRestaurant) => {
                    if (nearRestaurant) {
                        const requests = [...state.requests, { created: getCurrentDateTime(), request: state.requestField, createdByUser: true }];
                        const data = { requests };
                        await updateRequestAPI(match.params.restaurantid, match.params.tableid, data, enqueueSnackbar);
                        setState({ type: 'changeRequestField', requestField: '' });
                    } else {
                        enqueueSnackbar('Seems like you are not at the restaurant. Please order while you are at the restaurant.', { variant: 'error' });
                    }
                })
                .catch(() => {
                });
        }
    };

    return (
        <div className="customer requests">
            <p ref={top}> </p>
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <>

                    <RequestsHeader restaurantName={globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.name ? globalState.restaurantCustomer.name : 'Chat'} />
                    <div className="content">
                        {state.requests.map((request) => {
                            return (
                                <div key={randomNumber()} className={request.createdByUser ? 'request user' : 'request not-user'}>
                                    <p className="request-request">{request.request}</p>
                                    <p className="request-created">{getTimeInAMPMFromTimeStamp(request.created)}</p>
                                </div>
                            );
                        })}
                    </div>
                    <RequestsFooter requestField={state.requestField} setState={setState} sendHandler={() => { sendHandler(); }} />
                </>
            ) : null}
        </div>
    );
};

Requests.propTypes = {
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(Requests));
