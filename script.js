document.addEventListener('DOMContentLoaded', () => {
    let renewableCtx;
    let resourcesCtx;
    let demandCtx;

    let renewableChartInstance = null;
    let resourcesChartInstance = null;
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

    const getCurrentDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async function fetchData() {
        try {

            const currentDateFuel = getCurrentDateString();
            const startTimeFuel = `${currentDateFuel}%2000:00:00`
            const endTimeFuel = `${currentDateFuel}%2023:05:00` 
            const urlFuel = `http://nri128:65/snowflake/data/get_fuel_mix.php?ISO=ISNE&start=${(startTimeFuel)}&end=${(endTimeFuel)}`

            const fuelResponse = await fetch(urlFuel);
            const fuelData = await fuelResponse.json();
            console.log('Fetched Fuel Data:', fuelData);  // Log fetched fuel data to console
            processFuelData(fuelData);

            const currentDate = getCurrentDateString();
            const startTime = `${currentDate}%2000:00:00`
            const endTime = `${currentDate}%2023:05:00`
            const url = `http://nri128:65/snowflake/data/get_rt_da_load.php?ISO=ISNE&start=${(startTime)}&end=${(endTime)}`;

            const demandResponse = await fetch(url);
            const demandData = await demandResponse.json();
            console.log('Fetched Demand Data:', demandData);  // Log fetched demand data to console
            processDemandData(demandData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function processFuelData(data) {
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

        updateRenewableChart(timestamps, solarData, windData, refuseData, woodData, landfillGasData);
        updateResourcesChart(timestamps, naturalGasData, nuclearData, oilData, coalData, hydroData)
    }

    function processDemandData(data) {
        const timestamps = [];
        const rtLoadData = [];
        const daLoadData = [];

        data.forEach(item => {
            const time = item.timestamp.split(' ')[1];
            timestamps.push(time);
            console.log('Processing Item:', item.rt_load, item.da_load);  // Log each item to console
            rtLoadData.push(item.rt_load);
            daLoadData.push(item.da_load);
        });

        updateDemandChart(timestamps, rtLoadData, daLoadData);
    }

 function updateResourcesChart(timestamps, naturalGasData, nuclearData, oilData, coalData, hydroData) {
    resourcesCtx = document.getElementById('resourcesChart').getContext('2d');

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
            },
        },
        maintainAspectRatio: true // Ensure aspect ratio is maintained
    };

    resourcesChartInstance = createChart(resourcesCtx, 'doughnut', {
        labels: ['Natural Gas', 'Nuclear', 'Oil', 'Coal', 'Hydro'],
        datasets: [{
            data: [naturalGasData[naturalGasData.length - 1], nuclearData[nuclearData.length - 1], oilData[oilData.length - 1], coalData[coalData.length - 1], hydroData[hydroData.length - 1]],
            backgroundColor: ['#86E8FF', '#FFA239', '#62777F', '#20303B', '#30AEEB'],
            borderColor: '#374151'
        }]
    }, resourceOptions);
}

 function updateRenewableChart(timestamps, solarData, windData, refuseData, woodData, landfillGasData) {
    renewableCtx = document.getElementById('renewableChart').getContext('2d');

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
            },
        },
        maintainAspectRatio: true // Ensure aspect ratio is maintained
    };

    renewableChartInstance = createChart(renewableCtx, 'doughnut', {
        labels: ['Solar', 'Refuse', 'Wood', 'Wind', 'Landfill Gas'],
        datasets: [{
            data: [solarData[solarData.length - 1], refuseData[refuseData.length - 1], woodData[woodData.length - 1], windData[windData.length - 1], landfillGasData[landfillGasData.length - 1]],
            backgroundColor: ['#FFD248', '#9D6E4F', '#D87B47', '#9E6EBA', '#59ECB0'],
            borderColor: '#374151'
        }]
    }, resourceOptions);
}


    function updateDemandChart(timestamps, rtLoadData, daLoadData) {
        demandCtx = document.getElementById('demandChart').getContext('2d');

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
                        stepSize: 2000,
                        beginAtZero: true, // Ensure y-axis starts at zero
                        max: 16000, // Set a reasonable max value
                    }
                }
            },
            maintainAspectRatio: true // Ensure aspect ratio is maintained
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
        }, defaultOptions);
    }

    function updateSnapshot(totalGenData) {
        document.getElementById('availableCapacity').textContent = `${totalGenData[totalGenData.length - 1]} MW`;
        document.getElementById('forecastedPeakDemand').textContent = '16,000 MW'; // Replace with actual data if available
        document.getElementById('surplusCapacity').textContent = `${totalGenData[totalGenData.length - 1] - 16000} MW`; // Replace with actual data if available
        document.getElementById('yesterdayPeakDemand').textContent = '15,228 MW'; // Replace with actual data if available
    }

    // Function to update date and time
    function updateDateTime() {
        const now = new Date();
        const dateTimeString = now.toLocaleString();
        document.getElementById('currentDateTime').textContent = dateTimeString;
    }

    // Initial call to update date and time
    updateDateTime();

    // Set interval to update date and time every second (1000 milliseconds)
    setInterval(updateDateTime, 1000);

    // Fetch and process data and update every 15 minutes
    fetchData();
    setInterval(fetchData, 900000);
});
