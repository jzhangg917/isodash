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
                    beginAtZero: true, // Ensure y-axis starts at zero
                    max: 15000, // Set a reasonable max value
                }
            }
        },
        maintainAspectRatio: true // Ensure aspect ratio is maintained
    };

    const fetchData = async () => {
        try {
            const response = await fetch('http://nri128:65/snowflake/data/get_fuel_mix.php?ISO=ISNE&start=2024-06-11%2014:00:00&end=2024-06-12%2014:05:00');
            const data = await response.json();
            console.log('Fetched Data:', data);  // Log fetched data to console
            processData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const processData = (data) => {
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
            console.log('Processing Item:', item.shortname, item.value);  // Log each item to console
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

        updateCharts(timestamps, solarData, windData, refuseData, woodData, landfillGasData);
    };

    const updateCharts = (timestamps, solarData, windData, refuseData, woodData, landfillGasData) => {
        const renewableCtx = document.getElementById('renewableChart').getContext('2d');
        const demandCtx = document.getElementById('demandChart').getContext('2d');

        renewableChartInstance = createChart(renewableCtx, 'doughnut', {
            labels: ['Solar', 'Refuse', 'Wood', 'Wind', 'Landfill Gas'],
            datasets: [{
                data: [solarData[solarData.length - 1], refuseData[refuseData.length - 1], woodData[woodData.length - 1], windData[windData.length - 1], landfillGasData[landfillGasData.length - 1]],
                backgroundColor: ['#ffcd56', '#ff9f40', '#ff6384', '#36a2eb', '#9966ff']
            }]
        }, defaultOptions);

        fetchLoadData().then(loadData => {
            demandChartInstance = createChart(demandCtx, 'line', {
                labels: timestamps,
                datasets: [{
                    label: 'Real-Time Load (MW)',
                    data: loadData.rtLoadData,
                    borderColor: '#36a2eb',
                    fill: false
                }, {
                    label: 'Day-Ahead Load (MW)',
                    data: loadData.daLoadData,
                    borderColor: '#ffcd56',
                    fill: false
                }]
            }, defaultOptions);
        });
    };

    const fetchLoadData = async () => {
        try {
            const response = await fetch('http://nri128:65/snowflake/data/get_rt_da_load.php?ISO=ISNE&start=2024-06-11%2000:00:00&end=2024-06-11%2014:05:00');
            const data = await response.json();
            console.log('Fetched Load Data:', data);  // Log fetched load data to console
            return processLoadData(data);
        } catch (error) {
            console.error('Error fetching load data:', error);
            return { rtLoadData: [], daLoadData: [] };
        }
    };

    const processLoadData = (data) => {
        const timestamps = [];
        const rtLoadData = [];
        const daLoadData = [];

        data.forEach(item => {
            const time = item.timestamp.split(' ')[1];
            timestamps.push(time);
            rtLoadData.push(item.rt_load);
            daLoadData.push(item.da_load);
        });

        return { rtLoadData, daLoadData };
    };

    fetchData();
});
