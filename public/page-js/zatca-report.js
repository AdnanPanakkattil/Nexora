$(document).ready(function () {
    $("#zatca_main_menu").addClass("active open menu-item-animating");
    $("#zatca_report_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });



    var xrayTable = $("#xray_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/zatca/report",
            data: function (d) {
                d.filter_type = $('#selectType').val(); // <-- send dropdown value
                d.serviceOrderMasterId = $('#filterServiceOrderMasterId').val();
                d.masterIdNumber = $('#filterMasterIdNumber').val();
                d.clientName_en = $('#filterClientName').val();
                d.provider = $('#filterProvider').val();
                d.client_number = $('#filterClientNumber').val();
                d.idnational = $('#filterIdNational').val();
                d.status = $('#filterStatus').val();
                d.billtype = $('#filterBillType').val();
                d.totalDisAmount = $('#filterTotalDisAmount').val();
                d.totalTaxAmount = $('#filterTotalTaxAmount').val();
                d.totalAmount = $('#filterTotalAmount').val();
                d.billIssuedDate = $('#filterBillIssuedDate').val();
            }
        },
        columns: [
            { data: "zatcaOrderId", name: "zatcaOrderId" },
            { data: "invoice", name: "invoice" },
            { data: "type", name: "type" }, // <-- add this for Type
            { data: "name", name: "name" },
            { data: "provider", name: "provider" },
            { data: "mobile", name: "mobile" },
            { data: "idnational", name: "idnational" },
            { data: "status", name: "status" },
            { data: "billtype", name: "billtype" },
            { data: "totalDisAmount", name: "totalDisAmount" },
            { data: "totalTaxAmount", name: "totalTaxAmount" },
            { data: "totalAmount", name: "totalAmount" },
            { data: "billIssuedDate", name: "billIssuedDate" },
        ]
    });

    $('#selectType, #filterServiceOrderMasterId, #filterMasterIdNumber, #filterClientName, #filterProvider, #filterClientNumber, #filterIdNational, #filterStatus, #filterBillType, #filterTotalDisAmount, #filterTotalTaxAmount, #filterTotalAmount, #filterBillIssuedDate').on('keyup change', function () {
        xrayTable.draw();
    });



});



