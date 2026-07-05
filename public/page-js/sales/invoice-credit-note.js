$(document).ready(function () {
    $("#sales_main_menu").addClass("active open menu-item-animating");
    $("#invoice_credit_note_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var selectElement = $('#clinic_select');
    
    // Check if the number of options (excluding the first empty option) is 1
    if (selectElement.find('option').length === 2) { // One option + "Select"
        // Set the default value to the only available option
        selectElement.val(selectElement.find('option').not(':first').val()).trigger('change');
    }

    if ($("#edit_invoice_credit_note_id").val()) {
        initialPageLoad($("#edit_invoice_credit_note_id").val());
    }

    flatpickr("#credit_note_date", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
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

    $("#invoice_number").select2({
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

    $("#invoice_number").on("select2:select", function (e) {
        // $("#customer_name").val(e.params.data.customerName);
        getInvoiceDetails(e.params.data.id);
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

    $("#invoice_credit_save_btn").click(function () {
        let itemCount = $("#invoice_credit_note_table_tbody tr").length;
        if (itemCount > 0) {
            // Serialize data from all forms and convert it to a proper format
            var invoiceCreditNoteFormData = $(
                "#invoice_credit_note_form"
            ).serializeArray();
            // AJAX request
            $.ajax({
                url: BASE_URL + "/sales/invoice-credit-note",
                type: "POST",
                data: invoiceCreditNoteFormData, // Properly formatted form data
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
                                var targetRow = $(
                                    "#invoice_credit_note_table_tbody tr"
                                ).eq(fieldIndex);
                                // Adjust selection for input or select fields
                                var targetCell = targetRow.find(
                                    `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`
                                );

                                // Append error message below the field
                                if (targetCell.length > 0) {
                                    // Check if the target is a select2 element
                                    if (targetCell.is("select")) {
                                        var select2Container =
                                            targetCell.next(
                                                ".select2-container"
                                            );
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

    $("#invoice_credit_update_btn").click(function () {
        let itemCount = $("#invoice_credit_note_table_tbody tr").length;
        if (itemCount > 0) {
            // Serialize data from all forms and convert it to a proper format
            var invoiceCreditNoteFormData = $(
                "#invoice_credit_note_form"
            ).serializeArray();
            // AJAX request
            $.ajax({
                url:
                    BASE_URL +
                    "/sales/update-invoice-credit-note/" +
                    $("#edit_invoice_credit_note_id").val(),
                type: "PUT",
                data: invoiceCreditNoteFormData, // Properly formatted form data
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
                                var targetRow = $(
                                    "#invoice_credit_note_table_tbody tr"
                                ).eq(fieldIndex);
                                // Adjust selection for input or select fields
                                var targetCell = targetRow.find(
                                    `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`
                                );

                                // Append error message below the field
                                if (targetCell.length > 0) {
                                    // Check if the target is a select2 element
                                    if (targetCell.is("select")) {
                                        var select2Container =
                                            targetCell.next(
                                                ".select2-container"
                                            );
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
});

$(document).on("change", "#clinic_select", function () {
    $.ajax({
        // url: BASE_URL + "/get-patient-by-id",
        url:
            BASE_URL +
            "/purchase/get-item-department-by-branch-id/" +
            $(this).val(),
        type: "GET",
        success: function (response) {
            if (response.status) {
                // console.log(response.data.vendor_id);
                const departmentSelect = $("#department_select");

                // Clear existing options except the default one
                departmentSelect.find("option").not(":first").remove();

                // Append new options
                response.data.forEach(function (department) {
                    departmentSelect.append(
                        $("<option>", {
                            value: department.departmentId,
                            text: department.department_name_en,
                        })
                    );
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
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
            "/purchase/purchase-order-get-item-details/" +
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
                var rowIndex = $("#invoice_credit_note_table_tbody tr").length; // Calculate index
                purchaseOrderHtml = `<tr style="Zoom: 90%;">
                                <td class="item-sl-td">
                                ${rowIndex + 1}
                                    
                                </td>
                                <td class="item-code-td">
                                    ${response.data.itemCode}
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="form-control" name="item_id[${rowIndex}]" value="${
                    response.data.itemMasterId
                }">
                                    <input type="hidden" class="form-control" name="sl_no[${rowIndex}]" value="${
                    rowIndex + 1
                }">
                                    ${response.data.itemName_en}
                                    <input type="hidden" class="service-id form-control" name="invoice_credit_note_details_id[${rowIndex}]" value="0">

                                </td>
                                
                                <td class="item-quantity-td" style="width: 100px;">
                                    <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="1">
                                    
                                </td>
                                <td class="item-unit-td" style="width: 120px;">
                                    <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${options}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="item_unit_price[${rowIndex}]" value="">
                                </td>
                                <td class="item-amount-td" style="width: 120px;">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="">
                                </td>
                                <td class="item-discount-percentage-td" >
                                    <input type="text" class="form-control" placeholder="%" name="item_discount_percentage[${rowIndex}]" value="0">
                                </td>
                                <td class="item-amount-after-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount_after_discount[${rowIndex}]" value="">
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[${rowIndex}]" value="${
                    response.data.tax.taxValueInPercentage
                }">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Vat" name="item_vat_amount[${rowIndex}]">
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total" name="item_net_amount[${rowIndex}]">
                                </td>
                                <td class="item-purchase-price-td" style="width: 100px;">
                                    <input type="text" class="form-control" placeholder="PR" name="item_purchase_price[${rowIndex}]">
                                </td>
                                
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

                $("#invoice_credit_note_table_tbody").append(purchaseOrderHtml);

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

$(document).on("change", "#clinic_select", function () {
    $.ajax({
        // url: BASE_URL + "/get-patient-by-id",
        url: BASE_URL + "/get-item-department-by-branch-id/" + $(this).val(),
        type: "GET",
        success: function (response) {
            if (response.status) {
                // console.log(response.data.vendor_id);
                const departmentSelect = $("#department_select");

                // Clear existing options except the default one
                departmentSelect.find("option").not(":first").remove();

                // Append new options
                response.data.forEach(function (department) {
                    departmentSelect.append(
                        $("<option>", {
                            value: department.departmentId,
                            text: department.department_name_en,
                        })
                    );
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
});

function getInvoiceDetails(invoiceId) {
    $.ajax({
        // url: BASE_URL + "/get-patient-by-id",
        url: BASE_URL + "/sales/edit-invoice/" + invoiceId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                console.log(response.data.vendor_id);

                $("#po_no").val(response.data.poNo);
                $("#quotation_no").val(response.data.quotationNo);
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
                $("#currency").val(response.data.currencyId).trigger("change");
                $("#ex_rate").val(response.data.exRate);

                purchasedItemsTotal = pupulateInvoiceItems(
                    response.data.invoice_items
                );

                $("#item_total").val(response.data.totalAmount);

                $("#item_vat_total").val(response.data.vatAmount);

                $("#item_discount_amount").val(response.data.discountAmount);
                $("#item_total_without_vat").val(
                    response.data.totalAmountAfterDiscount
                );
                $("#item_vat_total").val(response.data.vatAmount);
                $("#item_total_with_vat").val(response.data.totalAmountWithVat);
            }
        },
    });
}

function pupulateInvoiceItems(invoiceItems) {
    $("#invoice_credit_note_table_tbody").empty();

    invoiceItems.forEach((invoiceItem, index) => {
        let unitoptions = "";
        if (invoiceItem.invoice_items_details.units) {
            invoiceItem.invoice_items_details.units.forEach(function (unit) {
                unitoptions += `<option value="${unit.unitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
            });
        }
        console.log(invoiceItem);
        var rowIndex = $("#invoice_credit_note_table_tbody tr").length; // Calculate index
        purchaseOrderHtml = `<tr>
                                <td class="item-sl-td">
                                ${rowIndex + 1}
                                    
                                </td>
                                <td class="item-code-td">
                                    ${
                                        invoiceItem.invoice_items_details
                                            .itemCode
                                    }
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="form-control" name="item_id[${rowIndex}]" value="${
            invoiceItem.itemMasterId
        }">
                                    <input type="hidden" class="form-control" name="sl_no[${rowIndex}]" value="${
            rowIndex + 1
        }">
                                    ${
                                        invoiceItem.invoice_items_details
                                            .itemName_en
                                    }
                                </td>
                                
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${
            invoiceItem.quantity
        }">
                                    
                                </td>
                                <td class="item-unit-td" style="width: 10%;">
                                    <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="item_unit_price[${rowIndex}]" value="${
            invoiceItem.unitPrice
        }">
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="${
            invoiceItem.amount
        }">
                                </td>
                                <td class="item-discount-percentage-td">
                                    <input type="text" class="form-control" placeholder="%" name="item_discount_percentage[${rowIndex}]" value="${
            invoiceItem.discountPercent
        }">
                                </td>
                                <td class="item-amount-after-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount_after_discount[${rowIndex}]" value="${
            invoiceItem.amountAfterDiscount
        }">
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[${rowIndex}]" value="${
            invoiceItem.vatPercent
        }">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Vat Amount" name="item_vat_amount[${rowIndex}]" value="${
            invoiceItem.vatAmount
        }">
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="${
            invoiceItem.amountWithVat
        }">
                                </td>
                                <td class="item-purchase-price-td">
                                    <input type="text" class="form-control" placeholder="Purchase Price" name="item_purchase_price[${rowIndex}]" value="${
            invoiceItem.purchasePrice
        }">
                                </td>
                                
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

        $("#invoice_credit_note_table_tbody").append(purchaseOrderHtml);

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

function initialPageLoad(invoiceCreditNoteId) {
    $.ajax({
        url:
            BASE_URL + "/sales/edit-invoice-credit-note/" + invoiceCreditNoteId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                console.log(response.data.currency_id);
                $("#credit_note_no").val(response.data.invoiceCreditNoteNo);
                // $("#pre_invoice_no").val(response.data.invoiceNo);
                $("#quotation_no").val(response.data.quotationNo);
                let date = new Date(response.data.invoiceCreditNoteDate); // Parse the date string
                let formattedDate = date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
                $("#credit_note_date").val(formattedDate);
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

                if (
                    !$("#invoice_number").find(
                        'option[value="' +
                            response.data.invoice.invoiceId +
                            '"]'
                    ).length
                ) {
                    // Append the new option
                    $("#invoice_number").append(
                        $("<option>", {
                            value: response.data.invoice.invoiceId, // Set the value as the vendorId
                            text: response.data.invoice.invoiceNo, // Set the text as the vendor name
                        })
                    );
                }
                $("#invoice_number")
                    .val(response.data.invoice.invoiceId)
                    .trigger("change");
                $("#tax_id").val(response.data.quotation);
                $("#currency").val(response.data.currencyId).trigger("change");
                $("#ex_rate").val(response.data.exRate);
                $("#clinic_select").val(response.data.branchId);
                $("#department_select").val(response.data.departmentId);

                // // // Set the newly added or existing option as selected

                purchasedItemsTotal = editPopulateInvoiceCreditNoteItems(
                    response.data.invoice_credit_note_items
                );
                $("#item_total").val(response.data.totalAmount);
                $("#item_discount_amount").val(response.data.discountAmount);
                $("#item_total_without_vat").val(
                    response.data.totalAmountAfterDiscount
                );
                $("#item_vat_total").val(response.data.vatAmount);
                $("#item_total_with_vat").val(response.data.totalAmountWithVat);
                // $("#item_total_with_vat").val(
                //     response.data.netAmountWithExRate
                // );

                // $('#purchase_table_tr_count').val($('#purchase_table_tbody tr').length);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
}

function editPopulateInvoiceCreditNoteItems(invoiceCreditNoteItems) {
    $("#invoice_credit_note_table_tbody").empty();

    invoiceCreditNoteItems.forEach((invoiceCreditNoteItem, index) => {
        console.log(invoiceCreditNoteItem);

        let unitoptions = "";
        if (invoiceCreditNoteItem.invoice_credit_note_items_details.units) {
            invoiceCreditNoteItem.invoice_credit_note_items_details.units.forEach(
                function (unit) {
                    unitoptions += `<option value="${unit.unitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
                }
            );
        }
        var rowIndex = $("#invoice_credit_note_table_tbody tr").length; // Calculate index
        purchaseOrderHtml = `<tr>
                                <td class="item-sl-td">
                                ${rowIndex + 1}
                                    
                                </td>
                                <td class="item-code-td">
                                    ${
                                        invoiceCreditNoteItem
                                            .invoice_credit_note_items_details
                                            .itemCode
                                    }
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="form-control" name="item_id[${rowIndex}]" value="${
            invoiceCreditNoteItem.itemMasterId
        }">
                                    <input type="hidden" class="form-control" name="sl_no[${rowIndex}]" value="${
            rowIndex + 1
        }">
                                    ${
                                        invoiceCreditNoteItem
                                            .invoice_credit_note_items_details
                                            .itemName_en
                                    }
                                    <input type="hidden" class="service-id form-control" name="invoice_credit_note_details_id[${rowIndex}]" value="${invoiceCreditNoteItem.invoiceCreditNoteDetailsId}">

                                </td>
                                
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${
            invoiceCreditNoteItem.quantity
        }">
                                    
                                </td>
                                <td class="item-unit-td" style="width: 10%;">
                                    <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="item_unit_price[${rowIndex}]" value="${
            invoiceCreditNoteItem.unitPrice
        }">
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="${
            invoiceCreditNoteItem.amount
        }">
                                </td>
                                <td class="item-discount-percentage-td">
                                    <input type="text" class="form-control" placeholder="%" name="item_discount_percentage[${rowIndex}]" value="${
            invoiceCreditNoteItem.discountPercent
        }">
                                </td>
                                <td class="item-amount-after-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount_after_discount[${rowIndex}]" value="${
            invoiceCreditNoteItem.amountAfterDiscount
        }">
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[${rowIndex}]" value="${
            invoiceCreditNoteItem.vatPercent
        }">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Vat Amount" name="item_vat_amount[${rowIndex}]" value="${
            invoiceCreditNoteItem.vatAmount
        }">
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="${
            invoiceCreditNoteItem.amountWithVat
        }">
                                </td>
                                <td class="item-purchase-price-td">
                                    <input type="text" class="form-control" placeholder="Purchase Price" name="item_purchase_price[${rowIndex}]" value="${
            invoiceCreditNoteItem.purchasePrice
        }">
                                </td>
                                
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row" data-id="${invoiceCreditNoteItem.invoiceCreditNoteDetailsId}" data-type="${invoiceCreditNoteItem.itemMasterId}">X</button>
                                </td>
                            </tr>`;

        $("#invoice_credit_note_table_tbody").append(purchaseOrderHtml);

        $(`#item_unit_${rowIndex}`)
            .val(invoiceCreditNoteItem.itemUnitId)
            .trigger("change");

        $(".item-unit").select2({
            placeholder: "Selection", // Match the placeholder in the select
            allowClear: true,
        });
    });

    // $("#item_td_count").val(indexCount);
}

function pupulateInvoiceCreditNoteItems(invoiceItems) {
    $("#invoice_credit_note_table_tbody").empty();

    invoiceItems.forEach((invoiceItem, index) => {
        let unitoptions = "";
        if (invoiceItem.invoice_items_details.units) {
            invoiceItem.invoice_items_details.units.forEach(function (unit) {
                unitoptions += `<option value="${unit.unitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
            });
        }
        console.log(invoiceItem);
        var rowIndex = $("#invoice_credit_note_table_tbody tr").length; // Calculate index
        purchaseOrderHtml = `<tr>
                                <td class="item-sl-td">
                                ${rowIndex + 1}
                                    
                                </td>
                                <td class="item-code-td">
                                    ${
                                        invoiceItem.invoice_items_details
                                            .itemCode
                                    }
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="form-control" name="item_id[${rowIndex}]" value="${
            invoiceItem.itemMasterId
        }">
                                    <input type="hidden" class="form-control" name="sl_no[${rowIndex}]" value="${
            rowIndex + 1
        }">
                                    ${
                                        invoiceItem.invoice_items_details
                                            .itemName_en
                                    }
                                </td>
                                
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${
            invoiceItem.quantity
        }">
                                    
                                </td>
                                <td class="item-unit-td" style="width: 10%;">
                                    <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="item_unit_price[${rowIndex}]" value="${
            invoiceItem.unitPrice
        }">
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="${
            invoiceItem.amount
        }">
                                </td>
                                <td class="item-discount-percentage-td">
                                    <input type="text" class="form-control" placeholder="%" name="item_discount_percentage[${rowIndex}]" value="${
            invoiceItem.discountPercent
        }">
                                </td>
                                <td class="item-amount-after-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount_after_discount[${rowIndex}]" value="${
            invoiceItem.amountAfterDiscount
        }">
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[${rowIndex}]" value="${
            invoiceItem.vatPercent
        }">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Vat Amount" name="item_vat_amount[${rowIndex}]" value="${
            invoiceItem.vatAmount
        }">
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="${
            invoiceItem.amountWithVat
        }">
                                </td>
                                <td class="item-purchase-price-td">
                                    <input type="text" class="form-control" placeholder="Purchase Price" name="item_purchase_price[${rowIndex}]" value="${
            invoiceItem.purchasePrice
        }">
                                </td>
                                
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

        $("#invoice_credit_note_table_tbody").append(purchaseOrderHtml);

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

$(document).on(
    "input",
    'input[name^="item_quantity"], input[name^="item_vat_percentage"], input[name^="item_discount_percentage"]',
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
    row.find('input[name^="item_amount"]').val(discountedAmount.toFixed(2));

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
    $("#invoice_credit_note_table_tbody tr").each(function () {
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

        // Calculate discount amount for this row
        const discountValue = (itemAmount * discountAmount) / 100;

        // Calculate total without VAT for this row
        const withoutVat = itemAmount - discountValue;

        // Accumulate totals
        totalItemAmount += itemAmount;
        totalVatAmount += vatAmount;
        totalNetAmount += netAmount;
        totalDiscountAmount += discountValue;
        totalWithoutVat += withoutVat;
    });

    // Update the total fields in the form
    $("#item_total").val(totalItemAmount.toFixed(2));
    $("#item_discount_amount").val(totalDiscountAmount.toFixed(2));
    $("#item_total_without_vat").val(totalWithoutVat.toFixed(2));
    $("#item_vat_total").val(totalVatAmount.toFixed(2));
    $("#item_total_with_vat").val(totalNetAmount.toFixed(2));
}

$(document).on("change keyup", "#item_discount_amount", function () {
    let discountValue = $(this).val();
    // Initialize totals
    let totalItemAmount = 0;
    let totalVatAmount = 0;
    let totalNetAmount = 0;
    let totalDiscountAmount = 0;
    let totalWithoutVat = 0;

    // Loop through each row to accumulate totals
    $("#invoice_credit_note_table_tbody tr").each(function () {
        let row = $(this);

        // Get values for the current row
        let itemAmount =
            parseFloat(row.find('input[name^="item_amount"]').val()) || 0;
        let vatAmount =
            parseFloat(row.find('input[name^="item_vat_amount"]').val()) || 0;
        let netAmount =
            parseFloat(row.find('input[name^="item_net_amount"]').val()) || 0;
        let discountPercentage =
            parseFloat(
                row.find('input[name^="item_discount_percentage"]').val()
            ) || 0;

        // // Calculate the discount amount for this row
        let discountValue = (itemAmount * discountPercentage) / 100;

        // // Calculate the total without VAT for this row
        let withoutVat = itemAmount - discountValue;

        // Accumulate totals
        totalItemAmount += itemAmount;
        totalVatAmount += vatAmount;
        totalNetAmount += netAmount;
        totalDiscountAmount += discountValue;
        totalWithoutVat += withoutVat;
    });
    let tDiscountedValue = totalItemAmount - discountValue;
    let nDiscountedValue = totalNetAmount - discountValue;

    // Update totals in their respective fields
    $("#item_total").val(totalItemAmount.toFixed(2));
    // $("#item_discount_amount").val(totalDiscountAmount.toFixed(2));
    $("#item_total_without_vat").val(tDiscountedValue.toFixed(2));
    $("#item_vat_total").val(totalVatAmount.toFixed(2));
    $("#item_total_with_vat").val(nDiscountedValue.toFixed(2));
});

// Remove row and recalculate totals
$(document).on("click", ".remove-row", function () {
    $(this).closest("tr").remove();
    var invoiceCreditNoteDetailsId = $(this).data('id');
    var itemMasterId = $(this).data('type');
    if ((invoiceCreditNoteDetailsId > 0) && (itemMasterId > 0)) {
        deleteAlreadyExistItem(invoiceCreditNoteDetailsId, itemMasterId);
    }
    calculateTotals();
    updateSlColumn();
});

// Update SL column sequence
function updateSlColumn() {
    $("#invoice_credit_note_table_tbody tr").each(function (index) {
        $(this)
            .find(".item-sl-td")
            .text(index + 1);
        $(this)
            .find('.item-name-td input[name^="item_id"]')
            .attr("name", `item_id[${index}]`);
        $(this)
            .find('.item-name-td input[name^="sl_no"]')
            .attr("name", `sl_no[${index}]`)
            .val(index + 1);
        // Update rowIndex for the item-unit-price-td input
        $(this)
            .find('.item-quantity-td input[name^="item_quantity"]')
            .attr("name", `item_quantity[${index}]`);
        $(this)
            .find(".item-unit-td select")
            .attr("name", `item_unit[${index}]`);
        $(this)
            .find(".item-unit-price-td input")
            .attr("name", `item_unit_price[${index}]`);
        $(this)
            .find(".item-amount-td input")
            .attr("name", `item_amount[${index}]`);
        $(this)
            .find(".item-discount-percentage-td input")
            .attr("name", `item_discount_percentage[${index}]`);
        $(this)
            .find(".item-amount-after-discount-td input")
            .attr("name", `item_amount_after_discount[${index}]`);
        $(this)
            .find(".vat-percentage-td input")
            .attr("name", `item_vat_percentage[${index}]`);
        $(this)
            .find(".vat-amount-td input")
            .attr("name", `item_vat_amount[${index}]`);
        $(this)
            .find(".net-amount-td input")
            .attr("name", `item_net_amount[${index}]`);

        $(this)
            .find(".item-purchase-price-td input")
            .attr("name", `item_purchase_price[${index}]`);
    });
}


function deleteAlreadyExistItem(invoiceCreditNoteDetailsId, itemMasterId) {
    // console.log(params);
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
                url: BASE_URL + "/sales/delete-invoice-credit-note-item/"+ invoiceCreditNoteDetailsId +'/'+ itemMasterId, // Adjust URL if needed
                type: "DELETE",
                data: itemMasterId, // Pass any required data here
                success: function (response) {
                    if (response.status === true) {
                        Swal.fire({
                            icon: "success",
                            text: response.message,
                            customClass: {
                                confirmButton: "btn btn-success waves-effect waves-light",
                            },
                        }).then(function () {
                            location.reload();
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
            confirmButton: "btn btn-danger waves-effect waves-light",
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
