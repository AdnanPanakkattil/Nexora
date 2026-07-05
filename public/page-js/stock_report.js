var selectedUnitIdValues = [];
$(document).ready(function () {
    $("#product_management_main_menu").addClass(
        "active open menu-item-animating",
    );
    $("#stock_report_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var rangePickr = $(".flatpickr-range"),
        dateFormat = "MM/DD/YYYY";

    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");
    var dateErrorEle = $(".date_error");

    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "m/d/Y",
            maxDate: "today",
            onClose: function (selectedDates) {
                var startDate = selectedDates[0]
                    ? moment(selectedDates[0]).format("YYYY-MM-DD")
                    : null;
                var endDate = selectedDates[1]
                    ? moment(selectedDates[1]).format("YYYY-MM-DD")
                    : null;
                $(".start_date").val(startDate);
                $(".end_date").val(endDate);
                if (startDate && endDate) {
                    var startMoment = moment(startDate);
                    var endMoment = moment(endDate);
                    var daysDifference = endMoment.diff(startMoment, "days");
                    if (daysDifference > 100) {
                        dateErrorEle.text(
                            "Date range shouldn’t exceed 100 days",
                        );
                    } else {
                        dateErrorEle.text("");
                    }
                }
                stockReportTable.ajax.reload();
            },
        });
    }

    $("#dateFilterType")
        .on("change", function () {
            let type = $(this).val();
            if (type === "between") {
                $("#dateFilterDiv").show();
                $("#lssthan_or_grtrthan_div").hide();
            } else if (type === "greaterthan") {
                $("#lssthan_or_grtrthan_div").show();
                $("#dateFilterDiv").hide();
            } else if (type === "lessthan") {
                $("#dateFilterDiv").hide();
                $("#lssthan_or_grtrthan_div").show();
            } else {
                $("#dateFilterDiv").hide();
                $("#lssthan_or_grtrthan_div").hide();
            }
        })
        .trigger("change"); // trigger to apply on page load

    $("#lssthan_or_grtrthan_date").flatpickr({
        dateFormat: "Y-m-d",
        maxDate: "today",
        onClose: function () {
            stockReportTable.ajax.reload();
        },
    });
    var stockReportTable = $("#stock_report_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/stock-report", // URL for the server-side processing
            data: function (d) {
                d.clinicId = $("#clinicId").val();
                d.stockWithOrWithoutBatchNo = $(
                    "#stock_with_or_without_batch_no",
                ).val();
                d.startDate = $("#startDate").val();
                d.endDate = $("#endDate").val();
                d.lssthanOrGrtrthanDate = $("#lssthan_or_grtrthan_date").val();
                d.dateFilterType = $("#dateFilterType").val();
            },
        },
        lengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "All"],
        ],
        columns: [
            {
                data: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_all_stock_report" value="' +
                        full.itemMasterId +
                        '">'
                    );
                },
            },
            { data: "itemMasterId", name: "itemMasterId" },
            { data: "itemCode", name: "itemCode" },
            { data: "itemName_en", name: "itemName_en" },
            { data: "category_name_en", name: "category_name_en" },
            { data: "costPrice", name: "costPrice" },
            { data: "unitNameEn", name: "unitNameEn" },
            { data: "branchName", name: "branchName" },
            { data: "stock", name: "stock" },
            {
                data: "action",
                name: "action",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<div class="d-flex align-items-center">' +
                        '<a href="' +
                        BASE_URL +
                        "/stock-inventory/" +
                        full.itemMasterId +
                        '" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill item-delete"><i class="ti ti-eye ti-md"></i></a>' +
                        "</div>"
                    );
                },
            },
        ],
        dom:
            '<"row"' +
            '<"col-md-2"<"ms-n2"l>>' +
            '<"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-6 mb-md-0 mt-n6 mt-md-0"fB>>' +
            ">rt" +
            '<"row"' +
            '<"col-sm-12 col-md-6"i>' +
            '<"col-sm-12 col-md-6"p>' +
            ">",
        buttons: [
            {
                extend: "excelHtml5",
                title: "Stock Report",
                text: '<i class="fa fa-file-excel-o me-0 me-sm-1 ti-xs"></i> <span class="d-none d-sm-inline-block">Export to Excel</span>',
                className: "btn btn-primary waves-effect waves-light",
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8],
                },
            },
        ],
    });

    $("#clinicId, #stock_with_or_without_batch_no, #dateFilterType").on(
        "change",
        function () {
            stockReportTable.ajax.reload();
        },
    );

    // $("#clinicId").on("change", function () {
    //     stockReportTable.ajax.reload();
    // });

    // $("#stock_report_search_btn").on("click", function () {
    //     stockReportTable.ajax.reload();
    // });
    // $("#stock_report_search_btn").on("click", function () {
    //     // Optional: Validate date range before reload
    //     var start = $("#startDate").val();
    //     var end = $("#endDate").val();
    //     var dateErrorEle = $(".date_error");

    //     if (start && end) {
    //         var startMoment = moment(start);
    //         var endMoment = moment(end);
    //         var diffDays = endMoment.diff(startMoment, "days");

    //         if (diffDays > 100) {
    //             dateErrorEle.text("Date range shouldn’t exceed 100 days");
    //             return; // Stop reloading
    //         } else {
    //             dateErrorEle.text("");
    //         }
    //     }

    //     stockReportTable.ajax.reload();
    // });

    // $("#stock_with_or_without_batch_no").on("change", function () {
    //     stockReportTable.ajax.reload();
    // });
});
