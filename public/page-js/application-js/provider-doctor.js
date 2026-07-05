$(document).ready(function () {
    $("#application_main_menu").addClass("active open menu-item-animating");
    $("#application_providers_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    if ($("#provider_doctor_edit_id").val()) {
        initialPageLoad($("#provider_doctor_edit_id").val());
    }

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
            location.reload();
        }
    });
}

$(document).on("click", "#saveButton, #updateButton", function (e) {
    e.preventDefault();
    var form = $("#doctor_form");
    var formData = new FormData(form[0]);
    var actionUrl = form.attr("action");

    console.log(formData);
    // Always use POST for Ajax
    $("#loader-overlay").show();

    $.ajax({
        url: actionUrl,
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
                    window.location.href = BASE_URL + "/application/providers";
                });
            }
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
                console.error("Error:", xhr, status, error);
                // Show a general error message to the user
                Swal.fire({
                    icon: "error",
                    text: "An error occurred while processing your request.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            }
        },
    });
});

function initialPageLoad(providerDoctorId) {
    $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/edit-provider-doctor/" + providerDoctorId,
        type: "GET",
        success: function (response) {
            $("#loader-overlay").hide();
            if (response.status) {
                console.log(response);

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

                if (response.data.profilePicture) {
                    let profilePicUrl = response.data.profilePicture;
                    document.getElementById("imagePreview").src = profilePicUrl;
                    document.getElementById(
                        "imagePreviewContainer",
                    ).style.display = "block";
                }

                if (response.data.signImage) {
                    let signImageUrl = response.data.signImage;
                    document.getElementById("signaturePreview").src =
                        signImageUrl;
                    document.getElementById(
                        "signaturePreviewContainer",
                    ).style.display = "block";
                }

                document.getElementById("employeeId").value = providerDoctorId;
            }
        },
        error: function () {
            $("#loader-overlay").hide();
            console.error("Error fetching doctor details.");
        },
    });
}
