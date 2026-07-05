$(document).ready(function () {
    $("#appointment_main_menu").addClass("active open menu-item-animating");
    $("#cash_appointment_sub_menu").addClass("active");

    $("#modalDateTimeType").on("change", function () {
        let val = $(this).val();
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
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#financialCategory").val("cash").trigger("change");

    // $("#apointmentSchedulingModal").on("hidden.bs.modal", function () {
    //     $("#flexSwitchCheckDefault").prop("checked", false);
    // });

    // REPLACE the existing #flexSwitchCheckDefault click handler
    $("#flexSwitchCheckDefault").on("click", function () {
        $("#modalDateTimeType").selectpicker("val", "");
        $("#systemDateTimeFields").hide();
        $("#manualDateTimeFields").hide();
        $("#appointmentDateR").val("");
        $("#appointmentTime").val("");
        $("#totalDuration").val("");
        $("#manualAppointmentDate").val("");
        $("#manualAppointmentTime").val("");
        $("#manualAppointmentDuration").val("");
        $("#apointmentSchedulingModal").modal("show");
    });
    $("#flexSwitchCheckDefault").on("click", function () {
        $("#apointmentSchedulingModal").modal("show");
    });

    $("#financialCategory").on("change", function () {
        if ($(this).val() === "company" || $(this).val() === "insurance") {
            $("#contract_div").show(); // Show the contract div
        } else {
            $("#contract_div").hide(); // Hide the contract div
        }
    });

    flatpickr(".timepicker", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
        onReady: function () {
            updateMinTime(this);
        },
        onChange: function () {
            updateMinTime(this);
        },
    });

    function updateMinTime(fp) {
        var selectedDate = $("#appointmentDateR").val();
        var today = new Date().toISOString().split("T")[0];

        if (selectedDate === today) {
            var now = new Date();
            fp.set("minTime", now.getHours() + ":" + now.getMinutes());
        } else {
            fp.set("minTime", null);
        }
    }

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

    flatpickr(".dob-picker", {
        minDate: "today",
        dateFormat: "Y-m-d",
    });

    flatpickr("#appointmentDateR", {
        minDate: "today",
        dateFormat: "Y-m-d",
        onChange: function (selectedDates, dateStr) {
            var timePicker = document.querySelector(".timepicker")._flatpickr;
            var today = new Date().toISOString().split("T")[0];

            if (dateStr === today) {
                var now = new Date();
                timePicker.set(
                    "minTime",
                    now.getHours() + ":" + now.getMinutes(),
                );
                timePicker.clear();
            } else {
                timePicker.set("minTime", null);
            }
        },
    });

    // $("#flexSwitchCheckDefault").change(function () {
    //     // Check if the checkbox is checked
    //     if ($(this).is(":checked")) {
    //         // Show the visit_date_n_time div
    //         var currentTime = new Date();
    //         var hours = currentTime.getHours();
    //         var minutes = currentTime.getMinutes();
    //         var ampm = hours >= 12 ? "PM" : "AM";
    //         hours = hours % 12;
    //         hours = hours ? hours : 12; // the hour '0' should be '12'
    //         minutes = minutes < 10 ? "0" + minutes : minutes;
    //         var formattedTime = hours + ":" + minutes + " " + ampm;

    //         // Set the current time in the autoTime field
    //         $("#autoTime").val(formattedTime);
    //         $("#visit_date_div").show();
    //         $("#visit_auto_time_div").show();
    //         $("#visit_manual_time_div").show();
    //         $("#visit_duration_div").show();
    //         $("#apointmentSchedulingModal").modal("show");
    //     } else {
    //         // Hide the visit_date_n_time div
    //         $("#visit_date_div").hide();
    //         $("#visit_auto_time_div").hide();
    //         $("#visit_manual_time_div").hide();
    //         $("#visit_duration_div").hide();
    //         $("#autoTime").val("");
    //         $("#apointmentSchedulingModal").modal("hide");
    //     }
    // });

    $("#flexSwitchCheckDefault").click(function () {
        $("#doctor_unavailable_message").hide();
        $("#time_slot_div").hide();

        // Toggle visibility when the button is clicked
        if ($("#visit_date_div").is(":hidden")) {
            // Get the current time
            var currentTime = new Date();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            var ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours ? hours : 12; // Convert 0 to 12
            minutes = minutes < 10 ? "0" + minutes : minutes;
            var formattedTime = hours + ":" + minutes + " " + ampm;

            // Set the current time in the autoTime field
            $("#autoTime").val(formattedTime);

            // Show the required divs and modal
            $("#visit_date_div").show();
            $("#visit_auto_time_div").show();
            $("#visit_manual_time_div").show();
            $("#visit_duration_div").show();
            $("#apointmentSchedulingModal").modal("show");
        } else {
            // Hide the elements and clear the time
            $("#visit_date_div").hide();
            $("#visit_auto_time_div").hide();
            $("#visit_manual_time_div").hide();
            $("#visit_duration_div").hide();
            $("#autoTime").val("");
            $("#apointmentSchedulingModal").modal("hide");
        }
    });

    // $(".serviceName").select2({
    //     // placeholder: 'Select Service',
    //     // allowClear: true,
    //     ajax: {
    //         url: function () {
    //             return (
    //                 BASE_URL +
    //                 "/get-services-by-provider-with-individual/" +
    //                 $("#employeeId").val() + "/" + $("#financialCategory").val() + "/" + $('#contract').val()
    //             );
    //         },
    //         dataType: "json",
    //         delay: 250,
    //         data: function (params) {
    //             var employee = $("#employeeId").val();
    //             if (!employee) {
    //                 $("#serviceName")
    //                     .next(".select2-container")
    //                     .find(".select2-selection__rendered")
    //                     .html(
    //                         '<span class="text-danger">Please select a provider</span>'
    //                     );
    //                 return {
    //                     search: params.term,
    //                 };
    //             } else {
    //                 $("#serviceName")
    //                     .next(".select2-container")
    //                     .find(".select2-selection__rendered")
    //                     .html("");
    //                 return {
    //                     search: params.term,
    //                 };
    //             }
    //         },
    //         processResults: function (data) {
    //             return {
    //                 results: $.map(data.data, function (text, id) {
    //                     return {
    //                         id: id,
    //                         text: text,
    //                     };
    //                 }),
    //             };
    //         },
    //         cache: true,
    //     },
    // });

    $(".serviceName").each(function () {
        $(this).select2("destroy");
        $(this)
            .wrap('<div class="position-relative"></div>')
            .select2({
                dropdownParent: $(this).parent(),
                width: "100%",
                placeholder: "Select a Service",
                allowClear: true,
                minimumInputLength: 1,
                language: {
                    inputTooShort: function () {
                        return "Please enter 1 or more characters";
                    },
                },
                ajax: {
                    url: function () {
                        return (
                            BASE_URL +
                            "/get-services-by-provider-with-individual/" +
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
                            $(this)
                                .next(".select2-container")
                                .find(".select2-selection__rendered");
                            return { search: params.term };
                        } else {
                            $(this)
                                .next(".select2-container")
                                .find(".select2-selection__rendered")
                                .html("");
                            return { search: params.term };
                        }
                    },
                    processResults: function (data) {
                        return {
                            results: data.data,
                        };
                    },
                    cache: true,
                },
            });
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

    $("#IDNational").select2("destroy");
    $("#IDNational")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#IDNational").parent(),
            width: "100%",
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
            templateResult: formatSearch,
            templateSelection: formatSearchSelection,
        });

    $("#searchmobile").select2("destroy");
    $("#searchmobile")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#searchmobile").parent(),
            width: "100%",
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
            width: "100%",
            placeholder: "Search Provider",
            allowClear: true,
            minimumInputLength: 1,
            ajax: {
                url: BASE_URL + "/get-employee-by-branch",
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
                        return {
                            employeeName: params.term,
                            branch: branch,
                            department: department
                        };
                    } else {
                        $("#employeeId")
                            .next(".select2-container")
                            .find(".select2-selection__rendered")
                            .html("");
                        return {
                            employeeName: params.term,
                            branch: branch,
                            department: department
                        };
                    }
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

    $("#searchname").select2("destroy");
    $("#searchname")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#searchname").parent(),
            width: "100%",
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
                <small>Mobile: ${repo.clientMobile} | ID: ${repo.clientIdNational} | MRN: ${repo.id}</small>
            </div>`,
        );
    }

    function formatSearchSelection(repo) {
        return repo.text || repo.id;
    }

    // var timeSlots = [];

    // if (!timeSlots || timeSlots.length === 0) {
    //     $("#time_slot_div").hide();
    //     $("#doctor_unavailable_message")
    //         .text("Doctor is Not Available on the Selected Date")
    //         .show();
    // } else {
    //     $("#doctor_unavailable_message").hide();
    // }

    $("#doctor_unavailable_message").hide();
    $("#time_slot_div").hide();
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
        $("#loader-overlay").show();
        $.ajax({
            url: "/get-speciality-by-department/" + providerId,
            type: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
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
    e.preventDefault();
    var formData = new FormData($("#appointment_form")[0]);
    formData.append("appointmentDate", $("#appointmentDateR").val());
    formData.append("appointmentTime", $("#appointmentTime").val());
    formData.append("totalDuration", $("#totalDuration").val());

    $("#loader-overlay").show();
    $.ajax({
        url: $("#appointment_form").attr("action"),
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
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
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: "error",
                    text: response.message,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            }
            $("#apointmentSchedulingModal").modal("hide");
        },

        error: function (xhr) {
            $("#loader-overlay").hide();
            if (xhr.status === 422) {
                $("#apointmentSchedulingModal").modal("hide");
                var errors = xhr.responseJSON.errors;
                $(".error-text").text("");
                $.each(errors, function (key, value) {
                    $("." + key + "_error").text(value[0]);
                });
            } else {
                Swal.fire({
                    icon: "error",
                    text:
                        xhr.responseJSON?.message ||
                        "An unexpected error occurred.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
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
                        function (employeeId, firstName_en) {
                            serviceSelect.append(
                                '<option value="' +
                                    employeeId +
                                    '">' +
                                    firstName_en +
                                    "</option>",
                            );
                        },
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

    // Find the button with the equivalent start time in the waiting time table and hide it
    $(".waiting-time-table tbody td .waiting-time-btn").each(function () {
        const buttonStartTime = $(this).data("start");

        // Check if the start times match, considering possible format differences
        // if (buttonStartTime === startTime) {
        //     $(this).addClass("hidden-force");
        // } else{
        //     $(this).removeClass("hidden-force");
        // }
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

function getPatientById(selectedId) {
    $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/get-patient-by-id",
        type: "GET",
        data: {
            clientId: selectedId,
        },
        success: function (response) {
            $("#loader-overlay").hide();
            if (!response.status) return;
            const client = response.data.client;
            const expiryDate = response.data.policy_expiry_date;
            $("#clientName_en")
                .val(client.clientName_en)
                .prop("readonly", true);
            $("#secondName_en")
                .val(client.secondName_en)
                .prop("readonly", true);
            $("#thirdName_en").val(client.thirdName_en).prop("readonly", true);
            $("#fourthName_en")
                .val(client.fourthName_en)
                .prop("readonly", true);
            $("#clientName").val(client.clientName);
            $("#secondName_ar").val(client.secondName_ar);
            $("#thirdName_ar").val(client.thirdName_ar);
            $("#fourthName_ar").val(client.fourthName_ar);
            $("#clientId").val(client.clientId);
            console.log("Mobile", client.mobile);
            let mobile = client.mobile || "";
            if (mobile.startsWith("+966")) {
                mobile = mobile.replace("+966", "");
            }
            $("#mobile").val(mobile);
            $("#policyExpiryDate").val(expiryDate);
        },
        error: function (xhr, status, error) {
            $("#loader-overlay").hide();
            console.error(error);
        },
    });
}

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
