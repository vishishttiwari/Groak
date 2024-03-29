/**
 * This class is used for the styles of the pdf
 */
import { StyleSheet, Font } from '@react-pdf/renderer';

import { getFonts } from '../../../../catalog/Others';

const fonts = getFonts();
Object.keys(fonts).forEach((font) => {
    Font.register({ family: font, format: 'truetype', src: fonts[font] });
});

const QRPageStyles = (pageSize, pageBackgroundColor, font, textColor, includeTable, suggestionText, logoWidth, qrCodes, restaurantImageHeight, restaurantImageWidth, restaurantImageBackgroundColor) => {
    const height = 50 + (restaurantImageHeight / 2);
    const width = 30 + (restaurantImageWidth / 2);

    let styles = StyleSheet.create({
        page: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: font,
            textAlign: 'center',
            backgroundColor: `${pageBackgroundColor}`,
            color: `${textColor}`,
        },
        titleView: {
            height: includeTable ? '17%' : '25%',
            maxHeight: includeTable ? '17%' : '25%',
            width: '100%',
        },
        restaurantTitle: {
            width: `${logoWidth}%`,
            margin: 'auto',
        },
        tableTitle: {
            height: '7%',
            maxHeight: '7%',
            width: '95%',
            marginTop: 5,
            marginLeft: 0,
            marginRight: 0,
        },
        suggestionText: {
            height: '5%',
            width: '95%',
            margin: 'auto',
            marginTop: 0,
        },
        qrArea: {
            height: suggestionText ? '67%' : '72%',
            maxHeight: suggestionText ? '67%' : '72%',
            marginTop: 5,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        restaurantImageView: {
            height: '100%',
            maxHeight: '100%',
            width: `${width}%`,
            backgroundColor: `${restaurantImageBackgroundColor}`,
        // paddingTop: '10px',
        // paddingBottom: '10px',
        },
        restaurantImage: {
            width: '100%',
            height: `${height}%`,
            maxHeight: '100%',
            objectFit: 'cover',
            marginTop: 'auto',
            marginBottom: 'auto',
        },
        qrCodes: {
            width: `${100 - width}%`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -20,
        },
        qr: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
        },
        qrText: {
            width: '100%',
            textAlign: 'center',
        },
        qrCode: {
            borderStyle: 'solid',
            borderRadius: '20',
            borderColor: 'black',
        },
        advertisement: {
            position: 'absolute',
            right: 10,
            bottom: 20,
            left: '80%',
        },
        advertisementImage: {
            height: '100%',
        },
    });

    switch (qrCodes.length) {
        case 1:
            styles = { ...styles,
                qrCode: { ...styles.qrCode, width: '90%' },
                qrText: { ...styles.qrText, fontSize: 30 },
            };
            break;
        case 2:
            styles = { ...styles,
                qrCode: { ...styles.qrCode, width: '70%' },
                qrText: { ...styles.qrText, fontSize: 25 },
            };
            break;
        case 3:
            styles = { ...styles,
                qrCode: { ...styles.qrCode, width: '50%', borderRadius: '5', borderWidth: '1pt' },
                qrText: { ...styles.qrText, fontSize: 20 },
            };
            break;
        case 4:
            styles = { ...styles,
                qrCode: { ...styles.qrCode, width: '33%', borderRadius: '5', borderWidth: '1pt' },
                qrText: { ...styles.qrText, fontSize: 18 },
            };
            break;
        case 5:
            styles = { ...styles,
                qrCode: { ...styles.qrCode, width: '25%', borderRadius: '5', marginBottom: '3px', borderWidth: '1pt' },
                qrText: { ...styles.qrText, fontSize: 15 },
            };
            break;
        case 6:
            styles = { ...styles,
                qrCode: { ...styles.qrCode, width: '25%', borderRadius: '5', marginBottom: '3px', borderWidth: '1pt' },
                qrText: { ...styles.qrText, fontSize: 15 },
            };
            break;
        case 7:
            styles = { ...styles,
                qrCode: { ...styles.qrCode, width: '25%', borderRadius: '5', marginBottom: '3px', borderWidth: '1pt' },
                qrText: { ...styles.qrText, fontSize: 15 },
            };
            break;
        default:
            styles = { ...styles };
    }

    switch (pageSize) {
        case 'A2':
            styles = { ...styles,
                restaurantTitle: { ...styles.restaurantTitle, fontSize: 80 },
                tableTitle: { ...styles.tableTitle, fontSize: 60 },
                suggestionText: { ...styles.suggestionText, fontSize: 45 },
                qrText: { ...styles.qrText, fontSize: styles.qrText.fontSize + 20 },
                qrCode: { ...styles.qrCode, borderWidth: '3pt' },
            };
            break;
        case 'A3':
        case 'TABLOID':
            styles = { ...styles,
                restaurantTitle: { ...styles.restaurantTitle, fontSize: 70 },
                tableTitle: { ...styles.tableTitle, fontSize: 50 },
                suggestionText: { ...styles.suggestionText, fontSize: 35 },
                qrText: { ...styles.qrText, fontSize: styles.qrText.fontSize + 10 },
                qrCode: { ...styles.qrCode, borderWidth: '3pt' },
            };
            break;
        case 'A4':
        case 'LETTER':
            styles = { ...styles,
                restaurantTitle: { ...styles.restaurantTitle, fontSize: 60 },
                tableTitle: { ...styles.tableTitle, fontSize: 40 },
                suggestionText: { ...styles.suggestionText, fontSize: 25 },
                qrCode: { ...styles.qrCode, borderWidth: '1pt' },
            };
            break;
        case 'A5':
            styles = { ...styles,
                restaurantTitle: { ...styles.restaurantTitle, fontSize: 47 },
                tableTitle: { ...styles.tableTitle, fontSize: 27 },
                suggestionText: { ...styles.suggestionText, fontSize: 20 },
                qrText: { ...styles.qrText, fontSize: styles.qrText.fontSize - 5 },
                qrCode: { ...styles.qrCode, borderRadius: '5', borderWidth: '1pt' },
                qr: { ...styles.qr, marginBottom: 10 },
            };
            break;
        case 'A6':
        case '5x7':
            styles = { ...styles,
                restaurantTitle: { ...styles.restaurantTitle, fontSize: 22 },
                tableTitle: { ...styles.tableTitle, fontSize: 20 },
                suggestionText: { ...styles.suggestionText, fontSize: 18 },
                qrText: { ...styles.qrText, fontSize: styles.qrText.fontSize - 10 },
                qrCode: { ...styles.qrCode, borderRadius: '5', marginBottom: 0, borderWidth: '1pt' },
                qr: { ...styles.qr, marginBottom: 10 },
            };
            break;
        case 'HALF-LETTER':
            styles = { ...styles,
                restaurantTitle: { ...styles.restaurantTitle, fontSize: 17 },
                tableTitle: { ...styles.tableTitle, fontSize: 15 },
                suggestionText: { ...styles.suggestionText, fontSize: 12 },
                qrText: { ...styles.qrText, fontSize: styles.qrText.fontSize - 12 },
                qrCode: { ...styles.qrCode, borderRadius: '2', marginBottom: 0, borderWidth: '0.33pt' },
                qr: { ...styles.qr, marginBottom: 10 },
                advertisement: { ...styles.advertisement, bottom: 5 },
            };
            break;
        default:
            styles = { ...styles };
    }
    return styles;
};

export default QRPageStyles;
