$(document).ready(function () {
    $("#service_main_menu").addClass("active open menu-item-animating");
    $("#cash_service_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#addNewCashServiceBtn").click(function () {
        $("#cashServiceModal").modal("show");
        $("#cash_service_header").text("Add New Cash Service");
        $("#createCashServiceBtn").text("Save");
        $("#cash_service_form")[0].reset();
        $("#categoryId").val("").trigger("change");
        $("#type").val("").trigger("change");
        $("#taxId").val("").trigger("change");
        $("#disType").val("").trigger("change");
        clearErrors();
        $("#serviceId").val("");
    });

    var cashServiceTable = $("#cash_services_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/cash-services",
        columns: [
            {
                data: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_all_cash_services" value="' +
                        full.serviceId +
                        '">'
                    );
                },
            },
            {
                data: "serviceId",
                name: "serviceId",
            },
            {
                data: "serviceCode",
                name: "serviceCode",
            },
            {
                data: "medicalCode",
                name: "medicalCode",
            },
            {
                data: "serviceName_en",
                name: "serviceName_en",
            },
            {
                data: "serviceName_ar",
                name: "serviceName_ar",
            },
            {
                data: "duration",
                name: "duration",
            },
            {
                data: "categoryId",
                name: "categoryId",
            },
            {
                data: "cost",
                name: "cost",
            },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL + "/edit-cash-services/" + full.serviceId;
                    var deleteUrl =
                        BASE_URL + "/delete-cash-services/" + full.serviceId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="javascript:;" class="dropdown-item cash-service-edit" data-id="' +
                        editUrl +
                        '">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger cash-service-delete" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    // Save or update cash service with front-end validation
    $("#createCashServiceBtn").click(function () {
        clearErrors();

        var serviceId = $("#serviceId").val();
        var formData = $("#cash_service_form").serialize();
        var ajaxUrl = serviceId
            ? BASE_URL + "/update-cash-services/" + serviceId
            : BASE_URL + "/cash-services";
        var method = serviceId ? "PUT" : "POST";
        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    cashServiceTable.ajax.reload(null, false);
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    $("#cashServiceModal").modal("hide");
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
                    $("#cashServiceModal").modal("hide");
                    var errorMessage =
                        xhr.responseJSON && xhr.responseJSON.message
                            ? xhr.responseJSON.message
                            : "An unexpected error occurred. Please try again.";
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

    function clearErrors() {
        $(".error-text").text("");
        $(".form-control").removeClass("is-invalid");
    }

    // Function to display backend validation errors
    function displayErrors(errors) {
        if (errors.serviceName_en) {
            $(".serviceName_en_error").text(errors.serviceName_en[0]);
            // $("#serviceName_en").addClass("is-invalid");
        }
        if (errors.serviceName_ar) {
            $(".serviceName_ar_error").text(errors.serviceName_ar[0]);
            // $("#serviceName_ar").addClass("is-invalid");
        }
        if (errors.categoryId) {
            $(".categoryId_error").text(errors.categoryId[0]);
            // $("#categoryId").addClass("is-invalid");
        }
        if (errors.type) {
            $(".type_error").text(errors.type[0]);
            // $("#type").addClass("is-invalid");
        }
        if (errors.cost) {
            $(".cost_error").text(errors.cost[0]);
            // $("#cost").addClass("is-invalid");
        }
        if (errors.duration) {
            $(".duration_error").text(errors.duration[0]);
            // $("#duration").addClass("is-invalid");
        }
        if (errors.netCost) {
            $(".netCost_error").text(errors.netCost[0]);
            // $("#netCost").addClass("is-invalid");
        }
    }

    // Function to display front-end validation errors
    function displayValidationErrors(errors) {
        for (let field in errors) {
            if (errors.hasOwnProperty(field)) {
                let errorMessage = errors[field];
                let inputField = $("#" + field);

                inputField.next(".invalid-feedback").remove();

                // inputField.addClass("is-invalid");

                let errorDiv = $("<div>")
                    .addClass("invalid-feedback")
                    .text(errorMessage);
                inputField.after(errorDiv);
            }
        }
    }

    // Remove Validation Error After Entering The Input Values
    $("#cash_service_form input").on("input", function () {
        var inputField = $(this);
        inputField.removeClass("is-invalid");
        inputField.next(".invalid-feedback").remove();
    });

    // Remove Validation Error After Selecting The Select Option Values
    $("#cash_service_form select").on("change", function () {
        var selectField = $(this);
        selectField.removeClass("is-invalid");
        selectField.next(".invalid-feedback").remove();
    });

    // Edit Cash Service
    $("#cash_services_table").on("click", ".cash-service-edit", function () {
        var editUrl = $(this).data("id");

        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#cashServiceModal").modal("show");
                    $("#cash_service_header").text("Update Cash Service");
                    $("#createCashServiceBtn").text("Update");

                    $("#serviceId").val(response.data.serviceId);
                    $("#serviceCode").val(response.data.serviceCode);
                    $("#medicalCode").val(response.data.medicalCode);
                    $("#serviceName_en").val(response.data.serviceName_en);
                    $("#serviceName_ar").val(response.data.serviceName_ar);
                    $("#categoryId").val(response.data.categoryId);
                    $("#type").val(response.data.appointmentType);
                    $("#taxId").val(response.data.taxId);
                    $("#cost").val(response.data.cost);
                    $("#duration").val(response.data.duration);
                    $("#oneDayBookingLimits").val(
                        response.data.oneDayBookingLimits,
                    );
                    $("#disType").val(response.data.disType);
                    $("#dis").val(response.data.dis);
                    $("#netCost").val(response.data.netCost);
                    $("#referralCost").val(response.data.referralCost);

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
                $("#cashServiceModal").modal("hide");

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

    // Delete cash service
    $("#cash_services_table").on("click", ".cash-service-delete", function () {
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
                            cashServiceTable.ajax.reload(null, false);
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
                    error: function (xhr) {
                        $("#loader-overlay").hide();
                        $("#cashServiceModal").modal("hide");

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
});

$("#serviceName_en").on("input", function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, "");
});

$("#serviceName_ar").on("input", function () {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, "");
});
