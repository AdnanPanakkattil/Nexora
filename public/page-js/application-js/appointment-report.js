$(document).ready(function () {
    $("#application_appointment_menu").addClass("active open menu-item-animating");
    $("#application_appointment_sub_menu").addClass("active");

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
                appointmentReportTable.ajax.reload();
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

    

    var appointmentReportTable = $("#appointment_report_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/application/appointment-report", // URL for the server-side processing
            data: function(d) {
                d.clinicId = $('#clinicId').val();
                d.clientId = $('#clientId').val(); // Send the selected clinicId with the request
                d.employeeId = $('#employeeId').val();
                d.serviceCategoryId = $('#serviceCategoryId').val();
                d.createdEmployeeId = $('#createdEmployeeId').val();
                d.status = $('#status').val();
                d.reservationsType = $('#reservationsType').val();
                d.serviceId = $('#serviceId').val();
                d.startDate = $(".start_date").val();
                d.endDate = $(".end_date").val();   // Hidden input for end date
            }
          },
       
        columns: [
            { data: "reservationId", name: "reservationId" },
            // {
            //     data: null,
            //     name: "actions",
            //     orderable: false,
            //     searchable: false,
            //     render: function (data, type, full, meta) {
            //         var detailsUrl = BASE_URL + "/medicalrecord-details/" + full.patientId;
            //         console.log(detailsUrl);
            //         return (
                        
            //             '<a href="' +
            //             detailsUrl +
            //             '" class="btn btn-outline-primary waves-effect " style="width:100%;" ><i class="ti ti-report-medical"></i>'+full.patientId+'</a>'
            //         );
            //     },
            // },
            {
                data:"patientId",name:"patientId"
            },
            
            { data: "patientName", name: "patientName" },
            { data: "mobile", name: "mobile" },
            { data: "totalCost", name: "totalCost" },
            {
                data: "status",
                name: "status",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var className;
                    switch (full.status) {
                        case "pending":
                            className = "bg-label-primary";
                            break;
                        case "approved":
                            className = "bg-label-success";
                            break;
                        case "completed":
                            className = "bg-label-info";
                            break;
                        case "rejected":
                            className = "bg-label-primary";
                            break;
                        case "cancelled":
                            className = "bg-label-danger";
                            break;
                        case "absent":
                        case "checkedin":
                        case "refunded":
                        case "processing":
                            className = "bg-label-primary";
                            break;
                        default:
                            className = "";
                    }
            
                    // Return badge with modal trigger data
                    return (
                        '<span class="badge ' +
                        className +
                        ' open-modal-badge" ' +
                        'data-reservation-id="' + full.reservationId + '">' +
                        full.status +
                        "</span>"
                    );
                },
            },
            
            
            { data: "appointmentDate", name: "appointmentDate" },
            { data: "providerName", name: "providerName" },
            { data: "serviceName", name: "serviceName" },
            { data: "createdEmployee", name: "createdEmployee" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var detailsUrl = BASE_URL + "/detail-of-appointment/" + full.reservationId;
                    return (
                        '<div class="row">'+
                        // '<a href="' +
                        // deleteUrl +
                        // '" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill" ><i class="ti ti-eye ti-md"></i></a>'+
                        '<a href="' +
                        detailsUrl +
                        '" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill" ><i class="ti ti-eye ti-md"></i></a>'+
                        '</div>'
                    );
                },
            },
        ],
    });

   


    $(document).on('click', '.open-modal-badge', function () {
        var reservationId = $(this).data('reservation-id');
        var activity = 'appointment';
    
        $.ajax({
            url: BASE_URL + '/fetch-activity-log-appointment',
            type: 'POST',
            data: {
                reservationId: reservationId,
                activity: activity,
                _token: $('meta[name="csrf-token"]').attr('content'),
            },
            success: function (response) {
                if (response.success) {
                    var activityLogs = response.data;
    
                    var modalContent = '';
                    activityLogs.forEach(function (log) {
                        var employeeName = log.employee 
                            ? log.employee.firstName_en + ' ' + log.employee.secondName_en + ' ' + log.employee.thirdName_en + ' ' + log.employee.lastName_en
                            : 'N/A';
                        
                       
                        var newValueBadge = log.newValue ? `<span class="badge ${getNewValueClass(log.newValue)}">${log.newValue}</span>` : '';
                        var dotColor = log.action === 'add' ? 'timeline-point-success' : 'timeline-point-primary';
    
                        modalContent += `
                            <li class="timeline-item timeline-item-transparent">
                                <span class="timeline-point ${dotColor}"></span>
                                <div class="timeline-event">
                                    <div class="timeline-header mb-3">
                                        <h6 class="mb-0">${employeeName}</h6>
                                        <small class="text-muted">${log.created_at}</small>
                                    </div>
                                    <p class="mb-2">
                                        ${log.action === 'add' 
                                            ? `added reservation #${reservationId}` 
                                            : `edited reservation's status #${reservationId}`}
                                    </p>
                                    <div class="d-flex align-items-center mb-2">
                                        ${newValueBadge}
                                    </div>
                                </div>
                            </li>
                        `;
                    });
    
                    $('#statusModal').find('.timeline').html(modalContent);
    
                    $('#statusModal').modal('show');
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: response.message,
                        customClass: {
                            confirmButton: 'btn btn-danger waves-effect waves-light',
                        },
                    })
                }
            },
            error: function () {
                alert('Failed to fetch activity logs. Please try again.');
            },
        });
    });
    
    function getNewValueClass(newValue) {
        switch (newValue.toLowerCase()) {
            case 'completed':
                return 'bg-success'; 
            case 'attendees':
                return 'bg-primary'; 
            case 'refund':
                return 'bg-info'; 
            case 'processing':
                return 'bg-warning'; 
            case 'absent':
                return 'bg-secondary'; 
            case 'cancel':
                return 'bg-danger'; 
            case 'paid':
                return 'bg-success'; 
            case 'print':
                return 'bg-secondary'; 
            default:
                return 'bg-secondary'; 
        }
    }
    
    
    
    
    
    

    $('#clinicId, #employeeId,#serviceCategoryId, #createdEmployeeId, #status, #reservationsType, #serviceId, #clientId').on('change', function() {
        appointmentReportTable.ajax.reload();
    });

    // $('#clinicId').on('change', function() {
    //     appointmentReportTable.ajax.reload();
    //   });

    //   $('#employeeId').on('change', function() {
    //     appointmentReportTable.ajax.reload();
    //   });
      
    // //   $('#serviceCategoryId').on('change', function() {
    // //     appointmentReportTable.ajax.reload();
    // //   });

    // $('#createdEmployeeId').on('change', function() {
    //     appointmentReportTable.ajax.reload();
    //   });
      
    //   $('#status').on('change', function() {
    //     appointmentReportTable.ajax.reload();
    //   });

    //   $('#reservationsType').on('change', function() {
    //     appointmentReportTable.ajax.reload();
    //   });

    //   $('#serviceId').on('change', function() {
    //     appointmentReportTable.ajax.reload();
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
    // alert(selectedCount);
    if (selectedCount > 0) {
        $("#bulk_select").show();
        $("#selected_count").text(selectedCount);
    } else {
        $("#bulk_select").hide();
    }
}
