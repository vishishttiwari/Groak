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
import { frontDoorQRMenuPageId, frontDoorInstructions } from '../../../catalog/Others';
import { QRMenuPageUpdated } from '../../../catalog/NotificationsComments';
import { RenderPDF } from '../../../catalog/Comments';

function reducer(state, action) {
    let newQRStylePage;
    switch (action.type) {
        case 'fetchQRCodes':
            return { ...state, qrCodes: action.qrCodes, qrCodesMap: action.qrCodesMap };
        case 'fetchTable':
            return { ...state, table: action.table, loadingSpinner: false };
        case 'setQRCodesInTable':
            return { ...state, table: { ...state.table, qrCodes: action.qrCodes }, saved: false };
        case 'setFormat':
            newQRStylePage = { ...state.qrStylePage, format: action.format };
            return { ...state, qrStylePage: newQRStylePage, saved: false, showPDF: false };
        case 'setIncludeTable':
            newQRStylePage = { ...state.qrStylePage, includeTable: action.includeTable };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setUseRestaurantImage':
            newQRStylePage = { ...state.qrStylePage, useRestaurantImage: action.useRestaurantImage };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setPageSize':
            newQRStylePage = { ...state.qrStylePage, pageSize: action.pageSize };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setPageBackgroundColor':
            newQRStylePage = { ...state.qrStylePage, pageBackgroundColor: action.pageBackgroundColor };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setQRStyleImage':
            newQRStylePage = { ...state.qrStylePage, qrStyleImage: action.qrStyleImage };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setFont':
            newQRStylePage = { ...state.qrStylePage, font: action.font };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setTextColor':
            newQRStylePage = { ...state.qrStylePage, textColor: action.textColor };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setLogoWidth':
            newQRStylePage = { ...state.qrStylePage, logoWidth: action.logoWidth };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setRestaurantImageWidth':
            newQRStylePage = { ...state.qrStylePage, restaurantImageWidth: action.restaurantImageWidth };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setRestaurantImageHeight':
            newQRStylePage = { ...state.qrStylePage, restaurantImageHeight: action.restaurantImageHeight };
            return { ...state, qrStylePage: newQRStylePage, saved: false };
        case 'setRestaurantImageBackgroundColor':
            newQRStylePage = { ...state.qrStylePage, restaurantImageBackgroundColor: action.restaurantImageBackgroundColor };
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
    const [state, setState] = useReducer(reducer, { qrCodes: [], qrCodesMap: new Map(), table: { qrCodes: [] }, qrStylePage: { ...globalState.restaurantPortal.qrStylePage }, saved: true, showPDF: false, loadingSpinner: true });
    const { enqueueSnackbar } = useSnackbar();

    const query = new URLSearchParams(location.search);
    query.forEach((value) => { tableName = value; });

    useEffect(() => {
        async function fetchQRCodesAndTable() {
            await Promise.all([await fetchQRCodesAPI(globalState.restaurantPortalIdPortal, setState, enqueueSnackbar), await fetchTableAPI(globalState.restaurantPortalIdPortal, match.params.tableid, setState, enqueueSnackbar)]);
        }
        async function fetchQRCodes() {
            await fetchQRCodesAPI(globalState.restaurantPortalIdPortal, setState, enqueueSnackbar);
            setState({ type: 'fetchTable', table: { qrCodes: [] } });
        }
        if (match.params.tableid === frontDoorQRMenuPageId) {
            fetchQRCodes();
        } else {
            fetchQRCodesAndTable();
        }
    }, [globalState.restaurantPortalIdPortal, match.params.tableid, enqueueSnackbar]);

    /**
     * This function is called for going back
     */
    const goBackHandler = () => {
        history.replace('/tables');
    };

    /**
     * This function is called for when changes need to be saved to restaurant
     *
     * @param {*} event is the event sent from the button
     */
    async function submitHandler(event) {
        event.preventDefault();
        if (match.params.tableid === frontDoorQRMenuPageId) {
            await updateRestaurantAPI(globalState.restaurantPortalIdPortal, state.qrStylePage, setState, setGlobalState, enqueueSnackbar);
        } else {
            await Promise.all([await updateRestaurantAPI(globalState.restaurantPortalIdPortal, state.qrStylePage, setState, setGlobalState, enqueueSnackbar), await updateTableAPI(globalState.restaurantPortalIdPortal, match.params.tableid, state.table, setState, enqueueSnackbar)]);
        }

        enqueueSnackbar(QRMenuPageUpdated, { variant: 'success' });
        setState({ type: 'setSaved', saved: true });
    }

    return (
        <div className="qr">
            <Heading heading="QR Menu Page" />
            <p className="text-on-background">{RenderPDF}</p>
            <div className="qr-content">
                <PDFViewer className="qr-page" filename={`${tableName}.pdf`}>
                    <QRPage
                        restaurantReference={globalState.restaurantPortalIdPortal}
                        tableReference={match.params.tableid}
                        tableName={match.params.tableid === frontDoorQRMenuPageId ? frontDoorInstructions : tableName}
                        qrStylePage={state.qrStylePage}
                        table={state.table}
                        qrCodesMap={state.qrCodesMap}
                        restaurantName={globalState.restaurantPortal.name}
                        logo={globalState.restaurantPortal.logo}
                        image={globalState.restaurantPortal.image}
                        showPDF={state.showPDF}
                    />
                </PDFViewer>

                <QROptions
                    restaurantReference={globalState.restaurantPortalIdPortal}
                    tableReference={match.params.tableid}
                    tableName={match.params.tableid === frontDoorQRMenuPageId ? frontDoorInstructions : tableName}
                    state={state}
                    restaurantName={globalState.restaurantPortal.name}
                    logo={globalState.restaurantPortal.logo}
                    image={globalState.restaurantPortal.image}
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
