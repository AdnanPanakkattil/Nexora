$(document).ready(function () {
    $("#room_management_main_menu").addClass("active open menu-item-animating");
    $("#room_transfer_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });


    flatpickr("#transferDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });


});


