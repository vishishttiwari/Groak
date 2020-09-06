import React from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { randomNumber } from '../../../catalog/Others';
import CustomerTopic from '../ui/topic/CustomerTopic';
import { OptionsExceedingMax } from '../../../catalog/NotificationsComments';

const AddToCartCategory = (props) => {
    const { extra, extraIndex, optionsSelected, setState } = props;
    const { enqueueSnackbar } = useSnackbar();

    const getSubheader = (() => {
        if (!extra.multipleSelections) {
            return 'Required';
        }
        let str = '';
        if (extra.minOptionsSelect > 0) {
            str += `Select atleast ${extra.minOptionsSelect}`;
        }
        if (extra.maxOptionsSelect < extra.options.length) {
            if (str.length === 0) {
                str += `Select atmost ${extra.maxOptionsSelect}`;
            } else {
                str += ` and up to ${extra.maxOptionsSelect}`;
            }
        }
        return str;
    });

    const optionClicked = (optionIndex) => {
        const updatedOptionsSelected = optionsSelected;
        let priceDelta = 0;
        if (extra.multipleSelections) {
            const count = updatedOptionsSelected[extraIndex].filter((option) => { return option; }).length;

            const selected = updatedOptionsSelected[extraIndex][optionIndex];
            if (selected) {
                priceDelta -= extra.options[optionIndex].price;
                updatedOptionsSelected[extraIndex][optionIndex] = false;
            } else if (count < extra.maxOptionsSelect) {
                priceDelta += extra.options[optionIndex].price;
                updatedOptionsSelected[extraIndex][optionIndex] = true;
            } else {
                enqueueSnackbar(OptionsExceedingMax(extra.title), { variant: 'error' });
            }
        } else {
            updatedOptionsSelected[extraIndex].forEach((option, optionIndex1) => {
                if (option) {
                    priceDelta -= extra.options[optionIndex1].price;
                }
            });
            updatedOptionsSelected[extraIndex] = new Array(extra.options.length).fill(false);
            updatedOptionsSelected[extraIndex][optionIndex] = true;
            priceDelta += extra.options[optionIndex].price;
        }
        setState({
            type: 'changeOptionsSelected',
            optionsSelected: updatedOptionsSelected,
            priceDelta,
        });
    };

    const getSelectionButton = (index2) => {
        const checked = optionsSelected[extraIndex][index2];
        if (extra.multipleSelections) {
            if (checked) {
                return (<CheckBoxIcon className="addtocart-category-option-select-button" />);
            }
            return (<CheckBoxOutlineBlankIcon className="addtocart-category-option-select-button" />);
        }
        if (checked) {
            return (<CheckCircleIcon className="addtocart-category-option-select-button" />);
        }
        return (<RadioButtonUncheckedIcon className="addtocart-category-option-select-button" />);
    };

    return (
        <div className="addtocart-category">
            <CustomerTopic header={extra.title} subheader={getSubheader()} />
            {extra.options.map((option, index2) => {
                return (
                    <div key={randomNumber()} className="addtocart-category-option" onClick={() => { optionClicked(index2); }}>
                        {getSelectionButton(index2)}
                        <p className="addtocart-category-option-title">{option.title}</p>
                        {option.price && option.price > 0 ? (
                            <p className="addtocart-category-option-price">{`$ ${(option.price).toFixed(2)}`}</p>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
};

AddToCartCategory.propTypes = {
    extra: PropTypes.object.isRequired,
    extraIndex: PropTypes.number.isRequired,
    optionsSelected: PropTypes.instanceOf(Array).isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(AddToCartCategory);
