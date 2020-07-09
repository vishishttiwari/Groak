/**
 * This component is used for the pdf viewer and the pdf that will be downloaded
 */
import { Page, Image, Document, Text, View } from '@react-pdf/renderer';
import React from 'react';
import PropTypes from 'prop-types';
import { getQRStyleImages } from '../../../../catalog/Others';

import QRPageStyles from './QRPage.styles';

const QRPage = (props) => {
    const { restaurantReference, tableReference, tableName, state, logo, restaurantName } = props;

    const styles = QRPageStyles(state.pageSize, state.font, state.includeTable, state.width);
    const qrStyleImages = getQRStyleImages();

    return (
        <Document>
            <Page size={state.pageSize} style={styles.page}>
                {logo ? <Image style={styles.restaurantTitle} src={logo} /> : <Text style={styles.restaurantTitle}>{restaurantName}</Text>}
                {state.includeTable ? <Text style={styles.tableTitle}>{tableName}</Text> : null}
                <View style={styles.qrArea}>
                    <Image style={styles.qrSideImage} src={qrStyleImages[state.qrStyleImage]} />
                    <View style={styles.qr}>
                        <Image style={styles.qrCode} src={`https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=groakapp.com/customermenu/${restaurantReference}/${tableReference}`} />
                        <Text style={styles.qrText}>Scan the QR code with camera or any qr code scanner to view the menu</Text>
                    </View>
                </View>
                <View style={styles.applicationArea}>
                    {/* <Text style={styles.applicationTitle}>Groak</Text>
                    <Image style={styles.applicationLinks} src={`https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=${iosAppLink}`} />
                    <Image style={styles.applicationLinks} src={`https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=${androidAppLink}`} /> */}
                </View>
            </Page>
        </Document>
    );
};

QRPage.propTypes = {
    restaurantReference: PropTypes.string.isRequired,
    tableReference: PropTypes.string.isRequired,
    tableName: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    logo: PropTypes.string.isRequired,
    restaurantName: PropTypes.string.isRequired,
};

export default React.memo(QRPage);
