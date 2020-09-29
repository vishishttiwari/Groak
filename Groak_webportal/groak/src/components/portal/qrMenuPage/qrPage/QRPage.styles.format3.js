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
    const height = 20 + (restaurantImageHeight / 3);
    const width = restaurantImageWidth;

    let qrCodeHeights = `${78 - height}%`;
    if (includeTable) {
        qrCodeHeights = `${68 - height}%`;
    } else if (suggestionText) {
        qrCodeHeights = `${68 - height}%`;
    } else if (includeTable && suggestionText) {
        qrCodeHeights = `${58 - height}%`;
    }

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
            height: '20%',
            maxHeight: '20%',
            width: '100%',
        },
        restaurantTitle: {
            margin: 'auto',
            width: `${logoWidth}%`,
        },
        tableTitle: {
            maxHeight: '7%',
            width: '95%',
            margin: 'auto',
            marginTop: '5px',
        },
        suggestionText: {
            height: '5%',
            width: '95%',
            margin: 'auto',
            marginTop: '5px',
        },
        restaurantImageView: {
            maxHeight: `${height}%`,
            width: '100%',
            backgroundColor: `${restaurantImageBackgroundColor}`,
        // paddingTop: '10px',
        // paddingBottom: '10px',
        },
        restaurantImage: {
            height: '100%',
            width: `${width}%`,
            objectFit: 'cover',
            objectPosition: '50% 100%',
            margin: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: 0,
        },
        qrCodes: {
            height: qrCodeHeights,
            maxHeight: qrCodeHeights,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '20px',
        },
        qr: {
            height: '100%',
            maxHeight: '100%',
            width: '40%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        qrCode: {
            marginBottom: '10px',
            height: '70%',
            borderStyle: 'solid',
            borderRadius: '20',
            borderColor: 'black',
        },
        qrText: {
            width: '100%',
            textAlign: 'center',
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
            styles = { ...styles,
                qrCode: { ...styles.qrCode },
                qrText: { ...styles.qrText, fontSize: 30 },
            };
            break;
        case 2:
            styles = { ...styles,
                qrCode: { ...styles.qrCode, height: '65%' },
                qrText: { ...styles.qrText, fontSize: 25 },
            };
            break;
        case 3:
            styles = { ...styles,
                qr: { ...styles.qr, height: 'auto', width: '30%' },
                qrCode: { ...styles.qrCode, height: '55%', borderRadius: '5', borderWidth: '1pt' },
                qrText: { ...styles.qrText, fontSize: 20 },
            };
            break;
        case 4:
            styles = { ...styles,
                qr: { ...styles.qr, height: 'auto', width: '50%' },
                qrCode: { ...styles.qrCode, height: '35%', borderRadius: '5', marginTop: '10px', marginBottom: '3px', borderWidth: '1pt' },
                qrText: { ...styles.qrText, fontSize: 15 },
            };
            break;
        case 5:
            styles = { ...styles,
                qr: { ...styles.qr, height: 'auto', width: '30%' },
                qrCode: { ...styles.qrCode, height: '35%', borderRadius: '5', marginTop: '10px', marginBottom: '3px', borderWidth: '1pt' },
                qrText: { ...styles.qrText, fontSize: 15 },
            };
            break;
        case 6:
            styles = { ...styles,
                qr: { ...styles.qr, height: 'auto', width: '30%' },
                qrCode: { ...styles.qrCode, height: '35%', borderRadius: '5', marginTop: '10px', marginBottom: '3px', borderWidth: '1pt' },
                qrText: { ...styles.qrText, fontSize: 15 },
            };
            break;
        case 7:
            styles = { ...styles,
                qr: { ...styles.qr, height: 'auto', width: '25%' },
                qrCode: { ...styles.qrCode, height: '35%', borderRadius: '5', marginTop: '10px', marginBottom: '3px', borderWidth: '1pt' },
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
                suggestionText: { ...styles.suggestionText, fontSize: 50 },
                qrText: { ...styles.qrText, fontSize: 40 },
                qrCode: { ...styles.qrCode, borderWidth: '3pt' },
            };
            break;
        case 'A3':
        case 'TABLOID':
            styles = { ...styles,
                restaurantTitle: { ...styles.restaurantTitle, fontSize: 70 },
                tableTitle: { ...styles.tableTitle, fontSize: 50 },
                suggestionText: { ...styles.suggestionText, fontSize: 40 },
                qrText: { ...styles.qrText, fontSize: 30 },
                qrCode: { ...styles.qrCode, borderWidth: '3pt' },
            };
            break;
        case 'A4':
        case 'LETTER':
            styles = { ...styles,
                restaurantTitle: { ...styles.restaurantTitle, fontSize: 60 },
                tableTitle: { ...styles.tableTitle, fontSize: 40 },
                suggestionText: { ...styles.suggestionText, fontSize: 30 },
                qrText: { ...styles.qrText, fontSize: 20 },
                qrCode: { ...styles.qrCode, borderWidth: '1pt' },
            };
            break;
        case 'A5':
            styles = { ...styles,
                restaurantTitle: { ...styles.restaurantTitle, fontSize: 47 },
                tableTitle: { ...styles.tableTitle, fontSize: 27 },
                suggestionText: { ...styles.suggestionText, fontSize: 20 },
                qrText: { ...styles.qrText, fontSize: 17 },
                qrCode: { ...styles.qrCode, borderRadius: '5', marginBottom: 0, borderWidth: '1pt' },
                qr: { ...styles.qr, marginBottom: 0 },
            };
            break;
        case 'A6':
        case '5x7':
        case 'HALF-LETTER':
            styles = { ...styles,
                restaurantTitle: { ...styles.restaurantTitle, fontSize: 22 },
                tableTitle: { ...styles.tableTitle, fontSize: 18 },
                suggestionText: { ...styles.suggestionText, fontSize: 15 },
                qrText: { ...styles.qrText, fontSize: 12 },
                qrCode: { ...styles.qrCode, borderRadius: '5', marginBottom: 0, borderWidth: '1pt' },
                qr: { ...styles.qr, marginBottom: 0 },
            };
            break;
        default:
            styles = { ...styles };
    }

    return styles;
};

export default QRPageStyles;
