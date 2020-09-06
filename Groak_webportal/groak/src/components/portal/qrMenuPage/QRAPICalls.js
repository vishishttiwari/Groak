/**
 * This class is used to get all the table info for qr
 */
import { fetchTableFirestoreAPI, updateTableFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsTables';
import { updateRestaurantFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsRestaurants';
import { ErrorFetchingTable, TableNotFound, ErrorUpdatingRestaurant, ErrorFetchingQRCodes, ErrorUpdatingTable } from '../../../catalog/NotificationsComments';
import { fetchQRCodesFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsQRCodes';

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
            setState({ type: 'fetchTable', table: { id: doc.id, ...doc.data(), qrCodes: doc.data().qrCodes.splice(0, 5) } });
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
 * This is used for fetching the qrCodes
 *
 * @param {*} restaurantId restaurantId
 * @param {*} setState this is used for setting the qrCodes array
 * @param {*} snackbar used for notifications
 */
export const fetchQRCodesAPI = async (restaurantId, setState, snackbar) => {
    const newQRCodes = [];
    const newQRCodesMap = new Map();
    try {
        const docs = await fetchQRCodesFirestoreAPI(restaurantId);
        docs.forEach((doc) => {
            if (doc.exists) {
                newQRCodes.push({ id: doc.id, ...doc.data() });
                newQRCodesMap.set(doc.data().reference.path, { id: doc.id, ...doc.data() });
            }
        });
        setState({ type: 'fetchQRCodes', qrCodes: newQRCodes, qrCodesMap: newQRCodesMap });
    } catch (error) {
        snackbar(ErrorFetchingQRCodes, { variant: 'error' });
        setState({ type: 'error' });
    }
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
        setGlobalState({ type: 'setQRStylePagePortal', qrStylePage: data });
    } catch (error) {
        snackbar(ErrorUpdatingRestaurant, { variant: 'error' });
    }
    setState({ type: 'setLoadingSpinner', loadingSpinner: false });
};

/**
 * This function is used for updating table
 *
 * @param {*} restaurantId id of the restaurant for which table needs to be updated
 * @param {*} tableId id of the table that needs to be updated
 * @param {*} data this contains information about the table
 * @param {*} setState this is used for setting the component with initial state
 * @param {*} snackbar this is used for notifications
 */
export const updateTableAPI = async (restaurantId, tableId, data, setState, snackbar) => {
    try {
        await updateTableFirestoreAPI(restaurantId, tableId, data);
    } catch (error) {
        snackbar(ErrorUpdatingTable, { variant: 'error' });
        setState({ type: 'error' });
    }
};
