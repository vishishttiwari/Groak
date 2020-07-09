/**
 * This class is used for the styles of the pdf
 */
import { StyleSheet, Font } from '@react-pdf/renderer';

import { getFonts } from '../../../../catalog/Others';

const fonts = getFonts();
Object.keys(fonts).forEach((font) => {
    Font.register({ family: font, format: 'truetype', src: fonts[font] });
});

const QRPageStyles = (pageSize, font, includeTable, width) => {
    let styles = StyleSheet.create({
        page: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: font,
            marginTop: 30,
            marginBottom: 30,
            textAlign: 'center',
        },
        restaurantTitle: {
            height: includeTable ? '13%' : '23%',
            width: `${width}%`,
        },
        tableTitle: {
            marginTop: 10,
            height: '7%',
            width: '95%',
        },
        qrArea: {
            marginTop: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: '50%',
        },
        qrSideImage: {
            width: '50%',
            height: '100%',
        },
        qr: {
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        qrText: {
            width: '80%',
            textAlign: 'center',
        },
        qrCode: {
            marginBottom: '20px',
            width: '90%',
            borderStyle: 'solid',
            borderWidth: '1pt',
            borderRadius: '20',
            borderColor: 'black',
        },
        applicationArea: {
        },
    });
    if (pageSize === 'A2') {
        styles = { ...styles,
            restaurantTitle: { ...styles.restaurantTitle, fontSize: 100 },
            tableTitle: { ...styles.tableTitle, fontSize: 90 },
        };
    } else if (pageSize === 'A3' || pageSize === 'TABLOID') {
        styles = { ...styles,
            restaurantTitle: { ...styles.restaurantTitle, fontSize: 80 },
            tableTitle: { ...styles.tableTitle, fontSize: 70 },
        };
    } else if (pageSize === 'A4' || pageSize === 'LETTER') {
        styles = { ...styles,
            restaurantTitle: { ...styles.restaurantTitle, fontSize: 50 },
            tableTitle: { ...styles.tableTitle, fontSize: 40 },
        };
    } else if (pageSize === 'A5') {
        styles = { ...styles,
            restaurantTitle: { ...styles.restaurantTitle, fontSize: 40 },
            tableTitle: { ...styles.tableTitle, fontSize: 30 },
        };
    } else if (pageSize === 'A6') {
        styles = { ...styles,
            restaurantTitle: { ...styles.restaurantTitle, fontSize: 30 },
            tableTitle: { ...styles.tableTitle, fontSize: 20 },
        };
    }

    return styles;
};

export default QRPageStyles;
