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

$(document).ready(function () {
    $("#insurance_service_table #insurance_service_tbody input").prop(
        "readonly",
        true,
    );

    // Allow only quantity input to be editable
    $(
        '#insurance_service_table #insurance_service_tbody input[type="number"][name="insurance_service_qty[]"]',
    ).prop("readonly", false);

    flatpickr("#serviceDateOnModal", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });

    flatpickr("#medicineStartDateOnModal", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    flatpickr("#discontinueDateOnModal", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });

    flatpickr("#diagnosisDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });

    if ($("#diagnosis").hasClass("select2-hidden-accessible")) {
        $("#diagnosis").select2("destroy");
    }

    $("#diagnosis").select2({
        width: "100%",
        dropdownParent: $("#diagnosis").parent(),
        placeholder: "Search Diagnosis",
        allowClear: true,
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
        },
    });

    $(document).on("click", "#addDiagnosis", function () {

        $(".error-text").text("");

        let isValid = true;

        if ($("#diagnosisDate").val().trim() == "") {
            $(".diagnosisDate_error").text("Diagnosis Date is required");
            isValid = false;
        }

        if ($("#diagnosisType").val() == "") {
            $(".diagnosisType_error").text("Diagnosis Type is required");
            isValid = false;
        }

        if ($("#diagnosis").val() == "") {
            $(".diagnosis_error").text("Diagnosis Code / Description is required");
            isValid = false;
        }

        if ($("#conditionOnset").val() == "") {
            $(".conditionOnset_error").text("Condition Onset is required");
            isValid = false;
        }

        if (!isValid) {
            $("#loader-overlay").hide();
            return;
        }

        $("#loader-overlay").show();

        $.ajax({
            
        });
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
        $("#loader-overlay").show();
        $.ajax({
            url:
                BASE_URL +
                "/pre-authorization-get-diagnosis-details-by-id/" +
                $("#diagnosis").val(),
            type: "get",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    console.log(response);
                    $("#pre_auth_diagnosis_table_head").show();
                    var rowIndex = $(
                        "#pre_auth_diagnosis_table_body tr",
                    ).length;
                    let diagnosisOptionsHtml = "";
                    // if ($("#preAuthorizationType").val() == "Institutional") {
                    diagnosisOptionsHtml = $("#diagnosisOnAdmission").html();
                    // }
                    let diagnosisOnAdmissionTdHtml = "";

                    // if ($("#preAuthorizationType").val() === "Institutional") {
                    //     $(".diagnosisOnAdmission").show();
                    //     $("#diagnosisOnAdmissionTh").show();
                    // } else {
                    //     $(".diagnosisOnAdmission").hide();
                    //     $("#diagnosisOnAdmissionTh").hide();
                    // }
                    let diagnosisDate = $("#diagnosisDate").val();
                    let diagnosisType = $("#diagnosisType").val();
                    let diagnosisOnAdmission = $("#diagnosisOnAdmission").val();
                    let conditionOnset = $("#conditionOnset").val();
                    console.log("diagnosisType=>" + diagnosisType);
                    console.log("conditionOnset=>" + conditionOnset);
                    diagnosisHtml = `<tr>
                    <td>${diagnosisDate}
                    <input type="hidden" name="diagnosisDateTd[]" class="form-control  diagnosisDateTd" id="diagnosisDateTd" value="${diagnosisDate}" />
                    </td>
                    <td><select id="diagnosisTypeTd${rowIndex}" name="diagnosisTypeTd[]" class="select2 w-100 diagnosisTypeTd" data-style="btn-default" data-live-search="true">
                    ${diagnosisTypeOptions}
                    </select></td>
                    <td class="diagnosisOnAdmissionTd">
                    <select id="diagnosisOnAdmissionTd${rowIndex}" name="diagnosisOnAdmissionTd[]" class="select2 w-100 diagnosisOnAdmissionTd" data-style="btn-default" data-live-search="true">
                        ${diagnosisOptionsHtml}
                    </select>
                </td>
                    ${diagnosisOnAdmissionTdHtml}
                    <td><select id="conditionOnsetTd${rowIndex}" name="conditionOnsetTd[]" class="select2 w-100 conditionOnsetTd" data-style="btn-default" data-live-search="true">
                    ${conditionOnsetOptions}
                    </select></td>
                    <td>${response.data.diagnosisCode}
                    <input type="hidden" name="diagnosisIdTd[]" class="form-control  diagnosisIdTd" id="diagnosisIdTd" value="${response.data.diagnosisListId}" />
                    </td>
                    <td>${response.data.diagnosisName_en}</td>
                    <td class="text-center">
                      <button class="btn btn-outline-danger btn-sm remove-diagnosis-row">
                        <i class="ti ti-trash"></i>
                      </button>
                    </td>
                  </tr>`;
                    $("#pre_auth_diagnosis_table_body").append(diagnosisHtml);
                    setTimeout(() => {
                        let values = $("input[name='diagnosisIdTd[]']")
                            .map(function () {
                                return $(this).val();
                            })
                            .get();

                        console.log(values);
                        appendCauseOfDeathSelectBox(values);
                        appendInsuranceDiagnosisSelectBox(values);
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
                } else {
                    console.error("Service details not found");
                }
                $("#diagnosisDate").val("");
                $("#diagnosisType").val("").trigger("change");
                $("#diagnosisOnAdmission").val("").trigger("change");
                $("#conditionOnset").val("").trigger("change");
                $(`#diagnosis`).val("").trigger("change");
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
                    console.error("Error:", xhr);
                }
            }
        });
        $("#item_name").val("").trigger("change");
    });
});


function appendCauseOfDeathSelectBox(
    diagnosisIds,
    selectedId = null,
    selectedText = null,
) {
    console.log("Diagnosis IDs:", diagnosisIds);
    $.ajax({
        url: BASE_URL + "/get-diagnosis-list",
        type: "POST",
        data: { diagnosisIds: JSON.stringify(diagnosisIds) },
        traditional: true,
        success: function (response) {
            const $select = $("#cautionOfDeath");
            $select.find("option:not(:first)").remove();
            if (response.status === true && Array.isArray(response.data)) {
                response.data.forEach(function (item) {
                    $select.append(
                        `<option value="${item.diagnosisListId}">${item.diagnosisCode} - ${item.diagnosisName_en}</option>`,
                    );
                });
                if (
                    selectedId &&
                    $select.find('option[value="' + selectedId + '"]')
                        .length === 0 &&
                    selectedText
                ) {
                    $select.append(new Option(selectedText, selectedId));
                }
                if (selectedId) {
                    $select.val(selectedId).trigger("change");
                }
            } else {
                console.warn("No diagnosis data returned.");
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", error);
        },
    });
}

// Remove Diagnosis Row
$(document).on("click", ".remove-diagnosis-row", function (e) {
    e.preventDefault();

    // Remove the clicked row
    $(this).closest("tr").remove();

    // After removing, update the Cause of Death dropdown with remaining diagnosis IDs
    let remainingDiagnosisIds = $("input[name='diagnosisIdTd[]']")
        .map(function () {
            return $(this).val();
        })
        .get();

    appendCauseOfDeathSelectBox(remainingDiagnosisIds);
});

function appendDiagnosisSelectBox(diagnosisIds, selectedId = null) {
    console.log("Diagnosis IDs: form diagnis-services js", diagnosisIds);
    const $select = $("#serviceDiagnosis");

    $select.val(null).trigger("change");
    $select.empty();
    $.ajax({
        url: BASE_URL + "/get-diagnosis-list",
        type: "POST",
        data: { diagnosisIds: JSON.stringify(diagnosisIds) },
        traditional: true,
        success: function (response) {
            if (response.status === true && Array.isArray(response.data)) {
                response.data.forEach(function (item) {
                    $select.append(
                        `<option value="${item.diagnosisListId}">${item.diagnosisCode} - ${item.diagnosisName_en}</option>`,
                    );
                });
                if (selectedId) {
                    $select.val(selectedId).trigger("change");
                }
            } else {
                console.warn("No diagnosis data returned.");
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", error);
        },
    });
}
