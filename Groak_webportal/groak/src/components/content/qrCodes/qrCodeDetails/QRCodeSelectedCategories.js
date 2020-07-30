/**
 * * This components is used to represent the selected categories in qr code details
 */
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import arrayMove from 'array-move';
import Category from './Category';

import SortableList from '../../../dnd/SortableList';
import SortableItem from '../../../dnd/SortableItem';

const QRCodeSelectedCategories = (props) => {
    const { history, allCategoriesMap, selectedCategoriesPath, checkCategoryHandler, changeCategoryPositionHandler } = props;

    /**
     * This function is called when drag and drop has ended
     *
     * @param {*} param0
     */
    const onSortEnd = ({ oldIndex, newIndex }) => {
        changeCategoryPositionHandler(arrayMove(selectedCategoriesPath, oldIndex, newIndex));
    };

    /**
     * This function is called when category is pressed
     *
     * @param {*} id
     */
    function categoryDetailHandler(id) {
        history.push(`/categories/${id}`);
    }

    return (
        <div className="qrcode-categories">
            <h2>Selected Categories:</h2>
            {selectedCategoriesPath && selectedCategoriesPath.length !== 0 ? <p>{}</p> : null}
            <SortableList axis="xy" onSortEnd={onSortEnd} distance={1}>
                <div className="categories">
                    {selectedCategoriesPath.map((categoryPath, index) => {
                        const category = allCategoriesMap.get(categoryPath);
                        return (category
                            ? (
                                <SortableItem key={category.id} index={index}>
                                    <Category
                                        categoryItem={category}
                                        alreadyChecked
                                        checkCategoryHandler={checkCategoryHandler}
                                        clickHandler={() => { categoryDetailHandler(category.id); }}
                                    />
                                </SortableItem>
                            ) : null);
                    })}
                </div>
            </SortableList>
        </div>
    );
};

QRCodeSelectedCategories.propTypes = {
    history: PropTypes.object.isRequired,
    allCategoriesMap: PropTypes.instanceOf(Map).isRequired,
    selectedCategoriesPath: PropTypes.array.isRequired,
    checkCategoryHandler: PropTypes.func.isRequired,
    changeCategoryPositionHandler: PropTypes.func.isRequired,
};

export default withRouter(React.memo(QRCodeSelectedCategories));
