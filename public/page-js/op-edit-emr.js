$(document).ready(function () {
    // $("#appointment_main_menu").addClass("active open menu-item-animating");
    // $("#appointmrent_report_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $(".serviceName").select2({
        placeholder: "Search Service",
        allowClear: true,
        minimumInputLength: 2,
         dropdownParent: $(".serviceName").parent(), 
        ajax: {
            url: function () {
                return (
                    BASE_URL +
                    "/get-services-by-provider-with-individual-emr/" +
                    $("#employeeId").val() +
                    "/" +
                    $("#financialCategory").val() +
                    "/" +
                    $("#contract").val()
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

    $("#employeeId").select2({
        placeholder: "Search Provider",
        allowClear: true,
        minimumInputLength: 1,
        dropdownParent: $("#employeeId").parent(), 
        ajax: {
            url: BASE_URL + "/get-employee-by-branch-emr",
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
    function formatRepoSelection(repo) {
        return repo.text || repo.id;
    }
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

    $(document).on("click", ".select-time-btn", function () {
        const startTime = $(this).data("start");
        $("#appointmentTime").val(startTime);
        $(".select-time-btn").removeClass("hidden-force");
        $(this).addClass("hidden-force");

        // Find the button with the equivalent start time in the waiting time table and hide it
        $(".waiting-time-table tbody td .waiting-time-btn").each(function () {
            const buttonStartTime = $(this).data("start");

            // Check if the start times match, considering possible format differences
            if (buttonStartTime === startTime) {
                $(this).addClass("hidden-force");
            } else {
                $(this).removeClass("hidden-force");
            }
        });
    });

    $("#apointment-Modal").on("hidden.bs.modal", function () {
        $("#Timecheckbox").prop("checked", false);
    });

    $("#Timecheckbox").change(function () {
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
            $("#apointment-Modal").modal("show");
        } else {
            // Hide the visit_date_n_time div
            $("#visit_date_div").hide();
            $("#visit_auto_time_div").hide();
            $("#visit_manual_time_div").hide();
            $("#visit_duration_div").hide();
            $("#autoTime").val("");
            $("#apointment-Modal").modal("hide");
        }
    });

    flatpickr(".timepicker", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
    });

    $(document).on("change", "#appointmentDateR", function () {
        listTimeSlots();
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
                    const startTime = new Date(
                        timeSlots[i].start.date
                    ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    });
                    const nextTimeSlot = timeSlots[i + 1];
                    const nextStartTime = nextTimeSlot
                        ? new Date(nextTimeSlot.start.date).toLocaleTimeString(
                              "en-US",
                              {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                              }
                          )
                        : "";
                    const disableStart = isPastTime(startTime, appointmentDate)
                        ? "disabled"
                        : "";
                    const disableNext = isPastTime(
                        nextStartTime,
                        appointmentDate
                    )
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
                const waitingtimetabletbody = $(
                    "table.waiting-time-table tbody"
                );
                waitingtimetabletbody.empty();
                for (let i = 0; i < timeSlots.length; i += 2) {
                    const startTime = new Date(
                        timeSlots[i].start.date
                    ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    });
                    const nextTimeSlot = timeSlots[i + 1];
                    const nextStartTime = nextTimeSlot
                        ? new Date(nextTimeSlot.start.date).toLocaleTimeString(
                              "en-US",
                              {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                              }
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

    $("#appointment-update-Btn").on("click", function (e) {
        e.preventDefault();

        var clientName_en = $("#clientName_en").val();
        var thirdName_en = $("#thirdName_en").val();
        var appointmentType = $("#appointmentType").val();
        var contract = $("#contract").val();
        var mobile = $("#mobile").val();
        var employeeId = $("#employeeId").val();
        var serviceName = $("#serviceName").val();
        var reservationsType = $("#reservationsType").val();
        var appointmentDateR = $("#appointmentDateR").val();
        var appointmentTime = $("#appointmentTime").val();
        var totalDuration = $("#totalDuration").val();
        var appointmentid = $("#appointmentid").val();

        var url = BASE_URL + "/update-reservation/" + appointmentid;

        $.ajax({
            url: url,
            method: "GET",
            data: {
                _token: "{{ csrf_token() }}",
                clientName_en: clientName_en,
                thirdName_en: thirdName_en,
                appointmentType: appointmentType,
                contract: contract,
                mobile: mobile,
                employeeId: employeeId,
                serviceName: serviceName,
                reservationsType: reservationsType,
                appointmentDateR: appointmentDateR,
                appointmentTime: appointmentTime,
                totalDuration: totalDuration,
            },
            success: function (response) {
                // SweetAlert for success message
                Swal.fire({
                    text: "Appointment updated.",
                    icon: "success",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton:
                            "btn btn-primary waves-effect waves-light",
                    },
                }).then(() => {
                    location.reload();
                });
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    text: "Failed to update appointment. Please try again.",
                    icon: "error",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton:
                            "btn btn-primary waves-effect waves-light",
                    },
                });
            },
        });
    });
});
