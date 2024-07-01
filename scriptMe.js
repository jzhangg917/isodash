document.addEventListener('DOMContentLoaded', () => {
    const resourceCtx = document.getElementById('resourceChart').getContext('2d');
    const renewableCtx = document.getElementById('renewableChart').getContext('2d');
    const demandCtx = document.getElementById('demandChart').getContext('2d');

    const createChart = (ctx, type, data, options) => {
        return new Chart(ctx, {
            type: type,
            data: data,
            options: options
        });
    };

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
                    color: 'white',
                }
            },
            y: {
                ticks: {
                    color: 'white',
                    stepSize: 2000,
                    beginAtZero: true
                }
            }
        },
        maintainAspectRatio: true
    };

    const resourceChart = createChart(resourceCtx, 'doughnut', {
        labels: ['Natural Gas', 'Nuclear', 'Renewables', 'Coal', 'Oil'],
        datasets: [{
            data: [59, 27, 10, 4, 1],
            backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56', '#4bc0c0', '#9966ff']
        }]
    }, resourceOptions);

    const renewableChart = createChart(renewableCtx, 'doughnut', {
        labels: ['Solar', 'Refuse', 'Wood', 'Wind', 'Landfill Gas', 'Hydro'],
        datasets: [{
            data: [56, 24, 15, 2, 2, 12],
            backgroundColor: ['#ffcd56', '#ff9f40', '#ff6384', '#36a2eb', '#9966ff', '#4bc0c0']
        }]
    }, resourceOptions);

    const demandChart = createChart(demandCtx, 'line', {
        labels: [],
        datasets: [{
            label: 'Forecasted (MW)',
            data: [],
            borderColor: '#36a2eb',
            fill: false
        }, {
            label: 'Actual (MW)',
            data: [],
            borderColor: '#ffcd56',
            fill: false
        }]
    }, defaultOptions);


    const getCurrentDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchLiveData = async () => {
        try {
            const currentDate = getCurrentDateString();
            const startTime = `${currentDate}%2000:00:00`;
            const endTime = `${currentDate}%2023:05:00`
            const url = `http://nri128:65/snowflake/data/get_rt_da_load.php?ISO=ISNE&start=${(startTime)}&end=${(endTime)}`;

            const response = await fetch(url);
            const data = await response.json();
            const labels = data.map(item => moment(item.timestamp).format('HH:mm'));
            const forecasted = data.map(item => parseFloat(item.da_load));
            const actual = data.map(item => parseFloat(item.rt_load));

            demandChart.data.labels = labels;
            demandChart.data.datasets[0].data = forecasted;
            demandChart.data.datasets[1].data = actual;
            demandChart.update();
        } catch (error) {
            console.error('Error fetching live data:', error);
        }
    };

    fetchLiveData();
    setInterval(fetchLiveData, 60000); // Fetch new data every minute

    document.querySelectorAll('.time-button').forEach(button => {
        button.addEventListener('click', (event) => {
            document.querySelectorAll('.time-button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            // Update the charts and data here based on the selected time frame
        });
    });
});
