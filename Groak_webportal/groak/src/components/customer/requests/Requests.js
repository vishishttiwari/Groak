import React, { createRef, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import './css/Requests.css';
import { withRouter } from 'react-router-dom';
import RequestsHeader from './RequestsHeader';
import Spinner from '../../ui/spinner/Spinner';
import { fetchRestaurantAPI, fetchRequestAPI, unsubscribeFetchRequestAPI } from './RequestsAPICalls';
import CustomerNotFound from '../ui/notFound/CustomerNotFound';
import { RestaurantNotFound } from '../../../catalog/Comments';
import RequestsFooter from './RequestsFooter';
import { randomNumber } from '../../../catalog/Others';
import { getTimeInAMPMFromTimeStamp } from '../../../catalog/TimesDates';

const initialState = { restaurant: {}, requests: [], requestField: '', restaurantNotFound: false, loadingSpinner: true };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchRestaurant':
            return { ...state, restaurant: action.restaurant, loadingSpinner: false };
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
    const top = createRef(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        top.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
        });

        async function fetchRestaurant() {
            await fetchRestaurantAPI(match.params.restaurantid, setState, enqueueSnackbar);
        }
        fetchRestaurant();
    }, []);

    useEffect(() => {
        async function fetchOrder() {
            await fetchRestaurantAPI(match.params.restaurantid, setState, enqueueSnackbar);
            await fetchRequestAPI(match.params.restaurantid, match.params.tableid, setState, enqueueSnackbar);
        }
        fetchOrder();

        return () => {
            unsubscribeFetchRequestAPI(enqueueSnackbar);
        };
    }, [enqueueSnackbar]);

    const sendHandler = () => {
        setState({ type: 'changeRequestField', requestField: '' });
    };

    return (
        <div className="customer requests">
            <p ref={top}> </p>
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <>

                    {state.restaurantNotFound || state.categoriesNotFound ? (
                        <>
                            <CustomerNotFound text={RestaurantNotFound} />
                        </>
                    ) : (
                        <>
                            <RequestsHeader restaurantName={state.restaurant.name} />
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
                    )}

                </>
            ) : null}
        </div>
    );
};

Requests.propTypes = {
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(Requests));
