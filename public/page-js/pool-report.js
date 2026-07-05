$(document).ready(function () {
    $("#zatca_main_menu").addClass("active open menu-item-animating");
    $("#pool_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var table = $("#xray_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/report",
            data: function (d) {
                d.status = $("#report_status").val();
            }
        },
        columns: [
            { data: "serviceOrderMasterId", name: "serviceOrderMasterId" },
            { data: "masterIdNumber", name: "masterIdNumber" },
            { data: "clientName_en", name: "clientName_en" },
            { data: "provider", name: "provider" },
            { data: "client_number", name: "client_number" },
            { data: "idnational", name: "idnational" },
            { data: "zatcaStatus", name: "zatcaStatus" },
            { data: "billtype", name: "billtype" },
            { data: "totalDisAmount", name: "totalDisAmount" },
            { data: "totalTaxAmount", name: "totalTaxAmount" },
            { data: "totalAmount", name: "totalAmount" },
            { data: "billIssuedDate", name: "billIssuedDate" },
            { data: "actions", name: "actions", orderable: false, searchable: false }
        ]
    });

    $(".report_status_card").on("click", function (e) {
        e.preventDefault();
        let status = $(this).find("h6").text().toLowerCase();
        $("#report_status").val(status);
        table.ajax.reload();
    });

});



