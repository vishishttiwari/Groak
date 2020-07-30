/**
 * This class includes qr codes related functions such as fetching all qr codes
 */
import { fetchQRCodesFirestoreAPI, fetchQRCodeFirestoreAPI, updateQRCodeFirestoreAPI, addQRCodeFirestoreAPI, deleteQRCodeFirestoreAPI, changeOrderOfQRCodesFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsQRCodes';
import { ErrorFetchingCategories, ErrorAddingQRCode, ErrorFetchingQRCodes, ErrorFetchingQRCode, ErrorUpdatingQRCode, ErrorDeletingQRCode, QRCodeNotFound, QRCodeAdded, QRCodeUpdated, QRCodeOrderChanged } from '../../../catalog/NotificationsComments';
import { fetchCategoriesFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';

import { fetchTablesFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsTables';

/**
 * This is used for fetching the categories
 *
 * @param {*} restaurantId restaurantId
 * @param {*} setState this is used for setting the categories array
 * @param {*} snackbar used for notifications
 */
export const fetchCategoriesAPI = async (restaurantId, setState, snackbar) => {
    const newCategoriesMap = new Map();
    const newCategories = [];
    try {
        const docs = await fetchCategoriesFirestoreAPI(restaurantId);
        docs.forEach((doc) => {
            newCategoriesMap.set(doc.data().reference.path, { id: doc.id, ...doc.data() });
            newCategories.push({ id: doc.id, ...doc.data() });
        });
        setState({ type: 'fetchCategories', categoriesMap: newCategoriesMap, categories: newCategories });
    } catch (error) {
        snackbar(ErrorFetchingCategories, { variant: 'error' });
        setState({ type: 'error' });
    }
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
    try {
        const docs = await fetchQRCodesFirestoreAPI(restaurantId);
        docs.forEach((doc) => {
            newQRCodes.push({ id: doc.id, ...doc.data() });
        });
        setState({ type: 'fetchQRCodes', qrCodes: newQRCodes });
    } catch (error) {
        snackbar(ErrorFetchingQRCodes, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This is used for fetching a qrCode
 *
 * @param {*} restaurantId id of the restaurant
 * @param {*} qrCodeId id of the qr code that needs to be fetched
 * @param {*} setState this is used for setting the state of component with correct information
 * @param {*} snackbar this is used for notifications
 */
export const fetchQRCodeAPI = async (restaurantId, qrCodeId, setState, snackbar) => {
    try {
        const data = await fetchQRCodeFirestoreAPI(restaurantId, qrCodeId);

        // If the qr code exists then get the data
        if (data.exists) {
            let categoryPaths = [];
            if (data.data().categories) {
                categoryPaths = data.data().categories.map((category) => {
                    return category.path;
                });
            }
            setState({
                type: 'fetchQRCode',
                name: data.data().name ? data.data().name : '',
                categories: categoryPaths,
                available: data.data().available,
            });
        } else {
            snackbar(QRCodeNotFound, { variant: 'error' });
            setState({ type: 'error' });
        }
    } catch (error) {
        snackbar(ErrorFetchingQRCode, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * Used for updating qr code
 *
 * @param {*} restaurantId id of the restaurant
 * @param {*} qrCodeId id of QRCode that needs to be updated
 * @param {*} changedQRCode this is the updated QR code
 * @param {*} snackbar used for notifications
 */
export const updateQRCodeAPI = async (restaurantId, qrCodeId, changedQRCode, snackbar) => {
    try {
        await updateQRCodeFirestoreAPI(restaurantId, qrCodeId, changedQRCode);
        snackbar(QRCodeUpdated, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorUpdatingQRCode, { variant: 'error' });
    }
};

/**
 * Used for adding QR Code
 *
 * @param {*} restaurantId id of the restaurant
 * @param {*} newQRCode this is the new QR code
 * @param {*} snackbar used for notifications
 */
export const addQRCodeAPI = async (restaurantId, newQRCodeId, newQRCode, snackbar) => {
    try {
        await addQRCodeFirestoreAPI(restaurantId, newQRCodeId, newQRCode);
        snackbar(QRCodeAdded, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorAddingQRCode, { variant: 'error' });
    }
};

/**
 * Used for deleting QR Code
 * @param {*} restaurantId id of the restaurant
 * @param {*} qrCodeId id of the qr code that needs to be deleted
 * @param {*} snackbar used for notifications
 */
export const deleteQRCodeAPI = async (restaurantId, qrCodeId, snackbar) => {
    try {
        const tables = await fetchTablesFirestoreAPI(restaurantId);
        await deleteQRCodeFirestoreAPI(restaurantId, qrCodeId, tables);
    } catch (error) {
        snackbar(ErrorDeletingQRCode, { variant: 'error' });
    }
};

/**
 * Used for changing order of qr codes
 *
 * @param {*} restaurantId id of the restaurant
 * @param {*} qrCodeReferences id of the references of all qr codes
 * @param {*} snackbar used for notifications
 */
export const changeQRCodeOrderAPI = async (restaurantId, qrCodeReferences, snackbar) => {
    try {
        await changeOrderOfQRCodesFirestoreAPI(restaurantId, qrCodeReferences);
        snackbar(QRCodeOrderChanged, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorDeletingQRCode, { variant: 'error' });
    }
};
