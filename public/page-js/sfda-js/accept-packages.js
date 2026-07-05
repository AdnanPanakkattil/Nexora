$(document).ready(function () {
    $("#sfda_main_menu").addClass("active open menu-item-animating");
    $("#accept_packages_sub_menu").addClass("active");

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
     var rangePickr = $(".flatpickr-range"),
        dateFormat = "MM/DD/YYYY";

    var startDateEle = $(".start_date"); // Hidden input for start date
        var endDateEle = $(".end_date");     // Hidden input for end date
        

    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "m/d/Y",
            orientation: isRtl ? "auto right" : "auto left",
            locale: {
                format: dateFormat,
            },
            onClose: function (selectedDates, dateStr, instance) {
                var startDate = "",
                    endDate = new Date();
                if (selectedDates[0] != undefined) {
                    startDate = moment(selectedDates[0]).format("MM/DD/YYYY");
                    startDateEle.val(startDate);
                }
                if (selectedDates[1] != undefined) {
                    endDate = moment(selectedDates[1]).format("MM/DD/YYYY");
                    endDateEle.val(endDate);
                }
                $(rangePickr).trigger("change").trigger("keyup");
                sfdaTransactionTable.ajax.reload();
            },
            
        });
    }

    let sfdaTransactionTable = $("#sfdaTransactionTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/sfda/transaction-report",
            data: function (d) {
                d.startDate = $(".start_date").val(); // Hidden input for start date
            d.endDate = $(".end_date").val();     // Hidden input for end date
            }
        },


        
        order: [[2, "desc"]],
        columns: [
            { data: "sfdaTransactionId", name: "tysfdaTransactionIdpe", visible: true }, 

            { data: "createdTime", name: "createdTime", visible: true }, 
            { data: "updatedtime", name: "updatedtime" },
            { data: "affectedId", name: "affectedId" },
            { data: "notificationId", name: "notificationId" },
            { data: "type", name: "type" },
            { data: "status", name: "status" },

        ],
    });

    $("#pre_authorization_search_btn").click(function () {
        table.ajax.reload();
    });
    
});

    
