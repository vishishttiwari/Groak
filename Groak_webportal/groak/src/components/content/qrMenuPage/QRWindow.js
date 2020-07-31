/**
 * This component is used for representing the qr page
 */
import { PDFViewer } from '@react-pdf/renderer';
import React, { useReducer, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import QRPage from './qrPage/QRPage';

import Heading from '../../ui/heading/Heading';
import './css/QR.css';
import QROptions from './QROptions';
import { context } from '../../../globalState/globalState';

import { updateRestaurantAPI, fetchQRCodesAPI, fetchTableAPI, updateTableAPI } from './QRAPICalls';

function reducer(state, action) {
    let newQRStylePage;
    switch (action.type) {
        case 'fetchQRCodes':
            return { ...state, qrCodes: action.qrCodes, qrCodesMap: action.qrCodesMap };
        case 'fetchTable':
            return { ...state, table: action.table, loadingSpinner: false };
        case 'setQRCodesInTable':
            return { ...state, table: { ...state.table, qrCodes: action.qrCodes, saved: false } };
        case 'setOrientation':
            newQRStylePage = { ...state.qrStylePage, orientation: action.orientation };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setIncludeTable':
            newQRStylePage = { ...state.qrStylePage, includeTable: action.includeTable };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setUseRestaurantImage':
            newQRStylePage = { ...state.qrStylePage, useRestaurantImage: action.useRestaurantImage };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setPageSize':
            newQRStylePage = { ...state.qrStylePage, pageSize: action.pageSize };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setQRStyleImage':
            newQRStylePage = { ...state.qrStylePage, qrStyleImage: action.qrStyleImage };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setFont':
            newQRStylePage = { ...state.qrStylePage, font: action.font };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setWidth':
            newQRStylePage = { ...state.qrStylePage, width: action.width };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setSaved':
            return { ...state, saved: action.saved };
        case 'setShowPDF':
            return { ...state, showPDF: action.showPDF };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        default:
            return state;
    }
}

const QRWindow = (props) => {
    const { history, match, location } = props;
    let tableName = 'Table';
    const { globalState, setGlobalState } = useContext(context);
    const [state, setState] = useReducer(reducer, { qrCodes: [], qrCodesMap: new Map(), table: { qrCodes: [] }, qrStylePage: { ...globalState.restaurant.qrStylePage }, saved: true, showPDF: false, loadingSpinner: true });
    const { enqueueSnackbar } = useSnackbar();

    const query = new URLSearchParams(location.search);
    query.forEach((value) => { tableName = value; });

    useEffect(() => {
        async function fetchQRCodesAndTable() {
            await Promise.all([await fetchQRCodesAPI(globalState.restaurantId, setState, enqueueSnackbar), await fetchTableAPI(globalState.restaurantId, match.params.id, setState, enqueueSnackbar)]);
        }
        fetchQRCodesAndTable();
    }, []);

    /**
     * This function is called for going back
     */
    const goBackHandler = () => {
        history.goBack();
    };

    /**
     * This function is called for when changes need to be saved to restaurant
     *
     * @param {*} event is the event sent from the button
     */
    async function submitHandler(event) {
        event.preventDefault();
        await Promise.all([await updateRestaurantAPI(globalState.restaurantId, state.qrStylePage, setState, setGlobalState, enqueueSnackbar), await updateTableAPI(globalState.restaurantId, match.params.id, state.table, setState, enqueueSnackbar)]);
        enqueueSnackbar('Changes Saved', { variant: 'success' });
        setState({ type: 'setSaved', saved: true });
    }

    return (
        <div className="qr">
            <Heading heading="QR Menu Page" />
            <div className="qr-content">

                <PDFViewer className="qr-page" filename={`${tableName}.pdf`}>
                    <QRPage
                        restaurantReference={globalState.restaurantId}
                        tableReference={match.params.id}
                        tableName={tableName}
                        qrStylePage={state.qrStylePage}
                        table={state.table}
                        qrCodesMap={state.qrCodesMap}
                        restaurantName={globalState.restaurant.name}
                        logo={globalState.restaurant.logo}
                        image={globalState.restaurant.image}
                        showPDF={state.showPDF}
                    />
                </PDFViewer>

                <QROptions
                    restaurantReference={globalState.restaurantId}
                    tableReference={match.params.id}
                    tableName={tableName}
                    state={state}
                    restaurantName={globalState.restaurant.name}
                    logo={globalState.restaurant.logo}
                    image={globalState.restaurant.image}
                    setState={setState}
                    loadingSpinner={state.loadingSpinner}
                    goBackHandler={goBackHandler}
                    submitHandler={submitHandler}
                />
            </div>
        </div>
    );
};

QRWindow.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};

export default withRouter(React.memo(QRWindow));
