$(document).ready(function () {
    $("#dashboard_main_menu").addClass("active open menu-item-animating");
    $("#doctor_dashboard_sub_menu").addClass("active");

    $("#cash-card").hide();
    $("#insurance-card").hide();

    $("#doctor-btn").on("click", function () {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        $("#reservation-card").show();
        $("#cash-card").hide();
        $("#insurance-card").hide();
    });

    $("#cash-btn").on("click", function () {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        $("#cash-card").show();
        $("#reservation-card").hide();
        $("#insurance-card").hide();
    });

    $("#insurance-btn").on("click", function () {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        $("#insurance-card").show();
        $("#cash-card").hide();
        $("#reservation-card").hide();
    });

    var rangePickr = $(".flatpickr-range"),
        dateFormat = "MM/DD/YYYY";

    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");

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
                reservationTable.ajax.reload();
            },
        });
    }

    const table = $("#reservation").DataTable({
        processing: true,
        serverSide: false,
        ajax: {
            url: "/doctor-report",
            type: "GET",
            dataSrc: "data",
        },
        columns: [
            { data: "id", className: "text-center" },
            {
                data: "fileNo",
                orderable: false,
                searchable: true,
                render: function (data, type, full, meta) {
                    var detailsUrl =
                        BASE_URL +
                        "/medicalrecord-details/" +
                        full.id +
                        "/" +
                        full.fileNo;
                    return (
                        '<a href="' +
                        detailsUrl +
                        '" class="btn btn-outline-primary waves-effect " style="width:100%;" ><i class="ti ti-report-medical"></i>' +
                        full.fileNo +
                        "</a>"
                    );
                },
            },
            { data: "patientName", className: "text-center" },
            { data: "mobile", className: "text-center" },
            { data: "serviceName", className: "text-center" },
            { data: "appointmentDate", className: "text-center" },
            { data: "provider", className: "text-center" },
            { data: "totalCost", className: "text-center" },
            { data: "paid", className: "text-center" },
            {
                data: "status",
                name: "status",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var className;
                    switch (full.status) {
                        case "pending":
                        case "processing":
                            className = "bg-label-warning";
                            break;
                        case "approved":
                        case "completed":
                            className = "bg-label-success";
                            break;
                        case "refunded":
                        case "transfer":
                            className = "bg-label-info";
                            break;
                        case "cancelled":
                        case "rejected":
                        case "insurance_rejected":
                            className = "bg-label-danger";
                            break;
                        case "absent":
                            className = "bg-label-secondary";
                            break;
                        case "checkedin":
                        case "insurance_approval_request":
                            className = "bg-label-primary";
                            break;
                        default:
                            className = "";
                    }
                    return (
                        '<span class="badge ' +
                        className +
                        '">' +
                        full.status +
                        "</span>"
                    );
                },
                title: "Status",
            },
            { data: "remainingSession", className: "text-center" },
        ],
    });

    $("#cash-card table").DataTable({
        processing: true,
        serverSide: false,
        ajax: {
            url: "/cash-report",
            type: "GET",
            dataSrc: "data",
        },
        columns: [
            { data: "id", className: "text-center" },
            { data: "fileNo", className: "text-center" },
            { data: "patientName", className: "text-center" },
            { data: "mobile", className: "text-center" },
            { data: "serviceName", className: "text-center" },
            { data: "appointmentDate", className: "text-center" },
            { data: "provider", className: "text-center" },
            { data: "totalCost", className: "text-center" },
            { data: "paid", className: "text-center" },
            {
                data: "status",
                name: "status",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    let className;
                    switch (full.status) {
                        case "pending":
                        case "processing":
                            className = "bg-label-warning";
                            break;
                        case "approved":
                        case "completed":
                            className = "bg-label-success";
                            break;
                        case "refunded":
                        case "transfer":
                            className = "bg-label-info";
                            break;
                        case "cancelled":
                        case "rejected":
                        case "insurance_rejected":
                            className = "bg-label-danger";
                            break;
                        case "absent":
                            className = "bg-label-secondary";
                            break;
                        case "checkedin":
                        case "insurance_approval_request":
                            className = "bg-label-primary";
                            break;
                        default:
                            className = "";
                    }
                    return (
                        '<span class="badge ' +
                        className +
                        '">' +
                        full.status +
                        "</span>"
                    );
                },
                title: "Status",
            },
            { data: "remainingSession", className: "text-center" },
        ],
    });

    $("#insurance-card table").DataTable({
        processing: true,
        serverSide: false,
        ajax: {
            url: "/insurance-report",
            type: "GET",
            dataSrc: "data",
        },
        columns: [
            { data: "id", className: "text-center" },
            { data: "fileNo", className: "text-center" },
            { data: "patientName", className: "text-center" },
            { data: "mobile", className: "text-center" },
            { data: "serviceName", className: "text-center" },
            { data: "appointmentDate", className: "text-center" },
            { data: "provider", className: "text-center" },
            { data: "totalCost", className: "text-center" },
            { data: "paid", className: "text-center" },
            {
                data: "status",
                name: "status",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    let className;
                    switch (full.status) {
                        case "pending":
                        case "processing":
                            className = "bg-label-warning";
                            break;
                        case "approved":
                        case "completed":
                            className = "bg-label-success";
                            break;
                        case "refunded":
                        case "transfer":
                            className = "bg-label-info";
                            break;
                        case "cancelled":
                        case "rejected":
                        case "insurance_rejected":
                            className = "bg-label-danger";
                            break;
                        case "absent":
                            className = "bg-label-secondary";
                            break;
                        case "checkedin":
                        case "insurance_approval_request":
                            className = "bg-label-primary";
                            break;
                        default:
                            className = "";
                    }
                    return (
                        '<span class="badge ' +
                        className +
                        '">' +
                        full.status +
                        "</span>"
                    );
                },
                title: "Status",
            },
            { data: "remainingSession", className: "text-center" },
        ],
    });
});
