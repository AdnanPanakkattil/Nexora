$(document).ready(function () {
    $("#accounts_main_menu").addClass("active open menu-item-animating");
    $("#debit_report_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    if ($("#customer_search").data("select2")) {
        $("#customer_search").select2("destroy");
    }

    $("#customer_search")
        .wrap('<div class="position-relative flex-grow-1"></div>')
        .select2({
            dropdownParent: $("#customer_search").parent(),
            placeholder: "Search Customer",
            minimumInputLength: 2,
            width: "100%",
            ajax: {
                url: "/accounting/search-customer",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return { q: params.term };
                },
                processResults: function (data) {
                    return {
                        results: data.map(function (customer) {
                            return {
                                id: customer.regularCustomerId,
                                text:
                                    customer.customerName +
                                    " (" +
                                    customer.customerNo +
                                    ")",
                                customerData: customer,
                            };
                        }),
                    };
                },
                cache: true,
            },
            allowClear: true,
        });

    $("#journalEntryModalBtn").on("click", function () {
        const customerId = $("#customer_search").val();
        if (customerId) {
            $("#JournalEntryModal").modal("show");
            loadCustomerJournalEntries(customerId);
        } else {
            Swal.fire({
                icon: "error",
                text: "Please select a customer first!",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        }
    });

    let debitReportXhr = null;

    $("#customer_search_btn").on("click", function () {
        let selectedData = $("#customer_search").select2("data")[0];

        if (selectedData && selectedData.customerData) {
            const customer = selectedData.customerData;
            const $btn = $(this);

            // Cancel any request still in flight — its response can no
            // longer append rows after the next one starts.
            if (debitReportXhr) {
                debitReportXhr.abort();
            }

            debitReportXhr = $.ajax({
                url: `/accounting/get-customer-debits/${customer.regularCustomerId}`,
                method: "GET",
                beforeSend: function () {
                    $btn.prop("disabled", true);
                    $("#datatable-loader").show();
                    $("#invoiceDebitBody tr:not(#datatable-loader)").remove();
                },
                success: function (data) {
                    // Clear again right before rendering — belt-and-suspenders
                    // against any stray response still landing.
                    $("#invoiceDebitBody tr:not(#datatable-loader)").remove();

                    let tableBody = "";
                    let totalBill = 0;
                    let totalBalance = 0;
                    let totalDebit = 0;
                    let totalCredit = 0;
                    let lastBalance = 0;
                    data.forEach((item) => {
                        let detailsUrl = "";
                        if (item.type === "Sales Return") {
                            detailsUrl =
                                BASE_URL +
                                "/sales/detail-of-sales-tax-invoice-return/" +
                                item.invoiceId;
                        } else {
                            detailsUrl =
                                BASE_URL +
                                "/sales/detail-of-invoice/" +
                                item.invoiceId;
                        }
                        tableBody += `
                        <tr data-id="${item.invoiceId}">
                            <td>${item.invoiceNumberNumeric}</td>
                            <td>
                                <a href="${detailsUrl}" target="_blank" class="btn btn-outline-primary waves-effect" style="width:100%;">
                                    <i class="ti ti-report-medical"></i> ${item.invoiceNo}
                                </a>
                            </td>
                            <td>${item.invoiceDate}</td>
                            <td>${item.type}</td>
                            <td class="billTotal">${item.billTotal}</td>
                            <td class="credit">${item.credit}</td>
                            <td class="debit">${item.debit}</td>
                            <td class="balance">${item.balance}</td>
                        </tr>
                    `;

                        totalBill +=
                            parseFloat(
                                item.billTotal.toString().replace(/,/g, ""),
                            ) || 0;
                        totalBalance +=
                            parseFloat(
                                item.balance.toString().replace(/,/g, ""),
                            ) || 0;
                        totalDebit +=
                            parseFloat(
                                item.debit.toString().replace(/,/g, ""),
                            ) || 0;
                        totalCredit +=
                            parseFloat(
                                item.credit.toString().replace(/,/g, ""),
                            ) || 0;
                        lastBalance =
                            parseFloat(
                                item.balance.toString().replace(/,/g, ""),
                            ) || 0;
                    });
                    $("#datatable-loader").hide();
                    $("#invoiceDebitBody").append(tableBody);
                    $("#bill_total").text(totalBill.toFixed(2));
                    $("#balance_total").text(lastBalance.toFixed(2));
                    $("#credit_total").text(totalCredit.toFixed(2));
                    $("#debit_total").text(totalDebit.toFixed(2));
                },
                error: function (jqXHR, textStatus) {
                    if (textStatus === "abort") return; // superseded by a newer click, ignore
                    $("#datatable-loader").hide();
                    Swal.fire({
                        icon: "error",
                        text: "Failed to fetch purchase data.",
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                },
                complete: function () {
                    $btn.prop("disabled", false);
                    debitReportXhr = null;
                },
            });
        } else {
            Swal.fire({
                icon: "error",
                text: "Please select a vendor first!",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        }
    });

    $("#ExcelBtn").on("click", function () {
        let selectedData = $("#customer_search").select2("data")[0];
        // console.log(selectedData);
        if (selectedData && selectedData.customerData) {
            const customer = selectedData.customerData;
            console.log(customer);
            let tableClone = $("#invoiceDebitTable").clone();

            tableClone.find("tr#datatable-loader").remove();

            let tempTable = $("<table></table>");
            tempTable.append(`
            <tr>
                <td colspan="${tableClone.find("tr:first th").length}">
                    <strong>Customer Code:</strong> &nbsp; ${customer.customerNo} 
                </td>
            </tr>
            <tr>
                <td colspan="${tableClone.find("tr:first th").length}">
                    <strong>Customer Name:</strong> &nbsp; ${
                        customer.customerName
                    }
                </td>
            </tr>
            <tr>
                <td colspan="${
                    tableClone.find("tr:first th").length
                }">&nbsp;</td>
            </tr>
        `);

            tempTable.append(tableClone.html());

            let sheetName = `${customer.customerName} Debit Report`;

            if (sheetName.length > 31) {
                // sheetName = sheetName.substring(0, 31);
                sheetName = `${customer.customerName} Report`;
            }

            let wb = XLSX.utils.table_to_book(tempTable[0], {
                sheet: sheetName,
            });

            let ws = wb.Sheets[sheetName];

            ws["!cols"] = [
                { wch: 15 },
                { wch: 15 },
                { wch: 12 },
                { wch: 15 },
                { wch: 12 },
                { wch: 12 },
                { wch: 12 },
                { wch: 12 },
            ];

            XLSX.writeFile(wb, `${sheetName}.xlsx`);
        } else {
            Swal.fire({
                icon: "error",
                text: "Please select a customer first!",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        }
    });
});

function loadCustomerJournalEntries(customerId) {
    $.ajax({
        url: `/accounting/journal-entry/${customerId}`,
        method: "GET",
        beforeSend: function () {
            $("#journalBody tr").not("#journal-loader").remove();
            $("#journal-loader").show();
        },
        success: function (response) {
            let html = "";

            if (response.data.length === 0) {
                html = `<tr><td colspan="4">No journal entries found.</td></tr>`;
                $("#journal-loader").before(html);
                $("#journal-loader").hide();
                return;
            }

            // Group by accountTranscationId
            let grouped = {};
            response.data.forEach((entry) => {
                let key = entry.accountTranscationId;
                if (!grouped[key]) {
                    grouped[key] = [];
                }
                grouped[key].push(entry);
            });

            // Convert grouped object to array for sorting
            let groupedArray = Object.entries(grouped);

            // Sort by first entry date DESC
            groupedArray.sort((a, b) => {
                let dateA = new Date(a[1][0].date);
                let dateB = new Date(b[1][0].date);
                return dateB - dateA; // descending
            });

            // Render sorted entries
            groupedArray.forEach(([key, entries]) => {
                let narration = entries[0].narration ?? "Journal Entry";

                // Separate debit and credit entries
                let debitEntries = entries.filter(
                    (e) => parseFloat(e.debit) > 0,
                );
                let creditEntries = entries.filter(
                    (e) => parseFloat(e.credit) > 0,
                );

                debitEntries.forEach((entry, index) => {
                    html += `
                            <tr>
                                <td>${index === 0 ? entry.date : ""}</td>
                                <td>${entry.account}</td>
                                <td>${entry.debit}</td>
                                <td></td>
                            </tr>
                        `;
                });

                creditEntries.forEach((entry) => {
                    html += `
                            <tr>
                                <td></td>
                                <td class="ps-12">${entry.account}</td>
                                <td></td>
                                <td>${entry.credit}</td>
                            </tr>
                        `;
                });

                html += `
                            <tr>
                                <td colspan="4" class="table-secondary fst-italic" style="padding-left: 20px;">
                                    ${narration}
                                </td>
                            </tr>
                        `;
            });

            $("#journal-loader").before(html);

            $("#journal-sheet-no").last().text(response.sheetNo);

            $("#journal-loader").hide();
        },
        error: function () {
            alert("Failed to load journal entries.");
            $("#journal-loader").hide();
        },
    });
}
