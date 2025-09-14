// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // API Endpoints
    const globalStatsUrl = 'https://disease.sh/v3/covid-19/all';
    const historicalDataUrl = 'https://disease.sh/v3/covid-19/historical/all?lastdays=365';

    // DOM Elements for Stats Cards
    const totalConfirmedEl = document.getElementById('total-confirmed');
    const totalDeathsEl = document.getElementById('total-deaths');
    const totalRecoveredEl = document.getElementById('total-recovered');

    // Chart.js instance
    let covidChart;
    const chartCanvas = document.getElementById('covidChart').getContext('2d');

    /**
     * Fetches and displays the global summary statistics.
     */
    async function fetchGlobalStats() {
        try {
            const response = await fetch(globalStatsUrl);
            const data = await response.json();

            // Format numbers with commas for readability
            totalConfirmedEl.textContent = data.cases.toLocaleString();
            totalDeathsEl.textContent = data.deaths.toLocaleString();
            totalRecoveredEl.textContent = data.recovered.toLocaleString();
        } catch (error) {
            console.error('Error fetching global stats:', error);
            totalConfirmedEl.textContent = 'Error';
            totalDeathsEl.textContent = 'Error';
            totalRecoveredEl.textContent = 'Error';
        }
    }

    /**
     * Fetches historical data and renders the time-series chart.
     */
    async function fetchHistoricalData() {
        try {
            const response = await fetch(historicalDataUrl);
            const data = await response.json();

            // Process data for the chart
            const labels = Object.keys(data.cases);
            const casesData = Object.values(data.cases);
            const deathsData = Object.values(data.deaths);
            const recoveredData = Object.values(data.recovered);

            renderChart(labels, casesData, deathsData, recoveredData);
        } catch (error) {
            console.error('Error fetching historical data:', error);
        }
    }

    /**
     * Renders the chart using Chart.js.
     * @param {string[]} labels - The dates for the x-axis.
     * @param {number[]} casesData - The confirmed cases data.
     * @param {number[]} deathsData - The deaths data.
     * @param {number[]} recoveredData - The recovered data.
     */
    function renderChart(labels, casesData, deathsData, recoveredData) {
        if (covidChart) {
            covidChart.destroy(); // Destroy previous chart instance if it exists
        }

        covidChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Confirmed Cases',
                    data: casesData,
                    borderColor: '#fbc02d', // Yellow
                    backgroundColor: 'rgba(251, 192, 45, 0.1)',
                    fill: true,
                    tension: 0.1
                }, {
                    label: 'Deaths',
                    data: deathsData,
                    borderColor: '#d32f2f', // Red
                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                    fill: true,
                    tension: 0.1
                }, {
                    label: 'Recovered',
                    data: recoveredData,
                    borderColor: '#388e3c', // Green
                    backgroundColor: 'rgba(56, 142, 60, 0.1)',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#e0e0e0' // Legend text color
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#b0b0b0' // X-axis labels color
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)' // X-axis grid lines color
                        }
                    },
                    y: {
                        ticks: {
                            color: '#b0b0b0' // Y-axis labels color
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)' // Y-axis grid lines color
                        }
                    }
                }
            }
        });
    }

    // Initial data fetch
    fetchGlobalStats();
    fetchHistoricalData();
});