$(document).ready(function () {
    $("#appointment_main_menu").addClass("active open menu-item-animating");
    $("#insurance_appointmrent_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#financialCategory").val("insurance").trigger("change");

    $("#flexSwitchCheckDefault").on("click", function () {
        $("#modalDateTimeType").selectpicker("val", "");
        $("#hiddenDateTimeType").val("");
        $("#systemDateTimeFields").hide();
        $("#manualDateTimeFields").hide();
        $("#appointmentDateR").val("");
        $("#appointmentTime").val("");
        $("#totalDuration").val("");
        $("#manualAppointmentDate").val("");
        $("#manualAppointmentTime").val("");
        $("#manualAppointmentDuration").val("");
        $("#modalDateTimeType").selectpicker("val", "system");
        $("#hiddenDateTimeType").val("system");
        $("#systemDateTimeFields").show();
        $("#apointmentSchedulingModal").modal("show");
    });

    $("#modalDateTimeType").on("change", function () {
        let val = $(this).val();
        $("#hiddenDateTimeType").val(val);
        if (val === "system") {
            $("#systemDateTimeFields").show();
            $("#manualDateTimeFields").hide();
        } else if (val === "manual") {
            $("#manualDateTimeFields").show();
            $("#systemDateTimeFields").hide();
            if (!$("#manualAppointmentDate")[0]._flatpickr) {
                flatpickr("#manualAppointmentDate", {
                    dateFormat: "Y-m-d",
                    minDate: "today",
                });
            }
            if (!$("#manualAppointmentTime")[0]._flatpickr) {
                flatpickr("#manualAppointmentTime", {
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "h:i K",
                    time_24hr: false,
                });
            }
            if ($("#manualAppointmentDuration").val() === "") {
                $("#manualAppointmentDuration").val(10);
            }
        } else {
            $("#systemDateTimeFields").hide();
            $("#manualDateTimeFields").hide();
        }
    });

    $("#apointmentSchedulingModal").on("hidden.bs.modal", function () {
        $("#modalDateTimeType").val("");
        $("#modalDateTimeType").show();
    });

    flatpickr("#appointmentDateR", {
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function (selectedDates) {
            updateAppointmentTimePicker(selectedDates[0]);
            listTimeSlots();
        },
    });

    let appointmentTimePicker;
    function updateAppointmentTimePicker(selectedDate) {
        const now = new Date();
        const isToday = selectedDate.toDateString() === now.toDateString();
        if (appointmentTimePicker) {
            appointmentTimePicker.destroy();
        }
        appointmentTimePicker = flatpickr("#appointmentTime", {
            enableTime: true,
            noCalendar: true,
            dateFormat: "h:i K",
            time_24hr: false,
            minTime: isToday
                ? now.getHours() + ":" + now.getMinutes()
                : "00:00",
        });
    }

    flatpickr("#flatpickr-time-start", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: false,
    });
    flatpickr("#flatpickr-time-end", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: false,
    });

    $("#flexSwitchCheckDefault").click(function () {
        if ($("#visit_date_div").is(":hidden")) {
            var currentTime = new Date();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            var ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            var formattedTime = hours + ":" + minutes + " " + ampm;
            $("#autoTime").val(formattedTime);
            $("#visit_date_div").show();
            $("#visit_auto_time_div").show();
            $("#visit_manual_time_div").show();
            $("#visit_duration_div").show();
            $("#apointmentSchedulingModal").modal("show");
        } else {
            $("#visit_date_div").hide();
            $("#visit_auto_time_div").hide();
            $("#visit_manual_time_div").hide();
            $("#visit_duration_div").hide();
            $("#autoTime").val("");
            $("#apointmentSchedulingModal").modal("hide");
        }
    });

    $("#serviceName").select2("destroy");
    $("#serviceName")
        .wrap('<div class="position-relative"></div>')
        .select2({
            placeholder: "Search Service",
            dropdownParent: $("#serviceName").parent(),
            width: "100%",
            ajax: {
                url: function () {
                    return BASE_URL + "/get-insurance-payer-linked-services";
                },
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        serviceCodeOrName: params.term,
                        clinicId: $("#clinicId").val(),
                        serviceId: $("#serviceName").val(),
                        clientId: $("#IDNational").val(),
                        providerId: $("#employeeId").val(),
                        departmentId: $("#department").val(),
                        type: "appointment",
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

    $("#nameOrFileOrMobile").select2();
    $("#nameOrFileOrMobile").select2({
        placeholder: "Search Name",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url: BASE_URL + "/search-by-patient-name",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    query: params.term,
                };
            },
            processResults: function (data) {
                return { results: data };
            },
            cache: true,
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
    });

    function formatRepo(repo) {
        if (repo.loading) {
            return repo.text;
        }
        console.log("name",repo.text);
        var markup =
            "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" +
            repo.text +
            "</div>";
        markup += "</div></div>";
        return markup;
    }

    function formatRepoSelection(repo) {
        return repo.text || repo.id;
    }

    $("#fileId").select2({
        placeholder: "Search File Id",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url: BASE_URL + "/search-by-file-id",
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
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
    });

    $("#IDNational").select2("destroy");
    $("#IDNational")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#IDNational").parent(),
            placeholder: "Search ID National",
            width: "100%",
            allowClear: true,
            minimumInputLength: 3,
            ajax: {
                url:
                    BASE_URL +
                    "/search-patient-by-idnational-or-mobile-or-name",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        clientIdNational: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data,
                    };
                },
                cache: true,
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            templateResult: formatSearch,
            templateSelection: formatSearchSelection,
        });

    $("#searchInsuranceHolderName").select2({
        placeholder: "Search ID National",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url: BASE_URL + "/search-patient-by-idnational-or-mobile-or-name",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    clientIdNational: params.term,
                };
            },
            processResults: function (data) {
                return {
                    results: data,
                };
            },
            cache: true,
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: formatSearch,
        templateSelection: formatSearchSelection,
    });

    $("#searchmobile").select2({
        placeholder: "Search Mobile",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url: BASE_URL + "/search-patient-by-query",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    clientMobile: params.term,
                };
            },
            processResults: function (data) {
                return {
                    results: data,
                };
            },
            cache: true,
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: formatSearch,
        templateSelection: formatSearchSelection,
    });

    $("#employeeId").select2("destroy");
    $("#employeeId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#employeeId").parent(),
            placeholder: "Search Provider",
            width: "100%",
            minimumInputLength: 0,
            ajax: {
                url: BASE_URL + "/get-employee-by-branch-for-insurance",
                dataType: "json",
                delay: 250,
                beforeSend: function () {
                    $("#loader-overlay").show();
                },
                data: function (params) {
                    var branch = $("#clinicId").val();
                    var department = $("#department").val();
                    if (!branch) {
                        $("#employeeId")
                            .next(".select2-container")
                            .find(".select2-selection__rendered")
                            .html(
                                '<span class="text-danger">Please select a branch</span>',
                            );
                    } else {
                        $("#employeeId")
                            .next(".select2-container")
                            .find(".select2-selection__rendered")
                            .html("");
                    }
                    return {
                        employeeName: params.term,
                        branch: branch,
                        department: department,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data,
                    };
                },
                complete: function () {
                    $("#loader-overlay").hide();
                },
                cache: true,
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            templateResult: formatRepo,
            templateSelection: formatRepoSelection,
        });

    $("#IDNational").on("select2:select", function (e) {
        getPatientById(e.params.data.id);
    });

    $("#searchmobile").on("select2:select", function (e) {
        getPatientById(e.params.data.id);
    });

    $("#searchname").on("select2:select", function (e) {
        getPatientById(e.params.data.id);
    });

    $("#serviceName").on("select2:select", function (e) {
        checkFollowupOrNot(e.params.data.id);
    });

    $("#searchname").select2({
        placeholder: "Search Name",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url: BASE_URL + "/search-patient-by-query",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    clientName: params.term,
                };
            },
            processResults: function (data) {
                return {
                    results: data,
                };
            },
            cache: true,
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: formatSearch,
        templateSelection: formatSearchSelection,
    });

    function formatSearch(repo) {
        if (!repo.id) {
            return repo.text;
        }
        return $(
            `<div>
                <strong>${repo.text}</strong><br>
                <small>Mobile: ${repo.clientMobile} | ID: ${repo.clientIdNational} | MRN: ${repo.id} </small>
            </div>`,
        );
    }

    function formatSearchSelection(repo) {
        return repo.text || repo.id;
    }

    $("#doctor_unavailable_message").hide();
    $("#time_slot_div").hide();
    $("#relationshipType").change(function () {
        let selectedId = $("#IDNational").val();
        let selectedText = $("#IDNational option:selected").text();
        if ($(this).val() == "Self") {
            if (
                !$("#searchInsuranceHolderName").find(
                    'option[value="' + selectedId + '"]',
                ).length
            ) {
                $("#searchInsuranceHolderName").append(
                    $("<option>", {
                        value: selectedId,
                        text: selectedText,
                    }),
                );
            }
            $("#searchInsuranceHolderName").val(selectedId).trigger("change");
        } else if (
            $.inArray($(this).val(), [
                "Spouse",
                "Common Law Spouse",
                "Injured Party",
                "Other",
            ]) !== -1
        ) {
            $("#searchInsuranceHolderName")
                .html('<option value="">Search Name</option>')
                .val("")
                .trigger("change");
        }
    });
});

$(document).on("change", "#nameOrFileOrMobile", function () {
    console.log("Dropdown value changed");
    let query = $(this).val();
    console.log("Query:", query);
    if (query === "") {
        $("#nameOrFileOrMobile")
            .empty()
            .append('<option value="">Search Name</option>');
        return;
    }
    $.ajax({
        url: BASE_URL + "/search-by-patient-name",
        type: "GET",
        data: { query: query },
        success: function (response) {
            console.log("AJAX success:", response);
            $("#nameOrFileOrMobile")
                .empty()
                .append('<option value="">Search Name</option>');
            $.each(response, function (clientId, clientName) {
                $("#nameOrFileOrMobile").append(
                    '<option value="' +
                        clientId +
                        '">' +
                        clientName +
                        "</option>",
                );
            });
        },
        error: function () {
            console.log("AJAX error");
        },
    });
});

$(document).on("change", "#department", function () {
    var providerId = $(this).val();
    var serviceSelect = $("#speciality");
    if (providerId) {
        $("#loader-overlay").show();
        $.ajax({
            url: "/get-speciality-by-department/" + providerId,
            type: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                console.log(response.data);
                $("#speciality").val(response.data);
            },
        });
    }
});

$(document).on("click", "#appointmentBtn", function (e) {
    e.preventDefault(e);
    let dateTimeType = $("#modalDateTimeType").val();
    var formData = new FormData($("#appointment_form")[0]);
    formData.append("dateTimeType", dateTimeType);
    formData.append(
        "appointmentDate",
        dateTimeType === "system"
            ? $("#appointmentDateR").val()
            : $("#manualAppointmentDate").val(),
    );
    formData.append(
        "appointmentTime",
        dateTimeType === "system"
            ? $("#appointmentTime").val()
            : $("#manualAppointmentTime").val(),
    );
    if (dateTimeType === "system") {
        formData.append("totalDuration", $("#totalDuration").val());
    } else {
        formData.append(
            "manualAppointmentDuration",
            $("#manualAppointmentDuration").val(),
        );
    }
    console.log("dateTimeType:", dateTimeType);
    $("#loader-overlay").show();
    $.ajax({
        url: $("#doctor_form").attr("action"),
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#loader-overlay").hide();
            console.log(response);
            if (response.error) {
                Swal.fire({
                    icon: "error",
                    title: "Error Detected!",
                    html: `<b>Error Code:</b> ${response.errorCode} <br> <b>Message:</b> ${response.errorMessage}`,
                    customClass: { confirmButton: "btn btn-danger" },
                });
            } else if (response.status === true) {
                if (
                    response.data.nphiesStatus == "eligible" ||
                    response.data.reservationId == "existing"
                ) {
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        showCancelButton: true,
                        confirmButtonText: "OK",
                        cancelButtonText: "Bill View",
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                            cancelButton:
                                "btn btn-info waves-effect waves-light",
                        },
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        } else if (
                            result.dismiss === Swal.DismissReason.cancel
                        ) {
                            console.log(response);
                            window.location.href =
                                "/appointment-insurance-bill/" +
                                response.data.reservationId;
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "Eligibility Status",
                        text: `Your eligibility Status is: ${response.data}`,
                        customClass: { confirmButton: "btn btn-warning" },
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    text: response.message,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                }).then(function () {});
            }
            $("#apointmentSchedulingModal").modal("hide");
        },
        error: function (xhr, status, error) {
            $("#loader-overlay").hide();
            if (xhr.status === 422) {
                $("#apointmentSchedulingModal").modal("hide");
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

$(document).on("change", "#clinicId", function () {
    var clinicId = $(this).val();
    var serviceSelect = $("#employeeId");
    serviceSelect.empty();
    serviceSelect.append('<option value="">Select Provider</option>');
    if (clinicId) {
        $("#loader-overlay").show();
        $.ajax({
            url: "/appointment-get-providers-by-branch/" + clinicId,
            type: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                console.log(response.data);
                if (response.data.doctors) {
                    serviceSelect.append('<optgroup label="Doctors">');
                    $.each(
                        response.data.doctors,
                        function (employeeId, fullName) {
                            serviceSelect.append(
                                '<option value="' +
                                    employeeId +
                                    '">' +
                                    fullName +
                                    "</option>",
                            );
                        },
                    );
                    serviceSelect.append("</optgroup>");
                }
                if (response.data.nurses) {
                    serviceSelect.append('<optgroup label="Nurses">');
                    $.each(
                        response.data.nurses,
                        function (employeeId, fullName) {
                            serviceSelect.append(
                                '<option value="' +
                                    employeeId +
                                    '">' +
                                    fullName +
                                    "</option>",
                            );
                        },
                    );
                    serviceSelect.append("</optgroup>");
                }
            },
        });
    }
});

$(document).on("change", "#appointmentDateR", function () {
    listTimeSlots();
});

$(document).on("click", ".select-time-btn", function () {
    const startTime = $(this).data("start");
    $("#appointmentTime").val(startTime);
    $(".select-time-btn").prop("disabled", false);
    $(this).prop("disabled", true);
    $(".waiting-time-table tbody td .waiting-time-btn").each(function () {
        const buttonStartTime = $(this).data("start");
    });
});

$(document).on("change", ".serviceName", function () {
    var serviceId = $(this).val();
    $.ajax({
        url: "/get-appointment-service-details/" + serviceId,
        type: "GET",
        success: function (response) {
            console.log(response);
            $("#totalDuration").val(response.data.duration);
            $("#totalCost").val(response.data.cost);
        },
    });
});

$(document).on("change", "#totalDuration", function () {
    var totalDuration = $(this).val();
    var serviceId = $("#serviceName").val();
    $.ajax({
        url:
            "/get-provider-time-slot-based-on-change-in-totalDuration/" +
            serviceId,
        type: "put",
        data: { totalDuration: totalDuration },
        success: function (response) {
            if (response.status === true) {
                listTimeSlots();
            }
        },
    });
});

function isPastTime(slotTimeStr, appointmentDate) {
    if (!slotTimeStr) return true;
    const now = new Date();
    const slotDateTime = new Date(appointmentDate + " " + slotTimeStr);
    if (appointmentDate === now.toISOString().split("T")[0]) {
        return slotDateTime < now;
    }
    return false;
}
function listTimeSlots() {
    $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/get-provider-time-slot/" + $("#employeeId").val(),
        type: "GET",
        data: {
            appointmentDate: $("#appointmentDateR").val(),
            clinicId: $("#clinicId").val(),
            serviceId: $("#serviceName").val(),
        },
        success: function (response) {
            $("#loader-overlay").hide();
            $("#time_slot_div").show();
            const timeSlots = response.data.availableTimeSlots;
            $("#totalDuration").val(response.data.serviceDuration);
            const appointmentDate = $("#appointmentDateR").val();
            const tbody = $("table.sytem-time-table tbody");
            tbody.empty();
            for (let i = 0; i < timeSlots.length; i += 2) {
                const startTime = new Date(
                    timeSlots[i].start.date,
                ).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });
                const nextTimeSlot = timeSlots[i + 1];
                const nextStartTime = nextTimeSlot
                    ? new Date(nextTimeSlot.start.date).toLocaleTimeString(
                          "en-US",
                          { hour: "2-digit", minute: "2-digit", hour12: true },
                      )
                    : "";
                const disableStart = isPastTime(startTime, appointmentDate)
                    ? "disabled"
                    : "";
                const disableNext = isPastTime(nextStartTime, appointmentDate)
                    ? "disabled"
                    : "";
                const newRow = `
                    <tr class="abc">
                        <td class="fixed-width">
                            <button type="button"
                                class="btn btn-sm btn-primary waves-effect waves-light select-time-btn"
                                data-start="${startTime}"
                                ${disableStart}>
                                ${startTime}
                            </button>
                        </td>
                        <td class="fixed-width">
                            <button type="button"
                                class="btn btn-sm btn-primary waves-effect waves-light select-time-btn"
                                data-start="${nextStartTime}"
                                ${disableNext}>
                                ${nextStartTime}
                            </button>
                        </td>
                    </tr>`;
                tbody.append(newRow);
            }
            const waitingtimetabletbody = $("table.waiting-time-table tbody");
            waitingtimetabletbody.empty();
            for (let i = 0; i < timeSlots.length; i += 2) {
                const startTime = new Date(
                    timeSlots[i].start.date,
                ).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });
                const nextTimeSlot = timeSlots[i + 1];
                const nextStartTime = nextTimeSlot
                    ? new Date(nextTimeSlot.start.date).toLocaleTimeString(
                          "en-US",
                          { hour: "2-digit", minute: "2-digit", hour12: true },
                      )
                    : "";
                const newRow = `
                    <tr class="abc">
                        <td class="fixed-width">
                            <button type="button"
                                class="btn btn-sm btn-info waves-effect waves-light waiting-time-btn"
                                disabled>
                                ${startTime}
                            </button>
                        </td>
                        <td class="fixed-width">
                            <button type="button"
                                class="btn btn-sm btn-info waves-effect waves-light waiting-time-btn"
                                disabled>
                                ${nextStartTime}
                            </button>
                        </td>
                    </tr>`;
                waitingtimetabletbody.append(newRow);
            }
        },
        error: function () {
            $("#loader-overlay").hide();
            console.error("Failed to load time slots");
        },
    });
}
$(document).on("click", ".select-time-btn:not(:disabled)", function () {
    $(".select-time-btn").prop("disabled", true);
    $(this).prop("disabled", false);
    $(".select-time-btn").removeClass("selected-slot");
    $(this).addClass("selected-slot");
});

$(document).ready(function () {
    $("#insuranceRelationName").hide();
});

function getPatientById(selectedId) {
    $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/get-patient-by-id",
        type: "GET",
        data: { clientId: selectedId },
        success: function (response) {
            $("#loader-overlay").hide();
            if (!response.status) return;
            console.log("data:", response.data);
            const client = response.data.client;
            const insurancePolicy = client.insurance_policy;
            const policyStatus = response.data.policy_status;
            const expiryDate = response.data.policy_expiry_date;
            const relationData = response.data.relation;
            const policyHolder = response.data.policyHolder;
            console.log("policy:", insurancePolicy);
            const memberId = insurancePolicy?.membershipId ?? null;
            const payer = response.data.payer;
            const tpaCompany = response.data.tpaCompany;
            const policyNumber = insurancePolicy?.policy?.policyNumber ?? null;
            const className = response.data.class;
            console.log("memberId:", memberId);
            if (tpaCompany != null) {
                $("#tpaCompanyDiv").show();
            } else {
                $("#tpaCompanyDiv").hide();
            }
            $("#clientName_en").val(client.clientName_en);
            $("#payer").val(payer);
            $("#tpaCompany").val(tpaCompany);
            $("#memberId").val(memberId);
            $("#policyNumber").val(policyNumber);
            $("#class").val(className);
            $("#relationwithSubscriber").val(relationData);
            $("#InsuranceHolderName").val(policyHolder);
            $("#secondName_en").val(client.secondName_en);
            $("#thirdName_en").val(client.thirdName_en);
            $("#fourthName_en").val(client.fourthName_en);
            $("#clientName").val(client.clientName);
            $("#secondName_ar").val(client.secondName_ar);
            $("#thirdName_ar").val(client.thirdName_ar);
            $("#fourthName_ar").val(client.fourthName_ar);
            if (client.clinicId) {
                $("#clinicId").empty().selectpicker("destroy");
                $("#clinicId").selectpicker();
                $.ajax({
                    url: BASE_URL + "/get-clinic-by-id/" + client.clinicId,
                    type: "GET",
                    success: function (res) {
                        if (res.status && res.data) {
                            $("#clinicId").empty();
                            $("#clinicId").append(
                                new Option(
                                    res.data.name,
                                    res.data.id,
                                    true,
                                    true,
                                ),
                            );
                            $("#clinicId").val(res.data.id).trigger("change");
                            $("#clinicId").selectpicker("refresh");
                        }
                    },
                });
            }
            $("#clientId").val(client.clientId);
            $("#policyId").val(client.insurancePolicyId);
            if (relationData && relationData.toLowerCase() !== "self") {
                $("#insuranceRelationName").show();
            } else {
                $("#insuranceRelationName").hide();
            }
            console.log(client.mobile);
            if (client.mobile) {
                let mobile = client.mobile;
                if (mobile.startsWith("+966")) {
                    mobile = mobile.substring(4);
                }
                $("#mobile").val(mobile);
            }
            if (client.parent_client) {
                if (
                    !$("#searchInsuranceHolderName").find(
                        'option[value="' + client.parent_client.clientId + '"]',
                    ).length
                ) {
                    $("#searchInsuranceHolderName").append(
                        $("<option>", {
                            value: client.parent_client.clientId,
                            text: client.parent_client.clientName_en,
                        }),
                    );
                }
                $("#searchInsuranceHolderName")
                    .val(client.parent_client.clientId)
                    .trigger("change");

                $("#relationshipType").val("Parent").trigger("change");
            }
            if ($("#relationshipType").val() === "Self") {
                if (
                    !$("#searchInsuranceHolderName").find(
                        'option[value="' + client.clientId + '"]',
                    ).length
                ) {
                    $("#searchInsuranceHolderName").append(
                        $("<option>", {
                            value: client.clientId,
                            text: client.clientName_en,
                        }),
                    );
                }
                $("#searchInsuranceHolderName")
                    .val(client.clientId)
                    .trigger("change");
            }
            if (policyStatus === "empty") {
                Swal.fire({
                    icon: "warning",
                    title: "Insurance Policy Missing",
                    text: "This patient does not have an insurance policy.",
                    confirmButtonText: "OK",
                    showDenyButton: false,
                    showCancelButton: false,
                    didOpen: () => {
                        const denyBtn = document.querySelector(".swal2-deny");
                        const cancelBtn =
                            document.querySelector(".swal2-cancel");
                        if (denyBtn)
                            denyBtn.style.setProperty(
                                "display",
                                "none",
                                "important",
                            );
                        if (cancelBtn)
                            cancelBtn.style.setProperty(
                                "display",
                                "none",
                                "important",
                            );
                    },
                });
            } else if (policyStatus === "expired") {
                Swal.fire({
                    icon: "error",
                    title: "Insurance Policy Expired",
                    text: "Policy expired on " + expiryDate.split(" ")[0],
                    confirmButtonText: "OK",
                    showDenyButton: false,
                    showCancelButton: false,
                    didOpen: () => {
                        const denyBtn = document.querySelector(".swal2-deny");
                        const cancelBtn =
                            document.querySelector(".swal2-cancel");
                        if (denyBtn)
                            denyBtn.style.setProperty(
                                "display",
                                "none",
                                "important",
                            );
                        if (cancelBtn)
                            cancelBtn.style.setProperty(
                                "display",
                                "none",
                                "important",
                            );
                    },
                });
            }
        },
        error: function (xhr, status, error) {
            $("#loader-overlay").hide();
            console.error("Patient fetch error:", error);
        },
    });
}

function getInsurancePayerLinkedServices() {
    var clinicId = $("#clinicId").val();
    var serviceId = $("#serviceName").val();
    var clientId = $("#IDNational").val();
    var providerId = $("#employeeId").val();
    var serviceId = serviceName;
    $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/get-insurance-payer-linked-services",
        type: "GET",
        data: {
            providerId: providerId,
            clinicId: clinicId,
            serviceId: serviceId,
            clientId: clientId,
            serviceId: serviceId,
            type: "appointment",
        },
        success: function (response) {
            $("#loader-overlay").hide();
            if (response.status) {
            }
        },
        error: function (xhr, status, error) {
            $("#loader-overlay").hide();
            console.error(error);
        },
    });
}

function checkFollowupOrNot(serviceName) {
    var clinicId = $("#clinicId").val();
    var serviceId = $("#serviceName").val();
    var clientId = $("#IDNational").val();
    var providerId = $("#employeeId").val();
    var departmentId = $("#department").val();
    var serviceId = serviceName;
    $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/appointment-insurance-check-followup-or-not",
        type: "GET",
        data: {
            providerId: providerId,
            clinicId: clinicId,
            serviceId: serviceId,
            clientId: clientId,
            departmentId: departmentId,
            serviceId: serviceId,
        },
        success: function (response) {
            $("#loader-overlay").hide();
            console.log(response.data);
            if (response.status) {
                $("#visitType").val(response.data).trigger("change");
            } else {
            }
        },
        error: function (xhr, status, error) {
            $("#loader-overlay").hide();
            console.error(error);
        },
    });
}
$("#financialCategory").prop("disabled", true);

$("#clientName_en,#secondName_en,#thirdName_en,#fourthName_en").on(
    "input",
    function () {
        this.value = this.value.replace(/[^a-zA-Z ]/g, "");
    },
);

$("#clientName,#secondName_ar,#thirdName_ar,#fourthName_ar").on(
    "input",
    function () {
        this.value = this.value.replace(/[^\u0600-\u06FF ]/g, "");
    },
);
