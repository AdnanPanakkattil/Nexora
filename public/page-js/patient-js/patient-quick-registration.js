$(document).ready(function () {
    $("#patient_main_menu").addClass("active open menu-item-animating");
    $("#patient-quick-registration_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    flatpickr("#birthDate", {
        dateFormat: "d-m-Y",
        allowInput: true,
        maxDate: "today",
    });

    $("#cityId").select2("destroy");
    $("#cityId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            placeholder: "Select City",
            dropdownParent: $("#cityId").parent(),
            width: "100%",
            allowClear: true,
            minimumInputLength: 2,
            ajax: {
                url: BASE_URL + "/get-cities",
                dataType: "json",
                delay: 300,
                data: (params) => ({
                    search: params.term,
                    page: params.page || 1,
                }),
                processResults: (data) => data,
            },
        });

    if ($("#districtId").data("select2")) {
        $("#districtId").select2("destroy");
    }
    $("#districtId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            placeholder: "Select District",
            dropdownParent: $("#districtId").parent(),
            width: "100%",
            allowClear: true,
        });

    $("#cityId").on("change", function () {
        const cityId = $(this).val();
        getDistricts(cityId);
    });

    function getDistricts(cityId) {
        $("#loader-overlay").show();
        const districtDropdown = $("#districtId");
        if (districtDropdown.data("select2")) {
            districtDropdown.select2("destroy");
        }
        if (!cityId) {
            districtDropdown.empty().append('<option value="">Select</option>');
            districtDropdown
                .wrap('<div class="position-relative"></div>')
                .select2({
                    placeholder: "Select District",
                    dropdownParent: districtDropdown.parent(),
                    width: "100%",
                    allowClear: true,
                });
            $("#loader-overlay").hide();
            return;
        }
        $.ajax({
            url: BASE_URL + "/get-districts",
            type: "GET",
            data: { cityId: cityId },
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status) {
                    districtDropdown.empty();
                    districtDropdown.append('<option value="">Select</option>');
                    $.each(response.data, function (key, value) {
                        districtDropdown.append(
                            `<option value="${key}">${value}</option>`,
                        );
                    });
                    if (
                        !districtDropdown.parent().hasClass("position-relative")
                    ) {
                        districtDropdown.wrap(
                            '<div class="position-relative"></div>',
                        );
                    }
                    districtDropdown.select2({
                        placeholder: "Select District",
                        dropdownParent: districtDropdown.parent(),
                        width: "100%",
                        allowClear: true,
                    });
                    const selectedDistrictId = $("#selected_district_id").val();
                    if (selectedDistrictId) {
                        districtDropdown
                            .val(selectedDistrictId)
                            .trigger("change");
                    }
                } else {
                    console.error(
                        "Failed to retrieve districts:",
                        response.message,
                    );
                }
            },
            error: function (xhr, status, error) {
                $("#loader-overlay").hide();
                console.error("AJAX Error:", status, error);
            },
        });
    }

    // Submit button
    $("#submitpatientquickregistration").on("click", function () {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to submit this patient details?",
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
            if (result.isConfirmed) {
                var formData = $(
                    "#patient_quick_registration_form",
                ).serialize();
                $("#loader-overlay").show();
                $.ajax({
                    url: BASE_URL + "/store-patient-quick-registration",
                    method: "POST",
                    data: formData,
                    dataType: "json",
                    success: function (response) {
                        $("#loader-overlay").hide();
                        if (response.status === true) {
                            Swal.fire({
                                icon: "success",
                                title: "Success!",
                                text: response.message,
                                customClass: {
                                    confirmButton:
                                        "btn btn-success waves-effect waves-light",
                                },
                            }).then(function () {
                                clearQuickPatientPageAndReload();
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Error!",
                                text:
                                    response.message ||
                                    "Failed to submit patient data",
                                customClass: {
                                    confirmButton:
                                        "btn btn-primary waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function (xhr) {
                        $("#loader-overlay").hide();
                        if (xhr.status === 422) {
                            var errors = xhr.responseJSON.errors;
                            $(".error-text").each(function () {
                                $(this).text("");
                            });
                            $.each(errors, function (key, messages) {
                                $("." + key + "_error").text(messages[0]);
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Unexpected Error!",
                                text: "Please try again later.",
                                customClass: {
                                    confirmButton:
                                        "btn btn-primary waves-effect waves-light",
                                },
                            });
                        }
                        $("#loader-overlay").hide();
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Please verify the patient details.",
                    icon: "info",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });

    function clearQuickPatientPageAndReload() {
        localStorage.clear();
        $("#idNationalType").val("");
        $("#idNational").val("");
        $("#nationalityId").val("");
        $("#clientName_en").val("");
        $("#secondName_en").val("");
        $("#thirdName_en").val("");
        $("#fourthName_en").val("");
        $("#clientName").val("");
        $("#secondName_ar").val("");
        $("#thirdName_ar").val("");
        $("#fourthName_ar").val("");
        $("#gender").val("");
        $("#mobile").val("");
        $("#maritalStatus").val("");
        $("#religion").val("");
        $("#birthDate").val("");
        $("#address").val("");
        $("#cityId").val("");
        $("#districtId").val("");
        $.ajax({
            url: BASE_URL + "/patient-clear-session",
            method: "POST",
            success: function (response) {
                if (response.status === true) {
                    console.log("Session data cleared successfully.");
                    location.reload();
                } else {
                    console.error(
                        "Failed to clear session data:",
                        response.message,
                    );
                }
            },
            error: function (xhr, status, error) {
                console.error("Error clearing session data:", error);
            },
        });
        $(".selectpicker").selectpicker("refresh");
    }
});
