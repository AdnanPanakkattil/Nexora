$(document).ready(function () {
    $("#dashboard_main_menu").addClass("active open menu-item-animating");
    $("#laboratory_dashboard_sub_menu").addClass("active");

    const table = $("#laboratory").DataTable({
        processing: true,
        serverSide: false,
        ajax: {
            url: "/laboratory-report",
            type: "GET",
            dataSrc: "data",
        },
        columns: [
            { data: "id", className: "text-center", title: "Sl No" },
            { data: "masterIdNumber", className: "text-center", title: "Invoice" },
            { data: "patientName", className: "text-center", title: "Name" },
            { data: "provider", className: "text-center", title: "Provider" },
            { data: "mobile", className: "text-center", title: "Mobile" },
            {
                data: "idnational",
                className: "text-center",
                title: "ID National",
            },
            {
                data: "status",
                className: "text-center",
                render: function (data, type, full, meta) {
                    let className;
                    switch (data) {
                        case "pending":
                        case "refund":
                            className = "bg-label-warning";
                            break;
                        case "completed":
                        case "paid":
                            className = "bg-label-success";
                            break;
                        case "cancelled":
                            className = "bg-label-danger";
                            break;
                        case "confirm":
                            className = "bg-label-info";
                            break;
                        case "insurance_approval_request":
                            className = "bg-label-primary";
                            break;
                        default:
                            className = "bg-label-secondary";
                    }
                    return `<span class="badge ${className}">${data}</span>`;
                },
            },
            { data: "billtype", className: "text-center", title: "Bill Type" },
            {
                data: "totalDisAmount",
                className: "text-center",
                title: "DIC AMT",
            },
            { data: "totalTaxAmount", className: "text-center", title: "VAT" },
            { data: "totalAmount", className: "text-center", title: "Cost" },
            { data: "billIssuedDate", className: "text-center", title: "Date" },
            {
                data: null,
                title: "Actions",
                render: function (data, type, full) {
                    var detailsUrl = "/view-invoice/" + full.id;
                    return `
                        <div class="d-flex justify-content-center" >
                        <a href="${detailsUrl}" class="btn btn-icon btn-text-secondary"><i class="ti ti-eye"></i></a>
                        </div>
                    `;
                },
            },
        ],
    });
});