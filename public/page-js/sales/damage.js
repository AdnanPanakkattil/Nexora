let grandTotal = 0;
let previousDiscountFlag = 0;
let pageLoadFlag = 0;

$(document).ready(function () {
    $("#sales_main_menu").addClass("active open menu-item-animating");
    $("#damage_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#customer_type").val("b2c").trigger("change");
    $("#currency").val(3).trigger("change");

    $("#prescriptionDate").flatpickr({
        dateFormat: "Y-m-d",
        defaultDate: new Date(),
    });

    // Set Flat as default checked
    $("#percentage").prop("checked", true);

    // Initially show Discount, hide Dis(%)

    // When checkbox changes
    $('input[name="discountType"]').on("change", function () {
        // Allow only one to be selected
        $('input[name="discountType"]').not(this).prop("checked", false);

        // Show/hide relevant columns
        toggleDiscountColumns();
    });

    // Run on page load in case of preselected value
    toggleVatField();

    // Run when customer type changes
    $("#customer_type").on("change", function () {
        toggleVatField();
    });

    var selectElement = $("#branchId");

    // Check if the number of options (excluding the first empty option) is 1
    if (selectElement.find("option").length === 2) {
        // One option + "Select"
        // Set the default value to the only available option
        selectElement
            .val(selectElement.find("option").not(":first").val())
            .trigger("change");
    }

    if ($("#edit_invoice_id").val()) {
        $('#table-loader').show();
        initialPageLoad($("#edit_invoice_id").val());

        toggleDiscountColumns();
    } else {
        // Get the current date in YYYY-MM-DD format
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0]; // Format the date

        // Set the current date as the value of the input field
        $("#invoice_date").val(formattedDate);
    }

    $("#manual_item_enabled").val() == "1"
        ? $("#add_item_manual_btn").prop("disabled", false)
        : $("#add_item_manual_btn").prop("disabled", true);
    $("#enableManualItem").change(function () {
        let isChecked = $(this).is(":checked") ? 1 : 0;

        $.ajax({
            url: BASE_URL + "/sales/enable-or-disable-manuel-item",
            method: "PUT",
            data: {
                manuelItemFlag: isChecked,
            },
            success: function (response) {
                if (response.status) {
                    $("#manual_item_enabled").val(response.data);
                    console.log(response.data == 1);
                    response.data == 1
                        ? $("#add_item_manual_btn").prop("disabled", false)
                        : $("#add_item_manual_btn").prop("disabled", true);

                    response.data == 1
                        ? $("#enableManualItem").prop("checked", true).val(1)
                        : $("#enableManualItem").prop("checked", false).val(0);
                    $("#invoiceSettingsModal").modal("hide");

                    // Swal.fire({
                    //     icon: "success",
                    //     text: response.message,
                    //     customClass: {
                    //         confirmButton: "btn btn-success",
                    //     },
                    // }).then((result) => {
                    //     if (result.isConfirmed) {
                    //         // Check if the URL contains "edit-invoice"
                    //         if (
                    //             window.location.href.includes("/edit-invoice/")
                    //         ) {
                    //             location.reload();
                    //         }
                    //     }
                    // });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            },
        });
    });

    $("#invoiceOutOfStockCheck").change(function () {
        let isChecked = $(this).is(":checked") ? 1 : 0;

        $.ajax({
            url: BASE_URL + "/sales/enable-or-disable-stock-check",
            method: "PUT",
            data: {
                stockCheckFlag: isChecked,
            },
            success: function (response) {
                if (response.status) {
                    console.log(response);
                    $("#out_of_check_enabled").val(response.data);
                    console.log(response.data == 1);
                    //                 response.data == 1
                    // ? $('#add_item_manual_btn').prop('disabled', false)
                    // : $('#add_item_manual_btn').prop('disabled', true);

                    //                 response.data == 1 ? $('#enableManualItem').prop('checked', true).val(1) : $('#enableManualItem').prop('checked', false).val(0);
                    // Swal.fire({
                    //     icon: "success",
                    //     text: response.message,
                    //     customClass: {
                    //         confirmButton: "btn btn-success",
                    //     },
                    // }).then((result) => {
                    //     if (result.isConfirmed) {
                    //         // Check if the URL contains "edit-invoice"
                    //         if (
                    //             window.location.href.includes("/edit-invoice/")
                    //         ) {
                    //             location.reload();
                    //         }
                    //     }
                    // });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            },
        });
    });

    // $('#manual_item_enabled').val() == '1' ? $('#add_item_manual_btn').prop('disabled', true) : $('#add_item_manual_btn').prop('disabled', false);

    console.log(
        "Flat TDs:",
        $("#invoice_table_tbody .item-discount-flat-td").length
    );
    console.log(
        "Percentage TDs:",
        $("#invoice_table_tbody .item-discount-percentage-td").length
    );
    flatpickr("#invoice_date", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
    });

    flatpickr("#prescriptionDate", {
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
        templateResult: formatRepoCustomerCode,
        templateSelection: formatRepoSelectionCustomerCode,
    });
    function formatRepoCustomerCode(repo) {
        if (repo.loading) {
            return repo.text;
        }

        var markup =
            "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" +
            repo.text +
            "-" +
            repo.customerName;
        ("</div>");

        markup += "</div></div>";

        return markup;
    }

    function formatRepoSelectionCustomerCode(repo) {
        return repo.text || repo.id;
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
            repo.itemStock;
        ("</div>");

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
        return repo.customerName || repo.text || repo.id;
    }

    // $("#customer_name").select2({
    //     placeholder: "Select Customer Name",
    //     allowClear: true,
    // });

    $("#customer_code").on("select2:select", function (e) {
        console.log(e.params.data);

        // Clear customer_name select box (optional, depends on your logic)
        $("#customer_name").empty();

        // Create and add a new option
        var newOption = new Option(
            e.params.data.customerName, // Display text
            e.params.data.id, // Value
            true, // Not selected initially
            true // Set as selected
        );

        $(newOption).data("data", e.params.data);

        // Append and trigger change
        $("#customer_name").append(newOption).trigger("change.select2");

        $("#tax_id").val(e.params.data.customerVatNumber);
    });

    $("#customer_name").on("select2:select", function (e) {
        // $("#customer_code").val(null).trigger("change");
        $("#customer_code").empty();

        var newOption = new Option(
            e.params.data.text, // customer code
            e.params.data.id,
            true,
            true
        );

        $(newOption).data("data", e.params.data);

        $("#customer_code").append(newOption).trigger("change");
        $("#tax_id").val(e.params.data.customerVatNumber);
    });

    // $("#item_name").on("select2:select", function (e) {
    //     console.log(e.params.data);

    //     var stockText = e.params.data.itemStock; // "- stock(0)"
    //     var stockMatch = stockText.match(/\((\d+)\)/);

    //     if (stockMatch) {
    //         var stockValue = stockMatch[1]; // "0"
    //         console.log("Stock:", stockValue);
    //         $("#available_stock").val(stockValue);
    //     }
    // });

    // $("#item_name").select2({
    //     placeholder: "Search Item Name",
    //     allowClear: true,
    //     minimumInputLength: 3,
    //     ajax: {
    //         url: BASE_URL + "/sales/search-item-name-by-query",
    //         dataType: "json",
    //         delay: 250,
    //         data: function (params) {
    //             var sourceBranch = $("#branchId").val();
    //             return {
    //                 itemName: params.term,
    //                 sourceBranch: sourceBranch,
    //             };
    //         },
    //         processResults: function (data) {
    //             console.log("cccc");

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
            url:
                BASE_URL +
                "/sales/search-item-name-with-batch-no-name-by-query",
            dataType: "json",
            delay: 250,
            data: function (params) {
                var sourceBranch = $("#branchId").val();
                return {
                    itemName: params.term,
                    sourceBranch: sourceBranch,
                    stockCheckFlag: $("#out_of_check_enabled").val(),
                };
            },
            processResults: function (data) {
                console.log("cccc");
                return {
                    results: data,
                };
            },
            cache: true,
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: formatRepoItemWithBatchNo,
        templateSelection: formatRepoSelectionItemWithBatchNo,
    });

    function formatRepoItemWithBatchNo(repo) {
        if (repo.loading) {
            return repo.text;
        }

        var markup =
            "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" +
            repo.text;
        ("</div>");

        markup += "</div></div>";

        return markup;
    }

    function formatRepoSelectionItemWithBatchNo(repo) {
        return repo.text || repo.id;
    }

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

    $("#doctor_select").select2({
        placeholder: "Search Provider",
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: BASE_URL + "/sales/invoice-search-doctor-by-query",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    employeeName: params.term,
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
        templateResult: formatRepoDoctorName,
        templateSelection: formatRepoDoctorNameSelection,
    });

    function formatRepoDoctorName(repo) {
        if (repo.loading) {
            return repo.text;
        }

        var markup =
            "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" +
            repo.text;
        ("</div>");

        markup += "</div></div>";

        return markup;
    }

    function formatRepoDoctorNameSelection(repo) {
        return repo.text || repo.id;
    }

    $("#patient_select").select2({
        placeholder: "Search Patient",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url: BASE_URL + "/sales/invoice-search-patient-by-query",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    clientIdNational: params.term,
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
        templateResult: formatSearch,
        templateSelection: formatSearchSelection,
    });

    function formatSearch(repo) {
        if (!repo.id) {
            return repo.text;
        }
        return $(
            `<div>
                    <strong>${repo.text}</strong><br>
                    <small>Mobile: ${repo.clientMobile} | ID: ${repo.clientIdNational} | MRN: ${repo.id}</small>
                </div>`
        );
    }

    function formatSearchSelection(repo) {
        return repo.text || repo.id;
    }
});

var purchaseOrderHtml = "";

$(document).on("click", "#add_item_btn", function () {
    $(".out_of_stock_error").html("");

    // var outOfStockCheckEnabled = $('#out_of_stock_check_enable_or_disable').val();
    // var availableStock = parseFloat($("#available_stock").val()) || 0;

    // if (outOfStockCheckEnabled == 1 && availableStock <= 0) {
    //     $(".out_of_stock_error").html("This item is out of stock.");
    //     return;
    // }

    let selectedData = $("#item_name").select2("data");
    if (!selectedData.length) return;

    let item = selectedData[0];
    console.log("Selected item:", item);
    pageLoadFlag = 1;
    var fullText = $("#item_name").select2("data")[0]?.text?.trim() || "";

    // var batchNoMatch = fullText.match(/Batch No:\s*([\w-]+)/);
    var itemCurrentStock = fullText.match(/Stock :\s*([\w-]+)/);
    console.log(itemCurrentStock[1]);
    if (parseInt($("#out_of_check_enabled").val()) == 1) {
        if (itemCurrentStock[1] <= 0) {
            $(".out_of_stock_error").html("This item is out of stock.");
            return;
        }
    }

    let batchNo = "";
    if (item.gs1 && item.gs1.is_gs1 && item.gs1.batch) {
        batchNo = item.gs1.batch;
    } else if (item.batchNo) {
        batchNo = item.batchNo;
    }

    console.log("Final Batch No:", batchNo);

    let gs1Json = item.gs1 ? JSON.stringify(item.gs1) : "";
    let expiryJson = item.gs1.expiry ? JSON.stringify(item.gs1.expiry) : "";

    console.log("GS1 JSON:", gs1Json);
    $.ajax({
        url:
            BASE_URL +
            "/purchase/purchase-order-get-item-details/" +
            $("#item_name").val(),
        type: "get",
        success: function (response) {
            if (response.status === true) {
                console.log(response.data);
                // Prepare the dropdown options based on `units`
                let options = `<option value="" >Select</option>`;
                if (response.data.units) {
                    response.data.units.forEach(function (unit) {
                        options += `<option value="${unit.itemUnitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
                    });
                }
                var rowIndex = $("#invoice_table_tbody tr").length; // Calculate index

                purchaseOrderHtml = `<tr class="item-row">
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
                                    <input type="hidden" class="service-id form-control" name="invoice_details_id[${rowIndex}]" value="0">
                                    

                                </td>
                                
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control item-quantity" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="1" data-max-stock="${itemCurrentStock[1]}">
                                    
                                </td>
                                <td class="item-unit-td" style="width: 200px;">
                                    <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${options}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="item_unit_price[${rowIndex}]" value="" readonly>
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="" readonly>
                                </td>
                                <td class="item-discount-flat-td">
                                    <input type="text" class="form-control" placeholder="%" name="item_discount_flat[${rowIndex}]" value="0">
                                </td>
                                <td class="item-discount-percentage-td">
                                    <input type="text" class="form-control" placeholder="%" name="item_discount_percentage[${rowIndex}]" value="0">
                                </td>
                                <td class="item-amount-after-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount_after_discount[${rowIndex}]" value="" readonly>
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[${rowIndex}]" value="${
                    response.data.tax.taxValueInPercentage
                }">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Vat Amount" name="item_vat_amount[${rowIndex}]" readonly>
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" readonly>
                                </td>
                               
                                <td class="item-batch-no-td">
                               <input type="text" id="item_batch_no" class="form-control item-batch-no " placeholder="Batch No" name="item_batch_no[${rowIndex}]" value="${batchNo}">
                               <input type="hidden" id="item_gs1" class="item_gs1" name="item_gs1[${rowIndex}]" value='${gs1Json}'>
                               <input type="hidden" id="item_expiry" class="item_expiry" name="item_expiry[${rowIndex}]" value='${expiryJson}'>
                            </td>
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;
                console.log("rowIndex1" + rowIndex);

                $("#invoice_table_tbody").append(purchaseOrderHtml);

                // <td class="item-purchase-price-td">
                //     <input type="text" class="form-control" placeholder="Purchase Price" name="item_purchase_price[${rowIndex}]">
                // </td>

                $(`#item_unit_${rowIndex}`)
                    .val(response.data.base_unit.itemUnitId)
                    .trigger("change");

                $(".item-unit").select2({
                    placeholder: "Selection", // Match the placeholder in the select
                    allowClear: true,
                });

                toggleDiscountColumns1();
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
                                    <input type="hidden" class="form-control" name="manual_sl_no[${rowIndex}]" value="${
        rowIndex + 1
    }">
                                                                        <input type="text" class="service-id form-control" name="manual_item_name[${rowIndex}]" value="">

                                    <input type="hidden" class="service-id form-control" name="manual_invoice_details_id[${rowIndex}]" value="">
<input type="hidden" class=" form-control" name="hidden_manual_item_batch_no[${rowIndex}]" value="">
                                </td>
                                
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control manual-item-quantity" placeholder="Quantity" name="manual_item_quantity[${rowIndex}]" value="1">
                                    
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
                                <td class="item-discount-flat-td">
                                    <input type="text" class="form-control" placeholder="%" name="manual_item_discount_flat[${rowIndex}]" value="0">
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
                                <td class="item-batch-no-td">
                              <input type="text"  class="form-control item-batch-no " placeholder="Batch No" name="manual_item_batch_no[${rowIndex}]" value="">
                            </td>
                                
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>
                            `;

    $("#invoice_table_tbody").append(purchaseOrderHtml);
    // <td class="item-purchase-price-td">
    //                                 <input type="text" class="form-control" placeholder="Purchase Price" name="manual_item_purchase_price[${rowIndex}]">
    //                             </td>

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
    toggleDiscountColumns();

    calculateTotals();
});

// $(document).on(
//     "blur",
//     "input[name^='item_discount_flat']",
//     function () {
//         // Find the closest row of the changed input
//         const row = $(this).closest("tr");
//         var quantity =
//                 parseFloat(
//                     $(`input[name="manual_item_quantity[${rowIndex}]"]`).val()
//                 ) || 0;
//             var unitPrice =
//                 parseFloat(
//                     $(`input[name="manual_item_unit_price[${rowIndex}]"]`).val()
//                 ) || 0;
//             var discountPercentage =
//                 parseFloat(
//                     $(
//                         `input[name="manual_item_discount_percentage[${rowIndex}]"]`
//                     ).val()
//                 ) || 0;
//             var vatPercentage =
//                 parseFloat(
//                     $(
//                         `input[name="manual_item_vat_percentage[${rowIndex}]"]`
//                     ).val()
//                 ) || 0;

//             var discountAmountFlat =
//                 parseFloat(
//                     $(
//                         `input[name="manual_item_discount_flat[${rowIndex}]"]`
//                     ).val()
//                 ) || 0;

//             // Calculate item amount (Quantity * Unit Price)
//             var amount = quantity * unitPrice;

//             // Apply discount
//             var discountAmount = (amount * discountPercentage) / 100;
//             var amountAfterDiscount = amount - discountAmount;

//             // Calculate VAT
//             var vatAmount = (amountAfterDiscount * vatPercentage) / 100;

//             // Calculate net amount (Amount after discount + VAT)
//             var netAmount = amountAfterDiscount + vatAmount;

//             // Set the values in the respective fields
//             $(`input[name="manual_item_amount[${rowIndex}]"]`).val(
//                 amount.toFixed(2)
//             );
//             $(
//                 `input[name="manual_item_amount_after_discount[${rowIndex}]"]`
//             ).val(amountAfterDiscount.toFixed(2));
//             $(`input[name="manual_item_vat_amount[${rowIndex}]"]`).val(
//                 vatAmount.toFixed(2)
//             );
//             $(`input[name="manual_item_net_amount[${rowIndex}]"]`).val(
//                 netAmount.toFixed(2)
//             );
//         // Update totals
//         updateTotals();
//     }
// );

$(document).on("input", 'input[name^="item_discount_percentage"], input[name^="manual_item_discount_percentage"]', function () {
    let value = parseFloat($(this).val()) || 0;
    if (value > 100) {
        $(this).val(100);
        $(this).trigger("change");
    }
    if (value < 0) {
        $(this).val(0);
        $(this).trigger("change");
    }
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

$(document).on("click", "#labelingBtn", function () {
    var invoiceId = $("#edit_invoice_id").val();
    var url = BASE_URL + "/sales/labaling-of-invoice/" + invoiceId;
    window.location.href = url;
});

$(document).on("change", "#customer_type", function () {
    $("#customer_code").val("").trigger("change");
    $("#customer_name").val("").trigger("change");
});

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

    // Reset all
    $(".amount-input").addClass("d-none").val("");
    $(".reference-input").addClass("d-none").val("");

    let numChecked = checkedBoxes.length;

    if (numChecked > 0) {
        let amounts = [];
        let baseAmount = totalAmount / numChecked;

        // First n-1 amounts
        for (let i = 0; i < numChecked - 1; i++) {
            let rounded = parseFloat(baseAmount.toFixed(2));
            amounts.push(rounded);
        }

        // Last one = total - sum of others
        let sumSoFar = amounts.reduce((a, b) => a + b, 0);
        let lastAmount = parseFloat((totalAmount - sumSoFar).toFixed(2));
        amounts.push(lastAmount);

        // Assign amounts
        checkedBoxes.each(function (index) {
            let $parent = $(this).closest(".border-bottom");
            $parent
                .find(".amount-input")
                .removeClass("d-none")
                .val(amounts[index].toFixed(2));
            $parent.find(".reference-input").removeClass("d-none");
        });
    }
});

$("#invoice_settings_btn").click(function (e) {
    $("#invoiceSettingsModal").modal("show");
    $.ajax({
        url: BASE_URL + "/sales/get-invoice-settings",
        type: "GET",
        success: function (response) {
            if (response.status) {
                console.log(response);
                console.log(response.data.invoiceStockCheck == "1");
                response.data.manualItemButton == "1"
                    ? $("#enableManualItem").prop("checked", true).val(1)
                    : $("#enableManualItem").prop("checked", false).val(0);
                response.data.invoiceStockCheck == "1"
                    ? $("#invoiceOutOfStockCheck").prop("checked", true).val(1)
                    : $("#invoiceOutOfStockCheck")
                          .prop("checked", false)
                          .val(0);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
});

$("#invoice_settings_save_btn").click(function (e) {
    $.ajax({
        url: BASE_URL + "/sales/update-invoice-stock-check-mandatory-flag",
        type: "PUT",
        data: {
            invoiceOutOfStockCheck: $("#invoiceOutOfStockCheck").is(":checked")
                ? 1
                : 0,
        },
        success: function (response) {
            if (response.status) {
                console.log(response);
                console.log(response);

                const isChecked = response.data == 1;
                $("#invoiceOutOfStockCheck")
                    .prop("checked", isChecked)
                    .val(isChecked ? 1 : 0);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
});

// When user enters a manual amount
$(document).on("input", ".amount-input", function () {
    distributeAmount($(this).val(), $(this).attr("id"));
});

$("#savebtn").click(function (e) {
    e.preventDefault();

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
                    confirmButton: "btn btn-primary waves-effect waves-light",
                },
            });
        }
    });
});

$("#invoice_save_btn").click(function () {
    let itemCount = $("#invoice_table_tbody tr").length;
    if (itemCount > 0) {
        // Serialize data from all forms and convert it to a proper format
        var invoiceFormData = $("#invoice_form").serializeArray();
        // AJAX request
        $.ajax({
            url: BASE_URL + "/sales/invoice",
            type: "POST",
            data: invoiceFormData, // Properly formatted form data
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
});

$("#damage_update_btn").click(function () {
    // Serialize data from all forms and convert it to a proper format
    var invoiceFormData = $("#invoice_form").serializeArray();
    // AJAX request
    $.ajax({
        url: BASE_URL + "/sales/update-damage/" + $("#edit_invoice_id").val(),
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
    // pageLoadFlag = 0
    const row = $(this).closest("tr");

    // Get the unit price from the selected option
    const unitPrice =
        parseFloat($(this).find(":selected").data("unit-price")) || 0;

    // Update the 'item-unit-price' field with the unit price
    row.find('input[name^="item_unit_price"]').val(unitPrice);

    // Trigger recalculations for the row
    if (pageLoadFlag == 1) {
        updateRowCalculations(row);
    }
});
// pageLoadFlag = 1;

$(document).on("change", "#branchId", function () {
    if ($(this).val()) {
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
    }
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

$(document).on("blur", 'input[name^="item_discount_flat"]', function () {
    const row = $(this).closest("tr");
    updateRowCalculationsForFlatDiscount(row);
});

$(document).on("blur", 'input[name^="manual_item_discount_flat"]', function () {
    const row = $(this).closest("tr");
    updateRowCalculationsForFlatDiscountManual(row);
});

function updateRowCalculationsForFlatDiscountManual(row) {
    const unitPrice =
        parseFloat(row.find('input[name^="manual_item_unit_price"]').val()) || 0;
    const quantity =
        parseFloat(row.find('input[name^="manual_item_quantity"]').val()) || 0;

    const itemAmount = unitPrice * quantity;

    let discountFlat =
        parseFloat(row.find('input[name^="manual_item_discount_flat"]').val()) || 0;

    if (discountFlat < 0) discountFlat = 0;
    if (discountFlat > itemAmount) discountFlat = itemAmount;

    row.find('input[name^="manual_item_discount_flat"]').val(discountFlat.toFixed(2));

    const discountedAmount = itemAmount - discountFlat;

    row.find('input[name^="manual_item_amount"]').val(itemAmount.toFixed(2));
    row.find('input[name^="manual_item_amount_after_discount"]').val(
        discountedAmount.toFixed(2)
    );

    const vatPercentage =
        parseFloat(row.find('input[name^="manual_item_vat_percentage"]').val()) || 0;
    const vatAmount = (discountedAmount * vatPercentage) / 100;
    row.find('input[name^="manual_item_vat_amount"]').val(vatAmount.toFixed(2));

    const totalAmount = discountedAmount + vatAmount;
    row.find('input[name^="manual_item_net_amount"]').val(totalAmount.toFixed(2));

    if ($("#flatDiscount").is(":checked")) {
        calculateTotalForFlat();
    } else if ($("#percentage").is(":checked")) {
        calculateTotalForPercentage();
    }
}

function applyRounding() {
    let totalWithVat = parseFloat($("#item_total_with_vat").val()) || 0;
    let roundingAmount = parseFloat($("#item_rounding_total").val()) || 0;

    // Calculate new total by subtracting rounding amount
    let newTotal = totalWithVat - roundingAmount;

    // Update the total with VAT field
    $("#item_total_with_vat").val(newTotal.toFixed(2));
}

// Event handler for when rounding amount is entered/changed
$(document).on("input", "#item_rounding_total", function () {
    let roundingAmount = parseFloat($(this).val()) || 0;

    // Get the original total (before any rounding adjustment)
    let totalWithoutVat = parseFloat($("#item_total_without_vat").val()) || 0;
    let vatAmount = parseFloat($("#item_vat_total").val()) || 0;
    let originalTotalWithVat = totalWithoutVat + vatAmount;

    // Calculate new total by subtracting rounding amount
    let newTotal = originalTotalWithVat - roundingAmount;

    // Update the total with VAT field
    $("#item_total_with_vat").val(newTotal.toFixed(2));
});

function updateRowCalculationsForFlatDiscount(row) {
    const unitPrice =
        parseFloat(row.find('input[name^="item_unit_price"]').val()) || 0;
    const quantity =
        parseFloat(row.find('input[name^="item_quantity"]').val()) || 0;

    const itemAmount = unitPrice * quantity;

    let discountFlat =
        parseFloat(row.find('input[name^="item_discount_flat"]').val()) || 0;

    if (discountFlat < 0) discountFlat = 0;
    if (discountFlat > itemAmount) discountFlat = itemAmount;

    row.find('input[name^="item_discount_flat"]').val(discountFlat.toFixed(2));

    const discountedAmount = itemAmount - discountFlat;

    row.find('input[name^="item_amount"]').val(itemAmount.toFixed(2));
    row.find('input[name^="item_amount_after_discount"]').val(
        discountedAmount.toFixed(2)
    );

    const vatPercentage =
        parseFloat(row.find('input[name^="item_vat_percentage"]').val()) || 0;
    const vatAmount = (discountedAmount * vatPercentage) / 100;
    row.find('input[name^="item_vat_amount"]').val(vatAmount.toFixed(2));

    const totalAmount = discountedAmount + vatAmount;
    row.find('input[name^="item_net_amount"]').val(totalAmount.toFixed(2));

    if ($("#flatDiscount").is(":checked")) {
        calculateTotalForFlat();
    } else if ($("#percentage").is(":checked")) {
        calculateTotalForPercentage();
    }
}

function updateRowCalculations(row) {
    // Get the unit price and quantity
    const unitPrice =
        parseFloat(row.find('input[name^="item_unit_price"]').val()) || 0;
    const quantity =
        parseFloat(row.find('input[name^="item_quantity"]').val()) || 0;

    // Calculate item amount before discount
    const itemAmount = unitPrice * quantity;
    let discountAmount = 0;
    let discountPercentage = 0;
    // Get the discount percentage and calculate discount amount
    if (row.find('input[name^="item_discount_percentage"]').val()) {
        discountPercentage =
            parseFloat(
                row.find('input[name^="item_discount_percentage"]').val()
            ) || 0;
        discountAmount = (itemAmount * discountPercentage) / 100;
    } else {
        discountPercentage =
            parseFloat(
                row.find('input[name^="manual_item_discount_percentage"]').val()
            ) || 0;
        discountAmount = (itemAmount * discountPercentage) / 100;
    }

    // Calculate item amount after discount
    discountedAmount = itemAmount - discountAmount;
    discountedAmount = roundDecimals(discountedAmount, 2);

    row.find('input[name^="item_amount"]').val(itemAmount.toFixed(2));
    row.find('input[name^="item_amount_after_discount"]').val(
        discountedAmount.toFixed(2)
    );

    // Get the VAT percentage and calculate VAT amount
    const vatPercentage =
        parseFloat(row.find('input[name^="item_vat_percentage"]').val()) || 0;
    let vatAmount = (discountedAmount * vatPercentage) / 100;
    vatAmount = truncateDecimals(vatAmount, 2);
    row.find('input[name^="item_vat_amount"]').val(vatAmount.toFixed(2));

    // Calculate the total amount with VAT
    const totalAmount = discountedAmount + vatAmount;
    row.find('input[name^="item_net_amount"]').val(totalAmount.toFixed(2));

    // Update totals for the entire table
    // calculateTotals();
    // const isFlat = $("#percentage").is(":checked");
    if ($("#percentage").is(":checked")) {
        calculateTotalForPercentage();
    }
}

const truncateDecimals = (num, decimals) => {
    const multiplier = Math.pow(10, decimals);
    return Math.floor(num * multiplier) / multiplier;
};

const roundDecimals = (num, decimals) => {
    const multiplier = Math.pow(10, decimals);
    return Math.round((num + Number.EPSILON) * multiplier) / multiplier;
};

function calculateTotalForPercentage() {
    let totalItemAmount = 0;
    let totalVatAmount = 0;
    let totalNetAmount = 0;
    let totalDiscountAmount = 0;
    let totalWithoutVat = 0;

    $("#invoice_table_tbody tr").each(function () {
        const row = $(this);

        // Normal item values
        const itemAmount =
            parseFloat(row.find('input[name^="item_amount"]').val()) || 0;
        const vatAmount =
            parseFloat(row.find('input[name^="item_vat_amount"]').val()) || 0;
        const netAmount =
            parseFloat(row.find('input[name^="item_net_amount"]').val()) || 0;
        const discountPercentage =
            parseFloat(
                row.find('input[name^="item_discount_percentage"]').val()
            ) || 0;

        // Manual item values
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
        const manualDiscountPercentage =
            parseFloat(
                row.find('input[name^="manual_item_discount_percentage"]').val()
            ) || 0;

        // Discount values
        const itemDiscountValue = (itemAmount * discountPercentage) / 100;
        const manualDiscountValue =
            (manualItemAmount * manualDiscountPercentage) / 100;

        // Without VAT
        const itemWithoutVat = itemAmount - itemDiscountValue;
        const manualItemWithoutVat = manualItemAmount - manualDiscountValue;

        // Accumulate
        totalItemAmount += itemAmount + manualItemAmount;
        totalVatAmount += vatAmount + manualVatAmount;
        totalNetAmount += netAmount + manualNetAmount;
        totalDiscountAmount += itemDiscountValue + manualDiscountValue;
        totalWithoutVat += itemWithoutVat + manualItemWithoutVat;
        totalWithoutVat = roundDecimals(totalWithoutVat, 2);
    });

    // Set totals in form
    $("#item_total").val(totalItemAmount.toFixed(2));
    $("#item_discount_amount").val(totalDiscountAmount.toFixed(2));
    $("#item_total_without_vat").val(totalWithoutVat.toFixed(2));
    $("#item_vat_total").val(totalVatAmount.toFixed(2));
    $("#item_total_with_vat").val(totalNetAmount.toFixed(2));
}

function calculateTotalForFlat() {
    let totalItemAmount = 0;
    let totalVatAmount = 0;
    let totalNetAmount = 0;
    let totalDiscountAmount = 0;
    let totalWithoutVat = 0;

    $("#invoice_table_tbody tr").each(function () {
        const row = $(this);

        // --- Normal item values ---
        const itemAmount =
            parseFloat(row.find('input[name^="item_amount"]').val()) || 0;
        const vatAmount =
            parseFloat(row.find('input[name^="item_vat_amount"]').val()) || 0;
        const netAmount =
            parseFloat(row.find('input[name^="item_net_amount"]').val()) || 0;
        const discountPercentage =
            parseFloat(
                row.find('input[name^="item_discount_percentage"]').val()
            ) || 0;
        const discountFlat =
            parseFloat(row.find('input[name^="item_discount_flat"]').val()) ||
            0;

        // --- Manual item values ---
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
        const manualDiscountPercentage =
            parseFloat(
                row.find('input[name^="manual_item_discount_percentage"]').val()
            ) || 0;
        const manualDiscountFlat =
            parseFloat(
                row.find('input[name^="manual_item_discount_flat"]').val()
            ) || 0;

        // --- Discount value logic ---
        const itemDiscountValue =
            discountFlat > 0
                ? discountFlat
                : (itemAmount * discountPercentage) / 100;
        const manualDiscountValue =
            manualDiscountFlat > 0
                ? manualDiscountFlat
                : (manualItemAmount * manualDiscountPercentage) / 100;

        // --- Totals without VAT ---
        const itemWithoutVat = itemAmount - itemDiscountValue;
        const manualItemWithoutVat = manualItemAmount - manualDiscountValue;

        // --- Accumulate ---
        totalItemAmount += itemAmount + manualItemAmount;
        totalVatAmount += vatAmount + manualVatAmount;
        totalNetAmount += netAmount + manualNetAmount;
        totalDiscountAmount += itemDiscountValue + manualDiscountValue;
        totalWithoutVat += itemWithoutVat + manualItemWithoutVat;
    });

    // --- Update totals in form ---
    $("#item_total").val(totalItemAmount.toFixed(2));
    $("#item_discount_amount").val(totalDiscountAmount.toFixed(2));
    $("#item_total_without_vat").val(totalWithoutVat.toFixed(2));
    $("#item_vat_total").val(totalVatAmount.toFixed(2));
    $("#item_total_with_vat").val(totalNetAmount.toFixed(2));
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

    // Apply rounding if there's a rounding amount
    let roundingAmount = parseFloat($("#item_rounding_total").val()) || 0;
    if (roundingAmount > 0) {
        let adjustedTotal = totalWithoutVat + totalVatAmount - roundingAmount;
        $("#item_total_with_vat").val(adjustedTotal.toFixed(2));
    }
}

function initialPageLoad(invoiceId) {
    $.ajax({
        url: BASE_URL + "/sales/edit-damage/" + invoiceId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                let invoiceNumber = response.data.invoiceNo;
                let invoiceIdVal = response.data.invoiceId;

                $("#damage_reason").val(response.data.damageReason);

                if (
                    !$("#invoice_number_pdf").find(
                        'option[value="' + invoiceIdVal + '"]'
                    ).length
                ) {
                    $("#invoice_number_pdf").append(
                        $("<option>", {
                            value: invoiceIdVal,
                            text: invoiceNumber,
                        })
                    );
                }

                $("#invoice_number_pdf").val(invoiceIdVal).trigger("change");

                console.log(response.data.damaged_items.length);
                console.log(response.data.damaged_manual_items.length);
                $("#invoice_item_cnt").val(
                    response.data.damaged_items.length +
                        response.data.damaged_manual_items.length
                );

                $("#branchId option").each(function () {
                    console.log("Option value:", $(this).val());
                });

                console.log("Clinic ID:", response.data);
                barnchDetails(response.data.clinicId);

                $("#prescriptionId").val(response.data.prescriptionId);
                $("#prescriptionDate").val(response.data.prescriptionDate);
                $("#doctor").val(response.data.doctor);
                $("#patient").val(response.data.patient);

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

                $("#tax_id").val(response.data.taxId);
                $("#currency").val(response.data.currencyId).trigger("change");
                $("#ex_rate").val(response.data.exRate);

                // // // Set the newly added or existing option as selected
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

                //

                populateManualInvoiceItems(
                    response.data.damaged_manual_items,
                    discountType
                );

                purchasedItemsTotal = pupulateInvoiceItems(
                    response.data.damaged_items,
                    discountType
                );
                $("#item_total").val(response.data.totalAmount);
                $("#item_discount_amount").val(response.data.discountAmount);
                $("#item_total_without_vat").val(
                    response.data.totalAmountAfterDiscount
                );
                $("#item_vat_total").val(response.data.vatAmount);
                $("#item_total_with_vat").val(response.data.totalAmountWithVat);

                let totalAmountAfterDiscount =
                    parseFloat(response.data.totalAmountAfterDiscount) || 0;
                let vatAmount = parseFloat(response.data.vatAmount) || 0;
                let totalAmountWithVat =
                    parseFloat(response.data.totalAmountWithVat) || 0;

                let roundingAmount =
                    totalAmountAfterDiscount + vatAmount - totalAmountWithVat;

                console.log("roundingAmount", roundingAmount);
                console.log(
                    "totalAmountAfterDiscount",
                    totalAmountAfterDiscount
                );
                console.log("vatAmount", vatAmount);
                console.log("totalAmountWithVat", totalAmountWithVat);

                $("#item_rounding_total")
                    .val(roundingAmount)
                    .prop("readonly", true);

                setTimeout(function () {
                    if (discountType == 1) {
                        $(
                            "#invoice_table_tbody .item-discount-percentage-td"
                        ).show();
                        $("#invoice_table_tbody .item-discount-flat-td").hide();
                        $("#invoice_table .discount-th").hide();
                        $("#invoice_table .discount-percentage-th").show();
                    } else {
                        $("#invoice_table_tbody .item-discount-flat-td").show();
                        $("#invoice_table .discount-th").show();
                        $("#invoice_table .discount-percentage-th").hide();
                        $(
                            "#invoice_table_tbody .item-discount-percentage-td"
                        ).hide();
                    }
                }, 100); // Delay of 100 milliseconds
                console.log(
                    "Flat TDs:",
                    $("#invoice_table_tbody .item-discount-flat-td").length
                );
                console.log(
                    "Percentage TDs:",
                    $("#invoice_table_tbody .item-discount-percentage-td")
                        .length
                );

                // $('#purchase_table_tr_count').val($('#purchase_table_tbody tr').length);
            }
            $('#table-loader').hide();
        },
        error: function (xhr, status, error) {
            $('#table-loader').hide();
            console.error("AJAX Error: ", status, error);
        },
        
    });
}

function pupulateInvoiceItems(invoiceItems, discountType) {
    $("#invoice_table_tbody").empty();
    console.log(invoiceItems);
    invoiceItems.forEach((invoiceItem, index) => {
        let unitoptions = "";
        if (invoiceItem.damaged_items_details.all_units) {
            invoiceItem.damaged_items_details.all_units.forEach(function (
                unit
            ) {
                unitoptions += `<option value="${unit.itemUnitId}" data-unit-price="${invoiceItem.unitPrice}">${unit.unit.unit_name_en}</option>`;
            });
        }
        console.log("invoiceItem", invoiceItem);
        console.log("unit", unitoptions);
        // console.log(unit.itemUnitId);
        let batchNoDisplay =
            invoiceItem.batchNo === 0 || invoiceItem.batchNo === null
                ? " "
                : invoiceItem.batchNo;

        var rowIndex = $("#invoice_table_tbody tr").length; // Calculate index
        purchaseOrderHtml = `<tr>
                                <td class="item-sl-td">
                                ${rowIndex + 1}
                                    
                                </td>
                                <td class="item-code-td">
                                    ${
                                        invoiceItem.damaged_items_details
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
                                        invoiceItem.damaged_items_details
                                            .itemName_en
                                    }
                                    <input type="hidden" class="service-id form-control" name="invoice_details_id[${rowIndex}]" value="${
            invoiceItem.invoiceDetailsId
        }">
        
                                </td>
                                
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control item-quantity" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${
            invoiceItem.quantity
        }">
                                    
                                </td>
                                <td class="item-unit-td" style="width: 200px;">
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
                                <td class="item-discount-flat-td">
                                    <input type="text" class="form-control" placeholder="%" name="item_discount_flat[${rowIndex}]" value="${
            invoiceItem.discountAmount
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
                                
                                <td class="item-batch-no-td">
                               <input type="text" id="item_batch_no" class="form-control item-batch-no " placeholder="Batch No" name="item_batch_no[${rowIndex}]" value="${batchNoDisplay}">
           </td>                     
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row" data-id="${
                                        invoiceItem.invoiceDetailsId
                                    }" data-type="${
            invoiceItem.itemMasterId
        }">X</button>
                                </td>
                            </tr>`;

        $("#invoice_table_tbody").append(purchaseOrderHtml);

        $(`#item_unit_${rowIndex}`)
            .val(invoiceItem.itemUnitId)
            .trigger("change");
        console.log(invoiceItem.itemUnitId);
        $(".item-unit").select2({
            placeholder: "Selection", // Match the placeholder in the select
            allowClear: true,
        });
    });

    // <td class="item-purchase-price-td">
    //                                 <input type="text" class="form-control" placeholder="Purchase Price" name="item_purchase_price[${rowIndex}]" value="${
    //         invoiceItem.purchasePrice
    //     }">
    //                             </td>

    // $("#item_td_count").val(indexCount);
}

function populateManualInvoiceItems(manualItems, discountType) {
    let manualInvoiceHtml = "";

    manualItems.forEach((manualItem, index) => {
        var rowIndex = $("#invoice_table_tbody tr").length + index; // Ensure correct row index

        var manualDiscountSectionHTML = appendManualDiscountSectionHTML(
            discountType,
            rowIndex,
            manualItem.discountAmount,
            manualItem.discountPercent
        );

        manualInvoiceHtml += `<tr>
            <td class="item-sl-td">${rowIndex + 1}</td>
            <td class="item-code-td">
                <input type="text" class="service-id form-control" name="manual_item_code[${rowIndex}]" value="${
            manualItem.itemCode
        }">
            </td>
            <td class="item-name-td">
                <input type="hidden" class="form-control" name="manual_item_id[${rowIndex}]" value="${
            manualItem.itemMasterId || ""
        }">
                <input type="hidden" class="form-control" name="manual_sl_no[${rowIndex}]" value="${
            rowIndex + 1
        }">
                <input type="text" class="service-id form-control" name="manual_item_name[${rowIndex}]" value="${
            manualItem.itemMasterName
        }">
                <input type="hidden" class="service-id form-control" name="manual_invoice_details_id[${rowIndex}]" value="${
            manualItem.invoiceDetailsId
        }">
        <input type="hidden" class=" form-control" name="hidden_manual_item_batch_no[${rowIndex}]" value="${
            manualItem.batchNo
        }">
            </td>
            <td class="item-quantity-td">
                <input type="number" class="form-control manual-item-quantity" placeholder="Quantity" name="manual_item_quantity[${rowIndex}]" value="${
            manualItem.quantity
        }">
            </td>
            <td class="item-unit-td" style="width: 120px;">
                <input type="text" class="service-id form-control" name="manual_item_unit[${rowIndex}]" value="${
            manualItem.unitItemName
        }">
            </td>
            <td class="item-unit-price-td">
                <input type="text" class="form-control" placeholder="Price" name="manual_item_unit_price[${rowIndex}]" value="${
            manualItem.unitPrice
        }">
            </td>
            <td class="item-amount-td">
                <input type="text" class="form-control" placeholder="Amount" name="manual_item_amount[${rowIndex}]" value="${
            manualItem.amount
        }">
            </td>
           ${manualDiscountSectionHTML}
            <td class="item-amount-after-discount-td">
                <input type="text" class="form-control" placeholder="Amount" name="manual_item_amount_after_discount[${rowIndex}]" value="${
            manualItem.amountAfterDiscount
        }">
            </td>
            <td class="vat-percentage-td">
                <input type="text" class="form-control" placeholder="Percentage" name="manual_item_vat_percentage[${rowIndex}]" value="${
            manualItem.vatPercent || 0
        }">
            </td>
            <td class="vat-amount-td">
                <input type="text" class="form-control" placeholder="Vat Amount" name="manual_item_vat_amount[${rowIndex}]" value="${
            manualItem.vatAmount
        }">
            </td>
            <td class="net-amount-td">
                <input type="text" class="form-control" placeholder="Total Amount" name="manual_item_net_amount[${rowIndex}]" value="${
            manualItem.amountWithVat
        }">
            </td>
            
            <td class="item-batch-no-td">
                               <input type="text"  class="form-control item-batch-no " placeholder="Batch No" name="manual_item_batch_no[${rowIndex}]" value="${
            manualItem.batchNo
        }">
                            </td>
            <td class="remove-td">
                <button type="button" data-id="${
                    manualItem.invoiceDetailsId
                }" data-type="${"manual-item"}" class="btn btn-danger remove-row">X</button>
            </td>
        </tr>`;
    });

    setTimeout(() => {
        $("#invoice_table_tbody").append(manualInvoiceHtml);
    }, 1000);

    // <td class="item-purchase-price-td">
    //             <input type="text" class="form-control" placeholder="Purchase Price" name="manual_item_purchase_price[${rowIndex}]" value="${
    //         manualItem.purchasePrice
    //     }">
    //         </td>

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
    console.log(vatAmount);
    // Calculate total with VAT
    let totalWithVat = totalWithoutVat + vatAmount;

    // Update the fields
    $("#item_total_without_vat").val(totalWithoutVat.toFixed(2));
    $("#item_vat_total").val(vatAmount.toFixed(2));
    $("#item_total_with_vat").val(totalWithVat.toFixed(2));

    // Apply rounding if there's a rounding amount
    let roundingAmount = parseFloat($("#item_rounding_total").val()) || 0;
    if (roundingAmount > 0) {
        let adjustedTotal = totalWithVat - roundingAmount;
        $("#item_total_with_vat").val(adjustedTotal.toFixed(2));
    }
});

function clearRounding() {
    $("#item_rounding_total").val("0.00");

    // Recalculate total without rounding
    let totalWithoutVat = parseFloat($("#item_total_without_vat").val()) || 0;
    let vatAmount = parseFloat($("#item_vat_total").val()) || 0;
    let originalTotal = totalWithoutVat + vatAmount;

    $("#item_total_with_vat").val(originalTotal.toFixed(2));
}

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
    var invoiceId = $("#edit_invoice_id").val();

    // if (invoiceDetailsId > 0 && itemId > 0) {
    //     // deleteAlreadyExistItem(invoiceId, invoiceDetailsId, itemId);
    // } else if (invoiceDetailsId > 0 && itemId === "manual-item") {
    //     deleteAlreadyExistItem(invoiceId, invoiceDetailsId, itemId);
    // } else {
    if ($("#flatDiscount").is(":checked")) {
        calculateTotalForFlat();
    } else if ($("#percentage").is(":checked")) {
        calculateTotalForPercentage();
    }
    // }
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
function deleteAlreadyExistItem(invoiceId, invoiceDetailsId, itemId) {
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
                    itemId +
                    "/" +
                    invoiceId, // Adjust URL if needed
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
    console.log("Entered Value =>", enteredAmount);
    console.log("Entered ID =>", inputId);

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
    Object.values(manualEntries).forEach((value) => {
        remainingAmount -= value;
    });

    console.log("Remaining Amount after Manual Entries:", remainingAmount);

    // Collect input fields that need automatic split
    checkedBoxes.each(function () {
        let amountInput = $(this)
            .closest(".d-flex")
            .nextAll(".amount-input")
            .first();
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
        let errorMessage =
            '<span class="error-message" style="color: red;">Negative split amount is not allowed!</span>';
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
        $('#page-loader').show();
        // Serialize data from all forms and convert it to a proper format
        var invoiceFormData = $("#invoice_form").serialize();
        var paymentFormData = $("#paymentForm").serialize();
        var combinedData = invoiceFormData + "&" + paymentFormData;
        // AJAX request
        $.ajax({
            url: BASE_URL + "/sales/damage",
            type: "POST",
            data: combinedData, // Properly formatted form data
            success: function (response) {
                $('#page-loader').hide();
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
                $('#page-loader').hide();
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
                            key.startsWith("item_purchase_price.") ||
                            key.startsWith("item_id.")
                        ) {
                            var fieldParts = key.split(".");
                            var fieldIndex = fieldParts[1];
                            var fieldName = fieldParts[0];

                            if (fieldName === "item_id") {
                                fieldName = "item_quantity";
                                $("#invoicePaymentOptionModal").modal("hide");
                            }
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
                    $('#page-loader').hide();
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
    let itemCount = $("#invoice_table_tbody tr").length;
    if (itemCount > 0) {
        $('#page-loader').show();
        // Serialize data from all forms and convert it to a proper format
        var invoiceFormData = $("#invoice_form").serialize();
        var paymentFormData = $("#paymentForm").serialize();
        var combinedData = invoiceFormData + "&" + paymentFormData;
        // AJAX request
        $.ajax({
            url: BASE_URL + "/sales/update-invoice/" + invoiceId,
            type: "PUT",
            data: combinedData, // Properly formatted form data
            success: function (response) {
                $('#page-loader').hide();
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
                $('#page-loader').hide();
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
                            key.startsWith("item_purchase_price.") ||
                            key.startsWith("item_id.")
                        ) {
                            var fieldParts = key.split(".");
                            var fieldIndex = fieldParts[1];
                            var fieldName = fieldParts[0];
                            if (fieldName === "item_id") {
                                fieldName = "item_quantity";
                                $("#invoicePaymentOptionModal").modal("hide");
                            }
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

function toggleVatField() {
    let customerType = $("#customer_type").val();
    if (customerType === "b2c") {
        $(".tax_id").closest(".col-3").hide();
    } else {
        $(".tax_id").closest(".col-3").show();
    }
}

function toggleDiscountColumns() {
    const isFlat = $("#percentage").is(":checked");
    if (isFlat) {
        $("#invoice_table_tbody .item-discount-percentage-td").show();
        $("#invoice_table_tbody .item-discount-flat-td").hide();
        $("#invoice_table .discount-th").hide();
        $("#invoice_table .discount-percentage-th").show();
    } else {
        $("#invoice_table_tbody .item-discount-flat-td").show();
        $("#invoice_table_tbody .item-discount-percentage-td").hide();
        $("#invoice_table .discount-th").show();
        $("#invoice_table .discount-percentage-th").hide();
    }

    // setZeroToDiscountFields();
    // if (!$("#edit_invoice_id").val()) {
    recalculateInvoiceTableRow(isFlat);
    // }
}

function toggleDiscountColumns1() {
    const isFlat = $("#percentage").is(":checked");
    if (isFlat) {
        $("#invoice_table_tbody .item-discount-percentage-td").show();
        $("#invoice_table_tbody .item-discount-flat-td").hide();
        $("#invoice_table .discount-th").hide();
        $("#invoice_table .discount-percentage-th").show();
    } else {
        $("#invoice_table_tbody .item-discount-flat-td").show();
        $("#invoice_table_tbody .item-discount-percentage-td").hide();
        $("#invoice_table .discount-th").show();
        $("#invoice_table .discount-percentage-th").hide();
    }

    // setZeroToDiscountFields();
    // if (!$("#edit_invoice_id").val()) {
    // recalculateInvoiceTableRow(isFlat);
    // }
}

function recalculateInvoiceTableRow(isFlat) {
    if (isFlat) {
        $("#invoice_table_tbody tr").each(function () {
            const row = $(this);
            row.find('input[name^="item_discount_percentage"]').val(0);
            row.find('input[name^="manual_item_discount_percentage"]').val(0);

            // Get the discount percentage and calculate discount amount
            if (row.find('input[name^="item_discount_percentage"]').val()) {
                const unitPrice =
                    parseFloat(
                        row.find('input[name^="item_unit_price"]').val()
                    ) || 0;
                const quantity =
                    parseFloat(
                        row.find('input[name^="item_quantity"]').val()
                    ) || 0;

                // Calculate item amount before discount
                const itemAmount = unitPrice * quantity;
                let discountAmount = 0;
                let discountPercentage = 0;
                discountPercentage =
                    parseFloat(
                        row
                            .find('input[name^="item_discount_percentage"]')
                            .val()
                    ) || 0;
                discountAmount = (itemAmount * discountPercentage) / 100;
                // Calculate item amount after discount
                discountedAmount = itemAmount - discountAmount;
                row.find('input[name^="item_amount"]').val(
                    itemAmount.toFixed(2)
                );
                row.find('input[name^="item_amount_after_discount"]').val(
                    discountedAmount.toFixed(2)
                );

                // Get the VAT percentage and calculate VAT amount
                const vatPercentage =
                    parseFloat(
                        row.find('input[name^="item_vat_percentage"]').val()
                    ) || 0;
                const vatAmount = (discountedAmount * vatPercentage) / 100;
                row.find('input[name^="item_vat_amount"]').val(
                    vatAmount.toFixed(2)
                );

                // Calculate the total amount with VAT
                const totalAmount = discountedAmount + vatAmount;
                row.find('input[name^="item_net_amount"]').val(
                    totalAmount.toFixed(2)
                );
            } else {
                const unitPrice =
                    parseFloat(
                        row.find('input[name^="manual_item_unit_price"]').val()
                    ) || 0;
                const quantity =
                    parseFloat(
                        row.find('input[name^="manual_item_quantity"]').val()
                    ) || 0;

                // Calculate item amount before discount
                const itemAmount = unitPrice * quantity;
                let discountAmount = 0;
                let discountPercentage = 0;
                discountPercentage =
                    parseFloat(
                        row
                            .find(
                                'input[name^="manual_item_discount_percentage"]'
                            )
                            .val()
                    ) || 0;
                discountAmount = (itemAmount * discountPercentage) / 100;
                // alert(discountAmount);
                // Calculate item amount after discount
                discountedAmount = itemAmount - discountAmount;
                console.log(
                    discountedAmount + "=" + itemAmount + "-" + discountAmount
                );
                row.find('input[name^="manual_item_amount"]').val(
                    itemAmount.toFixed(2)
                );
                row.find(
                    'input[name^="manual_item_amount_after_discount"]'
                ).val(discountedAmount.toFixed(2));

                // Get the VAT percentage and calculate VAT amount
                const vatPercentage =
                    parseFloat(
                        row
                            .find('input[name^="manual_item_vat_percentage"]')
                            .val()
                    ) || 0;
                const vatAmount = (discountedAmount * vatPercentage) / 100;
                row.find('input[name^="manual_item_vat_amount"]').val(
                    vatAmount.toFixed(2)
                );

                // Calculate the total amount with VAT
                const totalAmount = discountedAmount + vatAmount;
                row.find('input[name^="manual_item_net_amount"]').val(
                    totalAmount.toFixed(2)
                );
            }
        });
        calculateTotalForPercentage();
    } else {
        $("#invoice_table_tbody tr").each(function () {
            const row = $(this);
            row.find('input[name^="item_discount_flat"]').val(0);
            row.find('input[name^="manual_item_discount_flat"]').val(0);
            // Get the unit price and quantity
            if (row.find('input[name^="item_discount_flat"]').val()) {
                const unitPrice =
                    parseFloat(
                        row.find('input[name^="item_unit_price"]').val()
                    ) || 0;
                const quantity =
                    parseFloat(
                        row.find('input[name^="item_quantity"]').val()
                    ) || 0;

                // Calculate item amount before discount
                const itemAmount = unitPrice * quantity;

                // Get the discount percentage and calculate discount amount
                const discountFlat =
                    parseFloat(
                        row.find('input[name^="item_discount_flat"]').val()
                    ) || 0;
                // const discountAmount = (itemAmount * discountPercentage) / 100;

                // Calculate item amount after discount
                const discountedAmount = itemAmount - discountFlat;
                row.find('input[name^="item_amount"]').val(
                    itemAmount.toFixed(2)
                );
                row.find('input[name^="item_amount_after_discount"]').val(
                    discountedAmount.toFixed(2)
                );

                // Get the VAT percentage and calculate VAT amount
                const vatPercentage =
                    parseFloat(
                        row.find('input[name^="item_vat_percentage"]').val()
                    ) || 0;
                const vatAmount = (discountedAmount * vatPercentage) / 100;
                row.find('input[name^="item_vat_amount"]').val(
                    vatAmount.toFixed(2)
                );

                // Calculate the total amount with VAT
                const totalAmount = discountedAmount + vatAmount;
                row.find('input[name^="item_net_amount"]').val(
                    totalAmount.toFixed(2)
                );
            } else {
                const unitPrice =
                    parseFloat(
                        row.find('input[name^="manual_item_unit_price"]').val()
                    ) || 0;
                const quantity =
                    parseFloat(
                        row.find('input[name^="manual_item_quantity"]').val()
                    ) || 0;

                // Calculate item amount before discount
                const itemAmount = unitPrice * quantity;

                // Get the discount percentage and calculate discount amount
                const discountFlat =
                    parseFloat(
                        row
                            .find('input[name^="manual_item_discount_flat"]')
                            .val()
                    ) || 0;
                // const discountAmount = (itemAmount * discountPercentage) / 100;

                // Calculate item amount after discount
                const discountedAmount = itemAmount - discountFlat;
                row.find('input[name^="manual_item_amount"]').val(
                    itemAmount.toFixed(2)
                );
                row.find(
                    'input[name^="manual_item_amount_after_discount"]'
                ).val(discountedAmount.toFixed(2));

                // Get the VAT percentage and calculate VAT amount
                const vatPercentage =
                    parseFloat(
                        row
                            .find('input[name^="manual_item_vat_percentage"]')
                            .val()
                    ) || 0;
                const vatAmount = (discountedAmount * vatPercentage) / 100;
                row.find('input[name^="manual_item_vat_amount"]').val(
                    vatAmount.toFixed(2)
                );

                // Calculate the total amount with VAT
                const totalAmount = discountedAmount + vatAmount;
                row.find('input[name^="manual_item_net_amount"]').val(
                    totalAmount.toFixed(2)
                );
            }
        });
        calculateTotalForFlat();
    }

    // Update overall totals
    // if (!$("#edit_purchase_item_bill_id").val()) {
    //     updateTotals();
    // }

    // calculateTotals();
}

function setZeroToDiscountFields() {
    $("#invoice_table_tbody tr").each(function () {
        const row = $(this);

        row.find('input[name^="item_discount_flat"]').val(0);
        row.find('input[name^="manual_item_discount_flat"]').val(0);

        row.find('input[name^="item_discount_percentage"]').val(0);
        row.find('input[name^="manual_item_discount_percentage"]').val(0);
    });
}

function appendManualDiscountSectionHTML(
    discountType,
    rowIndex,
    discountAmount,
    discountPercent
) {
    if (discountType == 1) {
        return `<td class="item-discount-flat-td" style="display: none;">
                                    <input type="text" class="form-control" placeholder="%" name="manual_item_discount_flat[${rowIndex}]" value="${discountAmount}">
                                </td>
            <td class="item-discount-percentage-td">
                <input type="text" class="form-control" placeholder="%" name="manual_item_discount_percentage[${rowIndex}]" value="${discountPercent}">
            </td>`;
    } else {
        return `<td class="item-discount-flat-td" >
                                    <input type="text" class="form-control" placeholder="%" name="manual_item_discount_flat[${rowIndex}]" value="${discountAmount}">
                                </td>
            <td class="item-discount-percentage-td" style="display: none;">
                <input type="text" class="form-control" placeholder="%" name="manual_item_discount_percentage[${rowIndex}]" value="${discountPercent}">`;
    }
}

function barnchDetails(branchId) {
    $.ajax({
        url: BASE_URL + "/sales/get-branch-details/" + branchId,
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
}

$(document).on("click", "#customerInfoBtn", function () {
    if ($("#customer_name").val() && $("#customer_code").val()) {
        $.ajax({
            url:
                BASE_URL +
                "/sales/customer-details/" +
                $("#customer_name").val(),
            type: "get",
            success: function (response) {
                $("#customerInfoModal").modal("show");
                console.log(response.data);
                if (response.data.customerType == "b2c") {
                    var customer_header = "B2C Customer Information";
                } else {
                    var customer_header = "B2B Customer Information";
                }
                $("#customer_header").text(customer_header);
                $("#view_b2b_customer_code").text(
                    response.data.customerNo || "-"
                );
                $("#view_b2b_customer_name_en").text(
                    response.data.customerName || "-"
                );
                $("#view_b2b_customer_name_ar").text(
                    response.data.customerNameArabic || "-"
                );
                $("#view_b2b_customer_addl_no").text(
                    response.data.addlNo || "-"
                );
                $("#view_b2b_customer_building_no").text(
                    response.data.buildingNo || "-"
                );
                $("#view_b2b_customer_street").text(
                    response.data.streetName || "-"
                );
                $("#view_b2b_customer_city").text(response.data.city || "-");
                $("#view_b2b_customer_district").text(
                    response.data.district || "-"
                );
                $("#view_b2b_customer_country").text(
                    response.data.country || "-"
                );
                $("#view_b2b_customer_postal_code").text(
                    response.data.postalCode || "-"
                );
                $("#view_b2b_customer_vat").text(
                    response.data.vatNumber || "-"
                );
                $("#view_b2b_customer_mobile").text(
                    response.data.mobileNumber || "-"
                );
                $("#view_b2b_customer_phone").text(response.data.phone || "-");
                $("#view_b2b_customer_due_date").text(
                    response.data.dueDate || "-"
                );
                $("#view_b2b_idNational").text(response.data.idNational || "-");
                $("#view_b2b_customer_address").text(
                    response.data.address || "-"
                );
                $("#view_b2b_customer_address_ar").text(
                    response.data.addressArabic || "-"
                );
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            },
        });
    }
});

// Prevent typing minus (-) or scientific notation (e)
$(document).on("keydown", ".item-quantity, .manual-item-quantity", function (e) {
    if (e.key === "-" || e.key === "e") {
        e.preventDefault();
    }
});

// Ensure value stays 0 or above
$(document).on("input", ".item-quantity, .manual-item-quantity", function () {
    let val = parseFloat($(this).val());
    if (isNaN(val) || val < 0) {
        $(this).val(0); // reset to 0 if invalid or negative
    }
});

$(document).on("change blur", ".item-quantity", function () {
    let $input = $(this);
    let maxStock = parseInt($input.data("max-stock"));

    if (isNaN(maxStock)) return;

    let enteredQty = parseInt($input.val()) || 0;

    if (enteredQty < 1) {
        $input.val(1);
        enteredQty = 1;
    }

    if (parseInt($("#out_of_check_enabled").val()) == 1 && enteredQty > maxStock) {
        $input.addClass("is-invalid");
        let $row = $input.closest("tr");
        $row.find(".qty-stock-error").remove();
        $input.after(
            `<span class="text-danger qty-stock-error" style="font-size:11px;">
                Max stock: ${maxStock}
            </span>`
        );
        $input.val(maxStock);
    } else {
        $input.removeClass("is-invalid");
        $input.closest("tr").find(".qty-stock-error").remove();
    }
});
