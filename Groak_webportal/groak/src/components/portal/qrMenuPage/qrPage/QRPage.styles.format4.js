/**
 * This class is used for the styles of the pdf
 */
import { StyleSheet, Font } from '@react-pdf/renderer';

import { getFonts } from '../../../../catalog/Others';

const fonts = getFonts();
Object.keys(fonts).forEach((font) => {
    Font.register({ family: font, format: 'truetype', src: fonts[font] });
});

const QRPageStyles = (pageSize, pageBackgroundColor, font, textColor, includeTable, logoWidth, qrCodes, restaurantImageHeight, restaurantImageWidth, restaurantImageBackgroundColor) => {
    const height = 50 + (restaurantImageHeight / 2);
    const width = 30 + (restaurantImageWidth / 4);

    let styles = StyleSheet.create({
        page: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            fontFamily: font,
            textAlign: 'center',
            backgroundColor: `${pageBackgroundColor}`,
            color: `${textColor}`,
        },
        restaurant: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: font,
            textAlign: 'center',
            width: `${width}%`,
            // marginLeft: 0,
            // marginTop: 0,
            // marginBottom: 0,
        },
        titleView: {
            height: '20%',
            maxHeight: '20%',
            width: '100%',
        },
        restaurantTitle: {
            margin: 'auto',
            width: `${logoWidth}%`,
        },
        restaurantImageView: {
            height: '80%',
            maxHeight: '80%',
            backgroundColor: `${restaurantImageBackgroundColor}`,
        },
        restaurantImage: {
            width: '100%',
            height: `${height}%`,
            maxHeight: '100%',
            objectFit: 'cover',
            marginTop: 'auto',
            marginBottom: 'auto',
        },
        qrCodesArea: {
            width: `${100 - width}%`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            marginTop: 0,
        },
        tableTitle: {
            height: '8%',
            width: '100%',
            margin: 'auto',
            marginTop: 0,
            paddingTop: '10px',
        },
        suggestionText: {
            height: '8%',
            width: '100%',
            margin: 'auto',
            marginTop: 0,
            marginBottom: 10,
            paddingTop: '10px',
        },
        qrCodes: {
            width: '100%',
            height: includeTable ? '86%' : '92%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 'auto',
        },
        qr: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 'auto',
            // marginBottom: 10,
        },
        qrText: {
            width: '100%',
            textAlign: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        qrCode: {
            borderStyle: 'solid',
            borderRadius: '20',
            borderColor: 'black',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        advertisement: {
            position: 'absolute',
            right: 10,
            bottom: 10,
            left: '80%',
        },
        advertisementImage: {
            height: '100%',
        },
    });

    switch (qrCodes.length) {
        case 1:
        case 2:
            styles = { ...styles,
                tableTitle: { ...styles.tableTitle, fontSize: 30 },
                suggestionText: { ...styles.suggestionText, fontSize: 20 },
                qrCodes: { ...styles.qrCodes, flexDirection: 'column' },
                qr: { ...styles.qr, width: '100%', height: '50%' },
                qrCode: { ...styles.qrCode, width: '65%', borderRadius: '20', borderWidth: '1pt' },
            };
            break;
        case 3:
            styles = { ...styles,
                tableTitle: { ...styles.tableTitle, fontSize: 30 },
                suggestionText: { ...styles.suggestionText, fontSize: 25 },
                qrCodes: { ...styles.qrCodes, flexDirection: 'column' },
                qr: { ...styles.qr, width: '100%', height: '30%' },
                qrCode: { ...styles.qrCode, width: '45%', borderRadius: '10', borderWidth: '1pt' },
            };
            break;
        case 4:
            styles = { ...styles,
                tableTitle: { ...styles.tableTitle, fontSize: 30 },
                suggestionText: { ...styles.suggestionText, fontSize: 25 },
                qrCodes: { ...styles.qrCodes, flexDirection: 'row', flexWrap: 'wrap', paddingTop: '70px' },
                qr: { ...styles.qr, width: '50%', height: '40%' },
                qrCode: { ...styles.qrCode, height: `${80 - width / 2}%`, borderRadius: '10', borderWidth: '1pt' },
            };
            break;
        case 5:
        case 6:
            styles = { ...styles,
                tableTitle: { ...styles.tableTitle, fontSize: 30 },
                suggestionText: { ...styles.suggestionText, fontSize: 25 },
                qrCodes: { ...styles.qrCodes, flexDirection: 'row', flexWrap: 'wrap' },
                qr: { ...styles.qr, width: '50%', height: '30%' },
                qrCode: { ...styles.qrCode, width: '65%', borderRadius: '5', borderWidth: '1pt' },
                qrText: { ...styles.qrText, fontSize: 15 },
            };
            break;
        case 7:
        case 8:
            styles = { ...styles,
                tableTitle: { ...styles.tableTitle, fontSize: 30 },
                suggestionText: { ...styles.suggestionText, fontSize: 25 },
                qrCodes: { ...styles.qrCodes, flexDirection: 'row', flexWrap: 'wrap' },
                qr: { ...styles.qr, width: '50%', height: '23%' },
                qrCode: { ...styles.qrCode, width: '65%', borderRadius: '5', borderWidth: '1pt' },
                qrText: { ...styles.qrText, fontSize: 13 },
            };
            break;
        default:
            styles = { ...styles };
    }

    switch (pageSize) {
        case 'A2':
            styles = { ...styles,
                tableTitle: { ...styles.tableTitle, fontSize: 100 },
                suggestionText: { ...styles.suggestionText, fontSize: 75 },
                qrText: { ...styles.qrText, fontSize: 60 },
                qrCode: { ...styles.qrCode, borderRadius: '20', borderWidth: '5pt' },
            };
            break;
        case 'A3':
        case 'TABLOID':
            styles = { ...styles,
                tableTitle: { ...styles.tableTitle, fontSize: 80 },
                suggestionText: { ...styles.suggestionText, fontSize: 55 },
                qrText: { ...styles.qrText, fontSize: 40 },
                qrCode: { ...styles.qrCode, borderRadius: '20', borderWidth: '3pt' },
            };
            break;
        case 'A4':
        case 'LETTER':
            styles = { ...styles,
                tableTitle: { ...styles.tableTitle, fontSize: 60 },
                suggestionText: { ...styles.suggestionText, fontSize: 45 },
                qrText: { ...styles.qrText, fontSize: 25 },
                qrCode: { ...styles.qrCode, borderRadius: '20', borderWidth: '3pt' },
            };
            break;
        case 'A5':
            styles = { ...styles,
            };
            break;
        case 'A6':
        case '5x7':
        case 'HALF-LETTER':
            styles = { ...styles,
            };
            break;
        default:
            styles = { ...styles };
    }
    return styles;
};

export default QRPageStyles;
