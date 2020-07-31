/* eslint-disable no-nested-ternary */
/**
 * This component is used for the pdf viewer and the pdf that will be downloaded
 */
import { Page, Image, Document, Text, View } from '@react-pdf/renderer';
import React from 'react';
import PropTypes from 'prop-types';
import { getQRStyleImages } from '../../../../catalog/Others';

import QRPageStyles from './QRPage.styles';
import Icon from '../../../../assets/images/powered_by_groak.png';

const QRPage = (props) => {
    const { restaurantReference, tableReference, tableName, qrStylePage, table, logo, image, restaurantName, showPDF, qrCodesMap } = props;

    const styles = QRPageStyles(qrStylePage.orientation, qrStylePage.pageSize, qrStylePage.font, qrStylePage.includeTable, qrStylePage.width, table.qrCodes);
    const qrStyleImages = getQRStyleImages();

    return (
        <Document>
            {showPDF
                ? (qrStylePage.orientation === 'Potrait'
                    ? (
                        <Page size={qrStylePage.pageSize} orientation={qrStylePage.orientation} style={styles.page}>
                            {logo ? <Image style={styles.restaurantTitle} src={logo} /> : <Text style={styles.restaurantTitle}>{restaurantName}</Text>}
                            {qrStylePage.includeTable ? <Text style={styles.tableTitle}>{tableName}</Text> : null}
                            <View style={styles.qrArea}>
                                <Image style={styles.qrSideImage} src={qrStylePage.useRestaurantImage && image ? image : qrStyleImages[qrStylePage.qrStyleImage]} />
                                <View style={styles.qrCodes}>
                                    {table && table.qrCodes
                                        ? table.qrCodes.map((qrCode) => {
                                            return (qrCode
                                                ? (
                                                    <View key={qrCode.path} style={styles.qr}>
                                                        <Text style={styles.qrText}>{qrCodesMap.get(qrCode.path).name}</Text>
                                                        <Image style={styles.qrCode} src={`https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=groakapp.com/customermenu/${restaurantReference}/${tableReference}/${qrCodesMap.get(qrCode.path).id}`} />
                                                    </View>
                                                ) : null
                                            );
                                        }) : null}
                                </View>
                            </View>
                            <View style={styles.advertisement}>
                                <Image style={styles.advertisementImage} src={Icon} />
                            </View>
                        </Page>
                    ) : (
                        <Page size={qrStylePage.pageSize} orientation={qrStylePage.orientation} style={styles.page}>
                            {logo ? <Image style={styles.restaurantTitle} src={logo} /> : <Text style={styles.restaurantTitle}>{restaurantName}</Text>}
                            {qrStylePage.includeTable ? <Text style={styles.tableTitle}>{tableName}</Text> : null}
                            <View style={styles.line}></View>
                            <Image style={styles.restaurantImage} src={qrStylePage.useRestaurantImage && image ? image : qrStyleImages[qrStylePage.qrStyleImage]} />
                            <View style={styles.line}></View>
                            <View style={styles.qrCodes}>
                                {table && table.qrCodes
                                    ? table.qrCodes.map((qrCode) => {
                                        return (qrCode
                                            ? (
                                                <View key={qrCode.path} style={styles.qr}>
                                                    <Text style={styles.qrText}>{qrCodesMap.get(qrCode.path).name}</Text>
                                                    <Image style={styles.qrCode} src={`https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=groakapp.com/customermenu/${restaurantReference}/${tableReference}/${qrCodesMap.get(qrCode.path).id}`} />
                                                </View>
                                            ) : null
                                        );
                                    }) : null}
                            </View>
                            <View style={styles.advertisement}>
                                <Image style={styles.advertisementImage} src={Icon} />
                            </View>
                        </Page>
                    )
                ) : null}
        </Document>
    );
};

QRPage.propTypes = {
    restaurantReference: PropTypes.string.isRequired,
    tableReference: PropTypes.string.isRequired,
    tableName: PropTypes.string.isRequired,
    qrStylePage: PropTypes.object.isRequired,
    table: PropTypes.object.isRequired,
    logo: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    restaurantName: PropTypes.string.isRequired,
    showPDF: PropTypes.bool.isRequired,
    qrCodesMap: PropTypes.instanceOf(Map).isRequired,
};

export default React.memo(QRPage);
