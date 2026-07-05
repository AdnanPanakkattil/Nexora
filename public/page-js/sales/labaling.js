let grandTotal = 0;

$(document).ready(function () {
    $("#sales_main_menu").addClass("active open menu-item-animating");
    $("#invoice_sub_menu").addClass("active");

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

    var selectElement = $('#branchId');

    // Check if the number of options (excluding the first empty option) is 1
    if (selectElement.find('option').length === 2) { // One option + "Select"
        // Set the default value to the only available option
        selectElement.val(selectElement.find('option').not(':first').val()).trigger('change');
    }

    if ($("#edit_invoice_id").val()) {
        initialPageLoad($("#edit_invoice_id").val());
    } else {
        // Get the current date in YYYY-MM-DD format
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0]; // Format the date

        // Set the current date as the value of the input field
        $("#invoice_date").val(formattedDate);
    }
    flatpickr("#invoice_date", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
    });

    $("#customer_name").select2({
        placeholder: "Search Customer Name",
        allowClear: true,
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

    $("#item_name").select2({
        placeholder: "Search Item Name",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url: BASE_URL + "/sales/search-item-name-by-query",
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

function initialPageLoad(invoiceId) {
    $.ajax({
        url: BASE_URL + "/sales/edit-invoice/" + invoiceId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                $("#branchId").val(response.data.clinicId).trigger("change");
                $("#customer_type")
                    .val(response.data.customerType)
                    .trigger("change");

                $("#pre_invoice_no").val(response.data.invoiceNo);
                let date = new Date(response.data.invoiceDate); // Parse the date string
                let formattedDate = date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
                $("#invoice_date").val(formattedDate);
                $("#po_no").val(response.data.poNo);
                $("#delivery_number").val(response.data.quotationNo);
                $("#mode_of_pay")
                    .val(response.data.transactionType)
                    .trigger("change");
                $("#payment_terms").val(response.data.paymentTerms);
                // // Check if the option already exists in the dropdown
                if (
                    !$("#customer_code").find(
                        'option[value="' +
                        response.data.customer.regularCustomerId +
                        '"]'
                    ).length
                ) {
                    // Append the new option
                    $("#customer_code").append(
                        $("<option>", {
                            value: response.data.customer.regularCustomerId, // Set the value as the vendorId
                            text: response.data.customer.customerNo, // Set the text as the vendor name
                        })
                    );
                }
                $("#customer_code")
                    .val(response.data.customer.regularCustomerId)
                    .trigger("change");
                $("#customer_name").val(response.data.customer.customerName);
                $("#tax_id").val(response.data.taxId);
                $("#currency").val(response.data.currencyId).trigger("change");
                $("#ex_rate").val(response.data.exRate);

                // // // Set the newly added or existing option as selected

                populateManualInvoiceItems(response.data.invoice_manual_items);

                purchasedItemsTotal = pupulateInvoiceItems(
                    response.data.invoice_items
                );
                $("#item_total").val(response.data.totalAmount);
                $("#item_discount_amount").val(response.data.discountAmount);
                $("#item_total_without_vat").val(
                    response.data.totalAmountAfterDiscount
                );
                $("#item_vat_total").val(response.data.vatAmount);
                $("#item_total_with_vat").val(response.data.totalAmountWithVat);
                $("#item_total_with_vat").val(
                    response.data.netAmountWithExRate
                );

                // $('#purchase_table_tr_count').val($('#purchase_table_tbody tr').length);
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
        if (invoiceItem.invoice_items_details.units) {
            invoiceItem.invoice_items_details.units.forEach(function (unit) {
                unitoptions += `<option value="${unit.unitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
            });
        }
        var rowIndex = $("#invoice_table_tbody tr").length; // Calculate index
        purchaseOrderHtml = `<tr>
                              
                                <td class="item-code-td">
                                    ${invoiceItem.invoice_items_details
                .itemCode
            }
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="form-control" name="item_id[${rowIndex}]" value="${invoiceItem.itemMasterId
            }" disabled>
                                    <input type="hidden" class="form-control" name="sl_no[${rowIndex}]" value="${rowIndex + 1
            }" disabled>
                                    ${invoiceItem.invoice_items_details
                .itemName_en
            }
                                    <input type="hidden" class="service-id form-control" name="invoice_details_id[${rowIndex}]" value="${invoiceItem.invoiceDetailsId
            }" disabled>
                                </td>
                                
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${invoiceItem.quantity
            }" disabled>
                                    
                                </td>
                                <td class="item-unit-td" style="width: 200px;">
                                    <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true" disabled>
                                        ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="item_unit_price[${rowIndex}]" value="${invoiceItem.unitPrice
            }" disabled>
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="${invoiceItem.amount
            }" disabled>
                                </td>
                                <td class="item-discount-percentage-td">
                                    <input type="text" class="form-control" placeholder="%" name="item_discount_percentage[${rowIndex}]" value="${invoiceItem.discountPercent
            }" disabled>
                                </td>
                                <td class="item-amount-after-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount_after_discount[${rowIndex}]" value="${invoiceItem.amountAfterDiscount
            }" disabled>
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[${rowIndex}]" value="${invoiceItem.vatPercent
            }" disabled>
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Vat Amount" name="item_vat_amount[${rowIndex}]" value="${invoiceItem.vatAmount
            }" disabled>
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="${invoiceItem.amountWithVat
            }" disabled>
                                </td>
                                <td class="item-purchase-price-td">
                                    <input type="text" class="form-control" placeholder="Purchase Price" name="item_purchase_price[${rowIndex}]" value="${invoiceItem.purchasePrice
            }" disabled>
                                </td>
                                
                                <td class="remove-td">
                                <div class="d-flex">
    <button type="button" class="btn btn-icon btn-info view-row btn me-2"  data-id="${invoiceItem.invoiceDetailsId
            }" data-type="${invoiceItem.itemMasterId
            }" id="details-btn">
        <i class="ti ti-eye"></i>
    </button>
    <button type="button" class="btn btn-icon btn-secondary print"  data-id="${invoiceItem.invoiceDetailsId
            }" data-type="${invoiceItem.itemMasterId
            }" id="print-btn">
        <i class="ti ti-printer"></i>
    </button>
    </div>
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
           
            <td class="item-code-td">
                <input type="text" class="service-id form-control" name="manual_item_code[${rowIndex}]" value="${manualItem.itemCode
            }" disabled>
            </td>
            <td class="item-name-td">
                <input type="hidden" class="form-control" name="manual_item_id[${rowIndex}]" value="${manualItem.itemMasterId || ""
            }" disabled>
                <input type="hidden" class="form-control" name="manual_sl_no[${rowIndex}]" value="${rowIndex + 1
            }" disabled>
                <input type="text" class="service-id form-control" name="manual_item_name[${rowIndex}]" value="${manualItem.itemMasterName
            }" disabled>
                <input type="hidden" class="service-id form-control" name="manual_invoice_details_id[${rowIndex}]" value="${manualItem.invoiceDetailsId
            }" disabled>
            </td>
            <td class="item-quantity-td">
                <input type="number" class="form-control" placeholder="Quantity" name="manual_item_quantity[${rowIndex}]" value="${manualItem.quantity
            }" disabled>
            </td>
            <td class="item-unit-td" style="width: 120px;">
                <input type="text" class="service-id form-control" name="manual_item_unit[${rowIndex}]" value="${manualItem.unitItemName
            }" disabled>
            </td>
            <td class="item-unit-price-td">
                <input type="text" class="form-control" placeholder="Price" name="manual_item_unit_price[${rowIndex}]" value="${manualItem.unitPrice
            }" disabled>
            </td>
            <td class="item-amount-td">
                <input type="text" class="form-control" placeholder="Amount" name="manual_item_amount[${rowIndex}]" value="${manualItem.amount
            }" disabled>
            </td>
            <td class="item-discount-percentage-td">
                <input type="text" class="form-control" placeholder="%" name="manual_item_discount_percentage[${rowIndex}]" value="${manualItem.discountPercent
            }" disabled>
            </td>
            <td class="item-amount-after-discount-td">
                <input type="text" class="form-control" placeholder="Amount" name="manual_item_amount_after_discount[${rowIndex}]" value="${manualItem.amountAfterDiscount
            }" disabled>
            </td>
            <td class="vat-percentage-td">
                <input type="text" class="form-control" placeholder="Percentage" name="manual_item_vat_percentage[${rowIndex}]" value="${manualItem.vatPercent || 0
            }" disabled>
            </td>
            <td class="vat-amount-td">
                <input type="text" class="form-control" placeholder="Vat Amount" name="manual_item_vat_amount[${rowIndex}]" value="${manualItem.vatAmount
            }" disabled>
            </td>
            <td class="net-amount-td">
                <input type="text" class="form-control" placeholder="Total Amount" name="manual_item_net_amount[${rowIndex}]" value="${manualItem.amountWithVat
            }" disabled>
            </td>
            <td class="item-purchase-price-td">
                <input type="text" class="form-control" placeholder="Purchase Price" name="manual_item_purchase_price[${rowIndex}]" value="${manualItem.purchasePrice
            }" disabled>
            </td>
            <td class="remove-td">
            <div class="d-flex">
    <button type="button" data-id="${manualItem.invoiceDetailsId
            }" data-type="${"manual-item"}" class="btn btn-icon btn-info view-row btn me-2" id="details-btn">
        <i class="ti ti-eye"></i>
    </button>
<button type="button" data-id="${manualItem.invoiceDetailsId
            }" data-type="${"manual-item"}" class="btn btn-icon btn-secondary print" id="print-btn">
       <i class="ti ti-printer"></i>
    </button>
     </div>
</td>

        </tr>`;
    });
    setTimeout(() => {
        $("#invoice_table_tbody").append(manualInvoiceHtml);
    }, 1000);
    // $("#invoice_table_tbody").append(manualInvoiceHtml);
}


$(document).on('click', '#print-btn', function () {
    var invoiceDetailsId = $(this).data("id");

    $.ajax({
        url: BASE_URL + '/sales/check-labeling/' + invoiceDetailsId,
        method: 'GET',
        success: function(response) {
            if (response.status === 'success') {
                window.open(BASE_URL + '/sales/print-labeling/' + invoiceDetailsId);
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
        error: function() {
            Swal.fire({
                icon: "error",
                text: "Something went wrong. Please try again.",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        }
    });
});





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


$("#save-medicine-details").on("click", function (event) {
    event.preventDefault(); // Prevent default behavior

    const invoiceDetailsId = $("#invoiceDetailsId").val();



    const medicineDetails = {
        invoiceDetailsId: invoiceDetailsId,
        routeAdmin: $("#slcRouteAdmin").val(),
        scientificCode: $("#scientificCode").val(),
        scientificCodeAbsenceReason: $("#scientificCodeAbsenceReason").val(),
        strength: $("#strength").val(),
        selectionReason: $("#selectionReason").val(),
        pharmacistSubsitute: $("#pharmacistSubsitute").val(),
        startDate: $("#medicineStartDate").val(),
        discontinueDate: $("#discontinueDate").val(),
        duration: $("#txtDuration").val(),
        durationUnit: $("#slcDurationUnit").val(),
        frequency: $("#frequency").val(),
        period: $("#txtPeriod").val(),
        periodUnit: $("#slcPeriodUnit").val(),
        dosage: $("#txtDoseQuantity").val(),
        doseUnit: $("#slcDose").val(),
        timeInstruction: $("#timeInstruction").val(),
        refillCount: $("#refillCount").val(),
        dosageInstruction: $("#dosageInstruction").val(),
        patientInstruction: $("#patientInstruction").val(),
        additionalSupportingInfo: $("#additionalSupportingInfo").val()
    };

    console.log("Medicine Details:", medicineDetails);

    $.ajax({
        url: BASE_URL + "/sales/save-medicine-labaling",
        type: "POST",
        data: JSON.stringify(medicineDetails),
        contentType: "application/json",
        success: function (response) {
            console.log("Data saved successfully:", response);

            Swal.fire({
                icon: "success",
                text: response.message || "Data saved successfully!",
                customClass: {
                    confirmButton: "btn btn-success waves-effect waves-light",
                },
            }).then(function () {
                $("#medicine-details-modal").modal("hide");
                // Now trigger event after success
                $(document).trigger("medicineSaved", [medicineDetails]);
            });
        },
        error: function (xhr) {
            console.error("Error saving data:", xhr);
            let errorMessage = "Something went wrong!";
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            }

            Swal.fire({
                icon: "error",
                text: errorMessage,
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        }
    });
});


$(document).on("click", "#details-btn", function () {
    $('#medicineForm')[0].reset();
    $("#medicine-details-modal").modal("show");
    var invoiceDetailsId = $(this).data("id");
    var itemId = $(this).data("type");
    $("#invoiceDetailsId").val(invoiceDetailsId);
    console.log("Clicked invoiceDetailsId:", invoiceDetailsId);

    $.ajax({
        url: BASE_URL + "/sales/get-labaling-details/" + invoiceDetailsId,
        type: "GET",
        success: function (response) {
            // console.log("Medicine details:", response);
            // console.log("Medicine 1:", response.data.strength);
            $("#strength").val(response.data.strength);
            $("#scientificCodeAbsenceReason").val(response.data.scientificCodeAbsenceReason).trigger("change");
            $("#selectionReason").val(response.data.selectionReason).trigger("change");
            $("#pharmacistSubsitute").val(response.data.pharmacistSubsitute).trigger("change");
            $("#medicineStartDate").val(response.data.startDate);
            $("#discontinueDate").val(response.data.discontinueDate);
            $("#frequency").val(response.data.frequency);
            $("#txtPeriod").val(response.data.period);
            $("#slcPeriodUnit").val(response.data.periodUnit).trigger("change");
            $("#txtDoseQuantity").val(response.data.dosage);
            $("#slcDose").val(response.data.doseUnit).trigger("change");
            $("#timeInstruction").val(response.data.timeInstruction).trigger("change");
            $("#refillCount").val(response.data.refillCount);
            $("#dosageInstruction").val(response.data.dosageInstruction);
            $("#patientInstruction").val(response.data.patientInstruction);
            $("#additionalSupportingInfo").val(response.data.additionalSupportingInfo);
            $("#txtDuration").val(response.data.duration);
            $("#slcDurationUnit").val(response.data.durationUnit).trigger("change");
            $("#slcRouteAdmin").val(response.data.routeAdmin).trigger("change");

        },
        error: function (error) {
            console.error("Error fetching medicine details:", error);
        }
    });

    currentRowIndex = $(this).closest("tr").index();
    console.log("Current Row Index:", currentRowIndex);

});



// Remove row and update SL column


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

flatpickr("#medicineStartDate", {
    dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
    allowInput: true, // Allows manual input if desired
});

flatpickr("#discontinueDate", {
    dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
    allowInput: true, // Allows manual input if desired
});

function calculatePaymentOptionsTotalAmount() {
    let sum = 0;
    $(".amount-input:not(.d-none)").each(function () {
        sum += parseFloat($(this).val()) || 0;
    });

    // Display the total sum somewhere (modify this as needed)
    return sum.toFixed(2);
}

function toggleVatField() {
    let customerType = $('#customer_type').val();
    if (customerType === 'b2c') {
        $('.tax_id').closest('.col-3').hide();
    } else {
        $('.tax_id').closest('.col-3').show();
    }
}