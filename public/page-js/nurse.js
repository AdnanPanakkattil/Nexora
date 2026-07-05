$(document).ready(function () {
    $("#administration_main_menu").addClass("active open menu-item-animating");
    $("#employee_reg_sub_menu").addClass("active");
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    if ($("#nurse_edit_id").val()) {
        initialPageLoad($("#nurse_edit_id").val());
    }

    $("#permission_group_div").hide();

    flatpickr(".joined_date", {
        dateFormat: "Y-m-d",
        maxDate: "today",
    });

    $("#permissionGroupBtn").change(function () {
        if ($(this).is(":checked")) {
            // Show the select box when the checkbox is checked
            $("#permissionGroupId").parent().show();
            $("#permissionMenu").hide();
            $("#permission_group_div").removeAttr("style");
        } else {
            // Hide the select box when the checkbox is unchecked
            $("#permissionGroupId").parent().hide();
            $("#permissionMenu").show();
        }
    });
});

$("#username").on("keyup", function () {
    var username = $(this).val();
    $.ajax({
        url: BASE_URL + "/check-username-already-exist",
        type: "GET",
        data: {
            username: username,
        },
        success: function (response) {
            if (response.status === true) {
                $(".username_error").text("This username is already taken.");
            } else {
                $(".username_error").text("");
            }
        },
    });
});

function saveSuccessSweetAlert(message, redirectUrl = null) {
    Swal.fire({
        icon: "success",
        text: message,
        customClass: {
            confirmButton: "btn btn-success waves-effect waves-light",
        },
    }).then(function () {
        if (redirectUrl) {
            window.location.href = redirectUrl;
        } else {
            location.reload();
        }
    });
}

$(document).ready(function () {
    // selectpicker dropdown menu width ishuuthghghghgh
    $("#templateServiceId").on("shown.bs.select", function () {
        $(this)
            .closest(".bootstrap-select")
            .find(".dropdown-menu")
            .css("width", "100%");
    });
});

$(document).on("click", "#saveButton", function (e) {
    e.preventDefault();
    var formData = new FormData($("#nurse_form")[0]);
    $("#loader-overlay").show();
    $.ajax({
        url: $("#nurse_form").attr("action"),
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
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
                    window.location.href = userIndexUrl;
                });
            }
            $("#largeModal").modal("hide"); // Hide modal on success
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

function initialPageLoad(nurseEditId) {
    $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/edit-nurse/" + nurseEditId,
        type: "GET",
        success: function (response) {
            $("#loader-overlay").hide();
            if (response.status) {

                if (response.data.profileUpdate == 0) {
                    $("#profile_update").prop("checked", true);
                } else {
                    $("#profile_update").prop("checked", false);
                }

                if (response.data.passwordUpdate == 1) {
                    $("#reset_password").prop("checked", true);
                } else {
                    $("#reset_password").prop("checked", false);
                }

                if (response.data.active == 1) {
                    $("#in_active").prop("checked", true);
                } else {
                    $("#in_active").prop("checked", false);
                }

                if (response.data.is_groupPermission == 1) {
                    $("#permissionGroupId").parent().show();
                    $("#permissionMenu").hide();
                    $("#permissionGroupId").val(response.data.clinicsPermissionGroupId);
                    $("#permissionGroupBtn").prop("checked", true);
                } else {
                    const permissions = response.data.permissions.split(",");
                    permissions.forEach((permission) => {
                        $(`#${permission}`).prop("checked", true);
                    });
                }

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: response.message || "Failed to load nurse data.",
                    customClass: {
                        confirmButton: "btn btn-danger waves-effect waves-light",
                    },
                    buttonsStyling: false,
                });
            }
        },
        error: function (xhr) {
            $("#loader-overlay").hide();
            Swal.fire({
                icon: "error",
                title: "Error",
                text: xhr.responseJSON?.message || "Something went wrong while loading nurse data.",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
                buttonsStyling: false,
            });
        },
    });
}
$("#firstName_en,#secondName_en,#thirdName_en,#lastName_en").on("input", function () {
        this.value = this.value.replace(/[^a-zA-Z\s]/g, "");
    });

    $("#firstName_ar,#secondName_ar,#thirdName_ar,#lastName_ar").on("input", function () {
        this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, "");
    });