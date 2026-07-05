$(document).ready(function () {
    $("#admission_and_discharge_main_menu").addClass("active open menu-item-animating");
    $("#pre_admission_list_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var rangePickr = $(".flatpickr-range"),
        dateFormat = "MM/DD/YYYY";

        var startDateEle = $(".start_date"); // Hidden input for start date
        var endDateEle = $(".end_date");     // Hidden input for end date
        

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
                preAdmissionReportTable.ajax.reload();
            },
            
        });
    }

    

    // $('#createdEmployeeId').select2({
    $("#createdEmployeeId").select2("destroy");
        $("#createdEmployeeId")
        .wrap('<div class="position-relative"></div>')
        .select2({
        dropdownParent: $("#createdEmployeeId").parent(),
        width: "100%",
        placeholder: 'Select an Employee',
        ajax: {
            url: BASE_URL + '/appointment-report-get-select2-options', // URL of the endpoint
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    createdEmployeeId: params.term // Query parameter
                };
            },
            processResults: function(data) {
                return {
                    results: $.map(data.data, function(value, key) {
                        return {
                            id: key, // Employee ID
                            text: value // Employee Name
                        };
                    })
                };
            },
            cache: true
        }
    });


    // $('#employeeId').select2({
    $("#employeeId").select2("destroy");
        $("#employeeId")
        .wrap('<div class="position-relative"></div>')
        .select2({
        dropdownParent: $("#employeeId").parent(),
        width: "100%",
        placeholder: 'Select an Employee',
        ajax: {
            url: BASE_URL + '/appointment-report-get-select2-options', // URL of the endpoint
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    employeeId: params.term // Query parameter
                };
            },
            processResults: function(data) {
                return {
                    results: $.map(data.data, function(value, key) {
                        return {
                            id: key, // Employee ID
                            text: value // Employee Name
                        };
                    })
                };
            },
            cache: true
        }
    });

    // $("#clientId").select2({
    $("#clientId").select2("destroy");
        $("#clientId")
        .wrap('<div class="position-relative"></div>')
        .select2({
        dropdownParent: $("#clientId").parent(),
        width: "100%",
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

    // $('#serviceId').select2({
    //     placeholder: 'Select an Employee',
    //     ajax: {
    //         url: BASE_URL + '/appointment-report-get-select2-options', // URL of the endpoint
    //         dataType: 'json',
    //         delay: 250,
    //         data: function(params) {
    //             return {
    //                 serviceId: params.term // Query parameter
    //             };
    //         },
    //         processResults: function(data) {
    //             return {
    //                 results: $.map(data.data, function(value, key) {
    //                     return {
    //                         id: key, // Employee ID
    //                         text: value // Employee Name
    //                     };
    //                 })
    //             };
    //         },
    //         cache: true
    //     }
    // });

    // $("#serviceId").select2({
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

    
    // $('#serviceCategoryId').select2({
    $("#serviceCategoryId").select2("destroy");
        $("#serviceCategoryId")
        .wrap('<div class="position-relative"></div>')
        .select2({
        dropdownParent: $("#serviceCategoryId").parent(),
        width: "100%",
        placeholder: 'Select an Employee',
        ajax: {
            url: BASE_URL + '/appointment-report-get-select2-options', // URL of the endpoint
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    serviceCategoryId: params.term // Query parameter
                };
            },
            processResults: function(data) {
                return {
                    results: $.map(data.data, function(value, key) {
                        return {
                            id: key, // Employee ID
                            text: value // Employee Name
                        };
                    })
                };
            },
            cache: true
        }
    });

    

    $("#addNewCommonBtn").click(function () {
        $("#xrayServiceModal").modal("show");
        $("#xray_service_header").text("Add New X-Ray Service");
    });

    

    var preAdmissionReportTable = $("#preadmission_report_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/admission-and-discharge/preadmission-list", // URL for the server-side processing
            data: function(d) {
              d.clinicId = $('#clinicId').val();
              d.clientId = $('#clientId').val(); // Send the selected clinicId with the request
              d.employeeId = $('#employeeId').val();
            //   d.serviceCategoryId = $('#serviceCategoryId').val();
            d.createdEmployeeId = $('#createdEmployeeId').val();
            d.status = $('#status').val();
            d.reservationsType = $('#reservationsType').val();
            d.serviceId = $('#serviceId').val();
            d.startDate = $(".start_date").val(); // Hidden input for start date
            d.endDate = $(".end_date").val();     // Hidden input for end date
            d.toDay = $('#toDay').val();
            }
          },
       
        columns: [
            { data: "patientPreadmissionId", name: "patientPreadmissionId" },
            { data: "clientId", name: "clientId" },
            { data: "provider_doctor_name", name: "provider_doctor_name" },
            // { data: "admitted_doctor_name", name: "admitted_doctor_name" },
            // { data: "consultation_doctor_name", name: "consultation_doctor_name" },
            { data: "client_name", name: "client_name" },
            { data: "client.mobile", name: "client.mobile" },
            { data: "client.idNational", name: "client.idNational" },
            { data: "lengthOfStay", name: "lengthOfStay" },
            {
                data: null, // No data is linked to this column
                name: "empty", // A meaningful name (used for server-side processing, if needed)
                orderable: false, // Disable ordering for this column
                searchable: false, // Disable searching for this column
                render: function () {
                    return ""; // Render an empty cell
                }
            },
            
            { data: "status", name: "status" },
            { data: "clinicUnitId", name: "clinicUnitId",searchable: true },
            { data: "surgeryDate", name: "surgeryDate" },
            { data: "formatted_created_at", name: "formatted_created_at" },

            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var detailsUrl = BASE_URL + "/admission-and-discharge/preadmission-details/" + full.patientPreadmissionId;
                    var deleteUrl = BASE_URL + "/admission-and-discharge/delete-preadmission/" + full.patientPreadmissionId;

                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="'+detailsUrl+'" class="dropdown-item item-details" data-id="' +
                        detailsUrl +
                        '">Details</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger item-delete" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    $('#clinicId, #employeeId, #createdEmployeeId, #status, #reservationsType, #serviceId, #clientId, #toDay').on('change', function() {
        preAdmissionReportTable.ajax.reload();
    });

    // $('#clinicId').on('change', function() {
    //     preAdmissionReportTable.ajax.reload();
    //   });

    //   $('#employeeId').on('change', function() {
    //     preAdmissionReportTable.ajax.reload();
    //   });
      
    // //   $('#serviceCategoryId').on('change', function() {
    // //     preAdmissionReportTable.ajax.reload();
    // //   });

    // $('#createdEmployeeId').on('change', function() {
    //     preAdmissionReportTable.ajax.reload();
    //   });
      
    //   $('#status').on('change', function() {
    //     preAdmissionReportTable.ajax.reload();
    //   });

    //   $('#reservationsType').on('change', function() {
    //     preAdmissionReportTable.ajax.reload();
    //   });

    //   $('#serviceId').on('change', function() {
    //     preAdmissionReportTable.ajax.reload();
    //   });

      
      

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

    preAdmissionReportTable.on("click", ".item-edit", function () {
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

    preAdmissionReportTable.on("click", ".item-delete", function () {
        var deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this preadmission?",
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
                            preAdmissionReportTable.ajax.reload(null, false);

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

//     preAdmissionReportTable.on("click", ".item-details", function () {
//         var editUrl = $(this).data("id");
// alert('sdsds');
//         $.ajax({
//             url: editUrl,
//             method: "GET",
//             success: function (response) {
//                 if (response.status === true) {
//                     $("#xrayServiceModal").modal("show");
//                     $("#xray-service_form_footer").hide();
//                     $("#xray_service_header").text("Details Of Xray Service");

//                     console.log(response.data.serviceName_en);
//                     // $('#service_form').find('input, textarea, select, button').prop('disabled', true);
//                     $("#xray_service_form")
//                         .find("input, textarea, select, button")
//                         .prop("disabled", true);
//                     $("#xray_service_id").val(response.data.serviceId);
//                     $(".xray-service-code").val(response.data.serviceCode);

//                     $(".xray-service-name-en").val(
//                         response.data.serviceName_en
//                     );
//                     $(".xray-service-name-ar").val(
//                         response.data.serviceName_ar
//                     );
//                     $(".xray-category-id").val(response.data.categoryId);
//                     $(".xray-tax-id").val(response.data.taxId);
//                     $(".xray-cost").val(response.data.cost);

//                     // $("#createServiceBtn").hide();
//                 }
//             },
//             error: function (err) {
//                 console.error("Error fetching edit data:", err);
//             },
//         });
//     });

    $("#select_all").on("click", function () {
        var rows = preAdmissionReportTable.rows({ search: "applied" }).nodes();
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
                                preAdmissionReportTable.ajax.reload(null, false);

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
    // alert(selectedCount);
    if (selectedCount > 0) {
        $("#bulk_select").show();
        $("#selected_count").text(selectedCount);
    } else {
        $("#bulk_select").hide();
    }
}
