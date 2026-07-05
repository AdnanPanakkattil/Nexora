$(document).ready(function () {
    $("#reports_main_menu").addClass("active open menu-item-animating");
    $("#gss_report_sub_menu").addClass("active");
    

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

   

    var rangePickr = $(".flatpickr-range"),
        dateFormat = "MM/DD/YYYY";

    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");
    var dateErrorEle = $(".date_error");

    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "m/d/Y",
            onClose: function (selectedDates) {
                var startDate = selectedDates[0]
                    ? moment(selectedDates[0]).format("YYYY-MM-DD")
                    : null;
                var endDate = selectedDates[1]
                    ? moment(selectedDates[1]).format("YYYY-MM-DD")
                    : null;
                $(".start_date").val(startDate);
                $(".end_date").val(endDate);
                if (startDate && endDate) {
                    var startMoment = moment(startDate);
                    var endMoment = moment(endDate);
                    var daysDifference = endMoment.diff(startMoment, "days");
                    if (daysDifference > 100) {
                        dateErrorEle.text(
                            "Date range shouldn’t exceed 100 days"
                        );
                    } else {
                        dateErrorEle.text("");
                    }
                }
            },
        });
    }

    $("#download_excel_btn").click(function () {
    let startDate = $("#startDate").val();
    let endDate = $("#endDate").val();
    let clinic = $("#Payer").val();

    $.ajax({
        url: BASE_URL + "/reports/gss-report/export",
        type: "POST",
        data: {
            startDate: startDate,
            endDate: endDate,
            clinic: clinic,
        },
        xhrFields: {
            responseType: 'blob' // Important for file download
        },
        success: function (data) {
            var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "gss-report.xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
    });
});
    
});
