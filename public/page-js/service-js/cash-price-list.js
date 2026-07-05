$(document).ready(function () {
    $("#service_main_menu").addClass("active open menu-item-animating");
    $("#cash_price_list_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var cashPriceListTable = $("#cash_price_list_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: cashPriceListUrl,
            type: "GET",
        },
        columns: [
            { data: "serviceId", name: "serviceId" },
            { data: "serviceCode", name: "serviceCode" },
            { data: "medicalCode", name: "medicalCode" },
            { data: "serviceName_en", name: "serviceName_en" },
            { data: "serviceName_ar", name: "serviceName_ar" },
            { data: "cost", name: "cost" },
        ],
    });
});

