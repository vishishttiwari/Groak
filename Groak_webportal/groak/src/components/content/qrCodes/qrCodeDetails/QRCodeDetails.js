/**
 * This component is used for the qrcode details page
 */
import React, { useReducer, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { TextField } from '@material-ui/core';
import { context } from '../../../../globalState/globalState';

import './css/QRCodeDetails.css';
import { fetchQRCodeAPI, fetchCategoriesAPI, deleteQRCodeAPI, addQRCodeAPI, updateQRCodeAPI } from '../QRCodesAPICalls';
import { InvalidQRCodeTitle } from '../../../../catalog/NotificationsComments';
import Heading from '../../../ui/heading/Heading';
import Spinner from '../../../ui/spinner/Spinner';
import QRCodeSelectedCategories from './QRCodeSelectedCategories';
import QRCodeUnselectedCategories from './QRCodeUnselectedCategories';
import QRCodeMainButtons from './QRCodeMainButtons';
import { createRestaurantReference } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsRestaurants';
import { createCategoryReferenceFromPath } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';
import { createQRCodeReference } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsQRCodes';
import { randomNumber } from '../../../../catalog/Others';
import { DemoQRCodeName } from '../../../../catalog/Demo';

const initialState = {
    checkFields: false,
    newQRCode: true,
    qrCodeAvailable: false,
    qrCodeName: '',
    qrCodeSelectedCategoriesPath: [],
    allCategories: [],
    allCategoriesMap: new Map(),
    loadingSpinner: true };

function reducer(state, action) {
    switch (action.type) {
        case 'setCheckFields':
            return { ...state, checkFields: action.checkFields };
        case 'setName':
            return { ...state, qrCodeName: action.name };
        case 'setNewQRCode':
            return { ...state, newQRCode: action.newQRCode };
        case 'setSelectedCategories':
            return { ...state, qrCodeSelectedCategoriesPath: action.qrCodeSelectedCategoriesPath };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        case 'fetchCategories':
            return { ...state, allCategories: action.categories, allCategoriesMap: action.categoriesMap, loadingSpinner: false };
        case 'fetchQRCode':
            return { ...state, qrCodeName: action.name, qrCodeSelectedCategoriesPath: action.categories, qrCodeAvailable: action.available };
        default:
            return initialState;
    }
}

const QRCodeDetails = (props) => {
    const { history, match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        async function fetchQRCodeAndCategories() {
            await Promise.all([await fetchQRCodeAPI(globalState.restaurantId, match.params.id, setState, enqueueSnackbar), await fetchCategoriesAPI(globalState.restaurantId, setState, enqueueSnackbar)]);
        }
        async function fetchCategories() {
            await fetchCategoriesAPI(globalState.restaurantId, setState, enqueueSnackbar);
        }
        if (match.params.id !== 'addQRCode' && match.params.id !== 'newQRCode') {
            fetchQRCodeAndCategories();
            setState({ type: 'setNewQRCode', newQRCode: false });
        } else {
            fetchCategories();
        }
    }, [match.params.id, enqueueSnackbar, globalState.restaurantId]);

    /**
     * Used for creating a qr code object whensaving or updating
     */
    const createQRCode = (qrCodeId) => {
        return {
            available: true,
            name: state.qrCodeName,
            categories: state.qrCodeSelectedCategoriesPath.map((categoryPath) => {
                return createCategoryReferenceFromPath(categoryPath);
            }),
            restaurantName: globalState.restaurant.name,
            restaurantReference: createRestaurantReference(globalState.restaurantId),
            reference: createQRCodeReference(globalState.restaurantId, qrCodeId),
        };
    };

    /**
     * This function is called whenever a qrcode is selected or deselected both in selected qrcodes and unselected
     * qrcodes.
     *
     * @param {*} event this tells if topic was checked or unchecked
     * @param {*} path path of the category that is checked or unchecked
     */
    const checkCategoryHandler = (event, path) => {
        let newQRCodeSelectedCategoriesPath = [...state.qrCodeSelectedCategoriesPath];
        if (event.target.checked) {
            newQRCodeSelectedCategoriesPath.push(path);
        } else {
            newQRCodeSelectedCategoriesPath = newQRCodeSelectedCategoriesPath.filter((category) => {
                return (category !== path);
            });
        }
        setState({ type: 'setSelectedCategories', qrCodeSelectedCategoriesPath: newQRCodeSelectedCategoriesPath });
    };

    /**
     * This is used when category's position is changed
     *
     * @param {*} categories categories with updated order
     */
    const changeCategoryPositionHandler = (categories) => {
        setState({ type: 'setSelectedCategories', qrCodeSelectedCategoriesPath: categories });
    };

    /**
     * This function is called when the save/add changes button is pressed
     *
     * @param {*} event this is the event sent from the submit button
     */
    const submitHandler = async (event) => {
        event.preventDefault();
        setState({ type: 'setCheckFields', checkFields: true });
        if (state.qrCodeName.length === 0) {
            enqueueSnackbar(InvalidQRCodeTitle, { variant: 'error' });
            return;
        }
        setState({ type: 'setLoadingSpinner', loadingSpinner: true });
        if (state.newQRCode) {
            const qrCodeid = randomNumber();
            await addQRCodeAPI(globalState.restaurantId, qrCodeid, createQRCode(qrCodeid), enqueueSnackbar);
        } else {
            await updateQRCodeAPI(globalState.restaurantId, match.params.id, createQRCode(), enqueueSnackbar);
        }
        history.goBack();
        setState({ type: 'setLoadingSpinner', loadingSpinner: false });
    };

    /**
     * This function is called when delete button is pressed
     */
    const deleteHandler = async () => {
        if (!state.newQRCode) {
            setState({ type: 'setLoadingSpinner', loadingSpinner: true });
            await deleteQRCodeAPI(globalState.restaurantId, match.params.id, enqueueSnackbar);
            history.goBack();
            setState({ type: 'setLoadingSpinner', loadingSpinner: false });
        }
    };

    /**
     * This function is called to go back when the cancel button is pressed
     */
    const goBackHandler = () => {
        history.goBack();
    };

    return (
        <div className="qrcode-details">
            <Heading heading={!state.qrCodeName || state.qrCodeName.length === 0 ? 'QR Code Details' : state.qrCodeName} />
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <form>
                    <TextField
                        label="Title"
                        type="text"
                        autoFocus
                        placeholder={`Ex: ${DemoQRCodeName}`}
                        value={state.qrCodeName}
                        onChange={(event) => { setState({ type: 'setName', name: event.target.value }); }}
                        margin="normal"
                        fullWidth
                        required
                        error={(state.qrCodeName.length <= 0) && state.checkFields}
                        shrink={(state.qrCodeName.length > 0).toString()}
                        variant="outlined"
                    />
                    <QRCodeSelectedCategories
                        allCategoriesMap={state.allCategoriesMap}
                        selectedCategoriesPath={state.qrCodeSelectedCategoriesPath}
                        checkCategoryHandler={checkCategoryHandler}
                        changeCategoryPositionHandler={changeCategoryPositionHandler}
                    />
                    <QRCodeUnselectedCategories
                        allCategories={state.allCategories}
                        selectedCategoriesPath={state.qrCodeSelectedCategoriesPath}
                        checkCategoryHandler={checkCategoryHandler}
                    />
                    <QRCodeMainButtons
                        goBackHandler={goBackHandler}
                        submitHandler={submitHandler}
                        newQRCode={state.newQRCode}
                        deleteHandler={deleteHandler}
                    />
                </form>
            ) : null}
        </div>
    );
};

QRCodeDetails.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(QRCodeDetails));
