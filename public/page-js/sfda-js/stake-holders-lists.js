$(document).ready(function () {
    $("#sfda_main_menu").addClass("active open menu-item-animating");
    $("#stake_holders_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // var rangePickr = $(".flatpickr-range");
    // var startDateEle = $(".start_date");
    // var endDateEle = $(".end_date");

    // if (rangePickr.length) {
    //     rangePickr.flatpickr({
    //         mode: "range",
    //         dateFormat: "m/d/Y",
    //         onClose: function (selectedDates, dateStr, instance) {
    //             if (selectedDates[0] != undefined) {
    //                 startDateEle.val(moment(selectedDates[0]).format("MM/DD/YYYY"));
    //             }
    //             if (selectedDates[1] != undefined) {
    //                 endDateEle.val(moment(selectedDates[1]).format("MM/DD/YYYY"));
    //             }
    //             rangePickr.trigger("change").trigger("keyup");
    //             // appointmentReportTable.ajax.reload();
    //         }
    //     });
    // }

    let table = $("#pre_authorization_requests_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/sfda/stake-holders-list-service",
            type: "POST",
            data: function (d) {
                d.type = $("#type").val(); // Corrected ID
                d.gln = $("#gln").val();
                d.stakeHolderName = $("#stakeHolderName").val();
                d.city = $("#city").val();
            }
        },
        order: [[2, "desc"]],
        columns: [
            
            { data: "type", name: "type", visible: true }, 

            { data: "GLN", name: "GLN", visible: true }, 
            { data: "STAKEHOLDERNAME", name: "STAKEHOLDERNAME" },
            { data: "CITYNAME", name: "CITYNAME" },
            { data: "ADDRESS", name: "ADDRESS" },
            { data: "ISACTIVE", name: "ISACTIVE" },
        ],
    });

    $("#pre_authorization_search_btn").click(function () {
        table.ajax.reload();
    });
    
});

    
