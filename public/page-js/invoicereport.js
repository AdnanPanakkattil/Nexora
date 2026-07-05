$(document).ready(function () {
    $("#report_main_menu").addClass("active open menu-item-animating");
    $("#report_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var xrayTable = $("#xray_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/billing/report",
            data: function (d) {

                d.serviceOrderMasterId = $('#filterServiceOrderMasterId').val();
                d.masterIdNumber = $('#filterMasterIdNumber').val();
                d.clientName_en = $('#filterClientName').val();
                d.providerId = $("#provider").val();
                d.clinicId = $("#branch").val();
                d.client_number = $('#filterClientNumber').val();
                d.idnational = $('#filterIdNational').val();
                d.nationality = $("#nationality").val();
                d.financialCategory = $('#financialCategory').val();
                d.billtype = $("#billtype").val();
                d.totalDisAmount = $('#filterTotalDisAmount').val();
                d.totalTaxAmount = $('#filterTotalTaxAmount').val();
                d.totalAmount = $('#filterTotalAmount').val();
                d.billIssuedDate = $('#filterBillIssuedDate').val();
                d.status = $('#filterStatus').val();
                d.startDate = $('#startDate').val();
                d.endDate = $('#endDate').val();
                d.clientId = $("#clientId").val();
                d.createdEmployeeId = $("#createdEmployeeId").val();
            }
        },



        // lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        columns: [
            { data: "serviceOrderMasterId", name: "serviceOrderMasterId" },
            { data: "masterIdNumber", name: "masterIdNumber" },
            { data: "clientId", name: "clientId" },
            { data: "provider", name: "provider" },
            { data: "client_number", name: "client_number" },
            { data: "idnational", name: "idnational" },
            {
                data: "status",
                name: "status",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var className;
                    var statusText = full.status;
                    var serviceOrderMasterId = full.serviceOrderMasterId;

                    switch (statusText) {
                        case "paid":
                            className = "bg-label-success";
                            break;
                        case "pending":
                            className = "bg-label-warning";
                            break;
                        default:
                            className = "bg-label-secondary";
                    }

                    return (
                        '<span class="badge ' +
                        className +
                        ' open-modal-badge" ' +
                        'data-service-order-master-id="' + serviceOrderMasterId + '">' +
                        statusText +
                        "</span>"
                    );
                },
            },

            // { data: "status", name: "status" },
            { data: "creator_name", name: "creator_name" },
            {
                data: 'billtype',
                searchable: true,
                render: function (data) {
                    if (data === 'out_patient') return '<span class="nowrap">Out Patient</span>';
                    if (data === 'in_patient') return '<span class="nowrap">In Patient</span>';
                    return data ?? '';
                }
            },

            { data: "financialCategory" },
            { data: "totalDisAmount", name: "totalDisAmount" },
            { data: "totalTaxAmount", name: "totalTaxAmount" },
            { data: "totalAmount", name: "totalAmount" },
            { data: "billIssuedDate", name: "billIssuedDate" },
            {
                data: "actions",
                name: "actions",
                orderable: false,
                searchable: false,
            }
        ]
    });

    //filterstatus

    // Filters
    $(' #nationality,#financialCategory, #clientId,#billtype, #createdEmployeeId , #branch, #provider,#filterServiceOrderMasterId, #filterMasterIdNumber, #filterClientName, #filterProvider, #filterClientNumber, #filterIdNational, #filterStatus, #filterBillType, #filterTotalDisAmount, #filterTotalTaxAmount, #filterTotalAmount, #filterBillIssuedDate').on('keyup change', function () {
        xrayTable.draw();
    });

    // Date Range Picker
    flatpickr(".flatpickr-range", {
        mode: "range",
        dateFormat: "Y-m-d",
        onChange: function (selectedDates) {
            if (selectedDates.length === 2) {
                $("#startDate").val(selectedDates[0].toISOString().split("T")[0]);
                $("#endDate").val(selectedDates[1].toISOString().split("T")[0]);
                xrayTable.draw();
            }
        }
    });
    $('#filterProvider').on('change', function () {
        xrayTable.draw();
    });

    xrayTable.on('xhr.dt', function (e, settings, json) {
        if (json && json.summary) {
            $('#total_paid').text(json.summary.paid || 0);
            $('#total_pending').text(json.summary.pending || 0);
            $('#total_cancelled').text(json.summary.cancelled || 0);
        }
    });



    $(document).on('click', '.open-modal-badge', function () {
        var serviceOrderMasterId = $(this).data("service-order-master-id");
        var activity = 'billing';

        console.log('Service Order Master ID:', serviceOrderMasterId);

        $.ajax({
            url: BASE_URL + '/fetch-activity-log-billing',
            type: 'POST',
            data: {
                serviceOrderMasterId: serviceOrderMasterId,
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
                                ? `added successfully #${log.affectedId}`
                                : log.action === 'edit'
                                    ? `edited successfully #${log.affectedId}`
                                    : log.action === 'draft'
                                        ? `draft added successfully #${log.affectedId}`
                                        : log.action === 'payment'
                                            ? `payment processed successfully #${log.affectedId}`
                                            : log.action === 'print'
                                                ? `printed successfully #${log.affectedId}`
                                                : `edited successfully #${log.affectedId}`}
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
                    });
                }
            },
            error: function () {
                alert('Failed to fetch activity logs. Please try again.');
            },
        });
    });

    function getNewValueClass(newValue) {
        switch (newValue.toLowerCase()) {
            case 'paid':
                return 'bg-success';
            case 'pending':
                return 'bg-warning';

        }
    }

    $('#filterServiceOrderMasterId, #filterMasterIdNumber, #filterClientName, #filterProvider, #filterClientNumber, #filterIdNational, #filterStatus, #filterBillType, #filterTotalDisAmount, #filterTotalTaxAmount, #filterTotalAmount, #filterBillIssuedDate').on('keyup change', function () {
        xrayTable.draw();
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
                $("#largeModal").modal("hide");
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

    xrayTable.on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    window.location.href = BASE_URL + "/report/" + response.data.serviceOrderMasterId;
                }
            },
            error: function (err) {
                console.error("Error fetching edit data:", err);
            },
        });
    });


    xrayTable.on("click", ".item-delete", function () {
        var deleteUrl = $(this).data("id");
        var serviceOrderMasterId = $(this).data("service-order-master-id");

        Swal.fire({
            title: "Are you sure?",
            text: "Enter reason for deletion",
            icon: "warning",
            input: "text",
            inputValidator: (value) => {
                if (!value) {
                    return "You need to provide a reason for deletion!";
                }
            },
            showCancelButton: true,
            confirmButtonText: "Yes!",
            customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton: "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.isConfirmed && result.value) {
                $.ajax({
                    url: deleteUrl,
                    method: "DELETE",
                    data: {
                        reason: result.value,
                        serviceOrderMasterId: serviceOrderMasterId
                    },
                    success: function (response) {
                        if (response.status === true) {
                            xrayTable.ajax.reload(null, false);

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

    xrayTable.on("click", ".item-details", function () {
        var editUrl = $(this).data("id");
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#xrayServiceModal").modal("show");
                    $("#xray-service_form_footer").hide();
                    $("#xray_service_header").text("Details Of Xray Service");

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

                }
            },
            error: function (err) {
                console.error("Error fetching edit data:", err);
            },
        });
    });


    $("#select_all").on("click", function () {
        var rows = xrayTable.rows({ search: "applied" }).nodes();
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

    window.xrayTable = xrayTable;

    if (!$("#provider").hasClass('select2')) {
        $("#provider").addClass('select2');
    }

    $("#provider").select2({
        placeholder: "Select Atleast One",
        allowClear: true,
        width: '100%',
        minimumResultsForSearch: 0,
        dropdownParent: $("#provider").parent()
    });


    function updateProviderList(reloadTable = false) {
        let clinicId = $("#branch").val();

        if (!clinicId || clinicId === '') {
            clinicId = 'all';
        }
        let $provider = $("#provider");

        $provider.prop('disabled', true);
        $provider.selectpicker('refresh');

        $.get(BASE_URL + "/get-employees-by-branch/" + clinicId, function (res) {

            $provider.selectpicker('destroy');
            $provider.empty();
            $provider.append('<option value="">Select Atleast One</option>');

            if (res.status && res.data.length) {

                let doctors = res.data.filter(e => ['doctor', 'both'].includes(e.role));
                let nurses = res.data.filter(e => e.role === 'nurse');

                if (doctors.length) {
                    let doctorGroup = $('<optgroup label="Doctors"></optgroup>');
                    doctors.forEach(employee => {
                        let fullName = [
                            employee.firstName_en,
                            employee.secondName_en,
                            employee.thirdName_en,
                            employee.lastName_en
                        ].filter(Boolean).join(' ');

                        doctorGroup.append(`<option value="${employee.employeeId}">${fullName}</option>`);
                    });
                    $provider.append(doctorGroup);
                }

                if (nurses.length) {
                    let nurseGroup = $('<optgroup label="Nurses"></optgroup>');
                    nurses.forEach(employee => {
                        let fullName = [
                            employee.firstName_en,
                            employee.secondName_en,
                            employee.thirdName_en,
                            employee.lastName_en
                        ].filter(Boolean).join(' ');

                        nurseGroup.append(`<option value="${employee.employeeId}">${fullName}</option>`);
                    });
                    $provider.append(nurseGroup);
                }
            }

            $provider.prop('disabled', false);
            $provider.selectpicker('render');

            if (reloadTable && xrayTable) {
                xrayTable.ajax.reload(null, false);
            }
        }).fail(function (error) {
            console.error('Error loading providers:', error);
            $provider.selectpicker('destroy');
            $provider.empty();
            $provider.append('<option value="">Select Atleast One</option>');
            $provider.prop('disabled', false);
            $provider.selectpicker('render');
        });
    }
    updateProviderList(false);
    $("#branch").on("change", function () {
        updateProviderList(true);
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
                        id: client.id,
                        text: client.text,
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
                <small>Mobile: ${repo.clientMobile} | ID: ${repo.clientIdNational} </small>
            </div>
        `);
    }

    function formatSearchSelection(repo) {
        return repo.text || repo.id;
    }

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
                                xrayTable.ajax.reload(null, false);

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
        $("#clientId").val(null).trigger('change');
    } else {
        $("#bulk_select").hide();
    }
}

$('#clearEmployee').click(function () {
    $('#createdEmployeeId').val(null).trigger('change');
});
$('#clearprovider').click(function () {
    $('#provider').val(null).trigger('change');
});
