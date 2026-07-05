$(document).ready(function () {
    // Ensure only one is checked initially
    // Initial state check
    if ($("#inpatient_fixed_discount").is(":checked")) {
        $("#inpatient_percentage_discount").prop("checked", false);
    } else if ($("#inpatient_percentage_discount").is(":checked")) {
        $("#inpatient_fixed_discount").prop("checked", false);
    }

    // Toggle logic for "Percentage Discount" checkbox
    $("#inpatient_percentage_discount").on("change", function () {
        if ($(this).is(":checked")) {
            // Uncheck the fixed discount checkbox and show "Disc %" column
            $("#inpatient_fixed_discount").prop("checked", false);

            // $("#service_order_table th:nth-child(5)").show();
            $("#in_patient_service_order_table tbody tr").each(function () {
                $(this).find("td:nth-child(5) input").prop("disabled", false);
                $(this).find("td:nth-child(6) input").prop("disabled", true);
            });
        } else {
            // If unchecked, hide the "Disc %" column
            // $("#service_order_table th:nth-child(5)").hide();
            // $("#service_order_table tbody tr").each(function() {
            //     $(this).find("td:nth-child(5)").hide();
            // });
        }
    });

    // Toggle logic for "Fixed Discount" checkbox
    $("#inpatient_fixed_discount").on("change", function () {
        if ($(this).is(":checked")) {
            // Uncheck the percentage discount checkbox and hide "Disc %" column
            $("#inpatient_percentage_discount").prop("checked", false);

            // $("#service_order_table th:nth-child(5)").hide();
            $("#in_patient_service_order_table tbody tr").each(function () {
                // $(this).find("td:nth-child(5)").hide();
                $(this).find("td:nth-child(5) input").prop("disabled", true);
                $(this).find("td:nth-child(6) input").prop("disabled", false);
            });
        } else {
            // If unchecked, show the "Disc %" column
            // $("#service_order_table th:nth-child(5)").show();
            $("#in_patient_service_order_table tbody tr").each(function () {
                // $(this).find("td:nth-child(5)").show();
                $(this).find("td:nth-child(5) input").prop("disabled", false);
            });
        }
    });

    // Handle add button click
    $(document).on("click", ".add-in-patient-service", function () {
        var serviceName = "";
        var serviceCode = "_";
        var fullText = $("#inpatient_serviceId option:selected").text().trim();
        // alert(fullText);
        var match = fullText.match(
            /(.+?)\s*(?:\(([^)]+)\))?\s*-\s*\d+(\.\d+)?\s*$/
        );

        if (match) {
            var serviceName = match[1].trim();
            var serviceCode = match[2] ? match[2].trim() : null;
        }

        var serviceId = $("#inpatient_serviceId").val();
        if (serviceId) {
            $.ajax({
                url:
                    BASE_URL +
                    "/medicalrecord-service-details/" +
                    $("#inpatient_serviceId").val(),
                type: "get",
                success: function (response) {
                    if (response.status === true && response.data.length > 0) {
                        var service = response.data[0];
                        var serviceCost = service.cost;
                        var vatPercent = service.vatPercent;
                        var serviceId = service.serviceId;
                        // console.log(response.data[0]);
                        // Create a new table row without Discount Percentage column if fixed discount is checked
                        var discountPercentageColumn = "";
                        var rowIndex = $(
                            "#in_patient_service_order_tbody tr"
                        ).length; // Calculate index

                        if (!$("#inpatient_fixed_discount").is(":checked")) {
                            discountPercentageColumn = `<td class="inpatient-service-order-disc-percentage">
                                <input type="text" class="form-control" placeholder="Discount Percentage" value="0" name="inpatient_service_discount_percentage[${rowIndex}]" enabled>
                            </td>
                            <td class="inpatient-service-order-disc-amount">
                                    <input type="text" class="form-control" placeholder="Discount Amount"  value="0"name="inpatient_service_discount[${rowIndex}]" disabled>
                                </td>`;
                        } else if (
                            !$("#inpatient_percentage_discount").is(":checked")
                        ) {
                            discountPercentageColumn = `<td class="inpatient-service-order-disc-percentage">
                                <input type="text" class="form-control" placeholder="Discount Percentage" value="0" name="inpatient_service_discount_percentage[${rowIndex}]" disabled>
                            </td>
                            <td class="inpatient-service-order-disc-amount">
                                    <input type="text" class="form-control" placeholder="Discount Amount" value="0" name="inpatient_service_discount[${rowIndex}]" enabled>
                                </td>`;
                        }

                        var newRow = `
                            <tr>
                                <td class="inpatient-service-order-name">
                                    <input type="hidden" class="service-id" name="inpatient_service_id[${rowIndex}]" value="${serviceId}">
                                    <input type="hidden" class="existing_service" name="existing_service[${rowIndex}]" value="1">
                                   ${fullText}</td>
                                <td class="inpatient-service-order-code">${serviceCode}</td>
                                <td class="inpatient-service-order-quantity">
                                    <input type="number" class="form-control" placeholder="Quantity" name="inpatient_service_quantity[${rowIndex}]" value="1">
                                </td>
                                <td class="inpatient-service-order-price">
                                    <input type="text" class="form-control" placeholder="Price" name="inpatient_service_price[${rowIndex}]" value="${serviceCost}" disabled>
                                </td>
                                ${discountPercentageColumn}
                                
                                <td class="inpatient-service-order-vat-percentage">
                                    <input type="text" class="form-control" placeholder="VAT %" name="inpatient_service_tax[${rowIndex}]" value="${vatPercent}">
                                </td>
                                <td class="inpatient-service-order-vat-amount">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="inpatient_service_tax_amount[${rowIndex}]" value="">
                                </td>
                                <td class="inpatient-service-order-total-amount">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="inpatient_service_total_amount[${rowIndex}]">
                                </td>
                                <td>
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>
                        `;
                        $("#in_patient_service_order_tbody").append(newRow);
                        var $newRow = $("#in_patient_service_order_tbody tr:last");
                        calculateServiceOrderTotalAmount($newRow, 0);
                        // updateSequenceNumbers();
                    } else {
                        console.error("Service details not found");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error:", error);
                },
            });
        }

        $("#inpatient_serviceId").text("");
        $("#inpatient_serviceId").val("");
    });




    $("#service-save").click(function () {
        Swal.fire({
            title: "Select Payment Option",
            icon: "question",
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: "Pay After Discharge",
            denyButtonText: "Pending Request",
            cancelButtonText: "Cancel",
            customClass: {
                confirmButton: "btn btn-primary me-2",
                denyButton: "btn btn-warning me-2",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed || result.isDenied) {
                let paymentStatus = result.isConfirmed ? "pay_after_discharge" : "pending";

                var inpatientServiceFormData = $("#inpatient_service_form").serialize();

                var combinedData = inpatientServiceFormData +
                    "&payment_status=" + encodeURIComponent(paymentStatus) +
                    "&in_patient_id=" + encodeURIComponent($('#in_patient_id').val()) +
                    "&patient_admission_id=" + encodeURIComponent($('#patient_admission_id').val()) +
                    "&client_id=" + encodeURIComponent($('#client_id').val());

                // Optional: Disable button to prevent multiple clicks
                $("#service-save").prop("disabled", true);

                $.ajax({
                    url: BASE_URL + "/service-saving",
                    type: "POST",
                    data: combinedData,
                    success: function (response) {
                        Swal.fire({
                            icon: "success",
                            text: response.message,
                            customClass: {
                                confirmButton: "btn btn-success waves-effect waves-light",
                            },
                        }).then(function () {
                            location.reload();
                        });
                    },
                    error: function (xhr, status, error) {
                        console.error("Error occurred:", xhr.responseText || error);
                        Swal.fire({
                            icon: "error",
                            title: "Submission Failed",
                            text: "Something went wrong. Please try again.",
                            customClass: {
                                confirmButton: "btn btn-danger"
                            }
                        });
                    },
                    complete: function () {
                        $("#service-save").prop("disabled", false);
                    }
                });
            }
        });
    });





    $(document).on("click", ".add-in-patient-service-manuel", function () {
        var vatEnabled = $("#vat_enabled").val() ? 15 : 0;

        var discountPercentageColumn = "";
        var rowIndex = $("#in_patient_service_order_tbody tr").length; // Calculate index

        if (!$("#inpatient_fixed_discount").is(":checked")) {
            discountPercentageColumn = `<td class="inpatient-service-order-disc-percentage">
                                <input type="text" class="form-control" placeholder="Discount Percentage" name="inpatient_manual_service_discount_percentage[${rowIndex}]" enabled>
                            </td>
                            <td class="inpatient-service-order-disc-amount">
                                    <input type="text" class="form-control" placeholder="Discount Amount" name="inpatient_manual_service_discount[${rowIndex}]" disabled>
                                </td>`;
        } else if (!$("#inpatient_percentage_discount").is(":checked")) {
            discountPercentageColumn = `<td class="inpatient-service-order-disc-percentage">
                                <input type="text" class="form-control" placeholder="Discount Percentage" name="inpatient_manual_service_discount_percentage[${rowIndex}]" disabled>
                            </td>
                            <td class="inpatient-service-order-disc-amount">
                                    <input type="text" class="form-control" placeholder="Discount Amount" name="inpatient_manual_service_discount[${rowIndex}]" enabled>
                                </td>`;
        }
        var rowIndex = $("#in_patient_service_order_tbody tr").length; // Calculate index

        var newRow = `
                            <tr>
                                <td class="inpatient-service-order-name">
                                <input type="text" class="service-id form-control" name="inpatient_manual_service[${rowIndex}]" value="">
                                <input type="hidden" class="existing_service" name="existing_service[${rowIndex}]" value="0">
                                
                                </td>
                                <td class="inpatient-service-order-code"><input type="text" class="service-code form-control" name="inpatient_manual_service_code[${rowIndex}]" value=""></td>
                                <td class="inpatient-service-order-quantity">
                                    <input type="number" class="form-control" placeholder="Quantity" name="inpatient_manual_service_quantity[${rowIndex}]" value="1">
                                </td>
                                <td class="inpatient-service-order-price">
                                    <input type="text" class="form-control" placeholder="Price" name="inpatient_manual_service_price[${rowIndex}]" value="">
                                </td>
                                ${discountPercentageColumn}
                                
                                <td class="inpatient-service-order-vat-percentage">
                                    <input type="text" class="form-control" placeholder="VAT %" name="inpatient_manual_service_tax_percentage[${rowIndex}]" value="${vatEnabled}">
                                </td>
                                <td class="inpatient-service-order-vat-amount">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="inpatient_manual_service_tax[${rowIndex}]" value="">
                                </td>
                                <td class="inpatient-service-order-total-amount">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="inpatient_manual_service_total_amount[${rowIndex}]">
                                </td>
                                <td>
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>
                        `;

        $("#in_patient_service_order_tbody").append(newRow);
        var $newRow = $("#in_patient_service_order_tbody tr:last");
        calculateServiceOrderTotalAmount($newRow, 0);
        // updateSequenceNumbers();

        $("#inpatient_serviceId").text("");
        $("#inpatient_serviceId").val("");
    });

    // Handle remove button click to remove row
    $(document).on("click", ".remove-row", function () {
        $(this).closest("tr").remove();
        // Re-index rows
        updateSequenceNumbers();
    });


    // Handle changes in Quantity field
$(document).on("input change", ".inpatient-service-order-quantity input", function () {
    var $row = $(this).closest("tr");
    var price = parseFloat($row.find(".inpatient-service-order-price input").val()) || 0;
    var quantity = parseFloat($(this).val()) || 1;
    var baseAmount = price * quantity;

    var $discPercentInput = $row.find(".inpatient-service-order-disc-percentage input");
    var $discAmountInput = $row.find(".inpatient-service-order-disc-amount input");

    var discountAmount = 0;
    if (!$discPercentInput.prop("disabled")) {
        var discountPercentage = parseFloat($discPercentInput.val()) || 0;
        discountAmount = (baseAmount * discountPercentage) / 100;
        $discAmountInput.val(discountAmount.toFixed(2));
    } else {
        discountAmount = parseFloat($discAmountInput.val()) || 0;
    }

    calculateServiceOrderTotalAmount($row, discountAmount);
});

    // $(document).on("input", ".service-order-disc-percentage input", function () {
    //     var $row = $(this).closest("tr"); // Get the current row

    //     // Get the values from the respective fields
    //     var price = parseFloat($row.find(".service-order-price input").val()) || 0;
    //     var discountPercentage = parseFloat($(this).val()) || 0;
    //     var vatPercentage = parseFloat($row.find(".service-order-vat-percentage input").val()) || 0;

    //     // Calculate discount amount
    //     var discountAmount = (price * discountPercentage) / 100;

    //     // Calculate total price after discount
    //     var priceAfterDiscount = price - discountAmount;

    //     // Calculate VAT amount
    //     var vatAmount = (priceAfterDiscount * vatPercentage) / 100;

    //     // Calculate the total amount (price after discount + VAT)
    //     var totalAmount = priceAfterDiscount + vatAmount;
    // console.log(totalAmount);
    //     // Update the discount amount and total amount fields
    //     $row.find(".service-order-disc-amount input").val(discountAmount.toFixed(2));
    //     $row.find(".service-order-total-amount input").val(totalAmount.toFixed(2));
    //     $row.find(".service-order-vat-amount input").val(vatAmount.toFixed(2));
    // });
});

// Handle changes in Discount Percentage field
$(document).on(
    "input",
    ".inpatient-service-order-disc-percentage input",
    function () {
        var $row = $(this).closest("tr");

        // Get values from respective fields
        var price =
            parseFloat(
                $row.find(".inpatient-service-order-price input").val()
            ) || 0;
        var quantity =
            parseFloat(
                $row.find(".inpatient-service-order-quantity input").val()
            ) || 1;
        var discountPercentage = parseFloat($(this).val()) || 0;
        var vatPercentage =
            parseFloat(
                $row.find(".inpatient-service-order-vat-percentage input").val()
            ) || 0;

        // Calculate discount amount based on percentage
        var discountAmount = (price * quantity * discountPercentage) / 100;
        // console.log(discountAmount);
        // Update the discount amount field
        $row.find(".inpatient-service-order-disc-amount input").val(
            discountAmount.toFixed(2)
        );
        // alert("d");
        // Calculate total price after discount and VAT
        calculateServiceOrderTotalAmount($row, discountAmount);
    }
);

// Handle changes in Discount Amount field
$(document).on(
    "input",
    ".inpatient-service-order-disc-amount input",
    function () {
        var $row = $(this).closest("tr");
        // Get values from respective fields
        var price =
            parseFloat(
                $row.find(".inpatient-service-order-price input").val()
            ) || 0;
        var discountAmount = parseFloat($(this).val()) || 0;
        // console.log(discountAmount);
        // console.log($row);
        // Update total amount based on discount amount
        calculateServiceOrderTotalAmount($row, discountAmount);
    }
);

// Function to calculate the total amount based on the discount
function calculateServiceOrderTotalAmount($row, discountAmount) {
    var price =
        parseFloat($row.find(".inpatient-service-order-price input").val()) ||
        0;
    var quantity =
        parseFloat($row.find(".inpatient-service-order-quantity input").val()) ||
        1;
    var vatPercentage =
        parseFloat(
            $row.find(".inpatient-service-order-vat-percentage input").val()
        ) || 0;

    var baseAmount = price * quantity;
    // Calculate price after discount
    var priceAfterDiscount = baseAmount - discountAmount;

    // Calculate VAT amount
    var vatAmount = (priceAfterDiscount * vatPercentage) / 100;

    // Calculate total amount (price after discount + VAT)
    var totalAmount = priceAfterDiscount + vatAmount;
    // console.log(vatAmount);
    // Update VAT amount and total amount fields
    $row.find(".inpatient-service-order-vat-amount input").val(
        vatAmount.toFixed(2)
    );
    $row.find(".inpatient-service-order-total-amount input").val(
        totalAmount.toFixed(2)
    );

    var discountAmountSum = 0;
    var vatAmountSum = 0;
    var totalAmountSum = 0;
    var grossAmountSum = 0;

    $("#in_patient_service_order_table tbody tr").each(function () {
        // Find the input field in the 6th column (Discount Amount column)
        var rowPrice =
            parseFloat($(this).find("td:nth-child(4) input").val()) || 0;

        var rowQty =
            parseFloat($(this).find("td:nth-child(3) input").val()) || 1;

        var discountAmount =
            parseFloat($(this).find("td:nth-child(6) input").val()) || 0;

        var vatAmount =
            parseFloat($(this).find("td:nth-child(8) input").val()) || 0;

        var totalAmount =
            parseFloat($(this).find("td:nth-child(9) input").val()) || 0;

        // Add the value to the running total
        grossAmountSum += rowPrice * rowQty;
        discountAmountSum += discountAmount;
        vatAmountSum += vatAmount;
        totalAmountSum += totalAmount;

        // console.log(discountAmountSum);
        // console.log(vatAmountSum);
    });

    // Display the calculated totals in the corresponding sections
    $("#inpatient_gross_amount").text(grossAmountSum.toFixed(2));
    $("#inpatient_total_amount_sum").val(totalAmountSum.toFixed(2)); // Update the input field for total amount
    $("#inpatient_total_discount_sum_td").text(discountAmountSum.toFixed(2)); // Update total discount in table
    $("#inpatient_total_discount_sum").val(discountAmountSum.toFixed(2));
    $("#inpatient_total_vat_sum_td").text(vatAmountSum.toFixed(2)); // Update VAT percentage in table
    $("#inpatient_total_vat_sum").val(vatAmountSum.toFixed(2)); // Update VAT percentage in table
    $("#inpatient_service_order_net_amount").val(totalAmountSum.toFixed(2)); // Update the input field for total amount
    $("#inpatient_total_amount").text(totalAmountSum.toFixed(2)); // Update total discount in table
    $("#inpatient_service_order_net_amount_td").text(totalAmountSum.toFixed(2)); // Update total discount in table
}

// function updateSequenceNumbers() {
//     $("#in_patient_service_order_tbody tr").each(function (index, row) {
//         var rowIndex = index + 1; // New index starts at 1
//         // Update the name attributes of indexed inputs
//         $(row)
//             .find("input[name^='inpatient_service_total_amount']")
//             .attr("name", `inpatient_service_total_amount[${rowIndex}]`);
//         $(row)
//             .find("input[name^='inpatient_manual_service_code']")
//             .attr("name", `inpatient_manual_service_code[${rowIndex}]`);
//     });
// }

function updateSequenceNumbers() {
    // Loop through each row and update indexes
    $("#in_patient_service_order_tbody tr").each(function (index, row) {
        // Update the name attributes of indexed inputs
        console.log(index);
        $(row)
            .find("input[name^='inpatient_service_total_amount']")
            .attr("name", `inpatient_service_total_amount[${index}]`);
        $(row)
            .find("input[name^='inpatient_manual_service_code']")
            .attr("name", `inpatient_manual_service_code[${index}]`);

        // Update any other indexed input fields as needed here
        // Example for quantity
        $(row)
            .find("input[name^='inpatient_manual_service_quantity']")
            .attr("name", `inpatient_manual_service_quantity[${index}]`);
    });
}
