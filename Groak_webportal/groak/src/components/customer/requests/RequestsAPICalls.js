import { ErrorUnsubscribingRequest, ErrorFetchingRequest, ErrorUpdatingRequest } from '../../../catalog/NotificationsComments';
import { fetchRequestFirestoreAPI, updateRequestFromUserFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsRequests';

let requestSnapshot;

/**
 * This function is used for unsubscribing from realtime updates of request
 *
 * @param {*} snackbar used for notifications
 */
export const unsubscribeFetchRequestAPI = (snackbar) => {
    try {
        if (requestSnapshot) {
            requestSnapshot();
        }
    } catch (error) {
        snackbar(ErrorUnsubscribingRequest, { variant: 'error' });
    }
};

/**
 * The function is used for fetching request
 *
 * @param {*} restaurantId id of the restaurant for which request needs to be fetched
 * @param {*} requestId request id of the request that needs to be fetched
 * @param {*} setState used for setting the request
 * @param {*} snackbar used for notifications
 */
export const fetchRequestAPI = async (restaurantId, requestId, setState, snackbar) => {
    try {
        const getRequest = (querySnapshot) => {
            if (querySnapshot.data()) {
                setState({
                    type: 'fetchRequests',
                    requests: querySnapshot.data().requests,
                });
            } else {
                snackbar(ErrorFetchingRequest, { variant: 'error' });
                setState({ type: 'error' });
                unsubscribeFetchRequestAPI(snackbar);
            }
        };
        requestSnapshot = await fetchRequestFirestoreAPI(restaurantId, requestId, getRequest);
    } catch (error) {
        snackbar(ErrorFetchingRequest, { variant: 'error' });
        setState({ type: 'error' });
        unsubscribeFetchRequestAPI(snackbar);
    }
};

/**
 * The function is used for adding request by restaurant
 *
 * @param {*} restaurantId id of the restaurant for which request needs to be fetched
 * @param {*} requestId request id of the request that needs to be fetched
 * @param {*} setState used for setting the request
 * @param {*} snackbar used for notifications
 */
export const updateRequestAPI = async (restaurantId, requestId, data, snackbar) => {
    try {
        await updateRequestFromUserFirestoreAPI(restaurantId, requestId, data);
    } catch (error) {
        snackbar(ErrorUpdatingRequest, { variant: 'error' });
        unsubscribeFetchRequestAPI(snackbar);
    }
};
