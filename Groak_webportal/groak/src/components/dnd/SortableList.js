import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';

const SortableList = SortableContainer(({ children }) => {
    return children;
});

export default React.memo(SortableList);
