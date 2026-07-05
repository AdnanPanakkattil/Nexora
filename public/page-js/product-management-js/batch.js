// Batch Form Js And Validation
$(document).ready(function () {
    // Activate the product management menu
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#batch_sub_menu").addClass("active");

    // Set up CSRF token for AJAX requests
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    let checkedBatchs = [];
    // Initialize DataTable
    var BatchTable = $("#batch_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/batch",
        columns: [
           {
                data: null,
                name: "slno",
                orderable: false,
                searchable: false,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                data: "productBatchId",
                name: "productBatchId"
            },
            {   data: "itemName", name: "itemName"},
            {
                data: "batchNo",
                name: "batchNo"
            },
            {
                data: "expiredDate",
                name: "expiredDate"
            },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl = BASE_URL + "/edit-batch-new/" + full.productBatchId;
                    var deleteUrl = BASE_URL + "/delete-batch-new/" + full.productBatchId;
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
            var rows = BatchTable.rows({ page: "current" }).nodes();
            $('input[type="checkbox"]', rows).each(function () {
                if (checkedBatchs.includes(this.value)) {
                    $(this).prop("checked", true);
                }
            });
            updateFooter();
        },
    });

    // Handle "Select All" checkbox
    $("#select_all_batch").on("click", function () {
        var rows = BatchTable.rows({ page: "current" }).nodes();
        var isChecked = this.checked;

        $('input[type="checkbox"]', rows).each(function () {
            $(this).prop("checked", isChecked);
            var batchId = this.value;

            if (isChecked) {
                if (!checkedBatchs.includes(batchId)) {
                    checkedBatchs.push(batchId);
                }
            } else {
                checkedBatchs = checkedUnits.filter(
                    (id) => id !== batchId
                );
            }
        });

        updateFooter();
    });

    // Handle individual checkbox change
    $("#batch_table tbody").on(
        "change",
        'input[type="checkbox"]',
        function () {
            var batchId = this.value;

            if (this.checked) {
                if (!checkedBatchs.includes(batchId)) {
                    checkedBatchs.push(batchId);
                }
            } else {
                checkedBatchs = checkedBatchs.filter(
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

            var selectAllCheckbox = $("#select_all_batch").get(0);
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
        var batchCount = checkedBatchs.length;
        if (batchCount > 0) {
            footer.show();
            $(".itemz h4").text(batchCount);
        } else {
            footer.hide();
        }
    }
    $(".footer").hide();

    // Handle delete button click
    $("#deleteSelectedBatchs").on("click", function (e) {
        e.preventDefault();

        if (checkedBatchs.length === 0) {
            Swal.fire(
                "No batchs selected",
                "Please select at least one unit to delete.",
                "warning"
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This action will mark the selected batchs as deleted.",
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
                    url: BASE_URL + "/delete-selected-batch",
                    method: "POST",
                    data: {
                        _token: $('meta[name="csrf-token"]').attr("content"),
                        BatchIds: checkedBatchs,
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
                            checkedBatchs = [];
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

    $(document).ready(function () {
        console.log('Document ready');

        // Initialize Select2 when modal opens
        $(document).on('shown.bs.modal', function (e) {
            var $modal = $(e.target);

            // Check if modal contains itemMasterId select
            if ($modal.find('#itemMasterId').length > 0) {
                console.log('Initializing Select2 for itemMasterId');

                var $select = $('#itemMasterId');

                // Destroy if already initialized
                if ($select.data('select2')) {
                    $select.select2('destroy');
                }

                // Initialize Select2 with AJAX
                $select.select2({
                    placeholder: '-- Select Product --',
                    allowClear: true,
                    width: '100%',
                    minimumInputLength: 0, // Load all items when opened
                    dropdownParent: $modal, // Attach to modal
                    ajax: {
                        url: BASE_URL + '/product-search',
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            console.log('Search term:', params.term || 'Loading all...');
                            return {
                                q: params.term || '' // Empty string loads all
                            };
                        },
                        processResults: function (data) {
                            console.log('Loaded items:', data.length);
                            return {
                                results: data
                            };
                        },
                        error: function (xhr, status, error) {
                            console.error('AJAX Error:', error);
                            console.error('Response:', xhr.responseText);
                        },
                        cache: true
                    },
                    language: {
                        searching: function () {
                            return 'Searching...';
                        },
                        loadingMore: function () {
                            return 'Loading more results...';
                        },
                        noResults: function () {
                            return 'No products found';
                        }
                    }
                });

                console.log('Select2 initialized successfully');
            }
        });

        // Destroy Select2 when modal closes
        $(document).on('hidden.bs.modal', function () {
            if ($('#itemMasterId').length > 0 && $('#itemMasterId').data('select2')) {
                $('#itemMasterId').select2('destroy');
            }
        });
    });

    flatpickr("#expiredDate", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: false,
        minDate: "today",
    });

    $("#itemMasterId").on('change', function () {
        $(this).removeClass('is-invalid');
        $(this).next('.invalid-feedback').remove();
        $(this).next('.select2-container').find('.select2-selection').removeClass('is-invalid');
    })

    // Save or update unit with front-end validation
    $("#batch_btn").click(function () {
        clearErrors();
        // Gather form data
        var batchId = $("#batch_id").val();
        var batchNoEn = $("#batchNo").val().trim();
        // var batchNameAr = $("#batch_name_ar").val().trim();
        var batchexpiry = $("#expiredDate").val();
        var produtitem = $("#itemMasterId").val();
        // Initialize validation
        var errors = {};

        // Validation rules
        if (!batchNoEn) {
            errors.batchNo = 'Batch Number is required.';
        }
        if (!batchexpiry) {
            errors.expiredDate = 'Batch Expiry Date is required.';
        }
        if (!produtitem) {
            errors.itemMasterId = 'Product Item is required.';
        }

        // If there are validation errors, display them and prevent form submission
        if (Object.keys(errors).length > 0) {
            displayValidationErrors(errors);
            return;
        }

        // Prepare AJAX request
        var formData = $("#batch_group_form").serialize();
        var ajaxUrl = batchId
            ? BASE_URL + "/update-batch-new/" + batchId
            : BASE_URL + "/batch";
        var method = batchId ? "PUT" : "POST";
             $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                     $("#loader-overlay").hide();
                if (response.status === true) {
                    BatchTable.ajax.reload(null, false);

                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    $("#BatchModal").modal("hide");
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
                    $("#BatchModal").modal("hide");

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

    // Edit batch
    $("#batch_table").on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");

             $("#loader-overlay").show();
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                     $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#BatchModal").modal("show");
                    $("#common_batch_group_header").text("Update Batch");
                    $("#batch_btn").text("Update");

                    // Populate form with response data
                    $("#batch_id").val(response.data.productBatchId);
                    $("#batchNo").val(response.data.batchNo);
                    $("#expiredDate").val(response.data.expiredDate);
                    $("#itemMasterId").val(response.data.itemMasterId).trigger('change');
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
                $("#BatchModal").modal("hide");

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

    // Delete batch
    $("#batch_table").on("click", ".item-delete", function () {
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
                    type: "DELETE",   // ✔ correct
                    data: {
                        _token: $('meta[name="csrf-token"]').attr("content"), // ✔ REQUIRED
                    },
                    success: function (response) {
                             $("#loader-overlay").hide();
                        if (response.status === true) {
                            BatchTable.ajax.reload(null, false);

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
                        Swal.fire({
                            icon: "error",
                            title: "Access denied",
                            customClass: {
                                confirmButton: "btn btn-danger waves-effect waves-light",
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
        $(".form-control").removeClass("is-invalid");
    }

    // Function to display backend validation errors
    function displayErrors(errors) {
        if (errors.batchNo_error) {
            $(".batchNo_error").text(errors.batchNo_error[0]);
            $("#batchNo").addClass("is-invalid");
        }
        if (errors.expiredDate) {
            $(".expiredDate_error").text(errors.expiredDate[0]);
            $("#expiredDate").addClass("is-invalid");
        }
    }

    // Function to display front-end validation errors
    function displayValidationErrors(errors) {
        for (let field in errors) {
            if (errors.hasOwnProperty(field)) {
                let errorMessage = errors[field];
                let inputField = $('#' + field);

                inputField.next('.invalid-feedback').remove();

                inputField.addClass('is-invalid');

                let errorDiv = $('<div>').addClass('invalid-feedback').text(errorMessage);
                inputField.after(errorDiv);
            }
        }
    }

    // Remove Validation Error After Entering The Input Values
    $("#batch_group_form input").on("input", function () {
        $(this).removeClass("is-invalid");
        $(this).next(".invalid-feedback").remove();
        var errorClass = $(this).attr("id") + "_error";
        $("." + errorClass).text("");
    });
});

// Open the new modal for adding batch
$('#addNewBatchBtn').on('click', function () {
    $('#NewBatchModal').modal('show');
});

// Initialize Select2 when new modal opens
$('#NewBatchModal').on('shown.bs.modal', function () {
    // Destroy if already exists
    if ($('#itemSearch').data('select2')) {
        $('#itemSearch').select2('destroy');
    }
    
    // Initialize Select2 for the new modal
    $('#itemSearch').select2({
        dropdownParent: $('#NewBatchModal'),
        placeholder: 'Search item',
        minimumInputLength: 2,
        ajax: {
            url: BASE_URL + '/batch-group-items',
            dataType: 'json',
            delay: 300,
            data: function (params) {
                return {
                    q: params.term,
                    page: params.page || 1
                };
            },
            processResults: function (data) {
                return {
                    results: data.data
                };
            }
        }
    });
});

// Clear form when new modal closes
$('#NewBatchModal').on('hidden.bs.modal', function () {
    $('#batchNo').val('').removeClass('is-invalid').siblings('.invalid-feedback').remove();
    $('#expiredDate').val('').removeClass('is-invalid').siblings('.invalid-feedback').remove();
    $('#itemSearch').removeClass('is-invalid').siblings('.invalid-feedback').remove();
    if ($('#itemSearch').next('.select2-container').length) {
        $('#itemSearch').next('.select2-container').find('.select2-selection').removeClass('is-invalid');
    }
    $('#itemSearch').val(null).trigger('change');
    if ($('#itemSearch').data('select2')) {
        $('#itemSearch').select2('destroy');
    }
});

$('#itemSearch').on('change', function() {
    $(this).removeClass('is-invalid');
    $(this).next('.select2-container').find('.select2-selection').removeClass('is-invalid');
    $(this).siblings('.invalid-feedback').remove();
});

$('#batchNo, #expiredDate').on('input change', function() {
    $(this).removeClass('is-invalid');
    $(this).siblings('.invalid-feedback').remove();
});

$('#saveBatch').on('click', function () {
    let data = {
        itemMasterId: $('#itemSearch').val(),
        batchNo: $('#batchNo').val() ? $('#batchNo').val().trim() : '',
        expiredDate: $('#expiredDate').val(),
        _token: $('meta[name="csrf-token"]').attr('content')
    };

    // Clear previous errors
    $('#itemSearch').removeClass('is-invalid');
    $('#itemSearch').next('.select2-container').find('.select2-selection').removeClass('is-invalid');
    $('#itemSearch').siblings('.invalid-feedback').remove();
    $('#batchNo, #expiredDate').removeClass('is-invalid').siblings('.invalid-feedback').remove();

    let hasError = false;

    if (!data.itemMasterId) {
        $('#itemSearch').addClass('is-invalid');
        $('#itemSearch').next('.select2-container').find('.select2-selection').addClass('is-invalid');
        $('#itemSearch').parent().append('<div class="invalid-feedback d-block">Please select an item</div>');
        hasError = true;
    }

    if (!data.batchNo) {
        $('#batchNo').addClass('is-invalid');
        $('#batchNo').after('<div class="invalid-feedback d-block">Batch number is required</div>');
        hasError = true;
    }

    if (!data.expiredDate) {
        $('#expiredDate').addClass('is-invalid');
        $('#expiredDate').after('<div class="invalid-feedback d-block">Expiry date is required</div>');
        hasError = true;
    }

    if (data.batchNo && data.expiredDate && data.batchNo === data.expiredDate) {
        $('#batchNo').addClass('is-invalid');
        $('#batchNo').after('<div class="invalid-feedback d-block">Batch number and Expiry date cannot be the same</div>');
        $('#expiredDate').addClass('is-invalid');
        $('#expiredDate').after('<div class="invalid-feedback d-block">Batch number and Expiry date cannot be the same</div>');
        hasError = true;
    }

    if (hasError) {
        return;
    }

    // Show loading state
$("#loader-overlay").show();

    $.ajax({
        url: BASE_URL + '/product-batch/store',
        type: 'POST',
        data: data,
        success: function (res) {
            $("#loader-overlay").hide();
            Swal.close();
            
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: res.message || 'Batch saved successfully!',
                customClass: {
                    confirmButton: 'btn btn-success'
                }
            }).then(() => {
                // Reload the datatable
                if (typeof BatchTable !== 'undefined') {
                    BatchTable.ajax.reload(null, false);
                }
            
                $('#NewBatchModal').modal('hide');
                location.reload();
            });
        },
        error: function (xhr) {
              $("#loader-overlay").hide();
            Swal.close();
            if (xhr.status === 422) {
                let errors = xhr.responseJSON.errors;
                for (let field in errors) {
                    let errorMessage = errors[field][0];
                    if (field === 'batchNo') {
                        $('#batchNo').addClass('is-invalid');
                        $('#batchNo').after('<div class="invalid-feedback d-block">' + errorMessage + '</div>');
                    } else if (field === 'itemMasterId') {
                        $('#itemSearch').addClass('is-invalid');
                        $('#itemSearch').next('.select2-container').find('.select2-selection').addClass('is-invalid');
                        $('#itemSearch').parent().append('<div class="invalid-feedback d-block">' + errorMessage + '</div>');
                    } else if (field === 'expiredDate') {
                        $('#expiredDate').addClass('is-invalid');
                        $('#expiredDate').after('<div class="invalid-feedback d-block">' + errorMessage + '</div>');
                    }
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: xhr.responseJSON?.message || 'An error occurred. Please try again.',
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    }
                });
            }
        }
    });
});
