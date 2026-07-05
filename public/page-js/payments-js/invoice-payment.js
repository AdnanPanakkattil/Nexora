const manualEntries = {};

$(document).ready(function () {
    $("#paymnets_main_menu").addClass("active open menu-item-animating");
    $("#payments_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    flatpickr("#flatpickr-date", {
        dateFormat: "Y-m-d",
        defaultDate: new Date(),
    });

    // Auto-load customer data if customerId is in URL
var urlParams = new URLSearchParams(window.location.search);
var customerId = urlParams.get('customerId');

if (customerId) {
    // Fetch customer name to pre-populate the select2
    $.ajax({
        url: BASE_URL + "/payments/search-invoice-by-customer-name",
        data: { customerName: "" },  // we'll fetch by ID directly below
        method: "GET",
    });

    // Directly load invoices for this customer
    appendInvoicePaymentsBasedOnCustomer(customerId);

    // Also pre-select the customer in the select2 dropdown
    $.ajax({
        url: BASE_URL + "/payments/get-invoice-payments-based-on-customer/" + customerId,
        method: "GET",
        success: function (response) {
            if (response.status === true && response.data.length > 0) {
                var customer = response.data[0].customer;
                if (customer) {
                    var option = new Option(customer.customerName, customer.regularCustomerId, true, true);
                    $("#customer_search").append(option).trigger("change");
                }
            }
        }
    });
}

    // $("#otherPaymentType").select2({
     $("#otherPaymentType").select2("destroy");
        $("#otherPaymentType")
        .wrap('<div class="position-relative"></div>')
        .select2({
        dropdownParent: $("#otherPaymentType").parent(),
        width: "100%",
        placeholder: "Select Payment Type",
        allowClear: true,
        minimumResultsForSearch: -1,
        ajax: {
            url: BASE_URL + "/payments/get-other-payment-types",
            dataType: "json",
            delay: 250,
            processResults: function (data) {
                return {
                    results: data,
                };
            },
            cache: true,
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
    });

    function formatRepo(repo) {
        if (repo.loading) {
            return repo.text;
        }

        var markup =
            "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" +
            repo.text +
            "</div>";

        markup += "</div></div>";

        return markup;
    }

    function formatRepoSelection(repo) {
        return repo.text || repo.id;
    }

    // $("#invoice_search").select2({
    $("#invoice_search").select2("destroy");
        $("#invoice_search")
        .wrap('<div class="position-relative"></div>')
        .select2({
        dropdownParent: $("#invoice_search").parent(),
        width: "100%",
        placeholder: "Search Invoice Number",
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/payments/search-invoice-by-invoice-number",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    invoiceNo: params.term,
                };
            },
            processResults: function (data) {
                return {
                    results: data,
                };
            },
            cache: true,
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
    });

    function formatRepoCustomer(repo) {
        if (repo.loading) {
            return repo.text;
        }

        var markup =
            "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" +
            repo.text +
            "</div>";

        markup += "</div></div>";

        return markup;
    }

    function formatRepoCustomerSelection(repo) {
        return repo.text || repo.id;
    }

    // $("#customer_search").select2({
      $("#customer_search").select2("destroy");
        $("#customer_search")
        .wrap('<div class="position-relative"></div>')
        .select2({
        dropdownParent: $("#customer_search").parent(),
        width: "100%",
        placeholder: "Search Customer Name",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url: BASE_URL + "/payments/search-invoice-by-customer-name",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    customerName: params.term,
                };
            },
            processResults: function (data) {
                return {
                    results: data,
                };
            },
            cache: true,
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: formatRepoCustomer,
        templateSelection: formatRepoCustomerSelection,
    });

    $("#customer_search_btn").on("click", function () {
        let customerId = $("#customer_search").val();

        if (customerId) {
            appendInvoicePaymentsBasedOnCustomer(customerId);
        } else {
            alert("Please select a customer first!");
        }
    });

    $("#invoice_search_btn").on("click", function () {
        let invoiceId = $("#invoice_search").val();

        if (invoiceId) {
            appendInvoicePaymentsBasedOnInvoice(invoiceId);
        } else {
            alert("Please select a customer first!");
        }
    });

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

    $(document).on("input", ".pay", function () {
        const $input = $(this);
        const enteredAmount = parseFloat($input.val()) || 0;
        const $row = $input.closest("tr");
        const balance =
            parseFloat($row.find("td:nth-child(6)").text().replace(/,/g, "")) ||
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

    // Handle checkbox changes -  Only distribute if a checkbox is changed
    $(".payment-checkbox").on("change", function () {
        distributePaymentAmount();
    });

    // Handle manual input in payment fields
    $("#cash_amount, #bank_amount, #otherPayment_amount").on(
        "input",
        function () {
            const inputId = $(this).attr("id");
            const enteredAmount = parseFloat($(this).val()) || 0;

            if (!isNaN(enteredAmount)) {
                manualEntries[inputId] = enteredAmount;
            } else {
                delete manualEntries[inputId];
            }
            distributePaymentAmount();
        }
    );

   $("#saveBtn").on("click", function () {
    const customerData = $("#customer_search").select2("data")[0];
    const invoiceData  = $("#invoice_search").select2("data")[0];

    // Resolve customerId — from customer search OR from stored data when searched by invoice
    let resolvedCustomerId = customerData ? customerData.id : null;

    if (!resolvedCustomerId) {
        resolvedCustomerId = $("#invoice_payment_tbody").data("customerId");
    }

    if (!resolvedCustomerId) {
        Swal.fire({
            icon: "error",
            text: "Please select a Customer or search by Invoice first!",
            customClass: {
                confirmButton: "btn btn-danger waves-effect waves-light",
            },
        });
        return;
    }

    // Validate at least one payment method is selected
    const cashChecked         = $("#cash").is(":checked");
    const bankChecked         = $("#bank").is(":checked");
    const otherPaymentChecked = $("#otherPayment").is(":checked");

    if (!cashChecked && !bankChecked && !otherPaymentChecked) {
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
    const totalPayAmount      = parseFloat($("#total").text().replace(/,/g, "")) || 0;
    const cashAmount          = parseFloat($("#cash_amount").val()) || 0;
    const bankAmount          = parseFloat($("#bank_amount").val()) || 0;
    const otherPaymentAmount  = parseFloat($("#otherPayment_amount").val()) || 0;
    const calculatedTotal     = cashAmount + bankAmount + otherPaymentAmount;

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
        const amount  = parseFloat($(this).find(".pay").val()) || 0;
        const balance = parseFloat($(this).find(".balance").text().replace(/,/g, "")) || 0;

        if (amount > balance) {
            isOverpaid = true;
            return false; // break out of .each
        }

        if (amount > 0) {
            payments.push({
                invoiceId: $(this).data("id"),
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
    const InvoiceData = {
        regularCustomerId:    resolvedCustomerId,
        voucher_date:         $("#flatpickr-date").val(),
        voucher_no:           $("#voucher_no").val(),
        cash_amount:          cashAmount,
        bank_amount:          bankAmount,
        otherPayment_amount:  otherPaymentAmount,
        otherPaymentTypeId:   $("#otherPaymentType").val(),
        subAccountHead1:      $("#subAccountHead1").val(),
        subAccountHead2:      $("#subAccountHead2").val(),
        subAccountHead3:      $("#subAccountHead3").val(),
        payments:             payments,
        financialYearId:      financialYearId,
    };

    // Send data to server
    $.ajax({
        url:    "invoice-payment",
        method: "POST",
        data:   InvoiceData,
         beforeSend: function () {      
        $("#loader-overlay").show();
    },
        success: function (response) {
             $("#loader-overlay").hide();
            if (response.success) {
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: {
                        confirmButton: "btn btn-success waves-effect waves-light",
                    },
                }).then(() => {
                      window.location.href = BASE_URL + '/payments/invoice-payment/' + response.invoiceId + '/receipt';
                });
            } else {
                Swal.fire({
                    icon: "error",
                    text: response.message,
                    customClass: {
                        confirmButton: "btn btn-danger waves-effect waves-light",
                    },
                });
            }
        },
        error: function (xhr) {
             $("#loader-overlay").hide();
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
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        },
    });
});
});

function appendInvoicePaymentsBasedOnCustomer(customerId) {
    $.ajax({
        url: BASE_URL + "/payments/get-invoice-payments-based-on-customer/" + customerId,
        method: "GET",
        beforeSend: function () {
            $("#datatable-loader").show();
            $("#invoice_payment_tbody tr:not(#datatable-loader)").remove();
        },
        success: function (response) {
            $("#datatable-loader").hide(); // ← MOVED OUT of forEach

            if (response.status === true) {
                let tbody = $("#invoice_payment_tbody");
                let totalBill = 0, totalPaid = 0, totalBalance = 0;

                if (response.data.length === 0) {
                    tbody.append(`<tr><td colspan="7" class="text-center text-muted">No invoices found for this customer.</td></tr>`);
                    $("#bill_total").text("0.00");
                    $("#amount_paid_total").text("0.00");
                    $("#balance_total").text("0.00");
                    $("#total").text("0.00");
                    return;
                }

                response.data.forEach((invoice, index) => {
                    const isDisabled = invoice.balance == 0 ? "disabled" : "";
                    let row = `
                        <tr data-id="${invoice.invoiceId}">
                            <td>${invoice.invoiceNo}</td>
                            <td>${invoice.invoiceNoNumeric}</td>
                            <td>${invoice.invoiceDate.split("T")[0]}</td>
                            <td class="bill_total">${invoice.totalAmountWithVat}</td>
                            <td class="amount_paid">${invoice.paidAmount}</td>
                            <td class="balance">${invoice.balance}</td>
                            <td><input type="number" class="pay form-control" ${isDisabled}></td>
                        </tr>`;

                    totalBill    += parseFloat(invoice.totalAmountWithVat.toString().replace(/,/g, "")) || 0;
                    totalPaid    += parseFloat(invoice.paidAmount.toString().replace(/,/g, "")) || 0;
                    totalBalance += parseFloat(invoice.balance.toString().replace(/,/g, "")) || 0;

                    tbody.append(row);
                });

                $("#bill_total").text(totalBill.toFixed(2));
                $("#amount_paid_total").text(totalPaid.toFixed(2));
                $("#balance_total").text(totalBalance.toFixed(2));
                updateTotalPay();

                let customer = response.data[0].customer;
                $("#customer_name_span").text(customer.customerName);
                $("#customer_name_details").text(customer.customerName);
                $("#customer_no_span").text(customer.customerNo);
                $("#addl_no").text(customer.addlNo);
                $("#building_no").text(customer.buildingNo);
                $("#customer_city").text(customer.city);
                $("#customer_district").text(customer.district);
                $("#customer_country").text(customer.country);
                $("#customer_postal_code").text(customer.postalCode);
                $("#customer_vat_no").text(customer.vatNumber);
                $("#customer_mobile").text(customer.mobileNumber);
            }
        },
        error: function (err) {
            console.error("Error fetching data:", err);
            $("#datatable-loader").hide();
        },
    });
}

function appendInvoicePaymentsBasedOnInvoice(invoiceId) {
    $.ajax({
        url: BASE_URL + "/payments/get-invoice-payments-based-on-invoice/" + invoiceId,
        method: "GET",
        beforeSend: function () {
            $("#datatable-loader").show();
            $("#invoice_payment_tbody tr:not(#datatable-loader)").remove();
        },
        success: function (response) {
            $("#datatable-loader").hide(); // ← MOVED OUT of forEach

            if (response.status === true) {
                let tbody = $("#invoice_payment_tbody");
                let totalBill = 0, totalPaid = 0, totalBalance = 0;

                if (response.data.length === 0) {
                    tbody.append(`<tr><td colspan="7" class="text-center text-muted">No invoices found.</td></tr>`);
                    return;
                }

                response.data.forEach((invoice) => {
                    const isDisabled = invoice.balance == 0 ? "disabled" : "";
                    let row = `
                        <tr data-id="${invoice.invoiceId}">
                            <td>${invoice.invoiceNo}</td>
                            <td>${invoice.invoiceNoNumeric}</td>
                            <td>${invoice.invoiceDate.split("T")[0]}</td>
                            <td class="bill_total">${invoice.totalAmountWithVat}</td>
                            <td class="amount_paid">${invoice.paidAmount}</td>
                            <td class="balance">${invoice.balance}</td>
                            <td><input type="number" class="pay form-control" ${isDisabled}></td>
                        </tr>`;

                    totalBill    += parseFloat(invoice.totalAmountWithVat.toString().replace(/,/g, "")) || 0;
                    totalPaid    += parseFloat(invoice.paidAmount.toString().replace(/,/g, "")) || 0;
                    totalBalance += parseFloat(invoice.balance.toString().replace(/,/g, "")) || 0;

                    tbody.append(row);
                });

                $("#bill_total").text(totalBill.toFixed(2));
                $("#amount_paid_total").text(totalPaid.toFixed(2));
                $("#balance_total").text(totalBalance.toFixed(2));
                updateTotalPay();

                let customer = response.data[0].customer;
                if (customer) {
                    $("#customer_name_span").text(customer.customerName);
                    $("#customer_name_details").text(customer.customerName);
                    $("#customer_no_span").text(customer.customerNo);
                    $("#addl_no").text(customer.addlNo);
                    $("#building_no").text(customer.buildingNo);
                    $("#customer_city").text(customer.city);
                    $("#customer_district").text(customer.district);
                    $("#customer_country").text(customer.country);
                    $("#customer_postal_code").text(customer.postalCode);
                    $("#customer_vat_no").text(customer.vatNumber);
                    $("#customer_mobile").text(customer.mobileNumber);
                }
            }
        },
        error: function (err) {
            console.error("Error fetching data:", err);
            $("#datatable-loader").hide();
        },
    });
}

function updateTotalPay() {
    let total = 0;
    $(".pay").each(function () {
        let val = parseFloat($(this).val());
        if (!isNaN(val)) {
            total += val;
        }
    });
    $("#total").text(formatNumber(total));
}

function formatNumber(num) {
    return (Math.round(num * 100) / 100).toFixed(2);
}

function distributePaymentAmount() {
    const totalPayAmount =
        parseFloat($("#total").text().replace(/,/g, "")) || 0;
    const checkedBoxes = $(".payment-checkbox:checked");

    if (checkedBoxes.length === 0 || totalPayAmount === 0) {
        $("#cash_amount, #bank_amount, #otherPayment_amount").val("");
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
