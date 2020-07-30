/**
 * This component is used for the qr codes page
 */
import React, { useReducer, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import arrayMove from 'array-move';
import { context } from '../../../globalState/globalState';

import './css/QRCodes.css';
import { fetchQRCodesAPI, fetchCategoriesAPI, updateQRCodeAPI, changeQRCodeOrderAPI } from './QRCodesAPICalls';
import QRCode from './qrCode/QRCode';
import Heading from '../../ui/heading/Heading';
import Spinner from '../../ui/spinner/Spinner';
import SortableList from '../../dnd/SortableList';
import SortableItem from '../../dnd/SortableItem';

const initialState = { qrCodes: [], categoriesMap: new Map(), categories: [], loadingSpinner: true };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchQRCodes':
            return { ...state, qrCodes: action.qrCodes, loadingSpinner: false };
        case 'fetchCategories':
            return { ...state, categoriesMap: action.categoriesMap, categories: action.categories, loadingSpinner: false };
        case 'setQRCodes':
            return { ...state, qrCodes: action.updatedQRCodes, loadingSpinner: false };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        default:
            return state;
    }
}

const QRCodes = (props) => {
    const { history } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        async function fetchQRCodes() {
            await Promise.all([await fetchQRCodesAPI(globalState.restaurantId, setState, enqueueSnackbar), await fetchCategoriesAPI(globalState.restaurantId, setState, enqueueSnackbar)]);
        }
        fetchQRCodes();
    }, [globalState.restaurantId, enqueueSnackbar]);

    /**
     * This is called when something needs to be saved permanently on database
     *
     * @param {*} changedQRCode
     */
    async function updateQRCodePermanentlyHandler(changedQRCode) {
        await updateQRCodeAPI(globalState.restaurantId, changedQRCode.id, changedQRCode, enqueueSnackbar);
        setState({ type: 'setQRCodes',
            updatedQRCodes: state.qrCodes.map((qrCode) => {
                if (qrCode.id !== changedQRCode.id) { return qrCode; }
                return changedQRCode;
            }),
        });
    }

    /**
     * This function is called when there are some changed made localy
     *
     * @param {*} changedQRCode
     */
    function updateQRCodeLocallyHandler(changedQRCode) {
        setState({ type: 'setQRCodes',
            updatedQRCodes: state.qrCodes.map((qrCode) => {
                if (qrCode.id !== changedQRCode.id) { return qrCode; }
                return changedQRCode;
            }),
        });
    }

    /**
     * This function is called when add QR code button is pressed
     */
    function addQRCodeHandler() {
        history.push('/qrcodes/addQRCode');
    }

    /**
     * This function is called when qrCode is pressed
     *
     * @param {*} id
     */
    function qrCodeDetailHandler(id) {
        history.push(`/qrcodes/${id}`);
    }

    /**
     * This function is called when drag and drop has ended
     *
     * @param {*} param0
     */
    const onSortEnd = async ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            const updatedQRCodes = arrayMove(state.qrCodes, oldIndex, newIndex);
            setState({ type: 'setQRCodes',
                updatedQRCodes,
            });
            await changeQRCodeOrderAPI(globalState.restaurantId, updatedQRCodes.map((qrCode) => {
                return qrCode.reference;
            }), enqueueSnackbar);
        }
    };

    return (
        <div className="qrcodes">
            <Heading heading="QR Codes" buttonName="Add QR Code" onClick={addQRCodeHandler} />
            <Spinner show={state.loadingSpinner} />
            {state.qrCodes && state.qrCodes.length !== 0 ? <p className="text-on-background">{}</p> : null}
            {!state.loadingSpinner ? (
                <SortableList axis="xy" onSortEnd={onSortEnd} distance={1}>
                    <div className="qrcode-items">
                        {state.qrCodes && state.qrCodes.length === 0 ? <p className="text-on-background">{}</p> : null}
                        {state.qrCodes.map((qrCode, index) => {
                            return (
                                <SortableItem key={qrCode.id} index={index}>
                                    <QRCode
                                        qrCodeItem={qrCode}
                                        categories={state.categories}
                                        categoriesMap={state.categoriesMap}
                                        updateQRCodeLocallyHandler={updateQRCodeLocallyHandler}
                                        updateQRCodePermanentlyHandler={updateQRCodePermanentlyHandler}
                                        clickHandler={() => { qrCodeDetailHandler(qrCode.id); }}
                                    />
                                </SortableItem>
                            );
                        })}
                    </div>
                </SortableList>
            ) : null}
        </div>
    );
};

QRCodes.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(QRCodes);
