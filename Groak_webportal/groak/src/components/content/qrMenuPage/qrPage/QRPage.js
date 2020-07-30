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
                    <View style={styles.qrcodes}>
                        <View style={styles.qr}>
                            <Text style={styles.qrText}>Food Menu</Text>
                            <Image style={styles.qrCode} src="https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=groakapp.com/customermenu/d0KGThgk11PotGsC3dQ7r1qlgVj2/ut3bhpmoy6ob6puvz6vc98" />
                        </View>
                        <View style={styles.qr}>
                            <Text style={styles.qrText}>Drinks Menu</Text>
                            <Image style={styles.qrCode} src="https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=groakapp.com/customermenu/G6ItbLPhl8TWM4tU4IcDLqnJecn1/m4y3brjvda87iqgoiwqygu" />
                        </View>
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
