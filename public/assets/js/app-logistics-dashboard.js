/**
 *  Logistics Dashboard
 */

'use strict';

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
    donut: {
      series1: config.colors.success,
      series2: '#53D28C',
      series3: '#7EDDA9',
      series4: '#A9E9C5'
    },
    line: {
      series1: config.colors.warning,
      series2: config.colors.primary,
      series3: '#845adf29'
    }
  };

  // Shipment statistics Chart
  // --------------------------------------------------------------------
  const shipmentEl = document.querySelector('#shipmentStatisticsChart'),
    shipmentConfig = {
      series: [
        {
          name: 'Sales',
          type: 'line',
          data: [150, 300, 400, 600, 500, 700, 800, 650, 700, 600, 500, 400]
        },
        {
          name: 'Revenue',
          type: 'line',
          data: [200, 350, 450, 700, 600, 800, 900, 750, 800, 700, 600, 450]
        },
        {
          name: 'Profit',
          type: 'area',
          data: [100, 150, 200, 300, 250, 350, 400, 350, 350, 300, 250, 150]
        }
      ],
      chart: {
        height: 460,
        width: '100%',
        type: 'line',
        stacked: false,
        parentHeightOffset: 0,
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      markers: {
        size: 5,
        colors: [config.colors.white],
        strokeColors: chartColors.line.series2,
        hover: { size: 6 },
        borderRadius: 4
      },
      stroke: {
        curve: 'smooth',
        width: [2, 3, 2],
        lineCap: 'round',
        dashArray: [5, 0, 0]
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
      colors: ['#4099FF', '#845adf', '#00CFE8'],
      fill: {
        opacity: [0, 0, 0.08]
      },
      plotOptions: {
        bar: {
          columnWidth: '30%',
          startingShape: 'rounded',
          endingShape: 'rounded',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return '$' + parseInt(val);
        },
        offsetY: -8,
        style: {
          fontSize: '11px',
          fontWeight: 500
        }
      },
      xaxis: {
        tickAmount: 12,
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
        max: 1000,
        labels: {
          style: {
            colors: labelColor,
            fontSize: '13px',
            fontFamily: 'Public Sans',
            fontWeight: 400
          },
          formatter: function (val) {
            return '$' + val;
          }
        }
      },
      responsive: [
        {
          breakpoint: 1400,
          options: {
            chart: { height: 340 },
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
  if (shipmentEl) {
    const shipment = new ApexCharts(shipmentEl, shipmentConfig);
    shipment.render();
  }

  // Reasons for delivery exceptions Chart
  // --------------------------------------------------------------------
  const deliveryExceptionsChartE1 = document.querySelector('#deliveryExceptionsChart'),
    deliveryExceptionsChartConfig = {
      chart: {
        height: 280,
        parentHeightOffset: 0,
        type: 'donut'
      },
      labels: ['Mobile', 'Desktop', 'Laptop', 'Tablet'],
      series: [1624, 1267, 1153, 679],
      colors: [
        '#845adf',
        '#00CFE8',
        '#FF9F43',
        '#28C76F'
      ],
      stroke: {
        width: 0
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opt) {
          return parseInt(val);
        }
      },
      legend: {
        show: true,
        position: 'bottom',
        offsetY: 10,
        markers: {
          width: 8,
          height: 8,
          offsetX: -3
        },
        itemMargin: {
          horizontal: 15,
          vertical: 5
        },
        fontSize: '13px',
        fontFamily: 'Public Sans',
        fontWeight: 400,
        labels: {
          colors: headingColor,
          useSeriesColors: false
        }
      },
      tooltip: {
        theme: false
      },
      grid: {
        padding: {
          top: 15
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              value: {
                fontSize: '24px',
                fontFamily: 'Public Sans',
                color: headingColor,
                fontWeight: 500,
                offsetY: -20,
                formatter: function (val) {
                  return parseInt(val);
                }
              },
              name: {
                offsetY: 30,
                fontFamily: 'Public Sans'
              },
              total: {
                show: true,
                fontSize: '15px',
                fontFamily: 'Public Sans',
                color: legendColor,
                label: 'Total',
                formatter: function (w) {
                  return '4,145';
                }
              }
            }
          }
        }
      },
      responsive: [
        {
          breakpoint: 420,
          options: {
            chart: {
              height: 260
            }
          }
        }
      ]
    };
  if (deliveryExceptionsChartE1) {
    const deliveryExceptionsChart = new ApexCharts(deliveryExceptionsChartE1, deliveryExceptionsChartConfig);
    deliveryExceptionsChart.render();
  }
})();

// DataTable (jquery)
// --------------------------------------------------------------------
$(function () {
  // Variable declaration for table
  var dt_dashboard_table = $('.dt-route-vehicles');

  // On route vehicles DataTable
  if (dt_dashboard_table.length) {
    var dt_dashboard = dt_dashboard_table.DataTable({
      ajax: assetsPath + 'json/logistics-dashboard.json',
      columns: [
        { data: 'id' },
        { data: 'id' },
        { data: 'location' },
        { data: 'start_city' },
        { data: 'end_city' },
        { data: 'warnings' },
        { data: 'progress' }
      ],
      columnDefs: [
        {
          // For Responsive
          className: 'control',
          orderable: false,
          searchable: false,
          responsivePriority: 2,
          targets: 0,
          render: function (data, type, full, meta) {
            return '';
          }
        },
        {
          // For Checkboxes
          targets: 1,
          orderable: false,
          searchable: false,
          checkboxes: true,
          responsivePriority: 3,
          render: function () {
            return '<input type="checkbox" class="dt-checkboxes form-check-input">';
          },
          checkboxes: {
            selectAllRender: '<input type="checkbox" class="form-check-input">'
          }
        },
        {
          // Icon and location
          targets: 2,
          responsivePriority: 1,
          render: function (data, type, full, meta) {
            var $location = full['location'];
            // Creates full output for row
            var $row_output =
              '<div class="d-flex justify-content-start align-items-center user-name">' +
              '<div class="avatar-wrapper">' +
              '<div class="avatar me-4">' +
              '<span class="avatar-initial rounded-circle bg-label-secondary"><i class="ti ti-car ti-28px"></i></span>' +
              '</div>' +
              '</div>' +
              '<div class="d-flex flex-column">' +
              '<a class="text-heading fw-medium" href="app-logistics-fleet.html">VOL-' +
              $location +
              '</a>' +
              '</div>' +
              '</div>';
            return $row_output;
          }
        },
        {
          // starting route
          targets: 3,
          render: function (data, type, full, meta) {
            var $start_city = full['start_city'],
              $start_country = full['start_country'];
            var $row_output = '<div class="text-body">' + $start_city + ', ' + $start_country + '</div >';
            return $row_output;
          }
        },
        {
          // ending route
          targets: 4,
          render: function (data, type, full, meta) {
            var $end_city = full['end_city'],
              $end_country = full['end_country'];
            var $row_output = '<div class="text-body">' + $end_city + ', ' + $end_country + '</div >';
            return $row_output;
          }
        },
        {
          // warnings
          targets: -2,
          render: function (data, type, full, meta) {
            var $status_number = full['warnings'];
            var $status = {
              1: { title: 'No Warnings', class: 'bg-label-success' },
              2: {
                title: 'Temperature Not Optimal',
                class: 'bg-label-warning'
              },
              3: { title: 'Ecu Not Responding', class: 'bg-label-danger' },
              4: { title: 'Oil Leakage', class: 'bg-label-info' },
              5: { title: 'fuel problems', class: 'bg-label-primary' }
            };
            if (typeof $status[$status_number] === 'undefined') {
              return data;
            }
            return (
              '<span class="badge rounded ' +
              $status[$status_number].class +
              '">' +
              $status[$status_number].title +
              '</span>'
            );
          }
        },
        {
          // progress
          targets: -1,
          render: function (data, type, full, meta) {
            var $progress = full['progress'];
            var $progress_output =
              '<div class="d-flex align-items-center">' +
              '<div div class="progress w-100" style="height: 8px;">' +
              '<div class="progress-bar" role="progressbar" style="width:' +
              $progress +
              '%;" aria-valuenow="' +
              $progress +
              '" aria-valuemin="0" aria-valuemax="100"></div>' +
              '</div>' +
              '<div class="text-body ms-3">' +
              $progress +
              '%</div>' +
              '</div>';
            return $progress_output;
          }
        }
      ],
      order: [2, 'asc'],
      dom: '<"table-responsive"t><"row d-flex align-items-center"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      displayLength: 5,
      language: {
        paginate: {
          next: '<i class="ti ti-chevron-right ti-sm"></i>',
          previous: '<i class="ti ti-chevron-left ti-sm"></i>'
        }
      },
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Details of ' + data['location'];
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                ? '<tr data-dt-row="' +
                col.rowIndex +
                '" data-dt-column="' +
                col.columnIndex +
                '">' +
                '<td>' +
                col.title +
                ':' +
                '</td> ' +
                '<td>' +
                col.data +
                '</td>' +
                '</tr>'
                : '';
            }).join('');

            return data ? $('<table class="table"/><tbody />').append(data) : false;
          }
        }
      }
    });
    $('.dataTables_info').addClass('pt-0');
  }
});
