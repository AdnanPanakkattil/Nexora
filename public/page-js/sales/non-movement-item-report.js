$(document).ready(function () {
    $("#sales_main_menu").addClass("active open menu-item-animating");
    $("#non_movement_item_sub_menu").addClass("active");

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

    var nonMovementItemsReporTable = $("#non_movement_item_report_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/sales/non-movement-item-report",
            data: function (d) {
                // d.value_from_start_date = $(".start_date").val();
                d.monthPeriod = $("#monthPeriod").val();
                d.clinicId = $("#clinicId").val();
                d.purchaseMonthPeriod = $('#purchaseMonthPeriod').val();
            },
        },
        lengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "All"],
        ],
        columns: [
            { data: "itemMasterId", className: "text-center" },
            { data: "itemCode", className: "text-center" },
            {
                data: "itemName_en",
                className: "text-center",
            },
            {
                data: "itemName_ar",
                className: "text-center",
            },
            { data: "sellingPrice", className: "text-center",searchable: true },
            { data: "costPrice", className: "text-center",searchable: true},
            { data: "stock", className: "text-center",searchable: true},
            { data: "lastSalesDate", className: "text-center",searchable: true},
            { data: "lastPurchaseDate", className: "text-center",searchable: true},   
           
            
        ],
        order: [[0, "desc"]],
               
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
                title: "Non Movement Item Report",
                text: '<i class="fa fa-file-excel-o me-0 me-sm-1 ti-xs"></i> <span class="d-none d-sm-inline-block">Export to Excel</span>',
                className: "btn btn-primary waves-effect waves-light",
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8 ],
                },
            },
        ],    
    });

    $("#monthPeriod,#clinicId,#purchaseMonthPeriod")
        .on("change", function () {
            nonMovementItemsReporTable.ajax.reload();
    });
});
