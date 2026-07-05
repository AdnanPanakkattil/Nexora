$(document).ready(function () {
    $("#settings_main_menu").addClass("active open menu-item-animating");
    $("#permission_group_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    if ($("#clinics_permission_group_id").val()) {
        initialPageLoad($("#clinics_permission_group_id").val());
    }

    var permissionGroupListTable = $("#permission_group_list_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/permission-group-lists",
        columns: [
            {
                data: "clinicsPermissionGroupId",
                name: "clinicsPermissionGroupId",
            },
            { data: "groupName_en", name: "groupName_en" },
            { data: "groupName_ar", name: "groupName_ar" },
            { data: "createdDateTime", name: "createdDateTime" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL +
                        "/sales/edit-delivery-note/" +
                        full.deliveryNoteId;
                    var detailsUrl =
                        BASE_URL +
                        "/sales/detail-of-delivery-note/" +
                        full.deliveryNoteId;

                    var deleteUrl =
                        BASE_URL +
                        "/sales/delete-delivery-note/" +
                        full.deliveryNoteId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="' +
                        editUrl +
                        '" class="dropdown-item" data-id="' +
                        editUrl +
                        '">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="' +
                        detailsUrl +
                        '" class="dropdown-item" data-id="' +
                        detailsUrl +
                        '">Details</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    $("#permission_group_save_btn").click(function () {
        var permissionGroupNameFormData = $(
            "#permission_group_name_form",
        ).serializeArray();

        $("#loader-overlay").show();
        $.ajax({
            url: BASE_URL + "/permission-group",
            type: "POST",
            data: permissionGroupNameFormData,
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
                          window.history.back();
                    });
                } else {
                    Swal.fire({
                        icon: "error", 
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light", 
                        },
                    }).then(function () {
                        location.reload();
                    });
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    let errors = xhr.responseJSON.errors;
                    let errorHtml = "";
                    $.each(errors, function (key, messages) {
                        errorHtml += `<div>• ${messages[0]}</div>`;
                    });
                    Swal.fire({
                        icon: "error",
                        title: "Validation Error",
                        html: errorHtml,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Something went wrong",
                        text: "Please try again later.",
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
        });
    });

    $("#permission_group_update_btn").click(function () {
        var permissionGroupNameFormData = $(
            "#permission_group_name_form",
        ).serializeArray();

        $("#loader-overlay").show();
        $.ajax({
            url:
                BASE_URL +
                "/update-permission-group/" +
                $("#clinics_permission_group_id").val(),
            type: "PUT",
            data: permissionGroupNameFormData,
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
                          window.history.back();
                    });
                } else {
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    }).then(function () {
                          window.history.back();
                    });
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    let errors = xhr.responseJSON.errors;
                    let errorHtml = "";
                    $.each(errors, function (key, messages) {
                        errorHtml += `<div>• ${messages[0]}</div>`;
                    });
                    Swal.fire({
                        icon: "error",
                        title: "Validation Error",
                        html: errorHtml,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Something went wrong",
                        text: "Please try again later.",
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
        });
    });
});

function initialPageLoad(clinicsPermissionGroupId) {
    $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/edit-permission-group/" + clinicsPermissionGroupId,
        type: "GET",
        success: function (response) {
            $("#loader-overlay").hide();
            if (response.status) {
                $("#permission_group_en").val(response.data.groupName_en);
                $("#permission_group_ar").val(response.data.groupName_ar);
                const permissions = response.data.permission.split(",");
                console.log("Permissions: ", permissions);
                permissions.forEach((permission) => {
                    $(`#${permission}`).prop("checked", true);
                });
            }
        },
        error: function (xhr, status, error) {
            $("#loader-overlay").hide();
            console.error("AJAX Error: ", status, error);
        },
    });
}

$('#permission_group_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#permission_group_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});
