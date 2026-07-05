$(document).ready(function () {
    $("#appointment_main_menu").addClass("active open menu-item-animating");
    $("#client_remainder_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $.ajax({
        url: "/statuses",
        type: "GET",
        success: function (response) {
            var statusSelect = $("#remainingStatusId");
            statusSelect.empty(); // Clear existing options

            response.forEach(function (status) {
                statusSelect.append(
                    `<option value="${status.statusId}">${status.name_en}</option>`,
                );
            });

            // Re-initialize the selectpicker after dynamically adding options
            statusSelect.selectpicker("refresh");
        },
        error: function (error) {
            console.error("Error fetching statuses:", error);
        },
    });

    var rangePickr = $(".flatpickr-range"),
        dateFormat = "DD/MM/YYYY";

    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");

    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "d/m/Y",
            orientation: isRtl ? "auto right" : "auto left",
            locale: {
                format: dateFormat,
            },
            onClose: function (selectedDates, dateStr, instance) {
                var startDate = "",
                    endDate = new Date();
                if (selectedDates[0] != undefined) {
                    startDate = moment(selectedDates[0]).format("DD/MM/YYYY");
                    startDateEle.val(startDate);
                }
                if (selectedDates[1] != undefined) {
                    endDate = moment(selectedDates[1]).format("DD/MM/YYYY");
                    endDateEle.val(endDate);
                }
                $(rangePickr).trigger("change").trigger("keyup");
                clientRemainderTable.ajax.reload();
            },
        });
    }
    $("#createdEmployeeId").select2("destroy");
    $("#createdEmployeeId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#createdEmployeeId").parent(),
            width: "100%",
            placeholder: "Select an Employee",
            allowClear: true,
        minimumInputLength: 1,
        language: {
            inputTooShort: function () {
                return "Please enter 1 or more characters";
            },
        },
            ajax: {
                url: BASE_URL + "/appointment-report-get-select2-options",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        createdEmployeeId: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data.data, function (value, key) {
                            return {
                                id: key,
                                text: value,
                            };
                        }),
                    };
                },
                cache: true,
            },
        });

    $("#employeeId").select2("destroy");
    $("#employeeId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#employeeId").parent(),
            width: "100%",
            placeholder: "Select an Employee",
            allowClear: true,
        minimumInputLength: 1,
        language: {
            inputTooShort: function () {
                return "Please enter 1 or more characters";
            },
        },
            ajax: {
                url: BASE_URL + "/appointment-report-get-select2-options",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        employeeId: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data.data, function (value, key) {
                            return {
                                id: key, // Employee ID
                                text: value, // Employee Name
                            };
                        }),
                    };
                },
                cache: true,
            },
        });

    $("#clientId").select2("destroy");
    $("#clientId")
    .wrap('<div class="position-relative"></div>')
    .select2({
        dropdownParent: $("#clientId").parent(),
        width: "100%",
        placeholder: "Select a Client",
        allowClear: true,
        minimumInputLength: 1,
        language: {
            inputTooShort: function () {
                return "Please enter 1 or more characters";
            },
        },
        ajax: {
                url: BASE_URL + "/appointment-report-get-patient-options",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        clientId: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.results.map((client) => ({
                            id: client.id, // MRN (File ID)
                            text: client.text, // Full name
                            clientMobile: client.mobile,
                            clientIdNational: client.idNational,
                        })),
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
        return $(`
            <div>
                <strong>${repo.text}</strong><br>
                <small>Mobile: ${repo.clientMobile} | ID: ${repo.clientIdNational} | MRN: ${repo.id}</small>
            </div>
        `);
    }

    function formatSearchSelection(repo) {
        return repo.text || repo.id;
    }

    // $("#serviceId").select2({
    //     placeholder: "Select an Employee",
    //     ajax: {
    //         url: BASE_URL + "/appointment-report-get-select2-options", // URL of the endpoint
    //         dataType: "json",
    //         delay: 250,
    //         data: function (params) {
    //             return {
    //                 serviceId: params.term, // Query parameter
    //             };
    //         },
    //         processResults: function (data) {
    //             return {
    //                 results: $.map(data.data, function (value, key) {
    //                     return {
    //                         id: key, // Employee ID
    //                         text: value, // Employee Name
    //                     };
    //                 }),
    //             };
    //         },
    //         cache: true,
    //     },
    // });

    $("#serviceId").select2("destroy");
    $("#serviceId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#serviceId").parent(),
            width: "100%",
            placeholder: "Select a Service",
            ajax: {
                url: BASE_URL + "/appointment-report-get-services",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        search: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data.data, function (category) {
                            return {
                                text: category.text,
                                children: $.map(
                                    category.children,
                                    function (service) {
                                        return {
                                            id: service.id,
                                            text: service.text,
                                        };
                                    },
                                ),
                            };
                        }),
                    };
                },
                cache: true,
            },
        });

    $("#serviceCategoryId").select2({
        placeholder: "Select an Employee",
        ajax: {
            url: BASE_URL + "/appointment-report-get-select2-options", // URL of the endpoint
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    serviceCategoryId: params.term, // Query parameter
                };
            },
            processResults: function (data) {
                return {
                    results: $.map(data.data, function (value, key) {
                        return {
                            id: key, // Employee ID
                            text: value, // Employee Name
                        };
                    }),
                };
            },
            cache: true,
        },
    });

    var clientRemainderTable = $("#client_remainder_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/client-remainder",
            data: function (d) {
                d.clinicId = $("#clinicId").val();
                d.employeeId = $("#employeeId").val();
                d.createdEmployeeId = $("#createdEmployeeId").val();
                d.remainingStatusId = $("#remainingStatusId1").val();
                d.clientId = $("#clientId").val();
                d.serviceId = $("#serviceId").val();
                d.startDate = $(".start_date").val();
                d.endDate = $(".end_date").val();
                d.absentCount = $("#countInput").val();
            },
        },

        columns: [
            { data: "reservationId", name: "reservationId" },
            { data: "mrId", name: "mrId" },

            { data: "patientName", name: "patientName" },
            { data: "idNational", name: "idNational" },
            { data: "mobile", name: "mobile" },
            { data: "totalCost", name: "totalCost" },

            // {
            //     data: "statusName",
            //     name: "statusName",
            //     render: function (data, type, full, meta) {
            //         let statusText = full.statusName || "No Status";
            //         let btnClass = "btn-outline-primary";

            //         return (
            //             '<button class="btn ' +
            //             btnClass +
            //             ' btn-rounded btn-shadow waves-effect open-status-modal" ' +
            //             'data-reservation-id="' +
            //             full.reservationId +
            //             '" ' +
            //             'data-note="' +
            //             full.note +
            //             '" ' +
            //             'data-status-id="' +
            //             full.remainingStatusId +
            //             '" ' + // Changed from statusId to remainingStatusId
            //             'data-mr-id="' +
            //             full.mrId +
            //             '">' +
            //             statusText +
            //             "</button>"
            //         );
            //     },
            // },
            {
                data: "statusName",
                name: "statusName",
                searchable: false,
                render: function (data, type, full, meta) {
                    let statusText = full.statusName || "No Status";
                    return `<button class="btn btn-outline-primary btn-rounded open-status-modal"
                data-reservation-id="${full.reservationId}">
                ${statusText}
            </button>`;
                },
            },

            {
                data: "statustracker",
                name: "statustracker",
                render: function (data, type, full, meta) {
                    let statusText = "Status";
                    let btnClass = "btn-outline-success";

                    return (
                        '<button class="btn ' +
                        btnClass +
                        ' btn-rounded btn-shadow waves-effect open-status-tracker-modal" ' +
                        'data-reservation-id="' +
                        full.reservationId +
                        '" ' +
                        'data-note="' +
                        full.note +
                        '" ' +
                        'data-status-id="' +
                        full.remainingStatusId +
                        '" ' + // Changed from statusId to remainingStatusId
                        'data-mr-id="' +
                        full.mrId +
                        '">' +
                        statusText +
                        "</button>"
                    );
                },
            },
            { data: "absentCount", name: "absentCount" },

            { data: "appointmentDate", name: "appointmentDate" },
            { data: "providerName", name: "providerName" },
            { data: "employeeName", name: "employeeName" },
            { data: "serviceName", name: "serviceName" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var detailsUrl =
                        BASE_URL +
                        "/detail-of-appointment/" +
                        full.reservationId;
                    return (
                        '<div class="row">' +
                        '<a href="' +
                        detailsUrl +
                        '" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill" ><i class="ti ti-eye ti-md"></i></a>' +
                        "</div>"
                    );
                },
            },
        ],
    });
    $("#countInput").on("input", function () {
        clientRemainderTable.ajax.reload();
    });

    $(
        "#clinicId, #employeeId, #createdEmployeeId,  #clientId, #serviceId,#countInput ,#remainingStatusId1",
    ).on("change", function () {
        clientRemainderTable.ajax.reload();
    });

    $(document).on("click", ".open-status-modal", function () {
        var reservationId = $(this).data("reservation-id");
        var mrId = $(this).data("mr-id");
        var statusId = $(this).data("status-id");

        $("#reservationId").val(reservationId);
        $("#mrId").val(mrId);

        $.ajax({
            url: "/statuses",
            type: "GET",
            success: function (response) {
                var statusSelect = $("#remainingStatusId");
                statusSelect.empty();

                response.forEach(function (status) {
                    var option = new Option(
                        status.name_en,
                        status.statusId,
                        false,
                        status.statusId == statusId,
                    );
                    statusSelect.append(option);
                });

                if (statusId) {
                    statusSelect.val(statusId);
                }
                statusSelect.trigger("change");
            },
            error: function (err) {
                $("#addStatusModal").modal("hide");

                console.error("Error fetching edit data:", err.message);
                // Extract error message from the response
                var errorMessage =
                    err.responseJSON && err.responseJSON.message
                        ? err.responseJSON.message
                        : "An unexpected error occurred. Please try again.";
                // Display the error message in SweetAlert
                Swal.fire({
                    icon: "error",
                    title: "Access denied",
                    text: errorMessage,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });

        var note = $(this).data("note");
        $("#note").val(note);

        $("#addStatusModal").modal("show");
    });

    function timeAgo(date) {
        var now = new Date();
        var seconds = Math.floor((now - date) / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);

        if (seconds < 60) {
            return seconds + " seconds ago";
        } else if (minutes < 60) {
            return minutes + " minutes ago";
        } else if (hours < 24) {
            return hours + " hours ago";
        } else if (days < 30) {
            return days + " days ago";
        } else {
            return date.toLocaleDateString(); // Default to full date if more than 30 days ago
        }
    }

    $(document).on("click", ".open-status-tracker-modal", function () {
        var reservationId = $(this).data("reservation-id");

        $.ajax({
            url: "/status-tracker/" + reservationId, // Make sure the URL is correct
            type: "GET",
            success: function (response) {
                var timeline = $("#status-tracker-Modal .timeline");
                timeline.empty(); // Clear existing entries

                if (response.length > 0) {
                    response.forEach(function (item) {
                        var listItem = `
                            <li class="timeline-item d-flex flex-column mb-4 position-relative">
                                <div class="timeline-point position-absolute top-0 start-0 translate-middle bg-primary rounded-circle" style="width: 15px; height: 15px; border: 3px solid white;"></div>
                                <div class="timeline-content ms-5 d-flex justify-content-between">
                                <div>
                                    <h6 class=" mb-2">Status updated</h6>
                                    <h6 class=" text-primary bg-primary mb-2"></h6>
                                    <span class="badge bg-primary">${
                                        item.newValue
                                    }</span>
                                    </div>
                                    <small class="text-muted">${timeAgo(
                                        new Date(
                                            item.created_at.replace(" ", "T") +
                                                "Z",
                                        ),
                                    )}</small>
                                </div>
                            </li>
                        `;
                        timeline.append(listItem);
                    });
                } else {
                    timeline.append(
                        '<li class="timeline-item"><div class="p-3"><h6 class="text-muted">No records found</h6></div></li>',
                    );
                }
            },
            error: function (err) {
                $("#status-tracker-Modal").modal("hide"); // Show the modal

                console.error("Error fetching edit data:", err.message);
                // Extract error message from the response
                var errorMessage =
                    err.responseJSON && err.responseJSON.message
                        ? err.responseJSON.message
                        : "An unexpected error occurred. Please try again.";
                // Display the error message in SweetAlert
                Swal.fire({
                    icon: "error",
                    title: "Access denied",
                    text: errorMessage,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });

        $("#status-tracker-Modal").modal("show"); // Show the modal
    });

    $("#statusSaveBtn").on("click", function () {
        var reservationId = $("#reservationId").val();
        var mrId = $("#mrId").val();
        var statusId = $("#remainingStatusId").val();
        var note = $("#note").val();

        $.ajax({
            url: BASE_URL + "/update-client-remainder",
            method: "POST",
            data: {
                reservationId: reservationId,
                mrId: mrId,
                statusId: statusId,
                note: note,
            },
            success: function (response) {
                if (response.success) {
                    $("#addStatusModal").modal("hide");
                    clientRemainderTable.ajax.reload();

                    Swal.fire({
                        icon: "success",
                        text: "Status updated successfully!",
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    });
                } else {
                    toastr.error("Error updating status: " + response.message);
                }
            },
            error: function (xhr, status, err) {
                $("#addStatusModal").modal("hide");

                console.error("Error fetching edit data:", err.message);
                // Extract error message from the response
                var errorMessage =
                    err.responseJSON && err.responseJSON.message
                        ? err.responseJSON.message
                        : "An unexpected error occurred. Please try again.";
                // Display the error message in SweetAlert
                Swal.fire({
                    icon: "error",
                    title: "Access denied",
                    text: errorMessage,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });

    // document.getElementById('statusCloseBtn').addEventListener('click', function() {
    //     $('#addStatusModal').modal('hide');
    //   });
});
