let isTableCleared = false;
$(document).ready(function () {
    $("#sales_main_menu").addClass("active open menu-item-animating");
    $("#sales_tax_invoice_return_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var selectElement = $("#branchId");
    $("#clear_table_data_btn").prop("disabled", true);

    // Check if the number of options (excluding the first empty option) is 1
    if (selectElement.find("option").length === 2) {
        // One option + "Select"
        // Set the default value to the only available option
        selectElement
            .val(selectElement.find("option").not(":first").val())
            .trigger("change");
    }

    if ($("#edit_sales_return_id").val()) {
        $("#table-loader").show();
        initialPageLoad($("#edit_sales_return_id").val());
    } else {
        // Get the current date in YYYY-MM-DD format
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0]; // Format the date

        // Set the current date as the value of the input field
        $("#sales_return_date").val(formattedDate);
    }

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

    $("#invoice_number").select2("destroy");
    $("#invoice_number")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#invoice_number").parent(),
            width: "100%",
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
        $("#table-loader").show();
        getInvoiceDetails(e.params.data.id);
        $("#clear_table_data_btn").prop("disabled", false);
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

    $("#sales_tax_invoice_return_save_btn").click(function () {
        $(".error-text").text("");
        $(".payment-checkbox").prop("checked", false);
        $(".amount-input").addClass("d-none").val("");
        $(".reference-input").addClass("d-none").val("");
        $("#invoicePaymentOptionModal").modal("show");
    });

    $(".payment-checkbox").on("change", function () {
        let selectedValue = $(this).val();

        if (selectedValue === "tabby") {
            $(".payment-checkbox[data-value='tamara']").prop("checked", false);
        } else if (selectedValue === "tamara") {
            $(".payment-checkbox[data-value='tabby']").prop("checked", false);
        }
        let totalAmount =
            parseFloat($("#return_item_total_with_vat").val()) || 0;
        let checkedBoxes = $(".payment-checkbox:checked");

        $(".amount-input").addClass("d-none").val("");
        $(".reference-input").addClass("d-none").val("");

        let numChecked = checkedBoxes.length;

        if (numChecked > 0) {
            let amounts = [];
            let baseAmount = totalAmount / numChecked;

            for (let i = 0; i < numChecked - 1; i++) {
                amounts.push(parseFloat(baseAmount.toFixed(2)));
            }

            let sumSoFar = amounts.reduce((a, b) => a + b, 0);
            amounts.push(parseFloat((totalAmount - sumSoFar).toFixed(2)));

            checkedBoxes.each(function (index) {
                let $parent = $(this).closest(".border-bottom");
                let paymentValue = $(this).data("value");

                $parent
                    .find(".amount-input")
                    .removeClass("d-none")
                    .val(amounts[index].toFixed(2));

                if (paymentValue !== "cash") {
                    $parent.find(".reference-input").removeClass("d-none");
                }
            });
        }
    });

    $("#savebtn").click(function (e) {
        let totalAmount =
            parseFloat($("#return_item_total_with_vat").val()) || 0;
        let paymentOptionTotal = calculatePaymentOptionsTotalAmount();
        console.log(
            parseFloat(totalAmount) + "==" + parseFloat(paymentOptionTotal),
        );

        console.log(parseFloat(totalAmount) == parseFloat(paymentOptionTotal));

        const isConditionMet =
            parseFloat(totalAmount) == parseFloat(paymentOptionTotal);
        let isReferenceFilled = true;
        let checkedBoxes = $(".payment-checkbox:checked");

        checkedBoxes.each(function () {
            let $parent = $(this).closest(".border-bottom");
            let paymentValue = $(this).data("value");

            if (paymentValue === "cash") return;

            let referenceVal = $parent.find(".reference-input").val().trim();
            if (referenceVal === "") {
                isReferenceFilled = false;
                $parent.find(".reference-input").addClass("is-invalid");
            } else {
                $parent.find(".reference-input").removeClass("is-invalid");
            }
        });

        if (!isReferenceFilled) {
            Swal.fire({
                icon: "error",
                text: "Please fill the reference input for each selected payment method.",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
            return;
        }

        // if (amountToDistribute1 >= 0) {
        if (isConditionMet) {
            // $("#saveType").val("save");
            $("#invoicePaymentOptionModal").modal("hide");
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
                        updateInvoiceReturn($(this).attr("data-id"));
                    } else {
                        saveInvoiceReturn($(this).attr("id"));
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

    $("#sales_tax_invoice_return_save_btn1").click(function () {
        let itemCount = $("#sales_tax_invoice_return_table_tbody tr").length;
        if (itemCount > 0) {
            $("#page-loader").show();
            // Serialize data from all forms and convert it to a proper format
            var salesTaxInvoiceReturnFormData = $(
                "#sales_tax_invoice_return_form",
            ).serializeArray();
            // AJAX request
            $.ajax({
                url: BASE_URL + "/sales/sales-tax-invoice-return",
                type: "POST",
                data: salesTaxInvoiceReturnFormData, // Properly formatted form data
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
                                    salesTaxInvoiceReturnThermalPrintUrl +
                                    "?salesTaxInvoiceReturnId=" +
                                    encodeURIComponent(
                                        response.data.salesReturnId,
                                    );
                                window.open(url, "_blank"); // Open URL in a new tab
                                location.reload();
                            } else if (
                                result.dismiss === Swal.DismissReason.cancel
                            ) {
                                // Handle A4 PDF download
                                const url =
                                    salesTaxInvoiceReturnA4PrintUrl +
                                    "?salesTaxInvoiceReturnId=" +
                                    encodeURIComponent(
                                        response.data.salesReturnId,
                                    );
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
                                key.startsWith("item_discount_percentage.") ||
                                key.startsWith("item_amount_after_discount.") ||
                                key.startsWith("item_vat_percentage.") ||
                                key.startsWith("item_vat_amount.") ||
                                key.startsWith("item_net_amount.") ||
                                key.startsWith("damage_or_usable.") ||
                                key.startsWith("item_id.")
                            ) {
                                var fieldParts = key.split(".");
                                var fieldIndex = fieldParts[1];
                                var fieldName = fieldParts[0];

                                if (fieldName === "item_id") {
                                    fieldName = "item_quantity";
                                }

                                var targetRow = $(
                                    "#sales_tax_invoice_return_table_tbody tr",
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

   $("#sales_tax_invoice_return_update_btn").click(function () {
    $(".error-text").text("");
    $(".payment-checkbox").prop("checked", false);
    $(".amount-input").addClass("d-none").val("");
    $(".reference-input").addClass("d-none").val("");
    $("#invoicePaymentOptionModal").modal("show");

    $.ajax({
        url: BASE_URL + "/sales/edit-sales-tax-invoice-return/" + $("#edit_sales_return_id").val(),
        type: "GET",
        success: function (response) {
            if (response.status) {
                $("#savebtn").attr("data-id", response.data.salesReturnId);

                const payments = response.data.service_order_payments;

                $(".payment-checkbox").prop("checked", false);
                $(".amount-input").addClass("d-none").val("");
                $(".reference-input").addClass("d-none").val("");

                if (payments.length > 0) {
                    payments.forEach(function (payment) {
                        let checkbox = $("#paymentMethod" + payment.paymentType_generalSettingsId);
                        if (checkbox.length) {
                            checkbox.prop("checked", true);

                            let $parent = checkbox.closest(".border-bottom");
                            let paymentValue = checkbox.data("value");

                            $parent.find(".amount-input")
                                .removeClass("d-none")
                                .val(payment.amount);

                            // only show reference if NOT cash
                            if (paymentValue !== "cash") {
                                $parent.find(".reference-input")
                                    .removeClass("d-none")
                                    .val(payment.referenceNumber);
                            }
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

    $("#sales_tax_invoice_return_update_btn1").click(function () {
        let itemCount = $("#sales_tax_invoice_return_table_tbody tr").length;
        if (itemCount > 0) {
            $("#page-loader").show();
            var salesTaxInvoiceReturnFormData = $(
                "#sales_tax_invoice_return_form",
            ).serializeArray();
            // AJAX request
            $.ajax({
                url:
                    BASE_URL +
                    "/sales/update-sales-tax-invoice-return/" +
                    $("#edit_sales_return_id").val(),
                type: "PUT",
                data: salesTaxInvoiceReturnFormData, // Properly formatted form data
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
                                key.startsWith("item_discount_percentage.") ||
                                key.startsWith("item_amount_after_discount.") ||
                                key.startsWith("item_vat_percentage.") ||
                                key.startsWith("item_vat_amount.") ||
                                key.startsWith("item_net_amount.") ||
                                key.startsWith("damage_or_usable.") ||
                                key.startsWith("item_id.")
                            ) {
                                var fieldParts = key.split(".");
                                var fieldIndex = fieldParts[1];
                                var fieldName = fieldParts[0];

                                if (fieldName === "item_id") {
                                    fieldName = "item_quantity";
                                }

                                var targetRow = $(
                                    "#sales_tax_invoice_return_table_tbody tr",
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
        // Serialize data from all forms and convert it to a proper format
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
                    var rowIndex = $(
                        "#sales_tax_invoice_return_table_tbody tr",
                    ).length; // Calculate index
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
                                    <input type="hidden" class="service-id form-control" name="sales_tax_invoice_return_item_id[${rowIndex}]" value="0">
                                </td>
                                
                                <td class="item-quantity-td" style="width: 110px;">
                                    <input type="number" class="form-control item-quantity" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="1">
                                    
                                </td>
                                <td class="item-unit-td" style="width: 10%;">
                                    <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${options}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="item_unit_price[${rowIndex}]" value="0" readonly>
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="0" readonly>
                                </td>
                                <td class="item-discount-percentage-td">
                                    <input type="text" class="form-control item-discount-percentage" placeholder="%" name="item_discount_percentage[${rowIndex}]" value="0">
                                </td>
                                <td class="item-amount-after-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount_after_discount[${rowIndex}]" value="0" readonly>
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[${rowIndex}]" value="0">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Vat Amount" name="item_vat_amount[${rowIndex}]" value="0" readonly>
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="0" readonly>
                                </td>
                                <td class="item-damaged-or-usable-td" style="width: 10%;" >
                                    <select id="damage_or_usable_${rowIndex}" name="damage_or_usable[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg damage-or-usable" data-allow-clear="true">

                                            <option value="">Select</option>
                                            <option value="D">Damaged</option>
                                            <option value="U">Usable</option>
                                        </select></td>
                                
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row" data-id="" data-type="">X</button>
                                </td>
                            </tr>`;

                    $("#sales_tax_invoice_return_table_tbody").append(
                        purchaseOrderHtml,
                    );

                    $(".item-unit").select2({
                        placeholder: "Selection", // Match the placeholder in the select
                        allowClear: true,
                    });
                    $(`#damage_or_usable_${rowIndex}`).select2({
                        placeholder: "Selection", // Match the placeholder in the select
                        allowClear: true,
                    });

                    // updateSlColumn();
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

    $("#clear_table_data_btn").click(function () {
        if (!isTableCleared) {
            // Clear the table rows
            $("#sales_tax_invoice_return_table_tbody").empty();

            // Reset totals
            $("#return_item_total").val("");
            $("#return_item_discount_amount").val("");
            $("#return_item_total_without_vat").val("");
            $("#return_item_vat_total").val("");
            $("#return_item_total_with_vat").val("");

            // Reset hidden counter field
            $("#item_td_count").val(0);

            // Optional: Clear vendor and branch fields if needed
            // $("#vendor_name").val('').trigger('change');
            // $("#branchId").val('').trigger('change');

            console.log("Purchase return table cleared!");
            $(this).html(
                '<i class="tf-icons ti ti-restore ti-xs me-2"></i>Recover Table Data',
            );

            isTableCleared = true;
            // $("#clear_table_data_btn").prop("disabled", true);
        } else {
            $("#invoice_number").val();

            //   $("#purchase_number").on("select2:select", function (e) {
            // getPatientById(e.params.data.id);
            // let selectedId = e.params.data.id;
            $("#table-loader").show();
            getInvoiceDetails($("#invoice_number").val());
            // });
            $(this).html(
                '<i class="tf-icons ti ti-trash-x ti-xs me-2"></i>Clear Table Data',
            );

            isTableCleared = false;
        }
    });
});

function getInvoiceDetails(invoiceId) {
    $.ajax({
        // url: BASE_URL + "/get-patient-by-id",
        url: BASE_URL + "/sales/edit-invoice/" + invoiceId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                // console.log(response.data.vendorId);
                $("#branchId").val(response.data.clinicId).trigger("change");
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
                            '"]',
                    ).length
                ) {
                    // Append the new option
                    $("#customer_code").append(
                        $("<option>", {
                            value: response.data.customer.regularCustomerId, // Set the value as the vendorId
                            text: response.data.customer.customerNo, // Set the text as the vendor name
                        }),
                    );
                }
                $("#customer_code")
                    .val(response.data.customer.regularCustomerId)
                    .trigger("change");
                $("#customer_name").val(response.data.customer.customerName);
                // Convert to yyyy-mm-dd format
                // let formattedDate = new Date(response.data.invoiceDate).toISOString().split('T')[0];
                // Assuming response.data.invoiceDate is the ISO 8601 string
                // let invoiceDate = response.data.invoiceDate;

                // // Convert to yyyy-mm-dd format
                // let formattedDate = invoiceDate.split('T')[0];
                // console.log(formattedDate);
                // // Set the value in the date picker
                // $('#invoice_date').val(formattedDate);

                // Set the value in the date picker
                $("#invoice_date").val(response.data.invoiceDate.split("T")[0]);
                $("#currency").val(response.data.currencyId).trigger("change");
                $("#ex_rate").val(response.data.exRate);
                $("#return_item_total").val(response.data.totalAmount);
                $("#return_item_discount_amount").val(
                    response.data.discountAmount,
                );
                $("#return_item_total_without_vat").val(
                    response.data.totalAmountAfterDiscount,
                );
                $("#return_item_vat_total").val(response.data.vatAmount);
                $("#return_item_total_with_vat").val(
                    response.data.totalAmountWithVat,
                );
                purchasedItemsTotal = pupulateInvoiceItems(
                    response.data.invoice_items,
                );
            }
            $("#table-loader").hide();
        },
    });
}

function pupulateInvoiceItems(invoiceItems) {
    $("#sales_tax_invoice_return_table_tbody").empty();

    invoiceItems.forEach((invoiceItem, index) => {
        let unitoptions = "";
        // if (invoiceItem.invoice_items_details.units) {
        //     invoiceItem.invoice_items_details.units.forEach(function (unit) {
        //         console.log(unit);
        //         unitoptions += `<option value="${unit.itemUnitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
        //     });
        // }

        if (invoiceItem.invoice_items_details.all_units) {
            invoiceItem.invoice_items_details.all_units.forEach(
                function (unit) {
                    unitoptions += `<option value="${unit.itemUnitId}" data-unit-price="${invoiceItem.unitPrice}">${unit.unit.unit_name_en}</option>`;
                },
            );
        }
        console.log(invoiceItem);
        console.log(unitoptions);
        var rowIndex = $("#sales_tax_invoice_return_table_tbody tr").length; // Calculate index
        purchaseOrderHtml = `<tr style="Zoom: 90%;">
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
                                
                                <td class="item-quantity-td" style="width: 110px;">
                                    <input type="number" class="form-control item-quantity" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${
                                        invoiceItem.quantity
                                    }" >
                                    
                                </td>
                                <td class="item-unit-td" style="width: 10%;">
                                    <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="item_unit_price[${rowIndex}]" value="${
                                        invoiceItem.unitPrice
                                    }" readonly>
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="${
                                        invoiceItem.amount
                                    }" readonly>
                                </td>
                                <td class="item-discount-percentage-td">
                                    <input type="text" class="form-control item-discount-percentage" placeholder="%" name="item_discount_percentage[${rowIndex}]" value="${
                                        invoiceItem.discountPercent
                                    }">
                                </td>
                                <td class="item-amount-after-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount_after_discount[${rowIndex}]" value="${
                                        invoiceItem.amountAfterDiscount
                                    }" readonly>
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[${rowIndex}]" value="${
                                        invoiceItem.vatPercent
                                    }">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Vat Amount" name="item_vat_amount[${rowIndex}]" value="${
                                        invoiceItem.vatAmount
                                    }" readonly>
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="${
                                        invoiceItem.amountWithVat
                                    }" readonly>
                                </td>
                                <td class="item-damaged-or-usable-td">
                                    <select id="damage_or_usable_${rowIndex}" name="damage_or_usable[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg damage-or-usable" data-allow-clear="true">

                                            <option value="">Select</option>
                                            <option value="D">Damaged</option>
                                            <option value="U">Usable</option>
                                        </select></td>
                                
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

        $("#sales_tax_invoice_return_table_tbody").append(purchaseOrderHtml);

        $(`#item_unit_${rowIndex}`)
            .val(invoiceItem.itemUnitId)
            .trigger("change");

        $(".item-unit").select2({
            placeholder: "Selection", // Match the placeholder in the select
            allowClear: true,
        });

        $(".damage-or-usable").select2({
            placeholder: "Selection", // Match the placeholder in the select
            allowClear: true,
        });
        console.log(invoiceItem.itemUnitId);
    });

    // $("#item_td_count").val(indexCount);
}
flatpickr("#invoice_date", {
    dateFormat: "Y-m-d",
    allowInput: true,
    placeholder: "YYYY-MM-DD",
});
flatpickr("#sales_return_date", {
    dateFormat: "Y-m-d",
    allowInput: true,
    placeholder: "YYYY-MM-DD",
});

function initialPageLoad(salesReturnId) {
    $.ajax({
        url: BASE_URL + "/sales/edit-sales-tax-invoice-return/" + salesReturnId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                console.log(response.data.currency_id);
                $("#branchId").val(response.data.clinicId).trigger("change");
                $("#invoice_date").val(response.data.invoiceDate);
                $("#sales_tax_return_no").val(response.data.salesReturnNo);
                $("#sales_return_date").val(response.data.returnDate);
                $("#description").val(response.data.description);
                $("#credit_note_no").val(response.data.invoiceCreditNoteNo);
                // $("#pre_invoice_no").val(response.data.invoiceNo);
                $("#quotation_no").val(response.data.quotationNo);
                $("#credit_note_date").val(response.data.invoiceCreditNoteDate);
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
                            '"]',
                    ).length
                ) {
                    // Append the new option
                    $("#customer_code").append(
                        $("<option>", {
                            value: response.data.customer.regularCustomerId, // Set the value as the vendorId
                            text: response.data.customer.customerNo, // Set the text as the vendor name
                        }),
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
                            '"]',
                    ).length
                ) {
                    // Append the new option
                    $("#invoice_number").append(
                        $("<option>", {
                            value: response.data.invoice.invoiceId, // Set the value as the vendorId
                            text: response.data.invoice.invoiceNo, // Set the text as the vendor name
                        }),
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

                purchasedItemsTotal = pupulateInvoiceReturnItems(
                    response.data.sales_tax_invoice_return_items,
                );
                $("#return_item_total").val(response.data.returnTotalAmount);
                $("#return_item_discount_amount").val(
                    response.data.returnDiscountAmount,
                );
                $("#return_item_total_without_vat").val(
                    response.data.returnTotalAmountAfterDiscount,
                );
                $("#return_item_vat_total").val(response.data.returnVatAmount);
                $("#return_item_total_with_vat").val(
                    response.data.returnTotalAmountWithVat,
                );
                // $("#item_total_with_vat").val(
                //     response.data.netAmountWithExRate
                // );

                // $('#purchase_table_tr_count').val($('#purchase_table_tbody tr').length);
            }
            $("#table-loader").hide();
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
}

function pupulateInvoiceReturnItems(salesTaxInvoiceReturnItems) {
    $("#sales_tax_invoice_return_table_tbody").empty();

    salesTaxInvoiceReturnItems.forEach((salesTaxInvoiceReturnItem, index) => {
        let unitoptions = "<option value='' data-unit-price=''>Select</option>";
        if (salesTaxInvoiceReturnItem.invoice_return_items_details.units) {
            salesTaxInvoiceReturnItem.invoice_return_items_details.units.forEach(
                function (unit) {
                    unitoptions += `<option value="${unit.itemUnitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
                },
            );
        }
        console.log(salesTaxInvoiceReturnItem);
        var rowIndex = $("#sales_tax_invoice_return_table_tbody tr").length; // Calculate index
        purchaseOrderHtml = `<tr>
                                <td class="item-sl-td">
                                ${rowIndex + 1}
                                    
                                </td>
                                <td class="item-code-td">
                                    ${
                                        salesTaxInvoiceReturnItem
                                            .invoice_return_items_details
                                            .itemCode
                                    }
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="form-control" name="item_id[${rowIndex}]" value="${
                                        salesTaxInvoiceReturnItem.itemMasterId
                                    }">
                                    <input type="hidden" class="form-control" name="sl_no[${rowIndex}]" value="${
                                        rowIndex + 1
                                    }">
                                    ${
                                        salesTaxInvoiceReturnItem
                                            .invoice_return_items_details
                                            .itemName_en
                                    }
                                    <input type="hidden" class="service-id form-control" name="sales_tax_invoice_return_item_id[${rowIndex}]" value="${
                                        salesTaxInvoiceReturnItem.salesReturnItemId
                                    }">

                                </td>
                                
                                <td class="item-quantity-td" style="width: 100px;">
                                    <input type="number" class="form-control item-quantity" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${
                                        salesTaxInvoiceReturnItem.quantity
                                    }">
                                    
                                </td>
                                <td class="item-unit-td" style="width: 10%;">
                                    <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="item_unit_price[${rowIndex}]" value="${
                                        salesTaxInvoiceReturnItem.unitPrice
                                    }" readonly>
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="${
                                        salesTaxInvoiceReturnItem.amount
                                    }" readonly>
                                </td>
                                <td class="item-discount-percentage-td">
                                    <input type="text" class="form-control item-discount-percentage" placeholder="%" name="item_discount_percentage[${rowIndex}]" value="${
                                        salesTaxInvoiceReturnItem.discountPercent
                                    }">
                                </td>
                                <td class="item-amount-after-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount_after_discount[${rowIndex}]" value="${
                                        salesTaxInvoiceReturnItem.amountAfterDiscount
                                    }" readonly>
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[${rowIndex}]" value="${
                                        salesTaxInvoiceReturnItem.vatPercent
                                    }">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Vat Amount" name="item_vat_amount[${rowIndex}]" value="${
                                        salesTaxInvoiceReturnItem.vatAmount
                                    }" readonly>
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="${
                                        salesTaxInvoiceReturnItem.amountWithVat
                                    }" readonly>
                                </td>
                                <td class="item-damaged-or-usable-td" style="width: 10%;" >
                                    <select id="damage_or_usable_${rowIndex}" name="damage_or_usable[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg damage-or-usable" data-allow-clear="true">

                                            <option value="">Select</option>
                                            <option value="D">Damaged</option>
                                            <option value="U">Usable</option>
                                        </select></td>
                                
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row" data-id="${
                                        salesTaxInvoiceReturnItem.salesReturnItemId
                                    }" data-type="${
                                        salesTaxInvoiceReturnItem.itemMasterId
                                    }">X</button>
                                </td>
                            </tr>`;

        $("#sales_tax_invoice_return_table_tbody").append(purchaseOrderHtml);

        $(`#item_unit_${rowIndex}`)
            .val(salesTaxInvoiceReturnItem.itemUnitId)
            .trigger("change");
        $(`#damage_or_usable_${rowIndex}`)
            .val(salesTaxInvoiceReturnItem.damagedOrUsable)
            .trigger("change");

        $(".item-unit").select2({
            placeholder: "Selection", // Match the placeholder in the select
            allowClear: true,
        });

        $(`#damage_or_usable_${rowIndex}`).select2({
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
    },
);

function updateRowCalculations(row) {
    // Get the unit price and quantity
    const unitPrice =
        parseFloat(row.find('input[name^="item_unit_price"]').val()) || 0;
    const quantity =
        parseFloat(row.find('input[name^="item_quantity"]').val()) || 0;

    // Calculate item amount before discount
    const itemAmount = unitPrice * quantity;
    row.find('input[name^="item_amount"]').val(itemAmount.toFixed(2));

    // Get the discount percentage and calculate discount amount
    const discountPercentage =
        parseFloat(row.find('input[name^="item_discount_percentage"]').val()) ||
        0;
    const discountAmount = (itemAmount * discountPercentage) / 100;

    // Calculate item amount after discount
    const discountedAmount = itemAmount - discountAmount;
    row.find('input[name^="item_amount_after_discount"]').val(
        discountedAmount.toFixed(2),
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

    let returnTotalItemAmount = 0;
    let returnTotalVatAmount = 0;
    let returnTotalNetAmount = 0;
    let returnTotalDiscountAmount = 0;
    let returnTotalWithoutVat = 0;

    // Loop through each row to accumulate totals
    $("#sales_tax_invoice_return_table_tbody tr").each(function () {
        const row = $(this);

        // Extract values from the current row
        const itemAmount =
            parseFloat(row.find('input[name^="item_amount"]').val()) || 0;
        const vatAmount =
            parseFloat(row.find('input[name^="item_vat_amount"]').val()) || 0;
        const netAmount =
            parseFloat(row.find('input[name^="item_net_amount"]').val()) || 0;
        const discountPercentage =
            parseFloat(
                row.find('input[name^="item_discount_percentage"]').val(),
            ) || 0;

        // Calculate discount amount for this row
        const discountValue = (itemAmount * discountPercentage) / 100;

        // Calculate total without VAT for this row
        const withoutVat = itemAmount - discountValue;

        // Accumulate totals for main table
        totalItemAmount += itemAmount;
        totalVatAmount += vatAmount;
        totalNetAmount += netAmount;
        totalDiscountAmount += discountValue;
        totalWithoutVat += withoutVat;

        // Accumulate totals for the return table
        returnTotalItemAmount += itemAmount;
        returnTotalVatAmount += vatAmount;
        returnTotalNetAmount += netAmount;
        returnTotalDiscountAmount += discountValue;
        returnTotalWithoutVat += withoutVat;
    });

    // Update the total fields in the main form
    // $("#item_total").val(totalItemAmount.toFixed(2));
    // $("#item_discount_amount").val(totalDiscountAmount.toFixed(2));
    // $("#item_total_without_vat").val(totalWithoutVat.toFixed(2));
    // $("#item_vat_total").val(totalVatAmount.toFixed(2));
    // $("#item_total_with_vat").val(totalNetAmount.toFixed(2));

    // Update the total fields in the return section
    $("#return_item_total").val(returnTotalItemAmount.toFixed(2));
    $("#return_item_discount_amount").val(returnTotalDiscountAmount.toFixed(2));
    $("#return_item_total_without_vat").val(returnTotalWithoutVat.toFixed(2));
    $("#return_item_vat_total").val(returnTotalVatAmount.toFixed(2));
    $("#return_item_total_with_vat").val(returnTotalNetAmount.toFixed(2));
}

// Remove row and recalculate totals
$(document).on("click", ".remove-row", function () {
    $(this).closest("tr").remove();
    var salesReturnItemId = $(this).data("id");
    var itemMasterId = $(this).data("type");
    if (salesReturnItemId > 0 && itemMasterId > 0) {
        deleteAlreadyExistItem(salesReturnItemId, itemMasterId);
    }
    calculateTotals();
});

$(document).on("change keyup", "#return_item_discount_amount", function () {
    let discountValue = $(this).val();
    // Initialize totals
    let totalItemAmount = 0;
    let totalVatAmount = 0;
    let totalNetAmount = 0;
    let totalDiscountAmount = 0;
    let totalWithoutVat = 0;

    // Loop through each row to accumulate totals
    $("#sales_tax_invoice_return_table_tbody tr").each(function () {
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
                row.find('input[name^="item_discount_percentage"]').val(),
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
    $("#return_item_total").val(totalItemAmount.toFixed(2));
    // $("#item_discount_amount").val(totalDiscountAmount.toFixed(2));
    $("#return_item_total_without_vat").val(tDiscountedValue.toFixed(2));
    $("#return_item_vat_total").val(totalVatAmount.toFixed(2));
    $("#return_item_total_with_vat").val(nDiscountedValue.toFixed(2));
});

function deleteAlreadyExistItem(salesReturnItemId, itemMasterId) {
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
                    "/sales/delete-sales-tax-invoice-return-item/" +
                    salesReturnItemId +
                    "/" +
                    itemMasterId, // Adjust URL if needed
                type: "DELETE",
                data: itemMasterId, // Pass any required data here
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

// Prevent typing minus (-) or scientific notation (e)
$(document).on(
    "keydown",
    ".item-quantity, .manual-item-quantity",
    function (e) {
        if (e.key === "-" || e.key === "e") {
            e.preventDefault();
        }
    },
);

// Ensure value stays 0 or above
$(document).on("input", ".item-quantity, .manual-item-quantity", function () {
    let val = parseFloat($(this).val());
    if (isNaN(val) || val < 0) {
        $(this).val(0); // reset to 0 if invalid or negative
    }
});

// Prevent typing negative sign (-) or 'e' (for scientific notation)
$(document).on(
    "keydown",
    ".item-discount-percentage, .manual-item-discount-percentage",
    function (e) {
        if (e.key === "-" || e.key === "e") {
            e.preventDefault();
        }
    },
);

// Ensure value is between 0 and 100 and remove leading zeros
$(document).on(
    "input",
    ".item-discount-percentage, .manual-item-discount-percentage",
    function () {
        let val = $(this).val();

        // Remove leading zeros (except for "0" or "0.x")
        if (val.length > 1 && val.startsWith("0") && !val.startsWith("0.")) {
            val = val.replace(/^0+/, "");
        }

        let num = parseFloat(val);

        if (isNaN(num) || num < 0) {
            num = 0;
        } else if (num > 100) {
            num = 100;
        }

        $(this).val(num);
    },
);

function calculatePaymentOptionsTotalAmount() {
    let sum = 0;
    $(".amount-input:not(.d-none)").each(function () {
        sum += parseFloat($(this).val()) || 0;
    });

    // Display the total sum somewhere (modify this as needed)
    return sum.toFixed(2);
}

function saveInvoiceReturn(params) {
    let itemCount = $("#sales_tax_invoice_return_table_tbody tr").length;
    $("#page-loader").show();
    if (itemCount > 0) {
        // Serialize data from all forms and convert it to a proper format
        var salesTaxInvoiceReturnFormData = $(
            "#sales_tax_invoice_return_form",
        ).serialize();
        var paymentFormData = $("#paymentForm").serialize();
        var combinedData =
            salesTaxInvoiceReturnFormData + "&" + paymentFormData;
        // AJAX request
        $.ajax({
            url: BASE_URL + "/sales/sales-tax-invoice-return",
            type: "POST",
            data: combinedData, // Properly formatted form data
            success: function (response) {
                $("#page-loader").hide();
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
                                salesTaxInvoiceReturnThermalPrintUrl +
                                "?salesTaxInvoiceReturnId=" +
                                encodeURIComponent(response.data.salesReturnId);
                            window.open(url, "_blank"); // Open URL in a new tab
                            location.reload();
                        } else if (
                            result.dismiss === Swal.DismissReason.cancel
                        ) {
                            // Handle A4 PDF download
                            const url =
                                salesTaxInvoiceReturnA4PrintUrl +
                                "?salesTaxInvoiceReturnId=" +
                                encodeURIComponent(response.data.salesReturnId);
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
                            key.startsWith("item_discount_percentage.") ||
                            key.startsWith("item_amount_after_discount.") ||
                            key.startsWith("item_vat_percentage.") ||
                            key.startsWith("item_vat_amount.") ||
                            key.startsWith("item_net_amount.") ||
                            key.startsWith("damage_or_usable.") ||
                            key.startsWith("item_id.")
                        ) {
                            var fieldParts = key.split(".");
                            var fieldIndex = fieldParts[1];
                            var fieldName = fieldParts[0];

                            if (fieldName === "item_id") {
                                fieldName = "item_quantity";
                            }

                            var targetRow = $(
                                "#sales_tax_invoice_return_table_tbody tr",
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
                                        targetCell.next(".select2-container");
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
}

function updateInvoiceReturn(invoiceReturnId) {
    let itemCount = $("#sales_tax_invoice_return_table_tbody tr").length;
    if (itemCount > 0) {
        $("#page-loader").show();
        // Serialize data from all forms and convert it to a proper format
        var salesTaxInvoiceReturnFormData = $(
            "#sales_tax_invoice_return_form",
        ).serialize();
        var paymentFormData = $("#paymentForm").serialize();
        var combinedData =
            salesTaxInvoiceReturnFormData + "&" + paymentFormData;
        // AJAX request
        $.ajax({
            url:
                BASE_URL +
                "/sales/update-sales-tax-invoice-return/" +
                invoiceReturnId,
            type: "PUT",
            data: combinedData, // Properly formatted form data
            success: function (response) {
                $("#page-loader").hide();
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
                                encodeURIComponent(response.data.salesReturnId);
                            window.open(url, "_blank"); // Open URL in a new tab
                            location.reload();
                        } else if (
                            result.dismiss === Swal.DismissReason.cancel
                        ) {
                            // Handle A4 PDF download
                            const url =
                                invoiceA4PrintUrl +
                                "?invoiceId=" +
                                encodeURIComponent(response.data.salesReturnId);
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
                            key.startsWith("item_discount_percentage.") ||
                            key.startsWith("item_amount_after_discount.") ||
                            key.startsWith("item_vat_percentage.") ||
                            key.startsWith("item_vat_amount.") ||
                            key.startsWith("item_net_amount.") ||
                            key.startsWith("damage_or_usable.") ||
                            key.startsWith("item_id.")
                        ) {
                            var fieldParts = key.split(".");
                            var fieldIndex = fieldParts[1];
                            var fieldName = fieldParts[0];

                            if (fieldName === "item_id") {
                                fieldName = "item_quantity";
                            }

                            var targetRow = $(
                                "#sales_tax_invoice_return_table_tbody tr",
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
                                        targetCell.next(".select2-container");
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
}
