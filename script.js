document.addEventListener('DOMContentLoaded', () => {
    const resourceCtx = document.getElementById('resourceChart').getContext('2d');
    const renewableCtx = document.getElementById('renewableChart').getContext('2d');
    const demandCtx = document.getElementById('demandChart').getContext('2d');

    // Function to create high-resolution charts with customized options
    const createChart = (ctx, type, data, options) => {
        const dpi = window.devicePixelRatio || 1;
        ctx.canvas.width = ctx.canvas.clientWidth * dpi;
        ctx.canvas.height = ctx.canvas.clientHeight * dpi;
        ctx.scale(dpi, dpi);
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
                    color: 'white' // Change legend text color to white
                }
            },
            tooltip: {
                enabled: true,
                titleColor: 'white',
                bodyColor: 'white'
            }
        }
    };

    const defaultOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: 'white' // Change legend text color to white
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
                    color: 'white' // Change x-axis tick color to white
                }
            },
            y: {
                ticks: {
                    color: 'white' // Change y-axis tick color to white
                }
            }
        }
    };

    const resourceChart = createChart(resourceCtx, 'doughnut', {
        labels: ['Natural Gas', 'Nuclear', 'Renewables', 'Hydro', 'Other'],
        datasets: [{
            data: [59, 27, 10, 4, 1],
            backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56', '#4bc0c0', '#9966ff']
        }]
    }, resourceOptions);

    const renewableChart = createChart(renewableCtx, 'doughnut', {
        labels: ['Solar', 'Refuse', 'Wood', 'Wind', 'Landfill Gas'],
        datasets: [{
            data: [56, 24, 15, 2, 2],
            backgroundColor: ['#ffcd56', '#ff9f40', '#ff6384', '#36a2eb', '#9966ff']
        }]
    }, resourceOptions);

    const demandChart = createChart(demandCtx, 'line', {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [{
            label: 'Forecasted (MW)',
            data: [12460, 12500, 13000, 14000, 13500, 12500],
            borderColor: '#36a2eb',
            fill: false
        }, {
            label: 'Actual (MW)',
            data: [11981, 12000, 12800, 13800, 13200, 12000],
            borderColor: '#ffcd56',
            fill: false
        }]
    }, defaultOptions);

    document.querySelectorAll('.time-button').forEach(button => {
        button.addEventListener('click', (event) => {
            document.querySelectorAll('.time-button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            // Update the charts and data here based on the selected time frame
        });
    });
});
