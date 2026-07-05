// Item Vendor Form JS and Validation
$(document).ready(function () {
    // Activate the product management menu
    $("#product_management_main_menu").addClass(
        "active open menu-item-animating",
    );
    $("#item_vendor_sub_menu").addClass("active");

    // Set up CSRF token for AJAX requests
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    flatpickr("#vendor_register_date", {
        dateFormat: "Y-m-d",
        maxDate: "today",
    });

    let checkedVendors = [];
    // Initialize DataTable
    var itemVendorTable = $("#item_vendor_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/item-vendor",
        columns: [
            {
                data: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select__all_vendor" value="' +
                        full.vendorId +
                        '">'
                    );
                },
            },
            { data: "vendorId", name: "vendorId" },
            { data: "vendor_code", name: "vendor_code" },
            { data: "vendor_name_en", name: "vendor_name_en" },
            { data: "vendor_name_ar", name: "vendor_name_ar" },
            { data: "vendor_register_date", name: "vendor_register_date" },
            { data: "vendor_phone", name: "vendor_phone" },
            { data: "vendor_mobile", name: "vendor_mobile" },
            { data: "vendor_vat", name: "vendor_vat" },
            { data: "vendor_address", name: "vendor_address" },
            { data: "vendor_other_details", name: "vendor_other_details" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL + "/edit-item-vendor/" + full.vendorId;
                    var deleteUrl =
                        BASE_URL + "/delete-item-vendor/" + full.vendorId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="javascript:;" class="dropdown-item item-edit" data-id="' +
                        editUrl +
                        '">Edit</a></li>' +
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
        drawCallback: function () {
            var rows = itemVendorTable.rows({ page: "current" }).nodes();
            $('input[type="checkbox"]', rows).each(function () {
                if (checkedVendors.includes(this.value)) {
                    $(this).prop("checked", true);
                }
            });
            updateFooter();
        },
    });

    // Handle "Select All" checkbox
    $("#select_all_vendor").on("click", function () {
        var rows = itemVendorTable.rows({ page: "current" }).nodes();
        var isChecked = this.checked;

        $('input[type="checkbox"]', rows).each(function () {
            $(this).prop("checked", isChecked);
            var vendorId = this.value;

            if (isChecked) {
                if (!checkedVendors.includes(vendorId)) {
                    checkedVendors.push(vendorId);
                }
            } else {
                checkedVendors = checkedVendors.filter((id) => id !== vendorId);
            }
        });

        updateFooter();
    });

    // Handle individual checkbox change
    $("#item_vendor_table tbody").on(
        "change",
        'input[type="checkbox"]',
        function () {
            var vendorId = this.value;

            if (this.checked) {
                if (!checkedVendors.includes(vendorId)) {
                    checkedVendors.push(vendorId);
                }
            } else {
                checkedVendors = checkedVendors.filter((id) => id !== vendorId);
            }

            // Update "Select All" checkbox state
            var allCheckboxes = $(
                'input[type="checkbox"]',
                itemVendorTable.rows({ page: "current" }).nodes(),
            );
            var allChecked =
                allCheckboxes.length ===
                allCheckboxes.filter(":checked").length;

            var selectAllCheckbox = $("#select_all_vendor").get(0);
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = allChecked;
                selectAllCheckbox.indeterminate =
                    !allChecked && allCheckboxes.filter(":checked").length > 0;
            }
            updateFooter();
        },
    );

    // Function to update footer content
    function updateFooter() {
        var footer = $(".footer");
        var vendorCount = checkedVendors.length;
        if (vendorCount > 0) {
            footer.show();
            $(".itemz h4").text(vendorCount);
        } else {
            footer.hide();
        }
    }
    $(".footer").hide();

    // Handle delete button click
    $("#deleteSelectedVendors").on("click", function (e) {
        e.preventDefault();

        if (checkedVendors.length === 0) {
            Swal.fire(
                "No vendors selected",
                "Please select at least one vendor to delete.",
                "warning",
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This action will mark the selected vendors as deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
                cancelButton: "btn btn-danger waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: BASE_URL + "/delete-selected-item-vendor",
                    method: "POST",
                    data: {
                        _token: $('meta[name="csrf-token"]').attr("content"),
                        itemVendorIds: checkedVendors,
                    },
                    success: function (response) {
                        if (response.success) {
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton: "btn btn-success",
                                },
                            });
                            itemVendorTable.ajax.reload();
                            checkedVendors = [];
                            updateFooter();
                        } else {
                            Swal.fire("Error!", response.message, "error");
                        }
                    },
                    error: function (xhr) {
                        $("#itemVendorModal").modal("hide");

                        // Extract error message from the response
                        var errorMessage =
                            xhr.responseJSON && xhr.responseJSON.message
                                ? xhr.responseJSON.message
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

    // Open the modal for adding a new vendor
    $("#addNewVendorBtn").click(function () {
        $("#itemVendorModal").modal("show");
        $("#common_vendor_group_header").text("Add Item Vendor");
        $("#item_vendor_btn").text("Save");
        $("#item_vendor_group_form")[0].reset();
        clearErrors();
        $("#vendor_id").val("");
    });

    // Save or update vendor with front-end validation
    $("#item_vendor_btn").click(function () {
        clearErrors();

        // Gather form data
        var vendorId = $("#vendor_id").val();
        var vendorCode = $("#vendor_code").val().trim();
        var vendorNameEn = $("#vendor_name_en").val().trim();
        var vendorNameAr = $("#vendor_name_ar").val().trim();
        var vendorRegisterDate = $("#vendor_register_date").val().trim();
        var vendorPhone = $("#vendor_phone").val().trim();
        var vendorMobile = $("#vendor_mobile").val().trim();
        var vendorVat = $("#vendor_vat").val().trim();
        var vendorAddress = $("#vendor_address").val().trim();
        var vendorOtherDetails = $("#vendor_other_details").val().trim();

        var withAverageReport = $("#withAverageReport").is(":checked") ? 1 : 0;

        var formData =
            $("#item_vendor_group_form").serialize() +
            "&withAverageReport=" +
            withAverageReport;

        // Initialize validation
        var errors = {};

        // Validation rules
        if (!vendorCode) {
            errors.vendor_code = "Vendor Code is required.";
        }

        if (!vendorNameEn) {
            errors.vendor_name_en = "Vendor Name (English) is required.";
        }

        if (!vendorNameAr) {
            errors.vendor_name_ar = "Vendor Name (Arabic) is required.";
        }

        if (!vendorRegisterDate) {
            errors.vendor_register_date = "Vendor Register Date is required.";
        }

        if (!vendorPhone) {
            errors.vendor_phone = "Vendor Phone is required.";
        }

        if (!vendorMobile) {
            errors.vendor_mobile = "Vendor Mobile is required.";
        }

        if (!vendorVat) {
            errors.vendor_vat = "Vendor VAT Number is required.";
        }

        if (!vendorAddress) {
            errors.vendor_address = "Vendor Address is required.";
        }

        if (!vendorOtherDetails) {
            errors.vendor_other_details = "Vendor Other Details are required.";
        }

        // If there are validation errors, display them and prevent form submission
        if (Object.keys(errors).length > 0) {
            displayValidationErrors(errors);
            return;
        }

        // Prepare AJAX request
        var formData = $("#item_vendor_group_form").serialize();
        var ajaxUrl = vendorId
            ? BASE_URL + "/update-item-vendor/" + vendorId
            : BASE_URL + "/item-vendor";
        var method = vendorId ? "PUT" : "POST";

          $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                   $("#loader-overlay").hide();
                if (response.status === true) {
                    itemVendorTable.ajax.reload(null, false);

                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    $("#itemVendorModal").modal("hide");
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            },
            error: function (xhr) {
                   $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    displayBackendValidationErrors(xhr.responseJSON.errors);
                } else {
                    $("#itemVendorModal").modal("hide");

                    // Extract error message from the response
                    var errorMessage =
                        xhr.responseJSON && xhr.responseJSON.message
                            ? xhr.responseJSON.message
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
                }
            },
        });
    });

    // Edit vendor
    $("#item_vendor_table").on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");

           $("#loader-overlay").show();
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                   $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#itemVendorModal").modal("show");
                    $("#common_vendor_group_header").text("Update Item Vendor");
                    $("#item_vendor_btn").text("Update");

                    // Populate form with response data
                    $("#vendor_id").val(response.data.vendorId);
                    $("#vendor_code").val(response.data.vendor_code);
                    $("#vendor_name_en").val(response.data.vendor_name_en);
                    $("#vendor_name_ar").val(response.data.vendor_name_ar);
                    $("#vendor_register_date").val(
                        response.data.vendor_register_date,
                    );
                    $("#vendor_phone").val(response.data.vendor_phone);
                    $("#vendor_mobile").val(response.data.vendor_mobile);
                    $("#vendor_vat").val(response.data.vendor_vat);
                    $("#vendor_address").val(response.data.vendor_address);
                    $("#vendor_other_details").val(
                        response.data.vendor_other_details,
                    );
                    clearErrors();
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            },
            error: function (err) {
                   $("#loader-overlay").hide();
                $("#itemBrandModal").modal("hide");

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

    // Delete vendor
    $("#item_vendor_table").on("click", ".item-delete", function () {
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
                   $("#loader-overlay").show();
                $.ajax({
                    url: deleteUrl,
                    method: "DELETE",
                    success: function (response) {
                           $("#loader-overlay").hide();
                        if (response.status === true) {
                            itemVendorTable.ajax.reload(null, false);
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
                           $("#loader-overlay").hide();
                        $("#itemVendorModal").modal("hide");

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

    // Function to clear all validation error messages and styles
    function clearErrors() {
    $(".invalid-feedback").remove();
    $(".validation-error").remove();
    $(".is-invalid").removeClass("is-invalid");
}

    // Function to display backend validation errors using invalid-feedback
   function displayBackendValidationErrors(errors) {
    for (let field in errors) {
        if (errors.hasOwnProperty(field)) {
            let errorMessage = errors[field][0];
            let inputField = $("#" + field);

            inputField.next(".validation-error").remove();

            let errorDiv = $("<div>")
                .addClass("validation-error text-danger")
                .text(errorMessage);
            inputField.after(errorDiv);
        }
    }
}

    // Function to display front-end validation errors using invalid-feedback
 function displayValidationErrors(errors) {
    for (let field in errors) {
        if (errors.hasOwnProperty(field)) {
            let errorMessage = errors[field];
            let inputField = $("#" + field);

            inputField.next(".validation-error").remove();

            let errorDiv = $("<div>")
                .addClass("validation-error text-danger")
                .text(errorMessage);
            inputField.after(errorDiv);
        }
    }
}

    // Remove Validation Error After Entering The Input Values
    $("#item_vendor_group_form input, #item_vendor_group_form textarea").on(
        "input",
        function () {
            $(this).removeClass("is-invalid");
            $(this).next(".validation-error").remove();
        },
    );
});

$('#vendor_name_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#vendor_name_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});

