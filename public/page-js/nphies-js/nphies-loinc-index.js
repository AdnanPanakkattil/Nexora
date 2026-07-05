$(document).ready(function () {
    $("#nphies_main_menu").addClass("active open menu-item-animating");
    $("#nphies_loinc_sub_menu").addClass("active");
    
    $("#loinc").addClass("active");

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

    var loincsListTable = $("#loinc_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/nphies-loinc",
            type: "GET",
        },
        columns: [
            { data: "loincId", name: "loincId" },

            { data: "LOINC_NUM", name: "LOINC_NUM" },

            { data: "COMPONENT", name: "COMPONENT" },
            { data: "PROPERTY", name: "PROPERTY" },
            { data: "TIME_ASPCT", name: "TIME_ASPCT" },
            { data: "SYSTEM", name: "SYSTEM" },
            { data: "SCALE_TYP", name: "SCALE_TYP" },
            { data: "METHOD_TYP", name: "METHOD_TYP" },
            { data: "CLASS", name: "CLASS" },
        ],
        order: [[0, "desc"]],
    });
});






