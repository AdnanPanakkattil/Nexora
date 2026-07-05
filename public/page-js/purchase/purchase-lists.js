$(document).ready(function () {
    $("#purchase_main_menu").addClass("active open menu-item-animating");
    $("#purchase_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var purchaseItemTable = $("#purchase_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/purchase/purchase-lists",
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        columns: [
            // {
            //     data: "checkbox",
            //     name: "checkbox",
            //     orderable: false,
            //     searchable: false,
            //     render: function (data, type, full, meta) {
            //         return (
            //             '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_service" value="' +
            //             full.purchase_order_id +
            //             '">'
            //         );
            //     },
            // },
            { data: "purchase_item_bill_id", name: "purchase_item_bill_id" },
            { data: "invoice_no", name: "invoice_no" },
            { data: "purchaserefNo", name: "purchaserefNo" },

            // { data: "vendor_name_en", name: "vendor_name_en" },
            { data: "vendor_name_en", name: "vendor_name_en" },
            { data: "invoiceDate", name: "invoiceDate" },
            // { data: "currency_name_en", name: "currency_name_en" },
            // { data: "currency_exrate", name: "currency_exrate" },
            {data: "totalVat", name:"totalVat"},
            {data: "totalDiscountAmount", name:"totalDiscountAmount"},
            {data: "totalWithVat", name: "totalWithVat"},
            { data: "createdUser", name: "createdUser" },
            { data: "updatedUser", name: "updatedUser" },

            { data: "identifiedName_en", name: "identifiedName_en" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL +
                        "/purchase/edit-purchase/" +
                        full.purchase_item_bill_id;
                    var detailsUrl =
                        BASE_URL +
                        "/purchase/detail-of-purchase/" +
                        full.purchase_item_bill_id;

                    var deleteUrl =
                        BASE_URL +
                        "/purchase/delete-purchase/" +
                        full.purchase_item_bill_id;
                    var printUrlAction = printUrl + "?purchaseItemBillId=" + full.purchase_item_bill_id;
                    var thermalPrintUrlAction = thermalPrintUrl + "?purchaseItemBillId=" + full.purchase_item_bill_id;
                    var newA4TestAction = newA4TestUrl + "?purchaseItemBillId=" + full.purchase_item_bill_id;
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
                        '<li><a href="' +
                        printUrlAction +
                        '" target="_blank" class="dropdown-item" data-id="' +
                        printUrlAction +
                        '">Print</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="' +
                        thermalPrintUrlAction +
                        '" target="_blank" class="dropdown-item" data-id="' +
                        thermalPrintUrlAction +
                        '">Thermal Print</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="' +
                        newA4TestAction +
                        '" target="_blank" class="dropdown-item">New A4 PDF (Test)</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger delete-purchase" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    purchaseItemTable.on("click", ".delete-purchase", function () {
        var deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this service?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes!",
            customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton:
                    "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: deleteUrl,
                    method: "DELETE",
                    success: function (response) {
                        if (response.status === true) {
                            purchaseItemTable.ajax.reload(null, false);
                            
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton:
                                        "btn btn-success waves-effect waves-light",
                                },
                            }).then(function () {
                                location.reload();
                            });
                        }
                    },
                    error: function (err) {
                        console.error("Error fetching edit data:", err);
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Please verify the service common group.",
                    icon: "error",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });
});
