$(document).ready(function () {
    $("#service_main_menu").addClass("active open menu-item-animating");
    $("#individiual_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    // var dataTableInstance = $('.dt-advanced-search').DataTable();

    var dt_adv_filter_table = $(".dt-advanced-search");
    var dataTableInstance = null;

    if ($("#select_role").val()) {
        loadIndividuals($("#select_role").val());
    }

    $("#select_role").change(function () {
        loadIndividuals($(this).val());
    });

    $("#select_individual").change(function () {
        // loadIndividualServices($(this).val());
        individualServiceTable.ajax.reload();
    });

    $("#addNewServiceBtn").click(function () {
        $("#individualServiceModal").modal("show");
        $("#ex_arge_modal_footer").show();
        $("#individual_header").text("Add New Individual Service");
        $("#service_form")
            .find("input, textarea, select, button")
            .prop("disabled", false);
        $("#service_form")[0].reset();
    });

    var individualServiceTable = $("#individual_service_table").DataTable({
        destroy: true,
        processing: true,
        serverSide: true,
        // ajax: BASE_URL + "/individual",
        ajax: {
            url: BASE_URL + "/individual-service",
            data: function (d) {
                var emp = $("#select_individual").val();
                if (emp && emp !== "selectindividual" && emp !== "All") {
                    d.employeeId = emp;
                }
            },
        },
        columns: [
            {
                data: "checkbox",
                name: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_service" value="' +
                        full.serviceId +
                        '">'
                    );
                },
            },
            
            {
    data: null,
    name: "sl_no",
    orderable: false,
    searchable: false,
    render: function (data, type, row, meta) {
          var pageInfo = $('#individual_service_table').DataTable().page.info();

        return pageInfo.recordsTotal -
               (meta.row + pageInfo.start);
    },
},

             { data: "serviceId", name: "serviceId" },
            { data: "serviceCode", name: "serviceCode" },
            { data: "serviceName_en", name: "serviceName_en" },
            { data: "serviceName_ar", name: "serviceName_ar" },
            { data: "duration", name: "duration" },
            { data: "cost", name: "cost" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL + "/edit-individual-service/" + full.serviceId;
                    var detailsUrl =
                        BASE_URL +
                        "/detail-of-individual-service/" +
                        full.serviceId;
                    var deleteUrl =
                        BASE_URL +
                        "/delete-individual-service/" +
                        full.serviceId;

                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="javascript:;" class="dropdown-item  item-edit" data-id="' +
                        editUrl +
                        '">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item item-details" data-id="' +
                        detailsUrl +
                        '">Details</a></li>' +
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
    });

    individualServiceTable.on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");

        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#individualServiceModal").modal("show");
                    $("#ex_arge_modal_footer").show();
                    $("#individual_header").text("Update Individual service");

                    $("#service_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", false);

                 $("#individual_service_id").val(response.data.serviceId);

$("#employeeId")
    .val(response.data.employeeId)
    .trigger("change");

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

$("#taxId")
    .val(response.data.taxId)
    .trigger("change");

$("#cost").val(response.data.cost);

$("#duration").val(response.data.duration);

$("#oneDayBookingLimits").val(
    response.data.oneDayBookingLimits
);
                }
            },
            error: function (err) {
                console.error("Error fetching edit data:", err);

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

    individualServiceTable.on("click", ".item-details", function () {
        var editUrl = $(this).data("id");

        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#individualServiceModal").modal("show");
                    $("#ex_arge_modal_footer").hide();
                    $("#individual_header").text("Individual service Details");

                    $("#service_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", true);

                  
                $("#individualServiceModal").modal("show");

                $("#ex_arge_modal_footer").hide();

                $("#individual_header").text("Individual service Details");

                $("#individual_service_id").val(response.data.serviceId);

                $("#employeeId")
                    .val(response.data.employeeId)
                    .trigger("change");

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

                $("#taxId")
                    .val(response.data.taxId)
                    .trigger("change");

                $("#cost").val(response.data.cost);

                $("#duration").val(response.data.duration);
                    $("#oneDayBookingLimits").val(
                        response.data.oneDayBookingLimits,
                    );

                    $("#createServiceBtn").hide();
                }
            },
            error: function (err) {
                console.error("Error fetching edit data:", err);

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

    individualServiceTable.on("click", ".item-delete", function () {
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
                            individualServiceTable.ajax.reload(null, false);
                            if (dataTableInstance) {
                                dataTableInstance.ajax.reload();
                            } else {
                                console.error(
                                    "DataTable instance is not available.",
                                );
                            }
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton:
                                        "btn btn-success waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function (err) {
                        $("#loader-overlay").hide();
                        console.error("Error fetching edit data:", err);

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
                    text: "Please verify the patient details.",
                    icon: "error",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });

    $(".createServiceBtn").click(function () {
        var formData = $("#service_form").serialize();
        var insurancePayerId = $("#individual_service_id").val();
        var ajaxUrl = insurancePayerId
            ? BASE_URL + "/update-individual-service/" + insurancePayerId
            : BASE_URL + "/individual-service";
        var method = insurancePayerId ? "PUT" : "POST";
        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
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
                $("#largeModal").modal("hide");
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
                    $("#individualServiceModal").modal("hide");

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
    $("#select_all").on("click", function () {
        var rows = individualServiceTable.rows({ search: "applied" }).nodes();
        $('input[type="checkbox"]', rows).prop("checked", this.checked);
        updateSelectedCount();
    });

    $("#individual_service_table tbody").on(
        "change",
        'input[type="checkbox"]',
        function () {
            if (!this.checked) {
                var el = $("#select_all").get(0);
                if (el && el.checked && "indeterminate" in el) {
                    el.indeterminate = true;
                }
            }
            updateSelectedCount();
        },
    );

    $("#delete_selected").on("click", function () {
        var selectedIds = $('input[name="select_service"]:checked')
            .map(function () {
                return $(this).val();
            })
            .get();
        console.log(selectedIds);
        if (selectedIds.length > 0) {
            Swal.fire({
                title: "Are you sure?",
                text: "You want to delete this service?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes!",
                customClass: {
                    confirmButton:
                        "btn btn-primary me-3 waves-effect waves-light",
                    cancelButton:
                        "btn btn-label-secondary waves-effect waves-light",
                },
                buttonsStyling: false,
            }).then(function (result) {
                if (result.value) {
                    $("#loader-overlay").show();
                    $.ajax({
                        url: BASE_URL + "/delete-selected-individual-services",
                        method: "DELETE",
                        data: {
                            ids: selectedIds,
                        },
                        success: function (response) {
                            if (response.status === true) {
                                individualServiceTable.ajax.reload(null, false);
                                $("#bulk_select").hide();

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
                            console.error("Error fetching edit data:", err);
                        },
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        title: "Cancelled",
                        text: "Please verify the service common group.",
                        icon: "error",
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    });
                }
            });
        } else {
            alert("No services selected");
        }
    });
});

function updateSelectedCount() {
    var selectedCount = $('input[name="select_service"]:checked').length;
    $("#selected_count").text(selectedCount);
    if (selectedCount > 0) {
        $("#bulk_select").show();
        $("#selected_count").text(selectedCount);
    } else {
        $("#bulk_select").hide();
    }
}

function loadIndividuals(role, callback) {
    $.ajax({
        url: BASE_URL + "/get-individuals/" + role,
        type: "GET",
        success: function (response) {
            if (response.status) {
                var insuranceDropdown = $("#select_individual");
                insuranceDropdown.empty();
                insuranceDropdown.append(
                    '<option value="">Select Individual</option>',
                );
                insuranceDropdown.append(
                    '<option value="All">Select All</option>',
                );

                $.each(response.data, function (key, value) {
                    insuranceDropdown.append(
                        '<option value="' + key + '">' + value + "</option>",
                    );
                });

                if (callback) callback();
            } else {
                console.error(
                    "Failed to retrieve individuals: ",
                    response.message,
                );
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
}

// function loadIndividualServices(employeId, callback) {
//     var dataTableInstance = $(".dt-advanced-search").DataTable();
//     if (dataTableInstance) {
//         dataTableInstance.ajax
//             .url(BASE_URL + "/get-individual-services/" + employeId)
//             .load();
//     } else {
//         console.error("DataTable instance is not initialized.");
//     }

// }
$('#serviceName_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#serviceName_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});

// Reset form when modal is closed
$("#individualServiceModal").on("hidden.bs.modal", function () {
    $("#service_form")[0].reset();
    $("#individual_service_id").val("");
    $(".error-text").text("");
    $("#employeeId").val("").trigger("change");
    $("#categoryId").val("").trigger("change");
    $("#type").val("").trigger("change");
    $("#taxId").val("").trigger("change");
});