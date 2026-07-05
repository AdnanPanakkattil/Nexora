$(document).ready(function () {
    $("#rekaz_main_menu").addClass("active open menu-item-animating");
    $("#services_rekaz_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#rekazReferenceId").select2({
        dropdownParent: $("#rekazServiceModal"),
        placeholder: "Select Rekaz Reference",
        allowClear: true,
        ajax: {
            url: BASE_URL + "/get-rekaz-services-list",
            dataType: "json",
            delay: 250,

            beforeSend: function () {
                $("#loader-overlay").show();
            },

            data: function (params) {
                return {
                    q: params.term,
                    page: params.page || 1,
                };
            },

            processResults: function (data, params) {
                console.log("Select2 Response:", data);

                params.page = params.page || 1;

                return {
                    results: data.results,
                    pagination: {
                        more: data.pagination?.more || false,
                    },
                };
            },

            complete: function () {
                $("#loader-overlay").hide();
            },

            error: function (xhr) {
                $("#loader-overlay").hide();
                console.log(xhr.responseText);
            },

            cache: true,
        },
    });

    $("#addNewRekazServiceBtn").click(function () {
        $("#rekazServiceModal").modal("show");
        $("#rekaz_service_header").text("Add New Rekaz Service");
        enableForm();
        $("#createRekazServiceBtn").text("Save");
        $("#rekaz_service_form")[0].reset();
        $("#categoryId").val("").trigger("change");
        $("#type").val("").trigger("change");
        $("#taxId").val("").trigger("change");
        $("#disType").val("").trigger("change");
        $("#rekazReferenceId").val(null).trigger("change");
        clearErrors();
        $("#serviceId").val("");
    });

    $("#rekazServiceModal").on("hidden.bs.modal", function () {
        enableForm();
        $("#createRekazServiceBtn").text("Save");
    });

    var rekazServiceTable = $("#rekaz_services_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/rekaz-services",
        columns: [
            {
                data: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_all_rekaz_services" value="' +
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
                data: "medicalCode",
                name: "medicalCode",
            },
            {
                data: "serviceCode",
                name: "serviceCode",
            },
            {
                data: "rekazReferenceId",
                name: "rekazReferenceId",
            },
            {
                data: "rekazReferenceName",
                name: "rekazReferenceName",
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
                    var viewUrl =
                        BASE_URL + "/view-rekaz-services/" + full.serviceId;
                    var editUrl =
                        BASE_URL + "/edit-rekaz-services/" + full.serviceId;
                    var deleteUrl =
                        BASE_URL + "/delete-rekaz-services/" + full.serviceId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="javascript:;" class="dropdown-item rekaz-service-view" data-id="' +
                        viewUrl +
                        '">View</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item rekaz-service-edit" data-id="' +
                        editUrl +
                        '">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger rekaz-service-delete" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    $("#createRekazServiceBtn").click(function () {
        clearErrors();
        var serviceId = $("#serviceId").val();
        var formData = $("#rekaz_service_form").serialize();
        var ajaxUrl = serviceId
            ? BASE_URL + "/update-rekaz-services/" + serviceId
            : BASE_URL + "/rekaz-services";
        var method = serviceId ? "PUT" : "POST";
        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    rekazServiceTable.ajax.reload(null, false);
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    $("#rekazServiceModal").modal("hide");
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
                    $("#rekazServiceModal").modal("hide");
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

    function displayErrors(errors) {
        if (errors.serviceName_en) {
            $(".serviceName_en_error").text(errors.serviceName_en[0]);
        }
        if (errors.serviceName_ar) {
            $(".serviceName_ar_error").text(errors.serviceName_ar[0]);
        }
        if (errors.categoryId) {
            $(".categoryId_error").text(errors.categoryId[0]);
        }
        if (errors.type) {
            $(".type_error").text(errors.type[0]);
        }
        if (errors.cost) {
            $(".cost_error").text(errors.cost[0]);
        }
        if (errors.duration) {
            $(".duration_error").text(errors.duration[0]);
        }
        if (errors.netCost) {
            $(".netCost_error").text(errors.netCost[0]);
        }
        if (errors.rekazReferenceId) {
            $(".rekazReferenceId_error").text(errors.rekazReferenceId[0]);
        }
    }

    function displayValidationErrors(errors) {
        for (let field in errors) {
            if (errors.hasOwnProperty(field)) {
                let errorMessage = errors[field];
                let inputField = $("#" + field);
                inputField.next(".invalid-feedback").remove();
                let errorDiv = $("<div>")
                    .addClass("invalid-feedback")
                    .text(errorMessage);
                inputField.after(errorDiv);
            }
        }
    }

    $("#rekaz_service_form input").on("input", function () {
        var inputField = $(this);
        inputField.removeClass("is-invalid");
        inputField.next(".invalid-feedback").remove();
    });

    $("#rekaz_service_form select").on("change", function () {
        var selectField = $(this);
        selectField.removeClass("is-invalid");
        selectField.next(".invalid-feedback").remove();
    });

    $("#rekaz_services_table").on("click", ".rekaz-service-view", function () {
        var viewUrl = $(this).data("id");
        $("#loader-overlay").show();
        $.ajax({
            url: viewUrl,
            method: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#rekazServiceModal").modal("show");
                    $("#rekaz_service_header").text("View Rekaz Service");
                    disableForm();
                    $("#serviceId").val(response.data.serviceId);
                    $("#serviceCode").val(response.data.serviceCode);
                    $("#medicalCode").val(response.data.medicalCode);
                    $("#serviceName_en").val(response.data.serviceName_en);
                    $("#serviceName_ar").val(response.data.serviceName_ar);
                    $("#categoryId")
                        .val(response.data.categoryId)
                        .trigger("change");
                    $("#type")
                        .val(response.data.appointmentType)
                        .trigger("change");
                    console.log("Tax", response.data.taxId);
                    $("#taxId").val(response.data.taxId).trigger("change");
                    $("#cost").val(response.data.cost);
                    $("#duration").val(response.data.duration);
                    $("#oneDayBookingLimits").val(
                        response.data.oneDayBookingLimits,
                    );
                    $("#disType").val(response.data.disType).trigger("change");
                    $("#dis").val(response.data.dis);
                    $("#netCost").val(response.data.netCost);

                    if (response.data.rekazReferenceId) {
                        var displayText =
                            response.data.rekazReferenceName ||
                            response.data.rekazReferenceId;
                        var rekazOption = new Option(
                            displayText,
                            response.data.rekazReferenceId,
                            true,
                            true,
                        );
                        $("#rekazReferenceId")
                            .append(rekazOption)
                            .trigger("change");
                    } else {
                        $("#rekazReferenceId").val(null).trigger("change");
                    }

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
                $("#rekazServiceModal").modal("hide");
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
            },
        });
    });

    $("#rekaz_services_table").on("click", ".rekaz-service-edit", function () {
        var editUrl = $(this).data("id");
        $("#loader-overlay").show();
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#rekazServiceModal").modal("show");
                    $("#rekaz_service_header").text("Update Rekaz Service");
                    $("#createRekazServiceBtn").text("Update");
                    enableForm();
                    $("#serviceId").val(response.data.serviceId);
                    $("#serviceCode").val(response.data.serviceCode);
                    $("#medicalCode").val(response.data.medicalCode);
                    $("#serviceName_en").val(response.data.serviceName_en);
                    $("#serviceName_ar").val(response.data.serviceName_ar);
                    $("#categoryId")
                        .val(response.data.categoryId)
                        .trigger("change");
                    $("#type")
                        .val(response.data.appointmentType)
                        .trigger("change");
                    $("#taxId").val(response.data.taxId).trigger("change");
                    $("#cost").val(response.data.cost);
                    $("#duration").val(response.data.duration);
                    $("#oneDayBookingLimits").val(
                        response.data.oneDayBookingLimits,
                    );
                    $("#disType").val(response.data.disType).trigger("change");
                    $("#dis").val(response.data.dis);
                    $("#netCost").val(response.data.netCost);

                    if (response.data.rekazReferenceId) {
                        var displayText =
                            response.data.rekazReferenceName ||
                            response.data.rekazReferenceId;
                        var rekazOption = new Option(
                            displayText,
                            response.data.rekazReferenceId,
                            true,
                            true,
                        );
                        $("#rekazReferenceId")
                            .append(rekazOption)
                            .trigger("change");
                    } else {
                        $("#rekazReferenceId").val(null).trigger("change");
                    }

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
                $("#rekazServiceModal").modal("hide");
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
            },
        });
    });

    $("#rekaz_services_table").on(
        "click",
        ".rekaz-service-delete",
        function () {
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
                                rekazServiceTable.ajax.reload(null, false);
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
                        },
                    });
                }
            });
        },
    );
});

$("#serviceName_en").on("input", function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, "");
});

$("#serviceName_ar").on("input", function () {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, "");
});

function enableForm() {
    $("#rekazServiceModal").find("input, textarea").prop("readonly", false);
    $("#rekazServiceModal").find("select").prop("disabled", false);
    $("#createRekazServiceBtnDiv").show();
}

function disableForm() {
    $("#rekazServiceModal").find("input, textarea").prop("readonly", true);
    $("#rekazServiceModal").find("select").prop("disabled", true);
    $("#createRekazServiceBtnDiv").hide();
}
