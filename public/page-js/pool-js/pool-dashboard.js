$(document).ready(function () {
    $("#pool_main_menu").addClass("active open menu-item-animating");
    $("#pool_dashboard_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });



});

(function () {
    let borderColor, labelColor, headingColor, legendColor;

    if (isDarkStyle) {
        borderColor = config.colors_dark.borderColor;
        labelColor = config.colors_dark.textMuted;
        headingColor = config.colors_dark.headingColor;
        legendColor = config.colors_dark.bodyColor;
    } else {
        borderColor = config.colors.borderColor;
        labelColor = config.colors.textMuted;
        headingColor = config.colors.headingColor;
        legendColor = config.colors.bodyColor;
    }

    // Chart Colors
    const chartColors = {
        column: {
            series1: '#826af9',
            series2: '#d2b0ff',
            bg: '#f8d3ff'
        },
        donut: {
            series1: '#fee802',
            series2: '#F1F0F2',
            series3: '#826bf8',
            series4: '#3fd0bd'
        },
        area: {
            series1: '#29dac7',
            series2: '#60f2ca',
            series3: '#a5f8cd'
        },
        bar: {
            bg: '#1D9FF2'
        }
    };



    const barChartEl = document.querySelector('#barChart'),
        barChartConfig = {
            chart: {
                height: 400,
                type: 'bar',
                stacked: true,
                parentHeightOffset: 0,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    columnWidth: '15%',
                    colors: {
                        backgroundBarColors: [
                            chartColors.column.bg,
                            chartColors.column.bg,
                            chartColors.column.bg,
                            chartColors.column.bg,
                            chartColors.column.bg
                        ],
                        backgroundBarRadius: 10
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: true,
                position: 'top',
                horizontalAlign: 'start',
                labels: {
                    colors: legendColor,
                    useSeriesColors: false
                }
            },
            colors: [chartColors.column.series1, chartColors.column.series2],
            stroke: {
                show: true,
                colors: ['transparent']
            },
            grid: {
                borderColor: borderColor,
                xaxis: {
                    lines: {
                        show: true
                    }
                }
            },
            series: [
                {
                    name: 'Oral',
                    data: [0, 0, 0, 100, 0, 0, 0, 0, 0, 180]
                },
                {
                    name: 'Professional',
                    data: [85, 0, 0, 0, 0, 0, 0, 0, 0, 20]
                }
            ],
            xaxis: {
                categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    style: {
                        colors: labelColor,
                        fontSize: '13px'
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: labelColor,
                        fontSize: '13px'
                    }
                }
            },
            fill: {
                opacity: 1
            }
        };
    if (typeof barChartEl !== undefined && barChartEl !== null) {
        const barChart = new ApexCharts(barChartEl, barChartConfig);
        barChart.render();
    }

    const horizontalBarChartEl = document.querySelector('#horizontalBarChart'),
        horizontalBarChartConfig = {
            chart: {
                height: 320,
                type: 'bar',
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    barHeight: '70%',
                    distributed: true,
                    startingShape: 'rounded',
                    borderRadius: 7
                }
            },
            grid: {
                strokeDashArray: 10,
                borderColor: borderColor,
                xaxis: {
                    lines: {
                        show: true
                    }
                },
                yaxis: {
                    lines: {
                        show: false
                    }
                },
                padding: {
                    top: -35,
                    bottom: -12
                }
            },
            colors: [
                '#FF0000', // Red for Family medical specialty
                config.colors.primary,
                config.colors.primary,
                config.colors.primary,
                config.colors.primary,
                config.colors.success // for Dental (35)
            ],
            fill: {
                opacity: [1, 1, 1, 1, 1, 1]
            },
            dataLabels: {
                enabled: true,
                style: {
                    colors: ['#fff'],
                    fontWeight: 400,
                    fontSize: '13px',
                    fontFamily: 'Public Sans'
                },
                formatter: function (val, opts) {
                    return horizontalBarChartConfig.labels[opts.dataPointIndex];
                },
                offsetX: 0,
                dropShadow: {
                    enabled: false
                }
            },
            labels: [
                'Family medical specialty',
                'group',
                'group1',
                'group2',
                'dental',
                'group3'
            ],
            series: [
                {
                    data: [35, 0, 0, 0, 12, 0]
                }
            ],
            xaxis: {
                categories: ['1', '2', '3', '4', '5', '6'],
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    style: {
                        colors: labelColor,
                        fontSize: '13px',
                        fontFamily: 'Public Sans'
                    },
                    formatter: function (val) {
                        return `${val}%`;
                    }
                }
            },
            yaxis: {
                max: 35,
                labels: {
                    style: {
                        colors: [labelColor],
                        fontFamily: 'Public Sans',
                        fontSize: '13px'
                    }
                }
            },
            tooltip: {
                enabled: true,
                style: {
                    fontSize: '12px'
                },
                onDatasetHover: {
                    highlightDataSeries: false
                },
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    return '<div class="px-3 py-2">' + '<span>' + series[seriesIndex][dataPointIndex] + '%</span>' + '</div>';
                }
            },
            legend: {
                show: false
            }
        };

    if (typeof horizontalBarChartEl !== 'undefined' && horizontalBarChartEl !== null) {
        const horizontalBarChart = new ApexCharts(horizontalBarChartEl, horizontalBarChartConfig);
        horizontalBarChart.render();
    }

    const shipmentEl = document.querySelector('#shipmentStatisticsChart'),
        shipmentConfig = {
            series: [
                { name: 'Approved', type: 'line', data: [12, 20, 15, 30, 25, 40, 38, 35, 42, 45] },
                { name: 'Rejected', type: 'line', data: [5, 10, 8, 12, 9, 11, 13, 7, 10, 9] },
                { name: 'Partially Approved', type: 'line', data: [3, 6, 30, 5, 7, 9, 8, 6, 7, 5] },
                { name: 'Pended', type: 'line', data: [2, 5, 3, 6, 4, 8, 6, 5, 7, 4] },
                { name: 'Cancelled', type: 'line', data: [1, 3, 2, 4, 2, 40, 4, 3, 2, 3] },
                { name: 'Valid', type: 'line', data: [8, 12, 10, 15, 20, 18, 16, 40, 17, 19] },
                { name: 'Invalid', type: 'line', data: [4, 6, 5, 7, 6, 9, 8, 60, 6, 5] },
                { name: 'No response', type: 'line', data: [12, 20, 35, 40, 25, 20, 38, 35, 42, 45] },
                { name: 'Under processing', type: 'line', data: [6, 9, 8, 10, 9, 12, 11, 10, 9, 11] },
                { name: 'Withdrawn', type: 'line', data: [10, 20, 10, 30, 20, 40, 30, 20, 10, 20] },
                { name: 'Invalid By DHS', type: 'line', data: [11, 11, 21, 11, 2, 3, 2, 20, 11, 1] },
                { name: 'Queued', type: 'line', data: [7, 10, 8, 11, 30, 11, 42, 11, 10, 10] }
            ],
            chart: {
                height: 400,
                type: 'line',
                stacked: false,
                parentHeightOffset: 0,
                toolbar: { show: false },
                zoom: { enabled: false }
            },
            markers: {
                size: 5,
                colors: ['#ffffff'],
                strokeColors: [
                    '#28C76F', // Approved - Green
                    '#EA5455', // Rejected - Red
                    '#1E2EDE', // Partially Approved - Dark Blue
                    '#00CFE8', // Pended - Light Blue
                    '#F072B6', // Cancelled - Rose
                    '#9C27B0', // Valid - Violet
                    '#FFB64D', // Invalid - Orange Yellow
                    '#990000', // No response - Dark Red
                    '#FFB400', // Under processing - Dark Yellow
                    '#007BFF', // Withdrawn - Blue
                    '#795548', // Invalid By DHS - Brown
                    '#FFEB3B'  // Queued - Yellow
                ],
                hover: { size: 6 },
                borderRadius: 4
            },
            stroke: {
                curve: 'smooth',
                width: Array(12).fill(3),
                lineCap: 'round'
            },
            legend: {
                show: true,
                position: 'bottom',
                markers: {
                    width: 8,
                    height: 8,
                    offsetX: -3
                },
                height: 40,
                itemMargin: {
                    horizontal: 10,
                    vertical: 0
                },
                fontSize: '15px',
                fontFamily: 'Public Sans',
                fontWeight: 400,
                labels: {
                    colors: headingColor,
                    useSeriesColors: false
                },
                offsetY: 10
            },
            grid: {
                strokeDashArray: 8,
                borderColor
            },
            colors: [
                '#28C76F', // Approved
                '#EA5455', // Rejected
                '#1E2EDE', // Partially Approved
                '#00CFE8', // Pended
                '#F072B6', // Cancelled
                '#9C27B0', // Valid
                '#FFB64D', // Invalid
                '#990000', // No response
                '#FFB400', // Under processing
                '#007BFF', // Withdrawn
                '#795548', // Invalid By DHS
                '#FFEB3B'  // Queued
            ],
            fill: {
                opacity: Array(12).fill(1)
            },
            xaxis: {
                tickAmount: 10,
                categories: ['1 Jan 2025', '20 Jan 2025', '3 Feb 2025', '14 Feb 2025', '5 Mar 2025', '16 Mar 2025', '27 Mar 2025', '8 Apr 2025', '19 Apr 2025', '28 Apr 2025'],
                labels: {
                    style: {
                        colors: labelColor,
                        fontSize: '13px',
                        fontWeight: 400
                    }
                },
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: {
                tickAmount: 4,
                min: 0,
                max: 100,
                labels: {
                    style: {
                        colors: labelColor,
                        fontSize: '13px',
                        fontFamily: 'Public Sans',
                        fontWeight: 400
                    },
                    formatter: function (val) {
                        return val + '%';
                    }
                }
            },
            responsive: [
                {
                    breakpoint: 1400,
                    options: {
                        chart: { height: 320 },
                        xaxis: { labels: { style: { fontSize: '10px' } } },
                        legend: {
                            itemMargin: {
                                vertical: 0,
                                horizontal: 10
                            },
                            fontSize: '13px',
                            offsetY: 12
                        }
                    }
                },
                {
                    breakpoint: 1025,
                    options: {
                        chart: { height: 415 },
                        plotOptions: { bar: { columnWidth: '50%' } }
                    }
                },
                {
                    breakpoint: 982,
                    options: { plotOptions: { bar: { columnWidth: '30%' } } }
                },
                {
                    breakpoint: 480,
                    options: {
                        chart: { height: 250 },
                        legend: { offsetY: 7 }
                    }
                }
            ]
        };

    if (typeof shipmentEl !== 'undefined' && shipmentEl !== null) {
        const shipment = new ApexCharts(shipmentEl, shipmentConfig);
        shipment.render();
    }

})();