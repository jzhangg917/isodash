document.addEventListener('DOMContentLoaded', () => {
    let renewableChartInstance = null;
    let demandChartInstance = null;

    const createChart = (ctx, type, data, options) => {
        if (ctx.chart) {
            ctx.chart.destroy();
        }
        const chart = new Chart(ctx, {
            type: type,
            data: data,
            options: options
        });
        ctx.chart = chart;
        return chart;
    };

    const defaultOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: 'white'
                }
            },
            tooltip: {
                enabled: true,
                titleColor: 'white',
                bodyColor: 'white'
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'white'
                }
            },
            y: {
                ticks: {
                    color: 'white',
                    callback: function(value) {
                        return value === 10000 || value === 12000 || value === 14000 || value === 16000 ? value / 1000 + 'k' : '';
                    },
                    beginAtZero: false,
                    min: 10000,
                    max: 16000
                }
            }
        },
        maintainAspectRatio: true
    };

    async function fetchData() {
        try {
            const response = await fetch('http://nri128:65/snowflake/data/get_fuel_mix.php?ISO=ISNE&start=2024-06-11%2014:00:00&end=2024-06-12%2014:05:00');
            const data = await response.json();
            console.log('Fetched Data:', data);
            processData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function fetchDemandData() {
        try {
            const response = await fetch('http://nri128:65/snowflake/data/get_rt_da_load.php?ISO=ISNE&start=2024-06-11%2000:00:00&end=2024-06-11%2014:05:00');
            const data = await response.json();
            console.log('Fetched Demand Data:', data);
            processDemandData(data);
        } catch (error) {
            console.error('Error fetching demand data:', error);
        }
    }

    function processData(data) {
        const timestamps = [];
        const solarData = [];
        const windData = [];
        const refuseData = [];
        const woodData = [];
        const oilData = [];
        const nuclearData = [];
        const totalGenData = [];
        const naturalGasData = [];
        const landfillGasData = [];
        const hydroData = [];
        const coalData = [];

        data.forEach(item => {
            const time = item.timestamp.split(' ')[1];
            timestamps.push(time);
            console.log('Processing Item:', item.shortname, item.value);
            switch(item.shortname) {
                case 'Actual Solar Gen-NEISO':
                    solarData.push(item.value);
                    break;
                case 'RT Wind (10 Min) Gen - NEISO':
                    windData.push(item.value);
                    break;
                case 'NEISO_REFUSE_GENMW':
                    refuseData.push(item.value);
                    break;
                case 'NEISO_WOOD_GENMW':
                    woodData.push(item.value);
                    break;
                case 'NEISO_OIL_GENMW':
                    oilData.push(item.value);
                    break;
                case 'NEISO_NUCLEAR_GENMW':
                    nuclearData.push(item.value);
                    break;
                case 'NEISO_TOTAL_GENMW':
                    totalGenData.push(item.value);
                    break;
                case 'NEISO_NATURAL_GAS_GENMW':
                    naturalGasData.push(item.value);
                    break;
                case 'NEISO_LANDFILL_GAS_GENMW':
                    landfillGasData.push(item.value);
                    break;
                case 'NEISO_HYDRO_GENMW':
                    hydroData.push(item.value);
                    break;
                case 'NEISO_COAL_GENMW':
                    coalData.push(item.value);
                    break;
            }
        });

        updateRenewableChart(timestamps, solarData, windData, refuseData, woodData, landfillGasData);
    }

    function processDemandData(data) {
        const timestamps = [];
        const rtLoadData = [];
        const daLoadData = [];

        data.forEach(item => {
            const time = item.timestamp.split(' ')[1];
            timestamps.push(time);
            console.log('Processing Item:', item.timestamp, item.rt_load, item.da_load);
            rtLoadData.push(item.rt_load);
            daLoadData.push(item.da_load);
        });

        updateDemandChart(timestamps, rtLoadData, daLoadData);
    }

    function updateRenewableChart(timestamps, solarData, windData, refuseData, woodData, landfillGasData) {
        const renewableCtx = document.getElementById('renewableChart').getContext('2d');

        const resourceOptions = {
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: 'white'
                    }
                },
                tooltip: {
                    enabled: true,
                    titleColor: 'white',
                    bodyColor: 'white'
                }
            },
            maintainAspectRatio: true
        };

        renewableChartInstance = createChart(renewableCtx, 'doughnut', {
            labels: ['Solar', 'Refuse', 'Wood', 'Wind', 'Landfill Gas'],
            datasets: [{
                data: [solarData[solarData.length - 1], refuseData[refuseData.length - 1], woodData[woodData.length - 1], windData[windData.length - 1], landfillGasData[landfillGasData.length - 1]],
                backgroundColor: ['#ffcd56', '#ff9f40', '#ff6384', '#36a2eb', '#9966ff']
            }]
        }, resourceOptions);
    }

    function updateDemandChart(timestamps, rtLoadData, daLoadData) {
        const demandCtx = document.getElementById('demandChart').getContext('2d');

        const demandOptions = {
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: 'white'
                    }
                },
                tooltip: {
                    enabled: true,
                    titleColor: 'white',
                    bodyColor: 'white'
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'white'
                    }
                },
                y: {
                    ticks: {
                        color: 'white',
                        callback: function(value) {
                            if (value === 10000 || value === 12000 || value === 14000 || value === 16000) {
                                return value / 1000 + 'k';
                            }
                            return '';
                        },
                        beginAtZero: false,
                        min: 10000,
                        max: 16000
                    }
                }
            },
            maintainAspectRatio: true
        };

        demandChartInstance = createChart(demandCtx, 'line', {
            labels: timestamps,
            datasets: [{
                label: 'Real-Time Load (MW)',
                data: rtLoadData,
                borderColor: '#36a2eb',
                fill: false
            }, {
                label: 'Day-Ahead Load (MW)',
                data: daLoadData,
                borderColor: '#ffcd56',
                fill: false
            }]
        }, demandOptions);
    }

    function updateSnapshot(totalGenData) {
        document.getElementById('availableCapacity').textContent = `${totalGenData[totalGenData.length - 1]} MW`;
        document.getElementById('forecastedPeakDemand').textContent = '16,000 MW';
        document.getElementById('surplusCapacity').textContent = `${totalGenData[totalGenData.length - 1] - 16000} MW`;
        document.getElementById('yesterdayPeakDemand').textContent = '15,228 MW';
    }

    function updateDateTime() {
        const now = new Date();
        const dateTimeString = now.toLocaleString();
        document.getElementById('currentDateTime').textContent = dateTimeString;
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    fetchData();
    fetchDemandData();
});
