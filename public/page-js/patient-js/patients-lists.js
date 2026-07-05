$(document).ready(function () {
    $("#patient_main_menu").addClass("active open menu-item-animating");
    $("#patients_lists_sub_menu").addClass("active");

    if (window.location.pathname.includes("new-born-baby-lists")) {
        setTimeout(function () {
            $("#newBornBaby").click();
        }, 100);
    } else {
    $("#parentPatient").addClass("active");
    $("#newBornBaby_table")
        .closest(".tab-pane, .card, .card-datatable")
        .addClass("d-none");
    }

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // the first page loding time to show/hide filters start
    function showPatientFilters() {
        $('#patient-filters').show();
        $('#newBornBaby-filters').hide();
    }

    function showNewBornBabyFilters() {
        $('#patient-filters').hide();
        $('#newBornBaby-filters').show();
    }

    showPatientFilters();

    // FIRST TABLE END
    patientListTable = $("#patient_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/patients-lists",
            type: "GET",
            data: function (d) {
                d.clientId = $("#searchpatientname").val() || $("#patient-id-search").val();
                d.idNational = $("#idNational-search").val();
                d.mobile = $("#patient-mobile-search").val();
            }
        },
        columns: [
            { data: "clientId", name: "clientId" },
            { data: "clientEnglishName", name: "clientEnglishName" },
            { data: "clientArabicName", name: "clientArabicName" },
            { data: "mobile", name: "mobile" },
            { data: "clientEmail", name: "clientEmail" },
            { data: "idNational", name: "idNational" },
            { data: "idNationalType", name: "idNationalType" },
            { data: "birthDate", name: "birthDate" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var viewUrl = BASE_URL + "/patient-view/" + full.clientId;
                    var editUrl = BASE_URL + "/patient-edit/" + full.clientId;
                    var deleteUrl = BASE_URL + "/delete-patient/" + full.clientId;

                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">' +
                        '<i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="' + viewUrl + '" class="dropdown-item item-view">View</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="' +
                        editUrl +
                        '" class="dropdown-item item-edit">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger patient-delete" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
        order: [[0, "desc"]],
    });

    var deleteWarningHtml = `
            <p class="mb-3 text-danger">This action is <strong>permanent and cannot be recovered!</strong></p>
            <div class="text-start bg-label-danger rounded p-3" style="font-size:0.85rem;">
                <span class="text-danger fw-bold">⚠ All data associated with this  will be permanently removed:</span>
            <p class="mb-0 mt-1">Appointments, EMR records, Reports, Billing, and Vital Room. etc..</p>
            </div>
        `;

    patientListTable.off("click", ".patient-delete").on("click", ".patient-delete", function () {
        var deleteUrl = $(this).data("id");
        var patientId = deleteUrl.split('/').pop();

        $.ajax({
            url: `${BASE_URL}/check-patient-appointments/${patientId}`,
            type: "GET",
            beforeSend: function () {
                $("#app-loader").show();
            },
            success: function(response) {
                if (response.hasAppointment) {
                    Swal.fire({
                        icon: "error",
                        title: "Cannot Delete Patient",
                        text: `This patient has an active appointment (Status: ${response.status}). You cannot delete this patient.`,
                        customClass: {
                            confirmButton: "btn btn-danger waves-effect waves-light",
                        }
                    });
                } else {
        Swal.fire({
            title: "Are you sure?",
            html: deleteWarningHtml,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes!",
            customClass: {
                confirmButton: "btn btn-danger me-3 waves-effect waves-light",
                cancelButton:
                    "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: deleteUrl,
                    method: "DELETE",
                    beforeSend: function () {
                        $("#app-loader").show();
                    },
                    success: function (response) {
                        if (response.status === true) {
                            patientListTable.ajax.reload(null, false);
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton:
                                        "btn btn-success waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function (err) {
                        console.error("Error fetching edit data:", err.message);
                        $("#branchModel").modal("hide");
                        var errorMessage =
                            err.responseJSON && err.responseJSON.message
                                ? err.responseJSON.message
                                : "An unexpected error occurred. Please try again.";
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
                    complete: function () {
                        $("#app-loader").hide();
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Please verify the patient details.",
                    icon: "error",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    }
},
error: function(err) {
    console.error("Error checking appointments:", err);
            },
            complete: function () {
                $("#app-loader").hide();
            }
        });
    });

    // FIRST TABLE END
    // SECOND  START

    $("#parentPatient").on("click", function () {
        showPatientFilters()
        history.pushState(null, '', BASE_URL + '/patients-lists');
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        $("#newBornBaby_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#patient_table")
            .closest(".tab-pane, .card, .card-datatable")
            .removeClass("d-none");
        if ($.fn.DataTable.isDataTable("#patient_table")) {
            $("#patient_table").DataTable().destroy();
        }
        patientListTable = $("#patient_table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: BASE_URL + "/patients-lists",
                type: "GET",
                data: function (d) {
                    d.clientId = $("#searchpatientname").val() || $("#patient-id-search").val();
                    d.idNational = $("#idNational-search").val();
                    d.mobile = $("#patient-mobile-search").val();
                }
            },

            columns: [
                { data: "clientId", name: "clientId" },
                { data: "clientEnglishName", name: "clientEnglishName" },
                { data: "clientArabicName", name: "clientArabicName" },
                { data: "mobile", name: "mobile" },
                { data: "clientEmail", name: "clientEmail" },
                { data: "idNational", name: "idNational" },
                { data: "idNationalType", name: "idNationalType" },
                { data: "birthDate", name: "birthDate" },
                {
                    data: null,
                    name: "actions",
                    orderable: false,
                    searchable: false,
                    render: function (data, type, full, meta) {
                        var viewUrl = BASE_URL + "/patient-view/" + full.clientId;
                        var editUrl =
                            BASE_URL + "/patient-edit/" + full.clientId;
                        var deleteUrl =
                            BASE_URL + "/delete-patient/" + full.clientId;
                        return (
                            '<div class="d-inline-block">' +
                            '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">' +
                            '<i class="ti ti-dots-vertical ti-md"></i></a>' +
                            '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                            '<li><a href="' + viewUrl + '" class="dropdown-item item-view">View</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="' +
                            editUrl +
                            '" class="dropdown-item item-edit">Edit</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item text-danger patient-delete" data-id="' +
                            deleteUrl +
                            '">Delete</a></li>' +
                            "</ul>" +
                            "</div>"
                        );
                    },
                },
            ],
            order: [[0, "desc"]],
        });
        patientListTable.off("click", ".patient-delete").on("click", ".patient-delete", function () {
            var deleteUrl = $(this).data("id");
            var patientId = deleteUrl.split('/').pop();

            $.ajax({
                url: `${BASE_URL}/check-patient-appointments/${patientId}`,
                type: "GET",
                beforeSend: function () {
                    $("#app-loader").show();
                },
                success: function(response) {
                    if (response.hasAppointment) {
                        Swal.fire({
                            icon: "error",
                            title: "Cannot Delete Patient",
                            text: `This patient has an active appointment (Status: ${response.status}). You cannot delete this patient.`,
                            customClass: {
                                confirmButton: "btn btn-danger waves-effect waves-light",
                            }
                        });
                    } else {
            Swal.fire({
                title: "Are you sure?",
                html: deleteWarningHtml,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes!",
                customClass: {
                    confirmButton:
                        "btn btn-danger me-3 waves-effect waves-light",
                    cancelButton:
                        "btn btn-label-secondary waves-effect waves-light",
                },
                buttonsStyling: false,
            }).then(function (result) {
                if (result.value) {
                    $.ajax({
                        url: deleteUrl,
                        method: "DELETE",
                        beforeSend: function () {
                            $("#app-loader").show();
                        },
                        success: function (response) {
                            if (response.status === true) {
                                patientListTable.ajax.reload(null, false);
                                Swal.fire({
                                    icon: "success",
                                    text: response.message,
                                    customClass: {
                                        confirmButton:
                                            "btn btn-success waves-effect waves-light",
                                    },
                                });
                            }
                        },
                        error: function (err) {
                            console.error(
                                "Error fetching edit data:",
                                err.message
                            );
                            $("#branchModel").modal("hide");
                            var errorMessage =
                                err.responseJSON && err.responseJSON.message
                                    ? err.responseJSON.message
                                    : "An unexpected error occurred. Please try again.";
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
                        complete: function () {
                            $("#app-loader").hide();
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        title: "Cancelled",
                        text: "Please verify the patient details.",
                        icon: "error",
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    });
                }
            });
        }
    },
    error: function(err) {
        console.error("Error checking appointments:", err);
                },
                complete: function () {
                    $("#app-loader").hide();
                }
            });
        });
    });


    // SECOND TABLE END


    //newBornBaby table start

    $("#newBornBaby").on("click", function () {

        // ADD THIS: Show newborn baby filters
        showNewBornBabyFilters();

        history.pushState(null, '', BASE_URL + '/new-born-baby-lists');
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        $("#patient_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#newBornBaby_table")
            .closest(".tab-pane, .card, .card-datatable")
            .removeClass("d-none");
        if ($.fn.DataTable.isDataTable("#newBornBaby_table")) {
            $("#newBornBaby_table").DataTable().destroy();
        }
        newBornBabyListTable = $("#newBornBaby_table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: BASE_URL + "/new-born-baby-lists",
                type: "GET",
                data: function (d) {
                    d.clientId = $("#newBornBabyserching").val() || $("#newBornBabyidserching").val();
                }

            },
            columns: [
                { data: "clientId", name: "clientId" },
                { data: "clientEnglishName", name: "clientEnglishName" },
                { data: "clientArabicName", name: "clientArabicName" },
                { data: "birthDate", name: "birthDate" },
                {
                    data: null,
                    name: "actions",
                    orderable: false,
                    searchable: false,
                    render: function (data, type, full, meta) {
                        var viewUrl = BASE_URL + "/patient-view/" + full.clientId;
                        var editUrl =
                            BASE_URL + "/new-born-baby-edit/" + full.clientId;
                        var deleteUrl =
                            BASE_URL + "/new-born-baby-delete/" + full.clientId;

                        return (
                            '<div class="d-inline-block">' +
                            '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">' +
                            '<i class="ti ti-dots-vertical ti-md"></i></a>' +
                            '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                            '<li><a href="' + viewUrl + '" class="dropdown-item item-view">View</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="' +
                            editUrl +
                            '" class="dropdown-item new-born-baby-edit">Edit</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item text-danger new-born-baby-delete" data-id="' +
                            deleteUrl +
                            '">Delete</a></li>' +
                            "</ul>" +
                            "</div>"
                        );
                    },
                },
            ],
            order: [[0, "desc"]],
        });
        newBornBabyListTable.off("click", ".new-born-baby-delete").on("click", ".new-born-baby-delete", function () {
            var deleteUrl = $(this).data("id");
            var patientId = deleteUrl.split('/').pop();

            $.ajax({
                url: `${BASE_URL}/check-patient-appointments/${patientId}`,
                type: "GET",
                beforeSend: function () {
                    $("#app-loader").show();
                },
                success: function(response) {
                    if (response.hasAppointment) {
                        Swal.fire({
                            icon: "error",
                            title: "Cannot Delete Patient",
                            text: `This patient has an active appointment (Status: ${response.status}). You cannot delete this patient.`,
                            customClass: {
                                confirmButton: "btn btn-danger waves-effect waves-light",
                            }
                        });
                    } else {
            Swal.fire({
                title: "Are you sure?",
                html: deleteWarningHtml,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes!",
                customClass: {
                    confirmButton:
                        "btn btn-danger me-3 waves-effect waves-light",
                    cancelButton:
                        "btn btn-label-secondary waves-effect waves-light",
                },
                buttonsStyling: false,
            }).then(function (result) {
                if (result.value) {
                    $.ajax({
                        url: deleteUrl,
                        method: "DELETE",
                        beforeSend: function () {
                            $("#app-loader").show();
                        },
                        success: function (response) {
                            if (response.status === true) {
                                newBornBabyListTable.ajax.reload(null, false);
                                Swal.fire({
                                    icon: "success",
                                    text: response.message,
                                    customClass: {
                                        confirmButton:
                                            "btn btn-success waves-effect waves-light",
                                    },
                                });
                            }
                        },
                        error: function (err) {
                            console.error(
                                "Error fetching edit data:",
                                err.message
                            );
                            $("#branchModel").modal("hide");
                            var errorMessage =
                                err.responseJSON && err.responseJSON.message
                                    ? err.responseJSON.message
                                    : "An unexpected error occurred. Please try again.";
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
                        complete: function () {
                            $("#app-loader").hide();
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        title: "Cancelled",
                        text: "Please verify the Newborn Baby details.",
                        icon: "error",
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    });
                            }
                        });
                    }
                },
                error: function(err) {
                    console.error("Error checking appointments:", err);
                },
                complete: function () {
                    $("#app-loader").hide();
                }
            });
        });
    });

    //newBornBaby table END

    $('#getHealthIdBtn').on('click', function () {

        let patientId = $('#patientId').val();

        $.ajax({
            url: '/nhic/patient/health-id',
            type: 'GET',
            data: {
                patientId: patientId,
            },
            beforeSend: function () {
                $("#loader-overlay").show();
                $('#getHealthIdBtn').prop('disabled', true);
                $('.health_id_error');

            },
            success: function (res) {
                if (res.success) {
                    $('#health_id').val(res.data.data.HealthId);
                    $('#getHealthIdBtn').hide();
                } else {
                    alert(res.message ?? 'Health ID not found');
                }
            },
            error: function (xhr) {
                let message = 'Something went wrong';

                if (xhr.responseJSON && xhr.responseJSON.message) {
                    message = xhr.responseJSON.message;
                }

                alert(message);
            },
            complete: function () {
                $("#loader-overlay").hide();
                $('#getHealthIdBtn').prop('disabled', false);
            }
        });
    });

    $("#searchpatientname").select2({
        placeholder: "Search Name",
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/patients-search",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    patient_id: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data.results
                };
            }
        },
        templateResult: function (patient) {
            if (!patient.text) return patient.id;

            return $(`
            <div>
                <strong>Name: ${patient.text}</strong><br>
                <small>
                    File ID: ${patient.id ?? '-'} |
                    Mobile: ${patient.mobile ?? '-'}
                </small>
            </div>
        `);
        },
        templateSelection: function (patient) {
            return patient.text || patient.id;
        },
        escapeMarkup: function (markup) {
            return markup;
        }
    });


    $("#patient-id-search").select2({
        placeholder: "Search Patient ID",
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/patient-id-search",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    patient_id: params.term
                };
            },
            processResults: function (data) {
                return data;
            }
        },
        templateResult: function (patient) {
            if (!patient.id) return patient.text;

            return $(`
            <div>
                <strong>File ID: ${patient.id_no}</strong><br>
                <small>
                    Name: ${patient.text ?? '-'} |
                    Mobile: ${patient.mobile ?? '-'}
                </small>
            </div>
        `);
        },
        templateSelection: function (patient) {
            return patient.id_no || patient.text;
        },
        escapeMarkup: function (markup) {
            return markup;
        }
    });


    $("#idNational-search").select2({
        placeholder: "Search IDNational",
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/idNational-search",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    patient_id: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data.results
                };
            }
        },
        templateResult: function (patient) {
            if (!patient.id) return patient.text;

            return $(`
            <div>
                <strong>ID National: ${patient.id_no}</strong><br>
                <small>
                    Name: ${patient.text ?? '-'} |
                    Mobile: ${patient.mobile ?? '-'}
                </small>
            </div>
        `);
        },
        templateSelection: function (patient) {
            return patient.id_no || patient.text;
        },
        escapeMarkup: function (markup) {
            return markup;
        }
    });


    $("#patient-mobile-search").select2({
        placeholder: "Search Mobile Number",
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/patient-mobile-search",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    patient_id: params.term
                };
            },
            processResults: function (data) {
                return data;
            }
        },
        templateResult: function (patient) {
            if (!patient.id) return patient.text;

            return $(`
            <div>
                <strong>Mobile: ${patient.mobile}</strong><br>
                <small>
                    Name: ${patient.text ?? '-'} |
                    Mobile: ${patient.mobile ?? '-'}
                </small>
            </div>
        `);
        },
        templateSelection: function (patient) {
            return patient.id_no || patient.text;
        },
        escapeMarkup: function (markup) {
            return markup;
        }
    });


    $("#newBornBabyserching").select2({
        placeholder: "Search Newborn Name",
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/newBornBaby-details",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    patient_id: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data.results
                };
            }
        },
        templateResult: function (patient) {
            if (!patient.text) return patient.id;

            return $(`
            <div>
                <strong>Name: ${patient.text}</strong><br>
                <small>
                    File ID: ${patient.id ?? '-'} 
                </small>
            </div>
        `);
        },
        templateSelection: function (patient) {
            return patient.text || patient.id;
        },
        escapeMarkup: function (markup) {
            return markup;
        }
    });

    $("#newBornBabyidserching").select2({
        placeholder: "Search Newborn File ID",
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/newBornBaby-id-search",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    patient_id: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data.results
                };
            }
        },
        templateResult: function (patient) {
            if (!patient.text) return patient.id;

            return $(`
            <div>
                <strong>Name: ${patient.text}</strong><br>
                <small>
                    File ID: ${patient.id ?? '-'} 
                </small>
            </div>
        `);
        },
        templateSelection: function (patient) {
            return patient.text || patient.id;
        },
        escapeMarkup: function (markup) {
            return markup;
        }
    });


    $("#searchpatientname, #patient-id-search, #idNational-search, #patient-mobile-search")
        .on("select2:select select2:clear keyup", function () {

            if ($("#parentPatient").hasClass("active") && patientListTable) {
                patientListTable.ajax.reload();
            }
        });


    $("#newBornBabyserching, #newBornBabyidserching")
        .on("select2:select select2:clear keyup", function () {

            if ($("#newBornBaby").hasClass("active") && newBornBabyListTable) {
                newBornBabyListTable.ajax.reload();
            }
        });



});