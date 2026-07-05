let currentRowIndex = null;
$(document).ready(function () {
    $("#vital_room_main_menu").addClass("active open menu-item-animating");
    $("#vital_room_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $('#Prescription-Print')
        .addClass('disabled-link')
        .css('pointer-events', 'none');


    var reservationClientDetailsId = $("#reservation_client_details_id").val();
    var reservationId = $("#reservation_id").val();
    var clientId = $("#client_id").val();

    if (reservationClientDetailsId && reservationId && clientId) {
        initialPageLoad(reservationClientDetailsId, reservationId, clientId);
    }

    // const tagifyBasicEl = document.querySelector("#TagifyUserList");
    // const TagifyBasic = new Tagify(tagifyBasicEl);

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

    $("#noCheckbox").change(function () {
        if (this.checked) {
            $("#offcanvasAddUser").hide();
        }
    });

    // Hide all content sections except the first (Vital sign) on page load
    $(document).ready(function () {
        // Initially show Vital tab only
        $(".tab-content").hide();
        $("#vital_sign_content").show();
        $("#vital_head").show();

        $(".vital-tabs .nav-link").click(function () {
            // Remove active class from all tabs
            $(".nav-link").removeClass("active");

            // Add active to clicked tab
            $(this).addClass("active");

            // Hide all content sections
            $(".tab-content").hide();

            // Show corresponding content
            if (this.id === "vital-sign-tab") {
                $("#vital_sign_content").show();
            } else if (this.id === "examination-tab") {
                $("#examination_content").show();
            } else if (this.id === "Outcomes-And-Complication-tab") {
                $("#Outcomes-And-Complication_content").show();
            } else if (this.id === "tooth-picker-tab") {
                $("#tooth_picker_content").show();
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
            clientId: $("#clientId").val(),
            reservationId: $("#reservation_id").val(),
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
            url: BASE_URL + "/save-medicine-details",
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




    // $(document).ready(function() {
    function calculateBMI(weight, height) {
        height = height / 100; // Convert height to meters from cm
        let bmi = (weight / (height * height)).toFixed(2); // Calculate BMI and round to 2 decimal places
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
            $("#bmi").val(bmi); // Set BMI in the input field
            let bmiGrade = getBMIGrade(bmi);
            $(".bmi-message").text(bmiGrade); // Display BMI grade message
        } else {
            $("#bmi").val(""); // Clear BMI input if values are missing
            $(".bmi-message").text + ""; // Clear BMI message if values are missing
        }
    });


    // Prevent pain_scale from exceeding 10, handle paste, and clear invalid inputs
    if (typeof enforceNumericRange === "function") {
        enforceNumericRange(".pain_scale", 0, 10);
    }

    // Listen for input changes in the form
    $("#vital_sign_form").on("input", function () {
        // Update the Temperature value
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
            $("#last_menstruation_period").val()
        );
        console.log($("#birth_weight").val());
        $("#birth_weight_span").text($("#birth_weight").val());
        $("#systolic_blood_pressure_span").text($("#systolic_blood_pressure").val());
        $("#diastolic_blood_pressure_span").text($("#diastolic_blood_pressure").val());
        $("#heartRhythm_span").text($("#heartRhythm").val());
    });



    $("#medical_record_btn").click(function () {
        // Serialize data from all forms
        var vitalsignFormData = $("#vital_sign_form").serialize();
        var hiddenvalueform = $("#hidden_value_form").serialize();
        var examination_form = $("#examination_form").serialize();
        var outcomes_form = $("#outcomes_form").serialize();
        var ecg_report_form = $("#ecg_report_form").serialize();

        var combinedData =
            vitalsignFormData
            +
            "&" +
            hiddenvalueform +
            "&" +
            examination_form +
            "&" +
            outcomes_form +
            "&" +
            ecg_report_form
            ;

        // Define AJAX request URL and method
        var ajaxUrl = BASE_URL + "/save-medicalrecords-vitalroom";
        var method = "POST";
        var reservationId = $("#reservation_id").val();

        console.log(reservationId);
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
                    console.error("Error:", xhr);
                }
            },
        });
    });


    $("#update_medical_record_btn").click(function () {
        var vitalsignFormData = $("#vital_sign_form").serialize();
        var hiddenvalueform = $("#hidden_value_form").serialize();
        var examination_form = $("#examination_form").serialize();
        var outcomes_form = $("#outcomes_form").serialize();
        var ecg_report_form = $("#ecg_report_form").serialize();


        var reservationId = $("#reservation_id").val();
        var reservationClientDetailsId = $("#reservation_client_details_id").val();
        var combinedData =
            vitalsignFormData
            +
            "&" +
            hiddenvalueform +
            "&" +
            examination_form +
            "&" +
            outcomes_form +
            "&" +
            ecg_report_form
            ;
        var ajaxUrl =
            BASE_URL +
            "/update-medicalrecords-vitalroom/" +
            reservationClientDetailsId + "/" + reservationId;

        var method = "PUT";
        console.log(reservationId);
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
                        $.ajax({
                            url: "/dispatch-ucaf-job",
                            type: "POST",
                            data: { reservationId: reservationId },
                            success: function (data) {
                                console.log("Job dispatched:", data);
                                window.location.href = BASE_URL + "/vital_room_table";
                            },
                            error: function (xhr, status, error) {
                                console.error("Job error:", xhr.responseText);
                                window.location.href = BASE_URL + "/vital_room_table";
                            }
                        });
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

    function initialPageLoad(reservationClientDetailsId, reservationId, clientId) {
        $.ajax({
            url: BASE_URL + "/edit-medicalrecords-vital-room/" + reservationClientDetailsId,
            type: "GET",
            success: function (response) {
                if (response.status === true) {
                    var vitalSign = response.data.vital_sign_data;
                    var reservationDetails = response.data.reservation_details;
                    var ecgFilePath = response.data.ecg_report_file;
                    console.log(ecgFilePath);

                    ecgFilePath.forEach(file => {
                        if (file.is_delete === 0) {
                            appendEcgFile(file.fileNamePath, file.fileName, file.mediafilesId);
                        }
                    });

                    var vitalsText = `Pulse - ${reservationDetails.pulse} | BP - ${reservationDetails.BP} | Temperature - ${reservationDetails.temperature} | Respiratory Rate - ${reservationDetails.respiratoryRate} | Pain Scale - ${reservationDetails.painScale || ''} | Height - ${vitalSign.height} | Weight - ${vitalSign.weight} | Body Mass Index - ${vitalSign.bmi} | BMI Status - ${vitalSign.bmi}`;
                    console.log(reservationDetails);
                    $("#height").val(vitalSign.height);
                    $("#weight").val(vitalSign.weight);
                    $("#bmi").val(vitalSign.bmi);
                    $("#blood_pressure").val(reservationDetails.BP);
                    $("#temperature").val(reservationDetails.temperature);
                    $("#pulse").val(reservationDetails.pulse);
                    $("#respiratory_rate").val(reservationDetails.respiratoryRate);
                    $("#pain_scale").val(reservationDetails.painScale);
                    $("#oxygen_saturation").val(
                        reservationDetails.oxygenSaturation
                    );
                    $("#last_menstruation_period").val(
                        reservationDetails.lastMenstruationPeriod
                    );
                    $("#examination_textarea").text(reservationDetails.examinationAndInspection);
                    $("#outcomes_textarea").val(reservationDetails.outcomesAndComplication);
                    $("#ecgReport").val(reservationDetails.ecgReport);


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


});


function appendEcgFile(filePath, fileName, mediafilesId) {
    const fullPath = BASE_URL + '/storage/' + filePath;

    const ecgHtml = `
        <div class="dz-preview dz-file-preview">
            <div class="subimage">
                <div class="dz-image"><img data-dz-thumbnail src="${fullPath}"  style="width: 100%;"/></div>
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

    $('#already_exist_files').append(ecgHtml);
}

