$(document).ready(function () {
    $("#insurance_main_menu").addClass("active open menu-item-animating");
    $("#eligibility_check_history_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#eligibility_check_form_new_born").hide();
    $("#eligibility_check_form_relatedPatient").hide();

    const selectElements = [
        { id: "#payer", placeholder: "Select Payer" },
        { id: "#identifier_type", placeholder: "Select Identifier Type" },
        { id: "#prefix", placeholder: "Select Prefix" },
        { id: "#gender", placeholder: "Select Gender" },
        { id: "#marital_status", placeholder: "Select Marital Status" },
        { id: "#occupation", placeholder: "Select Occupation" },
        { id: "#religion", placeholder: "Select Religion" },
    ];

    const eligibilityType = $("#eligibilityType").val();
    console.log(eligibilityType);
    if (eligibilityType === "online") {
        $("#eligibilityOfflineDateDiv").hide();
        $("#eligibilityOfflineRefNoDiv").hide();
    } else {
        $("#eligibilityOfflineDateDiv").show();
        $("#eligibilityOfflineRefNoDiv").show();
    }
    flatpickr(".eligibilityOfflineDate", {
        enableTime: true,
        enableSeconds: true,
        dateFormat: "Y-m-d H:i:S",
        allowInput: true,
        time_24hr: true,
    });

    selectElements.forEach(function (item) {
        const selectElement = $(item.id);
        if (selectElement.length) {
            selectElement
                .wrap('<div class="position-relative"></div>')
                .select2({
                    placeholder: item.placeholder,
                    dropdownParent: selectElement.parent(),
                });
        }
    });
    $("#relationshipType").val("Self").trigger("change");
    $("#client-details").select2("destroy");
    $("#client-details")
        .wrap('<div class="position-relative"></div>')
        .select2({
            placeholder: "Search client",
            width: "100%",
            allowClear: true,
            ajax: {
                url: "/search-client",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        filters: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.map(function (item) {
                            console.log(item);
                            return {
                                id: item.clientId,
                                text: item.name,
                                clientId: item.clientId,
                                clientName_en: item.clientName_en,
                                clinicId: item.clinicId,
                                secondName_en: item.secondName_en,
                                thirdName_en: item.thirdName_en,
                                fourthName_en: item.fourthName_en,
                                mobile: item.mobile,
                                idNationalType: item.idNationalType,
                                idNational: item.idNational,
                                birthDate: item.birthDate,
                                gender: item.gender,
                                maritalStatus: item.maritalStatus,
                                occupation: item.occupation,
                                religion: item.religion,
                                policyNumber: item.policyNumber,
                                policyHolder: item.policyHolder,
                                policyClassName: item.policyClassName,
                                insurancePayerId: item.insurancePayerId,
                                membershipId: item.membershipId,
                                networkId: item.networkId,
                                coverageType: item.coverageType,
                                policyClassValue: item.policyClassValue,
                                policyClassCode: item.policyClassCode,
                                relationShipWithSubscriber:
                                    item.relationShipWithSubscriber,
                            };
                        }),
                    };
                },
                cache: true,
            },
        });

    $("#client-details").on("select2:select", function (e) {
        let selectedClient = e.params.data;
        console.log(selectedClient);
        $("#mrn").val(selectedClient.clientId);
        $("#identifier_type")
            .val(selectedClient.idNationalType)
            .trigger("change");
        $("#identifier_id").val(selectedClient.idNational);
        $("#first_name").val(selectedClient.clientName_en);
        $("#given_name").val(selectedClient.secondName_en);
        $("#family_name").val(selectedClient.fourthName_en);
        $("#payer").val(selectedClient.insurancePayerId).trigger("change");
        $("#clinicId").val(selectedClient.clinicId).trigger("change");
        $("#policy_no").val(selectedClient.policyNumber);
        $("#policy_holder_name").val(selectedClient.policyHolder);
        $("#class_name").val(selectedClient.policyClassName);
        $("#mobile_no").val(selectedClient.mobile);
        $("#birth_date").val(selectedClient.birthDate);
        $("#gender").val(selectedClient.gender).trigger("change");
        $("#marital_status")
            .val(selectedClient.maritalStatus)
            .trigger("change");
        $("#occupation").val(selectedClient.occupation).trigger("change");
        $("#religion").val(selectedClient.religion).trigger("change");
        $("#membership_no").val(selectedClient.membershipId);
        $("#coverage_type").val(selectedClient.coverageType).trigger("change");
        $("#class_code").val(selectedClient.policyClassCode);
        $("#class_value").val(selectedClient.policyClassValue);
        $("#network").val(selectedClient.networkId);
        console.log(selectedClient.relationShipWithSubscriber);
        $("#relationshipType")
            .val(selectedClient.relationShipWithSubscriber)
            .trigger("change");
    });

    $("#eligibility_request_purpose").select2({
        placeholder: "Select Eligibility Request Purpose",
        allowClear: true,
        width: "100%",
    });
    const allPurposes = $("#eligibility_request_purpose option")
        .map(function () {
            return this.value;
        })
        .get();
    $("#eligibility_request_purpose_selectAll").prop("checked", true);
    $("#eligibility_request_purpose")
        .val(allPurposes)
        .trigger("change.select2");
    $("#eligibility_request_purpose_selectAll").on("change", function () {
        if ($(this).is(":checked")) {
            $("#eligibility_request_purpose")
                .val(allPurposes)
                .trigger("change.select2");
            $(".eligibility_request_purpose_error").text("");
        } else {
            $("#eligibility_request_purpose").val([]).trigger("change.select2");
            $(".eligibility_request_purpose_error").text(
                "Please select at least one purpose for eligibility check.",
            );
        }
    });
    $("#eligibility_request_purpose").on("change", function () {
        let selectedValues = $(this).val() || [];
        if (selectedValues.length === 0) {
            $("#eligibility_request_purpose_selectAll").prop("checked", false);
            $(".eligibility_request_purpose_error").text(
                "Please select at least one purpose for eligibility check.",
            );
            return;
        }
        if (selectedValues.length !== allPurposes.length) {
            $("#eligibility_request_purpose_selectAll").prop("checked", false);
        } else {
            $("#eligibility_request_purpose_selectAll").prop("checked", true);
        }
        $(".eligibility_request_purpose_error").text("");
    });

    $("#hijri_date").change(function () {
        if ($(this).is(":checked")) {
            var dateInput = $("#birth_date").val();
            console.log(dateInput);
            localStorage.setItem("birth_date", dateInput);
            if (dateInput && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
                var parts = dateInput.split("-");
                var year = parseInt(parts[0], 10);
                var month = parseInt(parts[1], 10);
                var day = parseInt(parts[2], 10);
                var hijriDate = gregorianToHijri(year, month, day);
                console.log(hijriDate);
                $("#birth_date")
                    .attr("id", "hijiri_birth_date")
                    .attr("name", "hijiri_birth_date")
                    .attr("placeholder", "YYYY-MM-DD (Hijri)")
                    .val(
                        hijriDate.day +
                            "-" +
                            hijriDate.month +
                            "-" +
                            hijriDate.year,
                    )
                    .prop("readonly", true);
            }
        } else {
            var storedDate = localStorage.getItem("birth_date");
            console.log(storedDate);
            $("#hijiri_birth_date")
                .attr("id", "birth_date")
                .attr("name", "birth_date")
                .attr("placeholder", "YYYY-MM-DD")
                .val(storedDate)
                .prop("readonly", false);
        }
    });

    $("#priority").select2({
        width: "100%",
    });

    $("#identifier_type").select2({
        width: "100%",
    });

    $("#payer").select2({
        width: "100%",
    });

    $("#clinicId").select2({
        width: "100%",
    });

    $("#prefix").select2({
        width: "100%",
    });

    $("#gender").select2({
        width: "100%",
    });

    $("#marital_status").select2({
        width: "100%",
    });

    $("#occupation").select2({
        width: "100%",
    });

    $("#religion").select2({
        width: "100%",
    });

    $("#eligibilityType").select2({
        width: "100%",
    });

    $("#relationshipType").select2({
        width: "100%",
    });

    $("#eligibility_request_purpose").select2({
        width: "100%",
    });

    $("#new_born_gender").select2({
        width: "98%",
    });

    $("#relatedPatient_gender").select2({
        width: "100%",
    });

    function gregorianToHijri(year, month, day) {
        var jd =
            Math.floor(
                (1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4,
            ) +
            Math.floor(
                (367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12,
            ) -
            Math.floor(
                (3 *
                    Math.floor(
                        (year + 4900 + Math.floor((month - 14) / 12)) / 100,
                    )) /
                    4,
            ) +
            day -
            32075;
        var l = jd - 1948440 + 10632;
        var n = Math.floor((l - 1) / 10631);
        l = l - 10631 * n + 354;
        var j =
            Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
            Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
        l =
            l -
            Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
            Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
            29;
        var month = Math.floor((24 * l) / 709);
        var day = l - Math.floor((709 * month) / 24);
        var year = 30 * n + j - 30;
        var hijriMonths = [
            "مُحَرَّم",
            "صَفَر",
            "رَبِيْعُ الأَوّل",
            "رَبِيع ٱلْآخِر",
            "جَمَادِي الأَوّل",
            "جُمَادَىٰ ٱلْآخِرَة",
            "رَجَب",
            "شَعْبَان",
            "رَمَضَان",
            "شَوَّال",
            "ذُوالْقَعْدَة",
            "ذُوالْحِجَّة",
        ];
        return { year: year, month: hijriMonths[month - 1], day: day };
    }

    function toggleRelatedPatientForm() {
        const selectedValue = $("#relationshipType").val();
        if (selectedValue === "Self") {
            $("#eligibility_check_form_relatedPatient").hide();
        } else {
            $("#eligibility_check_form_relatedPatient").show();
            reinitializeClientSelect2();
        }
    }
    toggleRelatedPatientForm();
    $("#relationshipType").on("change", toggleRelatedPatientForm);

    function toggleNewBornForm() {
        const selectedValue = $("#relationshipType").val();
        if (selectedValue === "Child") {
            $("#eligibility_check_form_new_born").show();
            $("#eligibility_check_form_relatedPatient").hide();
        } else {
            $("#eligibility_check_form_new_born").hide();
        }
    }
    toggleNewBornForm();
    $("#relationshipType").on("change", toggleNewBornForm);

    function toggleCoverageFields() {
        if ($("#without_coverage").is(":checked")) {
            $("#membershipNoDiv").hide();
            $("#coverageTypeDiv").hide();
            $("#policyNoDiv").hide();
            $("#policyHolderNameDiv").hide();
            $("#classCodeDiv").hide();
            $("#classNameDiv").hide();
            $("#classValueDiv").hide();
            $("#networkDiv").hide();
        } else {
            $("#membershipNoDiv").show();
            $("#coverageTypeDiv").show();
            $("#policyNoDiv").show();
            $("#policyHolderNameDiv").show();
            $("#classCodeDiv").show();
            $("#classNameDiv").show();
            $("#classValueDiv").show();
            $("#networkDiv").show();
        }
    }
    toggleCoverageFields();
    $("#without_coverage").on("change", toggleCoverageFields);

    $("#submitEligibility").click(function (e) {
        e.preventDefault();
        var formData = new FormData($("#eligibilityCheck")[0]);

        var isTransferral = $("#is_transferral_toggle").is(":checked") ? 1 : 0;
        var withoutCoverage = $("#without_coverage").is(":checked") ? 1 : 0;
        var isEmergency = $("#is_emergency_toggle").is(":checked") ? 1 : 0;
        var isHijiri = $("#hijri_date").is(":checked") ? 1 : 0;

        formData.append("is_transferral", isTransferral);
        formData.append("is_emergency", isEmergency);
        formData.append("is_hijiri", isHijiri);
        formData.append("without_coverage", withoutCoverage);

        if (isHijiri) {
            var hijriDate = $("#hijiri_birth_date").val();
            formData.append("hijiri_date", hijriDate);
            formData.delete("birth_date");
        } else {
            var birthDate = $("#birth_date").val();
            formData.append("birth_date", birthDate);
            formData.delete("hijiri_date");
        }

        if ($("#relationshipType").val() === "Child") {
            var newbornForm = $("#eligibility_check_form_new_born");

            newbornForm.find("input, select").each(function () {
                var name = $(this).attr("name");
                var value = $(this).val();
                if (name) {
                    formData.append(name, value);
                }
            });
        } else if (
            $("#relationshipType").val() === "Parent" ||
            $("#relationshipType").val() === "Spouse" ||
            $("#relationshipType").val() === "Common Law Spouse" ||
            $("#relationshipType").val() === "Injured Party" ||
            $("#relationshipType").val() === "Other"
        ) {
            var relatedClientForm = $("#eligibility_check_form_relatedPatient");

            relatedClientForm.find("input, select").each(function () {
                var name = $(this).attr("name");
                var value = $(this).val();
                if (name) {
                    formData.append(name, value);
                }
            });
        }
        $("#loader-overlay").show();
        $.ajax({
            url: "store-insurance-eligibility-check",
            method: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error Detected!",
                        html: `<b>Error Code:</b> ${response.errorCode} <br> <b>Message:</b> ${response.errorMessage}`,
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                } else {
                    if (response.nphiesStatus === "eligible") {
                        Swal.fire({
                            icon: "success",
                            title: "Success!",
                            text: response.message,
                            customClass: { confirmButton: "btn btn-success" },
                        }).then(() => {
                            window.location.href =
                                BASE_URL +
                                "/insurance-eligibility-check-history";
                        });
                    } else {
                        Swal.fire({
                            icon: "warning",
                            title: "Eligibility Status",
                            text: `Your eligibility Status is: ${response.nphiesStatus}`,
                            customClass: { confirmButton: "btn btn-warning" },
                        });
                    }
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.responseJSON && xhr.responseJSON.errors) {
                    var errors = xhr.responseJSON.errors;
                    $.each(errors, function (field, messages) {
                        $("." + field + "_error").text(messages[0]);
                    });
                    if (errors.identifier_id) {
                        $(".identifier_id_error").text(errors.identifier_id[1]);
                    }
                    Swal.fire({
                        icon: "error",
                        title: "Validation Error",
                        text: "Please fix the highlighted errors and try again.",
                        customClass: { confirmButton: "btn btn-warning" },
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong! Please try again later.",
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            },
        });
    });

    let selectedIdentifierType = "";
    $(document).on(
        "click",
        "#identifier_id + .btn + .dropdown-menu .dropdown-item",
        function (e) {
            e.preventDefault();
            let identifierId = $("#identifier_id").val().trim();
            let selectedIdentifierType = $(this).attr("id");
            if (!identifierId) {
                Swal.fire({
                    icon: "warning",
                    title: "Oops...",
                    text: "Please enter an identifier ID before selecting a type.",
                    customClass: { confirmButton: "btn btn-warning" },
                });
                return false;
            }
            fetchEligibilityCheckDetails(identifierId, selectedIdentifierType);
        },
    );

    $("#without_coverage").on("change", function () {
        let disabled = $(this).is(":checked");
        $(
            "#membership_no, #coverage_type, #policy_no, #policy_holder_name, #class_code, #class_name, #class_value, #network",
        )
            .val("")
            .prop("disabled", disabled)
            .trigger("change");
    });

    function fetchEligibilityCheckDetails(identifierId, identifierType) {
        $.ajax({
            url: "/eligibility-check-get-details",
            type: "GET",
            data: {
                identifier_id: identifierId,
                identifier_type: identifierType,
            },
            success: function (response) {
                if (!response.data) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Invalid response data.",
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                    return;
                }
                let fullName = response.data.fullName;
                let gender = response.data.gender
                    ? response.data.gender.toLowerCase()
                    : "";

                $("#first_name").val(fullName);
                $("#gender").val(gender).trigger("change");
                let withoutCoverageChecked =
                    $("#without_coverage").is(":checked");
                if (
                    !withoutCoverageChecked &&
                    response.data.insurancePlans &&
                    response.data.insurancePlans.length > 0
                ) {
                    let plan = response.data.insurancePlans[0];

                    $("#policy_no").val(plan.policyNumber);
                    $("#class_name").val(plan.policyClassName);
                    $("#membership_no").val(plan.memberCardId);
                    $("#policy_holder_name").val(plan.policyHolder);
                }
                if (
                    !withoutCoverageChecked &&
                    (!response.data.insurancePlans ||
                        response.data.insurancePlans.length === 0)
                ) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "No insurance plans found.",
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to fetch details due to a technical issue. Please try again later.",
                    customClass: { confirmButton: "btn btn-danger" },
                });
            },
        });
    }

    $("#new_born_select").select2();
    $("#client-details").on("change", function () {
        var clientId = $(this).val();
        if (clientId) {
            $.ajax({
                url: "/get-child-clients/" + clientId,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    $("#new_born_select").empty();
                    $("#new_born_select").append(
                        '<option value="">Select Newborn Baby</option>',
                    );

                    $.each(data, function (key, value) {
                        var fullName =
                            (value.clientName_en ?? "") +
                            " " +
                            (value.secondName_en ?? "") +
                            " " +
                            (value.fourthName_en ?? "");

                        var option = new Option(
                            fullName,
                            value.clientId,
                            false,
                            false,
                        );
                        $(option).data({
                            gender: value.gender,
                            birthDate: value.birthDate,
                        });

                        $("#new_born_select").append(option);
                    });

                    $("#new_born_select").trigger("change");
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Unable to fetch child clients..",
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                },
            });
        } else {
            $("#new_born_select")
                .empty()
                .append('<option value="">Select Baby</option>')
                .trigger("change");
        }
    });

    $("#new_born_select").on("select2:select", function (e) {
        let selectedOption = $(e.target).find(
            'option[value="' + e.params.data.id + '"]',
        );

        let gender = selectedOption.data("gender");
        let birthDate = selectedOption.data("birthDate");

        $(".new_born_birth_date_error").text("");

        if (birthDate) {
            let today = new Date();
            let dob = new Date(birthDate);

            let diffTime = today.getTime() - dob.getTime();
            let diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (diffDays > 90) {
                $(".new_born_birth_date_error").text(
                    "Child birthdate cannot exceed 90 days",
                );

                $("#new_born_birth_date").val("");
                $("#new_born_mrn").val("");
                $("#new_born_gender").val("").trigger("change");

                $("#new_born_select").val(null).trigger("change");

                return false;
            }
        }

        $("#new_born_mrn").val(e.params.data.id);
        $("#new_born_gender").val(gender).trigger("change");
        $("#new_born_birth_date").val(birthDate);
    });

    $("#relatedPatient_select").on("select2:select", function (e) {
        let selectedClient = e.params.data;
        $("#relatedPatient_mrn").val(selectedClient.clientId);
        $("#relatedPatient_birth_date").val(selectedClient.birthDate);
        $("#relatedPatient_gender")
            .val(selectedClient.gender)
            .trigger("change");
    });
});

$(document).on("change", "#eligibilityType", function () {
    const selected = $(this).val();
    console.log(selected);
    if (selected === "offline") {
        $("#eligibilityOfflineDateDiv").show();
        $("#eligibilityOfflineRefNoDiv").show();
    } else {
        $("#eligibilityOfflineDateDiv").hide();
        $("#eligibilityOfflineRefNoDiv").hide();
    }
});

function reinitializeClientSelect2() {
    $("#relatedPatient_select").select2({
        placeholder: "Search Related client",
        allowClear: true,
        ajax: {
            url: "/search-client",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    filters: params.term,
                };
            },
            processResults: function (data) {
                return {
                    results: data.map(function (item) {
                        console.log(item);
                        return {
                            id: item.clientId,
                            text: item.name,
                            clientId: item.clientId,
                            clientName_en: item.clientName_en,
                            secondName_en: item.secondName_en,
                            thirdName_en: item.thirdName_en,
                            fourthName_en: item.fourthName_en,
                            mobile: item.mobile,
                            idNationalType: item.idNationalType,
                            idNational: item.idNational,
                            birthDate: item.birthDate,
                            gender: item.gender,
                            maritalStatus: item.maritalStatus,
                            occupation: item.occupation,
                            religion: item.religion,
                            policyNumber: item.policyNumber,
                            policyHolder: item.policyHolder,
                            policyClassName: item.policyClassName,
                            insurancePayerId: item.insurancePayerId,
                        };
                    }),
                };
            },
            cache: true,
        },
    });
}
