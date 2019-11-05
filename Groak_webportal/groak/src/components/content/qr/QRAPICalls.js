/**
 * This class is used to get all the table info for qr
 */
import { fetchTableFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsTables';
import { updateRestaurantFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsRestaurants';
import { ErrorFetchingTable, TableNotFound, ErrorUpdatingRestaurant } from '../../../catalog/NotificationsComments';

/**
 * This function is used for fetching table
 *
 * @param {*} restaurantId id of the restaurant for which table needed to be fetched
 * @param {*} tableId id of the table needs to be fetched
 * @param {*} setState this is used for setting the component with initial state
 * @param {*} snackbar this is used for notifications
 */
export const fetchTableAPI = async (restaurantId, tableId, setState, snackBar) => {
    setState({ type: 'setLoadingSpinner', loadingSpinner: true });
    try {
        const doc = await fetchTableFirestoreAPI(restaurantId, tableId);
        if (doc.exists) {
            setState({ type: 'fetchTable', table: { key: doc.id, ...doc.data() } });
        } else {
            snackBar(TableNotFound, { variant: 'error' });
            setState({ type: 'error' });
        }
    } catch (error) {
        snackBar(ErrorFetchingTable, { variant: 'error' });
        setState({ type: 'error' });
    }
    setState({ type: 'setLoadingSpinner', loadingSpinner: false });
};

/**
 * This function is used for updating restaurant qr options
 *
 * @param {*} restaurantId restaurant ID
 * @param {*} data this is the new data
 * @param {*} setState sets the state of the current page
 * @param {*} snackbar used for notifications
 */
export const updateRestaurantAPI = async (restaurantId, data, setState, setGlobalState, snackbar) => {
    setState({ type: 'setLoadingSpinner', loadingSpinner: true });
    try {
        await updateRestaurantFirestoreAPI(restaurantId, { qrStylePage: data });
        setGlobalState({ type: 'setQRStylePage', qrStylePage: data });
    } catch (error) {
        snackbar(ErrorUpdatingRestaurant, { variant: 'error' });
    }
    setState({ type: 'setLoadingSpinner', loadingSpinner: false });
};
