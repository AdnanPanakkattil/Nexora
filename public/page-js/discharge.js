$(document).ready(function () {
    $("#medical_record_main_menu1").addClass("active open menu-item-animating");
    $("#medical_record_lists_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    flatpickr("#dischargeDate", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today"
    });
    initialPageLoad($('#patient_admission_id').val());

    // function initializeSelect2(element) {
    //     element.select2({
    //         placeholder: "Search Medications Name",
    //         ajax: {
    //             url: BASE_URL + "/medicalrecords-get-medications-search-options",
    //             dataType: "json",
    //             delay: 250,
    //             data: function (params) {
    //                 return {
    //                     medicationName: params.term,
    //                 };
    //             },
    //             processResults: function (data) {
    //                 return {
    //                     results: $.map(data.data, function (value, key) {
    //                         return {
    //                             id: value.medicineId,
    //                             text: value.tradeName,
    //                         };
    //                     }),
    //                 };
    //             },
    //             cache: true,
    //         },
    //     });
    // }

    function initializeSelect2(element) {
        // Destroy if already initialized


        element
            .wrap('<div class="position-absolute"></div>')
            .select2({
                placeholder: "Search Medications Name",
                allowClear: true,
                width: "resolve",
                dropdownParent: element.parent(),
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
                            results: $.map(data.data, function (value) {
                                return {
                                    id: value.medicineId,
                                    text: value.tradeName,
                                    pharmaceuticalForm: value.pharmaceuticalForm,
                                    packageTypes: value.packageTypes,
                                    storageConditions: value.storageConditions,
                                    scientificName: value.scientificName,
                                    administrationRoute: value.administrationRoute,
                                };
                            }),
                        };
                    },
                    cache: true,
                },
            });

        // Set data on selection
        element.on("select2:select", function (e) {
            const data = e.params.data;

            // Find the row in which the select2 element is contained
            const row = $(this).closest("tr");

            // Set the corresponding fields in the row with the selected data
            row.find(".pharmaceuticalForm").text(data.pharmaceuticalForm || "");
            row.find(".packageTypes").text(data.packageTypes || "");
            row.find(".storageConditions").text(data.storageConditions || "");
            row.find(".scientificName").text(data.scientificName || "");
            row.find(".administrationRoute").text(
                data.administrationRoute || ""
            );
        });
    }

    // Initialize Select2 for already present rows
    initializeSelect2($(".medications-search"));

    // Set the "Home" checkbox to be checked by default
    $("#HomeTransfer").prop("checked", true);

    // Show the corresponding field for "Home" on page load
    $("#DSwhenToseekMedicalAdvic").show();
    $("#discharge_to_other").hide();

    // Listen for changes on DischargeTo checkboxes
    $('input[name="DischargeTo"]').change(function () {
        $('input[name="DischargeTo"]').not(this).prop("checked", false);
        var dischargeToValue = $(this).val();
        if (dischargeToValue === "home") {
            $("#DSwhenToseekMedicalAdvic").show();
            $("#discharge_to_other").hide();
        } else if (dischargeToValue === "otherFacility") {
            $("#DSwhenToseekMedicalAdvic").hide();
            $("#discharge_to_other").show();
        }
    });

    $("#physical_discharge_request_btn").click(function () {
        let formData = $("#physical_discharge_form").serialize();
        formData +=
            "&dischargeDate=" + encodeURIComponent($("#dischargeDate").val());
        $.ajax({
            url:
                BASE_URL +
                "/discharge-request/" +
                $("#patient_admission_id").val(),
            type: "PUT",
            data: formData,
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
            error: function (xhr) {
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                }
            },
        });
    });

    // Add more rows with dynamic Select2 initialization
    // if ($('#existing_med_cnt').val() != 0) {
    // let rowIndex = $('#existing_med_cnt').val() != 0 ? $('#existing_med_cnt').val() : 1;
    // let rowIndex = $('#existing_med_cnt').val() > 0 ? parseInt($('#existing_med_cnt').val()) : 1;
    // var rowIndex = parseInt($('#existing_med_cnt').val()) > 0 ? parseInt($('#existing_med_cnt').val()) : 1;
    // Log the value and type to understand what's being evaluated
    // console.log("existing_med_cnt value:", $('#existing_med_cnt').val(), "Type:", typeof $('#existing_med_cnt').val());

    // // Parse the value to ensure it's an integer and then evaluate the condition
    // alert(parseInt($('#existing_med_cnt').val(), 10) > 0);

    let rowIndex = 1;

    // if ($('#existing_med_cnt').val()) {
    //      rowIndex = parseInt($('#existing_med_cnt').val());
    //     //  alert(parseInt($('#existing_med_cnt').val()));
    // }



    // let rowIndex = parseInt($('#existing_med_cnt').val()) || 1;
    // } else{
    //     let rowIndex = 1;
    // }

    $(".add-more-medications").on("click", function () {
        console.log("Current rowIndex:", rowIndex);
        console.log(parseInt($('#existing_med_cnt').val()));
        // let newRow = `
        //     <tr>
        //        <td style="width: 250px; padding: 10px; ">
        //         <select id="medications_search_${rowIndex}" name="medications_search[]" 
        //                 class="select2 form-select medications-search">

        //         </select>
        //     </td>
        //         <td>
        //             <p class="mb-5">Drug Type : <span class="pharmaceuticalForm"></span></p>
        //             <p class="mb-5">Storage : <span class="storageConditions"></span></p>
        //             <p class="mb-5">Pharmaceutical Form : <span class="packageTypes"></span></p>
        //             <p class="mb-5">Administration Route : <span class="administrationRoute"></span></p>
        //         </td>
        //         <td><input type="text" name="medication_dosage[]" class="form-control"></td>
        //         <td><input type="text" name="medication_frequency[]" class="form-control"></td>
        //         <td>
        //             <select id="medication_allergy_${rowIndex}" name="medication_allergy[]" class="form-select">
        //                 <option selected>Select</option>
        //                 <option value="1">Yes</option>
        //                 <option value="0">No</option>
        //             </select>
        //         </td>
        //          <td>
        //          <div class="d-flex">
        //             <button type="button" class="btn rounded-pill btn-icon btn-label-primary view-medicine-details-btn me-2" data-row-index="${rowIndex}" id="view-medicine-details">
        //                <i class="ti ti-eye"></i>
        //             </button>
        //             <button type="button" class="btn rounded-pill btn-icon btn-label-primary remove-medicine" data-row-index="${rowIndex}" id="remove-medicine">
        //                <i class="ti ti-trash"></i>
        //             </button>
        //             </div>
        //         </td>


        //     </tr>
        // `;

        let newRow = `
<tr class="align-middle text-center">

    <!-- Medicine Select -->
    <td style="width: 260px;  padding: 12px; padding-bottom: 55px;">
        <select id="medications_search_${rowIndex}" 
                name="medications_search[]" 
                class="select2 form-select medications-search text-center">
        </select>
    </td>

    <!-- Medicine Details -->
    <td class="text-start" style="width: 260px;  padding: 12px; padding-bottom: 55px;">
        <div class="d-flex flex-column gap-1 small">
            <span><strong>Drug Type:</strong> <span class="pharmaceuticalForm"></span></span>
            <span><strong>Storage:</strong> <span class="storageConditions"></span></span>
            <span><strong>Form:</strong> <span class="packageTypes"></span></span>
            <span><strong>Route:</strong> <span class="administrationRoute"></span></span>
        </div>
    </td>

    <!-- Dosage -->
    <td style="max-width:120px;">
        <input type="text" 
               name="medication_dosage[]" 
               class="form-control text-center" 
               placeholder="Dosage">
    </td>

    <!-- Frequency -->
    <td style="max-width:120px;">
        <input type="text" 
               name="medication_frequency[]" 
               class="form-control text-center" 
               placeholder="Frequency">
    </td>

    <!-- Allergy -->
    <td style="max-width:120px;">
        <select id="medication_allergy_${rowIndex}" 
                name="medication_allergy[]" 
                class="form-select text-center">
            <option selected disabled>Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
        </select>
    </td>

    <!-- Actions -->
    <td>
        <div class="d-flex justify-content-center gap-2">
            <button type="button" 
                    class="btn rounded-pill btn-icon btn-label-info view-medicine-details-btn" 
                    data-row-index="${rowIndex}" id="view-medicine-details">
                <i class="ti ti-eye"></i>
            </button>

            <button type="button" 
                    class="btn rounded-pill btn-icon btn-label-danger remove-medicine" 
                    data-row-index="${rowIndex}" id="remove-medicine">
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

    $(document).on("click", "#Prescription-Print", function (e) {
        e.preventDefault();

        var patientAdmissionId = $('#patient_admission_id').val();
        const clientId = $("#client_id").val();


        if (patientAdmissionId) {
            window.open(BASE_URL + "/print-prescription-discharge/" + patientAdmissionId + "/" + clientId);
        } else {
            alert("inPatientId is missing!");
        }

    });

    $(document).on('click', '#remove-medicine', function () {
        const patientAdmissionId = $('#patient_admission_id').val();
        const row = $(this).closest('tr');
        row.remove();
        const selectedMedicineId = row.find('select.medications-search').val();
        // alert(selectedMedicineId);
        // alert(patientAdmissionId);

        if (selectedMedicineId) {
            console.log("Editing medicine ID:", selectedMedicineId);

            $.ajax({
                url: `/remove-medicine-discharge/${selectedMedicineId}/${patientAdmissionId}`,
                method: 'POST',
                data: {
                    _token: $('meta[name="csrf-token"]').attr('content')
                },
                success: function (response) {
                    console.log('Medicine removed:', response);
                },
                error: function (xhr) {
                    console.error('Error removing medicine:', xhr.responseText);
                }
            });

        } else {
            Swal.fire({
                icon: "error",
                text: "Please select a medication first",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        }
    });



    $(document).on('click', '#vacate_room', function () {
        const nurseStationRoomListId = $('#nurseStationRoomListId').val();

        $.ajax({
            url: BASE_URL + '/vacate-room/' + nurseStationRoomListId,
            method: 'POST',
            data: {
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: {
                        confirmButton: "btn btn-success waves-effect waves-light",
                    },
                }).then(function () {
                    location.reload();
                });
            },
            error: function (xhr) {
                console.error('Error removing medicine:', xhr.responseText);
            }
        });
    });

    $(document).on('click', '#genarate_bill', function () {
        const roomBookingId = $('#roomBookingId').val();
        const inPatientId = $('#inPatientId').val();
        const clientId = $('#client_id').val();

        $.ajax({
            url: BASE_URL + '/add-room-serviceOrderList/' + roomBookingId + '/' + inPatientId + '/' + clientId,
            method: 'POST',
            data: {
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                Swal.fire({
                    icon: response.status,
                    text: response.message,
                    customClass: {
                        confirmButton: "btn btn-" + response.button + " waves-effect waves-light",
                    },
                }).then(function () {
                    location.reload();
                });
            },
            error: function (xhr) {
                console.error('Error removing medicine:', xhr.responseText);
            }
        });
    });



    $(document).on("click", "#thermalprintbtn-demo", function () {
        Swal.fire({
            icon: "error",
            text: "You have no bill",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: "btn btn-success waves-effect waves-light"
            }
        })
    });

    $(document).on("click", "#printbtn-demo", function () {
        Swal.fire({
            icon: "error",
            text: "You have no bill",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: "btn btn-success waves-effect waves-light"
            }
        })
    });

    $(document).on("click", "#view-medicine-details", function () {
        const medicineId_edit = $(this).data("id");
        const medicineId_add = $(this).data("row-index");
        var patientAdmissionId = $('#patient_admission_id').val();
        var clientId = $('#client_id').val();

        if (medicineId_edit) {
            // Edit flow
            $('#medicineForm')[0].reset();
            $("#medicine-details-modal").modal("show");
            $("#patient_addmissionId").val(patientAdmissionId);
            $("#medicine-id").val(medicineId_edit);
            $("#client-id").val(clientId);
            var medicineId = medicineId_edit;
        } else if (medicineId_add !== undefined) {
            // Add flow
            const selectedData = $(`#medications_search_${medicineId_add}`).select2("data");

            if (selectedData.length > 0) {
                const medInfo = selectedData[0];
                var medicineId = medInfo.id;

                $('#medicineForm')[0].reset();
                $("#medicine-details-modal").modal("show");
                $("#patient_addmissionId").val(patientAdmissionId);
                $("#medicine-id").val(medicineId);
                $("#client-id").val(clientId);
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Please select a medication first",
                    customClass: {
                        confirmButton: "btn btn-danger waves-effect waves-light",
                    },
                });
            }
        }
        $.ajax({
            url: BASE_URL + "/get-medicine-details-discharge/" + patientAdmissionId + "/" + medicineId,

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

    });

    flatpickr("#medicineStartDate", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
    });

    flatpickr("#discontinueDate", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
    });

    $("#save-medicine-details").on("click", function () {
        const medicineDetails = {
            clientId: $("#client-id").val(),
            patientAdmissionId: $("#patient_admission_id").val(),
            medicineId: $("#medicine-id").val(),
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
            url: BASE_URL + "/save-medicine-details-discharge",
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
                    // location.reload();
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


    $("#medication_request_btn").click(function () {
        // let formData = $("#physical_discharge_form").serialize();
        // formData +=
        //     "&dischargeDate=" + encodeURIComponent($("#dischargeDate").val());
        $.ajax({
            url:
                BASE_URL +
                "/discharge-medication-request/" +
                $("#patient_admission_id").val(),
            type: "PUT",
            data: $("#prescription_form").serialize(),
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
            error: function (xhr) {
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                }
            },
        });
    });
});


function initialPageLoad(patientAdmsissionId) {

    $.ajax({
        url: BASE_URL + "/edit-discharge-medication-request/" + patientAdmsissionId,
        type: "GET",
        success: function (response) {
            if (response.status === true) {
                console.log(response.data);
                // populatMedicationData(medicationData);
                populateMedicationTable(response);




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


// Function to populate the medication table based on the AJAX response
function populateMedicationTable(response) {
    const medications = response.data;
    const medicationTbody = $("#medication_tbody_div");

    // Clear existing rows
    medicationTbody.empty();
    console.log(medications.length);
    let existingMedicationCnt = (medications.length) - 1;
    $('#existing_med_cnt').val(existingMedicationCnt);
    // alert(existingMedicationCnt);

    // Loop through each medication in the response
    medications.forEach((med, index) => {
        console.log(med.medicine.administrationRoute);
        const newRow = `
            <tr>
                <td style="min-width:270px;">
                    <select id="medications_search_${index}" 
                        name="medications_search[]" 
                        class="form-select medications-search">
                        <option value="${med.medicine.medicineId}" selected>
                            ${med.medicine.tradeName}
                        </option>
                    </select>
                </td>
                <td>
                    <p class="mb-5">Drug Type : <span class="pharmaceuticalForm">${med.medicine.drugType}</span></p>
                    <p class="mb-5">Storage : <span class="storageConditions">${med.medicine.storageConditions}</span></p>
                    <p class="mb-5">Pharmaceutical Form : <span class="packageTypes">${med.medicine.packageTypes}</span></p>
                    <p class="mb-5">Administration Route : <span class="administrationRoute">${med.medicine.administrationRoute}</span></p>
                </td>
                <td><input type="text" name="medication_dosage[]" class="form-control" value="${med.dosage}"></td>
                <td><input type="text" name="medication_frequency[]" class="form-control" value="${med.frequency}"></td>
                <td>
                    <select id="medication_allergy_${index}" name="medication_allergy[]" class="form-select select2 medication_allergy ">
                        <option value="1" ${med.is_allergiesUnknown ? "selected" : ""}>Yes</option>
                        <option value="0" ${!med.is_allergiesUnknown ? "selected" : ""}>No</option>
                    </select>
                </td>
                 <td>
                 <div class="d-flex">
                    <button type="button" class="btn rounded-pill btn-icon btn-label-primary view-medicine-details-btn me-2" data-id="${med.medicine.medicineId}" id="view-medicine-details">
                       <i class="ti ti-eye"></i>
                    </button>
                    <button type="button" class="btn rounded-pill btn-icon btn-label-primary remove-medicine" data-row-index="${med.medicine.medicineId}" id="remove-medicine">
                        <i class="ti ti-trash"></i>
                    </button>
                    </div>
                </td>

            </tr>
        `;

        // Append the new row to the table body
        medicationTbody.append(newRow);

        let selectBox = $(`#medications_search_${index}`);

        // Already select2 init undenkil destroy cheyyum
        if (selectBox.hasClass("select2-hidden-accessible")) {
            selectBox.select2("destroy");
        }
        // wrapper add cheyyum
        selectBox.wrap('<div class="position-absolute"></div>');
        // select2 init
        selectBox.select2({
            placeholder: "Search Medications Name",
            dropdownParent: selectBox.parent(),
            width: "100%",
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
                                pharmaceuticalForm: value.pharmaceuticalForm,
                                packageTypes: value.packageTypes,
                                storageConditions: value.storageConditions,
                                scientificName: value.scientificName,
                                administrationRoute: value.administrationRoute,
                            };
                        }),
                    };
                },
                cache: true,
            },
        });
    });
}

currentRowIndex = $(this).closest("tr").index();
$(document).on("input", "#frequency", function () {
    let frequencyValue = $(this).val();

    $("#medication_tbody_div tr").eq(currentRowIndex).find('input[name="medication_frequency[]"]').val(frequencyValue);
});
// auto appending in table row 

$(document).on("input", "#txtDoseQuantity", function () {
    let dosage = $(this).val();

    $("#medication_tbody_div tr").eq(currentRowIndex).find('input[name="medication_dosage[]"]').val(dosage);
});

document.addEventListener('DOMContentLoaded', function () {
    // Handle remove button clicks
    const removeButtons = document.querySelectorAll('.remove-service-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const serviceId = this.getAttribute('data-service-id');
            const row = this.closest('tr');

            // Here you would typically make an AJAX call to remove the service
            // For now, just remove the row from the UI and recalculate totals
            row.remove();
            recalculateTotals();
        });
    });

    function recalculateTotals() {
        let totalAmount = 0;
        let totalDiscount = 0;
        let totalVat = 0;
        let totalNetAmount = 0;

        const rows = document.querySelectorAll('.service-row');
        rows.forEach(row => {
            const price = parseFloat(row.cells[3].textContent);
            const qty = parseFloat(row.cells[2].textContent);
            const discountAmount = parseFloat(row.cells[5].textContent);
            const vatAmount = parseFloat(row.cells[7].textContent);
            const totalRowAmount = parseFloat(row.cells[8].textContent);

            totalAmount += price * qty;
            totalDiscount += discountAmount;
            totalVat += vatAmount;
            totalNetAmount += totalRowAmount;
        });

        // Update summary values
        document.getElementById('inpatient_total_amount_sum').value = totalNetAmount.toFixed(2);
        document.getElementById('inpatient_total_amount').textContent = totalAmount.toFixed(2);
        document.getElementById('inpatient_total_discount_sum_td').textContent = totalDiscount.toFixed(2);
        document.getElementById('inpatient_total_discount_sum').value = totalDiscount;
        document.getElementById('inpatient_total_vat_sum_td').textContent = totalVat.toFixed(2);
        document.getElementById('inpatient_total_vat_sum').value = totalVat;
        document.getElementById('inpatient_service_order_net_amount_td').textContent = totalNetAmount.toFixed(2);
        document.getElementById('inpatient_service_order_net_amount').value = totalNetAmount;
    }
});