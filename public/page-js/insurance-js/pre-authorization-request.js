let diagnosisTypeOptions = `
  <option value="">Select Diagnosis Type</option>
  <option value="principal">Principal</option>
  <option value="admitting">Admitting</option>
  <option value="differential">Differential</option>
  <option value="secondary">Secondary</option>
  <option value="discharge">Discharge</option>
`;
let conditionOnsetOptions = `
  <option value="">Select Condition Onset</option>
  <option value="COEA">
    Condition with onset during the episode of admitted patient care
  </option>
  <option value="CNNA">
    Condition not noted as arising during the episode of admitted patient care
  </option>
  <option value="NR">
    Not reported
  </option>
`;
let fileArray = [];

function updateEligibilityDivs(eligibilityType) {
    if (eligibilityType === "offline") {
        $("#eligibilityOfflineRefNoDiv").show();
        $("#eligibilityOfflineDateDiv").show();
        $("#eligibilityOnlineRefNoDiv").hide();
    } else {
        $("#eligibilityOfflineRefNoDiv").hide();
        $("#eligibilityOfflineDateDiv").hide();
        $("#eligibilityOnlineRefNoDiv").show();
    }
}

$(document).on("change", "#eligibilityType", function () {
    const selected = $(this).val();
    updateEligibilityDivs(selected);
});

$(document).ready(function () {
    toggleTableHead("#icu_hour_table_body", "#icu_hour_table_head");
    toggleTableHead("#lab_loinc_table_body", "#lab_loinc_table_head");
    toggleTableHead("#on_set_table_body", "#on_set_table_head");
    $("#eligibilityType").val("online").trigger("change");
    $("#preAuthorizationDetails").val("online").trigger("change");
    const submitValue = $("#submitAction").val();
    if (submitValue === "pre-authorization") {
        $("#insurance_main_menu").addClass("active open menu-item-animating");
        $("#pre_authorization_sub_menu").addClass("active");
        $("#request_form").attr("id", "pre_authorization_request_form");
        $("#submit_request_btn").attr("id", "preauthorization_request_btn");
        $("#requestHead").text("Pre-authorization Request");
        $("#requestSpan").text("Pre-authorization Request");
        $("#requestFormHead").text("Pre-authorization Request");
        $("#preAuthorizationTypeLab").text("PreAuthorization Type");
        $("#preSubAuthorizationTypeLab").text("PreAuthorization Sub Type");
        $("#episodeNoDiv").hide();
        $("#accountingPeriodDiv").hide();
        $("#claimReferenceDiv").hide();
        $("#preAuthorizationDetailsDiv").hide();
        $("#eligibilityTypeDiv").show();
        $("#eligibilityOfflineDateDiv").hide();
        $("#eligibilityOfflineRefNoDiv").hide();
        $("#preAuthorizationDateDiv").hide();
        $("#preAuthorizationRefNoDiv").hide();
        $("#preAuthorizationResIdetifierValueDiv").hide();
        $("#preAuthorizationResIdetifierUrlDiv").hide();
        $("#tabDiv").hide();
        $("#request_response").hide();
        $("#table_of_nphies-response").hide();
        $("#communication-request").hide();
        $("#warning_errors-request").hide();
        $("#patientInvoiceNoDiv").hide();
        $("#claimApprovedDetailsDiv").hide();
        $("#claimApprovedDetails_a_tag_div").hide();
        $("#medications_div").hide();
        $("#medications_a_tag_div").hide();
        $("#status_buttons_div").hide();
        $("#prescription-documentation-details-vertical-tab").hide();
    } else if (submitValue === "pre-authorization-from-doctor") {
        $("#insurance_main_menu").addClass("active open menu-item-animating");
        $("#pre_authorization_sub_menu").addClass("active");
        $("#request_form").attr("id", "pre_authorization_request_form");
        $("#submit_request_btn").attr("id", "preauthorization_request_btn");
        $("#requestHead").text("Pre-authorization Request");
        $("#requestSpan").text("Pre-authorization Request");
        $("#requestFormHead").text("Pre-authorization Request");
        $("#preAuthorizationTypeLab").text("PreAuthorization Type");
        $("#preSubAuthorizationTypeLab").text("PreAuthorization Sub Type");
        $("#episodeNoDiv").hide();
        $("#accountingPeriodDiv").hide();
        $("#claimReferenceDiv").hide();
        $("#preAuthorizationDetailsDiv").hide();
        $("#eligibilityTypeDiv").show();
        $("#eligibilityOfflineDateDiv").hide();
        $("#eligibilityOfflineRefNoDiv").hide();
        $("#preAuthorizationDateDiv").hide();
        $("#preAuthorizationRefNoDiv").hide();
        $("#preAuthorizationResIdetifierValueDiv").hide();
        $("#preAuthorizationResIdetifierUrlDiv").hide();
        $("#tabDiv").hide();
        $("#request_response").hide();
        $("#table_of_nphies-response").hide();
        $("#communication-request").hide();
        $("#warning_errors-request").hide();
        $("#patientInvoiceNoDiv").hide();
        $("#claimApprovedDetailsDiv").hide();
        $("#claimApprovedDetails_a_tag_div").hide();
        $("#medications_div").hide();
        $("#medications_a_tag_div").hide();
        $("#status_buttons_div").hide();
        $("#prescription-documentation-details-vertical-tab").show();
    } else if (submitValue === "resubmission-pre-authorization") {
        $("#insurance_main_menu").addClass("active open menu-item-animating");
        $("#pre_authorization_sub_menu").addClass("active");
        $("#request_form").attr(
            "id",
            "resubmission_pre_authorization_request_form",
        );
        $("#submit_request_btn").attr(
            "id",
            "resubmission_preauthorization_request_btn",
        );
        $("#requestHead").text("Resubmission-Pre-authorization Request");
        $("#requestSpan").text("Resubmission Request");
        $("#requestFormHead").text("Resubmission-Pre-authorization Request");
        $("#preAuthorizationTypeLab").text("PreAuthorization Type");
        $("#preSubAuthorizationTypeLab").text("PreAuthorization Sub Type");
        $("#claimReferenceDiv").show();
        $("#episodeNoDiv").hide();
        $("#accountingPeriodDiv").hide();
        $("#preAuthorizationDetailsDiv").hide();
        $("#eligibilityTypeDiv").show();
        $("#eligibilityOfflineDateDiv").hide();
        $("#eligibilityOfflineRefNoDiv").hide();
        $("#preAuthorizationDateDiv").hide();
        $("#preAuthorizationRefNoDiv").hide();
        $("#preAuthorizationResIdetifierValueDiv").hide();
        $("#preAuthorizationResIdetifierUrlDiv").hide();
        $("#tabDiv").hide();
        $("#request_response").hide();
        $("#table_of_nphies-response").hide();
        $("#communication-request").hide();
        $("#warning_errors-request").hide();
        $("#patientInvoiceNoDiv").hide();
        $("#claimApprovedDetailsDiv").hide();
        $("#claimApprovedDetails_a_tag_div").hide();
        $("#medications_div").hide();
        $("#medications_a_tag_div").hide();
        $("#status_buttons_div").hide();
        $("#prescription-documentation-details-vertical-tab").hide();
    } else if (submitValue === "claimDirect") {
        $("#claim_main_menu").addClass("active open menu-item-animating");
        $("#claims_direct_sub_menu").addClass("active");
        $("#request_form").attr("id", "claim_request_form");
        $("#submit_request_btn").attr("id", "claim_request_btn");
        $("#request_form").attr("id", "claim_request_form");
        $("#submit_request_btn").attr("id", "claim_request_btn");
        $("#requestHead").text("Claim-Management Request");
        $("#requestSpan").text("Claim-Management Request");
        $("#requestFormHead").text("Claim-Management Request");
        $("#preAuthorizationTypeLab").text("Claim Type");
        $("#preSubAuthorizationTypeLab").text("Claim Sub Type");
        $("#claimReferenceDiv").hide();
        $("#episodeNoDiv").show();
        $("#accountingPeriodDiv").show();
        $("#preAuthorizationDetailsDiv").show();
        $("#preAuthorizationDateDiv").hide();
        $("#preAuthorizationRefNoDiv").show();
        $("#eligibilityTypeDiv").hide();
        $("#eligibilityOfflineDateDiv").hide();
        $("#eligibilityOfflineRefNoDiv").hide();
        $("#tabDiv").hide();
        $("#request_response").hide();
        $("#table_of_nphies-response").hide();
        $("#communication-request").hide();
        $("#warning_errors-request").hide();
        $("#patientInvoiceNoDiv").show();
        $("#claimApprovedDetailsDiv").show();
        $("#claimApprovedDetails_a_tag_div").show();
        $("#medications_div").hide();
        $("#medications_a_tag_div").hide();
        $("#status_buttons_div").hide();
        $("#prescription-documentation-details-vertical-tab").hide();
    } else if (submitValue === "claim") {
        $("#claim_main_menu").addClass("active open menu-item-animating");
        $("#claims_management_sub_menu").addClass("active");
        $("#request_form").attr("id", "claim_request_form");
        $("#submit_request_btn").attr("id", "claim_request_btn");
        $("#request_form").attr("id", "claim_request_form");
        $("#submit_request_btn").attr("id", "claim_request_btn");
        $("#requestHead").text("Claim-Management Request");
        $("#requestSpan").text("Claim-Management Request");
        $("#requestFormHead").text("Claim-Management Request");
        $("#preAuthorizationTypeLab").text("Claim Type");
        $("#preSubAuthorizationTypeLab").text("Claim Sub Type");
        $("#claimReferenceDiv").hide();
        $("#episodeNoDiv").show();
        $("#accountingPeriodDiv").show();
        $("#preAuthorizationDetailsDiv").show();
        $("#preAuthorizationDateDiv").hide();
        $("#preAuthorizationRefNoDiv").show();
        $("#eligibilityTypeDiv").hide();
        $("#eligibilityOfflineDateDiv").hide();
        $("#eligibilityOfflineRefNoDiv").hide();
        $("#tabDiv").hide();
        $("#request_response").hide();
        $("#table_of_nphies-response").hide();
        $("#communication-request").hide();
        $("#warning_errors-request").hide();
        $("#patientInvoiceNoDiv").show();
        $("#claimApprovedDetailsDiv").show();
        $("#claimApprovedDetails_a_tag_div").show();
        $("#medications_div").hide();
        $("#medications_a_tag_div").hide();
        $("#status_buttons_div").hide();
        $("#prescription-documentation-details-vertical-tab").hide();
    } else if (submitValue === "viewPreAuthorization") {
        $("#insurance_main_menu").addClass("active open menu-item-animating");
        $("#pre_authorization_sub_menu").addClass("active");
        $("#request_form").attr("id", "pre_authorization_request_form");
        $("#cancel_request_btn").attr(
            "id",
            "preauthorization_request_cancel_btn",
        );
        $("#cancelRequest").attr("id", "preauthorizationRequestCancelBtn");
        $("#requestHead").hide();
        $("#requestSpan").text("Pre-authorization Request");
        $("#requestFormHead").text("Pre-authorization Request");
        $("#preAuthorizationTypeLab").text("PreAuthorization Type");
        $("#preSubAuthorizationTypeLab").text("PreAuthorization Sub Type");
        $("#claimReferenceDiv").show();
        $("#episodeNoDiv").hide();
        $("#accountingPeriodDiv").hide();
        $("#preAuthorizationDetailsDiv").hide();
        $("#eligibilityTypeDiv").show();
        $("#eligibilityOfflineDateDiv").show();
        $("#eligibilityOfflineRefNoDiv").show();
        $("#preAuthorizationDateDiv").hide();
        $("#preAuthorizationRefNoDiv").hide();
        $("#preAuthorizationResIdetifierValueDiv").hide();
        $("#preAuthorizationResIdetifierUrlDiv").hide();
        $("#requestResponseTabHead").text("Pre-authorization Request");
        $("#nphiesResponseTabHead").text("Nphies Response");
        $("#communicationRequestTabHead").text("Commmunication Request");
        $("#warningErrorTabHead").text("Warning & Errors");
        $("#requestResponseHead").text("Pre-authorization Request");
        $("#patientInvoiceNoDiv").show();
        $("#claimApprovedDetailsDiv").show();
        $("#claimApprovedDetails_a_tag_div").show();
        $("#medications_div").hide();
        $("#medications_a_tag_div").hide();
        $("#prescription-documentation-details-vertical-tab").hide();
    } else if (submitValue === "viewClaim") {
        $("#claim_main_menu").addClass("active open menu-item-animating");
        $("#claims_submitted_sub_menu").addClass("active");
        $("#request_form").attr("id", "claim_request_form");
        $("#cancel_request_btn").attr("id", "claim_request_cancel_btn");
        $("#cancelRequest").attr("id", "claimRequestCancelBtn");
        $("#requestHead").hide();
        $("#requestSpan").text("Claim-Management Request");
        $("#requestFormHead").text("Claim-Management Request");
        $("#preAuthorizationTypeLab").text("Claim Type");
        $("#preSubAuthorizationTypeLab").text("Claim Sub Type");
        $("#claimReferenceDiv").hide();
        $("#episodeNoDiv").show();
        $("#accountingPeriodDiv").show();
        $("#preAuthorizationDetailsDiv").show();
        $("#eligibilityTypeDiv").hide();
        $("#eligibilityOfflineDateDiv").hide();
        $("#eligibilityOfflineRefNoDiv").hide();
        $("#preAuthorizationDateDiv").hide();
        $("#preAuthorizationRefNoDiv").show();
        $("#requestResponseTabHead").text("Claim Request");
        $("#nphiesResponseTabHead").text("Nphies Response");
        $("#communicationRequestTabHead").text("Commmunication Request");
        $("#warningErrorTabHead").text("Warning & Errors");
        $("#requestResponseHead").text("Claim Request");
        $("#patientInvoiceNoDiv").show();
        $("#claimApprovedDetailsDiv").show();
        $("#claimApprovedDetails_a_tag_div").show();
        $("#medications_div").hide();
        $("#medications_a_tag_div").hide();
        $("#prescription-documentation-details-vertical-tab").hide();
    } else if (submitValue === "advancedPreauthorization") {
        $("#insurance_main_menu").addClass("active open menu-item-animating");
        $("#advance_pre_authorization_sub_menu").addClass("active");
        $("#request_form").attr("id", "advanced_preauthorization_form");
        $("#cancel_request_btn").attr(
            "id",
            "advanced_preauthorization_cancel_btn",
        );
        $("#cancelRequest").attr("id", "advancedPreauthorizationCancelBtn");
    }

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#preAuthorizationType, #preSubAuthorizationType").on(
        "select2:opening",
        function (e) {
            const payerId = $("#insurancePayerId").val();
            if (!payerId) {
                e.preventDefault();
                Swal.fire({
                    icon: "error",
                    title: "Payer is not selected",
                    text: "Please select the Payer first",
                    confirmButtonColor: "#d33",
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    position: "center",
                });
            }
        },
    );

    typeSelectedShowingDivs();

    const selectedMainType = $("#preAuthorizationType").val();
    const selectedSubType = $("#preSubAuthorizationType").val();
    const selectedRelationship = $("#relationshipType").val();
    console.log(selectedRelationship);
    if (selectedMainType) {
        $("#preAuthorizationType").val(selectedMainType).trigger("change");
    }
    if (selectedSubType) {
        $("#preSubAuthorizationType").val(selectedSubType).trigger("change");
    }
    if (selectedRelationship) {
        isProgrammaticRelationshipChange = true;
        $("#relationshipType").val(selectedRelationship).trigger("change");
    }

    // const eligibilityCheckId = $("#reSubmissionEligibilityCheckId").val();
    // if (eligibilityCheckId) {
    //     getEligibilityRefNoDetailsById(eligibilityCheckId);
    // }

    // var temperatureSlider = document.getElementById("temperature-slider");
    // var weightSlider = document.getElementById("weight-slider");
    // var admissionWeightSlider = document.getElementById(
    //     "admission-weight-slider",
    // );
    // var birthWeightSlider = document.getElementById("birth-weight-slider");
    // var heightSlider = document.getElementById("height-slider");
    // var pulseSlider = document.getElementById("pulse-slider");
    // var systolicBloodPressureSlider = document.getElementById(
    //     "systolic-blood-pressure-slider",
    // );
    // var diastolicBloodPressureSlider = document.getElementById(
    //     "diastolic-blood-pressure-slider",
    // );
    // var oxygenSaturationSlider = document.getElementById(
    //     "oxygen-saturation-slider",
    // );
    // var respiratoryRateSlider = document.getElementById(
    //     "respiratory-rate-slider",
    // );
    // var temperatureSliderValue = document.getElementById(
    //     "temperature-slider-value",
    // );
    // var weightSliderValue = document.getElementById("weight-slider-value");
    // var admissionWeightSliderValue = document.getElementById(
    //     "admission-weight-slider-value",
    // );
    // var birthWeightSliderValue = document.getElementById(
    //     "birth-weight-slider-value",
    // );
    // var heightSliderValue = document.getElementById("height-slider-value");
    // var pulseSliderValue = document.getElementById("pulse-slider-value");
    // var systolicBloodPressureSliderValue = document.getElementById(
    //     "systolic-blood-pressure-slider-value",
    // );
    // var diastolicBloodPressureSliderValue = document.getElementById(
    //     "diastolic-blood-pressure-slider-value",
    // );
    // var oxygenSaturationSliderValue = document.getElementById(
    //     "oxygen-saturation-slider-value",
    // );
    // var respiratoryRateSliderValue = document.getElementById(
    //     "respiratory-rate-slider-value",
    // );
    // if (temperatureSlider && temperatureSliderValue) {
    //     const initialValue = parseInt(temperatureSliderValue.value) || 35;
    //     noUiSlider.create(temperatureSlider, {
    //         start: initialValue,
    //         connect: [true, false],
    //         direction: isRtl ? "rtl" : "ltr",
    //         range: {
    //             min: 30,
    //             max: 45,
    //         },
    //         step: 1,
    //     });
    //     temperatureSlider.noUiSlider.on("update", function (values, handle) {
    //         temperatureSliderValue.value = Math.round(values[handle]);
    //     });
    //     temperatureSliderValue.addEventListener("input", function () {
    //         let value = parseInt(this.value);
    //         if (!isNaN(value) && value >= 30 && value <= 45) {
    //             temperatureSlider.noUiSlider.set(value);
    //         }
    //     });
    // } else {
    //     console.error("Slider or input element not found.");
    // }
    // if (weightSlider && weightSliderValue) {
    //     const initialValue = parseInt(weightSliderValue.value) || 50;
    //     noUiSlider.create(weightSlider, {
    //         start: initialValue,
    //         connect: [true, false],
    //         direction: isRtl ? "rtl" : "ltr",
    //         range: {
    //             min: 1,
    //             max: 300,
    //         },
    //         step: 1,
    //     });
    //     weightSlider.noUiSlider.on("update", function (values, handle) {
    //         weightSliderValue.value = Math.round(values[handle]);
    //     });
    //     weightSliderValue.addEventListener("input", function () {
    //         let value = parseInt(this.value);
    //         if (!isNaN(value) && value >= 1 && value <= 300) {
    //             weightSlider.noUiSlider.set(value);
    //         }
    //     });
    // } else {
    //     console.error("Slider or input element not found.");
    // }
    // if (admissionWeightSlider && admissionWeightSliderValue) {
    //     const initialValue = parseInt(admissionWeightSliderValue.value) || 50;
    //     noUiSlider.create(admissionWeightSlider, {
    //         start: initialValue,
    //         connect: [true, false],
    //         direction: isRtl ? "rtl" : "ltr",
    //         range: {
    //             min: 1,
    //             max: 300,
    //         },
    //         step: 1,
    //     });
    //     admissionWeightSlider.noUiSlider.on(
    //         "update",
    //         function (values, handle) {
    //             admissionWeightSliderValue.value = Math.round(values[handle]);
    //         },
    //     );
    //     admissionWeightSliderValue.addEventListener("input", function () {
    //         let value = parseInt(this.value);
    //         if (!isNaN(value) && value >= 1 && value <= 300) {
    //             admissionWeightSlider.noUiSlider.set(value);
    //         }
    //     });
    // } else {
    //     console.error("Slider or input element not found.");
    // }
    // if (birthWeightSlider && birthWeightSliderValue) {
    //     const initialValue = parseInt(birthWeightSliderValue.value) || 1;
    //     noUiSlider.create(birthWeightSlider, {
    //         start: initialValue,
    //         connect: [true, false],
    //         direction: isRtl ? "rtl" : "ltr",
    //         range: {
    //             min: 1,
    //             max: 5,
    //         },
    //         step: 1,
    //     });
    //     birthWeightSlider.noUiSlider.on("update", function (values, handle) {
    //         birthWeightSliderValue.value = Math.round(values[handle]);
    //     });
    //     birthWeightSliderValue.addEventListener("input", function () {
    //         let value = parseInt(this.value);
    //         if (!isNaN(value) && value >= 1 && value <= 5) {
    //             birthWeightSlider.noUiSlider.set(value);
    //         }
    //     });
    // } else {
    //     console.error("Slider or input element not found.");
    // }
    // if (heightSlider && heightSliderValue) {
    //     const initialValue = parseInt(heightSliderValue.value) || 50;
    //     noUiSlider.create(heightSlider, {
    //         start: initialValue,
    //         connect: [true, false],
    //         direction: isRtl ? "rtl" : "ltr",
    //         range: {
    //             min: 1,
    //             max: 250,
    //         },
    //         step: 1,
    //     });
    //     heightSlider.noUiSlider.on("update", function (values, handle) {
    //         heightSliderValue.value = Math.round(values[handle]);
    //     });
    //     heightSliderValue.addEventListener("input", function () {
    //         let value = parseInt(this.value);
    //         if (!isNaN(value) && value >= 1 && value <= 250) {
    //             heightSlider.noUiSlider.set(value);
    //         }
    //     });
    // } else {
    //     console.error("Slider or input element not found.");
    // }
    // if (pulseSlider && pulseSliderValue) {
    //     const initialValue = parseInt(pulseSliderValue.value) || 50;
    //     noUiSlider.create(pulseSlider, {
    //         start: initialValue,
    //         connect: [true, false],
    //         direction: isRtl ? "rtl" : "ltr",
    //         range: {
    //             min: 30,
    //             max: 220,
    //         },
    //         step: 1,
    //     });
    //     pulseSlider.noUiSlider.on("update", function (values, handle) {
    //         pulseSliderValue.value = Math.round(values[handle]);
    //     });
    //     pulseSliderValue.addEventListener("input", function () {
    //         let value = parseInt(this.value);
    //         if (!isNaN(value) && value >= 30 && value <= 220) {
    //             pulseSlider.noUiSlider.set(value);
    //         }
    //     });
    // } else {
    //     console.error("Slider or input element not found.");
    // }
    // if (systolicBloodPressureSlider && systolicBloodPressureSliderValue) {
    //     const initialValue =
    //         parseInt(systolicBloodPressureSliderValue.value) || 70;
    //     noUiSlider.create(systolicBloodPressureSlider, {
    //         start: initialValue,
    //         connect: [true, false],
    //         direction: isRtl ? "rtl" : "ltr",
    //         range: {
    //             min: 50,
    //             max: 300,
    //         },
    //         step: 1,
    //     });
    //     systolicBloodPressureSlider.noUiSlider.on(
    //         "update",
    //         function (values, handle) {
    //             systolicBloodPressureSliderValue.value = Math.round(
    //                 values[handle],
    //             );
    //         },
    //     );
    //     systolicBloodPressureSliderValue.addEventListener("input", function () {
    //         let value = parseInt(this.value);
    //         if (!isNaN(value) && value >= 50 && value <= 300) {
    //             systolicBloodPressureSlider.noUiSlider.set(value);
    //         }
    //     });
    // } else {
    //     console.error("Slider or input element not found.");
    // }
    // if (diastolicBloodPressureSlider && diastolicBloodPressureSliderValue) {
    //     const initialValue =
    //         parseInt(diastolicBloodPressureSliderValue.value) || 70;
    //     noUiSlider.create(diastolicBloodPressureSlider, {
    //         start: initialValue,
    //         connect: [true, false],
    //         direction: isRtl ? "rtl" : "ltr",
    //         range: {
    //             min: 30,
    //             max: 200,
    //         },
    //         step: 1,
    //     });
    //     diastolicBloodPressureSlider.noUiSlider.on(
    //         "update",
    //         function (values, handle) {
    //             diastolicBloodPressureSliderValue.value = Math.round(
    //                 values[handle],
    //             );
    //         },
    //     );
    //     diastolicBloodPressureSliderValue.addEventListener(
    //         "input",
    //         function () {
    //             let value = parseInt(this.value);
    //             if (!isNaN(value) && value >= 30 && value <= 200) {
    //                 diastolicBloodPressureSlider.noUiSlider.set(value);
    //             }
    //         },
    //     );
    // } else {
    //     console.error("Slider or input element not found.");
    // }
    // if (oxygenSaturationSlider && oxygenSaturationSliderValue) {
    //     const initialValue = parseInt(oxygenSaturationSliderValue.value) || 95;
    //     noUiSlider.create(oxygenSaturationSlider, {
    //         start: initialValue,
    //         connect: [true, false],
    //         direction: isRtl ? "rtl" : "ltr",
    //         range: {
    //             min: 50,
    //             max: 100,
    //         },
    //         step: 1,
    //     });
    //     oxygenSaturationSlider.noUiSlider.on(
    //         "update",
    //         function (values, handle) {
    //             oxygenSaturationSliderValue.value = Math.round(values[handle]);
    //         },
    //     );
    //     oxygenSaturationSliderValue.addEventListener("input", function () {
    //         let value = parseInt(this.value);
    //         if (!isNaN(value) && value >= 1 && value <= 100) {
    //             oxygenSaturationSlider.noUiSlider.set(value);
    //         }
    //     });
    // } else {
    //     console.error("Slider or input element not found.");
    // }
    // if (respiratoryRateSlider && respiratoryRateSliderValue) {
    //     const initialValue = parseInt(respiratoryRateSliderValue.value) || 12;
    //     noUiSlider.create(respiratoryRateSlider, {
    //         start: initialValue,
    //         connect: [true, false],
    //         direction: isRtl ? "rtl" : "ltr",
    //         range: {
    //             min: 5,
    //             max: 80,
    //         },
    //         step: 1,
    //     });
    //     respiratoryRateSlider.noUiSlider.on(
    //         "update",
    //         function (values, handle) {
    //             respiratoryRateSliderValue.value = Math.round(values[handle]);
    //         },
    //     );
    //     respiratoryRateSliderValue.addEventListener("input", function () {
    //         let value = parseInt(this.value);
    //         if (!isNaN(value) && value >= 5 && value <= 80) {
    //             respiratoryRateSlider.noUiSlider.set(value);
    //         }
    //     });
    // } else {
    //     console.error("Slider or input element not found.");
    // }

    flatpickr(".icuHourDate", {
        enableTime: true,
        enableSeconds: true,
        dateFormat: "Y-m-d H:i:S",
        allowInput: true,
        time_24hr: true,
        onChange: function (selectedDates, dateStr, instance) {
            validateDayCaseDateMatch();
        },
    });
    flatpickr(".labLoincDate", {
        enableTime: true,
        enableSeconds: true,
        dateFormat: "Y-m-d H:i:S",
        allowInput: true,
        time_24hr: true,
        onChange: function (selectedDates, dateStr, instance) {
            validateDayCaseDateMatch();
        },
    });
    flatpickr(".onSetDate", {
        enableTime: true,
        enableSeconds: true,
        dateFormat: "Y-m-d H:i:S",
        allowInput: true,
        time_24hr: true,
        onChange: function (selectedDates, dateStr, instance) {
            validateDayCaseDateMatch();
        },
    });
    const $encounterAdmissionDateInput = document.querySelector(
        ".encounterAdmissionDate",
    );
    if ($encounterAdmissionDateInput) {
        const encounterAdmissionDatePicker = flatpickr(
            $encounterAdmissionDateInput,
            {
                enableTime: true,
                enableSeconds: true,
                dateFormat: "Y-m-d H:i:S",
                allowInput: true,
                time_24hr: true,
            },
        );
        if (!$encounterAdmissionDateInput.value) {
            encounterAdmissionDatePicker.setDate(new Date());
        }
    }
    flatpickr(".encounterDischargeDate", {
        enableTime: true,
        enableSeconds: true,
        dateFormat: "Y-m-d H:i:S",
        allowInput: true,
        time_24hr: true,
        onChange: function (selectedDates, dateStr, instance) {
            validateDayCaseDateMatch();
        },
    });
    flatpickr(".emergencyServiceDate", {
        enableTime: true,
        enableSeconds: true,
        dateFormat: "Y-m-d H:i:S",
        allowInput: true,
        time_24hr: true,
        onChange: function (selectedDates, dateStr, instance) {
            validateDayCaseDateMatch();
        },
    });
    flatpickr(".encounterTriageDate", {
        enableTime: true,
        enableSeconds: true,
        dateFormat: "Y-m-d H:i:S",
        allowInput: true,
        time_24hr: true,
        onChange: function (selectedDates, dateStr, instance) {
            validateDayCaseDateMatch();
        },
    });
    flatpickr("#admissionDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    flatpickr("#accountingPeriod", {
        dateFormat: "Y-m-d",
        allowInput: true,
        onChange: function (selectedDates, dateStr, instance) {
            if (selectedDates.length > 0) {
                const selectedDate = selectedDates[0];
                const day = selectedDate.getDate();
                if (day !== 1) {
                    Swal.fire({
                        icon: "error",
                        title: "Invalid Accounting Period",
                        html: `
                        <b>Code:</b> BV-01010<br>
                        <b>Display:</b> Day within the date provided for the accounting period shall be defaulted to “01”.
                    `,
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        },
                    });
                    instance.clear();
                }
            }
        },
    });
    // flatpickr("#preAuthorizationDate", {
    //     dateFormat: "Y-m-d",
    //     allowInput: true,
    // });
    flatpickr("#eligibilityOfflineDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    // flatpickr("#birthDate", {
    //     dateFormat: "Y-m-d",
    //     allowInput: true,
    // });
    // flatpickr("#newBornBirthDate", {
    //     dateFormat: "Y-m-d",
    //     allowInput: true,
    // });
    // flatpickr("#relatedPatientBirthDate", {
    //     dateFormat: "Y-m-d",
    //     allowInput: true,
    // });
    flatpickr("#accidentDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    flatpickr("#diagnosisDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    flatpickr("#serviceDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    flatpickr("#medicineStartDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    flatpickr("#discontinueDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    $(".prescription").on("change", function () {
        $(this).val(this.checked ? 1 : 0);
        console.log($(this).val());
    });
    $(".transferral").on("change", function () {
        $(this).val(this.checked ? 1 : 0);
        console.log($(this).val());
    });
    $("#maternity").on("change", function () {
        const maternityValue = this.checked ? 1 : 0;
        $(this).val(maternityValue);
        console.log(maternityValue);
    });
    $("#accidentInformation")
        .change(function () {
            if ($(this).is(":checked")) {
                $("#accident_information_div").show();
                $(this).val(1);
            } else {
                $("#accident_information_div").hide();
                $(this).val(0);
            }
        })
        .change();

    function toggleFollowUpField() {
        let value = $("#visitReason").val();
        console.log("Visit Reason:", value);
        if (value === "follow_up") {
            $("#followUpClaimReferenceIdDiv").show();
        } else {
            $("#followUpClaimReferenceIdDiv").hide();
            $("#followUpClaimReferenceId").val("");
        }
    }
    toggleFollowUpField();
    $("#visitReason").on("change", function () {
        toggleFollowUpField();
    });
    $("#provider_EmployeeId").select2("destroy");
    $("#provider_EmployeeId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            placeholder: "Search Practioner",
            dropdownParent: $("#provider_EmployeeId").parent(),
            width: "100%",
            allowClear: true,
            ajax: {
                url: "/pre-authorization-healthcare-practitioners",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        filters: params.term,
                        departmentId: $("#department").val(),
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.map(function (item) {
                            return {
                                id: item.employeeId,
                                text: item.name,
                            };
                        }),
                    };
                },
                cache: true,
            },
        });
    $("#provider_EmployeeId").on("select2:select", function (e) {
        getProviderSpecialityById(e.params.data.id);
    });

    $("#clientId").select2("destroy");
    $("#clientId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            placeholder: "Search client",
            dropdownParent: $("#clientId").parent(),
            width: "100%",
            allowClear: true,
            ajax: {
                url: "/pre-authorization-clients",
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
                            };
                        }),
                    };
                },
                cache: true,
            },
        });
    $("#clientId").on("select2:select", function (e) {
        console.log(e.params.data);
        getClientDetailsById(e.params.data.id);
    });

    $("#diagnosis").select2("destroy");
    $("#diagnosis")
        .wrap('<div class="position-relative"></div>')
        .select2({
            placeholder: "Search Diagnosis",
            allowClear: true,
            dropdownParent: $("#diagnosis").parent(),
            width: "100%",
            ajax: {
                url: "/pre-authorization-diagnosis-search-by-query",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        diagnosisCodeOrName: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.map(function (item) {
                            return {
                                id: item.diagnosisListId,
                                text:
                                    "(" +
                                    item.diagnosisCode +
                                    ") " +
                                    item.diagnosisName,
                            };
                        }),
                    };
                },
                cache: true,
            },
        });

    $("#morphology").select2("destroy");
    $("#morphology")
        .wrap('<div class="position-relative"></div>')
        .select2({
            placeholder: "Search Morphology",
            allowClear: true,
            minimumInputLength: 2,
            dropdownParent: $("#morphology").parent(),
            width: "100%",
            ajax: {
                url: "/pre-authorization-morphology-search-by-query",
                dataType: "json",
                delay: 300,
                data: function (params) {
                    return {
                        morphologyCodeOrName: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.map(function (item) {
                            return {
                                id: item.diagnosisListId,
                                text: `(${item.diagnosisCode}) ${item.diagnosisName}`,
                            };
                        }),
                    };
                },
                cache: true,
            },
        });
    $("#snomedCode").select2("destroy");
    $("#snomedCode")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#snomedCode").parent(),
            width: "100%",
            placeholder: "Search Snomed Code",
            allowClear: true,
            ajax: {
                url: "/pre-authorization-snomed-code-search-by-query",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        snomedCodeOrName: params.term,
                    };
                },
                processResults: function (data) {
                    console.log(data);
                    return {
                        results: data.map(function (item) {
                            return {
                                id: item.nphiesSnomedId,
                                text:
                                    "(" +
                                    item.snomedCode +
                                    ") " +
                                    item.snomedName,
                                category: item.categoryType,
                            };
                        }),
                    };
                },
                cache: true,
            },
        });

    $("#labLoincCode").select2("destroy");
    $("#labLoincCode")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#labLoincCode").parent(),
            width: "100%",
            placeholder: "Search Lab Loinc code",
            allowClear: true,
            ajax: {
                url: "/pre-authorization-loinc-code-search-by-query",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        loincCodeOrName: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.map(function (item) {
                            return {
                                id: item.loincId,
                                text:
                                    "(" +
                                    item.LOINC_NUM +
                                    ") " +
                                    item.DisplayName,
                            };
                        }),
                    };
                },
                cache: true,
            },
        });

    $("#icd10Code").select2("destroy");
    $("#icd10Code")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#icd10Code").parent(),
            width: "100%",
            placeholder: "Search Lab Snomed code",
            allowClear: true,
            ajax: {
                url: "/pre-authorization-icd10-code-search-by-query",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        icd10CodeOrName: params.term,
                    };
                },
                processResults: function (data) {
                    console.log(data);
                    return {
                        results: data.map(function (item) {
                            return {
                                id: item.diagnosisListId,
                                text:
                                    "(" +
                                    item.diagnosisCode +
                                    ") " +
                                    item.diagnosisName_en,
                            };
                        }),
                    };
                },
                cache: true,
            },
        });

    $("#serviceId").select2("destroy");
    $("#serviceId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#serviceId").parent(),
            width: "100%",
            placeholder: "Search Service",
            allowClear: true,
            ajax: {
                url: "/pre-authorization-service-search-by-query",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        serviceCodeOrName: params.term,
                        insurancePayerId: $("#insurancePayerId").val(),
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.map(function (item) {
                            return {
                                id: item.serviceId,
                                text:
                                    "(" +
                                    item.serviceCode +
                                    ") " +
                                    item.serviceName_en,
                            };
                        }),
                    };
                },
                cache: true,
            },
        });

    $("#serviceId").on("select2:select", function (e) {
        console.log(e.params.data);
        getServiceDetailsById(e.params.data.id);
    });

    $("#hijri_date").change(function () {
        if ($(this).is(":checked")) {
            var dateInput = $("#birthDate").val();
            console.log(dateInput);
            localStorage.setItem("birthDate", dateInput);
            if (dateInput && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
                var parts = dateInput.split("-");
                var year = parseInt(parts[0], 10);
                var month = parseInt(parts[1], 10);
                var day = parseInt(parts[2], 10);
                var hijriDate = gregorianToHijri(year, month, day);
                console.log(hijriDate);
                $("#birthDate")
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
            var storedDate = localStorage.getItem("birthDate");
            console.log(storedDate);
            $("#hijiri_birth_date")
                .attr("id", "birthDate")
                .attr("name", "birthDate")
                .attr("placeholder", "YYYY-MM-DD")
                .val(storedDate)
                .prop("readonly", false);
        }
    });

    let selectedIdentifierType = "";
    $(document).on(
        "click",
        "#identifierId + .btn + .dropdown-menu .dropdown-item",
        function (e) {
            e.preventDefault();
            let selectedIdentifierType = $(this).attr("id");
            let identifierId = $("#identifierId").val().trim();
            console.log("Selected Identifier Type:", selectedIdentifierType);
            console.log("Selected Identifier ID:", identifierId);
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

    $("#serviceCodeDescription").select2({
        placeholder: "Search Diagnosis",
        allowClear: true,
        ajax: {
            url: "/pre-authorization-services-search-by-query",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    servicesCodeOrName: params.term,
                };
            },
            processResults: function (data) {
                return {
                    results: data.map(function (item) {
                        return {
                            id: item.serviceId,
                            text:
                                "(" +
                                item.serviceCode +
                                ") " +
                                item.serviceName_en,
                        };
                    }),
                };
            },
            cache: true,
        },
    });

    $("#serviceUnitPrice, #serviceQuantity, #serviceDiscountPercentage").on(
        "input",
        function () {
            calculateNetAmount();
        },
    );

    $("#isFrame").on("change", function () {
        toggleIsFrameValue(this);
    });

    $("#productType").on("change", function () {
        clearProductTypeCheckValue($(this).val());
    });

    $("#preAuthorizationType").on("change", function () {
        const preAuthorizationType = $(this).val();
        const $select = $("#slctMedicalServiceType");
        const allOptions = `
        <option value="">Select</option>
        <option value="dental_services">Dental Services</option>
        <option value="procedures">Procedures</option>
        <option value="imaging_services">Imaging services</option>
        <option value="laboratory_and_pathology_services">Laboratory and Pathology Services</option>
        <option value="ambulance_and_transport_services">Ambulance and Transport Services</option>
        <option value="services">Services</option>
        <option value="pharmaceuticals">Pharmaceuticals</option>
        <option value="medical_devices_or_consumables">Medical Devices / Consumables</option>
        <option value="Others">Others</option>
        <option value="herbal_and_vitamin">Herbal And Vitamin</option>
        <option value="cosmetic">Cosmetic</option>
        <option value="nutrtion">Nutrition</option>
    `;
        $select.html(allOptions);
        if (preAuthorizationType === "Professional") {
            $select.find('option[value="dental_services"]').remove();
        } else if (preAuthorizationType === "Dental") {
            $select.find('option[value="procedures"]').remove();
        } else if (preAuthorizationType === "Vision") {
            const toRemove = [
                "dental_services",
                "imaging_services",
                "laboratory_and_pathology_services",
                "ambulance_and_transport_services",
                "pharmaceuticals",
                "Others",
                "herbal_and_vitamin",
                "cosmetic",
                "nutrtion",
            ];
            toRemove.forEach((val) =>
                $select.find(`option[value="${val}"]`).remove(),
            );
        } else if (preAuthorizationType === "Pharmacy") {
            const toRemove = [
                "dental_services",
                "procedures",
                "imaging_services",
                "laboratory_and_pathology_services",
                "ambulance_and_transport_services",
                "services",
                "Others",
            ];
            toRemove.forEach((val) =>
                $select.find(`option[value="${val}"]`).remove(),
            );
        }
        $select.select2("destroy").select2({
            dropdownParent: $("#offcanvasTop"),
            width: "resolve",
        });
        $select.trigger("change");
    });

    const initialEligibilityType = $("#eligibilityType").val();
    updateEligibilityDivs(initialEligibilityType);

    $("#offcanvasTop").on("hidden.bs.offcanvas", function () {
        const $offcanvas = $(this);
        $offcanvas
            .find('input[type="text"], input[type="number"], textarea')
            .val("");
        $offcanvas.find("select").val("").trigger("change");
        $offcanvas.find('input[type="checkbox"]').prop("checked", false);
        $offcanvas.find('input[type="hidden"]').val("");
        $offcanvas.find(".select2").val(null).trigger("change");
        $("#medications_div").hide();
        $("#medications_a_tag_div").hide();
        $("#body_site_div").hide();
        $("#dental_service_div").hide();
        $offcanvas.find(".error-text").text("");
        $(".serviceDiagnosis").each(function () {
            $(this).val(null).trigger("change");
        });
    });
});

function typeSelectedShowingDivs() {
    isProgrammaticRelationshipChange = false;
    const divs = {
        prescriptionRefDescription: $("#prescriptionRefDescription"),
        admissionWeightDiv: $("#admissionWeightDiv"),
        birthWeightDiv: $("#birthWeightDiv"),
        encounterAdmissionSpecialtyDiv: $("#encounterAdmissionSpecialtyDiv"),
        diagnosisOnAdmissionDiv: $("#diagnosisOnAdmissionDiv"),
        encounterAdmitSourceDiv: $("#encounterAdmitSourceDiv"),
        dischageDispositionDiv: $("#dischageDispositionDiv"),
        cautionOfDeathDiv: $("#cautionOfDeathDiv"),
        readmissionDiv: $("#readmissionDiv"),
        intendedLengthOfStayDiv: $("#intendedLengthOfStayDiv"),
        estimatedLengthOfStayDiv: $("#estimatedLengthOfStayDiv"),
        encounterTriageDateDiv: $("#encounterTriageDateDiv"),
        encounterTriageCategoryDiv: $("#encounterTriageCategoryDiv"),
        emergencyServiceDateDiv: $("#emergencyServiceDateDiv"),
        emergencyArivalCodeDiv: $("#emergencyArivalCodeDiv"),
        emergencyDepartmentDispositionDiv: $(
            "#emergencyDepartmentDispositionDiv",
        ),
        clincTypeDiv: $("#clincTypeDiv"),
        clinicNameDiv: $("#clinicNameDiv"),
    };
    const $subType = $("#preSubAuthorizationType");
    const $encounterClass = $("#encounterClass");
    const $encounterServiceType = $("#encounterServiceType");
    const $relationshipType = $("#relationshipType");
    const $preAuthorizationType = $("#preAuthorizationType");
    function hideAllDivs() {
        Object.values(divs).forEach(($div) => $div.hide());
    }

    function toggleEmergencyFields(selectedType, subTypeVal) {
        if (selectedType === "Professional" && subTypeVal === "emergency") {
            divs.emergencyServiceDateDiv.show();
            divs.emergencyArivalCodeDiv.show();
            divs.emergencyDepartmentDispositionDiv.show();
            divs.estimatedLengthOfStayDiv.show();
        } else {
            divs.emergencyServiceDateDiv.hide();
            divs.emergencyArivalCodeDiv.hide();
            divs.emergencyDepartmentDispositionDiv.hide();
        }
        if (selectedType === "Institutional" && subTypeVal === "dayCase") {
            divs.encounterTriageDateDiv.hide();
            divs.encounterTriageCategoryDiv.hide();
        } else {
            divs.encounterTriageDateDiv.show();
            divs.encounterTriageCategoryDiv.show();
        }
        if (selectedType === "Professional" && subTypeVal === "outPatient") {
            divs.clincTypeDiv.show();
            divs.clinicNameDiv.show();
        } else {
            divs.clincTypeDiv.hide();
            divs.clinicNameDiv.hide();
        }
    }
    function populateSubTypes(selectedType) {
        $subType.empty();
        if (selectedType === "Institutional") {
            $subType.append('<option value="">Select</option>');
            $subType.append('<option value="inPatient">InPatient</option>');
            $subType.append('<option value="dayCase">Day Case</option>');
        } else if (selectedType === "Professional") {
            $subType.append('<option value="">Select</option>');
            $subType.append('<option value="outPatient">OutPatient</option>');
            $subType.append('<option value="emergency">Emergency</option>');
        } else if (["Dental", "Vision", "Pharmacy"].includes(selectedType)) {
            $subType.append(
                '<option value="outPatient" selected>OutPatient</option>',
            );
        } else {
            $subType.append('<option value="">Select</option>');
            $subType.append('<option value="outPatient">OutPatient</option>');
            $subType.append('<option value="inPatient">InPatient</option>');
            $subType.append('<option value="emergency">Emergency</option>');
        }
        $subType.trigger("change.select2");
    }
    function populateEncounterDetails(mainType, subTypeVal, relationshipVal) {
        $encounterClass.empty();
        $encounterServiceType.empty();
        if (mainType === "Institutional") {
            if (subTypeVal === "inPatient") {
                $encounterClass.append(
                    '<option value="IN PATIENT ENCOUNTER">In Patient Encounter</option>',
                );
                addInstitutionalServiceTypes();
            } else if (subTypeVal === "dayCase") {
                $encounterClass.append(
                    '<option value="SHORT STAY">Short Stay</option>',
                );
                addInstitutionalServiceTypes();
            }
        } else if (mainType === "Professional") {
            if (subTypeVal === "outPatient") {
                addProfessionalEncounterClasses();
                addInstitutionalServiceTypes();
            } else if (subTypeVal === "emergency") {
                $encounterClass.append(
                    '<option value="EMERGENCY">Emergency</option>',
                );
                addInstitutionalServiceTypes();
            }
        } else if (mainType === "Dental" && subTypeVal === "outPatient") {
            $encounterClass.append(
                '<option value="AMBULATORY">Ambulatory</option>',
            );
            addInstitutionalServiceTypes();
        }
        const selectedEncounterClass = $(
            "#preAuthorizationRequestSubmittedEncounterClass",
        ).val();
        if (selectedEncounterClass) {
            $encounterClass
                .val(selectedEncounterClass)
                .trigger("change.select2");
        }
        console.log(relationshipVal + "=" + mainType + "=" + subTypeVal);
        if (
            relationshipVal === "Child" &&
            ((mainType === "Institutional" &&
                (subTypeVal === "inPatient" || subTypeVal === "dayCase")) ||
                (mainType === "Professional" &&
                    (subTypeVal === "outPatient" ||
                        subTypeVal === "emergency")))
        ) {
            console.log(true);
            $("#child_information").show();
            divs.birthWeightDiv.show();
            $encounterServiceType.val("newBorn").trigger("change");
        }
        $encounterClass.trigger("change.select2");
        $encounterServiceType.trigger("change.select2");
    }
    function addInstitutionalServiceTypes() {
        const options = [
            "acute-care",
            "sub-acute-care",
            "rehabilitation",
            "mental-behavioral",
            "newBorn",
            "geriatric-care",
            "family-planning",
            "dental-care",
            "palliative-care",
            "others",
            "unknown",
        ];
        $encounterServiceType.append(
            '<option value="">Select Service Type</option>',
        );
        options.forEach((opt) => {
            const label = opt
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());
            $encounterServiceType.append(
                `<option value="${opt}">${label}</option>`,
            );
        });

        const selectedVal = $(
            "#preAuthorizationRequestSubmittedServiceType",
        ).val();
        if (selectedVal) {
            $encounterServiceType.val(selectedVal).trigger("change.select2");
        }
    }
    function addProfessionalEncounterClasses() {
        $encounterClass.append(
            '<option value="">Select Encounter Class</option>',
        );
        $encounterClass.append(
            '<option value="AMBULATORY">Ambulatory</option>',
        );
        $encounterClass.append(
            '<option value="HOME HEALTH">Home Health</option>',
        );
        $encounterClass.append('<option value="VIRTUAL">Virtual</option>');
    }
    $preAuthorizationType.on("change", function () {
        const selectedType = $(this).val();
        hideAllDivs();
        if (selectedType === "Pharmacy") {
            divs.prescriptionRefDescription.show();
        } else {
            divs.prescriptionRefDescription.hide();
        }
        if (selectedType === "Institutional") {
            divs.admissionWeightDiv.show();
            divs.encounterAdmissionSpecialtyDiv.show();
            divs.diagnosisOnAdmissionDiv.show();
            divs.encounterAdmitSourceDiv.show();
            divs.dischageDispositionDiv.show();
            divs.cautionOfDeathDiv.show();
            divs.readmissionDiv.show();
            divs.intendedLengthOfStayDiv.show();
            divs.estimatedLengthOfStayDiv.show();
        }
        populateSubTypes(selectedType);
        $subType.trigger("change");
    });
    $subType.on("change", function () {
        const mainType = $preAuthorizationType.val();
        const subTypeVal = $(this).val();
        const relationshipVal = $relationshipType.val();
        populateEncounterDetails(mainType, subTypeVal, relationshipVal);
        toggleEmergencyFields(mainType, subTypeVal);
    });
    $relationshipType.on("change", function () {
        divs.encounterTriageDateDiv.show();
        divs.encounterTriageCategoryDiv.show();
        const relationshipVal = $(this).val();
        const mainType = $preAuthorizationType.val();
        const subTypeVal = $subType.val();
        if (!isProgrammaticRelationshipChange) {
            hideAllDivs();
        }
        if (relationshipVal === "Child") {
            console.log(true);
            $("#child_information").show();
            divs.birthWeightDiv.show();
            divs.estimatedLengthOfStayDiv.show();
        } else {
            divs.birthWeightDiv.hide();
        }
        populateEncounterDetails(mainType, subTypeVal, relationshipVal);
        isProgrammaticRelationshipChange = false;
    });
    hideAllDivs();
}

$('.btn[data-bs-target="#offcanvasTop"]').on("click", function () {
    $("#add_services_btn").text("Add Service");
    var preAuthorizationType = $("#preAuthorizationType").val();
    console.log("Pre-Authorization Type Selected: " + preAuthorizationType);
    if (preAuthorizationType == "Institutional") {
        $("#dental_service_div").hide();
        $("#body_site_div").show();
    } else if (preAuthorizationType == "Professional") {
        $("#dental_service_div").hide();
        $("#body_site_div").show();
    } else if (preAuthorizationType == "Dental") {
        $("#dental_service_div").show();
        $("#body_site_div").hide();
    } else if (preAuthorizationType == "Vision") {
        $("#dental_service_div").hide();
        $("#body_site_div").show();
    } else if (preAuthorizationType == "Pharmacy") {
        $("#dental_service_div").hide();
        $("#body_site_div").show();
    }
});

$(document).on("click", "#addDiagnosis", function () {
    var fullText = $("#diagnosis").text().trim();
    var match = fullText.match(
        /(.+?)\s*(?:\(([^)]+)\))?\s*-\s*\d+(\.\d+)?\s*$/,
    );
    if (match) {
        var serviceName = match[1].trim();
        var serviceCode = match[2] ? match[2].trim() : null;
    }
    const isInstitutional =
        $("#preAuthorizationType").val() === "Institutional";
    $("#diagnosisOnAdmissionTh").toggleClass("d-none", !isInstitutional);
    $.ajax({
        url:
            BASE_URL +
            "/pre-authorization-get-diagnosis-details-by-id/" +
            $("#diagnosis").val(),

        type: "get",
        beforeSend: function () {
            $("#loader-overlay").show();
        },
        success: function (response) {
            if (response.status === true) {
                $("#pre_auth_diagnosis_table_head").show();
                var rowIndex = $("#pre_auth_diagnosis_table_body tr").length;
                let diagnosisOptionsHtml = "";
                if (isInstitutional) {
                    diagnosisOptionsHtml = $("#diagnosisOnAdmission").html();
                }
                let diagnosisDate = $("#diagnosisDate").val();
                let diagnosisType = $("#diagnosisType").val();
                let diagnosisOnAdmission = $("#diagnosisOnAdmission").val();
                let conditionOnset = $("#conditionOnset").val();
                let diagnosisHtml = `
                    <tr>
                        <td>
                            ${diagnosisDate}
                            <input
                                type="hidden"
                                name="diagnosisDateTd[]"
                                class="form-control diagnosisDateTd"
                                value="${diagnosisDate}"
                            />
                        </td>
                        <td>
                            <select
                                id="diagnosisTypeTd${rowIndex}"
                                name="diagnosisTypeTd[]"
                                class="select2 w-100 diagnosisTypeTd"
                                data-style="btn-default"
                                data-live-search="true"
                            >
                                ${diagnosisTypeOptions}
                            </select>
                        </td>
                        ${
                            isInstitutional
                                ? `
                            <td class="diagnosisOnAdmissionTd">
                                <select
                                    id="diagnosisOnAdmissionTd${rowIndex}"
                                    name="diagnosisOnAdmissionTd[]"
                                    class="select2 w-100 diagnosisOnAdmissionTd"
                                    data-style="btn-default"
                                    data-live-search="true"
                                >
                                    ${diagnosisOptionsHtml}
                                </select>
                            </td>
                        `
                                : ""
                        }
                        <td>
                            <select
                                id="conditionOnsetTd${rowIndex}"
                                name="conditionOnsetTd[]"
                                class="select2 w-100 conditionOnsetTd"
                                data-style="btn-default"
                                data-live-search="true"
                            >
                                ${conditionOnsetOptions}
                            </select>
                        </td>
                        <td>
                            ${response.data.diagnosisCode}
                            <input
                                type="hidden"
                                name="diagnosisIdTd[]"
                                class="form-control diagnosisIdTd"
                                value="${response.data.diagnosisListId}"
                            />
                        </td>
                        <td>
                            ${response.data.diagnosisName_en}
                        </td>
                        <td class="text-center">
                            <button
                                class="btn btn-outline-danger btn-sm remove-diagnosis-row"
                            >
                                <i class="ti ti-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                $("#pre_auth_diagnosis_table_body").append(diagnosisHtml);
                setTimeout(() => {
                    let diagnosisIds = $("input[name='diagnosisIdTd[]']")
                        .map(function () {
                            return $(this).val();
                        })
                        .get();

                    appendDiagnosisSelectBox(diagnosisIds);
                }, 100);
                $(`#diagnosisTypeTd${rowIndex}`)
                    .wrap('<div class="position-relative"></div>')
                    .select2({
                        dropdownParent: $(
                            `#diagnosisTypeTd${rowIndex}`,
                        ).parent(),
                        width: "100%",
                        placeholder: "Selection",
                        allowClear: true,
                    });
                $(`#conditionOnsetTd${rowIndex}`)
                    .wrap('<div class="position-relative"></div>')
                    .select2({
                        dropdownParent: $(
                            `#conditionOnsetTd${rowIndex}`,
                        ).parent(),
                        width: "100%",
                        placeholder: "Selection",
                        allowClear: true,
                    });
                $(`#diagnosisTypeTd${rowIndex}`)
                    .val(diagnosisType)
                    .trigger("change");
                $(`#conditionOnsetTd${rowIndex}`)
                    .val(conditionOnset)
                    .trigger("change");
                if (isInstitutional) {
                    $(`#diagnosisOnAdmissionTd${rowIndex}`)
                        .wrap('<div class="position-relative"></div>')
                        .select2({
                            dropdownParent: $(
                                `#diagnosisOnAdmissionTd${rowIndex}`,
                            ).parent(),
                            width: "100%",
                            placeholder: "Selection",
                            allowClear: true,
                        });
                    $(`#diagnosisOnAdmissionTd${rowIndex}`)
                        .val(diagnosisOnAdmission)
                        .trigger("change");
                }
            } else {
                console.error("Service details not found");
            }
            $("#diagnosisDate").val("");
            $("#diagnosisType").val("").trigger("change");
            $("#diagnosisOnAdmission").val("").trigger("change");
            $("#conditionOnset").val("").trigger("change");
            $("#diagnosis").val("").trigger("change");
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        },
        complete: function () {
            $("#loader-overlay").hide();
        },
    });
    $("#item_name").val("").trigger("change");
});

$(document).on("click", ".remove-diagnosis-row", function () {
    const button = $(this);
    const diagnosisId = button.attr("id");
    const row = button.closest("tr");
    if (diagnosisId) {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this permanently?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
                cancelButton: "btn btn-danger waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/delete-diagnosis/" + diagnosisId,
                    type: "POST",
                    data: {
                        id: diagnosisId,
                        _token: $("meta[name='csrf-token']").attr("content"),
                    },
                    success: function (response) {
                        row.remove();
                        Swal.fire({
                            icon: "success",
                            text: "The record has been deleted.",
                            customClass: { confirmButton: "btn btn-success" },
                        });
                    },
                    error: function () {
                        Swal.fire({
                            icon: "Error!",
                            text: "Could not delete the record.",
                            customClass: { confirmButton: "btn btn-success" },
                        });
                    },
                });
            }
        });
    } else {
        row.remove();
    }
});

var reservationIcuHourIncrement = 0;
$(document).on("click", "#addIcuHour", function () {
    reservationIcuHourIncrement++;
    var icuHourDate = $("#icuHourDate").val();
    var icuHourValue = $("#icuHourValue").val();
    var icuHourValueUnit = $("#icuHourValueUnit").val();
    $("#tableIcuHour").show();
    var rowIndex = $("#icu_hour_table_body tr").length + 1;
    var loincHtml =
        `
        <tr>
            <td class="text-center">${rowIndex}</td>
            <td>${icuHourDate}
            <input type="hidden" name="IcuHour[` +
        reservationIcuHourIncrement +
        `][icuHourDateTd]" class="form-control  icuHourDateTd" id="icuHourDateTd" value="${icuHourDate}" /></td>
            <td>${icuHourValue}
            <input type="hidden" name="IcuHour[` +
        reservationIcuHourIncrement +
        `][icuHourValueTd]" class="form-control  icuHourValueTd" id="icuHourValueTd" value="${icuHourValue}" /></td>
        <td>${icuHourValueUnit}
            <input type="hidden" name="IcuHour[` +
        reservationIcuHourIncrement +
        `][icuHourValueUnitTd]" class="form-control  icuHourValueUnitTd" id="icuHourValueUnitTd" value="${icuHourValueUnit}" /></td>
            <td class="text-center">
                      <button class="btn btn-outline-danger btn-sm remove-icu-hour-row">
                        <i class="ti ti-trash"></i>
                      </button>
                    </td>
        </tr>`;
    $("#icu_hour_table_body").append(loincHtml);
    $("#icuHourDate").val("");
    $("#icuHourValue").val("");
    $("#icuHourValueUnit").val("").trigger("change");
});
toggleTableHead("#icu_hour_table_body", "#icu_hour_table_head");
$(document).on("click", ".remove-icu-hour-row", function () {
    $(this).closest("tr").remove();
    toggleTableHead("#icu_hour_table_body", "#icu_hour_table_head");
});

var reservationLoincIncrement = 0;
$(document).on("click", "#addLabloinc", function () {
    var loinicId = $("#labLoincCode").val().trim();
    var selectedData = $("#labLoincCode").select2("data")[0];
    var text = selectedData.text;
    var loincNum = text.match(/^\((.*?)\)/)[1];
    var displayName = text.replace(/^\(.*?\)\s*/, "");
    reservationLoincIncrement++;
    var labLoincDate = $("#labLoincDate").val();
    var labLoincValue = $("#labLoincValue").val();
    $("#tableLoinc").show();
    var rowIndex = $("#lab_loinc_table_body tr").length + 1;
    var loincHtml =
        `
        <tr>
            <td class="text-center">${rowIndex}</td>
            <td>${displayName || ""}
            <input type="hidden" name="LoincName[` +
        reservationLoincIncrement +
        `][LoincNameTd]" class="form-control  LoincNameTd" id="LoincNameTd" value="${loincNum}" /></td>
            <td>${loincNum || ""}</td>
            <td>${labLoincDate}
            <input type="hidden" name="LoincName[` +
        reservationLoincIncrement +
        `][labLoincDateTd]" class="form-control  labLoincDateTd" id="labLoincDateTd" value="${labLoincDate}" /></td>
            <td>${labLoincValue}
            <input type="hidden" name="LoincName[` +
        reservationLoincIncrement +
        `][labLoincValueTd]" class="form-control  labLoincValueTd" id="labLoincValueTd" value="${labLoincValue}" /></td>
            <td class="text-center">
                      <button class="btn btn-outline-danger btn-sm remove-loinc-row">
                        <i class="ti ti-trash"></i>
                      </button>
                    </td>
        </tr>`;
    $("#lab_loinc_table_body").append(loincHtml);
    $("#labLoincCode").val("").trigger("change");
    $("#labLoincDate").val("");
    $("#labLoincValue").val("");
});
toggleTableHead("#lab_loinc_table_body", "#lab_loinc_table_head");
$(document).on("click", ".remove-loinc-row", function () {
    $(this).closest("tr").remove();
    toggleTableHead("#lab_loinc_table_body", "#lab_loinc_table_head");
});

var reservationOnsetIncrement = 0;
$(document).on("click", "#addOnSet", function () {
    var icd10Code = $("#icd10Code").val().trim();
    var selectedData = $("#icd10Code").select2("data")[0];
    var text = selectedData.text;
    var displayCode = text.match(/^\((.*?)\)/)[1];
    var displayName = text.replace(/^\(.*?\)\s*/, "");
    reservationOnsetIncrement++;
    var onSetDate = $("#onSetDate").val();
    var onSetValue = $("#onSetValue").val();
    $("#tableOnSet").show();
    var rowIndex = $("#on_set_table_body tr").length + 1;
    var onsetHtml =
        `
        <tr>
            <td class="text-center">${rowIndex}</td>
            <td>${displayCode || ""}
            <input type="hidden" name="icd10Code[` +
        reservationOnsetIncrement +
        `][icd10CodeTd]" class="form-control  icd10CodeTd" id="icd10CodeTd" value="${displayCode}" /></td>
            <td>${displayName || ""}</td>
            <td>${onSetDate}
            <input type="hidden" name="icd10Code[` +
        reservationOnsetIncrement +
        `][onSetDateTd]" class="form-control  onSetDateTd" id="onSetDateTd" value="${onSetDate}" /></td>
            <td>${onSetValue}
            <input type="hidden" name="icd10Code[` +
        reservationOnsetIncrement +
        `][onSetValueTd]" class="form-control  onSetValueTd" id="onSetValueTd" value="${onSetValue}" /></td>
            <td class="text-center">
                      <button class="btn btn-outline-danger btn-sm remove-onSet-row">
                        <i class="ti ti-trash"></i>
                      </button>
                    </td>
        </tr>`;
    $("#on_set_table_body").append(onsetHtml);
    $("#icd10Code").val("").trigger("change");
    $("#onSetDate").val("");
    $("#onSetValue").val("");
});
toggleTableHead("#on_set_table_body", "#on_set_table_head");
$(document).on("click", ".remove-onSet-row", function () {
    $(this).closest("tr").remove();
    toggleTableHead("#on_set_table_body", "#on_set_table_head");
});

$(document).on("change", "#preAuthorizationType", function () {
    const selectedVal = $(this).val();
    toggleTabsByAuthorizationType(selectedVal);
});

const preAuthorizationTypeSubmittedVal = $("#preAuthorizationType").val();
if (preAuthorizationTypeSubmittedVal) {
    toggleTabsByAuthorizationType(preAuthorizationTypeSubmittedVal);
}

function toggleTabsByAuthorizationType(type) {
    const tabs = {
        optics_tab: true,
        preauthorization_tab: true,
        beneficiary_tab: true,
        triage_tab: true,
        diagnosis_tab: true,
        medical_tab: true,
        encounter_tab: true,
        services_tab: true,
        clinical_tab: true,
    };
    const hideClasses = [];
    switch (type) {
        case "Institutional":
        case "Professional":
            tabs.optics_tab = false;
            hideClasses.push(".optics");
            break;
        case "Dental":
            tabs.optics_tab = false;
            tabs.triage_tab = false;
            hideClasses.push(".optics", ".triage");
            break;
        case "Vision":
            tabs.encounter_tab = false;
            tabs.triage_tab = false;
            tabs.optics_tab = true;
            hideClasses.push(".encounter", ".triage");
            break;
        case "Pharmacy":
            tabs.encounter_tab = false;
            tabs.triage_tab = false;
            tabs.optics_tab = false;
            hideClasses.push(".encounter", ".triage", ".optics");
            break;
    }
    for (const [tabId, shouldShow] of Object.entries(tabs)) {
        $(`#${tabId}`)[shouldShow ? "show" : "hide"]();
    }
    $(".optics, .triage, .encounter").show();
    hideClasses.forEach((cls) => $(cls).hide());
}

$(document).on("change", "#productType", function () {
    const selectedVal = $(this).val();
    toggleProductTypeDivs(selectedVal);
});
const productTypeSubmittedVal = $("#productType").val();
if (productTypeSubmittedVal) {
    toggleProductTypeDivs(productTypeSubmittedVal);
}
function toggleProductTypeDivs(selectedValue) {
    if (selectedValue === "lens") {
        $("#contact_lense_rx_information_div").hide();
        $("#contact_lense_div").hide();
        $("#regular_lense_div").show();
        $("#is_frame_div").show();
        $("#lenses_specifications_div").show();
        $("#lense_rx_information_div").show();
    } else if (selectedValue === "contact") {
        $("#contact_lense_rx_information_div").show();
        $("#contact_lense_div").show();
        $("#regular_lense_div").hide();
        $("#is_frame_div").hide();
        $("#lenses_specifications_div").hide();
        $("#lense_rx_information_div").hide();
    } else {
        $("#contact_lense_rx_information_div").hide();
        $("#contact_lense_div").hide();
        $("#regular_lense_div").hide();
        $("#is_frame_div").hide();
        $("#lenses_specifications_div").hide();
        $("#lense_rx_information_div").hide();
    }
}

$(document).on("change", "#slctMedicalServiceType", function () {
    if ($(this).val() == "procedures") {
        $("#medications_a_tag_div").hide();
        $("#medications_a_tag").css("display", "none");
        $("#medications_div").hide();
        $("#day_supply_div").hide();
    } else if ($(this).val() == "imaging_services") {
        $("#medications_a_tag_div").hide();
        $("#medications_a_tag").css("display", "none");
        $("#medications_div").hide();
        $("#day_supply_div").hide();
    } else if ($(this).val() == "laboratory_and_pathology_services") {
        $("#medications_a_tag_div").hide();
        $("#medications_a_tag").css("display", "none");
        $("#medications_div").hide();
        $("#day_supply_div").hide();
    } else if ($(this).val() == "ambulance_and_transport_services") {
        $("#medications_a_tag_div").hide();
        $("#medications_a_tag").css("display", "none");
        $("#medications_div").hide();
        $("#day_supply_div").hide();
    } else if ($(this).val() == "services") {
        $("#medications_a_tag_div").hide();
        $("#medications_a_tag").css("display", "none");
        $("#medications_div").hide();
        $("#day_supply_div").hide();
    } else if ($(this).val() == "pharmaceuticals") {
        $("#medications_a_tag_div").show();
        $("#medications_a_tag").css("display", "inline-block");
        $("#medications_div").show();
        $("#day_supply_div").show();
    } else if ($(this).val() == "medical_devices_or_consumables") {
        $("#medications_a_tag_div").hide();
        $("#medications_a_tag").css("display", "none");
        $("#medications_div").hide();
        $("#day_supply_div").show();
    } else if ($(this).val() == "Others") {
        $("#medications_a_tag_div").hide();
        $("#medications_a_tag").css("display", "none");
        $("#medications_div").hide();
        $("#day_supply_div").hide();
    } else if ($(this).val() == "herbal_and_vitamin") {
        $("#medications_a_tag_div").show();
        $("#medications_a_tag").css("display", "inline-block");
        $("#medications_div").show();
        $("#day_supply_div").hide();
    } else if ($(this).val() == "cosmetic") {
        $("#medications_a_tag_div").hide();
        $("#medications_a_tag").css("display", "none");
        $("#medications_div").hide();
        $("#day_supply_div").show();
    } else if ($(this).val() == "nutrtion") {
        $("#medications_a_tag_div").hide();
        $("#medications_a_tag").css("display", "none");
        $("#medications_div").hide();
        $("#day_supply_div").show();
    } else {
        $("#medications_a_tag_div").hide();
        $("#medications_a_tag").css("display", "none");
        $("#medications_div").hide();
        $("#day_supply_div").hide();
    }
});
let editingRowIndex = null;
$(document).on("click", "#add_services_btn", function (e) {
    e.preventDefault();
    let submitAction = $("#submitAction").val();
    if (submitAction === "pre-authorization-from-doctor") {
        let formData = $("#serviceForm").serialize();
        console.log("formDataService", formData);
        $("#loader-overlay").show();
        $.ajax({
            url: "/store-service-directly-from-preauth-doctor-side",
            type: "POST",
            data: formData,
            success: function (response) {
                $("#loader-overlay").hide();

                if (response.success) {
                    var rowIndex = $("#service_table_tbody tr").length;

                    // 🔥 DEFINE ALL VALUES (IMPORTANT)
                    var serviceDate = $("#serviceDate").val();
                    var medicalServiceType = $("#slctMedicalServiceType").val();
                    var serviceId = $("#serviceId").val();
                    var serviceName = $("#serviceId option:selected")
                        .text()
                        .trim();
                    var maternity = $("#maternity").is(":checked") ? 1 : 0;
                    var patientInvoiceNo = $("#patientInvoiceNo").val();
                    var serviceUnitPrice = $("#serviceUnitPrice").val();
                    var serviceDiscountPercentage = $(
                        "#serviceDiscountPercentage",
                    ).val();
                    var serviceDiscountAmount = $(
                        "#serviceDiscountPercentage",
                    ).val();
                    var serviceQuantity = $("#serviceQuantity").val();
                    var serviceNetAmount = $("#serviceNetAmount").val();
                    var serviceDaySupply = $("#daySupply").val();
                    var serviceVatPercentage = $("#serviceVatPercentage").val();
                    var bodySite = $("#bodySite").val();
                    var subSite = $("#subSite").val();
                    var diagnosisValue = $("#serviceDiagnosis").val();

                    var diagnosisText = $("#serviceDiagnosis option:selected")
                        .map(function () {
                            return $(this).text();
                        })
                        .get()
                        .join(", ");

                    var serviceTrHtml = `
                    <tr>
                        <td>${rowIndex + 1}</td>

                        <td>${serviceDate}
                            <input type="hidden" id="addedServicedate${rowIndex}" value="${serviceDate}">
                            <input type="hidden" id="addedServiceType${rowIndex}" value="${medicalServiceType}">
                            <input type="hidden" id="maternity${rowIndex}" value="${maternity}">
                            <input type="hidden" id="patientInvoiceNo${rowIndex}" value="${patientInvoiceNo}">
                            <input type="hidden" id="addedServiceVat${rowIndex}" value="${serviceVatPercentage}">
                            <input type="hidden" id="addedServiceDaySupply${rowIndex}" value="${serviceDaySupply}">
                            <input type="hidden" id="addedServiceBodySite${rowIndex}" value="${bodySite}">
                            <input type="hidden" id="addedServiceSubSite${rowIndex}" value="${subSite}">
                            <input type="hidden" id="addedServiceDiagnosisId${rowIndex}" value="${diagnosisValue}">
                        </td>

                        <td>${serviceName}
                            <input type="hidden" id="addedServiceId${rowIndex}" value="${serviceId}">
                        </td>

                        <td>${serviceQuantity}
                            <input type="hidden" id="addedServiceQuantity${rowIndex}" value="${serviceQuantity}">
                        </td>

                        <td>${serviceUnitPrice}
                            <input type="hidden" id="addedServiceUnitPrice${rowIndex}" value="${serviceUnitPrice}">
                        </td>
                        <td>${serviceUnitPrice}
                            <input type="hidden" id="addedServiceUnitPrice${rowIndex}" value="${serviceUnitPrice}">
                        </td>
                        <td>${serviceDiscountPercentage}
                            <input type="hidden" id="addedServiceDiscountPercentage${rowIndex}" value="${serviceDiscountPercentage}">
                        </td>

                        <td>${serviceNetAmount}
                            <input type="hidden" id="addedServiceNetAmount${rowIndex}" value="${serviceNetAmount}">
                        </td>

                        <td>${diagnosisText}</td>

                        <td>saved</td>

                        <td class="text-center">
                            <button class="btn btn-outline-warning btn-sm edit_service" data-index="${rowIndex}">
                                <i class="ti ti-edit"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm delete_service">
                                <i class="ti ti-trash"></i>
                            </button>
                        </td>
                    </tr>
                    `;

                    // ✅ APPEND ONLY (NO LOAD)
                    $("#service_table_tbody").append(serviceTrHtml);

                    clearServiceModalElements();
                }
            },
            error: function (err) {
                $("#loader-overlay").hide();
                console.error(err);
            },
        });
        return;
    }
    $("#loader-overlay").show();
    setTimeout(function () {
        var rowIndex =
            editingRowIndex !== null
                ? editingRowIndex
                : $("#service_table_tbody tr").length;
        var serviceDate = $("#serviceDate").val();
        var medicalServiceType = $("#slctMedicalServiceType").val();
        var serviceId = $("#serviceId").val();
        var serviceName = $("#serviceId option:selected").text().trim();
        var maternity = $("#maternity").is(":checked") ? 1 : 0;
        var patientInvoiceNo = $("#patientInvoiceNo").val();
        var serviceUnitPrice = $("#serviceUnitPrice").val();
        var serviceDiscountPercentage = $("#serviceDiscountPercentage").val();
        var serviceDiscountAmount = $("#serviceDiscountPercentage").val();
        var serviceQuantity = $("#serviceQuantity").val();
        var serviceNetAmount = $("#serviceNetAmount").val();
        var serviceDaySupply = $("#daySupply").val();
        var serviceVatPercentage = $("#serviceVatPercentage").val();
        var bodySite = $("#bodySite").val();
        var subSite = $("#subSite").val();
        var serviceDiagnosisId = $("#serviceDiagnosis").val();
        var scientificCode = $("#scientificCode").val();
        var scientificCodeAbsenceReason = $(
            "#scientificCodeAbsenceReason",
        ).val();
        var strength = $("#strength").val();
        var selectionReason = $("#selectionReason").val();
        var pharmacistSubsitute = $("#pharmacistSubsitute").val();
        var medicineStartDate = $("#medicineStartDate").val();
        var discontinueDate = $("#discontinueDate").val();
        var txtDuration = $("#txtDuration").val();
        var slcDurationUnit = $("#slcDurationUnit").val();
        var frequency = $("#frequency").val();
        var txtPeriod = $("#txtPeriod").val();
        var slcPeriodUnit = $("#slcPeriodUnit").val();
        var txtDoseQuantity = $("#txtDoseQuantity").val();
        var slcDose = $("#slcDose").val();
        var slcRouteAdmin = $("#slcRouteAdmin").val();
        var timeInstruction = $("#timeInstruction").val();
        var refillCount = $("#refillCount").val();
        var dosageInstruction = $("#dosageInstruction").val();
        var patientInstruction = $("#patientInstruction").val();
        var additionalSupportingInfo = $("#additionalSupportingInfo").val();
        var oralRegion = $("#oralRegion").val();
        var toothSurface = $("#toothSurface").val();
        var serviceTrHtml = `
        <tr>
            <td>${rowIndex + 1}</td>
            <td>${serviceDate}
                <input type="hidden" id="addedServicedate${rowIndex}" name="addedServicedate[]" value="${serviceDate}">
                <input type="hidden" id="addedServiceType${rowIndex}" name="addedServiceType[]" value="${medicalServiceType}">
                <input type="hidden" id="maternity${rowIndex}" name="maternity[]" value="${maternity}">
                <input type="hidden" id="patientInvoiceNo${rowIndex}" name="patientInvoiceNo[]" value="${patientInvoiceNo}">
                <input type="hidden" id="addedServiceVat${rowIndex}" name="addedServiceVat[]" value="${serviceVatPercentage}">
                <input type="hidden" id="addedServiceDaySupply${rowIndex}" name="addedServiceDaySupply[]" value="${serviceDaySupply}">
                <input type="hidden" id="addedServiceBodySite${rowIndex}" name="addedServiceBodySite[]" value="${bodySite}">
                <input type="hidden" id="addedServiceSubSite${rowIndex}" name="addedServiceSubSite[]" value="${subSite}">
                <input type="hidden" id="addedServiceDiagnosisId${rowIndex}" name="addedServiceDiagnosisId[]" value="${serviceDiagnosisId}">
                <input type="hidden" id="scientificCode${rowIndex}" name="scientificCode[]" value="${scientificCode}">
                <input type="hidden" id="scientificCodeAbsenceReason${rowIndex}" name="scientificCodeAbsenceReason[]" value="${scientificCodeAbsenceReason}">
                <input type="hidden" id="strength${rowIndex}" name="strength[]" value="${strength}">
                <input type="hidden" id="selectionReason${rowIndex}" name="selectionReason[]" value="${selectionReason}">
                <input type="hidden" id="pharmacistSubsitute${rowIndex}" name="pharmacistSubsitute[]" value="${pharmacistSubsitute}">
                <input type="hidden" id="medicineStartDate${rowIndex}" name="medicineStartDate[]" value="${medicineStartDate}">
                <input type="hidden" id="discontinueDate${rowIndex}" name="discontinueDate[]" value="${discontinueDate}">
                <input type="hidden" id="txtDuration${rowIndex}" name="txtDuration[]" value="${txtDuration}">
                <input type="hidden" id="slcDurationUnit${rowIndex}" name="slcDurationUnit[]" value="${slcDurationUnit}">
                <input type="hidden" id="frequency${rowIndex}" name="frequency[]" value="${frequency}">
                <input type="hidden" id="txtPeriod${rowIndex}" name="txtPeriod[]" value="${txtPeriod}">
                <input type="hidden" id="slcPeriodUnit${rowIndex}" name="slcPeriodUnit[]" value="${slcPeriodUnit}">
                <input type="hidden" id="txtDoseQuantity${rowIndex}" name="txtDoseQuantity[]" value="${txtDoseQuantity}">
                <input type="hidden" id="slcDose${rowIndex}" name="slcDose[]" value="${slcDose}">
                <input type="hidden" id="slcRouteAdmin${rowIndex}" name="slcRouteAdmin[]" value="${slcRouteAdmin}">
                <input type="hidden" id="timeInstruction${rowIndex}" name="timeInstruction[]" value="${timeInstruction}">
                <input type="hidden" id="refillCount${rowIndex}" name="refillCount[]" value="${refillCount}">
                <input type="hidden" id="dosageInstruction${rowIndex}" name="dosageInstruction[]" value="${dosageInstruction}">
                <input type="hidden" id="patientInstruction${rowIndex}" name="patientInstruction[]" value="${patientInstruction}">
                <input type="hidden" id="additionalSupportingInfo${rowIndex}" name="additionalSupportingInfo[]" value="${additionalSupportingInfo}">
                <input type="hidden" id="addedServiceDiscountAmount${rowIndex}" name="addedServiceDiscountAmount[]" value="${serviceDiscountAmount}">
                <input type="hidden" id="addedOralRegion${rowIndex}" name="addedOralRegion[]" value="${oralRegion}">
                <input type="hidden" id="addedToothSurface${rowIndex}" name="addedToothSurface[]" value="${toothSurface}">
            </td>
            <td>${serviceName}
                <input type="hidden" id="addedServiceId${rowIndex}" name="addedServiceId[]" value="${serviceId}">
            </td>
            <td>${serviceQuantity}
                <input type="hidden" id="addedServiceQuantity${rowIndex}" name="addedServiceQuantity[]" value="${serviceQuantity}">
            </td>
            <td>${serviceUnitPrice}
                <input type="hidden" id="addedServiceUnitPrice${rowIndex}" name="addedServiceUnitPrice[]" value="${serviceUnitPrice}">
            </td>
            <td>${serviceUnitPrice}
                <input type="hidden" id="addedServiceUnitPrice${rowIndex}" name="addedServiceUnitPrice[]" value="${serviceUnitPrice}">
            </td>
            <td>${serviceDiscountPercentage}
                <input type="hidden" id="addedServiceDiscountPercentage${rowIndex}" name="addedServiceDiscountPercentage[]" value="${serviceDiscountPercentage}">
            </td>
            <td>${serviceNetAmount}
                <input type="hidden" id="addedServiceNetAmount${rowIndex}" name="addedServiceNetAmount[]" value="${serviceNetAmount}">
            </td>
            <td>status</td>
            <td class="text-center">
                <button class="btn btn-outline-warning btn-sm p-1 edit_service" id="edit_service" data-index="${rowIndex}">
                    <i class="ti ti-edit"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm p-1 delete_service">
                    <i class="ti ti-trash"></i>
                </button>
            </td>
        </tr>
        `;
        if (editingRowIndex !== null) {
            $("#service_table_tbody tr")
                .eq(editingRowIndex)
                .replaceWith(serviceTrHtml);
            editingRowIndex = null;
            $("#add_services_btn").text("Add Service");
        } else {
            $("#service_table_tbody").append(serviceTrHtml);
        }
        clearServiceModalElements();
        $("#loader-overlay").hide();
    }, 0);
});

// $(document).on("click", ".delete_service", function (event) {
//     event.preventDefault();
//     $(this).closest("tr").remove();
// });

$(document).on("click", ".delete_service", function (event) {
    event.preventDefault();
    let row = $(this).closest("tr");
    let serviceOrderListId = row
        .find('input[name="serviceOrderListId[]"]')
        .val();
    if (!serviceOrderListId) {
        row.remove();
        return;
    }
    Swal.fire({
        title: "Are you sure?",
        text: "This service will be deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        customClass: {
            confirmButton: "btn btn-primary waves-effect waves-light",
            cancelButton: "btn btn-danger waves-effect waves-light",
        },
        buttonsStyling: false,
    }).then(function (result) {
        if (result.isConfirmed) {
            $("#loader-overlay").show();
            $.ajax({
                url: BASE_URL + "/delete-insurance-service",
                type: "DELETE",
                data: {
                    serviceOrderListId: serviceOrderListId,
                    _token: $('meta[name="csrf-token"]').attr("content"),
                },
                success: function (response) {
                    $("#loader-overlay").hide();
                    if (response.status) {
                        row.remove();
                        Swal.fire({
                            icon: "success",
                            text: response.message,
                            customClass: {
                                confirmButton: "btn btn-success",
                            },
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            text: response.message,
                            customClass: {
                                confirmButton: "btn btn-danger",
                            },
                        });
                    }
                },
                error: function (xhr) {
                    $("#loader-overlay").hide();
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text:
                            xhr.responseJSON?.message ||
                            "An unexpected error occurred.",
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                },
            });
        }
    });
});

let currentServiceId = null;
$(document).on("click", ".status_service", function (e) {
    e.preventDefault();
    currentServiceId = $(this).attr("id");
    console.log("Service ID:", currentServiceId);
    $("#selectedServiceOrderListId").val(currentServiceId);
    $("#serviceStatusModal").modal("show");
});
$(document).on("click", "#serviceStatusPartialBtn", function (e) {
    e.preventDefault();
    console.log("Using stored Service ID:", currentServiceId);
    $("#selectedServiceOrderListIdPartial").val(currentServiceId);
    $("#serviceStatusModal").modal("hide");
    $("#serviceStatusPartialModal").modal("show");
    loadServiceDetailsForPartial(currentServiceId);
});
function loadServiceDetailsForPartial(serviceId) {
    $("#loader-overlay").show();
    $.ajax({
        url: "/get-service-details-for-partial",
        type: "GET",
        data: { serviceOrderListId: serviceId },
        success: function (response) {
            $("#loader-overlay").hide();
            $("#netCost").val(response.netCost);
        },
        error: function () {
            $("#loader-overlay").hide();
            console.error("Failed to load service details");
        },
    });
}
$(document).on("click", "#partialSubmit", function () {
    const serviceId = $("#selectedServiceOrderListIdPartial").val();
    const netCost = $("#netCost").val();
    const partialAmount = $("#partialAmount").val();
    const submitAction = $("#submitAction").val();
    $("#loader-overlay").show();
    $.ajax({
        url: "/update-service-status",
        type: "POST",
        data: {
            serviceOrderListId: serviceId,
            approvalStatus: "partial",
            netCost: netCost,
            partialAmount: partialAmount,
            submitAction: submitAction,
        },
        success: function () {
            $("#loader-overlay").hide();
            $("#serviceStatusPartialModal").modal("hide");
            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Service status set to Partial.",
                customClass: {
                    confirmButton: "btn btn-success",
                },
                buttonsStyling: false,
            }).then(() => {
                reloadServiceTable();
            });
        },
        error: function () {
            $("#loader-overlay").hide();
            Swal.fire({
                icon: "error",
                title: "Failed!",
                text: "Partial update failed.",
                customClass: {
                    confirmButton: "btn btn-success",
                },
            });
        },
    });
});
$(document).on(
    "click",
    "#serviceStatusApprovedBtn, #serviceStatusRejectedBtn",
    function () {
        const status =
            $(this).attr("id") === "serviceStatusApprovedBtn"
                ? "approved"
                : "rejected";
        const serviceId = $("#selectedServiceOrderListId").val();
        const submitAction = $("#submitAction").val();
        $("#loader-overlay").show();
        $.ajax({
            url: "/update-service-status",
            type: "POST",
            data: {
                serviceOrderListId: serviceId,
                approvalStatus: status,
                submitAction: submitAction,
            },
            success: function (response) {
                $("#loader-overlay").hide();
                $("#serviceStatusModal").modal("hide");
                Swal.fire({
                    icon: "success",
                    title: "Updated!",
                    text: `Service status has been ${status}.`,
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                    buttonsStyling: false,
                }).then(() => {
                    reloadServiceTable();
                });
            },
            error: function () {
                $("#loader-overlay").hide();
                Swal.fire({
                    icon: "error",
                    title: "Update Failed!",
                    text: "Could not update the service status.",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                    buttonsStyling: false,
                });
            },
        });
    },
);
function reloadServiceTable() {
    $("#loader-overlay").show();
    $("#serviceTableContainer").load(
        location.href + " #serviceTableContainer > *",
        function () {
            $("#loader-overlay").hide();
        },
    );
}

$(document).on("click", ".edit_service", function (event) {
    event.preventDefault();
    var preAuthorizationType = $("#preAuthorizationType").val();
    console.log("Pre-Authorization Type Selected: " + preAuthorizationType);
    if (preAuthorizationType == "Institutional") {
        $("#dental_service_div").hide();
        $("#body_site_div").show();
    } else if (preAuthorizationType == "Professional") {
        $("#dental_service_div").hide();
        $("#body_site_div").show();
    } else if (preAuthorizationType == "Dental") {
        $("#dental_service_div").show();
        $("#body_site_div").hide();
    } else if (preAuthorizationType == "Vision") {
        $("#dental_service_div").hide();
        $("#body_site_div").show();
    } else if (preAuthorizationType == "Pharmacy") {
        $("#dental_service_div").hide();
        $("#body_site_div").show();
    }

    editingRowIndex = $(this).data("index");
    $("#add_services_btn").text("Update Service");

    const offcanvasElement = new bootstrap.Offcanvas(
        document.getElementById("offcanvasTop"),
    );
    offcanvasElement.show();

    var index = editingRowIndex;
    console.log(index);
    var index = $(this).data("index");
    var clickedServiceId = $(`#addedServiceId${index}`).val();
    var approvedItemData = [];
    var approvedItemDataRaw = $("#approvedItemData").val();
    var matchedItem = null;
    if (approvedItemDataRaw && approvedItemDataRaw.trim() !== "") {
        try {
            approvedItemData = JSON.parse(approvedItemDataRaw);
            matchedItem = approvedItemData.find(
                (item) => item.serviceId == clickedServiceId,
            );
        } catch (e) {
            console.error(
                "Invalid JSON in #approvedItemData:",
                approvedItemDataRaw,
            );
        }
    }
    $("#serviceDate").val($(`#addedServicedate${index}`).val());
    const slctMedicalServiceTypeValue = $(`#addedServiceType${index}`).val();
    $("#slctMedicalServiceType")
        .val(slctMedicalServiceTypeValue)
        .trigger("change");
    $("#serviceId").val(clickedServiceId).trigger("change");
    setSelect2ServiceById("#serviceId", clickedServiceId);
    $("#patientInvoiceNo").val($(`#patientInvoiceNo${index}`).val());
    const maternityValue = $(`#maternity${index}`).val();
    $("#maternity")
        .prop("checked", maternityValue == 1)
        .val(maternityValue);
    $("#serviceUnitPrice").val($(`#addedServiceUnitPrice${index}`).val());
    $("#serviceDiscountPercentage").val(
        $(`#addedServiceDiscountPercentage${index}`).val(),
    );
    $("#serviceQuantity").val($(`#addedServiceQuantity${index}`).val());
    $("#serviceNetAmount").val($(`#addedServiceNetAmount${index}`).val());
    $("#serviceVatPercentage").val($(`#addedServiceVat${index}`).val());
    $("#daySupply").val($(`#addedServiceDaySupply${index}`).val());
    const bodySiteValue = $(`#addedServiceBodySite${index}`).val();
    $("#bodySite").val(bodySiteValue).trigger("change");
    const subSiteValue = $(`#addedServiceSubSite${index}`).val();
    $("#subSite").val(subSiteValue).trigger("change");
    const serviceDiagnosisValue = $(`#addedServiceDiagnosisId${index}`).val();
    console.log("diagnosis", serviceDiagnosisValue);
    console.log(
        "selector",
        `#addedServiceDiagnosisId${index}`,
        $(`#addedServiceDiagnosisId${index}`).length,
    );
    appendDiagnosisSelectBox(
        [serviceDiagnosisValue],
        serviceDiagnosisValue,
        true,
    );
    console.log("scientificCode", $(`#scientificCode${index}`).val());
    $("#scientificCode").val($(`#scientificCode${index}`).val());
    $("#scientificCodeAbsenceReason")
        .val($(`#scientificCodeAbsenceReason${index}`).val())
        .trigger("change");
    $("#strength").val($(`#strength${index}`).val());
    $("#selectionReason")
        .val($(`#selectionReason${index}`).val())
        .trigger("change");
    $("#pharmacistSubsitute")
        .val($(`#pharmacistSubsitute${index}`).val())
        .trigger("change");
    $("#medicineStartDate").val($(`#medicineStartDate${index}`).val());
    $("#discontinueDate").val($(`#discontinueDate${index}`).val());
    $("#txtDuration").val($(`#txtDuration${index}`).val());
    $("#slcDurationUnit")
        .val($(`#slcDurationUnit${index}`).val())
        .trigger("change");
    $("#frequency").val($(`#frequency${index}`).val());
    $("#txtPeriod").val($(`#txtPeriod${index}`).val());
    $("#slcPeriodUnit")
        .val($(`#slcPeriodUnit${index}`).val())
        .trigger("change");
    $("#txtDoseQuantity").val($(`#txtDoseQuantity${index}`).val());
    $("#slcDose")
        .val($(`#slcDose${index}`).val())
        .trigger("change");
    $("#slcRouteAdmin")
        .val($(`#slcRouteAdmin${index}`).val())
        .trigger("change");
    $("#timeInstruction")
        .val($(`#timeInstruction${index}`).val())
        .trigger("change");
    $("#refillCount").val($(`#refillCount${index}`).val());
    $("#dosageInstruction").val($(`#dosageInstruction${index}`).val());
    $("#patientInstruction").val($(`#patientInstruction${index}`).val());
    $("#additionalSupportingInfo").val(
        $(`#additionalSupportingInfo${index}`).val(),
    );
    if (matchedItem) {
        $("#approvedQuantity").val(matchedItem.approvedQuantity);
        $("#approvedUnitPrice").val(matchedItem.unitPrice);
        $("#approvedDiscount").val(matchedItem.discountPercentage);
        $("#approvedTax").val(matchedItem.netTaxCost);
        $("#approvedFactor").val(matchedItem.factor);
        $("#approvedNetAmount").val(matchedItem.netCost);
        $("#approvedPatientShareAmount").val(matchedItem.patientShareAmount);
        $("#approvedPayerShareAmount").val(matchedItem.payerShareAmount);
    }
});

$(document).on("change", "#investigationResult", function (event) {
    event.preventDefault();
    if ($(this).val() == "IRA") {
        $("#investigation_result_other_div").hide();
    } else if ($(this).val() == "INP") {
        $("#investigation_result_other_div").hide();
    } else if ($(this).val() == "IRP") {
        $("#investigation_result_other_div").hide();
    } else if ($(this).val() == "NA") {
        $("#investigation_result_other_div").hide();
    } else if ($(this).val() == "other") {
        $("#investigation_result_other_div").show();
    } else {
        $("#investigation_result_other_div").hide();
    }
});

$(document).on("click", "#add_more_clinic_document", function (event) {
    event.preventDefault();
    let fileInput = $("#formFile")[0];
    let file = fileInput.files[0];
    let documentName = $("#documentName").val();
    let documentType = $("#documentType option:selected").text();
    let investigationResultNote = $("#investigationResultNote").val();
    if (!file) {
        alert("Please select a file!");
        return;
    }
    if (!documentName) {
        alert("Please enter a document name!");
        return;
    }
    var fileIndex = $("#clinic_document_table_tbody tr").length;
    let newRow = `<tr>
                        <td>${fileIndex + 1}</td>
                        <td>${documentName}</td>
                        <td>${documentType}</td>
                        <td>${investigationResultNote}</td>
                        <td class="text-center">
                            <button class="btn btn-outline-danger btn-sm remove-file" data-index="${
                                fileIndex - 1
                            }">
                                <i class="ti ti-trash"></i>
                            </button>
                        </td>
                      </tr>`;

    $("#clinic_document_table_tbody").append(newRow);
    fileArray.push({
        file: file,
        name: documentName,
        type: documentType,
        note: investigationResultNote,
    });
    fileInput.value = "";
    $("#documentName").val("");
    $("#documentType").val("").trigger("change");
    $("#investigationResultNote").val("");
});

$(document).on("click", ".remove-file", function () {
    let index = $(this).data("index");
    fileArray.splice(index, 1);
    $(this).closest("tr").remove();

    $("#clinic_document_table_tbody tr").each(function (i) {
        $(this)
            .find("td:first")
            .text(i + 1); // update serial number
        $(this).find(".remove-file").attr("data-index", i); // update data-index
    });
});

$(document).on("click", ".submit_request_btn", function (e) {
    const submitId = $(this).attr("id");
    if (
        submitId === "preauthorization_request_btn" ||
        submitId === "resubmission_preauthorization_request_btn" ||
        submitId === "claim_request_btn"
    ) {
        e.preventDefault();
        console.log("Submit ID:", submitId);
        let formId;
        if (submitId === "preauthorization_request_btn") {
            formId = "#pre_authorization_request_form";
        } else if (submitId === "resubmission_preauthorization_request_btn") {
            formId = "#resubmission_pre_authorization_request_form";
        } else if (submitId === "claim_request_btn") {
            formId = "#claim_request_form";
        }
        console.log("form Id:", formId);
        const formData = new FormData($(formId)[0]);

        fileArray.forEach((fileObj, index) => {
            formData.append(`documents[${index}][file]`, fileObj.file);
            formData.append(`documents[${index}][name]`, fileObj.name);
            formData.append(`documents[${index}][type]`, fileObj.type);
            formData.append(`documents[${index}][note]`, fileObj.note);
        });
        $("#service_table_tbody input[type=hidden]").each(function () {
            formData.append(this.id, $(this).val());
        });
        console.log(formData);
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        $("#loader-overlay").show();
        $.ajax({
            url: BASE_URL + "/pre-authorization",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log("Response:", response);
                $("#loader-overlay").hide();
                if (response.error === true) {
                    Swal.fire({
                        icon: "error",
                        title: "NPHIES Error Detected!",
                        html: `
                            <div style="text-align:left;">
                                <b>Error Code:</b> ${
                                    response.errorCode || "N/A"
                                } <br>
                                <b>Message:</b> ${
                                    response.errorMessage || "Unknown error."
                                } <br>
                                <b>Status:</b> ${
                                    response.nphiesStatus || "Unknown"
                                }
                            </div>
                        `,
                        confirmButtonText: "Close",
                        customClass: {
                            confirmButton: "btn btn-danger",
                        },
                    });
                    return;
                }
                let requestType =
                    submitId === "claim_request_btn"
                        ? "Claim"
                        : "Pre-Authorization";
                let message =
                    response.message ||
                    `${requestType} Request stored successfully.`;
                let status = (response.nphiesStatus || "unknown").toLowerCase();
                let alertOptions = {
                    icon: "info",
                    title: `${requestType} Request Status`,
                    text: `${message}\n Status: ${status.toUpperCase()}`,
                    customClass: { confirmButton: "btn btn-primary" },
                };
                if (status === "approved") {
                    alertOptions.icon = "success";
                    alertOptions.title = `${requestType} Approved`;
                    alertOptions.text = message;
                    alertOptions.customClass = {
                        confirmButton: "btn btn-success",
                    };
                } else if (status === "rejected") {
                    alertOptions.icon = "error";
                    alertOptions.title = `${requestType} Rejected`;
                    alertOptions.customClass = {
                        confirmButton: "btn btn-danger",
                    };
                } else if (status === "pended") {
                    alertOptions.icon = "warning";
                    alertOptions.title = `${requestType} Pended`;
                    alertOptions.customClass = {
                        confirmButton: "btn btn-warning",
                    };
                } else if (status === "system-error") {
                    alertOptions.icon = "warning";
                    alertOptions.title = `${requestType} System-Error`;
                    alertOptions.customClass = {
                        confirmButton: "btn btn-warning",
                    };
                }
                Swal.fire(alertOptions);
            },
            error: function (xhr, status, error) {
                $("#loader-overlay").hide();
                Swal.fire({
                    icon: "error",
                    title: "Request Failed!",
                    html: `
                        <div style="text-align:left;">
                            <b>Status:</b> ${xhr.status} <br>
                            <b>Message:</b> ${xhr.statusText || error} <br>
                            <b>Details:</b> ${
                                xhr.responseText || "No response body"
                            }
                        </div>
                    `,
                    confirmButtonText: "Close",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                });
            },
        });
    }
});

$(document).on("click", ".payments_request_btn", function (e) {
    e.preventDefault();

    let claimRequestId = $("#claimRequestId").val();
    let insurancePayerId = $("#insurancePayerId").val();

    if (!claimRequestId || !insurancePayerId) {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Claim Request or Insurance Payer missing.",
            customClass: {
                confirmButton: "btn btn-danger waves-effect waves-light",
            },
        });
        return;
    }
    window.location.href = `/payments-send/${claimRequestId}`;
});

$(document).on("click", ".cancel_request_btn", function (e) {
    e.preventDefault();
    const submitId = $(this).attr("id");
    if (
        submitId === "preauthorization_request_cancel_btn" ||
        submitId === "claim_request_cancel_btn" ||
        submitId === "advanced_preauthorization_cancel_btn"
    ) {
        console.log(submitId);
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to cancel this NPHIES request?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Cancel Request",
            cancelButtonText: "Close",
            customClass: {
                confirmButton: "btn btn-warning waves-effect waves-light",
                cancelButton: "btn btn-danger waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                $("#cancelModalForm")[0].reset();
                $("#cancelReason").val(null).trigger("change");
                $("#cancelRequestModal").modal("show");
            }
        });
    }
});

$(document).on("click", ".cancelRequest", function (e) {
    const submitId = $(this).attr("id");
    if (
        submitId === "preauthorizationRequestCancelBtn" ||
        submitId === "claimRequestCancelBtn" ||
        submitId === "advancedPreauthorizationCancelBtn"
    ) {
        e.preventDefault();
        console.log(submitId);
        let cancelReason = $("#cancelReason").val();
        if (!cancelReason) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Please select a cancel reason.",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
            return;
        }
        let formData = new FormData($("#cancelModalForm")[0]);
        const ajaxUrl = BASE_URL + "/cancel-request";
        const method = "POST";
        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $("#loader-overlay").hide();
                Swal.fire({
                    icon: response.status ? "success" : "error",
                    text: response.message,
                    customClass: {
                        confirmButton: `btn btn-${
                            response.status ? "success" : "danger"
                        } waves-effect waves-light`,
                    },
                }).then(function () {
                    location.reload();
                });

                $("#cancelRequestModal").modal("hide");
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                $("#cancelRequestModal").modal("hide");
                let errorMessage =
                    "An unexpected error occurred. Please try again.";
                if (xhr.status === 422) {
                    const errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                    return;
                } else if (xhr.responseJSON?.message) {
                    errorMessage = xhr.responseJSON.message;
                }
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
    }
});

$("#pool_status_btn").click(function (e) {
    let submitAction = $("#submitAction").val();
    console.log("Submit Action: " + submitAction);
    let formId;
    if (submitAction == "viewClaim") {
        formId = "#claim_request_form";
    } else if (submitAction == "advancedPreauthorization") {
        formId = "#advanced_preauthorization_form";
    } else {
        formId = "#pre_authorization_request_form";
    }
    var formData = new FormData($(formId)[0]);
    console.log(formData);
    fileArray.forEach((fileObj, index) => {
        formData.append(`documents[${index}][file]`, fileObj.file);
        formData.append(`documents[${index}][name]`, fileObj.name);
        formData.append(`documents[${index}][type]`, fileObj.type);
        formData.append(`documents[${index}][note]`, fileObj.note);
    });
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/pool-status",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log("Server Response:", response);
            $("#loader-overlay").hide();
            if (response.status === true) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: response.message,
                    customClass: { confirmButton: "btn btn-success" },
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text:
                        response.message ||
                        "Something went wrong while checking bundle status.",
                    customClass: { confirmButton: "btn btn-danger" },
                });
            }
        },
        error: function (xhr) {
            $("#loader-overlay").hide();
            let errorMessage =
                "An unexpected error occurred. Please try again.";
            if (xhr.status === 422) {
                const errors = xhr.responseJSON.errors;
                $(".error-text").text("");
                $.each(errors, function (key, value) {
                    $("." + key + "_error").text(value[0]);
                });
                return;
            } else if (xhr.responseJSON?.message) {
                errorMessage = xhr.responseJSON.message;
            }
            Swal.fire({
                icon: "error",
                title: "Access denied",
                text: errorMessage,
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        },
    });
});

$("#status_btn").click(function (e) {
    let submitAction = $("#submitAction").val();
    console.log("Submit Action: " + submitAction);
    let formId;
    if (submitAction == "viewClaim") {
        formId = "#claim_request_form";
    } else if (submitAction == "advancedPreauthorization") {
        formId = "#advanced_preauthorization_form";
    } else {
        formId = "#pre_authorization_request_form";
    }
    var formData = new FormData($(formId)[0]);
    console.log(formData);
    fileArray.forEach((fileObj, index) => {
        formData.append(`documents[${index}][file]`, fileObj.file);
        formData.append(`documents[${index}][name]`, fileObj.name);
        formData.append(`documents[${index}][type]`, fileObj.type);
        formData.append(`documents[${index}][note]`, fileObj.note);
    });
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/nphies-status",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log("Server Response:", response);
            $("#loader-overlay").hide();
            if (response.status === true) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: response.message,
                    customClass: { confirmButton: "btn btn-success" },
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text:
                        response.message ||
                        "Something went wrong while checking bundle status.",
                    customClass: { confirmButton: "btn btn-danger" },
                });
            }
        },
        error: function (xhr) {
            $("#loader-overlay").hide();
            let errorMessage =
                "An unexpected error occurred. Please try again.";
            if (xhr.status === 422) {
                const errors = xhr.responseJSON.errors;
                $(".error-text").text("");
                $.each(errors, function (key, value) {
                    $("." + key + "_error").text(value[0]);
                });
                return;
            } else if (xhr.responseJSON?.message) {
                errorMessage = xhr.responseJSON.message;
            }
            Swal.fire({
                icon: "error",
                title: "Access denied",
                text: errorMessage,
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        },
    });
});

function getProviderSpecialityById(providerEmployeeId) {
    $.ajax({
        url: BASE_URL + "/get-provider-practice-by-id/" + providerEmployeeId,
        type: "GET",
        beforeSend: function () {
            $("#loader-overlay").show();
        },
        success: function (response) {
            console.log(response.data);
            const practiceCode = response.data.practiceCode;
            const $specialities = $("#specialities");
            $specialities.val(practiceCode).trigger("change");
        },
        complete: function () {
            $("#loader-overlay").hide();
        },
        error: function () {
            $("#loader-overlay").hide();
        },
    });
}

function setSelect2ServiceById(selector, serviceId) {
    if (!serviceId) return;
    console.log("Fetching service for ID:", serviceId);
    $.ajax({
        url: `/pre-authorization-service/${serviceId}`,
        type: "GET",
        dataType: "json",
        success: function (service) {
            if (!service) {
                console.warn(`Service with ID ${serviceId} not found.`);
                return;
            }
            const displayText = `(${service.serviceCode}) ${service.serviceName_en}`;
            if (!$(selector).data("select2")) {
                $(selector).select2({
                    placeholder: "Search Diagnosis",
                    allowClear: true,
                    ajax: {
                        url: "/pre-authorization-services-search-by-query",
                        dataType: "json",
                        delay: 250,
                        data: function (params) {
                            return { servicesCodeOrName: params.term };
                        },
                        processResults: function (data) {
                            return {
                                results: data.map(function (item) {
                                    return {
                                        id: item.serviceId,
                                        text:
                                            "(" +
                                            item.serviceCode +
                                            ") " +
                                            item.serviceName_en,
                                    };
                                }),
                            };
                        },
                        cache: true,
                    },
                });
            }
            $(selector).empty();
            const newOption = new Option(
                displayText,
                service.serviceId,
                true,
                true,
            );
            $(selector).append(newOption).trigger("change");
        },
        error: function (xhr) {
            console.error("Failed to fetch service details.", xhr.statusText);
        },
    });
}

function getClientDetailsById(clientId) {
    $.ajax({
        url: BASE_URL + "/get-client-details-by-id/" + clientId,
        type: "GET",
        beforeSend: function () {
            $("#loader-overlay").show();
        },
        success: function (response) {
            console.log(response);
            if (response.status) {
                console.log(response.data.insurance_policy);
                if (
                    !response.data.insurance_policy ||
                    !response.data.insurance_policy.policyType
                ) {
                    $("#loader-overlay").hide();
                    Swal.fire({
                        icon: "warning",
                        title: "No Insurance Policy",
                        text: "This patient does not have an insurance policy.",
                        customClass: { confirmButton: "btn btn-warning" },
                    });
                    return;
                }
                var policyType = response.data.insurance_policy.policyType;
                if (policyType === "nphies") {
                    $("#eligibilityType").val("online").trigger("change");
                } else {
                    $("#eligibilityType").val("offline").trigger("change");
                }
                $("#clinicId").val(response.data.clinicId).trigger("change");
                $("#insurancePayerId")
                    .val(response.data.insurance_policy.insurancePayerId)
                    .trigger("change");
                $("#identifierType")
                    .val(response.data.idNationalType)
                    .trigger("change");
                $("#identifierId").val(response.data.idNational);
                $("#firstName").val(response.data.clientName);
                $("#givenName").val(response.data.secondName_en);
                $("#familyName").val(response.data.fourthName_en);
                $("#membershipNo").val(
                    response.data.insurance_policy.membershipId,
                );
                $("#policyNo").val(
                    response.data.insurance_policy.policy.policyNumber,
                );
                $("#policyHolderName").val(
                    response.data.insurance_policy.policy.policyName,
                );
                $("#className").val(
                    response.data.insurance_policy.insurance_class.className,
                );
                $("#mobileNo").val(response.data.mobile);
                $("#birthDate").val(response.data.birthDate);
                $("#mrn").val(response.data.clientId);
                $("#gender").val(response.data.gender).trigger("change");
                $("#maritalStatus")
                    .val(response.data.maritalStatus)
                    .trigger("change");
                $("#occupation")
                    .val(response.data.occupation)
                    .trigger("change");
                $("#religion").val(response.data.religion).trigger("change");
                console.log(
                    response.data.insurance_policy.relationWithSubscriber,
                );
                // $("#relationshipType")
                //     .val(response.data.insurance_policy.relationWithSubscriber)
                //     .trigger("change");

                isProgrammaticRelationshipChange = true;
                $("#relationshipType")
                    .val(response.data.insurance_policy.relationWithSubscriber)
                    .trigger("change");
                if (
                    response.data.insurance_policy.relationWithSubscriber ==
                    "Child"
                ) {
                    console.log("true");
                    $("#child_information").show();
                    console.log(response.data.insurance_policy);
                    $("#relatedPatient_information").hide();
                    var relationshipClientId = String(
                        response.data.insurance_policy.relationshipClientId,
                    );
                    var relatedClient =
                        response.data.insurance_policy.related_client;

                    var relatedClientName = $.trim(
                        [
                            relatedClient.clientName,
                            relatedClient.secondName_en,
                            relatedClient.fourthName_en,
                        ].join(" "),
                    );

                    if (
                        $(
                            "#newBornSelect option[value='" +
                                relationshipClientId +
                                "']",
                        ).length === 0
                    ) {
                        var option = new Option(
                            relatedClientName,
                            relationshipClientId,
                            true,
                            true,
                        );
                        $("#newBornSelect").append(option);
                    }
                    $("#newBornSelect")
                        .val(relationshipClientId)
                        .trigger("change.select2");
                    $("#newBornMrn").val(
                        response.data.insurance_policy.related_client.clientId,
                    );
                    $("#newBornBirthDate").val(
                        response.data.insurance_policy.related_client.birthDate,
                    );
                    $("#newBornGender")
                        .val(
                            response.data.insurance_policy.related_client
                                .gender,
                        )
                        .trigger("change");
                } else if (
                    response.data.relationshipType == "Parent" ||
                    response.data.relationshipType == "Spouse" ||
                    response.data.relationshipType == "Common Law Spouse" ||
                    response.data.relationshipType == "Injured Party" ||
                    response.data.relationshipType == "Other"
                ) {
                    $("#relatedPatient_information").show();
                    $("#child_information").hide();
                    console.log(response.data.relationshipClientId);
                    console.log(response.data.relationship_birthDate);
                    $("#relatedPatientSelect")
                        .val(response.data.relationshipClientId)
                        .trigger("change");
                    $("#relatedPatientMrn").val(response.data.relationship_mrn);
                    $("#relatedPatientBirthDate").val(
                        response.data.relationship_birthDate,
                    );
                    $("#relatedPatientGender")
                        .val(response.data.relationship_gender)
                        .trigger("change");
                }
            }
        },
        complete: function () {
            $("#loader-overlay").hide();
        },

        error: function () {
            $("#loader-overlay").hide();
        },
    });
}

function gregorianToHijri(year, month, day) {
    var jd =
        Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
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

function fetchEligibilityCheckDetails(identifierId, identifierType) {
    $.ajax({
        url: "/eligibility-check-get-details",
        type: "GET",
        data: {
            identifier_id: identifierId,
            identifier_type: identifierType,
        },
        success: function (response) {
            if (response.data) {
                let fullName = response.data.fullName;
                let gender = response.data.gender
                    ? response.data.gender.toLowerCase()
                    : "";
                $("#first_name").val(fullName);
                $("#gender").val(gender).trigger("change");
                if (
                    response.data.insurancePlans &&
                    response.data.insurancePlans.length > 0
                ) {
                    let policyNumber =
                        response.data.insurancePlans[0].policyNumber;
                    let policyClassName =
                        response.data.insurancePlans[0].policyClassName;
                    let memberCardId =
                        response.data.insurancePlans[0].memberCardId;
                    let policyHolder =
                        response.data.insurancePlans[0].policyHolder;
                    $("#policy_no").val(policyNumber);
                    $("#class_name").val(policyClassName);
                    $("#membership_no").val(memberCardId);
                    $("#policy_holder_name").val(policyHolder);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "No insurance plans found.",
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Invalid response data.",
                    customClass: { confirmButton: "btn btn-danger" },
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to fetch details Due to Technical Issue. Please try again some other Time.",
                customClass: { confirmButton: "btn btn-danger" },
            });
        },
    });
}

// function getEligibilityRefNoDetailsById(eligibilityCheckId) {
//     $.ajax({
//         url:
//             BASE_URL +
//             "/get-eligibility-refference-no-details-by-id/" +
//             eligibilityCheckId,
//         type: "GET",
//         success: function (response) {
//             if (response.status) {
//                 if (response.data.relation_client) {
//                     if (
//                         !$("#newBornSelect").find(
//                             'option[value="' +
//                                 response.data.relation_client.clientId +
//                                 '"]'
//                         ).length
//                     ) {
//                         console.log(response.data.relation_client);
//                         $("#newBornSelect").append(
//                             $("<option>", {
//                                 value: response.data.relation_client.clientId,
//                                 text:
//                                     (response.data.relation_client
//                                         .clientName_en || "") +
//                                     " " +
//                                     (response.data.relation_client
//                                         .secondName_en || "") +
//                                     " " +
//                                     (response.data.relation_client
//                                         .fourthName_en || ""),
//                             })
//                         );
//                     }
//                     if (
//                         !$("#relatedPatientSelect").find(
//                             'option[value="' +
//                                 response.data.relation_client.clientId +
//                                 '"]'
//                         ).length
//                     ) {
//                         console.log(response.data.relation_client);
//                         $("#relatedPatientSelect").append(
//                             $("<option>", {
//                                 value: response.data.relation_client.clientId,
//                                 text:
//                                     (response.data.relation_client
//                                         .clientName_en || "") +
//                                     " " +
//                                     (response.data.relation_client
//                                         .secondName_en || "") +
//                                     " " +
//                                     (response.data.relation_client
//                                         .fourthName_en || ""),
//                             })
//                         );
//                     }
//                     $("#newBornSelect")
//                         .val(response.data.relation_client.clientId)
//                         .trigger("change");
//                     $("#relatedPatientSelect")
//                         .val(response.data.relation_client.clientId)
//                         .trigger("change");
//                 }

//                 $("#eligibilityOfflineDate").val(
//                     response.data.eligibilityOfflineDate
//                 );
//                 $("#eligibilityOfflineRef").val(
//                     response.data.eligibilityOfflineRef
//                 );
//                 $("#eligibilityType")
//                     .val(response.data.eligibilityType)
//                     .trigger("change");
//                 $("#identifierType")
//                     .val(response.data.identifier_type)
//                     .trigger("change");
//                 $("#identifierId").val(response.data.identifier_id);
//                 $("#prefix").val(response.data.prefix).trigger("change");
//                 $("#firstName").val(response.data.first_name);
//                 $("#givenName").val(response.data.given_name);
//                 $("#familyName").val(response.data.family_name);
//                 $("#membershipNo").val(response.data.membership_no);
//                 $("#policyNo").val(response.data.policy_no);
//                 $("#policyHolderName").val(response.data.policy_holder_name);
//                 $("#className").val(response.data.class_name);
//                 $("#mobileNo").val(response.data.mobile_no);
//                 $("#birthDate").val(response.data.birth_date);
//                 $("#mrn").val(response.data.mrn);
//                 $("#gender").val(response.data.gender).trigger("change");
//                 $("#maritalStatus")
//                     .val(response.data.marital_status)
//                     .trigger("change");
//                 $("#occupation")
//                     .val(response.data.occupation)
//                     .trigger("change");
//                 $("#religion").val(response.data.religion).trigger("change");
//                 isProgrammaticRelationshipChange = true;
//                 $("#relationshipType")
//                     .val(response.data.relationshipType)
//                     .trigger("change");
//                 console.log(response.data.relationshipType);
//                 if (response.data.relationshipType == "Child") {
//                     $("#child_information").show();
//                     $("#relatedPatient_information").hide();
//                     $("#newBornSelect")
//                         .val(response.data.relationshipClientId)
//                         .trigger("change");
//                     $("#newBornMrn").val(response.data.relationship_mrn);
//                     $("#newBornBirthDate").val(
//                         response.data.relationship_birthDate
//                     );
//                     $("#newBornGender")
//                         .val(response.data.relationship_gender)
//                         .trigger("change");
//                 } else if (
//                     response.data.relationshipType == "Parent" ||
//                     response.data.relationshipType == "Spouse" ||
//                     response.data.relationshipType == "Common Law Spouse" ||
//                     response.data.relationshipType == "Injured Party" ||
//                     response.data.relationshipType == "Other"
//                 ) {
//                     $("#relatedPatient_information").show();
//                     $("#child_information").hide();
//                     console.log(response.data.relationshipClientId);
//                     console.log(response.data.relationship_birthDate);
//                     $("#relatedPatientSelect")
//                         .val(response.data.relationshipClientId)
//                         .trigger("change");
//                     $("#relatedPatientMrn").val(response.data.relationship_mrn);
//                     $("#relatedPatientBirthDate").val(
//                         response.data.relationship_birthDate
//                     );
//                     $("#relatedPatientGender")
//                         .val(response.data.relationship_gender)
//                         .trigger("change");
//                 }
//             }
//         },
//     });
// }

function getServiceDetailsById(serviceId) {
    $.ajax({
        url: BASE_URL + "/pre-authorization-service-details-by-id/" + serviceId,
        type: "GET",
        data: {
            clientId: $("#clientId").val(),
            departmentId: $("#department").val(),
            preAuthType: $("#preAuthorizationType").val(),
        },
        beforeSend: function () {
            $("#loader-overlay").show();
        },
        success: function (response) {
            if (response.status) {
                $("#serviceUnitPrice").val(response.data.unitPrice);
                $("#serviceDiscountPercentage").val(
                    response.data.insuranceCoverageRate,
                );
                console.log(response.data);
                $("#serviceNetAmount").val(response.data.patientShareAmt);

                console.log(response);
                let netAmount = 0;
                let serviceQuantity = 1;
                // netAmount = calculateServiceNetAmount(
                //     response.data.disType,
                //     response.data.dis,
                //     response.data.cost,
                //     serviceQuantity,
                //     response.data.vatPercentage
                // );
                // $("#serviceUnitPrice").val(response.data.cost);
                $("#serviceVatPercentage").val(response.data.vatPercentage);
                // $("#serviceNetAmount").val(netAmount);
                $("#serviceQuantity").val(serviceQuantity);
                // $("#serviceDiscountPercentage").val(
                //     response.data.disType == "flat" ? response.data.dis : 0
                // );
                // calculateNetAmount();
            }
        },
        complete: function () {
            $("#loader-overlay").hide();
        },
        error: function () {
            $("#loader-overlay").hide();
        },
    });
}

function calculateServiceNetAmount(
    disType,
    dis,
    cost,
    serviceQuantity,
    taxValueInPercentage,
) {
    let unitPrice = parseFloat(cost) || 0;
    let vatPercent = parseFloat(taxValueInPercentage) || 0;
    let discountAmount = 0;
    let discountPercent = parseFloat(dis) || 0;
    let quantity = parseFloat(serviceQuantity) || 1;
    if (disType == "flat") {
        discountAmount = parseFloat(dis) || 0;
    } else if (disType == "percentage") {
        discountAmount = (unitPrice * discountPercent) / 100;
    }
    let priceAfterDiscount = unitPrice - discountAmount;
    let vatAmount = (priceAfterDiscount * vatPercent) / 100;
    return (netAmount = (priceAfterDiscount + vatAmount) * quantity);
}

$("#serviceDiagnosis").select2({
    placeholder: "Select Diagnosis",
    allowClear: true,
    width: "100%",
});

$("#cautionOfDeath").select2({
    placeholder: "Select Caution Of Death",
    allowClear: true,
    width: "100%",
});
function appendDiagnosisSelectBox(
    diagnosisIds,
    selectedId = null,
    isEdit = false,
) {
    const $serviceDiagnosis = $("#serviceDiagnosis");
    const $cautionOfDeath = $("#cautionOfDeath");

    $serviceDiagnosis.empty().val(null).trigger("change");
    $cautionOfDeath
        .empty()
        .append(`<option value="">Select Caution Of Death</option>`)
        .val("")
        .trigger("change");

    $.ajax({
        url: BASE_URL + "/get-diagnosis-list",
        type: "POST",
        data: { diagnosisIds: JSON.stringify(diagnosisIds) },
        success: function (response) {
            if (response.status && Array.isArray(response.data)) {
                response.data.forEach(function (item) {
                    const text = `${item.diagnosisCode} - ${item.diagnosisName_en}`;

                    const option = new Option(
                        text,
                        item.diagnosisListId,
                        false,
                        isEdit && selectedId == item.diagnosisListId,
                    );

                    $serviceDiagnosis.append(option);

                    $cautionOfDeath.append(
                        new Option(text, item.diagnosisListId, false, false),
                    );
                });

                //  Select ONLY in edit mode
                if (isEdit && selectedId) {
                    $serviceDiagnosis.val(selectedId).trigger("change.select2");
                } else {
                    $serviceDiagnosis.trigger("change");
                }
            }
        },
    });
}

function bindTimeCheckListeners() {
    const admissionInput = document.getElementById("encounterAdmissionDate");
    const dischargeInput = document.getElementById("encounterDischargeDate");
    const preAuthTypeSelect = document.getElementById("preAuthorizationType");
    const preSubAuthTypeSelect = document.getElementById(
        "preSubAuthorizationType",
    );
    admissionInput?.addEventListener("blur", validateDayCaseDateMatch);
    dischargeInput?.addEventListener("blur", validateDayCaseDateMatch);
    preAuthTypeSelect?.addEventListener("change", validateDayCaseDateMatch);
    preSubAuthTypeSelect?.addEventListener("change", validateDayCaseDateMatch);
}

function validateDayCaseDateMatch() {
    const admissionInput = document.getElementById("encounterAdmissionDate");
    const dischargeInput = document.getElementById("encounterDischargeDate");
    const preAuthTypeSelect = document.getElementById("preAuthorizationType");
    const preSubAuthTypeSelect = document.getElementById(
        "preSubAuthorizationType",
    );
    const admissionDate = getDatePart(admissionInput?.value);
    const dischargeDate = getDatePart(dischargeInput?.value);
    const preAuthType = preAuthTypeSelect?.value;
    const preSubAuthType = preSubAuthTypeSelect?.value;
    dischargeInput?.classList.remove("is-invalid");
    if (
        preAuthType === "Institutional" &&
        preSubAuthType === "dayCase" &&
        admissionDate &&
        dischargeDate
    ) {
        if (admissionDate !== dischargeDate) {
            dischargeInput?.classList.add("is-invalid");
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "For 'Institutional' and 'Day Case', admission and discharge dates must be the same.",
                customClass: { confirmButton: "btn btn-warning" },
            });
        }
    }
}

function getDatePart(datetimeStr) {
    if (!datetimeStr) return "";
    return datetimeStr.trim().split("T")[0].split(" ")[0];
}

function calculateNetAmount() {
    let unitPrice = parseFloat($("#serviceUnitPrice").val()) || 0;
    let quantity = parseFloat($("#serviceQuantity").val()) || 0;
    let discountPercentage =
        parseFloat($("#serviceDiscountPercentage").val()) || 0;
    let grossAmount = unitPrice * quantity;
    let discountAmount = (discountPercentage / 100) * grossAmount;
    let netAmount = grossAmount - discountAmount;
    $("#serviceDiscountAmount").val(discountAmount);
    $("#serviceNetAmount").val(netAmount.toFixed(2));
}

function clearServiceModalElements() {
    $("#serviceDate").val("");
    $("#slctMedicalServiceType").val("").trigger("change");
    $("#serviceId").val(null).trigger("change");
    $("#patientInvoiceNo").val("");
    $("#maternity").prop("checked", false).val(0);
    $("#serviceUnitPrice").val("");
    $("#serviceDiscountPercentage").val("");
    $("#serviceDiscountAmount").val("");
    $("#serviceQuantity").val("");
    $("#serviceNetAmount").val("");
    $("#serviceVatPercentage").val("");
    $("#daySupply").val("");
    $("#bodySite").val(null).trigger("change");
    $("#subSite").val(null).trigger("change");
    $("#serviceDiagnosis").val(null).trigger("change");
    $("#scientificCode").val("");
    $("#scientificCodeAbsenceReason").val(null).trigger("change");
    $("#strength").val("");
    $("#selectionReason").val(null).trigger("change");
    $("#pharmacistSubsitute").val(null).trigger("change");
    $("#medicineStartDate").val("");
    $("#discontinueDate").val("");
    $("#txtDuration").val("");
    $("#slcDurationUnit").val(null).trigger("change");
    $("#frequency").val("");
    $("#txtPeriod").val("");
    $("#slcPeriodUnit").val(null).trigger("change");
    $("#txtDoseQuantity").val("");
    $("#slcDose").val(null).trigger("change");
    $("#slcRouteAdmin").val(null).trigger("change");
    $("#timeInstruction").val(null).trigger("change");
    $("#refillCount").val("");
    $("#dosageInstruction").val("");
    $("#patientInstruction").val("");
    $("#additionalSupportingInfo").val("");
}

function toggleIsFrameValue(checkbox) {
    if (checkbox.checked) {
        checkbox.value = "Yes";
    } else {
        checkbox.value = "No";
    }
    return checkbox.value;
}

function clearProductTypeCheckValue(productType) {
    console.log(productType);
    if (productType == "lens") {
        $("#contactLenses").val("").trigger("change");
        $("#contactLenseRightDistancePower").val("").trigger("change");
        $("#contactLenseRightNearPower").val("").trigger("change");
        $("#contactLenseRightDistanceCyl").val("").trigger("change");
        $("#contactLenseRightNearCyl").val("").trigger("change");
        $("#contactLenseRightDistanceAxis").val("").trigger("change");
        $("#contactLenseRightNearAxis").val("").trigger("change");
        $("#contactLenseRightDistanceBackCurve").val("");
        $("#contactLenseRightNearBackCurve").val("");
        $("#contactLenseRightDistanceDiameter").val("");
        $("#contactLenseRightNearDiameter").val("");
        $("#contactLenseRightAdd").val("").trigger("change");
        $("#contactLenseRightColor").val("");
        $("#contactLenseRightBrand").val("");
        $("#contactLenseRightDuration").val("");
        $("#SelectContactLenseRightDuration").val("").trigger("change");
        $("#contactLenseLeftDistancePower").val("").trigger("change");
        $("#contactLenseLeftNearPower").val("").trigger("change");
        $("#contactLenseLeftDistanceCyl").val("").trigger("change");
        $("#contactLenseLeftNearCyl").val("").trigger("change");
        $("#contactLenseLeftDistanceAxis").val("").trigger("change");
        $("#contactLenseLeftNearAxis").val("").trigger("change");
        $("#contactLenseLeftDistanceBackCurve").val("");
        $("#contactLenseLeftNearBackCurve").val("");
        $("#contactLenseLeftDistanceDiameter").val("");
        $("#contactLenseLeftNearDiameter").val("");
        $("#contactLenseLeftAdd").val("").trigger("change");
        $("#contactLenseLeftColor").val("");
        $("#contactLenseLeftBrand").val("");
        $("#contactLenseLeftDuration").val("");
        $("#SelectContactLenseLeftDuration").val("").trigger("change");
        $("#contactLenseLeftPd").val("");
    } else {
        $("#regularLenses").val("").trigger("change");
        $("#isFrame").prop("checked", false).trigger("change");
        $("#lensesSpecifications").val("").trigger("change");
        $("#lenseRightDistanceSph").val("").trigger("change");
        $("#lenseRightNearSph").val("").trigger("change");
        $("#lenseRightDistanceCyl").val("").trigger("change");
        $("#lenseRightNearCyl").val("").trigger("change");
        $("#lenseRightDistanceAxis").val("").trigger("change");
        $("#lenseRightNearAxis").val("").trigger("change");
        $("#lenseRightDistanceIn").val("").trigger("change");
        $("#lenseRightNearIn").val("").trigger("change");
        $("#lenseRightDistanceOut").val("").trigger("change");
        $("#lenseRightNearOut").val("").trigger("change");
        $("#lenseRightDistanceDown").val("").trigger("change");
        $("#lenseRightNearDown").val("").trigger("change");
        $("#lenseRightDistanceUp").val("").trigger("change");
        $("#lenseRightNearUp").val("").trigger("change");
        $("#lenseRightAdd").val("").trigger("change");
        $("#lenseRightColor").val("");
        $("#lenseRightBrand").val("");
        $("#lenseLeftDistanceSph").val("").trigger("change");
        $("#lenseLeftNearSph").val("").trigger("change");
        $("#lenseLeftDistanceCyl").val("").trigger("change");
        $("#lenseLeftNearCyl").val("").trigger("change");
        $("#lenseLeftDistanceAxis").val("").trigger("change");
        $("#lenseLeftNearAxis").val("").trigger("change");
        $("#lenseLeftDistanceIn").val("").trigger("change");
        $("#lenseLeftNearIn").val("").trigger("change");
        $("#lenseLeftDistanceOut").val("").trigger("change");
        $("#lenseLeftNearOut").val("").trigger("change");
        $("#lenseLeftDistanceDown").val("").trigger("change");
        $("#lenseLeftNearDown").val("").trigger("change");
        $("#lenseLeftDistanceUp").val("").trigger("change");
        $("#lenseLeftNearUp").val("").trigger("change");
        $("#lenseLeftAdd").val("").trigger("change");
        $("#lenseLeftColor").val("");
        $("#lenseLeftBrand").val("");
        $("#lenseLeftPd").val("");
    }
    return productType.value;
}

$(document).on("change", "#preAuthorizationDetails", function () {
    const selected = $(this).val();
    const submitValue = $("#submitAction").val();
    if (
        submitValue === "claim" ||
        (submitValue === "claimDirect" && selected === "offline")
    ) {
        $("#preAuthorizationDateDiv").show();
        $("#preAuthorizationResIdetifierValueDiv").hide();
        $("#preAuthorizationResIdetifierUrlDiv").hide();
    } else {
        $("#preAuthorizationDateDiv").hide();
        $("#preAuthorizationResIdetifierValueDiv").show();
        $("#preAuthorizationResIdetifierUrlDiv").show();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const textarea = document.getElementById("exampleFormControlTextarea1");
    try {
        const parsed = JSON.parse(textarea.value);
        const pretty = JSON.stringify(parsed, null, 2);
        textarea.value = pretty;
    } catch (e) {
        console.warn("Invalid JSON in textarea:", e.message);
    }
});

$("#copyRequestJsonBtn").click(function () {
    var textarea = $(".request-json");
    textarea.select();
    document.execCommand("copy");
});

$("#copyResponseJsonBtn").click(function () {
    var textarea = $(".response-json");
    textarea.select();
    document.execCommand("copy");
});

function toggleTableHead(tableBodySelector, tableHeadSelector) {
    const rowCount = $(tableBodySelector + " tr").length;
    if (rowCount > 0) {
        $(tableHeadSelector).show();
    } else {
        $(tableHeadSelector).hide();
    }
}
