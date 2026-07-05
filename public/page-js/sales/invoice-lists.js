$(document).ready(function () {
    $("#sales_main_menu").addClass("active open menu-item-animating");
    $("#invoice_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    var selectElement = $('#clinicId');
    var options = selectElement.find('option');

    // Reset any existing selection
    selectElement.val(null);

    if (options.length === 1) {
        // Only one option exists — select it
        selectElement.val(options.first().val()).trigger('change');
    } else {
        // Multiple options — select "All"
        selectElement.val('All').trigger('change');
    }

    var rangePickr = $(".flatpickr-range"),
        dateFormat = "MM/DD/YYYY";

    var startDateEle = $(".start_date"); // Hidden input for start date
    var endDateEle = $(".end_date"); // Hidden input for end date
    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "m/d/Y",
            orientation: isRtl ? "auto right" : "auto left",
            locale: {
                format: dateFormat,
            },

            onClose: function (selectedDates, dateStr, instance) {
                if (selectedDates.length === 0) {
                    // Clear values if no date is selected
                    startDateEle.val("");
                    endDateEle.val("");
                } else {
                    var startDate = "",
                        endDate = "";
                    if (selectedDates[0] !== undefined) {
                        startDate = moment(selectedDates[0]).format(
                            "MM/DD/YYYY"
                        );
                    }
                    if (selectedDates[1] !== undefined) {
                        endDate = moment(selectedDates[1]).format("MM/DD/YYYY");
                    }
                    startDateEle.val(startDate);
                    endDateEle.val(endDate);
                }

                // Trigger change event and reload DataTable
                $(rangePickr).trigger("change").trigger("keyup");
                invoiceListsTable.ajax.reload();
            },
        });
    }

    var invoiceListsTable = $("#invoice_lists_table").DataTable({
    processing: true,
    serverSide: true,
    ajax: {
        url: BASE_URL + "/sales/invoice-lists",
        data: function (d) {
            d.clinicId = $("#clinicId").val();
            d.startDate = $(".start_date").val();
            d.endDate = $(".end_date").val();
            d.payment = $(".payment").val();
        },
    },
    lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
    columns: [
        { data: "invoiceNo", name: "invoiceNo" },
        { data: "clinic", name: "clinic" },
        {
            data: 'customerType',
            name: "customerType",
            orderable: false,
            searchable: true,
            render: function (data, type, full, meta) {
                return full.customerType == "b2b" ? "B2B" : "B2C";
            },
        },
        { data: "customerName", name: "customerName" },
        { data: "totalAmount", name: "totalAmount" },
        { data: "vatAmount", name: "vatAmount" },
        { data: "discountAmount", name: "discountAmount" },
        { data: "totalAmountAfterDiscount", name: "totalAmountAfterDiscount" },
        { data: "totalAmountWithVat", name: "totalAmountWithVat" },
        { data: "cash", name: "cash"},
        { data: "bank", name: "bank" },
        { data: "card", name: "card" },
        { data: "credit", name: "credit"},
        { data: "other", name: "other" },
        { data: "otherType", name: "otherType"},

        { data: "createdUser", name: "createdUser" },
        { data: "invoiceDate", name: "invoiceDate" },
        {
            data: null,
            name: "actions",
            orderable: false,
            searchable: false,
            render: function (data, type, full, meta) {
                var editUrl = BASE_URL + "/sales/edit-invoice/" + full.invoiceId;
                var detailsUrl = BASE_URL + "/sales/detail-of-invoice/" + full.invoiceId;
                var labalingUrl = BASE_URL + "/sales/labaling-of-invoice/" + full.invoiceId;
                var deleteUrl = BASE_URL + "/sales/delete-invoice/" + full.invoiceId;

                return (
                    '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">' +
                            '<i class="ti ti-dots-vertical ti-md"></i>' +
                        '</a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                            '<li><a href="' + editUrl + '" class="dropdown-item">Edit</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="' + detailsUrl + '" class="dropdown-item">Details</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="' + labalingUrl + '" class="dropdown-item">Labeling</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item text-danger item-delete" data-id="' + deleteUrl + '">Delete</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item a4-pdf" data-invoice-id="' + full.invoiceId + '">A4 Pdf</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item thermal-pdf" data-invoice-id="' + full.invoiceId + '">Thermal Pdf</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item dynamic-a4-pdf" data-invoice-id="' + full.invoiceId + '">New A4 Pdf(Test)</a></li>' +
                        '</ul>' +
                    '</div>'
                );
            },
        },
    ],
    dom: '<"row"<"col-md-2"<"ms-n2"l>><"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-6 mb-md-0 mt-n6 mt-md-0"fB>>>r t <"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        buttons: [
            {
                extend: "excelHtml5",
                title: "Sales Report",
                text: '<i class="fa fa-file-excel-o me-0 me-sm-1 ti-xs"></i> <span class="d-none d-sm-inline-block">Export to Excel</span>',
                className: "btn btn-primary waves-effect waves-light",
                exportOptions: {
                    columns: [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
                },
            },
        ],
    footerCallback: function (row, data, start, end, display) {
    var api = this.api();

    var parseValue = function (i) {
        return typeof i === 'string'
            ? parseFloat(i.replace(/[^0-9.-]+/g, '')) || 0
            : typeof i === 'number'
            ? i
            : 0;
    };

    var cashTotal = api.column(9, { search: 'applied' }).data().reduce((a, b) => parseValue(a) + parseValue(b), 0);
    var bankTotal = api.column(10, { search: 'applied' }).data().reduce((a, b) => parseValue(a) + parseValue(b), 0);
    var cardTotal = api.column(11, { search: 'applied' }).data().reduce((a, b) => parseValue(a) + parseValue(b), 0);
    var creditTotal = api.column(12, { search: 'applied' }).data().reduce((a, b) => parseValue(a) + parseValue(b), 0);
    var otherTotal = api.column(13, { search: 'applied' }).data().reduce((a, b) => parseValue(a) + parseValue(b), 0);


    // Remove previous totals row to avoid duplicates
    $(api.table().footer()).find('tr.totals-row').remove();

    // Append totals row to footer
    $(api.table().footer()).append(
        `<tr class="totals-row" style="font-weight:bold; background-color:#f9f9f9;">
            <td  style="text-align:right;">Totals:</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>


            <td>${cashTotal.toFixed(2)}</td>
            <td>${bankTotal.toFixed(2)}</td>
            <td>${cardTotal.toFixed(2)}</td>
            <td>${creditTotal.toFixed(2)}</td>
            <td>${otherTotal.toFixed(2)}</td>
            <td></td>
            <td></td>

            <td></td>
            <td ></td>
        </tr>`
    );
}


});


    // Delete currency
    $("#invoice_lists_table").on("click", ".item-delete", function () {
        var deleteUrl = $(this).data("id");

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
                cancelButton: "btn btn-danger waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.isConfirmed) {
                $.ajax({
                    url: deleteUrl,
                    method: "DELETE",
                    success: function (response) {
                        if (response.status === true) {
                            invoiceListsTable.ajax.reload(null, false);
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton: "btn btn-success",
                                },
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                text: response.message,
                                customClass: {
                                    confirmButton: "btn btn-danger",
                                },
                            });
                        }
                    },
                    error: function (err) {
                        // Extract error message from the response
                        var errorMessage =
                            err.responseJSON && err.responseJSON.message
                                ? err.responseJSON.message
                                : "An unexpected error occurred. Please try again.";
                        // Display the error message in SweetAlert
                        Swal.fire({
                            icon: "error",
                            title: "Access denied",
                            text: errorMessage,
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                        });
                    },
                });
            }
        });
    });

    $("#invoice_lists_table").on("click", ".thermal-pdf", function () {
        var selectedValue = $(this).data("invoice-id");

        const url =
            invoiceThermalPrintUrl +
            "?invoiceId=" +
            encodeURIComponent(selectedValue);
        window.open(url, "_blank"); // Open URL in a new tab
    });

    $("#invoice_lists_table").on("click", ".a4-pdf", function () {
        var selectedValue = $(this).data("invoice-id");

        const url =
            invoiceA4PrintUrl +
            "?invoiceId=" +
            encodeURIComponent(selectedValue);
        window.open(url, "_blank"); // Open URL in a new tab
    });

    $("#clinicId").on("change", function () {
        invoiceListsTable.ajax.reload();
    });
    $("#payment").on("change", function () {
        invoiceListsTable.ajax.reload();
    });
    $("#invoice_lists_table").on("click", ".dynamic-a4-pdf", function () {
    var selectedValue = $(this).data("invoice-id");

    const url =
        BASE_URL + "/sales/invoice-mpdf?invoiceId=" + encodeURIComponent(selectedValue);

    window.open(url, "_blank");
    });
});
