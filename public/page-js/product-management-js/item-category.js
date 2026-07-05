// Item Category Form Js And Validation
$(document).ready(function () {
    // Activate the product management menu
    $("#product_management_main_menu").addClass(
        "active open menu-item-animating"
    );
    $("#item_category_sub_menu").addClass("active");

    // Set up CSRF token for AJAX requests
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    let checkedCategories = [];
    // Initialize DataTable
    var itemCategoryTable = $("#item_category_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/item-category",
        columns: [
            {
                data: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_all_category" value="' +
                        full.categoryId +
                        '">'
                    );
                },
            },
            {
                data: "categoryId",
                name: "categoryId",
            },
            {
                data: "category_name_en",
                name: "category_name_en",
            },
            {
                data: "category_name_ar",
                name: "category_name_ar",
            },
            {
                data: "remarks",
                name: "remarks",
            },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL + "/edit-item-category/" + full.categoryId;
                    var deleteUrl =
                        BASE_URL + "/delete-item-category/" + full.categoryId;
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
            var rows = itemCategoryTable.rows({ page: "current" }).nodes();
            $('input[type="checkbox"]', rows).each(function () {
                if (checkedCategories.includes(this.value)) {
                    $(this).prop("checked", true);
                }
            });
            updateFooter();
        },
    });

    // Handle "Select All" checkbox
    $("#select_all_category").on("click", function () {
        var rows = itemCategoryTable.rows({ page: "current" }).nodes();
        var isChecked = this.checked;

        $('input[type="checkbox"]', rows).each(function () {
            $(this).prop("checked", isChecked);
            var categoryId = this.value;

            if (isChecked) {
                if (!checkedCategories.includes(categoryId)) {
                    checkedCategories.push(categoryId);
                }
            } else {
                checkedCategories = checkedCategories.filter(
                    (id) => id !== categoryId
                );
            }
        });

        updateFooter();
    });

    // Handle individual checkbox change
    $("#item_category_table tbody").on(
        "change",
        'input[type="checkbox"]',
        function () {
            var categoryId = this.value;

            if (this.checked) {
                if (!checkedCategories.includes(categoryId)) {
                    checkedCategories.push(categoryId);
                }
            } else {
                checkedCategories = checkedCategories.filter(
                    (id) => id !== categoryId
                );
            }

            // Update "Select All" checkbox state
            var allCheckboxes = $(
                'input[type="checkbox"]',
                itemCategoryTable.rows({ page: "current" }).nodes()
            );
            var allChecked =
                allCheckboxes.length ===
                allCheckboxes.filter(":checked").length;

            var selectAllCheckbox = $("#select_all_category").get(0);
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
        var categoryCount = checkedCategories.length;
        if (categoryCount > 0) {
            footer.show();
            $(".itemz h4").text(categoryCount);
        } else {
            footer.hide();
        }
    }
    $(".footer").hide();

    // Handle delete button click
    $("#deleteSelectedCategories").on("click", function (e) {
        e.preventDefault();

        if (checkedCategories.length === 0) {
            Swal.fire(
                "No categories selected",
                "Please select at least one category to delete.",
                "warning"
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This action will mark the selected categories as deleted.",
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
                    url: BASE_URL + "/delete-selected-item-category",
                    method: "POST",
                    data: {
                        _token: $('meta[name="csrf-token"]').attr("content"),
                        itemCategoryIds: checkedCategories,
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
                            itemCategoryTable.ajax.reload();
                            checkedCategories = [];
                            updateFooter();
                        } else {
                            Swal.fire("Error!", response.message, "error");
                        }
                    },
                    error: function (xhr) {
                        Swal.fire(
                            "Error!",
                            "Something went wrong. Please try again.",
                            "error"
                        );
                    },
                });
            }
        });
    });

    // Open the modal for adding a new category
    $("#addNewCategoryBtn").click(function () {
        $("#itemCategoryModal").modal("show");
        $("#common_category_group_header").text("Add Item Category");
        $("#item_category_btn").text("Save");
        $("#item_category_group_form")[0].reset();
        clearErrors(); 
        $("#category_id").val("");
    });

    // Save or update category with front-end validation
    $("#item_category_btn").click(function () {
        clearErrors();

        // Gather form data
        var categoryId = $("#category_id").val();
        var categoryNameEn = $("#category_name_en").val().trim();
        var categoryNameAr = $("#category_name_ar").val().trim();
        var remarks = $("#remarks").val().trim();

        // Initialize validation
        var errors = {};

        // Validation rules
        if (!categoryNameEn) {
            errors.category_name_en = "Category Name (English) is required.";
        }

        if (!categoryNameAr) {
            errors.category_name_ar = "Category Name (Arabic) is required.";
        }

        if (!remarks) {
            errors.remarks = "Remarks is required.";
        }

        // If there are validation errors, display them and prevent form submission
        if (Object.keys(errors).length > 0) {
            displayValidationErrors(errors);
            return; 
        }

        // Prepare AJAX request
        var formData = $("#item_category_group_form").serialize();
        var ajaxUrl = categoryId
            ? BASE_URL + "/update-item-category/" + categoryId
            : BASE_URL + "/item-category";
        var method = categoryId ? "PUT" : "POST";
    
$("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    itemCategoryTable.ajax.reload(null, false);

                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    $("#itemCategoryModal").modal("hide");
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
                    $("#itemCategoryModal").modal("hide");

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

    // Edit category
    $("#item_category_table").on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");

           $("#loader-overlay").show();
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                   $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#itemCategoryModal").modal("show");
                    $("#common_category_group_header").text(
                        "Update Item Category"
                    );
                    $("#item_category_btn").text("Update");

                    // Populate form with response data
                    $("#category_id").val(response.data.categoryId);
                    $("#category_name_en").val(response.data.category_name_en);
                    $("#category_name_ar").val(response.data.category_name_ar);
                    $("#remarks").val(response.data.remarks);
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

    // Delete category
    $("#item_category_table").on("click", ".item-delete", function () {
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
                            itemCategoryTable.ajax.reload(null, false);
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

    // Function to clear error messages
 function clearErrors() {
    $(".invalid-feedback").remove();
    $(".validation-error").remove(); 
    $(".form-control").removeClass("is-invalid");
}
    // Function to display backend validation errors
    function displayErrors(errors) {
        if (errors.category_name_en) {
            $(".category_name_en_error").text(errors.category_name_en[0]);
        }
        if (errors.category_name_ar) {
            $(".category_name_ar_error").text(errors.category_name_ar[0]);
        }
        if (errors.remarks) {
            $(".remarks_error").text(errors.remarks[0]);
        }
    }

    // Function to display front-end validation errors
   function displayValidationErrors(errors) {
    for (let field in errors) {
        if (errors.hasOwnProperty(field)) {
            let errorMessage = errors[field];
            let inputField = $("#" + field);

            inputField.next(".validation-error").remove(); // ← updated class

            let errorDiv = $("<div>")
                .addClass("validation-error text-danger") // ← updated class
                .text(errorMessage);
            inputField.after(errorDiv);
        }
    }
}

    // Remove Validation Error After Entering The Input Values
    $("#item_category_group_form input, #item_category_group_form textarea").on("input", function () {
    $(this).removeClass("is-invalid");
    $(this).next(".invalid-feedback").remove();
    $(this).next(".validation-error").remove(); // ← add this
});
});
$('#category_name_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#category_name_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});
