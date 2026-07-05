let currentPage = 1;
let perPage = 10;

$(document).ready(function () {
    $("#product_management_main_menu").addClass(
        "active open menu-item-animating"
    );
    $("#stock_report_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    flatpickr("#flatpickr-date", {
        dateFormat: "Y-m-d",
        allowInput: true,
        onChange: function (selectedDates, dateStr, instance) {
            fetchStockItemReport();
        },
    });

    const itemId = $("#itemId").val();

    function fetchStockItemReport(page = 1) {
        currentPage = page;

        const search = $("#transactionSearch").val();
        const date = $("#flatpickr-date").val();
        const clinic = $("#branch").val();
        const type = $("#type").val();

        $.ajax({
            url: `/stock-item-report/${itemId}`,
            type: "GET",
            data: {
                search,
                date,
                clinic,
                type,
                page,
                perPage,
            },
            beforeSend: function () {
                $("#stockItemReportTableBody tr")
                    .not("#stock-item-report-loader")
                    .remove();
                $("#stock-item-report-loader").show();
            },
            success: function (response) {
                const data = response.data;
                let html = "";
                let unitPriceTotal = 0;
                let grandTotal = 0;
                let stockTotal = 0;

                $("#stockItemReportTableBody")
                    .find("tr")
                    .not("#stock-item-report-loader")
                    .remove();

                if (data.length === 0) {
                    html = `<tr><td colspan="9">No Stock Item Report found.</td></tr>`;
                    $("#stock-item-report-loader").before(html);
                    $("#transactionCount").text("0");
                    $("#stock-item-report-loader").hide();
                    $("#paginationContainer").html("");
                    $("#unit_price_total").text("0.00");
                    $("#total").text("0.00");
                    $("#stock_total").text("0");
                    return;
                }

                data.forEach(function (entry) {
                    const formattedDate = entry.date?.substring(0, 10);
                    let referenceNo = entry.reference;

                    if (entry.type === "Purchase") {
                        referenceNo = `<a href="/purchase/detail-of-purchase/${entry.id}" target="_blank" class="btn btn-outline-primary waves-effect" style="width:100%;">${entry.reference}</a>`;
                    } else if (entry.type === "Sale") {
                        referenceNo = `<a href="/sales/detail-of-invoice/${entry.id}" target="_blank" class="btn btn-outline-primary waves-effect" style="width:100%;">${entry.reference}</a>`;
                    } else if (entry.type === "Purchase Return") {
                        referenceNo = `<a href="/purchase/detail-of-purchase-return/${entry.id}" target="_blank" class="btn btn-outline-primary waves-effect" style="width:100%;">${entry.reference}</a>`;
                    } else if (entry.type === "Sales Return") {
                        referenceNo = `<a href="/sales/detail-of-sales-tax-invoice-return/${entry.id}" target="_blank" class="btn btn-outline-primary waves-effect" style="width:100%;">${entry.reference}</a>`;
                    } else if (entry.type === "Transferred") {
                        referenceNo = `<a href="/branchstocktransfer/detail-of-branch-stock-transfer/${entry.id}" target="_blank" class="btn btn-outline-primary waves-effect" style="width:100%;">${entry.reference}</a>`;
                    } else if (entry.type === "Received") {
                        referenceNo = `<a href="/branchstocktransfer/detail-of-branch-stock-transfer/${entry.id}" target="_blank" class="btn btn-outline-primary waves-effect" style="width:100%;">${entry.reference}</a>`;
                    } else if (entry.type === "Stock Adjustment") {
                        referenceNo = `<a href="/detail-of-stock-management/${entry.id}" target="_blank" class="btn btn-outline-primary waves-effect" style="width:100%;">${entry.reference}</a>`;
                    }

                    html += `
                    <tr>
                        <td>${formattedDate}</td>
                        <td>${entry.expiry_date}</td>
                        <td>${entry.clinic ?? "N/A"}</td>
                        <td><span class="badge bg-label-${getBadgeColor(
                            entry.type
                        )} w-100">${entry.type}</span></td>
                        <td>${referenceNo}</td>
                        <td>${entry.batch_no}</td>
                        <td>${entry.quantity}</td>
                        <td>${parseFloat(entry.unit_price).toFixed(2)} SAR</td>
                        <td>${parseFloat(entry.total_price).toFixed(2)} SAR</td>
                        <td><span class="${
                            entry.stock_effect > 0
                                ? "btn-text-success"
                                : "btn-text-danger"
                        }">
                            ${entry.stock_effect > 0 ? "+" : ""}${
                        entry.stock_effect
                    }
                        </span></td>
                    </tr>`;

                    unitPriceTotal += parseFloat(entry.unit_price);
                    if (entry.stock_effect > 0) {
                        grandTotal += parseFloat(entry.total_price);
                    } else {
                        grandTotal -= parseFloat(entry.total_price);
                    }
                    // grandTotal += parseFloat(entry.total_price);
                    stockTotal += parseFloat(entry.stock_effect);
                });

                $("#stock-item-report-loader").before(html);
                $("#transactionCount").text(response.total);
                $("#stock-item-report-loader").hide();

                $("#unit_price_total").text(unitPriceTotal.toFixed(2) + " SAR");
                $("#total").text(grandTotal.toFixed(2) + " SAR");
                $("#stock_total").text(stockTotal.toFixed(2));

                renderPagination(response);
            },
            error: function (xhr) {
                console.error("Error fetching report data:", xhr);
                $("#stock-item-report-loader").hide();
                $("#stockItemReportTableBody").html(
                    `<tr><td colspan="9" class="text-center text-danger">Failed to load data.</td></tr>`
                );
            },
        });
    }

    $(document).on("change", "#perPageSelect", function () {
        perPage = $(this).val();
        fetchStockItemReport(1);
    });

    function getBadgeColor(type) {
        switch (type.toLowerCase()) {
            case "sale":
                return "success";
            case "purchase":
                return "primary";
            case "damaged":
                return "danger";
            case "purchase return":
                return "warning";
            case "sales return":
                return "primary";
            case "received":
                return "success";
            case "transferred":
                return "info";
            case "stock adjustment":
                return "dark";
            default:
                return "secondary";
        }
    }

    fetchStockItemReport();

    $("#transactionSearch, #branch, #type").on("change keyup", function () {
        fetchStockItemReport();
    });

    $(document).on("click", ".pagination-link", function (e) {
        e.preventDefault();
        const page = $(this).data("page");
        fetchStockItemReport(page);
    });

    function renderPagination(response) {
        const totalPages = response.last_page;
        const current = response.current_page;

        let paginationHtml = `<nav><ul class="pagination justify-content-center">`;

        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `
            <li class="page-item ${i === current ? "active" : ""}">
                <a class="page-link pagination-link" href="#" data-page="${i}">${i}</a>
            </li>`;
        }

        paginationHtml += `</ul></nav>`;

        $("#paginationContainer").html(paginationHtml);
    }

    $("#printBtn").click(function () {
        const printContent = document.getElementById(
            "stockItemReportTable"
        ).outerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = `
        <html>
            <head><title>Print</title></head>
            <body>
                <h1 class="text-center">Stock Item Report</h1>
                ${printContent}
            </body>
        </html>
    `;
        window.print();
        document.body.innerHTML = originalContent;
        location.reload();
    });

    $("#pdfBtn").click(function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.autoTable({
            html: "#stockItemReportTable",
            theme: "grid",
            styles: { fontSize: 8 },
        });

        doc.save("stock_report.pdf");
    });

    $("#excelBtn").click(function () {
        let wb = XLSX.utils.table_to_book(
            document.getElementById("stockItemReportTable"),
            { sheet: "Stock Report" }
        );
        XLSX.writeFile(wb, "stock_report.xlsx");
    });

    $("#copyBtn").click(function () {
        let range = document.createRange();
        range.selectNode(document.getElementById("stockItemReportTable"));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        alert("Table copied to clipboard!");
    });
});
