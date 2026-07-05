$(document).ready(function () {

    $("#pending_main_menu").addClass("active open menu-item-animating");
    $("#pending_sub_menu").addClass("active");


    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    const fp = flatpickr(".flatpickr-range", {
        mode: "range",
        dateFormat: "Y-m-d",
        onChange: function (selectedDates) {
            $("#startDate").val(selectedDates[0] ? selectedDates[0].toISOString().slice(0, 10) : '');
            $("#endDate").val(selectedDates[1] ? selectedDates[1].toISOString().slice(0, 10) : '');
            xrayTable.ajax.reload();
        }
    });

    var xrayTable = $("#pending_bill_table").DataTable({
        processing: true,
        serverSide: true,
        destroy: true,
        ajax: {
            url: BASE_URL + "/billing/tody-pending-report",
            type: "GET",
            data: function (d) {
                d.startDate = $("#startDate").val();
                d.endDate = $("#endDate").val();
                d.providerId = $("#provider").val();
                d.clinicId = $("#branch").val();
                d.clientId = $("#clientId").val();
                d.nationality = $("#nationality").val();
                d.financialCategory = $('#financialCategory').val();
                d.billtype = $("#billtype").val();
                d.status = $("#status").val();
                d.patientId = $("#patient-details").val();
                d.createdEmployeeId = $("#createdEmployeeId").val();
            }

        },
        columns: [
            { data: "serviceOrderMasterId" },
            { data: "masterIdNumber" },
            { data: "clientId" },
            { data: "provider" },
            { data: "client_number" },
            { data: "idnational" },
            {
                data: "status",
                render: function (data) {
                    let cls = "bg-label-secondary";
                    if (data === "paid") cls = "bg-label-success";
                    if (data === "pending") cls = "bg-label-warning";
                    if (data === "cancelled") cls = "bg-label-danger";
                    return `<span class="badge ${cls}">${data}</span>`;
                }
            },
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
            { data: "totalDisAmount" },
            { data: "totalTaxAmount" },
            { data: "totalAmount" },
            { data: "billIssuedDate" },
            {
                data: "actions",
                name: "actions",
                orderable: false,
                searchable: false,
            }
        ],
        order: [[0, "desc"]]
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

    //branch filtering to provider 

    function updateProviderList(reloadTable = false) {

        let clinicId = $("#branch").val() || 'all';
        let $provider = $("#provider");

        $provider.prop('disabled', true).selectpicker('refresh');

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
                        let nameParts = [
                            employee.firstName_en,
                            employee.secondName_en,
                            employee.thirdName_en,
                            employee.lastName_en
                        ].filter(Boolean);

                        let fullName = nameParts.join(' ');
                        let tokens = nameParts.join(' ').toLowerCase();

                        doctorGroup.append(`
                        <option value="${employee.employeeId}" data-tokens="${tokens}">
                            ${fullName}
                        </option>
                    `);
                    });

                    $provider.append(doctorGroup);
                }

                if (nurses.length) {
                    let nurseGroup = $('<optgroup label="Nurses"></optgroup>');

                    nurses.forEach(employee => {
                        let nameParts = [
                            employee.firstName_en,
                            employee.secondName_en,
                            employee.thirdName_en,
                            employee.lastName_en
                        ].filter(Boolean);

                        let fullName = nameParts.join(' ');
                        let tokens = nameParts.join(' ').toLowerCase();

                        nurseGroup.append(`
                        <option value="${employee.employeeId}" data-tokens="${tokens}">
                            ${fullName}
                        </option>
                    `);
                    });

                    $provider.append(nurseGroup);
                }
            }

            $provider.prop('disabled', false);
            $provider.selectpicker('render');

            if (reloadTable && xrayTable) {
                xrayTable.ajax.reload(null, false);
            }

        }).fail(function () {
            $provider.selectpicker('destroy')
                .empty()
                .append('<option value="">Select Atleast One</option>')
                .prop('disabled', false)
                .selectpicker('render');
        });
    }


    updateProviderList(false);
    $("#branch").on("change", function () {
        updateProviderList(true);
    });


    xrayTable.on('xhr.dt', function (e, settings, json) {
        if (json && json.summary) {
            $('#pending').text(json.summary.pending || 0);
            $('#cancelled').text(json.summary.cancelled || 0);
            $('#today_pending').text(json.summary.today_pending || 0);
            $('#today_cancelled').text(json.summary.today_cancelled || 0);
        }
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
                    type: "POST",
                    data: {
                        _method: "DELETE",
                        _token: $('meta[name="csrf-token"]').attr('content'),
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
                                    confirmButton: "btn btn-success waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function (xhr) {
                        console.error(xhr.responseText);
                        Swal.fire("Error", "Delete failed", "error");
                    }
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

    $("#provider, #billtype, #status, #financialCategory, #clientId, #nationality, #createdEmployeeId")
        .on("change", function () {
            xrayTable.ajax.reload();
        });

    // Reset filters
    $("#resetDateRange").on("click", function () {
        $("#startDate").val("");
        $("#endDate").val("");
        $("#clientId").val(null).trigger('change');
        fp.clear();
        xrayTable.ajax.reload();
    });

    $('#clearProvider').click(function () {
        $('#provider').selectpicker('val', '');
    });

});
