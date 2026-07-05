$(document).ready(function () {
    $("#branch_stoke_transfer_main_menu").addClass(
        "active open menu-item-animating"
    );
    $("#branch_stoke_reciever_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    flatpickr("#delivery_date", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
    });

    flatpickr("#received_date", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
        defaultDate: new Date(), // Set today's date
    });

    if ($("#stock_transfer_id").val()) {
        stockRecieverPageLoad($("#stock_transfer_id").val());
    }

    $("#branch_stock_transfer_recieve_btn").click(function () {
        let itemCount = $("#branch_stock_transfer_table_tbody tr").length;
        if (itemCount > 0) {
            var branchStockRecieverFormData = $(
                "#branch_stock_reciever_form"
            ).serializeArray();
            $("#loader-overlay").show();
            $.ajax({
                url:
                    BASE_URL +
                    "/branchstocktransfer/receive-stock-from-source-branch/" +
                    $("#stock_transfer_id").val(),
                type: "POST",
                data: branchStockRecieverFormData,
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
                            window.location.href =
                                BASE_URL +
                                "/branchstocktransfer/branch-stock-transfer-lists";
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
                error: function (xhr) {
                    if (xhr.status === 422) {
                        $(".error-text").remove();

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

    $("#branch_stock_transfer_reject_btn").click(function () {
        let itemCount = $("#branch_stock_transfer_table_tbody tr").length;
        if (itemCount > 0) {
            var branchStockRecieverFormData = $(
                "#branch_stock_reciever_form"
            ).serializeArray();
            $("#loader-overlay").show();
            $.ajax({
                url:
                    BASE_URL +
                    "/branchstocktransfer/reject-stock-from-source-branch/" +
                    $("#stock_transfer_id").val(),
                type: "PUT",
                data: branchStockRecieverFormData,

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
                            window.location.href =
                                BASE_URL +
                                "/branchstocktransfer/branch-stock-transfer-lists";
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

                error: function (xhr) {
                    if (xhr.status === 422) {
                        $(".error-text").remove();
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
});

function stockRecieverPageLoad(stockTransferId) {
    $.ajax({
        url:
            BASE_URL +
            "/branchstocktransfer/receive-stock-from-source-branch/" +
            stockTransferId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                if (response.data.sourceBranchDepartment) {
                    populateSourceBranchDepartmentSelectBox(
                        response.data.sourceBranch,
                        response.data.sourceBranchDepartment
                    );
                }

                if (response.data.sourceBranchDepartment) {
                    populateDestinationBranchDepartmentSelectBox(
                        response.data.destinationBranch,
                        response.data.destinationBranchDepartment
                    );
                }

                $("#source_branch").val(response.data.sourceBranch);
                $("#destination_branch").val(response.data.destinationBranch);

                // $('#destination_branch').val(response.data.destinationBranch);
                $("#source_branch_department").val(
                    response.data.sourceBranchDepartment
                );
                $("#destination_branch_department").val(
                    response.data.destinationBranchDepartment
                );

                populatestockTransferItems(response.data.stock_transfer_items);

                $("#item_total").val(response.data.itemTotal);
                $("#item_discount_percentage").val(
                    response.data.itemDiscountPercentage
                );
                $("#item_discount_amount").val(
                    response.data.itemDiscountAmount
                );
                $("#item_total_after_discount").val(
                    response.data.itemTotalAfterDiscount
                );
                $("#item_vat_total_percentage").val(
                    response.data.itemVatTotalPercentage
                );
                $("#item_vat_total").val(response.data.itemVatTotal);
                $("#item_total_with_vat").val(response.data.itemTotalWithVat);

                $("#source_branch_hidden").val(response.data.sourceBranch);
                $("#source_branch_department_hidden").val(
                    response.data.sourceBranchDepartment
                );
                $("#destination_branch_hidden").val(
                    response.data.destinationBranch
                );
                $("#destination_branch_department_hidden").val(
                    response.data.destinationBranchDepartment
                );

                if (response.data.status === "recieved") {
                    $("#reject_btn_div").hide();
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
}

function populateSourceBranchDepartmentSelectBox(
    branchId,
    selectedDepartmentId
) {
    $.ajax({
        // url: BASE_URL + "/get-patient-by-id",
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

                if (selectedDepartmentId) {
                    departmentSelect
                        .val(selectedDepartmentId)
                        .trigger("change");
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
}

function populateDestinationBranchDepartmentSelectBox(
    branchId,
    selectedDepartmentId
) {
    $.ajax({
        // url: BASE_URL + "/get-patient-by-id",
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

                if (selectedDepartmentId) {
                    departmentSelect
                        .val(selectedDepartmentId)
                        .trigger("change");
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
}

function populatestockTransferItems(stockTransferItems) {
    stockTransferItems.forEach((stockTransferItem, index) => {
        let unitoptions = "";
        console.log(stockTransferItem.stock_transfer_item_details);
        if (stockTransferItem.stock_transfer_item_details.units) {
            stockTransferItem.stock_transfer_item_details.units.forEach(
                function (unit) {
                    unitoptions += `<option value="${unit.itemUnitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
                }
            );
        }
        console.log(stockTransferItem);
        console.log(stockTransferItem.stock_transfer_item_details.itemName_en);

        var rowIndex = $("#delivery_note_table_tbody tr").length; // Calculate index

        purchaseOrderHtml = `<tr>
                                <td class="item-sl-td">
                                ${rowIndex + 1}
                                    
                                </td>
                                <td class="item-code-td">
                                    ${
                                        stockTransferItem
                                            .stock_transfer_item_details
                                            .itemCode
                                    }
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="form-control" name="item_id[${rowIndex}]" value="${
            stockTransferItem.stock_transfer_item_details.itemMasterId
        }">
                                    <input type="hidden" class="form-control" name="sl_no[${rowIndex}]" value="${
            rowIndex + 1
        }">
                                    ${
                                        stockTransferItem
                                            .stock_transfer_item_details
                                            .itemName_en
                                    }
        <input type="hidden" class="service-id form-control" name="delivery_note_item_id[${rowIndex}]" value="0">

                                </td>
                                
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${
            stockTransferItem.quantity
        }">
                                    
                                </td>
                                <td class="item-unit-td" style="width: 120px;">
                                    <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Price" name="item_unit_price[${rowIndex}]" value="${
            stockTransferItem.unitPrice
        }">
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="${
            stockTransferItem.amount
        }">
                                </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[${rowIndex}]" value="${
            stockTransferItem.vatPercent
        }">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Vat Amount" name="item_vat_amount[${rowIndex}]" value="${
            stockTransferItem.vatAmount
        }">
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="${
            stockTransferItem.amountWithVat
        }">
                                </td>
                                <td class="item-remark-td">
                                    <input type="text" class="form-control" placeholder="Remarks" name="item_remark[${rowIndex}]" value="${
            stockTransferItem.remarks
        }">
                                </td>
                                <td class="item-batch-no-td">
                               <input type="text" id="item_batch_no_${rowIndex}" class="form-control item-batch-no " placeholder="Batch No" name="item_batch_no[${rowIndex}]" value="${
            stockTransferItem.batchNo ?? "0"
        }">
            </td> 
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

        $("#branch_stock_transfer_table_tbody").append(purchaseOrderHtml);
        if (stockTransferItem.itemUnitId) {
            $(`#item_unit_${index}`)
                .val(stockTransferItem.itemUnitId)
                .trigger("change");
        }
        $(".item-unit").select2({
            placeholder: "Selection", // Match the placeholder in the select
            allowClear: true,
        });
    });
}
