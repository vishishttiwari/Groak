/**
 * This components is used to represent the unselected dishes in categories details
 */
import React, { useReducer } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import SearchBar from 'material-ui-search-bar';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ListDish from './ListDish';

const initialState = {
    searchField: '',
};

function reducer(state, action) {
    switch (action.type) {
        case 'setSearchField':
            return { ...state, searchField: action.searchField };
        default:
            return initialState;
    }
}

const CategoryUnselectedDishes = (props) => {
    const { history, selectedDishesPath, allDishes, checkDishHandler } = props;
    const [state, setState] = useReducer(reducer, initialState);

    const isDishVisible = (dish) => {
        if (!dish || !dish.reference || !dish.reference.path) { return false; }
        if (selectedDishesPath.includes(dish.reference.path)) { return false; }
        if (state.searchField.length <= 0) { return true; }
        if (dish.name && dish.name.toLowerCase().startsWith(state.searchField.toLowerCase())) { return true; }
        if (dish.name) {
            const dishName = dish.name.split(' ');
            for (let i = 0; i < dishName.length; i += 1) {
                if (dishName[i] && dishName[i].toLowerCase().startsWith(state.searchField.toLowerCase())) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * This function is called when dish is pressed
     *
     * @param {*} id
     */
    function dishDetailHandler(id) {
        history.push(`/dishes/${id}`);
    }

    return (
        <div className="category-dishes">
            <h2>Unselected Dishes:</h2>
            <SearchBar
                className="search-bar"
                value={state.searchField}
                onChange={(newValue) => {
                    setState({ type: 'setSearchField', searchField: newValue });
                }}
            />
            <div className="dishes-list-view">
                <Paper>
                    <TableContainer>
                        <Table size="small" aria-label="dishes table">
                            <TableHead style={{ overflowX: 'scroll' }}>
                                <TableRow>
                                    <TableCell width="200px" className="dish-items-list-view-heading">Name</TableCell>
                                    <TableCell width="150px" className="dish-items-list-view-heading" align="center">Price</TableCell>
                                    <TableCell width="150px" className="dish-items-list-view-heading" align="center">Photo</TableCell>
                                    <TableCell width="500px" className="dish-items-list-view-heading" align="center">Description</TableCell>
                                    <TableCell width="50px" className="dish-items-list-view-heading" align="center">Select</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allDishes.map((dish) => {
                                    return (isDishVisible(dish)
                                        ? (
                                            <ListDish
                                                key={dish.id}
                                                dishItem={dish}
                                                dishDetailHandler={() => { return dishDetailHandler(dish.id); }}
                                                checked={false}
                                                addToCheckedDish={checkDishHandler}
                                            />
                                        ) : null
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        </div>
    );
};

CategoryUnselectedDishes.propTypes = {
    history: PropTypes.object.isRequired,
    selectedDishesPath: PropTypes.array.isRequired,
    allDishes: PropTypes.array.isRequired,
    checkDishHandler: PropTypes.func.isRequired,
};

export default withRouter(React.memo(CategoryUnselectedDishes));
