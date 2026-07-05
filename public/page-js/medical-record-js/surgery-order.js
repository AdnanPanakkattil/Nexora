
var surgeryRowIndex = 0;
$(document).ready(function () {
    function surgeryOrderInputs() {
        const isFixed = $("#surgery_fixed_discount").is(":checked");
        const isPercentage = $("#surgery_percentage_discount").is(":checked");

        $("#surgery_order_table tbody tr").each(function () {
            const $row = $(this);
            const discPercent = $row.find(".surgery-discount-percentage-visible, .manual-surgery-discount-percentage-visible");
            const discAmt = $row.find(".surgery-discount-amount-visible, .manual-surgery-discount-visible");
            const vatPercent = $row.find(".surgery-tax-percentage-visible, .manual-surgery-tax-percentage-visible");
            const vatAmt = $row.find(".surgery-tax-amount-visible, .manual-surgery-tax-amount-visible");

            if (isFixed) {
                discPercent.prop("disabled", true);

                //  VAT not editable in FIXED
                vatPercent.prop("readonly", true);

                discAmt.prop("disabled", false);
                vatAmt.prop("disabled", true);

            } else if (isPercentage) {
                discPercent.prop("disabled", false);

                //  VAT editable in PERCENTAGE
                vatPercent.prop("readonly", false);

                discAmt.prop("disabled", true);
                vatAmt.prop("disabled", true);
            }
        });
    }

    // Run sync on load
    window.surgeryOrderInputs = surgeryOrderInputs;
    surgeryOrderInputs();

    // Toggle logic for surgery discount checkboxes
    $("#surgery_fixed_discount, #surgery_percentage_discount").on("change", function () {

        const $fixed = $("#surgery_fixed_discount");
        const $percentage = $("#surgery_percentage_discount");

        //  Prevent both OFF
        if (!$fixed.is(":checked") && !$percentage.is(":checked")) {
            $(this).prop("checked", true);
            return;
        }

        //  Prevent both ON
        if ($fixed.is(":checked") && $percentage.is(":checked")) {
            if ($(this).attr("id") === "surgery_fixed_discount") {
                $percentage.prop("checked", false);
            } else {
                $fixed.prop("checked", false);
            }
        }

        const isFixed = $fixed.is(":checked");

        surgeryOrderInputs();

        $("#surgery_order_table tbody tr").each(function () {

            const $row = $(this);

            let price = parseFloat($row.find(".surgery-physician-fees").val()) || 0;

            let $discPercent = $row.find(".surgery-discount-percentage-visible, .manual-surgery-discount-percentage-visible");
            let $discAmt = $row.find(".surgery-discount-amount-visible, .manual-surgery-discount-visible");

            let percentVal = parseFloat($discPercent.val()) || 0;
            let amountVal = parseFloat($discAmt.val()) || 0;

            if (isFixed) {
                if (amountVal === 0 && percentVal > 0) {
                    amountVal = (price * percentVal) / 100;
                    $discAmt.val(amountVal.toFixed(2));
                }
                $discPercent.val(0);
            } else {
                if (percentVal === 0 && amountVal > 0) {
                    percentVal = price > 0 ? (amountVal / price) * 100 : 0;
                    $discPercent.val(percentVal.toFixed(2));
                }
                $discAmt.val(0);
            }

            calculateSurgeryOrderTotalAmount($row);
        });

        calculateSurgeryTotals();

        //  CLEAR ERRORS
        $("#surgery_order_table tbody tr").each(function () {
            $(this).find(".discount-error").text("").hide();
        });
    });

    // Handle add button click
    // $('#addbtn').on('click', function() {
    // $(document).on("click", "#addSurgeryServiceOrderBtn", function () {
    //     // Initialize serviceName and serviceCode variables outside the match condition
    //     var serviceName = "";
    //     var serviceCode = "";

    //     // Get the full text from the element
    //     // var fullText = $("#surgery_serviceId").text().trim(); // Trim any leading/trailing whitespace
    //     var fullText = $("#surgery_serviceId option:selected").text().trim();
    //     console.log(fullText);
    //     // Define a regular expression to match the service name and optionally capture the service code
    //     var match = fullText.match(
    //         /(.+?)\s*(?:\(([^)]+)\))?\s*-\s*\d+(\.\d+)?\s*$/
    //     );

    //     // Check if the match is found
    //     if (match) {
    //         // Extract the service name and code without re-declaring the variables
    //         serviceName = match[1].trim(); // Capture the service name
    //         serviceCode = match[2] ? match[2].trim() : ""; // Capture the service code if it exists, else empty string

    //         console.log("Service Name:", serviceName);
    //         console.log("Service Code:", serviceCode);
    //     }

    //     // Check if serviceName is available before adding to the table
    //     if (serviceName) {
    //         $.ajax({
    //             url:
    //                 BASE_URL +
    //                 "/medicalrecord-service-details/" +
    //                 $("#surgery_serviceId").val(),
    //             type: "get",
    //             success: function (response) {
    //                 if (response.status === true && response.data.length > 0) {
    //                     var service = response.data[0];
    //                     var serviceCost = service.cost;
    //                     // var vatPercent = service.vatPercent;
    //                     var vatPercent = $('#vat_enabled').val() == 0 ? 0 : service.vatPercent;
    //                     var SurgeryServiceId = service.serviceId;
    //                     // Create a new table row
    //                     // Create a new table row without Discount Percentage column if fixed discount is checked
    //                     var surgeryDiscountPercentageColumn = "";

    //                     if ($("#surgery_fixed_discount").is(":checked")) {
    //                         surgeryDiscountPercentageColumn = `<td class="surgery-order-disc-percentage">
    //                         <input type="text" class="form-control surgery-discount-percentage-visible" placeholder="Discount %" disabled>
    //                         <input type="hidden" name="surgery_order[${surgeryRowIndex}][discountPercentage]" class="surgery-discount-percentage-hidden">
    //                         </td>
    //                         <td class="surgery-order-disc-amount">
    //                 <input type="text" class="form-control surgery-discount-amount-visible" placeholder="Discount">
    //                 <input type="hidden" name="surgery_order[${surgeryRowIndex}][disAmount]" class="surgery-discount-amount-hidden">
    //                 </td>`;
    //                     } else if (
    //                         $("#surgery_percentage_discount").is(":checked")
    //                     ) {
    //                         surgeryDiscountPercentageColumn = `<td class="surgery-order-disc-percentage">
    //                         <input type="text" class="form-control surgery-discount-percentage-visible" placeholder="Discount %">
    //                         <input type="hidden" name="surgery_order[${surgeryRowIndex}][discountPercentage]" class="surgery-discount-percentage-hidden">
    //                         </td>
    //                 <td class="surgery-order-disc-amount">
    //                 <input type="text" class="form-control surgery-discount-amount-visible" placeholder="Discount" disabled>
    //                 <input type="hidden" name="surgery_order[${surgeryRowIndex}][disAmount]" class="surgery-discount-amount-hidden">
    //                         </td>`;
    //                     }

    //                     var newRow = `
    //                         <tr>
    //                 <td class="surgery-order-name"><input type="hidden" class="service-id 1" name="surgery_order[${surgeryRowIndex}][serviceId]" value="${SurgeryServiceId}">${serviceName}</td>
    //                             <td class="surgery-order-code">${serviceCode}</td>
    //                 <td class="surgery-order-physician-fees"><input type="number" class="form-control surgery-physician-fees" placeholder="Physician Fees" name="surgery_order[${surgeryRowIndex}][physicianFees]" value="${serviceCost}"></td>
    //                                                 ${surgeryDiscountPercentageColumn}

    //                             <td class="surgery-order-vat-percentage">
    //                                 <input type="text" class="form-control surgery-tax-percentage-visible" name="surgery_tax_percentage_visible[]" placeholder="VAT %" value="${vatPercent}">
    //                                 <input type="hidden" name="surgery_order[${surgeryRowIndex}][manuelTaxPercentage]" class="surgery-tax-percentage-hidden" value="${vatPercent}">
    //                             </td>
    //                 <td class="surgery-order-vat-amount">
    //                     <input type="text" class="form-control surgery-tax-amount-visible" placeholder="VAT Amount">
    //                     <input type="hidden" name="surgery_order[${surgeryRowIndex}][manuelTaxCost]" class="surgery-tax-amount-hidden">
    //                 </td>
    //                 <td class="surgery-order-net-amount">
    //                     <input type="text" class="form-control surgery-total-amount-visible" placeholder="Net Amount">
    //                     <input type="hidden" name="surgery_order[${surgeryRowIndex}][netCost]" class="surgery-total-amount-hidden">
    //                 </td>
    //                 <td><input type="text" class="form-control" name="surgery_order[${surgeryRowIndex}][planSurgery]" placeholder="Plan"></td>
    //                             <td><button type="button" class="btn btn-danger remove-row">X</button></td>
    //                         </tr>
    //                     `;
    //                     $("#surgery_order_tbody").append(newRow);
    //                     surgeryRowIndex++; // Increment index
    //                     surgeryOrderInputs();
    //                 } else {
    //                     console.error("Service details not found");
    //                 }
    //             },
    //             error: function (xhr, status, error) {
    //                 console.error("Error:", error);
    //             },
    //         });
    //     } else {
    //         // Optionally show an alert or error message if service name is missing
    //         // alert("Please select a service to add.");
    //     }

    //     $("#surgery_serviceId").text("");
    //     $("#surgery_serviceId").val("");
    // });
    $(document).on("click", "#addSurgeryServiceOrderBtn", function () {

        // Initialize serviceName and serviceCode variables outside the match condition
        var serviceName = "";
        var serviceCode = "";

        var fullText = $("#surgery_serviceId option:selected").text();

        if (!fullText) {
            console.log("No service selected");
            return;
        }

        fullText = fullText.trim();

        console.log("Selected Text:", fullText);

        var match = fullText.match(/(.+?)\s*(?:\(([^)]+)\))?\s*-\s*\d+(\.\d+)?\s*$/);

        if (match) {
            serviceName = match[1].trim();
            serviceCode = match[2] ? match[2].trim() : "";
        } else {
            serviceName = fullText;
            serviceCode = "";
        }

        console.log("Service Name:", serviceName);
        console.log("Service Code:", serviceCode);

        // Stop if no service selected
        if (!$("#surgery_serviceId").val()) {
            alert("Please select a service");
            return;
        }

        // Check if serviceName exists
        if (serviceName) {

            $.ajax({
                url: BASE_URL + "/medicalrecord-service-details/" + $("#surgery_serviceId").val(),
                type: "get",

                success: function (response) {

                    if (response.status === true && response.data.length > 0) {

                        var service = response.data[0];
                        var serviceCost = service.cost;

                        // var vatPercent = $('#vat_enabled').val() == 0 ? 0 : service.vatPercent;
                        // var vatPercent = parseFloat(service.vatPercent) || 0;
                        var vatPercent = service.vatPercent !== null && service.vatPercent !== undefined 
                            ? parseFloat(service.vatPercent) 
                            : 0;

                        // if ($('#vat_enabled').val() == 0) {
                        //     vatPercent = 0;
                        // }

                        // var vatPercent = service.vatPercent || 0;

                        var SurgeryServiceId = service.serviceId;

                        var surgeryDiscountPercentageColumn = "";

                        if ($("#surgery_fixed_discount").is(":checked")) {

                            surgeryDiscountPercentageColumn = `
                            <td class="surgery-order-disc-percentage">
                                <input type="" class="form-control surgery-discount-percentage-visible" placeholder="Discount %" disabled>
                                <small class="text-danger discount-error"></small>
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][discountPercentage]" class="surgery-discount-percentage-hidden">
                            </td>

                            <td class="surgery-order-disc-amount">
                                <input type="text" class="form-control surgery-discount-amount-visible" placeholder="Discount">
                                <small class="text-danger discount-error"></small>
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][disAmount]" class="surgery-discount-amount-hidden">
                            </td>
                            `;

                        } else if ($("#surgery_percentage_discount").is(":checked")) {

                            surgeryDiscountPercentageColumn = `
                            <td class="surgery-order-disc-percentage">
                                <input type="text" class="form-control surgery-discount-percentage-visible" placeholder="Discount %">
                                <small class="text-danger discount-error"></small>
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][discountPercentage]" class="surgery-discount-percentage-hidden">
                            </td>

                            <td class="surgery-order-disc-amount">
                                <input type="text" class="form-control surgery-discount-amount-visible" placeholder="Discount" disabled>
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][disAmount]" class="surgery-discount-amount-hidden">
                            </td>
                            `;
                        }

                        var newRow = `
                            <tr>

                            <td class="surgery-order-name">
                                <input type="hidden" class="service-id 1"
                                name="surgery_order[${surgeryRowIndex}][serviceId]"
                                value="${SurgeryServiceId}">
                                ${serviceName}
                            </td>

                            <td class="surgery-order-code">
                                ${service.serviceCode ?? '-'}
                            </td>

                            <td class="surgery-order-physician-fees">
                                <input type="number"
                                class="form-control surgery-physician-fees"
                                placeholder="Physician Fees"
                                name="surgery_order[${surgeryRowIndex}][physicianFees]"
                                value="${serviceCost}">
                            </td>

                            ${surgeryDiscountPercentageColumn}

                            <td class="surgery-order-vat-percentage">
                                <input type="text"
                                class="form-control surgery-tax-percentage-visible"
                                name="surgery_tax_percentage_visible[]"
                                placeholder="VAT %"
                                value="${vatPercent}">

                                <input type="hidden"
                                name="surgery_order[${surgeryRowIndex}][manuelTaxPercentage]"
                                class="surgery-tax-percentage-hidden"
                                value="${vatPercent}">
                            </td>

                            <td class="surgery-order-vat-amount">
                                <input type="text"
                                class="form-control surgery-tax-amount-visible"
                                placeholder="VAT Amount"  disabled>

                                <input type="hidden"
                                name="surgery_order[${surgeryRowIndex}][manuelTaxCost]"
                                class="surgery-tax-amount-hidden">
                            </td>

                            <td class="surgery-order-net-amount">
                                <input type="text"
                                class="form-control surgery-total-amount-visible"
                                placeholder="Net Amount">

                                <input type="hidden"
                                name="surgery_order[${surgeryRowIndex}][netCost]"
                                class="surgery-total-amount-hidden">
                            </td>

                            <td>
                                <input type="text"
                                class="form-control"
                                name="surgery_order[${surgeryRowIndex}][planSurgery]"
                                placeholder="Plan">
                            </td>

                            <td>
                                <button type="button" class="btn btn-danger remove-row">X</button>
                            </td>

                            </tr>
                        `;

                        // $("#surgery_order_tbody").append(newRow);

                        // surgeryRowIndex++;

                        // surgeryOrderInputs();

                        $("#surgery_order_tbody").append(newRow);

                        let $row = $("#surgery_order_tbody tr:last");

                        calculateSurgeryOrderTotalAmount($row);   

                        surgeryRowIndex++;

                        surgeryOrderInputs();

                    } else {
                        console.error("Service details not found");
                    }
                },

                error: function (xhr, status, error) {
                    console.error("Error:", error);
                }
            });
        }

        // Reset select properly (important for select2)
        $("#surgery_serviceId").val(null).trigger("change");

    });

    $(document).on("click", "#addSurgeryServiceManuel", function () {
        // var vatEnabled = $("#vat_enabled").val() ? 15 : 0;
        if ($('input[name="service_tax[]"]').eq(0).val() == undefined) {
            console.log($('input[name="service_tax[]"]').eq(0).val() == undefined);
            var vatEnabled = $("#vat_enabled").val() == 1 ? 15 : 0;
        } else {
            var vatEnabled = $('input[name="service_tax[]"]').eq(0).val();
        }

        var discountPercentageColumn = "";

        if ($("#surgery_fixed_discount").is(":checked")) {
            discountPercentageColumn = `<td class="surgery-order-disc-percentage">
                                    <input type="text" class="form-control manual-surgery-discount-percentage-visible" placeholder="Discount %" value="" disabled>
                                    <input type="hidden" name="surgery_order[${surgeryRowIndex}][discountPercentage]" class="manual-surgery-discount-percentage-hidden">
            </td>
            <td class="surgery-order-disc-amount">
                                <input type="text" class="form-control manual-surgery-discount-visible" placeholder="Discount " value="">
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][disAmount]" class="manual-surgery-discount-hidden">
                            </td>
                            `;
        } else if ($("#surgery_percentage_discount").is(":checked")) {
            discountPercentageColumn = `<td class="surgery-order-disc-percentage">
                                    <input type="text" class="form-control manual-surgery-discount-percentage-visible" placeholder="Discount %" value="">
                                    <input type="hidden" name="surgery_order[${surgeryRowIndex}][discountPercentage]" class="manual-surgery-discount-percentage-hidden">
                                </td>
                                <td class="surgery-order-disc-amount">
                                <input type="text" class="form-control manual-surgery-discount-visible" placeholder="Discount " value="" disabled>
                                <input type="hidden" name="surgery_order[${surgeryRowIndex}][disAmount]" class="manual-surgery-discount-hidden">
                            </td>
                            `;
        }

        var newRow = `
            <tr>
                                <td class="surgery-order-name"><input type="text" class="service-id form-control" name="surgery_order[${surgeryRowIndex}][manualServiceName]" value=""></td>
                                <td class="surgery-order-code"><input type="text" class="service-code form-control" name="surgery_order[${surgeryRowIndex}][manualServiceCode]" value=""  disabled></td>
                <td class="surgery-order-physician-fees">
                    <input type="number" class="form-control surgery-physician-fees" placeholder="Physician Fees" name="surgery_order[${surgeryRowIndex}][physicianFees]" value="">
                </td>
                                
                ${discountPercentageColumn}
                <td class="surgery-order-vat-percentage">
                    <input type="text" class="form-control manual-surgery-tax-percentage-visible" placeholder="VAT %" value="${vatEnabled}">
                    <input type="hidden" name="surgery_order[${surgeryRowIndex}][manuelTaxPercentage]" class="manual-surgery-tax-percentage-hidden" value="${vatEnabled}">
                </td>
                    <td class="surgery-order-vat-amount">
                        <input type="text" class="form-control manual-surgery-tax-amount-visible" placeholder="VAT Amount">
                        <input type="hidden" name="surgery_order[${surgeryRowIndex}][manuelTaxCost]" class="manual-surgery-tax-amount-hidden">
                    </td>
                    <td class="surgery-order-net-amount">
                        <input type="text" class="form-control manual-surgery-total-amount-visible" placeholder="Net Amount">
                        <input type="hidden" name="surgery_order[${surgeryRowIndex}][netCost]" class="manual-surgery-total-amount-hidden">
                    </td>
                    <td><input type="text" class="form-control" name="surgery_order[${surgeryRowIndex}][planSurgery]" placeholder="Plan"></td>
                <td><button type="button" class="btn btn-danger remove-row">X</button></td>
            </tr>
        `;
        // $("#surgery_order_tbody").append(newRow);
        // surgeryRowIndex++; // Increment index
        // surgeryOrderInputs();
        $("#surgery_order_tbody").append(newRow);

        let $row = $("#surgery_order_tbody tr:last");

        calculateSurgeryOrderTotalAmount($row);   

        surgeryRowIndex++;

        surgeryOrderInputs();
        });

    $(document).on("click", ".remove-row", function () {
        $(this).closest("tr").remove();
        calculateSurgeryTotals();
    });

    //     $(document).on("input", "#surgery_order_table input", function () {
    //     const $row = $(this).closest("tr");
    //     calculateSurgeryOrderTotalAmount($row);
    // });

    // Handle changes in Discount Percentage field
    $(document).on("input", ".surgery-discount-percentage-visible, .manual-surgery-discount-percentage-visible", function () {

        const $row = $(this).closest("tr");
        const $error = $(this).closest("td").find(".discount-error");

        let discount = parseFloat($(this).val()) || 0;

        if (discount > window.maxDiscount) {

            $error.text("Maximum allowed discount is " + window.maxDiscount + "%").show();

            $(this).val(window.maxDiscount);

        } else {

            $error.text("").hide();
        }

        calculateSurgeryOrderTotalAmount($row);
    });
    // $(document).on("input", "#surgery_order_tbody input", function () {
    // const $row = $(this).closest("tr");

    //     if ($(this).hasClass("surgery-discount-percentage-visible")) {

    //         let discount = parseFloat($(this).val()) || 0;

    //         if (discount > window.maxDiscount) {

    //             alert("Maximum allowed discount is " + window.maxDiscount + "%");

    //             $(this).val(window.maxDiscount);

    //             discount = window.maxDiscount;
    //         }
    //     }

    //     calculateSurgeryOrderTotalAmount($row);
    // });
   $(document).on("input", ".surgery-discount-amount-visible, .manual-surgery-discount-visible", function () {

        const $row = $(this).closest("tr");
        // const $error = $(this).closest("td").find(".discount-error");
        const $error = $(this).siblings(".discount-error");

        const price = parseFloat($row.find(".surgery-physician-fees").val()) || 0;

        const vatPercent =
            parseFloat($row.find(".surgery-tax-percentage-hidden").val()) ||
            parseFloat($row.find(".surgery-tax-percentage-visible").val()) || 0;

        const vatAmount = (price * vatPercent) / 100;
        const grossAmount = price + vatAmount;
        const discountAmount = parseFloat($(this).val()) || 0;
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

        calculateSurgeryOrderTotalAmount($row);
    });

    $(document).on(
        "input",
        ".surgery-physician-fees, .surgery-discount-percentage-visible, .manual-surgery-discount-percentage-visible, .surgery-discount-amount-visible, .manual-surgery-discount-visible",
        function () {
            const $row = $(this).closest("tr");
            calculateSurgeryOrderTotalAmount($row);
        }
    );
    // Watch for row removals or additions to update grand totals
    // $("#surgery_order_tbody").on("DOMSubtreeModified", function () {
    //     calculateSurgeryTotals();
    // });
});


function calculateSurgeryTotals() {
    let physicianFeesSum = 0;
    let totalAmountSum = 0;
    let discountAmountSum = 0;
    let vatAmountSum = 0;

    $("#surgery_order_tbody tr").each(function () {
        const $row = $(this);
        const rowFees = parseFloat($row.find(".surgery-physician-fees").val()) || 0;
        const rowTotal = parseFloat($row.find(".surgery-total-amount-hidden, .manual-surgery-total-amount-hidden").val()) || 0;
        const rowDiscount = parseFloat($row.find(".surgery-discount-amount-hidden, .manual-surgery-discount-hidden").val()) || 0;
        const rowVat = parseFloat($row.find(".surgery-tax-amount-hidden, .manual-surgery-tax-amount-hidden").val()) || 0;
        physicianFeesSum += rowFees;
        totalAmountSum += rowTotal;
        discountAmountSum += rowDiscount;
        vatAmountSum += rowVat;
    });

    $("#total_amount_sum_surgery").val(totalAmountSum.toFixed(2));
    $("#total_amount_sum_td_surgery").text(physicianFeesSum.toFixed(2));
    $("#total_amount_sum_surgery_td").val(physicianFeesSum.toFixed(2)); 

    $("#total_discount_sum_td_surgery").text(discountAmountSum.toFixed(2)); 
    $("#total_discount_sum_surgery").val(discountAmountSum.toFixed(2)); 

    $("#total_vat_sum_td_surgery").text(vatAmountSum.toFixed(2));
    $("#total_vat_sum_surgery").val(vatAmountSum.toFixed(2)); 
    $("#surgery_order_net_amount").val(totalAmountSum.toFixed(2)); 
    $("#surgery_order_net_amount_display").text(totalAmountSum.toFixed(2));
}

function calculateSurgeryOrderTotalAmount($row) {

    const isFixed = $("#surgery_fixed_discount").is(":checked");

    const price = parseFloat($row.find(".surgery-physician-fees").val()) || 0;

    let discountAmount = 0;
    let discountPercent = 0;
    let vatAmount = 0;

    let $discPercentVisible = $row.find(".surgery-discount-percentage-visible, .manual-surgery-discount-percentage-visible");
    let $discAmtVisible = $row.find(".surgery-discount-amount-visible, .manual-surgery-discount-visible");
    let $vatPercentVisible = $row.find(".surgery-tax-percentage-visible, .manual-surgery-tax-percentage-visible");
    let $vatAmtVisible = $row.find(".surgery-tax-amount-visible, .manual-surgery-tax-amount-visible");
    let $totalVisible = $row.find(".surgery-total-amount-visible, .manual-surgery-total-amount-visible");

    let $discPercentHidden = $row.find(".surgery-discount-percentage-hidden, .manual-surgery-discount-percentage-hidden");
    let $discAmtHidden = $row.find(".surgery-discount-amount-hidden, .manual-surgery-discount-hidden");
    let $vatPercentHidden = $row.find(".surgery-tax-percentage-hidden, .manual-surgery-tax-percentage-hidden");
    let $vatAmtHidden = $row.find(".surgery-tax-amount-hidden, .manual-surgery-tax-amount-hidden");
    let $totalHidden = $row.find(".surgery-total-amount-hidden, .manual-surgery-total-amount-hidden");

    
    if (isFixed) {

        discountAmount = parseFloat($discAmtVisible.val()) || 0;

        if (discountAmount > price) {
            discountAmount = price;
            $discAmtVisible.val(price.toFixed(2));
        }

        discountPercent = price > 0 ? (discountAmount / price) * 100 : 0;

        $discPercentVisible.val(discountPercent.toFixed(2));

    } else {

        discountPercent = parseFloat($discPercentVisible.val()) || 0;

        discountAmount = (price * discountPercent) / 100;

        $discAmtVisible.val(discountAmount.toFixed(2));
    }

   
    const taxableAmount = price - discountAmount;
    vatPercent = parseFloat($vatPercentHidden.val()) ||parseFloat($vatPercentVisible.val());
    vatAmount = (taxableAmount * vatPercent) / 100;

    const totalAmount = taxableAmount + vatAmount;

    // UI
    $vatAmtVisible.val(vatAmount.toFixed(2));
    $totalVisible.val(totalAmount.toFixed(2));

    // hidden sync
    $discPercentHidden.val(discountPercent.toFixed(2));
    $discAmtHidden.val(discountAmount.toFixed(2));
    $vatPercentHidden.val(vatPercent);
    $vatAmtHidden.val(vatAmount.toFixed(2));
    $totalHidden.val(totalAmount.toFixed(2));

    calculateSurgeryTotals();
}