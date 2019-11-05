/**
 * This component is used for showing the options on the qr page
 */
import { PDFDownloadLink } from '@react-pdf/renderer';
import React from 'react';
import PropTypes from 'prop-types';

import { FormControlLabel, Checkbox, Select, OutlinedInput, Button, Slider } from '@material-ui/core';
import { CheckBox } from '@material-ui/icons';

import QRPage from './qrPage/QRPage';
import { getFonts, getQRStyleImages } from '../../../catalog/Others';
import { IncludeLogoMessage } from '../../../catalog/Comments';
import Spinner from '../../ui/spinner/Spinner';

const QROptions = (props) => {
    const { tableReference, tableName, state, logo, restaurantName, setState, loadingSpinner, goBackHandler, submitHandler } = props;
    const pageSizeOptions = ['A2', 'A3', 'A4', 'A5', 'A6', 'LETTER', 'TABLOID'];
    const fontOptions = Object.keys(getFonts());
    const qrImages = Object.keys(getQRStyleImages());

    return (
        <form>
            {!logo ? <p>{IncludeLogoMessage}</p> : null}
            <p>Logo Width</p>
            <Slider
                value={state.qrStylePage.width}
                className="width-slider"
                marks={[{ value: 0, label: '0%' }, { value: 100, label: '100°%' }]}
                onChange={(event, value) => { setState({ type: 'setWidth', width: value }); }}
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
                label="Include Table Name"
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
            <p>Styles</p>
            <Select
                native
                fullWidth
                value={state.qrStylePage.qrStyleImage}
                onChange={(event) => { setState({ type: 'setQRStyleImage', qrStyleImage: event.target.value }); }}
                input={<OutlinedInput />}
            >
                {qrImages.map((image) => {
                    return (<option key={image} value={image}>{image.replace(/_/g, ' ')}</option>);
                })}
            </Select>
            <div className="qr-buttons">
                {state.saved ? (
                    <PDFDownloadLink style={{ textDecoration: 'none' }} document={<QRPage tableReference={tableReference} tableName={tableName} state={state.qrStylePage} logo={logo} restaurantName={restaurantName} />} fileName={`${tableName}.pdf`}>
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
    tableReference: PropTypes.string.isRequired,
    tableName: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    logo: PropTypes.string.isRequired,
    restaurantName: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    loadingSpinner: PropTypes.bool.isRequired,
    goBackHandler: PropTypes.func.isRequired,
    submitHandler: PropTypes.func.isRequired,
};

export default React.memo(QROptions);
