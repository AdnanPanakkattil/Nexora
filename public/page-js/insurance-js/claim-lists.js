$(document).ready(function () {
    $("#claim_main_menu").addClass("active open menu-item-animating");
    $("#claims_direct_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var rangePickr = $(".flatpickr-range");
    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");

    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "m/d/Y",
            onClose: function (selectedDates, dateStr, instance) {
                if (selectedDates[0] != undefined) {
                    startDateEle.val(
                        moment(selectedDates[0]).format("MM/DD/YYYY")
                    );
                }
                if (selectedDates[1] != undefined) {
                    endDateEle.val(
                        moment(selectedDates[1]).format("MM/DD/YYYY")
                    );
                }
                rangePickr.trigger("change").trigger("keyup");
                // appointmentReportTable.ajax.reload();
            },
        });
    }

    let claimRequestTable = $(
        "#claim_requests_table"
    ).DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/claim-lists",
            // type: "POST",
            data: function (d) {
                d.payerId = $("#insurancePayer").val(); // Corrected ID
                d.startDate = $(".start_date").val();
                d.endDate = $(".end_date").val();
                d.identifierType = $("#IdentifierType").val();
                d.identifierNumber = $("#identifierNumber").val(); // Corrected ID
                d.mobile = $("#mobile").val();
                d.birthDate = $("#birthDate").val(); // Corrected ID
                d.status = $("#status").val();
            },
        },
        order: [[2, "desc"]],
        columns: [
            {
                data: "claimRequestId",
                name: "claimRequestId",
                visible: true,
            },
            { data: "claimType", name: "claimType" },
            { data: "payerCode", name: "payerCode" },
            { data: "providerName", name: "providerName" },
            { data: "patientName", name: "patientName" },
            { data: "clientId", name: "clientId" },
            { data: "status", name: "status" },
            { data: "created_at", name: "created_at" },
            // { data: "actions", name: "actions", orderable: false, searchable: false },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    // var reSubmissionUrl =
                    //     BASE_URL +
                    //     "/re-submission-pre-authorization-request/" +
                    //     full.preAuthorizationRequestId;
                    var communicationUrl =
                        BASE_URL +
                        "/communication-claim/" +
                        full.claimRequestId;
                    var viewUrl =
                        BASE_URL +
                        "/view-claim-request/" +
                        full.claimRequestId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        "<li>" +
                        '<a href="' +
                        viewUrl +
                        '"class="dropdown-item text-primary" data-id="' +
                        full.claimRequestId +
                        '">View</a>' +
                        // '<div class="dropdown-divider"></div>' +
                        // '<li><a href="' +
                        // reSubmissionUrl +
                        // '" class="dropdown-item" data-id="' +
                        // reSubmissionUrl +
                        // '">Re-Submission</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        "<li>" +
                        '<a href="' +
                        communicationUrl +
                        '"class="dropdown-item text-info" data-id="' +
                        full.claimRequestId +
                        '">Communication</a>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    $("#claim_search_btn").click(function () {
        claimRequestTable.ajax.reload();
    });
});
