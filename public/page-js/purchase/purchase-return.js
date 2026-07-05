let isTableCleared = false;
$(document).ready(function () {
    $("#purchase_main_menu").addClass("active open menu-item-animating");
    $("#purchase_return_sub_menu").addClass("active");

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

    $("#flatDiscount").prop("checked", true);

    // Initially show Discount, hide Dis(%)

    // When checkbox changes
    $('input[name="discountType"]').on("change", function () {
        // Allow only one to be selected
        $('input[name="discountType"]').not(this).prop("checked", false);

        // Show/hide relevant columns
        toggleDiscountColumns();
    });

    // toggleDiscountColumns();

    if ($("#edit_purchase_retrun_id").val()) {
        $("#table-loader").show();
        initialPageLoad($("#edit_purchase_retrun_id").val());
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

    flatpickr("#return_date", {
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

    const initialBranchId = $("#branchId").val();
    fetchAndSetClinicAddress(initialBranchId);

    $(document).on("change", "#branchId", function () {
        const selectedClinicId = $(this).val();
        fetchAndSetClinicAddress(selectedClinicId);
    });

    function fetchAndSetClinicAddress(branchId) {
        if (branchId) {
            $.ajax({
                url:
                    BASE_URL + "/purchase/get-address-by-branch-id/" + branchId,
                type: "GET",
                success: function (response) {
                    if (response.status) {
                        const clinic = response.data;

                        if (clinic) {
                            $("#clinic_address").html(
                                clinic.clinicName_en +
                                    ",<br>" +
                                    clinic.address_en
                            );
                            $("#clinic_phone").text(clinic.phone);
                        } else {
                            $("#clinic_address").html("");
                            $("#clinic_phone").text("");
                        }
                    }
                },
                error: function (xhr, status, error) {
                    console.error("AJAX Error (address): ", status, error);
                },
            });
        } else {
            $("#clinic_address").html("");
            $("#clinic_phone").text("");
        }
    }

$("#purchase_return_save_btn").click(function () {
    let itemCount = $("#purchase_return_table_tbody tr").length;
    if (itemCount > 0) {
        Swal.fire({
            title: "Enter Return Reason",
            html:
                '<textarea id="swal_return_reason" class="form-control" rows="4" placeholder="Enter reason for return..."></textarea>' +
                '<span class="text-danger error-text" id="swal_return_reason_error" style="display:none; float:left; margin-top:5px;">The return reason field is required.</span>',
            showCancelButton: false,
            confirmButtonText: "OK",
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn btn-success waves-effect waves-light",
            },
            preConfirm: () => {
                const value = $("#swal_return_reason").val();
                if (!value || !value.trim()) {
                    $("#swal_return_reason_error").show();
                    return false;
                }
                return value;
            }
        }).then(function (result) {
            if (result.isConfirmed) {
                submitPurchaseReturn(result.value);
            }
        });

        $(document).off("input", "#swal_return_reason").on("input", "#swal_return_reason", function () {
            if ($(this).val().trim()) {
                $("#swal_return_reason_error").hide();
            }
        });
    } else {
        Swal.fire({
            icon: "error",
            text: "You must have items in table to save this page.",
            customClass: {
                confirmButton: "btn btn-danger waves-effect waves-light",
            },
        }).then(function () {
            location.reload();
        });
    }
});

function submitPurchaseReturn(returnReason) {
    $("#page-loader").show();
    var purchaseReturnFormData = $("#purchase_return_form").serializeArray();
    purchaseReturnFormData.push({ name: "return_reason", value: returnReason });

    $.ajax({
        url: BASE_URL + "/purchase/purchase-return",
        type: "POST",
        data: purchaseReturnFormData,
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
                        confirmButton: "btn btn-success waves-effect waves-light",
                        cancelButton: "btn btn-primary waves-effect waves-light",
                    },
                    buttonsStyling: false,
                }).then(function (result) {
                    if (result.isConfirmed) {
                        const url = purchaseReturnThermalPrintUrl +
                            "?purchaseReturnId=" +
                            encodeURIComponent(response.data.purchaseReturnId);
                        window.open(url, "_blank");
                        location.reload();
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        const url = purchaseReturnA4PrintUrl +
                            "?purchaseReturnId=" +
                            encodeURIComponent(response.data.purchaseReturnId);
                        window.open(url, "_blank");
                        location.reload();
                    } else {
                        location.reload();
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    text: response.message,
                    customClass: {
                        confirmButton: "btn btn-danger waves-effect waves-light",
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
                $.each(errors, function (key, value) {
                    if (
                        key.startsWith("item_quantity.") ||
                        key.startsWith("item_unit.") ||
                        key.startsWith("item_unit_price.") ||
                        key.startsWith("item_amount.") ||
                        key.startsWith("item_vat_percentage.") ||
                        key.startsWith("item_vat_amount.") ||
                        key.startsWith("item_net_amount.") ||
                        key.startsWith("item_id.")
                    ) {
                        var fieldParts = key.split(".");
                        var fieldIndex = fieldParts[1];
                        var fieldName = fieldParts[0];

                        if (fieldName === "item_id") {
                            fieldName = "item_quantity";
                            $("#invoicePaymentOptionModal").modal("hide");
                        }

                        var targetRow = $("#purchase_return_table_tbody tr").eq(fieldIndex);
                        var targetCell = targetRow.find(
                            `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`
                        );

                        if (targetCell.length > 0) {
                            if (targetCell.is("select")) {
                                var select2Container = targetCell.next(".select2-container");
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
                        $("." + key + "_error").text(value[0]);
                    }
                });
            } else {
                console.error("Error fetching edit data:", xhr.message);
                var errorMessage =
                    xhr.responseJSON && xhr.responseJSON.message
                        ? xhr.responseJSON.message
                        : "An unexpected error occurred. Please try again.";
                Swal.fire({
                    icon: "error",
                    title: "Access denied",
                    text: errorMessage,
                    customClass: {
                        confirmButton: "btn btn-danger waves-effect waves-light",
                    },
                });
            }
        },
    });
}

    $("#purchase_return_update_btn").click(function () {
        $("#page-loader").show();
        // Extract Quill editor content
        var purchaseReturnFormData = $(
            "#purchase_return_form"
        ).serializeArray();

        // AJAX request
        $.ajax({
            url:
                BASE_URL +
                "/purchase/update-purchase-return/" +
                $("#edit_purchase_retrun_id").val(),
            type: "PUT",
            data: purchaseReturnFormData, // Properly formatted form data
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
                            key.startsWith("item_vat_percentage.") ||
                            key.startsWith("item_vat_amount.") ||
                            key.startsWith("item_net_amount.")
                        ) {
                            var fieldParts = key.split(".");
                            var fieldIndex = fieldParts[1];
                            var fieldName = fieldParts[0];
                            var targetRow = $(
                                "#purchase_return_table_tbody tr"
                            ).eq(fieldIndex);
                            // Adjust selection for input or select fields
                            var targetCell = targetRow.find(
                                `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`
                            ); // Match both input and select elements

                            // Append error message below the field
                            if (targetCell.length > 0) {
                                // Check if the target is a select box
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

    // $("#po_no").select2({
    //     placeholder: "Search Purchase Order",
    //     allowClear: true,
    //     minimumInputLength: 1,
    //     ajax: {
    //         url: BASE_URL + "/purchase/search-purchase-order-by-query",
    //         // url: BASE_URL + "/search-patient-by-query",

    //         dataType: "json",
    //         delay: 250,
    //         data: function (params) {
    //             return {
    //                 purchaseOrder: params.term,
    //             };
    //         },
    //         processResults: function (data) {
    //             // console.log(data.data);

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
    //     let selectedId = e.params.data.id;
    //     getPurchaseOrderDetails(selectedId);
    // });

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

$("#purchase_number").on("select2:select", function (e) {
    let selectedId = e.params.data.id;
    $("#loader-overlay").show();
    getPurchaseNumberDetails(selectedId);
    $("#clear_table_data_btn").prop("disabled", false);
    enableItemNameWithPurchaseItems(selectedId);  
});

$("#purchase_number").on("select2:clear", function () {
    $("#loader-overlay").show();
    disableItemName();
    $("#purchase_return_table_tbody").empty();
    $("#item_total").val("");
    $("#item_total_without_vat").val("");
    $("#item_vat_total").val("");
    $("#item_total_with_vat").val("");
    $("#item_discount_amount").val("");
    $("#item_td_count").val(0);
    $("#clear_table_data_btn").prop("disabled", true);
    $("#loader-overlay").hide();
});
    // Item Name
    if ($("#item_name").data("select2")) {
        $("#item_name").select2("destroy");
    }
    $("#item_name")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#item_name").parent(),
            width: "100%",
            placeholder: "Select a Purchase Number first",
            allowClear: true,
        });
    // Disable item_name and add_item_btn by default
    $("#item_name").prop("disabled", true).trigger("change.select2");
    $("#add_item_btn").prop("disabled", true);

   if ($("#vendor_name").data("select2")) {
    $("#vendor_name").select2("destroy");
}
$("#vendor_name")
    .wrap('<div class="position-relative"></div>')
    .select2({
        dropdownParent: $("#vendor_name").parent(),
        width: "100%",
        placeholder: "Search Vendor Code or Name",
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/purchase/search-item-vendor-by-query",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    itemVendorCode: params.term,
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
        templateResult: formatRepoVendor,
        templateSelection: formatRepoSelectionVendor,
    });

    function formatRepoVendor(repo) {
        if (repo.loading) {
            return repo.text;
        }

        var markup =
            "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" +
            repo.text +
            "-" +
            repo.name;
        ("</div>");

        markup += "</div></div>";

        return markup;
    }

    function formatRepoSelectionVendor(repo) {
        return repo.text || repo.id;
    }

    $("#vendor_name").on("select2:select", function (e) {
        // console.log(e.params.data);

        $("#vendor_id").val(e.params.data.id);

        var $option = $("#vendor_name").find(
            'option[value="' + e.params.data.id + '"]'
        );

        if ($option.length) {
            // Update existing option text
            $option.text(e.params.data.name);
        } else {
            // Append new option
            $("#vendor_name").append(
                $("<option>", {
                    value: e.params.data.id,
                    text: e.params.data.text,
                })
            );
        }
        $("#vendor_name_field").val(e.params.data.name);
        // Update select2 UI
        $("#vendor_name").val(e.params.data.id).trigger("change.select2");
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

        var selectedItemText = $("#item_name option:selected").text();
        var qtyMatch = selectedItemText.match(/Qty\s*:\s*([\d.]+)/);
        var maxQty = qtyMatch ? qtyMatch[1] : "";

        if ($("#item_name").val()) {
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
                        // console.log(response);
                        // Prepare the dropdown options based on `units`
                        let options = `<option value="" data-unit-price="">Select</option>`;
                        if (response.data.units) {
                            response.data.units.forEach(function (unit, index) {
                                if (index === 0) firstUnitId = unit.itemUnitId;
                                options += `<option value="${unit.itemUnitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
                            });
                        }
                        // console.log(options);
                        // var rowIndex = $("#purchase_return_table_tbody tr").length;
                        var rowIndex = Math.floor(
                            $("#purchase_return_table_tbody tr").length / 2
                        );

                        purchaseOrderHtml = `<tr>
                    <td class="item-sl-td">
                                ${rowIndex + 1}
                                <input type="hidden" class="service-id form-control" name="sl_no[${rowIndex}]" value="${
                            rowIndex + 1
                        }">
                                    
                                </td>
                                <td class="item-code-td">
                                    ${response.data.itemCode}
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="service-id form-control" name="item_id[${rowIndex}]" value="${
                                        response.data.itemMasterId
                                    }">
                                    ${response.data.itemName_en}
                                    <input type="hidden" class="service-id form-control" name="purchase_return_item_id[${rowIndex}]" value="0">

                                </td>
                                
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control item-quantity" placeholder="Quantity" name="item_quantity[]" value="1" max="${maxQty}">
                                </td>
                                <td class="item-unit-td">
                                    <select id="item_unit" name="item_unit[]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${options}
                                    </select>
                                </td>
                                
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="item_unit_price[]" value="0" readonly>
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="item_amount[]" value="0" readonly>
                                </td>
                                <td class="item-discount-td" style="width: 10% !important;">
                                <input type="text" class="form-control" placeholder="Amount" name="item_discount[${rowIndex}]" value="0">
                            </td><td class="item-discount-in-percentage-td" style="width: 10% !important;">
                                <input type="text" class="form-control " placeholder="%" name="item_discount_in_percentage[${rowIndex}]" value="0">
                            </td>
                                
                                
                                <td class="ite-vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[]" value="${
                                        response.data.tax.taxValueInPercentage
                                    }">
                                    
                                </td>
                                <td class="item-vat-amount-td">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="item_vat_amount[]" value="0" readonly>
                                </td>
                                <td class="item-net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[]" value="0" readonly>
                                </td>
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>
                            <tr>
                            <td>
                            </td>
                            <td class="item-batch-no-td" style="width: 10% !important;">
                               Batch No <input type="text" id="item_batch_no" class="form-control item-batch-no " placeholder="Batch No" name="item_batch_no[${rowIndex}]" value="">
                            </td> </tr>`;

                        $("#purchase_return_table_tbody").append(
                            purchaseOrderHtml
                        );

                        $(".item-unit").select2({
                            placeholder: "Selection", // Match the placeholder in the select
                            allowClear: true,
                        });
                        if (firstUnitId) {
                            $("#purchase_return_table_tbody .item-unit").last().val(firstUnitId).trigger("change");
                        }

                        flatpickr(".ex-date", {
                            dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
                            allowInput: true, // Allows manual input if desired
                        });

                        toggleDiscountColumnsAfterItemAdd();
                    } else {
                        console.error("Service details not found");
                    }
                },
                error: function (xhr, status, error) {
                     $("#loader-overlay").hide();
                    console.error("Error:", error);
                },
            });
        }

        $("#item_name").val("").trigger("change");
    });
    $("#item_name").val("").trigger("change");

    $("#clear_table_data_btn").click(function () {

        if (!isTableCleared) {
              // Clear the table rows
        $("#purchase_return_table_tbody").empty();

        // Reset totals
        $("#item_total").val("");
        $("#item_total_without_vat").val("");
        $("#item_vat_total").val("");
        $("#item_total_with_vat").val("");
        $("#item_discount_amount").val("");

        // Reset hidden counter field
        $("#item_td_count").val(0);

        // Optional: Clear vendor and branch fields if needed
        // $("#vendor_name").val('').trigger('change');
        // $("#branchId").val('').trigger('change');

        console.log("Purchase return table cleared!");
        $(this).html('<i class="tf-icons ti ti-restore ti-xs me-2"></i>Recover Table Data');

        isTableCleared = true;
            
        } else {
            $('#purchase_number').val();

        //   $("#purchase_number").on("select2:select", function (e) {
        // getPatientById(e.params.data.id);
        // let selectedId = e.params.data.id;
        $("#table-loader").show();
        getPurchaseNumberDetails($('#purchase_number').val());
    // });
        $(this).html('<i class="tf-icons ti ti-trash-x ti-xs me-2"></i>Clear Table Data');

        isTableCleared = false;
            
        }
        
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

// $(document).on(
//     "change",
//     ".item-unit, .item-quantity-td input, .vat-percentage-td input",
//     function () {
//         // Get the row of the current change event
//         let currentRow = $(this).closest("tr");

//         // Get necessary values
//         let unitPrice =
//             parseFloat(
//                 currentRow.find(".item-unit option:selected").data("unit-price")
//             ) || 0; // Unit price from the selected option
//         let quantity =
//             parseFloat(currentRow.find(".item-quantity-td input").val()) || 0; // Quantity input
//         let vatPercentage =
//             parseFloat(currentRow.find(".vat-percentage-td input").val()) || 0; // VAT percentage input

//         // Calculate the amount
//         let amount = unitPrice * quantity;
//         currentRow.find(".item-amount-td input").val(amount.toFixed(2)); // Display the amount

//         // Calculate the VAT amount
//         let vatAmount = (amount * vatPercentage) / 100;
//         currentRow.find(".vat-amount-td input").val(vatAmount.toFixed(2)); // Display the VAT amount

//         // Calculate the net amount
//         let netAmount = amount + vatAmount;
//         currentRow.find(".net-amount-td input").val(netAmount.toFixed(2)); // Display the net amount
//     }
// );

$(document).on("change", ".item-unit", function () {
    let selectedOption = $(this).find("option:selected");
    let unitPrice = selectedOption.data("unit-price");
    let currentRow = $(this).closest("tr");
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
                // console.log(response.data.vendorId);
                $("#branchId").val(response.data.clinicId).trigger("change");
                $("#invoice_date").val(response.data.date);
                // $("#vendor_name").val(response.data.vendor.vendor_name_en);
                // $("#vendor_id").val(response.data.vendorId);

                // $("#vendor_name_field").val(
                //     response.data.vendor.vendor_name_en
                // );
                // $("#vendor_name").val(response.data.vendorId);
                // $("#vendor_id").val(response.data.vendorId);

                purchasedItemsTotal = pupulatePurchaseOrderItems(
                    response.data.items
                );

                handleDiscountColumns(2);
                $("#item_total").val(response.data.totalAmount);
                $("#item_vat_total").val(response.data.vatAmount);
                $("#item_total_with_vat").val(response.data.totalWithVatAmount);

                $("#vendor_name").append(
                    $("<option>", {
                        value: response.data.vendorId, // Set the value as the vendorId
                        text: response.data.vendor.vendor_code, // Set the text as the vendor name
                    })
                );

                $("#vendor_name_field").val(
                    response.data.vendor.vendor_name_en
                );
                $("#vendor_name").val(response.data.vendorId);
                $("#vendor_id").val(response.data.vendorId);
            }
        },
    });
}

function getVendorById(selectedId) {
    $.ajax({
        // url: BASE_URL + "/get-patient-by-id",
        url: BASE_URL + "/purchase/get-vendor-by-id",
        type: "GET",
        data: {
            vendorId: selectedId,
        },
        success: function (response) {
            if (response.status) {
                // console.log(response.data.vendorId);
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

// $(document).on(
//     "change keyup",
//     ".item-quantity-td input, .item-unit-price-td input, .vat-percentage-td input",
//     function () {
//         calculateRowTotals();
//         calculateTableTotals();
//     }
// );

function pupulatePurchaseOrderItems(purchaseOrderItems) {
    $("#purchase_return_table_tbody").empty();
    var editPurchaseOrderHtml = "";
    let totalAmountWithoutVatAndDiscount = 0;
    let totalAmountWithVatAndDiscount = 0;
    let indexCount = 1;

    purchaseOrderItems.forEach((purchaseOrderItem, index) => {
        // console.log(index);
        let unitoptions = "";
        if (purchaseOrderItem.item.units) {
            purchaseOrderItem.item.units.forEach(function (unit) {
                unitoptions += `<option value="${unit.itemUnitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
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
        var rowIndex = $("#purchase_return_table_tbody tr").length; // Calculate index

        editPurchaseOrderHtml = `<tr>
         <td class="item-sl-td">
                                ${rowIndex + 1}
                                <input type="hidden" class="service-id form-control" name="sl_no[${rowIndex}]" value="${
            rowIndex + 1
        }">
                                    
                                </td>
        <td class="item-code-td">
                                ${purchaseOrderItem.item.itemCode}
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="service-id form-control" name="item_id[${rowIndex}]" value="${
            purchaseOrderItem.itemMasterId
        }">
                                    ${purchaseOrderItem.item.itemName_en}
                                </td>
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${
            purchaseOrderItem.quantity
        }">
                                </td>
                                <td class="item-unit-td">
                                    <select id="item_unit_${index}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                    ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Unit Price" name="item_unit_price[${rowIndex}]" value="${
            purchaseOrderItem.unitPrice
        }">
                                </td>
                                
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="${
            purchaseOrderItem.amount
        }">
                                </td>
                                
                                <td class="item-vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="VAT Percentage" name="item_vat_percentage[${rowIndex}]" value="${
            purchaseOrderItem.vatPercent
        }">
                                </td>
                                <td class="item-vat-amount-td">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="item_vat_amount[${rowIndex}]" value="${
            purchaseOrderItem.vatAmount
        }">
                                </td>
                                <td class="item-net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="${
            purchaseOrderItem.amountWithVat
        }">
                                </td>
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

        // Append the generated HTML to the table body
        $("#purchase_return_table_tbody").append(editPurchaseOrderHtml);

        // Initialize select2 for the new select element
        $(`#item_unit_${index}`).select2({
            placeholder: "Selection", // Match the placeholder in the select
            allowClear: true,
        });

        // Set the value of the select box based on `purchaseOrderItem.unit_id`
        if (purchaseOrderItem.itemUnitId) {
            $(`#item_unit_${index}`)
                .val(purchaseOrderItem.itemUnitId)
                .trigger("change");
        }

        flatpickr(".item-expiry-date", {
            dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
            allowInput: true, // Allows manual input if desired
        });
    });

    $("#item_td_count").val($("#purchase_return_table_tbody tr").length / 2);

    $(".item-quantity-td input").trigger("input");

    return {
        totalAmountWithoutVatAndDiscount: totalAmountWithoutVatAndDiscount,
        totalAmountWithVatAndDiscount: totalAmountWithVatAndDiscount,
    };
}

$(document).on("input", "input[name^='item_discount']", function () {
    // Find the closest row of the changed input
    const row = $(this).closest("tr");

    // Get the unit price, quantity, discount amount, and VAT percentage from their respective fields
    const unitPrice =
        parseFloat(row.find("input[name^='item_unit_price']").val()) || 0;
    const quantity =
        parseFloat(row.find("input[name^='item_quantity']").val()) || 0;
    const discount =
        parseFloat(row.find("input[name^='item_discount']").val()) || 0;
    const vatPercentage =
        parseFloat(row.find("input[name^='item_vat_percentage']").val()) || 0;

    // Calculate the amount (quantity * unit price) and set the value in item_amount
    let amount = unitPrice * quantity;
    row.find("input[name^='item_amount']").val(amount.toFixed(2));

    // Calculate the total after applying discount (discount is subtracted here)
    let discountedAmount = amount - discount;

    // Calculate the VAT amount based on the amount after discount
    let vatAmount = (discountedAmount * vatPercentage) / 100;
    vatAmount = truncateDecimals(vatAmount, 2);

    row.find("input[name^='item_vat_amount']").val(vatAmount.toFixed(2));

    // Calculate the net amount after VAT is added
    const netAmount = discountedAmount + vatAmount;
    row.find("input[name^='item_net_amount']").val(netAmount.toFixed(2));

    // Update totals
    updateTotals();
});

$(document).on(
    "blur",
    "input[name^='item_discount_in_percentage']",
    function () {
        // Find the closest row of the changed input
        const row = $(this).closest("tr");
        const originalPercentage = row
            .find("input[name^='item_discount_in_percentage']")
            .val();

        // Get the unit price, quantity, discount amount, and VAT percentage from their respective fields
        const unitPrice =
            parseFloat(row.find("input[name^='item_unit_price']").val()) || 0;
        const quantity =
            parseFloat(row.find("input[name^='item_quantity']").val()) || 0;
        let discount =
            parseFloat(row.find("input[name^='item_discount']").val()) || 0;
        const vatPercentage =
            parseFloat(row.find("input[name^='item_vat_percentage']").val()) ||
            0;
        const discountInPercentage =
            parseFloat(
                row.find("input[name^='item_discount_in_percentage']").val()
            ) || 0;

        // Calculate the amount (quantity * unit price) and set the value in item_amount
        let amount = unitPrice * quantity;
        row.find("input[name^='item_amount']").val(amount.toFixed(2));

        if (discountInPercentage) {
            discount = (amount * discountInPercentage) / 100;
            row.find("input[name^='item_discount']").val(discount.toFixed(2)); // optional: update discount field with calculated value
        }

        // Calculate the total after applying discount (discount is subtracted here)
        let discountedAmount = amount - discount;

        // Calculate the VAT amount based on the amount after discount
        let vatAmount = (discountedAmount * vatPercentage) / 100;
        vatAmount = truncateDecimals(vatAmount, 2);

        row.find("input[name^='item_vat_amount']").val(vatAmount.toFixed(2));

        // Calculate the net amount after VAT is added
        const netAmount = discountedAmount + vatAmount;
        row.find("input[name^='item_net_amount']").val(netAmount.toFixed(2));

        row.find("input[name^='item_discount_in_percentage']").val(
            originalPercentage
        );
        // Update totals
        updateTotals();
    }
);

$(document).on("change", ".item-unit", function () {
    // Get the selected option
    const selectedOption = $(this).find("option:selected");

    // Get the unit price from the selected option's data attribute
    const unitPrice = parseFloat(selectedOption.data("unit-price")) || 0;

    // Find the closest row of the changed dropdown
    const row = $(this).closest("tr");

    // Update the unit price input field
    row.find("input[name='item_unit_price[]']").val(unitPrice.toFixed(2));

    // Get the quantity and VAT percentage
    const quantity =
        parseFloat(row.find("input[name='item_quantity[]']").val()) || 0;
    const vatPercentage =
        parseFloat(row.find("input[name='item_vat_percentage[]']").val()) || 0;

    // Calculate the amount
    const amount = unitPrice * quantity;
    row.find("input[name='item_amount[]']").val(amount.toFixed(2));

    // Calculate the VAT amount
    let vatAmount = (amount * vatPercentage) / 100;
    vatAmount = truncateDecimals(vatAmount, 2);

    row.find("input[name='item_vat_amount[]']").val(vatAmount.toFixed(2));

    // Calculate the net amount
    const netAmount = amount + vatAmount;
    row.find("input[name='item_net_amount[]']").val(netAmount.toFixed(2));
});

$(document).on("input", "input[name='item_quantity[]']", function () {
    // Get the changed quantity value
    const quantity = parseFloat($(this).val()) || 0;

    // Find the closest row of the changed input
    const row = $(this).closest("tr");

    // Get the unit price and VAT percentage from their respective fields
    const unitPrice =
        parseFloat(row.find("input[name='item_unit_price[]']").val()) || 0;
    const vatPercentage =
        parseFloat(row.find("input[name='item_vat_percentage[]']").val()) || 0;

    // Calculate the amount
    const amount = unitPrice * quantity;
    row.find("input[name='item_amount[]']").val(amount.toFixed(2));

    // Calculate the VAT amount
    let vatAmount = (amount * vatPercentage) / 100;
    vatAmount = truncateDecimals(vatAmount, 2);

    row.find("input[name='item_vat_amount[]']").val(vatAmount.toFixed(2));

    // Calculate the net amount
    const netAmount = amount + vatAmount;
    row.find("input[name='item_net_amount[]']").val(netAmount.toFixed(2));
});

const truncateDecimals = (num, decimals) => {
    const multiplier = Math.pow(10, decimals);
    return Math.floor(num * multiplier) / multiplier;
};

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

function initialPageLoad(editPurchaseReturnId) {
    $.ajax({
        // url: BASE_URL + "/get-patient-by-id",
        url:
            BASE_URL + "/purchase/edit-purchase-return/" + editPurchaseReturnId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                // console.log(response.data.branch_id);
                // Check if the option already exists in the dropdown
                $("#reference_number").val(response.data.referenceNumber);
                $("#return_number").val(response.data.returnNumber);

                if (
                    response.data.purchase_order &&
                    response.data.purchase_order.purchaseOrderId
                ) {
                    if (
                        !$("#po_no").find(
                            'option[value="' +
                                response.data.purchase_order.purchaseOrderId +
                                '"]'
                        ).length
                    ) {
                        // Append the new option
                        $("#po_no").append(
                            $("<option>", {
                                value: response.data.purchase_order
                                    .purchaseOrderId, // Set the value as the vendorId
                                text: response.data.purchase_order.poNo, // Set the text as the vendor name
                            })
                        );
                    }

                    // // Set the newly added or existing option as selected
                    $("#po_no")
                        .val(response.data.purchase_order.purchaseOrderId)
                        .trigger("change");
                } else {
                    if (response.data.purchase_number) {
                        if (
                            !$("#purchase_number").find(
                                'option[value="' +
                                    response.data.purchase_number
                                        .purchaseItemBillId +
                                    '"]'
                            ).length
                        ) {
                            // Append the new option
                            $("#purchase_number").append(
                                $("<option>", {
                                    value: response.data.purchase_number
                                        .purchaseItemBillId, // Set the value as the vendorId
                                    text: response.data.purchase_number
                                        .invoiceNo, // Set the text as the vendor name
                                })
                            );
                        }

                        // // Set the newly added or existing option as selected
                        $("#purchase_number")
                            .val(
                                response.data.purchase_number.purchaseItemBillId
                            )
                            .trigger("change");

                        // Enable item_name for edit page
                        enableItemNameWithPurchaseItems(response.data.purchase_number.purchaseItemBillId);
                    }
                }

                $("#vendor_name").append(
                    $("<option>", {
                        value: response.data.vendorId, // Set the value as the vendorId
                        text: response.data.vendor.vendor_name_en, // Set the text as the vendor name
                    })
                );

                $("#vendor_name_field").val(
                    response.data.vendor.vendor_name_en
                );
                $("#vendor_name").val(response.data.vendorId);

                $("#vendor_id").val(response.data.vendorId);
                $("#purchase_return_no").val(response.data.purchaseReturnNo);
                $("#mode_of_pay")
                    .val(response.data.typeOfTransactionId)
                    .trigger("change");
                $("#invoice_date").val(response.data.invoiceDate);
                $("#return_date").val(response.data.returnDate);
                $("#remarks").val(response.data.remarks);

                purchasedItemsTotal = pupulateEditReturnItems(
                    response.data.purchase_return_items
                );
                $("#item_total").val(response.data.returnTotalAmount);
                $("#item_vat_total").val(response.data.returnVatAmount);
                $("#item_total_with_vat").val(
                    response.data.returnAmountWithVat
                );
                $("#branchId").val(response.data.clinicId).trigger("change");

                // Assuming `response.data.discountType` returns either "0" or "1"
                let discountType = response.data.discountType;

                // First, uncheck both
                $("#flatDiscount").prop("checked", false);
                $("#percentage").prop("checked", false);

                // Then check the one that matches the discountType
                if (discountType == 0) {
                    $("#flatDiscount").prop("checked", true);
                } else if (discountType == 1) {
                    $("#percentage").prop("checked", true);
                }
                toggleDiscountColumns();

                $("#item_discount_amount").val(
                    response.data.returnTotalDiscountAmount
                );
                $("#item_total_without_vat").val(
                    response.data.returnTotalWithoutVat
                );
            }
            $("#table-loader").hide();
        },
    });
}

function pupulateEditReturnItems(purchaseReturnItems) {
    $("#purchase_return_table_tbody").empty();
    var editPurchaseOrderHtml = "";
    let totalAmountWithoutVatAndDiscount = 0;
    let totalAmountWithVatAndDiscount = 0;
    let indexCount = 1;
    // console.log(goodsRecievedNoteItems);
    purchaseReturnItems.forEach((purchaseReturnItem, index) => {
        // console.log(index);
        let unitoptions = "<option value='' >Select</option>";
        if (purchaseReturnItem.return_item_details.units) {
            purchaseReturnItem.return_item_details.units.forEach(function (
                unit
            ) {
                unitoptions += `<option value="${unit.itemUnitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
            });
        }
        // console.log(purchaseReturnItem.discountAmount);
        // Calculate the total amount without VAT and discount
        // totalAmountWithoutVatAndDiscount += parseFloat(
        //     goodsRecievedNoteItem.amount || 0
        // );
        // totalAmountWithVatAndDiscount += parseFloat(
        //     goodsRecievedNoteItem.amount_with_vat || 0
        // );
        indexCount = index + 1;
        // var rowIndex = $("#purchase_return_table_tbody tr").length; // Calculate index
        var rowIndex = $("#purchase_return_table_tbody tr").length;
        if (rowIndex > 0) {
            rowIndex = rowIndex / 2;
        }

        // console.log(purchaseReturnItem);
        editPurchaseOrderHtml = `<tr>
        <td class="item-sl-td">
                                ${rowIndex + 1}
                                <input type="hidden" class="service-id form-control" name="sl_no[${rowIndex}]" value="${
            rowIndex + 1
        }">
                                    
                                </td>
        <td class="item-code-td">
                                ${
                                    purchaseReturnItem.return_item_details
                                        .itemCode
                                }
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="service-id form-control" name="item_id[${rowIndex}]" value="${
            purchaseReturnItem.itemMasterId
        }">
                                    ${
                                        purchaseReturnItem.return_item_details
                                            .itemName_en
                                    }
                                    <input type="hidden" class="service-id form-control" name="purchase_return_item_id[${rowIndex}]" value="${
            purchaseReturnItem.purchaseReturnItemId
        }">

                                </td>
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${
            purchaseReturnItem.returnItemQuantity
       }" max="${
            purchaseReturnItem.availableQuantity !== undefined ? purchaseReturnItem.availableQuantity : ''
        }">
                                </td>
                                <td class="item-unit-td">
                                    <select id="item_unit_${index}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                    ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Unit Price" name="item_unit_price[${rowIndex}]" value="${
            purchaseReturnItem.returnItemUnitPrice
        }">
                                </td>
                                
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="${
            purchaseReturnItem.amount
        }">
                                </td>
                                <td class="item-discount-td" style="width: 10% !important;">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_discount[${rowIndex}]" value="${
            purchaseReturnItem.discountAmount
        }">
                                </td>
                                <td class="item-discount-in-percentage-td" style="width: 10% !important;">
                                    <input type="text" class="form-control" placeholder="%" name="item_discount_in_percentage[${rowIndex}]" value="${
            purchaseReturnItem.discountPercentage
        }">
                                </td>
                                
                                <td class="item-vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="VAT Percentage" name="item_vat_percentage[${rowIndex}]" value="${
            purchaseReturnItem.returnVatPercentage
        }">
                                </td>
                                <td class="item-vat-amount-td">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="item_vat_amount[${rowIndex}]" value="${
            purchaseReturnItem.returnVatAmount
        }">
                                </td>
                                <td class="item-net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="${
            purchaseReturnItem.returnTotalWithVat
        }">
                                </td>
                                
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row" data-id="${
                                        purchaseReturnItem.purchaseReturnItemId
                                    }" data-type="${
            purchaseReturnItem.returnItemId
        }">X</button>
                                </td>
                            </tr>
                            <tr>
                            <td>
                            </td>
                                <td class="item-batch-no-td" style="width: 10% !important;">
                                   Batch No <input type="text" id="item_batch_no" class="form-control item-batch-no " placeholder="Batch No" name="item_batch_no[${rowIndex}]" value="${
            purchaseReturnItem.batchNo ?? 0
        }">
                                </td> </tr>`;

        // Append the generated HTML to the table body
        $("#purchase_return_table_tbody").append(editPurchaseOrderHtml);

        if (purchaseReturnItem.returnItemUnitId) {
            $(`#item_unit_${index}`).val(purchaseReturnItem.returnItemUnitId);
        }

        // Initialize select2 for the new select element
        $(`#item_unit_${index}`).select2({
            placeholder: "Selection", // Match the placeholder in the select
            allowClear: true,
        });

        // Set the value of the select box based on `goodsRecievedNoteItem.unit_id`

        flatpickr(".item-expiry-date", {
            dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
            allowInput: true, // Allows manual input if desired
        });
    });

    $("#item_td_count").val(indexCount);

    // Trigger recalculation for all added rows to ensure amount, VAT, and total match the unit price and quantity
    $(".item-quantity-td input").trigger("input");

    return {
        totalAmountWithoutVatAndDiscount: totalAmountWithoutVatAndDiscount,
        totalAmountWithVatAndDiscount: totalAmountWithVatAndDiscount,
    };
}

$(document).on("change", ".item-unit", function () {
    // Get the selected option
    const selectedOption = $(this).find("option:selected");

    // Get the unit price from the selected option's data attribute
    const unitPrice = parseFloat(selectedOption.data("unit-price")) || 0;

    // Find the closest row of the changed dropdown
    const row = $(this).closest("tr");

    // Update the unit price input field
    row.find("input[name^='item_unit_price']").val(unitPrice.toFixed(2));

    // Get the quantity and VAT percentage
    const quantity =
        parseFloat(row.find("input[name^='item_quantity']").val()) || 0;
    const vatPercentage =
        parseFloat(row.find("input[name^='item_vat_percentage']").val()) || 0;

    // Calculate the amount
    const amount = unitPrice * quantity;
    row.find("input[name^='item_amount']").val(amount.toFixed(2));

    // Calculate the VAT amount
    let vatAmount = (amount * vatPercentage) / 100;
    vatAmount = truncateDecimals(vatAmount, 2);
    row.find("input[name^='item_vat_amount']").val(vatAmount.toFixed(2));

    // Calculate the net amount
    const netAmount = amount + vatAmount;
    row.find("input[name^='item_net_amount']").val(netAmount.toFixed(2));

    // Update totals
    updateTotals();
});

$(document).on(
    "input",
    "input[name^='item_quantity'], input[name^='item_vat_percentage']",
    function () {
        // Find the closest row of the changed input
        const row = $(this).closest("tr");

        // Get the unit price, quantity, and VAT percentage from their respective fields
        const unitPrice =
            parseFloat(row.find("input[name^='item_unit_price']").val()) || 0;
        const quantity =
            parseFloat(row.find("input[name^='item_quantity']").val()) || 0;
        const vatPercentage =
            parseFloat(row.find("input[name^='item_vat_percentage']").val()) ||
            0;

        // Calculate the amount
        const amount = unitPrice * quantity;
        row.find("input[name^='item_amount']").val(amount.toFixed(2));

        // Calculate the VAT amount
        let vatAmount = (amount * vatPercentage) / 100;
        vatAmount = truncateDecimals(vatAmount, 2);
        row.find("input[name^='item_vat_amount']").val(vatAmount.toFixed(2));

        // Calculate the net amount
        const netAmount = amount + vatAmount;
        row.find("input[name^='item_net_amount']").val(netAmount.toFixed(2));

        // Update totals
        updateTotals();
    }
);

function updateTotals() {
    let totalAmount = 0;
    let totalVatAmount = 0;
    let totalWithVat = 0;
    let totalDiscount = 0;
    let totalWithoutVat = 0;

    $("#purchase_return_table_tbody tr").each(function () {
        const row = $(this);

        const amount =
            parseFloat(row.find("input[name^='item_amount']").val()) || 0;
        const vatAmount =
            parseFloat(row.find("input[name^='item_vat_amount']").val()) || 0;
        const netAmount =
            parseFloat(row.find("input[name^='item_net_amount']").val()) || 0;
        const discountAmount =
            parseFloat(row.find("input[name^='item_discount']").val()) || 0;
        // console.log(discountAmount);
        totalDiscount += discountAmount;
        totalAmount += amount;
        totalVatAmount += vatAmount;
        totalWithVat += netAmount;
        totalWithoutVat = totalAmount - totalDiscount;
    });

    // Update the totals in the corresponding input fields
    $("#item_total").val(totalAmount.toFixed(2));
    $("#item_vat_total").val(totalVatAmount.toFixed(2));
    $("#item_total_with_vat").val(totalWithVat.toFixed(2));
    $("#item_discount_amount").val(totalDiscount.toFixed(2));
    $("#item_total_without_vat").val(totalWithoutVat.toFixed(2));
}

// Remove row and update SL column
$(document).on("click", ".remove-row", function () {
    // $(this).closest("tr").remove();
    var $currentRow = $(this).closest("tr");
    var $nextRow = $currentRow.next("tr");
    $currentRow.remove();
    $nextRow.remove();
    var purchaseReturnItemId = $(this).data("id");
    var returnItemId = $(this).data("type");
    if (purchaseReturnItemId > 0 && returnItemId > 0) {
        deleteAlreadyExistItem(purchaseReturnItemId, returnItemId);
    } else {
        updateTotals();
    }
});

// Remove row and recalculate totals
// $(document).on("click", ".remove-row", function () {
//     $(this).closest("tr").remove();
//     calculateTableTotals();
// });

function deleteAlreadyExistItem(purchaseReturnItemId, returnItemId) {
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
                    "/purchase/delete-purchase-return-item/" +
                    purchaseReturnItemId +
                    "/" +
                    returnItemId, // Adjust URL if needed
                type: "DELETE",
                data: returnItemId, // Pass any required data here
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

function getPurchaseNumberDetails(purchaseId) {
    $.ajax({
        // url: BASE_URL + "/get-patient-by-id",
        url: BASE_URL + "/purchase/get-purchase-details-by-id/" + purchaseId,
        type: "GET",
        success: function (response) {
            $("#loader-overlay").hide();
            if (!response.status) {
                Swal.fire({
                    icon: "error",
                    title: "Return not allowed.",
                    text: response.message,
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "btn btn-danger waves-effect waves-light",
                    },
                }).then(function () {
                    $("#purchase_number").val(null).trigger("change");
                    $("#purchase_return_table_tbody").empty();
                    $("#item_total").val("");
                    $("#item_total_without_vat").val("");
                    $("#item_vat_total").val("");
                    $("#item_total_with_vat").val("");
                    $("#item_discount_amount").val("");
                    $("#item_td_count").val(0);
                    $("#clear_table_data_btn").prop("disabled", true);
                    disableItemName();
                });
                return; // stop here, don't populate anything
            }

                $("#branchId").val(response.data.clinicId).trigger("change");
                $("#vendor_name").append(
                    $("<option>", {
                        value: response.data.vendorId, // Set the value as the vendorId
                        text: response.data.vendor.vendor_code, // Set the text as the vendor name
                    })
                );

                $("#vendor_name_field").val(
                    response.data.vendor.vendor_name_en
                );
                $("#vendor_name").val(response.data.vendorId);
                $("#vendor_id").val(response.data.vendorId);
                // $("#invoice_date").val(response.data.date);
                // $("#vendor_name").val(response.data.vendor.vendor_name_en);
                // $("#vendor_id").val(response.data.vendorId);

                // purchasedItemsTotal = pupulatePurchaseOrderItems(
                //     response.data.items
                // );
                // $("#item_total").val(response.data.totalAmount);
                // $("#item_vat_total").val(response.data.vatAmount);
                // $("#item_total_with_vat").val(response.data.totalWithVatAmount);
                console.log("discountType=>" + response.data.discountType);
                purchasedItemsTotal = pupulatePurchasedItems(
                    response.data.items
                );

                // Assuming `response.data.discountType` returns either "0" or "1"
                let discountType = response.data.discountType;

                // First, uncheck both
                $("#flatDiscount").prop("checked", false);
                $("#percentage").prop("checked", false);

                // Then check the one that matches the discountType
                if (discountType == 0) {
                    $("#flatDiscount").prop("checked", true);
                } else if (discountType == 1) {
                    $("#percentage").prop("checked", true);
                }

                handleDiscountColumns(response.data.discountType);
            },
        error: function (xhr, status, error) {
            $("#loader-overlay").hide();
            console.error("Error:", error);
        },
    });
}
function pupulatePurchasedItems(purchasedItems) {
    $("#purchase_return_table_tbody").empty();
    var editPurchaseOrderHtml = "";
    let totalAmountWithoutVatAndDiscount = 0;
    let totalAmountWithVatAndDiscount = 0;
    let indexCount = 1;
    // console.log(goodsRecievedNoteItems);
    purchasedItems.forEach((purchasedItem, index) => {
    // Skip fully-returned items - no row, no calculation
    const availableQty = purchasedItem.availableQuantity !== undefined
        ? purchasedItem.availableQuantity
        : purchasedItem.quantity;
    if (!availableQty || availableQty <= 0) {
        return;
    }

        // console.log(purchasedItem.purchased_items);
        let unitoptions = "<option value='' >Select</option>";
        if (purchasedItem.purchased_items.units) {
            purchasedItem.purchased_items.units.forEach(function (unit) {
                console.log(unit.unit.unit_name_en);
                unitoptions += `<option value="${unit.itemUnitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
            });
        }

        indexCount = index + 1;
        // var rowIndex = $("#purchase_return_table_tbody tr").length; // Calculate index
        var rowIndex = $("#purchase_return_table_tbody tr").length;
        if (rowIndex > 0) {
            rowIndex = rowIndex / 2;
        }
//test
        console.log(purchasedItem);
        editPurchaseOrderHtml = `<tr>
        <td class="item-sl-td">
                                ${rowIndex + 1}
                                <input type="hidden" class="service-id form-control" name="sl_no[${rowIndex}]" value="${
            rowIndex + 1
        }">
                                    
                                </td>
        <td class="item-code-td">
                                ${purchasedItem.purchased_items.itemCode}
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="service-id form-control" name="item_id[${rowIndex}]" value="${
            purchasedItem.purchased_items.itemMasterId
        }">
                                    ${purchasedItem.purchased_items.itemName_en}

                                </td>
                                <td class="item-quantity-td">
                      <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${
            purchasedItem.availableQuantity !== undefined ? purchasedItem.availableQuantity : purchasedItem.quantity
        }" max="${
            purchasedItem.availableQuantity !== undefined ? purchasedItem.availableQuantity : purchasedItem.quantity
        }">
        <span class="text-danger error-text availableQuantity_error"></span>
                                </td>
                                <td class="item -unit-td">
                                    <select id="item_unit_${index}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                    ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Unit Price" name="item_unit_price[${rowIndex}]" value="${
            purchasedItem.unitPrice
        }">
                                </td>
                                
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="${
            purchasedItem.itemAmount
        }">
                                </td>
                                <td class="item-discount-td" style="width: 10% !important;">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_discount[${rowIndex}]" value="${
            purchasedItem.discountAmount
        }">
                                </td>
                                <td class="item-discount-in-percentage-td" style="width: 10% !important;">
                                    <input type="text" class="form-control" placeholder="%" name="item_discount_in_percentage[${rowIndex}]" value="${
            purchasedItem.discountPercentage
        }">
                                </td>
                                
                                <td class="item-vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="VAT Percentage" name="item_vat_percentage[${rowIndex}]" value="${
            purchasedItem.vatPercentage
        }">
                                </td>
                                <td class="item-vat-amount-td">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="item_vat_amount[${rowIndex}]" value="${
            purchasedItem.vatAmount
        }">
                                </td>
                                <td class="item-net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="${
            purchasedItem.totalAmountWithVat
        }">
                                </td>
                                
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>
                            <tr>
                            <td>
                            </td>
                                <td class="item-batch-no-td" style="width: 10% !important;">
                                   Batch No <input type="text" id="item_batch_no" class="form-control item-batch-no " placeholder="Batch No" name="item_batch_no[${rowIndex}]" value="${
            purchasedItem.batchNo
        }">
                                </td> </tr>`;

        // Append the generated HTML to the table body
        $("#purchase_return_table_tbody").append(editPurchaseOrderHtml);

    // Initialize select2 for the new select element FIRST
$(`#item_unit_${index}`).select2({
    placeholder: "Selection", // Match the placeholder in the select
    allowClear: true,
});

// Then set value on the SAME element (index, not rowIndex) and trigger change
$(`#item_unit_${index}`)
    .val(purchasedItem.itemUnitId)
    .trigger("change");

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

function handleDiscountColumns(discountType) {
    const flatDiscountCols = $("th.discount-th, td.item-discount-td");
    const percentageDiscountCols = $(
        "th.discount-percentage-th, td.item-discount-in-percentage-td"
    );

    if (discountType === 0) {
        flatDiscountCols.show();
        percentageDiscountCols.hide();
    } else if (discountType === 1) {
        flatDiscountCols.hide();
        percentageDiscountCols.show();
    } else {
        // Hide both if no discount type
        flatDiscountCols.hide();
        percentageDiscountCols.hide();
    }
}

function toggleDiscountColumns() {
    const isFlat = $("#flatDiscount").is(":checked");
    if (isFlat) {
        $("#purchase_return_table_tbody .item-discount-td").show();
        $(
            "#purchase_return_table_tbody .item-discount-in-percentage-td"
        ).hide();
        $("#purchase_return_table .discount-th").show();
        $("#purchase_return_table .discount-percentage-th").hide();
    } else {
        $(
            "#purchase_return_table_tbody .item-discount-in-percentage-td"
        ).show();
        $("#purchase_return_table_tbody .item-discount-td").hide();
        $("#purchase_return_table .discount-th").hide();
        $("#purchase_return_table .discount-percentage-th").show();
    }
    recalculatePurchaseTableRow(isFlat);
}

function toggleDiscountColumnsAfterItemAdd() {
    const isFlat = $("#flatDiscount").is(":checked");
    if (isFlat) {
        $("#purchase_return_table_tbody .item-discount-td").show();
        $(
            "#purchase_return_table_tbody .item-discount-in-percentage-td"
        ).hide();
        $("#purchase_return_table .discount-th").show();
        $("#purchase_return_table .discount-percentage-th").hide();
    } else {
        $(
            "#purchase_return_table_tbody .item-discount-in-percentage-td"
        ).show();
        $("#purchase_return_table_tbody .item-discount-td").hide();
        $("#purchase_return_table .discount-th").hide();
        $("#purchase_return_table .discount-percentage-th").show();
    }
    // console.log("called");
}

function recalculatePurchaseTableRow(isFlat) {
    if (isFlat) {
        $("#purchase_return_table_tbody tr").each(function () {
            const row = $(this);
            if (!$("#edit_purchase_retrun_id").val()) {
                row.find("input[name^='item_discount']").val(0);
            }

            let unitPrice =
                parseFloat(row.find("input[name^='item_unit_price']").val()) ||
                0;
            let quantity =
                parseFloat(row.find("input[name^='item_quantity']").val()) || 0;
            let discount =
                parseFloat(row.find("input[name^='item_discount']").val()) || 0;
            let vatPercentage =
                parseFloat(
                    row.find("input[name^='item_vat_percentage']").val()
                ) || 0;

            // Calculate the amount (quantity * unit price) and set the value in item_amount
            let amount = unitPrice * quantity;
            row.find("input[name^='item_amount']").val(amount.toFixed(2));

            // Calculate the total after applying discount (discount is subtracted here)
            let discountedAmount = amount - discount;

    //         let vatAmount = (discountedAmount * vatPercentage) / 100;
    // vatAmount = truncateDecimals(vatAmount, 2);

            // Calculate the VAT amount based on the amount after discount
            let vatAmount = (discountedAmount * vatPercentage) / 100;
            vatAmount = truncateDecimals(vatAmount, 2);
            row.find("input[name^='item_vat_amount']").val(
                vatAmount.toFixed(2)
            );

            // Calculate the net amount after VAT is added
            let netAmount = discountedAmount + vatAmount;
            row.find("input[name^='item_net_amount']").val(
                netAmount.toFixed(2)
            );
        });
    } else {
        $("#purchase_return_table_tbody tr").each(function () {
            const row = $(this);
            if (!$("#edit_purchase_retrun_id").val()) {
                row.find("input[name^='item_discount_in_percentage']").val(0);
            }

            // Get the unit price, quantity, discount amount, and VAT percentage from their respective fields
            let unitPrice =
                parseFloat(row.find("input[name^='item_unit_price']").val()) ||
                0;
            let quantity =
                parseFloat(row.find("input[name^='item_quantity']").val()) || 0;
            let discount =
                parseFloat(row.find("input[name^='item_discount']").val()) || 0;
            let vatPercentage =
                parseFloat(
                    row.find("input[name^='item_vat_percentage']").val()
                ) || 0;
            let discountInPercentage =
                parseFloat(
                    row.find("input[name^='item_discount_in_percentage']").val()
                ) || 0;

            // Calculate the amount (quantity * unit price) and set the value in item_amount
            let amount = unitPrice * quantity;
            row.find("input[name^='item_amount']").val(amount.toFixed(2));

            if (discountInPercentage >= 0) {
                discount = (amount * discountInPercentage) / 100;
                // console.log(discount=1);
                // row.find("input[name^='item_discount']").val(
                //     discount.toFixed(2)
                // ); // optional: update discount field with calculated value
            }
            // else if(discountInPercentage == 0){
            //     discount = (amount * discountInPercentage) / 100;
            //     console.log(discount);
            //     row.find("input[name^='item_discount']").val(discount.toFixed(2)); // optional: update discount field with calculated value
            // }

            // Calculate the total after applying discount (discount is subtracted here)
            let discountedAmount = amount - discount;
            // console.log('discount:'+discount);
            // Calculate the VAT amount based on the amount after discount
            let vatAmount = (discountedAmount * vatPercentage) / 100;
            vatAmount = truncateDecimals(vatAmount, 2);
            row.find("input[name^='item_vat_amount']").val(
                vatAmount.toFixed(2)
            );
            console.log('vatAmount:'+vatAmount);

            // Calculate the net amount after VAT is added
            let netAmount = discountedAmount + vatAmount;
            row.find("input[name^='item_net_amount']").val(
                netAmount.toFixed(2)
            );

            if (!$("#edit_purchase_retrun_id").val()) {
                row.find("input[name^='item_discount_in_percentage']").val(0);
            }
        });
    }

    // Update overall totals
    if (!$("#edit_purchase_retrun_id").val()) {
        $("#item_discount_amount").val(0);
        updateTotals();
        $("#item_discount_amount").val(0);
    }
    updateTotals();
}

// function calculateTableTotals(params) {

// }

// Prevent typing minus (-) or scientific notation (e)
$(document).on("keydown", ".item-quantity, input[name^='item_quantity']", function (e) {
    if (e.key === "-" || e.key === "e") {
        e.preventDefault();
    }
});

// Ensure value stays 0 or above and within max
$(document).on("input", ".item-quantity, input[name^='item_quantity']", function () {
    let rawVal = $(this).val();
    if (rawVal === '') {
        return; // Allow it to be empty temporarily while typing
    }
    
    let val = parseFloat(rawVal);
    let max = parseFloat($(this).attr("max"));
    let changed = false;
    
    if (val < 0) {
        $(this).val(0); // reset to 0 if negative
        changed = true;
    } else if (!isNaN(max) && val > max) {
        $(this).val(max); // limit to max
        changed = true;
    }

    if (changed) {
        $(this).trigger("input"); // re-run recalculation handlers with corrected value
    }
});

// Prevent typing negative sign (-) or 'e' (for scientific notation)
$(document).on("keydown", ".item-discount-in-percentage", function (e) {
    if (e.key === "-" || e.key === "e") {
        e.preventDefault();
    }
});

// Ensure value is between 0 and 100 and remove leading zeros
$(document).on("input", ".item-discount-in-percentage", function () {
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
});

// Prevent discount from exceeding item amount when flat discount is selected
$(document).on("input", ".item-discount-td input", function () {
    if ($("#flatDiscount").is(":checked")) {
        let $row = $(this).closest("tr");
        let discountInput = $(this);
        let amount = parseFloat($row.find(".item-amount-td input").val()) || 0;
        let discount = parseFloat(discountInput.val()) || 0;

        // Prevent discount greater than item amount
        if (discount > amount) {
            discountInput.val(amount.toFixed(2));
        }
    }
});

// Prevent typing negative numbers or scientific notation in discount or VAT fields
$(document).on(
    "keydown",
    ".item-discount-td input, .item-vat-percentage-td input",
    function (e) {
        // Prevent negative sign or 'e' for exponential notation
        if (e.key === "-" || e.key.toLowerCase() === "e") {
            e.preventDefault();
        }
    }
);

// Optional: Prevent pasting invalid (non-numeric or negative) values
$(document).on(
    "paste",
    ".item-discount-td input, .item-vat-percentage-td input",
    function (e) {
        let pasteData = e.originalEvent.clipboardData.getData("text");
        if (!/^\d*\.?\d*$/.test(pasteData)) {
            e.preventDefault();
        }
    }
);

    function enableItemNameWithPurchaseItems(purchaseId) {
    $.ajax({
        url: BASE_URL + "/purchase/get-purchase-details-by-id/" + purchaseId,
        type: "GET",
        success: function (response) {
            if (!response.status) {
                disableItemName();
                return;
            }
            $("#item_name").append('<option value="">Search Item</option>');
            response.data.items.forEach(function (item) {
                let qty = item.availableQuantity !== undefined ? item.availableQuantity : item.quantity;
                if (!qty || qty <= 0) return;
                $("#item_name").append(
                    $("<option>", {
                        value: item.itemMasterId,
                        text: item.purchased_items.itemCode + " - " + item.purchased_items.itemName_en + "  -  Qty : " + qty
                    })
                );
            });
            if ($("#item_name").data("select2")) {
                $("#item_name").select2("destroy");
            }
            $("#item_name").select2({
                dropdownParent: $("#item_name").parent(),
                width: "100%",
                placeholder: "Search Item Name",
                allowClear: true,
            });
            $("#item_name").prop("disabled", false).trigger("change.select2");
            $("#add_item_btn").prop("disabled", false);
        },
    });
}

/**
 * Disable the item_name dropdown and clear its options.
 */
function disableItemName() {
    $("#item_name").empty();
    if ($("#item_name").data("select2")) {
        $("#item_name").select2("destroy");
    }
    $("#item_name").select2({
        dropdownParent: $("#item_name").parent(),
        width: "100%",
        placeholder: "Select a Purchase Number first",
        allowClear: true,
    });
    $("#item_name").prop("disabled", true).trigger("change.select2");
    $("#add_item_btn").prop("disabled", true);
}
    function showStockWarning($input, max) {
        $input.next('.stock-error').remove();
        $input.addClass('is-invalid');
        if (!$input.next('.stock-error').length) {
            $input.after('<small class="text-danger stock-error">Only ' + max + ' in stock</small>');
        }
        setTimeout(function () {
            $input.removeClass('is-invalid');
            $input.next('.stock-error').fadeOut('slow', function () { $(this).remove(); });
        }, 2000);
    }
