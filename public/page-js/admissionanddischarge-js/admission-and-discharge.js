$(document).ready(function () {
    $("#admission_and_discharge_main_menu").addClass(
        "active open menu-item-animating"
    );
    $("#admission_and_discharge_sub_menu").addClass("active");
    $('.status').selectpicker();
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

    $("#createdEmployeeId").select2({
        placeholder: "Select an Employee",
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

    $("#employeeId").select2({
        placeholder: "Select an Employee",
        ajax: {
            url: BASE_URL + "/appointment-report-get-select2-options", // URL of the endpoint
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    employeeId: params.term, // Query parameter
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

    $("#clientId").select2({
        placeholder: "Select a Client",
        allowClear: true,
        minimumInputLength: 0,
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
                    results: data.results.map(client => ({
                        id: client.id, // MRN (File ID)
                        text: client.text, // Full name
                        clientMobile: client.mobile,
                        clientIdNational: client.idNational
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

    $("#serviceId").select2({
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
                            children: $.map(category.children, function (service) {
                                return {
                                    id: service.id,
                                    text: service.text,
                                };
                            }),
                        };
                    }),
                };
            },
            cache: true,
        }
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

    $("#addNewCommonBtn").click(function () {
        $("#xrayServiceModal").modal("show");
        $("#xray_service_header").text("Add New X-Ray Service");
    });

    var appointmentReportTable = $("#appointment_report_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/admission-and-discharge",
            data: function (d) {
                d.clinicId = $("#clinicId").val();
                d.clientId = $("#clientId").val();
                d.employeeId = $("#employeeId").val();
                d.createdEmployeeId = $("#createdEmployeeId").val();
                d.status = $("#status").val();
                d.reservationsType = $("#reservationsType").val();
                d.serviceId = $("#serviceId").val();
                d.startDate = $(".start_date").val();
                d.endDate = $(".end_date").val();
                d.dischargeDate = $("#dischargeDate").val();
                console.log(d.dischargeDate);
                d.admissionDate = $("#admissionDate").val();
            },
        },
        columns: [
            { data: "patientAdmissionId", name: "patientAdmissionId" },
            { data: "clientId", name: "clientId" },
            { data: "admitted_doctor_name", name: "admitted_doctor_name" },
            {
                data: "consultation_doctor_name",
                name: "consultation_doctor_name",
            },
            { data: "client_name", name: "client_name" },
            { data: "mobile", name: "mobile" },
            { data: "IDNational", name: "IDNational" },
            { data: "lengthOfStay", name: "lengthOfStay" },
            { data: "status", name: "status" },
            { data: "dischargeDate", name: "dischargeDate" },
            { data: "admission_dateTime", name: "admission_dateTime" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var inPatientUrl =
                        BASE_URL + "/admission-and-discharge/inpatient/" + full.patientAdmissionId;
                    var outPatientUrl =
                        BASE_URL + "/admission-and-discharge/discharge/" + full.patientAdmissionId;

                    return (
                        '<div class="row">' +
                        // '<a href="' +
                        // deleteUrl +
                        // '" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill" ><i class="ti ti-eye ti-md"></i></a>'+
                        '<div class="col-6 p-1">' +
                        '<a href="' +
                        inPatientUrl +
                        '" class="btn btn-outline-primary waves-effect " style="width:100%;" ><i class="ti ti-report-medical"></i>IP</a>' +
                        "</div>" +
                        '<div class="col-6 p-1">' +
                        '<a href="' +
                        outPatientUrl +
                        '" class="btn btn-outline-danger  waves-effect " style="width:100%;" ><i class="ti ti-report-medical"></i>DS</a>' +
                        "</div>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    $(
        "#clinicId, #employeeId, #createdEmployeeId, #status, #reservationsType, #serviceId, #dischargeDate, #admissionDate, #clientId"
    ).on("change", function () {
        appointmentReportTable.ajax.reload();
    });



    $(".createXrayServiceBtn").click(function () {
        var formData = $("#xray_service_form").serialize();
        var xrayServiceId = $("#xray_service_id").val();
        var ajaxUrl = xrayServiceId
            ? BASE_URL + "/update-xray-service/" + xrayServiceId
            : BASE_URL + "/xray-service";
        var method = xrayServiceId ? "PUT" : "POST";

        $.ajax({
            url: ajaxUrl,
            type: method,
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
                $("#largeModal").modal("hide"); // Hide modal on success
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

    appointmentReportTable.on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#xrayServiceModal").modal("show");
                    $("#xray-service_form_footer").show();
                    $("#xray_service_header").text("Update Xray Service");

                    // $('#service_form').find('input, textarea, select, button').prop('disabled', true);
                    $("#xray_service_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", false);
                    $("#xray_service_id").val(response.data.serviceId);
                    $(".xray-service-code").val(response.data.serviceCode);
                    // alert(response.data.categoryId);
                    $(".xray-service-name-en").val(
                        response.data.serviceName_en
                    );
                    $(".xray-service-name-ar").val(
                        response.data.serviceName_ar
                    );
                    $(".xray-category-id").val(response.data.categoryId);
                    $(".xray-tax-id").val(response.data.taxId);
                    $(".xray-cost").val(response.data.cost);

                    // $("#createServiceBtn").hide();
                }
            },
            error: function (err) {
                console.error("Error fetching edit data:", err);
            },
        });
    });

    appointmentReportTable.on("click", ".item-delete", function () {
        var deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this service?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes!",
            customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton:
                    "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: deleteUrl,
                    method: "DELETE",
                    success: function (response) {
                        if (response.status === true) {
                            appointmentReportTable.ajax.reload(null, false);

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
                    error: function (err) {
                        console.error("Error fetching edit data:", err);
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Please verify the service common group.",
                    icon: "error",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });

    appointmentReportTable.on("click", ".item-details", function () {
        var editUrl = $(this).data("id");

        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#xrayServiceModal").modal("show");
                    $("#xray-service_form_footer").hide();
                    $("#xray_service_header").text("Details Of Xray Service");

                    console.log(response.data.serviceName_en);
                    // $('#service_form').find('input, textarea, select, button').prop('disabled', true);
                    $("#xray_service_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", true);
                    $("#xray_service_id").val(response.data.serviceId);
                    $(".xray-service-code").val(response.data.serviceCode);

                    $(".xray-service-name-en").val(
                        response.data.serviceName_en
                    );
                    $(".xray-service-name-ar").val(
                        response.data.serviceName_ar
                    );
                    $(".xray-category-id").val(response.data.categoryId);
                    $(".xray-tax-id").val(response.data.taxId);
                    $(".xray-cost").val(response.data.cost);

                    // $("#createServiceBtn").hide();
                }
            },
            error: function (err) {
                console.error("Error fetching edit data:", err);
            },
        });
    });

    $("#select_all").on("click", function () {
        var rows = appointmentReportTable.rows({ search: "applied" }).nodes();
        $('input[type="checkbox"]', rows).prop("checked", this.checked);
        updateSelectedCount();
    });

    $("#xray_table tbody").on("change", 'input[type="checkbox"]', function () {
        if (!this.checked) {
            var el = $("#select_all").get(0);
            if (el && el.checked && "indeterminate" in el) {
                el.indeterminate = true;
            }
        }
        updateSelectedCount();
    });

    $("#delete_selected").on("click", function () {
        var selectedIds = $('input[name="select_service"]:checked')
            .map(function () {
                return $(this).val();
            })
            .get();
        console.log(selectedIds);
        if (selectedIds.length > 0) {
            Swal.fire({
                title: "Are you sure?",
                text: "You want to delete this service?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes!",
                customClass: {
                    confirmButton:
                        "btn btn-primary me-3 waves-effect waves-light",
                    cancelButton:
                        "btn btn-label-secondary waves-effect waves-light",
                },
                buttonsStyling: false,
            }).then(function (result) {
                if (result.value) {
                    $.ajax({
                        url: BASE_URL + "/delete-selected-xray-services",
                        method: "DELETE",
                        data: {
                            ids: selectedIds,
                        },
                        success: function (response) {
                            if (response.status === true) {
                                appointmentReportTable.ajax.reload(null, false);

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
                        error: function (err) {
                            console.error("Error fetching edit data:", err);
                        },
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        title: "Cancelled",
                        text: "Please verify the service common group.",
                        icon: "error",
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    });
                }
            });
        } else {
            alert("No services selected");
        }
    });
});

function updateSelectedCount() {
    var selectedCount = $('input[name="select_service"]:checked').length;
    $("#selected_count").text(selectedCount);
    if (selectedCount > 0) {
        $("#bulk_select").show();
        $("#selected_count").text(selectedCount);
    } else {
        $("#bulk_select").hide();
    }
}
