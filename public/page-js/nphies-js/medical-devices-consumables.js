$(document).ready(function () {
    $("#nphies_main_menu").addClass("active open menu-item-animating");
    $("#medical_devices_consumables_sub_menu").addClass("active");
    
    $("#medicalDevicesConsumables").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $(".redirect-button").on("click", function () {
        const url = $(this).data("url");
        if (url) {
            window.location.href = url;
        }
    });

    $("#excelImport").on("click", function () {
        var offcanvas = new bootstrap.Offcanvas(
            document.getElementById("offcanvasExportExcel")
        );
        offcanvas.show();
    });

    var medicalDeviceConsumablesListTable = $("#medical_device_consumables_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/nphies-medical-devices-consumables",
            type: "GET",
        },
        columns: [
            { data: "medicalDevicesConsumablesId", name: "medicalDevicesConsumablesId" },
            { data: "GMDN_termCode", name: "GMDN_termCode" },
            { data: "termName", name: "termName" },
            { data: "termDefinition", name: "termDefinition" },
            { data: "termStatus", name: "termStatus" },
            { data: "codeStatus", name: "codeStatus" },
        ],
        order: [[0, "desc"]],
    });
});






