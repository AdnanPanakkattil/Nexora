// Item Brand Form Js And Validation
$(document).ready(function () {
    // Activate the product management menu
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#item_brand_sub_menu").addClass("active");

    // Set up CSRF token for AJAX requests
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    let checkedBrands = [];
    // Initialize DataTable
    var itemBrandTable = $("#item_brand_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/item-brand", 
        columns: [
            {
                data: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_all_brand" value="' + full.brandId + '">';
                },
            },
            {
                data: "brandId",
                name: "brandId"
            },
            {
                data: "brand_code", 
                name: "brand_code"
            },
            {
                data: "brand_name_en", 
                name: "brand_name_en"
            },
            {
                data: "brand_name_ar", 
                name: "brand_name_ar"
            },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl = BASE_URL + "/edit-item-brand/" + full.brandId;
                    var deleteUrl = BASE_URL + "/delete-item-brand/" + full.brandId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="javascript:;" class="dropdown-item item-edit" data-id="' + editUrl + '">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger item-delete" data-id="' + deleteUrl + '">Delete</a></li>' +
                        '</ul>' +
                        '</div>'
                    );
                },
            },
        ],
        drawCallback: function () {
            var rows = itemBrandTable.rows({ page: "current" }).nodes();
            $('input[type="checkbox"]', rows).each(function () {
                if (checkedBrands.includes(this.value)) {
                    $(this).prop("checked", true);
                }
            });
            updateFooter();
        },
    });

    // Handle "Select All" checkbox
    $("#select_all_brand").on("click", function () {
        var rows = itemBrandTable.rows({ page: "current" }).nodes();
        var isChecked = this.checked;

        $('input[type="checkbox"]', rows).each(function () {
            $(this).prop("checked", isChecked);
            var brandId = this.value;

            if (isChecked) {
                if (!checkedBrands.includes(brandId)) {
                    checkedBrands.push(brandId);
                }
            } else {
                checkedBrands = checkedBrands.filter(
                    (id) => id !== brandId
                );
            }
        });

        updateFooter();
    });

    // Handle individual checkbox change
    $("#item_brand_table tbody").on(
        "change",
        'input[type="checkbox"]',
        function () {
            var brandId = this.value;

            if (this.checked) {
                if (!checkedBrands.includes(brandId)) {
                    checkedBrands.push(brandId);
                }
            } else {
                checkedBrands = checkedBrands.filter(
                    (id) => id !== brandId
                );
            }

            // Update "Select All" checkbox state
            var allCheckboxes = $(
                'input[type="checkbox"]',
                itemBrandTable.rows({ page: "current" }).nodes()
            );
            var allChecked =
                allCheckboxes.length ===
                allCheckboxes.filter(":checked").length;

            var selectAllCheckbox = $("#select_all_brand").get(0);
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = allChecked;
                selectAllCheckbox.indeterminate =
                    !allChecked && allCheckboxes.filter(":checked").length > 0;
            }
            updateFooter();
        }
    );

    // Function to update footer content
    function updateFooter() {
        var footer = $(".footer");
        var brandCount = checkedBrands.length;
        if (brandCount > 0) {
            footer.show();
            $(".itemz h4").text(brandCount);
        } else {
            footer.hide();
        }
    }
    $(".footer").hide();

    // Handle delete button click
    $("#deleteSelectedBrands").on("click", function (e) {
        e.preventDefault();

        if (checkedBrands.length === 0) {
            Swal.fire(
                "No brands selected",
                "Please select at least one brand to delete.",
                "warning"
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This action will mark the selected brands as deleted.",
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
                    url: BASE_URL + "/delete-selected-item-brand",
                    method: "POST",
                    data: {
                        _token: $('meta[name="csrf-token"]').attr("content"),
                        itemBrandIds: checkedBrands,
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
                            itemBrandTable.ajax.reload();
                            checkedBrands = [];
                            updateFooter();
                        } else {
                            Swal.fire("Error!", response.message, "error");
                        }
                    },
                    error: function (xhr) {
                        $("#itemBrandModal").modal("hide");

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

    // Open the modal for adding a new brand
    $("#addNewBrandBtn").click(function () {
        $("#itemBrandModal").modal("show");
        $("#common_brand_group_header").text("Add Item Brand");
        $("#item_brand_btn").text("Save");
        $("#item_brand_group_form")[0].reset(); 
        clearErrors(); 
        $("#brand_id").val(''); 
    });

    // Save or update brand with front-end validation
    $("#item_brand_btn").click(function () {
        clearErrors();

        // Gather form data
        var brandId = $("#brand_id").val();
        var brandCode = $("#brand_code").val().trim();
        var brandNameEn = $("#brand_name_en").val().trim();
        var brandNameAr = $("#brand_name_ar").val().trim();

        // Initialize validation
        var errors = {};

        // Validation rules
        if (!brandCode) {
            errors.brand_code = 'Brand Code is required.';
        }

        if (!brandNameEn) {
            errors.brand_name_en = 'Brand Name (English) is required.';
        }

        if (!brandNameAr) {
            errors.brand_name_ar = 'Brand Name (Arabic) is required.';
        }

        // If there are validation errors, display them and prevent form submission
        if (Object.keys(errors).length > 0) {
            displayValidationErrors(errors);
            return; 
        }

        // Prepare AJAX request
        var formData = $("#item_brand_group_form").serialize();
        var ajaxUrl = brandId
            ? BASE_URL + "/update-item-brand/" + brandId
            : BASE_URL + "/item-brand"; 
        var method = brandId ? "PUT" : "POST"; 

           $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                   $("#loader-overlay").hide();
                if (response.status === true) {
                    itemBrandTable.ajax.reload(null, false); 

                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    $("#itemBrandModal").modal("hide"); 
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
                    displayErrors(xhr.responseJSON.errors);
                } else {
                    $("#itemBrandModal").modal("hide");

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

    // Edit brand
    $("#item_brand_table").on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");

          $("#loader-overlay").show();
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                  $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#itemBrandModal").modal("show");
                    $("#common_brand_group_header").text("Update Item Brand");
                    $("#item_brand_btn").text("Update");

                    $("#brand_id").val(response.data.brandId); 
                    $("#brand_code").val(response.data.brand_code);
                    $("#brand_name_en").val(response.data.brand_name_en);
                    $("#brand_name_ar").val(response.data.brand_name_ar);
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

    // Delete brand
    $("#item_brand_table").on("click", ".item-delete", function () {
        var deleteUrl = $(this).data("id");

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true, 
            confirmButtonText: "Delete",
            customClass: {
                confirmButton: 'btn btn-primary waves-effect waves-light',
                cancelButton: 'btn btn-danger waves-effect waves-light'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.isConfirmed) {
                  $("#loader-overlay").show();
                $.ajax({
                    url: deleteUrl,
                    method: "DELETE",
                    success: function (response) {
                          $("#loader-overlay").hide();
                        if (response.status === true) {
                            itemBrandTable.ajax.reload(null, false);
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: { confirmButton: "btn btn-success" },
                            });
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
            }
        });
    });

    // Function to clear backend error messages
function clearErrors() {
    $(".error-text").text("");
    $(".validation-error").remove();
    $(".form-control").removeClass("is-invalid");
}

    // Function to display backend validation errors
    function displayErrors(errors) {
    if (errors.brand_code) {
        $(".brand_code_error").text(errors.brand_code[0]);
    }
    if (errors.brand_name_en) {
        $(".brand_name_en_error").text(errors.brand_name_en[0]);
    }
    if (errors.brand_name_ar) {
        $(".brand_name_ar_error").text(errors.brand_name_ar[0]);
    }
}

    // Function to display front-end validation errors
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
    $("#item_brand_group_form input").on("input", function () {
        $(this).removeClass("is-invalid");
        $(this).next(".invalid-feedback").remove();
        $(this).next(".validation-error").remove();
        var errorClass = $(this).attr("id") + "_error";
        $("." + errorClass).text("");
    });
});

$('#brand_name_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#brand_name_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});
