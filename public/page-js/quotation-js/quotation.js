$(window).on('load', function() {
    $('#loader-overlay').fadeOut(400);
});

// Backup: Hide after DOM ready (in case window.load takes too long)
$(document).ready(function() {
    setTimeout(function() {
        if ($('#loader-overlay').is(':visible')) {
            $('#loader-overlay').fadeOut(400);
        }
    }, 1000); // Hide after 1 second maximum
});


let grandTotal = 0;

$(document).ready(function () {
    $("#quotation_main_menu").addClass("active open menu-item-animating");
    $("#quotation_sub_menu").addClass("active");

    $("#customer_main_menu").removeClass("active open menu-item-animating");
    $("#customer_sub_menu").removeClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#customer_type").val("b2c").trigger("change");
    $("#currency").val(3).trigger("change");

    // Run on page load in case of preselected value
    toggleVatField();

    // Run when customer type changes
    $('#customer_type').on('change', function () {
        toggleVatField();
    });

    if ($("#edit_quotation_id").val()) {
        initialPageLoad($("#edit_quotation_id").val());
    } else {
        // Get the current date in YYYY-MM-DD format
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0]; // Format the date

        // Set the current date as the value of the input field
        $("#quotation_date").val(formattedDate);
    }
    flatpickr("#quotation_date", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
    });

    $("#customer_name").select2({
        placeholder: "Search Customer Name",
        allowClear: true,
         dropdownParent: $("#customer_name").parent(),
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/search-customer-name-by-query",
            // url: BASE_URL + "/search-patient-by-query",

            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    customerName: params.term,
                    customerType: $("#customer_type").val(),
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
        templateResult: formatRepoName,
        templateSelection: formatRepoNameSelection,
    });

    $("#customer_code").select2({
        placeholder: "Search Customer Code",
        allowClear: true,
        minimumInputLength: 1,
        dropdownParent: $("#customer_code").parent(),
        ajax: {
            url: BASE_URL + "/search-customer-code-by-query",
            // url: BASE_URL + "/search-patient-by-query",

            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    customerCode: params.term,
                    customerType: $("#customer_type").val(),
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







    function formatRepoName(repo) {
        if (repo.loading) {
            return repo.customerName;
        }

        var markup =
            "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" +
            repo.customerName +
            "</div>";

        markup += "</div></div>";

        return markup;
    }

    function formatRepoNameSelection(repo) {
        return repo.customerName || repo.id;
    }

    $("#customer_code").on("select2:select", function (e) {

        // $("#customer_name").val(null).trigger("change");
        $("#customer_name").append(
            $("<option>", {
                value: e.params.data.id,
                text: e.params.data.customerName,
            })
        );
        $("#customer_name").val(e.params.data.id).trigger("change");
        $("#tax_id").val(e.params.data.customerVatNumber);
    });

    $("#customer_name").on("select2:select", function (e) {
        // $("#customer_code").val(null).trigger("change");
        $("#customer_code").append(
            $("<option>", {
                value: e.params.data.id,
                text: e.params.data.text,
            })
        );
        $("#customer_code").val(e.params.data.id).trigger("change");
        $("#tax_id").val(e.params.data.customerVatNumber);
    });

if ($("#item_name").data("select2")) {
    $("#item_name").select2("destroy");
}

$("#item_name").select2({
    dropdownParent: $("#item_name").closest(".d-flex"),
    width: "100%",
    placeholder: "Search Item Name",
    allowClear: true,
    minimumInputLength: 3,
    ajax: {
        url: BASE_URL + "/quotation/search-item-name-by-query",
        dataType: "json",
        delay: 250,
        data: function (params) {
            return {
                itemName: params.term,
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

    $("#invoice_number_pdf").select2({
        placeholder: "Search Invoice Number",
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/sales/search-invoice-number-by-query",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    invoiceNumber: params.term,
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

    $("#invoice_number_pdf").on("select2:select", function (e) {
        getPatientById(e.params.data.id);
    });
});

var purchaseOrderHtml = "";

$(document).on("click", "#add_item_btn", function () {
    var serviceName = "";
    var serviceCode = " ";
    var fullText = $("#item_name").text().trim();
    var match = fullText.match(
        /(.+?)\s*(?:\(([^)]+)\))?\s*-\s*\d+(\.\d+)?\s*$/
    );
    if (match) {
        var serviceName = match[1].trim();
        var serviceCode = match[2] ? match[2].trim() : null;
    }
    $.ajax({
        url:
            BASE_URL +
            "/quotation/quotation-order-get-item-details/" +
            $("#item_name").val(),
        type: "get",
        success: function (response) {
            if (response.status === true) {
                // Prepare the dropdown options based on `units`
                let options = `<option value="" >Select</option>`;
                if (response.data.units) {
                    response.data.units.forEach(function (unit) {
                        options += `<option value="${unit.unitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
                    });
                }
                var rowIndex = $("#invoice_table_tbody tr").length; // Calculate index
                purchaseOrderHtml = `<tr>
                                <td class="item-sl-td">
                                ${rowIndex + 1}
                                    
                                </td>
                                <td class="item-code-td">
                                    ${response.data.itemCode}
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="form-control" name="item_id[${rowIndex}]" value="${response.data.itemMasterId
                    }">
                                    <input type="hidden" class="form-control" name="sl_no[${rowIndex}]" value="${rowIndex + 1
                    }">
                                    ${response.data.itemName_en}
                                    <input type="hidden" class="service-id form-control" name="quotation_item_id[${rowIndex}]" value="0">

                                </td>
                                
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="1">
                                    
                                </td>
                                <td class="item-unit-td" style="width: 200px;">
                                    <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${options}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="item_unit_price[${rowIndex}]" value="">
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="">
                                </td>
                                <td class="item-discount-percentage-td">
                                    <input type="text" class="form-control item-discount-percentage" placeholder="%" name="item_discount_percentage[${rowIndex}]"  value="0">
                                </td>
                                <td class="item-amount-after-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount_after_discount[${rowIndex}]" value="">
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[${rowIndex}]" value="${response.data.tax.taxValueInPercentage
                    }">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Vat Amount" name="item_vat_amount[${rowIndex}]">
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]">
                                </td>
                                <td class="item-purchase-price-td">
                                    <input type="text" class="form-control" placeholder="Purchase Price" name="item_purchase_price[${rowIndex}]">
                                </td>
                                
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

                $("#invoice_table_tbody").append(purchaseOrderHtml);

                $(`#item_unit_${rowIndex}`)
                    .val(response.data.base_unit.unitId)
                    .trigger("change");

                $(".item-unit").select2({
                    placeholder: "Selection", // Match the placeholder in the select
                    allowClear: true,
                });

                updateSlColumn();
            } else {
                console.error("Service details not found");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        },
    });
    $("#item_name").val("").trigger("change");
});


// $(document).on('input blur', '.item-discount-percentage', function () {
//     let val = this.value;

//     // If empty, dash, or invalid → reset
//     if (val === '' || val === '-' || isNaN(val)) {
//         this.value = 0;
//         return;
//     }

//     val = parseFloat(val);

//     // Prevent negative
//     if (val < 0) {
//         this.value = 0;
//         return;
//     }

//     // Prevent > 100
//     if (val > 100) {
//         this.value = 100;
//         return;
//     }

//     // Keep clean number
//     this.value = val;
// });



// $(document).on('input', '.manual-item-discount-percentage', function () {
//     let value = parseFloat(this.value);

//     if (isNaN(value)) {
//         this.value = 0;
//         return;
//     }

//     if (value < 0) {
//         this.value = 0;
//     }

//     if (value > 100) {
//         this.value = 100;
//     }
// });

$(document).on("keydown", ".item-discount-percentage, .manual-item-discount-percentage", function (e) {
    if (e.key === "-" || e.key === "e") {
        e.preventDefault();
    }
});

$(document).on("input", ".item-discount-percentage, .manual-item-discount-percentage", function () {
    let val = $(this).val();

    val = val.replace(/[^0-9.]/g, "");

    let parts = val.split(".");
    if (parts.length > 2) {
        val = parts[0] + "." + parts[1];
        parts = val.split(".");
    }

    if (val.endsWith(".")) {
        $(this).val(val);
        return;
    }

    if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
        val = parts.join(".");
    }

    if (val.length > 1 && val.startsWith("0") && !val.startsWith("0.")) {
        val = val.replace(/^0+/, "") || "0";
    }

    let num = parseFloat(val);
    if (!isNaN(num)) {
        if (num > 100) num = 100;
        val = num.toString();
    }

    $(this).val(val);
});

$(document).on("click", "#add_item_manual_btn", function () {
    var rowIndex = $("#invoice_table_tbody tr").length; // Calculate index
    purchaseOrderHtml = `<tr>
                                <td class="item-sl-td">
                                ${rowIndex + 1}
                                    
                                </td>
                                <td class="item-code-td">
                                    <input type="text" class="service-id form-control" name="manual_item_code[${rowIndex}]" value="">

                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="form-control" name="manual_item_id[${rowIndex}]" value="">
                                    <input type="hidden" class="form-control" name="manual_sl_no[${rowIndex}]" value="${rowIndex + 1
        }">
                                                                        <input type="text" class="service-id form-control" name="manual_item_name[${rowIndex}]" value="">

                                    <input type="hidden" class="service-id form-control" name="manual_invoice_details_id[${rowIndex}]" value="">

                                </td>
                                
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control" placeholder="Quantity" name="manual_item_quantity[${rowIndex}]" value="1">
                                    
                                </td>
                                <td class="item-unit-td" style="width: 120px;">
                                   
                                    <input type="text" class="service-id form-control" name="manual_item_unit[${rowIndex}]" value="">
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="manual_item_unit_price[${rowIndex}]" value="">
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="manual_item_amount[${rowIndex}]" value="">
                                </td>
                                <td class="item-discount-percentage-td">
                                    <input type="text" class="form-control" placeholder="%" name="manual_item_discount_percentage[${rowIndex}]" value="0">
                                </td>
                                <td class="item-amount-after-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="manual_item_amount_after_discount[${rowIndex}]" value="">
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="manual_item_vat_percentage[${rowIndex}]" value="0">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Vat Amount" name="manual_item_vat_amount[${rowIndex}]">
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="manual_item_net_amount[${rowIndex}]">
                                </td>
                                <td class="item-purchase-price-td">
                                    <input type="text" class="form-control" placeholder="Purchase Price" name="manual_item_purchase_price[${rowIndex}]">
                                </td>
                                
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

    $("#invoice_table_tbody").append(purchaseOrderHtml);

    $(document).on(
        "input",
        `input[name="manual_item_quantity[${rowIndex}]"], input[name="manual_item_unit_price[${rowIndex}]"], input[name="manual_item_discount_percentage[${rowIndex}]"], input[name="manual_item_vat_percentage[${rowIndex}]"]`,
        function () {
            var quantity =
                parseFloat(
                    $(`input[name="manual_item_quantity[${rowIndex}]"]`).val()
                ) || 0;
            var unitPrice =
                parseFloat(
                    $(`input[name="manual_item_unit_price[${rowIndex}]"]`).val()
                ) || 0;
            var discountPercentage =
                parseFloat(
                    $(
                        `input[name="manual_item_discount_percentage[${rowIndex}]"]`
                    ).val()
                ) || 0;
            var vatPercentage =
                parseFloat(
                    $(
                        `input[name="manual_item_vat_percentage[${rowIndex}]"]`
                    ).val()
                ) || 0;

            // Calculate item amount (Quantity * Unit Price)
            var amount = quantity * unitPrice;

            // Apply discount
            var discountAmount = (amount * discountPercentage) / 100;
            var amountAfterDiscount = amount - discountAmount;

            // Calculate VAT
            var vatAmount = (amountAfterDiscount * vatPercentage) / 100;

            // Calculate net amount (Amount after discount + VAT)
            var netAmount = amountAfterDiscount + vatAmount;

            // Set the values in the respective fields
            $(`input[name="manual_item_amount[${rowIndex}]"]`).val(
                amount.toFixed(2)
            );
            $(
                `input[name="manual_item_amount_after_discount[${rowIndex}]"]`
            ).val(amountAfterDiscount.toFixed(2));
            $(`input[name="manual_item_vat_amount[${rowIndex}]"]`).val(
                vatAmount.toFixed(2)
            );
            $(`input[name="manual_item_net_amount[${rowIndex}]"]`).val(
                netAmount.toFixed(2)
            );
        }
    );

    // $("#item_name").val("").trigger("change");
    calculateTotals();
});

$(document).on("change", "#currency", function () {
    $.ajax({
        url:
            BASE_URL +
            "/purchase/get-currency-exrate-by-currency-id/" +
            $(this).val(),
        type: "get",
        success: function (response) {
            if (response.status === true) {
                $("#ex_rate").val(response.data.currency_exrate);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        },
    });
});

$(document).on("change", "#customer_type", function () {
    $("#customer_code").val("").trigger("change");
    $("#customer_name").val("").trigger("change");
});

$("#invoice_payment_option_btn").click(function () {
    $(".error-text").text("");
    $("#invoicePaymentOptionModal").modal("show");
});

$("#invoice_payment_option_update_btn").click(function () {
    $(".error-text").text("");
    $("#invoicePaymentOptionModal").modal("show");
    $.ajax({
        url: BASE_URL + "/sales/edit-invoice/" + $("#edit_invoice_id").val(),
        type: "GET",
        success: function (response) {
            if (response.status) {
                console.log(response.data.invoiceId);
                $('#savebtn').attr('data-id', response.data.invoiceId);

                const payments = response.data.service_order_payments;
                if (payments.length > 0) {
                    payments.forEach(function (payment) {
                        console.log(payment);
                        let checkbox = $("#paymentMethod" + payment.paymentType_generalSettingsId);

                        if (checkbox.length) {
                            // Check the checkbox
                            checkbox.prop("checked", true);

                            // Show and populate amount input
                            let amountInput = checkbox.closest('.border-bottom').find('.amount-input');
                            amountInput.removeClass('d-none').val(payment.amount);

                            // Show and populate reference number input
                            let referenceInput = checkbox.closest('.border-bottom').find('.reference-input');
                            referenceInput.removeClass('d-none').val(payment.referenceNumber);
                        }
                    });
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
});

// $(".payment-checkbox").change(function () {
//     var selectedCheckboxes = $(".payment-checkbox:checked");
//     var numberOfSelected = selectedCheckboxes.length;
//     grandTotal = $("#item_total_with_vat").val();
//     var amountToDistribute =
//         numberOfSelected > 0 ? (grandTotal / numberOfSelected).toFixed(2) : 0;
//     totalvalue = amountToDistribute * numberOfSelected;
//     temporaryArray.length = 0;
//     $(".payment-checkbox").each(function () {
//         var $parentDiv = $(this).closest("div.border-bottom");
//         var value = $(this).data("value");

//         if ($(this).is(":checked")) {
//             if (value !== "cash") {
//                 $parentDiv.find(".reference-input").removeClass("d-none");
//             } else {
//                 $parentDiv.find(".reference-input").val(0).addClass("d-none");
//             }
//             $parentDiv
//                 .find(".amount-input")
//                 .removeClass("d-none")
//                 .val(amountToDistribute);
//         } else {
//             $parentDiv.find(".amount-input").addClass("d-none").val("");
//             $parentDiv.find(".reference-input").addClass("d-none").val("");
//         }
//     });

//     distributeTotal();
// });

// $(".payment-checkbox").on("change", function () {
//     let totalAmount = parseFloat($("#item_total_with_vat").val()) || 0;
//     let checkedBoxes = $(".payment-checkbox:checked");
//     let splitAmount = totalAmount / checkedBoxes.length || 0;

//     $(".amount-input").addClass("d-none").val(""); // Hide and clear all amount inputs
//     // $(".reference-input").addClass("d-none").val(""); // Hide and clear all amount inputs

//     var $parentDiv = $(this).closest("div.border-bottom");
//     $parentDiv.find(".reference-input").addClass("d-none");


//     checkedBoxes.each(function () {
//         $(this).closest(".d-flex").next(".amount-input").removeClass("d-none").val(splitAmount.toFixed(2));
//         $(this).closest(".d-flex").next(".reference-input").removeClass("d-none").val(splitAmount.toFixed(2));

//         // $parentDiv.find(".reference-input").removeClass("d-none");

//     });
// });

// $(".payment-checkbox").on("change", function () {
//     let totalAmount = parseFloat($("#item_total_with_vat").val()) || 0;
//     let checkedBoxes = $(".payment-checkbox:checked");
//     let splitAmount = checkedBoxes.length ? totalAmount / checkedBoxes.length : 0;

//     // Hide and clear all amount inputs but keep reference input visible
//     $(".amount-input").addClass("d-none").val("");
//     $(".reference-input").val(""); // Clear reference input but don't hide it

//     checkedBoxes.each(function () {
//         var $parentDiv = $(this).closest(".border-bottom");
//         $parentDiv.find(".amount-input").removeClass("d-none").val(splitAmount.toFixed(2));
//         $parentDiv.find(".reference-input").removeClass("d-none"); // Ensure reference input stays visible
//     });
// });

$(".payment-checkbox").on("change", function () {
    let selectedValue = $(this).data("value");

    // Allow only one of "tabby" or "tamara" to be checked at a time
    if (selectedValue === "tabby") {
        $(".payment-checkbox[data-value='tamara']").prop("checked", false);
    } else if (selectedValue === "tamara") {
        $(".payment-checkbox[data-value='tabby']").prop("checked", false);
    }

    let totalAmount = parseFloat($("#item_total_with_vat").val()) || 0;
    let checkedBoxes = $(".payment-checkbox:checked");
    let splitAmount = checkedBoxes.length ? totalAmount / checkedBoxes.length : 0;

    // Hide and clear all amount inputs but keep reference input visible
    $(".amount-input").addClass("d-none").val("");
    $(".reference-input").val(""); // Clear reference input but don't hide it

    checkedBoxes.each(function () {
        var $parentDiv = $(this).closest(".border-bottom");
        $parentDiv.find(".amount-input").removeClass("d-none").val(splitAmount.toFixed(2));
        $parentDiv.find(".reference-input").removeClass("d-none"); // Ensure reference input stays visible
    });
});





// When user enters a manual amount
$(document).on("input", ".amount-input", function () {
    distributeAmount($(this).val(), $(this).attr('id'));
});

$("#savebtn").click(function (e) {
    let totalAmount = parseFloat($("#item_total_with_vat").val()) || 0;
    let paymentOptionTotal = calculatePaymentOptionsTotalAmount();
    console.log(parseFloat(totalAmount) + '==' + parseFloat(paymentOptionTotal));

    console.log(parseFloat(totalAmount) == parseFloat(paymentOptionTotal));

    const isConditionMet = parseFloat(totalAmount) == parseFloat(paymentOptionTotal);

    // if (amountToDistribute1 >= 0) {
    if (isConditionMet) {
        // $("#saveType").val("save");
        e.preventDefault();
        // $(".error-text").text("");

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to save?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, save it!",
            cancelButtonText: "No, cancel",
            customClass: {
                confirmButton: "btn btn-success waves-effect waves-light",
                cancelButton: "btn btn-danger waves-effect waves-light",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                // User clicked "Yes", so save the invoice
                if ($(this).attr("data-id")) {
                    updateInvoice($(this).attr("data-id"));
                } else {
                    saveInvoice($(this).attr("id"));
                }

            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // User clicked "Cancel", do nothing
                Swal.fire({
                    icon: "info",
                    text: "Not saved.",
                    customClass: {
                        confirmButton:
                            "btn btn-primary waves-effect waves-light",
                    },
                });
            }
        });
    } else {
        Swal.fire({
            icon: "error",
            text: "Please enter the amount correctly",
            customClass: {
                confirmButton: "btn btn-danger waves-effect waves-light",
            },
        });
    }
    // } else {
    //     Swal.fire({
    //         icon: "error",
    //         text: "The amount is wrong",
    //         customClass: {
    //             confirmButton: "btn btn-danger waves-effect waves-light",
    //         },
    //     });
    // }
});

$("#quotation_save_btn").click(function () {
    let itemCount = $("#invoice_table_tbody tr").length;
    if (itemCount > 0) {
        // Serialize data from all forms and convert it to a proper format
        var invoiceFormData = $("#invoice_form").serializeArray();
        // AJAX request
        $.ajax({
            url: BASE_URL + "/quotation/quotation",
            type: "POST",
            data: invoiceFormData, // Properly formatted form data
            success: function (response) {
                if (response.status === true) {
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        showCancelButton: true,
                        confirmButtonText: "Download Thermal PDF",
                        cancelButtonText: "Download A4 PDF",
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                            cancelButton:
                                "btn btn-primary waves-effect waves-light",
                        },
                        buttonsStyling: false,
                    }).then(function (result) {
                        if (result.isConfirmed) {
                            // Handle Thermal PDF download
                            // window.location.href = '/download-thermal-pdf/' + response.invoice_id;


                            const url =
                                quotationThermalPrintUrl +
                                "?quotationId=" +
                                encodeURIComponent(response.data.quotationId);
                            window.open(url, "_blank"); // Open URL in a new tab
                            location.reload();
                        } else if (
                            result.dismiss === Swal.DismissReason.cancel
                        ) {
                            // Handle A4 PDF download
                            const url =
                                quotationA4PrintUrl +
                                "?quotationId=" +
                                encodeURIComponent(response.data.quotationId);
                            window.open(url, "_blank"); // Open URL in a new tab
                            location.reload();
                        } else {
                            location.reload();
                        }
                    });

                } else {
                    Swal.fire({
                        icon: "error", // Change this to "error" for error messages
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light", // Optional: Change button styling for error
                        },
                    }).then(function () {
                        location.reload();
                    });
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status === 422) {
                    $(".error-text").text("");
                    var errors = xhr.responseJSON.errors;
                    // Display errors for medication sheet fields
                    $.each(errors, function (key, value) {
                        // Check if the error is for the medication sheet
                        if (
                            key.startsWith("item_quantity.") ||
                            key.startsWith("item_unit.") ||
                            key.startsWith("item_unit_price.") ||
                            key.startsWith("item_amount.") ||
                            key.startsWith("item_vat_percentage.") ||
                            key.startsWith("item_vat_amount.") ||
                            key.startsWith("item_net_amount.") ||
                            key.startsWith("item_remark.") ||
                            key.startsWith("item_discount_percentage.") ||
                            key.startsWith("item_amount_after_discount.") ||
                            key.startsWith("item_vat_percentage.") ||
                            key.startsWith("item_purchase_price.")
                        ) {
                            var fieldParts = key.split(".");
                            var fieldIndex = fieldParts[1];
                            var fieldName = fieldParts[0];
                            var targetRow = $("#invoice_table_tbody tr").eq(
                                fieldIndex
                            );
                            // Adjust selection for input or select fields
                            var targetCell = targetRow.find(
                                `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`
                            );

                            // Append error message below the field
                            if (targetCell.length > 0) {
                                // Check if the target is a select2 element
                                if (targetCell.is("select")) {
                                    var select2Container =
                                        targetCell.next(".select2-container");
                                    if (select2Container.length > 0) {
                                        select2Container.after(
                                            `<span class="text-danger error-text">${value[0]}</span>`
                                        );
                                    }
                                } else {
                                    targetCell.after(
                                        `<span class="text-danger error-text">${value[0]}</span>`
                                    );
                                }
                            }
                        } else {
                            // For other errors, handle them as per your existing logic
                            $("." + key + "_error").text(value[0]);
                        }
                    });
                } else {
                    console.error("Error fetching edit data:", xhr.message);
                    // $("#branchModel").modal("hide");

                    // Extract error message from the response
                    var errorMessage =
                        xhr.responseJSON && xhr.responseJSON.message
                            ? xhr.responseJSON.message
                            : "An unexpected error occurred. Please try again.";
                    // Display the error message in SweetAlert
                    Swal.fire({
                        icon: "error",
                        title: "Access denied",
                        text: errorMessage,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
        });
    } else {
        Swal.fire({
            icon: "error", // Change this to "error" for error messages
            text: "You must have items in table to save this page.",
            customClass: {
                confirmButton: "btn btn-danger waves-effect waves-light", // Optional: Change button styling for error
            },
        }).then(function () {
            location.reload();
        });
    }
});

$("#quotation_update_btn").click(function () {
    // Serialize data from all forms and convert it to a proper format
    var invoiceFormData = $("#invoice_form").serializeArray();
    // AJAX request
    $.ajax({
        url: BASE_URL + "/quotation/update-quotation/" + $("#edit_quotation_id").val(),
        type: "PUT",
        data: invoiceFormData, // Properly formatted form data
        success: function (response) {
            if (response.status === true) {
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                }).then(function () {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                }).then(function () {
                    location.reload();
                });
            }
        },
        error: function (xhr, status, error) {
            if (xhr.status === 422) {
                $(".error-text").text("");
                var errors = xhr.responseJSON.errors;
                // Display errors for medication sheet fields
                $.each(errors, function (key, value) {
                    // Check if the error is for the medication sheet
                    if (
                        key.startsWith("item_quantity.") ||
                        key.startsWith("item_unit.") ||
                        key.startsWith("item_unit_price.") ||
                        key.startsWith("item_amount.") ||
                        key.startsWith("item_vat_percentage.") ||
                        key.startsWith("item_vat_amount.") ||
                        key.startsWith("item_net_amount.") ||
                        key.startsWith("item_remark.") ||
                        key.startsWith("item_discount_percentage.") ||
                        key.startsWith("item_amount_after_discount.") ||
                        key.startsWith("item_vat_percentage.") ||
                        key.startsWith("item_purchase_price.")
                    ) {
                        var fieldParts = key.split(".");
                        var fieldIndex = fieldParts[1];
                        var fieldName = fieldParts[0];
                        var targetRow = $("#invoice_table_tbody tr").eq(
                            fieldIndex
                        );
                        // Adjust selection for input or select fields
                        var targetCell = targetRow.find(
                            `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`
                        ); // Match both input and select elements

                        // Append error message below the field
                        if (targetCell.length > 0) {
                            // Check if the target is a select box
                            if (targetCell.is("select")) {
                                targetCell.after(
                                    `<span class="text-danger error-text">${value[0]}</span>`
                                );
                            } else {
                                targetCell.after(
                                    `<span class="text-danger error-text">${value[0]}</span>`
                                );
                            }
                        }
                    } else {
                        // For other errors, handle them as per your existing logic
                        $("." + key + "_error").text(value[0]);
                    }
                });
            } else {
                // console.error("Error fetching edit data:", xhr.message);
                // $("#branchModel").modal("hide");

                // Extract error message from the response
                var errorMessage =
                    xhr.responseJSON && xhr.responseJSON.message
                        ? xhr.responseJSON.message
                        : "An unexpected error occurred. Please try again.";
                // Display the error message in SweetAlert
                Swal.fire({
                    icon: "error",
                    title: "Access denied",
                    text: errorMessage,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            }
        },
    });
});

$(document).on("change", ".item-unit", function () {
    const row = $(this).closest("tr");

    // Get the unit price from the selected option
    const unitPrice =
        parseFloat($(this).find(":selected").data("unit-price")) || 0;

    // Update the 'item-unit-price' field with the unit price
    row.find('input[name^="item_unit_price"]').val(unitPrice);

    // Trigger recalculations for the row
    updateRowCalculations(row);
});

$(document).on("change", "#branchId", function () {
    $.ajax({
        url: BASE_URL + "/sales/get-branch-details/" + $(this).val(),
        type: "GET",
        success: function (response) {
            if (response.status) {
                $("#branch_name").html(
                    response.data.clinicName_en +
                    ",<br>" +
                    response.data.address_en
                );
                $("#branch_phone").text(response.data.clinicMobile);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
});

// $(document).on(
//     "input",
//     'input[name^="item_quantity"], input[name^="item_vat_percentage"], input[name^="item_discount_percentage"], input[name^="manual_item_unit_price"], input[name^="manual_item_discount_percentage"],input[name^="manual_item_vat_percentage"]',
//     function () {
//         const row = $(this).closest("tr");
//         updateRowCalculations(row);
//     }
// );

$(document).on(
    "change",
    'input[name^="item_quantity"], input[name^="item_vat_percentage"], input[name^="item_discount_percentage"], input[name^="manual_item_unit_price"], input[name^="manual_item_discount_percentage"],input[name^="manual_item_vat_percentage"]',
    function () {
        const row = $(this).closest("tr");
        updateRowCalculations(row);
    }
);

function updateRowCalculations(row) {
    // Get the unit price and quantity
    const unitPrice =
        parseFloat(row.find('input[name^="item_unit_price"]').val()) || 0;
    const quantity =
        parseFloat(row.find('input[name^="item_quantity"]').val()) || 0;

    // Calculate item amount before discount
    const itemAmount = unitPrice * quantity;

    // Get the discount percentage and calculate discount amount
    const discountPercentage =
        parseFloat(row.find('input[name^="item_discount_percentage"]').val()) ||
        0;
    const discountAmount = (itemAmount * discountPercentage) / 100;

    // Calculate item amount after discount
    const discountedAmount = itemAmount - discountAmount;
    row.find('input[name^="item_amount"]').val(itemAmount.toFixed(2));
    row.find('input[name^="item_amount_after_discount"]').val(
        discountedAmount.toFixed(2)
    );

    // Get the VAT percentage and calculate VAT amount
    const vatPercentage =
        parseFloat(row.find('input[name^="item_vat_percentage"]').val()) || 0;
    const vatAmount = (discountedAmount * vatPercentage) / 100;
    row.find('input[name^="item_vat_amount"]').val(vatAmount.toFixed(2));

    // Calculate the total amount with VAT
    const totalAmount = discountedAmount + vatAmount;
    row.find('input[name^="item_net_amount"]').val(totalAmount.toFixed(2));

    // Update totals for the entire table
    calculateTotals();
}

function calculateTotals() {
    let totalItemAmount = 0;
    let totalVatAmount = 0;
    let totalNetAmount = 0;
    let totalDiscountAmount = 0;
    let totalWithoutVat = 0;

    // Loop through each row to accumulate totals
    $("#invoice_table_tbody tr").each(function () {
        const row = $(this);

        // Extract values from the current row
        const itemAmount =
            parseFloat(row.find('input[name^="item_amount"]').val()) || 0;
        const vatAmount =
            parseFloat(row.find('input[name^="item_vat_amount"]').val()) || 0;
        const netAmount =
            parseFloat(row.find('input[name^="item_net_amount"]').val()) || 0;
        const discountAmount =
            parseFloat(
                row.find('input[name^="item_discount_percentage"]').val()
            ) || 0;

        const manualItemAmount =
            parseFloat(row.find('input[name^="manual_item_amount"]').val()) ||
            0;
        const manualVatAmount =
            parseFloat(
                row.find('input[name^="manual_item_vat_amount"]').val()
            ) || 0;
        const manualNetAmount =
            parseFloat(
                row.find('input[name^="manual_item_net_amount"]').val()
            ) || 0;
        const manualDiscountAmount =
            parseFloat(
                row.find('input[name^="manual_item_discount_percentage"]').val()
            ) || 0;

        // Calculate discount amount for this row
        const discountValue = (itemAmount * discountAmount) / 100;

        // Calculate total without VAT for this row
        const withoutVat = itemAmount - discountValue;

        // Accumulate totals
        // totalItemAmount += itemAmount;
        // totalVatAmount += vatAmount;
        // totalNetAmount += netAmount;
        // totalDiscountAmount += discountValue;
        // totalWithoutVat += withoutVat;
        totalItemAmount += itemAmount + manualItemAmount;
        totalVatAmount += vatAmount + manualVatAmount;
        totalNetAmount += netAmount + manualNetAmount;
        totalDiscountAmount += discountValue + manualDiscountAmount;
        totalWithoutVat +=
            withoutVat + manualItemAmount - manualDiscountAmount / 100;
    });

    // Update the total fields in the form
    $("#item_total").val(totalItemAmount.toFixed(2));
    $("#item_discount_amount").val(totalDiscountAmount.toFixed(2));
    $("#item_total_without_vat").val(totalWithoutVat.toFixed(2));
    $("#item_vat_total").val(totalVatAmount.toFixed(2));
    $("#item_total_with_vat").val(totalNetAmount.toFixed(2));
}

function initialPageLoad(quotationId) {
    $.ajax({
        url: BASE_URL + "/quotation/edit-quotation/" + quotationId,
        type: "GET",
        success: function (response) {
            if (response.status && response.data) {
                // Fill basic quotation data
                $('#quotation_no').val(response.data.quotationNo);
                $("#po_no").val(response.data.poNo);
                $('#quotation').val(response.data.quotation);
                $('#refference_no').val(response.data.refferenceNo);

                $("#mode_of_pay").val(response.data.transactionType).trigger("change");
                $("#branchId").val(response.data.clinicId).trigger("change");
                $("#customer_type").val(response.data.customerType).trigger("change");

                // Date formatting
                if (response.data.quotationDate) {
                    let date = new Date(response.data.quotationDate);
                    let formattedDate = date.toISOString().split("T")[0];
                    $("#quotation_date").val(formattedDate);
                }

                $("#delivery_number").val(response.data.quotationNo);
                $("#payment_terms").val(response.data.paymentTerms);

                // --- SAFE CUSTOMER LOADING ---
                if (response.data.customer) {
                    const customer = response.data.customer;

                    // 1. Handle Customer Code Dropdown
                    if (!$("#customer_code").find('option[value="' + customer.regularCustomerId + '"]').length) {
                        $("#customer_code").append($("<option>", {
                            value: customer.regularCustomerId,
                            text: customer.customerNo
                        }));
                    }
                    $("#customer_code").val(customer.regularCustomerId).trigger("change");

                    // 2. Handle Customer Name Dropdown
                    if (!$("#customer_name").find('option[value="' + customer.regularCustomerId + '"]').length) {
                        $("#customer_name").append($("<option>", {
                            value: customer.regularCustomerId,
                            text: customer.customerName
                        }));
                    }
                    $("#customer_name").val(customer.regularCustomerId).trigger("change");
                } else {
                    console.warn("No customer data found for this quotation.");
                    // Optional: Reset dropdowns to empty or a "Walk-in" value
                    $("#customer_code, #customer_name").val('').trigger("change");
                }
                // --- END CUSTOMER LOADING ---

                $("#tax_id").val(response.data.taxId);
                $("#ex_rate").val(response.data.exRate);
                $("#currency").val(response.data.currencyId).trigger("change");

                $("#validity").val(response.data.validity);
                $("#payment").val(response.data.payment);
                $("#delivery").val(response.data.delivery);
                $("#place_of_delivery").val(response.data.placeOfDelivery);
                $("#attention").val(response.data.attention);

                // Load items
                if (response.data.quotation_items) {
                    pupulateInvoiceItems(response.data.quotation_items);
                }

                // Fill totals
                $("#item_total").val(response.data.totalAmount);
                $("#item_discount_amount").val(response.data.discountAmount);
                $("#item_total_without_vat").val(response.data.totalAmountAfterDiscount);
                $("#item_vat_total").val(response.data.vatAmount);
                $("#item_total_with_vat").val(response.data.totalAmountWithVat);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
}

function pupulateInvoiceItems(invoiceItems) {
    $("#invoice_table_tbody").empty();
    invoiceItems.forEach((invoiceItem, index) => {
        let unitoptions = "";
        if (invoiceItem.quotation_items_details.units) {
            invoiceItem.quotation_items_details.units.forEach(function (unit) {
                unitoptions += `<option value="${unit.unitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
            });
        }
        var rowIndex = $("#invoice_table_tbody tr").length; // Calculate index
        purchaseOrderHtml = `<tr>
                                <td class="item-sl-td">
                                ${rowIndex + 1}
                                    
                                </td>
                                <td class="item-code-td">
                                    ${invoiceItem.quotation_items_details
                .itemCode
            }
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="form-control" name="item_id[${rowIndex}]" value="${invoiceItem.itemMasterId
            }">
                                    <input type="hidden" class="form-control" name="sl_no[${rowIndex}]" value="${rowIndex + 1
            }">
                                    ${invoiceItem.quotation_items_details
                .itemName_en
            }
                                    <input type="hidden" class="service-id form-control" name="quotation_item_id[${rowIndex}]" value="${invoiceItem.quotationItemId
            }">
                                </td>
                                
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${invoiceItem.quantity
            }">
                                    
                                </td>
                                <td class="item-unit-td" style="width: 200px;">
                                    <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="item_unit_price[${rowIndex}]" value="${invoiceItem.unitPrice
            }">
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="${invoiceItem.amount
            }">
                                </td>
                                <td class="item-discount-percentage-td">
                                    <input type="text" class="form-control" placeholder="%" name="item_discount_percentage[${rowIndex}]" value="${invoiceItem.discountPercent
            }">
                                </td>
                                <td class="item-amount-after-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount_after_discount[${rowIndex}]" value="${invoiceItem.amountAfterDiscount
            }">
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[${rowIndex}]" value="${invoiceItem.vatPercent
            }">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Vat Amount" name="item_vat_amount[${rowIndex}]" value="${invoiceItem.vatAmount
            }">
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="${invoiceItem.amountWithVat
            }">
                                </td>
                                <td class="item-purchase-price-td">
                                    <input type="text" class="form-control" placeholder="Purchase Price" name="item_purchase_price[${rowIndex}]" value="${invoiceItem.purchasePrice
            }">
                                </td>
                                
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row" data-id="${invoiceItem.invoiceDetailsId
            }" data-type="${invoiceItem.itemMasterId
            }">X</button>
                                </td>
                            </tr>`;

        $("#invoice_table_tbody").append(purchaseOrderHtml);

        $(`#item_unit_${rowIndex}`)
            .val(invoiceItem.itemUnitId)
            .trigger("change");

        $(".item-unit").select2({
            placeholder: "Selection", // Match the placeholder in the select
            allowClear: true,
        });
    });

    // $("#item_td_count").val(indexCount);
}

function populateManualInvoiceItems(manualItems) {
    let manualInvoiceHtml = "";

    manualItems.forEach((manualItem, index) => {
        var rowIndex = $("#invoice_table_tbody tr").length + index; // Ensure correct row index

        manualInvoiceHtml += `<tr>
            <td class="item-sl-td">${rowIndex + 1}</td>
            <td class="item-code-td">
                <input type="text" class="service-id form-control" name="manual_item_code[${rowIndex}]" value="${manualItem.itemCode
            }">
            </td>
            <td class="item-name-td">
                <input type="hidden" class="form-control" name="manual_item_id[${rowIndex}]" value="${manualItem.itemMasterId || ""
            }">
                <input type="hidden" class="form-control" name="manual_sl_no[${rowIndex}]" value="${rowIndex + 1
            }">
                <input type="text" class="service-id form-control" name="manual_item_name[${rowIndex}]" value="${manualItem.itemMasterName
            }">
                <input type="hidden" class="service-id form-control" name="manual_invoice_details_id[${rowIndex}]" value="${manualItem.invoiceDetailsId
            }">
            </td>
            <td class="item-quantity-td">
                <input type="number" class="form-control" placeholder="Quantity" name="manual_item_quantity[${rowIndex}]" value="${manualItem.quantity
            }">
            </td>
            <td class="item-unit-td" style="width: 120px;">
                <input type="text" class="service-id form-control" name="manual_item_unit[${rowIndex}]" value="${manualItem.unitItemName
            }">
            </td>
            <td class="item-unit-price-td">
                <input type="text" class="form-control" placeholder="Price" name="manual_item_unit_price[${rowIndex}]" value="${manualItem.unitPrice
            }">
            </td>
            <td class="item-amount-td">
                <input type="text" class="form-control" placeholder="Amount" name="manual_item_amount[${rowIndex}]" value="${manualItem.amount
            }">
            </td>
            <td class="item-discount-percentage-td">
                <input type="text" class="form-control" placeholder="%" name="manual_item_discount_percentage[${rowIndex}]" value="${manualItem.discountPercent
            }">
            </td>
            <td class="item-amount-after-discount-td">
                <input type="text" class="form-control" placeholder="Amount" name="manual_item_amount_after_discount[${rowIndex}]" value="${manualItem.amountAfterDiscount
            }">
            </td>
            <td class="vat-percentage-td">
                <input type="text" class="form-control" placeholder="Percentage" name="manual_item_vat_percentage[${rowIndex}]" value="${manualItem.vatPercent || 0
            }">
            </td>
            <td class="vat-amount-td">
                <input type="text" class="form-control" placeholder="Vat Amount" name="manual_item_vat_amount[${rowIndex}]" value="${manualItem.vatAmount
            }">
            </td>
            <td class="net-amount-td">
                <input type="text" class="form-control" placeholder="Total Amount" name="manual_item_net_amount[${rowIndex}]" value="${manualItem.amountWithVat
            }">
            </td>
            <td class="item-purchase-price-td">
                <input type="text" class="form-control" placeholder="Purchase Price" name="manual_item_purchase_price[${rowIndex}]" value="${manualItem.purchasePrice
            }">
            </td>
            <td class="remove-td">
                <button type="button" data-id="${manualItem.invoiceDetailsId
            }" data-type="${"manual-item"}" class="btn btn-danger remove-row">X</button>
            </td>
        </tr>`;
    });
    setTimeout(() => {
        $("#invoice_table_tbody").append(manualInvoiceHtml);
    }, 1000);
    // $("#invoice_table_tbody").append(manualInvoiceHtml);
}

$(document).on("input", "#item_discount_amount", function () {
    // Get values from the inputs
    let itemTotal = parseFloat($("#item_total").val()) || 0;
    let discountAmount = parseFloat($("#item_discount_amount").val()) || 0;
    let vatPercentage = 15;

    // Calculate total without VAT after discount
    let totalWithoutVat = itemTotal - discountAmount;
    if (totalWithoutVat < 0) {
        totalWithoutVat = 0;
    }

    // Calculate VAT amount
    let vatAmount = (totalWithoutVat * vatPercentage) / 100;

    // Calculate total with VAT
    let totalWithVat = totalWithoutVat + vatAmount;

    // Update the fields
    $("#item_total_without_vat").val(totalWithoutVat.toFixed(2));
    $("#item_vat_total").val(vatAmount.toFixed(2));
    $("#item_total_with_vat").val(totalWithVat.toFixed(2));
});

// $(document).on("click", "#thermalPrintBtn", function (e) {
//     e.preventDefault(); // Prevent default anchor behavior
//     const selectedValue = $("#invoice_number_pdf").val(); // Get selected value

//     var invoiceFormData = $("#invoice_form").serializeArray();
//     console.log(invoiceFormData);

//     const url = invoiceThermalPrintUrl + "?invoiceId=" + encodeURIComponent(selectedValue);

//     // Send an AJAX request
//     $.ajax({
//         url: url,
//         type: 'POST', // Or 'GET' if the server expects GET requests
//         data: invoiceFormData,
//         success: function(response) {
//             console.log("Data sent successfully:", response);
//             // Open a new tab with the printed data (you may need to pass the necessary content here)
//             window.open(response.printUrl, "_blank"); // Adjust based on the response structure
//         },
//         error: function(xhr, status, error) {
//             console.error("Error occurred:", error);
//         }
//     });
// });

$(document).on("click", "#thermalPrintBtn", function (e) {
    e.preventDefault(); // Prevent default anchor behavior
    const selectedValue = $("#invoice_number_pdf").val(); // Get selected value
    if (!selectedValue) {
        // alert('Please select a Invoice Number.');
        $(".invoice_number_pdf_error").text("Please select a Invoice Number.");
        return;
    }
    const url =
        invoiceThermalPrintUrl +
        "?invoiceId=" +
        encodeURIComponent(selectedValue);
    window.open(url, "_blank"); // Open URL in a new tab
});

$(document).on("click", "#printBtn", function (e) {
    e.preventDefault(); // Prevent default anchor behavior
    const selectedValue = $("#invoice_number_pdf").val(); // Get selected value
    if (!selectedValue) {
        $(".invoice_number_pdf_error").text("Please select a Invoice Number.");
        return;
    }
    const url =
        invoiceA4PrintUrl + "?invoiceId=" + encodeURIComponent(selectedValue);
    window.open(url, "_blank"); // Open URL in a new tab
});






// Remove row and update SL column
$(document).on("click", ".remove-row", function () {
    $(this).closest("tr").remove();
    var invoiceDetailsId = $(this).data("id");
    var itemId = $(this).data("type");

    if (invoiceDetailsId > 0 && itemId > 0) {
        deleteAlreadyExistItem(invoiceDetailsId, itemId);
    } else if (invoiceDetailsId > 0 && itemId === "manual-item") {
        deleteAlreadyExistItem(invoiceDetailsId, itemId);
    }
    updateSlColumn();
});

function updateSlColumn() {
    $("#invoice_table_tbody tr").each(function (index, row) {
        const rowIndex = index + 1; // Update index for display
        $(row)
            .find("input, select")
            .each(function () {
                const name = $(this).attr("name");
                if (name) {
                    const updatedName = name.replace(/\[\d+\]/, `[${index}]`);
                    $(this).attr("name", updatedName);
                }
            });
        $(row)
            .find(".item-sl-td")
            .text(index + 1);
    });
}

// Update SL column sequence
// function updateSlColumn() {
//     $("#purchase_table_tbody tr").each(function (index) {
//         $(this)
//             .find(".item-sl-td")
//             .text(index + 1);
//         // Update rowIndex for the item-unit-price-td input
//         $(this)
//             .find('.item-name-td input[name^="sl_no"]')
//             .attr("name", `sl_no[${index}]`);
//         $(this)
//             .find('.item-name-td input[name^="item_id"]')
//             .attr("name", `item_id[${index}]`);
//         $(this)
//             .find(".item-quantity-td input")
//             .attr("name", `item_quantity[${index}]`);
//         $(this)
//             .find(".item-unit-td select")
//             .attr("name", `item_unit[${index}]`);
//         $(this)
//             .find(".item-unit-price-td input")
//             .attr("name", `item_unit_price[${index}]`);
//         $(this)
//             .find(".item-amount-td input")
//             .attr("name", `item_amount[${index}]`);
//         $(this)
//             .find(".vat-percentage-td input")
//             .attr("name", `item_vat_percentage[${index}]`);
//         $(this)
//             .find(".vat-amount-td input")
//             .attr("name", `item_vat_amount[${index}]`);
//         $(this)
//             .find(".net-amount-td input")
//             .attr("name", `item_net_amount[${index}]`);
//         $(this)
//             .find(".item-remark-td input")
//             .attr("name", `item_remark[${index}]`);
//     });

// }
function deleteAlreadyExistItem(invoiceDetailsId, itemId) {
    Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        customClass: {
            confirmButton: "btn btn-danger waves-effect waves-light",
            cancelButton: "btn btn-secondary waves-effect waves-light",
        },
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url:
                    BASE_URL +
                    "/sales/delete-invoice-item/" +
                    invoiceDetailsId +
                    "/" +
                    itemId, // Adjust URL if needed
                type: "DELETE",
                data: itemId, // Pass any required data here
                success: function (response) {
                    if (response.status === true) {
                        Swal.fire({
                            icon: "success",
                            text: response.message,
                            customClass: {
                                confirmButton:
                                    "btn btn-success waves-effect waves-light",
                            },
                        }).then(function () {
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
                error: function (xhr, status, error) {
                    console.error("Error fetching edit data:", xhr.message);
                    $("#branchModel").modal("hide");

                    // Extract error message from the response
                    var errorMessage =
                        xhr.responseJSON && xhr.responseJSON.message
                            ? xhr.responseJSON.message
                            : "An unexpected error occurred. Please try again.";

                    // Display the error message in SweetAlert
                    Swal.fire({
                        icon: "error",
                        title: "Access denied",
                        text: errorMessage,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Reload the page
                            location.reload();
                        }
                    });
                },
            });
        }
    });
}

let manualEntries = {}; // Store manually entered values

// function distributeAmount(enteredAmount, inputId) {
//     console.log('Entered Value =>', enteredAmount);
//     console.log('Entered ID =>', inputId);

//     let totalAmount = parseFloat($("#item_total_with_vat").val()) || 0;
//     let checkedBoxes = $(".payment-checkbox:checked");
//     let remainingAmount = totalAmount;
//     let autoSplitFields = [];

//     // Store manually entered value
//     if (enteredAmount > 0) {
//         manualEntries[inputId] = parseFloat(enteredAmount);
//     } else {
//         delete manualEntries[inputId]; // Remove if value is cleared
//     }

//     console.log("Total Amount:", totalAmount);
//     console.log("Manual Entries:", manualEntries);

//     // Calculate remaining amount after manually entered values
//     Object.values(manualEntries).forEach(value => {
//         remainingAmount -= value;
//     });

//     console.log("Remaining Amount after Manual Entries:", remainingAmount);

//     // Collect input fields that need automatic split
//     checkedBoxes.each(function () {
//         let amountInput = $(this).closest(".d-flex").nextAll(".amount-input").first();
//         if (!manualEntries[amountInput.attr("id")]) {
//             autoSplitFields.push(amountInput);
//         }
//     });

//     let autoSplitCount = autoSplitFields.length;
//     let splitAmount = autoSplitCount > 0 ? remainingAmount / autoSplitCount : 0;

//     console.log("Auto Split Count:", autoSplitCount);
//     console.log("Split Amount Per Field:", splitAmount);

//     // Assign split amount to remaining fields
//     autoSplitFields.forEach(function (amountInput) {
//         amountInput.val(splitAmount.toFixed(2));
//     });
// }

function distributeAmount(enteredAmount, inputId) {
    console.log('Entered Value =>', enteredAmount);
    console.log('Entered ID =>', inputId);

    let totalAmount = parseFloat($("#item_total_with_vat").val()) || 0;
    let checkedBoxes = $(".payment-checkbox:checked");
    let remainingAmount = totalAmount;
    let autoSplitFields = [];

    // Store manually entered value
    if (enteredAmount > 0) {
        manualEntries[inputId] = parseFloat(enteredAmount);
    } else {
        delete manualEntries[inputId]; // Remove if value is cleared
    }

    console.log("Total Amount:", totalAmount);
    console.log("Manual Entries:", manualEntries);

    // Calculate remaining amount after manually entered values
    Object.values(manualEntries).forEach(value => {
        remainingAmount -= value;
    });

    console.log("Remaining Amount after Manual Entries:", remainingAmount);

    // Collect input fields that need automatic split
    checkedBoxes.each(function () {
        let amountInput = $(this).closest(".d-flex").nextAll(".amount-input").first();
        if (!manualEntries[amountInput.attr("id")]) {
            autoSplitFields.push(amountInput);
        }
    });

    let autoSplitCount = autoSplitFields.length;
    let splitAmount = autoSplitCount > 0 ? remainingAmount / autoSplitCount : 0;

    console.log("Auto Split Count:", autoSplitCount);
    console.log("Split Amount Per Field:", splitAmount);

    // Check if split amount is negative and show error if it is
    if (splitAmount < 0) {
        // Display error message
        $(".error-message").remove(); // Remove any previous error message
        let errorMessage = '<span class="error-message" style="color: red;">Negative split amount is not allowed!</span>';
        $(autoSplitFields[0]).closest(".d-flex").append(errorMessage); // Display the error below the first split amount field
    } else {
        // If valid, assign split amount to remaining fields and hide error message
        $(".error-message").remove(); // Remove any previous error message

        autoSplitFields.forEach(function (amountInput) {
            amountInput.val(splitAmount.toFixed(2));
        });
    }
}



function calculatePaymentOptionsTotalAmount() {
    let sum = 0;
    $(".amount-input:not(.d-none)").each(function () {
        sum += parseFloat($(this).val()) || 0;
    });

    // Display the total sum somewhere (modify this as needed)
    return sum.toFixed(2);
}


function saveInvoice(params) {
    let itemCount = $("#invoice_table_tbody tr").length;
    if (itemCount > 0) {
        // Serialize data from all forms and convert it to a proper format
        var invoiceFormData = $("#invoice_form").serialize();
        var paymentFormData = $('#paymentForm').serialize();
        var combinedData = invoiceFormData + "&" + paymentFormData;
        // AJAX request
        $.ajax({
            url: BASE_URL + "/sales/invoice",
            type: "POST",
            data: combinedData, // Properly formatted form data
            success: function (response) {
                if (response.status === true) {
                    // Swal.fire({
                    //     icon: "success",
                    //     text: response.message,
                    //     customClass: {
                    //         confirmButton:
                    //             "btn btn-success waves-effect waves-light",
                    //     },
                    // }).then(function () {
                    //     location.reload();
                    // });
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        showCancelButton: true,
                        confirmButtonText: "Download Thermal PDF",
                        cancelButtonText: "Download A4 PDF",
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                            cancelButton:
                                "btn btn-primary waves-effect waves-light",
                        },
                        buttonsStyling: false,
                    }).then(function (result) {
                        if (result.isConfirmed) {
                            // Handle Thermal PDF download
                            // window.location.href = '/download-thermal-pdf/' + response.invoice_id;
                            const url =
                                invoiceThermalPrintUrl +
                                "?invoiceId=" +
                                encodeURIComponent(response.data.invoiceId);
                            window.open(url, "_blank"); // Open URL in a new tab
                            location.reload();
                        } else if (
                            result.dismiss === Swal.DismissReason.cancel
                        ) {
                            // Handle A4 PDF download
                            const url =
                                invoiceA4PrintUrl +
                                "?invoiceId=" +
                                encodeURIComponent(response.data.invoiceId);
                            window.open(url, "_blank"); // Open URL in a new tab
                            location.reload();
                        } else {
                            location.reload();
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "error", // Change this to "error" for error messages
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light", // Optional: Change button styling for error
                        },
                    }).then(function () {
                        location.reload();
                    });
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status === 422) {
                    $(".error-text").text("");
                    var errors = xhr.responseJSON.errors;
                    // Display errors for medication sheet fields
                    $.each(errors, function (key, value) {
                        // Check if the error is for the medication sheet
                        if (
                            key.startsWith("item_quantity.") ||
                            key.startsWith("item_unit.") ||
                            key.startsWith("item_unit_price.") ||
                            key.startsWith("item_amount.") ||
                            key.startsWith("item_vat_percentage.") ||
                            key.startsWith("item_vat_amount.") ||
                            key.startsWith("item_net_amount.") ||
                            key.startsWith("item_remark.") ||
                            key.startsWith("item_discount_percentage.") ||
                            key.startsWith("item_amount_after_discount.") ||
                            key.startsWith("item_vat_percentage.") ||
                            key.startsWith("item_purchase_price.")
                        ) {
                            var fieldParts = key.split(".");
                            var fieldIndex = fieldParts[1];
                            var fieldName = fieldParts[0];
                            var targetRow = $("#invoice_table_tbody tr").eq(
                                fieldIndex
                            );
                            // Adjust selection for input or select fields
                            var targetCell = targetRow.find(
                                `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`
                            );

                            // Append error message below the field
                            if (targetCell.length > 0) {
                                // Check if the target is a select2 element
                                if (targetCell.is("select")) {
                                    var select2Container =
                                        targetCell.next(".select2-container");
                                    if (select2Container.length > 0) {
                                        select2Container.after(
                                            `<span class="text-danger error-text">${value[0]}</span>`
                                        );
                                    }
                                } else {
                                    targetCell.after(
                                        `<span class="text-danger error-text">${value[0]}</span>`
                                    );
                                }
                            }
                        } else {
                            // For other errors, handle them as per your existing logic
                            $("." + key + "_error").text(value[0]);
                        }
                    });
                } else {
                    console.error("Error fetching edit data:", xhr.message);
                    // $("#branchModel").modal("hide");

                    // Extract error message from the response
                    var errorMessage =
                        xhr.responseJSON && xhr.responseJSON.message
                            ? xhr.responseJSON.message
                            : "An unexpected error occurred. Please try again.";
                    // Display the error message in SweetAlert
                    Swal.fire({
                        icon: "error",
                        title: "Access denied",
                        text: errorMessage,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
        });
    } else {
        Swal.fire({
            icon: "error", // Change this to "error" for error messages
            text: "You must have items in table to save this page.",
            customClass: {
                confirmButton: "btn btn-danger waves-effect waves-light", // Optional: Change button styling for error
            },
        }).then(function () {
            location.reload();
        });
    }

}



function updateInvoice(invoiceId) {
    // Serialize data from all forms and convert it to a proper format
    var invoiceFormData = $("#invoice_form").serialize();
    var paymentFormData = $('#paymentForm').serialize();
    var combinedData = invoiceFormData + "&" + paymentFormData;
    // AJAX request
    $.ajax({
        url: BASE_URL + "/sales/update-invoice/" + invoiceId,
        type: "PUT",
        data: combinedData, // Properly formatted form data
        success: function (response) {
            if (response.status === true) {
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    showCancelButton: true,
                    confirmButtonText: "Download Thermal PDF",
                    cancelButtonText: "Download A4 PDF",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                        cancelButton:
                            "btn btn-primary waves-effect waves-light",
                    },
                    buttonsStyling: false,
                }).then(function (result) {
                    if (result.isConfirmed) {
                        // Handle Thermal PDF download
                        // window.location.href = '/download-thermal-pdf/' + response.invoice_id;
                        const url =
                            invoiceThermalPrintUrl +
                            "?invoiceId=" +
                            encodeURIComponent(response.data.invoiceId);
                        window.open(url, "_blank"); // Open URL in a new tab
                        location.reload();
                    } else if (
                        result.dismiss === Swal.DismissReason.cancel
                    ) {
                        // Handle A4 PDF download
                        const url =
                            invoiceA4PrintUrl +
                            "?invoiceId=" +
                            encodeURIComponent(response.data.invoiceId);
                        window.open(url, "_blank"); // Open URL in a new tab
                        location.reload();
                    } else {
                        location.reload();
                    }
                });
            } else {
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                }).then(function () {
                    location.reload();
                });
            }
        },
        error: function (xhr, status, error) {
            if (xhr.status === 422) {
                $(".error-text").text("");
                var errors = xhr.responseJSON.errors;
                // Display errors for medication sheet fields
                $.each(errors, function (key, value) {
                    // Check if the error is for the medication sheet
                    if (
                        key.startsWith("item_quantity.") ||
                        key.startsWith("item_unit.") ||
                        key.startsWith("item_unit_price.") ||
                        key.startsWith("item_amount.") ||
                        key.startsWith("item_vat_percentage.") ||
                        key.startsWith("item_vat_amount.") ||
                        key.startsWith("item_net_amount.") ||
                        key.startsWith("item_remark.") ||
                        key.startsWith("item_discount_percentage.") ||
                        key.startsWith("item_amount_after_discount.") ||
                        key.startsWith("item_vat_percentage.") ||
                        key.startsWith("item_purchase_price.")
                    ) {
                        var fieldParts = key.split(".");
                        var fieldIndex = fieldParts[1];
                        var fieldName = fieldParts[0];
                        var targetRow = $("#invoice_table_tbody tr").eq(
                            fieldIndex
                        );
                        // Adjust selection for input or select fields
                        var targetCell = targetRow.find(
                            `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`
                        ); // Match both input and select elements

                        // Append error message below the field
                        if (targetCell.length > 0) {
                            // Check if the target is a select box
                            if (targetCell.is("select")) {
                                targetCell.after(
                                    `<span class="text-danger error-text">${value[0]}</span>`
                                );
                            } else {
                                targetCell.after(
                                    `<span class="text-danger error-text">${value[0]}</span>`
                                );
                            }
                        }
                    } else {
                        // For other errors, handle them as per your existing logic
                        $("." + key + "_error").text(value[0]);
                    }
                });
            } else {
                // console.error("Error fetching edit data:", xhr.message);
                // $("#branchModel").modal("hide");

                // Extract error message from the response
                var errorMessage =
                    xhr.responseJSON && xhr.responseJSON.message
                        ? xhr.responseJSON.message
                        : "An unexpected error occurred. Please try again.";
                // Display the error message in SweetAlert
                Swal.fire({
                    icon: "error",
                    title: "Access denied",
                    text: errorMessage,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            }
        },
    });
}

function toggleVatField() {
    let customerType = $('#customer_type').val();
    if (customerType === 'b2c') {
        $('.tax_id').closest('.col-3').hide();
    } else {
        $('.tax_id').closest('.col-3').show();
    }
}

