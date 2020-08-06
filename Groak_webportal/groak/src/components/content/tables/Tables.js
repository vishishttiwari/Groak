/**
 * This component is used to represent the full table component that includes heading and table canvas
 */
import React, { useReducer, useEffect, useContext } from 'react';
import { useSnackbar } from 'notistack';
import { context } from '../../../globalState/globalState';

import './css/Tables.css';
import { fetchTablesAPI, addTableAPI, deleteTableAPI, updateTableAPI, unsubscribeFetchTablesAPI } from './TablesAPICalls';
import { randomNumber, TableStatus } from '../../../catalog/Others';
import Heading from '../../ui/heading/Heading';
import TablesCanvas from './TablesCanvas';
import AddTableAlert from './TableAlert/AddTableAlert';
import ShowTableAlert from './TableAlert/ShowTableAlert';
import { InvalidTableName } from '../../../catalog/NotificationsComments';
import { TablesDesc } from '../../../catalog/Comments';

const initialState = { tables: [], addTableAlert: false, showTableAlert: false, selectedTableId: '' };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchTables':
            return { ...state, tables: action.tables };
        case 'setTables':
            return { ...state, tables: action.tables };
        case 'setAddTableAlert':
            return { ...state, addTableAlert: action.addTableAlert };
        case 'setShowTableAlert':
            return { ...state, showTableAlert: action.showTableAlert };
        case 'setSelectedTableId':
            return { ...state, selectedTableId: action.selectedTableId, showTableAlert: action.showTableAlert };
        case 'addTable':
            return { ...state, tables: action.tables, addTableAlert: action.addTableAlert };
        case 'deleteTable':
            return { ...state, tables: action.tables, showTableAlert: action.showTableAlert };
        case 'updateTable':
            return { ...state, tables: action.tables, showTableAlert: action.showTableAlert };
        default:
            return initialState;
    }
}

const Tables = () => {
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        async function fetchTables() {
            await fetchTablesAPI(globalState.restaurantId, setState, enqueueSnackbar);
        }
        fetchTables();

        return () => {
            unsubscribeFetchTablesAPI(enqueueSnackbar);
        };
    }, [globalState.restaurantId, enqueueSnackbar]);

    /**
     * This function is called when a table is added grom the add table pop up
     *
     * @param {*} name this is the name of the table that is supposed to be added
     */
    const addTableHandler = async (name) => {
        if (name.length === 0) {
            enqueueSnackbar(InvalidTableName, { variant: 'error' });
            return;
        }
        const newTables = [...state.tables];
        const newTable = {
            id: randomNumber(),
            status: TableStatus.available,
            name,
            x: 0,
            y: 0,
        };
        await addTableAPI(globalState.restaurantId, globalState.restaurant.name, newTable, newTables, setState, enqueueSnackbar);
    };

    /**
     * This function is called when a table needs to be deleted
     *
     * @param {*} table this is the table that needs to be deleted
     */
    const deleteTableHandler = async (table) => {
        let newTables = [...state.tables];
        await deleteTableAPI(globalState.restaurantId, table.id, setState, enqueueSnackbar);
        newTables = newTables.filter((eachTable) => {
            return (eachTable.id !== table.id);
        });
        setState({ type: 'deleteTable', tables: newTables, showTableAlert: false });
    };

    /**
     * This function is called when a table name needs to be updated
     *
     * @param {*} table this is the table that needs to be updated
     */
    const updateTableHandler = async (table) => {
        if (table.name.length === 0) {
            enqueueSnackbar(InvalidTableName, { variant: 'error' });
            return;
        }
        const toBeUpdatedData = { name: table.name };
        let newTables = [...state.tables];
        await updateTableAPI(globalState.restaurantId, table.id, toBeUpdatedData, setState, enqueueSnackbar);
        newTables = newTables.map((eachTable) => {
            if (eachTable.id !== table.id) {
                return eachTable;
            }
            return table;
        });
        setState({ type: 'updateTable', tables: newTables, showTableAlert: false });
    };

    /**
     * This function is called when the table is clicked. It popups the show table pop up
     *
     * @param {*} id is of the table that is clicked
     */
    const tableClickHandler = (id) => {
        setState({ type: 'setSelectedTableId', selectedTableId: id, showTableAlert: true });
    };

    /**
     * This function is called when the add table button is pressed in the table component
     */
    const openAddTableAlert = () => {
        setState({ type: 'setAddTableAlert', addTableAlert: true });
    };

    /**
     * This function is called when the add table alert needs to be closed
     */
    const closeAddTableAlert = () => {
        setState({ type: 'setAddTableAlert', addTableAlert: false });
    };

    /**
     * This function is called when the show table alert needs to be closed
     */
    const closeShowTableAlert = () => {
        setState({ type: 'setShowTableAlert', showTableAlert: false });
    };

    return (
        <>
            <AddTableAlert
                open={state.addTableAlert}
                addHandler={addTableHandler}
                closeHandler={closeAddTableAlert}
            />
            <ShowTableAlert
                open={state.showTableAlert}
                tableId={state.selectedTableId}
                updateHandler={updateTableHandler}
                deleteHandler={deleteTableHandler}
                closeHandler={closeShowTableAlert}
            />
            <div className="tables">
                <Heading
                    heading="Tables"
                    buttonName="Add Table"
                    onClick={openAddTableAlert}
                />
                <p className="text-on-background">{TablesDesc}</p>
                <TablesCanvas
                    tables={state.tables}
                    setState={setState}
                    tableClickHandler={tableClickHandler}
                />
            </div>
        </>
    );
};

export default React.memo(Tables);
