/**
 * This component is used to represent the table canvas
 */
import Draggable from 'react-draggable';
import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { context } from '../../../globalState/globalStatePortal';

import Table from './Table';
import { updateTableAPI } from './TablesAPICalls';
import { TableStatus } from '../../../catalog/Others';

const TablesCanvas = (props) => {
    const { history, tables, setState, tableClickHandler } = props;
    const [dragged, setDragged] = useState(false);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    /**
     * This function is called when a table is dragged
     *
     * @param {*} move this contains the amount of movement the table has had
     * @param {*} id is the id of the table that is being moved
     */
    const dragHandler = async (move, id) => {
        const newTables = tables.map((table) => {
            if (table.id !== id) {
                return table;
            }
            const newTable = { ...table };
            newTable.x += move.deltaX;
            newTable.y += move.deltaY;
            return newTable;
        });
        setState({ type: 'setTables', tables: newTables });
        setDragged(true);
    };

    /**
     * This function updates the backend when the user ends dragging the table
     *
     * @param {*} id is the id of the table that is being moved
     */
    const dragLeaveHandler = async (event, id) => {
        let toBeUpdatedData;
        tables.forEach((table) => {
            if (table.id === id) {
                toBeUpdatedData = { x: table.x, y: table.y };
            }
        });
        if (dragged) {
            await updateTableAPI(globalState.restaurantId, id, toBeUpdatedData, setState, enqueueSnackbar);
            event.stopPropagation();
            setDragged(false);
        }
    };

    const clickHandler = async (status, id) => {
        if (!dragged) {
            if (status === TableStatus.available) {
                tableClickHandler(id);
            } else {
                history.push(`/orders/${id}`);
            }
        }
    };

    // Whenever an order is placed or updated or request placed then put a notification exclamation mark
    // at the top like in iphone. Just have two colors red and green. Whenever hovering on it, tell the status.
    // You can also try to include serve Time but it really depends.
    return (
        <div className="tables-canvas">
            {tables.map((table) => {
                return (
                    <div
                        key={table.id}
                        onTouchEnd={() => { clickHandler(table.status, table.id); }}
                        onClick={() => { clickHandler(table.status, table.id); }}
                    >
                        <Draggable
                            enableUserSelectHack={false}
                            bounds={{ top: 0, left: 0, right: 1130, bottom: 700 }}
                            position={{ x: table.x, y: table.y }}
                            onDrag={(event, move) => { dragHandler(move, table.id); }}
                            onStop={(event) => { dragLeaveHandler(event, table.id); }}
                            grid={[10, 10]}
                        >
                            <div onMouseDown={(event) => { event.stopPropagation(); }}><Table table={table} /></div>
                        </Draggable>
                    </div>
                );
            })}

        </div>
    );
};

TablesCanvas.propTypes = {
    tables: PropTypes.array.isRequired,
    setState: PropTypes.func.isRequired,
    tableClickHandler: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(TablesCanvas));
