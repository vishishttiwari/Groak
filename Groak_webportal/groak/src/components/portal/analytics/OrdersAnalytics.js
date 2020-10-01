/* eslint-disable func-names */
/* eslint-disable space-before-function-paren */
/* eslint-disable object-shorthand */
/**
 * This component is used for the order analytics in analytics page
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Line, Doughnut } from 'react-chartjs-2';
import './css/Analytics.css';
import { context } from '../../../globalState/globalState';

const OrdersAnalytics = (props) => {
    const { totalOrders, priceOrders, totalOrdersData, priceOrdersData, dishesOrdersTotalData, dishesOrdersPriceData, tableOrdersTotalData, tableOrdersPriceData } = props;
    const { globalState } = useContext(context);

    return (
        <>
            {!globalState.restaurantPortal || !globalState.restaurantPortal.allowOrdering || !globalState.restaurantPortal.allowOrdering.restaurant ? (
                <p>These analytics are only available if you have subscribed to our ordering model. To get these analytics, use Groak for ordering at your restaurant.</p>
            ) : null}
            <h2 style={{ marginTop: '0px' }}>{`Total Dishes Ordered: ${totalOrders}`}</h2>
            <Line
                data={totalOrdersData}
                redraw
                legend={{
                    display: false,
                }}
                options={{
                    scales: {
                        xAxes: [{
                            gridLines: {
                                color: 'rgba(0, 0, 0, 0)',
                            },
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                            },
                        }],
                    },
                    maintainAspectRatio: true }}
            />
            <div className="horizontal-line" />
            <h2>{`Total Price of Dishes Ordered: $${priceOrders}`}</h2>
            <Line
                data={priceOrdersData}
                redraw
                legend={{
                    display: false,
                }}
                options={{
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                return `$${value}`;
                            },
                        },
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                color: 'rgba(0, 0, 0, 0)',
                            },
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                                callback: function(value) {
                                    return `$${value.toString()}`;
                                },
                            },
                        }],
                    },
                    maintainAspectRatio: true }}
            />
            {dishesOrdersTotalData.labels && dishesOrdersTotalData.labels.length > 0 ? (
                <div className="horizontal-line" />
            ) : null}
            {dishesOrdersTotalData.labels && dishesOrdersTotalData.labels.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
                    <h2>Total Orders for Every Dish</h2>
                    <Doughnut
                        width={300}
                        height={400}
                        data={dishesOrdersTotalData}
                        options={{
                            responsive: false,
                            maintainAspectRatio: false }}
                    />
                </div>
            ) : null}
            {dishesOrdersPriceData.labels && dishesOrdersPriceData.labels.length > 0 ? (
                <div className="horizontal-line" />
            ) : null}
            {dishesOrdersPriceData.labels && dishesOrdersPriceData.labels.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
                    <h2>Total Price Ordered for Every Dish</h2>
                    <Doughnut
                        width={300}
                        height={400}
                        data={dishesOrdersPriceData}
                        options={{
                            responsive: false,
                            maintainAspectRatio: false,
                            tooltips: {
                                callbacks: {
                                    label: function(tooltipItem, data) {
                                        const label = data.labels[tooltipItem.index];
                                        const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                        return `${label}: $${value}`;
                                    },
                                },
                            },
                        }}
                    />
                </div>
            ) : null}
            {tableOrdersTotalData.labels && tableOrdersTotalData.labels.length > 0 ? (
                <div className="horizontal-line" />
            ) : null}
            {tableOrdersTotalData.labels && tableOrdersTotalData.labels.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
                    <h2>Total Orders for every Menu/Table</h2>
                    <Doughnut
                        width={300}
                        height={400}
                        data={tableOrdersTotalData}
                        options={{
                            responsive: false,
                            maintainAspectRatio: false }}
                    />
                </div>
            ) : null}
            {tableOrdersPriceData.labels && tableOrdersPriceData.labels.length > 0 ? (
                <div className="horizontal-line" />
            ) : null}
            {tableOrdersPriceData.labels && tableOrdersPriceData.labels.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
                    <h2>Total Price Ordered for every Menu/Table</h2>
                    <Doughnut
                        width={300}
                        height={400}
                        data={tableOrdersPriceData}
                        options={{
                            responsive: false,
                            maintainAspectRatio: false,
                            tooltips: {
                                callbacks: {
                                    label: function(tooltipItem, data) {
                                        const label = data.labels[tooltipItem.index];
                                        const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                        return `${label}: $${value}`;
                                    },
                                },
                            },
                        }}
                    />
                </div>
            ) : null}
        </>

    );
};

OrdersAnalytics.propTypes = {
    totalOrders: PropTypes.number.isRequired,
    priceOrders: PropTypes.number.isRequired,
    totalOrdersData: PropTypes.object.isRequired,
    priceOrdersData: PropTypes.object.isRequired,
    dishesOrdersTotalData: PropTypes.object.isRequired,
    dishesOrdersPriceData: PropTypes.object.isRequired,
    tableOrdersTotalData: PropTypes.object.isRequired,
    tableOrdersPriceData: PropTypes.object.isRequired,
};

export default React.memo(OrdersAnalytics);
