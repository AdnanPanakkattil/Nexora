// Item Currency Form Js And Validation
$(document).ready(function () {
    // Activate the product management menu
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#item_currency_sub_menu").addClass("active");

    // Set up CSRF token for AJAX requests
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    let checkedCurrencies = [];
    // Initialize DataTable
    var itemCurrencyTable = $("#item_currency_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/item-currency", 
        columns: [
            {
                data: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_all_currency" value="' + full.currencyId + '">';
                },
            },
            {
                data: "currencyId",
                name: "currencyId"
            },
            {
                data: "currency_code",  
                name: "currency_code"
            },
            {
                data: "currency_name_en", 
                name: "currency_name_en"
            },
            {
                data: "currency_name_ar", 
                name: "currency_name_ar"
            },
            {
                data: "currency_exrate", 
                name: "currency_exrate"
            },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl = BASE_URL + "/edit-item-currency/" + full.currencyId;
                    var deleteUrl = BASE_URL + "/delete-item-currency/" + full.currencyId;
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
            var rows = itemCurrencyTable.rows({ page: "current" }).nodes();
            $('input[type="checkbox"]', rows).each(function () {
                if (checkedCurrencies.includes(this.value)) {
                    $(this).prop("checked", true);
                }
            });
            updateFooter();
        },
    });

    // Handle "Select All" checkbox
    $("#select_all_currency").on("click", function () {
        var rows = itemCurrencyTable.rows({ page: "current" }).nodes();
        var isChecked = this.checked;

        $('input[type="checkbox"]', rows).each(function () {
            $(this).prop("checked", isChecked);
            var currencyId = this.value;

            if (isChecked) {
                if (!checkedCurrencies.includes(currencyId)) {
                    checkedCurrencies.push(currencyId);
                }
            } else {
                checkedCurrencies = checkedCurrencies.filter(
                    (id) => id !== currencyId
                );
            }
        });

        updateFooter();
    });

    // Handle individual checkbox change
    $("#item_currency_table tbody").on(
        "change",
        'input[type="checkbox"]',
        function () {
            var currencyId = this.value;

            if (this.checked) {
                if (!checkedCurrencies.includes(currencyId)) {
                    checkedCurrencies.push(currencyId);
                }
            } else {
                checkedCurrencies = checkedCurrencies.filter(
                    (id) => id !== currencyId
                );
            }

            // Update "Select All" checkbox state
            var allCheckboxes = $(
                'input[type="checkbox"]',
                itemCurrencyTable.rows({ page: "current" }).nodes()
            );
            var allChecked =
                allCheckboxes.length ===
                allCheckboxes.filter(":checked").length;

            var selectAllCheckbox = $("#select_all_currency").get(0);
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
        var currencyCount = checkedCurrencies.length;
        if (currencyCount > 0) {
            footer.show();
            $(".itemz h4").text(currencyCount);
        } else {
            footer.hide();
        }
    }
    $(".footer").hide();

    // Handle delete button click
    $("#deleteSelectedCurrencies").on("click", function (e) {
        e.preventDefault();

        if (checkedCurrencies.length === 0) {
            Swal.fire(
                "No currencies selected",
                "Please select at least one currency to delete.",
                "warning"
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This action will mark the selected currencies as deleted.",
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
                    url: BASE_URL + "/delete-selected-item-currency",
                    method: "POST",
                    data: {
                        _token: $('meta[name="csrf-token"]').attr("content"),
                        itemCurrencyIds: checkedCurrencies,
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
                            itemCurrencyTable.ajax.reload();
                            checkedCurrencies = [];
                            updateFooter();
                        } else {
                            Swal.fire("Error!", response.message, "error");
                        }
                    },
                    error: function (xhr) {
                        $("#itemCurrencyModal").modal("hide");

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

    // Open the modal for adding a new currency
    $("#addNewCurrencyBtn").click(function () {
        $("#itemCurrencyModal").modal("show");
        $("#common_currency_group_header").text("Add Item Currency");
        $("#item_currency_btn").text("Save");
        $("#item_currency_group_form")[0].reset(); 
        clearErrors(); 
        $("#currency_id").val(''); 
    });

    // Save or update currency with front-end validation
    $("#item_currency_btn").click(function () {
        clearErrors();

        // Gather form data
        var currencyId = $("#currency_id").val();
        var currencyCode = $("#currency_code").val().trim();
        var currencyNameEn = $("#currency_name_en").val().trim();
        var currencyNameAr = $("#currency_name_ar").val().trim();
        var currencyExrate = $("#currency_exrate").val().trim();


        // Initialize validation
        var errors = {};

        // Validation rules
        if (!currencyCode) {
            errors.currency_code = 'Currency Code is required.';
        }

        if (!currencyNameEn) {
            errors.currency_name_en = 'Currency Name (English) is required.';
        }

        if (!currencyNameAr) {
            errors.currency_name_ar = 'Currency Name (Arabic) is required.';
        }

        if (!currencyExrate) {
            errors.currency_exrate = 'Currency EX Rate is required.';
        }

        // If there are validation errors, display them and prevent form submission
        if (Object.keys(errors).length > 0) {
            displayValidationErrors(errors);
            return; 
        }

        // Prepare AJAX request
        var formData = $("#item_currency_group_form").serialize();
        var ajaxUrl = currencyId
            ? BASE_URL + "/update-item-currency/" + currencyId
            : BASE_URL + "/item-currency"; 
        var method = currencyId ? "PUT" : "POST"; 

           $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                   $("#loader-overlay").hide();
                if (response.status === true) {
                    itemCurrencyTable.ajax.reload(null, false); 

                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    $("#itemCurrencyModal").modal("hide"); 
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
                    $("#itemCurrencyModal").modal("hide");

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

    // Edit currency
    $("#item_currency_table").on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");

           $("#loader-overlay").show();
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                   $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#itemCurrencyModal").modal("show");
                    $("#common_currency_group_header").text("Update Item Currency");
                    $("#item_currency_btn").text("Update");

                    // Populate form with response data
                    $("#currency_id").val(response.data.currencyId); 
                    $("#currency_code").val(response.data.currency_code);
                    $("#currency_name_en").val(response.data.currency_name_en);
                    $("#currency_name_ar").val(response.data.currency_name_ar);
                    $("#currency_exrate").val(response.data.currency_exrate);
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
                $("#itemCurrencyModal").modal("hide");

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

    // Delete currency
    $("#item_currency_table").on("click", ".item-delete", function () {
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
                            itemCurrencyTable.ajax.reload(null, false);
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
                        $("#itemCurrencyModal").modal("hide");

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
    if (errors.currency_code) {
        $(".currency_code_error").text(errors.currency_code[0]);
    }
    if (errors.currency_name_en) {
        $(".currency_name_en_error").text(errors.currency_name_en[0]);
    }
    if (errors.currency_name_ar) {
        $(".currency_name_ar_error").text(errors.currency_name_ar[0]);
    }
    if (errors.currency_exrate) {
        $(".currency_exrate_error").text(errors.currency_exrate[0]);
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
    $("#item_currency_group_form input").on("input", function () {
        $(this).removeClass("is-invalid");
        $(this).next(".invalid-feedback").remove();
        var errorClass = $(this).attr("id") + "_error";
        $("." + errorClass).text("");
    });

    // Select/Deselect all checkboxes
    $("#select_all").on("click", function () {
        var rows = itemCurrencyTable.rows({ search: "applied" }).nodes();
        $('input[type="checkbox"]', rows).prop("checked", this.checked);
    });

    $("#item_currency_group_form input").on("input", function () {
    $(this).removeClass("is-invalid");
    $(this).next(".invalid-feedback").remove();
    $(this).next(".validation-error").remove();
    var errorClass = $(this).attr("id") + "_error";
    $("." + errorClass).text("");
});
});

$('#currency_name_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#currency_name_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});
