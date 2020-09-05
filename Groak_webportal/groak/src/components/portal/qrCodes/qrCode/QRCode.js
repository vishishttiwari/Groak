/**
 * This component is used to represent each qr code card in qr codes
 */

import React, { useReducer } from 'react';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Card, CardHeader, Button, CardContent, Typography, CardActions, TextField } from '@material-ui/core';
// import { Select, MenuItem, Checkbox, ListItemText } from '@material-ui/core';
import { TextFieldLabelStyles, textFieldLabelProps } from '../../../../catalog/Others';
// import { createCategoryReferenceFromPath } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';
import { InvalidQRCodeTitle } from '../../../../catalog/NotificationsComments';

const initialState = { fieldsChanged: false };

function reducer(state, action) {
    switch (action.type) {
        case 'setFieldsChanged':
            return { ...state, fieldsChanged: action.fieldsChanged };
        default:
            return initialState;
    }
}

const QRCode = (props) => {
    const { classes, qrCodeItem, categoriesMap, updateQRCodeLocallyHandler, updateQRCodePermanentlyHandler, clickHandler } = props;
    // const { categories } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { enqueueSnackbar } = useSnackbar();

    // function getSelectedCategoryPaths() {
    //     return qrCodeItem.categories.map((category) => {
    //         return (category.path);
    //     });
    // }

    // function getAllCategoryPaths() {
    //     return categories.map((category) => {
    //         return (category.reference.path);
    //     });
    // }

    // function updateQRCodeCategoriesHandler(newCategories) {
    //     updateQRCodeLocallyHandler({ ...qrCodeItem,
    //         categories:
    //         newCategories.map((category) => {
    //             return createCategoryReferenceFromPath(category);
    //         }),
    //     });
    // }

    return (
        <Card className="card card-white" onClick={clickHandler}>
            <CardHeader
                title={qrCodeItem.name}
                subheader={`Includes ${qrCodeItem.categories.length} ${qrCodeItem.categories.length <= 1 ? 'category' : 'categories'} `}
            />
            <CardContent>
                <Typography variant="body1" color="textPrimary" component="p">
                    Categories:
                </Typography>
                {qrCodeItem.categories.map((category) => {
                    return (categoriesMap.get(category.path) ? (
                        <Typography
                            key={category.path}
                            className="subtopics"
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            {categoriesMap.get(category.path).name}
                        </Typography>
                    ) : null);
                })}
            </CardContent>
            <CardActions className="actions actions-vertical">
                <TextField
                    className="action-items"
                    label="Title:"
                    type="text"
                    value={qrCodeItem.name ? qrCodeItem.name : ''}
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    required
                    error={qrCodeItem.name.length <= 0}
                    shrink={(qrCodeItem.name.length > 0).toString()}
                    onChange={(event) => {
                        event.stopPropagation();
                        setState({ type: 'setFieldsChanged', fieldsChanged: true });
                        updateQRCodeLocallyHandler({ ...qrCodeItem, name: event.target.value });
                    }}
                    InputLabelProps={textFieldLabelProps(classes)}
                    onClick={(event) => { event.stopPropagation(); }}
                />
                {/* <Select
                    className="action-items"
                    multiple
                    required
                    fullWidth
                    displayEmpty
                    value={getSelectedCategoryPaths()}
                    onChange={(event) => {
                        event.stopPropagation();
                        setState({ type: 'setFieldsChanged', fieldsChanged: true });
                        updateQRCodeCategoriesHandler(event.target.value);
                    }}
                    variant="outlined"
                    renderValue={() => { return 'Select Categories'; }}
                    onClick={(event) => { event.stopPropagation(); }}
                >
                    {getAllCategoryPaths().map((categoryPath) => {
                        return (
                            <MenuItem key={categoryPath} value={categoryPath} onClick={(event) => { event.stopPropagation(); }}>
                                <Checkbox style={{ color: '#800000' }} checked={getSelectedCategoryPaths().indexOf(categoryPath) > -1} onClick={(event) => { event.stopPropagation(); }} />
                                <ListItemText primary={categoriesMap.get(categoryPath).name} onClick={(event) => { event.stopPropagation(); }} />
                            </MenuItem>
                        );
                    })}
                </Select> */}
                <Button
                    className={qrCodeItem.available ? 'normal-buttons buttons' : 'cancel-buttons buttons'}
                    variant="contained"
                    onClick={(event) => {
                        event.stopPropagation();
                        updateQRCodePermanentlyHandler({ ...qrCodeItem, available: !qrCodeItem.available });
                    }}
                >
                    {qrCodeItem.available ? 'Available' : 'Unavailable'}
                </Button>
                <Button
                    className="success-buttons buttons"
                    variant="contained"
                    disabled={!state.fieldsChanged}
                    disableElevation
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    onClick={(event) => {
                        event.stopPropagation();
                        if (qrCodeItem.name.length > 0) {
                            updateQRCodePermanentlyHandler(qrCodeItem);
                            setState({ type: 'setFieldsChanged', fieldsChanged: false });
                        } else {
                            enqueueSnackbar(InvalidQRCodeTitle, { variant: 'error' });
                        }
                    }}
                >
                    Save
                </Button>
            </CardActions>
        </Card>
    );
};

QRCode.propTypes = {
    classes: PropTypes.object.isRequired,
    qrCodeItem: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    categoriesMap: PropTypes.instanceOf(Map).isRequired,
    updateQRCodeLocallyHandler: PropTypes.func.isRequired,
    updateQRCodePermanentlyHandler: PropTypes.func.isRequired,
    clickHandler: PropTypes.func.isRequired,
};

export default withRouter(React.memo(withStyles(TextFieldLabelStyles)(QRCode)));
