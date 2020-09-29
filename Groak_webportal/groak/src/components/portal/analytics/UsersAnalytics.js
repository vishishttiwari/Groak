/**
 * This component is used for the users analytics in analytics page
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Line, Doughnut } from 'react-chartjs-2';
import './css/Analytics.css';

const UsersAnalytics = (props) => {
    const { totalUsers, totalScans, totalUsersData, totalScansData, qrCodesData, tableCodesData } = props;

    return (
        <>
            <h2 style={{ marginTop: '0px' }}>{`Total Users: ${totalUsers}`}</h2>
            <p>Total dishes ordered</p>
            <Line
                data={totalUsersData}
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
            <h2>{`Total QR Code Scanned: ${totalScans}`}</h2>
            <p>This is the total number of times a QR code from your restaurant was scanned. Note: One user normally scans more than one QR Codes</p>
            <Line
                data={totalScansData}
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
            {qrCodesData.labels && qrCodesData.labels.length > 0 ? (
                <>
                    <div className="horizontal-line" />
                    <h2>QR Code wise scans</h2>
                    <Doughnut data={qrCodesData} />
                </>
            ) : null}
            {tableCodesData.labels && tableCodesData.labels.length > 0 ? (
                <>
                    <div className="horizontal-line" />
                    <h2>Scans per Table</h2>
                    <Doughnut data={tableCodesData} />
                </>
            ) : null}
        </>

    );
};

UsersAnalytics.propTypes = {
    totalUsers: PropTypes.number.isRequired,
    totalScans: PropTypes.number.isRequired,
    totalUsersData: PropTypes.object.isRequired,
    totalScansData: PropTypes.object.isRequired,
    qrCodesData: PropTypes.object.isRequired,
    tableCodesData: PropTypes.object.isRequired,
};

export default React.memo(UsersAnalytics);
