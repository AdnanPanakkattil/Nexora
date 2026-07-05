$(document).ready(function () {
    $("#accounts_main_menu").addClass("active open menu-item-animating");
    $("#income_statement_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var rangePickr = $(".flatpickr-range"),
        dateFormat = "YYYY-MM-DD";

    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");

    var rangePickrInstance = null;

    if (rangePickr.length) {
        rangePickrInstance = rangePickr.flatpickr({
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
                    $(".date-range-display").text("");
                } else {
                    var startDate = "",
                        endDate = "";

                    if (selectedDates[0] !== undefined) {
                        startDate = moment(selectedDates[0]).format("DD-MM-YYYY");
                    }
                    if (selectedDates[1] !== undefined) {
                        endDate = moment(selectedDates[1]).format("DD-MM-YYYY");
                    }

                    startDateEle.val(moment(selectedDates[0]).format("YYYY-MM-DD"));
                    endDateEle.val(
                        selectedDates[1]
                            ? moment(selectedDates[1]).format("YYYY-MM-DD")
                            : ""
                    );
                }

                $(rangePickr).trigger("change").trigger("keyup");
            },
        });
    }

    // Clear button — wipes both dates from picker and hidden inputs
    $("#clearDateBtn").on("click", function () {
        if (rangePickrInstance) {
            rangePickrInstance.clear();
        }
        startDateEle.val("");
        endDateEle.val("");
        $(".date-range-display").text("");
    });

    var incomeStatementData = null;

    function loadIncomeStatement(startDate = "", endDate = "") {

        let clinicId = $("#clinicId").val();

        $.ajax({
            url: "/get-income-statement",
            method: "GET",
            beforeSend: function () {
                $("#datatable-loader").show();
                $("#invoice_payment_tbody tr:not(#datatable-loader)").remove();
            },
            data: {
                start_date: startDate,
                end_date: endDate,
                clinic_id: clinicId,
            },
            success: function (data) {
                incomeStatementData = data;

                let tbodyHtml = `
                    <tr>
                        <td class="table-secondary fw-bold" colspan="2">Purchases</td>
                        <td class="table-secondary text-end">${data.purchases}</td>
                    </tr>
                    <tr>
                        <td class="table-secondary fw-bold" colspan="2">Total Sales</td>
                        <td class="table-secondary text-end">${data.totalSales}</td>
                    </tr>
                    <tr>
                        <td class="table-secondary fw-bold" colspan="2">Total Sales Return</td>
                        <td class="table-secondary text-end">${data.salesReturn}</td>
                    </tr>
                    <tr>
                        <td class="table-secondary fw-bold" colspan="2">Net Sales</td>
                        <td class="table-secondary text-end">${data.netSales}</td>
                    </tr>
                    <tr>
                        <td class="table-secondary fw-bold" colspan="2">Cost of Goods Sold</td>
                        <td class="table-secondary text-end">${data.cogs}</td>
                    </tr>
                    <tr>
                        <td class="table-secondary fw-bold" colspan="2">Gross Profit</td>
                        <td class="table-secondary text-end">${data.grossProfit}</td>
                    </tr>
                    <tr>
                        <td class="table-secondary fw-bold" colspan="3">Expenses</td>
                    </tr>
                    <tr>
                        <td class="table-secondary fst-italic" colspan="2">Total</td>
                        <td class="table-secondary text-end">${data.expenses}</td>
                    </tr>
                    <tr>
                        <td class="table-secondary fw-bold" colspan="2">Profit</td>
                        <td class="table-secondary text-end">${data.netProfit}</td>
                    </tr>
                `;

                $("table.table-bordered tbody").html(tbodyHtml);
            },
            error: function (err) {
                console.error("Error fetching income statement data:", err);
                $("#datatable-loader").hide();
            },
        });
    }

    $("#search_income_statement").on("click", function () {
        let startDate = $(".start_date").val();
        let endDate = $(".end_date").val();
        $(".date-range-display").text(`From & To: ${startDate} to ${endDate}`);
        loadIncomeStatement(startDate, endDate);
    });

    $(document).on("click", "#print_income_statement", function () {
        var printContents = document.getElementById("printArea").innerHTML;
        var originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        location.reload();
    });

    $("#excel_income_statement").on("click", function () {
        if (!incomeStatementData) {
            alert("Please load the income statement first.");
            return;
        }

        let wb = XLSX.utils.book_new();

        let summaryData = [
            ["Account", "Amount"],
            ["Purchases", incomeStatementData.purchases],
            ["Total Sales", incomeStatementData.totalSales],
            ["Total Sales Return", incomeStatementData.salesReturn],
            ["Net Sales", incomeStatementData.netSales],
            ["Cost of Goods Sold", incomeStatementData.cogs],
            ["Gross Profit", incomeStatementData.grossProfit],
            ["Expenses", incomeStatementData.expenses],
            ["Profit", incomeStatementData.netProfit],
        ];
        let summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summarySheet, "Income Statement");

        let cogsData = [
            ["Item", "Sold Qty", "Avg Purchase Cost", "COGS"],
            ...incomeStatementData.cogsReport.map((r) => [
                r.itemName,
                r.sold_qty,
                r.avg_purchase_cost,
                r.cogs,
            ]),
        ];
        let cogsSheet = XLSX.utils.aoa_to_sheet(cogsData);
        XLSX.utils.book_append_sheet(wb, cogsSheet, "Cost of Goods Sold");

        let salesData = [
            ["Invoice No", "Item", "Quantity", "Amount"],
            ...incomeStatementData.salesReport.map((r) => [
                r.invoiceNo,
                r.itemName,
                r.quantity,
                r.amountWithVat,
            ]),
        ];
        let salesSheet = XLSX.utils.aoa_to_sheet(salesData);
        XLSX.utils.book_append_sheet(wb, salesSheet, "Sales Report");

        let returnData = [
            ["Return No", "Item", "Quantity", "Amount"],
            ...incomeStatementData.salesReturnReport.map((r) => [
                r.salesReturnNo,
                r.itemName,
                r.quantity,
                r.amountWithVat,
            ]),
        ];
        let returnSheet = XLSX.utils.aoa_to_sheet(returnData);
        XLSX.utils.book_append_sheet(wb, returnSheet, "Sales Return Report");

        XLSX.writeFile(
            wb,
            `Income_Statement_${moment().format("YYYYMMDD")}.xlsx`
        );
    });
});