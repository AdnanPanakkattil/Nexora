$(document).ready(function () {
    $("#product_management_main_menu").addClass(
        "active open menu-item-animating"
    );
    $("#stock_management_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    let now = new Date();
    $(".stockDateAndTime ").flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        defaultDate: now,
    });

    var inventorySheetTable = $("#inventory_sheet_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/stock-management-lists", // URL for the server-side processing
            data: function (d) {
                d.branchId = $("#branchId").val(); // send selected branch
            },
        },
        //     ajax: {
        //     url: BASE_URL + "/stock-management-lists",
        //     data: function (d) {
        //         d.branchId = $("#branchId").val(); // send selected branch
        //     },
        // },
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        columns: [
    { data: "stockManagementId", name: "stockManagementId" },
    { data: "stockNumber", name: "stockNumber" },
    { data: "branch", name: "branch" },
    { data: "stockDateAndTime", name: "stockDateAndTime" },
    {
        data: null,
        name: "actions",
        orderable: false,
        searchable: false,
        render: function (data, type, full, meta) {
            if (full.stockEffectType === 'real_time_stock_effect') {
                return 'Real Time Stock Effect';
            } else if (full.stockEffectType === 'after_save_stock_effect') {
                return 'After Save Stock Effect';
            } else {
                return '-';
            }


        },
    },

    { data: "status", name: "status" },
    {
        data: null,
        name: "actions",
        orderable: false,
        searchable: false,
        render: function (data, type, full, meta) {
            var editUrl = BASE_URL + "/edit-stock-management/" + full.stockManagementId;
            var detailsUrl = BASE_URL + "/detail-of-stock-management/" + full.stockManagementId;
            var deleteUrl = BASE_URL + "/delete-stock-management/" + full.stockManagementId;

            var actionMenu =
                '<div class="d-inline-block">' +
                '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                '<ul class="dropdown-menu dropdown-menu-end m-0">';

            // Check status safely
            var status = (full.status || "").toLowerCase();

            if (status === "draft") {
                actionMenu +=
                    '<li><a href="' +
                    editUrl +
                    '" class="dropdown-item edit-stock-management">Edit</a></li>' +
                    '<div class="dropdown-divider"></div>';
            }

            actionMenu +=
                '<li><a href="' +
                detailsUrl +
                '" class="dropdown-item" data-id="' +
                detailsUrl +
                '">Details</a></li>' +
                '<div class="dropdown-divider"></div>' +
                '<li><a href="javascript:;" class="dropdown-item text-danger delete-stock-management" data-id="' +
                deleteUrl +
                '">Delete</a></li>' +
                "</ul>" +
                "</div>";

            return actionMenu;
        },
    },
],
    });

    $("#branchId").on("change", function () {
        inventorySheetTable.ajax.reload();
    });

    inventorySheetTable.on("click", ".edit-stock-management", function () {
        var editUrl = $(this).data("id");
         $("#loader-overlay").show();
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                 $("#loader-overlay").hide();
                if (response.status === true) {
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                    $("#edit_stock_management_id").val(
                        response.data.stockManagementId
                    );
                    $("#selectBranch")
                        .val(response.data.branchId)
                        .trigger("change");
                    let dateTime = response.data.stockDateAndTime;
                    let formattedDateTime = dateTime
                        ? dateTime.slice(0, 16)
                        : "";
                    $(".stockDateAndTime").val(formattedDateTime);
                    $("#notes").val(response.data.notes);
                    $("#addItemStockModal").modal("show");
                    $("#systemStock").val(response.data.items.systemStock);
                    $("#actualStock").val(response.data.items.actualStock);
                    $("#stockDifference").val(
                        response.data.items.stockDifference
                    );
                    initializeProductSearchSelect2();
                }
            },
            error: function (err) {
                 $("#loader-overlay").hide();
                console.error("Error fetching edit data:", err.message);
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
    });

    inventorySheetTable.on("click", ".delete-stock-management", function () {
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
                 $("#loader-overlay").show();
                $.ajax({
                    url: deleteUrl,
                    method: "DELETE",
                    success: function (response) {
                         $("#loader-overlay").hide();
                        if (response.status === true) {
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
                         $("#loader-overlay").hide();
                        console.error("Error fetching edit data:", err.message);
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
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Deleting item.",
                    icon: "error",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });

    $("#selectItem").on("select2:select", function (e) {
        console.log(e.params.data);

        var stockText = e.params.data.itemStock; // "- stock(0)"
        var stockMatch = stockText.match(/\((\d+)\)/);

        if (stockMatch) {
            var stockValue = stockMatch[1]; // "0"
            console.log("Stock:", stockValue);
            $("#systemStock").val(stockValue);
        }
    });

    $("#addItemStockModal").on("hidden.bs.modal", function () {
        $("#deviceRegisterForm")[0].reset(); // Clear form inputs
        $("#selectItem").val(null).trigger("change"); // Reset select2
    });
});

$(document).on("input", "#actualStock", function () {
    let systemStock = parseFloat($("#systemStock").val()) || 0;
    let actualStock = parseFloat($(this).val()) || 0;
    let difference = systemStock - actualStock;

    $("#stockDifference").val(difference);
});

$(document).on("click", "#add_item_to_stock_btn", function (e) {
    var stockFormData = $("#stock_form").serialize();
    var actualStockFormData = $("#actual_stock_form").serialize();
    var combinedData = stockFormData + "&" + actualStockFormData;
    $.ajax({
        url: BASE_URL + "/stock-management",
        type: "POST",
        data: combinedData,
        success: function (response) {
            if (response.status === true) {
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
            } else {
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
        error: function (xhr, status, error) {
            if (xhr.status === 422) {
                var errors = xhr.responseJSON.errors;
                $(".error-text").text("");
                $.each(errors, function (key, value) {
                    $("." + key + "_error").text(value[0]);
                });
            } else {
                console.error("Error:", xhr);
            }
        },
    });
});

$(document).on("click", "#add_branch_for_stock_management_btn", function (e) {
    e.preventDefault(); // prevent default form submission

    var stockBranchFormData = $("#stock_branch_form").serialize();

     $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/stock-management-add-branch",
        type: "POST",
        data: stockBranchFormData,
        success: function (response) {
             $("#loader-overlay").hide();
            console.log(response);
            Swal.fire({
                icon: "success",
                text: response.message,
                confirmButtonText: "Add the Items", // 👈 change button text
                customClass: {
                    confirmButton: "btn btn-success waves-effect waves-light",
                },
            }).then(function (result) {
                if (result.isConfirmed) {
                    // 👇 Redirect to the required page using created ID
                    window.location.href =
                        BASE_URL +
                        "/stock-management/" +
                        response.data.stockManagementId;
                }
            });
        },
        error: function (xhr, status, error) {
             $("#loader-overlay").hide();
            if (xhr.status === 422) {
                var errors = xhr.responseJSON.errors;
                $(".error-text").text("");
                $.each(errors, function (key, value) {
                    $("." + key + "_error").text(value[0]);
                });
            } else {
                console.error("Error:", xhr);
            }
        },
    });
});
