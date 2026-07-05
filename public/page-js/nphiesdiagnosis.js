$(document).ready(function () {
    $("#nphies_main_menu").addClass("active open menu-item-animating");
    $("#nphies_diagnosis_sub_menu").addClass("active");
    $("#diagnosis").addClass("active");
    $("#disease_table")
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

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#diagnosis").on("click", function () {
        history.pushState(null, "", BASE_URL + "/nphies-diagnosis");
        // Make clicked tab active
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        // Hide all related tables or sections (adjust selectors as needed)
        $("#disease_table")
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
        $("#diagnosis_table")
            .closest(".tab-pane, .card, .card-datatable")
            .removeClass("d-none");

        if ($.fn.DataTable.isDataTable("#diagnosis_table")) {
            $("#diagnosis_table").DataTable().destroy();
        }
        var diagnosisListTable = $("#diagnosis_table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: BASE_URL + "/nphies-diagnosis",
                type: "GET",
            },
            columns: [
                { data: "diagnosisListId", name: "diagnosisListId" },
                { data: "diagnosisCode", name: "diagnosisCode" },
                { data: "diagnosisName_en", name: "diagnosisName_en" },
                { data: "diagnosisType", name: "diagnosisType" },
                { data: "active", name: "active" },
                { data: "version", name: "version" },
            ],
            order: [[0, "desc"]],
        });
    });

    $("#disease").on("click", function () {
        history.pushState(null, "", BASE_URL + "/nphies-disease");
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

        if ($.fn.DataTable.isDataTable("#disease_table")) {
            $("#disease_table").DataTable().destroy();
        }
        var diseaseListTable = $("#disease_table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: BASE_URL + "/nphies-disease",
                type: "GET",
            },
            columns: [
                { data: "diagnosisListId", name: "diagnosisListId" },
                { data: "diagnosisCode", name: "diagnosisCode" },
                { data: "diagnosisName_en", name: "diagnosisName_en" },
                { data: "diagnosisType", name: "diagnosisType" },
                { data: "active", name: "active" },
                { data: "version", name: "version" },
            ],
            order: [[0, "desc"]],
        });
    });

    $("#morphology").on("click", function () {
        history.pushState(null, "", BASE_URL + "/nphies-morphology");
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        // Hide all related tables or sections (adjust selectors as needed)
        $("#diagnosis_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#disease_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#daddenda_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#maddenda_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        // Show only the desired table
        $("#morphology_table")
            .closest(".tab-pane, .card, .card-datatable")
            .removeClass("d-none");

        if ($.fn.DataTable.isDataTable("#morphology_table")) {
            $("#morphology_table").DataTable().destroy();
        }
        var morphologyListTable = $("#morphology_table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: BASE_URL + "/nphies-morphology",
                type: "GET",
            },
            columns: [
                { data: "diagnosisListId", name: "diagnosisListId" },
                { data: "diagnosisCode", name: "diagnosisCode" },
                { data: "diagnosisName_en", name: "diagnosisName_en" },
                { data: "diagnosisType", name: "diagnosisType" },
                { data: "active", name: "active" },
                { data: "version", name: "version" },
            ],
            order: [[0, "desc"]],
        });
    });

    $("#daddenda").on("click", function () {
        history.pushState(null, "", BASE_URL + "/nphies-daddenda");
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        // Hide all related tables or sections (adjust selectors as needed)
        $("#diagnosis_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#disease_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#morphology_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#maddenda_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        // Show only the desired table
        $("#daddenda_table")
            .closest(".tab-pane, .card, .card-datatable")
            .removeClass("d-none");

        if ($.fn.DataTable.isDataTable("#daddenda_table")) {
            $("#daddenda_table").DataTable().destroy();
        }
        var daddendaListTable = $("#daddenda_table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: BASE_URL + "/nphies-daddenda",
                type: "GET",
            },
            columns: [
                { data: "diagnosisListId", name: "diagnosisListId" },
                { data: "diagnosisCode", name: "diagnosisCode" },
                { data: "diagnosisName_en", name: "diagnosisName_en" },
                { data: "diagnosisType", name: "diagnosisType" },
                { data: "active", name: "active" },
                { data: "version", name: "version" },
            ],
            order: [[0, "desc"]],
        });
    });

    $("#maddenda").on("click", function () {
        history.pushState(null, "", BASE_URL + "/nphies-maddenda");
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        // Hide all related tables or sections (adjust selectors as needed)
        $("#diagnosis_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#disease_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#morphology_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#daddenda_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        // Show only the desired table
        $("#maddenda_table")
            .closest(".tab-pane, .card, .card-datatable")
            .removeClass("d-none");

        if ($.fn.DataTable.isDataTable("#maddenda_table")) {
            $("#maddenda_table").DataTable().destroy();
        }
        var maddendaListTable = $("#maddenda_table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: BASE_URL + "/nphies-maddenda",
                type: "GET",
            },
            columns: [
                { data: "diagnosisListId", name: "diagnosisListId" },
                { data: "diagnosisCode", name: "diagnosisCode" },
                { data: "diagnosisName_en", name: "diagnosisName_en" },
                { data: "diagnosisType", name: "diagnosisType" },
                { data: "active", name: "active" },
                { data: "version", name: "version" },
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

    var diagnosisListTable = $("#diagnosis_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/nphies-diagnosis",
            type: "GET",
        },
        columns: [
            { data: "diagnosisListId", name: "diagnosisListId" },
            { data: "diagnosisCode", name: "diagnosisCode" },
            { data: "diagnosisName_en", name: "diagnosisName_en" },
            { data: "diagnosisType", name: "diagnosisType" },
            { data: "active", name: "active" },
            { data: "version", name: "version" },
        ],
        order: [[0, "desc"]],
    });
});
