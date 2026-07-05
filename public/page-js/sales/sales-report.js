$(document).ready(function () {
    $("#sales_main_menu").addClass("active open menu-item-animating");
    $("#sales_vat_report_sub_menu").addClass("active");

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
            url: BASE_URL + "/sales/vat-report-data",
            data: function (d) {
                d.clinicId = $("#clinicId").val();
                d.value_from_start_date = $(".start_date").val();
                d.value_from_end_date = $(".end_date").val();
            },
        },
        lengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "All"],
        ],
        columns: [
            { data: "date", className: "text-center" },
            { data: "branch", className: "text-center" },
            { data: "type", className: "text-center" },
            {
                data: null,
                name: "actions",
                className: "text-center",
                orderable: false,
                render: function (data, type, full, meta) {
                    var detailsUrl = BASE_URL + "/sales/detail-of-invoice/" + full.invoiceId;
                    return (
                        
                        '<a href="' +
                        detailsUrl +
                        '" target="_blank" class="btn btn-outline-primary waves-effect " style="width:100%;" ><i class="ti ti-report-medical"></i>'+full.invoice_no+'</a>'
                    );
                },
            },
            { data: "standard_rated", className: "text-center" },
            { data: "zero_rated", className: "text-center" },
            { data: "vat_exempt", className: "text-center" },
            // { data: "round_amount", className: "text-center" },
            { data: "discount_amount", className: "text-center" },
            { data: "vat_amount", className: "text-center" },
            { data: "total", className: "text-center" },
        ],
        order: [[0, "desc"]],
        dom: '<"row"<"col-md-2"<"ms-n2"l>><"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-6 mb-md-0 mt-n6 mt-md-0"fB>>>r t <"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        buttons: [
            {
                extend: "excelHtml5",
                title: "Sales VAT Report",
                text: '<i class="fa fa-file-excel-o me-0 me-sm-1 ti-xs"></i> <span class="d-none d-sm-inline-block">Export to Excel</span>',
                className: "btn btn-primary waves-effect waves-light",
                exportOptions: {
                    columns: ":visible",
                },
            },
        ],
    });

    $("#clinicId").on("change", function () {
        salesReportTable.ajax.reload();
    });
});
