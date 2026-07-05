$(document).ready(function () {
    $("#sales_main_menu").addClass("active open menu-item-animating");
    $("#invoice_credit_note_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var invoiceCreditNoteListsTable = $(
        "#invoice_credit_note_lists_table"
    ).DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/sales/invoice-credit-note-lists",
        columns: [
            { data: "invoiceCreditNoteId", name: "invoiceCreditNoteId" },
            { data: "invoiceCreditNoteNo", name: "invoiceCreditNoteNo" },

            { data: "invoiceNo", name: "invoiceNo" },
            // { data: "vendor_name_en", name: "vendor_name_en" },
            { data: "customerName", name: "customerName" },
            { data: "invoiceCreditNoteDate", name: "invoiceCreditNoteDate" },
            { data: "totalAmountWithVat", name: "totalAmountWithVat" },
            // { data: "deliveryNoteDate", name: "deliveryNoteDate" },
            // { data: "deliveryNoteDate", name: "deliveryNoteDate" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL +
                        "/sales/edit-invoice-credit-note/" +
                        full.invoiceCreditNoteId;
                    var detailsUrl =
                        BASE_URL +
                        "/sales/detail-of-invoice-credit-note/" +
                        full.invoiceCreditNoteId;

                    var deleteUrl =
                        BASE_URL +
                        "/sales/delete-invoice-credit-note/" +
                        full.invoiceCreditNoteId;
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
                        '<li><a href="javascript:;" class="dropdown-item text-danger delete-invoice-credit-note" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    $("#invoice_credit_note_lists_table").on(
        "click",
        ".delete-invoice-credit-note",
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
                                invoiceCreditNoteListsTable.ajax.reload(
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
});
