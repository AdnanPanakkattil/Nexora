$(document).ready(function () {
    $("#branch_stoke_transfer_main_menu").addClass(
        "active open menu-item-animating"
    );
    $("#branch_stoke_transfer_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var selectElement = $("#source_branch");

    // Check if the number of options (excluding the first empty option) is 1
    if (selectElement.find("option").length === 2) {
        // One option + "Select"
        // Set the default value to the only available option
        selectElement
            .val(selectElement.find("option").not(":first").val())
            .trigger("change");
    }

    var destinationSelectElement = $("#destination_branch");

    // Check if the number of options (excluding the first empty option) is 1
    if (destinationSelectElement.find("option").length === 2) {
        // One option + "Select"
        // Set the default value to the only available option
        destinationSelectElement
            .val(destinationSelectElement.find("option").not(":first").val())
            .trigger("change");
    }

    if ($("#edit_stock_transfer_id").val()) {
        initialPageLoad($("#edit_stock_transfer_id").val());
    }

    flatpickr("#delivery_date", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
    });

    flatpickr("#transferDate", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
        defaultDate: new Date(), // Set today's date
    });

    // branch-stock-transfer.js
    function formatRepo(repo) {
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

    function formatRepoSelection(repo) {
        return repo.text || repo.id;
    }

    $("#item_vendor_code").select2({
        placeholder: "Search Vendor",
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

    $("#item_vendor_code").on("select2:select", function (e) {
        // $("#item_vendor_name").val(e.params.data.customerName);
        // Check if the option already exists
        if (
            $(
                "#item_vendor_name option[value='" +
                e.params.data.customerName +
                "']"
            ).length === 0
        ) {
            $("#item_vendor_name").append(
                new Option(
                    e.params.data.customerName,
                    e.params.data.customerName,
                    true,
                    true
                )
            );
        }

        // Set the selected value
        $("#item_vendor_name")
            .val(e.params.data.customerName)
            .trigger("change");
    });

    // $("#item_name").select2({
    //     placeholder: "Search Item Name",
    //     allowClear: true,
    //     minimumInputLength: 3,
    //     ajax: {
    //         // url: BASE_URL + "/sales/search-item-name-by-query",
    //         url: BASE_URL + "/branchstocktransfer/search-item-name-by-query",

    //         dataType: "json",
    //         delay: 250,
    //         data: function (params) {
    //             var sourceBranch = $("#source_branch").val();
    //             if (!sourceBranch) {
    //                 $("#item_name")
    //                     .next(".select2-container")
    //                     .find(".select2-selection__rendered")
    //                     .html(
    //                         '<span class="text-danger">Please select source branch</span>'
    //                     );
    //                 return {
    //                     itemName: params.term,
    //                     sourceBranch: sourceBranch,
    //                 };
    //             } else {
    //                 $("#item_name")
    //                     .next(".select2-container")
    //                     .find(".select2-selection__rendered")
    //                     .html("");
    //                 return {
    //                     itemName: params.term,
    //                     sourceBranch: sourceBranch,
    //                 };
    //             }
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

    if ($("#item_name").data("select2")) {
        $("#item_name").select2("destroy");
    }
    if ($("#item_name").parent().hasClass('position-relative')) {
        $("#item_name").unwrap();
    }
    $("#item_name").wrap('<div class="position-relative" style="width: 100%; flex: 1;"></div>');

    $("#item_name").select2({
        dropdownParent: $("#item_name").parent(),
        width: "100%",
        placeholder: "Search Item Name",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url:
                BASE_URL +
                "/branchstocktransfer/search-item-name-with-batch-no-name-by-query",
            dataType: "json",
            delay: 250,
            data: function (params) {
                var sourceBranch = $("#source_branch").val();
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

    var purchaseOrderHtml = "";

    $(document).on("click", "#add_item_btn", function () {
        $(".item_stock_error").text("");
        let selectedData = $("#item_name").select2("data");
        if (!selectedData.length) return;

        let item = selectedData[0];
        console.log("Selected item:", item);

        var serviceName = "";
        var serviceCode = " ";
        // var fullText = $("#item_name").text().trim();
        var fullText = $("#item_name").select2("data")[0]?.text?.trim() || "";

        // var batchNoMatch = fullText.match(/Batch No:\s*([\w-]+)/);
        // var batchNoMatch = fullText.match(/Batch No:\s*([\w-]+)/);
        var itemCurrentStock = fullText.match(/Stock :\s*([\w-]+)/);
        console.log(itemCurrentStock[1]);
        var itemstock = parseInt(itemCurrentStock[1]);
        if (itemstock > 0) {
            // if (batchNoMatch == null) {
            //     var batchNo = "";
            // } else {
            //     console.log(batchNoMatch[1] == "N");
            //     if (batchNoMatch[1] == "N") {
            //         var batchNo = "";
            //     } else {
            //         var batchNo = batchNoMatch ? batchNoMatch[1] : "";
            //     }
            // }

            // var batchNo = batchNoMatch ? batchNoMatch[1] : '';

            let batchNo = "";
            if (item.gs1 && item.gs1.is_gs1 && item.gs1.batch) {
                batchNo = item.gs1.batch;
            } else if (item.batchNo) {
                batchNo = item.batchNo;
            }

            console.log("Final Batch No:", batchNo);

            // console.log("Batch No:", batchNo);
            var match = fullText.match(
                /(.+?)\s*(?:\(([^)]+)\))?\s*-\s*\d+(\.\d+)?\s*$/
            );
            if (match) {
                var serviceName = match[1].trim();
                var serviceCode = match[2] ? match[2].trim() : null;
            }

            let gs1Json = item.gs1 ? JSON.stringify(item.gs1) : "{}";
            $.ajax({
                url:
                    BASE_URL +
                    "/sales/sales-invoice-get-item-details/" +
                    $("#item_name").val().split("_")[0],
                type: "get",
                success: function (response) {
                    if (response.status === true) {
                        // Prepare the dropdown options based on `units`
                        let options = `<option value="" >Select</option>`;
                        if (response.data.units) {
                            response.data.units.forEach(function (unit) {
                                options += `<option value="${unit.itemUnitId}" data-unit-price="${unit.costPrice}">${unit.unit.unit_name_en}</option>`;
                            });
                        }
                        var rowIndex = $(
                            "#branch_stock_transfer_table_tbody tr"
                        ).length; // Calculate index
                        purchaseOrderHtml = `<tr>
                                <td class="item-sl-td">
                                ${rowIndex + 1}
                                    
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="form-control" name="item_id[${rowIndex}]" value="${
                            response.data.itemMasterId
                            }">
                                    <input type="hidden" class="form-control" name="sl_no[${rowIndex}]" value="${
                            rowIndex + 1
                            }">
                                    ${response.data.itemName_en}
        <input type="hidden" class="service-id form-control" name="stock_transfer_item_id[${rowIndex}]" value="0">

                                </td>
                                    <input type="hidden" class="item-master-id" name="item_master_id[${rowIndex}]" value="${response.data.itemMasterId}">
                                    <input type="hidden" class="item-available-stock" value="${itemstock}">
                                    <input type="number" class="form-control item-quantity" 
                                        placeholder="Quantity" 
                                        name="item_quantity[${rowIndex}]" 
                                        value="1" 
                                        step="1" 
                                        max="${itemstock}">
                                <td class="item-code-td">
                                    ${response.data.itemCode}
                                </td>
                                
                                
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control item-quantity" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="1" max="${itemstock}">
                                </td>
                                <td class="item-unit-td" style="width: 120px;">
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
                                <td class="item-batch-no-td">
                               <input type="text" id="item_batch_no_${rowIndex}" class="form-control item-batch-no " placeholder="Batch No" name="item_batch_no[${rowIndex}]" value="${batchNo}">
                               <input type="hidden" id="item_gs1" class="item_gs1" name="item_gs1[${rowIndex}]" value='${gs1Json}'>
            </td> 
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

                        $("#branch_stock_transfer_table_tbody").append(
                            purchaseOrderHtml
                        );

                        $(".item-unit").select2({
                            placeholder: "Selection", // Match the placeholder in the select
                            allowClear: true,
                        });

                        $(`#item_unit_${rowIndex}`)
                            .val(response.data.base_unit.itemUnitId)
                            .trigger("change");

                        updateSlColumn();
                    } else {
                        console.error("Service details not found");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error:", error);
                },
            });
        } else {
            $(".item_stock_error").text(
                "Stock is 0. You cannot add this item."
            );
        }

        $("#item_name").val("").trigger("change");
    });

    $(document).on("change", "#source_branch", function () {
        var sourceBranchId = $(this).val();
        var destinationBranchId = $("#destination_branch").val();

        if (sourceBranchId == destinationBranchId && sourceBranchId != "") {
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Source and Destination branches cannot be the same.",
                customClass: {
                    confirmButton: "btn btn-warning waves-effect waves-light",
                },
            });
            $(this).val("").trigger("change");
            return;
        }

        if ($(this).val() == "") return;
        $.ajax({
            // url: BASE_URL + "/get-patient-by-id",
            url:
                BASE_URL +
                "/branchstocktransfer/get-item-department-by-branch-id/" +
                $(this).val(),
            type: "GET",
            success: function (response) {
                if (response.status) {
                    const departmentSelect = $("#source_branch_department");

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

    $(document).on("change", "#destination_branch", function () {
        var destinationBranchId = $(this).val();
        var sourceBranchId = $("#source_branch").val();

        if (sourceBranchId == destinationBranchId && destinationBranchId != "") {
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Source and Destination branches cannot be the same.",
                customClass: {
                    confirmButton: "btn btn-warning waves-effect waves-light",
                },
            });
            $(this).val("").trigger("change");
            return;
        }

        if ($(this).val() == "") return;
        $.ajax({
            // url: BASE_URL + "/get-patient-by-id",
            url:
                BASE_URL +
                "/branchstocktransfer/get-item-department-by-branch-id/" +
                $(this).val(),
            type: "GET",
            success: function (response) {
                if (response.status) {
                    const departmentSelect = $(
                        "#destination_branch_department"
                    );

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

    $("#branch_stock_transfer_settings_btn").click(function (e) {
        $("#branchStockTransferSettingsModal").modal("show");
        $.ajax({
            url:
                BASE_URL +
                "/branchstocktransfer/get-branch-stock-transfer-check-mandatory",
            type: "GET",
            success: function (response) {
                if (response.status) {
                    console.log(response);
                    console.log(response);

                    const isChecked = response.data == 1;
                    $("#stockTransferOutOfStockCheck")
                        .prop("checked", isChecked)
                        .val(isChecked ? 1 : 0);
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error: ", status, error);
            },
        });
    });

    $("#branchstocktransfer_settings_save_btn").click(function (e) {
        $.ajax({
            url:
                BASE_URL +
                "/branchstocktransfer/update-branch-stock-transfer-stock-check-mandatory-flag",
            type: "PUT",
            data: {
                stockTransferOutOfStockCheck: $(
                    "#stockTransferOutOfStockCheck"
                ).is(":checked")
                    ? 1
                    : 0,
            },
            success: function (response) {
                if (response.status) {
                    console.log(response);
                    console.log(response);

                    const isChecked = response.data == 1;
                    $("#stockTransferOutOfStockCheck")
                        .prop("checked", isChecked)
                        .val(isChecked ? 1 : 0);
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error: ", status, error);
            },
        });
    });

    $("#branch_stock_transfer_save_btn").click(function () {
        let itemCount = $("#branch_stock_transfer_table_tbody tr").length;

        if (itemCount > 0) {
            var branchStockTransferFormData = $(
                "#branch_stock_transfer_form"
            ).serializeArray();

            $("#loader-overlay").show();

            $.ajax({
                url: BASE_URL + "/branchstocktransfer/branch-stock-transfer",
                type: "POST",
                data: branchStockTransferFormData,

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
                            window.location.href =
                                "/branchstocktransfer/branch-stock-transfer-lists";
                        });
                    }
                },

                error: function (xhr) {
                    if (xhr.status === 422) {
                        $(".error-text").text();

                        var errors = xhr.responseJSON.errors;
                        $.each(errors, function (key, value) {
                            if (
                                key.startsWith("source_branch.") ||
                                key.startsWith("destination_branch.") ||
                                key.startsWith("receiver_note.") ||
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
                                    "#branch_stock_transfer_table_tbody tr"
                                ).eq(fieldIndex);
                                var targetCell = targetRow.find(
                                    `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`
                                );

                                if (targetCell.length) {
                                    if (targetCell.is("select")) {
                                        targetCell
                                            .next(".select2-container")
                                            .after(
                                                `<span class="text-danger error-text">${value[0]}</span>`
                                            );
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
                        Swal.fire({
                            icon: "error",
                            title: "Access denied",
                            text:
                                xhr.responseJSON?.message ||
                                "An unexpected error occurred. Please try again.",
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                        });
                    }
                },
                complete: function () {
                    $("#loader-overlay").hide();
                },
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

    $("#branch_stock_transfer_update_btn").click(function () {
        var branchStockTransferFormData = $(
            "#branch_stock_transfer_form"
        ).serializeArray();
        $("#loader-overlay").show();
        $.ajax({
            url:
                BASE_URL +
                "/branchstocktransfer/update-branch-stock-transfer/" +
                $("#edit_stock_transfer_id").val(),
            type: "PUT",
            data: branchStockTransferFormData,
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
                          window.location.href = BASE_URL + "/branchstocktransfer/branch-stock-transfer-lists";
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
                         window.location.href = BASE_URL + "/branchstocktransfer/branch-stock-transfer-lists";
                    });
                }
            },
            error: function (xhr) {
                if (xhr.status === 422) {
                    $(".error-text").text();

                    var errors = xhr.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        if (
                            key.startsWith("source_branch.") ||
                            key.startsWith("destination_branch.") ||
                            key.startsWith("receiver_note.") ||
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
                            var targetCell = targetRow.find(
                                `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`
                            );

                            if (targetCell.length) {
                                if (targetCell.is("select")) {
                                    targetCell
                                        .next(".select2-container")
                                        .after(
                                            `<span class="text-danger error-text">${value[0]}</span>`
                                        );
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
                    Swal.fire({
                        icon: "error",
                        title: "Access denied",
                        text:
                            xhr.responseJSON?.message ||
                            "An unexpected error occurred. Please try again.",
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
            complete: function () {
                $("#loader-overlay").hide();
            },
        });
    });
});

// Remove row and update SL column
$(document).on("click", ".remove-row", function () {
    $(this).closest("tr").remove();
    var stockTransferItemId = $(this).data("id");
    var itemMasterId = $(this).data("type");
    if (stockTransferItemId > 0 && itemMasterId > 0) {
        deleteAlreadyExistItem(stockTransferItemId, itemMasterId);
    }
    updateSlColumn();
    calculateTotals();
});

// Update SL column sequence
function updateSlColumn() {
    $("#branch_stock_transfer_table_tbody tr").each(function (index) {
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
        $(this).closest("tr").find(".item-unit").trigger("change");
    }
);

function calculateTotals() {
    let totalAmount = 0;
    let totalVat = 0;
    let netAmount = 0;
    let totalVatPercentage = 0;

    // Loop through each row in the table body
    $("#branch_stock_transfer_table_tbody tr").each(function () {
        const row = $(this);

        // Ensure the input values are being read correctly
        const amount =
            parseFloat(row.find('input[name^="item_amount"]').val()) || 0;
        const vatAmount =
            parseFloat(row.find('input[name^="item_vat_amount"]').val()) || 0;
        const netAmountWithVat =
            parseFloat(row.find('input[name^="item_net_amount"]').val()) || 0;
        const vatPercentage =
            parseFloat(row.find('input[name^="item_vat_percentage"]').val()) ||
            0;

        // Accumulate the totals
        totalAmount += amount;
        totalVat += vatAmount;
        netAmount += netAmountWithVat;
        totalVatPercentage += vatPercentage;
    });

    // Debugging: Log values to verify calculations

    // Update the total fields in the form
    $("#item_total").val(totalAmount.toFixed(2));
    $("#item_vat_total").val(totalVat.toFixed(2));
    $("#item_total_with_vat").val(netAmount.toFixed(2));
    $("#item_vat_total_percentage").val(totalVatPercentage.toFixed(2));
}

$(document).on(
    "input",
    "#item_discount_percentage, #item_total, #item_vat_total_percentage",
    function () {
        calculateDiscountAndTotals();
    }
);

function calculateDiscountAndTotals() {
    let totalAmount = parseFloat($("#item_total").val()) || 0;
    let discountPercentage =
        parseFloat($("#item_discount_percentage").val()) || 0;

    // Calculate total VAT percentage from all items
    let totalVatPercentage = 0;
    $(".item-vat-percentage").each(function () {
        let vatValue = parseFloat($(this).val()) || 0;
        totalVatPercentage += vatValue;
    });
    $("#item_vat_total_percentage").val(totalVatPercentage.toFixed(2));

    // Use calculated VAT percentage
    let vatPercentage = totalVatPercentage;

    // Calculate discount amount
    let discountAmount = (totalAmount * discountPercentage) / 100;
    $("#item_discount_amount").val(discountAmount.toFixed(2));

    // Calculate total after discount
    let totalAfterDiscount = totalAmount - discountAmount;
    $("#item_total_after_discount").val(totalAfterDiscount.toFixed(2));

    // Calculate VAT amount
    let vatAmount = (totalAfterDiscount * vatPercentage) / 100;
    $("#item_vat_total").val(vatAmount.toFixed(2));

    // Calculate final total with VAT
    let totalWithVat = totalAfterDiscount + vatAmount;
    $("#item_total_with_vat").val(totalWithVat.toFixed(2));
}

function initialPageLoad(editStockTransferId) {
    $.ajax({
        url:
            BASE_URL +
            "/branchstocktransfer/edit-branch-stock-transfer/" +
            editStockTransferId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                $("#source_branch").val(response.data.sourceBranch).trigger('change');
                appendSourceBranchDepartment(
                    response.data.sourceBranch,
                    response.data.sourceBranchDepartment
                );
                $("#source_branch_department").val(
                    response.data.sourceBranchDepartment
                );

                $("#destination_branch").val(response.data.destinationBranch).trigger('change');
                appendDestinationBranchDepartment(
                    response.data.destinationBranch,
                    response.data.destinationBranchDepartment
                );

                $("#destination_branch_department").val(
                    response.data.destinationBranchDepartment
                );
                $("#receiver_note").val(response.data.receiverNote);
                $("#transferDate").val(response.data.transferDate);

                // console.log(response.data);
                // $("#delivery_note_no").val(response.data.delNoteNo);
                // $("#po_no").val(response.data.poNo);
                // // Convert to a Date object
                // let dateObj = new Date(response.data.deliveryNoteDate);

                // // Format to yyyy-mm-dd
                // let deliveryNoteDateFormatted = dateObj
                //     .toISOString()
                //     .split("T")[0];

                // $("#delivery_note_date").val(deliveryNoteDateFormatted);
                // $("#customer_name").val(response.data.customer.customerName);
                // $("#quotation").val(response.data.quotation);

                // // // Check if the option already exists in the dropdown
                // if (
                //     !$("#customer_code").find(
                //         'option[value="' +
                //             response.data.customer.regularCustomerId +
                //             '"]'
                //     ).length
                // ) {
                //     // Append the new option
                //     $("#customer_code").append(
                //         $("<option>", {
                //             value: response.data.customer.regularCustomerId, // Set the value as the vendorId
                //             text: response.data.customer.customerNo, // Set the text as the vendor name
                //         })
                //     );
                // }

                // // // // Set the newly added or existing option as selected
                // $("#customer_code")
                //     .val(response.data.customer.regularCustomerId)
                //     .trigger("change");
                // $("#mode_of_pay")
                //     .val(response.data.modeOfPayment)
                //     .trigger("change");

                purchasedItemsTotal = pupulateStockTransferItems(
                    response.data.stock_transfer_items
                );
                $("#item_total").val(response.data.itemTotal);
                $("#item_vat_total").val(response.data.itemVatTotal);
                $("#item_total_with_vat").val(response.data.itemTotalWithVat);

                // $('#purchase_table_tr_count').val($('#purchase_table_tbody tr').length);
                
                //disable forms when edit or detls, keep only back buttomn
                if (window.location.pathname.includes('detail-of-branch-stock-transfer')) {
                    $('#branch_stock_transfer_form').find('input, textarea, select, button').prop('disabled', true);
                    $('#add_item_btn').prop('disabled', true);
                    $('.remove-row').prop('disabled', true);
                    $('#branch_stock_transfer_form').find('a.btn-label-secondary').removeClass('disabled').css('pointer-events', 'auto');
                }

            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
}

function appendSourceBranchDepartment(branchId, sourceBranchDepartmentId) {
    $.ajax({
        url:
            BASE_URL +
            "/branchstocktransfer/get-item-department-by-branch-id/" +
            branchId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                const departmentSelect = $("#source_branch_department");

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

                // Set the selected value if sourceBranchDepartmentId is provided
                if (sourceBranchDepartmentId) {
                    departmentSelect
                        .val(sourceBranchDepartmentId)
                        .trigger("change");
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
}

function appendDestinationBranchDepartment(
    branchId,
    destinationBranchDepartmentId
) {
    $.ajax({
        url:
            BASE_URL +
            "/branchstocktransfer/get-item-department-by-branch-id/" +
            branchId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                const departmentSelect = $("#destination_branch_department");

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

                // Set the selected value if destinationBranchDepartmentId is provided
                if (destinationBranchDepartmentId) {
                    departmentSelect
                        .val(destinationBranchDepartmentId)
                        .trigger("change");
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
}

function pupulateStockTransferItems(stockTransferItems) {
    stockTransferItems.forEach(function (item, index) {
        let options = `<option value="" >Select</option>`;
        console.log(item.stock_transfer_item_details);
        // Check if units are available in the item object
        if (item.stock_transfer_item_details.units) {
            item.stock_transfer_item_details.units.forEach(function (unit) {
                options += `<option value="${unit.itemUnitId}" data-unit-price="${unit.costPrice}">${unit.unit.unit_name_en}</option>`;
            });
        }
        console.log(item);
        console.log(item.itemMasterId);
        console.log(item.stockTransferItemId);

        var rowIndex = $("#branch_stock_transfer_table_tbody tr").length; // Calculate index

        let purchaseOrderHtml = `<tr>
            <td class="item-sl-td">
                ${rowIndex + 1}
            </td>
            <td class="item-name-td">
                <input type="hidden" class="form-control" name="item_id[${rowIndex}]" value="${
            item.itemMasterId
            }">
                <input type="hidden" class="form-control" name="sl_no[${rowIndex}]" value="${
            rowIndex + 1
            }">
                ${item.stock_transfer_item_details.itemName_en}
                <input type="hidden" class="service-id form-control" name="stock_transfer_item_id[${rowIndex}]" value="${
            item.stockTransferItemId
            }">
                <input type="hidden" class="item-master-id" name="item_master_id[${rowIndex}]" value="${item.itemMasterId}">
                <input type="hidden" class="item-available-stock" value="${item.availableStock || 0}">
            </td>
            <td class="item-code-td">
                ${item.stock_transfer_item_details.itemCode}
            </td>
            
            <td class="item-quantity-td">
                <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${
            item.quantity
            }" max="${item.availableStock || 0}">
            </td>
            <td class="item-unit-td" style="width: 120px;">
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
            item.vatPercent
            }">
            </td>
            <td class="vat-amount-td">
                <input type="text" class="form-control" placeholder="Vat Amount" name="item_vat_amount[${rowIndex}]" value="${
            item.vatAmount
            }">
            </td>
            <td class="net-amount-td">
                <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="${
            item.amountWithVat
            }">
            </td>
            <td class="item-remark-td">
                <input type="text" class="form-control" placeholder="Remarks" name="item_remark[${rowIndex}]" value="${
            item.remarks
            }">
            </td>
            <td class="item-batch-no-td">
                               <input type="text" id="item_batch_no_${rowIndex}" class="form-control item-batch-no " placeholder="Batch No" name="item_batch_no[${rowIndex}]" value="${
            item.batchNo ?? "0"
            }">
            </td> 
            <td class="remove-td">
                <button type="button" class="btn btn-danger remove-row" data-id="${
                    item.stockTransferItemId
            }" data-type="${item.itemMasterId}">X</button>
                
            </td>
        </tr>`;

        // Append the row to the table body
        $("#branch_stock_transfer_table_tbody").append(purchaseOrderHtml);

        // Initialize the select2 dropdown
        $(".item-unit").select2({
            placeholder: "Selection", // Match the placeholder in the select
            allowClear: true,
        });
        $(`#item_unit_${rowIndex}`).val(item.itemUnitId).trigger("change");

        // Update the SL column (if needed)
        updateSlColumn();
    });

    // Reset the item_name input field
    $("#item_name").val("").trigger("change");
}

function deleteAlreadyExistItem(stockTransferItemId, itemId) {
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
                    "/branchstocktransfer/delete-stock-transfer-item/" +
                    stockTransferItemId +
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

    // Get remaining stock for an item (excluding current row)
    function getRemainingStockForItem(itemId, currentRowIndex = null) {
        let totalStock = 0, totalUsed = 0;
        $(`.item-master-id[value="${itemId}"]`).each(function () {
            let $row = $(this).closest("tr");
            totalStock = parseInt($row.find(".item-available-stock").val()) || 0;
            if (currentRowIndex !== null && $row.index() === currentRowIndex) return;
            totalUsed += parseInt($row.find('input[name^="item_quantity"]').val()) || 0;
        });
        return totalStock - totalUsed;
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

    // Quantity input handler
    $(document).on("input", 'input[name^="item_quantity"]', function () {
        let $this = $(this), $row = $this.closest("tr");
        let itemId = $row.find(".item-master-id").val();
        let currentRowIndex = $row.index();
        let rawValue = $this.val();

        if (rawValue === "") return;

        $row.find(".stock-error-msg").remove();

        if (rawValue.includes(".")) { $this.val(Math.floor(parseFloat(rawValue)) || 0); return; }
        if (rawValue.startsWith("-")) { $this.val(1); rawValue = "1"; }

        let enteredQty = parseInt(rawValue) || 0;
        let maxAllowed = getRemainingStockForItem(itemId, currentRowIndex);

        if (enteredQty > 0 && enteredQty > maxAllowed) {
            $this.val(maxAllowed > 0 ? maxAllowed : 0);
            showStockWarning($this, maxAllowed > 0 ? maxAllowed : 0);
        }

        // Sync other rows with same item
        $(`.item-master-id[value="${itemId}"]`).each(function () {
            let $otherRow = $(this).closest("tr");
            let otherRemaining = getRemainingStockForItem(itemId, $otherRow.index());
            let $otherQty = $otherRow.find('input[name^="item_quantity"]');
            if ((parseInt($otherQty.val()) || 0) > otherRemaining) $otherQty.val(otherRemaining);
        });

        $row.find(".item-unit").trigger("change");
    });

    // Blur: reset empty/zero/invalid to 1
    $(document).on("blur", 'input[name^="item_quantity"]', function () {
        let val = parseInt($(this).val());
        if (!val || val <= 0) { $(this).val(1).trigger("input"); }
    });

    // Block minus and decimal keys
    $(document).on("keydown", 'input[name^="item_quantity"]', function (e) {
        if (["-", "Minus", ".", "Decimal"].includes(e.key)) e.preventDefault();
    });