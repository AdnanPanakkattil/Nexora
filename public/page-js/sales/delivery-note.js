$(document).ready(function () {
    $("#sales_main_menu").addClass("active open menu-item-animating");
    $("#delivery_notes_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    if ($("#edit_delivery_note_id").val()) {
        initialPageLoad($("#edit_delivery_note_id").val());
    } else {
        // Get the current date in YYYY-MM-DD format
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0]; // Format the date

        // Set the current date as the value of the input field
        $("#delivery_note_date").val(formattedDate);
    }

    flatpickr("#delivery_note_date", {
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
            repo.text + repo.itemStock +
            "</div>";

        markup += "</div></div>";

        return markup;
    }

    function formatRepoSelection(repo) {
        return repo.text || repo.id;
    }

    // $("#po_no").select2({
    //     placeholder: "Search Purchase Order",
    //     allowClear: true,
    //     minimumInputLength: 1,
    //     ajax: {
    //         url: BASE_URL + "/search-purchase-order-by-query",
    //         // url: BASE_URL + "/search-patient-by-query",

    //         dataType: "json",
    //         delay: 250,
    //         data: function (params) {
    //             return {
    //                 purchaseOrder: params.term,
    //             };
    //         },
    //         processResults: function (data) {
    //             return {
    //                 results: data,
    //             };
    //         },
    //         cache: true,
    //     },
    //     escapeMarkup: function (markup) {
    //         return markup;
    //     },
    //     templateResult: formatRepo,
    //     templateSelection: formatRepoSelection,
    // });

    // $("#po_no").on("select2:select", function (e) {
    //     // getPatientById(e.params.data.id);
    //     let selectedId = e.params.data.id;
    //     // Set the selected option in #item_vendor_name
    //     // $("#item_vendor_name").val(selectedId).trigger('change');
    //     // Call the function to fetch patient details
    //     getPurchaseOrderDetails(selectedId);
    // });

    function formatRepoCustomer(repo) {
        if (repo.loading) {
            return repo.text;
        }

        var markup =
            "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" +
            repo.text
            "</div>";

        markup += "</div></div>";

        return markup;
    }

    function formatRepoSelectionCustomer(repo) {
        return repo.text || repo.id;
    }

        if ($("#customer_code").data("select2")) {
            $("#customer_code").select2("destroy");
        }

        $("#customer_code")
            .wrap('<div class="position-relative"></div>')
            .select2({
        dropdownParent: $("#customer_code").parent(),
        width: "100%",
        placeholder: "Search Customer Code",
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/search-customer-code-by-query",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    customerCode: params.term,
                    customerType: 'b2c',
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
        templateSelection: formatRepoSelectionCustomer,
    });

    $("#customer_code").on("select2:select", function (e) {
        $("#customer_name").val(e.params.data.customerName);
    });

    if ($("#item_name").data("select2")) {
        $("#item_name").select2("destroy");
    }

    $("#item_name")
        .wrap('<div class="position-relative"></div>')
        .select2({
        dropdownParent: $("#item_name").parent(),
        width: "100%",
        placeholder: "Search Item Name",
        allowClear: true,
        minimumInputLength: 2,
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
                "/sales/sales-invoice-get-item-details/" +
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
                    var rowIndex = $("#delivery_note_table_tbody tr").length; // Calculate index
                    purchaseOrderHtml = `<tr>
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
        <input type="hidden" class="service-id form-control" name="delivery_note_item_id[${rowIndex}]" value="0">

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
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[${rowIndex}]" value="${
                        response.data.tax.taxValueInPercentage
                    }">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Vat Amount" name="item_vat_amount[${rowIndex}]">
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]">
                                </td>
                                <td class="item-remark-td">
                                    <input type="text" class="form-control" placeholder="Remarks" name="item_remark[${rowIndex}]" value="">
                                </td>
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

                    $("#delivery_note_table_tbody").append(purchaseOrderHtml);

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

    $("#delivery_note_save_btn").click(function () {
        let itemCount = $("#delivery_note_table_tbody tr").length;
        if (itemCount > 0) {
            // Serialize data from all forms and convert it to a proper format
            var preAdmissionFormData = $(
                "#delivery_note_form"
            ).serializeArray();
            // AJAX request
            $.ajax({
                url: BASE_URL + "/sales/delivery-note",
                type: "POST",
                data: preAdmissionFormData, // Properly formatted form data
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
                                key.startsWith("item_remark.")
                            ) {
                                var fieldParts = key.split(".");
                                var fieldIndex = fieldParts[1];
                                var fieldName = fieldParts[0];
                                var targetRow = $(
                                    "#delivery_note_table_tbody tr"
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

    $("#delivery_note_update_btn").click(function () {
        // Serialize data from all forms and convert it to a proper format
        var deliveryNoteFormData = $("#delivery_note_form").serializeArray();
        // AJAX request
        $.ajax({
            url:
                BASE_URL +
                "/sales/update-delivery-note/" +
                $("#edit_delivery_note_id").val(),
            type: "PUT",
            data: deliveryNoteFormData, // Properly formatted form data
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
                            key.startsWith("item_remark.")
                        ) {
                            var fieldParts = key.split(".");
                            var fieldIndex = fieldParts[1];
                            var fieldName = fieldParts[0];
                            var targetRow = $(
                                "#delivery_note_table_tbody tr"
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
});

function getPurchaseOrderDetails(purchaseOrderId) {
    $.ajax({
        // url: BASE_URL + "/get-patient-by-id",
        url: BASE_URL + "/get-purchase-order-details-by-id/" + purchaseOrderId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                console.log(response.data.vendorId);

                purchasedItemsTotal = pupulatePurchaseOrderItems(
                    response.data.items
                );
                $("#total_without_vat").val(
                    purchasedItemsTotal.totalAmountWithoutVatAndDiscount
                );
                $("#item_total_with_vat").val(
                    purchasedItemsTotal.totalAmountWithVatAndDiscount
                );
                $("#item_total").val(
                    purchasedItemsTotal.totalAmountWithVatAndDiscount
                );

                $("#item_vat_total").val(response.data.vat_amount);

                // totalAmountWithoutVatAndDiscount
                // totalAmountWithVatAndDiscount
            }
        },
    });
}

function pupulatePurchaseOrderItems(purchaseOrderItems) {
    $("#delivery_note_table_tbody").empty();
    var editPurchaseOrderHtml = "";
    let totalAmountWithoutVatAndDiscount = 0;
    let totalAmountWithVatAndDiscount = 0;
    let indexCount = 1;

    purchaseOrderItems.forEach((purchaseOrderItem, index) => {
        let unitoptions = "";
        if (purchaseOrderItem.item.units) {
            purchaseOrderItem.item.units.forEach(function (unit) {
                unitoptions += `<option value="${unit.unitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
            });
        }

        // Calculate the total amount without VAT and discount
        totalAmountWithoutVatAndDiscount += parseFloat(
            purchaseOrderItem.amount || 0
        );
        totalAmountWithVatAndDiscount += parseFloat(
            purchaseOrderItem.amount_with_vat || 0
        );
        indexCount = index + 1;

        editPurchaseOrderHtml = `<tr>
        <td class="item-serial-td">
                                ${index + 1}
                                </td>
        <td class="item-code-td">
                                ${purchaseOrderItem.item.itemCode}
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="service-id form-control" name="item_id[]" value="${
                                        purchaseOrderItem.item_id
                                    }">
                                    ${purchaseOrderItem.item.itemName_en}
                                </td>
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[]" value="${
                                        purchaseOrderItem.quantity
                                    }">
                                </td>
                                <td class="item-unit-td" style="width: 120px;">
                                    <select id="item_unit_${index}" name="item_unit[]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                    ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Unit Price" name="item_unit_price[]" value="${
                                        purchaseOrderItem.unit_price
                                    }">
                                </td>
                                
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[]" value="${
                                        purchaseOrderItem.amount
                                    }">
                                </td>
                                
                                <td class="item-vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="VAT Percentage" name="item_vat_percentage[]" value="${
                                        purchaseOrderItem.vat_percent
                                    }">
                                </td>
                                <td class="item-vat-amount-td">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="item_vat_amount[]" value="${
                                        purchaseOrderItem.vat_amount
                                    }">
                                </td>
                                <td class="item-net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[]" value="${
                                        purchaseOrderItem.amount_with_vat
                                    }">
                                </td>
                                <td class="item-remark-td">
                                    <input type="text" class="form-control" placeholder="Remarks" name="item_remark[]" value="">
                                </td>
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

        // Append the generated HTML to the table body
        $("#delivery_note_table_tbody").append(editPurchaseOrderHtml);

        // Initialize select2 for the new select element
        $(`#item_unit_${index}`).select2({
            placeholder: "Selection", // Match the placeholder in the select
            allowClear: true,
        });

        // Set the value of the select box based on `purchaseOrderItem.unit_id`
        if (purchaseOrderItem.item_unit_id) {
            $(`#item_unit_${index}`)
                .val(purchaseOrderItem.item_unit_id)
                .trigger("change");
        }

        flatpickr(".item-expiry-date", {
            dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
            allowInput: true, // Allows manual input if desired
        });
    });

    $("#item_td_count").val(indexCount);

    return {
        totalAmountWithoutVatAndDiscount: totalAmountWithoutVatAndDiscount,
        totalAmountWithVatAndDiscount: totalAmountWithVatAndDiscount,
    };
}

// Remove row and update SL column
$(document).on("click", ".remove-row", function () {
    $(this).closest("tr").remove();
    var deliveryNoteItemsId = $(this).data('id');
    var itemMasterId = $(this).data('type');
    if ((deliveryNoteItemsId > 0) && (itemMasterId > 0)) {
        deleteAlreadyExistItem(deliveryNoteItemsId, itemMasterId);
        

    }
    updateSlColumn();
    calculateTotals();
});

// Update SL column sequence
function updateSlColumn() {
    $("#delivery_note_table_tbody tr").each(function (index) {
        $(this)
            .find(".item-sl-td")
            .text(index + 1);
        // Update rowIndex for the item-unit-price-td input
        $(this)
            .find('.item-name-td input[name^="sl_no"]')
            .attr("name", `sl_no[${index}]`);
        $(this)
            .find('.item-name-td input[name^="item_id"]')
            .attr("name", `item_id[${index}]`);
        $(this)
            .find(".item-quantity-td input")
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
            .find(".vat-percentage-td input")
            .attr("name", `item_vat_percentage[${index}]`);
        $(this)
            .find(".vat-amount-td input")
            .attr("name", `item_vat_amount[${index}]`);
        $(this)
            .find(".net-amount-td input")
            .attr("name", `item_net_amount[${index}]`);
        $(this)
            .find(".item-remark-td input")
            .attr("name", `item_remark[${index}]`);
    });
    
}

$(document).on("change", ".item-unit", function () {
    // Get the selected option
    let selectedOption = $(this).find("option:selected");

    // Get the unit price from the data attribute
    let unitPrice = selectedOption.data("unit-price");
    // Find the row of the current select dropdown
    let currentRow = $(this).closest("tr");

    // Set the value in the 'item-unit-price-td' input field
    currentRow.find(".item-unit-price-td input").val(unitPrice);
    currentRow.find(".item-amount-td input").val(unitPrice);
});

$(document).on("change", ".item-unit", function () {
    // Get the selected row
    var row = $(this).closest("tr");

    // Get the unit price from the selected option
    var unitPrice =
        parseFloat($(this).find(":selected").data("unit-price")) || 0;

    // Get the quantity entered in the row
    var quantity =
        parseFloat(row.find('input[name^="item_quantity"]').val()) || 0;

    // Calculate the item amount
    var itemAmount = unitPrice * quantity;
    row.find('input[name^="item_amount"]').val(itemAmount.toFixed(2));

    // Get the VAT percentage from the row
    var vatPercentage =
        parseFloat(row.find('input[name^="item_vat_percentage"]').val()) || 0;

    // Calculate the VAT amount
    var vatAmount = (itemAmount * vatPercentage) / 100;
    row.find('input[name^="item_vat_amount"]').val(vatAmount.toFixed(2));

    // Calculate the total amount with VAT
    var totalAmount = itemAmount + vatAmount;
    row.find('input[name^="item_net_amount"]').val(totalAmount.toFixed(2));

    calculateTotals();
});

// Trigger the calculation when the quantity or VAT percentage changes
$(document).on(
    "input",
    'input[name^="item_quantity"], input[name^="item_vat_percentage"]',
    function () {
        console.log("Input changed", this);
        $(this).closest("tr").find(".item-unit").trigger("change");
    }
);

function calculateTotals() {
    let totalAmount = 0;
    let totalVat = 0;
    let netAmount = 0;

    // Loop through each row in the table body
    $("#delivery_note_table_tbody tr").each(function () {
        const row = $(this);

        // Ensure the input values are being read correctly
        const amount =
            parseFloat(row.find('input[name^="item_amount"]').val()) || 0;
        const vatAmount =
            parseFloat(row.find('input[name^="item_vat_amount"]').val()) || 0;
        const netAmountWithVat =
            parseFloat(row.find('input[name^="item_net_amount"]').val()) || 0;

        // Accumulate the totals
        totalAmount += amount;
        totalVat += vatAmount;
        netAmount += netAmountWithVat;
    });

    // Debugging: Log values to verify calculations
    console.log("Total Item Amount:", totalAmount);
    console.log("Total VAT Amount:", totalVat);
    console.log("Total Amount with VAT:", netAmount);

    // Update the total fields in the form
    $("#item_total").val(totalAmount.toFixed(2));
    $("#item_vat_total").val(totalVat.toFixed(2));
    $("#item_total_with_vat").val(netAmount.toFixed(2));
}

function initialPageLoad(deliveryNoteId) {
    $.ajax({
        url: BASE_URL + "/sales/edit-delivery-note/" + deliveryNoteId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                console.log(response.data.currency_id);
                $("#delivery_note_no").val(response.data.delNoteNo);
                $("#po_no").val(response.data.poNo);
                // Convert to a Date object
let dateObj = new Date(response.data.deliveryNoteDate);

// Format to yyyy-mm-dd
let deliveryNoteDateFormatted = dateObj.toISOString().split('T')[0];

                $("#delivery_note_date").val(deliveryNoteDateFormatted);
                $("#customer_name").val(response.data.customer.customerName);
                $("#quotation").val(response.data.quotation);

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

                // // // Set the newly added or existing option as selected
                $("#customer_code")
                    .val(response.data.customer.regularCustomerId)
                    .trigger("change");
                $("#mode_of_pay")
                    .val(response.data.modeOfPayment)
                    .trigger("change");

                purchasedItemsTotal = pupulateDeliveryNoteItems(
                    response.data.delivery_note_items
                );
                $("#item_total").val(response.data.totalAmount);
                $("#item_vat_total").val(response.data.taxAmt);
                $("#item_total_with_vat").val(response.data.netAmount);

                // $('#purchase_table_tr_count').val($('#purchase_table_tbody tr').length);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
}

function pupulateDeliveryNoteItems(deliveryNoteItems) {
    $("#delivery_note_table_tbody").empty();

    deliveryNoteItems.forEach((deliveryNoteItem, index) => {
        console.log('test');
        console.log(deliveryNoteItem);
        let unitoptions = "";
        if (deliveryNoteItem.delivery_note_items_details.units) {
            deliveryNoteItem.delivery_note_items_details.units.forEach(
                function (unit) {
                    unitoptions += `<option value="${unit.unitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
                }
            );
        }
        console.log(deliveryNoteItem);
        var rowIndex = $("#delivery_note_table_tbody tr").length; // Calculate index
        purchaseOrderHtml = `<tr>
                                <td class="item-sl-td">
                                ${rowIndex + 1}
                                    
                                </td>
                                 <td class="item-code-td">
                                    ${
                                        deliveryNoteItem
                                            .delivery_note_items_details
                                            .itemCode
                                    }
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="form-control" name="item_id[${rowIndex}]" value="${deliveryNoteItem.delivery_note_items_details.itemMasterId}">
                                    <input type="hidden" class="form-control" name="sl_no[${rowIndex}]" value="${
            rowIndex + 1
        }">
                                    ${
                                        deliveryNoteItem
                                            .delivery_note_items_details
                                            .itemName_en
                                    }

                                    
        <input type="hidden" class="service-id form-control" name="delivery_note_item_id[${rowIndex}]" value="${deliveryNoteItem.deliveryNoteItemsId}">

                                </td>
                               
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${
            deliveryNoteItem.quantity
        }">
                                    
                                </td>
                                <td class="item-unit-td" style="width: 200px;">
                                    <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="item_unit_price[${rowIndex}]" value="${
            deliveryNoteItem.unitPrice
        }">
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="${
            deliveryNoteItem.amountRow
        }">
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[${rowIndex}]" value="${
            deliveryNoteItem.vatPercent
        }">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Vat Amount" name="item_vat_amount[${rowIndex}]" value="${
            deliveryNoteItem.vatAmount
        }">
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="${
            deliveryNoteItem.netAmountWithVat
        }">
                                </td>
                                <td class="item-remark-td">
                                    <input type="text" class="form-control" placeholder="Remarks" name="item_remark[${rowIndex}]" value="${
            deliveryNoteItem.remarks
        }">
                                </td>
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row" data-id="${deliveryNoteItem.deliveryNoteItemsId}" data-type="${deliveryNoteItem.itemMasterId}">X</button>
                                </td>
                            </tr>`;

        $("#delivery_note_table_tbody").append(purchaseOrderHtml);

        $(".item-unit").select2({
            placeholder: "Selection", // Match the placeholder in the select
            allowClear: true,
        });
    });

    // $("#item_td_count").val(indexCount);
}

function deleteAlreadyExistItem(deliveryNoteItemsId, itemMasterId) {
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
                url: BASE_URL + "/sales/delete-delivery-note-item/"+ deliveryNoteItemsId +'/'+ itemMasterId, // Adjust URL if needed
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
