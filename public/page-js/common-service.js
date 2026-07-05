$(document).ready(function () {
    $("#service_main_menu").addClass("active open menu-item-animating");
    $("#common_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#addNewCommonBtn").click(function () {
        $("#service_common_group_form")[0].reset();
        $("#common_group_id").val("");
        $(".error-text").text("");
        $("#serviceCommonModal").modal("show");
        $("#common_service_group_header").text("Add New Common Service Group");
    });

    var dt_service_common_table = $(".service-common-table");
    var dataTableInstance = null;

    var commonServiceTable = $("#common_service_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/service-common-group",
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
            {
                data: "clinicServicesGroupId",
                name: "clinicServicesGroupId",
                render: function (data, type, full, meta) {
                    return meta.row + 1 + commonServiceTable.page.info().start;
                },
            },
            { data: "groupName_en", name: "groupName_en" },
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
                    var assignedServicesUrl =
                        BASE_URL +
                        "/assigned-services-to-common-services/" +
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
                        assignedServicesUrl +
                        '" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill" ><i class="ti ti-eye ti-md"></i></a>'
                    );
                },
            },
        ],
    });

    function validateCommonGroupForm() {
        var isValid = true;
        $(".error-text").text("");

        var nameEn = $(".common-service-group-name_en").val().trim();
        var nameAr = $(".common-service-group-name_ar").val().trim();

        var specialCharPattern = /[^a-zA-Z0-9\u0600-\u06FF\s\-'\.]/;
        if (!nameEn) {
            $(".groupName_en_error").text("Group Name (English) is required.");
            isValid = false;
        } else if (specialCharPattern.test(nameEn)) {
            $(".groupName_en_error").text(
                "Group Name (English) must not contain special characters."
            );
            isValid = false;
        }

        if (!nameAr) {
            $(".groupName_ar_error").text("Group Name (Arabic) is required.");
            isValid = false;
        } else if (/[^a-zA-Z0-9\u0600-\u06FF\s\-'\.؟،]/.test(nameAr)) {
            $(".groupName_ar_error").text(
                "Group Name (Arabic) must not contain special characters."
            );
            isValid = false;
        }

        return isValid;
    }

    $(".common-service-group-name_en").on("input", function () {
        var val = $(this).val();
        $(this).val(val.replace(/[^a-zA-Z0-9\s\-'\.]/g, ""));
    });

    $(".common-service-group-name_ar").on("input", function () {
        var val = $(this).val();
        $(this).val(val.replace(/[^a-zA-Z0-9\u0600-\u06FF\s\-'\.؟،]/g, ""));
    });

    $("#common_group_btn").click(function () {
        if (!validateCommonGroupForm()) {
            return;
        }

        var formData = $("#service_common_group_form").serialize();
        var commonGroupId = $("#common_group_id").val();
        var ajaxUrl = commonGroupId
            ? BASE_URL + "/update-service-common-group/" + commonGroupId
            : BASE_URL + "/service-common-group";
        var method = commonGroupId ? "PUT" : "POST";
        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    commonServiceTable.ajax.reload(null, false);

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
                    console.error("Error:", xhr);
                }
            },
        });
    });

    dt_service_common_table.on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");

        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $(".error-text").text("");
                    $("#serviceCommonModal").modal("show");
                    $("#service_common_group_form_footer").show();
                    $("#common_service_group_header").text(
                        "Update Common Service Group"
                    );

                    $("#service_common_group_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", false);
                    $("#common_group_id").val(
                        response.data.clinicServicesGroupId
                    );
                    $(".common-service-group-name_en").val(
                        response.data.groupName_en
                    );
                    $(".common-service-group-name_ar").val(
                        response.data.groupName_ar
                    );
                }
            },
            error: function (err) {
                console.error("Error fetching edit data:", err);
            },
        });
    });

    dt_service_common_table.on("click", ".item-delete", function () {
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
                            commonServiceTable.ajax.reload(null, false);

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
                            });
                        }
                    },
                    error: function (err) {
                        $("#loader-overlay").hide();
                        var errorMessage =
                            err.responseJSON && err.responseJSON.message
                                ? err.responseJSON.message
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
    });

    dt_service_common_table.on("click", ".item-details", function () {
        var editUrl = $(this).data("id");

        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $(".error-text").text("");
                    $("#serviceCommonModal").modal("show");
                    $("#service_common_group_form_footer").hide();
                    $("#common_service_group_header").text(
                        "Common Service Group Details"
                    );
                    $("#service_common_group_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", true);
                    $("#common_group_id").val(
                        response.data.clinicServicesGroupId
                    );
                    $(".common-service-group-name_en").val(
                        response.data.groupName_en
                    );
                    $(".common-service-group-name_ar").val(
                        response.data.groupName_ar
                    );
                }
            },
            error: function (err) {
                var errorMessage =
                    err.responseJSON && err.responseJSON.message
                        ? err.responseJSON.message
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

    $("#select_all").on("click", function () {
        var rows = commonServiceTable.rows({ search: "applied" }).nodes();
        $('input[type="checkbox"]', rows).prop("checked", this.checked);
        updateSelectedCount();
    });

    $("#common_service_table tbody").on(
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
                                commonServiceTable.ajax.reload(null, false);
                                if (dataTableInstance) {
                                    dataTableInstance.ajax.reload();
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
$('#groupName_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#groupName_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});