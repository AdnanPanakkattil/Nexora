$(document).ready(function () {
    $("#service_main_menu").addClass("active open menu-item-animating");
    $("#group_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#addNewServiceGroupBtn").click(function () {
        $("#serviceGroupModal").modal("show");
        $("#service_group_header").text("Add New Template");
        // $("#insurance_payer_id").val("");
        // loadInsuranceCompanies();
    });

    $("#addNewServiceGroupBtn").click(function () {
        $("#groupModal").modal("show");
    });

    var dt_service_group_table = $(".service-group-table");
    var dataTableInstance = null;

    var templateServiceTable = $("#group_service_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/service-group",
        columns: [
            {
                data: "checkbox",
                name: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_service" value="' +
                        full.clinicServicesGroupId +
                        '">'
                    );
                },
            },
            { data: "clinicServicesGroupId", name: "clinicServicesGroupId" },

            { data: "groupName_en", name: "groupName_en" },
            // {data: 'serviceName_en', name: 'serviceName_en'},
            { data: "groupName_ar", name: "groupName_ar" },

            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL +
                        "/edit-service-group/" +
                        full.clinicServicesGroupId;
                    var detailsUrl =
                        BASE_URL +
                        "/detail-of-service-group/" +
                        full.clinicServicesGroupId;
                    var deleteUrl =
                        BASE_URL +
                        "/delete-service-group/" +
                        full.clinicServicesGroupId;
                    var assignedCommonServicesUrl =
                        BASE_URL +
                        "/assigned-services-to-template/" +
                        full.clinicServicesGroupId;

                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="javascript:;" class="dropdown-item item-edit" data-id="' +
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
                        "</div>" +
                        '<a href="' +
                        assignedCommonServicesUrl +
                        '" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill" ><i class="ti ti-eye ti-md"></i></a>'
                    );
                },
            },
        ],
    });

    $("#service_group_btn").click(function () {
        var formData = $("#service_group_form").serialize();
        var serviceGroupId = $("#group_id").val();
        var ajaxUrl = serviceGroupId
            ? BASE_URL + "/update-service-group/" + serviceGroupId
            : BASE_URL + "/service-group";
        var method = serviceGroupId ? "PUT" : "POST";
        $("#loader-overlay").css("display", "block");
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                $("#loader-overlay").css("display", "none");
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
                $("#largeModal").modal("hide"); // Hide modal on success
            },
            error: function (xhr, status, error) {
                $("#loader-overlay").css("display", "none");
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    $("#serviceGroupModal").modal("hide");
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

    dt_service_group_table.on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");

        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#serviceGroupModal").modal("show");
                    $("#service_group_form_footer").show();
                    $("#service_group_header").text("Update Group");
                    $("#service_group_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", false);
                    $("#group_id").val(response.data.clinicServicesGroupId);
                    $(".service-group-name_en").val(response.data.groupName_en);
                    $(".service-group-name_ar").val(response.data.groupName_ar);

                    // $("#createServiceBtn").hide();
                }
            },
            error: function (err) {
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

    dt_service_group_table.on("click", ".item-delete", function () {
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
                $("#loader-overlay").css("display", "block");
                $.ajax({
                    url: deleteUrl,
                    method: "DELETE",
                    success: function (response) {
                        $("#loader-overlay").css("display", "none");
                        if (response.status === true) {
                            if (dataTableInstance) {
                                dataTableInstance.ajax.reload();
                            } else {
                                console.error(
                                    "DataTable instance is not available."
                                );
                            }
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
                        $("#loader-overlay").css("display", "none");
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
                    text: "Please verify the service group.",
                    icon: "error",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });

    dt_service_group_table.on("click", ".item-details", function () {
        var detailsUrl = $(this).data("id");

        $.ajax({
            url: detailsUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#serviceGroupModal").modal("show");
                    $("#service_group_form_footer").hide();
                    $("#service_group_header").text("Group Details");
                    $("#service_group_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", true);
                    $("#group_id").val(response.data.clinicServicesGroupId);
                    $(".service-group-name_en").val(response.data.groupName_en);
                    console.log(response.data.groupName_ar);
                    $(".service-group-name_ar").val(response.data.groupName_ar);

                    // $("#createServiceBtn").hide();
                }
            },
            error: function (err) {
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

    $("#select_all").on("click", function () {
        var rows = templateServiceTable.rows({ search: "applied" }).nodes();
        $('input[type="checkbox"]', rows).prop("checked", this.checked);
        updateSelectedCount();
    });

    $("#group_service_table tbody").on(
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
        }
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
                    $.ajax({
                        url: BASE_URL + "/delete-selected-group-services",
                        method: "DELETE",
                        data: {
                            ids: selectedIds,
                        },
                        success: function (response) {
                            if (response.status === true) {
                                templateServiceTable.ajax.reload(null, false);
                                dataTableInstance.ajax.reload();

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
    // alert(selectedCount);
    if (selectedCount > 0) {
        $("#bulk_select").show();
        $("#selected_count").text(selectedCount);
    } else {
        $("#bulk_select").hide();
    }
}
$('#groupName_en, #groupName_ar').on('keypress', function (e) {
    if (!/[a-zA-Z]/.test(e.key)) {
        e.preventDefault();
    }
});
$('#groupName_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#groupName_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});


$("#serviceGroupModal").on("hidden.bs.modal", function () {
    $("#service_group_form")[0].reset();
    $("#group_id").val("");
    $(".error-text").text("");
});