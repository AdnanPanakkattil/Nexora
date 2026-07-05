$(document).ready(function () {

    $("#clinic_setup_main_menu").addClass("active open menu-item-animating");
    $("#extended_schedule_sub_menu").addClass("active");

    // $("#branch").select2({
    //     placeholder: "Select Branch",
    //     allowClear: true,
    // });
    $("#branch").select2("destroy");
    $("#branch")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#branch").parent(),
            placeholder: "Select Branch",
            allowClear: true,
            width: "100%",
        });


    // $("#doctor").select2({
    //     placeholder: "Select Provider",
    //     allowClear: true,
    // });
    $("#doctor").select2("destroy");
    $("#doctor")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#doctor").parent(),
            placeholder: "Select Provider",
            allowClear: true,
            width: "100%",
        });

    // $("#clinic").select2({
    //     placeholder: "Select Clinic",
    //     allowClear: true,
    // });
    $("#clinic").select2("destroy");
    $("#clinic")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#clinic").parent(),
            placeholder: "Select Clinic",
            allowClear: true,
            width: "100%",
        });

    $("#branch, #departmentId").on("change", function () {
        const branchId = $("#branch").val();
        const departmentId = $("#departmentId").val();

        if (branchId && departmentId) {
            $.ajax({
                url: "/getproviders",
                method: "GET",
                data: {
                    branch_id: branchId,
                    department_id: departmentId,
                },
                success: function (response) {
                    const doctorSelect = $("#doctor");
                    doctorSelect.empty();
                    doctorSelect.append(
                        '<option value="">Select Provider</option>'
                    );

                    Object.keys(response).forEach((role) => {
                        const optgroup = $("<optgroup>").attr("label", role);

                        response[role].forEach((provider) => {
                            optgroup.append(
                                `<option value="${provider.employeeId}">${provider.full_name}</option>`
                            );
                        });

                        doctorSelect.append(optgroup);
                    });

                    if ($.fn.select2) {
                        doctorSelect.select2("destroy").select2();
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching Providers:", error);
                },
            });
        } else {
            $("#doctor")
                .empty()
                .append('<option value="">Select Provider</option>');
        }
    });

    $("#doctor").on("change", function () {
        const doctorId = $(this).val();
        const branchId = $("#branch").val();

        if (doctorId && branchId) {
            $.ajax({
                url: "/getclinics",
                method: "GET",
                data: { doctor_id: doctorId, branch_id: branchId },
                success: function (response) {

                    const clinicSelect = $("#clinic");
                    clinicSelect.empty();
                    clinicSelect.append(
                        '<option value="">Select Clinic</option>'
                    );

                    response.forEach((clinic) => {
                        clinicSelect.append(
                            `<option value="${clinic.providerClinicId}">${clinic.clinicName_en}</option>`
                        );
                    });

                    if ($.fn.select2) {
                        clinicSelect.select2("destroy").select2();
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching clinics:", error);
                },
            });
        } else {
            $("#clinic")
                .empty()
                .append('<option value="">Select Clinic</option>');
        }
    });

    var rangePickr = $(".flatpickr-range");

    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "m/d/Y",
            onClose: function (selectedDates) {
                var startDate = selectedDates[0]
                    ? moment(selectedDates[0]).format("YYYY-MM-DD")
                    : null;
                var endDate = selectedDates[1]
                    ? moment(selectedDates[1]).format("YYYY-MM-DD")
                    : null;
                $(".start_date").val(startDate);
                $(".end_date").val(endDate);
            },
        });
    }

    flatpickrTimeFrom = document.querySelector("#flatpickr-time-from");
    flatpickrTimeTo = document.querySelector("#flatpickr-time-to");

    if (flatpickrTimeFrom) {
        flatpickrTimeFrom.flatpickr({
            enableTime: true,
            noCalendar: true,
            dateFormat: "h:i K",
            time_24hr: false,
        });
    }
    if (flatpickrTimeTo) {
        flatpickrTimeTo.flatpickr({
            enableTime: true,
            noCalendar: true,
            dateFormat: "h:i K",
            time_24hr: false,
        });
    }

    $("#saveBtn").on("click", function () {
        if (!validateForm()) {
            return;
        }

        const selectedDays = [];
        $(".days:checked").each(function () {
            selectedDays.push($(this).attr("name"));
        });

        const doctorStatus = $("#available").prop("checked")
            ? "available"
            : "notAvailable";

        const formData = {
            description: $("#description").val(),
            start_date: $("#startDate").val(),
            end_date: $("#endDate").val(),
            time_from: $("#flatpickr-time-from").val(),
            time_to: $("#flatpickr-time-to").val(),
            branch_id: $("#branch").val(),
            doctorId: $("#doctor").val(),
            clinic_id: $("#clinic").val(),
            days: selectedDays,
            doctorStatus: doctorStatus,
        };

        $.ajax({
            url: "/extendedschedule/store",
            method: "POST",
            data: formData,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                if (response.status) {
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success",
                        customClass: {
                            confirmButton: "btn btn-success",
                        },
                        buttonsStyling: false,
                    }).then(function () {
                        refreshScheduleTable();
                    });
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: response.message,
                        icon: "error",
                        customClass: {
                            confirmButton: "btn btn-danger",
                        },
                        buttonsStyling: false,
                    });
                }
            },
            error: function (xhr) {
                let errorMessage = "An error occurred while saving the schedule.";
                if (xhr.status === 422 && xhr.responseJSON) {
                    const errors = xhr.responseJSON.data;
                    errorMessage = Object.values(errors).flat().join("<br>");
                } else if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                Swal.fire({
                    title: "Error!",
                    html: errorMessage,
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                    buttonsStyling: false,
                });
            },
        });
    });
     
    function refreshScheduleTable() {
        const branchId = $("#branch").val();
        const employeeId = $("#doctor").val();
        const providerClinicId = $("#clinic").val();
        
        if (branchId && employeeId && providerClinicId) {
            $("#defaultschedule").DataTable().ajax.reload();
        }
    }

    function validateForm() {
        let isValid = true;
        const requiredFields = [
            { id: "description", name: "Description" },
            { id: "startDate", name: "Start Date" },
            { id: "endDate", name: "End Date" },
            { id: "flatpickr-time-from", name: "Time From" },
            { id: "flatpickr-time-to", name: "Time To" },
            { id: "branch", name: "Branch" },
            { id: "doctor", name: "Provider" },
            // { id: "clinic", name: "Clinic" },
        ];

        const doctorStatus = $("#available").prop("checked")
            ? "available"
            : "notAvailable";

        if (doctorStatus === "available" && $(".days:checked").length === 0) {
            Swal.fire({
                title: "Validation Error",
                text: "Please select at least one day.",
                icon: "error",
                customClass: {
                    confirmButton: "btn btn-danger",
                },
                buttonsStyling: false,
            });
            return false;
        }

        let missingFields = [];
        requiredFields.forEach((field) => {
            if (!$("#" + field.id).val()) {
                missingFields.push(field.name);
                isValid = false;
            }
        });

        if (!isValid) {
            Swal.fire({
                title: "Validation Error",
                html:
                    "Please fill in the following fields:<br>" +
                    missingFields.join("<br>"),
                icon: "error",
                customClass: {
                    confirmButton: "btn btn-danger",
                },
                buttonsStyling: false,
            });
        }

        return isValid;
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("notAvailable").checked = true;

        if ($(".flatpickr-range").length) {
            $(".flatpickr-range").on("change", function () {
                const dateRange = $(this).val().split(" to ");
                if (dateRange.length > 0) {
                    const startDate = dateRange[0]
                        ? moment(dateRange[0], "MM/DD/YYYY").format(
                              "YYYY-MM-DD"
                          )
                        : null;
                    const endDate = dateRange[1]
                        ? moment(dateRange[1], "MM/DD/YYYY").format(
                              "YYYY-MM-DD"
                          )
                        : startDate;
                    $("#startDate").val(startDate);
                    $("#endDate").val(endDate);
                }
            });
        }
    });

    $("#branch, #doctor, #clinic").on("change", function () {
        const branchId = $("#branch").val();
        const employeeId = $("#doctor").val();
        const providerClinicId = $("#clinic").val();

        if (branchId && employeeId && providerClinicId) {
            loadDefaultSchedule(branchId, employeeId, providerClinicId);
        }
    });

    function loadDefaultSchedule(branchId, employeeId, providerClinicId) {
        if ($.fn.DataTable.isDataTable("#defaultschedule")) {
            $("#defaultschedule").DataTable().clear().destroy();
        }

        $("#defaultschedule").DataTable({
            ajax: {
                url: "/getdefaultsechdule",
                type: "GET",
                data: {
                    branchId: branchId,
                    employeeId: employeeId,
                    providerClinicId: providerClinicId,
                },
                dataSrc: function (response) {
                    let tableData = [];
                    if (response.length > 0) {
                        response.forEach((schedule) => {
                            const workingTimesArray = schedule.workingtimes
                                .split("|")
                                .map((item) => item.split("->"));

                            workingTimesArray.forEach((time) => {
                                const weekDayNum = parseInt(time[0]);
                                const timeRange = time[1];

                                const weekDays = [
                                    "Sunday",
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                ];
                                const weekDay = weekDays[weekDayNum] || "N/A";

                                tableData.push({
                                    clinicName:
                                        schedule.provider_clinic.clinicName_en,
                                    timeFrom: timeRange.split("-")[0],
                                    timeTo: timeRange.split("-")[1],
                                    weekDay: weekDay,
                                    fromDate: schedule.fromDate,
                                    toDate: schedule.toDate,
                                    employeesTimeId: schedule.EmployeesTimeId,
                                });
                            });
                        });
                    }
                    return tableData;
                },
            },
            columns: [
                { data: "clinicName" },
                { data: "timeFrom" },
                { data: "timeTo" },
                { data: "weekDay" },
                { data: "fromDate" },
                { data: "toDate" },
                {
                    data: null,
                    render: function (data) {
                        return `<a href="#" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill delete-schedule" data-id="${data.employeesTimeId}">
                                    <i class="ti ti-trash ti-md"></i>
                                </a>`;
                    },
                },
            ],
            language: {
                emptyTable: "No schedule available",
            },
        });
    }
});
