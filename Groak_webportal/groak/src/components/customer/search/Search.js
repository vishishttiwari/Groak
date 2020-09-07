import React, { useEffect, useReducer, createRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import Spinner from '../../ui/spinner/Spinner';
import SearchHeader from './SearchHeader';
import { frontDoorQRMenuPageId, randomNumber } from '../../../catalog/Others';
import { fetchCategoriesAPI } from './SearchAPICalls';
import './css/Search.css';
import CustomerNotFound from '../ui/notFound/CustomerNotFound';
import CustomerTopic from '../ui/topic/CustomerTopic';
import { RestaurantNotFound, CategoriesNotFound } from '../../../catalog/Comments';
import MenuDish from '../menu/MenuDish';
import SearchNotFound from '../../../assets/customerImages/search_not_found.png';
import { context } from '../../../globalState/globalState';
import { timeoutValueForCustomer } from '../../../catalog/TimesDates';

const initialState = { menuItems: new Map(), categoryItems: new Map(), restaurant: {}, loadingSpinner: true, restaurantNotFound: false, categoriesNotFound: false, searchField: '' };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchMenuItems':
            return { ...state, menuItems: action.menuItems, categoryItems: action.categoryItems, restaurant: action.restaurant, loadingSpinner: false, restaurantNotFound: false, categoriesNotFound: false };
        case 'setSearchField':
            return { ...state, searchField: action.searchField };
        case 'restaurantNotFound':
            return { ...state, restaurantNotFound: true, loadingSpinner: false };
        case 'categoriesNotFound':
            return { ...state, categoriesNotFound: true, loadingSpinner: false };
        default:
            return initialState;
    }
}

const Menu = (props) => {
    const { history, match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();
    const top = createRef(null);

    useEffect(() => {
        if (!globalState.scannedCustomer) {
            history.replace('/');
        }

        top.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
        });

        async function fetchCategoriesAndRestaurant() {
            await fetchCategoriesAPI(match.params.restaurantid, match.params.qrcodeid, match.params.tableid === frontDoorQRMenuPageId, setState, enqueueSnackbar);
        }
        fetchCategoriesAndRestaurant();

        setTimeout(() => {
            history.replace('/');
        }, timeoutValueForCustomer);
    }, [enqueueSnackbar]);

    /**
     * This function is called when each dish is pressed.
     *
     * @param {*} dish this is the dish that is passed
     */
    function menuDishHandler(dish) {
        let showDish = false;

        if (dish.calories && dish.calories > 0) {
            showDish = true;
        }
        if (dish.fats && dish.fats > 0) {
            showDish = true;
        }
        if (dish.protein && dish.protein > 0) {
            showDish = true;
        }
        if (dish.carbs && dish.carbs > 0) {
            showDish = true;
        }

        if (dish.vegetarian && dish.vegetarian !== 'Not Sure') {
            showDish = true;
        }
        if (dish.vegan && dish.vegan !== 'Not Sure') {
            showDish = true;
        }
        if (dish.glutenFree && dish.glutenFree !== 'Not Sure') {
            showDish = true;
        }
        if (dish.kosher && dish.kosher !== 'Not Sure') {
            showDish = true;
        }

        if (dish.description && dish.description.length > 0) {
            showDish = true;
        }

        if (showDish) {
            history.push(`/customer/dish/${match.params.restaurantid}/${dish.id}`);
        } else {
            history.push(`/customer/addtocart/${match.params.restaurantid}/${dish.id}`);
        }
    }

    /**
     * This function decides if dish is visble after writing something up in the search bar
     *
     * @param {*} dish
     */
    const isDishVisible = (dish) => {
        if (!dish) { return false; }
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

    const isCategoryVisible = (categoryName) => {
        if (state.searchField.length <= 0) { return true; }
        if (categoryName && categoryName.toLowerCase().startsWith(state.searchField.toLowerCase())) { return true; }
        if (categoryName) {
            const dishName = categoryName.split(' ');
            for (let i = 0; i < dishName.length; i += 1) {
                if (dishName[i] && dishName[i].toLowerCase().startsWith(state.searchField.toLowerCase())) {
                    return true;
                }
            }
        }
        return false;
    };

    const checkVisibility = (categoriId) => {
        const categoryName = state.categoryItems.get(categoriId);
        const category = state.menuItems.get(categoriId);
        const initialDom = [];
        if (isCategoryVisible(categoryName)) {
            category.forEach((dish) => {
                initialDom.push(
                    <MenuDish
                        key={randomNumber()}
                        dishItem={dish}
                        highlightText={state.searchField}
                        clickHandler={() => { menuDishHandler(dish); }}
                    />,
                );
            });
        } else {
            category.forEach((dish) => {
                if (isDishVisible(dish)) {
                    initialDom.push(
                        <MenuDish
                            key={randomNumber()}
                            dishItem={dish}
                            highlightText={state.searchField}
                            clickHandler={() => { menuDishHandler(dish); }}
                        />,
                    );
                }
            });
        }
        if (initialDom.length <= 0) {
            return null;
        }
        const dom = [];
        dom.push(<CustomerTopic key={randomNumber()} header={categoryName} highlightText={state.searchField} />);
        dom.push(<div key={randomNumber()} className="search-items">{initialDom}</div>);
        return dom;
    };

    const showCategories = () => {
        const dom = [];
        Array.from(state.menuItems.keys()).forEach((menuItem) => {
            const category = checkVisibility(menuItem);
            if (category) {
                dom.push(category);
            }
        });
        if (dom.length === 0) {
            dom.push(<img key={randomNumber()} className="not-found-image" draggable="false" src={SearchNotFound} alt="No Results" />);
        }
        return dom;
    };

    return (
        <div className="customer search">
            <p ref={top}> </p>
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <>
                    {state.restaurantNotFound || state.categoriesNotFound ? (
                        <>
                            {state.restaurantNotFound
                                ? <CustomerNotFound text={RestaurantNotFound} />
                                : <CustomerNotFound text={CategoriesNotFound} />}
                        </>
                    ) : (
                        <>
                            <SearchHeader restaurantName={state.restaurant.name} state={state} setState={setState} />
                            <div className="content">
                                {showCategories()}
                            </div>
                        </>
                    )}
                </>
            ) : null}
        </div>
    );
};

Menu.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(Menu));
