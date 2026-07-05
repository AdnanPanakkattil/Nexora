$(document).ready(function () {
    $("#nphies_main_menu").addClass("active open menu-item-animating");
    $("#nphies_snomed_sub_menu").addClass("active");

    $("#snomed").addClass("active");

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
            document.getElementById("offcanvasExportExcel"),
        );
        offcanvas.show();
    });

    var snomedListTable = $("#snomed_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/nphies-snomed",
            type: "GET",
        },
        columns: [
            { data: "snomedId", name: "snomedId" },
            { data: "referencedComponentId", name: "referencedComponentId" },
            { data: "name", name: "name" },
        ],
        order: [[0, "desc"]],
    });
});
