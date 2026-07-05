$(document).ready(function () {
    $("#nphies_main_menu").addClass("active open menu-item-animating");
    $("#nphies_medications_sub_menu").addClass("active");
    
    $("#medications").addClass("active");
    $("#disease_table")
        .closest(".tab-pane, .card, .card-datatable")
        .addClass("d-none");
    // $("#morphology_table")
    //     .closest(".tab-pane, .card, .card-datatable")
    //     .addClass("d-none");
    // $("#daddenda_table")
    //     .closest(".tab-pane, .card, .card-datatable")
    //     .addClass("d-none");
    // $("#maddenda_table")
    //     .closest(".tab-pane, .card, .card-datatable")
    //     .addClass("d-none");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#medications").on("click", function () {
        history.pushState(null, "", BASE_URL + "/nphies-medications");
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        // Hide all related tables or sections (adjust selectors as needed)
        $("#diagnosis_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#morphology_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#daddenda_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#maddenda_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        // Show only the desired table
        $("#disease_table")
            .closest(".tab-pane, .card, .card-datatable")
            .removeClass("d-none");

        if ($.fn.DataTable.isDataTable("#medications_table")) {
            $("#medications_table").DataTable().destroy();
        }
        var medicationsListTable = $("#medications_table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: BASE_URL + "/nphies-medications",
                type: "GET",
            },
            columns: [
                { data: "nphiesMedicationId", name: "nphiesMedicationId" },
                { data: "code", name: "code" },
                { data: "display", name: "display" },
                { data: "type", name: "type" },
                { data: "price", name: "price" },
                { data: "granularUnit", name: "granularUnit" },
                { data: "unitType", name: "unitType" },
                { data: "manufacturer", name: "manufacturer" },
                { data: "dosageForm", name: "dosageForm" },
                { data: "roa", name: "roa" },
            ],
            order: [[0, "desc"]],
        });
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

    var medicationsListTable = $("#medications_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/nphies-medications",
            type: "GET",
        },
        columns: [
            { data: "nphiesMedicationId", name: "nphiesMedicationId" },

            { data: "code", name: "code" },

            { data: "display", name: "display" },
            { data: "type", name: "type" },
            { data: "price", name: "price" },
            { data: "granularUnit", name: "granularUnit" },
            { data: "unitType", name: "unitType" },
            { data: "manufacturer", name: "manufacturer" },
            { data: "dosageForm", name: "dosageForm" },
            { data: "roa", name: "roa" },
        ],
        order: [[0, "desc"]],
    });
});
