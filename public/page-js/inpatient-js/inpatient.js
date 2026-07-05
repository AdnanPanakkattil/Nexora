let doctorOptions;
$(document).ready(function () {
    $("#admission_and_discharge_main_menu").addClass(
        "active open menu-item-animating"
    );
    $("#admission_and_discharge_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    // initialPageLoad();
    if ($("#in_patient_id").val()) {
        initialPageLoad($("#in_patient_id").val());
    }

    flatpickr("#time_In", {
        enableTime: true,
        dateFormat: "Y-m-d H:i:S",
        enableSeconds: true,
    });

    flatpickr("#time_Out", {
        enableTime: true,
        dateFormat: "Y-m-d H:i:S",
        enableSeconds: true,
    });

    $('button[data-bs-toggle="tab"]').on("click", function (e) {
        e.preventDefault();
        $(this).tab("show");
        // $('#serviceId').select2({
        //     width: '100%',
        //     placeholder: 'Select an option',
        //     allowClear: true,
        // });
    });


    // Hide all content sections except the first (Vital sign) on page load
    $(".tab-content").hide();
    $("#history_and_physical_examination_content").show();

    // Event listener for Vital Sign tab
    $("#history-and-physical-examination-tab").click(function () {
        $(".tab-content").hide(); // Hide all content
        $("#history_and_physical_examination_content").show(); // Show Vital Sign content
        $(".nav-link").removeClass("active"); // Remove active class from all tabs
        $(this).addClass("active"); // Add active class to clicked tab
    });

    // Event listener for Allergy tab
    $("#allergy-tab").click(function () {
        $(".tab-content").hide();
        $("#allergy_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // Event listener for Consultation tab
    $("#medication-sheet-tab").click(function () {
        $(".tab-content").hide();
        $("#medication_sheet_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // Event listener for Consultation tab
    $("#operative-report-tab").click(function () {
        $(".tab-content").hide();
        $("#operative_report_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    $("#medication-tab").click(function () {
        $(".tab-content").hide();
        $("#medication_tab").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // Event listener for Consultation tab
    $("#category-and-anesthesia-tab").click(function () {
        $(".tab-content").hide();
        $("#category_and_anesthesia_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // Event listener for Consultation tab
    $("#diagnosis-tab").click(function () {
        $(".tab-content").hide();
        $("#diagnosis_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // Event listener for Screening tab
    $("#surgical-procedure-documentation-tab").click(function () {
        $(".tab-content").hide();
        $("#surgical_procedure_documentation_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // Event listener for Screening tab
    $("#services-tab").click(function () {
        $(".tab-content").hide();
        $("#services_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    let surgeonAssistantCount = 1;
    let anesthetistAssistantCount = 1;

    // // Get doctor options once on page load
    // doctorOptions1 = $(".initial-surgeon-assistant")
    //     .find("option")
    //     .map(function () {
    //         return $(this).prop("outerHTML");
    //     })
    //     .get()
    //     .join("");

    // Event listener for the "Add Assistant Surgeon" button
    $(document).on("click", ".add-assistant-surgeon", function (event) {
        // $('.add-assistant-surgeon').on('click', function(event) {
        event.preventDefault();
        addAssistant($(this).attr("id"));
    });

    $(document).on("click", ".add-assistant-anesthesia", function (event) {
        event.preventDefault();

        addAssistant($(this).attr("id"));
    });

    // Handle remove button click to remove row
    $(document).on("click", ".remove-row", function () {
        $(this).closest("tr").remove();
    });

    // Hide all content sections except the first (Vital sign) on page load
    $(".tab-content").hide();
    $("#vital_sign_content").show();

    // Event listener for Vital Sign tab
    $("#vital-sign-tab").click(function () {
        $(".tab-content").hide(); // Hide all content
        $("#vital_sign_content").show(); // Show Vital Sign content
        $(".nav-link").removeClass("active"); // Remove active class from all tabs
        $(this).addClass("active"); // Add active class to clicked tab
    });

    // Event listener for Allergy tab
    $("#allergy-tab").click(function () {
        $(".tab-content").hide();
        $("#allergy_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // Event listener for Consultation tab
    $("#consultation-tab").click(function () {
        $(".tab-content").hide();
        $("#consultation_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // Event listener for Consultation tab
    $("#diagnosis-tab").click(function () {
        $(".tab-content").hide();
        $("#diagnosis_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // Event listener for Consultation tab
    $("#service-order-tab").click(function () {
        $(".tab-content").hide();
        $("#service_order_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        initializeInnerTabs();
    });

    // Event listener for Consultation tab
    $("#surgery-order-tab").click(function () {
        $(".tab-content").hide();
        $("#surgery_order_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // Event listener for Screening tab
    $("#screening-tab").click(function () {
        $(".tab-content").hide();
        $("#screening_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // Event listener for Screening tab
    $("#positive-screening-findings-care-plan-tab").click(function () {
        $(".tab-content").hide();
        $("#positive_screening_findings_care_plan_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // Event listener for Screening tab
    $("#transfer-patient-tab").click(function () {
        $(".tab-content").hide();
        $("#transfer_patient_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // Event listener for Screening tab
    $("#interdisciplinary-patient-tab").click(function () {
        $(".tab-content").hide();
        $("#interdisciplinary_patient_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // Event listener for Screening tab
    $("#prescription-tab").click(function () {
        $(".tab-content").hide();
        $("#prescription_content").show();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // $(".serviceId1").select2({
    if ($(".serviceId1").data("select2")) {
        $(".serviceId1").select2("destroy");
    }

    $(".serviceId1")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $(".serviceId1").parent(),
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
            // escapeMarkup: function (markup) { return markup; },
            // templateResult: formatRepo,
            // templateSelection: formatRepoSelection
        });

    // $("#addInPatientServiceManuel").click(function () {

    $("#inpatient_save_btn").click(function () {
        // Serialize data from all forms
        var historyAndPhysicalExaminationFormData = $(
            "#history_and_physical_examination_form"
        ).serialize();
        var allergyFormData = $("#allergy_form").serialize();
        var medicationSheetFormData = $("#medication_sheet_form").serialize();
        var operativeReportFormData = $("#operative_report_form").serialize();
        var diagnosisFormData = $("#diagnosis_form").serialize();
        var operativeSurgeonAddingFormData = $(
            "#operative_surgeon_adding_form"
        ).serialize();
        var operativeReportTimingAddingFormData = $(
            "#operative_report_time_adding_form"
        ).serialize();
        var categoryAndAnesthesiaFormData = $(
            "#category_and_anesthesia_form"
        ).serialize();
        var surgicalProcedureDocumentationFormData = $(
            "#surgical_procedure_documentation_form"
        ).serialize();
        var operativeInstructionFormData = $(
            "#operative_instruction_form"
        ).serialize();

        var inpatientServiceFormData = $("#inpatient_service_form").serialize();

        var hiddenvalueFormData = $("#hidden_value_form").serialize();
        console.log(hiddenvalueFormData);

        // Combine serialized data into one string using '&' to concatenate the serialized data
        var combinedData =
            historyAndPhysicalExaminationFormData +
            "&" +
            allergyFormData +
            "&" +
            allergyFormData +
            "&" +
            medicationSheetFormData +
            "&" +
            operativeReportFormData +
            "&" +
            diagnosisFormData +
            "&" +
            operativeReportTimingAddingFormData +
            "&" +
            operativeSurgeonAddingFormData +
            "&" +
            categoryAndAnesthesiaFormData +
            "&" +
            surgicalProcedureDocumentationFormData +
            "&" +
            operativeInstructionFormData +
            "&" +
            inpatientServiceFormData +
            "&" +
            hiddenvalueFormData;

        $.ajax({
            url: BASE_URL + "/inpatient",
            type: "POST",
            data: combinedData,
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
                        location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    }).then(function () {
                        location.reload();
                    });
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;

                    // Clear previous error messages
                    // $(".error-text").remove();

                    // Display errors for medication sheet fields
                    $.each(errors, function (key, value) {
                        // Check if the error is for the medication sheet
                        if (
                            key.startsWith("medication_name.") ||
                            key.startsWith("dose.") ||
                            key.startsWith("route.") ||
                            key.startsWith("frequency.") ||
                            key.startsWith("duration_of_therapy.")
                        ) {
                            var fieldParts = key.split(".");
                            var fieldIndex = fieldParts[1];
                            var fieldName = fieldParts[0];
                            var targetRow = $("#medical_sheet_tbody tr").eq(
                                fieldIndex
                            );
                            var targetCell = targetRow.find(
                                `input[name="${fieldName}[]"]`
                            );
                            targetCell.siblings(".error-text").remove();
                            // Append error message below the input field
                            if (targetCell.length > 0) {
                                targetCell.after(
                                    `<span class="text-danger error-text">${value[0]}</span>`
                                );
                            }
                        } else if (
                            key.startsWith("inpatient_manual_service.") ||
                            key.startsWith("inpatient_manual_service_code.") ||
                            key.startsWith(
                                "inpatient_manual_service_quantity."
                            ) ||
                            key.startsWith("inpatient_manual_service_price.") ||
                            key.startsWith(
                                "inpatient_manual_service_discount_percentage."
                            ) ||
                            key.startsWith(
                                "inpatient_manual_service_discount."
                            ) ||
                            key.startsWith("inpatient_manual_service_tax.") ||
                            key.startsWith(
                                "inpatient_manual_service_total_amount."
                            ) ||
                            key.startsWith("inpatient_service_total_amount.") ||
                            key.startsWith("inpatient_service_discount.") ||
                            key.startsWith("inpatient_service_tax_amount.") ||
                            key.startsWith(
                                "inpatient_service_discount_percentage."
                            ) ||
                            key.startsWith("inpatient_manual_service.")
                        ) {
                            var fieldParts = key.split(".");
                            var fieldIndex = fieldParts[1];
                            var fieldName = fieldParts[0];
                            var targetRow = $(
                                "#in_patient_service_order_tbody tr"
                            ).eq(fieldIndex);
                            var targetCell = targetRow.find(
                                `input[name="${fieldName}[${fieldIndex}]"]`
                            ); // Match the dynamic input name

                            // Remove any existing error message before appending a new one
                            targetCell.siblings(".error-text").remove();
                            // Append error message below the input field
                            if (targetCell.length > 0) {
                                targetCell.after(
                                    `<span class="text-danger error-text">${value[0]}</span>`
                                );
                            }
                        }
                        // else if (
                        //     key.startsWith("post_op_diagnosis_code.") ||
                        //     key.startsWith("post_op_diagnosis_name.") ||
                        //     key.startsWith("post_op_diagnosis_search.")
                        // ) {
                        //     var fieldParts = key.split(".");
                        //     var fieldIndex = fieldParts[1];
                        //     var fieldName = fieldParts[0];
                        //     var targetRow = $("#post_op_diagnosis_tbody tr").eq(
                        //         fieldIndex
                        //     );
                        //     var targetCell = targetRow.find(
                        //         `input[name="${fieldName}[]"]`
                        //     );

                        //     // Append error message below the input field
                        //     if (targetCell.length > 0) {
                        //         targetCell.after(
                        //             `<span class="text-danger error-text">${value[0]}</span>`
                        //         );
                        //     }
                        // }
                        else if (
                            key.startsWith("diagnosis_search.") ||
                            key.startsWith("seq_order.") ||
                            key.startsWith("diagnosis_code.") ||
                            key.startsWith("diagnosis_name.")
                        ) {
                            var fieldParts = key.split(".");
                            var fieldIndex = fieldParts[1]; // Extract index from the error key
                            var fieldName = fieldParts[0]; // Field name (e.g., "diagnosis_search")

                            // Find the corresponding input/select field in the diagnosis section
                            var targetCell = $(
                                `#diagnosis-table-${fieldIndex}`
                            ).find(
                                `input[name="${fieldName}[${fieldIndex}]"], 
                 select[name="${fieldName}[${fieldIndex}]"]`
                            );

                            // Remove any existing error message before appending a new one
                            targetCell.siblings(".error-text").remove();

                            // Append error message below the input/select field
                            if (targetCell.length > 0) {
                                // targetCell.after(
                                //     `<span class="text-danger error-text">${value[0]}</span>`
                                // );
                                if (targetCell.is("select")) {
                                    var select2Container =
                                        targetCell.next(".select2-container");
                                    if (select2Container.length > 0) {
                                        select2Container.after(
                                            `<span class="text-danger error-text">${value[0]}</span>`
                                        );
                                    }
                                } else {
                                    targetCell.after(
                                        `<span class="text-danger error-text">${value[0]}</span>`
                                    );
                                    console.log("test");
                                }
                            }
                        } else if (
                            key.startsWith("post_op_diagnosis_search.") ||
                            key.startsWith("post_op_seq_order.") ||
                            key.startsWith("post_op_diagnosis_code.") ||
                            key.startsWith("post_op_diagnosis_name.")
                        ) {
                            var fieldParts = key.split(".");
                            var fieldIndex = fieldParts[1]; // Extract index from the error key
                            var fieldName = fieldParts[0]; // Field name (e.g., "diagnosis_search")

                            // Find the corresponding input/select field in the diagnosis section
                            var targetCell = $(
                                `#post-op-diagnosis-table-${fieldIndex}`
                            ).find(
                                `input[name="${fieldName}[${fieldIndex}]"], 
                 select[name="${fieldName}[${fieldIndex}]"]`
                            );

                            // Remove any existing error message before appending a new one
                            targetCell.siblings(".error-text").remove();

                            // Append error message below the input/select field
                            if (targetCell.length > 0) {
                                // targetCell.after(
                                //     `<span class="text-danger error-text">${value[0]}</span>`
                                // );
                                if (targetCell.is("select")) {
                                    var select2Container =
                                        targetCell.next(".select2-container");
                                    if (select2Container.length > 0) {
                                        select2Container.after(
                                            `<span class="text-danger error-text">${value[0]}</span>`
                                        );
                                    }
                                } else {
                                    targetCell.after(
                                        `<span class="text-danger error-text">${value[0]}</span>`
                                    );
                                    console.log("test");
                                }
                            }
                        } else {
                            // For other errors, handle them as per your existing logic
                            $("." + key + "_error").text(value[0]);
                        }
                    });
                } else {
                    console.error("Error:", xhr);
                }
            },
        });
    });

    $("#inpatient_update_btn").click(function () {
        var historyAndPhysicalExaminationFormData = $(
            "#history_and_physical_examination_form"
        ).serialize();
        var allergyFormData = $("#allergy_form").serialize();
        var medicationSheetFormData = $("#medication_sheet_form").serialize();
        var operativeReportFormData = $("#operative_report_form").serialize();
        var diagnosisFormData = $("#diagnosis_form").serialize();
        var operativeSurgeonAddingFormData = $(
            "#operative_surgeon_adding_form"
        ).serialize();
        var operativeReportTimingAddingFormData = $(
            "#operative_report_time_adding_form"
        ).serialize();
        var categoryAndAnesthesiaFormData = $(
            "#category_and_anesthesia_form"
        ).serialize();
        var surgicalProcedureDocumentationFormData = $(
            "#surgical_procedure_documentation_form"
        ).serialize();
        var operativeInstructionFormData = $(
            "#operative_instruction_form"
        ).serialize();
        var inpatientServiceFormData = $("#inpatient_service_form").serialize();

        var hiddenvalueFormData = $("#hidden_value_form").serialize();
        console.log(hiddenvalueFormData);

        // Combine serialized data into one string using '&' to concatenate the serialized data
        var combinedData =
            historyAndPhysicalExaminationFormData +
            "&" +
            allergyFormData +
            "&" +
            allergyFormData +
            "&" +
            medicationSheetFormData +
            "&" +
            operativeReportFormData +
            "&" +
            diagnosisFormData +
            "&" +
            operativeReportTimingAddingFormData +
            "&" +
            operativeSurgeonAddingFormData +
            "&" +
            categoryAndAnesthesiaFormData +
            "&" +
            surgicalProcedureDocumentationFormData +
            "&" +
            operativeInstructionFormData +
            "&" +
            inpatientServiceFormData +
            "&" +
            hiddenvalueFormData;

        // Define AJAX request URL and method
        var ajaxUrl =
            BASE_URL + "/update-inpatient/" + $("#in_patient_id").val();
        var method = "PUT";

        // AJAX request
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: combinedData,
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
                        location.reload();
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
                    // console.error("Error:", xhr);
                }
            },
        });
    });

    var counter = 1; // Counter to ensure unique IDs

    // Initialize select2 for the initial select element on page load
    // $(".diagnosis-search").select2({
    $(".diagnosis-search").each(function () {
        if ($(this).hasClass("select2-hidden-accessible")) {
            $(this).select2("destroy");
        }
    });

    // Remove old wrapper if exists
    $(".diagnosis-search").each(function () {
        if ($(this).parent().hasClass("position-relative")) {
            $(this).unwrap();
        }

        $(this)
            .wrap('<div class="position-relative"></div>')
            .select2({
                dropdownParent: $(this).parent(),
                width: "100%",
                placeholder: "Search Diagnosis Name",
                ajax: {
                    url: BASE_URL + "/medicalrecords-get-diagnosis-search-options", // URL of the endpoint
                    dataType: "json",
                    delay: 250,
                    data: function (params) {
                        return {
                            diagnosisName: params.term, // Query parameter
                        };
                    },
                    processResults: function (data) {
                        return {
                            results: $.map(data.data, function (value, key) {
                                // console.log(value.diagnosisListId);

                                return {
                                    id: value.diagnosisListId, // diagnosisListId (Seq number)
                                    text: value.diagnosisName_en, // Diagnosis Name
                                    code: value.diagnosisCode, // Diagnosis Code
                                };
                            }),
                        };
                    },
                    cache: true,
                }
            });
    });
    // Initialize the counter with 1 for the first diagnosis
    var counter = 1;

    // Add more diagnosis when the button is clicked
    $(".pre-op-add-more-diagnosis").click(function () {
        // Get the current number of diagnosis repeater blocks
        var currentCount = $(".diagnosis-repeater").length;

        // Calculate the new sequence order (the next number in sequence)
        var newSeqOrder = currentCount + 1;
        console.log(newSeqOrder);
        // Clone the diagnosis repeater block
        var newDiagnosis = $(`
            <div class="diagnosis-repeater pt-0 pt-md-2 post-op-diagnosis-repeater">
                <div class="d-flex border rounded position-relative pe-0">
                    <div class="row w-100 p-3 align-items-center" id="diagnosis-table-${currentCount}">
                        <div class="col-md-3">
                            <div class="mb-3">
                                <label class="form-label labe" for="diagnosis_search_${newSeqOrder}">Search</label>
                                <div class="position-relative w-100">
                                    <select id="diagnosis_search_${newSeqOrder}" name="diagnosis_search[${currentCount}]" 
                                        class="diagnosis-search w-100" 
                                        data-allow-clear="true">
                                        <option value="">Search Diagnosis</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="mb-3">
                                <label class="form-label labe" for="seq_order_${newSeqOrder}">Seq. Order</label>
                                <input type="text" id="seq_order_${newSeqOrder}" name="seq_order[${currentCount}]" class="form-control w-100 text-center" value="${newSeqOrder}" readonly>
                            </div>
                            <input type="hidden" name="diagnosis_id[${currentCount}]" value="">
                        </div>
                        <div class="col-md-3">
                            <div class="mb-3">
                                <label class="form-label labe" for="diagnosis_code_${newSeqOrder}">Diagnosis Code</label>
                                <input type="text" id="diagnosis_code_${newSeqOrder}" name="diagnosis_code[${currentCount}]" class="form-control w-100 text-center" placeholder="">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="mb-3">
                                <label class="form-label labe" for="diagnosis_name_${newSeqOrder}">Diagnosis Name</label>
                                <input type="text" id="diagnosis_name_${newSeqOrder}" name="diagnosis_name[${currentCount}]" class="form-control w-100 text-center" placeholder="">
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-column align-items-center justify-content-center border-start p-2 ">
                        <button class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill remove-diagnosis">
                            <i class="ti ti-x ti-lg cursor-pointer"></i>
                        </button>
                    </div>
                </div>
            </div>
        `); // Convert the HTML string to a jQuery object

        // Insert the new block after the last diagnosis repeater
        newDiagnosis.insertAfter($(".diagnosis-repeater").last());

        var $newSelect = newDiagnosis.find(`#diagnosis_search_${newSeqOrder}`);
        $newSelect.select2({
            dropdownParent: $newSelect.closest('.position-relative'),
            width: '100%',
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
                    // console.log(data);
                    return {
                        results: $.map(data.data, function (value, key) {
                            // console.log(value.diagnosisListId);
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
    });


    // Remove diagnosis repeater block
    $(document).on("click", ".remove-diagnosis", function () {
        $(this).closest(".diagnosis-repeater").remove();
    });



    // Function to update the sequence order of all diagnosis repeaters
    function updateSequenceOrder() {
        // Loop through all diagnosis repeaters and update the sequence order
        $(".diagnosis-repeater").each(function (index) {
            // Set the Seq. Order field to the current index + 1
            $(this)
                .find('input[id^="seq_order_"]')
                .val(index + 1);

            // Update the ID attributes to match the new sequence order
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

    // Delegate select2:select event handler for dynamically added elements
    // Pre-op diagnosis select2:select handler
    $(document).on("select2:select", ".diagnosis-repeater .diagnosis-search", function (e) {
        var selectedData = e.params.data;

        var $container = $(this).closest(".diagnosis-repeater");

        $container.find('input[name^="diagnosis_id"]').val(selectedData.id);
        $container.find('input[id^="diagnosis_code_"]').val(selectedData.code);
        $container.find('input[id^="diagnosis_name_"]').val(selectedData.text);
    });

    // Post-op diagnosis select2:select handler
    $(document).on("select2:select", ".post-op-diagnosis-repeater .diagnosis-search", function (e) {
        var selectedData = e.params.data;

        var $container = $(this).closest(".post-op-diagnosis-repeater");

        $container.find('input[id^="`post_op_diagnosis_id_`"]').val(selectedData.id);
        $container.find('input[id^="post_op_diagnosis_code_"]').val(selectedData.code);
        $container.find('input[id^="post_op_diagnosis_name_"]').val(selectedData.text);
    });

    // post op diagnosis
    // Initialize the counter with 1 for the first diagnosis
    var counter = 1;

    // Add more diagnosis when the button is clicked
    $(".post-op-add-more-diagnosis").click(function () {
        // Get the current number of diagnosis repeater blocks
        var currentCount = $(".post-op-diagnosis-repeater").length;

        // Calculate the new sequence order (the next number in sequence)
        var newSeqOrder = currentCount + 1;

        // Clone the diagnosis repeater block
        var newDiagnosis = $(`
    <div class=" pt-0 pt-md-2 post-op-diagnosis-repeater">
        <div class="d-flex border rounded position-relative pe-0">


<div class="card-body">
        <div class="row g-4 align-items-end" id="post-op-diagnosis_tbody_${currentCount}">

            <!-- Search -->
            <div class="col-3 d-flex" style="flex-direction: column;">
                <label class="form-label labe" for="post_op_diagnosis_search_${newSeqOrder}">
                    Search
                </label>

                <select
                    id="post_op_diagnosis_search_${newSeqOrder}"
                    name="post_op_diagnosis_search[${newSeqOrder}]"
                    class="select2 form-select diagnosis-search"
                    data-allow-clear="true">
                    <option value="">Search Diagnosis</option>
                </select>
            </div>

            <!-- Sequence -->
            <div class="col-3">
                <label class="form-label labe" for="post_op_seq_order_${newSeqOrder}">
                    Seq. Order
                </label>

                <input
                    type="text"
                    id="post_op_seq_order_${newSeqOrder}"
                    name="post_op_seq_order[${newSeqOrder}]"
                    class="form-control text-center"
                    value="${newSeqOrder}"
                    readonly>

                <input
                    type="hidden"
                    id="post_op_diagnosis_id_${newSeqOrder}"
                    name="post_op_diagnosis_id[${newSeqOrder}]"
                    value="">
            </div>

            <!-- Diagnosis Code -->
            <div class="col-3">
                <label class="form-label labe" for="post_op_diagnosis_code_${newSeqOrder}">
                    Diagnosis Code
                </label>

                <input
                    type="text"
                    id="post_op_diagnosis_code_${newSeqOrder}"
                    name="post_op_diagnosis_code[${newSeqOrder}]"
                    class="form-control"
                    readonly>
            </div>

            <!-- Diagnosis Name -->
            <div class="col-3">
                <label class="form-label labe" for="post_op_diagnosis_name_${newSeqOrder}">
                    Diagnosis Name
                </label>

                <input
                    type="text"
                    id="post_op_diagnosis_name_${newSeqOrder}"
                    name="post_op_diagnosis_name[${newSeqOrder}]"
                    class="form-control"
                    readonly>
            </div>

           

        </div>
    </div>
    <div class="d-flex flex-column align-items-center justify-content-center border-start p-2 ">
        <button class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill remove-diagnosis">
            <i class="ti ti-x ti-lg cursor-pointer"></i>
        </button>
        </div>
    </div>
    `); // Convert the HTML string to a jQuery object

        // Insert the new block after the last diagnosis repeater
        newDiagnosis.insertAfter($(".post-op-diagnosis-repeater").last());

        // Initialize select2 for the newly added select element
        // newDiagnosis.find(`#post_op_diagnosis_search_${newSeqOrder}`).select2({
        var $newSelect = newDiagnosis.find(`#post_op_diagnosis_search_${newSeqOrder}`);
        $newSelect.select2({
            dropdownParent: $newSelect.closest('.position-relative'),
            width: '100%',
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
                    // console.log(data);
                    return {
                        results: $.map(data.data, function (value, key) {
                            // console.log(value.diagnosisListId);
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
    });

    $(document).on("click", ".remove-diagnosis", function () {
        // Find the parent diagnosis repeater block and remove it
        $(this).closest(".post-op-diagnosis-repeater").remove();
    });

    // Handle click event for the delete icon
    $(document).on("click", "[data-repeater-delete]", function () {
        var $repeater = $(this).closest(".diagnosis-repeater, .post-op-diagnosis-repeater");
        var isPostOp = $repeater.hasClass("post-op-diagnosis-repeater");

        var repeaterClass = isPostOp ? ".post-op-diagnosis-repeater" : ".diagnosis-repeater";
        var totalRepeaters = $(repeaterClass).length;

        if (totalRepeaters === 1) {
            // If it's the last repeater, just clear the input fields
            $repeater.find("input").val("");
            $repeater.find("select").val(null).trigger("change"); // Reset select2

            // Reset the Seq. Order to 1
            var seqInput = isPostOp ? 'input[id^="post_op_seq_order_"]' : 'input[id^="seq_order_"]';
            $repeater.find(seqInput).val(1);
        } else {
            // Remove the clicked repeater
            $repeater.remove();

            // Recalculate sequence order for remaining repeaters
            if (isPostOp) {
                updatePostOpSequenceOrder();
            } else {
                updateSequenceOrder();
            }
        }
    });



    // Function to update the sequence order of all diagnosis repeaters
    function updatePostOpSequenceOrder() {
        // Loop through all diagnosis repeaters and update the sequence order
        $(".post-op-diagnosis-repeater").each(function (index) {
            // Set the Seq. Order field to the current index + 1
            $(this)
                .find('input[id^="post_op_seq_order_"]')
                .val(index + 1);

            // Update the ID attributes to match the new sequence order
            var newSeqOrder = index + 1;
            $(this)
                .find("table")
                .attr("id", `post-op-diagnosis-table-${newSeqOrder}`);
            $(this)
                .find("select")
                .attr("id", `post_op_diagnosis_search_${newSeqOrder}`);
            $(this)
                .find('input[id^="post_op_seq_order_"]')
                .attr("id", `post_op_seq_order_${newSeqOrder}`);
            $(this)
                .find('input[id^="post_op_diagnosis_code_"]')
                .attr("id", `post_op_diagnosis_code_${newSeqOrder}`);
            $(this)
                .find('input[id^="post_op_diagnosis_name_"]')
                .attr("id", `post_op_diagnosis_name_${newSeqOrder}`);
        });
    }

    // Delegate select2:select event handler for dynamically added elements
    $(document).on("select2:select", ".diagnosis-search", function (e) {
        var selectedData = e.params.data;
        // console.log(selectedData);

        // Find the closest row to the select box that was changed
        var $row = $(this).closest("tr");

        $row.find('input[name^="post_op_diagnosis_id"]').val(selectedData.id); // Fill Diagnosis Code with the selected code

        // Populate only the Diagnosis Code and Diagnosis Name fields
        $row.find('input[id^="post_op_diagnosis_code_"]').val(
            selectedData.code
        ); // Fill Diagnosis Code with the selected code
        $row.find('input[id^="post_op_diagnosis_name_"]').val(
            selectedData.text
        ); // Fill Diagnosis Name with the selected name

        // The sequence order field (Seq. Order) remains unchanged
    });

    $("#history_and_physical_examination_content").show();




    let rowIndex = 1;
    let currentRowIndex = -1;

    $(".add-more-medications").on("click", function () {
        let newRow = `
            <tr>
                        <td style="width: 260px;  padding: 12px; padding-bottom: 55px;"><select id="medications_search_${rowIndex}" name="medications_search[]" class="select2 form-select form-select-lg medications-search" data-allow-clear="true">
                                                <!-- Options here -->
                                            </select></td>
                        <td><input type="text" name="medication_start_date[]" class="form-control"></td>                    
                        <td><input type="text" name="medication_discontinue_date[]" class="form-control"></td>
                        <td><input type="text" name="medication_dosage[]" class="form-control"></td>
                        <td><input type="text" name="medication_frequency[]" class="form-control"></td>
                        <td><input type="text" name="medication_bill_date[]" class="form-control"></td>
                        <td><select id="medication_allergy_${rowIndex}" name="medication_allergy[]" class="form-select">
                                                <option selected> </option>
                                                <option value="1">Yes</option>
                                                <option value="0">No</option>
                                            </select></td>
                                              <td>
                                              <div class="d-flex">
                                                <button 
                                                    type="button" 
                                                    class="btn rounded-pill btn-icon btn-label-primary view-medicine-btn me-2" 
                                                    data-medicine-id=""
                                                    style="display: none !important;">
                                                    <i class="ti ti-eye"></i>
                                                </button>
                                                <button 
                                                    type="button" 
                                                    class="btn rounded-pill btn-icon btn-label-primary remove-medicine" 
                                                    data-medicine-id=""
                                                    style="display: none !important;">
                                                    <i class="ti ti-trash"></i>
                                                </button>
                                                </div>
                                    </td>
   

                    </tr>
        `;



        // Append the new row to the table body
        $("#medication_tbody_div").append(newRow);

        // Initialize select2 for the newly appended select element
        setTimeout(function () {
            let lastSelect = $("#medication_tbody_div").find("select.medications-search").last();
            initializeSelect2(lastSelect);
        }, 0);

        // Increment the rowIndex for the next new row
        rowIndex++;
    });


    // function populatMedicationData(medicationData) {
    //     $("#medication_tbody_div").empty();

    //     medicationData.forEach((medication, index) => {
    //         let newRow = `
    //             <tr>
    //                 <td>
    //                     <select id="medications_search_${index}" name="medications_search[]" class="select2 form-select form-select-lg medications-search" data-allow-clear="true">
    //                         <option value="${medication.medicineId}" selected>${medication.medicine.tradeName
    //             }</option>
    //                     </select>
    //                 </td>
    //                 <td><input type="text" name="medication_start_date[]" class="form-control" value="${medication.startDate || ""
    //             }"></td>
    //                 <td><input type="text" name="medication_discontinue_date[]" class="form-control" value="${medication.discontinueDate || ""
    //             }"></td>
    //                 <td><input type="text" name="medication_dosage[]" class="form-control" value="${medication.dosage || ""
    //             }"></td>
    //                 <td><input type="text" name="medication_frequency[]" class="form-control" value="${medication.frequency || ""
    //             }"></td>
    //                 <td>
    //                     <select id="medication_allergy_${index}" name="medication_allergy[]" class="form-select">
    //                         <option value="" ${medication.is_allergiesUnknown == null
    //                 ? "selected"
    //                 : ""
    //             }></option>
    //                         <option value="1" ${medication.is_allergiesUnknown == 1
    //                 ? "selected"
    //                 : ""
    //             }>Yes</option>
    //                         <option value="0" ${medication.is_allergiesUnknown == 0
    //                 ? "selected"
    //                 : ""
    //             }>No</option>
    //                     </select>
    //                 </td>

    //             <td>
    //                 <button 
    //                     type="button" 
    //                     class="btn rounded-pill btn-icon btn-label-primary " 
    //                     id="view-medicine-btn"
    //                     data-medicine-id="${medication.medicineId}">
    //                      <i class="ti ti-eye"></i>
    //                 </button>
    //                 <button 
    //                 type="button" 
    //                 class="btn rounded-pill btn-icon btn-label-primary remove-medicine" 
    //                 id="remove-medicine"
    //                 data-medicine-id="${medication.medicineId}"
    //                 >
    //                 <i class="ti ti-trash"></i>
    //               </button>
    //             </td>
    //             </tr>
    //         `;

    //         $("#medication_tbody_div").append(newRow);

    //         $(`#medications_search_${index}`).select2({
    //             placeholder: "Search Medications Name",
    //             ajax: {
    //                 url:
    //                     BASE_URL + "/medicalrecords-get-medications-search-options",
    //                 dataType: "json",
    //                 delay: 250,
    //                 data: function (params) {
    //                     return {
    //                         medicationName: params.term,
    //                     };
    //                 },
    //                 processResults: function (data) {
    //                     return {
    //                         results: $.map(data.data, function (value, key) {
    //                             return {
    //                                 id: value.medicineId,
    //                                 text: value.tradeName,
    //                             };
    //                         }),
    //                     };
    //                 },
    //                 cache: true,
    //             },
    //         });
    //     });
    // }

    function initializeSelect2(element) {
        if (element.hasClass("select2-hidden-accessible")) {
            element.select2("destroy");
        }

        element.css("width", "100%");

        if (!element.parent().hasClass("position-absolute")) {
            element.wrap('<div class="position-absolute"></div>');
        } else {
            element.parent().css("width", "100%");
        }

        element.select2({
            dropdownParent: element.parent(),
            width: "100%",
            placeholder: "Search Medications Name",
            allowClear: true,
            ajax: {
                url: BASE_URL + "/medicalrecords-get-medications-search-options",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        medicationName: params.term, // Query parameter
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

        element.next(".select2-container").css("width", "100%");
    }


    $(document).on("select2:select", ".medications-search", function (e) {
        let selectedId = e.params.data.id;

        let $row = $(this).closest("tr");
        let $eyeBtn = $row.find(".view-medicine-btn");
        let $mDremovebtn = $row.find(".remove-medicine");

        $eyeBtn.attr("data-medicine-id", selectedId);
        $eyeBtn.show();
        $mDremovebtn.show();

    });


    $(document).on("click", ".view-medicine-btn", function () {
        $('#medicineForm')[0].reset();
        $("#medicine-details-modal").modal("show");

        const medicineId = $(this).data("medicine-id");
        const clientId = $("#client_id").val();
        const inPatientId = $("#in_patient_id").val();

        console.log("Clicked Medicine ID:", medicineId);
        $("#medicineId").val(medicineId);

        $.ajax({
            url: BASE_URL + "/get-medicine-details-inpatient/" + medicineId + "/" + clientId + "/" + inPatientId,
            type: "GET",
            success: function (response) {
                // console.log("Medicine details:", response);
                // console.log("Medicine 1:", response.data.strength);
                $("#strength").val(response.data.strength);
                $("#scientificCodeAbsenceReason").val(response.data.scientificCodeAbsenceReason).trigger("change");
                $("#selectionReason").val(response.data.selectionReason).trigger("change");
                $("#pharmacistSubsitute").val(response.data.pharmacistSubsitute).trigger("change");
                $("#medicineStartDate").val(response.data.startDate);
                $("#discontinueDate").val(response.data.discontinueDate);
                $("#frequency").val(response.data.frequency);
                $("#txtPeriod").val(response.data.period);
                $("#slcPeriodUnit").val(response.data.periodUnit).trigger("change");
                $("#txtDoseQuantity").val(response.data.dosage);
                $("#slcDose").val(response.data.doseUnit).trigger("change");
                $("#timeInstruction").val(response.data.timeInstruction).trigger("change");
                $("#refillCount").val(response.data.refillCount);
                $("#dosageInstruction").val(response.data.dosageInstruction);
                $("#patientInstruction").val(response.data.patientInstruction);
                $("#additionalSupportingInfo").val(response.data.additionalSupportingInfo);
                $("#txtDuration").val(response.data.duration);
                $("#slcDurationUnit").val(response.data.durationUnit).trigger("change");
                $("#slcRouteAdmin").val(response.data.routeAdmin).trigger("change");

            },
            error: function (error) {
                console.error("Error fetching medicine details:", error);
            }
        });

        currentRowIndex = $(this).closest("tr").index();
        console.log("Current Row Index:", currentRowIndex);

    });


    $("#save-medicine-details").on("click", function () {
        const medicineDetails = {
            patientAdmissionId: $("#patient_admission_id").val(),
            clientId: $("#client_id").val(),
            inPatientId: $("#in_patient_id").val(),
            medicineId: $("#medicineId").val(),
            routeAdmin: $("#slcRouteAdmin").val(),
            scientificCode: $("#scientificCode").val(),
            scientificCodeAbsenceReason: $("#scientificCodeAbsenceReason").val(),
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
            additionalSupportingInfo: $("#additionalSupportingInfo").val()
        }

        console.log("Medicine Details:", medicineDetails);

        $.ajax({
            url: BASE_URL + "/save-medicine-details-inpatient",
            type: "POST",
            data: JSON.stringify(medicineDetails),
            contentType: "application/json",
            success: function (response) {
                console.log("Data saved successfully:", response);
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                }).then(function () {
                    $("#medicine-details-modal").modal("hide");
                });
            },
            error: function (error) {
                console.error("Error saving data:", error);
                Swal.fire({
                    icon: "error",
                    text: response.message,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                })
            }
        });

        $(document).trigger("medicineSaved", [medicineDetails]);
    });

    $(document).on("click", "#Prescription-Print", function (e) {
        e.preventDefault();

        const inPatientId = $("#in_patient_id").val();
        const clientId = $("#client_id").val();


        if (inPatientId) {
            window.open(BASE_URL + "/print-prescription-inpatient/" + inPatientId + "/" + clientId);
        } else {
            alert("inPatientId is missing!");
        }

    });


    flatpickr("#medicineStartDate", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
    });

    flatpickr("#discontinueDate", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
    });


    $(document).on("click", ".remove-medicine", function () {
        const $row = $(this).closest("tr");
        const medicineId = $(this).data("medicine-id");
        const inPatientId = $("#in_patient_id").val();

        if (medicineId) {
            $.ajax({
                url: BASE_URL + "/remove-medicine-inpatient",
                method: "POST",
                data: {
                    medicine_id: medicineId,
                    inPatient_id: inPatientId,
                    _token: $('meta[name="csrf-token"]').attr('content')
                },
                success: function (response) {
                    console.log("Medicine removed:", response);
                },
                error: function (xhr) {
                    console.error('Error removing medicine:', xhr.responseText);
                }
            });
        }

        $row.remove();
        console.log("Removed medication with ID:", medicineId);
    });





});

$(document).on("input", "#frequency", function () {
    let frequencyValue = $(this).val();

    $("#medication_tbody_div tr").eq(currentRowIndex).find('input[name="medication_frequency[]"]').val(frequencyValue);
});
// auto appending in table row 

$(document).on("input", "#txtDoseQuantity", function () {
    let dosage = $(this).val();

    $("#medication_tbody_div tr").eq(currentRowIndex).find('input[name="medication_dosage[]"]').val(dosage);
});
$(document).on("input", "#medicineStartDate", function () {
    let start_date = $(this).val();

    $("#medication_tbody_div tr").eq(currentRowIndex).find('input[name="medication_start_date[]"]').val(start_date);
});
$(document).on("input", "#discontinueDate", function () {
    let discontinue_date = $(this).val();

    $("#medication_tbody_div tr").eq(currentRowIndex).find('input[name="medication_discontinue_date[]"]').val(discontinue_date);
});

// Handle changes in Discount Percentage field
$(document).on("input", ".service-order-disc-percentage input", function () {
    var $row = $(this).closest("tr");

    // Get values from respective fields
    var price = parseFloat($row.find(".service-order-price input").val()) || 0;
    var discountPercentage = parseFloat($(this).val()) || 0;
    var vatPercentage =
        parseFloat($row.find(".service-order-vat-percentage input").val()) || 0;

    // Calculate discount amount based on percentage
    var discountAmount = (price * discountPercentage) / 100;
    // console.log(discountAmount);
    // Update the discount amount field
    $row.find(".service-order-disc-amount input").val(
        discountAmount.toFixed(2)
    );
    // alert("d");
    // Calculate total price after discount and VAT
    calculateServiceOrderTotalAmount($row, discountAmount);
});

// Handle changes in Discount Amount field
$(document).on("input", ".service-order-disc-amount input", function () {
    var $row = $(this).closest("tr");
    // Get values from respective fields
    var price = parseFloat($row.find(".service-order-price input").val()) || 0;
    var discountAmount = parseFloat($(this).val()) || 0;
    // console.log(discountAmount);
    // console.log($row);
    // Update total amount based on discount amount
    calculateServiceOrderTotalAmount($row, discountAmount);
});

// Function to calculate the total amount based on the discount
function calculateServiceOrderTotalAmount($row, discountAmount) {
    var price = parseFloat($row.find(".service-order-price input").val()) || 0;
    var vatPercentage =
        parseFloat($row.find(".service-order-vat-percentage input").val()) || 0;

    // Calculate price after discount
    var priceAfterDiscount = price - discountAmount;

    // Calculate VAT amount
    var vatAmount = (priceAfterDiscount * vatPercentage) / 100;

    // Calculate total amount (price after discount + VAT)
    var totalAmount = priceAfterDiscount + vatAmount;
    // console.log(vatAmount);
    // Update VAT amount and total amount fields
    $row.find(".service-order-vat-amount input").val(vatAmount.toFixed(2));
    $row.find(".service-order-total-amount input").val(totalAmount.toFixed(2));

    var discountAmountSum = 0;
    var vatAmountSum = 0;
    var totalAmountSum = 0;

    $("#service_order_table tbody tr").each(function () {
        // Find the input field in the 6th column (Discount Amount column)
        var discountAmount =
            parseFloat($(this).find("td:nth-child(6) input").val()) || 0;

        var vatAmount =
            parseFloat($(this).find("td:nth-child(8) input").val()) || 0;

        var totalAmount =
            parseFloat($(this).find("td:nth-child(9) input").val()) || 0;

        // Add the value to the running total
        discountAmountSum += discountAmount;
        vatAmountSum += vatAmount;
        totalAmountSum += totalAmount;

        // console.log(discountAmountSum);
    });

    // Display the calculated totals in the corresponding sections
    $("#total_amount_sum").val(totalAmountSum.toFixed(2)); // Update the input field for total amount
    $("#total_discount_sum_td").text(discountAmountSum.toFixed(2)); // Update total discount in table
    $("#total_discount_sum").val(discountAmountSum.toFixed(2));
    $("#total_vat_sum_td").text(vatAmountSum.toFixed(2)); // Update VAT percentage in table
    $("#total_vat_sum").val(vatAmountSum.toFixed(2)); // Update VAT percentage in table
    $("#service_order_net_amount").val(totalAmountSum.toFixed(2)); // Update the input field for total amount
}

function addAssistant(type) {
    // console.log(`addAssistant called for type: ${type}`);
    const containerClass =
        type === "surgeon"
            ? ".surgeon-assistant-div"
            : ".anesthetist-assistant-div";

    // Generate the static doctor options HTML once
    const doctorOptions = getDoctorOptions();

    const newAssistant = $(`
        <div style="display: flex; gap: 12px; margin-bottom: 12px;" class="${containerClass.slice(
        1
    )}">
            <select name="${type === "surgeon"
            ? "surgeon_doctor_assistant[]"
            : "anesthetists_doctor_assistant[]"
        }"
                class="selectpicker w-100"
                data-style="btn-default"
                data-live-search="true">
                ${doctorOptions}
            </select>
        </div>
    `);

    // Append the new assistant dropdown after the last assistant div in the container
    $(containerClass).last().after(newAssistant);

    // Initialize selectpicker on the new select element
    newAssistant.find(".selectpicker").selectpicker(); // Avoid calling refresh/destroy multiple times
}

// Function to parse surgeon_doctor_options JSON and create option elements
function getDoctorOptions() {
    const doctorOptionsStr = $("#surgeon_doctor_options").val();
    const doctorOptionsObj = JSON.parse(
        doctorOptionsStr.replace(/&quot;/g, '"')
    );

    let optionsHtml = '<option data-tokens="ketchup mustard">Select</option>';
    for (const [value, label] of Object.entries(doctorOptionsObj)) {
        optionsHtml += `<option value="${value}">${label}</option>`;
    }
    // console.log(optionsHtml); // Verify single generation of options
    return optionsHtml;
}

function initialPageLoad(inPatientId) {
    $.ajax({
        url: BASE_URL + "/edit-inpatient/" + inPatientId,
        type: "GET",
        success: function (response) {
            if (response.status === true) {

                var medicationData = response.data.medications;
                console.log("fdf", response.data.inPatient);

                $("#chiefComplaints").val(response.data.inPatient.chiefComplaints);
                $("#clinicalExamination").val(
                    response.data.inPatient.clinicalExamination
                );
                $("#pastMedicalAndHistory").val(
                    response.data.inPatient.pastMedicalAndHistory
                );
                $("#allergy").val(response.data.inPatient.allergy);
                $("#plan").val(response.data.inPatient.plan);
                $("#doctorsProgressNote").val();
                $("#anesthesia").val();
                $("#doctorOrder").val();

                if (response.data.inPatient.medication_orders.length > 0) {
                    populateMedicationTable(response.data.inPatient.medication_orders);
                }

                if (response.data.inPatient.pre_op_diagnoses.length > 0) {
                    populatePreOpDiagnoses(response.data.inPatient.pre_op_diagnoses);
                }

                if (response.data.inPatient.post_op_diagnoses.length > 0) {
                    populatePostOpDiagnoses(response.data.inPatient.post_op_diagnoses);
                }

                // $("#diagnosis_repeater_0").remove();
                // $("#post_diagnosis_repeater_0").remove();

                if (response.data.inPatient.surgeon_assistants.length) {
                    populateSurgeonAssistants(response.data.inPatient.surgeon_assistants);
                    $("#surgeon-assistant-div-0").remove();
                }

                // alert();
                if (response.data.inPatient.anesthetist_assistants.length > 0) {
                    populateAnesthesianAssistants(
                        response.data.inPatient.anesthetist_assistants
                    );
                    $("#anesthetist-assistant-div-0").remove();
                }

                $(
                    'input[name="categoryOfProcedure"][value="' +
                    response.data.inPatient.catgoryOfTheProcedure +
                    '"]'
                ).prop("checked", true);

                $(
                    'input[name="categoryOfProcedureTwo"][value="' +
                    response.data.inPatient.categoryOfProcedureTwo +
                    '"]'
                ).prop("checked", true);
                $(
                    'input[name="categoryOfProcedureThree"][value="' +
                    response.data.inPatient.categoryOfProcedureThree +
                    '"]'
                ).prop("checked", true);

                $(
                    'input[name="bloodLoss"][value="' +
                    response.data.inPatient.bloodLoss +
                    '"]'
                ).prop("checked", true);

                // Show or hide the estimated blood loss input based on the selected radio button
                if (response.data.inPatient.bloodLoss == 1) {
                    $("#estimated_amount_of_blood").show();
                    $("#estimated_amount_of_blood").val(
                        response.data.inPatient.estimated_amount_of_blood
                    );
                } else {
                    $("#estimated_amount_of_blood").hide();
                }

                $(
                    'input[name="bloodLoss_products"][value="' +
                    response.data.inPatient.bloodProductsTransfused +
                    '"]'
                ).prop("checked", true);

                // Show or hide the estimated blood loss input based on the selected radio button
                if (response.data.inPatient.bloodProductsTransfused == 1) {
                    $("#Unit_Transfused").show();
                    $("#Unit_Transfused").val(response.data.inPatient.unit_Transfused);
                } else {
                    $("#Unit_Transfused").hide();
                }

                $(
                    'input[name="tourniquet"][value="' +
                    response.data.inPatient.tourniquetUsed +
                    '"]'
                ).prop("checked", true);

                // Show or hide the estimated blood loss input based on the selected radio button
                if (response.data.inPatient.tourniquetUsed == 1) {
                    $("#Unit_Transfused").show();
                    $("#tourniquet_pressure").val(response.data.inPatient.pressure);
                    $("#pressure_time_inflated").val(
                        response.data.inPatient.timeInflated
                    );
                    $("#pressure_time_deflated").val(
                        response.data.inPatient.timeDeflated
                    );
                } else {
                    $("#Unit_Transfused").hide();
                }

                $(
                    'input[name="typeOfAnesthesia"][value="' +
                    response.data.inPatient.typeOfAnesthesia +
                    '"]'
                ).prop("checked", true);

                $("#time_Out").val(response.data.inPatient.time_Out);
                $("#time_In").val(response.data.inPatient.time_In);

                $("#surgeon_doctor").val(response.data.inPatient.surgeon_employeeId);
                $("#anesthetists_doctor").val(
                    response.data.inPatient.anesthetists_employeeId
                );

                $("#procedureName").val(response.data.inPatient.procedureName);
                $("#summeryOfSurgery").val(response.data.inPatient.summeryOfSurgery);
                $("#incision").val(response.data.inPatient.incision);
                $("#tissueRemoved").val(response.data.inPatient.tissueRemoved);
                $("#complications").val(response.data.inPatient.complications);

                // $("#surgeon_doctor").selectpicker('refresh');
                // $("#anesthetists_doctor").selectpicker('refresh');

                populateOperativeReportFiles(
                    response.data.inPatient.operative_report_files
                );
                populatMedicationData(medicationData);
                populateInpatientFiles(response.data.inPatient.inpatient_files);
                console.log(response.data.inPatient.service_orders_without_room);
                if (response.data.inPatient.service_orders_without_room.length > 0) {
                    populateInpatientServiceOrders(
                        response.data.inPatient.service_orders_without_room
                    );
                }
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

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);

    const formatted = date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return formatted; // Example: "23/04/2025, 02:43 PM"
}

function populatMedicationData(medicationData) {
    $("#medication_tbody_div").empty();

    medicationData.forEach((medication, index) => {
        let newRow = `
            <tr>
                <td>
                    <select id="medications_search_${index}" name="medications_search[]" class="select2 form-select form-select-lg medications-search" data-allow-clear="true">
                        <option value="${medication.medicineId}" selected>${medication.medicine.tradeName
            }</option>
                    </select>
                </td>
                <td><input type="text" name="medication_start_date[]" class="form-control" value="${medication.startDate || ""
            }"></td>
                <td><input type="text" name="medication_discontinue_date[]" class="form-control" value="${medication.discontinueDate || ""
            }"></td>
                <td><input type="text" name="medication_dosage[]" class="form-control" value="${medication.dosage || ""
            }"></td>
                <td><input type="text" name="medication_frequency[]" class="form-control" value="${medication.frequency || ""
            }"></td>
            <td><input type="text"  class="form-control" value="${formatDate(medication.created_at)}"></td>
                <td>
                    <select id="medication_allergy_${index}" name="medication_allergy[]" class="form-select">
                        <option value="" ${medication.is_allergiesUnknown == null
                ? "selected"
                : ""
            }></option>
                        <option value="1" ${medication.is_allergiesUnknown == 1
                ? "selected"
                : ""
            }>Yes</option>
                        <option value="0" ${medication.is_allergiesUnknown == 0
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
            </td>
            </tr>
        `;

        $("#medication_tbody_div").append(newRow);

        $(`#medications_search_${index}`).select2({
            placeholder: "Search Medications Name",
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
    });
}

// Function to initialize or reinitialize inner tabs (nested tabs)
function initializeInnerTabs() {
    // Activate the first tab in the content by default
    var firstTab = $("#service_order_content .nav-tabs .nav-link").first();
    if (firstTab.length) {
        // Trigger Bootstrap's tab activation
        var tabInstance = new bootstrap.Tab(firstTab[0]);
        tabInstance.show(); // Activate the first tab programmatically
    }
}

// Populate Pre-Op Diagnosis Table
// function populatePreOpDiagnoses(preOpDiagnoses) {
//     preOpDiagnoses.forEach(function(diagnosis, index) {
//         let newRow = `
//             <tr>
//                 <td class="post-op-diagnosis-search-td-${index}">
//                     <div class="mb-6">
//                         <label class="form-label labe" for="post_op_diagnosis_search_${index}">Search</label>
//                         <select id="post_op_diagnosis_search_${index}" name="post_op_diagnosis_search[]" class="select2 form-select form-select-lg diagnosis-search" data-allow-clear="true">
//                             <!-- Options can be populated here -->
//                         </select>
//                     </div>
//                 </td>
//                 <td class="post-op-seq-order-td-${index}">
//                     <div class="mb-6">
//                         <label class="form-label labez" for="post_op_seq_order_${index}">Seq. Order</label>
//                         <input type="text" id="post_op_seq_order_${index}" name="post_op_seq_order[]" class="form-control expiry-date-mask" placeholder="" value="${diagnosis.seq_order}">
//                     </div>
//                     <input type="hidden" name="post_op_diagnosis_id[]" class="form-control" value="${diagnosis.reservationClientDiagnosisId}">
//                 </td>
//                 <td class="post-op-diagnosis-code-td-${index}">
//                     <div class="mb-6">
//                         <label class="form-label labez" for="post_op_diagnosis_code_${index}">Diagnosis Code</label>
//                         <input type="text" id="post_op_diagnosis_code_${index}" class="form-control expiry-date-mask" placeholder="">
//                     </div>
//                 </td>
//                 <td class="post-op-diagnosis-name-td-${index}">
//                     <div class="mb-6">
//                         <label class="form-label labez" for="post_op_diagnosis_name_${index}">Diagnosis Name</label>
//                         <input type="text" id="post_op_diagnosis_name_${index}" class="form-control expiry-date-mask" placeholder="">
//                     </div>
//                 </td>
//             </tr>
//         `;
//         $('#post-op-diagnosis-table-0 tbody').append(newRow);
//     });

// }

function populatePreOpDiagnoses(preOpDiagnoses) {
    preOpDiagnoses.forEach(function (diagnosis, index) {
        var newSeqOrder = index + 1; // Increment sequence order
        console.log(diagnosis);
        // Clone the diagnosis repeater block for each diagnosis
        var newDiagnosis = `
            <div class="diagnosis-repeater  pt-0 pt-md-2">
                <div class="d-flex border rounded position-relative pe-0">
                    <div class="card-body">
                        <div class="row g-4 align-items-end" id="pre_op_diagnosis_tbody_${newSeqOrder}">
                            <div class="col-3 d-flex" style="flex-direction: column;">
                                <label class="form-label labe" for="diagnosis_search_${newSeqOrder}">
                                    Search
                                </label>
                                <select id="diagnosis_search_${newSeqOrder}" name="diagnosis_search[]" class="select2 form-select diagnosis-search"
                                data-allow-clear="true">
                               
                            </select>
                        </div>
            <!-- Sequence -->
            <div class="col-3">
                <label class="form-label labe" for="seq_order_${newSeqOrder}">
                    Seq. Order
                </label>

                <input
                    type="text"
                    id="seq_order_${newSeqOrder}"
                    name="seq_order[]"
                    class="form-control text-center"
                    value="${diagnosis.seq_order}"
                    readonly>

                <input
                    type="hidden"
                    name="diagnosis_id[]"
                    value="${diagnosis.diagnosisListId}">
            </div>

            <!-- Diagnosis Code -->
            <div class="col-3">
                <label class="form-label labe" for="diagnosis_code_${newSeqOrder}">
                    Diagnosis Code
                </label>

                <input
                    type="text"
                    id="diagnosis_code_${newSeqOrder}"
                    name="diagnosis_code[]"
                    class="form-control"
                    value="${diagnosis.diagnosis_list.diagnosisCode}"
                    readonly>
            </div>

            <!-- Diagnosis Name -->
            <div class="col-3">
                <label class="form-label labe" for="diagnosis_name_${newSeqOrder}">
                    Diagnosis Name
                </label>

                <input
                    type="text"
                    id="diagnosis_name_${newSeqOrder}"
                    name="diagnosis_name[]"
                    class="form-control"
                    value="${diagnosis.diagnosis_list.diagnosisName_en}"
                    readonly>
            </div>

            

        </div>
    </div>

<div class="d-flex  align-items-center justify-content-between border-start p-2">
                    <button class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill " disabled><i class="ti ti-x ti-lg cursor-pointer"></i> </button>

                </div>

        </div>
    </div>`; // Convert the HTML string to a jQuery object

        // Insert the new block after the last diagnosis repeater
        // newDiagnosis.insertAfter($(".diagnosis-repeater").last());
        $(".diagnosis-repeater").last().after(newDiagnosis);

        // Initialize select2 for the new select element

        $(`#diagnosis_search_${newSeqOrder}`).select2({
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
                    // console.log(data);
                    return {
                        results: $.map(data.data, function (value, key) {
                            console.log(value.diagnosisListId);
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
    });
}

function populatePostOpDiagnoses(postOpDiagnoses) {
    postOpDiagnoses.forEach(function (diagnosis, index) {
        var newSeqOrder = index + 1; // Increment sequence order

        // Clone the diagnosis repeater block for each diagnosis
        var newDiagnosis = `
            <div class=" pt-0 pt-md-2 post-op-diagnosis-repeater">
                <div class="d-flex border rounded position-relative pe-0">
                    <div class="row w-100 p-6" id="post-op-diagnosis-table-${newSeqOrder}">
                        <div class="col-md-3 post-op-diagnosis-search-td-${newSeqOrder}">
                            <div class="mb-6">
                                <label class="form-label" for="post_op_diagnosis_search_${newSeqOrder}">Search</label>
                                <select id="post_op_diagnosis_search_${newSeqOrder}" name="post_op_diagnosis_search[]" class="select2 form-select form-select-lg diagnosis-search" data-allow-clear="true">
                                    <!-- Options will be populated dynamically -->
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3 post-op-seq-order-td-${newSeqOrder}">
                            <div class="mb-6">
                                <label class="form-label" for="post_op_seq_order_${newSeqOrder}">Seq. Order</label>
                                <input type="text" id="post_op_seq_order_${newSeqOrder}" name="post_op_seq_order[]" class="form-control expiry-date-mask" placeholder="" value="${diagnosis.seq_order}" readonly>
                            </div>
                            <input type="hidden" name="post_op_diagnosis_id[]" class="form-control" placeholder="" value="${diagnosis.diagnosisListId}">
                        </div>
                        <div class="col-md-3 post-op-diagnosis-code-td-${newSeqOrder}">
                            <div class="mb-6">
                                <label class="form-label" for="post_op_diagnosis_code_${newSeqOrder}">Diagnosis Code</label>
                                <input type="text" id="post_op_diagnosis_code_${newSeqOrder}" class="form-control expiry-date-mask" placeholder="" value="${diagnosis.diagnosis_list.diagnosisCode}">
                            </div>
                        </div>
                        <div class="col-md-3 post-op-diagnosis-name-td-${newSeqOrder}">
                            <div class="mb-6">
                                <label class="form-label" for="post_op_diagnosis_name_${newSeqOrder}">Diagnosis Name</label>
                                <input type="text" id="post_op_diagnosis_name_${newSeqOrder}" class="form-control expiry-date-mask" placeholder="" value="${diagnosis.diagnosis_list.diagnosisName_en}">
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-column align-items-center justify-content-center border-start p-2">
                        <i class="ti ti-x ti-lg cursor-pointer" data-repeater-delete=""></i>
                    </div>
                </div>
            </div>
        `;

        // Append the new diagnosis block to the existing ones
        $(".post-op-diagnosis-repeater").last().after(newDiagnosis);

        // Initialize select2 for the new select element
        $(`#post_op_diagnosis_search_${newSeqOrder}`).select2({
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
    });
}

function populateSurgeonAssistants(surgeonAssistants) {
    surgeonAssistants.forEach(function (surgeonAssistant, index) {
        const containerClass = ".surgeon-assistant-div";
        // type === "surgeon"
        //     ? ".surgeon-assistant-div"
        //     : ".anesthetist-assistant-div";

        // Generate the static doctor options HTML once
        const doctorOptions = getDoctorOptions(surgeonAssistant.employeeId);

        const newAssistant = $(`
        <div style="display: flex; gap: 12px; margin-bottom: 12px;" class="${containerClass.slice(
            1
        )}">
            <select name="surgeon_doctor_assistant[]" class="selectpicker w-100"
                data-style="btn-default"
                data-live-search="true">
                ${doctorOptions}
            </select>
        </div>
    `);

        $(containerClass).last().after(newAssistant);

        const selectElement = newAssistant.find(".selectpicker");
        selectElement.val(surgeonAssistant.employeeId);
        selectElement.selectpicker("refresh");
    });
}

function populateAnesthesianAssistants(anesthesianAssistants) {
    anesthesianAssistants.forEach(function (anesthesianAssistant, index) {
        const containerClass = ".anesthetist-assistant-div";
        // type === "surgeon"
        //     ? ".surgeon-assistant-div"
        //     : ".anesthetist-assistant-div";

        // Generate the static doctor options HTML once
        const doctorOptions = getDoctorOptions(anesthesianAssistant.employeeId);

        const newAssistant = $(`
        <div style="display: flex; gap: 12px; margin-bottom: 12px;" class="${containerClass.slice(
            1
        )}">
            <select name="anesthetists_doctor_assistant[]" class="selectpicker w-100"
                data-style="btn-default"
                data-live-search="true">
                ${doctorOptions}
            </select>
        </div>
    `);

        $(containerClass).last().after(newAssistant);

        const selectElement = newAssistant.find(".selectpicker");
        selectElement.val(anesthesianAssistant.employeeId);
        selectElement.selectpicker("refresh");
    });
}

function populateOperativeReportFiles(files) {
    // const files = response.data.operative_report_files;
    let html = "";

    // Check if files exist in the response
    if (files && files.length > 0) {
        html += '<div class="mt-3">';
        html += '<h5 class="text-center">Uploaded X-Ray Files</h5>';
        html += '<div class="dz-preview-container">';

        // Loop through the files and generate the HTML
        files.forEach(function (file) {
            if (
                file.is_delete === 0 &&
                file.type === "inpatientOperativeReportFile"
            ) {
                html += '<div class="dz-preview dz-file-preview">';
                html += '<div class="subimage">';
                html += '<div class="pdfimg">';

                // Check if file is PDF or image
                if (file.fileName.endsWith(".pdf")) {
                    html += `<img src="{{ asset('img/pdf-icon.png') }}" data-dz-thumbnail alt="${file.fileName}" class="subpdfimg" />`;
                } else {
                    // Use JavaScript concatenation for the file path
                    let filePath =
                        "{{ asset('storage/operativeReportfile/') }}" +
                        "/" +
                        file.fileName;
                    html += `<img src="${BASE_URL}/storage/${file.fileNamePath}" data-dz-thumbnail alt="${file.fileName}" />`;
                }

                html += "</div>";
                html += '<div class="dz-actions mt-2 text-center">';
                html += `<button class="btn btn-sm btn-label-secondary dz-view view-operative-report-file" type="button"  data-media-file-id="${file.mediafilesId}">View</button>`;
                html += `<button class="btn btn-sm btn-label-danger dz-delete delete-operative-report-file" type="button"  data-media-file-id="${file.mediafilesId}">Delete</button>`;
                html += "</div>";
                html += '<div class="dz-details subimgcontent">';
                html += `<div class="textflow_sub"><span>${file.fileName}</span></div>`;
                html += "</div>";
                html += "</div>";
                html += "</div>";
            }
        });

        html += "</div>";
        html += "</div>";
    } else {
        html = "<p>No X-Ray files uploaded.</p>";
    }

    // Update the HTML content in your Blade view
    $("#uploaded-files-container").html(html);
}

function populateInpatientFiles(inPatientFiles) {
    // const files = response.data.operative_report_files;
    let html = "";

    // Check if files exist in the response
    if (inPatientFiles && inPatientFiles.length > 0) {
        html += '<div class="mt-3">';
        html += '<h5 class="text-center">Uploaded X-Ray Files</h5>';
        html += '<div class="dz-preview-container">';

        // Loop through the files and generate the HTML
        inPatientFiles.forEach(function (file) {
            if (file.is_delete === 0 && file.type === "inPatient") {
                html += '<div class="dz-preview dz-file-preview">';
                html += '<div class="subimage">';
                html += '<div class="pdfimg">';

                // Check if file is PDF or image
                if (file.fileName.endsWith(".pdf")) {
                    html += `<img src="{{ asset('img/pdf-icon.png') }}" data-dz-thumbnail alt="${file.fileName}" class="subpdfimg" />`;
                } else {
                    // Use JavaScript concatenation for the file path
                    html += `<img src="${BASE_URL}/storage/${file.fileNamePath}" data-dz-thumbnail alt="${file.fileName}" />`;
                }

                html += "</div>";
                html += '<div class="dz-actions mt-2 text-center">';
                html += `<button class="btn btn-sm btn-label-secondary dz-view view-inpatient-file" type="button"  data-media-file-id="${file.mediafilesId}">View</button>`;
                html += `<button class="btn btn-sm btn-label-danger dz-delete delete-inpatient-file" type="button"  data-media-file-id="${file.mediafilesId}">Delete</button>`;
                html += "</div>";
                html += '<div class="dz-details subimgcontent">';
                html += `<div class="textflow_sub"><span>${file.fileName}</span></div>`;
                html += "</div>";
                html += "</div>";
                html += "</div>";
            }
        });

        html += "</div>";
        html += "</div>";
    } else {
        html = "<p>No X-Ray files uploaded.</p>";
    }

    // Update the HTML content in your Blade view
    $("#inpatient-uploaded-files-container").html(html);
}



function populateInpatientServiceOrders(serviceOrderData) {
    console.log(serviceOrderData);

    // Clear any existing tables to avoid duplication
    $("#service_orders_container").empty();

    // Loop through each service order master and create a separate table for each
    $.each(serviceOrderData, function (index, orderMaster) {

        // Create a unique ID for each table and its elements
        const tableId = `service_order_table_${orderMaster.serviceOrderMasterId}`;
        const tbodyId = `service_order_tbody_${orderMaster.serviceOrderMasterId}`;
        const totalAmountId = `total_amount_${orderMaster.serviceOrderMasterId}`;
        const totalDiscountId = `total_discount_${orderMaster.serviceOrderMasterId}`;
        const totalVatId = `total_vat_${orderMaster.serviceOrderMasterId}`;
        const netAmountId = `net_amount_${orderMaster.serviceOrderMasterId}`;

        // Create a card container for each service order master
        let cardHtml = `
            <div class="card mb-4">
                <div class="card-header">
                   
                </div>
                <div class="card-body">
                    <input type="hidden" class="service_order_master_id" name="service_order_master_id[]" value="${orderMaster.serviceOrderMasterId}">
                    
                    
                    
                    <table class="table table-hover table-striped custom-billgap" id="${tableId}">
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>Service Code</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Disc %</th>
                                <th>Disc Amt</th>
                                <th>VAT %</th>
                                <th>VAT AMT</th>
                                <th>Total Amount</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody id="${tbodyId}">
                            <!-- Dynamic rows will be added here -->
                        </tbody>
                    </table>
                    
                    <!-- Total Amount for this service order -->
                    <div class="d-flex justify-content-end pb-4 border-bottom mt-3">
                        <div class="col-md-2 mb-md-0 mb-4" style="display: flex; align-items: center; gap: 12px;">
                            <p class="h6 repeater-title">Total Amount</p>
                            <input type="text" id="${totalAmountId}_sum" name="total_amount_sum[]" 
                                class="form-control invoice-item-price mb-2" placeholder="0" value="${orderMaster.netAmount}" disabled>
                        </div>
                    </div>
                    
                    <!-- Summary Table for this service order -->
                    <table class="table m-0 table-borderless summary-table">
                        <tbody>
                            <tr>
                                <td class="text-end">
                                    <span class="fw-bold">Total Amount :</span>
                                    <span class="fw-bold float-end" id="${totalAmountId}">${orderMaster.totalAmount || '0'}</span>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-end">
                                    <span class="fw-bold">Discount :</span>
                                    <span class="fw-bold float-end" id="${totalDiscountId}_td">${orderMaster.totalDisAmount}</span>
                                    <input type="hidden" id="${totalDiscountId}" name="total_discount_sum[]" value="${orderMaster.totalDisAmount}">
                                </td>
                            </tr>
                            <tr>
                                <td class="text-end">
                                    <span class="fw-bold">VAT :</span>
                                    <span class="fw-bold float-end" id="${totalVatId}_td">${orderMaster.totalTaxAmount}</span>
                                    <input type="hidden" id="${totalVatId}" name="total_vat_sum[]" value="${orderMaster.totalTaxAmount}">
                                </td>
                            </tr>
                            <tr>
                                <td class="text-end">
                                    <span class="fw-bold">Net Amount :</span>
                                    <span class="fw-bold float-end" id="${netAmountId}_td">${orderMaster.netAmount}</span>
                                    <input type="hidden" id="${netAmountId}" name="net_amount[]" value="${orderMaster.netAmount}">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Append the card to the container
        $("#service_orders_container").append(cardHtml);

        // Check if service order lists exist and populate the table
        if (orderMaster.service_order_lists && orderMaster.service_order_lists.length > 0 && orderMaster.is_surgery_bill === 0) {
            $.each(orderMaster.service_order_lists, function (idx, serviceOrderList) {
                let rowHtml = '';

                if (serviceOrderList.serviceId != null) {
                    // For regular services with service ID
                    let discountColumn = '';

                    if (orderMaster.discount_type == "fixed") {
                        discountColumn = `
                            <td class="service-order-disc-percentage">
                                <input type="text" class="form-control" placeholder="Discount Percentage" 
                                    name="service_discount_percentage_${orderMaster.serviceOrderMasterId}[]" 
                                    value="${serviceOrderList.discountPercentage}" disabled>
                            </td>
                            <td class="service-order-disc-amount">
                                <input type="text" class="form-control" placeholder="Discount Amount" 
                                    name="service_discount_amount_${orderMaster.serviceOrderMasterId}[]" 
                                    value="${serviceOrderList.disAmount}" disabled>
                            </td>
                        `;
                    } else {
                        discountColumn = `
                            <td class="service-order-disc-percentage">
                                <input type="text" class="form-control" placeholder="Discount Percentage" 
                                    name="service_discount_percentage_${orderMaster.serviceOrderMasterId}[]" 
                                    value="${serviceOrderList.discountPercentage}" disabled>
                            </td>
                            <td class="service-order-disc-amount">
                                <input type="text" class="form-control" placeholder="Discount Amount" 
                                    name="service_discount_amount_${orderMaster.serviceOrderMasterId}[]" 
                                    value="${serviceOrderList.disAmount}" disabled>
                            </td>
                        `;
                    }

                    rowHtml = `
                        <tr>
                            <td class="service-order-name">
                                <input type="hidden" class="service-id" name="service_id_${orderMaster.serviceOrderMasterId}[]" 
                                    value="${serviceOrderList.service.serviceId}" disabled>
                                ${serviceOrderList.service.serviceName_en}
                            </td>
                            <td class="service-order-code">${serviceOrderList.service.serviceCode}</td>
                            <td class="service-order-quantity">
                                <input type="number" class="form-control" placeholder="Quantity" 
                                    name="service_quantity_${orderMaster.serviceOrderMasterId}[]" value="${serviceOrderList.qty}" disabled>
                            </td>
                            <td class="service-order-price">
                                <input type="text" class="form-control" placeholder="Price" 
                                    name="service_price_${orderMaster.serviceOrderMasterId}[]" value="${serviceOrderList.cost}" disabled>
                            </td>
                            ${discountColumn}
                            <td class="service-order-vat-percentage">
                                <input type="text" class="form-control" placeholder="VAT %" 
                                    name="service_tax_percentage_${orderMaster.serviceOrderMasterId}[]" value="15" disabled>
                            </td>
                            <td class="service-order-vat-amount">
                                <input type="text" class="form-control" placeholder="VAT Amount" 
                                    name="service_tax_amount_${orderMaster.serviceOrderMasterId}[]" value="${serviceOrderList.netTaxCost}" disabled>
                            </td>
                            <td class="service-order-total-amount">
                                <input type="text" class="form-control" 
                                    name="service_total_amount_${orderMaster.serviceOrderMasterId}[]" value="${serviceOrderList.netCost}" disabled>
                            </td>
                            <td>
                               <button type="button" 
                                    class="btn btn-danger remove-row" 
                                    data-master-id="${orderMaster.serviceOrderMasterId}" 
                                    data-list-id="${serviceOrderList.serviceOrderListId}">X</button>
                            </td>
                        </tr>
                    `;
                } else {
                    // For manual services without service ID
                    let discountColumn = '';

                    if (orderMaster.discount_type == "fixed") {
                        discountColumn = `
                            <td class="service-order-disc-percentage">
                                <input type="text" class="form-control" placeholder="Discount Percentage" 
                                    name="manual_service_discount_percentage_${orderMaster.serviceOrderMasterId}[]" 
                                    value="${serviceOrderList.discountPercentage}" disabled>
                            </td>
                            <td class="service-order-disc-amount">
                                <input type="text" class="form-control" placeholder="Discount Amount" 
                                    name="manual_service_discount_amount_${orderMaster.serviceOrderMasterId}[]" 
                                    value="${serviceOrderList.disAmount}" enabled>
                            </td>
                        `;
                    } else {
                        discountColumn = `
                            <td class="service-order-disc-percentage">
                                <input type="text" class="form-control" placeholder="Discount Percentage" 
                                    name="manual_service_discount_percentage_${orderMaster.serviceOrderMasterId}[]" 
                                    value="${serviceOrderList.discountPercentage}" disabled>
                            </td>
                            <td class="service-order-disc-amount">
                                <input type="text" class="form-control" placeholder="Discount Amount" 
                                    name="manual_service_discount_amount_${orderMaster.serviceOrderMasterId}[]" 
                                    value="${serviceOrderList.disAmount}" enabled>
                            </td>
                        `;
                    }

                    rowHtml = `
                        <tr>
                            <td class="service-order-name">
                                <input type="text" class="service-id form-control" 
                                    name="manual_service_${orderMaster.serviceOrderMasterId}[]" value="${serviceOrderList.manualServiceName}">
                            </td>
                            <td class="service-order-code">
                                <input type="text" class="service-code form-control" 
                                    name="manual_service_code_${orderMaster.serviceOrderMasterId}[]" value="${serviceOrderList.manualServiceCode}">
                            </td>
                            <td class="service-order-quantity">
                                <input type="number" class="form-control" placeholder="Quantity" 
                                    name="manual_service_quantity_${orderMaster.serviceOrderMasterId}[]" value="${serviceOrderList.qty}">
                            </td>
                            <td class="service-order-price">
                                <input type="text" class="form-control" placeholder="Price" 
                                    name="manual_service_price_${orderMaster.serviceOrderMasterId}[]" value="${serviceOrderList.cost}">
                            </td>
                            ${discountColumn}
                            <td class="service-order-vat-percentage">
                                <input type="text" class="form-control" placeholder="VAT %" 
                                    name="manual_service_tax_percentage_${orderMaster.serviceOrderMasterId}[]" 
                                    value="${serviceOrderList.manuelTaxPercentage}">
                            </td>
                            <td class="service-order-vat-amount">
                                <input type="text" class="form-control" placeholder="VAT Amount" 
                                    name="manual_service_tax_${orderMaster.serviceOrderMasterId}[]" value="${serviceOrderList.manuelTaxCost}">
                            </td>
                            <td class="service-order-total-amount">
                                <input type="text" class="form-control" placeholder="Total Amount" 
                                    name="manual_service_total_amount_${orderMaster.serviceOrderMasterId}[]" value="${serviceOrderList.netCost}">
                            </td>
                            <td>
                                <button type="button" 
                                    class="btn btn-danger remove-row" 
                                    data-master-id="${orderMaster.serviceOrderMasterId}" 
                                    data-list-id="${serviceOrderList.serviceOrderListId}">X</button>
                            </td>
                        </tr>
                    `;
                }

                // Append the row to the table body
                $(`#${tbodyId}`).append(rowHtml);
            });
        }
    });

    // Add event handlers for discount type changes
    $('input[name^="discount_type_"]').on('change', function () {
        const serviceOrderMasterId = $(this).attr('name').split('_')[2];
        const discountType = $(this).val();

        // Handle discount type change for this specific service order master
        if (discountType === "fixed") {
            $(`input[name^="service_discount_percentage_${serviceOrderMasterId}"]`).prop('disabled', true);
            $(`input[name^="service_discount_amount_${serviceOrderMasterId}"]`).prop('disabled', false);
            $(`input[name^="manual_service_discount_percentage_${serviceOrderMasterId}"]`).prop('disabled', true);
            $(`input[name^="manual_service_discount_amount_${serviceOrderMasterId}"]`).prop('disabled', false);
        } else {
            $(`input[name^="service_discount_percentage_${serviceOrderMasterId}"]`).prop('disabled', false);
            $(`input[name^="service_discount_amount_${serviceOrderMasterId}"]`).prop('disabled', true);
            $(`input[name^="manual_service_discount_percentage_${serviceOrderMasterId}"]`).prop('disabled', false);
            $(`input[name^="manual_service_discount_amount_${serviceOrderMasterId}"]`).prop('disabled', true);
        }
    });

    $(document).on('click', '.remove-row', function () {
        const masterId = $(this).data('master-id');
        const listId = $(this).data('list-id');

        console.log("Clicked Master ID:", masterId);
        console.log("Clicked List ID:", listId);

        $(this).closest('tr').remove();

    });

}

// Add this HTML to your page for the container
/*
<div id="service_orders_container">
    <!-- Service order tables will be dynamically added here -->
</div>
*/






// function populateInpatientServiceOrders(serviceOrderData) {
//     console.log(serviceOrderData);

//     $("#service_order_master_id").val(serviceOrderData[0].serviceOrderMasterId);
//     $(
//         'input[name="surgery_discount_type"][value="' +
//         serviceOrderData[0].discount_type +
//         '"]'
//     ).prop("checked", true);

//     console.log(serviceOrderData[0].serviceOrderMasterId);
//     if (
//         serviceOrderData[0].service_order_lists &&
//         serviceOrderData[0].service_order_lists.length > 0 &&
//         serviceOrderData[0].is_surgery_bill === 0
//     ) {
//         $.each(
//             serviceOrderData[0].service_order_lists,
//             function (index, serviceOrderList) {
//                 var discountPercentageColumn = "";
//                 var discountPercentageColumnManual = "";

//                 if (serviceOrderList.serviceId != null) {
//                     if (serviceOrderData[0].discount_type == "fixed") {
//                         $("#inpatient_fixed_discount").prop("checked", true);
//                         discountPercentageColumn = `<td class="inpatient-service-order-disc-percentage">
//                     <input type="text" class="form-control" placeholder="Discount Percentage" name="inpatient_service_discount_percentage[]" value="${serviceOrderList.discountPercentage}" disabled>
//                 </td>
//                 <td class="inpatient-service-order-disc-amount">
//                         <input type="text" class="form-control" placeholder="Discount Amount" name="inpatient_service_discount[]" value="${serviceOrderList.disAmount}" enabled>
//                     </td>`;
//                     } else {
//                         $("#inpatient_percentage_discount").prop(
//                             "checked",
//                             true
//                         );
//                         discountPercentageColumn = `<td class="inpatient-service-order-disc-percentage">
//                     <input type="text" class="form-control" placeholder="Discount Percentage" name="inpatient_service_discount_percentage[]" value="${serviceOrderList.discountPercentage}" enabled>
//                 </td>
//                 <td class="inpatient-service-order-disc-amount">
//                         <input type="text" class="form-control" placeholder="Discount Amount" name="inpatient_service_discount[]" value="${serviceOrderList.disAmount}" disabled>
//                     </td>`;
//                     }
//                     $("#in_patient_service_order_tbody").append(`
//                         <tr>
//                     <td class="inpatient-service-order-name"><input type="hidden" class="service-id" name="inpatient_service_id[]" value="${serviceOrderList.service.serviceId}">${serviceOrderList.service.serviceName_en}</td>
//                     <td class="inpatient-service-order-code">${serviceOrderList.service.serviceCode}</td>
//                     <td class="inpatient-service-order-quantity">
//                         <input type="number" class="form-control" placeholder="Quantity" name="inpatient_service_quantity[]" value="${serviceOrderList.qty}">
//                     </td>
//                     <td class="inpatient-service-order-price">
//                         <input type="text" class="form-control" placeholder="Price" name="inpatient_service_price[]" value="${serviceOrderList.cost}">
//                     </td>
//                     ${discountPercentageColumn}

//                     <td class="inpatient-service-order-vat-percentage">
//                         <input type="text" class="form-control" placeholder="VAT %" name="inpatient_service_tax[]" value="15">
//                     </td>
//                     <td class="inpatient-service-order-vat-amount">
//                         <input type="text" class="form-control" placeholder="VAT Amount" name="inpatient_service_tax_amount[]" value="${serviceOrderList.netTaxCost}">
//                     </td>
//                     <td class="inpatient-service-order-total-amount">
//                         <input type="text" class="form-control"  name="inpatient_service_total_amount[]" value="${serviceOrderList.netCost}">
//                     </td>
//                     <td>
//                         <button type="button" class="btn btn-danger remove-row">X</button>
//                     </td>
//                 </tr>
//                     `);
//                 } else {
//                     if (serviceOrderData[0].discount_type == "fixed") {
//                         $("#inpatient_fixed_discount").prop("checked", true);

//                         discountPercentageColumnManual = `<td class="inpatient-service-order-disc-percentage">
//                                             <input type="text" class="form-control" placeholder="Discount Percentage" name="inpatient_manual_service_discount_percentage[]" value="${serviceOrderList.discountPercentage}" disabled>
//                                         </td>
//                                         <td class="inpatient-service-order-disc-amount">
//                                                 <input type="text" class="form-control" placeholder="Discount Amount" name="inpatient_manual_service_discount[]" value="${serviceOrderList.disAmount}" enabled>
//                                             </td>`;
//                     } else {
//                         $("#inpatient_percentage_discount").prop(
//                             "checked",
//                             true
//                         );

//                         discountPercentageColumnManual = `<td class="inpatient-service-order-disc-percentage">
//                                             <input type="text" class="form-control" placeholder="Discount Percentage" name="inpatient_manual_service_discount_percentage[]" disabled>
//                                         </td>
//                                         <td class="inpatient-service-order-disc-amount">
//                                                 <input type="text" class="form-control" placeholder="Discount Amount" name="inpatient_manual_service_discount[]" value="${serviceOrderList.disAmount}" enabled>
//                                             </td>`;
//                     }
//                     $("#in_patient_service_order_tbody").append(`
//                         <tr>
//                     <td class="inpatient-service-order-name"><input type="text" class="service-id form-control" name="inpatient_manual_service[]" value="${serviceOrderList.manualServiceName}"></td>
//                     <td class="inpatient-service-order-code"><input type="text" class="service-code form-control" name="inpatient_manual_service_code[]" value="${serviceOrderList.manualServiceCode}"></td>
//                     <td class="inpatient-service-order-quantity">
//                         <input type="number" class="form-control" placeholder="Quantity" name="inpatient_manual_service_quantity[]" value="${serviceOrderList.qty}">
//                     </td>
//                     <td class="inpatient-service-order-price">
//                         <input type="text" class="form-control" placeholder="Price" name="inpatient_manual_service_price[]" value="${serviceOrderList.cost}">
//                     </td>
//                     ${discountPercentageColumnManual}

//                     <td class="inpatient-service-order-vat-percentage">
//                         <input type="text" class="form-control" placeholder="VAT %" name="inpatient_manual_service_tax_percentage[]" value="${serviceOrderList.manuelTaxPercentage}">
//                     </td>
//                     <td class="inpatient-service-order-vat-amount">
//                         <input type="text" class="form-control" placeholder="VAT Amount" name="inpatient_manual_service_tax[]" value="${serviceOrderList.manuelTaxCost}">
//                     </td>
//                     <td class="inpatient-service-order-total-amount">
//                         <input type="text" class="form-control" placeholder="Total Amount" name="inpatient_manual_service_total_amount[]" value="${serviceOrderList.netCost}">
//                     </td>
//                     <td>
//                         <button type="button" class="btn btn-danger remove-row">X</button>
//                     </td>
//                 </tr>
//                     `);
//                 }
//             }
//         );

//         $("#inpatient_total_amount_sum").val(serviceOrderData[0].netAmount);
//         $("#inpatient_total_discount_sum_td").text(
//             serviceOrderData[0].totalDisAmount
//         );
//         $("#inpatient_total_discount_sum").val(
//             serviceOrderData[0].totalDisAmount
//         );

//         $("#inpatient_total_amount").text(serviceOrderData[0].totalTaxAmount);
//         $("#inpatient_total_vat_sum_td").text(
//             serviceOrderData[0].totalTaxAmount
//         );
//         $("#inpatient_total_vat_sum").val(serviceOrderData[0].totalTaxAmount);
//         $("#inpatient_service_order_net_amount").val(
//             serviceOrderData[0].netAmount
//         );
//         $("#inpatient_service_order_net_amount_td").text(
//             serviceOrderData[0].netAmount
//         );
//     }
// }

$(document).on("click", ".view-inpatient-file", function () {
    $.ajax({
        url:
            BASE_URL +
            "/inpatient-view-uploaded-file/" +
            $(this).data("media-file-id"),
        type: "get",
        success: function (response) {
            if (response.status === true) {
                const iframe = document.createElement("iframe");
                iframe.src = response.data;
                iframe.width = "100%";
                iframe.height = "600px";

                const modalContent = document.getElementById(
                    "inpatient-file-view-modal-content"
                );
                modalContent.innerHTML = "";
                modalContent.appendChild(iframe);

                $("#inpatient-file-view-modal").modal("show");
            }
        },

        // });
    });
});

$(document).on("click", ".view-operative-report-file", function () {
    $.ajax({
        url:
            BASE_URL +
            "/inpatient-view-operative-report-file/" +
            $(this).data("media-file-id"),
        type: "get",
        success: function (response) {
            if (response.status === true) {
                console.log(response.data);
                const iframe = document.createElement("iframe");
                iframe.src = response.data;
                iframe.width = "100%";
                iframe.height = "600px";

                const modalContent = document.getElementById(
                    "operative-report-file-view-modal-content"
                );
                modalContent.innerHTML = "";
                modalContent.appendChild(iframe);

                $("#operative-report-file-view-modal").modal("show");
            }
        },

        // });
    });
});

$(document).on("click", ".delete-inpatient-file", function () {
    $.ajax({
        url:
            BASE_URL +
            "/inpatient-delete-uploaded-file/" +
            $(this).data("media-file-id"),
        type: "delete",
        success: function (response) {
            if (response.status) {
                // dropzoneInstance.removeFile(file);
                Swal.fire({
                    title: "Deleted!",
                    text: "File deleted successfully.",
                    icon: "success",
                    customClass: {
                        confirmButton:
                            "btn btn-primary waves-effect waves-light",
                    },
                    buttonsStyling: false,
                });
            } else {
                console.error("Error deleting file:", data.message);
            }
        },

        // });
    });
});

$(document).on("click", ".delete-operative-report-file", function () {
    $.ajax({
        url:
            BASE_URL +
            "/inpatient-delete-operative-report-file/" +
            $(this).data("media-file-id"),
        type: "delete",
        success: function (response) {
            if (response.status) {
                // dropzoneInstance.removeFile(file);
                Swal.fire({
                    title: "Deleted!",
                    text: "File deleted successfully.",
                    icon: "success",
                    customClass: {
                        confirmButton:
                            "btn btn-primary waves-effect waves-light",
                    },
                    buttonsStyling: false,
                });
            } else {
                console.error("Error deleting file:", data.message);
            }
        },

        // });
    });
});


