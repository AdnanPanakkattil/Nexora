$(document).ready(function () {
    $("#insurance_main_menu").addClass("active open menu-item-animating");
    $("#eligibility_check_history_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#eligibility_check_history").show();

    const selectElements = [
        { id: "#Payer", placeholder: "Select Payer" },
        { id: "#IdentifierType", placeholder: "Select Identifier Type" },
        { id: "#status", placeholder: "Select Status" },
    ];

    selectElements.forEach(function (item) {
        const selectElement = $(item.id);
        if (selectElement.length) {
            selectElement
                .wrap('<div class="position-relative"></div>')
                .select2({
                    placeholder: item.placeholder,
                    dropdownParent: selectElement.parent(),
                });
        }
    });

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
                if (startDate && endDate) {
                    var startMoment = moment(startDate);
                    var endMoment = moment(endDate);
                    var daysDifference = endMoment.diff(startMoment, "days");
                    if (daysDifference > 100) {
                        dateErrorEle.text(
                            "Date range shouldn’t exceed 100 days",
                        );
                    } else {
                        dateErrorEle.text("");
                    }
                }
            },
        });
    }
    let table = $("#eligibility_check_history_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/get-eligibility-check-history",
            type: "POST",
            data: function (d) {
                d.payerId = $("#Payer").val();
                d.startDate = $(".start_date").val();
                d.endDate = $(".end_date").val();
                d.identifierType = $("#IdentifierType").val();
                d.identifierNumber = $("#IdentifierId").val();
                d.mobile = $("#mobile").val();
                d.birthDate = $("#birth_date").val();
                d.status = $("#status").val();
            },
        },
        order: [[0, "desc"]],
        columns: [
            {
                data: "nphiesTransactionMasterId",
                name: "nphiesTransactionMasterId",
                visible: true,
            },
            { data: "mrn", name: "mrn" },
            { data: "payer_name", name: "payer_name" },

            { data: "patient_full_name", name: "patient_full_name" },
            { data: "status", name: "status" },
            { data: "relationshipType", name: "relationshipType" },
            { data: "eligibilityType", name: "eligibilityType" },
            { data: "created_at", name: "created_at" },
            {
                data: "actions",
                name: "actions",
                orderable: false,
                searchable: false,
            },
        ],
    });

    $("#eligibilty_check_history_search").click(function (e) {
        e.preventDefault();
        table.ajax.reload();
    });
});
