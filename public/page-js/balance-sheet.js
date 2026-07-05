$(document).ready(function () {
    $("#accounts_main_menu").addClass("active open menu-item-animating");
    $("#balance_sheet_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var rangePickr = $(".flatpickr-range"),
        dateFormat = "YYYY-MM-DD";

    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");
    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "Y/m/d",
            orientation: isRtl ? "auto right" : "auto left",
            locale: {
                format: dateFormat,
            },

            onClose: function (selectedDates, dateStr, instance) {
                if (selectedDates.length === 0) {
                    startDateEle.val("");
                    endDateEle.val("");
                } else {
                    var startDate = "",
                        endDate = "";
                    if (selectedDates[0] !== undefined) {
                        startDate = moment(selectedDates[0]).format(
                            "YYYY-MM-DD"
                        );
                    }
                    if (selectedDates[1] !== undefined) {
                        endDate = moment(selectedDates[1]).format("YYYY-MM-DD");
                    }
                    startDateEle.val(startDate);
                    endDateEle.val(endDate);
                }

                // $("#selectedDateRange").text(
                //     " : " + startDate + " to " + endDate
                // );

                $(rangePickr).trigger("change").trigger("keyup");
                assetsTable.ajax.reload();
                liabilityTable.ajax.reload();
            },
        });
    }

    $(document).on("change", "#clinicId", function () {
        $.ajax({
            url:
                BASE_URL + "/get-item-department-by-clinic-id/" + $(this).val(),
            type: "GET",
            success: function (response) {
                const departmentSelect = $("#departmentId");

                departmentSelect.selectpicker("destroy");

                departmentSelect.empty();

                if (response.status && response.data.length > 0) {
                    response.data.forEach(function (department) {
                        departmentSelect.append(
                            $("<option>", {
                                value: department.departmentId,
                                text: department.department_name_en,
                            })
                        );
                    });
                }

                departmentSelect.selectpicker();
            },

            error: function (xhr, status, error) {
                console.error("AJAX Error: ", status, error);
            },
        });
    });

    $(document).on("click", "#printBalanceSheet", function () {
        var printContents = document.getElementById("printArea").innerHTML;
        var originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        location.reload();
    });

    $(document).on("click", "#exportExcel", function () {
        let wb = XLSX.utils.book_new();
        let ws_data = [];

        ws_data.push(["LIABILITIES"]);
        let liabilitiesTable = document.getElementById("liabilitiesTable");
        let ws1 = XLSX.utils.table_to_sheet(liabilitiesTable);
        ws_data = ws_data.concat(XLSX.utils.sheet_to_json(ws1, { header: 1 }));

        ws_data.push([]);

        ws_data.push(["ASSETS"]);
        let assetsTable = document.getElementById("assetsTable");
        let ws2 = XLSX.utils.table_to_sheet(assetsTable);
        ws_data = ws_data.concat(XLSX.utils.sheet_to_json(ws2, { header: 1 }));

        let ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "BalanceSheet");

        XLSX.writeFile(wb, "BalanceSheet.xlsx");
    });
});
