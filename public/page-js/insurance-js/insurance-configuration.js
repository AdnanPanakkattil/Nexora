$(document).ready(function () {
    $("#insurance_main_menu").addClass("active open menu-item-animating");
    $("#insurance_configuration_sub_menu").addClass("active");
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    alert();
    
});


