/**
 * This class is used for the styles of the pdf
 */
import { StyleSheet, Font } from '@react-pdf/renderer';

import { getFonts } from '../../../../catalog/Others';

const fonts = getFonts();
Object.keys(fonts).forEach((font) => {
    Font.register({ family: font, format: 'truetype', src: fonts[font] });
});

const QRPageStyles = (orientation, pageSize, font, includeTable, width, qrCodes) => {
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
            height: '70%',
        },
        qrSideImage: {
            width: '50%',
            height: '100%',
            objectFit: 'cover',
        },
        qrCodes: {
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        qr: {
            width: '65%',
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
        advertisement: {
            display: 'flex',
            flexDirection: 'row',
            height: '3%',
            width: '50%',
            marginLeft: 'auto',
            marginRight: '10px',
            justifyContent: 'flex-end',
        },
        advertisementText: {
            height: '100%',
        },
        advertisementImage: {
            height: '100%',
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

    if (qrCodes.length <= 2) {
        styles = { ...styles,
            qrCode: { ...styles.qrCode, width: '90%' },
        };
    } else if (qrCodes.length === 3) {
        styles = { ...styles,
            qrCode: { ...styles.qrCode, width: '70%', marginBottom: '10px' },
        };
    } else if (qrCodes.length === 4) {
        styles = { ...styles,
            qrCode: { ...styles.qrCode, width: '50%', marginBottom: '10px' },
        };
    } else if (qrCodes.length > 4) {
        styles = { ...styles,
            qrCode: { ...styles.qrCode, width: '35%', marginBottom: '5px' },
        };
    }

    if (orientation === 'Landscape') {
        styles = { ...styles,
            page: { ...styles.page,
                marginTop: '5px',
                marginBottom: '5px',
            },
            restaurantTitle: { ...styles.restaurantTitle,
                height: includeTable ? '18%' : '28%',
            },
            qrArea: { ...styles.qrArea,
                flexDirection: 'column',
                height: '70%',
                width: '100%',
            },
            line: {
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                height: '1pt',
                width: '100%',
            },
            restaurantImage: {
                height: '27%',
                margin: '0',
                padding: '0',
            },
            qrCodes: { ...styles.qrCodes,
                height: '40%',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
            },
            qr: { ...styles.qr,
                width: '20%',
            },
        };
    }

    return styles;
};

export default QRPageStyles;
