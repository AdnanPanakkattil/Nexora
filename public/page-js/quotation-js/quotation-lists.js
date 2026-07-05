$(document).ready(function () {
    $("#quotation_main_menu").addClass("active open menu-item-animating");
    $("#quotation_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

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
            url: BASE_URL + "/quotation/quotation-lists", // URL for the server-side processing
            data: function (d) {
                d.clinicId = $("#clinicId").val();
                d.startDate = $(".start_date").val(); // Hidden input for start date
                d.endDate = $(".end_date").val(); // Hidden input for end date
            },
        },
        columns: [
            { data: "quotationId", name: "quotationId" },
            { data: "quotationNo", name: "quotationNo" },
            // { data: "quotationNo", name: "quotationNo" },
            // {
            //     data: null,
            //     name: "actions",
            //     orderable: false,
            //     searchable: false,
            //     render: function (data, type, full, meta) {
            //         return full.customerType == "b2b" ? "B2B" : "B2C";
            //     },
            // },

            {
                data: 'customerType',
                name: 'customerType',
                render: function (data, type, full, meta) {
                    return data === 'b2b' ? 'B2B' : 'B2C';
                }
            },

            { data: "customerName", name: "customerName" },
            { data: "totalAmount", name: "totalAmount" },
            { data: "vatAmount", name: "vatAmount" },
            { data: "discountAmount", name: "discountAmount" },
            {
                data: "totalAmountAfterDiscount",
                name: "totalAmountAfterDiscount",
            },
            { data: "totalAmountWithVat", name: "totalAmountWithVat" },
            { data: "createdUser", name: "createdUser" },

            { data: "quotationDate", name: "quotationDate" },

            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL + "/quotation/edit-quotation/" + full.quotationId;
                    var detailsUrl =
                        BASE_URL + "/quotation/detail-of-quotation/" + full.quotationId;

                    var deleteUrl =
                        BASE_URL + "/quotation/delete-quotation/" + full.quotationId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="' + editUrl + '" class="dropdown-item edit-quotation">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="' + detailsUrl + '" class="dropdown-item view-quotation-details">Details</a></li>' +  // Added class here
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger quotation-delete" data-id="' + deleteUrl + '">Delete</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item a4-pdf" data-invoice-id="' + full.quotationId + '">A4 Pdf</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item thermal-pdf" data-invoice-id="' + full.quotationId + '">Thermal Pdf</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });



    $(document).on('click', '.view-quotation-details, .edit-quotation', function (e) {
        $('#loader-overlay').show();

    });


    // Delete currency
    $("#invoice_lists_table").on("click", ".quotation-delete", function () {
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
            quotationThermalPrintUrl +
            "?quotationId=" +
            encodeURIComponent(selectedValue);
        window.open(url, "_blank"); // Open URL in a new tab
    });

    $("#invoice_lists_table").on("click", ".a4-pdf", function () {
        var selectedValue = $(this).data("invoice-id");

        const url =
            quotationA4PrintUrl +
            "?quotationId=" +
            encodeURIComponent(selectedValue);
        window.open(url, "_blank"); // Open URL in a new tab
    });

    $("#clinicId").on("change", function () {
        invoiceListsTable.ajax.reload();
    });



});
