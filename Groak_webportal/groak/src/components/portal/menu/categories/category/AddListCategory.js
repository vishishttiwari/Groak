/**
 * This component is used to represent each dish card in dishes
 */

import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { DemoCategoryName } from '../../../../../catalog/Demo';

const AddListCategory = (props) => {
    const { index, name, setState } = props;

    return (
        <>
            <TableRow>
                <TableCell component="th" scope="row">
                    <TextField
                        title="Category Name"
                        label="Category Name"
                        type="text"
                        value={name}
                        placeholder={`Ex: ${DemoCategoryName}`}
                        fullWidth
                        variant="outlined"
                        required
                        multiline
                        rows="1"
                        onChange={(event) => {
                            event.stopPropagation();
                            setState({ type: 'setName', index, name: event.target.value });
                        }}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    />
                </TableCell>
                <TableCell style={{ maxWidth: '200px' }} align="center">
                </TableCell>
                <TableCell align="center">
                </TableCell>
                <TableCell align="center">
                </TableCell>
            </TableRow>
        </>
    );
};

AddListCategory.propTypes = {
    index: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(AddListCategory);
