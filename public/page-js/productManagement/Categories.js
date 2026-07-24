$(function () {
    // Sidebar menu active state - Start
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#Categories_sub_menu").addClass("active");

    // Configure CSRF token for AJAX requests
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    // Sidebar menu active state - End

});

