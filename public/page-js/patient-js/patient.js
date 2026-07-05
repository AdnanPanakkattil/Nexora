let isLoadingEditData = false;
function loadPolicyChain(
    payerId,
    insuranceCompanyId,
    payerType,
    policyId,
    classId,
    insuranceTpaCompanyId = null,
) {
    if (!payerId) {
        isLoadingEditData = false;
        AllDataDisplay();
        return;
    }
    if (payerType !== "TPA_company" && !insuranceCompanyId) {
        isLoadingEditData = false;
        AllDataDisplay();
        return;
    }
    if (policyId) {
        $("#relationshipTypeDiv").show();
    }
    $("#insurancePolicy").html('<option value="">Select Policy</option>');
    $("#insuranceClass").html('<option value="">Select Class</option>');
    $("#insuranceTpaCompanyDiv").hide();
    if (payerType === "TPA_company" && insuranceCompanyId) {
        $("#insuranceTpaCompanyDiv").show();
        toggleLoader("policy", true);
        $.ajax({
            url: "/get-tpa-companies/" + insuranceCompanyId,
            type: "GET",
            success: function (res) {
                toggleLoader("policy", false);
                if (res.status && res.data.length > 0) {
                    let options =
                        '<option value="">Select TPA Company</option>';
                    $.each(res.data, function (i, tpa) {
                        options += `<option value="${tpa.insuranceTpaCompanyId}">${tpa.tpaNameEn}</option>`;
                    });
                    $("#insuranceTpaCompany")
                        .html(options)
                        .trigger("change.select2");
                } else {
                    $("#insuranceTpaCompany")
                        .html(
                            '<option value="">No TPA Companies Found</option>',
                        )
                        .trigger("change.select2");
                }
                if (insuranceTpaCompanyId) {
                    setTimeout(() => {
                        $("#insuranceTpaCompany")
                            .val(insuranceTpaCompanyId)
                            .trigger("change.select2");
                        AllDataDisplay();
                    }, 100);
                }
                if (insuranceTpaCompanyId) {
                    toggleLoader("policy", true);
                    $.ajax({
                        url: "/get-policies-by-tpa/" + insuranceTpaCompanyId,
                        type: "GET",
                        success: function (res) {
                            toggleLoader("policy", false);
                            if (res.status && res.data.length > 0) {
                                let options =
                                    '<option value="">Select Policy</option>';
                                $.each(res.data, function (i, policy) {
                                    options += `<option value="${policy.id}">${policy.name} (${policy.number})</option>`;
                                });

                                $("#insurancePolicy")
                                    .html(options)
                                    .trigger("change.select2");
                            }
                            if (policyId) {
                                setTimeout(() => {
                                    $("#insurancePolicy")
                                        .val(policyId)
                                        .trigger("change.select2");
                                    AllDataDisplay();
                                }, 100);
                            }
                            if (policyId && classId) {
                                toggleLoader("policy", true);
                                $.ajax({
                                    url: "/get-classes/" + policyId,
                                    type: "GET",
                                    success: function (res) {
                                        toggleLoader("policy", false);
                                        if (res.status && res.data.length > 0) {
                                            let options =
                                                '<option value="">Select Class</option>';
                                            $.each(res.data, function (i, cls) {
                                                options += `<option value="${cls.id}">${cls.name}</option>`;
                                            });

                                            $("#insuranceClass")
                                                .html(options)
                                                .trigger("change.select2");
                                        }
                                        setTimeout(() => {
                                            $("#insuranceClass")
                                                .val(classId)
                                                .trigger("change.select2");
                                            AllDataDisplay();
                                        }, 100);
                                        isLoadingEditData = false;
                                    },
                                    error: function () {
                                        toggleLoader("policy", false);
                                        isLoadingEditData = false;
                                        AllDataDisplay();
                                    },
                                });
                            } else {
                                isLoadingEditData = false;
                                AllDataDisplay();
                            }
                        },
                        error: function () {
                            toggleLoader("policy", false);
                            isLoadingEditData = false;
                            AllDataDisplay();
                        },
                    });
                } else {
                    isLoadingEditData = false;
                    AllDataDisplay();
                }
            },
            error: function () {
                toggleLoader("policy", false);
                isLoadingEditData = false;
                AllDataDisplay();
            },
        });
    } else if (payerType !== "TPA_company" && insuranceCompanyId) {
        $("#insuranceTpaCompanyDiv").hide();
        toggleLoader("policy", true);
        $.ajax({
            url: "/get-policies/" + insuranceCompanyId,
            type: "GET",
            success: function (res) {
                toggleLoader("policy", false);
                if (res.status && res.data.length > 0) {
                    let options = '<option value="">Select Policy</option>';
                    $.each(res.data, function (i, policy) {
                        options += `<option value="${policy.id}">${policy.name} (${policy.number})</option>`;
                    });
                    $("#insurancePolicy")
                        .html(options)
                        .trigger("change.select2");
                }
                if (policyId) {
                    setTimeout(() => {
                        $("#insurancePolicy")
                            .val(policyId)
                            .trigger("change.select2");
                        AllDataDisplay();
                    }, 100);
                }
                if (policyId && classId) {
                    toggleLoader("policy", true);
                    $.ajax({
                        url: "/get-classes/" + policyId,
                        type: "GET",
                        success: function (res) {
                            toggleLoader("policy", false);
                            if (res.status && res.data.length > 0) {
                                let options =
                                    '<option value="">Select Class</option>';
                                $.each(res.data, function (i, cls) {
                                    options += `<option value="${cls.id}">${cls.name}</option>`;
                                });
                                $("#insuranceClass")
                                    .html(options)
                                    .trigger("change.select2");
                            }
                            setTimeout(() => {
                                $("#insuranceClass")
                                    .val(classId)
                                    .trigger("change.select2");
                                AllDataDisplay();
                            }, 100);
                            isLoadingEditData = false;
                        },
                        error: function () {
                            toggleLoader("policy", false);
                            isLoadingEditData = false;
                            AllDataDisplay();
                        },
                    });
                } else {
                    isLoadingEditData = false;
                    AllDataDisplay();
                }
            },
            error: function () {
                toggleLoader("policy", false);
                isLoadingEditData = false;
                AllDataDisplay();
            },
        });
    } else {
        isLoadingEditData = false;
        AllDataDisplay();
    }
}

$(document).ready(function () {
    $("#patient_main_menu").addClass("active open menu-item-animating");
    $("#patient_registration_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#insuranceTpaCompanyDiv").hide();
    $("#relationshipTypeDiv").hide();
    $("#relatedMrnDiv").hide();

    function handleFinancialCategoryChange() {
        var isCash = $('#financial_category').val() === 'cash';
        var $form = $('#financial_Form');

        $form.find('input, select, textarea, button')
            .not('#financial_category, input[type="hidden"], .btn-prev, .btn-next')
            .prop('disabled', isCash);
          $form.find('.select2').not('#financial_category').each(function() {
            $(this).prop('disabled', isCash);
        });
        
        var $fieldsContainer = $form.find('.col-3, .col-sm-3').not(':has(#financial_category)');
        if (isCash) {
            $fieldsContainer.addClass('d-none');
        } else {
            $fieldsContainer.removeClass('d-none');
        }
    }

    let previousFinancialCategory = $('#financial_category').val();

    $(document).on('change', '#financial_category', function(e, isReverting) {
        if (isReverting) return;
        
        const currentCategory = $(this).val();
        const $fields = $('#financial_Form').find('input, select, textarea').not('#financial_category, input[type="hidden"], .btn-prev, .btn-next');
        
        const proceedToCash = () => {
            $fields.val(''); 
            $fields.filter('select').trigger('change.select2');
            previousFinancialCategory = 'cash';
            handleFinancialCategoryChange();
        };

        if (previousFinancialCategory === 'insurance' && currentCategory === 'cash') {
            const hasData = $fields.filter(function() { return $(this).val(); }).length > 0;
            
            if (hasData) {
                Swal.fire({
                    title: "Are you sure?", 
                    text: "Changing the category will permanently remove the insurance data you've already entered. Continue?", 
                    icon: "warning",
                    showCancelButton: true, 
                    confirmButtonText: "Yes, clear it!",
                    customClass: { confirmButton: "btn btn-danger me-3", cancelButton: "btn btn-label-secondary" }, 
                    buttonsStyling: false
                }).then(res => {
                    if (res.value) {
                        proceedToCash();
                    } else {
                        $('#financial_category').val('insurance').trigger('change', [true]);
                        if ($('#financial_category').hasClass('select2-hidden-accessible')) {
                            $('#financial_category').trigger('change.select2');
                        }
                    }
                });
            } else {
                proceedToCash();
            }
        } else {
            previousFinancialCategory = currentCategory;
            handleFinancialCategoryChange();
        }
    });

    if ($('#financial_category').length > 0) {
        setTimeout(function() {
            previousFinancialCategory = $('#financial_category').val();
            handleFinancialCategoryChange();
        }, 100);
    }

    flatpickr("#birthDate", {
        dateFormat: "d-m-Y",
        allowInput: true,
        maxDate: "today",
    });
    flatpickr(".dob-picker", {
        dateFormat: "Y-m-d",
        allowInput: true,
        disableMobile: true,
        onReady: function (selectedDates, dateStr, instance) {
            const arrows = instance.calendarContainer.querySelectorAll(
                ".arrowUp, .arrowDown",
            );
            arrows.forEach((arrow) => {
                arrow.style.display = "none";
            });
        },
    });
    flatpickr("#hafiza_date", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });

    var imageBaseUrl = "{{ asset('images') }}";
    var localStorageClientId = $("#client_id").val();
    let isEditMode = false;
    if ($("#client_id").val()) {
        loadEditPatientTabData($("#client_id").val());
    }
    $(".step-trigger").click(function () {
        var targetStep = $(this).closest(".step").data("target");
        // var localStorageClientId = $("#client_id").val();
        // if (localStorageClientId) {
        //     // loadEditPatientTabData(localStorageClientId);
        // }
        if (targetStep === "#patient-registration-details") {
            $("#address-information-tab").removeClass("active");
            $("#address-information-details").removeClass(
                "dstepper-block active",
            );
            $("#financial-information-tab").removeClass("active");
            $("#financial-information-details").removeClass(
                "dstepper-block active",
            );
            $("#birth-information-tab").removeClass("active");
            $("#birth-information-details").removeClass(
                "dstepper-block active",
            );
            $("#patient-registration-tab").addClass("active");
            $("#patient-registration-details").addClass(
                "dstepper-block active",
            );
            $("#others-data-tab").removeClass("active");
            $("#others-data-details").removeClass("dstepper-block active");
            $("#all-data-tab").removeClass("active");
            $("#all-data-details").removeClass("dstepper-block active");
        } else if (targetStep === "#birth-information-details") {
            $("#address-information-tab").removeClass("active");
            $("#address-information-details").removeClass(
                "dstepper-block active",
            );
            $("#financial-information-tab").removeClass("active");
            $("#financial-information-details").removeClass(
                "dstepper-block active",
            );
            $("#birth-information-tab").addClass("active");
            $("#birth-information-details").addClass("dstepper-block active");
            $("#patient-registration-tab").removeClass("active");
            $("#patient-registration-details").removeClass(
                "dstepper-block active",
            );
            $("#others-data-tab").removeClass("active");
            $("#others-data-details").removeClass("dstepper-block active");
            $("#all-data-tab").removeClass("active");
            $("#all-data-details").removeClass("dstepper-block active");
        } else if (targetStep === "#financial-information-details") {
            $("#address-information-tab").removeClass("active");
            $("#address-information-details").removeClass(
                "dstepper-block active",
            );
            $("#financial-information-tab").addClass("active");
            $("#financial-information-details").addClass(
                "dstepper-block active",
            );
            $("#birth-information-tab").removeClass("active");
            $("#birth-information-details").removeClass(
                "dstepper-block active",
            );
            $("#patient-registration-tab").removeClass("active");
            $("#patient-registration-details").removeClass(
                "dstepper-block active",
            );
            $("#others-data-tab").removeClass("active");
            $("#others-data-details").removeClass("dstepper-block active");
            $("#all-data-tab").removeClass("active");
            $("#all-data-details").removeClass("dstepper-block active");
        } else if (targetStep === "#address-information-details") {
            if ($("#selected_city_id").val()) {
                getDistricts($("#selected_city_id").val());
            }
            $("#address-information-tab").addClass("active");
            $("#address-information-details").addClass("dstepper-block active");
            $("#financial-information-tab").removeClass("active");
            $("#financial-information-details").removeClass(
                "dstepper-block active",
            );
            $("#birth-information-tab").removeClass("active");
            $("#birth-information-details").removeClass(
                "dstepper-block active",
            );
            $("#patient-registration-tab").removeClass("active");
            $("#patient-registration-details").removeClass(
                "dstepper-block active",
            );
            $("#others-data-tab").removeClass("active");
            $("#others-data-details").removeClass("dstepper-block active");
            $("#all-data-tab").removeClass("active");
            $("#all-data-details").removeClass("dstepper-block active");
        } else if (targetStep === "#others-data-details") {
            $("#others-data-tab").addClass("active");
            $("#others-data-details").addClass("dstepper-block active");
            $("#address-information-tab").removeClass("active");
            $("#address-information-details").removeClass(
                "dstepper-block active",
            );
            $("#financial-information-tab").removeClass("active");
            $("#financial-information-details").removeClass(
                "dstepper-block active",
            );
            $("#birth-information-tab").removeClass("active");
            $("#birth-information-details").removeClass(
                "dstepper-block active",
            );
            $("#patient-registration-tab").removeClass("active");
            $("#patient-registration-details").removeClass(
                "dstepper-block active",
            );
            $("#all-data-tab").removeClass("active");
            $("#all-data-details").removeClass("dstepper-block active");
        } else if (targetStep === "#all-data-details") {
            $(".patient-registration-div").show();
            if (
                $("#id_data_flag").val() === "1" ||
                $("#id_data_flag").val() === 1
            ) {
                $(".id-data-div").show();
            }
            if (
                $("#birth_info_flag").val() === "1" ||
                $("#birth_info_flag").val() === 1
            ) {
                $(".birth-info-div").show();
            }
            if (
                $("#financial_info_flag").val() === "1" ||
                $("#financial_info_flag").val() === 1
            ) {
                $(".financial-info-div").show();
            }
            if (
                $("#address_info_flag").val() === "1" ||
                $("#address_info_flag").val() === 1
            ) {
                $(".address-info-div").show();
            }
            if (
                $("#others_data_flag").val() === "1" ||
                $("#others_data_flag").val() === 1
            ) {
                $(".others-data-div").show();
            }
            $("#all-data-tab").addClass("active");
            $("#all-data-details").addClass("dstepper-block active");
            $("#others-data-tab").removeClass("active");
            $("#others-data-details").removeClass("dstepper-block active");
            $("#address-information-tab").removeClass("active");
            $("#address-information-details").removeClass(
                "dstepper-block active",
            );
            $("#financial-information-tab").removeClass("active");
            $("#financial-information-details").removeClass(
                "dstepper-block active",
            );
            $("#birth-information-tab").removeClass("active");
            $("#birth-information-details").removeClass(
                "dstepper-block active",
            );
            $("#patient-registration-tab").removeClass("active");
            $("#patient-registration-details").removeClass(
                "dstepper-block active",
            );
        }
    });

    $(document).on("input", "#maxcopay", function () {
        let maxcopayValue = $(this).val();
        $(".maxDeductibleRateLimit").each(function (index) {
            let $row = $(this).closest(".row");
            let copaymentMaximum = $row
                .find('input[name="copaymentMaximum[]"]')
                .val();
            if (copaymentMaximum === "depend_on_copayment_maximum") {
                $(this).val(maxcopayValue);
            }
        });
    });

    $(document).on("input", "#copaypct", function () {
        let maxcopayValue = $(this).val();
        $(".deductibleRate").each(function (index) {
            $(this).val(maxcopayValue);
        });
    });

    $("#cityId").on("change", function () {
        const cityId = $(this).val();
        getDistricts(cityId);
    });

    $("#reg_form").on("submit", function (event) {
        event.preventDefault();
        var formData = $(this).serialize();
        var clientIdFromStorage = $("#client_id").val();
        console.log(clientIdFromStorage);
        var clientId = clientIdFromStorage
            ? clientIdFromStorage
            : $("#client_id").val();
        if (clientId) {
            formData += "&clientId=" + encodeURIComponent(clientId);
        }
        // var url = clientId ? "" : BASE_URL + "/patient";
        // if (clientId) {
        //     saveSuccessSweetAlert(
        //         isEditMode ? "Updated successfully." : "Saved successfully.",
        //         "birth_information"
        //     );
        //     return;
        // }
        // var method = clientId ? "" : "POST";
        var url = clientId
            ? BASE_URL + "/patient-registration-update/" + clientId
            : BASE_URL + "/patient";
        var method = clientId ? "PUT" : "POST";
        $.ajax({
            url: url,
            method: method,
            data: formData,
            success: function (response) {
                saveSuccessSweetAlert(
                    isEditMode
                        ? "Updated successfully."
                        : "Saved successfully.",
                    "birth_information",
                );
            },
            error: function (xhr) {
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
    $("#birth_Form").on("submit", function (event) {
        event.preventDefault();
        var formData = $(this).serialize();
        var clientIdFromStorage = $("#client_id").val();
        var clientId = clientIdFromStorage
            ? clientIdFromStorage
            : $("#client_id").val();
        // var url = BASE_URL + "/patient";
        // if (clientId) {
        //     saveSuccessSweetAlert(
        //         isEditMode ? "Updated successfully." : "Saved successfully.",
        //         "financial_information"
        //     );
        //     return;
        // }
        // var method = clientId ? "" : "POST";
        var url = clientId
            ? BASE_URL + "/patient-registration-update/" + clientId
            : BASE_URL + "/patient";
        var method = clientId ? "PUT" : "POST";
        $.ajax({
            url: url,
            method: method,
            data: formData,
            success: function (response) {
                saveSuccessSweetAlert(
                    isEditMode
                        ? "Updated successfully."
                        : "Saved successfully.",
                    "financial_information",
                );
            },
            error: function (xhr, status, error) {
                if (xhr.status === 422) {
                    $("#birth_Form").modal("hide");
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
    $("#financial_Form").on("submit", function (event) {
        event.preventDefault();
        var formData = $(this).serialize();
        var clientIdFromStorage = $("#client_id").val();
        var clientId = clientIdFromStorage
            ? clientIdFromStorage
            : $("#client_id").val();
        // var url = clientId ? "" : BASE_URL + "/patient";
        // if (clientId) {
        //     saveSuccessSweetAlert(
        //         isEditMode ? "Updated successfully." : "Saved successfully.",
        //         "address_information"
        //     );
        //     return 0;
        // }
        // var method = clientId ? "" : "POST";
        var url = clientId
            ? BASE_URL + "/patient-registration-update/" + clientId
            : BASE_URL + "/patient";
        var method = clientId ? "PUT" : "POST";
        $.ajax({
            url: url,
            method: method,
            data: formData,
            success: function (response) {
                $(".form-label").removeClass("labe").addClass("labez");
                saveSuccessSweetAlert(
                    isEditMode
                        ? "Updated successfully."
                        : "Saved successfully.",
                    "address_information",
                );
            },
            error: function (xhr) {
                $(".form-label").removeClass("labe").addClass("labez");
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                        let field = $("[name='" + key + "']");
                        let formGroup = field.closest(
                            ".col-3, .col-sm-3, .col-4, .col-6, .col-12",
                        );
                        formGroup
                            .find(".form-label")
                            .removeClass("labez")
                            .addClass("labe");
                    });
                } else {
                    console.error("Error:", xhr);
                }
            },
        });
    });
    $("#address_Form").on("submit", function (event) {
        event.preventDefault();
        var formData = $(this).serialize();
        var clientIdFromStorage = $("#client_id").val();
        var clientId = clientIdFromStorage
            ? clientIdFromStorage
            : $("#client_id").val();
        // var url = clientId ? "" : BASE_URL + "/patient";
        // if (clientId) {
        //     saveSuccessSweetAlert(
        //         isEditMode ? "Updated successfully." : "Saved successfully.",
        //         "others_data"
        //     );
        //     return 0;
        // }
        // var method = clientId ? "" : "POST";
        var url = clientId
            ? BASE_URL + "/patient-registration-update/" + clientId
            : BASE_URL + "/patient";
        var method = clientId ? "PUT" : "POST";
        $.ajax({
            url: url,
            method: method,
            data: formData,
            success: function (response) {
                saveSuccessSweetAlert(
                    isEditMode
                        ? "Updated successfully."
                        : "Saved successfully.",
                    "others_data",
                );
            },
            error: function (xhr, status, error) {
                if (xhr.status === 422) {
                    $("#address_Form").modal("hide");
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
    $("#others_data_Form").on("submit", function (event) {
        event.preventDefault();
        var formData = $(this).serialize();
        var clientIdFromStorage = $("#client_id").val();
        var clientId = clientIdFromStorage
            ? clientIdFromStorage
            : $("#client_id").val();
        // var url = clientId ? "" : BASE_URL + "/patient";
        // if (clientId) {
        //     saveSuccessSweetAlert(
        //         isEditMode ? "Updated successfully." : "Saved successfully.",
        //         "all_data"
        //     );
        //     return 0;
        // }
        // var method = clientId ? "" : "POST";
        var url = clientId
            ? BASE_URL + "/patient-registration-update/" + clientId
            : BASE_URL + "/patient";
        var method = clientId ? "PUT" : "POST";
        $.ajax({
            url: url,
            method: method,
            data: formData,
            success: function (response) {
                saveSuccessSweetAlert(
                    isEditMode
                        ? "Updated successfully."
                        : "Saved successfully.",
                    "all_data",
                );
            },
        });
    });

    $("#submit_all").on("click", function () {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to submit this patent details?",
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
                toggleLoader("update", true);
                var formData = {};
                var clientIdFromStorage = $("#client_id").val();
                var clientId = clientIdFromStorage
                    ? clientIdFromStorage
                    : $("#client_id").val();
                $(
                    "#address_Form, #birth_Form, #financial_Form, #others_data_Form, #reg_form",
                ).each(function () {
                    var serializedForm = $(this).serializeArray();
                    $.each(serializedForm, function () {
                        if (formData[this.name] !== undefined) {
                            if (!formData[this.name].push) {
                                formData[this.name] = [formData[this.name]];
                            }
                            formData[this.name].push(this.value || "");
                        } else {
                            formData[this.name] = this.value || "";
                        }
                    });
                });
                $.ajax({
                    url: BASE_URL + "/patient-submit-all-data",
                    method: "POST",
                    data: formData,
                    success: function (response) {
                        toggleLoader("update", false);
                        console.log(response.status === true);
                        console.log("All forms data submitted successfully");
                        if (response.status === true) {
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton:
                                        "btn btn-success waves-effect waves-light",
                                },
                            }).then(function () {
                                clearPatientPageAndReload();
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        toggleLoader("update", false);
                        Swal.fire({
                            title: "Error!",
                            text: error,
                            icon: "error",
                            customClass: {
                                confirmButton:
                                    "btn btn-primary waves-effect waves-light",
                            },
                            buttonsStyling: false,
                        });
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Please verify the patient details.)",
                    icon: "error",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });
    $("#update_submit_all").on("click", function () {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to update this patent details?",
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
                toggleLoader("update", true);
                let mobile = $("#mobile").val();
                if (mobile && !mobile.startsWith("+966")) {
                    $("#mobile").val("+966" + mobile);
                }
                var formData = {};
                var clientIdFromStorage = $("#client_id").val();
                var clientId = clientIdFromStorage
                    ? clientIdFromStorage
                    : $("#client_id").val();
                $(
                    "#address_Form, #birth_Form, #financial_Form, #others_data_Form, #reg_form",
                ).each(function () {
                    var serializedForm = $(this).serializeArray();
                    $.each(serializedForm, function () {
                        if (formData[this.name] !== undefined) {
                            if (!formData[this.name].push) {
                                formData[this.name] = [formData[this.name]];
                            }
                            formData[this.name].push(this.value || "");
                        } else {
                            formData[this.name] = this.value || "";
                        }
                    });
                });
                $.ajax({
                    url: BASE_URL + "/patient-registration-update/" + clientId,
                    method: "PUT",
                    data: formData,
                    success: function (response) {
                        toggleLoader("update", false);
                        console.log(response.status === true);
                        console.log("All forms data updated successfully");
                        if (response.status === true) {
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton:
                                        "btn btn-success waves-effect waves-light",
                                },
                            }).then(function () {
                                console.log(response.data.clientId);
                                window.location.href = "/patients-lists";
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        toggleLoader("update", false);
                        Swal.fire({
                            title: "Error!",
                            text: error,
                            icon: "error",
                            customClass: {
                                confirmButton:
                                    "btn btn-primary waves-effect waves-light",
                            },
                            buttonsStyling: false,
                        });
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Please verify the patient details.)",
                    icon: "error",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });

    $("#clinicId").select2({
        placeholder: "Select Branch",
        allowClear: true,
    });
    $("#payer").select2({
        placeholder: "Select Payer",
        allowClear: true,
    });
    $("#cityId").select2({
        placeholder: "Select City",
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
    $("#districtId").select2({
        placeholder: "Select District",
        allowClear: true,
    });
    $("#insurancePolicy").select2({
        placeholder: "Select Insurance Policy",
        allowClear: true,
    });
    $("#insuranceClass").select2({
        placeholder: "Select Insurance Class",
        allowClear: true,
    });

    $("#clinicId").on("change", function () {
        if (isLoadingEditData) return;
        const branchId = $(this).val();
        $("#payer")
            .html('<option value="">Select Payer</option>')
            .trigger("change.select2");
        $("#insurancePolicy")
            .html('<option value="">Select Policy</option>')
            .trigger("change.select2");
        $("#insuranceClass")
            .html('<option value="">Select Class</option>')
            .trigger("change.select2");
        $("#insuranceTpaCompany")
            .html('<option value="">Select TPA Company</option>')
            .trigger("change.select2");
        $("#relationshipTypeDiv").hide();
        $("#relatedMrnDiv").hide();
        if (!branchId) return;
        toggleLoader("policy", true);
        $.ajax({
            url: BASE_URL + "/get-payers-by-branch/" + branchId,
            type: "GET",
            success: function (res) {
                toggleLoader("policy", false);
                if (res.status && res.data.length > 0) {
                    let options = '<option value="">Select Payer</option>';
                    $.each(res.data, function (i, payer) {
                        options += `<option 
                        value="${payer.id}" 
                        data-company-id="${payer.insuranceCompanyId}" 
                        data-type="${payer.type}">
                        ${payer.name}
                    </option>`;
                    });
                    isLoadingEditData = true;
                    $("#payer").html(options).trigger("change.select2");
                    isLoadingEditData = false;
                } else {
                    $("#payer")
                        .html('<option value="">No Payers Found</option>')
                        .trigger("change.select2");
                    Swal.fire({
                        icon: "warning",
                        title: "No Payers Found",
                        text: "This branch does not have any payers assigned.",
                        customClass: {
                            confirmButton:
                                "btn btn-primary waves-effect waves-light",
                        },
                        buttonsStyling: false,
                    });
                }
            },
            error: function () {
                toggleLoader("policy", false);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch payers for this branch. Please try again.",
                    customClass: {
                        confirmButton:
                            "btn btn-primary waves-effect waves-light",
                    },
                    buttonsStyling: false,
                });
            },
        });
    });
    $("#payer").on("change", function () {
        if (isLoadingEditData) return;
        const payerId = $(this).val();
        const selectedOption = $("#payer option[value='" + payerId + "']");
        const insuranceCompanyId = selectedOption.attr("data-company-id");
        const payerType = selectedOption.attr("data-type");
        $("#insurancePolicy")
            .html('<option value="">Select Policy</option>')
            .trigger("change.select2");
        $("#insuranceClass")
            .html('<option value="">Select Class</option>')
            .trigger("change.select2");
        $("#insuranceTpaCompany")
            .html('<option value="">Select TPA Company</option>')
            .trigger("change.select2");
        $("#relationshipTypeDiv").hide();
        $("#relatedMrnDiv").hide();
        $("#relationshipType").val("Self").trigger("change");
        if (!payerId || !insuranceCompanyId) return;
        if (payerType === "TPA_company") {
            $("#insuranceTpaCompanyDiv").show();
            toggleLoader("policy", true);
            $.ajax({
                url: "/get-tpa-companies/" + insuranceCompanyId,
                type: "GET",
                success: function (res) {
                    toggleLoader("policy", false);
                    if (res.status && res.data.length > 0) {
                        let options =
                            '<option value="">Select TPA Company</option>';
                        $.each(res.data, function (i, tpa) {
                            options += `<option value="${tpa.insuranceTpaCompanyId}">${tpa.tpaNameEn}</option>`;
                        });
                        $("#insuranceTpaCompany")
                            .html(options)
                            .trigger("change.select2");
                    } else {
                        $("#insuranceTpaCompany")
                            .html(
                                '<option value="">No TPA Companies Found</option>',
                            )
                            .trigger("change.select2");
                        Swal.fire({
                            icon: "warning",
                            title: "No TPA Payers Found",
                            text: "This Payer does not have any TPA Payers assigned.",
                            customClass: {
                                confirmButton:
                                    "btn btn-primary waves-effect waves-light",
                            },
                            buttonsStyling: false,
                        });
                    }
                },
                error: function () {
                    toggleLoader("policy", false);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to fetch TPA Payers for this Payer. Please try again.",
                        customClass: {
                            confirmButton:
                                "btn btn-primary waves-effect waves-light",
                        },
                        buttonsStyling: false,
                    });
                },
            });
        } else {
            $("#insuranceTpaCompanyDiv").hide();
            toggleLoader("policy", true);
            $.ajax({
                url: "/get-policies/" + insuranceCompanyId,
                type: "GET",
                success: function (res) {
                    toggleLoader("policy", false);
                    if (res.status && res.data.length > 0) {
                        let options = '<option value="">Select Policy</option>';
                        $.each(res.data, function (i, policy) {
                            options += `<option value="${policy.id}">${policy.name} (${policy.number})</option>`;
                        });
                        $("#insurancePolicy")
                            .html(options)
                            .trigger("change.select2");
                    } else {
                        $("#insurancePolicy")
                            .html('<option value="">No Policies Found</option>')
                            .trigger("change.select2");
                        Swal.fire({
                            icon: "warning",
                            title: "No Policy Found",
                            text: "This Payer does not have any policies assigned.",
                            customClass: {
                                confirmButton:
                                    "btn btn-primary waves-effect waves-light",
                            },
                            buttonsStyling: false,
                        });
                    }
                },
                error: function () {
                    toggleLoader("policy", false);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to fetch policies for this payer. Please try again.",
                        customClass: {
                            confirmButton:
                                "btn btn-primary waves-effect waves-light",
                        },
                        buttonsStyling: false,
                    });
                },
            });
        }
    });
    $("#insuranceTpaCompany").on("change", function () {
        if (isLoadingEditData) return;
        const insuranceTpaCompanyId = $(this).val();
        $("#insurancePolicy")
            .html('<option value="">Select Policy</option>')
            .trigger("change.select2");
        $("#insuranceClass")
            .html('<option value="">Select Class</option>')
            .trigger("change.select2");
        if (!insuranceTpaCompanyId) return;
        toggleLoader("policy", true);
        $.ajax({
            url: "/get-policies-by-tpa/" + insuranceTpaCompanyId,
            type: "GET",
            success: function (res) {
                toggleLoader("policy", false);
                if (res.status && res.data.length > 0) {
                    let options = '<option value="">Select Policy</option>';
                    $.each(res.data, function (i, policy) {
                        options += `<option value="${policy.id}">${policy.name} (${policy.number})</option>`;
                    });
                    $("#insurancePolicy")
                        .html(options)
                        .trigger("change.select2");
                } else {
                    $("#insurancePolicy")
                        .html('<option value="">No Policies Found</option>')
                        .trigger("change.select2");
                    Swal.fire({
                        icon: "warning",
                        title: "No Policy Found",
                        text: "This payer does not have any policies assigned.",
                        customClass: {
                            confirmButton:
                                "btn btn-primary waves-effect waves-light",
                        },
                        buttonsStyling: false,
                    });
                }
            },
            error: function () {
                toggleLoader("policy", false);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch policies for this payer. Please try again.",
                    customClass: {
                        confirmButton:
                            "btn btn-primary waves-effect waves-light",
                    },
                    buttonsStyling: false,
                });
            },
        });
    });
    $("#insurancePolicy").on("change", function () {
        if (isLoadingEditData) return;
        const policyId = $(this).val();
        if (policyId) {
            $("#relationshipTypeDiv").show();
        } else {
            $("#relationshipTypeDiv").hide();
            $("#relationshipType").val("Self").trigger("change");
            $("#relatedMrnDiv").hide();
        }
        $("#insuranceClass")
            .html('<option value="">Select Class</option>')
            .trigger("change.select2");

        if (!policyId) return;
        toggleLoader("policy", true);
        $.ajax({
            url: "/get-classes/" + policyId,
            type: "GET",
            success: function (res) {
                toggleLoader("policy", false);
                if (res.status && res.data.length > 0) {
                    let options = '<option value="">Select Class</option>';
                    $.each(res.data, function (i, cls) {
                        options += `<option value="${cls.id}">${cls.name}</option>`;
                    });
                    $("#insuranceClass")
                        .html(options)
                        .trigger("change.select2");
                } else {
                    $("#insuranceClass")
                        .html('<option value="">No Classes Found</option>')
                        .trigger("change.select2");
                    Swal.fire({
                        icon: "warning",
                        title: "No Class Found",
                        text: "This policy does not have any class assigned.",
                        customClass: {
                            confirmButton:
                                "btn btn-primary waves-effect waves-light",
                        },
                        buttonsStyling: false,
                    });
                }
            },
            error: function () {
                toggleLoader("policy", false);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch class for this policy. Please try again.",
                    customClass: {
                        confirmButton:
                            "btn btn-primary waves-effect waves-light",
                    },
                    buttonsStyling: false,
                });
            },
        });
    });

    initRelatedMrnSelect2();
    toggleRelatedMrn();
    $("#relationshipType").on("change", function () {
        if (typeof isLoadingEditData === 'undefined' || !isLoadingEditData) {
            initRelatedMrnSelect2();
        }
        toggleRelatedMrn();
    });

    $("#patientBeneficiaryMenu .dropdown-item").on("click", function () {
        let SystemType = $(this).attr("id");
        let PatientKey = $("#idNational").val().trim();
        if (PatientKey === "") {
            Swal.fire({
                icon: "warning",
                title: "Missing Identifier",
                text: "Please enter an Identifier ID first.",
                customClass: {
                    confirmButton: "btn btn-primary waves-effect waves-light",
                },
            });
            return;
        }
        $(".idNational").prop("disabled", true);
        $.ajax({
            url: BASE_URL + "/get-patient-benficiary",
            type: "GET",
            data: {
                PatientKey: PatientKey,
                SystemType: SystemType,
            },
            success: function (response) {
                console.log("Patient beneficiary:", response);
                if (response.success) {
                    const d = response.data;
                    let companyName = (d.InsuranceCompanyEN || "")
                        .toLowerCase()
                        .trim();
                    let matchedValue = null;
                    $("#payer option").each(function () {
                        let optionText = $(this).text().toLowerCase().trim();
                        if (companyName.includes(optionText)) {
                            matchedValue = $(this).val();
                            return false;
                        }
                    });
                    if (matchedValue) {
                        $("#payer").val(matchedValue).trigger("change");
                    } else {
                        $("#payer").val("").trigger("change");
                    }
                    if (d.Name) {
                        let name = d.Name;
                        name = name.replace(/^\s*\d+\s*-\s*/i, "");
                        name = name.replace(/\(\d+\)/g, "");
                        name = name.replace(/-\s*[a-zA-Z]*\s*$/i, "");
                        name = name.trim();
                        let parts = name.split(/\s+/);
                        $("#clientName_en").val(parts[0] || "");
                        $("#secondName_en").val(parts[1] || "");
                        $("#thirdName_en").val(parts[2] || "");
                        $("#fourthName_en").val(parts[3] || "");
                    }
                    let genderValue = "";
                    if (
                        d.Gender === 1 ||
                        d.Gender === "1" ||
                        d.Gender?.toLowerCase?.() === "male"
                    ) {
                        genderValue = "Male";
                    } else if (
                        d.Gender === 2 ||
                        d.Gender === "2" ||
                        d.Gender?.toLowerCase?.() === "female"
                    ) {
                        genderValue = "Female";
                    } else {
                        genderValue = "unknown";
                    }
                    $("#gender").val(genderValue).trigger("change");
                    Swal.fire({
                        icon: "success",
                        title: "Patient Found",
                        html: `
                        <table class="swal2-table" style="width:100%;text-align:left;">
                            <tr><td><b>Policy Number:</b></td><td>${
                                d.PolicyNumber || "-"
                            }</td></tr>
                            <tr><td><b>Insurance Company English:</b></td><td>${
                                d.InsuranceCompanyEN || "-"
                            }</td></tr>
                            <tr><td><b>Insurance Company Arabic:</b></td><td>${
                                d.InsuranceCompanyAR || "-"
                            }</td></tr>
                            <tr><td><b>Insurance Company ID:</b></td><td>${
                                d.InsuranceCompanyID || "-"
                            }</td></tr>
                            <tr><td><b>Expiry Date:</b></td><td>${
                                d.ExpiryDate || "-"
                            }</td></tr>
                            <tr><td><b>Class:</b></td><td>${
                                d.ClassName || "-"
                            }</td></tr>
                            <tr><td><b>Identity Number:</b></td><td>${
                                d.IdentityNumber || "-"
                            }</td></tr>
                            <tr><td><b>Name:</b></td><td>${
                                d.Name || "-"
                            }</td></tr>
                            <tr><td><b>Gender:</b></td><td>${
                                d.Gender == 1 ? "Male" : "Female"
                            }</td></tr>
                            <tr><td><b>Nationality Code:</b></td><td>${
                                d.NationalityCode || "-"
                            }</td></tr>
                            <tr><td><b>Deductible</b></td><td>${
                                d.DeductibleRate || "-"
                            }%</td></tr>
                            <tr><td><b>Max Limit:</b></td><td>${
                                d.MaxLimit || "-"
                            }</td></tr>
                            <tr><td><b>Beneficiary Type:</b></td><td>${
                                d.BeneficiaryType || "-"
                            }</td></tr><tr><td><b>Beneficiary Number:</b></td><td>${
                                d.BeneficiaryNumber || "-"
                            }</td></tr><tr><td><b>Network ID:</b></td><td>${
                                d.NetworkID || "-"
                            }</td></tr><tr><td><b>Issue Date:</b></td><td>${
                                d.IssueDate || "-"
                            }</td></tr>
                            <tr><td><b>Sponsor Number:</b></td><td>${
                                d.SponsorNumber || "-"
                            }</td></tr>
                            <tr><td><b>Policy Holder:</b></td><td>${
                                d.PolicyHolder || "-"
                            }</td></tr>
                        </table>
                    `,
                        customClass: {
                            confirmButton:
                                "btn btn-primary waves-effect waves-light",
                        },
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "No Patient Found",
                        html: `
                        <b>Api Status:</b> ${response.apiStatus || "N/A"} <br>
                        <b>Error Code:</b> ${response.errorCode || "N/A"} <br>
                        <b>Message:</b> ${
                            response.message || "Unknown error occurred."
                        } <br>
                        <b>Insurance:</b> ${
                            response.insuranceData || "null"
                        } <br>
                    `,
                        customClass: {
                            confirmButton:
                                "btn btn-primary waves-effect waves-light",
                        },
                    });
                }
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An unexpected error occurred while fetching patient data.",
                    footer: `<pre>${xhr.status} - ${xhr.statusText}</pre>`,
                    customClass: {
                        confirmButton:
                            "btn btn-primary waves-effect waves-light",
                    },
                });
            },
            complete: function () {
                $(".idNational").prop("disabled", false);
            },
        });
    });
    $("#add_new_patient").on("click", function () {
        clearPatientPageAndReload();
    });
    setTimeout(function () {
        $(".alert").fadeOut("slow");
    }, 5000);
});

function initRelatedMrnSelect2() {
    let relationshipType = $("#relationshipType").val();
    let clientId = $("#client_id").val();
    let $relatedMrn = $("#relatedMrn");

    if ($relatedMrn.hasClass("select2-hidden-accessible")) {
        $relatedMrn.select2("destroy");
    }

    $relatedMrn.empty().append('<option value="">Select Related MRN</option>');

    if (relationshipType === "Child") {
        if (clientId) {
            $relatedMrn.prop("disabled", true);
            $.ajax({
                url: "/get-child-clients/" + clientId,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    $.each(data, function (key, value) {
                        var fullName = [
                            value.clientName_en,
                            value.secondName_en,
                            value.thirdName_en,
                            value.fourthName_en,
                        ].filter(Boolean).join(" ");
                        var option = new Option(fullName, value.clientId, false, false);
                        $relatedMrn.append(option);
                    });
                    $relatedMrn.select2({ placeholder: "Select Related MRN", allowClear: true });
                    $relatedMrn.prop("disabled", false);
                },
                error: function () {
                    $relatedMrn.prop("disabled", false);
                }
            });
        } else {
            $relatedMrn.select2({ placeholder: "Select Related MRN", allowClear: true });
        }
    } else {
        $relatedMrn.select2({
            placeholder: "Select Related MRN",
            allowClear: true,
            ajax: {
                url: BASE_URL + "/search-related-mrn",
                dataType: "json",
                delay: 300,
                data: function (params) {
                    return {
                        search: params.term,
                        page: params.page || 1,
                        clientId: $("#client_id").val(),
                        relationshipType: $("#relationshipType").val()
                    };
                },
                processResults: function (res) {
                    let results = [];
                    if (res.status && res.data.length > 0) {
                        results = $.map(res.data, function (item) {
                            let fullName = [
                                item.clientName_en,
                                item.secondName_en,
                                item.thirdName_en,
                                item.fourthName_en,
                            ].filter(Boolean).join(" ");
                            return { id: item.id, text: `${item.text}` };
                        });
                    }
                    return {
                        results: results,
                        pagination: { more: res.pagination ? res.pagination.more : false }
                    };
                },
            },
        });
    }
}

function toggleRelatedMrn() {
    let relationshipType = $("#relationshipType").val();
    let policyId = $("#insurancePolicy").val();
    if (!policyId || relationshipType === "Self" || relationshipType === "") {
        $("#relatedMrnDiv").hide();
    } else {
        $("#relatedMrnDiv").show();
    }
}

function pageValidationInfo(message) {
    Swal.fire({
        title: message,
        showClass: {
            popup: "animate__animated animate__fadeIn",
        },
        customClass: {
            confirmButton: "btn btn-primary waves-effect waves-light",
        },
        buttonsStyling: false,
    });
}
function updatePrevButtonState() {
    if ($("#patient-registration-tab").hasClass("active")) {
        $(".btn-prev").prop("disabled", true);
    } else {
        $(".btn-prev").prop("disabled", false);
    }
}
$(".btn-prev").on("click", function () {
    if ($("#birth-information-tab").hasClass("active")) {
        saveSuccessSweetAlert("", "patient_registration");
    } else if ($("#financial-information-tab").hasClass("active")) {
        saveSuccessSweetAlert("", "birth_information");
    } else if ($("#address-information-tab").hasClass("active")) {
        saveSuccessSweetAlert("", "financial_information");
    } else if ($("#others-data-tab").hasClass("active")) {
        saveSuccessSweetAlert("", "address_information");
    } else if ($("#all-data-tab").hasClass("active")) {
        saveSuccessSweetAlert("", "others_data");
    }
    updatePrevButtonState();
});

function saveSuccessSweetAlert(message, tabName) {
    var localStorageClientId = $("#client_id").val();
    if (tabName === "birth_information") {
        $("#address-information-tab").removeClass("active");
        $("#address-information-details").removeClass("dstepper-block active");

        $("#financial-information-tab").removeClass("active");
        $("#financial-information-details").removeClass(
            "dstepper-block active",
        );

        $("#birth-information-tab").addClass("active");
        $("#birth-information-details").addClass("dstepper-block active");

        $("#patient-registration-tab").removeClass("active");
        $("#patient-registration-details").removeClass("dstepper-block active");
        $("#others-data-tab").removeClass("active");
        $("#others-data-details").removeClass("dstepper-block active");

        $("#all-data-tab").removeClass("active");
        $("#all-data-details").removeClass("dstepper-block active");
        // var localStorageClientId = $("#client_id").val();
        // if (localStorageClientId) {
        //     loadEditPatientTabData(localStorageClientId);
        // } else {
        //     loadPatientTabData();
        // }
        AllDataDisplay();
    } else if (tabName === "financial_information") {
        $("#address-information-tab").removeClass("active");
        $("#address-information-details").removeClass("dstepper-block active");
        $("#financial-information-tab").addClass("active");
        $("#financial-information-details").addClass("dstepper-block active");
        $("#birth-information-tab").removeClass("active");
        $("#birth-information-details").removeClass("dstepper-block active");
        $("#patient-registration-tab").removeClass("active");
        $("#patient-registration-details").removeClass("dstepper-block active");
        $("#others-data-tab").removeClass("active");
        $("#others-data-details").removeClass("dstepper-block active");
        $("#all-data-tab").removeClass("active");
        $("#all-data-details").removeClass("dstepper-block active");
        // var localStorageClientId = $("#client_id").val();
        // if (localStorageClientId) {
        //     loadEditPatientTabData(localStorageClientId);
        // } else {
        //     loadPatientTabData();
        // }
        AllDataDisplay();
    } else if (tabName === "address_information") {
        $("#address-information-tab").addClass("active");
        $("#address-information-details").addClass("dstepper-block active");
        $("#financial-information-tab").removeClass("active");
        $("#financial-information-details").removeClass(
            "dstepper-block active",
        );
        $("#birth-information-tab").removeClass("active");
        $("#birth-information-details").removeClass("dstepper-block active");
        $("#patient-registration-tab").removeClass("active");
        $("#patient-registration-details").removeClass("dstepper-block active");
        $("#others-data-tab").removeClass("active");
        $("#others-data-details").removeClass("dstepper-block active");
        $("#all-data-tab").removeClass("active");
        $("#all-data-details").removeClass("dstepper-block active");
        // var localStorageClientId = $("#client_id").val();
        // if (localStorageClientId) {
        //     loadEditPatientTabData(localStorageClientId);
        // } else {
        //     loadPatientTabData();
        // }
        // if ($("#selected_city_id").val()) {
        //     getDistricts($("#selected_city_id").val());
        // }
        AllDataDisplay();
    } else if (tabName === "others_data") {
        $("#others-data-tab").addClass("active");
        $("#others-data-details").addClass("dstepper-block active");
        $("#address-information-tab").removeClass("active");
        $("#address-information-details").removeClass("dstepper-block active");
        $("#financial-information-tab").removeClass("active");
        $("#financial-information-details").removeClass(
            "dstepper-block active",
        );
        $("#birth-information-tab").removeClass("active");
        $("#birth-information-details").removeClass("dstepper-block active");
        $("#patient-registration-tab").removeClass("active");
        $("#patient-registration-details").removeClass("dstepper-block active");
        $("#all-data-tab").removeClass("active");
        $("#all-data-details").removeClass("dstepper-block active");
        // var localStorageClientId = $("#client_id").val();
        // if (localStorageClientId) {
        //     loadEditPatientTabData(localStorageClientId);
        // } else {
        //     loadPatientTabData();
        // }
        AllDataDisplay();
    } else if (tabName === "all_data") {
        $("#all-data-tab").addClass("active");
        $("#all-data-details").addClass("dstepper-block active");
        $("#others-data-tab").removeClass("active");
        $("#others-data-details").removeClass("dstepper-block active");
        $("#address-information-tab").removeClass("active");
        $("#address-information-details").removeClass("dstepper-block active");
        $("#financial-information-tab").removeClass("active");
        $("#financial-information-details").removeClass(
            "dstepper-block active",
        );
        $("#birth-information-tab").removeClass("active");
        $("#birth-information-details").removeClass("dstepper-block active");
        $("#patient-registration-tab").removeClass("active");
        $("#patient-registration-details").removeClass("dstepper-block active");
        //    var localStorageClientId = $("#client_id").val();
        //     if (localStorageClientId) {
        //         loadEditPatientTabData(localStorageClientId);
        //     } else {
        //         loadPatientTabData();
        //     }
        AllDataDisplay();
    } else if (tabName === "patient_registration") {
        $(
            "#birth-information-tab, #financial-information-tab, #address-information-tab, #others-data-tab, #all-data-tab",
        ).removeClass("active");
        $(
            "#birth-information-details, #financial-information-details, #address-information-details, #others-data-details, #all-data-details",
        ).removeClass("dstepper-block active");
        $("#patient-registration-tab").addClass("active");
        $("#patient-registration-details").addClass("dstepper-block active");
    }
    updatePrevButtonState();
}

function loadPatientTabData(clientId) {
    $.ajax({
        url: BASE_URL + "/patient",
        method: "GET",
        success: function (patientData) {
            console.log(patientData);
            $("#clientName_en").val(patientData.data.clientName_en || "");
            console.log("Patient Data Loaded:", patientData.data.clientName_en);
            $("#secondName_en").val(patientData.data.secondName_en || "");
            $("#thirdName_en").val(patientData.data.thirdName_en || "");
            $("#fourthName_en").val(patientData.data.fourthName_en || "");
            $("#clientName").val(patientData.data.clientName || "");
            $("#secondName_ar").val(patientData.data.secondName_ar || "");
            $("#thirdName_ar").val(patientData.data.thirdName_ar || "");
            $("#fourthName_ar").val(patientData.data.fourthName_ar || "");
            $("#gender").val(patientData.data.gender || "");
            if (patientData.data.gender) {
                var avatarSrc =
                    patientData.data.gender.toLowerCase() === "female"
                        ? "../../assets/img/avatars/femaleavatar.png"
                        : "../../assets/img/avatars/maleavatar.png";
                $("#patient-avatar").attr("src", avatarSrc);
            }
            var mobile = patientData.data.mobile
                .toString()
                .replace(/^(\+966)/, "");
            $("#mobile").val(mobile);
            $("#home_telephone").val(patientData.data.home_telephone || "");
            $("#maritalStatus").val(patientData.data.maritalStatus || "");
            $("#religion").val(patientData.data.religion || "");
            $("#clientEmail").val(patientData.data.clientEmail || "");
            $("#patient_reg_flag").val(
                patientData.data.patient_registration || "",
            );
            $("#idNationalType").val(patientData.data.idNationalType || "");
            $("#nationalityId").val(patientData.data.nationalityId || "");
            $("#idNational").val(patientData.data.idNational || "");

            $("#card_expiration_g").val(
                patientData.data.card_expiration_g || "",
            );
            $("#card_expiration_h").val(
                patientData.data.card_expiration_h || "",
            );
            $("#version_number").val(patientData.data.version_number || "");
            $("#hafiza_date").val(patientData.data.hafiza_date || "");
            $("#hafiza_number").val(patientData.data.hafiza_number || "");
            $("#id_data_flag").val(patientData.data.id_data || "");
            $("#birthDate").val(patientData.data.birthDate || "");
            $("#place_of_birth").val(patientData.data.place_of_birth || "");
            $("#birth_info_flag").val(patientData.data.birth_information || "");
            $("#payer").val(patientData.data.insuranceName || "");
            $("#relation_with_subscriber").val(
                patientData.data.relation_with_subscriber || "",
            );
            $("#patient_share").val(patientData.data.patient_share || "");
            $("#max_limit").val(patientData.data.max_limit || "");
            $("#sponsor_number").val(patientData.data.sponsor_number || "");
            $("#insurance_status").val(patientData.data.insurance_status || "");
            $("#insurance_duration").val(
                patientData.data.insurance_duration || "",
            );
            $("#insurance_type").val(patientData.data.insurance_type || "");
            $("#payer_nphies_id").val(patientData.data.payer_nphies_id || "");
            $("#financial_info_flag").val(
                patientData.data.financial_information || "",
            );
            $("#address").val(patientData.data.address || "");
            $("#cityId").val(patientData.data.cityId || "");
            $("#districtId").val(patientData.data.districtId || "");
            $("#street").val(patientData.data.street || "");
            $("#building_no").val(patientData.data.building_no || "");
            $("#post_code").val(patientData.data.post_code || "");
            $("#national_address").val(patientData.data.national_address || "");
            $("#emergency_name").val(patientData.data.emergency_name || "");
            $("#emergency_id_national").val(
                patientData.data.emergency_id_national || "",
            );
            $("#emergencyNumber").val(patientData.data.emergencyNumber || "");
            $("#emergency_address").val(
                patientData.data.emergency_address || "",
            );
            $("#address_info_flag").val(
                patientData.data.address_information || "",
            );
            $("#occupation").val(patientData.data.occupation || "");
            $("#relative_no_1").val(patientData.data.relative_no_1 || "");
            $("#relative_no_1_phone").val(
                patientData.data.relative_no_1_phone || "",
            );
            $("#relative_no_2").val(patientData.data.relative_no_2 || "");
            $("#temporary_no").val(patientData.data.temporary_no || "");
            $("#relative_no_2_phone").val(
                patientData.data.relative_no_2_phone || "",
            );
            $("#username").val(patientData.data.username || "");
            $("#brought_by").val(patientData.data.brought_by || "");
            $("#brought_by_nurse").val(patientData.data.brought_by_nurse || "");
            $("#note_field_for_contact").val(
                patientData.data.note_field_for_contact || "",
            );
            $("#phc_attribute").val(patientData.data.phc_attribute || "");
            $("#registration_n_activation_note").val(
                patientData.data.registration_n_activation_note || "",
            );
            $("#er_notes").val(patientData.data.er_notes || "");
            $("#protocol_note").val(patientData.data.protocol_note || "");
            $("#emp_id").val(patientData.data.emp_id || "");
            $("#relationship").val(patientData.data.relationship || "");
            $("#referring_hospital_mrn").val(
                patientData.data.referring_hospital_mrn || "",
            );
            $("#referring_hospital").val(
                patientData.data.referring_hospital || "",
            );
            $("#accepting_physician").val(
                patientData.data.accepting_physician || "",
            );
            $("#employment_status").val(
                patientData.data.employment_status || "",
            );
            $("#education_status").val(patientData.data.education_status || "");
            $("#lang").val(patientData.data.lang || "");
            $("#others_data_flag").val(patientData.data.others_data || "");
            $(".patient-name").text(
                patientData.data.clientName_en +
                    " " +
                    patientData.data.secondName_en +
                    " " +
                    patientData.data.fourthName_en || "No patient ID available",
            );
            $(".patient-id-all").text(patientData.data.idNational || "");
        },
    });
}
function loadEditPatientTabData(clientId) {
    toggleLoader("page", true);
    isEditMode = true;
    $("#submit_all").text("Update All").attr("id", "update_submit_all");
    $.ajax({
        url: BASE_URL + "/patient-edit/" + clientId,
        method: "GET",
        success: function (patientData) {
            toggleLoader("page", false);
            if (patientData.status) {
                const data = patientData.data;
                console.log("Loading patient data:", data.data);
                $("#idNationalType").selectpicker(
                    "val",
                    data.data.idNationalType,
                );
                $("#nationalityId").selectpicker(
                    "val",
                    data.data.nationalityId,
                );
                $("#gender").selectpicker("val", data.data.gender);
                $("#maritalStatus").selectpicker(
                    "val",
                    data.data.maritalStatus,
                );
                $("#religion").selectpicker("val", data.data.religion);
                $("#idNational").val(data.data.idNational);
                $("#card_expiration_g").val(data.data.card_expiration_g);
                $("#card_expiration_h").val(data.data.card_expiration_h);
                $("#version_number").val(data.data.version_number);
                $("#hafiza_date").val(data.data.hafiza_date);
                $("#hafiza_number").val(data.data.hafiza_number);
                $("#id_data_flag").val(data.data.id_data);
                $("#clientName_en").val(data.data.clientName_en);
                $("#secondName_en").val(data.data.secondName_en);
                $("#thirdName_en").val(data.data.thirdName_en);
                $("#fourthName_en").val(data.data.fourthName_en);
                $("#clientName").val(data.data.clientName);
                $("#secondName_ar").val(data.data.secondName_ar);
                $("#thirdName_ar").val(data.data.thirdName_ar);
                $("#fourthName_ar").val(data.data.fourthName_ar);
                var mobile = data.data.mobile
                    .toString()
                    .replace(/^(\+966)/, "");
                $("#mobile").val(mobile);
                $("#home_telephone").val(data.data.home_telephone);
                $("#clientEmail").val(data.data.clientEmail);
                $("#health_id").val(data.data.health_id);
                $("#patient_reg_flag").val(data.data.patient_registration);

                $("#financial_category")
                    .val(data?.data?.financial_category ?? "")
                    .trigger("change");
                
                if (data.data.gender) {
                    const avatarSrc =
                        data.data.gender.toLowerCase() === "female"
                            ? "../../assets/img/avatars/femaleavatar.png"
                            : "../../assets/img/avatars/maleavatar.png";
                    $("#patient-avatar").attr("src", avatarSrc);
                }
                $("#birthDate").val(data.data.birthDate);
                $("#place_of_birth").val(data.data.place_of_birth);
                $("#birth_info_flag").val(data.data.birth_information);
                const insurancePolicy = data.data.insurance_policy || {};
                console.log("insurancePolicy", insurancePolicy);
                isLoadingEditData = true;
                $("#clinicId")
                    .val(data.data.clinicId)
                    .trigger("change.select2");
                $("#policyType")
                    .val(insurancePolicy.policyType || "")
                    .trigger("change");
                $("#membership_id").val(insurancePolicy.membershipId || "");
                $("#relationshipType")
                    .val(insurancePolicy.relationWithSubscriber || "")
                    .trigger("change");
                console.log(
                    "relationWithSubscriber",
                    insurancePolicy.relationWithSubscriber,
                );
                if (
                    insurancePolicy.relationWithSubscriber &&
                    insurancePolicy.relationWithSubscriber !== "Self" &&
                    insurancePolicy.relationWithSubscriber !== ""
                ) {
                    $("#relatedMrnDiv").show();
                }
                if (
                    insurancePolicy.policy &&
                    insurancePolicy.policy.payerType === "tpa"
                ) {
                    $("#insuranceTpaCompanyDiv").show();
                } else {
                    $("#insuranceTpaCompanyDiv").hide();
                }
                const relationshipClientId =
                    insurancePolicy.relationshipClientId || "";
                const relatedClient = insurancePolicy.related_client || null;
                if (relationshipClientId && relatedClient) {
                    const relationshipClientText = [
                        relatedClient.clientName_en,
                        relatedClient.secondName_en,
                        relatedClient.thirdName_en,
                        relatedClient.fourthName_en,
                    ]
                        .filter(Boolean)
                        .join(" ");
                    if (
                        $(
                            "#relatedMrn option[value='" +
                                relationshipClientId +
                                "']",
                        ).length === 0
                    ) {
                        $("#relatedMrn").append(
                            new Option(
                                relationshipClientText +
                                    " (" +
                                    relationshipClientId +
                                    ")",
                                relationshipClientId,
                                true,
                                true,
                            ),
                        );
                    }
                    $("#relatedMrn")
                        .val(relationshipClientId)
                        .trigger("change.select2");
                }
                if (data.data.clinicId) {
                    toggleLoader("policy", true);
                    $.ajax({
                        url:
                            BASE_URL +
                            "/get-payers-by-branch/" +
                            data.data.clinicId,
                        type: "GET",
                        success: function (res) {
                            toggleLoader("policy", false);
                            if (res.status && res.data.length > 0) {
                                let options =
                                    '<option value="">Select Payer</option>';
                                $.each(res.data, function (i, payer) {
                                    options += `<option 
                                        value="${payer.id}" 
                                        data-company-id="${payer.insuranceCompanyId}" 
                                        data-type="${payer.type}">
                                        ${payer.name}
                                    </option>`;
                                });
                                $("#payer")
                                    .html(options)
                                    .trigger("change.select2");
                            }
                            console.log("policy =", insurancePolicy.policy);
                            let policyExpiryDate = insurancePolicy.policy?.policyExpiryDate;
                            $("#payer")
                                .val(insurancePolicy.insurancePayerId || "")
                                .trigger("change.select2");
                            AllDataDisplay();
                            const selectedPayerOption = $(
                                "#payer option[value='" +
                                    insurancePolicy.insurancePayerId +
                                    "']",
                            );
                            console.log(insurancePolicy.policy);
                            if (
                                insurancePolicy.insurancePayerId &&
                                insurancePolicy.policy?.insuranceCompanyId
                            ) {
                                loadPolicyChain(
                                    insurancePolicy.insurancePayerId,
                                    insurancePolicy.policy.insuranceCompanyId,
                                    selectedPayerOption.attr("data-type"),
                                    insurancePolicy.policyId,
                                    insurancePolicy.insuranceClassId,
                                    insurancePolicy.insuranceTpaCompanyId,
                                );
                            } else {
                                isLoadingEditData = false;
                            }
                        },
                        error: function () {
                            toggleLoader("policy", false);
                            isLoadingEditData = false;
                        },
                    });
                } else {
                    isLoadingEditData = false;
                }
                $("#financial_info_flag").val(
                    (data.data.insurance_policy &&
                        data.data.insurance_policy.financial_info_flag) ||
                        "",
                );
                $("#address").val(data.data.address);
                $("#selected_district_id").val(data.data.district?.districtId || "");
                $("#cityId")
                    .val(data.data.district?.city?.cityId || "")
                    .trigger("change");
                $("#street").val(data.data.street);
                $("#building_no").val(data.data.building_no);
                $("#post_code").val(data.data.post_code);
                $("#national_address").val(data.data.national_address);
                $("#emergency_name").val(data.data.emergency_name);
                $("#emergency_id_national").val(
                    data.data.emergency_id_national,
                );
                $("#emergencyNumber").val(data.data.emergencyNumber);
                $("#emergency_address").val(data.data.emergency_address);
                $("#address_info_flag").val(data.data.address_information);
                if ($("#occupation").hasClass("selectpicker")) {
                    $("#occupation").selectpicker("val", data.data.occupation);
                } else {
                    $("#occupation").val(data.data.occupation);
                }
                $("#relative_no_1").val(data.data.relative_no_1);
                $("#relative_no_1_phone").val(data.data.relative_no_1_phone);
                $("#relative_no_2").val(data.data.relative_no_2);
                $("#temporary_no").val(data.data.temporary_no);
                $("#relative_no_2_phone").val(data.data.relative_no_2_phone);
                $("#username").val(data.data.username);
                $("#brought_by").val(data.data.brought_by);
                $("#brought_by_nurse").val(data.data.brought_by_nurse);
                $("#note_field_for_contact").val(
                    data.data.note_field_for_contact,
                );
                $("#phc_attribute").val(data.data.phc_attribute);
                $("#registration_n_activation_note").val(
                    data.data.registration_n_activation_note,
                );
                $("#er_notes").val(data.data.er_notes);
                $("#protocol_note").val(data.data.protocol_note);
                $("#emp_id").val(data.data.emp_id);
                $("#referring_hospital_mrn").val(
                    data.data.referring_hospital_mrn,
                );
                $("#referring_hospital").val(data.data.referring_hospital);
                $("#accepting_physician").val(data.data.accepting_physician);
                if ($("#employment_status").hasClass("selectpicker")) {
                    $("#employment_status").selectpicker(
                        "val",
                        data.data.employment_status,
                    );
                } else {
                    $("#employment_status").val(data.data.employment_status);
                }
                if ($("#education_status").hasClass("selectpicker")) {
                    $("#education_status").selectpicker(
                        "val",
                        data.data.education_status,
                    );
                } else {
                    $("#education_status").val(data.data.education_status);
                }
                if ($("#lang").hasClass("selectpicker")) {
                    $("#lang").selectpicker("val", data.data.lang);
                } else {
                    $("#lang").val(data.data.lang);
                }
                $("#others_data_flag").val(data.data.others_data);
                $(".patient-name").text(
                    data.data.clientName_en +
                        " " +
                        data.data.secondName_en +
                        " " +
                        data.data.fourthName_en,
                );
                $(".patient-id-all").text(data.data.clientId);
                // AllDataDisplay();
                console.log("Patient data loaded successfully");
                toggleLoader("page", false);
            } else {
                $("#loader-overlay").hide();
                console.error(
                    "Failed to load patient data:",
                    patientData.message,
                );
                alert("Failed to load patient data: " + patientData.message);
            }
        },
        error: function (xhr, status, error) {
            toggleLoader("page", false);
            console.error("Error loading patient data:", error);
            console.error("Response:", xhr.responseText);
            alert("Error loading patient data. Please try again.");
        },
    });
}

function getDistricts(cityId) {
    toggleLoader("district", true);
    if (!cityId) {
        $("#districtId")
            .empty()
            .append('<option value="">Select</option>')
            .trigger("change.select2");
        toggleLoader("district", false);
        return;
    }
    $.ajax({
        url: BASE_URL + "/get-districts",
        type: "GET",
        data: { cityId: cityId },
        success: function (response) {
            toggleLoader("district", false);
            if (response.status) {
                const districtDropdown = $("#districtId");
                districtDropdown.empty();
                districtDropdown.append('<option value="">Select</option>');
                $.each(response.data, function (key, value) {
                    districtDropdown.append(
                        `<option value="${key}">${value}</option>`,
                    );
                });
                const selectedDistrictId = $("#selected_district_id").val();
                if (selectedDistrictId) {
                    setTimeout(function () {
                        districtDropdown.val(selectedDistrictId);
                        districtDropdown.trigger("change.select2");
                        let districtText = districtDropdown
                            .find("option:selected")
                            .text();
                        $(".districtIdAll").text(districtText || "-");
                    }, 100);
                }
            } else {
                console.error(
                    "Failed to retrieve districts:",
                    response.message,
                );
            }
        },
        error: function (xhr, status, error) {
            toggleLoader("district", false);
            console.error("AJAX Error:", status, error);
        },
    });
}
function clearPatientPageAndReload() {
    localStorage.clear();
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
    $("#home_telephone").val("");
    $("#maritalStatus").val("");
    $("#religion").val("");
    $("#clientEmail").val("");
    $("#patient_reg_flag").val("");
    $("#idNationalType").val("");
    $("#idNational").val("");
    $("#nationalityId").val("");
    $("#card_expiration_g").val("");
    $("#card_expiration_h").val("");
    $("#version_number").val("");
    $("#hafiza_date").val("");
    $("#hafiza_number").val("");
    $("#id_data_flag").val("");
    $("#birthDate").val("");
    $("#place_of_birth").val("");
    $("#birth_info_flag").val("");
    $("#clinicId").val("");
    $("#payer").val("");
    $("#relation_with_subscriber").val("");
    $("#patient_share").val("");
    $("#max_limit").val("");
    $("#sponsor_number").val("");
    $("#insurance_status").val("");
    $("#insurance_duration").val("");
    $("#insurance_type").val("");
    $("#payer_nphies_id").val("");
    $("#financial_info_flag").val("");
    $("#address").val("");
    $("#cityId").val("");
    $("#districtId").val("");
    $("#street").val("");
    $("#building_no").val("");
    $("#post_code").val("");
    $("#national_address").val("");
    $("#emergency_name").val("");
    $("#emergency_id_national").val("");
    $("#emergencyNumber").val("");
    $("#emergency_address").val("");
    $("#address_info_flag").val("");
    $("#occupation").val("");
    $("#relative_no_1").val("");
    $("#relative_no_1_phone").val("");
    $("#relative_no_2").val("");
    $("#temporary_no").val("");
    $("#relative_no_2_phone").val("");
    $("#username").val("");
    $("#brought_by").val("");
    $("#brought_by_nurse").val("");
    $("#registration_n_activation_note").val("");
    $("#er_notes").val("");
    $("#protocol_note").val("");
    $("#emp_id").val("");
    $("#relationship").val("");
    $("#referring_hospital_mrn").val("");
    $("#referring_hospital").val("");
    $("#accepting_physician").val("");
    $("#username").val("");
    $("#employment_status").val("");
    $("#education_status").val("");
    $("#lang").val("");
    $("#others_data_flag").val("");
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

function AllDataDisplay() {
    $(".clientName_enAll").text($("#clientName_en").val() || "");
    $(".secondName_enAll").text($("#secondName_en").val() || "");
    $(".thirdName_enAll").text($("#thirdName_en").val() || "");
    $(".fourthName_enAll").text($("#fourthName_en").val() || "");
    $(".clientNameAll").text($("#clientName").val() || "");
    $(".secondName_arAll").text($("#secondName_ar").val() || "");
    $(".thirdName_arAll").text($("#thirdName_ar").val() || "");
    $(".fourthName_arAll").text($("#fourthName_ar").val() || "");
    $(".genderAll").text($("#gender").val() || "");
    $(".mobileAll").text($("#mobile").val() || "");
    $(".home_telephoneAll").text($("#home_telephone").val() || "");
    $(".maritalStatusAll").text($("#maritalStatus").val() || "");
    $(".religionAll").text($("#religion").val() || "");
    $(".clientEmailAll").text($("#clientEmail").val() || "");
    $(".idNationalTypeAll").text($("#idNationalType").val() || "");
    $(".nationalityIdAll").text(
        $("#nationalityId option:selected").text() || "",
    );
    $(".idNationalAll").text($("#idNational").val() || "");
    $(".card_expiration_gAll").text($("#card_expiration_g").val() || "");
    $(".card_expiration_hAll").text($("#card_expiration_h").val() || "");
    $(".version_numberAll").text($("#version_number").val() || "");
    $(".hafiza_dateAll").text($("#hafiza_date").val() || "");
    $(".hafiza_numberAll").text($("#hafiza_number").val() || "");
    $(".birthDateAll").text($("#birthDate").val() || "");
    $(".place_of_birthAll").text($("#place_of_birth").val() || "");
    letpolicyTypeText = $("#policyType").val()
        ? $("#policyType option:selected").text()
        : "";
    $(".policyTypeAll").text(letpolicyTypeText);
    let branchText = $("#clinicId").val()
        ? $("#clinicId option:selected").text()
        : "";
    $(".branchAll").text(branchText);
    let payerText = $("#payer").val() ? $("#payer option:selected").text() : "";
    $(".payerAll").text(payerText);
    let tpaText = $("#insuranceTpaCompany").val()
        ? $("#insuranceTpaCompany option:selected").text()
        : "";
    $(".tpapayerAll").text(tpaText);
    let policyText = $("#insurancePolicy").val()
        ? $("#insurancePolicy option:selected").text()
        : "";
    $(".policyAll").text(policyText);
    let classText = $("#insuranceClass").val()
        ? $("#insuranceClass option:selected").text()
        : "";
    $(".policy_classAll").text(classText);
    let membershipIdText = $("#membership_id").val() || "";
    $(".membershipIdAll").text(membershipIdText);
    let relationshipTypeText = $("#relationshipType").val()
        ? $("#relationshipType option:selected").text()
        : "";
    $(".relation_with_subscriberAll").text(relationshipTypeText);

    $(".addressAll").text($("#address").val() || "");
    $(".cityIdAll").text($("#cityId option:selected").text() || "");
    $(".districtIdAll").text($("#districtId option:selected").text() || "");
    $(".streetAll").text($("#street").val() || "");
    $(".building_noAll").text($("#building_no").val() || "");
    $(".post_codeAll").text($("#post_code").val() || "");
    $(".national_addressAll").text($("#national_address").val() || "");
    $(".emergency_nameAll").text($("#emergency_name").val() || "");
    $(".emergency_id_nationalAll").text(
        $("#emergency_id_national").val() || "",
    );
    $(".emergencyNumberAll").text($("#emergencyNumber").val() || "");
    $(".emergency_addressAll").text($("#emergency_address").val() || "");
    $(".occupationAll").text(
        $("#occupation option:selected").text() || $("#occupation").val() || "",
    );
    $(".relative_no_1All").text($("#relative_no_1").val() || "");
    $(".relative_no_1_phoneAll").text($("#relative_no_1_phone").val() || "");
    $(".relative_no_2All").text($("#relative_no_2").val() || "");
    $(".temporary_noAll").text($("#temporary_no").val() || "");
    $(".relative_no_2_phoneAll").text($("#relative_no_2_phone").val() || "");
    $(".note_field_for_contactAll").text(
        $("#note_field_for_contact").val() || "",
    );
    $(".brought_byAll").text($("#brought_by").val() || "");
    $(".brought_by_nurseAll").text($("#brought_by_nurse").val() || "");
    $(".registration_n_activation_noteAll").text(
        $("#registration_n_activation_note").val() || "",
    );
    $(".er_notesAll").text($("#er_notes").val() || "");
    $(".protocol_noteAll").text($("#protocol_note").val() || "");
    $(".emp_idAll").text($("#emp_id").val() || "");
    let relationship = $("#relationship").val()
        ? $("#relationship option:selected").text()
        : "";
    $(".relationshipAll").text(relationship);
    $(".phc_attributeAll").text($("#phc_attribute").val() || "");
    $(".referring_hospital_mrnAll").text(
        $("#referring_hospital_mrn").val() || "",
    );
    $(".referring_hospitalAll").text($("#referring_hospital").val() || "");
    $(".accepting_physicianAll").text($("#accepting_physician").val() || "");
    $(".employment_statusAll").text(
        $("#employment_status option:selected").text() ||
            $("#employment_status").val() ||
            "",
    );
    $(".education_statusAll").text(
        $("#education_status option:selected").text() ||
        $("#education_status").val() ||
        "",
    );
    let lang = $("#lang").val() ? $("#lang option:selected").text() : "";
    $(".langAll").text(lang);
    console.log("All data displayed successfully");
}
