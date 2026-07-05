$(document).ready(function () {
    $("#sales_main_menu").addClass("active open menu-item-animating");
    $("#delivery_notes_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    


    var deliveryNoteListsTable = $("#delivery_note_lists_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/sales/delivery-note-lists",
        columns: [
            { data: "deliveryNoteId", name: "deliveryNoteId" },
            { data: "delNoteNo", name: "delNoteNo" },

            


            // { data: "vendor_name_en", name: "vendor_name_en" },
            { data: "customerName", name: "customerName" },
            { data: "deliveryNoteDate", name: "deliveryNoteDate" },
            { data: "netAmount", name: "netAmount" },
            // { data: "deliveryNoteDate", name: "deliveryNoteDate" },
            // { data: "deliveryNoteDate", name: "deliveryNoteDate" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl = BASE_URL + "/sales/edit-delivery-note/" + full.deliveryNoteId;
                    var detailsUrl = BASE_URL + "/sales/detail-of-delivery-note/" + full.deliveryNoteId;

                    var deleteUrl = BASE_URL + "/sales/delete-delivery-note/" + full.deliveryNoteId;
                    return ('<div class="d-inline-block">' +
                                '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>'+
                                '<ul class="dropdown-menu dropdown-menu-end m-0">'+
                                    '<li><a href="' + editUrl + '" class="dropdown-item" data-id="' + editUrl + '">Edit</a></li>'+
                                    '<div class="dropdown-divider"></div>'+
                                    '<li><a href="' + detailsUrl + '" class="dropdown-item" data-id="' + detailsUrl + '">Details</a></li>'+
                                    '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger delete-delivery-note" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                                '</ul>'+
                            '</div>'
                    );
                },
            },
        ],
    });


    $("#delivery_note_lists_table").on("click", ".delete-delivery-note", function () {
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
                            deliveryNoteListsTable.ajax.reload(null, false);
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
});

   