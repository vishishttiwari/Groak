/**
 * This component is used for the analytics page
 */
import React, { useEffect, useReducer, useContext } from 'react';
import { useSnackbar } from 'notistack';
import { Select } from '@material-ui/core';
import { context } from '../../../globalState/globalState';
import Heading from '../../ui/heading/Heading';
import './css/Analytics.css';
import DatePicker from './DatePicker';
import { fetchAnalyticsAPI } from './AnalyticsAPICalls';
import { getCurrentDateTime } from '../../../catalog/TimesDates';
import Spinner from '../../ui/spinner/Spinner';
import UsersAnalytics from './UsersAnalytics';
import OrdersAnalytics from './OrdersAnalytics';
import DishesAnalytics from './DishesAnalytics';
import RestaurantAnalytics from './RestaurantAnalytics';

const randomColor = require('randomcolor');

const getTodayDateRange = () => {
    const startDate = getCurrentDateTime();
    startDate.setHours(0);
    startDate.setMinutes(0);

    const endDate = getCurrentDateTime();
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);

    return {
        label: 'Today',
        startDate,
        endDate,
    };
};

const initialState = {
    analyticsType: 'users_analysis',
    totalUsers: 0,
    totalScans: 0,
    totalUsersData: {
        labels: [],
        datasets: [
            {
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(255,99,132,1)',
                borderColor: 'rgba(255,99,132,1)',
                hoverBackgroundColor: 'rgba(255,99,132,1)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [],
            },
        ],
    },
    totalScansData: {
        labels: [],
        datasets: [
            {
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(255,99,132,1)',
                borderColor: 'rgba(255,99,132,1)',
                hoverBackgroundColor: 'rgba(255,99,132,1)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [],
            },
        ],
    },
    qrCodesData: {
        labels: [],
        datasets: [
            {
                fill: false,
                data: [],
            },
        ],
    },
    tableCodesData: {
        labels: [],
        datasets: [
            {
                fill: false,
                data: [],
            },
        ],
    },

    totalOrders: 0,
    priceOrders: 0,
    totalOrdersData: {
        labels: [],
        datasets: [
            {
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(255,99,132,1)',
                borderColor: 'rgba(255,99,132,1)',
                hoverBackgroundColor: 'rgba(255,99,132,1)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [],
            },
        ],
    },
    priceOrdersData: {
        labels: [],
        datasets: [
            {
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(255,99,132,1)',
                borderColor: 'rgba(255,99,132,1)',
                hoverBackgroundColor: 'rgba(255,99,132,1)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [],
            },
        ],
    },
    dishesOrdersTotalData: {
        labels: [],
        datasets: [
            {
                fill: false,
                data: [],
            },
        ],
    },
    dishesOrdersPriceData: {
        labels: [],
        datasets: [
            {
                fill: false,
                data: [],
            },
        ],
    },
    tableOrdersTotalData: {
        labels: [],
        datasets: [
            {
                fill: false,
                data: [],
            },
        ],
    },
    tableOrdersPriceData: {
        labels: [],
        datasets: [
            {
                fill: false,
                data: [],
            },
        ],
    },

    dishesLabels: [],
    dishesLikes: [],

    totalRating: 0,
    toalRatingEntries: 0,
    totalRatingEntriesArray: {
        labels: [],
        datasets: [
            {
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(255,99,132,1)',
                borderColor: 'rgba(255,99,132,1)',
                hoverBackgroundColor: 'rgba(255,99,132,1)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [],
            },
        ],
    },
    totalRatingArray: {
        labels: [],
        datasets: [
            {
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(255,99,132,1)',
                borderColor: 'rgba(255,99,132,1)',
                hoverBackgroundColor: 'rgba(255,99,132,1)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [],
            },
        ],
    },
    messages: [],

    dateRange: getTodayDateRange(),
    loadingSpinner: true,
};

function reducer(state, action) {
    let newTotalUsersData;
    let newTotalScansData;
    let newQRCodesData;
    let newTableCodesData;
    let newTotalOrdersData;
    let newPriceOrdersData;
    let newDishesOrdersTotalData;
    let newDishesOrdersPriceData;
    let newTableOrdersTotalData;
    let newTableOrdersPriceData;
    let newTotalRatingEntriesArray;
    let newTotalRatingArray;
    switch (action.type) {
        case 'setAnalyticsType':
            return { ...state, analyticsType: action.analyticsType };
        case 'setDateRange':
            return { ...state, dateRange: action.dateRange, loadingSpinner: true };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        case 'setAnalytics':
            newTotalUsersData = { ...state.totalUsersData, labels: action.labels, datasets: [{ ...(state.totalUsersData.datasets[0]), data: action.totalUsersArray }] };
            newTotalScansData = { ...state.totalScansData, labels: action.labels, datasets: [{ ...(state.totalScansData.datasets[0]), data: action.totalScansArray }] };
            newQRCodesData = { ...state.qrCodesData, labels: action.qrCodesLabels, datasets: [{ ...(state.qrCodesData.datasets[0]), data: action.qrCodesValues, backgroundColor: randomColor({ luminosity: 'light', count: action.qrCodesLabels.length }) }] };
            newTableCodesData = { ...state.tableCodesData, labels: action.tableCodesLabels, datasets: [{ ...(state.tableCodesData.datasets[0]), data: action.tableCodesValues, backgroundColor: randomColor({ luminosity: 'light', count: action.tableCodesLabels.length }) }] };

            newTotalOrdersData = { ...state.totalOrdersData, labels: action.labels, datasets: [{ ...(state.totalOrdersData.datasets[0]), data: action.totalOrdersArray }] };
            newPriceOrdersData = { ...state.priceOrdersData, labels: action.labels, datasets: [{ ...(state.priceOrdersData.datasets[0]), data: action.priceOrdersArray }] };
            newDishesOrdersTotalData = { ...state.dishesOrdersTotalData, labels: action.dishesOrdersTotalLabels, datasets: [{ ...(state.dishesOrdersTotalData.datasets[0]), data: action.dishesOrdersTotalValues, backgroundColor: randomColor({ luminosity: 'light', count: action.dishesOrdersTotalLabels.length }) }] };
            newDishesOrdersPriceData = { ...state.dishesOrdersPriceData, labels: action.dishesOrdersPriceLabels, datasets: [{ ...(state.dishesOrdersPriceData.datasets[0]), data: action.dishesOrdersPriceValues, backgroundColor: randomColor({ luminosity: 'light', count: action.dishesOrdersPriceLabels.length }) }] };
            newTableOrdersTotalData = { ...state.tableOrdersTotalData, labels: action.tableOrdersTotalLabels, datasets: [{ ...(state.tableOrdersTotalData.datasets[0]), data: action.tableOrdersTotalValues, backgroundColor: randomColor({ luminosity: 'light', count: action.tableOrdersTotalLabels.length }) }] };
            newTableOrdersPriceData = { ...state.tableOrdersPriceData, labels: action.tableOrdersPriceLabels, datasets: [{ ...(state.tableOrdersPriceData.datasets[0]), data: action.tableOrdersPriceValues, backgroundColor: randomColor({ luminosity: 'light', count: action.tableOrdersPriceLabels.length }) }] };

            newTotalRatingEntriesArray = { ...state.totalRatingEntriesArray, labels: action.labels, datasets: [{ ...(state.totalRatingEntriesArray.datasets[0]), data: action.totalRatingEntriesArray }] };
            newTotalRatingArray = { ...state.totalRatingArray, labels: action.labels, datasets: [{ ...(state.totalRatingArray.datasets[0]), data: action.totalRatingArray }] };

            return { ...state,
                totalUsers: action.totalUsers,
                totalScans: action.totalScans,
                totalUsersData: newTotalUsersData,
                totalScansData: newTotalScansData,
                qrCodesData: newQRCodesData,
                tableCodesData: newTableCodesData,

                totalOrders: action.totalOrders,
                priceOrders: action.priceOrders,
                totalOrdersData: newTotalOrdersData,
                priceOrdersData: newPriceOrdersData,
                dishesOrdersTotalData: newDishesOrdersTotalData,
                dishesOrdersPriceData: newDishesOrdersPriceData,
                tableOrdersTotalData: newTableOrdersTotalData,
                tableOrdersPriceData: newTableOrdersPriceData,

                dishesLabels: action.dishesLabels,
                dishesLikes: action.dishesLikes,

                totalRating: action.totalRating,
                toalRatingEntries: action.toalRatingEntries,
                totalRatingEntriesArray: newTotalRatingEntriesArray,
                totalRatingArray: newTotalRatingArray,
                messages: action.messages,

                loadingSpinner: false };
        default:
            return state;
    }
}

const Analytics = () => {
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchAnalyticsAPI(globalState.restaurantIdPortal, state.dateRange, setState, enqueueSnackbar);
    }, [globalState.restaurantIdPortal, state.dateRange]);

    const analyticsData = () => {
        if (state.analyticsType === 'users_analysis') {
            return (
                <UsersAnalytics
                    totalUsers={state.totalUsers}
                    totalScans={state.totalScans}
                    totalUsersData={state.totalUsersData}
                    totalScansData={state.totalScansData}
                    qrCodesData={state.qrCodesData}
                    tableCodesData={state.tableCodesData}
                />
            );
        } if (state.analyticsType === 'orders_analysis') {
            return (
                <OrdersAnalytics
                    totalOrders={state.totalOrders}
                    priceOrders={state.priceOrders}
                    totalOrdersData={state.totalOrdersData}
                    priceOrdersData={state.priceOrdersData}
                    dishesOrdersTotalData={state.dishesOrdersTotalData}
                    dishesOrdersPriceData={state.dishesOrdersPriceData}
                    tableOrdersTotalData={state.tableOrdersTotalData}
                    tableOrdersPriceData={state.tableOrdersPriceData}
                />
            );
        } if (state.analyticsType === 'dishes_analysis') {
            return (
                <DishesAnalytics
                    dishesLabels={state.dishesLabels}
                    dishesLikes={state.dishesLikes}
                />
            );
        } if (state.analyticsType === 'restaurant_analysis') {
            return (
                <RestaurantAnalytics
                    totalRating={state.totalRating}
                    toalRatingEntries={state.toalRatingEntries}
                    totalRatingEntriesArray={state.totalRatingEntriesArray}
                    totalRatingArray={state.totalRatingArray}
                    messages={state.messages}
                />
            );
        }
        return null;
    };

    return (
        <div className="analytics">
            <Heading heading="Analytics" />
            <DatePicker onDateChange={setState} />
            <Select
                className="analytics-select"
                native
                variant="outlined"
                value={state.analyticsType}
                onChange={(event) => { setState({ type: 'setAnalyticsType', analyticsType: event.target.value }); }}
            >
                <option value="users_analysis">Users Analysis</option>
                <option value="orders_analysis">Orders Analysis</option>
                <option value="dishes_analysis">Dishes Analysis</option>
                <option value="restaurant_analysis">Restaurant Analysis</option>
            </Select>
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <div className="analytics-content">
                    {analyticsData()}
                </div>
            ) : null}
        </div>
    );
};

export default React.memo(Analytics);
