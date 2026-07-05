$(document).ready(function () {
    $("#sales_main_menu").addClass("active open menu-item-animating");
    $("#sales_tax_invoice_return_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var invoiceReturnListsTable = $(
        "#sales_tax_invoice_return_lists_table"
    ).DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/sales/sales-tax-invoice-return-lists",
        columns: [
            { data: "salesReturnId", name: "salesReturnId" },
            { data: "salesReturnNo", name: "salesReturnNo" },
            { data: "returnDate", name: "returnDate" },
            { data: "invoiceNo", name: "invoiceNo" },
            // { data: "vendor_name_en", name: "vendor_name_en" },
            { data: "customerName", name: "customerName" },
            { data: "invoiceDate", name: "invoiceDate" },
            {
                data: "returnTotalAmountWithVat",
                name: "returnTotalAmountWithVat",
            },
            { data: "createdUser", name: "createdUser" },
            { data: "updatedUser", name: "updatedUser" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL +
                        "/sales/edit-sales-tax-invoice-return/" +
                        full.salesReturnId;
                    var detailsUrl =
                        BASE_URL +
                        "/sales/detail-of-sales-tax-invoice-return/" +
                        full.salesReturnId;

                    var deleteUrl =
                        BASE_URL +
                        "/sales/delete-sales-tax-invoice-return/" +
                        full.salesReturnId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="' +
                        editUrl +
                        '" class="dropdown-item" data-id="' +
                        editUrl +
                        '">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="' +
                        detailsUrl +
                        '" class="dropdown-item" data-id="' +
                        detailsUrl +
                        '">Details</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger delete-sales-tax-invoice-return" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item a4-pdf" data-invoice-id="' + full.salesReturnId + '">A4 Pdf</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item thermal-pdf" data-invoice-id="' + full.salesReturnId + '">Thermal Pdf</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    $("#sales_tax_invoice_return_lists_table").on(
        "click",
        ".delete-sales-tax-invoice-return",
        function () {
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
                                invoiceReturnListsTable.ajax.reload(
                                    null,
                                    false
                                );
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
        }
    );


    $("#sales_tax_invoice_return_lists_table").on("click", ".thermal-pdf", function () {
        var selectedValue = $(this).data("invoice-id");

        const url =
            salesTaxInvoiceReturnThermalPrintUrl +
            "?salesTaxInvoiceReturnId=" +
            encodeURIComponent(selectedValue);
        window.open(url, "_blank"); // Open URL in a new tab
    });

    $("#sales_tax_invoice_return_lists_table").on("click", ".a4-pdf", function () {
        var selectedValue = $(this).data("invoice-id");

        const url =
            salesTaxInvoiceReturnA4PrintUrl +
            "?salesTaxInvoiceReturnId=" +
            encodeURIComponent(selectedValue);
        window.open(url, "_blank"); // Open URL in a new tab
    });
});
