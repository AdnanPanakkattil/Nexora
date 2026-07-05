// Unit Form Js And Validation
$(document).ready(function () {
    // Activate the product management menu
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#unit_sub_menu").addClass("active");

    // Set up CSRF token for AJAX requests
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    let checkedUnits = [];
    // Initialize DataTable
    var UnitTable = $("#unit_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/unit",
        columns: [
            {
                data: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_all_unit" value="' + full.unitId + '">';
                },
            },
            {
                data: "unitId",
                name: "unitId"
            },
            {
                data: "unit_name_en", 
                name: "unit_name_en"
            },
            {
                data: "unit_name_ar", 
                name: "unit_name_ar"
            },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl = BASE_URL + "/edit-unit/" + full.unitId;
                    var deleteUrl = BASE_URL + "/delete-unit/" + full.unitId;
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
            var rows = UnitTable.rows({ page: "current" }).nodes();
            $('input[type="checkbox"]', rows).each(function () {
                if (checkedUnits.includes(this.value)) {
                    $(this).prop("checked", true);
                }
            });
            updateFooter();
        },
    });

    // Handle "Select All" checkbox
    $("#select_all_unit").on("click", function () {
        var rows = UnitTable.rows({ page: "current" }).nodes();
        var isChecked = this.checked;

        $('input[type="checkbox"]', rows).each(function () {
            $(this).prop("checked", isChecked);
            var unitId = this.value;

            if (isChecked) {
                if (!checkedUnits.includes(unitId)) {
                    checkedUnits.push(unitId);
                }
            } else {
                checkedUnits = checkedUnits.filter(
                    (id) => id !== unitId
                );
            }
        });

        updateFooter();
    });

    // Handle individual checkbox change
    $("#unit_table tbody").on(
        "change",
        'input[type="checkbox"]',
        function () {
            var unitId = this.value;

            if (this.checked) {
                if (!checkedUnits.includes(unitId)) {
                    checkedUnits.push(unitId);
                }
            } else {
                checkedUnits = checkedUnits.filter(
                    (id) => id !== categoryId
                );
            }

            // Update "Select All" checkbox state
            var allCheckboxes = $(
                'input[type="checkbox"]',
                UnitTable.rows({ page: "current" }).nodes()
            );
            var allChecked =
                allCheckboxes.length ===
                allCheckboxes.filter(":checked").length;

            var selectAllCheckbox = $("#select_all_unit").get(0);
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
        var unitCount = checkedUnits.length;
        if (unitCount > 0) {
            footer.show();
            $(".itemz h4").text(unitCount);
        } else {
            footer.hide();
        }
    }
    $(".footer").hide();

    // Handle delete button click
    $("#deleteSelectedUnits").on("click", function (e) {
        e.preventDefault();

        if (checkedUnits.length === 0) {
            Swal.fire(
                "No units selected",
                "Please select at least one unit to delete.",
                "warning"
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This action will mark the selected units as deleted.",
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
                    url: BASE_URL + "/delete-selected-unit",
                    method: "POST",
                    data: {
                        _token: $('meta[name="csrf-token"]').attr("content"),
                        UnitIds: checkedUnits,
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
                            UnitTable.ajax.reload();
                            checkedUnits = [];
                            updateFooter();
                        } else {
                            Swal.fire("Error!", response.message, "error");
                        }
                    },
                    error: function (xhr) {
                        $("#UnitModal").modal("hide");

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

    // Open the modal for adding a new unit
    $("#addNewUnitBtn").click(function () {
        $("#UnitModal").modal("show");
        $("#common_unit_group_header").text("Add Unit");
        $("#unit_btn").text("Save");
        $("#unit_group_form")[0].reset(); 
        clearErrors(); 
        $("#unit_id").val(''); 
    });

    // Save or update unit with front-end validation
    $("#unit_btn").click(function () {
        clearErrors();

        // Gather form data
        var unitId = $("#unit_id").val();
        var unitNameEn = $("#unit_name_en").val().trim();
        var unitNameAr = $("#unit_name_ar").val().trim();

        // Initialize validation
        var errors = {};

        // Validation rules
        if (!unitNameEn) {
            errors.unit_name_en = 'Unit Name (English) is required.';
        }

        if (!unitNameAr) {
            errors.unit_name_ar = 'Unit Name (Arabic) is required.';
        }

        // If there are validation errors, display them and prevent form submission
        if (Object.keys(errors).length > 0) {
            displayValidationErrors(errors);
            return; 
        }

        // Prepare AJAX request
        var formData = $("#unit_group_form").serialize();
        var ajaxUrl = unitId
            ? BASE_URL + "/update-unit/" + unitId
            : BASE_URL + "/unit"; 
        var method = unitId ? "PUT" : "POST"; 

             $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
             $("#loader-overlay").hide();
                if (response.status === true) {
                    UnitTable.ajax.reload(null, false); 

                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    $("#UnitModal").modal("hide"); 
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
                    $("#UnitModal").modal("hide");

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

    // Edit unit
    $("#unit_table").on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");
             $("#loader-overlay").show();

        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
             $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#UnitModal").modal("show");
                    $("#common_unit_group_header").text("Update Unit");
                    $("#unit_btn").text("Update");

                    // Populate form with response data
                    $("#unit_id").val(response.data.unitId); 
                    $("#unit_code").val(response.data.unit_code);
                    $("#unit_name_en").val(response.data.unit_name_en);
                    $("#unit_name_ar").val(response.data.unit_name_ar);
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
                $("#UnitModal").modal("hide");

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

    // Delete unit
    $("#unit_table").on("click", ".item-delete", function () {
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
                        UnitTable.ajax.reload(null, false);
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

                        $("#UnitModal").modal("hide");

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
    if (errors.unit_name_en) {
        $(".unit_name_en_error").text(errors.unit_name_en[0]);
    }
    if (errors.unit_name_ar) {
        $(".unit_name_ar_error").text(errors.unit_name_ar[0]);
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
    $("#unit_group_form input").on("input", function () {
    $(this).removeClass("is-invalid");
    $(this).next(".invalid-feedback").remove();
    $(this).next(".validation-error").remove();
    var errorClass = $(this).attr("id") + "_error";
    $("." + errorClass).text("");
});
});

$('#unit_name_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#unit_name_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});

