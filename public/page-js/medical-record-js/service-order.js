// let serviceRowIndex = 0;
$(document).ready(function () {
    function serviceOrderInputs() {
        const isFixed = $("#service_order_fixed_discount").is(":checked");
        const isPercentage = $("#service_order_percentage_discount").is(":checked");
        const vatEnabled = $("#vat_enabled").val() != "0";

        $("#service_order_table tbody tr").each(function () {
            const $row = $(this);
            const price = parseFloat($row.find(".service-price").val()) || 0;
            const qty = parseFloat($row.find(".service-quantity").val()) || 1;
            const discPercent = $row.find(".service-discount-percentage-visible, .manual-service-discount-percentage-visible");
            const discAmt = $row.find(".service-discount-visible, .manual-service-discount-visible");
            const vatPercent = $row.find(".service-tax-percentage-visible, .manual-service-tax-percentage-visible");
            const vatAmt = $row.find(".service-tax-amount-visible, .manual-service-tax-visible");

            if (isFixed) {
                discPercent.prop("disabled", true);
                vatPercent.prop("disabled", true);
                discAmt.prop("disabled", false);
                vatAmt.prop("disabled", false);
            } else if (isPercentage) {
                discPercent.prop("disabled", false);
                vatPercent.prop("disabled", false);
                discAmt.prop("disabled", true);
                vatAmt.prop("disabled", true);
            }
            if (!vatEnabled) {
                vatPercent.prop("disabled", true);
                vatAmt.prop("disabled", true);
            }
        });
    }

    // Run sync on load
    window.serviceOrderInputs = serviceOrderInputs;
    serviceOrderInputs();

    // Toggle logic for checkboxes
    //    $("#service_order_fixed_discount, #service_order_percentage_discount").on("change", function () {

    //         if (!$(this).is(":checked")) return;

    //         $("input[name='service_order_discount_type']").not(this).prop('checked', false);

    //         const isFixed = $("#service_order_fixed_discount").is(":checked");

    //         serviceOrderInputs();

    //         $("#service_order_table tbody tr").each(function () {

    //             const $row = $(this);

    //             let price = parseFloat($row.find(".service-price").val()) || 0;
    //             let qty = parseFloat($row.find(".service-quantity").val()) || 1;
    //             let baseTotal = price * qty;

    //             let $discPercent = $row.find(".service-discount-percentage-visible, .manual-service-discount-percentage-visible");
    //             let $discAmt = $row.find(".service-discount-visible, .manual-service-discount-visible");

    //             let percentVal = parseFloat($discPercent.val()) || 0;
    //             let amountVal = parseFloat($discAmt.val()) || 0;

    //             if (isFixed) {
    //                 // % → amount (ONLY if amount empty)
    //                 if (amountVal === 0 && percentVal > 0) {
    //                     amountVal = (baseTotal * percentVal) / 100;
    //                     $discAmt.val(amountVal.toFixed(2));
    //                 }

    //                 // reset %
    //                 $discPercent.val(0);

    //             } else {
    //                 // amount → %
    //                 if (percentVal === 0 && amountVal > 0) {
    //                     percentVal = baseTotal > 0 ? (amountVal / baseTotal) * 100 : 0;
    //                     $discPercent.val(percentVal.toFixed(2));
    //                 }

    //                 // reset amount
    //                 $discAmt.val(0);
    //             }

    //             calculateServiceOrderTotalAmount($row);
    //         });

    //         calculateTotals();
    //     });
    $("#service_order_fixed_discount, #service_order_percentage_discount").on("change", function () {

        const $fixed = $("#service_order_fixed_discount");
        const $percentage = $("#service_order_percentage_discount");

        // Prevent both OFF
        if (!$fixed.is(":checked") && !$percentage.is(":checked")) {
            $(this).prop("checked", true);
            return;
        }

        // Prevent both ON
        if ($fixed.is(":checked") && $percentage.is(":checked")) {
            if ($(this).attr("id") === "service_order_fixed_discount") {
                $percentage.prop("checked", false);
            } else {
                $fixed.prop("checked", false);
            }
        }

        const isFixed = $fixed.is(":checked");

        serviceOrderInputs();

        $("#service_order_table tbody tr").each(function () {

            const $row = $(this);

            let price = parseFloat($row.find(".service-price").val()) || 0;
            let qty = parseFloat($row.find(".service-quantity").val()) || 1;
            let baseTotal = price * qty;

            let $discPercent = $row.find(".service-discount-percentage-visible, .manual-service-discount-percentage-visible");
            let $discAmt = $row.find(".service-discount-visible, .manual-service-discount-visible");

            let percentVal = parseFloat($discPercent.val()) || 0;
            let amountVal = parseFloat($discAmt.val()) || 0;

            if (isFixed) {
                if (amountVal === 0 && percentVal > 0) {
                    amountVal = (baseTotal * percentVal) / 100;
                    $discAmt.val(amountVal.toFixed(2));
                }
                $discPercent.val(0);
            } else {
                if (percentVal === 0 && amountVal > 0) {
                    percentVal = baseTotal > 0 ? (amountVal / baseTotal) * 100 : 0;
                    $discPercent.val(percentVal.toFixed(2));
                }
                $discAmt.val(0);
            }

            calculateServiceOrderTotalAmount($row);
        });

        calculateTotals();
        //  CLEAR ALL ERROR MESSAGES WHEN SWITCHING TYPE
        $("#service_order_table tbody tr").each(function () {
            $(this).find(".discount-error").text("").hide();
        });
    });


    // Handle add button click
    $(document).on("click", "#addServiceOrderBtn", function () {
        console.log("ADD BUTTON CLICKED");

        var serviceName = "";
        var serviceCode = " ";
        var toothNo = " ";
        // var fullText = $("#serviceId").text().trim();
        var fullText = $("#serviceId option:selected").text().trim();
        var match = fullText.match(
            /(.+?)\s*(?:\(([^)]+)\))?\s*-\s*\d+(\.\d+)?\s*$/
        );

        if (match) {
            serviceName = match[1].trim();
            serviceCode = match[2] ? match[2].trim() : "";
        } else {
            serviceName = fullText;
            serviceCode = "";
        }

        if ($("#serviceId").val()) {
            $.ajax({
                url:
                    BASE_URL +
                    "/medicalrecord-service-details/" +
                    $("#serviceId").val(),
                type: "get",
                success: function (response) {
                    // console.log(response);
                    if (response.status === true && response.data.length > 0) {
                        // console.log($('#vat_enabled').val());
                        console.log(response.data[0]); 
                        var service = response.data[0];
                        var serviceCost = service.cost;
                        // var vatPercent = $('#vat_enabled').val() == 0 ? 0 : service.vatPercent;
                    var vatEnabled = $("#vat_enabled").val() != "0";
                    var vatPercent = vatEnabled ? service.vatPercent : 0;
                    var vatDisabled = vatEnabled ? "" : "disabled"; 
                    var serviceId = service.serviceId;
                    // console.log(response.data[0]);
                    // Create a new table row without Discount Percentage column if fixed discount is checked
                        var discountPercentageColumn = "";
                        var discountAmountColumn = "";

                        if ($("#service_order_fixed_discount").is(":checked")) {
                           discountPercentageColumn = `<td class="service-order-disc-percentage">
                                <input type="text" class="form-control service-discount-percentage-visible" value="0" placeholder="Dizzscount Percentage" disabled>
                                <small class="text-danger discount-error"></small>
                                <input type="hidden" name="service_order[${serviceRowIndex}][discountPercentage]" class="service-discount-percentage-hidden">
                            </td>
                            <td class="service-order-disc-amount">
                                <input type="text" class="form-control service-discount-visible" placeholder="Discount Amount">
                                <small class="text-danger discount-error"></small>
                                <input type="hidden" name="service_order[${serviceRowIndex}][disAmount]" class="service-discount-hidden">
                            </td>`;
                        } else if (
                            $("#service_order_percentage_discount").is(":checked")
                        ) {
                            discountPercentageColumn = `<td class="service-order-disc-percentage">
                                <input type="text" class="form-control service-discount-percentage-visible" value="0" placeholder="Discount Percentage">
                                <small class="text-danger discount-error"></small>
                                <input type="hidden" name="service_order[${serviceRowIndex}][discountPercentage]" class="service-discount-percentage-hidden">
                            </td>
                            <td class="service-order-disc-amount">
                                <input type="text" class="form-control service-discount-visible" placeholder="Discount Amount" disabled>
                                <small class="text-danger discount-error"></small>
                                <input type="hidden" name="service_order[${serviceRowIndex}][disAmount]" class="service-discount-hidden">
                            </td>`;
                        }

                        var newRow = `
                            <tr>
                                <td class="service-order-name"><input type="hidden" class="service-id" name="service_order[${serviceRowIndex}][serviceId]" value="${serviceId}">${serviceName}</td>
                                <td class="service-order-code">${service.serviceCode ?? '-'}</td>
                                
                                <td class="service-order-toothNo">
                                    <input type="number" class="form-control" placeholder="toothNo" name="service_order[${serviceRowIndex}][toothNo]" value="">
                                </td>
                                <td class="service-order-quantity">
                                    <input type="number" class="form-control service-quantity" placeholder="Quantity" name="service_order[${serviceRowIndex}][qty]" value="1" min="1">
                                </td>
                                <td class="service-order-price">
                                    <input type="text" class="form-control service-price" placeholder="Price" name="service_order[${serviceRowIndex}][cost]" value="${serviceCost}" disabled>
                                </td>
                                ${discountPercentageColumn}
                                
                                <td class="service-order-vat-percentage">
                                    <input type="text" class="form-control service-tax-percentage-visible" placeholder="VAT %" value="${vatPercent}" ${vatDisabled}>
                                    <input type="hidden" name="service_order[${serviceRowIndex}][manuelTaxPercentage]" class="service-tax-percentage-hidden" value="${vatPercent}">
                                </td>
                                <td class="service-order-vat-amount">
                                    <input type="text" class="form-control service-tax-amount-visible" placeholder="VAT Amount" value="">
                                    <input type="hidden" name="service_order[${serviceRowIndex}][manuelTaxCost]" class="service-tax-amount-hidden" value="">
                                </td>
                                <td class="service-order-total-amount">
                                    <input type="text" class="form-control service-total-amount-visible" placeholder="Total Amount">
                                    <input type="hidden" name="service_order[${serviceRowIndex}][netCost]" class="service-total-amount-hidden">
                                </td>
                                <td>
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>
                        `;

                        // $("#service_order_tbody").append(newRow);
                        // serviceRowIndex++; 
                        // serviceOrderInputs();
                        $("#service_order_tbody").append(newRow);

                        let $row = $("#service_order_tbody tr:last");

                        calculateServiceOrderTotalAmount($row);

                        serviceRowIndex++; 
                        serviceOrderInputs();
                    } else {
                        // console.error("Service details not found");
                    }
                },
                error: function (xhr, status, error) {
                    // console.error("Error:", error);
                },
                
            });
        }

        // $("#serviceId").text("");
        // $("#serviceId").val("");
        $("#serviceId").val(null).trigger("change");
    });
    $(document).on("input", ".service-quantity", function () {
        if ($(this).val() < 1) {
            $(this).val(1);
        }
    });

    $(document).on("click", "#addServiceManuel", function () {


        // var vatPercent = $('#vat_enabled').val() == 0 ? 0 : service.vatPercent;
        // console.log($('input[name="service_tax[]"]').eq(0).val());
        if ($('input[name="service_tax[]"]').eq(0).val() == undefined) {
            // console.log($('input[name="service_tax[]"]').eq(0).val() == undefined);
            var vatEnabled = $("#vat_enabled").val() == 1 ? 15 : 0;
        } else {
            var vatEnabled = $('input[name="service_tax[]"]').eq(0).val();
        }
        var vatDisabledAttr = $("#vat_enabled").val() != "0" ? "" : "disabled";

        var discountPercentageColumn = "";

        if ($("#service_order_fixed_discount").is(":checked")) {
            discountPercentageColumn = `<td class="service-order-disc-percentage">
                                    <input type="text" class="form-control manual-service-discount-percentage-visible" placeholder="Discount Percentage" value="" disabled>
                                    <input type="hidden" name="service_order[${serviceRowIndex}][discountPercentage]" class="manual-service-discount-percentage-hidden">
                                </td>
                                <td class="service-order-disc-amount">
                                    <input type="text" class="form-control manual-service-discount-visible" placeholder="Discount Amount">
                                    <small class="text-danger discount-error"></small>
                                    <input type="hidden" name="service_order[${serviceRowIndex}][disAmount]" class="manual-service-discount-hidden">
                                </td>`;
        } else if ($("#service_order_percentage_discount").is(":checked")) {
            discountPercentageColumn = `<td class="service-order-disc-percentage">
                                    <input type="text" class="form-control manual-service-discount-percentage-visible" placeholder="Discount Percentage" value="">
                                    <small class="text-danger discount-error"></small>
                                    <input type="hidden" name="service_order[${serviceRowIndex}][discountPercentage]" class="manual-service-discount-percentage-hidden">
                                </td>
                                <td class="service-order-disc-amount">
                                    <input type="text" class="form-control service-discount-percentage-visible" value="0" placeholder="Discount Percentage">
                                    <small class="text-danger discount-error"></small>
                                    <input type="hidden" name="service_order[${serviceRowIndex}][discountPercentage]" class="service-discount-percentage-hidden">
                                </td>`;
        }

        var newRow = `
                            <tr>
                                <td class="service-order-name"><input type="text" class="service-id form-control" name="service_order[${serviceRowIndex}][manualServiceName]" value=""></td>
                                <td class="service-order-code"><input type="text" class="service-code form-control" name="service_order[${serviceRowIndex}][manualServiceCode]" value=""></td>
                                <td class="toothNo"><input type="text" class="toothNo form-control" name="service_order[${serviceRowIndex}][toothNo]" value=""></td>
                               
                                <td class="service-order-quantity">
                                    <input type="number" class="form-control service-quantity" placeholder="Quantity" name="service_order[${serviceRowIndex}][qty]" value="1">
                                </td>
                                <td class="service-order-price">
                                    <input type="text" class="form-control service-price" placeholder="Price" name="service_order[${serviceRowIndex}][cost]" value="">
                                </td>
                                ${discountPercentageColumn}
                                
                                <td class="service-order-vat-percentage">
                                    <input type="text" class="form-control manual-service-tax-percentage-visible" placeholder="VAT %" value="${vatEnabled}" ${vatDisabledAttr}>
                                    <input type="hidden" name="service_order[${serviceRowIndex}][manuelTaxPercentage]" class="manual-service-tax-percentage-hidden" value="${vatEnabled}">
                                </td>
                                <td class="service-order-vat-amount">
                                    <input type="text" class="form-control manual-service-tax-visible" placeholder="VAT Amount" value="">
                                    <input type="hidden" name="service_order[${serviceRowIndex}][manuelTaxCost]" class="manual-service-tax-hidden" value="">
                                </td>
                                <td class="service-order-total-amount">
                                    <input type="text" class="form-control manual-service-total-amount-visible" placeholder="Total Amount">
                                    <input type="hidden" name="service_order[${serviceRowIndex}][netCost]" class="manual-service-total-amount-hidden">
                                </td>
                                <td>
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>
                        `;

        // $("#service_order_tbody").append(newRow);
        // serviceRowIndex++; 
        // serviceOrderInputs();
        $("#service_order_tbody").append(newRow);

        let $row = $("#service_order_tbody tr:last");

        calculateServiceOrderTotalAmount($row);

        serviceRowIndex++; 
        serviceOrderInputs();

        $("#serviceId").text("");
        $("#serviceId").val("");
    });

    // Handle remove button click to remove row
    $(document).on("click", ".remove-row", function () {
        $(this).closest("tr").remove();
        calculateTotals();
    });
});

// Function to calculate the total amount in single row 
function calculateServiceOrderTotalAmount($row) {

    const isFixed = $("#service_order_fixed_discount").is(":checked");

    const price = parseFloat($row.find(".service-price").val()) || 0;
    const quantity = parseFloat($row.find(".service-quantity").val()) || 1;

    const baseTotal = price * quantity;

    let discountAmount = 0;
    let vatAmount = 0;
    let discountPercent = 0;

    let $discPercentVisible = $row.find(".service-discount-percentage-visible, .manual-service-discount-percentage-visible");
    let $discAmtVisible = $row.find(".service-discount-visible, .manual-service-discount-visible");
    let $vatPercentVisible = $row.find(".service-tax-percentage-visible, .manual-service-tax-percentage-visible");
    let $vatAmtVisible = $row.find(".service-tax-amount-visible, .manual-service-tax-visible");
    let $totalVisible = $row.find(".service-total-amount-visible, .manual-service-total-amount-visible");

    let $discPercentHidden = $row.find(".service-discount-percentage-hidden, .manual-service-discount-percentage-hidden");
    let $discAmtHidden = $row.find(".service-discount-hidden, .manual-service-discount-hidden");
    let $vatPercentHidden = $row.find(".service-tax-percentage-hidden, .manual-service-tax-percentage-hidden");
    let $vatAmtHidden = $row.find(".service-tax-amount-hidden, .manual-service-tax-hidden");
    let $totalHidden = $row.find(".service-total-amount-hidden, .manual-service-total-amount-hidden");


    //  DISCOUNT FROM BASE
    if (isFixed) {

        discountAmount = parseFloat($discAmtVisible.val()) || 0;

        if (discountAmount > baseTotal) {
            discountAmount = baseTotal;
            $discAmtVisible.val(baseTotal.toFixed(2));
        }

        discountPercent = baseTotal > 0 ? (discountAmount / baseTotal) * 100 : 0;

        $discPercentVisible.val(discountPercent.toFixed(2));

    } else {

        discountPercent = parseFloat($discPercentVisible.val()) || 0;

        discountAmount = (baseTotal * discountPercent) / 100;

        $discAmtVisible.val(discountAmount.toFixed(2));
    }

    const taxableAmount = baseTotal - discountAmount;
    //now vat from taxable amount
    const vatPercent = parseFloat($vatPercentHidden.val()) || parseFloat($vatPercentVisible.val()) || 0;
    vatAmount = (taxableAmount * vatPercent) / 100;

    //  TOTAL
    const totalAmount = taxableAmount + vatAmount;

    // UI update
    $vatAmtVisible.val(vatAmount.toFixed(2));
    $totalVisible.val(totalAmount.toFixed(2));

    // hidden
    $discPercentHidden.val(discountPercent.toFixed(2));
    $discAmtHidden.val(discountAmount.toFixed(2));
    $vatPercentHidden.val(vatPercent);
    $vatAmtHidden.val(vatAmount.toFixed(2));
    $totalHidden.val(totalAmount.toFixed(2));

    calculateTotals();
}

function calculateTotals() {
    let totalAmountSum = 0;
    let discountAmountSum = 0;
    let vatAmountSum = 0;
    let grossAmountSum = 0;

    $("#service_order_table tbody tr").each(function () {
        const $row = $(this);
        const price = parseFloat($row.find(".service-price").val()) || 0;
        const qty = parseFloat($row.find(".service-quantity").val()) || 1; 
        const rowTotal = parseFloat($row.find(".service-total-amount-hidden, .manual-service-total-amount-hidden").val()) || 0;
        const rowDiscount = parseFloat($row.find(".service-discount-hidden, .manual-service-discount-hidden").val()) || 0;
        const rowVat = parseFloat($row.find(".service-tax-amount-hidden, .manual-service-tax-hidden").val()) || 0;
        grossAmountSum += price * qty;
        totalAmountSum += rowTotal;
        discountAmountSum += rowDiscount;
        vatAmountSum += rowVat;
    });

    $("#total_gross_amount_td").text(grossAmountSum.toFixed(2));
    $("#total_amount_sum").val(totalAmountSum.toFixed(2));
    $("#total_discount_sum").val(discountAmountSum.toFixed(2));
    $("#total_discount_sum_td").text(discountAmountSum.toFixed(2));
    $("#total_vat_sum").val(vatAmountSum.toFixed(2));
    $("#total_vat_sum_td").text(vatAmountSum.toFixed(2));
    $("#service_order_net_amount").val(totalAmountSum.toFixed(2));
    $("#service_order_net_amount_display").text(totalAmountSum.toFixed(2));
}

$(document).on(
    "input",
    ".service-quantity, .service-discount-percentage-visible, .manual-service-discount-percentage-visible, .service-discount-visible, .manual-service-discount-visible, .service-tax-percentage-visible, .manual-service-tax-percentage-visible",
    function () {
        let $row = $(this).closest("tr");
        calculateServiceOrderTotalAmount($row);
    }
);


// Global Event Handlers for Inputs
// $(document).on("input", "#service_order_table input", function () {

//     const $row = $(this).closest("tr");

//     if ($(this).hasClass("service-discount-percentage-visible") || 
//         $(this).hasClass("manual-service-discount-percentage-visible")) {

//         let discount = parseFloat($(this).val()) || 0;

//         if (discount > window.maxDiscount) {
//             alert("Maximum allowed discount is " + window.maxDiscount + "%");
//             $(this).val(window.maxDiscount);
//         }

//     }

//     if ($(this).hasClass("service-discount-visible") || 
//         $(this).hasClass("manual-service-discount-visible")) {

//         const price = parseFloat($row.find(".service-price").val()) || 0;
//         const qty = parseFloat($row.find(".service-quantity").val()) || 1;

//         const baseTotal = price * qty;

//         const discountAmount = parseFloat($(this).val()) || 0;

//         const discountPercent = baseTotal > 0 ? (discountAmount / baseTotal) * 100 : 0;

//         if (discountPercent > window.maxDiscount) {

//             alert("Maximum allowed discount is " + window.maxDiscount + "%");

//             const allowedAmount = (baseTotal * window.maxDiscount) / 100;

//             $(this).val(allowedAmount.toFixed(2));

//         }

//     }

//     calculateServiceOrderTotalAmount($row);

// });
// Watch for row removals or additions to update grand totals
// $("#service_order_tbody").on("DOMSubtreeModified", function () {
//     calculateTotals();
// });
$(document).on("input", ".service-discount-percentage-visible, .manual-service-discount-percentage-visible", function () {

    const discount = parseFloat($(this).val()) || 0;
    const $row = $(this).closest("tr");
    // const $error = $(this).siblings(".discount-error");
    const $error = $(this).closest("td").children(".discount-error");
    const input = $(this);

    $.ajax({
        url: BASE_URL + "/validate-discount",
        type: "POST",
        data: {
            discount: discount,
            _token: $('meta[name="csrf-token"]').attr('content')
        },
        success: function (response) {

            if (!response.status) {
                $error.text("Maximum allowed discount is " + response.max + "%").show();
                input.val(response.max);
            } else {
                setTimeout(() => {
                    $error.text("").hide();
                }, 1500);
            }

            calculateServiceOrderTotalAmount($row);
        }
    });
});

$(document).on("input", ".service-discount-visible, .manual-service-discount-visible", function () {

    const $row = $(this).closest("tr");
    const $error = $(this).closest("td").children(".discount-error");

    const price = parseFloat($row.find(".service-price").val()) || 0;
    const qty = parseFloat($row.find(".service-quantity").val()) || 1;

    const baseTotal = price * qty;

    // GET VAT
    const vatPercent =
        parseFloat($row.find(".service-tax-percentage-hidden").val()) ||
        parseFloat($row.find(".service-tax-percentage-visible").val()) || 0;

    const vatAmount = (baseTotal * vatPercent) / 100;

    //  GROSS
    const grossAmount = baseTotal + vatAmount;

    const discountAmount = parseFloat($(this).val()) || 0;

    // PERCENT FROM GROSS (FIXED)
    const percent = grossAmount > 0 ? (discountAmount / grossAmount) * 100 : 0;

    if (percent > window.maxDiscount) {

        const allowed = (grossAmount * window.maxDiscount) / 100;

        $error.text("Maximum allowed discount is " + window.maxDiscount + "%").show();

        $(this).val(allowed.toFixed(2));

    } else {

        setTimeout(() => {
            $error.text("").hide();
        }, 1500);

    }

    calculateServiceOrderTotalAmount($row);
});
// $(document).on("input", ".service-discount-percentage-visible, .manual-service-discount-percentage-visible, .service-discount-visible, .manual-service-discount-visible", function () {
//     $(this).closest("td").find(".discount-error").text("").hide();
// });
