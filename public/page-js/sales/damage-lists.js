$(document).ready(function () {
    $("#sales_main_menu").addClass("active open menu-item-animating");
    $("#damage_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    var selectElement = $("#clinicId");
    var options = selectElement.find("option");

    // Reset any existing selection
    selectElement.val(null);

    if (options.length === 1) {
        // Only one option exists — select it
        selectElement.val(options.first().val()).trigger("change");
    } else {
        // Multiple options — select "All"
        selectElement.val("All").trigger("change");
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
                            "MM/DD/YYYY",
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
            url: BASE_URL + "/sales/damage-lists",
            data: function (d) {
                d.clinicId = $("#clinicId").val();
                d.startDate = $("#startDate").val();
                d.endDate = $("#endDate").val();
                d.payment = $(".payment").val();
            },
        },
        lengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "All"],
        ],
        columns: [
            { data: "damageNumber", name: "damageNumber" },
            { data: "branch", name: "branch" },
            { data: "damageReason", name: "damageReason" },
            { data: "invoiceDate", name: "invoiceDate" },
            { data: "createdUser", name: "createdUser" },
            { data: "updatedUser", name: "updatedUser" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    console.log(full);
                    var editUrl =
                        BASE_URL + "/sales/edit-damage/" + full.damageId;
                    var detailsUrl =
                        BASE_URL + "/sales/detail-of-damage/" + full.damageId;
                    // var labalingUrl = BASE_URL + "/sales/labaling-of-damage/" + full.damageId;
                    var deleteUrl =
                        BASE_URL + "/sales/delete-damage/" + full.damageId;

                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">' +
                        '<i class="ti ti-dots-vertical ti-md"></i>' +
                        "</a>" +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="' +
                        editUrl +
                        '" class="dropdown-item">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="' +
                        detailsUrl +
                        '" class="dropdown-item">Details</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        // '<li><a href="' + labalingUrl + '" class="dropdown-item">Labeling</a></li>' +
                        // '<div class="dropdown-divider"></div>' +

                        '<li><a href="javascript:;" class="dropdown-item a4-pdf" data-invoice-id="' +
                        full.damageId +
                        '">A4 Pdf</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item thermal-pdf" data-invoice-id="' +
                        full.damageId +
                        '">Thermal Pdf</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger item-delete" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
        dom: '<"row"<"col-md-2"<"ms-n2"l>><"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-6 mb-md-0 mt-n6 mt-md-0"fB>>>r t <"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        buttons: [
            {
                extend: "excelHtml5",
                title: "Damage List",
                text: '<i class="fa fa-file-excel-o me-0 me-sm-1 ti-xs"></i> <span class="d-none d-sm-inline-block">Export to Excel</span>',
                className: "btn btn-primary waves-effect waves-light",
                exportOptions: {
                    columns: ":not(:last-child)",
                },
            },
        ],
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

    $("#clinicId").on("change", function () {
        invoiceListsTable.ajax.reload();
    });

    flatpickr(".flatpickr-range", {
        mode: "range",
        dateFormat: "Y-m-d",
        onChange: function (selectedDates) {
            if (selectedDates.length === 2) {
                $("#startDate").val(
                    flatpickr.formatDate(selectedDates[0], "Y-m-d"),
                );
                $("#endDate").val(
                    flatpickr.formatDate(selectedDates[1], "Y-m-d"),
                );
                invoiceListsTable.ajax.reload();
            } else if (selectedDates.length === 0) {
                $("#startDate").val("");
                $("#endDate").val("");
                invoiceListsTable.ajax.reload();
            }
        },
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

    // $("#clinicId").on("change", function () {
    //     invoiceListsTable.ajax.reload();
    // });
    $("#payment").on("change", function () {
        invoiceListsTable.ajax.reload();
    });
});
