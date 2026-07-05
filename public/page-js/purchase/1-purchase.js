 $(document).ready(function () {
    $("#purchase_main_menu").addClass("active open menu-item-animating");
    $("#purchase_order_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    if ($("#edit_purchase_order_id").val()) {
        initialPageLoad($("#edit_purchase_order_id").val());
    } else {
        // Get the current date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format the date

    // Set the current date as the value of the input field
    $("#order_date").val(formattedDate);
    }

    flatpickr("#delivery_date", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
    });

    // Full Toolbar
    // --------------------------------------------------------------------
    const fullToolbar = [
        [
            {
                font: [],
            },
            {
                size: [],
            },
        ],
        ["bold", "italic", "underline", "strike"],
        [
            {
                color: [],
            },
            {
                background: [],
            },
        ],
        [
            {
                script: "super",
            },
            {
                script: "sub",
            },
        ],
        [
            {
                header: "1",
            },
            {
                header: "2",
            },
            "blockquote",
            "code-block",
        ],
        [
            {
                list: "ordered",
            },
            {
                list: "bullet",
            },
            {
                indent: "-1",
            },
            {
                indent: "+1",
            },
        ],
        [{ direction: "rtl" }],
        ["link", "image", "video", "formula"],
        ["clean"],
    ];

    const paymenTermsEditor = new Quill("#paymen_terms_editor", {
        bounds: "#paymen_terms_editor",
        placeholder: "Type Something...",
        modules: {
            formula: true,
            toolbar: fullToolbar,
        },
        theme: "snow",
    });

    const deliveryEditor = new Quill("#delivery_editor", {
        bounds: "#delivery_editor",
        placeholder: "Type Something...",
        modules: {
            formula: true,
            toolbar: fullToolbar,
        },
        theme: "snow",
    });

    

    flatpickr("#order_date", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
    });

    // flatpickr("#surgeryDate", {
    //     dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
    //     allowInput: true, // Allows manual input if desired
    // });

    // flatpickr(".timepicker", {
    //     enableTime: true,
    //     noCalendar: true,
    //     dateFormat: "h:i K",
    // });

    $("#purchase_order_save_btn").click(function () {
        // Extract Quill editor content
        var paymentTermsContent = paymenTermsEditor.root.innerHTML;
        var deliveryContent = deliveryEditor.root.innerHTML;

        // Serialize data from all forms and convert it to a proper format
        var preAdmissionFormData = $("#purchase_order_form").serializeArray();

        // Add Quill content to the serialized form data
        preAdmissionFormData.push(
            { name: "payment_terms", value: paymentTermsContent },
            { name: "delivery_terms", value: deliveryContent }
        );

        // AJAX request
        $.ajax({
            url: BASE_URL + "/purchase-order",
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
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    console.error("Error:", xhr);
                }
            },
        });
    });


    $("#purchase_order_update_btn").click(function () {
        // Extract Quill editor content
        var paymentTermsContent = paymenTermsEditor.root.innerHTML;
        var deliveryContent = deliveryEditor.root.innerHTML;

        // Serialize data from all forms and convert it to a proper format
        var preAdmissionFormData = $("#purchase_order_form").serializeArray();

        // Add Quill content to the serialized form data
        preAdmissionFormData.push(
            { name: "payment_terms", value: paymentTermsContent },
            { name: "delivery_terms", value: deliveryContent }
        );

        // AJAX request
        $.ajax({
            url: BASE_URL + "/update-purchase-order/" + $('#edit_purchase_order_id').val(),
            type: "PUT",
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
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    console.error("Error:", xhr);
                }
            },
        });
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

    $("#item_vendor_code").select2({
        placeholder: "Search Vendor Code",
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/search-item-vendor-by-query",
            // url: BASE_URL + "/search-patient-by-query",

            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    itemVendorCode: params.term,
                };
            },
            processResults: function (data) {
                console.log(data.data);

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

    $("#item_vendor_code").on("select2:select", function (e) {
        // getPatientById(e.params.data.id);
        let selectedId = e.params.data.id;
        // Set the selected option in #item_vendor_name
        // $("#item_vendor_name").val(selectedId).trigger('change');
        // Call the function to fetch patient details
        getVendorById(selectedId);
    });

    $("#item_vendor_name").select2({
        placeholder: "Search Vendor Name",
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/search-item-vendor-by-query",
            // url: BASE_URL + "/search-patient-by-query",

            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    itemVendorName: params.term,
                };
            },
            processResults: function (data) {
                console.log(data.data);

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

    $("#item_vendor_name").on("select2:select", function (e) {
        getPatientById(e.params.data.id);
    });

    $("#item_name").select2({
        placeholder: "Search Item Name",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url: BASE_URL + "/search-item-name-by-query",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    itemName: params.term,
                };
            },
            processResults: function (data) {
                console.log(data);
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
                "/purchase-order-get-item-details/" +
                $("#item_name").val(),
            type: "get",
            success: function (response) {
                if (response.status === true) {
                    console.log(response);
                    // Prepare the dropdown options based on `units`
                    let options = `<option value="" >Select</option>`;
                    if (response.data.units) {
                        response.data.units.forEach(function (unit) {
                            options += `<option value="${unit.unitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
                        });
                    }
                    console.log(options);
                    purchaseOrderHtml = `<tr>
                                <td class="item-name-td">
                                    <input type="hidden" class="service-id form-control" name="item_id[]" value="${response.data.itemMasterId}">
                                    ${response.data.itemName}
                                </td>
                                <td class="item-code-td">
                                    ${response.data.itemCode}
                                </td>
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[]" value="1">
                                </td>
                                <td class="item-unit-td" style="width: 120px;">
                                    <select id="item_unit" name="item_unit[]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${options}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="VAT %" name="item_unit_price[]" value="">
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="item_amount[]" value="">
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[]" value="${response.data.vat}">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_amount[]">
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[]">
                                </td>
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

                    $("#purchase_order_table_tbody").append(purchaseOrderHtml);

                    $(".item-unit").select2({
                        placeholder: "Selection", // Match the placeholder in the select
                        allowClear: true,
                    });
                } else {
                    console.error("Service details not found");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            },
        });
    });
});

$(document).on("change", ".item-unit", function () {
    // Get the selected option
    let selectedOption = $(this).find("option:selected");

    // Get the unit price from the data attribute
    let unitPrice = selectedOption.data("unit-price");

    // Find the row of the current select dropdown
    let currentRow = $(this).closest("tr");

    // Set the value in the 'item-unit-price-td' input field
    currentRow.find(".item-unit-price-td input").val(unitPrice);
});

$(document).on(
    "change",
    ".item-unit, .item-quantity-td input, .vat-percentage-td input",
    function () {
        // Get the row of the current change event
        let currentRow = $(this).closest("tr");

        // Get necessary values
        let unitPrice =
            parseFloat(
                currentRow.find(".item-unit option:selected").data("unit-price")
            ) || 0; // Unit price from the selected option
        let quantity =
            parseFloat(currentRow.find(".item-quantity-td input").val()) || 0; // Quantity input
        let vatPercentage =
            parseFloat(currentRow.find(".vat-percentage-td input").val()) || 0; // VAT percentage input

        // Calculate the amount
        let amount = unitPrice * quantity;
        currentRow.find(".item-amount-td input").val(amount.toFixed(2)); // Display the amount

        // Calculate the VAT amount
        let vatAmount = (amount * vatPercentage) / 100;
        currentRow.find(".vat-amount-td input").val(vatAmount.toFixed(2)); // Display the VAT amount

        // Calculate the net amount
        let netAmount = amount + vatAmount;
        currentRow.find(".net-amount-td input").val(netAmount.toFixed(2)); // Display the net amount
    }
);

function getVendorById(selectedId) {
    $.ajax({
        // url: BASE_URL + "/get-patient-by-id",
        url: BASE_URL + "/get-vendor-by-id",
        type: "GET",
        data: {
            vendorId: selectedId,
        },
        success: function (response) {
            if (response.status) {
                console.log(response.data.vendorId);
                // Sample data from the provided JSON
                let vendorData = {
                    vendorId: response.data.vendorId,
                    vendor_name_en: response.data.vendor_name_en,
                };

                // Append the vendor as an option and set it as selected
                let vendorSelect = $("#item_vendor_name");
                let vendorId = vendorData.vendorId;
                let vendorName = vendorData.vendor_name_en;

                // Check if the option already exists in the dropdown
                if (
                    !vendorSelect.find('option[value="' + vendorId + '"]')
                        .length
                ) {
                    // Append the new option
                    vendorSelect.append(
                        $("<option>", {
                            value: vendorId, // Set the value as the vendorId
                            text: vendorName, // Set the text as the vendor name
                        })
                    );
                }

                // Set the newly added or existing option as selected
                vendorSelect.val(vendorId).trigger("change");
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        },
    });
}

$(document).on(
    "change keyup",
    ".item-quantity-td input, .item-unit-price-td input, .vat-percentage-td input",
    function () {
        calculateRowTotals();
        calculateTableTotals();
    }
);

$(document).on("change keyup", "#item_discount_percentage", function () {
    calculateTableTotals();
});

function calculateRowTotals() {
    $("#purchase_order_table_tbody tr").each(function () {
        let quantity =
            parseFloat($(this).find(".item-quantity-td input").val()) || 0;
        let unitPrice =
            parseFloat($(this).find(".item-unit-price-td input").val()) || 0;
        let vatPercentage =
            parseFloat($(this).find(".vat-percentage-td input").val()) || 0;

        // Calculate row amounts
        let amount = quantity * unitPrice;
        let vatAmount = (amount * vatPercentage) / 100;
        let netAmount = amount + vatAmount;

        // Update fields
        $(this).find(".item-amount-td input").val(amount.toFixed(2));
        $(this).find(".vat-amount-td input").val(vatAmount.toFixed(2));
        $(this).find(".net-amount-td input").val(netAmount.toFixed(2));
    });
}

function calculateTableTotals() {
    let totalAmount = 0;
    let totalVatAmount = 0;
    let totalNetAmount = 0;
    let totalVatPercentage = 0;

    // Sum all rows
    $("#purchase_order_table_tbody tr").each(function () {
        totalAmount +=
            parseFloat($(this).find(".item-amount-td input").val()) || 0;
        totalVatAmount +=
            parseFloat($(this).find(".vat-amount-td input").val()) || 0;
        totalNetAmount +=
            parseFloat($(this).find(".net-amount-td input").val()) || 0;
        totalVatPercentage +=
            parseFloat($(this).find(".vat-percentage-td input").val()) || 0;
    });

    // Get discount percentage and amount
    let discountPercentage =
        parseFloat($("#item_discount_percentage").val()) || 0;
    let discountAmount = (totalAmount * discountPercentage) / 100;
    let totalAfterDiscount = totalAmount - discountAmount;

    // Update fields
    $("#item_total").val(totalAmount.toFixed(2));
    $("#item_discount_amount").val(discountAmount.toFixed(2));
    $("#item_total_after_discount").val(totalAfterDiscount.toFixed(2));
    $("#item_vat_total").val(totalVatAmount.toFixed(2));
    $("#item_total_with_vat").val(
        (totalAfterDiscount + totalVatAmount).toFixed(2)
    );
    $("#item_vat_total_percentage").val(totalVatPercentage.toFixed(2));
}

// Remove row and recalculate totals
$(document).on("click", ".remove-row", function () {
    $(this).closest("tr").remove();
    calculateTableTotals();
});

function initialPageLoad(editPurchaseOrderId) {
    $.ajax({
        url: BASE_URL + "/edit-purchase-order/" + editPurchaseOrderId,
        type: "GET",
        success: function (response) {
            if (response.status === true) {
                console.log(response.data);

                $('#order_date').val(response.data.date);
                $("#delivery_date").val(response.data.delivery_date);
                $("#attention").val(response.data.attention);
                $("#enquiry_no").val(response.data.enquiry_no);
                $("#clinic_select").val(response.data.branch_id);
                $("#department_select").val(response.data.master_department_id);
                $("#receiver_note").val(response.data.receiver_note);
                $("#item_discount_percentage").val(
                    response.data.discount_percent
                );
                $("#item_discount_amount").val(response.data.discount_amount);
                $("#item_total_after_discount").val(
                    response.data.total_amount_after_discount
                );
                $("#item_vat_total_percentage").val(
                    response.data.vat_in_percent
                );
                $("#item_vat_total").val(response.data.vat_amount);
                $("#item_total_with_vat").val(
                    response.data.total_with_vat_amount
                );
                $('#po_no').val('#'+response.data.po_no);

                $("#item_vendor_name").append(
                    $("<option>", {
                        value: response.data.vendor.vendorId, // Set the value as the vendorId
                        text: response.data.vendor.vendor_name_en, // Set the text as the vendor name
                    })
                );
                // Set the newly added or existing option as selected
                $("#item_vendor_name").val(response.data.vendor.vendorId).trigger("change");

                $("#item_vendor_code").append(
                    $("<option>", {
                        value: response.data.vendor.vendorId, // Set the value as the vendorId
                        text: response.data.vendor.vendor_code, // Set the text as the vendor name
                    })
                );
                // Set the newly added or existing option as selected
                $("#item_vendor_code").val(response.data.vendor.vendorId).trigger("change");

                // Bind Payment Terms
                if (response.data.payment_terms) {
                    $("#paymen_terms_editor p").text(
                        response.data.payment_terms
                    ); // Set the text inside the editor
                    $("#payment_terms").val(response.data.payment_terms); // Set the hidden input value
                }

                // Bind Delivery Terms
                if (response.data.delivery_terms) {
                    $("#delivery_editor p").text(response.data.delivery_terms); // Set the text inside the editor
                    $("#delivery_terms").val(response.data.delivery_terms); // Set the hidden input value
                }

                totalNetAmount = pupulatePurchaseOrderItems(response.data.items);

                $("#item_total").val(totalNetAmount);


            }
        },
    });
}

function pupulatePurchaseOrderItems(purchaseOrderItems) {
    var editPurchaseOrderHtml = "";
    var totalNetAmount = 0; // Initialize total amount with VAT
    purchaseOrderItems.forEach((purchaseOrderItem, index) => {
        let unitoptions = "";
        if (purchaseOrderItem.item.units) {
            purchaseOrderItem.item.units.forEach(function (unit) {
                unitoptions += `<option value="${unit.unitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
            });
        }

        // Accumulate the total net amount
        totalNetAmount += parseFloat(purchaseOrderItem.amount_with_vat || 0);

        editPurchaseOrderHtml = `<tr>
                                <td class="item-name-td">
                                    <input type="hidden" class="service-id form-control" name="item_id[]" value="${purchaseOrderItem.item_id}">
                                    ${purchaseOrderItem.item.itemName}
                                </td>
                                <td class="item-code-td">
                                ${purchaseOrderItem.item.itemCode}
                                </td>
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[]" value="${purchaseOrderItem.quantity}">
                                </td>
                                <td class="item-unit-td" style="width: 120px;">
                                    <select id="item_unit_${index}" name="item_unit[]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                    ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Unit Price" name="item_unit_price[]" value="${purchaseOrderItem.unit_price}">
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[]" value="${purchaseOrderItem.amount}">
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="VAT Percentage" name="item_vat_percentage[]" value="${purchaseOrderItem.vat_percent}">
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="item_vat_amount[]" value="${purchaseOrderItem.vat_amount}">
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Net Amount" name="item_net_amount[]" value="${purchaseOrderItem.amount_with_vat}">
                                </td>
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

        // Append the generated HTML to the table body
        $("#purchase_order_table_tbody").append(editPurchaseOrderHtml);

        // Initialize select2 for the new select element
        $(`#item_unit_${index}`).select2({
            placeholder: "Selection", // Match the placeholder in the select
            allowClear: true,
        });
console.log(purchaseOrderItem);
        // Set the value of the select box based on `purchaseOrderItem.unit_id`
        if (purchaseOrderItem.item_unit_id) {
            $(`#item_unit_${index}`)
                .val(purchaseOrderItem.item_unit_id)
                .trigger("change");
        }
    });

    return totalNetAmount;
}
