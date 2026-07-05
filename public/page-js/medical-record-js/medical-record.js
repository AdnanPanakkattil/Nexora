let currentRowIndex = null;
let currentEditingRow = null;
let rowIndex = 1;
let serviceRowIndex = 0;

/**
 * Check if the required vital sign fields are filled in the form.
 * Required fields: height, weight, bmi, temperature, blood_pressure,
 *                  pulse, respiratory_rate, spo_2, oxygen_saturation
 */

    // Prevent pain_scale from exceeding 10, handle paste, and clear invalid inputs
    if (typeof enforceNumericRange === "function") {
        enforceNumericRange(".pain_scale", 0, 10);
    }

function isVitalSignFilled() {
    var requiredFields = [
        "height", "weight", "bmi", "temperature",
        "blood_pressure", "pulse", "respiratory_rate",
        "oxygen_saturation"
    ];
    for (var i = 0; i < requiredFields.length; i++) {
        var val = $("#" + requiredFields[i]).val();
        if (!val || val.toString().trim() === "") {
            return false;
        }
    }
    return true;
}


function syncDiagnosisFromTable() {
    var diagnosesArr = [];
    $("#pre_auth_diagnosis_table_body tr").each(function () {
        var code = $(this).find("td:eq(4)").text().trim();
        var name = $(this).find("td:eq(5)").text().trim();
        if (name && name !== "") {
            diagnosesArr.push((code ? code + " - " : "") + name);
        }
    });
    var diagText = diagnosesArr.join(", ");
    $("#medical-report-a4 #diagnosis").text(diagText);
    $("#sick-leave-a4 #diagnosis_sick_leave").text(diagText);
}

function syncDiagnosisToReport() {
    syncDiagnosisFromTable();
}

function updateDiagnosisReport() {
    syncDiagnosisFromTable();
}

function handleReservationUI(status) {
    status = (status || "").toString().trim().toLowerCase();
    console.log("Handling reservation UI for status:", status);

    // Hide all button containers first
    $("#save_btn_container").hide();
    $("#process_btn_container").hide();
    $("#checkedin_btn_container").hide();

    if (status === "checkedin") {
        if (typeof isVitalSignFilled === "function" && isVitalSignFilled()) {
            $("#process_btn_container").show();
        } else {
            $("#checkedin_btn_container").show();
        }
    } else if (status === "processing" || status === "completed") {
        $("#save_btn_container").show();
    }
}

$(document).ready(function () {
    $("#medical_record_main_menu1").addClass("active open menu-item-animating");
    $("#medical_record_lists_sub_menu").addClass("active");
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    var reservationClientDetailsId = $("#reservation_client_details_id").val();
    var reservationId = $("#reservation_id").val();
    var clientId = $("#client_id").val();
    var reservationStatus = $("#reservationStatus").val();
    handleReservationUI(reservationStatus);

    $("#checkedin_medical_record_btn").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Check if mandatory vital sign fields are filled in the current form
        var vitalSignFilled = isVitalSignFilled();

        if (!vitalSignFilled) {
            Swal.fire({
                icon: "warning",
                title: "Vital Sign Required",
                text: "Please fill vital sign values before proceeding to processing.",
                confirmButtonText: "Go to Vital Sign",
                customClass: {
                    confirmButton: "btn btn-primary waves-effect",
                },
                buttonsStyling: false,
            }).then(function () {
                $("#vital-sign-tab").trigger("click");
            });
        } else {
            // Vital sign is filled - show success and change button
            Swal.fire({
                icon: "success",
                text: "Checked In successfully.",
                customClass: {
                    confirmButton: "btn btn-success waves-effect waves-light",
                },
                buttonsStyling: false,
            }).then(function () {
                // Hide Checked In button and show Processing button
                $("#checkedin_btn_container").hide();
                $("#process_btn_container").show();
            });
        }
    });
    $("#processing_medical_record_btn").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $("#loader-overlay").show();
        $.ajax({
            url: BASE_URL + "/medical-records-process/" + reservationId,
            type: "POST",
            data: {
                reservationId: reservationId,
            },
            success: function (response) {
                $("#loader-overlay").hide();
                Swal.fire({
                    icon: "success",
                    text: "Medical record processed successfully.",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                    buttonsStyling: false,
                }).then(() => {
                    const newStatus = "processing";
                    $("#reservationStatus").val(newStatus);
                    handleReservationUI(newStatus);
                });
            },
            error: function (xhr, status, error) {
                $("#loader-overlay").hide();
                Swal.fire({
                    icon: "error",
                    text: "An error occurred while processing the medical record.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                    buttonsStyling: false,
                });
            },
        });
    });
    if (reservationClientDetailsId && reservationId && clientId) {
        initialPageLoad(reservationClientDetailsId, reservationId, clientId);
    }
    $('button[data-bs-toggle="tab"]').on("click", function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
    $("#yesCheckbox").change(function () {
        if (this.checked) {
            $("#offcanvasAddUser").show();
        } else {
            $("#offcanvasAddUser").hide();
        }
    });
    $("#productTypeContact").prop("checked", true);
    $(document).on("change", 'input[name="productType[]"]', function () {
        $('input[name="productType[]"]').not(this).prop("checked", false);
    });
    $("#noCheckbox").change(function () {
        if (this.checked) {
            $("#offcanvasAddUser").hide();
        }
    });
    $(".tab-content").hide();
    $("#vital_sign_content").show();
    $("#bmi_history").show();
    $("#vital_head").show();
    $("#vital-sign-tab").click(function () {
        $(".tab-content").hide();
        $("#vital_sign_content").show();
        $("#bmi_history").show();
        $("#vital_head").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    $("#allergy-tab").click(function () {
        $(".tab-content").hide();
        $("#bmi_history").hide();
        $("#vital_head").hide();
        $("#allergy_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    $("#consultation-tab").click(function () {
        $(".tab-content").hide();
        $("#bmi_history").hide();
        $("#vital_head").hide();
        $("#consultation_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    $("#diagnosis-tab").click(function () {
        $(".tab-content").hide();
        $("#bmi_history").hide();
        $("#vital_head").hide();
        $("#diagnosis_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    $("#service-order-tab").click(function () {
        $(".tab-content").hide();
        $("#bmi_history").hide();
        $("#vital_head").hide();
        $("#service_order_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    $("#surgery-order-tab").click(function () {
        $(".tab-content").hide();
        $("#bmi_history").hide();
        $("#vital_head").hide();
        $("#surgery_order_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    $("#screening-tab").click(function () {
        $(".tab-content").hide();
        $("#bmi_history").hide();
        $("#vital_head").hide();
        $("#screening_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    $("#positive-screening-findings-care-plan-tab").click(function () {
        $(".tab-content").hide();
        $("#bmi_history").hide();
        $("#vital_head").hide();
        $("#positive_screening_findings_care_plan_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    $("#transfer-patient-tab").click(function () {
        $(".tab-content").hide();
        $("#bmi_history").hide();
        $("#vital_head").hide();
        $("#transfer_patient_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    $("#ecg-report-tab").click(function () {
        $(".tab-content").hide();
        $("#bmi_history").hide();
        $("#vital_head").hide();
        $("#ecg_report_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    $("#tooth-picker-tab").click(function () {
        $(".tab-content").hide();
        $("#bmi_history").hide();
        $("#vital_head").hide();
        $("#tooth_picker_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    $("#eye-prescription-tab").click(function () {
        $(".tab-content").hide();
        $("#bmi_history").hide();
        $("#vital_head").hide();
        $("#eye_prescription_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    $("#interdisciplinary-patient-tab").click(function () {
        $(".tab-content").hide();
        $("#bmi_history").hide();
        $("#vital_head").hide();
        $("#interdisciplinary_patient_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    $("#prescription-tab").click(function () {
        $(".tab-content").hide();
        $("#bmi_history").hide();
        $("#vital_head").hide();
        $("#prescription_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    $("#medical-report-tab").click(function () {
        $(".tab-content").hide();
        $("#bmi_history").hide();
        $("#vital_head").hide();
        $("#medical_report_tab_content").show();
        $("#pdf_report_content").show();  
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        $("#medical_report_btn")
            .addClass("active")
            .attr("aria-selected", "true");
    });
    $("#insurance-service-tab").click(function () {
        $(".tab-content").hide();
        $("#bmi_history").hide();
        $("#vital_head").hide();
        $("#insurance_service_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    flatpickr(".medicineStartDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    flatpickr(".discontinueDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    $(document).on("click", ".view-medicine-btn", function () {
        currentEditingRow = $(this).closest("tr");
        $("#medicineForm")[0].reset();
        console.log(currentEditingRow.find(".medicineStartDate").val());
        const medicineId = $(this).attr("data-medicine-id");
        $("#medicineId").val(medicineId);
        $("#scientificCode").val(
            currentEditingRow.find(".row-scientificCode").val(),
        );
        $("#scientificCodeAbsenceReason")
            .val(
                currentEditingRow
                    .find(".row-scientificCodeAbsenceReason")
                    .val(),
            )
            .trigger("change");
        $("#strength").val(currentEditingRow.find(".row-strength").val());
        $("#selectionReason")
            .val(currentEditingRow.find(".row-selectionReason").val())
            .trigger("change");
        $("#pharmacistSubsitute")
            .val(currentEditingRow.find(".row-pharmacistSubsitute").val())
            .trigger("change");
        $("#medicineStartDate")
            .val(currentEditingRow.find(".medicineStartDate").val())
            .trigger("change");
        $("#discontinueDate")
            .val(currentEditingRow.find(".discontinueDate").val())
            .trigger("change");
        $("#txtDuration").val(currentEditingRow.find(".row-txtDuration").val());
        $("#slcDurationUnit")
            .val(currentEditingRow.find(".row-slcDurationUnit").val())
            .trigger("change");
        $("#frequency").val(
            currentEditingRow.find(".row-frequency").val() ||
                currentEditingRow.find(".medication-frequency").val(),
        );
        $("#txtPeriod").val(currentEditingRow.find(".row-txtPeriod").val());
        $("#slcPeriodUnit")
            .val(currentEditingRow.find(".row-slcPeriodUnit").val())
            .trigger("change");
        $("#txtDoseQuantity").val(
            currentEditingRow.find(".row-txtDoseQuantity").val() ||
                currentEditingRow.find(".medication-dosage").val(),
        );
        $("#slcDose")
            .val(currentEditingRow.find(".row-slcDose").val())
            .trigger("change");
        $("#slcRouteAdmin")
            .val(currentEditingRow.find(".row-slcRouteAdmin").val())
            .trigger("change");
        $("#timeInstruction")
            .val(currentEditingRow.find(".row-timeInstruction").val())
            .trigger("change");
        $("#refillCount").val(currentEditingRow.find(".row-refillCount").val());
        $("#dosageInstruction").val(
            currentEditingRow.find(".row-dosageInstruction").val(),
        );
        $("#patientInstruction").val(
            currentEditingRow.find(".row-patientInstruction").val(),
        );
        $("#additionalSupportingInfo").val(
            currentEditingRow.find(".row-additionalSupportingInfo").val(),
        );
        $("#medicine-details-modal").modal("show");
    });
    $("#save-medicine-details").on("click", function () {
        const medicineDetails = {
            clientId: $("#clientId").val(),
            reservationId: $("#reservation_id").val(),
            medicineId: $("#medicineId").val(),
            routeAdmin: $("#slcRouteAdmin").val(),
            scientificCode: $("#scientificCode").val(),
            scientificCodeAbsenceReason: $(
                "#scientificCodeAbsenceReason",
            ).val(),
            strength: $("#strength").val(),
            selectionReason: $("#selectionReason").val(),
            pharmacistSubsitute: $("#pharmacistSubsitute").val(),
            startDate: $("#medicineStartDate").val(),
            discontinueDate: $("#discontinueDate").val(),
            duration: $("#txtDuration").val(),
            durationUnit: $("#slcDurationUnit").val(),
            frequency: $("#frequency").val(),
            period: $("#txtPeriod").val(),
            periodUnit: $("#slcPeriodUnit").val(),
            dosage: $("#txtDoseQuantity").val(),
            doseUnit: $("#slcDose").val(),
            timeInstruction: $("#timeInstruction").val(),
            refillCount: $("#refillCount").val(),
            dosageInstruction: $("#dosageInstruction").val(),
            patientInstruction: $("#patientInstruction").val(),
            additionalSupportingInfo: $("#additionalSupportingInfo").val(),
        };
        if (currentEditingRow) {
            currentEditingRow
                .find(".row-scientificCode")
                .val(medicineDetails.scientificCode);
            currentEditingRow
                .find(".row-scientificCodeAbsenceReason")
                .val(medicineDetails.scientificCodeAbsenceReason);
            currentEditingRow
                .find(".row-strength")
                .val(medicineDetails.strength);
            currentEditingRow
                .find(".row-selectionReason")
                .val(medicineDetails.selectionReason);
            currentEditingRow
                .find(".row-pharmacistSubsitute")
                .val(medicineDetails.pharmacistSubsitute);
            currentEditingRow
                .find(".medicineStartDate")
                .val(medicineDetails.startDate);
            currentEditingRow
                .find(".discontinueDate")
                .val(medicineDetails.discontinueDate);
            currentEditingRow
                .find(".row-txtDuration")
                .val(medicineDetails.duration);
            currentEditingRow
                .find(".row-slcDurationUnit")
                .val(medicineDetails.durationUnit);
            currentEditingRow
                .find(".row-txtPeriod")
                .val(medicineDetails.period);
            currentEditingRow
                .find(".row-slcPeriodUnit")
                .val(medicineDetails.periodUnit);
            currentEditingRow
                .find(".row-txtDoseQuantity")
                .val(medicineDetails.dosage);
            currentEditingRow
                .find(".row-slcDose")
                .val(medicineDetails.doseUnit);
            currentEditingRow
                .find(".row-slcRouteAdmin")
                .val(medicineDetails.routeAdmin);
            currentEditingRow
                .find(".row-timeInstruction")
                .val(medicineDetails.timeInstruction);
            currentEditingRow
                .find(".row-refillCount")
                .val(medicineDetails.refillCount);
            currentEditingRow
                .find(".row-dosageInstruction")
                .val(medicineDetails.dosageInstruction);
            currentEditingRow
                .find(".row-patientInstruction")
                .val(medicineDetails.patientInstruction);
            currentEditingRow
                .find(".row-additionalSupportingInfo")
                .val(medicineDetails.additionalSupportingInfo);
            currentEditingRow
                .find(".medication-dosage")
                .val(medicineDetails.dosage);
            currentEditingRow
                .find(".medication-frequency")
                .val(medicineDetails.frequency);
            togglePrescriptionPrintBtn();
            Swal.fire({
                icon: "success",
                text: "Medicine details Added successfully.",
                customClass: {
                    confirmButton: "btn btn-success waves-effect waves-light",
                },
                buttonsStyling: false,
            });
        }
        $("#medicine-details-modal").modal("hide");
        $(document).trigger("medicineSaved", [medicineDetails]);
    });
    $(document).on(
        "click",
        'input[name="group-a[0][is_reactionAlert][]"]',
        function () {
            $('input[name="group-a[0][is_reactionAlert][]"]')
                .not(this)
                .prop("checked", false);
        },
    );
    $(document).on(
        "click",
        'input[name="group-a[0][is_allergyAlert][]"]',
        function () {
            $('input[name="group-a[0][is_allergyAlert][]"]')
                .not(this)
                .prop("checked", false);
        },
    );
    $('input[name="is_allergyAlert"]').on("change", function () {
        $('input[name="is_allergyAlert"]').not(this).prop("checked", false);
    });
    $('input[name="is_allergyAlert"], input[name="is_reactionAlert"]').on(
        "change",
        function () {
            $('input[name="' + this.name + '"]')
                .not(this)
                .prop("checked", false);
        },
    );
    var counter = 1;
    $(".diagnosis-search")
        .wrap("<div style='width: 300px'></div>")
        .select2({
            placeholder: "Search Diagnosis aName",
            width: "100%",
            ajax: {
                url: BASE_URL + "/medicalrecords-get-diagnosis-search-options",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        diagnosisName: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data.data, function (value, key) {
                            return {
                                id: value.diagnosisListId,
                                text: value.diagnosisName_en,
                                code: value.diagnosisCode,
                            };
                        }),
                    };
                },
                cache: true,
            },
        });
    var counter = 1;
    $(".add-more-diagnosis").click(function () {
        var currentCount = $(".diagnosis-repeater").length;
        var newSeqOrder = currentCount + 1;
        var newDiagnosis = $(`
    <div class="diagnosis-repeater repeater-wrapper pt-0 pt-md-2">
        <div class="d-flex border rounded position-relative pe-0">
            <div class="row w-100 p-6">
                <div class="col-md-12">
                    <table class="table table-borderless" id="diagnosis-table-${newSeqOrder}">
                        <tbody>
                            <tr>
                                <td class="diagnosis-search-td-${newSeqOrder}">
                                    <div class="mb-6">
                                        <label class="form-label labe" for="diagnosis_search_${newSeqOrder}">Search</label>
                                        <select id="diagnosis_search_${newSeqOrder}" name="diagnosis_search[]" class="select2 form-select form-select-lg diagnosis-search" data-allow-clear="true">
                                        </select>
                                        <span class="text-danger error-text diagnosis_search_error"></span>
                                    </div>
                                </td>
                                <td class="seq-order-td-${newSeqOrder}" style="width: 10%"> 
                                    <div class="mb-6">
                                        <label class="form-label labez" for="seq_order_${newSeqOrder}">Seq. Order</label>
                                        <input type="text" id="seq_order_${newSeqOrder}" name="seq_order[]" class="form-control expiry-date-mask" placeholder="" value="${newSeqOrder}" readonly>
                                    </div>
                                        <input type="hidden" name="diagnosis_id[]" class="form-control expiry-date-mask" placeholder="" value="">
                                        <span class="text-danger error-text seq_order_error_${newSeqOrder}"></span>
                                </td>
                                <td class="diagnosis-code-td-${newSeqOrder}" style="width: 13%">
                                    <div class="mb-6">
                                        <label class="form-label labez" for="diagnosis_code_${newSeqOrder}">Diagnosis Code</label>
                                        <input type="text" id="diagnosis_code_${newSeqOrder}" name="diagnosis_code[]" class="form-control expiry-date-mask" placeholder="">
                                    </div>
                                    <span class="text-danger error-text diagnosis_code_error_${newSeqOrder}"></span>
                                </td>
                                <td class="diagnosis-name-td-${newSeqOrder}" style="width: 20%;">
                                    <div class="mb-6">
                                        <label class="form-label labez" for="diagnosis_name_${newSeqOrder}">Diagnosis Name</label>
                                        <input type="text" id="diagnosis_name_${newSeqOrder}" name="diagnosis_name[]" class="form-control expiry-date-mask" placeholder="">
                                        </div>
                                        <span class="text-danger error-text diagnosis_name_error_${newSeqOrder}"></span>
                                </td>
                                <td class="condition-onset-td-${newSeqOrder}">
                                    <div class="mb-6">
                                        <label class="form-label labez" for="condition_onset_${newSeqOrder}">Condition Onsetxxxsssss</label>
                                        <select id="condition_onset_${newSeqOrder}" name="condition_onset_id[]" class="select2 w-100" data-style="btn-default" data-live-search="true">
                                                <option value=""> Select Condition Onset</option>
                                                <option value="COEA">
                                                    Condition with onset during the episode of admitted patient care
                                                </option>
                                                <option value="CNNA">
                                                    Condition not noted as arising during the episode of admitted patient care
                                                </option>
                                                <option value="NR">
                                                    Not reported
                                                </option>
                                            </select>
                                    </div>
                                    <span class="text-danger error-text condition_onset_id_error_${newSeqOrder}"></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="d-flex flex-column align-items-center justify-content-between border-start p-2">
                <i class="ti ti-x ti-lg cursor-pointer" data-repeater-delete=""></i>
            </div>
        </div>
    </div>
    `);
        newDiagnosis.insertAfter($(".diagnosis-repeater").last());
        newDiagnosis.find(`#diagnosis_search_${newSeqOrder}`).select2({
            placeholder: "Select an option",
            allowClear: true,
            ajax: {
                url: BASE_URL + "/medicalrecords-get-diagnosis-search-options",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        diagnosisName: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data.data, function (value, key) {
                            return {
                                id: value.diagnosisListId,
                                text: value.diagnosisName_en,
                                code: value.diagnosisCode,
                            };
                        }),
                    };
                },
                cache: true,
            },
        });
        $(`#condition_onset_${newSeqOrder}`).select2({
            placeholder: "Selection",
            allowClear: true,
        });
    });
    $(document).on("click", "[data-repeater-delete]", function () {
        $(this).closest(".diagnosis-repeater").remove();
        updateSequenceOrder();
    });
    function updateSequenceOrder() {
        $(".diagnosis-repeater").each(function (index) {
            $(this)
                .find('input[id^="seq_order_"]')
                .val(index + 1);
            var newSeqOrder = index + 1;
            $(this).find("table").attr("id", `diagnosis-table-${newSeqOrder}`);
            $(this)
                .find("select")
                .attr("id", `diagnosis_search_${newSeqOrder}`);
            $(this)
                .find('input[id^="seq_order_"]')
                .attr("id", `seq_order_${newSeqOrder}`);
            $(this)
                .find('input[id^="diagnosis_code_"]')
                .attr("id", `diagnosis_code_${newSeqOrder}`);
            $(this)
                .find('input[id^="diagnosis_name_"]')
                .attr("id", `diagnosis_name_${newSeqOrder}`);
        });
    }
    $(document).on("select2:select", ".diagnosis-search", function (e) {
        var selectedData = e.params.data;
        var $row = $(this).closest("tr");
        $row.find('input[name^="diagnosis_id"]').val(selectedData.id); // Fill Diagnosis Code with the selected code
        $row.find('input[id^="diagnosis_code_"]').val(selectedData.code); // Fill Diagnosis Code with the selected code
        $row.find('input[id^="diagnosis_name_"]').val(selectedData.text); // Fill Diagnosis Name with the selected name
        setTimeout(function () {
            updateDiagnosisReport();
        }, 100);
    });
    function calculateBMI(weight, height) {
        height = height / 100;
        let bmi = (weight / (height * height)).toFixed(2);
        return bmi;
    }
    function getBMIGrade(bmi) {
        if (bmi < 16) {
            return "Severe Thinness";
        } else if (bmi >= 16 && bmi < 17) {
            return "Moderate Thinness";
        } else if (bmi >= 17 && bmi < 18.5) {
            return "Mild Thinness";
        } else if (bmi >= 18.5 && bmi < 25) {
            return "Normal";
        } else if (bmi >= 25 && bmi < 30) {
            return "Overweight";
        } else if (bmi >= 30 && bmi < 35) {
            return "Obese Class I";
        } else if (bmi >= 35 && bmi < 40) {
            return "Obese Class II";
        } else {
            return "Obese Class III";
        }
    }
    $("#weight, #height").on("input", function () {
        let weight = parseFloat($("#weight").val());
        let height = parseFloat($("#height").val());
        if (weight && height) {
            let bmi = calculateBMI(weight, height);
            $("#bmi").val(bmi);
            let bmiGrade = getBMIGrade(bmi);
            $(".bmi-message").text(bmiGrade);
        } else {
            $("#bmi").val("");
            $(".bmi-message").text + "";
        }
    });
    $(".yes-checkbox").on("change", function () {
        var checkboxId = $(this).attr("id").replace("yesCheckbox", "");
        var textareaContainer = $("#textareaContainer" + checkboxId);
        if ($(this).is(":checked")) {
            textareaContainer.show();
        } else {
            textareaContainer.hide();
        }
    });
    $("#vital_sign_form").on("input", function () {
        $("#temp_span").text($("#temperature").val());
        $("#height_span").text($("#height").val());
        $("#weight_span").text($("#weight").val());
        $("#bmi_span").text($("#bmi").val());
        $("#blood_pressure_span").text($("#blood_pressure").val());
        $("#pulse_span").text($("#pulse").val());
        $("#respiratory_rate_span").text($("#respiratory_rate").val());
        $("#pain_scale_span").text($("#pain_scale").val());
        $("#oxygen_saturation_span").text($("#oxygen_saturation").val());
        $("#last_menstruation_period_span").text(
            $("#last_menstruation_period").val(),
        );
        console.log($("#birth_weight").val());
        $("#birth_weight_span").text($("#birth_weight").val());
        $("#systolic_blood_pressure_span").text(
            $("#systolic_blood_pressure").val(),
        );
        $("#diastolic_blood_pressure_span").text(
            $("#diastolic_blood_pressure").val(),
        );
        $("#heartRhythm_span").text($("#heartRhythm").val());
    });
    $(document).on(
        "input change",
        "#height, #weight, #bmi, #temperature, #blood_pressure, #pulse, #respiratory_rate, #pain_scale, #oxygen_saturation, #last_menstruation_period, #birth_weight, #systolic_blood_pressure, #diastolic_blood_pressure, #heartRhythm",
        function () {
            var vitalsText =
                "Pulse - " +
                ($("#pulse").val() || "") +
                " | BP - " +
                ($("#blood_pressure").val() || "") +
                " | Temperature - " +
                ($("#temperature").val() || "") +
                " | Respiratory Rate - " +
                ($("#respiratory_rate").val() || "") +
                " | Pain Scale - " +
                ($("#pain_scale").val() || "") +
                " | Height - " +
                ($("#height").val() || "") +
                " | Weight - " +
                ($("#weight").val() || "") +
                // " | Body Mass Index - " +
                ($("#bmi").val() || "") +
                " | BMI Status - " +
                ($("#bmi").val() || "");
            $("#vitals").text(vitalsText);
        },
    );
    $(document).on("input", "#chief_complaints", function () {
        $("#complaints_of").text($(this).val());
        $("#complaints_and_duration_span").text(
            $(this).val() +
                " " +
                ($("#Duration").val() || "") +
                " " +
                ($("#Duration_type").val() || ""),
        );
    });
    $(document).on("input change", "#Duration, #Duration_type", function () {
        $("#complaints_and_duration_span").text(
            ($("#chief_complaints").val() || "") +
                " " +
                ($("#Duration").val() || "") +
                " " +
                ($("#Duration_type").val() || ""),
        );
    });
    $(document).on("input", "#significant_sign", function () {
        $("#significant_signs").text($(this).val());
    });
    $(document).on("input", "#past_history", function () {
        $("#past_history_report").text($(this).val());
    });
    $(document).on("input", "#history_of_present_illness", function () {
        $("#history_of_present_illness_report").text($(this).val());
    });
    $(document).on("input", "#examination", function () {
        $("#examination_report").text($(this).val());
    });
    $(document).on("input", "#investigations", function () {
        $("#investigations_report").text($(this).val());
    });
    $(document).on("input", "#treatment_plan", function () {
        $("#treatment_given").text($(this).val());
        $("#treatment_plan_sick_leave").text($(this).val());
    });
    $("#insuranceServiceId").select2({
        ajax: {
            url: function () {
                return BASE_URL + "/get-insurance-payer-linked-services";
            },
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    serviceCodeOrName: params.term,
                    clientId: $("#client_id").val(),
                };
            },
            processResults: function (data) {
                return {
                    results: data.data,
                };
            },
            cache: true,
        },
    });
    if ($("#serviceId").data("select2")) {
        $("#serviceId").select2("destroy");
    }
    $("#serviceId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#serviceId").parent(),
            width: "100%",
            placeholder: "Search Service",
            allowClear: true,
            minimumInputLength: 2,
            ajax: {
                url: BASE_URL + "/search-service",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        query: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data,
                    };
                },
                cache: true,
            },
        });
    $("#surgery_serviceId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#surgery_serviceId").parent(),
            width: "100%",
            placeholder: "Search Service",
            allowClear: true,
            minimumInputLength: 2,
            ajax: {
                url: BASE_URL + "/search-service",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        query: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data,
                    };
                },
                cache: true,
            },
        });
    $(document).on("click", "#view_past_medical_history_btn", function () {
        $("#offcanvasAddUser").show();
    });
    $("#medical_record_btn").click(function () {
        if (!validateDiagnosisPrincipal()) return;
        Swal.fire({
            title: "Are you sure?",
            text: "You want to submit the medical record?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes!",
            cancelButtonText: "Cancel",
            customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton:
                    "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.value) {
                $("#loader-overlay").show();
                $(this).prop("disabled", true);
                var vitalsignFormData = $("#vital_sign_form").serialize();
                var allergyFormData = $("#allergy_form").serialize();
                var toothPickerFormData = $("#teeth_data").serialize();
                var rightEyeFormData = $("#right_eye").serialize();
                var leftEyeFormData = $("#left_eye").serialize();
                var consultationFormData = $("#consultation_form").serialize();
                var diagnosisFormData = $("#diagnosis_form").serialize();
                var serviceOrderFormData = $("#service_order_form").serialize();
                var surgeryOrderFormData = $("#surgery_order_form").serialize();
                var prescriptionFormData = $("#prescription_form").serialize();
                var screeningFormData = $("#screening_form").serialize();
                var dentalTreatmentFormData = $(
                    "#dental_treatment_form",
                ).serialize();
                var positiveScreeningFindingsCarePlanFormData = $(
                    "#positive_screening_findings_care_plan_form",
                ).serialize();
                var interdisciplinaryPatientFormData = $(
                    "#interdisciplinary_patient_form",
                ).serialize();
                var transferPatientFormData = $(
                    "#transfer_patient_form",
                ).serialize();
                var ecgReportFormData = $("#ecg_report_form").serialize();
                var hiddenvalueFormData = $("#hidden_value_form").serialize();
                var patientHistoryFormData = $(
                    "#patient_history_form",
                ).serialize();
                var lensdetailsFormData = $("#lens-details").serialize();
                var insuranceServiceFormData = $(
                    "#insurance_service_form",
                ).serialize();
                var combinedData =
                    vitalsignFormData +
                    "&" +
                    allergyFormData +
                    "&" +
                    toothPickerFormData +
                    "&" +
                    rightEyeFormData +
                    "&" +
                    leftEyeFormData +
                    "&" +
                    consultationFormData +
                    "&" +
                    diagnosisFormData +
                    "&" +
                    serviceOrderFormData +
                    "&" +
                    surgeryOrderFormData +
                    "&" +
                    prescriptionFormData +
                    "&" +
                    screeningFormData +
                    "&" +
                    positiveScreeningFindingsCarePlanFormData +
                    "&" +
                    transferPatientFormData +
                    "&" +
                    hiddenvalueFormData +
                    "&" +
                    patientHistoryFormData +
                    "&" +
                    lensdetailsFormData +
                    "&" +
                    dentalTreatmentFormData +
                    "&" +
                    ecgReportFormData +
                    "&" +
                    insuranceServiceFormData;
                var ajaxUrl = BASE_URL + "/medicalrecords";
                var method = "POST";
                var reservationId = $("#reservation_id").val();
                $.ajax({
                    url: ajaxUrl,
                    type: method,
                    data: combinedData,
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
                                $.ajax({
                                    url: "/dispatch-ucaf-job",
                                    type: "POST",
                                    data: { reservationId: reservationId },
                                    success: function (data) {
                                        location.reload();
                                    },
                                    error: function (xhr, status, error) {
                                        console.error(
                                            "Job error:",
                                            xhr.responseText,
                                        );
                                        location.reload();
                                    },
                                });
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        $("#loader-overlay").hide();
                        if (xhr.status === 422) {
                            var errors = xhr.responseJSON.errors;
                            $(".error-text").text("");
                            $.each(errors, function (key, value) {
                                var parts = key.split(".");
                                var field = parts[0];
                                var index = parts[1];
                                if (typeof index !== "undefined") {
                                    var mappedIndex;
                                    if (index == 0) {
                                        mappedIndex = 0;
                                    } else {
                                        mappedIndex = parseInt(index) + 1;
                                    }
                                    var selector =
                                        "." + field + "_error_" + mappedIndex;

                                    if ($(selector).length) {
                                        $(selector).text(value[0]);
                                    } else {
                                        console.warn(
                                            "Indexed error span not found for:",
                                            selector,
                                        );
                                    }
                                } else {
                                    var generalSelector =
                                        "." + field + "_error";
                                    if ($(generalSelector).length) {
                                        $(generalSelector).text(value[0]);
                                    } else {
                                        console.warn(
                                            "General error span not found for:",
                                            generalSelector,
                                        );
                                    }
                                }
                            });
                        }
                    },
                });
            }
        });
    });
    $("#update_medical_record_btn").click(function () {
        if (!validateDiagnosisPrincipal()) return;
        let $btn = $(this);
        $("#loader-overlay").show();
        $btn.prop("disabled", true);
        var vitalsignFormData = $("#vital_sign_form").serialize();
        var allergyFormData = $("#allergy_form").serialize();
        var toothPickerFormData = $("#teeth_data").serialize();
        var rightEyeFormData = $("#right_eye").serialize();
        var leftEyeFormData = $("#left_eye").serialize();
        var consultationFormData = $("#consultation_form").serialize();
        var diagnosisFormData = $("#diagnosis_form").serialize();
        var serviceOrderFormData = $("#service_order_form").serialize();
        var surgeryOrderFormData = $("#surgery_order_form").serialize();
        var prescriptionFormData = $("#prescription_form").serialize();
        var screeningFormData = $("#screening_form").serialize();
        var dentalTreatmentFormData = $("#dental_treatment_form").serialize();
        var positiveScreeningFindingsCarePlanFormData = $(
            "#positive_screening_findings_care_plan_form",
        ).serialize();
        var interdisciplinaryPatientFormData = $(
            "#interdisciplinary_patient_form",
        ).serialize();
        var transferPatientFormData = $("#transfer_patient_form").serialize();
        var hiddenvalueFormData = $("#hidden_value_form").serialize();
        var patientHistoryFormData = $("#patient_history_form").serialize();
        var patientHistoryFormData = $("#patient_history_form").serialize();
        var lensdetailsFormData = $("#lens-details").serialize();
        var ecgReportFormData = $("#ecg_report_form").serialize();
        var insuranceServiceFormData = $("#insurance_service_form").serialize();
        var combinedData =
            vitalsignFormData +
            "&" +
            allergyFormData +
            "&" +
            toothPickerFormData +
            "&" +
            rightEyeFormData +
            "&" +
            leftEyeFormData +
            "&" +
            consultationFormData +
            "&" +
            diagnosisFormData +
            "&" +
            serviceOrderFormData +
            "&" +
            surgeryOrderFormData +
            "&" +
            prescriptionFormData +
            "&" +
            screeningFormData +
            "&" +
            positiveScreeningFindingsCarePlanFormData +
            "&" +
            transferPatientFormData +
            "&" +
            hiddenvalueFormData +
            "&" +
            patientHistoryFormData +
            "&" +
            lensdetailsFormData +
            "&" +
            dentalTreatmentFormData +
            "&" +
            ecgReportFormData +
            "&" +
            insuranceServiceFormData;
        Object.keys(removedTeeth).forEach((toothNumber) => {
            combinedData += `&removed_teeth[]=${toothNumber}`;
        });
        var ajaxUrl =
            BASE_URL +
            "/update-medicalrecords/" +
            $("#reservation_client_details_id").val();
        var method = "PUT";
        var reservationId = $("#reservation_id").val();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: combinedData,
            success: function (response) {
                $("#loader-overlay").hide();
                $btn.prop("disabled", false);
                if (response.status === true) {
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    }).then(function () {
                        $.ajax({
                            url: "/dispatch-ucaf-job",
                            type: "POST",
                            data: { reservationId: reservationId },
                            success: function (data) {
                                location.reload();
                            },
                            error: function () {
                                location.reload();
                            },
                        });
                    });
                } else {
                    Swal.fire({
                        icon: "warning",
                        text:
                            response.message ||
                            "Update failed. Please check input.",
                    });
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                $btn.prop("disabled", false);
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");

                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: "Something went wrong. Please try again.",
                    });
                }
            },
        });
    });
    $(".medications-search")
        .wrap('<div class="position-relative"></div>') //asif
        .select2({
            dropdownParent: $(".medications-search").parent(),
            placeholder: "Search Medicine",
            width: "100%",
            ajax: {
                url:
                    BASE_URL + "/medicalrecords-get-medications-search-options",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        medicationName: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data.data, function (value, key) {
                            return {
                                id: value.medicineId,
                                text: value.tradeName,
                            };
                        }),
                    };
                },
                cache: true,
            },
        });

    $(document).on("click", "#medical_report_save", function (e) {
        e.preventDefault();
        var clientId = $("#clientId").val();
        var reservationId = $("#reservationId").val();
        let reportContent = $("#medical-report-a4").html();
        let formData = new FormData();
        formData.append("clientId", clientId);
        formData.append("reservationId", reservationId);
        formData.append("report_content", reportContent);
        $.ajax({
            url: BASE_URL + "/save-medical-report",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: "error",
                    text: "failed",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });
    $(document).on("click", "#medical_report_print", function (e) {
        e.preventDefault();
        var clientId = $("#clientId").val();
        var reservationId = $("#reservationId").val();
        if (reservationId) {
            window.open(
                BASE_URL + "/print-medical-report/" + reservationId,
                "_blank",
            );
        } else {
            alert("Reservation ID is missing!");
        }
    });
    $(document).on("click", "#sick_leave_save", function (e) {
        e.preventDefault();
        var clientId = $("#clientId").val();
        var reservationId = $("#reservationId").val();
        let reportContent = $("#sick-leave-a4").html();
        let formData = new FormData();
        formData.append("clientId", clientId);
        formData.append("reservationId", reservationId);
        formData.append("report_content", reportContent);
        $.ajax({
            url: BASE_URL + "/save-sick-leave",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: "error",
                    text: "failed",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });
    $(document).on("click", "#sick_leave_print", function (e) {
        e.preventDefault();
        var clientId = $("#clientId").val();
        var reservationId = $("#reservationId").val();
        if (reservationId) {
            window.open(
                BASE_URL + "/print-sick-leave/" + reservationId,
                "_blank",
            );
        } else {
            alert("Reservation ID is missing!");
        }
    });
    $("#medical_report_pdf_btn").click(function () {
        $("#medical-report-content").show();
        $("#sick-leave-div").hide();
    });
    $("#sick_leave_pdf_btn").click(function () {
        $("#sick-leave-div").show();
        $("#medical-report-content").hide();
    });
    $(".add-more-medications").on("click", function () {
        let newRow = `
            <tr>
                        <td><select id="medications_search_${rowIndex}" name="medications_search[]" class="select2 form-select form-select-lg medications-search" data-allow-clear="true">
                                                <!-- Options here -->
                                            </select></td>
                        <td><input type="text" name="medication_start_date[]" class="form-control medicineStartDate"></td>                    
                        <td><input type="text" name="medication_discontinue_date[]" class="form-control discontinueDate"></td>
                        <td><input type="text" name="medication_dosage[]" class="form-control medication-dosage"></td>
                        <td><input type="text" name="medication_frequency[]" class="form-control medication-frequency"></td>
                        <td><select id="medication_allergy_${rowIndex}" name="medication_allergy[]" class="select2 w-100">
                                                <option selected> </option>
                                                <option value="1">Yes</option>
                                                <option value="0">No</option>
                                            </select></td>
                                              <td>
                                                  <div class="d-flex">
                                                    <button 
                                                        type="button" 
                                                        class="btn rounded-pill btn-icon btn-label-primary view-medicine-btn me-2" 
                                                        id="view-medicine-btn"
                                                        data-medicine-id=""
                                                        style="display: none  !important;">
                                                         <i class="ti ti-eye"></i>
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        class="btn rounded-pill btn-icon btn-label-primary remove-medicine" 
                                                        id="remove-medicine"
                                                        data-medicine-id=""
                                                        style="display: none  !important;">
                                                         <i class="ti ti-trash"></i>
                                                    </button>
                                                  </div>
                                                  <!-- Hidden details from modal -->
                                                  <input type="hidden" name="medication_scientificCode[]" class="row-scientificCode">
                                                  <input type="hidden" name="medication_scientificCodeAbsenceReason[]" class="row-scientificCodeAbsenceReason">
                                                  <input type="hidden" name="medication_strength[]" class="row-strength">
                                                  <input type="hidden" name="medication_selectionReason[]" class="row-selectionReason">
                                                  <input type="hidden" name="medication_pharmacistSubsitute[]" class="row-pharmacistSubsitute">
                                                  <input type="hidden" name="medication_duration[]" class="row-txtDuration">
                                                  <input type="hidden" name="medication_durationUnit[]" class="row-slcDurationUnit">
                                                  <input type="hidden" name="medication_period[]" class="row-txtPeriod">
                                                  <input type="hidden" name="medication_periodUnit[]" class="row-slcPeriodUnit">
                                                  <input type="hidden" name="medication_doseUnit[]" class="row-txtDoseQuantity">
                                                  <input type="hidden" name="medication_selectDoseUnit[]" class="row-slcDose">
                                                  <input type="hidden" name="medication_routeAdmin[]" class="row-slcRouteAdmin">
                                                  <input type="hidden" name="medication_timeInstruction[]" class="row-timeInstruction">
                                                  <input type="hidden" name="medication_refillCount[]" class="row-refillCount">
                                                  <input type="hidden" name="medication_dosageInstruction[]" class="row-dosageInstruction">
                                                  <input type="hidden" name="medication_patientInstruction[]" class="row-patientInstruction">
                                                  <input type="hidden" name="medication_additionalSupportingInfo[]" class="row-additionalSupportingInfo">
                                        </td>
                    </tr>
        `;
        $("#medication_tbody_div").append(newRow);
        initializeSelect2($(`#medications_search_${rowIndex}`));
        let allergySelect = $(`#medication_allergy_${rowIndex}`);
        allergySelect.select2({
            width: "100%",
            dropdownParent: $("body"),
        });
        flatpickr(".medicineStartDate", {
            dateFormat: "Y-m-d",
            allowInput: true,
        });
        flatpickr(".discontinueDate", {
            dateFormat: "Y-m-d",
            allowInput: true,
        });
        rowIndex++;
    });
    $(document).on("select2:select", ".medications-search", function (e) {
        let selectedId = e.params.data.id;
        let $row = $(this).closest("tr");
        let $eyeBtn = $row.find(".view-medicine-btn");
        let $mDremovebtn = $row.find(".remove-medicine");
        $eyeBtn.attr("data-medicine-id", selectedId);
        $mDremovebtn.attr("data-medicine-id", selectedId);
        $eyeBtn.show();
        $mDremovebtn.show();
        togglePrescriptionPrintBtn();
    });
    const table = $("#bmi-history-table").DataTable({
        processing: true,
        serverSide: false,
        ajax: {
            url: "/medicalrecords-get-bmi-report",
            type: "GET",
            dataSrc: "data",
        },
        columns: [
            {
                data: "bmi",
                className: "text-center",
                render: function (data, type, full, meta) {
                    return data;
                },
            },
            {
                data: "height",
                className: "text-center",
                render: function (data, type, full, meta) {
                    return data;
                },
            },
            {
                data: "weight",
                className: "text-center",
                render: function (data, type, full, meta) {
                    return data;
                },
            },
            {
                data: "createdDateTime",
                className: "text-center",
                render: function (data, type, full, meta) {
                    return data;
                },
            },
        ],
    });

    $(document).on("change", 'input[name="past_medical_history"]', function () {
        if ($(this).attr("id") === "inlineCheckbox1") {
            $("#inlineCheckbox2").prop("checked", false);
        } else if ($(this).attr("id") === "inlineCheckbox2") {
            $("#inlineCheckbox1").prop("checked", false);
        }
    });

    $(document).on(
        "change",
        'input[name="family_history_investigations"]',
        function () {
            if ($(this).attr("id") === "family_history_investigations1") {
                $("#family_history_investigations2").prop("checked", false);
            } else if (
                $(this).attr("id") === "family_history_investigations2"
            ) {
                $("#family_history_investigations1").prop("checked", false);
            }
        },
    );
    togglePrescriptionPrintBtn();
});

function initialPageLoad(reservationClientDetailsId, reservationId, clientId) {
    $.ajax({
        url: BASE_URL + "/edit-medicalrecords/" + reservationClientDetailsId,
        type: "GET",
        success: function (response) {
            if (response.status === true) {
                if (response.data.insurance_service.length > 0) {
                    $("#insurance_service_sum_of_net_amount").val(
                        response.data.insurance_service[0].netAmount,
                    );
                    $("#insurance_service_net_amount_td").text(
                        " " + response.data.insurance_service[0].netAmount,
                    );

                    $("#insurance_total_sum_td").text(
                        " " + response.data.insurance_service[0].totalAmount,
                    );
                    $("#insurance_total_sum").val(
                        response.data.insurance_service[0].totalAmount,
                    );
                    $("#insurance_service_deduction_sum_td").text(
                        " " + response.data.insurance_service[0].totalDisAmount,
                    );
                    $("#insurance_service_deduction_sum").val(
                        response.data.insurance_service[0].totalDisAmount,
                    );
                    $("#insurance_service_vat_sum_td").text(
                        " " + response.data.insurance_service[0].totalTaxAmount,
                    );
                    $("#insurance_service_total_vat_sum").val(
                        response.data.insurance_service[0].totalTaxAmount,
                    );
                }
                var vitalSign = response.data.vital_sign_data;
                var diagnosisList = response.data.diagnoses_list_data;
                var reservationDetails = response.data.reservation_details;
                var serviceOrderData = response.data.service_data;
                var surgeryOrderData = response.data.surgery_data;
                var medicationData = response.data.medication_data;
                var toothData = response.data.tooth_data;
                var eyeData = response.data.eye_data;
                var dentalTreatment = response.data.dentalTreatment;
                var ecgFilePath = response.data.ecg_report_file;
                ecgFilePath.forEach((file) => {
                    if (file.is_delete === 0) {
                        appendEcgFile(
                            file.fileNamePath,
                            file.fileName,
                            file.mediafilesId,
                        );
                    }
                });
                var vitalsText = `Pulse - ${reservationDetails.pulse} | BP - ${reservationDetails.BP} | Temperature - ${reservationDetails.temperature} | Respiratory Rate - ${reservationDetails.respiratoryRate} | SpO2 - ${reservationDetails.spo2} | Pain Scale - ${reservationDetails.painScale || ''} | Height - ${vitalSign.height} | Weight - ${vitalSign.weight} | Body Mass Index - ${vitalSign.bmi} | BMI Status - ${vitalSign.bmi}`;
                $("#past_history_report").text(
                    reservationDetails.PMH_pastMedicalHistory,
                );
                $("#measurable_goals")
                    .val(reservationDetails.measurableGoalsId)
                    .trigger("change");

                let medication_Data = medicationData
                    .map((item) => item.medicine.scientificName)
                    .join(", ");
                console.log(medicationData);
                $("#treatment_given_sick_leave").text(medication_Data);
                $("#significant_signs").text(
                    reservationDetails.significantSign,
                );
                var diagnoses = response.data.diagnoses_list_data
                    .map((d) => d.diagnosisCode + " - " + d.diagnosisName_en)
                    .join(", ");
                $("#medical-report-a4 #diagnosis").text(diagnoses);
                setTimeout(function () {
                    syncDiagnosisFromTable();
                }, 500);
                $("#sick-leave-a4 #diagnosis_sick_leave").text(diagnoses);
                $("#investigations_report").text(
                    reservationDetails.investigations,
                );
                $("#history_of_present_illness_report").text(
                    reservationDetails.historyOfPresentIllness,
                );
                $("#patient_history").val(reservationDetails.patientHistory);
                $("#physical_examination").val(
                    reservationDetails.physicalExamination,
                );
                $("#investigations").val(reservationDetails.investigations);
                $("#history_of_present_illness").val(
                    reservationDetails.historyOfPresentIllness,
                );
                $("#examination_report").text(
                    reservationDetails.examinationAndInspection,
                );
                $("#vitals").text(vitalsText);
                $("#complaints_of").text(reservationDetails.chiefComplaints);
                $("#complaints_and_duration_span").text(
                    reservationDetails.chiefComplaints +
                        " " +
                        reservationDetails.durationOfTheComplaint +
                        " " +
                        reservationDetails.durationOfTheComplaintType,
                );
                $("#height").val(vitalSign.height);
                $("#height_span").text(vitalSign.height);
                $("#weight").val(vitalSign.weight);
                $("#weight_span").text(vitalSign.weight);
                $("#bmi").val(vitalSign.bmi);
                $("#bmi_span").text(vitalSign.bmi);
                $("#temperature").val(reservationDetails.temperature);
                $("#temp_span").text(reservationDetails.temperature);
                console.log(reservationDetails);
                $("#blood_pressure").val(reservationDetails.BP);
                $("#blood_pressure_span").text(reservationDetails.BP);
                $("#pulse").val(reservationDetails.pulse);
                $("#pulse_span").text(reservationDetails.pulse);
                $("#respiratory_rate").val(reservationDetails.respiratoryRate);
                $("#respiratory_rate_span").text(
                    reservationDetails.respiratoryRate,
                );
                $("#oxygen_saturation").val(
                    reservationDetails.oxygenSaturation,
                );
                $("#oxygen_saturation_span").text(
                    reservationDetails.oxygenSaturation,
                );
                $("#pain_scale").val(reservationDetails.painScale);
                $("#pain_scale_span").text(reservationDetails.painScale);
                $("#last_menstruation_period").val(
                    reservationDetails.lastMenstruationPeriod,
                );
                $("#last_menstruation_period_span").text(
                    reservationDetails.lastMenstruationPeriod,
                );
                console.log(reservationDetails.lastMenstruationPeriod);
                $("#birth_weight").val(reservationDetails.birthWeight);
                $("#birth_weight_span").text(reservationDetails.birthWeight);
                $("#systolic_blood_pressure").val(
                    reservationDetails.systolicBloodPressure,
                );
                $("#systolic_blood_pressure_span").text(
                    reservationDetails.systolicBloodPressure,
                );
                $("#diastolic_blood_pressure").val(
                    reservationDetails.diastolicBloodPressure,
                );
                $("#diastolic_blood_pressure_span").text(
                    reservationDetails.diastolicBloodPressure,
                );

                // Update UI buttons based on newly populated vital signs
                handleReservationUI($("#reservationStatus").val());

                $("#heartRhythm")
                    .val(reservationDetails.heartRhythmType)
                    .trigger("change");
                $("#heartRhythm_span").text(reservationDetails.heartRhythmType);
                $("#chief_complaints").val(reservationDetails.chiefComplaints);
                $("#significant_sign").val(reservationDetails.significantSign);
                $("#past_history").val(
                    reservationDetails.PMH_pastMedicalHistory,
                );
                $("#family_history").val(reservationDetails.FH_familyHistory);
                $("#outcomes_and_complication").val(
                    reservationDetails.outcomesAndComplication,
                );
                $("#biopsy").val(reservationDetails.biopsy);
                $("#examination").val(
                    reservationDetails.examinationAndInspection,
                );
                $("#treatment_plan").val(reservationDetails.treatmentPlan);
                $("#measurable_goals").val(
                    reservationDetails.measurableGoalsId,
                );
                $("#measurable_goal_details").val(
                    reservationDetails.measurablegoals,
                );
                $("#Duration_type")
                    .val(reservationDetails.durationOfTheComplaintType)
                    .trigger("change");
                $("#Duration").val(reservationDetails.durationOfTheComplaint);
                $("#Others_Conditions").val(reservationDetails.otherConditions);
                $("#Indicate_LMP").val(reservationDetails.indicate_LMP);
                $("#ecgReport").val(reservationDetails.ecgReport);
                if (
                    typeof reservationDetails !== "undefined" &&
                    reservationDetails.consultantAppropriateType
                ) {
                    let selectedTypes =
                        reservationDetails.consultantAppropriateType
                            .split(",")
                            .map((type) => type.trim());
                    selectedTypes.forEach((type) => {
                        let checkboxId =
                            "Consultation_" + type.replace(/\s+/g, "_");
                        let checkbox = document.getElementById(checkboxId);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                    });
                }
                toothData.forEach(function (tooth) {
                    var toothNumber = tooth.teethNo;
                    var toothDesc = tooth.note || "";
                    if (window.teethMap[toothNumber]) {
                        var toothElement = window.teethMap[toothNumber].path;
                        var toothTextElement =
                            window.teethMap[toothNumber].text;
                        toothElement.attr({
                            fill: "#28c76f",
                            cursor: "pointer",
                        });
                        toothTextElement.attr({
                            fill: "#28c76f",
                            "font-weight": "bold",
                        });
                        window.selectedTeeth[toothNumber] = true;
                        addTeethDetails(toothNumber);
                        var textArea = document.getElementById(
                            `tooth_${toothNumber}_desc`,
                        );
                        if (textArea) {
                            textArea.value = toothDesc;
                        }
                    }
                });
                function checkCheckboxes(fieldValue, checkboxes) {
                    if (!fieldValue) return;
                    let values = fieldValue.split(",");
                    values.forEach((value) => {
                        let checkbox = document.getElementById(
                            value.replace(/\s+/g, "_"),
                        );
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                    });
                }
                if (dentalTreatment) {
                    checkCheckboxes(dentalTreatment.appropriateType, [
                        "Regular_Dental_Treatment",
                        "Dental_Cleaning",
                    ]);
                    checkCheckboxes(dentalTreatment.TraumaTreatmentSpecify, [
                        "RTA",
                        "Work_Related",
                    ]);
                    document.getElementById("appropriate_How").value =
                        dentalTreatment.appropriateHow || "";
                    document.getElementById("appropriate_when").value =
                        dentalTreatment.appropriateWhen || "";
                    document.getElementById("appropriate_where").value =
                        dentalTreatment.appropriateWhere || "";
                    document.getElementById("other_treatment").value =
                        dentalTreatment.other || "";
                }
                if (eyeData && Array.isArray(eyeData)) {
                    eyeData.forEach((prescription) => {
                        if (prescription.type == "distance") {
                            if (prescription.right_SPH) {
                                $("#right_sph_distance")
                                    .val(prescription.right_SPH?.toString())
                                    .trigger("change");
                            }
                            if (prescription.right_CYL) {
                                $("#right_cyl_distance")
                                    .val(prescription.right_CYL?.toString())
                                    .trigger("change");
                            }
                            if (prescription.right_AXIS) {
                                $("#right_axis_distance")
                                    .val(prescription.right_AXIS?.toString())
                                    .trigger("change");
                            }
                            if (prescription.left_SPH) {
                                $("#left_sph_distance")
                                    .val(prescription.left_SPH?.toString())
                                    .trigger("change");
                            }
                            if (prescription.left_CYL) {
                                $("#left_cyl_distance")
                                    .val(prescription.left_CYL?.toString())
                                    .trigger("change");
                            }
                            if (prescription.left_AXIS) {
                                $("#left_axis_distance")
                                    .val(prescription.left_AXIS?.toString())
                                    .trigger("change");
                            }
                            if (prescription.right_PRISM) {
                                $("#right_prism_distance").val(
                                    prescription.right_PRISM,
                                );
                            }
                            if (prescription.right_V_N) {
                                $("#right_v_n_distance").val(
                                    prescription.right_V_N,
                                );
                            }
                            if (prescription.left_PRISM) {
                                $("#left_prism_distance").val(
                                    prescription.left_PRISM,
                                );
                            }
                            if (prescription.left_V_N) {
                                $("#left_v_n_distance").val(
                                    prescription.left_V_N,
                                );
                            }
                            if (prescription.left_PD) {
                                $("#left_pd_distance").val(
                                    prescription.left_PD,
                                );
                            }
                        } else if (prescription.type == "near") {
                            if (prescription.right_SPH) {
                                $("#right_sph_near")
                                    .val(prescription.right_SPH?.toString())
                                    .trigger("change");
                            }
                            if (prescription.right_CYL) {
                                $("#right_cyl_near")
                                    .val(prescription.right_CYL?.toString())
                                    .trigger("change");
                            }
                            if (prescription.right_AXIS) {
                                $("#right_axis_near")
                                    .val(prescription.right_AXIS?.toString())
                                    .trigger("change");
                            }
                            if (prescription.left_SPH) {
                                $("#left_sph_near")
                                    .val(prescription.left_SPH?.toString())
                                    .trigger("change");
                            }
                            if (prescription.left_CYL) {
                                $("#left_cyl_near")
                                    .val(prescription.left_CYL?.toString())
                                    .trigger("change");
                            }
                            if (prescription.left_AXIS) {
                                $("#left_axis_near")
                                    .val(prescription.left_AXIS?.toString())
                                    .trigger("change");
                            }
                            if (prescription.right_PRISM) {
                                $("#right_prism_near").val(
                                    prescription.right_PRISM,
                                );
                            }
                            if (prescription.right_V_N) {
                                $("#right_v_n_near").val(
                                    prescription.right_V_N,
                                );
                            }
                            if (prescription.left_PRISM) {
                                $("#left_prism_near").val(
                                    prescription.left_PRISM,
                                );
                            }
                            if (prescription.left_V_N) {
                                $("#left_v_n_near").val(prescription.left_V_N);
                            }
                            if (prescription.left_PD) {
                                $("#left_pd_near").val(prescription.left_PD);
                            }
                        }
                        function checkCheckboxes(name, values) {
                            let items = [];
                            if (Array.isArray(values)) {
                                items = values;
                            } else if (typeof values === "string") {
                                items = values
                                    .split(",")
                                    .map((item) => item.trim());
                            }
                            document
                                .querySelectorAll(`input[name='${name}[]']`)
                                .forEach((checkbox) => {
                                    checkbox.checked = items.includes(
                                        checkbox.value,
                                    );
                                });
                        }
                        checkCheckboxes(
                            "RegularLensesType",
                            prescription.regularLensesType,
                        );
                        checkCheckboxes(
                            "LensesSpecification",
                            prescription.lensesSpecification,
                        );
                        checkCheckboxes(
                            "ContactLensesType",
                            prescription.contactLensesType,
                        );
                        checkCheckboxes("Frames", prescription.Frames);
                        $('input[name="productType[]"]').prop("checked", false);
                        if (prescription.productType === "lens") {
                            $("#productTypeLens").prop("checked", true);
                        } else if (prescription.productType === "contact") {
                            $("#productTypeContact").prop("checked", true);
                        }
                    });
                }
                if (reservationDetails.PMH_is_pastMedicalHistory === 1) {
                    document.getElementById("inlineCheckbox2").checked = true;
                    $("#view_past_medical_history_div").show();
                    let PMH_pastMedicalHistoryType = JSON.parse(
                        reservationDetails.PMH_pastMedicalHistoryType,
                    );
                    $.each(PMH_pastMedicalHistoryType, function (key, value) {
                        let checkbox = $(`#ph_${key}_checkbox`);
                        if (checkbox.length) {
                            checkbox.prop("checked", true);
                        }
                        let inputField = $(`#ph_${key}`);
                        if (inputField.length) {
                            inputField.val(value);
                        }
                    });
                } else if (reservationDetails.PMH_is_pastMedicalHistory === 0) {
                    document.getElementById("inlineCheckbox1").checked = true;
                    $("#view_past_medical_history_div").hide();
                }
                if (
                    reservationDetails.FH_FamilyHistoryInvestigationsYesOrNo ===
                    1
                ) {
                    document.getElementById(
                        "family_history_investigations1",
                    ).checked = true;
                } else if (
                    reservationDetails.FH_FamilyHistoryInvestigationsYesOrNo ===
                    0
                ) {
                    document.getElementById(
                        "family_history_investigations2",
                    ).checked = true;
                }
                if (reservationDetails.ADFO_patientInPain === 1) {
                    document.getElementById("PainScreeningYes").checked = true;
                    $('input[name="PainScreeningYesTxt"]')
                        .closest(".painscore-div")
                        .show();
                    document.querySelector(
                        'input[name="PainScreeningYesTxt"]',
                    ).value = reservationDetails.ADFO_patientInPainYesText;
                } else {
                    $('input[name="PainScreeningYesTxt"]')
                        .closest(".painscore-div")
                        .show();
                    document.getElementById("PainScreeningNo").checked = true;
                }
                if (
                    reservationDetails.ADFO_fallRiskScreeningAssistiveDevice ===
                    1
                ) {
                    document.getElementById("FallRiskScreening2Yes").checked =
                        true;
                    document.getElementById("FallRiskScreening2o").checked =
                        false;
                } else {
                    document.getElementById("FallRiskScreening2o").checked =
                        true;
                    document.getElementById("FallRiskScreening2Yes").checked =
                        false;
                }
                if (
                    reservationDetails.ADFO_functionalNeedsScreeningDependentAndNeedsAssistance ===
                    1
                ) {
                    document.getElementById(
                        "functionalNeedsScreeningYes",
                    ).checked = true;
                    document.getElementById(
                        "functionalNeedsScreeningNo",
                    ).checked = false;

                    $('input[name="functionalNeedsScreeningYestxt"]')
                        .closest(".specify-div")
                        .show();
                    document.querySelector(
                        'input[name="functionalNeedsScreeningYestxt"]',
                    ).value =
                        reservationDetails.ADFO_functionalNeedsScreeningDependentAndNeedsAssistanceSpecify;
                } else {
                    document.getElementById(
                        "functionalNeedsScreeningNo",
                    ).checked = true;
                    document.getElementById(
                        "functionalNeedsScreeningYes",
                    ).checked = false;
                }
                if (reservationDetails.ADFO_socialNeedsScreeningUsed === 1) {
                    document.getElementById("dragUseYes").checked = true;
                    document.getElementById("dragUseNo").checked = false;
                    $("#dragUse").show();
                    if (
                        reservationDetails.ADFO_socialNeedsScreeningType ===
                        "alcohol"
                    ) {
                        document.getElementById("acoholordrugabuse").checked =
                            true;
                    } else if (
                        reservationDetails.ADFO_socialNeedsScreeningType ===
                        "smoker"
                    ) {
                        document.getElementById("smoker").checked = true;
                    } else if (
                        reservationDetails.ADFO_socialNeedsScreeningType ===
                        "loweconomic"
                    ) {
                        document.getElementById("loweconomicstatus").checked =
                            true;
                    } else if (
                        reservationDetails.ADFO_socialNeedsScreeningType ===
                        "other"
                    ) {
                        document.getElementById(
                            "SocialNeedsScreeningOther",
                        ).checked = true;
                    }
                } else {
                    document.getElementById("dragUseNo").checked = true;
                    document.getElementById("dragUseYes").checked = false;
                    $("#dragUse").hide();
                }
                if (reservationDetails.ADFO_patientInPain === 1) {
                    document.getElementById("PainScreeningYes").checked = true;
                    document.getElementById("PainScreeningNo").checked = false;
                } else {
                    document.getElementById("PainScreeningNo").checked = true;
                    document.getElementById("PainScreeningYes").checked = false;
                }
                if (reservationDetails.ADFO_physicianInformed === 1) {
                    document.getElementById("PhysicianinformedYes").checked =
                        true;
                    document.getElementById("PhysicianinformedNo").checked =
                        false;
                } else {
                    document.getElementById("PhysicianinformedNo").checked =
                        true;
                    document.getElementById("PhysicianinformedYes").checked =
                        false;
                }
                if (
                    reservationDetails.ADFO_fallRiskScreeningFallPreventionInterventions ===
                    1
                ) {
                    document.getElementById("FallRiskScreening3Yes").checked =
                        true;
                    document.getElementById("FallRiskScreening3NA").checked =
                        false;
                    $("#fallPrevention").show();

                    if (
                        reservationDetails.ADFO_allRiskScreeningFallPreventionInterventionsType ===
                        "escort"
                    ) {
                        document.getElementById(
                            "FallRiskScreeningYes3Escort",
                        ).checked = true;
                    } else if (
                        reservationDetails.ADFO_allRiskScreeningFallPreventionInterventionsType ===
                        "wheelchair"
                    ) {
                        document.getElementById(
                            "FallRiskScreeningYes3wheelchair",
                        ).checked = true;
                    } else if (
                        reservationDetails.ADFO_allRiskScreeningFallPreventionInterventionsType ===
                        "others"
                    ) {
                        document.getElementById(
                            "FallRiskScreeningYes3others",
                        ).checked = true;

                        $("#FallRiskScreeningYes3otherstxt").show();
                    }
                } else {
                    document.getElementById("FallRiskScreening3NA").checked =
                        true;
                    document.getElementById("FallRiskScreening3Yes").checked =
                        false;
                    $("#fallPrevention").hide();
                }
                if (
                    reservationDetails.ADFO_nutritionalNeedsScreeningPhysicianInformed ===
                    1
                ) {
                    document.getElementById(
                        "NutritionalNeedsScreening3Yes",
                    ).checked = true;
                    document.getElementById(
                        "NutritionalNeedsScreening3NA",
                    ).checked = false;
                } else {
                    document.getElementById(
                        "NutritionalNeedsScreening3NA",
                    ).checked = true;
                    document.getElementById(
                        "NutritionalNeedsScreening3Yes",
                    ).checked = false;
                }
                if (
                    reservationDetails.ADFO_socialNeedsScreeningPhysicianInformed ===
                    1
                ) {
                    document.getElementById(
                        "SocialNeedsScreening3Yes",
                    ).checked = true;
                    document.getElementById("SocialNeedsScreening3NA").checked =
                        false;
                } else {
                    document.getElementById("SocialNeedsScreening3NA").checked =
                        true;
                    document.getElementById(
                        "SocialNeedsScreening3Yes",
                    ).checked = false;
                }
                if (
                    reservationDetails.ADFO_nutritionalNeedsScreeningLoss === 1
                ) {
                    document.getElementById(
                        "NutritionalNeedsScreening2Yes",
                    ).checked = true;
                    document.getElementById(
                        "NutritionalNeedsScreening2No",
                    ).checked = false;
                } else {
                    document.getElementById(
                        "NutritionalNeedsScreening2No",
                    ).checked = true;
                    document.getElementById(
                        "NutritionalNeedsScreening2Yes",
                    ).checked = false;
                }
                if (reservationDetails.PSFCP_Onset === "acute") {
                    $("#PSFCP_Acute").prop("checked", true);
                    $("#PSFCP_onset_span").text(reservationDetails.PSFCP_Onset);
                } else if (reservationDetails.PSFCP_Onset === "subacute") {
                    $("#PSFCP_subacute").prop("checked", true);
                    $("#PSFCP_onset_span").text(reservationDetails.PSFCP_Onset);
                } else if (reservationDetails.PSFCP_Onset === "chronic") {
                    $("#PSFCP_chronic").prop("checked", true);
                    $("#PSFCP_onset_span").text(reservationDetails.PSFCP_Onset);
                }
                if (reservationDetails.PSFCP_Course === "stationery") {
                    $("#PSFCP_stationery").prop("checked", true);
                } else if (reservationDetails.PSFCP_Course === "progressive") {
                    $("#PSFCP_progressive").prop("checked", true);
                } else if (reservationDetails.PSFCP_Course === "intermittent") {
                    $("#PSFCP_intermittent").prop("checked", true);
                }
                if (reservationDetails.PSFCP_Nature === "dull") {
                    $("#PSFCP_dull").prop("checked", true);
                } else if (reservationDetails.PSFCP_Nature === "sharp") {
                    $("#PSFCP_sharp").prop("checked", true);
                } else if (reservationDetails.PSFCP_Nature === "stabbing") {
                    $("#PSFCP_stabbing").prop("checked", true);
                } else if (
                    reservationDetails.PSFCP_Nature === "burningThrobbing"
                ) {
                    $("#PSFCP_burningThrobbing").prop("checked", true);
                }
                $("#PSFCP_aggravatingFactors").val(
                    reservationDetails.PSFCP_aggravatingFactors,
                );
                $("#PSFCP_relivingFactors").val(
                    reservationDetails.PSFCP_relivingFactors,
                );
                $("#PSFCP_HEH_txt").val(reservationDetails.PSFCP_HEH_txt);
                $("#PSFCP_N_managementTXT").val(
                    reservationDetails.PSFCP_N_managementTXT,
                );
                $("#PSFCP_N_ExternalTxt").val(
                    reservationDetails.PSFCP_N_ExternalTxt,
                );
                $("#PSFCP_F_managementTxt").val(
                    reservationDetails.PSFCP_F_managementTxt,
                );
                $("#PSFCP_F_ExternalTxt").val(
                    reservationDetails.PSFCP_F_ExternalTxt,
                );
                $("#PSFCP_S_managementTXT").val(
                    reservationDetails.PSFCP_S_managementTXT,
                );
                $("#PSFCP_S_ExternalTxt").val(
                    reservationDetails.PSFCP_S_ExternalTxt,
                );
                if (reservationDetails.PSFCP_HEH === 1) {
                    $("#PSFCP_dietition_y_healthy").prop("checked", true);
                    $("#PSFCP_dietition_n_healthy").prop("checked", false);
                } else {
                    $("#PSFCP_dietition_n_healthy").prop("checked", true);
                    $("#PSFCP_dietition_y_healthy").prop("checked", false);
                }
                if (reservationDetails.PSFCP_PDWE === 1) {
                    $("#PSFCP_PDWE_y").prop("checked", true);
                    $("#PSFCP_PDWE_n").prop("checked", false);
                } else {
                    $("#PSFCP_PDWE_n").prop("checked", true);
                    $("#PSFCP_PDWE_y").prop("checked", false);
                }
                if (reservationDetails.PSFCP_therapeutic === 1) {
                    $("#PSFCP_therapeutic_y").prop("checked", true);
                    $("#PSFCP_therapeutic_n").prop("checked", false);
                } else {
                    $("#PSFCP_therapeutic_n").prop("checked", true);
                    $("#PSFCP_therapeutic_y").prop("checked", false);
                }
                $('input[name="PSFCP_S[]"]').prop("checked", false);
                let checkedValues = reservationDetails.PSFCP_S;
                if (checkedValues) {
                    if (checkedValues.includes("speech")) {
                        $("#PSFCP_S_speech").prop("checked", true);
                    }
                    if (checkedValues.includes("vision")) {
                        $("#PSFCP_S_Vision").prop("checked", true);
                    }
                    if (checkedValues.includes("hearing")) {
                        $("#PSFCP_S_Hearing").prop("checked", true);
                    }
                    if (checkedValues.includes("sensation")) {
                        $("#PSFCP_S_Sensation").prop("checked", true);
                    }
                    if (checkedValues.includes("reflexes")) {
                        $("#PSFCP_S_Reflexes").prop("checked", true);
                    }
                    if (checkedValues.includes("gate")) {
                        $("#PSFCP_S_Gate").prop("checked", true);
                    }
                    if (checkedValues.includes("mobility")) {
                        $("#PSFCP_S_Mobility").prop("checked", true);
                    }
                    if (checkedValues.includes("joints")) {
                        $("#PSFCP_S_Joints").prop("checked", true);
                    }
                    if (checkedValues.includes("muscle")) {
                        $("#PSFCP_S_Muscletone").prop("checked", true);
                    }
                    if (checkedValues.includes("range")) {
                        $("#PSFCP_S_Range").prop("checked", true);
                    }
                }
                $('input[name="PSFCP_F[]"]').prop("checked", false);
                if (reservationDetails.PSFCP_F) {
                    let checkedValue = reservationDetails.PSFCP_F.split(",");
                    if (checkedValue) {
                        if (checkedValue.includes("FinancialProblems")) {
                            $("#PSFCP_F_Financialproble").prop("checked", true);
                        }
                        if (checkedValue.includes("FamilyProblems")) {
                            $("#PSFCP_F_Familyproblems").prop("checked", true);
                        }
                        if (checkedValue.includes("DrugAbuse")) {
                            $("#PSFCP_F_Drugabuse").prop("checked", true);
                        }
                        if (checkedValue.includes("Physical")) {
                            $("#PSFCP_F_Physicalviolence").prop(
                                "checked",
                                true,
                            );
                        }
                        if (checkedValue.includes("nability")) {
                            $("#PSFCP_F_nabilityfollow").prop("checked", true);
                        }
                    }
                }
                $('input[name="PSFCP_Pain_POC[]"]').prop("checked", false);
                if (reservationDetails.PSFCP_Pain_POC) {
                    let PSFCP_Pain_POCCheckedValue =
                        reservationDetails.PSFCP_Pain_POC.split(",");
                    if (PSFCP_Pain_POCCheckedValue.includes("Reassurance")) {
                        $("#PSFCP_reassurance").prop("checked", true);
                    }
                    if (PSFCP_Pain_POCCheckedValue.includes("ReferER")) {
                        $("#PSFCP_r_er").prop("checked", true);
                    }
                    if (
                        PSFCP_Pain_POCCheckedValue.includes(
                            "Prescribe_home_medications",
                        )
                    ) {
                        $("#PSFCP_phm").prop("checked", true);
                    }
                }
                if (reservationDetails.PSFCP_N_management === 1) {
                    $("#PSFCP_N_management").prop("checked", true);
                } else {
                    $("#PSFCP_N_management").prop("checked", false);
                }
                if (reservationDetails.PSFCP_N_External === 1) {
                    $("#PSFCP_N_External").prop("checked", true);
                } else {
                    $("#PSFCP_N_External").prop("checked", false);
                }
                if (reservationDetails.PSFCP_F_management === 1) {
                    $("#PSFCP_F_management").prop("checked", true);
                } else {
                    $("#PSFCP_F_management").prop("checked", false);
                }
                if (reservationDetails.PSFCP_F_External === 1) {
                    $("#PSFCP_F_External").prop("checked", true);
                } else {
                    $("#PSFCP_F_External").prop("checked", false);
                }
                if (reservationDetails.PSFCP_S_management === 1) {
                    $("#PSFCP_S_management").prop("checked", true);
                } else {
                    $("#PSFCP_S_management").prop("checked", false);
                }
                if (reservationDetails.PSFCP_S_External === 1) {
                    $("#PSFCP_S_External").prop("checked", true);
                } else {
                    $("#PSFCP_S_External").prop("checked", false);
                }
                if (reservationDetails.is_allergyAlert === 1) {
                    $("#allergyAlertYes").prop("checked", true);
                    $("#allergyAlertNo").prop("checked", false);
                } else {
                    $("#allergyAlertNo").prop("checked", true);
                    $("#allergyAlertYes").prop("checked", false);
                }
                if (reservationDetails.is_reactionAlert === 1) {
                    $("#reactionAlertYes").prop("checked", true);
                    $("#reactionAlertNo").prop("checked", false);
                } else {
                    $("#reactionAlertNo").prop("checked", true);
                    $("#reactionAlertYes").prop("checked", false);
                }
                $("#allergyAlert").val(reservationDetails.allergyAlert);
                $("#reactionAlert").val(reservationDetails.reactionAlert);
                $("#transferReason").val(reservationDetails.transferReason);
                if (reservationDetails.transferLocation === "home") {
                    $("#transferLocation_home").prop("checked", true);
                } else if (
                    reservationDetails.transferLocation ===
                    "otherClinicOrHopitel"
                ) {
                    $("#transferLocation_clinic").prop("checked", true);
                } else if (reservationDetails.transferLocation === "other") {
                    $("#transferLocation_other").prop("checked", true);
                }
                populateDiagnosisData(diagnosisList);
                populateDiagnosisData1(diagnosisList);
                if (serviceOrderData && serviceOrderData.length > 0) {
                    populateServiceOrderData(serviceOrderData);
                }
                if (surgeryOrderData && surgeryOrderData.length > 0) {
                    populateSurgeryOrderData(surgeryOrderData);
                }
                populatMedicationData(medicationData);
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
}

function populateDiagnosisData(diagnosisList) {
    $("#pre_auth_diagnosis_table_head").show();
    diagnosisList.forEach((data, index) => {
        console.log(data);
        var rowIndex = $("#pre_auth_diagnosis_table_body tr").length;
        let diagnosisOptionsHtml = "";
        diagnosisOptionsHtml = $("#diagnosisOnAdmission").html();
        let diagnosisOnAdmissionTdHtml = "";
        let diagnosisDate = $("#diagnosisDate").val();
        let diagnosisType = $("#diagnosisType").val();
        let diagnosisOnAdmission = $("#diagnosisOnAdmission").val();
        let conditionOnset = $("#conditionOnset").val();
        diagnosisHtml = `<tr>
                    <td>${data.diagnosisDate}
                    <input type="hidden" name="diagnosisDateTd[]" class="form-control  diagnosisDateTd" id="diagnosisDateTd" value="${data.diagnosisDate}" />
                    </td>
                    <td><select id="diagnosisTypeTd${rowIndex}" name="diagnosisTypeTd[]" class="select2 w-100 diagnosisTypeTd" data-style="btn-default" data-live-search="true">
                    ${diagnosisTypeOptions}
                    </select></td>
                    <td class="diagnosisOnAdmissionTd">
                    <select id="diagnosisOnAdmissionTd${rowIndex}" name="diagnosisOnAdmissionTd[]" class="select2 w-100 diagnosisOnAdmissionTd" data-style="btn-default" data-live-search="true">
                        ${diagnosisOptionsHtml}
                    </select>
                </td>
                    <td><select id="conditionOnsetTd${rowIndex}" name="conditionOnsetTd[]" class="select2 w-100 conditionOnsetTd" data-style="btn-default" data-live-search="true">
                    ${conditionOnsetOptions}
                    </select></td>
                    <td>${data.diagnosisCode}
                    <input type="hidden" name="diagnosisIdTd[]" class="form-control  diagnosisIdTd" id="diagnosisIdTd" value="${data.diagnosisListId}" />
                    </td>
                    <td>${data.diagnosisName_en}</td>
                    <td class="text-center">
                      <button class="btn btn-outline-danger btn-sm remove-diagnosis-row">
                        <i class="ti ti-trash"></i>
                      </button>
                    </td>
                  </tr>`;
        $("#pre_auth_diagnosis_table_body").append(diagnosisHtml);
        $(`#diagnosisTypeTd${rowIndex}`).select2({
            placeholder: "Selection",
            allowClear: true,
        });
        $(`#conditionOnsetTd${rowIndex}`).select2({
            placeholder: "Selection",
            allowClear: true,
        });
        $(`#diagnosisTypeTd${rowIndex}`)
            .val(data.diagnosisType)
            .trigger("change");
        $(`#conditionOnsetTd${rowIndex}`)
            .val(data.conditionOnset)
            .trigger("change");
        $(`#diagnosisOnAdmissionTd${rowIndex}`).select2({
            placeholder: "Selection",
            allowClear: true,
        });
        $(`#diagnosisOnAdmissionTd${rowIndex}`)
            .val(data.diagnosisOnAdmission)
            .trigger("change");
    });
    syncDiagnosisToReport();
}

function populateDiagnosisData1(diagnosisList) {
    diagnosisList.sort((a, b) => a.seq_order - b.seq_order);
    diagnosisList.forEach((data, index) => {
        const newSeqOrder = data.seq_order;
        console.log("append");
        const newDiagnosis = $(`
            <div class="diagnosis-repeater repeater-wrapper pt-0 pt-md-2">
                <div class="d-flex border rounded position-relative pe-0">
                    <div class="row w-100 p-6">
                        <div class="col-md-12">
                            <table class="table table-borderless" id="diagnosis-table-${newSeqOrder}">
                                <tbody>
                                    <tr>
                                        <td class="diagnosis-search-td-${newSeqOrder}">
                                            <div class="mb-6">
                                                <label class="form-label labez" for="diagnosis_search_${newSeqOrder}">Search</label>
                                                <select id="diagnosis_search_${newSeqOrder}" name="diagnosis_search[]" class="select2 form-select form-select-lg diagnosis-search" data-allow-clear="true">
                                                </select>
                                            </div>
                                        </td>
                                        <td class="seq-order-td-${newSeqOrder}">
                                            <div class="mb-6">
                                                <label class="form-label labez" for="seq_order_${newSeqOrder}">Seq. Order</label>
                                                <input type="text" id="seq_order_${newSeqOrder}" name="seq_order[]" class="form-control expiry-date-mask" value="${newSeqOrder}" readonly>
                                            </div>
                                            <input type="hidden" name="diagnosis_id[]" class="form-control expiry-date-mask" value="${data.diagnosisListId}">
                                        </td>
                                        <td class="diagnosis-code-td-${newSeqOrder}">
                                            <div class="mb-6">
                                                <label class="form-label labez" for="diagnosis_code_${newSeqOrder}">Diagnosis Code</label>
                                                <input type="text" id="diagnosis_code_${newSeqOrder}" name="diagnosis_code[]" class="form-control expiry-date-mask" value="${data.diagnosisCode}">
                                            </div>
                                        </td>
                                        <td class="diagnosis-name-td-${newSeqOrder}">
                                            <div class="mb-6">
                                                <label class="form-label labez" for="diagnosis_name_${newSeqOrder}">Diagnosis Name</label>
                                                <input type="text" id="diagnosis_name_${newSeqOrder}" name="diagnosis_name[]" class="form-control expiry-date-mask" value="${data.diagnosisName_en}">
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="d-flex flex-column align-items-center justify-content-between border-start p-2">
                        <i class="ti ti-x ti-lg cursor-pointer" data-repeater-delete=""></i>
                    </div>
                </div>
            </div>
        `);
        if (index === 0) {
            newDiagnosis.appendTo(".mb-4.diagnosis-block");
        } else {
            const prevSeqOrder = diagnosisList[index - 1].seq_order; // Fix here
            newDiagnosis.insertAfter(
                $(`.seq-order-td-${prevSeqOrder}`).closest(
                    ".diagnosis-repeater",
                ),
            );
        }

        $(`#diagnosis_search_${newSeqOrder}`).select2({
            placeholder: "Search Diagnosis Name",
            allowClear: true,
            ajax: {
                url: BASE_URL + "/medicalrecords-get-diagnosis-search-options",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        diagnosisName: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data.data, function (value) {
                            return {
                                id: value.diagnosisListId,
                                text: value.diagnosisName_en,
                                code: value.diagnosisCode,
                            };
                        }),
                    };
                },
                cache: true,
            },
        });
        const newOption = new Option(
            data.diagnosisName_en,
            data.diagnosisListId,
            true,
            true,
        );
        $(`#diagnosis_search_${newSeqOrder}`)
            .append(newOption)
            .trigger("change");
    });
}

function initializeSelect2(element) {
    element.wrap('<div class="position-relative"></div>');
    element.select2({
        dropdownParent: element.parent(),
        placeholder: "Search Medications Name",
        allowClear: true,
        ajax: {
            url: BASE_URL + "/medicalrecords-get-medications-search-options",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    medicationName: params.term,
                };
            },
            processResults: function (data) {
                return {
                    results: $.map(data.data, function (value, key) {
                        return {
                            id: value.medicineId,
                            text: value.tradeName,
                        };
                    }),
                };
            },
            cache: true,
        },
    });
}

function populateServiceOrderData(serviceOrderData) {
    if (!serviceOrderData || !serviceOrderData.length || !serviceOrderData[0])
        return;
    $("#service_order_fixed_discount, #service_order_percentage_discount").prop(
        "checked",
        false,
    );
    if (serviceOrderData[0].discount_type) {
        $('input[name="service_order_discount_type"]').prop("checked", false);
        $(
            'input[name="service_order_discount_type"][value="' +
                serviceOrderData[0].discount_type +
                '"]',
        ).prop("checked", true);
    }
    if (
        serviceOrderData[0].service_order_lists &&
        serviceOrderData[0].service_order_lists.length > 0 &&
        serviceOrderData[0].is_surgery_bill === 0
    ) {
        serviceRowIndex = 0;
        $.each(
            serviceOrderData[0].service_order_lists,
            function (index, serviceOrderList) {
                console.log(serviceOrderList);
                var discountPercentageColumn = "";
                if (serviceOrderList.serviceId != null) {
                    if (serviceOrderData[0].discount_type == "fixed") {
                        discountPercentageColumn = `<td class="service-order-disc-percentage">
                            <input type="text" class="form-control service-discount-percentage-visible" placeholder="Discount Percentage" value="${serviceOrderList.discountPercentage}" disabled>
                            <input type="hidden" name="service_order[${serviceRowIndex}][discountPercentage]" class="service-discount-percentage-hidden" value="${serviceOrderList.discountPercentage}">
                        </td>
                        <td class="service-order-disc-amount">
                            <input type="text" class="form-control service-discount-visible" placeholder="Discount Amount" value="${serviceOrderList.disAmount}" >
                            <input type="hidden" name="service_order[${serviceRowIndex}][disAmount]" class="service-discount-hidden" value="${serviceOrderList.disAmount}">
                        </td>`;
                    } else {
                        discountPercentageColumn = `<td class="service-order-disc-percentage">
                            <input type="text" class="form-control service-discount-percentage-visible" placeholder="Discount Percentage" value="${serviceOrderList.discountPercentage}" >
                            <input type="hidden" name="service_order[${serviceRowIndex}][discountPercentage]" class="service-discount-percentage-hidden" value="${serviceOrderList.discountPercentage}">
                        </td>
                        <td class="service-order-disc-amount">
                            <input type="text" class="form-control service-discount-visible" placeholder="Discount Amount" value="${serviceOrderList.disAmount}" disabled>
                            <input type="hidden" name="service_order[${serviceRowIndex}][disAmount]" class="service-discount-hidden" value="${serviceOrderList.disAmount}">
                        </td>`;
                    }
                    $("#service_order_tbody").append(`
                        <tr>
                    <td class="service-order-name"><input type="hidden" class="service-id" name="service_order[${serviceRowIndex}][serviceId]" value="${serviceOrderList.service.serviceId}">${serviceOrderList.service.serviceName_en}</td>
                    <td class="service-order-code">${serviceOrderList.service.serviceCode ?? '-'}</td>
                    
                    <td class="service-order-toothNo">
                        <input type="number" class="form-control" placeholder="toothNo" name="service_order[${serviceRowIndex}][toothNo]" value="${serviceOrderList.toothNo}">
                    </td>
                    <td class="service-order-quantity">
                        <input type="number" class="form-control service-quantity" placeholder="Quantity" name="service_order[${serviceRowIndex}][qty]" value="${serviceOrderList.qty}">
                    </td>
                    <td class="service-order-price">
                        <input type="text" class="form-control service-price" placeholder="Price" name="service_order[${serviceRowIndex}][cost]" value="${serviceOrderList.cost}" disabled>
                    </td>
                    ${discountPercentageColumn}
                    <td class="service-order-vat-percentage">
                        <input type="text" class="form-control service-tax-percentage-visible" placeholder="VAT %" value="${serviceOrderList.manuelTaxPercentage}">
                        <input type="hidden" name="service_order[${serviceRowIndex}][manuelTaxPercentage]" class="service-tax-percentage-hidden" value="${serviceOrderList.manuelTaxPercentage}">
                    </td>
                    <td class="service-order-vat-amount">
                        <input type="text" class="form-control service-tax-amount-visible" placeholder="VAT Amount" value="${serviceOrderList.manuelTaxCost}">
                        <input type="hidden" name="service_order[${serviceRowIndex}][manuelTaxCost]" class="service-tax-amount-hidden" value="${serviceOrderList.manuelTaxCost}">
                    </td>
                    <td class="service-order-total-amount">
                        <input type="text" class="form-control service-total-amount-visible"  name="service_order[${serviceRowIndex}][netCost_visible]" value="${serviceOrderList.netCost}">
                        <input type="hidden" name="service_order[${serviceRowIndex}][netCost]" class="service-total-amount-hidden" value="${serviceOrderList.netCost}">
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger remove-row">X</button>
                    </td>
                </tr>
                    `);
                } else {
                    if (serviceOrderData[0].discount_type == "fixed") {
                        discountPercentageColumn = `<td class="service-order-disc-percentage">
                            <input type="text" class="form-control manual-service-discount-percentage-visible" placeholder="Discount Percentage" value="${serviceOrderList.discountPercentage}" disabled>
                            <input type="hidden" name="service_order[${serviceRowIndex}][discountPercentage]" class="manual-service-discount-percentage-hidden" value="${serviceOrderList.discountPercentage}">
                        </td>
                        <td class="service-order-disc-amount">
                            <input type="text" class="form-control manual-service-discount-visible" placeholder="Discount Amount" value="${serviceOrderList.disAmount}">
                            <input type="hidden" name="service_order[${serviceRowIndex}][disAmount]" class="manual-service-discount-hidden" value="${serviceOrderList.disAmount}">
                        </td>`;
                    } else {
                        discountPercentageColumn = `<td class="service-order-disc-percentage">
                            <input type="text" class="form-control manual-service-discount-percentage-visible" placeholder="Discount Percentage" value="${serviceOrderList.discountPercentage}" >
                            <input type="hidden" name="service_order[${serviceRowIndex}][discountPercentage]" class="manual-service-discount-percentage-hidden" value="${serviceOrderList.discountPercentage}">
                        </td>
                        <td class="service-order-disc-amount">
                            <input type="text" class="form-control manual-service-discount-visible" placeholder="Discount Amount" value="${serviceOrderList.disAmount}" disabled>
                            <input type="hidden" name="service_order[${serviceRowIndex}][disAmount]" class="manual-service-discount-hidden" value="${serviceOrderList.disAmount}">
                        </td>`;
                    }
                    $("#service_order_tbody").append(`
                        <tr>
                    <td class="service-order-name"><input type="text" class="service-id form-control" name="service_order[${serviceRowIndex}][manualServiceName]" value="${serviceOrderList.manualServiceName}"></td>
                    <td class="service-order-code"><input type="text" class="service-code form-control" name="service_order[${serviceRowIndex}][manualServiceCode]" value="${serviceOrderList.manualServiceCode}"></td>
                    <td class="service-order-toothNo"><input type="text" class="manual_service-toothNo form-control" name="service_order[${serviceRowIndex}][toothNo]" value="${serviceOrderList.toothNo}"></td>
                    <td class="service-order-quantity">
                        <input type="number" class="form-control service-quantity" placeholder="Quantity" name="service_order[${serviceRowIndex}][qty]" value="${serviceOrderList.qty}" value="1" min="1">
                    </td>
                    <td class="service-order-price">
                        <input type="text" class="form-control service-price" placeholder="Price" name="service_order[${serviceRowIndex}][cost]" value="${serviceOrderList.cost}">
                    </td>
                    ${discountPercentageColumn}
                    <td class="service-order-vat-percentage">
                        <input type="text" class="form-control manual-service-tax-percentage-visible" placeholder="VAT %" value="${serviceOrderList.manuelTaxPercentage}">
                        <input type="hidden" name="service_order[${serviceRowIndex}][manuelTaxPercentage]" class="manual-service-tax-percentage-hidden" value="${serviceOrderList.manuelTaxPercentage}">
                    </td>
                    <td class="service-order-vat-amount">
                        <input type="text" class="form-control manual-service-tax-visible" placeholder="VAT Amount" value="${serviceOrderList.manuelTaxCost}">
                        <input type="hidden" name="service_order[${serviceRowIndex}][manuelTaxCost]" class="manual-service-tax-hidden" value="${serviceOrderList.manuelTaxCost}">
                    </td>
                    <td class="service-order-total-amount">
                        <input type="text" class="form-control manual-service-total-amount-visible" placeholder="Total Amount" value="${serviceOrderList.netCost}">
                        <input type="hidden" name="service_order[${serviceRowIndex}][netCost]" class="manual-service-total-amount-hidden" value="${serviceOrderList.netCost}">
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger remove-row">X</button>
                    </td>
                </tr>
                    `);
                }
                serviceRowIndex++;
            },
        );
        $("#service_order_tbody").on(
            "input",
            "input[name='service_total_amount[]'], input[name='manual_service_total_amount[]']",
            function () {
                calculateTotals();
            },
        );
        $("#service_order_tbody").on("DOMSubtreeModified", function () {
            calculateTotals();
        });
        $("#service_order_tbody tr").each(function () {
            if (typeof calculateServiceOrderTotalAmount === "function") {
                calculateServiceOrderTotalAmount($(this));
            }
        });
        if (typeof serviceOrderInputs === "function") {
            serviceOrderInputs();
        } else if (typeof window.serviceOrderInputs === "function") {
            window.serviceOrderInputs();
        }
        calculateTotals();
        $("#total_discount_sum_td").text(serviceOrderData[0].totalDisAmount);
        $("#total_discount_sum").val(serviceOrderData[0].totalDisAmount);
        $("#total_vat_sum_td").text(serviceOrderData[0].totalTaxAmount);
        $("#total_vat_sum").val(serviceOrderData[0].totalTaxAmount);
        $("#service_order_net_amount").val(serviceOrderData[0].totalAmountSum);
        $("#service_order_net_amount_display").text(
            serviceOrderData[0].totalAmountSum,
        );
    }
}

function populateSurgeryOrderData(surgeryOrderData) {
    if (surgeryOrderData[0].discount_type) {
        $('input[name="surgery_discount_type"]').prop("checked", false);
        $(
            'input[name="surgery_discount_type"][value="' +
                surgeryOrderData[0].discount_type +
                '"]',
        ).prop("checked", true);
        if (typeof surgeryOrderInputs === "function") {
            surgeryOrderInputs();
        } else if (typeof window.surgeryOrderInputs === "function") {
            window.surgeryOrderInputs();
        }
    }
    var surgeryDiscountPercentageColumn = "";
    if (
        surgeryOrderData[0].service_order_lists &&
        surgeryOrderData[0].service_order_lists.length > 0 &&
        surgeryOrderData[0].is_surgery_bill === 1
    ) {
        surgeryRowIndex = 0; //
        $.each(
            surgeryOrderData[0].service_order_lists,
            function (index, surgeryOrderList) {
                var discountPercentageColumn = "";
                if (surgeryOrderList.serviceId != null) {
                    if (surgeryOrderData[0].discount_type == "fixed") {
                        discountPercentageColumn = `<td class="surgery-order-disc-percentage">
                                <input type="text" class="form-control surgery-discount-percentage-visible" placeholder="Discount %" value="${surgeryOrderList.discountPercentage}" disabled>
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][discountPercentage]" class="surgery-discount-percentage-hidden" value="${surgeryOrderList.discountPercentage}">
                            </td>
                            <td class="surgery-order-disc-amount">
                                <input type="text" class="form-control surgery-discount-amount-visible" placeholder="Discount" value="${surgeryOrderList.disAmount}">
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][disAmount]" class="surgery-discount-amount-hidden" value="${surgeryOrderList.disAmount}">
                            </td>`;
                    } else {
                        discountPercentageColumn = `<td class="surgery-order-disc-percentage">
                                <input type="text" class="form-control surgery-discount-percentage-visible" placeholder="Discount %" value="${surgeryOrderList.discountPercentage}">
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][discountPercentage]" class="surgery-discount-percentage-hidden" value="${surgeryOrderList.discountPercentage}">
                            </td>
                            <td class="surgery-order-disc-amount">
                                <input type="text" class="form-control surgery-discount-amount-visible" placeholder="Discount" value="${surgeryOrderList.disAmount}" disabled>
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][disAmount]" class="surgery-discount-amount-hidden" value="${surgeryOrderList.disAmount}">
                            </td>`;
                    }
                    $("#surgery_order_tbody").append(`
                        <tr>
                            <td class="surgery-order-name"><input type="hidden" class="service-id" name="surgery_order[${surgeryRowIndex}][serviceId]" value="${surgeryOrderList.service.serviceId}">${surgeryOrderList.service.serviceName_en}</td>
                            <td class="surgery-order-code">${surgeryOrderList.service.serviceCode ?? '_'}</td>
                            <td class="surgery-order-physician-fees"><input type="number" class="form-control surgery-physician-fees" placeholder="Physician Fees" name="surgery_order[${surgeryRowIndex}][physicianFees]" value="${surgeryOrderList.physicianFees}"></td>
                                                    ${discountPercentageColumn}

                            <td class="surgery-order-vat-percentage">
                                <input type="text" class="form-control surgery-tax-percentage-visible" placeholder="VAT %" value="${surgeryOrderList.manuelTaxPercentage}" >
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][manuelTaxPercentage]" class="surgery-tax-percentage-hidden" value="${surgeryOrderList.manuelTaxPercentage}">
                            </td>
                            <td class="surgery-order-vat-amount">
                                <input type="text" class="form-control surgery-tax-amount-visible" value="${surgeryOrderList.manuelTaxCost}" placeholder="VAT Amount"  disabled>
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][manuelTaxCost]" class="surgery-tax-amount-hidden" value="${surgeryOrderList.manuelTaxCost}"  disabled>
                            </td>
                            <td class="surgery-order-net-amount">
                                <input type="text" class="form-control surgery-total-amount-visible" value="${surgeryOrderList.netCost}" placeholder="Net Amount">
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][netCost]" class="surgery-total-amount-hidden" value="${surgeryOrderList.netCost}">
                            </td>
                            <td><input type="text" class="form-control" name="surgery_order[${surgeryRowIndex}][planSurgery]" value="${surgeryOrderList.planSurgery}" placeholder="Plan"></td>
                            <td><button type="button" class="btn btn-danger remove-row">X</button></td>
                        </tr>
                    `);
                } else {
                    if (surgeryOrderData[0].discount_type == "fixed") {
                        discountPercentageColumn = `<td class="surgery-order-disc-percentage">
                                <input type="text" class="form-control manual-surgery-discount-percentage-visible" placeholder="Discount %" value="${surgeryOrderList.discountPercentage}" disabled>
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][discountPercentage]" class="manual-surgery-discount-percentage-hidden" value="${surgeryOrderList.discountPercentage}">
                            </td>
                            <td class="surgery-order-disc-amount">
                                <input type="text" class="form-control manual-surgery-discount-visible" placeholder="Discount " value="${surgeryOrderList.disAmount}">
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][disAmount]" class="manual-surgery-discount-hidden" value="${surgeryOrderList.disAmount}">
                            </td>`;
                    } else {
                        discountPercentageColumn = `<td class="surgery-order-disc-percentage">
                                <input type="text" class="form-control manual-surgery-discount-percentage-visible" placeholder="Discount %" value="${surgeryOrderList.discountPercentage}">
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][discountPercentage]" class="manual-surgery-discount-percentage-hidden" value="${surgeryOrderList.discountPercentage}">
                            </td>
                            <td class="surgery-order-disc-amount">
                                <input type="text" class="form-control manual-surgery-discount-visible" placeholder="Discount " value="${surgeryOrderList.disAmount}" disabled>
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][disAmount]" class="manual-surgery-discount-hidden" value="${surgeryOrderList.disAmount}">
                            </td>`;
                    }
                    $("#surgery_order_tbody").append(`
                        <tr>
                            <td class="surgery-order-name"><input type="text" class="service-id form-control" name="surgery_order[${surgeryRowIndex}][manualServiceName]" value="${surgeryOrderList.manualServiceName}"></td>
                            <td class="surgery-order-code"><input type="text" class="service-code form-control" name="surgery_order[${surgeryRowIndex}][manualServiceCode]" value="${surgeryOrderList.manualServiceCode}"></td>
                            <td class="surgery-order-physician-fees">
                                <input type="number" class="form-control surgery-physician-fees" placeholder="Physician Fees" name="surgery_order[${surgeryRowIndex}][physicianFees]" value="${surgeryOrderList.physicianFees}">
                            </td>
                            ${discountPercentageColumn}
                            <td class="surgery-order-vat-percentage">
                                <input type="text" class="form-control manual-surgery-tax-percentage-visible" placeholder="VAT %" value="${surgeryOrderList.manuelTaxPercentage}">
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][manuelTaxPercentage]" class="manual-surgery-tax-percentage-hidden" value="${surgeryOrderList.manuelTaxPercentage}">
                            </td>
                            <td class="surgery-order-vat-amount">
                                <input type="text" class="form-control manual-surgery-tax-amount-visible" value="${surgeryOrderList.manuelTaxCost}" placeholder="VAT Amount">
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][manuelTaxCost]" class="manual-surgery-tax-amount-hidden" value="${surgeryOrderList.manuelTaxCost}">
                            </td>
                            <td class="surgery-order-net-amount">
                                <input type="text" class="form-control manual-surgery-total-amount-visible" value="${surgeryOrderList.netCost}" placeholder="Net Amount">
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][netCost]" class="manual-surgery-total-amount-hidden" value="${surgeryOrderList.netCost}">
                            </td>
                            <td><input type="text" class="form-control" name="surgery_order[${surgeryRowIndex}][planSurgery]" value="${surgeryOrderList.planSurgery}" placeholder="Plan"></td>
                            <td><button type="button" class="btn btn-danger remove-row">X</button></td>
                        </tr>
                    `);
                }
                surgeryRowIndex++;
            },
        );
        if (typeof window.surgeryOrderInputs === "function") {
            window.surgeryOrderInputs();
        } else if (typeof surgeryOrderInputs === "function") {
            surgeryOrderInputs();
        }
        $("#surgery_order_tbody tr").each(function () {
            if (typeof calculateSurgeryOrderTotalAmount === "function") {
                calculateSurgeryOrderTotalAmount($(this));
            }
        });
        if (typeof calculateSurgeryTotals === "function") {
            calculateSurgeryTotals();
        }
    }
}

function populatMedicationData(medicationData) {
    $("#medication_tbody_div").empty();
    medicationData.forEach((medication, index) => {
        let newRow = `
            <tr>
                <td>
                    <select id="medications_search_${index}" name="medications_search[]" class="select2 form-select form-select-lg medications-search" data-allow-clear="true">
                        <option value="${medication.medicineId}" selected>${
                            medication.medicine.tradeName
                        }</option>
                    </select>
                </td>
                <td><input type="text" name="medication_start_date[]" class="form-control medicineStartDate" value="${
                    medication.startDate || ""
                }"></td>
                <td><input type="text" name="medication_discontinue_date[]" class="form-control discontinueDate" value="${
                    medication.discontinueDate || ""
                }"></td>
                <td><input type="text" name="medication_dosage[]" class="form-control medication-dosage" value="${
                    medication.dosage || ""
                }"></td>
                <td><input type="text" name="medication_frequency[]" class="form-control medication-frequency" value="${
                    medication.frequency || ""
                }"></td>
                <td>
                    <select id="medication_allergy_${index}" name="medication_allergy[]" class="form-select">
                        <option value="" ${
                            medication.is_allergiesUnknown == null
                                ? "selected"
                                : ""
                        }></option>
                        <option value="1" ${
                            medication.is_allergiesUnknown == 1
                                ? "selected"
                                : ""
                        }>Yes</option>
                        <option value="0" ${
                            medication.is_allergiesUnknown == 0
                                ? "selected"
                                : ""
                        }>No</option>
                    </select>
                </td>
                
            <td>
            <div class="d-flex">
                <button 
                    type="button" 
                    class="btn rounded-pill btn-icon btn-label-primary view-medicine-btn me-2" 
                    id="view-medicine-btn"
                    data-medicine-id="${medication.medicineId}">
                     <i class="ti ti-eye"></i>
                </button>
                <button 
                type="button" 
                class="btn rounded-pill btn-icon btn-label-primary remove-medicine" 
                id="remove-medicine"
                data-medicine-id="${medication.medicineId}"
                >
                 <i class="ti ti-trash"></i>
              </button>
               </div>
                <!-- Hidden details from modal -->
                <input type="hidden" name="medication_scientificCode[]" class="row-scientificCode" value="${medication.scientificCode || ""}">
                <input type="hidden" name="medication_scientificCodeAbsenceReason[]" class="row-scientificCodeAbsenceReason" value="${medication.scientificCodeAbsenceReason || ""}">
                <input type="hidden" name="medication_strength[]" class="row-strength" value="${medication.strength || ""}">
                <input type="hidden" name="medication_selectionReason[]" class="row-selectionReason" value="${medication.selectionReason || ""}">
                <input type="hidden" name="medication_pharmacistSubsitute[]" class="row-pharmacistSubsitute" value="${medication.pharmacistSubsitute || ""}">
                <input type="hidden" name="medication_duration[]" class="row-txtDuration" value="${medication.duration || ""}">
                <input type="hidden" name="medication_durationUnit[]" class="row-slcDurationUnit" value="${medication.durationUnit || ""}">
                <input type="hidden" name="medication_period[]" class="row-txtPeriod" value="${medication.period || ""}">
                <input type="hidden" name="medication_periodUnit[]" class="row-slcPeriodUnit" value="${medication.periodUnit || ""}">
                <input type="hidden" name="medication_doseUnit[]" class="row-txtDoseQuantity" value="${medication.doseUnit || medication.dosage || ""}">
                <input type="hidden" name="medication_selectDoseUnit[]" class="row-slcDose" value="${medication.selectDoseUnit || ""}">
                <input type="hidden" name="medication_routeAdmin[]" class="row-slcRouteAdmin" value="${medication.routeAdmin || ""}">
                <input type="hidden" name="medication_timeInstruction[]" class="row-timeInstruction" value="${medication.timeInstruction || ""}">
                <input type="hidden" name="medication_refillCount[]" class="row-refillCount" value="${medication.refillCount || ""}">
                <input type="hidden" name="medication_dosageInstruction[]" class="row-dosageInstruction" value="${medication.dosageInstruction || ""}">
                <input type="hidden" name="medication_patientInstruction[]" class="row-patientInstruction" value="${medication.patientInstruction || ""}">
                <input type="hidden" name="medication_additionalSupportingInfo[]" class="row-additionalSupportingInfo" value="${medication.additionalSupportingInfo || ""}">
            </td>
            </tr>
        `;
        $("#medication_tbody_div").append(newRow);
        initializeSelect2($(`#medications_search_${index}`));
        let allergySelect = $(`#medication_allergy_${index}`);
        allergySelect.select2({
            width: "100%",
            dropdownParent: $("body"),
        });
    });
    rowIndex = medicationData.length;
    flatpickr(".medicineStartDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    flatpickr(".discontinueDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    togglePrescriptionPrintBtn();
}

function togglePrescriptionPrintBtn() {
    let hasMedication = false;

    $("#medication_tbody_div tr").each(function () {
        let medId = $(this).find(".medications-search").val();
        let stdate = $(this).find(".medicineStartDate").val();
        let discdate = $(this).find(".discontinueDate").val();
        let dosage = $(this).find(".medication-dosage").val();
        let frequency = $(this).find(".medication-frequency").val();
        let allergy = $(this).find('select[name="medication_allergy[]"]').val();

        let scientificCode = $(this).find(".row-scientificCode").val();
        let scientificCodeAbsenceReason = $(this).find(".row-scientificCodeAbsenceReason").val();
        let strength = $(this).find(".row-strength").val();
        let selectionReason = $(this).find(".row-selectionReason").val();
        let pharmacistSubsitute = $(this).find(".row-pharmacistSubsitute").val();
        let duration = $(this).find(".row-txtDuration").val();
        let durationUnit = $(this).find(".row-slcDurationUnit").val();
        let period = $(this).find(".row-txtPeriod").val();
        let periodUnit = $(this).find(".row-slcPeriodUnit").val();
        let doseUnit = $(this).find(".row-txtDoseQuantity").val();
        let selectDoseUnit = $(this).find(".row-slcDose").val();
        let routeAdmin = $(this).find(".row-slcRouteAdmin").val();
        let timeInstruction = $(this).find(".row-timeInstruction").val();
        let refillCount = $(this).find(".row-refillCount").val();
        let dosageInstruction = $(this).find(".row-dosageInstruction").val();
        let patientInstruction = $(this).find(".row-patientInstruction").val();
        let additionalSupportingInfo = $(this).find(".row-additionalSupportingInfo").val();

        if (
            medId && stdate && discdate && dosage && frequency && allergy &&
            scientificCode && scientificCodeAbsenceReason && strength &&
            selectionReason && pharmacistSubsitute &&
            duration && durationUnit && period && periodUnit &&
            doseUnit && selectDoseUnit && routeAdmin && timeInstruction &&
            refillCount && dosageInstruction && patientInstruction && additionalSupportingInfo
        ) {
            hasMedication = true;
        }
    });

    const btn = document.getElementById("Prescription-Print");
    if (btn) {
        btn.style.setProperty("display", hasMedication ? "grid" : "none", "important");
    }
}

$(document).on("select2:unselect select2:clear", ".medications-search", function () {
    togglePrescriptionPrintBtn();
});

$(document).on("input change", ".medicineStartDate, .discontinueDate, .medication-dosage, .medication-frequency", function () {
    togglePrescriptionPrintBtn();
});

$(document).on("change", 'select[name="medication_allergy[]"]', function () {
    togglePrescriptionPrintBtn();
});

$(document).on("click", "#remove-medicine", function () {
    const medicineId = $(this).data("medicine-id");
    const reservationId = $("#reservation_id").val();
    $.ajax({
        url: "/remove-medicine",
        method: "POST",
        data: {
            medicine_id: medicineId,
            reservation_id: reservationId,
            _token: $('meta[name="csrf-token"]').attr("content"),
        },
        success: function (response) {},
        error: function (xhr) {},
    });
});

$(document).on("click", ".remove-medicine", function () {
    const medicineId = $(this).data("medicine-id");
    $(this).closest("tr").remove();
    togglePrescriptionPrintBtn();
});

$(document).on("click", "#Prescription-Print", function (e) {
    e.preventDefault();
    var clientId = $("#clientId").val();
    var reservationId = $("#reservationId").val();
    if (reservationId) {
        window.open(
            BASE_URL + "/print-prescription/" + reservationId,
            "_blank",
        );
    } else {
        alert("Reservation ID is missing!");
    }
});

function appendEcgFile(filePath, fileName, mediafilesId) {
    const fullPath = BASE_URL + "/" + filePath;
    const ecgHtml = `
        <div class="dz-preview dz-file-preview">
            <div class="subimage">
                <div class="dz-image"><img data-dz-thumbnail src="${fullPath}" /></div>
                <div class="dz-actions mt-2 text-center">
                    <button 
                        class="btn btn-sm btn-label-secondary dz-view" 
                        type="button" 
                        onclick="viewEcgFile(event)" 
                        data-file-url="${fullPath}" 
                        data-file-id="${mediafilesId}"
                    >
                        View
                    </button>
                    <button 
                        class="btn btn-sm btn-label-danger dz-delete" 
                        type="button" 
                        onclick="confirmEcgDelete(event)" 
                        data-file-id="${mediafilesId}"
                    >
                        Delete
                    </button>
                </div>
                <div class="dz-details subimgcontent">
                    <div class=""><span data-dz-name>${fileName}</span></div>
                </div>
            </div>
        </div>
    `;
    $("#already_exist_files").append(ecgHtml);
}

function insuranceServiceAppend(insuranceServiceOrderLists) {
    insuranceServiceOrderLists.forEach((insuranceServiceOrderList, index) => {
        console.log(insuranceServiceOrderList);
        var newRow = `
                            <tr>
                                <td class="insurance-service-name"><input type="hidden" class="service-id" name="insurance_service_id[]" value="${insuranceServiceOrderList.serviceId}">${insuranceServiceOrderList.service.serviceName_en}</td>
                                <td class="insurance-service-code">${insuranceServiceOrderList.service.serviceCode}</td>
                                
                                <td class="insurance-service-qty">
                                
                                <input type="hidden" class="form-control" placeholder="Quantity" name="insurance_service_deductible_rate[]" value="${insuranceServiceOrderList.deductibleRate}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="insurance_service_max_copay_limit[]" value="${insuranceServiceOrderList.maxCopayLimit}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="insurance_service_vat_percentage[]" value="${insuranceServiceOrderList.vatPercentage}">

                                
                                    <input type="number" class="form-control" placeholder="Quantity" name="insurance_service_qty[]" value="${insuranceServiceOrderList.qty}">
                                </td>
                                <td class="insurance-service-price">
                                    <input type="text" class="form-control" placeholder="Price" name="insurance_service_price[]" value="${insuranceServiceOrderList.unitPrice}">
                                </td>
                                <td class="insurance-service-total">
                                    <input type="number" class="form-control" placeholder="Total Amount" name="insurance_service_total[]" value="${insuranceServiceOrderList.cost}">
                                </td>
                                <td class="insurance-service-deduction-amount">
                                    <input type="text" class="form-control" placeholder="Insurance Deduction" name="insurance_service_deduction[]" value="${insuranceServiceOrderList.disAmount}">
                                </td>
                                <td class="insurance-service-vat-amount">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="insurance_service_tax_amount[]" value="${insuranceServiceOrderList.netTaxCost}">
                                </td>
                                <td class="insurance-service-net-amount">
                                    <input type="text" class="form-control" placeholder="Net Amount" name="insurance_service_net_amount[]" value="${insuranceServiceOrderList.netCost}">
                                </td>
                                <td>
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>
                        `;

        $("#insurance_service_tbody").append(newRow);
    });
}

$("#medical-report-tab").on("click", function () {
    // aj
    syncDiagnosisFromTable();
});



function validateDiagnosisPrincipal() {
    var missingTabs = [];

    // Vital Sign mandatory fields
    var vitalSignFields = [
        "height",
        "weight",
        "bmi",
        "temperature",
        "blood_pressure",
        "pulse",
        "respiratory_rate",
        "oxygen_saturation",
    ];

    var vitalSignMissing = false;
    for (var i = 0; i < vitalSignFields.length; i++) {
        var val = $("#" + vitalSignFields[i]).val();

        if (
            !val ||
            val.toString().trim() === "" ||
            val === "select"
        ) {
            vitalSignMissing = true;
            break;
        }
    }

    if (vitalSignMissing) {
        missingTabs.push("Vital Sign tab is required.");
    }

    // Consultation mandatory fields
    var consultationFields = [
        "chief_complaints",
        "Duration_type",
        "Duration",
        "Others_Conditions",
        "past_history",
        "family_history",
        "examination",
        "treatment_plan",
    ];

    var consultationMissing = false;
    for (var j = 0; j < consultationFields.length; j++) {
        var val = $("#" + consultationFields[j]).val();

        if (
            !val ||
            val.toString().trim() === "" ||
            val === "select"
        ) {
            consultationMissing = true;
            break;
        }
    }

    if (consultationMissing) {
        missingTabs.push("Consultation tab is required.");
    }

    // Diagnosis validation
    let diagnosisRows = $("#pre_auth_diagnosis_table_body tr");

    if (diagnosisRows.length === 0) {
        missingTabs.push("Diagnosis is required.");
    } else {
        let hasPrincipal = false;

        diagnosisRows.each(function () {
            let diagnosisType = $(this)
                .find('select[name="diagnosisTypeTd[]"]')
                .val();

            if (diagnosisType === "principal") {
                hasPrincipal = true;
            }
        });

        if (!hasPrincipal) {
            missingTabs.push(
                "At least one diagnosis type must be Principal."
            );
        }
    }

    // Show all errors in one Swal
    if (missingTabs.length > 0) {
        Swal.fire({
            title: "Warning!",
            html: missingTabs.join("<br>"),
            icon: "warning",
            showCancelButton: false,
            confirmButtonText: "OK",
            customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
            },
            buttonsStyling: false,
        });

        return false;
    }

    return true;
}