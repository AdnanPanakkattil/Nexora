$(document).ready(function () {
    $("#appointment_main_menu").addClass("active open menu-item-animating");
    $("#appointmrent_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#apointmentSchedulingModal").on("hidden.bs.modal", function () {
        $("#flexSwitchCheckDefault").prop("checked", false);
    });

    $('#financialCategory').on('change', function () {
        if ($(this).val() === 'company' || $(this).val() === 'insurance') {
            $('#contract_div').show(); // Show the contract div
        } else {
            $('#contract_div').hide(); // Hide the contract div
        }
    });

    flatpickr(".timepicker", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
    });

    // Initialize the Flatpickr time picker
    flatpickr("#flatpickr-time-start", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: false, // Set to true for 24-hour format
    });

    flatpickr("#flatpickr-time-end", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: false, // Set to true for 24-hour format
    });

    $("#flexSwitchCheckDefault").change(function () {
        // Check if the checkbox is checked
        if ($(this).is(":checked")) {
            // Show the visit_date_n_time div
            var currentTime = new Date();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            var ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? "0" + minutes : minutes;
            var formattedTime = hours + ":" + minutes + " " + ampm;

            // Set the current time in the autoTime field
            $("#autoTime").val(formattedTime);
            $("#visit_date_div").show();
            $("#visit_auto_time_div").show();
            $("#visit_manual_time_div").show();
            $("#visit_duration_div").show();
            $("#apointmentSchedulingModal").modal("show");
        } else {
            // Hide the visit_date_n_time div
            $("#visit_date_div").hide();
            $("#visit_auto_time_div").hide();
            $("#visit_manual_time_div").hide();
            $("#visit_duration_div").hide();
            $("#autoTime").val("");
            $("#apointmentSchedulingModal").modal("hide");
        }
    });

    $(".serviceName").select2({
        // placeholder: 'Select Service',
        // allowClear: true,
        ajax: {
            url: function () {
                return (
                    BASE_URL +
                    "/get-services-by-provider-with-individual/" +
                    $("#employeeId").val() + "/" + $("#financialCategory").val() + "/" + $('#contract').val()
                );
            },
            dataType: "json",
            delay: 250,
            data: function (params) {
                var employee = $("#employeeId").val();
                if (!employee) {
                    $("#serviceName")
                        .next(".select2-container")
                        .find(".select2-selection__rendered")
                        .html(
                            '<span class="text-danger">Please select a provider</span>'
                        );
                    return {
                        search: params.term,
                    };
                } else {
                    $("#serviceName")
                        .next(".select2-container")
                        .find(".select2-selection__rendered")
                        .html("");
                    return {
                        search: params.term,
                    };
                }
            },
            processResults: function (data) {
                return {
                    results: $.map(data.data, function (text, id) {
                        return {
                            id: id,
                            text: text,
                        };
                    }),
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

    $("#IDNational").select2({
        placeholder: "Search ID National",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url: BASE_URL + "/search-patient-by-query",
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
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
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
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
    });

    $("#employeeId").select2({
        placeholder: "Search Provider",
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/get-employee-by-branch",
            dataType: "json",
            delay: 250,
            data: function (params) {
                var branch = $("#clinicId").val();
                if (!branch) {
                    $("#employeeId")
                        .next(".select2-container")
                        .find(".select2-selection__rendered")
                        .html(
                            '<span class="text-danger">Please select a branch</span>'
                        );
                    return {
                        employeeName: params.term,
                        branch: branch,
                    };
                } else {
                    $("#employeeId")
                        .next(".select2-container")
                        .find(".select2-selection__rendered")
                        .html("");
                    return {
                        employeeName: params.term,
                        branch: branch,
                    };
                }
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

    $("#IDNational").on("select2:select", function (e) {
        getPatientById(e.params.data.id);
    });

    $("#searchmobile").on("select2:select", function (e) {
        getPatientById(e.params.data.id);
    });

    $("#searchname").on("select2:select", function (e) {
        getPatientById(e.params.data.id);
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
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
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
                        "</option>"
                );
            });
        },
        error: function () {
            console.log("AJAX error");
            // alert("Error retrieving client names");
        },
    });
});

$(document).on("change", "#department", function () {
    var providerId = $(this).val();
    var serviceSelect = $("#speciality");

    // serviceSelect.empty(); // Clear existing options
    // serviceSelect.append('<option value="">Select Service</option>'); // Add default option

    if (providerId) {
        $.ajax({
            url: "/get-speciality-by-department/" + providerId,
            type: "GET",
            success: function (response) {
                console.log(response.data);
                $("#speciality").val(response.data);
                // $.each(response.data, function(employeesFeatureId, name_en) {
                //     // serviceSelect.append('<option value="' + employeesFeatureId + '">' + name_en + '</option>');
                // });
            },
        });
    }
});

$(document).on("click", "#appointmentBtn", function (e) {
    // alert();
    e.preventDefault(e);
    // var formData = new FormData($("#appointment_form")[0]);
    var formData = new FormData($("#appointment_form")[0]);

    // Append additional data from the input elements
    formData.append("appointmentDate", $("#appointmentDateR").val());
    formData.append("appointmentTime", $("#appointmentTime").val());
    formData.append("totalDuration", $("#totalDuration").val());
    $.ajax({
        url: $("#doctor_form").attr("action"),
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
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
            $("#apointmentSchedulingModal").modal("hide"); // Hide modal on success
        },
        error: function (xhr, status, error) {
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

    serviceSelect.empty(); // Clear existing options
    serviceSelect.append('<option value="">Select Provider</option>'); // Add default option

    if (clinicId) {
        $.ajax({
            url: "/appointment-get-providers-by-branch/" + clinicId,
            type: "GET",
            success: function (response) {
                console.log(response.data);
                if (response.data.doctors) {
                    serviceSelect.append('<optgroup label="Doctors">');
                    $.each(
                        response.data.doctors,
                        function (employeeId, firstName_en) {
                            serviceSelect.append(
                                '<option value="' +
                                    employeeId +
                                    '">' +
                                    firstName_en +
                                    "</option>"
                            );
                        }
                    );
                    serviceSelect.append("</optgroup>");
                }

                // Append Nurses group
                if (response.data.nurses) {
                    serviceSelect.append('<optgroup label="Nurses">');
                    $.each(
                        response.data.nurses,
                        function (employeeId, firstName_en) {
                            serviceSelect.append(
                                '<option value="' +
                                    employeeId +
                                    '">' +
                                    firstName_en +
                                    "</option>"
                            );
                        }
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
    $(".select-time-btn").removeClass("hidden-force");
    $(this).addClass("hidden-force");

    // Find the button with the equivalent start time in the waiting time table and hide it
    $(".waiting-time-table tbody td .waiting-time-btn").each(function() {
        const buttonStartTime = $(this).data("start");

        // Check if the start times match, considering possible format differences
        if (buttonStartTime === startTime) {
            $(this).addClass("hidden-force");
        } else{
            $(this).removeClass("hidden-force"); 
        }
    });
});


$(document).on("change", "#serviceName", function () {
    var serviceId = $(this).val();
    $.ajax({
        url: "/get-appointment-service-details/" + serviceId,
        type: "GET",
        success: function (response) {
            // console.log(response.data.duration);
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
    $.ajax({
        url: BASE_URL + "/get-provider-time-slot/" + $("#employeeId").val(),
        type: "GET",
        data: {
            appointmentDate: $("#appointmentDateR").val(),
            clinicId: $("#clinicId").val(),
            serviceId: $("#serviceName").val(),
        },
        success: function (response) {
            $("#time_slot_div").show();
            const timeSlots = response.data.availableTimeSlots;
            $("#totalDuration").val(response.data.serviceDuration);
            const appointmentDate = $("#appointmentDateR").val();
            const tbody = $("table.sytem-time-table tbody");
            tbody.empty();
            for (let i = 0; i < timeSlots.length; i += 2) {
                const startTime = new Date(timeSlots[i].start.date)
                    .toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    });
                const nextTimeSlot = timeSlots[i + 1];
                const nextStartTime = nextTimeSlot
                    ? new Date(nextTimeSlot.start.date).toLocaleTimeString(
                          "en-US",
                          { hour: "2-digit", minute: "2-digit", hour12: true }
                      )
                    : "";
                const disableStart = isPastTime(startTime, appointmentDate) ? "disabled" : "";
                const disableNext = isPastTime(nextStartTime, appointmentDate) ? "disabled" : "";
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
                const startTime = new Date(timeSlots[i].start.date)
                    .toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    });
                const nextTimeSlot = timeSlots[i + 1];
                const nextStartTime = nextTimeSlot
                    ? new Date(nextTimeSlot.start.date).toLocaleTimeString(
                          "en-US",
                          { hour: "2-digit", minute: "2-digit", hour12: true }
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

function getPatientById(selectedId) {
    $.ajax({
        url: BASE_URL + "/get-patient-by-id",
        type: "GET",
        data: {
            clientId: selectedId,
        },
        success: function (response) {
            if (response.status) {
                $("#clientName_en").val(response.data.clientName_en);
                $("#secondName_en").val(response.data.secondName_en);
                $("#thirdName_en").val(response.data.thirdName_en);
                $("#fourthName_en").val(response.data.fourthName_en);
                $("#clientName").val(response.data.clientName);
                $("#secondName_ar").val(response.data.secondName_ar);
                $("#thirdName_ar").val(response.data.thirdName_ar);
                $("#fourthName_ar").val(response.data.fourthName_ar);
                $("#clientId").val(response.data.clientId);
                $("#mobile").val(
                    response.data.mobile.startsWith("+")
                        ? response.data.mobile.substring(1)
                        : response.data.mobile
                );
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        },
    });
}
