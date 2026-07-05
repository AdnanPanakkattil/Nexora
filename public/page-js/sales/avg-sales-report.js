$(document).ready(function () {
    $("#sales_main_menu").addClass("active open menu-item-animating");
    $("#avg_sales_report_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var rangePickr = $(".flatpickr-range"),
        dateFormat = "YYYY-MM-DD";

    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");
    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "Y/m/d",
            orientation: isRtl ? "auto right" : "auto left",
            locale: {
                format: dateFormat,
            },

            onClose: function (selectedDates, dateStr, instance) {
                if (selectedDates.length === 0) {
                    startDateEle.val("");
                    endDateEle.val("");
                } else {
                    var startDate = "",
                        endDate = "";
                    if (selectedDates[0] !== undefined) {
                        startDate = moment(selectedDates[0]).format(
                            "YYYY-MM-DD"
                        );
                    }
                    if (selectedDates[1] !== undefined) {
                        endDate = moment(selectedDates[1]).format("YYYY-MM-DD");
                    }
                    startDateEle.val(startDate);
                    endDateEle.val(endDate);
                }

                $(rangePickr).trigger("change").trigger("keyup");
                salesReportTable.ajax.reload();
            },
        });
    }

    var salesReportTable = $("#sales_report_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/sales/avg-sales-data",
            data: function (d) {
                d.value_from_start_date = $(".start_date").val();
                d.value_from_end_date = $(".end_date").val();
            },
        },
        lengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "All"],
        ],
        columns: [
            { data: "itemMasterId", className: "text-center" },
            { data: "invoiceNo", className: "text-center" },
            {
                data: "itemName_en",
                className: "text-center",
            }, 
            {
                data: "itemName_ar",
                className: "text-center",
            },
            {
                data: "quantity",
                className: "text-center",
            },
            {
                data: "sales_amount",
                className: "text-center",
            },
            {
                data: "avg_purchase_per_unit",
                className: "text-center",
            },
            {
                data: "profit",
                className: "text-center",
            },
        ],
        order: [[0, "desc"]],
        footerCallback: function (row, data, start, end, display) {
            var api = this.api();

            var parseVal = (i) =>
                typeof i === "string"
                    ? parseFloat(i.replace(/[\$,]/g, "")) || 0
                    : typeof i === "number"
                    ? i
                    : 0;

            var fields = ["sales_amount", "avg_purchase_per_unit", "profit"];

            fields.forEach(function (field) {
                var colIdx = api.column(`:contains(${field})`).index();
                var colIdx = api
                    .settings()[0]
                    .aoColumns.findIndex((c) => c.data === field);

                if (colIdx >= 0) {
                    var total = api
                        .column(colIdx, { page: "all" })
                        .data()
                        .reduce((a, b) => parseVal(a) + parseVal(b), 0);

                    $(api.column(colIdx).footer()).html(total.toFixed(2));
                }
            });
        },
        dom: '<"row"<"col-md-2"<"ms-n2"l>><"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-6 mb-md-0 mt-n6 mt-md-0"fB>>>r t <"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        buttons: [
            {
                extend: "excelHtml5",
                title: "Avg Sales Report",
                text: '<i class="fa fa-file-excel-o me-0 me-sm-1 ti-xs"></i> <span class="d-none d-sm-inline-block">Export to Excel</span>',
                className: "btn btn-primary waves-effect waves-light",
                exportOptions: {
                    columns: ":visible",
                },
            },
        ],
    });
});
