$(document).ready(function () {
    $("#purchase_main_menu").addClass("active open menu-item-animating");
    $("#goods_recieve_note_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var selectElement = $("#clinic_select");

    // Check if the number of options (excluding the first empty option) is 1
    if (selectElement.find("option").length === 2) {
        // One option + "Select"
        // Set the default value to the only available option
        selectElement
            .val(selectElement.find("option").not(":first").val())
            .trigger("change");
    }

    $("#currency").val(3).trigger("change");

    if ($("#edit_goods_recieve_note_id").val()) {
        $("#table-loader").show();
        initialPageLoad($("#edit_goods_recieve_note_id").val());
    }

    // Get the current date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format the date

    // Set the current date as the value of the input field
    $("#invoice_date").val(formattedDate);

    flatpickr("#invoice_date", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
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

    $("#goods_recieved_note_save_btn").click(function () {
        let itemCount = $("#goods_recieve_note_table_tbody tr").length;
        if (itemCount > 0) {
            $("#page-loader").show();
            // Serialize data from all forms and convert it to a proper format
            var goodsRecieveNoteFormData = $(
                "#goods_recieve_note_form",
            ).serializeArray();

            // AJAX request
            $.ajax({
                url: BASE_URL + "/purchase/goods-recieve-note",
                type: "POST",
                data: goodsRecieveNoteFormData, // Properly formatted form data
                success: function (response) {
                    $("#page-loader").hide();
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
                    $("#page-loader").hide();
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
                                key.startsWith("item_discount.") ||
                                key.startsWith("item_vat_percentage.") ||
                                key.startsWith("item_vat_amount.") ||
                                key.startsWith("item_net_amount.") ||
                                key.startsWith("item_expiry_date.")
                            ) {
                                var fieldParts = key.split(".");
                                var fieldIndex = fieldParts[1];
                                var fieldName = fieldParts[0];
                                var targetRow = $(
                                    "#goods_recieve_note_table_tbody tr",
                                ).eq(fieldIndex);
                                // Adjust selection for input or select fields
                                var targetCell = targetRow.find(
                                    `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`,
                                );

                                // Append error message below the field
                                if (targetCell.length > 0) {
                                    // Check if the target is a select2 element
                                    if (targetCell.is("select")) {
                                        var select2Container =
                                            targetCell.next(
                                                ".select2-container",
                                            );
                                        if (select2Container.length > 0) {
                                            select2Container.after(
                                                `<span class="text-danger error-text">${value[0]}</span>`,
                                            );
                                        }
                                    } else {
                                        targetCell.after(
                                            `<span class="text-danger error-text">${value[0]}</span>`,
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

    $("#goods_recieved_note_update_btn").click(function () {
        // Extract Quill editor content

        $("#page-loader").show();
        // Serialize data from all forms and convert it to a proper format
        var goodsRecieveNoteFormData = $(
            "#goods_recieve_note_form",
        ).serializeArray();

        // AJAX request
        $.ajax({
            url:
                BASE_URL +
                "/update-goods-recieve-note/" +
                $("#edit_goods_recieve_note_id").val(),
            type: "PUT",
            data: goodsRecieveNoteFormData, // Properly formatted form data
            success: function (response) {
                $("#page-loader").hide();
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
                $("#page-loader").hide();
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

    if ($("#po_no").data("select2")) {
        $("#po_no").select2("destroy");
    }
    $("#po_no")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#po_no").parent(),
            width: "100%",
            placeholder: "Search Purchase Order",
            allowClear: true,
            minimumInputLength: 1,
            ajax: {
                url: BASE_URL + "/purchase/search-purchase-order-by-query",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        purchaseOrder: params.term,
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

    $("#po_no").on("select2:select", function (e) {
        // getPatientById(e.params.data.id);
        let selectedId = e.params.data.id;
        // Set the selected option in #item_vendor_name
        // $("#item_vendor_name").val(selectedId).trigger('change');
        // Call the function to fetch patient details
        getPurchaseOrderDetails(selectedId);
    });

    function formatRepoPurchaseNumber(repo) {
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

    function formatRepoPurchaseNumberSelection(repo) {
        return repo.text || repo.id;
    }

    if ($("#purchase_number").data("select2")) {
        $("#purchase_number").select2("destroy");
    }
    $("#purchase_number")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#purchase_number").parent(),
            width: "100%",
            placeholder: "Search Purchase Number",
            allowClear: true,
            minimumInputLength: 1,
            ajax: {
                url: BASE_URL + "/purchase/search-purchase-number-by-query",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        purchaseNumber: params.term,
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
            templateResult: formatRepoPurchaseNumber,
            templateSelection: formatRepoPurchaseNumberSelection,
        });

    $("#purchase_number").on("select2:select", function (e) {
        // getPatientById(e.params.data.id);
        let selectedId = e.params.data.id;
        // Set the selected option in #item_vendor_name
        // $("#item_vendor_name").val(selectedId).trigger('change');
        // Call the function to fetch patient details
        // getPurchaseNumberDetails(selectedId);
    });

    // $("#vendor_name").select2({
    //     placeholder: "Search Vendor Name",
    //     allowClear: true,
    //     minimumInputLength: 1,
    //     ajax: {
    //         url: BASE_URL + "/search-item-vendor-by-query",
    //         // url: BASE_URL + "/search-patient-by-query",

    //         dataType: "json",
    //         delay: 250,
    //         data: function (params) {
    //             return {
    //                 itemVendorName: params.term,
    //             };
    //         },
    //         processResults: function (data) {
    //             console.log(data.data);

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

    // $("#vendor_name").on("select2:select", function (e) {
    //     getPatientById(e.params.data.id);
    // });

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
            minimumInputLength: 3,
            ajax: {
                url: BASE_URL + "/purchase/search-item-name-by-query",
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
            /(.+?)\s*(?:\(([^)]+)\))?\s*-\s*\d+(\.\d+)?\s*$/,
        );
        if (match) {
            var serviceName = match[1].trim();
            var serviceCode = match[2] ? match[2].trim() : null;
        }
        $("#loader-overlay").show();
        $.ajax({
            url:
                BASE_URL +
                "/purchase/purchase-order-get-item-details/" +
                $("#item_name").val(),
            type: "get",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    console.log(response);
                    // Prepare the dropdown options based on `units`
                    let options = `<option value="" data-unit-price="">Select</option>`;
                    if (response.data.units) {
                        response.data.units.forEach(function (unit) {
                            options += `<option value="${unit.unitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
                        });
                    }
                    console.log(options);
                    var rowIndex = $(
                        "#goods_recieve_note_table_tbody tr",
                    ).length; // Calculate index

                    purchaseOrderHtml = `<tr>
                                <td class="item-code-td">
                                    ${response.data.itemCode}
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="service-id form-control" name="item_id[]" value="${response.data.itemMasterId}">
                                    ${response.data.itemName_en}
                                    <input type="hidden" class="service-id form-control" name="goods_recieved_entry_details_id[${rowIndex}]" value="0">

                                </td>
                                
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[]" value="1">
                                </td>
                                <td class="item-unit-td">
                                    <select id="item_unit" name="item_unit[]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${options}
                                    </select>
                                </td>
                                
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="item_unit_price[]" value="">
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Item Amount" name="item_amount[]" value="">
                                </td>
                                <td class="item-discount-td">
                                    <input type="text" class="form-control" placeholder="Discount" name="item_discount[]" value="0">
                                </td>
                                
                                <td class="ite-vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[]" value="${response.data.tax.taxValueInPercentage}">
                                    
                                </td>
                                <td class="item-vat-amount-td">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="item_vat_amount[]" value="">
                                </td>
                                <td class="item-net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[]">
                                </td>
                                <td class="item-expiry-date-td">
                                    <input type="text" id="item_expiry_date" class="form-control ex-date item_expiry_date" placeholder="YYYY-MM-DD"  name="item_expiry_date[]" />
                                </td>
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

                    $("#goods_recieve_note_table_tbody").append(
                        purchaseOrderHtml,
                    );

                    $(".item-unit").select2({
                        placeholder: "Selection", // Match the placeholder in the select
                        allowClear: true,
                    });

                    flatpickr(".ex-date", {
                        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
                        allowInput: true, // Allows manual input if desired
                    });
                } else {
                    console.error("Service details not found");
                }
            },
            error: function (xhr, status, error) {
                $("#loader-overlay").hide();
                console.error("Error:", error);
            },
        });
    });

    $("#item_name").val("").trigger("change");
});

$(document).on("change", "#clinic_select", function () {
    $("#loader-overlay").show();
    $.ajax({
        // url: BASE_URL + "/get-patient-by-id",
        url:
            BASE_URL +
            "/purchase/get-item-department-by-branch-id/" +
            $(this).val(),
        type: "GET",
        success: function (response) {
            $("#loader-overlay").hide();
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
                        }),
                    );
                });
            }
        },
        error: function (xhr, status, error) {
            $("#loader-overlay").hide();
            console.error("AJAX Error: ", status, error);
        },
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

function getPurchaseOrderDetails(purchaseOrderId) {
    $.ajax({
        // url: BASE_URL + "/get-patient-by-id",
        url:
            BASE_URL +
            "/purchase/get-purchase-order-details-by-id/" +
            purchaseOrderId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                console.log(response);
                $("#vendor_name").val(response.data.vendor.vendor_name_en);
                $("#vendor_id").val(response.data.vendor.vendorId);

                $("#clinic_select").val(response.data.clinicId);
                $("#department_select").val(response.data.departmentId);
                // $("#currency").val("3/1").trigger("change");
                $("#item_discount_percentage").val(
                    response.data.discount_percent,
                );
                $("#item_discount_amount").val(response.data.discount_amount);
                $("#item_total_after_discount").val(
                    response.data.total_amount_after_discount,
                );
                $("#item_vat_total_percentage").val(
                    response.data.vat_in_percent,
                );
                $("#item_vat_total").val(response.data.vat_amount);

                purchasedItemsTotal = pupulatePurchaseOrderItems(
                    response.data.items,
                );

                $("#item_total").val(response.data.totalAmount);
                $("#item_discount_amount").val(response.data.discountAmount);

                $("#total_without_vat").val(
                    response.data.totalAmountAfterDiscount,
                );

                $("#item_vat_total").val(response.data.vatAmount);
                $("#item_total_with_vat").val(response.data.totalWithVatAmount);
                recalculateSummary();
                calculateDiscountBasisPercentage(response.data.discountPercent);
            }
        },
    });
}

function getPurchaseNumberDetails(purchaseItemBillId) {
    $.ajax({
        // url: BASE_URL + "/get-patient-by-id",
        url:
            BASE_URL +
            "/purchase/get-purchase-number-details-by-id/" +
            purchaseItemBillId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                console.log(response.data);
                $("#vendor_name").val(response.data.vendor.vendor_name_en);
                $("#vendor_id").val(response.data.vendor.vendorId);
                $("#purchase_ref_no").val(response.data.purchaserefNo);
                $("#clinic_select").val(response.data.clinicId);
                // $("#department_select").val(response.data.departmentId);
                // // $("#currency").val("3/1").trigger("change");
                // $("#item_discount_percentage").val(
                //     response.data.discount_percent
                // );
                // $("#item_discount_amount").val(response.data.discount_amount);
                // $("#item_total_after_discount").val(
                //     response.data.total_amount_after_discount
                // );
                // $("#item_vat_total_percentage").val(
                //     response.data.vat_in_percent
                // );
                // $("#item_vat_total").val(response.data.vat_amount);

                purchasedItemsTotal = pupulatePurchaseNumberItems(
                    response.data.items,
                );

                $("#item_total").val(response.data.billTotal);
                $("#item_discount_amount").val(
                    response.data.totalDiscountAmount,
                );

                $("#total_without_vat").val(
                    response.data.billTotalWithDiscount,
                );

                $("#item_vat_total").val(response.data.totalVat);
                $("#item_total_with_vat").val(response.data.totalWithVat);
                // recalculateSummary();
                // calculateDiscountBasisPercentage(response.data.discountPercent);
            }
        },
    });
}

function pupulatePurchaseNumberItems(purchaseOrderItems) {
    $("#goods_recieve_note_table_tbody").empty();
    var editPurchaseOrderHtml = "";
    let totalAmountWithoutVatAndDiscount = 0;
    let totalAmountWithVatAndDiscount = 0;
    let indexCount = 1;

    purchaseOrderItems.forEach((purchaseOrderItem, index) => {
        // let itemFullRecieved =
        //     purchaseOrderItem.quantity - purchaseOrderItem.receievedQuantity;
        //     console.log(purchaseOrderItem.quantity +'-'+ purchaseOrderItem.receievedQuantity);
        // if (itemFullRecieved > 0) {
        console.log(
            purchaseOrderItem.quantity +
                "=>" +
                purchaseOrderItem.receievedQuantity,
        );

        console.log(purchaseOrderItem.purchased_items.itemCode);

        let unitoptions = "";
        if (purchaseOrderItem.purchased_items.units) {
            purchaseOrderItem.purchased_items.units.forEach(function (unit) {
                unitoptions += `<option value="${unit.itemUnitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
            });
        }

        let quantity =
            purchaseOrderItem.quantity - purchaseOrderItem.receievedQuantity;
        indexCount = index + 1;
        var rowIndex = $("#goods_recieve_note_table_tbody tr").length;

        editPurchaseOrderHtml = `<tr>
        <td class="item-code-td">
                                ${purchaseOrderItem.purchased_items.itemCode}
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="service-id form-control" name="item_id[${rowIndex}]" value="${purchaseOrderItem.itemMasterId}">
                                    ${purchaseOrderItem.purchased_items.itemName_en}
                                </td>
                                <td class="item-quantity-td">
                                    <input type="hidden" class="form-control" placeholder="Quantity" name="purchase_order_quantity[${rowIndex}]" value="${purchaseOrderItem.quantity}">
                                    <input type="hidden" class="form-control" placeholder="Quantity" name="purchase_order_recieved_quantity[${rowIndex}]" value="${purchaseOrderItem.receievedQuantity}">

                                    <input type="hidden" class="form-control" placeholder="Quantity" name="purchase_order_tem_id[${rowIndex}]" value="${purchaseOrderItem.purchaseOrderItemId}">


                                    <input type="number" id="item_quantity_${index}" class="form-control" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${purchaseOrderItem.quantity}">
                                </td>
                                <td class="item-unit-td" style="width: 150px;">
                                    <select id="item_unit_${index}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                    ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Unit Price" name="item_unit_price[${rowIndex}]" value="${purchaseOrderItem.unitPrice}">
                                </td>
                                
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" id="item_amount_${rowIndex}" name="item_amount[${rowIndex}]" value="${purchaseOrderItem.itemAmount}">
                                </td>
                                <td class="item-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" id="item_discount_${rowIndex}" name="item_discount[${rowIndex}]" value="${purchaseOrderItem.discountAmount}">
                                </td>
                                <td class="item-vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="VAT Percentage" id="item_vat_percentage_${rowIndex}" name="item_vat_percentage[${rowIndex}]" value="${purchaseOrderItem.vatPercentage}">
                                </td>
                                <td class="item-vat-amount-td">
                                    <input type="text" class="form-control" placeholder="VAT Amount" id="item_vat_amount_${rowIndex}" name="item_vat_amount[${rowIndex}]" value="${purchaseOrderItem.vatAmount}">
                                </td>
                                <td class="item-net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" id="item_net_amount_${rowIndex}" name="item_net_amount[${rowIndex}]" value="${purchaseOrderItem.totalAmountWithVat}">
                                </td>
                                <td class="item-expiry-date-td" style="width: 250px;">
                                    <input type="text" id="item_expiry_date" class="form-control item-expiry-date item_expiry_date" placeholder="YYYY-MM-DD" name="item_expiry_date[${rowIndex}]" value="${purchaseOrderItem.expiryDate}">
                                </td>
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

        // Append the generated HTML to the table body
        $("#goods_recieve_note_table_tbody").append(editPurchaseOrderHtml);

        // Initialize select2 for the new select element

        // Set the value of the select box based on `purchaseOrderItem.unit_id`
        // if (purchaseOrderItem.itemUnitId) {
        //     $(`#item_unit_${index}`)
        //         .val(purchaseOrderItem.itemUnitId)
        //         .trigger("change");
        // }

        $(`#item_unit_${rowIndex}`).select2({
            placeholder: "Selection", // Match the placeholder in the select
            allowClear: true,
        });

        // let pQuantity =
        //     purchaseOrderItem.quantity -
        //     purchaseOrderItem.receievedQuantity;
        // $(`#item_quantity_${index}`).val(pQuantity);
        // let pAmount = pQuantity * purchaseOrderItem.unitPrice;
        // console.log(pQuantity + " * " + purchaseOrderItem.unitPrice);
        // console.log(pAmount);
        // $(`#item_amount_${index}`).val(pAmount);

        // let pDiscount = $(`#item_discount_${index}`).val();
        // let pVatPercentage = $(`#item_vat_percentage_${index}`).val();

        // // Apply discount
        // let pDiscountedAmount = pAmount - pDiscount;

        // // Calculate VAT
        // let pVatAmount = (pDiscountedAmount * pVatPercentage) / 100;
        // $(`#item_vat_amount_${index}`).val(pVatAmount);

        // // Calculate the net amount (discounted amount + VAT)
        // let pNetAmount = pDiscountedAmount + pVatAmount;
        // $(`#item_net_amount_${index}`).val(pNetAmount);

        flatpickr(".item-expiry-date", {
            dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
            allowInput: true, // Allows manual input if desired
        });
        // }
    });

    // $("#item_td_count").val(indexCount);

    // return {
    //     totalAmountWithoutVatAndDiscount: totalAmountWithoutVatAndDiscount,
    //     totalAmountWithVatAndDiscount: totalAmountWithVatAndDiscount,
    // };
}

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
                        }),
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

function pupulatePurchaseOrderItems(purchaseOrderItems) {
    $("#goods_recieve_note_table_tbody").empty();
    var editPurchaseOrderHtml = "";
    let totalAmountWithoutVatAndDiscount = 0;
    let totalAmountWithVatAndDiscount = 0;
    let indexCount = 1;

    purchaseOrderItems.forEach((purchaseOrderItem, index) => {
        let itemFullRecieved =
            purchaseOrderItem.quantity - purchaseOrderItem.receievedQuantity;
        if (itemFullRecieved > 0) {
            console.log(
                purchaseOrderItem.quantity +
                    "=>" +
                    purchaseOrderItem.receievedQuantity,
            );

            let unitoptions = "";
            if (purchaseOrderItem.item.units) {
                purchaseOrderItem.item.units.forEach(function (unit) {
                    unitoptions += `<option value="${unit.itemUnitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
                });
            }

            let quantity =
                purchaseOrderItem.quantity -
                purchaseOrderItem.receievedQuantity;
            indexCount = index + 1;
            var rowIndex = $("#goods_recieve_note_table_tbody tr").length;

            editPurchaseOrderHtml = `<tr>
        <td class="item-code-td">
                                ${purchaseOrderItem.item.itemCode}
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="service-id form-control" name="item_id[${rowIndex}]" value="${purchaseOrderItem.itemMasterId}">
                                    ${purchaseOrderItem.item.itemName_en}
                                </td>
                                <td class="item-quantity-td">
                                    <input type="hidden" class="form-control" placeholder="Quantity" name="purchase_order_quantity[${rowIndex}]" value="${purchaseOrderItem.quantity}">
                                    <input type="hidden" class="form-control" placeholder="Quantity" name="purchase_order_recieved_quantity[${rowIndex}]" value="${purchaseOrderItem.receievedQuantity}">

                                    <input type="hidden" class="form-control" placeholder="Quantity" name="purchase_order_tem_id[${rowIndex}]" value="${purchaseOrderItem.purchaseOrderItemId}">


                                    <input type="number" id="item_quantity_${index}" class="form-control" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${quantity}">
                                </td>
                                <td class="item-unit-td" style="width: 150px;">
                                    <select id="item_unit_${index}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                    ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Unit Price" name="item_unit_price[${rowIndex}]" value="${purchaseOrderItem.unitPrice}">
                                </td>
                                
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" id="item_amount_${rowIndex}" name="item_amount[${rowIndex}]" value="${purchaseOrderItem.amount}">
                                </td>
                                <td class="item-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" id="item_discount_${rowIndex}" name="item_discount[${rowIndex}]" value="0">
                                </td>
                                <td class="item-vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="VAT Percentage" id="item_vat_percentage_${rowIndex}" name="item_vat_percentage[${rowIndex}]" value="${purchaseOrderItem.vatPercent}">
                                </td>
                                <td class="item-vat-amount-td">
                                    <input type="text" class="form-control" placeholder="VAT Amount" id="item_vat_amount_${rowIndex}" name="item_vat_amount[${rowIndex}]" value="${purchaseOrderItem.vatAmount}">
                                </td>
                                <td class="item-net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" id="item_net_amount_${rowIndex}" name="item_net_amount[${rowIndex}]" value="${purchaseOrderItem.amountWithVat}">
                                </td>
                                <td class="item-expiry-date-td" style="width: 250px;">
                                    <input type="text" id="item_expiry_date" class="form-control item-expiry-date item_expiry_date" placeholder="YYYY-MM-DD" name="item_expiry_date[${rowIndex}]" value="">
                                </td>
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

            // Append the generated HTML to the table body
            $("#goods_recieve_note_table_tbody").append(editPurchaseOrderHtml);

            // Initialize select2 for the new select element
            $(`#item_unit_${rowIndex}`).select2({
                placeholder: "Selection", // Match the placeholder in the select
                allowClear: true,
            });

            // Set the value of the select box based on `purchaseOrderItem.unit_id`
            if (purchaseOrderItem.itemUnitId) {
                $(`#item_unit_${index}`)
                    .val(purchaseOrderItem.itemUnitId)
                    .trigger("change");
            }

            let pQuantity =
                purchaseOrderItem.quantity -
                purchaseOrderItem.receievedQuantity;
            $(`#item_quantity_${index}`).val(pQuantity);
            let pAmount = pQuantity * purchaseOrderItem.unitPrice;
            console.log(pQuantity + " * " + purchaseOrderItem.unitPrice);
            console.log(pAmount);
            $(`#item_amount_${index}`).val(pAmount);

            let pDiscount = $(`#item_discount_${index}`).val();
            let pVatPercentage = $(`#item_vat_percentage_${index}`).val();

            // Apply discount
            let pDiscountedAmount = pAmount - pDiscount;

            // Calculate VAT
            let pVatAmount = (pDiscountedAmount * pVatPercentage) / 100;
            $(`#item_vat_amount_${index}`).val(pVatAmount);

            // Calculate the net amount (discounted amount + VAT)
            let pNetAmount = pDiscountedAmount + pVatAmount;
            $(`#item_net_amount_${index}`).val(pNetAmount);

            flatpickr(".item-expiry-date", {
                dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
                allowInput: true, // Allows manual input if desired
            });
        }
    });

    $("#item_td_count").val(indexCount);

    return {
        totalAmountWithoutVatAndDiscount: totalAmountWithoutVatAndDiscount,
        totalAmountWithVatAndDiscount: totalAmountWithVatAndDiscount,
    };
}

$(document).on("change", "#currency", function () {
    $.ajax({
        url:
            BASE_URL +
            "/purchase/get-currency-exrate-by-currency-id/" +
            $(this).val(),
        type: "get",
        success: function (response) {
            if (response.status === true) {
                // console.log(response.data.currency_exrate);
                $("#ex_rate").val(response.data.currency_exrate);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        },
    });
});

function initialPageLoad(editGoodsRecieveNoteId) {
    $.ajax({
        url: BASE_URL + "/purchase/edit-goods-recieve-note/" + editGoodsRecieveNoteId,
        type: "GET",
        success: function (response) {
            $("#table-loader").remove();
            if (response.status) {
                $("#clinic_select").val(response.data.clinicId).trigger("change");
                $("#department_select").val(response.data.departmentId).trigger("change");
                $("#ex_rate").val(response.data.exRate);
                $("#currency").val(response.data.currencyId).trigger("change");
                $("#purchase_ref_no").val(response.data.purchaseRefNo);
                $("#invoice_no").val(response.data.invoiceNo);
                $("#vendor_id").val(response.data.vendorId);
                $("#vendor_name").val(response.data.vendor.vendor_name_en);

                if (!$("#po_no").find('option[value="' + response.data.poId + '"]').length) {
                    $("#po_no").append(
                        $("<option>", {
                            value: response.data.poId,
                            text: response.data.purchase_order?.poNo ?? '',
                        })
                    );
                }
                $("#po_no").val(response.data.poId).trigger("change");
                pupulateEditGoodsRecievedNoteItems(response.data.entry_details);
                $("#item_total").val(response.data.totalAmount);
                $("#item_discount_amount").val(response.data.totalDiscountAmount);
                $("#total_without_vat").val(response.data.totalWithoutVat);
                $("#item_vat_total").val(response.data.totalVat);
                $("#item_total_with_vat").val(response.data.billTotal);
            }
            $("#table-loader").hide();
        },
    });
}

function pupulateEditGoodsRecievedNoteItems(goodsRecievedNoteItems) {
    $("#table-loader").remove();
    $("#goods_recieve_note_table_tbody").empty();

    if (!goodsRecievedNoteItems || goodsRecievedNoteItems.length === 0) {
        $("#goods_recieve_note_table_tbody").append(
            `<tr><td colspan="12" class="text-center">No items found</td></tr>`
        );
        return;
    }

    goodsRecievedNoteItems.forEach((item, index) => {
        let unitoptions = "";
        if (item.goods_recieved_items && item.goods_recieved_items.units) {
            item.goods_recieved_items.units.forEach(function (unit) {
                let selected = unit.itemUnitId == item.itemUnitId ? "selected" : "";
                unitoptions += `<option value="${unit.itemUnitId}" ${selected} 
                    data-unit-price="${unit.sellingPrice}">
                    ${unit.unit.unit_name_en}
                </option>`;
            });
        }

        var rowIndex = index;

        let row = `<tr>
            <td class="item-code-td">
                ${item.goods_recieved_items?.itemCode ?? ''}
            </td>
            <td class="item-name-td">
                <input type="hidden" name="item_id[${rowIndex}]" value="${item.itemMasterId}">
                <input type="hidden" name="goods_recieved_entry_details_id[${rowIndex}]" value="${item.goodsRecievedEntryDetailsId}">
                <input type="hidden" name="purchase_order_quantity[${rowIndex}]" value="0">
                <input type="hidden" name="purchase_order_recieved_quantity[${rowIndex}]" value="0">
                <input type="hidden" name="purchase_order_tem_id[${rowIndex}]" value="0">
                ${item.goods_recieved_items?.itemName_en ?? ''}
            </td>
            <td class="item-quantity-td">
                <input type="number" class="form-control" name="item_quantity[${rowIndex}]" value="${item.quantity}">
            </td>
            <td class="item-unit-td">
                <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" 
                    class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                    ${unitoptions}
                </select>
            </td>
            <td class="item-unit-price-td">
                <input type="text" class="form-control" name="item_unit_price[${rowIndex}]" value="${item.unitPrice}">
            </td>
            <td class="item-amount-td">
                <input type="text" class="form-control" name="item_amount[${rowIndex}]" value="${item.itemAmount}">
            </td>
            <td class="item-discount-td">
                <input type="text" class="form-control" name="item_discount[${rowIndex}]" value="${item.discountAmount ?? 0}">
            </td>
            <td class="item-vat-percentage-td">
                <input type="text" class="form-control" name="item_vat_percentage[${rowIndex}]" value="${item.vatPercentage}">
            </td>
            <td class="item-vat-amount-td">
                <input type="text" class="form-control" name="item_vat_amount[${rowIndex}]" value="${item.vatAmount}">
            </td>
            <td class="item-net-amount-td">
                <input type="text" class="form-control" name="item_net_amount[${rowIndex}]" value="${item.totalAmountWithVat}">
            </td>
            <td class="item-expiry-date-td">
                <input type="text" class="form-control item-expiry-date item_expiry_date" 
                    placeholder="YYYY-MM-DD" name="item_expiry_date[${rowIndex}]" 
                    value="${item.expiryDate ?? ''}">
            </td>
            <td class="remove-td">
                <button type="button" class="btn btn-danger remove-row" 
                    data-id="${item.goodsRecievedEntryDetailsId}" 
                    data-type="${item.itemMasterId}">X</button>
            </td>
        </tr>`;

        $("#goods_recieve_note_table_tbody").append(row);

        $(`#item_unit_${rowIndex}`).select2({
            placeholder: "Selection",
            allowClear: true,
        });

        flatpickr(".item-expiry-date", {
            dateFormat: "Y-m-d",
            allowInput: true,
        });
    });
}

// Remove row and recalculate totals
$(document).on("click", ".remove-row", function () {
    $(this).closest("tr").remove();
    var goodsRecievedEntryDetailsId = $(this).data("id");
    var materialsId = $(this).data("type");
    if (goodsRecievedEntryDetailsId > 0 && materialsId > 0) {
        deleteAlreadyExistItem(goodsRecievedEntryDetailsId, materialsId);
    }
    recalculateSummary();
});

$(document).on(
    "input",
    '.item-quantity-td input[name^="item_quantity"], .item-unit-price-td input[name^="item_unit_price"], .item-discount-td input[name^="item_discount"], .item-vat-percentage-td input[name^="item_vat_percentage"]',
    function () {
        const $row = $(this).closest("tr");

        const quantity =
            parseFloat(
                $row
                    .find('.item-quantity-td input[name^="item_quantity"]')
                    .val(),
            ) || 0;
        const unitPrice =
            parseFloat(
                $row
                    .find('.item-unit-price-td input[name^="item_unit_price"]')
                    .val(),
            ) || 0;
        const vatPercentage =
            parseFloat(
                $row
                    .find(
                        '.item-vat-percentage-td input[name^="item_vat_percentage"]',
                    )
                    .val(),
            ) || 0;

        // Total amount = quantity * unit price
        const amount = quantity * unitPrice;

        // Get discount input
        const $discountInput = $row.find(
            '.item-discount-td input[name^="item_discount"]',
        );
        let discount = parseFloat($discountInput.val()) || 0;

        // Prevent discount from exceeding amount
        if (discount > amount) {
            discount = amount;
            $discountInput.val(amount.toFixed(2));
        }

        // Total after discount
        const amountAfterDiscount = amount - discount;

        // VAT amount calculated on amount after discount
        const vatAmount = (amountAfterDiscount * vatPercentage) / 100;

        // Bill total = amount - discount + vat
        const netAmount = amountAfterDiscount + vatAmount;

        // Update row fields
        $row.find('.item-amount-td input[name^="item_amount"]').val(
            amount.toFixed(2),
        );
        $row.find('.item-vat-amount-td input[name^="item_vat_amount"]').val(
            vatAmount.toFixed(2),
        );
        $row.find('.item-net-amount-td input[name^="item_net_amount"]').val(
            netAmount.toFixed(2),
        );

        recalculateSummary();
    },
);

function recalculateSummary() {
    let totalAmount = 0;
    let totalDiscount = 0;
    let totalVatAmount = 0;

    $("#goods_recieve_note_table_tbody tr").each(function () {
        const $row = $(this);
        const amount =
            parseFloat(
                $row.find('.item-amount-td input[name^="item_amount"]').val(),
            ) || 0;
        const discount =
            parseFloat(
                $row
                    .find('.item-discount-td input[name^="item_discount"]')
                    .val(),
            ) || 0;
        const vatAmount =
            parseFloat(
                $row
                    .find('.item-vat-amount-td input[name^="item_vat_amount"]')
                    .val(),
            ) || 0;

        totalAmount += amount;
        totalDiscount += discount;
        totalVatAmount += vatAmount;
    });

    const totalWithoutVat = totalAmount - totalDiscount;
    const billTotal = totalWithoutVat + totalVatAmount;

    $("#item_total").val(totalAmount.toFixed(2));
    $("#item_discount_amount").val(totalDiscount.toFixed(2));
    $("#total_without_vat").val(totalWithoutVat.toFixed(2));
    $("#item_vat_total").val(totalVatAmount.toFixed(2));
    $("#item_total_with_vat").val(billTotal.toFixed(2));
}
function calculateDiscountBasisPercentage(discountPercent) {
    let discountAmount =
        (parseFloat($("#item_total").val()) * discountPercent) / 100;
    $("#item_discount_amount").val(discountAmount.toFixed(2));
}

function deleteAlreadyExistItem(goodsRecievedEntryDetailsId, materialsId) {
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
                url:
                    BASE_URL +
                    "/purchase/delete-goods-recieve-note-item/" +
                    goodsRecievedEntryDetailsId +
                    "/" +
                    materialsId, // Adjust URL if needed
                type: "DELETE",
                data: materialsId, // Pass any required data here
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
