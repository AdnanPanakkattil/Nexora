$(document).ready(function () {
    $("#claim_main_menu").addClass("active open menu-item-animating");
    $("#claims_submitted_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    let insurancePayerId = $("#insurancePayerId").val();
    let claimRequestId = $("#claimRequestId").val();
    let identifierType = $("#hiddenIdentifierType").val();
    let identifierId = $("#hiddenIdentifierId").val();
    let patientName = $("#hiddenPatientName").val();
    if (insurancePayerId)
        $("#insurancePayer").val(insurancePayerId).trigger("change");
    if (claimRequestId) $("#claimRequestId").val(claimRequestId);
    if (identifierType)
        $("#identifierType").val(identifierType).trigger("change");
    if (identifierId) $("#identifierId").val(identifierId);
    if (patientName) $("#patientName").val(patientName);

    var rangePickr = $(".flatpickr-range"),
        dateFormat = "MM/DD/YYYY";

    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");
    var dateErrorEle = $(".date_error");

    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "m/d/Y",
            onClose: function (selectedDates) {
                var startDate = selectedDates[0]
                    ? moment(selectedDates[0]).format("YYYY-MM-DD")
                    : null;
                var endDate = selectedDates[1]
                    ? moment(selectedDates[1]).format("YYYY-MM-DD")
                    : null;

                $(".start_date").val(startDate);
                $(".end_date").val(endDate);
                dateErrorEle.text("");

                if (endDate) {
                    var endMoment = moment(endDate);
                    var todayMoment = moment().startOf("day");

                    // ❌ End date cannot be after current date
                    if (endMoment.isAfter(todayMoment)) {
                        dateErrorEle.text(
                            "Payment Reconciliation end date cannot be after created date."
                        );
                        $(".end_date").val(""); // clear invalid end date
                        return;
                    }
                }

                // Optional: keep your 100-day validation
                if (startDate && endDate) {
                    var startMoment = moment(startDate);
                    var daysDifference = endMoment.diff(startMoment, "days");

                    if (daysDifference > 100) {
                        dateErrorEle.text(
                            "Date range shouldn’t exceed 100 days"
                        );
                        return;
                    }
                }
            },
        });
    }
    let paymentsManagementTable;
    $("#paymentSearch").click(function () {
        let claimRequestId = $("#claimRequestId").val();
        let startDate = $("#startDate").val();
        let endDate = $("#endDate").val();
        let disposition = $("#disposition").val();

        $(".date_error").text("");
        $(".disposition_error").text("");

        if (!claimRequestId || !startDate || !endDate || !disposition) {
            if (!startDate || !endDate) {
                $(".date_error").text("Both start and end dates are required.");
            }
            if (!disposition) {
                $(".disposition_error").text("Disposition is required.");
            }
            return;
        }

        if (!paymentsManagementTable) {
            paymentsManagementTable = $("#payments_management_table").DataTable(
                {
                    processing: true,
                    serverSide: true,
                    ajax: {
                        url: `/payments-send/${claimRequestId}`,
                        type: "GET",
                        data: function (d) {
                            d.payerId = $("#insurancePayerId").val();
                            d.startDate = $(".start_date").val();
                            d.endDate = $(".end_date").val();
                        },
                        dataSrc: function (json) {
                            $("#paymentSumbit").prop(
                                "disabled",
                                !(json.data && json.data.length > 0)
                            );
                            return json.data;
                        },
                    },
                    columns: [
                        { data: "claimRequestId" },
                        { data: "invoiceId" },
                        { data: "created" },
                        { data: "serviceName" },
                        { data: "status" },
                        { data: "qty" },
                        { data: "cmpyCost" },
                        { data: "cmpyDis" },
                        { data: "netCmpyCost" },
                        { data: "patientShare" },
                        { data: "companyShare" },
                    ],
                    order: [[2, "desc"]],
                }
            );
        } else {
            paymentsManagementTable.ajax
                .url(`/payments-send/${claimRequestId}`)
                .load();
        }
    });
    $("#disposition").on("input", function () {
        if ($(this).val().trim() !== "") {
            $(".disposition_error").text("");
        }
    });
    $(".start_date, .end_date").on("change", function () {
        if ($("#startDate").val() && $("#endDate").val()) {
            $(".date_error").text("");
        }
    });

    $("#paymentSumbit").click(function () {
        $.ajax({
            type: "POST",
            url: "/payments-send-nphies",
            data: {
                insurancePayerId: $("#insurancePayerId").val(),
                claimRequestId: $("#claimRequestId").val(),
                startDate: $(".start_date").val(),
                endDate: $(".end_date").val(),
                paymentMethod: $(".paymentMethod").val(),
                disposition: $("#disposition").val(),
            },
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {},
        });
    });
});
