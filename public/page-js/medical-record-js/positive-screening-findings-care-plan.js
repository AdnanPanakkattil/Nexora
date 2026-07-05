$(document).ready(function () {
    $("#medical_record_main_menu1").addClass("active open menu-item-animating");
    $("#medical_record_lists_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $('input[name="PSFCP_Onset"]').on('change', function() {
        $('input[name="PSFCP_Onset"]').not(this).prop('checked', false);
    });

    $('input[name="PSFCP_Onset"], input[name="PSFCP_Course"]').on('change', function() {
        $('input[name="' + this.name + '"]').not(this).prop('checked', false);
    });

    $('input[name="PSFCP_Onset"], input[name="PSFCP_Course"], input[name="PSFCP_Nature"]').on('change', function() {
        $('input[name="' + this.name + '"]').not(this).prop('checked', false);
    });

    // $('input[name="PSFCP_Onset"], input[name="PSFCP_Course"], input[name="PSFCP_Nature"], input[name="PSFCP_dietition"]').on('change', function() {
    //     $('input[name="' + this.name + '"]').not(this).prop('checked', false);
    // });

    // $('input[name="PSFCP_Onset"], input[name="PSFCP_Course"], input[name="PSFCP_Nature"], input[name="PSFCP_dietition"]').on('change', function() {
    //     $('input[name="' + this.name + '"]').not(this).prop('checked', false);
    // });

    // $('input[name="PSFCP_Onset"], input[name="PSFCP_Course"], input[name="PSFCP_Nature"], input[name="PSFCP_dietition"], input[name="PSFCP_therapeutic"]').on('change', function() {
    //     $('input[name="' + this.name + '"]').not(this).prop('checked', false);
    // });

    // $('input[name="PSFCP_Onset"], input[name="PSFCP_Course"], input[name="PSFCP_Nature"], input[name="PSFCP_dietition"], input[name="PSFCP_therapeutic"], input[name="PSFCP_PDWE"]').on('change', function() {
    //     $('input[name="' + this.name + '"]').not(this).prop('checked', false);
    // });

    $('input[name="PSFCP_Onset"], input[name="PSFCP_Course"], input[name="PSFCP_Nature"], input[name="PSFCP_dietition"], input[name="PSFCP_therapeutic"], input[name="PSFCP_PDWE"]').on('change', function() {
        $('input[name="' + this.name + '"]').not(this).prop('checked', false);
    });

    $('input[name="PSFCP_dietition_healthy"], input[name="PSFCP_dietition_advice"]').on('change', function() {
        $('input[name="' + this.name + '"]').not(this).prop('checked', false);
    });

});


    
    


