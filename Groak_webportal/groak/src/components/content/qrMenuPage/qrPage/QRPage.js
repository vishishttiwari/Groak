/* eslint-disable no-nested-ternary */
/**
 * This component is used for the pdf viewer and the pdf that will be downloaded
 */
import { Page, Image, Document, Text, View } from '@react-pdf/renderer';
import React from 'react';
import PropTypes from 'prop-types';
import { getQRStyleImages } from '../../../../catalog/Others';

import QRPageStyles1 from './QRPage.styles.format1';
import QRPageStyles2 from './QRPage.styles.format2';
import QRPageStyles3 from './QRPage.styles.format3';
import Icon from '../../../../assets/images/powered_by_groak.png';

const QRPage = (props) => {
    const { restaurantReference, tableReference, tableName, qrStylePage, table, logo, image, restaurantName, showPDF, qrCodesMap } = props;

    const styles1 = QRPageStyles1(qrStylePage.pageSize, qrStylePage.pageBackgroundColor, qrStylePage.font, qrStylePage.textColor, qrStylePage.includeTable, qrStylePage.logoWidth, table.qrCodes, qrStylePage.restaurantImageHeight, qrStylePage.restaurantImageWidth, qrStylePage.restaurantImageBackgroundColor);
    const styles2 = QRPageStyles2(qrStylePage.pageSize, qrStylePage.pageBackgroundColor, qrStylePage.font, qrStylePage.textColor, qrStylePage.includeTable, qrStylePage.logoWidth, qrStylePage.restaurantImageHeight, qrStylePage.restaurantImageWidth, qrStylePage.restaurantImageBackgroundColor);
    const styles3 = QRPageStyles3(qrStylePage.pageSize, qrStylePage.pageBackgroundColor, qrStylePage.font, qrStylePage.textColor, qrStylePage.includeTable, qrStylePage.logoWidth, table.qrCodes, qrStylePage.restaurantImageHeight, qrStylePage.restaurantImageWidth, qrStylePage.restaurantImageBackgroundColor);
    const qrStyleImages = getQRStyleImages();

    let orientation = 'portrait';
    if (qrStylePage.format === 'Format 2') {
        orientation = 'landscape';
    }

    const FinalQRPage = () => {
        if (qrStylePage.format === 'Format 1') {
            return (
                <Page size={qrStylePage.pageSize} orientation={orientation} style={styles1.page}>
                    <View style={styles1.titleView}>
                        {logo ? <Image src={logo} style={styles1.restaurantTitle} /> : <Text style={styles1.restaurantTitle}>{restaurantName}</Text>}
                    </View>
                    {qrStylePage.includeTable ? <Text style={styles1.tableTitle}>{tableName}</Text> : null}
                    <View style={styles1.qrArea}>
                        <View style={styles1.restaurantImageView}>
                            <Image style={styles1.restaurantImage} src={qrStylePage.useRestaurantImage && image ? image : qrStyleImages[qrStylePage.qrStyleImage]} />
                        </View>
                        <View style={styles1.qrCodes}>
                            {table && table.qrCodes
                                ? table.qrCodes.map((qrCode) => {
                                    return (qrCode && qrCode.path && qrCodesMap.get(qrCode.path) && qrCodesMap.get(qrCode.path).id
                                        ? (
                                            <View key={qrCode.path} style={styles1.qr}>
                                                <Image style={styles1.qrCode} src={`https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=groakapp.com/customermenu/${restaurantReference}/${tableReference}/${qrCodesMap.get(qrCode.path).id}`} />
                                                <Text style={styles1.qrText}>{qrCodesMap.get(qrCode.path).name}</Text>
                                            </View>
                                        ) : null
                                    );
                                }) : null}
                        </View>
                    </View>
                    <View style={styles1.advertisement}>
                        <Image style={styles1.advertisementImage} src={Icon} />
                    </View>
                </Page>
            );
        } if (qrStylePage.format === 'Format 2') {
            return (
                <Page size={qrStylePage.pageSize} orientation={orientation} style={styles2.page}>
                    <View style={styles2.titleView}>
                        {logo ? <Image style={styles2.restaurantTitle} src={logo} /> : <Text style={styles2.restaurantTitle}>{restaurantName}</Text>}
                    </View>
                    <View style={styles2.restaurantImageView}>
                        <Image style={styles2.restaurantImage} src={qrStylePage.useRestaurantImage && image ? image : qrStyleImages[qrStylePage.qrStyleImage]} />
                    </View>
                    {qrStylePage.includeTable ? <Text style={styles2.tableTitle}>{tableName}</Text> : null}
                    <View style={styles2.qrCodes}>
                        {table && table.qrCodes
                            ? table.qrCodes.map((qrCode) => {
                                return (qrCode
                                    ? (
                                        <View key={qrCode.path} style={styles2.qr}>
                                            <Image style={styles2.qrCode} src={`https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=groakapp.com/customermenu/${restaurantReference}/${tableReference}/${qrCodesMap.get(qrCode.path).id}`} />
                                            <Text style={styles2.qrText}>{qrCodesMap.get(qrCode.path).name}</Text>
                                        </View>
                                    ) : null
                                );
                            }) : null}
                    </View>
                    <View style={styles2.advertisement}>
                        <Image style={styles2.advertisementImage} src={Icon} />
                    </View>
                </Page>
            );
        } if (qrStylePage.format === 'Format 3') {
            return (
                <Page size={qrStylePage.pageSize} orientation={orientation} style={styles3.page}>
                    <View style={styles3.titleView}>
                        {logo ? <Image style={styles3.restaurantTitle} src={logo} /> : <Text style={styles3.restaurantTitle}>{restaurantName}</Text>}
                    </View>
                    <View style={styles3.restaurantImageView}>
                        <Image style={styles3.restaurantImage} src={qrStylePage.useRestaurantImage && image ? image : qrStyleImages[qrStylePage.qrStyleImage]} />
                    </View>
                    {qrStylePage.includeTable ? <Text style={styles3.tableTitle}>{tableName}</Text> : null}
                    <View style={styles3.qrCodes}>
                        {table && table.qrCodes
                            ? table.qrCodes.map((qrCode) => {
                                return (qrCode
                                    ? (
                                        <View key={qrCode.path} style={styles3.qr}>
                                            <Image style={styles3.qrCode} src={`https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=groakapp.com/customermenu/${restaurantReference}/${tableReference}/${qrCodesMap.get(qrCode.path).id}`} />
                                            <Text style={styles3.qrText}>{qrCodesMap.get(qrCode.path).name}</Text>
                                        </View>
                                    ) : null
                                );
                            }) : null}
                    </View>
                    <View style={styles3.advertisement}>
                        <Image style={styles3.advertisementImage} src={Icon} />
                    </View>
                </Page>
            );
        }
        return (<></>);
    };

    return (
        <Document>
            {showPDF ? <FinalQRPage /> : null}
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
