/**
 * This component is used for representing the qr page
 */
import { PDFViewer } from '@react-pdf/renderer';
import React, { useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import QRPage from './qrPage/QRPage';

import Heading from '../../ui/heading/Heading';
import './css/QR.css';
import QROptions from './QROptions';
import { context } from '../../../globalState/globalState';

import { updateRestaurantAPI } from './QRAPICalls';

function reducer(state, action) {
    let newQRStylePage;
    switch (action.type) {
        case 'setIncludeTable':
            newQRStylePage = { ...state.qrStylePage, includeTable: action.includeTable };
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
    const [state, setState] = useReducer(reducer, { qrStylePage: { ...globalState.restaurant.qrStylePage }, saved: true, loadingSpinner: false });
    const { enqueueSnackbar } = useSnackbar();

    const query = new URLSearchParams(location.search);
    query.forEach((value) => { tableName = value; });

    /**
     * This function is called for going back
     */
    const goBackHandler = () => {
        history.goBack();
    };

    /**
     * This function is called for when changed need to be saved to restaurant
     *
     * @param {*} event is the event sent from the button
     */
    async function submitHandler(event) {
        event.preventDefault();
        await updateRestaurantAPI(globalState.restaurantId, state.qrStylePage, setState, setGlobalState, enqueueSnackbar);
        setState({ type: 'setSaved', saved: true });
    }

    return (
        <div className="qr">
            <Heading heading="QR Code" />
            <div className="qr-content">
                <PDFViewer className="qr-page" filename={`${tableName}.pdf`}>
                    <QRPage tableReference={match.params.id} tableName={tableName} state={state.qrStylePage} restaurantName={globalState.restaurant.name} logo={globalState.restaurant.logo} />
                </PDFViewer>
                <QROptions
                    tableReference={match.params.id}
                    tableName={tableName}
                    state={state}
                    restaurantName={globalState.restaurant.name}
                    logo={globalState.restaurant.logo}
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
