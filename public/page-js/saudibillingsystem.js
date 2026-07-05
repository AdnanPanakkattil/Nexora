$(document).ready(function () {
    $("#nphies_main_menu").addClass("active open menu-item-animating");
    $("#sbs_sub_menu").addClass("active");
    $("#saudi_billing_system").addClass("active");
    $("#sbs_chapter_table")
        .closest(".tab-pane, .card, .card-datatable")
        .addClass("d-none");
    $("#sbs_block_table")
        .closest(".tab-pane, .card, .card-datatable")
        .addClass("d-none");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#saudi_billing_system").on("click", function () {
        // Make clicked tab active
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        // Hide all related tables or sections (adjust selectors as needed)
        $("#sbs_chapter_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#sbs_block_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");

        // Show only the desired table
        $("#saudi_billing_system_table")
            .closest(".tab-pane, .card, .card-datatable")
            .removeClass("d-none");

        // Destroy existing DataTable if already initialized
        if ($.fn.DataTable.isDataTable("#saudi_billing_system_table")) {
            $("#saudi_billing_system_table").DataTable().destroy();
        }
        var saudiBillingSystemTable = $("#saudi_billing_system_table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: BASE_URL + "/saudi-billing-system",
                type: "GET",
            },
            columns: [
                { data: "saudiBillingSystemId", name: "saudiBillingSystemId" },
                { data: "sbsCode", name: "sbsCode" },
                { data: "sbsCode_hyphenated", name: "sbsCode_hyphenated" },
                { data: "short_description", name: "short_description" },
                { data: "long_description", name: "long_description" },
                { data: "definition", name: "definition" },
                { data: "includes", name: "includes" },
                { data: "excludes", name: "excludes" },
                { data: "guidelines", name: "guidelines" },
                { data: "sbsChapterId", name: "sbsChapterId" },
                { data: "sbsBlockId", name: "sbsBlockId" },
            ],
        });
    });

    $("#sbs_chapter").on("click", function () {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        // Hide all related tables or sections (adjust selectors as needed)
        $("#saudi_billing_system_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#sbs_block_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");

        // Show only the desired table
        $("#sbs_chapter_table")
            .closest(".tab-pane, .card, .card-datatable")
            .removeClass("d-none");

        // Destroy existing DataTable if already initialized
        if ($.fn.DataTable.isDataTable("#sbs_chapter_table")) {
            $("#sbs_chapter_table").DataTable().destroy();
        }
        var sbsChapterTable = $("#sbs_chapter_table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: BASE_URL + "/sbs-chapter",
                type: "GET",
            },
            columns: [
                { data: "sbsChapterId", name: "sbsChapterId" },
                { data: "chapter_title", name: "chapter_title" },
                { data: "blocks", name: "blocks" },
                { data: "no_of_codes", name: "no_of_codes" },
            ],
        });
    });

    $("#sbs_block").on("click", function () {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        // Hide all related tables or sections (adjust selectors as needed)
        $("#saudi_billing_system_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");
        $("#sbs_chapter_table")
            .closest(".tab-pane, .card, .card-datatable")
            .addClass("d-none");

        // Show only the desired table
        $("#sbs_block_table")
            .closest(".tab-pane, .card, .card-datatable")
            .removeClass("d-none");

        // Destroy existing DataTable if already initialized
        if ($.fn.DataTable.isDataTable("#sbs_block_table")) {
            $("#sbs_block_table").DataTable().destroy();
        }
        var sbsBlockTable = $("#sbs_block_table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: BASE_URL + "/sbs-block",
                type: "GET",
            },
            columns: [
                { data: "sbsBlockId", name: "sbsBlockId" },
                { data: "block_name", name: "block_name" },
                { data: "no_of_codes", name: "no_of_codes" },
            ],
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

    var saudiBillingSystemTable = $("#saudi_billing_system_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/saudi-billing-system",
            type: "GET",
        },
        columns: [
            { data: "saudiBillingSystemId", name: "saudiBillingSystemId" },
            { data: "sbsCode", name: "sbsCode" },
            { data: "sbsCode_hyphenated", name: "sbsCode_hyphenated" },
            { data: "short_description", name: "short_description" },
            { data: "long_description", name: "long_description" },
            { data: "definition", name: "definition" },
            { data: "includes", name: "includes" },
            { data: "excludes", name: "excludes" },
            { data: "guidelines", name: "guidelines" },
            { data: "sbsChapterId", name: "sbsChapterId" },
            { data: "sbsBlockId", name: "sbsBlockId" },
        ],
    });

    // Trigger file input click when the 'Choose File' button is clicked
    $("#choose-file-import-btn").on("click", function (e) {
        e.preventDefault(); // Prevent form submission or page reload
        $("#excelfileupload").click();
    });

    $("#excelfileupload").on("change", function () {
        let fileName =
            this.files.length > 0 ? this.files[0].name : "No file chosen";
        $("#file-name").text(fileName);
        $("#FileValidationMsg").addClass("d-none"); // Hide validation message
    });

    $("#upload_excel_file_btn").on("click", function (e) {
        e.preventDefault();

        let fileInput = $("#excelfileupload")[0];
        if (fileInput.files.length === 0) {
            $("#ExcelFileValidationMsg")
                .removeClass("d-none")
                .text("Please select appropriate Excel file before uploading.");
            return;
        }

        let formData = new FormData();
        formData.append("file", fileInput.files[0]);

        $.ajax({
            url: BASE_URL + "/saudi-billing-system-excel-import",
            method: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                // Handle success
                if (response.status == true) {
                    Swal.fire({
                        icon: "warning",
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-warning waves-effect waves-light",
                        },
                    }).then(function () {
                        location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: "error", // Change this to "error" for error messages
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light", // Optional: Change button styling for error
                        },
                    }).then(function () {
                        location.reload();
                    });
                }
            },
            error: function (xhr, status, error) {
                alert("An error occurred while uploading the file.");
            },
        });
    });
});
