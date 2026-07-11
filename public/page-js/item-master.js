$(document).ready(function () {
    // Activate the Customer menu
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#product_management_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

});