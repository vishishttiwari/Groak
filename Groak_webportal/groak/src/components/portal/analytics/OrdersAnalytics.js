/* eslint-disable func-names */
/* eslint-disable space-before-function-paren */
/* eslint-disable object-shorthand */
/**
 * This component is used for the order analytics in analytics page
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Line, Doughnut } from 'react-chartjs-2';
import './css/Analytics.css';

const OrdersAnalytics = (props) => {
    const { totalOrders, priceOrders, totalOrdersData, priceOrdersData, dishesOrdersTotalData, dishesOrdersPriceData, tableOrdersTotalData, tableOrdersPriceData } = props;

    return (
        <>
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
            <h2>{`Price of Dishes Ordered: $${priceOrders}`}</h2>
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
                <>
                    <div className="horizontal-line" />
                    <h2>Total Dishes</h2>
                    <Doughnut
                        data={dishesOrdersTotalData}
                    />
                </>
            ) : null}
            {dishesOrdersPriceData.labels && dishesOrdersPriceData.labels.length > 0 ? (
                <>
                    <div className="horizontal-line" />
                    <h2>Dish Prices</h2>
                    <Doughnut
                        data={dishesOrdersPriceData}
                        options={{
                            tooltips: {
                                callbacks: {
                                    label: function(tooltipItem, data) {
                                        const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                        return `$${value}`;
                                    },
                                },
                            },
                        }}
                    />
                </>
            ) : null}
            {tableOrdersTotalData.labels && tableOrdersTotalData.labels.length > 0 ? (
                <>
                    <div className="horizontal-line" />
                    <h2>Total Tables</h2>
                    <Doughnut data={tableOrdersTotalData} />
                </>
            ) : null}
            {tableOrdersPriceData.labels && tableOrdersPriceData.labels.length > 0 ? (
                <>
                    <div className="horizontal-line" />
                    <h2>Table Prices</h2>
                    <Doughnut
                        data={tableOrdersPriceData}
                        options={{
                            tooltips: {
                                callbacks: {
                                    label: function(tooltipItem, data) {
                                        const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                        return `$${value}`;
                                    },
                                },
                            },
                        }}
                    />
                </>
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
