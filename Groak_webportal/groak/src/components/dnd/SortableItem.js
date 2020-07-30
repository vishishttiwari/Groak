import React from 'react';
import { SortableElement } from 'react-sortable-hoc';

const SortableItem = SortableElement(({ children }) => {
    return children;
});

export default React.memo(SortableItem);
