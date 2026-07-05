$(document).ready(function() {
    $("#application_main_menu").addClass("active open menu-item-animating");
    $("#application_providers_sub_menu").addClass("active");
    
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    if ($("#provider_nurse_edit_id").val()) {
        initialPageLoad($("#provider_nurse_edit_id").val());
    }

    $('#permission_group_div').hide();

    $('#permissionGroupBtn').change(function () {
        if ($(this).is(':checked')) {
            $('#permissionGroupId').parent().show();
            $('#permissionMenu').hide();
            $('#permission_group_div').removeAttr('style');
        } else {
            $('#permissionGroupId').parent().hide();
            $('#permissionMenu').show();
        }
    });
});

$("#username").on("keyup", function () {
    var username = $(this).val();
    $.ajax({
        url: BASE_URL + "/check-username-already-exist",
        type: "GET",
        data: { username: username },
        success: function (response) {
            $(".username_error").text(response.status ? "This username is already taken." : "");
        },
    });
});

function saveSuccessSweetAlert(message, redirectUrl = null) {
    Swal.fire({
        icon: "success",
        text: message,
        customClass: { confirmButton: "btn btn-success waves-effect waves-light" },
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
    var form = $("#nurse_form");
    var formData = new FormData(form[0]);
    var actionUrl = form.attr("action");
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
        error: function (xhr) {
            $("#loader-overlay").hide();
            if (xhr.status === 422) {
                var errors = xhr.responseJSON.errors;
                $(".error-text").text("");
                $.each(errors, function (key, value) {
                    $("." + key + "_error").text(value[0]);
                });
            } else {
                Swal.fire({
                    icon: "error",
                    text: "An error occurred while processing your request.",
                    customClass: { confirmButton: "btn btn-danger waves-effect waves-light" },
                });
            }
        },
    });
});

function initialPageLoad(providerNurseId) {
    $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/edit-provider-nurse/" + providerNurseId,
        type: "GET",
        success: function (response) {
            $("#loader-overlay").hide();
            if (response.status) {
                console.log(response);
                
                if (response.data.is_groupPermission == 1) {
                    $("#permissionGroupId").parent().show();
                    $("#permissionMenu").hide();
                    $("#permissionGroupId").val(response.data.clinicsPermissionGroupId);
                    $("#permissionGroupBtn").prop("checked", true);
                } else {
                    const permissions = response.data.permissions.split(",");
                    permissions.forEach(permission => { $(`#${permission}`).prop("checked", true); });
                }
                
                if (response.data.profilePicture) {
                    $('#imagePreview').attr('src', response.data.profilePicture);
                    $('#imagePreviewContainer').show();
                }
                
                if (response.data.signImage) {
                    $('#signaturePreview').attr('src', response.data.signImage);
                    $('#signaturePreviewContainer').show();
                }
                
                $('#employeeId').val(providerNurseId);
            }
        },
        error: function () {
            $("#loader-overlay").hide();
            console.error("Error fetching nurse details.");
        }
    });
}
