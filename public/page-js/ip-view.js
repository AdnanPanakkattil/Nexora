
$(".tab-content").hide();
$("#history_and_physical_examination_content").show();

$("#history-and-physical-examination-tab").click(function () {
    $(".tab-content").hide(); // Hide all content
    $("#history_and_physical_examination_content").show(); // Show Vital Sign content
    $(".nav-link").removeClass("active"); // Remove active class from all tabs
    $(this).addClass("active"); // Add active class to clicked tab
});

$("#allergy-tab").click(function () {
    $(".tab-content").hide();
    $("#allergy_content").show();
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
});

// Event listener for Consultation tab
$("#medication-sheet-tab").click(function () {
    $(".tab-content").hide();
    $("#medication_sheet_content").show();
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
});

// Event listener for Consultation tab
$("#operative-report-tab").click(function () {
    $(".tab-content").hide();
    $("#operative_report_content").show();
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
});

// Event listener for Consultation tab
$("#category-and-anesthesia-tab").click(function () {
    $(".tab-content").hide();
    $("#category_and_anesthesia_content").show();
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
});

// Event listener for Consultation tab
$("#diagnosis-tab").click(function () {
    $(".tab-content").hide();
    $("#diagnosis_content").show();
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
});

// Event listener for Screening tab
$("#surgical-procedure-documentation-tab").click(function () {
    $(".tab-content").hide();
    $("#surgical_procedure_documentation_content").show();
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
});

// Event listener for Screening tab
$("#services-tab").click(function () {
    $(".tab-content").hide();
    $("#services_content").show();
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
});