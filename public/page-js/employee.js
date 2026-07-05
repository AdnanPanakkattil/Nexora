$(document).ready(function () {
    $(".selectpicker").selectpicker();

    $("#administration_main_menu").addClass("active open menu-item-animating");
    $("#employee_reg_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    if ($("#doctor_edit_id").val()) {
        initialPageLoad($("#doctor_edit_id").val());
    }

    flatpickr(".joined_date", {
        dateFormat: "Y-m-d",
        maxDate: "today",
    });

    flatpickr(".license_issue_date", {
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

    // Function to populate select options
    function populateSelect(url, selectId) {
        $.ajax({
            url: BASE_URL + url,
            type: "GET",
            success: function (response) {
                var select = $(selectId);
                select.empty();
                select.append('<option value="">Select</option>');
                $.each(response, function (id, name) {
                    select.append(
                        '<option value="' + id + '">' + name + "</option>",
                    );
                });
            },
            error: function (xhr, status, error) {
                console.error(
                    `Error fetching ${selectId.substring(1)}:`,
                    error,
                );
            },
        });
    }

    // Check username availability
    $("#username").on("keyup", function () {
        var username = $(this).val();
        $.ajax({
            url: BASE_URL + "/check-username-already-exist",
            type: "GET",
            data: { username: username },
            success: function (response) {
                if (response.status === true) {
                    $(".username_error").text(
                        "This username is already taken.",
                    );
                } else {
                    $(".username_error").text("");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error checking username:", error);
            },
        });
    });

    $("#enable_insurance").on("change", function () {
        let scfhs = $("#scfhs").val().trim();
        let practiceCode = $("#practiceCode").val();
        let hasError = false;
        if ($(this).is(":checked") && scfhs === "") {
            $(".SCHSNumber_error").text(
                "Practitioner licence number (SCFHS) is required for enable insurance",
            );
            hasError = true;
        }
        if ($(this).is(":checked") && practiceCode === "") {
            $(".practiceCode_error").text(
                "Practice code is required for enable insurance",
            );
            hasError = true;
        }
        if (hasError) {
            $(this).prop("checked", false);
        }
    });
    $("#scfhs").on("keyup change", function () {
        if ($(this).val().trim() !== "") {
            $(".SCHSNumber_error").text("");
        }
    });
    $("#practiceCode").on("change", function () {
        if ($(this).val() !== "") {
            $(".practiceCode_error").text("");
        }
    });
});

// Success alert function
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

$(document).on("click", "#saveButton", function (e) {
    e.preventDefault();
    var formData = new FormData($("#doctor_form")[0]);
    $("#loader-overlay").show();
    $.ajax({
        url: $("#doctor_form").attr("action"),
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

function initialPageLoad(doctorEditId) {
    $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/edit-doctor/" + doctorEditId,
        type: "GET",
        success: function (response) {
            $("#loader-overlay").hide();
            if (response.status) {
                console.log(response);
                console.log(response.data.practiceCode);

                $("#practiceCode").val(response.data.practiceCode).trigger("change");

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

                if (response.data.insuranceCovered == 1) {
                    $("#enable_insurance").prop("checked", true);
                } else {
                    $("#enable_insurance").prop("checked", false);
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
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: response.message || "Failed to load doctor data.",
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
                text: xhr.responseJSON?.message || "Something went wrong while loading doctor data.",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
                buttonsStyling: false,
            });
        },
    });
}

$(document).on("click", "#fetchDoctor", function () {
    let identifierType = $('select[name="identifier_type"]').val();
    let identifierId = $('input[name="identifier_id"]').val();

    if (!identifierType || !identifierId) {
        Swal.fire({
            icon: "warning",
            title: "Missing Information",
            text: "Please enter Identifier Type and Identifier ID",
            customClass: {
                confirmButton: "btn btn-warning waves-effect waves-light",
            },
        });
        return;
    }

    $.ajax({
        url: "/get-doctor-info",
        method: "GET",
        data: {
            identifier_type: identifierType,
            identifier_id: identifierId,
        },

        beforeSend: function () {
            $("#loader-overlay").show();
            $("#fetchDoctor").prop("disabled", true);
        },
        success: function (res) {
            if (!res.success || !res.data?.practitioner) {
                Swal.fire({
                    icon: "warning",
                    title: "Not found",
                    text: res.message || "Doctor not found",
                    customClass: {
                        confirmButton:
                            "btn btn-warning waves-effect waves-light",
                    },
                });
                return;
            }

            const p = res.data.practitioner;
            const scfhs = p.scfhs ?? {};

            $("#health_id").val(p.health_id ?? "");

            $("#firstName_en").val(p.first_name_en ?? "");
            $("#secondName_en").val(p.second_name_en ?? "");
            $("#lastName_en").val(p.last_name_en ?? "");

            $("#firstName_ar").val(p.first_name_ar ?? "");
            $("#secondName_ar").val(p.second_name_ar ?? "");
            $("#lastName_ar").val(p.last_name_ar ?? "");

            $("#religion").val(p.Religion ?? "");
            $("#National_identity").val(p.id_number ?? "");
            $("#nationalityId")
                .val(p.nationality_code ?? "")
                .trigger("change");

            let gender = p.gender_code ? p.gender_code.toLowerCase() : "";
            $("#gender").val(gender).trigger("change");

            $("#scfhs").val(scfhs.registration_number ?? "");

            $("#license_issue_date").val(scfhs.license_issue_date ?? "");
            $("#license_expiry_date").val(scfhs.license_expiry_date ?? "");
            $("#license_restrictions_list").val(
                scfhs.license_restrictions_list ?? "",
            );

            let rankValue = $("#rank option")
                .filter(function () {
                    return $(this).text().trim() === scfhs.rank_name_en;
                })
                .val();

            if (rankValue) {
                $("#rank").val(rankValue).trigger("change");
            }

            let fieldValue = $("#field option")
                .filter(function () {
                    return $(this).text().trim() === scfhs.field_name_en;
                })
                .val();

            if (fieldValue) {
                $("#field").val(fieldValue).trigger("change");
            }

            let specialityValue = $("#speciality option")
                .filter(function () {
                    return $(this).text().trim() === scfhs.specialty_name_en;
                })
                .val();

            if (specialityValue) {
                $("#speciality").val(specialityValue).trigger("change");
            }

            let status_codeValue = $("#status_code option")
                .filter(function () {
                    return $(this).text().trim() === scfhs.status_desc_en;
                })
                .val();

            if (status_codeValue) {
                $("#status_code").val(status_codeValue).trigger("change");
            }

            let license_status_codeValue = $("#license_status_code option")
                .filter(function () {
                    return (
                        $(this).text().trim() === scfhs.license_status_desc_en
                    );
                })
                .val();

            if (license_status_codeValue) {
                $("#license_status_code")
                    .val(license_status_codeValue)
                    .trigger("change");
            }

            let sub_specialities_listValue = $("#sub_specialities_list option")
                .filter(function () {
                    return (
                        $(this).text().trim() === scfhs.sub_specialty_name_en
                    );
                })
                .val();

            if (sub_specialities_listValue) {
                $("#sub_specialities_list")
                    .val(sub_specialities_listValue)
                    .trigger("change");
            }

            let nationalityIdValue = $("#nationalityId option")
                .filter(function () {
                    return $(this).text().trim() === p.nationality_en;
                })
                .val();

            if (nationalityIdValue) {
                $("#nationalityId").val(nationalityIdValue).trigger("change");
            }
        },

        complete: function () {
            $("#loader-overlay").hide();
            $("#fetchDoctor").prop("disabled", false).text("Submit");
        },
        error: function (e) {
            $("#loader-overlay").hide();
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Server error while fetching doctor info",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        },
    });
});

$(document).ready(function () {
    // selectpicker dropdown menu width
    $('#templateServiceId , #speciality ,#sub_specialities_list').on('shown.bs.select', function () {
        $(this).closest('.bootstrap-select')
               .find('.dropdown-menu')
               .css('width', '100%');
    });
});
$("#firstName_en,#secondName_en,#thirdName_en,#lastName_en").on("input", function () {
        this.value = this.value.replace(/[^a-zA-Z\s]/g, "");
    });

    $("#firstName_ar,#secondName_ar,#thirdName_ar,#lastName_ar").on("input", function () {
        this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, "");
    });
