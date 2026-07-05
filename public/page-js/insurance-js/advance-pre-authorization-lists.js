$(document).ready(function () {
    $("#insurance_main_menu").addClass("active open menu-item-animating");
    $("#advance_pre_authorization_sub_menu").addClass("active");

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
                        moment(selectedDates[0]).format("MM/DD/YYYY"),
                    );
                }
                if (selectedDates[1] != undefined) {
                    endDateEle.val(
                        moment(selectedDates[1]).format("MM/DD/YYYY"),
                    );
                }
                rangePickr.trigger("change").trigger("keyup");
            },
        });
    }

    $("#advancePreAuthorizationBasicSearch").hide();
    $("#advancePreAuthorizationAdvanceSearch").show();
    $("#advancePreAuthorizationSearch").show();
    $("#payerDiv").hide();
    $("#typeDiv").hide();
    $("#selectBeneficiaryDiv").hide();
    $("#preAuthorizationIdDiv").hide();
    $("#statusDiv").hide();
    $("#preAuthorizationRefNo").hide();
    $("#responseBundleId").hide();

    $("#advance_pre_authorization_advance_search_btn").click(function () {
        $("#payerDiv").show();
        $("#typeDiv").show();
        $("#selectBeneficiaryDiv").show();
        $("#preAuthorizationIdDiv").show();
        $("#statusDiv").show();
        $("#preAuthorizationRefNo").show();
        $("#responseBundleId").show();
        $("#advancePreAuthorizationBasicSearch").show();
        $("#advancePreAuthorizationAdvanceSearch").hide();
    });

    $("#advance_pre_authorization_basic_search_btn").click(function () {
        $("#payerDiv").hide();
        $("#typeDiv").hide();
        $("#selectBeneficiaryDiv").hide();
        $("#preAuthorizationIdDiv").hide();
        $("#statusDiv").hide();
        $("#preAuthorizationRefNo").hide();
        $("#responseBundleId").hide();
        $("#advancePreAuthorizationAdvanceSearch").show();
        $("#advancePreAuthorizationBasicSearch").hide();
    });

    let advancePreAuthorizationRequestTable = $(
        "#advance_pre_authorization_requests_table",
    ).DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/advance-pre-authorization-lists",
            type: "GET", // or POST if needed
        },
        order: [[2, "desc"]],
        columns: [
            {
                data: "preAuthorizationRequestId",
                name: "preAuthorizationRequestId",
            },
            {
                data: "nphiesTransactionMasterId",
                name: "nphiesTransactionMasterId",
            },
            { data: "claimType", name: "claimType" },
            { data: "claimIdentifier", name: "claimIdentifier" },
            { data: "patientName", name: "patientName" },
            { data: "patientFileId", name: "patientFileId" },
            // { data: "patientName", name: "patientName" },
            // { data: "idType", name: "idType" },
            // { data: "idNo", name: "idNo" },
            // { data: "mobile", name: "mobile" },
            { data: "payerName", name: "payerName" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var viewUrl =
                        BASE_URL +
                        "/advanced-preauthorization/" +
                        full.nphiesTransactionMasterId +
                        "/" +
                        full.claimIdentifier +
                        "/" +
                        full.patientFileId +
                        "/" +
                        full.preAuthorizationRequestId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="' +
                        viewUrl +
                        '" class="dropdown-item text-primary" data-id="' +
                        full.nphiesTransactionMasterId +
                        '">View</a></li>' +
                        "</ul></div>"
                    );
                },
            },
        ],
    });

    $("#advancePreAuthorizationSearch").click(function (e) {
        let formId = "#advancePreAuthorizationRequestHistory";
        var formData = new FormData($(formId)[0]);
        console.log(formData);
        $.ajax({
            url: BASE_URL + "/advance-pre-authorization",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                advancePreAuthorizationRequestTable.ajax.reload(null, false);
                $("#advancePreAuthorizationRequestHistory")[0].reset();
                // Reset Select2 fields
                $("#clinicId").val(null).trigger("change");
                $("#insurancePayer").val(null).trigger("change");
                $("#type").val(null).trigger("change");
                $("#status").val(null).trigger("change");

                // Clear flatpickr date range properly
                if ($("#dateRange")[0]._flatpickr) {
                    $("#dateRange")[0]._flatpickr.clear();
                }

                // Clear hidden date inputs
                $("#startDate").val("");
                $("#endDate").val("");
            },
        });
    });
});
