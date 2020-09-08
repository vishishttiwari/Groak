/**
 * This component is used for the qr codes page
 */
import React, { useReducer, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import arrayMove from 'array-move';
import { Button, Switch } from '@material-ui/core';
import { context } from '../../../globalState/globalState';

import './css/QRCodes.css';
import { fetchQRCodesAPI, fetchCategoriesAPI, updateQRCodeAPI, changeQRCodeOrderAPI } from './QRCodesAPICalls';
import QRCode from './qrCode/QRCode';
import Heading from '../../ui/heading/Heading';
import Spinner from '../../ui/spinner/Spinner';
import SortableList from '../../dnd/SortableList';
import SortableItem from '../../dnd/SortableItem';
import Empty from '../../../assets/others/empty.png';
import { MaximumQRCodeLimitReached } from '../../../catalog/NotificationsComments';
import { QRCodesOrder, NoQRCodes, QRCodesNotFound, FrontDoorQRMenuPage } from '../../../catalog/Comments';
import { frontDoorQRMenuPageId } from '../../../catalog/Others';

const initialState = { qrCodes: [], categoriesMap: new Map(), categories: [], changeOrder: false, loadingSpinner: true };

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
        case 'setChangeOrder':
            return { ...state, changeOrder: action.changeOrder };
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
        async function fetchQRCodesAndCategories() {
            await Promise.all([await fetchQRCodesAPI(globalState.restaurantIdPortal, setState, enqueueSnackbar), await fetchCategoriesAPI(globalState.restaurantIdPortal, setState, enqueueSnackbar)]);
        }
        fetchQRCodesAndCategories();
    }, [globalState.restaurantIdPortal, enqueueSnackbar]);

    /**
     * This is called when something needs to be saved permanently on database
     *
     * @param {*} changedQRCode
     */
    async function updateQRCodePermanentlyHandler(changedQRCode) {
        await updateQRCodeAPI(globalState.restaurantIdPortal, changedQRCode.id, changedQRCode, enqueueSnackbar);
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
        if (!state.loadingSpinner) {
            if (state.qrCodes.length >= 5) {
                enqueueSnackbar(MaximumQRCodeLimitReached, { variant: 'error' });
            } else {
                history.push('/qrcodes/addQRCode');
            }
        }
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
            await changeQRCodeOrderAPI(globalState.restaurantIdPortal, updatedQRCodes.map((qrCode) => {
                return qrCode.reference;
            }), enqueueSnackbar);
        }
    };

    /**
     * This function is used for saving restaurant information
     *
     * @param {*} event this is received from the submit button
     */
    const frontDoorQRPage = async (event) => {
        event.preventDefault();
        history.push({
            pathname: `/qrmenupage/${frontDoorQRMenuPageId}`,
        });
    };

    /**
     * This function is called when order toggle is pressed
     *
     * @param {*} checked
     */
    const orderToggle = (checked) => {
        setState({ type: 'setChangeOrder', changeOrder: checked });
    };

    return (
        <div className="qrcodes">
            <Heading heading="QR Codes" buttonName="Add QR Code" onClick={addQRCodeHandler} />
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <>
                    <p className="text-on-background">
                        {FrontDoorQRMenuPage}
                    </p>
                    <Button
                        className="normal-buttons"
                        type="submit"
                        onClick={frontDoorQRPage}
                    >
                        Front Door Menu
                    </Button>
                    {state.qrCodes && state.qrCodes.length === 0 ? (
                        <>
                            <p className="text-on-background">{NoQRCodes}</p>
                            <div className="not-found">
                                <p className="not-found-text">{QRCodesNotFound}</p>
                                <img className="not-found-image" draggable="false" src={Empty} alt="No Categories" />
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-on-background">{QRCodesOrder}</p>
                            <div className="order-change-toggle">
                                <Switch
                                    checked={state.changeOrder}
                                    size="medium"
                                    onChange={(event) => { orderToggle(event.target.checked); }}
                                    name="changeOrder"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                    color="primary"
                                />
                                <p className="toggle-label">Change Order</p>
                            </div>
                        </>
                    )}
                    <SortableList axis="xy" onSortEnd={onSortEnd} distance={1} useWindowAsScrollContainer>
                        <div className="qrcode-items">

                            {state.qrCodes.map((qrCode, index) => {
                                return (
                                    <SortableItem key={qrCode.id} index={index} distance={1} disabled={!state.changeOrder}>
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
                </>
            ) : null}
        </div>
    );
};

QRCodes.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(QRCodes);
