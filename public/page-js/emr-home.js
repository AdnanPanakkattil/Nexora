$("#medical_record_main_menu").addClass("active open menu-item-animating");
$("#emr_home_sub_menu").addClass("active");

$.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    },
});

function buildFullName(...parts) {
    return parts
        .filter(
            (name) =>
                name !== null &&
                name !== undefined &&
                name.toString().trim() !== "" &&
                name.toString().toLowerCase() !== "null",
        )
        .join(" ");
}

function initDataTable(tableId) {
    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
    }
    $(tableId).DataTable({
        destroy: true,
        paging: true,
        pageLength: 5,
        lengthChange: false,
        searching: true,
        ordering: true,
        info: true,
        language: {
            emptyTable: "No records found",
        },
    });
}

function initializeSelect2() {
    $("#patient-details").select2({
        dropdownParent: $("#patient-details").parent(),
        width: "100%",
        placeholder: "Search Name, File ID, or Mobile",
        minimumInputLength: 2,
        ajax: {
            url: "/search-clients",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return { query: params.term };
            },
            processResults: function (data) {
                return {
                    results: data.map((client) => ({
                        id: client.clientId,
                        text: [
                            client.clientName_en,
                            client.secondName_en,
                            client.thirdName_en,
                            client.fourthName_en,
                        ]
                            .filter((name) => name && name.trim() !== "")
                            .join(" "),
                        clientMobile: client.mobile,
                        clientIdNational: client.idNational,
                    })),
                };
            },
            cache: true,
        },
        allowClear: true,
        templateResult: formatClientData,
        templateSelection: formatClientSelection,
    });
    $("#mergebtn").click(function () {
        $("#mergeCard").slideToggle();
    });
    $(".Patientids").select2({
        dropdownParent: $(".Patientids").parent(),
        width: "100%",
        placeholder: "Search Patient",
        allowClear: true,
        minimumInputLength: 2,
        ajax: {
            url: BASE_URL + "/search-patient-emr",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    query: params.term,
                };
            },
            processResults: function (data) {
                return {
                    results: data.map(function (item) {
                        return {
                            id: item.id,
                            text: item.text,
                        };
                    }),
                };
            },
            cache: true,
        },
    });
    $("#mergebtn-save").click(function () {
        var newclientId = $("#Patientids").val();
        var reason = $("#reason").val();
        var oldclientId = $("#clientid").text();
        console.log(newclientId);
        $.ajax({
            url: "/merge-patient",
            type: "POST",
            data: {
                newclientId: newclientId,
                reason: reason,
                oldclientId: oldclientId,
                _token: $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
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
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    text: xhr.responseJSON?.message || "An error occurred.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });
    $(".Patientids").on("select2:select", function (e) {
        var data = e.params.data;
        $(".Patientids").append(
            $("<option>", {
                value: data.id,
                text: data.text,
            }),
        );
        $(".Patientids").val(data.id).trigger("change");
    });
    $("#patient-id").select2({
        dropdownParent: $("#patient-id").parent(),
        width: "100%",
        placeholder: "File ID",
        minimumInputLength: 1,
        ajax: {
            url: "/search-client-id",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return { query: params.term };
            },
            processResults: function (data) {
                return {
                    results: data.map((client) => ({
                        id: client.clientId,
                        text: buildFullName(
                            client.clientName_en,
                            client.secondName_en,
                            client.thirdName_en,
                            client.fourthName_en,
                        ),
                        clientMobile: client.mobile,
                        clientIdNational: client.idNational,
                    })),
                };
            },
            cache: true,
        },
        allowClear: true,
        templateResult: formatClientData,
        templateSelection: formatClientSelection,
    });
    $("#patient-idnational").select2({
        dropdownParent: $("#patient-idnational").parent(),
        width: "100%",
        placeholder: "ID National",
        minimumInputLength: 2,
        ajax: {
            url: "/search-client-idnational",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return { query: params.term };
            },
            processResults: function (data) {
                return {
                    results: data.map((client) => ({
                        id: client.clientId,
                        text: buildFullName(
                            client.clientName_en,
                            client.secondName_en,
                            client.thirdName_en,
                            client.fourthName_en,
                        ),
                        clientMobile: client.mobile,
                        clientIdNational: client.idNational,
                    })),
                };
            },
            cache: true,
        },
        allowClear: true,
        templateResult: formatClientData,
        templateSelection: formatClientSelection,
    });
    $("#patient-mobile").select2({
        dropdownParent: $("#patient-mobile").parent(),
        width: "100%",
        placeholder: "Mobile",
        minimumInputLength: 2,
        ajax: {
            url: "/search-client-mobile",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return { query: params.term };
            },
            processResults: function (data) {
                return {
                    results: data.map((client) => ({
                        id: client.clientId,
                        text: buildFullName(
                            client.clientName_en,
                            client.secondName_en,
                            client.thirdName_en,
                            client.fourthName_en,
                        ),
                        clientMobile: client.mobile,
                        clientIdNational: client.idNational,
                    })),
                };
            },
            cache: true,
        },
        allowClear: true,
        templateResult: formatClientData,
        templateSelection: formatClientSelection,
    });
    function formatClientData(client) {
        if (!client.id) {
            return client.text;
        }
        return $(`
            <div>
                <strong>${client.text}</strong><br>
                <small>Mobile: ${client.clientMobile} | ID: ${client.clientIdNational} | MRN: ${client.id}</small>
            </div>
        `);
    }
    function formatClientSelection(client) {
        return client.text || client.id;
    }
    $("#patient-details, #patient-id, #patient-idnational, #patient-mobile").on(
        "select2:select",
        function (e) {
            const selectedField = $(this).attr("id");
            const selectedClient = e.params.data;
            const clientId = selectedClient.id;
            $("#client-id").val(selectedClient.id);
            if (selectedField !== "patient-details") {
                $("#patient-details").val(null).trigger("change");
            }
            if (selectedField !== "patient-id") {
                $("#patient-id").val(null).trigger("change");
            }
            if (selectedField !== "patient-idnational") {
                $("#patient-idnational").val(null).trigger("change");
            }
            if (selectedField !== "patient-mobile") {
                $("#patient-mobile").val(null).trigger("change");
            }
            fetchClientDetails(clientId);
            resetSelect2Fields($(this).attr("id"));
        },
    );
}

$("#loading").hide();
$(".Info-card").hide();
$(".Report-card").hide();
$("#Appointment-card").hide();

function fetchClientDetails(clientId) {
    $("#loading").show();
    $.ajax({
        url: "/get-client-details/" + clientId,
        type: "GET",
        dataType: "json",
        success: function (data) {
            $("#loading").hide();
            $(".Info-card").show();
            $(".Report-card").show();
            $("#Appointment-card").show();
            $("#OP_History").empty();
            if ($.fn.DataTable.isDataTable("#op-history-table")) {
                $("#op-history-table").DataTable().clear().destroy();
            }
            if (data.Outpatient?.outpatientOrders?.length > 0) {
                data.Outpatient.outpatientOrders.forEach((element) => {
                    console.log("Outpatient Element: ", element);
                    let reason = "-";
                    if (element.status === "cancelled") {
                        reason = element.cancelReason ?? "-";
                    } else if (element.status === "absent") {
                        reason = element.absentReason ?? "-";
                    }
                    const row = `
                        <tr>
                            <td>${element.reservationId ?? "-"}</td>
                            <td>${element.clientId ?? "-"}</td>
                            <td>${element.clientName ?? "-"}</td>
                            <td>${element.mobile ?? "-"}</td>
                            <td>${element.idNational ?? "-"}</td>
                            <td>${element.totalCost ?? "-"}</td>
                            <td>${element.status ?? "-"}</td>
                            <td>${reason}</td>
                            <td>${element.appointmentDate ?? "-"}</td>
                            <td>${element.providerName ?? "-"}</td>
                            <td>${element.serviceNames ?? "-"}</td>
                            <td>${element.createdEmployeeName ?? "-"}</td>
                            <td>${element.remainingSession ?? "-"}</td>
                            <td>
                             <div class="d-flex">
                        <button type="button" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill op-delete"  data-id="${
                            element.reservationId
                        }"><i class="ti ti-trash ti-md"></i></button>
                        <button type="button" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill op-view"  data-id="${
                            element.reservationId
                        }"><i class="ti ti-eye ti-md"></i></button>
                        <button type="button" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill op-edit"  data-id="${
                            element.reservationId
                        }"><i class="ti ti-pencil ti-md"></i></button>
                    </div>
                            </td>
                        </tr>`;

                    $("#OP_History").append(row);
                });

                $(document).on("click", ".op-view", function () {
                    var reservationId = $(this).data("id");
                    window.location.href = `/op-history-view/${reservationId}`;
                });
                $(document).on("click", ".op-edit", function () {
                    var reservationId = $(this).data("id");
                    window.location.href = `/op-history-edit/${reservationId}`;
                });
                $(document).on("click", ".op-delete", function () {
                    var reservationId = $(this).data("id");
                    Swal.fire({
                        title: "Are you sure?",
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
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $.ajax({
                                url: "/delete-op/" + reservationId,
                                method: "POST",
                                headers: {
                                    "X-CSRF-TOKEN": $(
                                        'meta[name="csrf-token"]',
                                    ).attr("content"),
                                },
                                success: function (response) {
                                    Swal.fire({
                                        title: "Deleted!",
                                        text: response.message,
                                        icon: "success",
                                        confirmButtonText: "OK",
                                        customClass: {
                                            confirmButton:
                                                "btn btn-primary waves-effect waves-light",
                                        },
                                    }).then(() => {
                                        location.reload();
                                    });
                                },
                                error: function (xhr, status, error) {
                                    Swal.fire({
                                        title: "Error!",
                                        text: "An error occurred while deleting the reservation.",
                                        icon: "error",
                                        confirmButtonText: "OK",
                                        customClass: {
                                            confirmButton:
                                                "btn btn-primary waves-effect waves-light",
                                        },
                                    });
                                },
                            });
                        }
                    });
                });
            }
            $("#op-history-table").DataTable({
                destroy: true,
                paging: true,
                pageLength: 5,
                lengthChange: false,
                searching: true,
                ordering: true,
                info: true,
                language: {
                    emptyTable: "No outpatient records found",
                },
            });
            initDataTable("#op-history-table");
            $("#IP_History").empty();
            if ($.fn.DataTable.isDataTable("#ip-history-table")) {
                $("#ip-history-table").DataTable().clear().destroy();
            }
            if (data.Inpatient?.InpatientOrders?.length > 0) {
                let rows1 = "";
                data.Inpatient.InpatientOrders.forEach((element) => {
                    const row1 = `
                        <tr>
                            <td>${element.patientAdmissionId}</td>
                            <td>${element.clientId}</td>
                            <td>${element.doctorEmployeeId}</td>
                            <td>${element.consultationDoctorEmployeeId}</td>
                            <td>${element.clientName}</td>
                            <td>${element.mobile}</td>
                            <td>${element.IDNational}</td>
                            <td>${element.lengthOfStay}</td>
                            <td>${element.status}</td>
                            <td>${element.admission_dateTime}</td>
                            <td>
                             <div class="d-flex">
                        <button type="button" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill ip-view"  data-id="${element.patientAdmissionId}"><i class="ti ti-eye ti-md"></i></button>
                    </div>
                            </td>
                        </tr>`;
                    rows1 += row1;
                });
                $("#IP_History").append(rows1);
                initDataTable("#ip-history-table");
                $(document).on("click", ".ip-view", function () {
                    var patientAdmissionId = $(this).data("id");
                    window.location.href = `/ip-history-view/${patientAdmissionId}`;
                });
            }
            $("#ip-history-table").DataTable({
                destroy: true,
                paging: true,
                pageLength: 5,
                lengthChange: false,
                searching: true,
                ordering: true,
                info: true,
                language: {
                    emptyTable: "No inpatient records found",
                },
            });
            $("#BILL_History").empty();
            if ($.fn.DataTable.isDataTable("#bill-history-table")) {
                $("#bill-history-table").DataTable().clear().destroy();
            }
            if (data.serviceOrderMaster?.billOrders?.length > 0) {
                let rows2 = "";
                data.serviceOrderMaster.billOrders.forEach((element) => {
                    const row2 = `
                        <tr>
                            <td>${element.serviceOrderMasterId ?? "-"}</td>
                            <td>${element.clientId ?? "-"}</td>
                            <td>${element.providerName ?? "-"}</td>
                            <td>${element.clientName ?? "-"}</td>
                            <td>${element.mobile ?? "-"}</td>
                            <td>${element.idNational ?? "-"}</td>
                            <td>${element.totalAmount ?? "-"}</td>
                            <td>${element.disAmount ?? "-"}</td>
                            <td>${element.totelAmount ?? "-"}</td>
                            <td>${element.vat ?? "-"}</td>
                            <td>${element.netAmount ?? "-"}</td>
                            <td>${element.status ?? "-"}</td>
                            <td>${element.createdDateTime ?? "-"}</td>
                            <td>${element.createdEmployeeName ?? "-"}</td>
                            <td>${element.billtype ?? "-"}</td>
                            <td>
                              <div class="d-flex">
                        <button type="button" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill bill-view"  data-id="${
                            element.serviceOrderMasterId
                        }"><i class="ti ti-eye ti-md"></i></button>
                        <button type="button" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill bill-delete"  data-id="${
                            element.serviceOrderMasterId
                        }"><i class="ti ti-trash ti-md"></i></button>
                    </div>
                            </td>
                        </tr>`;
                    rows2 += row2;
                });
                $("#BILL_History").append(rows2);
                initDataTable("#bill-history-table");
                $(document).on("click", ".bill-view", function () {
                    var serviceOrderMasterId = $(this).data("id");
                    window.location.href = `/bill-history-emr/${serviceOrderMasterId}`;
                });
                $(document).on("click", ".bill-delete", function () {
                    var serviceOrderMasterId = $(this).data("id");
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
                            confirmButton:
                                "btn btn-primary me-3 waves-effect waves-light",
                            cancelButton:
                                "btn btn-label-secondary waves-effect waves-light",
                        },
                        buttonsStyling: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            var reason = result.value;
                            $.ajax({
                                url: "/delete-bill/" + serviceOrderMasterId,
                                method: "POST",
                                data: {
                                    reason: reason,
                                },
                                headers: {
                                    "X-CSRF-TOKEN": $(
                                        'meta[name="csrf-token"]',
                                    ).attr("content"),
                                },
                                success: function (response) {
                                    Swal.fire({
                                        title: "Deleted!",
                                        text: response.message,
                                        icon: "success",
                                        confirmButtonText: "OK",
                                        customClass: {
                                            confirmButton:
                                                "btn btn-primary waves-effect waves-light",
                                        },
                                    }).then(() => {
                                        location.reload();
                                    });
                                },
                                error: function (xhr, status, error) {
                                    Swal.fire({
                                        title: "Error!",
                                        text: "An error occurred while deleting the bill.",
                                        icon: "error",
                                        confirmButtonText: "OK",
                                        customClass: {
                                            confirmButton:
                                                "btn btn-primary waves-effect waves-light",
                                        },
                                    });
                                },
                            });
                        }
                    });
                });
            }
            $("#bill-history-table").DataTable({
                destroy: true,
                paging: true,
                pageLength: 5,
                lengthChange: false,
                searching: true,
                ordering: true,
                info: true,
                language: {
                    emptyTable: "No bill records found",
                },
            });
            $("#Lab_History").empty();
            if ($.fn.DataTable.isDataTable("#lab-history-table")) {
                $("#lab-history-table").DataTable().clear().destroy();
            }
            if (data.lab?.labOrders?.length > 0) {
                let rows3 = "";
                data.lab.labOrders.forEach((element) => {
                    const row3 = `
                        <tr class="text-center">
                            <td>${element.serviceOrderMasterId ?? "-"}</td>
                            <td>${element.clientId ?? "-"}</td>
                            <td>${element.clientName ?? "-"}</td>
                            <td>${element.providerName ?? "-"}</td>
                            <td>${element.billtype ?? "-"}</td>
                            <td>${element.createdDateTime ?? "-"}</td>
                            <td>${element.status ?? "-"}</td>
                            <td>${element.username ?? "-"}</td>
                            <td>
                              <div class="d-flex justify-content-center">
                                <button type="button" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill lab-view" 
                                data-id="${element.serviceOrderMasterId}"><i class="ti ti-eye ti-md"></i></button>
                                <button type="button" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill lab-print"
                                data-id="${element.serviceOrderMasterId}"><i class="ti ti-file-type-pdf ti-md"></i></button>
                              </div>
                            </td>
                        </tr>`;
                    rows3 += row3;
                });
                $(document)
                    .off("click", ".lab-view")
                    .on("click", ".lab-view", function () {
                        var serviceOrderMasterId = $(this).data("id");
                        window.open(
                            `/laboratory-laboratory-result/${serviceOrderMasterId}/modify`,
                            "_blank",
                        );
                    });
                $(document)
                    .off("click", ".lab-print")
                    .on("click", ".lab-print", function () {
                        var serviceOrderMasterId = $(this).data("id");
                        window.open(
                            `/laboratory-laboratory-result/${serviceOrderMasterId}/detail`,
                            "_blank",
                        );
                    });
                $("#Lab_History").append(rows3);
                initDataTable("#lab-history-table");
            }
            $("#lab-history-table").DataTable({
                destroy: true,
                paging: true,
                pageLength: 5,
                lengthChange: false,
                searching: true,
                ordering: true,
                info: true,
                language: {
                    emptyTable: "No lab records found",
                },
            });
            $("#Xray_History").empty();
            if ($.fn.DataTable.isDataTable("#xray-history-table")) {
                $("#xray-history-table").DataTable().clear().destroy();
            }
            if (data.xray?.xrayOrders?.length > 0) {
                let rows4 = "";
                data.xray.xrayOrders.forEach((element) => {
                    const row4 = `
                        <tr class="text-center">
                            <td>${element.serviceOrderMasterId ?? "-"}</td>
                            <td>${element.clientId ?? "-"}</td>
                            <td>${element.clientName ?? "-"}</td>
                            <td>${element.mobile ?? "-"}</td>
                            <td>${element.totelcost ?? "-"}</td>
                            <td>${element.status ?? "-"}</td>
                            <td>${element.appointment ?? "-"}</td>
                            <td>${element.providerName ?? "-"}</td>
                            <td>${element.serviceNames ?? "-"}</td>
                            <td>
                              <div class="d-flex justify-content-center">
                                <button type="button" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill xray-view" 
                                data-id="${element.serviceOrderMasterId}"><i class="ti ti-eye ti-md"></i></button>
                              </div>
                            </td>
                        </tr>`;
                    rows4 += row4;
                });
                $(document)
                    .off("click", ".xray-view")
                    .on("click", ".xray-view", function () {
                        var serviceOrderMasterId = $(this).data("id");
                        window.open(
                            `/xray/view/${serviceOrderMasterId}`,
                            "_blank",
                        );
                    });
                $("#Xray_History").append(rows4);
                initDataTable("#xray-history-table");
            }
            $("#xray-history-table").DataTable({
                destroy: true,
                paging: true,
                pageLength: 5,
                lengthChange: false,
                searching: true,
                ordering: true,
                info: true,
                language: {
                    emptyTable: "No xray records found",
                },
            });
            $("#discharge_History").empty();
            if ($.fn.DataTable.isDataTable("#discharge-history-table")) {
                $("#discharge-history-table").DataTable().clear().destroy();
            }
            if (data.discharge?.dischargeOrders?.length > 0) {
                let rows5 = "";
                data.discharge.dischargeOrders.forEach((element) => {
                    const row5 = `
                        <tr>
                            <td>${element.patientAdmissionId}</td>
                            <td>${element.clientId}</td>
                            <td>${element.doctorEmployeeId}</td>
                            <td>${element.consultationDoctorEmployeeId}</td>
                            <td>${element.clientName}</td>
                            <td>${element.mobile}</td>
                            <td>${element.IDNational}</td>
                            <td>${element.lengthOfStay}</td>
                            <td>${element.status}</td>
                            <td>${element.admission_dateTime}</td>
                             <td>
                              <div class="d-flex">
                        <button type="button" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill discharge-view"  data-id="${element.patientAdmissionId}"><i class="ti ti-eye ti-md"></i></button>
                    </div>
                            </td>
                        </tr>`;
                    rows5 += row5;
                });
                $(document).on("click", ".discharge-view", function () {
                    var patientAdmissionId = $(this).data("id");
                    window.location.href = `/discharge-view-emr/${patientAdmissionId}`;
                });
                $("#discharge_History").append(rows5);
                initDataTable("#discharge-history-table");
            }
            $("#discharge-history-table").DataTable({
                destroy: true,
                paging: true,
                pageLength: 5,
                lengthChange: false,
                searching: true,
                ordering: true,
                info: true,
                language: {
                    emptyTable: "No discharge records found",
                },
            });
            $("#Consent_History").empty();
            if ($.fn.DataTable.isDataTable("#consent-history-table")) {
                $("#consent-history-table").DataTable().clear().destroy();
            }
            if (data.consent?.consentOrders?.length > 0) {
                let rows6 = "";
                data.consent.consentOrders.forEach((element) => {
                    const row6 = `
                        <tr>
                            <td>${element.mediafilesId}</td>
                            <td>${element.clientId}</td>
                            <td>${element.consentName}</td>
                            <td>${element.clientName}</td>
                             <td>
                              <div class="d-flex">
                        <button type="button" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill consent-view"  data-id="${element.mediafilesId}"><i class="ti ti-eye ti-md"></i></button>
                    </div>
                            </td>

                        </tr>`;
                    rows6 += row6;
                });
                $(document).on("click", ".consent-view", function () {
                    var mediafilesId = $(this).data("id");
                    $.ajax({
                        url: "/consent-view/" + mediafilesId,
                        method: "POST",
                        headers: {
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                                "content",
                            ),
                        },
                        success: function (response) {
                            if (response.fileUrl) {
                                window.open(response.fileUrl, "_blank");
                            }
                        },
                        error: function (xhr, status, error) {
                            Swal.fire({
                                title: "Error!",
                                text:
                                    xhr.responseJSON?.error ||
                                    "An error occurred.",
                                icon: "error",
                                confirmButtonText: "OK",
                                customClass: {
                                    confirmButton:
                                        "btn btn-primary waves-effect waves-light",
                                },
                            });
                        },
                    });
                });
                $("#Consent_History").append(rows6);
                initDataTable("#consent-history-table");
            }
            $("#consent-history-table").DataTable({
                destroy: true,
                paging: true,
                pageLength: 5,
                lengthChange: false,
                searching: true,
                ordering: true,
                info: true,
                language: {
                    emptyTable: "No consent records found",
                },
            });
            $("#Prescription_History").empty();
            if ($.fn.DataTable.isDataTable("#prescription-history-table")) {
                $("#prescription-history-table").DataTable().clear().destroy();
            }
            if (data.prescription?.prescriptionOrders?.length > 0) {
                let rowsPrescription = "";
                data.prescription.prescriptionOrders.forEach(
                    (element, index) => {
                        const rowPrescription = `
                        <tr style="text-align: center;">
                            <td>${index + 1}</td>
                            <td>${element.clientId ?? "-"}</td>
                            <td>${element.medicineName ?? "-"}</td>
                            <td>${element.dosage ?? "-"}</td>
                            <td>${element.frequency ?? "-"}</td>
                            <td>${element.routeAdmin ?? "-"}</td>
                            <td>${element.startDate ?? "-"}</td>
                            <td>${element.discontinueDate ?? "-"}</td>
                            <td>${element.doseUnit ?? "-"}</td>
                            <td>
                                <div class="d-flex">
                        <button type="button" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill prescription-print"  data-id="${element.reservationId}"><i class="ti ti-printer ti-md"></i></button>
                    </div>
                            </td>
                        </tr>`;
                        rowsPrescription += rowPrescription;
                    },
                );
                $(document).on("click", ".prescription-print", function () {
                    var reservationId = $(this).data("id");
                    if (reservationId) {
                        window.open(
                            BASE_URL + "/print-prescription/" + reservationId,
                            "_blank",
                        );
                    } else {
                        Swal.fire({
                            icon: "warning",
                            text: "Reservation ID is missing!",
                        });
                    }
                });
                $("#Prescription_History").append(rowsPrescription);
                initDataTable("#prescription-history-table");
            }
            $("#prescription-history-table").DataTable({
                destroy: true,
                paging: true,
                pageLength: 5,
                lengthChange: false,
                searching: true,
                ordering: true,
                info: true,
                language: {
                    emptyTable: "No prescription records found",
                },
            });
            if (data && data.client) {
                $("#status").text(data.client.status);
                $("#gender").text(data.client.gender);
                var genderVal = (data.client.gender || "")
                    .toString()
                    .toLowerCase()
                    .trim();
                var avatarSrc = ["female", "f"].includes(genderVal)
                    ? BASE_URL + "/img/femaleavatar.jpeg"
                    : BASE_URL + "/assets/img/avatars/16.jpg";
                $("#client-avatar").attr("src", avatarSrc);
                $("#mobile").text(data.client.mobile);
                $("#clientid").text(data.client.clientId);
                $("#birthDate").text(data.client.birthDate);
                $("#nationalityId").text(data.client.nationalityId);
                $("#idNational").text(data.client.idNational);
                $("#nationalityName_en").text(data.client.nationalityName_en);

                var fullName = buildFullName(
                    data.client.clientName_en,
                    data.client.secondName_en,
                    data.client.thirdName_en,
                    data.client.fourthName_en,
                );
                var fullName_ar = buildFullName(
                    data.client.clientName,
                    data.client.secondName_ar,
                    data.client.thirdName_ar,
                    data.client.fourthName_ar,
                );
                $("#client-name-en").text(fullName);
                $("#client-name-ar").text(fullName_ar);
                $("#totalbill").text(data.serviceOrders.totalbill);
                $("#in_patient_count").text(
                    data.serviceOrders.in_patient_count,
                );
                $("#out_patient_count").text(
                    data.serviceOrders.out_patient_count,
                );
                $("#xraycount").text(data.serviceOrders.xraycount);
                $("#labcount").text(data.serviceOrders.labcount);
                $("#total_reservations").text(
                    data.reservations.total_reservations,
                );
                $("#absent_count").text(data.reservations.absent_count);
                $("#cancelled_count").text(data.reservations.cancelled_count);
                $("#completed_count").text(data.reservations.completed_count);
                $("#discharge_count").text(data.discharge.discharge_count);
                console.log(
                    "Outpatient Service Order Lists: ",
                    data.serviceOrders.allOutPatientServiceOrderLists,
                );
                console.log(
                    "Inpatient Service Order Lists: ",
                    data.serviceOrders.allInPatientServiceOrderLists,
                );
            }
        },
        error: function (err) {
            console.error("Error fetching client details: ", err);
        },
    });
    $("#op-history-table tbody tr").each(function (i) {
        console.log($(this).html());
    });
}

function resetSelect2Fields(excludedFieldId) {
    const fields = [
        "#patient-details",
        "#patient-id",
        "#patient-idnational",
        "#patient-mobile",
    ];
    fields.forEach(function (field) {
        if (field !== `#${excludedFieldId}`) {
            $(field).val(null).trigger("change");
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const links = {
        op_history: document.getElementById("op_history"),
        ip_history: document.getElementById("ip_history"),
        bill_history: document.getElementById("bill_history"),
        lab_history: document.getElementById("lab_history"),
        xray_history: document.getElementById("xray_history"),
        discharge_history: document.getElementById("discharge_history"),
        prescription_history: document.getElementById("prescription_history"),
        consent: document.getElementById("consent"),
    };
    const tables = {
        op_history: document.querySelector(".card.OP.History"),
        ip_history: document.querySelector(".card.IP.History"),
        bill_history: document.querySelector(".card.Bill.History"),
        lab_history: document.querySelector(".card.Lab.History"),
        xray_history: document.querySelector(".card.X-Ray.History"),
        discharge_history: document.querySelector(".card.Discharge.History"),
        prescription_history: document.querySelector(
            ".card.Prescription.History",
        ),
        consent: document.querySelector(".card.Consent"),
    };
    function hideAllTables() {
        for (let key in tables) {
            tables[key].style.display = "none";
        }
    }
    function removeActiveClass() {
        for (let key in links) {
            links[key].classList.remove("active");
        }
    }
    for (let key in links) {
        links[key].addEventListener("click", function () {
            hideAllTables();
            removeActiveClass();
            links[key].classList.add("active");
            tables[key].style.display = "block";
        });
    }
    hideAllTables();
    tables.op_history.style.display = "block";
    links.op_history.classList.add("active");
});

$(document).ready(initializeSelect2);
$(document).on("turbo:load", initializeSelect2);