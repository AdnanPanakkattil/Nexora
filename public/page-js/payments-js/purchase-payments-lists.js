$(document).ready(function () {
    $("#paymnets_main_menu").addClass("active open menu-item-animating");
    $("#purchase_payments_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#journalEntryModalBtn").on("click", function () {
        const vendorId = $("#vendor_search").val();
        if (vendorId) {
            $("#JournalEntryModal").modal("show");
            loadVendorJournalEntries(vendorId);
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

    flatpickr("#flatpickr-date", {
        dateFormat: "Y-m-d",
        defaultDate: new Date(),
    });

    // $("#vendor_search").select2({
    $("#vendor_search").select2("destroy");
        $("#vendor_search")
        .wrap('<div class="position-relative"></div>')
        .select2({
        dropdownParent: $("#vendor_search").parent(),
        width: "100%",
        placeholder: "Search Vendor",
        minimumInputLength: 2,
        width: "resolve",
        ajax: {
            url: "search-vendor",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return { q: params.term };
            },
            processResults: function (data) {
                return {
                    results: data.map(function (vendor) {
                        return {
                            id: vendor.vendorId,
                            text:
                                vendor.vendor_name_en +
                                " (" +
                                vendor.vendor_code +
                                ")",
                            vendorData: vendor,
                        };
                    }),
                };
            },
            cache: true,
        },
        allowClear: true,
    });

    // $(".subAccountHead").select2({
    //     placeholder: "Search Sub Account Head",
    //     minimumInputLength: 2,
    //     ajax: {
    //         url: "search-sub-account-head",
    //         dataType: "json",
    //         delay: 250,
    //         data: function (params) {
    //             return { q: params.term };
    //         },
    //         processResults: function (data) {
    //             return {
    //                 results: data.map(function (subAccount) {
    //                     return {
    //                         id: subAccount.accountHeadId,
    //                         text: subAccount.subAccountHeadName,
    //                     };
    //                 }),
    //             };
    //         },
    //         cache: true,
    //     },
    //     allowClear: true,
    // });

    function loadVendorJournalEntries(vendorId) {
        $.ajax({
            url: `journal-entry/${vendorId}`,
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
                        (e) => parseFloat(e.debit) > 0
                    );
                    let creditEntries = entries.filter(
                        (e) => parseFloat(e.credit) > 0
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

    function formatSubAccountResults(data) {
        return {
            results: data.map(function (group) {
                return {
                    text: group.text,
                    children: group.children.map(function (item) {
                        return {
                            id: item.id,
                            text: item.text,
                            accountHeadId: group.id,
                        };
                    }),
                };
            }),
        };
    }

    // $("#subAccountHead1, #subAccountHead2, #subAccountHead3").select2({
    //     placeholder: "Select Sub Account Head",
    //     ajax: {
    //         url: function (params) {
    //             if (this[0].id === "subAccountHead1") {
    //                 return "search-sub-account-head";
    //             } else {
    //                 return "search-sub-account-head-bank";
    //             }
    //         },
    //         dataType: "json",
    //         delay: 250,
    //         processResults: formatSubAccountResults,
    //         cache: true,
    //     },
    //     allowClear: true,
    // });
    $("#subAccountHead1, #subAccountHead2, #subAccountHead3").select2("destroy");
    ["#subAccountHead1", "#subAccountHead2", "#subAccountHead3"].forEach(function(id) {
    var $el = $(id);
        if (!$el.parent().hasClass("position-relative")) {
            $el.wrap('<div class="position-relative"></div>');
        }
        $el.select2({
            dropdownParent: $el.parent(),
            width: "100%",
            placeholder: "Select Sub Account Head",
            ajax: {
                url: function () {
                    if (id === "#subAccountHead1") {
                        return "search-sub-account-head";
                    } else {
                        return "search-sub-account-head-bank";
                    }
                },
                dataType: "json",
                delay: 250,
                processResults: formatSubAccountResults,
                cache: true,
            },
            allowClear: true,
        });
    });

    $("#vendor_search_btn").on("click", function () {
        let selectedData = $("#vendor_search").select2("data")[0];

        if (selectedData && selectedData.vendorData) {
            const vendor = selectedData.vendorData;

            $("#VendorNo").val(vendor.vendor_code);
            $("#VendorName").val(vendor.vendor_name_en);

            $.ajax({
                url: `vendor-purchases/${vendor.vendorId}`,
                method: "GET",
                beforeSend: function () {
                    $("#datatable-loader").show(); // Show loader row
                    $(
                        "#purchasePaymentBody tr:not(#datatable-loader)"
                    ).remove(); // Remove old rows
                },
                success: function (data) {
                    let tableBody = "";
                    // let totalBill = 0;
                    // let totalPaid = 0;
                    let totalBalance = 0;
                    let totalDebit = 0;
                    let totalCredit = 0;
                    data.forEach((item) => {
    const balanceVal =
        parseFloat(item.balance.toString().replace(/,/g, "")) || 0;

    // REMOVED: runningBalance += balanceVal;  ← this was the bug

    const isDisabled = balanceVal <= 0 ? "disabled" : "";

    let detailsUrl = "";
    if (item.type === "Purchase Return") {
        detailsUrl =
            BASE_URL +
            "/purchase/detail-of-purchase-return/" +
            item.purchaseItemBillId;
    } else {
        detailsUrl =
            BASE_URL +
            "/purchase/detail-of-purchase/" +
            item.purchaseItemBillId;
    }

    tableBody += `
        <tr data-id="${item.purchaseItemBillId}">
            <td>${item.invoiceNumberNumeric}</td>
            <td>
                <a href="${detailsUrl}" target="_blank" class="btn btn-outline-primary waves-effect" style="width:100%;">
                    <i class="ti ti-report-medical"></i> ${item.invoiceNo}
                </a>
            </td>
            <td>${item.invoiceDate}</td>
            <td>${item.type}</td>
            <td class="credit">${item.credit}</td>
            <td class="debit">${item.debit}</td>
            <td class="balance">${formatNumber(balanceVal)}</td>
            <td><input type="number" class="pay form-control" ${isDisabled}></td>
        </tr>
    `;

    totalBalance += balanceVal;
    totalDebit += parseFloat(item.debit.toString().replace(/,/g, "")) || 0;
    totalCredit += parseFloat(item.credit.toString().replace(/,/g, "")) || 0;
});
                    $("#datatable-loader").hide();
                    $("#purchasePaymentBody").append(tableBody);
                    // $("#bill_total").text(totalBill.toFixed(2));
                    // $("#amount_paid_total").text(totalPaid.toFixed(2));
                    $("#balance_total").text(totalBalance.toFixed(2));
                    $("#credit_total").text(totalCredit.toFixed(2));
                    $("#debit_total").text(totalDebit.toFixed(2));
                    updateTotalPay();
                },
                error: function () {
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

    // Function to update the total pay amount
    function updateTotalPay() {
        let total = 0;
        $(".pay").each(function () {
            let val = parseFloat($(this).val());
            if (!isNaN(val)) {
                total += val;
            }
        });
        $("#total").text(formatNumber(total));
        distributePaymentAmount();
    }

    // Handle payment input changes
    $(document).on("input", ".pay", function () {
        const $input = $(this);
        const enteredAmount = parseFloat($input.val()) || 0;
        const $row = $input.closest("tr");
        const balance =
            parseFloat($row.find("td:nth-child(7)").text().replace(/,/g, "")) ||
            0;

        // Clear previous errors
        $input.removeClass("is-invalid");
        $input.next(".invalid-feedback").remove();

        if (enteredAmount > balance || enteredAmount < 0) {
            $input.addClass("is-invalid");
            if ($input.next(".invalid-feedback").length === 0) {
                $input.after(
                    '<div class="invalid-feedback">Amount exceeds balance!</div>'
                );
            }
        }

        updateTotalPay();
    });

    // Track manual entries for payment distribution
    const manualEntries = {};

    // Handle checkbox changes -  Only distribute if a checkbox is changed
    $(".payment-checkbox").on("change", function () {
        distributePaymentAmount();
    });

    // Handle manual input in payment fields
    $("#cash_amount, #bank_amount, #cheque_amount").on("input", function () {
        const inputId = $(this).attr("id");
        const enteredAmount = parseFloat($(this).val()) || 0;

        if (!isNaN(enteredAmount)) {
            manualEntries[inputId] = enteredAmount;
        } else {
            delete manualEntries[inputId];
        }
        distributePaymentAmount();
    });

    function distributePaymentAmount() {
        const totalPayAmount =
            parseFloat($("#total").text().replace(/,/g, "")) || 0;
        const checkedBoxes = $(".payment-checkbox:checked");

        if (checkedBoxes.length === 0 || totalPayAmount === 0) {
            $("#cash_amount, #bank_amount, #cheque_amount").val("");
            $("#payment-error").text("");
            return;
        }

        let manualTotal = 0;
        Object.values(manualEntries).forEach((value) => (manualTotal += value));

        let remainingAmount = totalPayAmount - manualTotal;
        let autoSplitFields = [];

        checkedBoxes.each(function () {
            const paymentId = $(this).attr("id");
            const amountInputId = paymentId + "_amount";
            if (!manualEntries.hasOwnProperty(amountInputId)) {
                autoSplitFields.push($("#" + amountInputId));
            }
        });

        const autoSplitCount = autoSplitFields.length;

        if (autoSplitCount > 0) {
            // Calculate split amount with proper rounding
            const splitAmount =
                Math.floor((remainingAmount / autoSplitCount) * 100) / 100;
            const remainder = Math.round(
                (remainingAmount - splitAmount * autoSplitCount) * 100
            );

            if (splitAmount < 0) {
                $("#payment-error").html(
                    '<span class="text-danger">Total manual entries exceed the payment total. Please adjust your values.</span>'
                );
                return;
            }

            $("#payment-error").text("");

            // Distribute amounts with remainder adjustment
            autoSplitFields.forEach((inputField, index) => {
                let amount = splitAmount;
                // Add the remainder to the first payment method
                if (index === 0) {
                    amount += remainder / 100;
                }
                inputField.val(formatNumber(amount));
            });
        }

        // Clear unchecked fields
        $(".payment-checkbox:not(:checked)").each(function () {
            const paymentId = $(this).attr("id");
            $("#" + paymentId + "_amount").val("");
            delete manualEntries[paymentId + "_amount"];
        });
    }

    function formatNumber(num) {
        // Format to 2 decimal places without rounding issues
        return (Math.round(num * 100) / 100).toFixed(2);
    }

    $("#saveBtn").on("click", function () {
        const vendorData = $("#vendor_search").select2("data")[0];

        if (!vendorData) {
            Swal.fire({
                icon: "error",
                text: "Please select a vendor first!",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
            return;
        }

        // Validate at least one payment method is selected
        const cashChecked = $("#cash").is(":checked");
        const bankChecked = $("#bank").is(":checked");
        const chequeChecked = $("#cheque").is(":checked");

        if (!cashChecked && !bankChecked && !chequeChecked) {
            Swal.fire({
                icon: "error",
                text: "Please select at least one payment method!",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
            return;
        }

        // Validate payment amounts match total
        const totalPayAmount =
            parseFloat($("#total").text().replace(/,/g, "")) || 0;
        const cashAmount = parseFloat($("#cash_amount").val()) || 0;
        const bankAmount = parseFloat($("#bank_amount").val()) || 0;
        const chequeAmount = parseFloat($("#cheque_amount").val()) || 0;
        const calculatedTotal = cashAmount + bankAmount + chequeAmount;

        if (calculatedTotal !== totalPayAmount) {
            Swal.fire({
                icon: "error",
                text: "Payment amounts don't match the total to pay!",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
            return;
        }

        // Collect payment details for each invoice
        const payments = [];
        let isOverpaid = false;
        $("table tbody tr").each(function () {
            const amount = parseFloat($(this).find(".pay").val()) || 0;
            const credit =
                parseFloat($(this).find(".credit").text().replace(/,/g, "")) ||
                0;

            if (amount > credit) {
                isOverpaid = true;
                return false; // break out of .each
            }

            if (amount > 0) {
                payments.push({
                    purchaseItemBillId: $(this).data("id"),
                    amount: amount,
                });
            }
        });

        if (isOverpaid) {
            Swal.fire({
                icon: "error",
                text: "Payment amount cannot exceed invoice balance!",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
            return;
        }

        if (payments.length === 0) {
            Swal.fire({
                icon: "error",
                text: "No payment amounts entered for any invoice!",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
            return;
        }

        // Prepare data for AJAX request
        const paymentData = {
            vendorId: vendorData.id,
            voucher_date: $("#flatpickr-date").val(),
            voucher_no: $("#voucher_no").val(),
            cash_amount: cashAmount,
            bank_amount: bankAmount,
            cheque_amount: chequeAmount,
            subAccountHead1: $("#subAccountHead1").val(),
            subAccountHead2: $("#subAccountHead2").val(),
            subAccountHead3: $("#subAccountHead3").val(),
            payments: payments,
            financialYearId: financialYearId,
        };

        // Send data to server
        $.ajax({
            url: "purchase-payment",
            method: "POST",
            data: paymentData,
            success: function (response) {
                if (response.success) {
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    }).then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
            error: function (xhr) {
                let message = "An error occurred.";

                if (xhr.responseJSON && xhr.responseJSON.errors) {
                    const errors = xhr.responseJSON.errors;
                    message = Object.values(errors).flat().join("\n");
                } else if (xhr.responseJSON && xhr.responseJSON.message) {
                    message = xhr.responseJSON.message;
                }

                Swal.fire({
                    icon: "error",
                    text: message,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });

    $("#ExcelBtn").on("click", function () {
        const vendorId = $("#vendor_search").val();
        if (vendorId) {
            let tableClone = $("#purchasePaymentTable").clone();
            tableClone.find("th:last-child, td:last-child").remove();

            tableClone.find("tr#datatable-loader").remove();

            let tempTable = $("<table></table>");
            const vendorCode = $("#VendorNo").val() || "";
            const vendorName = $("#VendorName").val() || "";

            tempTable.append(`
            <tr>
                <td colspan="${tableClone.find("tr:first th").length}">
                    <strong>Vendor Code:</strong> &nbsp; ${vendorCode} 
                </td>
            </tr>
            <tr>
                <td colspan="${tableClone.find("tr:first th").length}">
                    <strong>Vendor Name:</strong> &nbsp; ${vendorName}
                </td>
            </tr>
            <tr>
                <td colspan="${tableClone.find("tr:first th").length}">&nbsp;</td>
            </tr>
        `);

            tempTable.append(tableClone.html());

            let wb = XLSX.utils.table_to_book(tempTable[0], {
                sheet: "Purchase Payment Report",
            });

            let ws = wb.Sheets["Purchase Payment Report"];
            ws["!cols"] = [
                { wch: 15 }, 
                { wch: 15 }, 
                { wch: 12 },
                { wch: 15 },
                { wch: 12 },
                { wch: 12 },
                { wch: 12 },
            ];

            XLSX.writeFile(wb, "purchase_payment_report.xlsx");
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
});
