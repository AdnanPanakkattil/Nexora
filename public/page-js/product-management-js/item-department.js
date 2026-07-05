$(document).ready(function () {
    // Activate the product management menu
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#item_department_sub_menu").addClass("active");

    // Set up CSRF token for AJAX requests
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // Open the modal for adding a new department
    $("#addNewDepartmentBtn").click(function () {
        $("#itemDepartmentModal").modal("show");
        $("#common_department_group_header").text("Add Item Department");
        $("#item_department_btn").text("Save");
        $("#item_department_group_form")[0].reset(); 
        clearErrors(); 
        $("#department_id").val(''); 
    });

    let checkedDepartments = [];
    // Initialize DataTable
    var itemDepartmentTable = $("#item_department_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/item-department", 
        columns: [
            {
                data: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_all_department" value="' + full.regularCustomerId + '">';
                },
            },
            {
                data: "departmentId",
                name: "departmentId"
            },
            {
                data: "identifiedName_en",  
                name: "identifiedName_en"
            },
            {
                data: "department_code", 
                name: "department_code"
            },
            {
                data: "department_name_en", 
                name: "department_name_en"
            },
            {
                data: "department_name_ar", 
                name: "department_name_ar"
            },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl = BASE_URL + "/edit-item-department/" + full.departmentId;
                    var deleteUrl = BASE_URL + "/delete-item-department/" + full.departmentId;
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
            var rows = itemDepartmentTable.rows({ page: "current" }).nodes();
            $('input[type="checkbox"]', rows).each(function () {
                if (checkedDepartments.includes(this.value)) {
                    $(this).prop("checked", true);
                }
            });
            updateFooter();
        },
    });

    // Handle "Select All" checkbox
    $("#select_all_department").on("click", function () {
        var rows = itemDepartmentTable.rows({ page: "current" }).nodes();
        var isChecked = this.checked;

        $('input[type="checkbox"]', rows).each(function () {
            $(this).prop("checked", isChecked);
            var departmentId = this.value;

            if (isChecked) {
                if (!checkedDepartments.includes(departmentId)) {
                    checkedDepartments.push(departmentId);
                }
            } else {
                checkedDepartments = checkedDepartments.filter(
                    (id) => id !== departmentId
                );
            }
        });
        updateFooter();
    });

    // Handle individual checkbox change
    $("#item_department_table tbody").on(
        "change",
        'input[type="checkbox"]',
        function () {
            var departmentId = this.value;

            if (this.checked) {
                if (!checkedDepartments.includes(departmentId)) {
                    checkedDepartments.push(departmentId);
                }
            } else {
                checkedDepartments = checkedDepartments.filter(
                    (id) => id !== departmentId
                );
            }

            // Update "Select All" checkbox state
            var allCheckboxes = $(
                'input[type="checkbox"]',
                itemDepartmentTable.rows({ page: "current" }).nodes()
            );
            var allChecked =
                allCheckboxes.length ===
                allCheckboxes.filter(":checked").length;

            var selectAllCheckbox = $("#select_all_department").get(0);
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
        var departmentCount = checkedDepartments.length;
        if (departmentCount > 0) {
            footer.show();
            $(".itemz h4").text(departmentCount);
        } else {
            footer.hide();
        }
    }
    $(".footer").hide();

    // Handle delete button click
    $("#deleteSelectedDepartments").on("click", function (e) {
        e.preventDefault();

        if (checkedDepartments.length === 0) {
            Swal.fire(
                "No departments selected",
                "Please select at least one department to delete.",
                "warning"
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This action will mark the selected departments as deleted.",
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
                    url: BASE_URL + "/delete-selected-item-department",
                    method: "POST",
                    data: {
                        _token: $('meta[name="csrf-token"]').attr("content"),
                        itemDepartmentIds: checkedDepartments,
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
                            itemDepartmentTable.ajax.reload();
                            checkedDepartments = [];
                            updateFooter();
                        } else {
                            Swal.fire("Error!", response.message, "error");
                        }
                    },
                    error: function (xhr) {
                        $("#itemDepartmentModal").modal("hide");

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

    // Save or update department with front-end validation
    $("#item_department_btn").click(function () {
        clearErrors(); 

        var departmentId = $("#department_id").val();
        var departmentCode = $("#department_code").val().trim();
        var departmentNameEn = $("#department_name_en").val().trim();
        var departmentNameAr = $("#department_name_ar").val().trim();
        var departmentClinic = $("#department_clinic").val().trim();


        var errors = {};

        // Validation rules
        if (!departmentCode) {
            errors.department_code = 'Department Code is required.';
        }

        if (!departmentNameEn) {
            errors.department_name_en = 'Department Name (English) is required.';
        }

        if (!departmentNameAr) {
            errors.department_name_ar = 'Department Name (Arabic) is required.';
        }

        if (!departmentClinic) {
            errors.department_clinic = 'Department Clinic is required.';
        }

        // Display validation errors if any
        if (Object.keys(errors).length > 0) {
            displayValidationErrors(errors);
            return; 
        }

        var formData = $("#item_department_group_form").serialize();
        var ajaxUrl = departmentId
            ? BASE_URL + "/update-item-department/" + departmentId
            : BASE_URL + "/item-department"; 
        var method = departmentId ? "PUT" : "POST"; 

         $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                 $("#loader-overlay").hide();
                if (response.status === true) {
                    itemDepartmentTable.ajax.reload(null, false); 
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    $("#itemDepartmentModal").modal("hide"); 
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
                    $("#itemDepartmentModal").modal("hide");

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

    // Edit department
    $("#item_department_table").on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");

         $("#loader-overlay").show();
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                 $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#itemDepartmentModal").modal("show");
                    $("#common_department_group_header").text("Update Item Department");
                    $("#item_department_btn").text("Update");

                    $("#department_id").val(response.data.departmentId); 
                    $("#department_code").val(response.data.department_code);
                    $("#department_clinic").val(response.data.clinicId).trigger("change");
                    $("#department_name_en").val(response.data.department_name_en);
                    $("#department_name_ar").val(response.data.department_name_ar);
                    clearErrors();
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
                $("#itemDepartmentModal").modal("hide");

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
    });

    // Delete department
    $("#item_department_table").on("click", ".item-delete", function () {
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
                            itemDepartmentTable.ajax.reload(null, false);
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
                    error: function (xhr) {
                         $("#loader-overlay").hide();
                        $("#itemDepartmentModal").modal("hide");

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
    
    $("#itemDepartmentModal").on("hidden.bs.modal", function () {
    $("#item_department_group_form")[0].reset();
    $("#department_clinic").val(null).trigger("change"); // reset select2
    clearErrors();
    $("#department_id").val("");
});

    // Function to clear backend error messages
   function clearErrors() {
    $(".error-text").text("");
    $(".validation-error").remove();
    $(".form-control").removeClass("is-invalid");
}
    // Function to display backend validation errors
   function displayErrors(errors) {
    if (errors.department_code) {
        $(".department_code_error").text(errors.department_code[0]);
    }
    if (errors.department_name_en) {
        $(".department_name_en_error").text(errors.department_name_en[0]);
    }
    if (errors.department_name_ar) {
        $(".department_name_ar_error").text(errors.department_name_ar[0]);
    }
    if (errors.department_clinic) {
        $(".department_clinic_error").text(errors.department_clinic[0]);
    }
}

    // Function to display front-end validation errors
   function displayValidationErrors(errors) {
    for (let field in errors) {
        if (errors.hasOwnProperty(field)) {
            let errorMessage = errors[field];
            let inputField = $("#" + field);

            inputField.parent().find(".validation-error").remove();

            let errorDiv = $("<div>")
                .addClass("validation-error text-danger")
                .text(errorMessage);

            // For select2 fields, insert after the select2 container
            if (inputField.is("select")) {
                inputField.next(".select2-container").after(errorDiv);
            } else {
                inputField.after(errorDiv);
            }
        }
    }
}

    // Remove Validation Error After Entering The Input Values
   $("#item_department_group_form input").on("input", function () {
    $(this).removeClass("is-invalid");
    $(this).next(".invalid-feedback").remove();
    $(this).next(".validation-error").remove();
});

$("#item_department_group_form select").on("change", function () {
    $(this).removeClass("is-invalid");
    $(this).next(".select2-container").next(".validation-error").remove();
});
});

$('#department_name_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#department_name_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});

