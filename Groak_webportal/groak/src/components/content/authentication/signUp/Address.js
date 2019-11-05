/**
 * This page is used for the address component in the sign up screen.
 * It contains the text field as well as the drop down list of addresses.
 */
import React from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { withStyles } from '@material-ui/core/styles';

import { TextField } from '@material-ui/core';
import { AddressComment } from '../../../../catalog/Comments';
import { TextFieldLabelStyles, textFieldLabelProps } from '../../../../catalog/Others';

const Address = (props) => {
    const { classes, address, setAddress } = props;

    /**
     * This function sets extracts component from the address. Ex: Street from the address. If it
     * does not find it then it returns null.
     *
     * @param {*} addressArray this contains the address selected from list
     * @param {*} type this is the type of component needed such as street, state etc.
     */
    function processData(addressArray, type) {
        const value = addressArray.find((addressComponent) => {
            return addressComponent.types.includes(type);
        });
        return value ? value.long_name : null;
    }

    /**
     * The function extracts the latitude and longitude and other components and sets it the address of te reducer.
     *
     * @param {*} addressLocal this is the address selected from the list
     */
    const handleSelect = async (addressLocal) => {
        const results = await geocodeByAddress(addressLocal);
        const latLng = await getLatLng(results[0]);
        setAddress({
            type: 'setAddress',
            displayAddress: addressLocal,
            formattedAddress: results[0].formatted_address,
            streetNumber: processData(results[0].address_components, 'street_number'),
            street: processData(results[0].address_components, 'route'),
            city: processData(results[0].address_components, 'locality'),
            state: processData(results[0].address_components, 'administrative_area_level_1'),
            country: processData(results[0].address_components, 'country'),
            postalCode: processData(results[0].address_components, 'postal_code'),
            latitude: latLng.lat,
            longitude: latLng.lng,
        });
    };

    return (
        <PlacesAutocomplete
            value={address.displayAddress}
            onChange={(addressLocal) => { setAddress({ type: 'setDisplayAddress', displayAddress: addressLocal }); }}
            onSelect={handleSelect}
        >
            {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                return (
                    <div style={{ width: '100%' }}>
                        <TextField
                            style={{ marginBottom: -2 }}
                            {...getInputProps({
                                label: 'Address',
                                type: 'text',
                                required: true,
                                fullWidth: true,
                                margin: 'normal',
                                shrink: (address.length > 0).toString(),
                                variant: 'outlined',
                                InputLabelProps: textFieldLabelProps(classes),
                            })}
                        />
                        <div className="autocomplete-dropdown-container">
                            {suggestions.map((suggestion) => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                        })}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                            {suggestions.length === 0 ? <p>{AddressComment}</p> : null}
                        </div>
                    </div>
                );
            }}
        </PlacesAutocomplete>
    );
};

Address.propTypes = {
    classes: PropTypes.object.isRequired,
    address: PropTypes.object.isRequired,
    setAddress: PropTypes.func.isRequired,
};

export default React.memo(withStyles(TextFieldLabelStyles)(Address));
