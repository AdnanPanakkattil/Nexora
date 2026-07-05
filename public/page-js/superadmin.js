$(document).ready(function () {
    $("#administration_main_menu").addClass("active open menu-item-animating");
    $("#employee_reg_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    if ($("#superadmin_edit_id").val()) {
        initialPageLoad($("#superadmin_edit_id").val());
    }
    
    flatpickr(".joined_date", {
        dateFormat: "Y-m-d",
        maxDate: "today",
    });

    $("#permission_group_div").hide();

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
            location.reload(); // Fallback if no URL is provided
        }
    });
}

$(document).on("click", "#saveButton", function (e) {
    // e.preventDefault(); alert();
    var formData = new FormData($("#superadmin_form")[0]);
    $.ajax({
        url: $("#superadmin_form").attr("action"),
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
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
        },
        error: function (xhr, status, error) {
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

function initialPageLoad(superAdminEditId) {
    $.ajax({
        url: BASE_URL + "/edit-superadmin/" + superAdminEditId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                console.log(response);

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
                    $("#permissionGroupId").val(
                        response.data.clinicsPermissionGroupId,
                    );
                    $("#permissionGroupBtn").prop("checked", true);
                } else {
                    const permissions = response.data.permissions.split(",");
                    console.log("Permissions: ", permissions);
                    permissions.forEach((permission) => {
                        $(`#${permission}`).prop("checked", true);
                    });
                }
            }
        },
    });
}
$("#firstName_en,#secondName_en,#thirdName_en,#lastName_en").on("input", function () {
        this.value = this.value.replace(/[^a-zA-Z\s]/g, "");
    });

    $("#firstName_ar,#secondName_ar,#thirdName_ar,#lastName_ar").on("input", function () {
        this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, "");
    });