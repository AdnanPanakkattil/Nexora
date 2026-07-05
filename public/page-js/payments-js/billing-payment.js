const manualEntries = {};

$(document).ready(function () {
    $("#paymnets_main_menu").addClass("active open menu-item-animating");
    $("#billing_payments_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    flatpickr("#flatpickr-date", {
        dateFormat: "Y-m-d",
        defaultDate: new Date(),
    });

    
var urlParams = new URLSearchParams(window.location.search);
var clientId = urlParams.get('clientId');

if (clientId) {
    $.ajax({
        url: BASE_URL + "/payments/search-bill-by-client-name",
        method: "GET",
        data: { clientName_en: " " }, 
        success: function () {}
    });

    $.ajax({
        url: BASE_URL + "/payments/get-bill-payments-based-on-patient/" + clientId,
        method: "GET",
        success: function (response) {
            if (response.status === true && response.data.length > 0) {
                var client = response.data[0].client;

                var option = new Option(client.clientName_en, clientId, true, true);
                $("#patient_search").append(option).trigger('change');

                appendBillingPaymentsBasedOnPatient(clientId);
            }
        },
        error: function (err) {
            console.error("Error auto-loading client:", err);
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

    $("#invoice_search").select2("destroy");
        $("#invoice_search")
        .    wrap('<div class="position-relative"></div>')
        .select2({
        dropdownParent: $("#invoice_search").parent(),
        width: "100%",
        placeholder: "Search Invoice Number",
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/payments/search-bill-by-invoice-number",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    serviceOrderMasterId: params.term,
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

    function formatRepoPatient(repo) {
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

    function formatRepoPatientSelection(repo) {
        return repo.text || repo.id;
    }
    $("#patient_search").select2("destroy");
        $("#patient_search")
        .wrap('<div class="position-relative"></div>')
        .select2({
        dropdownParent: $("#patient_search").parent(),
        width: "100%",
        placeholder: "Search Patient Name",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url: BASE_URL + "/payments/search-bill-by-client-name",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    clientName_en: params.term,
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
        templateResult: formatRepoPatient,
        templateSelection: formatRepoPatientSelection,
    });

    $("#patient_search_btn").on("click", function () {
        let clientId = $("#patient_search").val();

        if (clientId) {
            appendBillingPaymentsBasedOnPatient(clientId);
        } else {
            Swal.fire({
                icon: "error",
                text: "Please select a Patient first!",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        }
    });

    $("#invoice_search_btn").on("click", function () {
        let invoiceId = $("#invoice_search").val();

        if (invoiceId) {
            appendBillingPaymentsBasedOnInvoice(invoiceId);
        } else {
            Swal.fire({
                icon: "error",
                text: "Please select a Patient first!",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
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
    const clientData  = $("#patient_search").select2("data")[0];
    const invoiceData = $("#invoice_search").select2("data")[0];

    if (!clientData && !invoiceData) {
        Swal.fire({
            icon: "error",
            text: "Please select a Patient first!",
            customClass: {
                confirmButton: "btn btn-danger waves-effect waves-light",
            },
        });
        return;
    }

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

    const totalPayAmount     = parseFloat($("#total").text().replace(/,/g, "")) || 0;
    const cashAmount         = parseFloat($("#cash_amount").val()) || 0;
    const bankAmount         = parseFloat($("#bank_amount").val()) || 0;
    const otherPaymentAmount = parseFloat($("#otherPayment_amount").val()) || 0;
    const calculatedTotal    = cashAmount + bankAmount + otherPaymentAmount;

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

   
    const payments = [];
    let isOverpaid = false;

    $("table tbody tr").each(function () {
        const amount  = parseFloat($(this).find(".pay").val()) || 0;
        const balance = parseFloat($(this).find(".balance").text().replace(/,/g, "")) || 0;

        if (amount > balance) {
            isOverpaid = true;
            return false; 
        }

        if (amount > 0) {
            payments.push({
                serviceOrderMasterId: $(this).data("id"),
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

 
    const InvoiceData = {
        clientId:            clientData.id,
        voucher_date:        $("#flatpickr-date").val(),
        voucher_no:          $("#voucher_no").val(),
        cash_amount:         cashAmount,
        bank_amount:         bankAmount,
        otherPayment_amount: otherPaymentAmount,
        otherPaymentTypeId:  $("#otherPaymentType").val(),
        subAccountHead1:     $("#subAccountHead1").val(),
        subAccountHead2:     $("#subAccountHead2").val(),
        subAccountHead3:     $("#subAccountHead3").val(),
        payments:            payments,
        financialYearId:     financialYearId,
    };


   $.ajax({
    url: "billing-payment",
    method: "POST",
    data: InvoiceData,
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
                window.location.href =
                    BASE_URL + "/payments/billing-payment/receipt/" + response.invoiceId;
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
    }
});
});

});

function appendBillingPaymentsBasedOnPatient(clientId) {
    $.ajax({
        url:
            BASE_URL +
            "/payments/get-bill-payments-based-on-patient/" +
            clientId,
        method: "GET",
        beforeSend: function () {
            $("#datatable-loader").show();
            $("#billing_payment_tbody tr:not(#datatable-loader)").remove();
        },
        success: function (response) {
            if (response.status === true) {
                console.log(response.data);

                let tbody = $("#billing_payment_tbody");
                let totalBill = 0;
                let totalPaid = 0;
                let totalBalance = 0;
                response.data.forEach((invoice) => {
                    const isDisabled = invoice.balance == 0 ? "disabled" : "";
                    const billDate = invoice.billIssuedDate
                        ? invoice.billIssuedDate.split(" ")[0]
                        : "N/A";
                    let row = `
                    <tr data-id="${invoice.serviceOrderMasterId}">
                        <td>${invoice.serviceOrderMasterId}</td>
                        <td>${invoice.masterIdNumber}</td>
                        <td>${billDate}</td>
                        <td class="bill_total">${invoice.totalAmount}</td>
                        <td class="amount_paid">${invoice.paidAmount}</td>
                        <td class="balance">${invoice.balance}</td>
                        <td><input type="number" class="pay form-control" ${isDisabled}></td>
                    </tr>
                `;
                    totalBill +=
                        parseFloat(
                            invoice.totalAmount.toString().replace(/,/g, "")
                        ) || 0;
                    totalPaid +=
                        parseFloat(
                            invoice.paidAmount.toString().replace(/,/g, "")
                        ) || 0;
                    totalBalance +=
                        parseFloat(
                            invoice.balance.toString().replace(/,/g, "")
                        ) || 0;

                    $("#datatable-loader").hide();
                    tbody.append(row);
                    $("#bill_total").text(totalBill.toFixed(2));
                    $("#amount_paid_total").text(totalPaid.toFixed(2));
                    $("#balance_total").text(totalBalance.toFixed(2));
                    updateTotalPay();
                });

                $("#patient_name_span").text(
                    response.data[0].client.clientName_en
                );
                $("#patient_name_details").text(
                    response.data[0].client.clientName_en
                );

                $("#patient_no_span").text(response.data[0].client.idNational);

                $("#address").text(response.data[0].client.address);
                $("#building_no").text(response.data[0].client.building_no);
                $("#patient_city").text(
                    response.data[0].client.district?.city?.cityName_en
                );
                $("#patient_district").text(
                    response.data[0].client.district?.districtName_en
                );
                $("#patient_country").text(
                    response.data[0].client.nationality?.nationalityName_en
                );
                $("#patient_postal_code").text(
                    response.data[0].client.post_code
                );
                $("#patient_occupation").text(
                    response.data[0].client.occupation
                );
                $("#patient_mobile").text(response.data[0].client.mobile);
            }
        },
        error: function (err) {
            console.error("Error fetching edit data:", err);
        },
    });
}

function appendBillingPaymentsBasedOnInvoice(invoiceId) {
    $.ajax({
        url:
            BASE_URL +
            "/payments/get-bill-payments-based-on-invoice/" +
            invoiceId,
        method: "GET",
        beforeSend: function () {
            $("#datatable-loader").show();
            $("#billing_payment_tbody tr:not(#datatable-loader)").remove();
        },
        success: function (response) {
            if (response.status === true) {
                let tbody = $("#billing_payment_tbody");
                let totalBill = 0;
                let totalPaid = 0;
                let totalBalance = 0;
                response.data.forEach((invoice) => {
                    const isDisabled = invoice.balance == 0 ? "disabled" : "";
                    const billDate = invoice.billIssuedDate
                        ? invoice.billIssuedDate.split(" ")[0]
                        : "N/A";
                    let row = `
                    <tr data-id="${invoice.invoiceId}">
                        <td>${invoice.serviceOrderMasterId}</td>
                        <td>${invoice.masterIdNumber}</td>
                        <td>${billDate}</td>
                        <td class="bill_total">${invoice.totalAmount}</td>
                        <td class="amount_paid">${invoice.paidAmount}</td>
                        <td class="balance">${invoice.balance}</td>
                        <td><input type="number" class="pay form-control" ${isDisabled}></td>
                    </tr>
                `;
                    totalBill +=
                        parseFloat(
                            invoice.totalAmount.toString().replace(/,/g, "")
                        ) || 0;
                    totalPaid +=
                        parseFloat(
                            invoice.paidAmount.toString().replace(/,/g, "")
                        ) || 0;
                    totalBalance +=
                        parseFloat(
                            invoice.balance.toString().replace(/,/g, "")
                        ) || 0;

                    $("#datatable-loader").hide();
                    tbody.append(row);
                    $("#bill_total").text(totalBill.toFixed(2));
                    $("#amount_paid_total").text(totalPaid.toFixed(2));
                    $("#balance_total").text(totalBalance.toFixed(2));
                    updateTotalPay();
                });

                let client = response.data[0].client;
                if (client) {
                    $("#patient_no_span").text(client.idNational);
                    $("#address").text(client.address);
                    $("#building_no").text(client.building_no);
                    $("#patient_city").text(client.district?.city?.cityName_en);
                    $("#patient_district").text(
                        client.district?.districtName_en
                    );
                    $("#patient_country").text(
                        client.nationality?.nationalityName_en
                    );
                    $("#patient_postal_code").text(client.post_code);
                    $("#patient_occupation").text(client.occupation);
                    $("#patient_mobile").text(client.mobile);

                    $("#patient_name_span").text(client.clientName_en);
                    $("#patient_name_details").text(client.clientName_en);
                }
            }
        },
        error: function (err) {
            console.error("Error fetching edit data:", err);
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
