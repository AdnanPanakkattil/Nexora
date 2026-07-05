$("#pages-tab").click(function () {
    $(".tab-content").hide();
    $("#bmi_history").hide();
    $("#vital_head").hide();
    $("#pages_content").show();
    $(".nav-link").removeClass("active");
    $(this).addClass("active");

    // Show default sub-tab: Screening
    $("#pages_screening_btn").addClass("active");
    $("#pages_screening_div").show();
    $("#pages_positive_screening_div").hide();
});

$("#pages_screening_btn").click(function () {
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
    $("#pages_screening_div").show();
    $("#pages_positive_screening_div").hide();
});

$("#pages_positive_screening_btn").click(function () {
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
    $("#pages_positive_screening_div").show();
    $("#pages_screening_div").hide();
});