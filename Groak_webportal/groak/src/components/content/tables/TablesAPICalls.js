/**
 * This class includes tables related functions such as fetching table, updating table etc.
 */
import { addTableFirestoreAPI, fetchTablesRealtimeFirestoreAPI, fetchTableFirestoreAPI, updateTableFirestoreAPI, deleteTableFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsTables';
import { ErrorAddingTable, ErrorFetchingTables, ErrorFetchingTable, ErrorUpdatingTable, ErrorDeletingTable, TableNotFound, OrderAdded, OrderReadyForPayment, ErrorUnsubscribingTables, SpecialRequest } from '../../../catalog/NotificationsComments';
import { TableStatus } from '../../../catalog/Others';

let tablesSnapshot;

/**
 * This function is used for unsubscribing from realtime updates of order
 *
 * @param {*} snackbar used for notifications
 */
export const unsubscribeFetchTablesAPI = (snackbar) => {
    try {
        if (tablesSnapshot) {
            tablesSnapshot();
        }
    } catch (error) {
        snackbar(ErrorUnsubscribingTables, { variant: 'error' });
    }
};

/**
 * This function is used for adding table to the backend
 *
 * @param {*} restaurantId id of the restaurant for which table is needs to be added
 * @param {*} table this contains information about the table
 * @param {*} table this contains information about all tables in which the new table needs to be added
 * @param {*} setState this is used for setting the component with initial state
 * @param {*} snackbar this is used for notifications
 */
export const addTableAPI = async (restaurantId, table, tables, setState, snackbar) => {
    try {
        await addTableFirestoreAPI(restaurantId, table.id, table);
        tables.push(table);
        setState({ type: 'addTable', tables, addTableAlert: false });
    } catch (error) {
        snackbar(ErrorAddingTable, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This function is used for fetching tables
 *
 * @param {*} restaurantId id of the restaurant for which tables needed to be fetched
 * @param {*} setState this is used for setting the component with initial state
 * @param {*} snackbar this is used for notifications
 */
export const fetchTablesAPI = async (restaurantId, setState, snackbar) => {
    try {
        let newTables = [];
        const getTables = (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
                let oldStatus;
                let oldNewRequest;
                newTables = newTables.filter((table) => {
                    if (table.id === change.doc.id) {
                        oldStatus = table.status;
                        oldNewRequest = table.newRequest;
                    }
                    return (table.id !== change.doc.id);
                });
                newTables.push({ id: change.doc.id, ...change.doc.data() });
                if (change.type === 'modified') {
                    const { status, newRequest } = change.doc.data();
                    // This if is used to check if changes have occurred in status. We dont
                    // want to report any changes that occur on lets say the x and y coordinates of the table etc.
                    if (oldStatus !== status) {
                        if (status === TableStatus.ordered) {
                            snackbar(OrderAdded(change.doc.data().name), { variant: 'success' });
                        } else if (status === TableStatus.payment) {
                            snackbar(OrderReadyForPayment(change.doc.data().name), { variant: 'success' });
                        }
                    }
                    if (oldNewRequest !== newRequest) {
                        snackbar(SpecialRequest(change.doc.data().name), { variant: 'success' });
                    }
                }
            });
            setState({ type: 'fetchTables', tables: newTables });
        };
        tablesSnapshot = await fetchTablesRealtimeFirestoreAPI(restaurantId, getTables);
    } catch (error) {
        snackbar(ErrorFetchingTables, { variant: 'error' });
        setState({ type: 'error' });
        unsubscribeFetchTablesAPI(snackbar);
    }
};

/**
 * This function is used for fetching table
 *
 * @param {*} restaurantId id of the restaurant for which table needed to be fetched
 * @param {*} tableId id of the table needs to be fetched
 * @param {*} setState this is used for setting the component with initial state
 * @param {*} snackbar this is used for notifications
 */
export const fetchTableAPI = async (restaurantId, tableId, setState, snackbar) => {
    try {
        const doc = await fetchTableFirestoreAPI(restaurantId, tableId);
        if (doc.exists) {
            setState({ type: 'fetchTable', table: { id: tableId, ...doc.data() }, initialName: doc.data().name });
        } else {
            snackbar(TableNotFound, { variant: 'error' });
            setState({ type: 'error' });
        }
    } catch (error) {
        snackbar(ErrorFetchingTable, { variant: 'error' });
        setState({ type: 'error' });
    }
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

/**
 * This function is used for deleting table
 *
 * @param {*} restaurantId id of the restaurant for which table needs to be deleted
 * @param {*} tableId id of the table that needs to be deleted
 * @param {*} setState this is used for setting the component with initial state
 * @param {*} snackbar this is used for notifications
 */
export const deleteTableAPI = async (restaurantId, tableId, setState, snackbar) => {
    try {
        await deleteTableFirestoreAPI(restaurantId, tableId);
    } catch (error) {
        snackbar(ErrorDeletingTable, { variant: 'error' });
        setState({ type: 'error' });
    }
};
