/**
 * Used for confirming with user if they are ok with asking for waiter
 */
import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { IconButton, Button, Dialog, DialogActions } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
import CategoryDays from '../categoryDetails/CategoryDays';
import { DemoCategoryEndTime, DemoCategoryStartTime } from '../../../../catalog/Demo';
import { updateCategoriesFromArrayAPI } from './CategoriesAPICalls';

const initialState = {
    startTime: {
        sunday: DemoCategoryStartTime,
        monday: DemoCategoryStartTime,
        tuesday: DemoCategoryStartTime,
        wednesday: DemoCategoryStartTime,
        thursday: DemoCategoryStartTime,
        friday: DemoCategoryStartTime,
        saturday: DemoCategoryStartTime,
    },
    endTime: {
        sunday: DemoCategoryEndTime,
        monday: DemoCategoryEndTime,
        tuesday: DemoCategoryEndTime,
        wednesday: DemoCategoryEndTime,
        thursday: DemoCategoryEndTime,
        friday: DemoCategoryEndTime,
        saturday: DemoCategoryEndTime,
    },
    days: {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
    },
};

function reducer(state, action) {
    switch (action.type) {
        case 'setStartTime':
            return { ...state, startTime: action.startTime };
        case 'setEndTime':
            return { ...state, endTime: action.endTime };
        case 'setDays':
            return { ...state, days: action.days };
        default:
            return { ...state };
    }
}

const CategoryModificationPopUp = (props) => {
    const { popup, hidePopup, popUpSubmit, restaurantId, categoryIds, category } = props;
    const [state, setStateLocal] = useReducer(reducer, initialState);
    const [scroll, setScroll] = React.useState('paper');
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setScroll('paper');
    }, []);

    const header = () => {
        if (category === 'days') {
            return 'Active Days';
        }
        return '';
    };

    const finalActions = () => {
        if (category === 'days') {
            return (
                <CategoryDays days={state.days} startTime={state.startTime} endTime={state.endTime} setState={setStateLocal} />
            );
        }
        return (null);
    };

    const submit = async () => {
        if (category === 'days') {
            await updateCategoriesFromArrayAPI(restaurantId, categoryIds, category, { days: state.days, startTime: state.startTime, endTime: state.endTime }, enqueueSnackbar);
        }
        popUpSubmit();
    };

    return (
        <Dialog
            className="pop-up-after-restaurant"
            open={popup}
            onClose={(() => {
                hidePopup('');
            })}
            scroll={scroll}
        >
            <div className="pop-up-after-restaurant-title">
                <p>{header()}</p>
                <IconButton onClick={(
                    () => {
                        hidePopup('');
                    })}
                >
                    <CloseRounded className="pop-up-after-restaurant-title-close" />
                </IconButton>
            </div>
            <DialogActions className="pop-up-after-restaurant-actions">
                {finalActions()}
                <Button
                    className="pop-up-after-restaurant-actions-button"
                    type="button"
                    onClick={() => {
                        submit();
                    }}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};
CategoryModificationPopUp.propTypes = {
    popup: PropTypes.bool.isRequired,
    hidePopup: PropTypes.func.isRequired,
    popUpSubmit: PropTypes.func.isRequired,
    category: PropTypes.string.isRequired,
    restaurantId: PropTypes.string.isRequired,
    categoryIds: PropTypes.array.isRequired,
};

export default React.memo(CategoryModificationPopUp);
