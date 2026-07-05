$(document).ready(function () {
    // Activate the menu
    $("#zatca_main_menu").addClass("active open menu-item-animating");
    $("#dashboard_sub_menu").addClass("active");

     const isRtl = document.documentElement.getAttribute('dir') === 'rtl';  

    // Fetch data via AJAX
    function fetchStatusCounts() {
        $.ajax({
            url: "/zatca/dashboard/status-counts", // Ensure this route matches your Laravel route
            method: "GET",
            success: function (data) {
                updateDonutChart(data);
            },
            error: function (xhr, status, error) {
                console.error("Error fetching status counts:", error);
            },
        });
    }

    // Update Donut Chart
    function updateDonutChart(data) {
        let seriesData = [data.completed, data.pending, data.failed];

          if (isRtl) {
            seriesData = [...seriesData].reverse();
        }

        donutChart.updateOptions({
            series: seriesData,
        });
    }

    // Initialize the Donut Chart
    const donutChartEl = document.querySelector("#documentChart");

       let donutLabels = ["Completed", "Pending", "Failed"];
       let donutColors = ["#28a745", "#ffbb33", "#dc3545"];

     if (isRtl) {
        donutLabels = [...donutLabels].reverse();
        donutColors = [...donutColors].reverse();
    }
    const donutChartConfig = {
        chart: {
            height: 390,
            type: "donut",
        },
       labels: donutLabels, 
        series: [0, 0, 0],
        colors: donutColors,
        dataLabels: {
            enabled: true,
        },
        legend: {
            position: "bottom",
        },
        responsive: [
            {
                breakpoint: 768,
                options: {
                    chart: {
                        height: 320,
                    },
                },
            },
        ],
    };

    const donutChart = new ApexCharts(donutChartEl, donutChartConfig);
    donutChart.render();

    fetchChartData();
    setInterval(fetchChartData, 60000);
    fetchStatusCounts();
    setInterval(fetchStatusCounts, 60000);



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

    const chartColors = {
        donut: {
            series1: config.colors.success,
            series2: "#53D28C",
            series3: "#7EDDA9",
            series4: "#A9E9C5",
        },
        line: {
            series1: config.colors.warning,
            series2: config.colors.primary,
            series2: config.colors.danger,
            series3: "#7367f029",
        },
    };

    function fetchChartData() {
        $.ajax({
            url: "/zatca/dashboard/chart-data",
            method: "GET",
            success: function (data) {
                updateChartData(data);
            },
            error: function (xhr, status, error) {
                console.error("Error fetching chart data:", error);
            },
        });
    }

    // update chart dynamically
    function updateChartData(data) {
        console.log(data);
         let categories = data.categories;
         let b2b = data.b2b;
         let b2c = data.b2c;

            if (isRtl) {
                categories = [...categories].reverse();
                b2b = [...b2b].reverse();
                b2c = [...b2c].reverse();
            }
        shipment.updateOptions({
            series: [
                { name: "B2B", type: "line", data: b2b },
                { name: "B2C", type: "line", data: b2c },
            ],
            xaxis: {
                categories: categories,
            },
    });
    }

    const shipmentEl = document.querySelector("#shipmentChart");

    let shipment;

    const shipmentConfig = {
        series: [
            {
                name: "B2B",
                type: "line",
                data: [],
            },
            {
                name: "B2C",
                type: "line",
                data: [],
            },
        ],
        chart: {
            height: 320,
            type: "line",
            stacked: false,
            parentHeightOffset: 0,
            toolbar: { show: false },
            zoom: { enabled: false },
            rtl: isRtl, 
        },
        markers: {
            size: 5,
            colors: [config.colors.white],
            strokeColors: [chartColors.line.series2, config.colors.success],
            hover: { size: 6 },
            borderRadius: 4,
        },
        stroke: {
            curve: "smooth",
            width: [3, 3],
            lineCap: "round",
        },
        legend: {
            show: true,
            position: "bottom",
            markers: { width: 8, height: 8, offsetX: -3 },
            height: 40,
            itemMargin: { horizontal: 10, vertical: 0 },
            fontSize: "15px",
            fontFamily: "Public Sans",
            fontWeight: 400,
            labels: { colors: headingColor, useSeriesColors: false },
            offsetY: 10,
        },
        grid: {
            strokeDashArray: 8,
            borderColor,
        },
        colors: [chartColors.line.series2, config.colors.success],
        fill: { opacity: [1, 1] },
        xaxis: {
            categories: [],
            labels: {
                style: {
                    colors: labelColor,
                    fontSize: "13px",
                    fontWeight: 400,
                },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            tickAmount: 4,
            min: 0,
            max: 100,
            opposite: isRtl,
            labels: {
                style: {
                    colors: labelColor,
                    fontSize: "13px",
                    fontFamily: "Public Sans",
                    fontWeight: 400,
                },
                formatter: function (val) {
                    return val + "%";
                },
            },
        },
    };

    // initialize chart
    if (shipmentEl) {
        shipment = new ApexCharts(shipmentEl, shipmentConfig);
        shipment.render();
    }

    let seriesData = [0, 0, 0];
    let deliveryLabels = ["Accepted", "With Warnings", "Rejected"];
    let deliveryColors = [
        chartColors.donut.series1,
        chartColors.donut.series2,
        chartColors.donut.series3,
    ];

    if (isRtl) {
        seriesData = [...seriesData].reverse();
        deliveryLabels = [...deliveryLabels].reverse();
        deliveryColors = [...deliveryColors].reverse();
    }
    let chartSeries = seriesData.map((val) => (val === 0 ? 0.0001 : val));

    const deliveryExceptionsChartE1 = document.querySelector(
        "#deliveryExceptionsChart"
    );
    const deliveryExceptionsChartConfig = {
        chart: {
            height: 420,
            parentHeightOffset: 0,
            type: "donut",
        },
        labels: deliveryLabels,
        series: chartSeries,
        colors: deliveryColors,
        stroke: { width: 0 },
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
                // show 0 if it was a placeholder
                const realVal = seriesData[opts.seriesIndex]; 
                return realVal === 0 ? "" : parseInt(val) + "%";
            },
        },
        legend: {
            show: true,
            position: "bottom",
            offsetY: 10,
            markers: { width: 8, height: 8, offsetX: -3 },
            itemMargin: { horizontal: 15, vertical: 5 },
            fontSize: "13px",
            fontFamily: "Public Sans",
            fontWeight: 400,
            labels: {
                colors: headingColor,
                useSeriesColors: false,
            },
        },
        tooltip: {
            theme: false,
            y: {
                formatter: function (val, opts) {
                    return seriesData[opts.seriesIndex]; // show original value (0 instead of 0.0001)
                },
            },
        },
        grid: {
            padding: { top: 15 },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "77%",
                    labels: {
                        show: true,
                        value: {
                            fontSize: "24px",
                            fontFamily: "Public Sans",
                            color: headingColor,
                            fontWeight: 500,
                            offsetY: -20,
                            formatter: function (val, opts) {
                                const realVal = seriesData[opts.seriesIndex];
                                return realVal === 0
                                    ? "0%"
                                    : parseInt(val) + "%";
                            },
                        },
                        name: {
                            offsetY: 30,
                            fontFamily: "Public Sans",
                        },
                        total: {
                            show: true,
                            fontSize: "15px",
                            fontFamily: "Public Sans",
                            color: legendColor,
                            label: "Total",
                            formatter: function () {
                                // sum of real values (so 0 shows properly)
                                return seriesData.reduce((a, b) => a + b, 0);
                            },
                        },
                    },
                },
            },
        },
    };
    if (
        typeof deliveryExceptionsChartE1 !== undefined &&
        deliveryExceptionsChartE1 !== null
    ) {
        const deliveryExceptionsChart = new ApexCharts(
            deliveryExceptionsChartE1,
            deliveryExceptionsChartConfig
        );
        deliveryExceptionsChart.render();
    }
});
