document.addEventListener('DOMContentLoaded', () => {
    const resourceCtx = document.getElementById('resourceChart').getContext('2d');
    const renewableCtx = document.getElementById('renewableChart').getContext('2d');
    const demandCtx = document.getElementById('demandChart').getContext('2d');

    new Chart(resourceCtx, {
        type: 'doughnut',
        data: {
            labels: ['Natural Gas', 'Nuclear', 'Renewables', 'Hydro', 'Other'],
            datasets: [{
                data: [59, 27, 10, 4, 1],
                backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56', '#4bc0c0', '#9966ff']
            }]
        }
    });

    new Chart(renewableCtx, {
        type: 'doughnut',
        data: {
            labels: ['Solar', 'Refuse', 'Wood', 'Wind', 'Landfill Gas'],
            datasets: [{
                data: [56, 24, 15, 2, 2],
                backgroundColor: ['#ffcd56', '#ff9f40', '#ff6384', '#36a2eb', '#9966ff']
            }]
        }
    });

    new Chart(demandCtx, {
        type: 'line',
        data: {
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
        }
    });
});
