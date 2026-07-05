$(document).ready(function () {
    $("#vital_room_main_menu").addClass("active open menu-item-animating");
    $("#vital_room_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var rangePickr = $(".flatpickr-range"),
        dateFormat = "MM/DD/YYYY";

    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");

    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "m/d/Y",
            orientation: isRtl ? "auto right" : "auto left",
            locale: {
                format: dateFormat,
            },
            onClose: function (selectedDates, dateStr, instance) {
                var startDate = "",
                    endDate = new Date();
                if (selectedDates[0] != undefined) {
                    startDate = moment(selectedDates[0]).format("MM/DD/YYYY");
                    startDateEle.val(startDate);
                }
                if (selectedDates[1] != undefined) {
                    endDate = moment(selectedDates[1]).format("MM/DD/YYYY");
                    endDateEle.val(endDate);
                }
                $(rangePickr).trigger("change").trigger("keyup");
                appointmentReportTable.ajax.reload();
            },
        });
    }

    $("#createdEmployeeId").select2("destroy");
    $("#createdEmployeeId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            placeholder: "Search Employee",
            dropdownParent: $("#createdEmployeeId").parent(),
            width: "100%",
            allowClear: true,
            ajax: {
                url: BASE_URL + "/appointment-report-get-select2-options", // URL of the endpoint
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        createdEmployeeId: params.term, // Query parameter
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

    $("#employeeId").select2("destroy");
    $("#employeeId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            placeholder: "Search Employee",
            dropdownParent: $("#employeeId").parent(),
            width: "100%",
            allowClear: true,
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
                                id: key,
                                text: value,
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
            placeholder: "Search Client",
            dropdownParent: $("#clientId").parent(),
            width: "100%",
            allowClear: true,
            minimumInputLength: 0,
            ajax: {
                url: BASE_URL + "/vital_room_searching_name",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                         patientName: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.results.map((client) => ({
                            id: client.id,
                            text: client.text,
                            clientMobile: client.mobile,
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
        console.log(repo);
        return $(`
            <div>
                <strong>${repo.text}</strong><br>
                <small>Mobile: ${repo.clientMobile} | ID: ${repo.id}</small>
            </div>
        `);
    }

    function formatSearchSelection(repo) {
        return repo.text || repo.id;
    }

    $("#serviceId").select2("destroy");
    $("#serviceId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            placeholder: "Search Service",
            dropdownParent: $("#serviceId").parent(),
            width: "100%",
            allowClear: true,
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

    $("#serviceCategoryId").select2("destroy");
    $("#serviceCategoryId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            placeholder: "Search Service Category",
            dropdownParent: $("#serviceCategoryId").parent(),
            width: "100%",
            allowClear: true,
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

    var appointmentReportTable = $("#vital_room_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/vital_room_table",
            data: function (d) {
                d.clinicId = $("#clinicId").val() || "";
                d.clientId = $("#clientId").val() || "";
                d.employeeId = $("#employeeId").val() || "";
                d.createdEmployeeId = $("#createdEmployeeId").val() || "";
                d.status = $("#status").val() || "";
                d.reservationsType = $("#reservationsType").val() || "";
                d.serviceCategoryId = $("#serviceCategoryId").val() || "";
                d.serviceId = $("#serviceId").val() || "";
                d.startDate = startDateEle.val();
                d.endDate = endDateEle.val();
            },
        },
        columns: [
            { data: "reservationId" },
            {
                data: "mrId",
                name: "mrId",
                orderable: false,
                render: function (mrId, type, row) {
                    return `<a href="${BASE_URL}/vital-room-details/${row.reservationId}"
                class="btn btn-outline-primary w-100">
                <i class="ti ti-report-medical"></i> ${mrId}
            </a>`;
                },
            },
            { data: "patientName" },
            { data: "mobile" },
            { data: "totalCost" },
            {
                data: "status",
                render: function (status) {
                    let badge = "bg-label-secondary";
                    if (status === "pending") badge = "bg-label-primary";
                    if (status === "approved") badge = "bg-label-success";
                    if (status === "completed") badge = "bg-label-info";
                    if (status === "cancelled") badge = "bg-label-danger";

                    return `<span class="badge ${badge}">${status}</span>`;
                },
            },
            { data: "appointmentDate" },
            { data: "providerName" },
            { data: "serviceName" },
            { data: "createdEmployee" },
        ],
    });

    $(
        "#clinicId, #clientId, #employeeId, #createdEmployeeId, #status, #reservationsType, #serviceId ,#serviceCategoryId",
    ).on("change", function () {
           console.log("Client ID:", $("#clientId").val());
        appointmentReportTable.ajax.reload();
    });
});
