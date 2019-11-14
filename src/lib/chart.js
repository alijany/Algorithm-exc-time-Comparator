import ApexCharts from 'apexcharts';

var chartOptions = {

    chart: {
        height: '95%',
        type: 'line',
        toolbar: {
            show: false
        }
    },
    markers: {
        size: 6,
        hover: {
            size: 8,
            sizeOffset: 3
        }
    },
    stroke: {
        curve: 'smooth'
    },
    series: [],
    xaxis: {
        title: {
            text: 'quantity'
        }
    },
    yaxis: {
        title: {
            text: 'Time (millie second)'
        }
    },
    legend: {
        showForSingleSeries: true,
        onItemHover: {
            highlightDataSeries: false
        },
        position: 'top',
        horizontalAlign: 'right',
    }
};

export var chart = new ApexCharts($('#chart')[0], chartOptions);
chart.render();