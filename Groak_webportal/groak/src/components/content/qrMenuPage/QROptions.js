/**
 * This component is used for showing the options on the qr page
 */
import { PDFDownloadLink } from '@react-pdf/renderer';
import React from 'react';
import PropTypes from 'prop-types';

import { FormControlLabel, Checkbox, Select, OutlinedInput, Button, Slider } from '@material-ui/core';
import { CheckBox } from '@material-ui/icons';
import ColorPicker from 'material-ui-color-picker';

import QRPage from './qrPage/QRPage';
import { getFonts, getQRStyleImages, frontDoorQRMenuPageId } from '../../../catalog/Others';
import { IncludeLogoMessage } from '../../../catalog/Comments';
import Spinner from '../../ui/spinner/Spinner';

const QROptions = (props) => {
    const { restaurantReference, tableReference, tableName, state, logo, image, restaurantName, setState, loadingSpinner, goBackHandler, submitHandler } = props;
    const formats = ['Format 1', 'Format 2', 'Format 3'];
    const pageSizeOptions = ['A2', 'A3', 'A4', 'A5', 'A6', 'LETTER', 'TABLOID'];
    const fontOptions = Object.keys(getFonts());
    const qrImages = Object.keys(getQRStyleImages());

    const getSelectedQRCodePaths = () => {
        if (!state || !state.table || !state.table.qrCodes) return [];
        return state.table.qrCodes.map((qrCode) => {
            return qrCode.path;
        });
    };

    const checked = (checkedValue, qrCodeReference) => {
        let newQRCodes = state.table.qrCodes;
        if (checkedValue) {
            newQRCodes.push(qrCodeReference);
        } else {
            newQRCodes = newQRCodes.filter((qrCode) => {
                return qrCode.path !== qrCodeReference.path;
            });
        }
        setState({ type: 'setQRCodesInTable', qrCodes: newQRCodes });
    };

    return (
        <form>
            <p>Format</p>
            <p className="submessages">Rerender pdf whenever you change format to see any changes</p>
            <Select
                native
                fullWidth
                value={state.qrStylePage.format}
                onChange={(event) => { setState({ type: 'setFormat', format: event.target.value }); }}
                input={<OutlinedInput />}
            >
                {formats.map((format) => {
                    return (<option key={format} value={format}>{format}</option>);
                })}
            </Select>
            <p>Logo Width</p>
            {!logo ? <p className="submessages">{IncludeLogoMessage}</p> : null}
            <Slider
                value={state.qrStylePage.logoWidth}
                className="width-slider"
                marks={[{ value: 0, label: '0%' }, { value: 100, label: '100°%' }]}
                onChange={(event, value) => { setState({ type: 'setLogoWidth', logoWidth: value }); }}
            />
            <FormControlLabel
                style={{ textTransform: 'capitalize' }}
                control={(
                    <Checkbox
                        className="check-box"
                        checkedIcon={<CheckBox className="check-box" />}
                        checked={state.qrStylePage.includeTable}
                        onChange={(event) => { setState({ type: 'setIncludeTable', includeTable: event.target.checked }); }}
                    />
                )}
                label={tableReference === frontDoorQRMenuPageId ? 'Include instructions' : 'Include table Name'}
            />
            <p>Page Size</p>
            <Select
                native
                fullWidth
                value={state.qrStylePage.pageSize}
                onChange={(event) => { setState({ type: 'setPageSize', pageSize: event.target.value }); }}
                input={<OutlinedInput />}
            >
                {pageSizeOptions.map((option) => {
                    return (<option key={option} value={option}>{option}</option>);
                })}
            </Select>
            <p>Page Background Color</p>
            <ColorPicker
                name="Page Background Color"
                defaultValue="Choose Color"
                value={state.qrStylePage.pageBackgroundColor}
                onChange={(color) => { setState({ type: 'setPageBackgroundColor', pageBackgroundColor: color }); }}
            />
            <p>Font</p>
            <Select
                native
                fullWidth
                value={state.qrStylePage.font}
                onChange={(event) => { setState({ type: 'setFont', font: event.target.value }); }}
                input={<OutlinedInput />}
            >
                {fontOptions.map((option) => {
                    return (<option key={option} value={option}>{option.replace(/_/g, ' ')}</option>);
                })}
            </Select>
            <p>Text Color</p>
            <ColorPicker
                name="Text Color"
                defaultValue="Choose Color"
                value={state.qrStylePage.textColor}
                onChange={(color) => { setState({ type: 'setTextColor', textColor: color }); }}
            />
            <p>Styles</p>
            {!image ? (
                <p className="submessages">To include your restaurant image, please upload your restaurant image in settings.</p>
            ) : (
                <FormControlLabel
                    style={{ textTransform: 'capitalize' }}
                    control={(
                        <Checkbox
                            className="check-box"
                            checkedIcon={<CheckBox className="check-box" />}
                            checked={state.qrStylePage.useRestaurantImage}
                            onChange={(event) => { setState({ type: 'setUseRestaurantImage', useRestaurantImage: event.target.checked }); }}
                        />
                    )}
                    label="Use Restaurant Image"
                />
            )}
            <Select
                native
                fullWidth
                value={state.qrStylePage.qrStyleImage}
                onChange={(event) => { setState({ type: 'setQRStyleImage', qrStyleImage: event.target.value }); }}
                input={<OutlinedInput />}
            >
                {qrImages.map((qrImage) => {
                    return (<option key={qrImage} value={qrImage}>{qrImage.replace(/_/g, ' ')}</option>);
                })}
            </Select>
            <p>Restaurant Image Height</p>
            <Slider
                value={state.qrStylePage.restaurantImageHeight}
                className="width-slider"
                marks={[{ value: 0, label: '0%' }, { value: 100, label: '100°%' }]}
                onChange={(event, value) => { setState({ type: 'setRestaurantImageHeight', restaurantImageHeight: value }); }}
            />
            <p>Restaurant Image Width</p>
            <Slider
                value={state.qrStylePage.restaurantImageWidth}
                className="width-slider"
                marks={[{ value: 0, label: '0%' }, { value: 100, label: '100°%' }]}
                onChange={(event, value) => { setState({ type: 'setRestaurantImageWidth', restaurantImageWidth: value }); }}
            />
            <p>Image Background Color</p>
            <ColorPicker
                name="Restaurant Image Background Color"
                defaultValue="Choose Color"
                value={state.qrStylePage.restaurantImageBackgroundColor}
                onChange={(color) => { setState({ type: 'setRestaurantImageBackgroundColor', restaurantImageBackgroundColor: color }); }}
            />

            <p>QR Codes</p>
            <div className="qrcodes">
                {state.qrCodes.map((qrCode) => {
                    return (
                        <div key={qrCode.id} className="qrcode">
                            <p className="qrcode-name">{qrCode.name}</p>
                            <Checkbox
                                className="check-box"
                                style={{ padding: 0 }}
                                checkedIcon={<CheckBox className="check-box" />}
                                checked={getSelectedQRCodePaths().includes(qrCode.reference.path)}
                                onChange={(event) => { checked(event.target.checked, qrCode.reference); }}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="qr-buttons">
                {!state.showPDF ? <Button className="normal-buttons" onClick={() => { setState({ type: 'setShowPDF', showPDF: true }); }}>Render PDF</Button> : null}
                {state.saved && state.showPDF ? (
                    <PDFDownloadLink style={{ textDecoration: 'none' }} document={<QRPage restaurantReference={restaurantReference} tableReference={tableReference} tableName={tableName} qrStylePage={state.qrStylePage} table={state.table} logo={logo} image={image} restaurantName={restaurantName} showPDF={state.showPDF} qrCodesMap={state.qrCodesMap} />} fileName={`${tableName}.pdf`}>
                        {({ loading }) => { return <Button disabled={loading || !tableName} className="normal-buttons">Download</Button>; }}
                    </PDFDownloadLink>
                ) : null}
                <Button className="success-buttons" type="submit" onClick={submitHandler}>Save Changes</Button>
                <Button className="cancel-buttons" onClick={goBackHandler}>Cancel</Button>
            </div>
            <Spinner show={loadingSpinner} />
        </form>
    );
};

QROptions.propTypes = {
    restaurantReference: PropTypes.string.isRequired,
    tableReference: PropTypes.string.isRequired,
    tableName: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    logo: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    restaurantName: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    loadingSpinner: PropTypes.bool.isRequired,
    goBackHandler: PropTypes.func.isRequired,
    submitHandler: PropTypes.func.isRequired,
};

export default React.memo(QROptions);
