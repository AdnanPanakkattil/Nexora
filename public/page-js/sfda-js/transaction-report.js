$(document).ready(function () {
    $("#sfda_main_menu").addClass("active open menu-item-animating");
    $("#sfda_transactions_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    
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
                // sfdaTransactionTable.ajax.reload();
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

            
            { data: "affectedId", name: "affectedId" },
            { data: "notificationId", name: "notificationId" },
            { data: "type", name: "type" },
            { data: "status", name: "status" },
            { data: "createdTime", name: "createdTime", visible: true }, 
            { data: "updatedtime", name: "updatedtime" },
            // {
            //     data: null,
            //     name: "actions",
            //     orderable: false,
            //     searchable: false,
            //     render: function (data, type, full, meta) {
                    
            //         var detailsUrl =
            //             BASE_URL + "/sfda/detail-of-transaction/" + full.sfdaTransactionId;

                    
            //         return (
            //             '<div class="d-inline-block">' +
            //             '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
            //             '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        
            //             '<li><a href="' +
            //             detailsUrl +
            //             '" class="dropdown-item" data-id="' +
            //             detailsUrl +
            //             '">Details</a></li>' +
                        
            //             "</ul>" +
            //             "</div>"
            //         );
            //     },
            // },

        ],
    });

    $("#transaction_search_btn").click(function () {
        sfdaTransactionTable.ajax.reload();
    });
    
});

    
