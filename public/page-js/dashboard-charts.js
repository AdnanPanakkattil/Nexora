document.addEventListener('DOMContentLoaded', function () {

    // 0. Synchronized Count-Up & Animated SVG Progress Rings
    function animateCountersAndRings() {
        var duration = 1800; // milliseconds
        var startTimestamp = null;

        var counterElements = document.querySelectorAll('[data-target]');
        var ringElements = document.querySelectorAll('.progress-ring-circle');

        var counters = Array.from(counterElements).map(function (el) {
            return {
                el: el,
                target: parseInt(el.getAttribute('data-target') || '0', 10),
                prefix: el.getAttribute('data-prefix') || '',
                suffix: el.getAttribute('data-suffix') || ''
            };
        });

        var rings = Array.from(ringElements).map(function (el) {
            var percent = parseFloat(el.getAttribute('data-percent') || '0');
            var radius = el.r.baseVal.value;
            var circumference = 2 * Math.PI * radius;
            el.style.strokeDasharray = circumference + ' ' + circumference;
            el.style.strokeDashoffset = circumference;
            return {
                el: el,
                percent: percent,
                circumference: circumference
            };
        });

        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            var progress = Math.min((timestamp - startTimestamp) / duration, 1);
            var easeProgress = 1 - (1 - progress) * (1 - progress);

            // Animate number counters
            counters.forEach(function (c) {
                var current = Math.floor(easeProgress * c.target);
                c.el.textContent = c.prefix + current.toLocaleString() + c.suffix;
            });

            // Animate SVG progress rings
            rings.forEach(function (r) {
                var currentPercent = easeProgress * r.percent;
                var offset = r.circumference - (currentPercent / 100) * r.circumference;
                r.el.style.strokeDashoffset = offset;
            });

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counters.forEach(function (c) {
                    c.el.textContent = c.prefix + c.target.toLocaleString() + c.suffix;
                });
                rings.forEach(function (r) {
                    var finalOffset = r.circumference - (r.percent / 100) * r.circumference;
                    r.el.style.strokeDashoffset = finalOffset;
                });
            }
        }

        window.requestAnimationFrame(step);
    }

    animateCountersAndRings();

    // 1. Sales Summary Bar Chart (matching requested design)
    var salesSummaryOptions = {
        series: [
            {
                name: 'Sales',
                data: [3.4, 5.2, 8.0, 11.1, 7.0, 5.7, 4.3, 3.4, 2.5, 1.5, 1.0, 0.7]
            }
        ],
        chart: {
            height: '100%',   // was: 205
            type: 'bar',
            toolbar: { show: false },
            dropShadow: {
                enabled: true,
                top: 4,
                left: 0,
                blur: 5,
                color: '#ab7df6',
                opacity: 0.3
            }
        },
        colors: ['#ab7df6'],
        plotOptions: {
            bar: {
                borderRadius: 12,
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'last',
                columnWidth: '22%',
                dataLabels: {
                    position: 'top'
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return '$' + val.toFixed(1) + 'k';
            },
            offsetY: -22,
            style: {
                fontSize: '12px',
                fontWeight: '600',
                colors: ['#333333']
            }
        },
        grid: {
            strokeDashArray: 4,
            borderColor: '#f0f0f0',
            yaxis: { lines: { show: true } },
            xaxis: { lines: { show: false } }
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            position: 'top',
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: {
                    colors: '#666666',
                    fontSize: '13px',
                    fontWeight: '500'
                }
            }
        },
        yaxis: {
            min: 0,
            max: 15,
            tickAmount: 3,
            labels: {
                formatter: function (val) {
                    return '$' + val + 'k';
                },
                style: {
                    colors: '#888888',
                    fontSize: '13px'
                }
            }
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function (val) {
                    return '$' + val.toFixed(1) + 'k';
                }
            }
        }
    };

    var chartElement = document.querySelector('#chart');
    if (chartElement) {
        var chart = new ApexCharts(chartElement, salesSummaryOptions);
        chart.render();
    }

    // 2. Smooth Purple Spline Area Chart (Order Status)
    var orderStatusOptions = {
        series: [{
            name: 'Orders',
            data: [30, 38, 48, 52, 40, 30, 35, 55, 75, 82, 55, 20, 35, 48, 50]
        }],
        chart: {
            height: 230,
            type: 'area',
            toolbar: { show: false }
        },
        colors: ['#a47bc8'],
        stroke: {
            curve: 'smooth',
            width: 3
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [0, 90, 100]
            }
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            strokeDashArray: 5,
            borderColor: '#e7e7e7',
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } }
        },
        xaxis: {
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { show: false }
        },
        yaxis: {
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { show: false }
        },
        tooltip: {
            theme: 'light'
        }
    };

    var orderStatusEl = document.querySelector('#orderStatusChart');
    if (orderStatusEl) {
        var orderStatusChart = new ApexCharts(orderStatusEl, orderStatusOptions);
        orderStatusChart.render();
    }

    // 3. Revenue Statistics Dual Spline Line Chart
    var revenueStatsOptions = {
        series: [
            {
                name: 'Total Revenue',
                data: [20, 28, 18, 19, 16, 21, 28, 22, 28, 20, 27]
            },
            {
                name: 'Total Refunds',
                data: [10, 18, 9, 25, 12, 14, 6, 19, 12, 17, 10, 18]
            }
        ],
        chart: {
            height: 350,
            type: 'line',
            toolbar: { show: false },
            dropShadow: {
                enabled: true,
                top: 4,
                left: 0,
                blur: 6,
                opacity: 0.08
            }
        },
        colors: ['#38d39f', '#8c57ff'],
        stroke: {
            curve: 'smooth',
            width: 3
        },
        markers: {
            size: 0,
            hover: { size: 6 }
        },
        grid: {
            strokeDashArray: 4,
            borderColor: '#ebebeb',
            yaxis: { lines: { show: true } },
            xaxis: { lines: { show: false } }
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: {
                    colors: '#888888',
                    fontSize: '13px'
                }
            }
        },
        yaxis: {
            min: 0,
            max: 30,
            tickAmount: 6,
            labels: {
                formatter: function (val) {
                    return val + 'k';
                },
                style: {
                    colors: '#888888',
                    fontSize: '13px'
                }
            }
        },
        legend: { show: false },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function (val) {
                    return val + 'k';
                }
            }
        }
    };

    var revenueStatsEl = document.querySelector('#revenueStatisticsChart');
    if (revenueStatsEl) {
        var revenueStatsChart = new ApexCharts(revenueStatsEl, revenueStatsOptions);
        revenueStatsChart.render();
    }

    // 4. Monthly Earnings Radial Gauge Chart
    var monthlyEarningsOptions = {
        series: [74],
        chart: {
            height: 180,
            type: 'radialBar',
            sparkline: { enabled: true }
        },
        colors: ['#20c997'],
        stroke: {
            dashArray: 3
        },
        plotOptions: {
            radialBar: {
                startAngle: -130,
                endAngle: 130,
                hollow: { size: '65%' },
                track: {
                    background: '#f2f2f5',
                    strokeWidth: '100%'
                },
                dataLabels: {
                    name: { show: false },
                    value: {
                        offsetY: 6,
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#333333',
                        formatter: function (val) {
                            return val + '%';
                        }
                    }
                }
            }
        }
    };

    var monthlyEarningsEl = document.querySelector('#monthlyEarningsChart');
    if (monthlyEarningsEl) {
        var monthlyEarningsChart = new ApexCharts(monthlyEarningsEl, monthlyEarningsOptions);
        monthlyEarningsChart.render();
    }

    // 5. Weekly Orders Mini Bar Chart
    var weeklyOrdersOptions = {
        series: [{
            name: 'Orders',
            data: [35, 55, 25, 60, 40, 48, 65]
        }],
        chart: {
            height: 110,
            type: 'bar',
            sparkline: { enabled: true },
            toolbar: { show: false }
        },
        colors: ['#ffb3b3'],
        plotOptions: {
            bar: {
                borderRadius: 6,
                borderRadiusApplication: 'end',
                columnWidth: '40%',
                distributed: false
            }
        },
        tooltip: {
            theme: 'light'
        }
    };

    var weeklyOrdersEl = document.querySelector('#weeklyOrdersChart');
    if (weeklyOrdersEl) {
        var weeklyOrdersChart = new ApexCharts(weeklyOrdersEl, weeklyOrdersOptions);
        weeklyOrdersChart.render();
    }
});
