/**
 * This components is used to represent the unselected categories in qr code details
 */
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Category from './Category';

const QRCodeUnSelectedCategories = (props) => {
    const { history, allCategories, selectedCategoriesPath, checkCategoryHandler } = props;

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
            <h2>Unselected Categories:</h2>
            {allCategories && allCategories.length !== 0 ? <p>{}</p> : null}
            <div className="categories">
                {allCategories.map((category) => {
                    return (!selectedCategoriesPath.includes(category.reference.path) ? (
                        <Category
                            key={category.id}
                            categoryItem={category}
                            alreadyChecked={false}
                            checkCategoryHandler={checkCategoryHandler}
                            clickHandler={() => { categoryDetailHandler(category.id); }}
                        />
                    ) : null);
                })}
            </div>
        </div>
    );
};

QRCodeUnSelectedCategories.propTypes = {
    history: PropTypes.object.isRequired,
    allCategories: PropTypes.array.isRequired,
    selectedCategoriesPath: PropTypes.array.isRequired,
    checkCategoryHandler: PropTypes.func.isRequired,
};

export default withRouter(React.memo(QRCodeUnSelectedCategories));
