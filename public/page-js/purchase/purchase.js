$(document).ready(function () {
    $("#purchase_main_menu").addClass("active open menu-item-animating");
    $("#purchase_sub_menu").addClass("active");

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

    // Set Flat as default checked
    $("#flatDiscount").prop("checked", true);

    // Initially show Discount, hide Dis(%)

    // When checkbox changes
    $('input[name="discountType"]').on("change", function () {
        // Allow only one to be selected
        $('input[name="discountType"]').not(this).prop("checked", false);

        // Show/hide relevant columns
        toggleDiscountColumns();
    });

    toggleDiscountColumns();

    flatpickr("#invoice_date", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: false,
    });

    $("#currency").val(3).trigger("change");

    if ($("#edit_purchase_item_bill_id").val()) {
        $("#table-loader").show();
        $("#purchase_update_btn").prop("disabled", true).text("Loading...");
        initialPageLoad($("#edit_purchase_item_bill_id").val());
    } else {
        // flatpickr("#invoice_date", {
        //     dateFormat: "Y-m-d", // Format: YYYY-MM-DD
        //     allowInput: false,   // Prevent manual editing if you want to enforce restriction
        //     minDate: "today",    // Disable past dates
        //     maxDate: "today",    // Disable future dates
        //     defaultDate: "today" // Automatically set today's date
        // });
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
                    return { purchaseOrder: params.term };
                },
                processResults: function (data) {
                    return { results: data };
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
         $("#loader-overlay").show();
        getPurchaseOrderDetails(selectedId);
    });

    if ($("#item_vendor_code").data("select2")) {
        $("#item_vendor_code").select2("destroy");
    }
    $("#item_vendor_code")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#item_vendor_code").parent(),
            width: "100%",
            placeholder: "Search Vendor Code",
            allowClear: true,
            minimumInputLength: 1,
            ajax: {
                url: BASE_URL + "/purchase/search-item-vendor-by-query",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return { itemVendorCode: params.term };
                },
                processResults: function (data) {
                    return { results: data };
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

    // function formatRepoVendor(repo) {
    //     if (repo.loading) {
    //         return repo.text;
    //     }

    //     var markup =
    //         "<div class='select2-result-repository clearfix'>" +
    //         "<div class='select2-result-repository__meta'>" +
    //         "<div class='select2-result-repository__title'>" +
    //         repo.text +
    //         "</div>";

    //     markup += "</div></div>";

    //     return markup;
    // }

    // function formatRepoVendorSelection(repo) {
    //     return repo.text || repo.id;
    // }

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
    //             return {
    //                 results: data,
    //             };
    //         },
    //         cache: true,
    //     },
    //     escapeMarkup: function (markup) {
    //         return markup;
    //     },
    //     templateResult: formatRepoVendor,
    //     templateSelection: formatRepoVendorSelection,
    // });

    $("#item_vendor_code").on("select2:select", function (e) {
        // name
        $("#vendor_name").val(e.params.data.name);
        // $('#vendor_name').val(e.params.data.text);
        $("#vendor_id").val(e.params.data.id);

        // getPatientById(e.params.data.id);
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

    function validateBatchAndExpiry() {
        let isValid = true;
        $(".custom-validation-error").remove();

        $("#purchase_table_tbody tr.group").each(function () {
            let row = $(this);

            if (row.find(".batch-select").length > 0) {
                let batchNo = row.find(".item_batch_no").val();
                if (!batchNo || batchNo.trim() === "") {
                    row.find(".batch-select")
                        .next(".select2-container")
                        .after(
                            '<span class="text-danger custom-validation-error d-block" style="font-size: 12px; margin-top: 5px;">Batch is required</span>',
                        );
                    isValid = false;
                }
            } else {
                // No validation needed for purchase_based items right nolw
            }
        });

        return isValid;
    }

    $("#purchase_save_btn").click(function () {
        $(".error-text").text("");
        if (!validateBatchAndExpiry()) return;
        $("#invoicePaymentOptionModal").modal("show");
    });

    $('input[name="discountType"]').on("change", function () {
        const $this = $(this);

        // If the user tries to uncheck the currently checked one
        if (!$this.prop("checked")) {
            // Automatically check the other checkbox
            $('input[name="discountType"]').not($this).prop("checked", true);
        } else {
            // Uncheck the other checkbox
            $('input[name="discountType"]').not($this).prop("checked", false);
        }
    });

    $("#purchase_update_btn").click(function () {
        $(".error-text").text("");
        if (!validateBatchAndExpiry()) return;
        $("#invoicePaymentOptionModal").modal("show");

        $.ajax({
            url:
                BASE_URL +
                "/purchase/edit-purchase/" +
                $("#edit_purchase_item_bill_id").val(),
            type: "GET",
            success: function (response) {
                if (response.status) {
                    console.log(response.data.purchaseId);
                    $("#savebtn").attr("data-id", response.data.purchaseId);

                    const payments = response.data.service_order_payments;
                    console.log(payments);

                    // Reset all checkboxes and inputs
                    $(".payment-checkbox").prop("checked", false);
                    $(".amount-input").addClass("d-none").val("");
                    $(".reference-input").addClass("d-none").val("");

                    if (payments.length > 0) {
                        payments.forEach(function (payment) {
                            let checkbox = $(
                                "#paymentMethod" +
                                    payment.paymentType_generalSettingsId,
                            );
                            if (checkbox.length) {
                                checkbox.prop("checked", true);

                                let $parent =
                                    checkbox.closest(".border-bottom");

                                $parent
                                    .find(".amount-input")
                                    .removeClass("d-none")
                                    .val(payment.amount);

                                let isCashPayment =
                                    checkbox.data("value") &&
                                    checkbox.data("value").toLowerCase() ===
                                        "cash";
                                if (!isCashPayment) {
                                    $parent
                                        .find(".reference-input")
                                        .removeClass("d-none")
                                        .val(payment.referenceNumber);
                                }
                            }
                        });

                        // Recalculate and split total amount with correct rounding
                        let totalAmount =
                            parseFloat($("#item_total_with_vat").val()) || 0;
                        let checkedBoxes = $(".payment-checkbox:checked");

                        if (checkedBoxes.length > 0) {
                            let baseAmount =
                                Math.floor(
                                    (totalAmount / checkedBoxes.length) * 100,
                                ) / 100; // Round down to 2 decimals
                            let amounts = new Array(checkedBoxes.length).fill(
                                baseAmount,
                            );

                            // Distribute rounding difference to last entry
                            let totalBase = baseAmount * checkedBoxes.length;
                            let roundingDifference = (
                                totalAmount - totalBase
                            ).toFixed(2);
                            amounts[amounts.length - 1] = (
                                baseAmount + parseFloat(roundingDifference)
                            ).toFixed(2);

                            // Assign values to inputs
                            checkedBoxes.each(function (index) {
                                let $parent = $(this).closest(".border-bottom");
                                $parent
                                    .find(".amount-input")
                                    .val(amounts[index]);
                            });
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error: ", status, error);
            },
        });
    });

    // Update button handler for existing purchases
    // $("#purchase_update_btn").click(function (e) {
    //     e.preventDefault();
    //     $(".error-text").text("");
    //     $("#invoicePaymentOptionModal").modal("show");

    //     // Get the purchase ID from hidden field
    //     const purchaseId = $("#edit_purchase_item_bill_id").val();

    //     // Load payment data for this purchase
    //     $.ajax({
    //         url: BASE_URL + "/purchase/edit-purchase/" + purchaseId,
    //         type: "GET",
    //         success: function (response) {
    //             if (response.status) {
    //                 console.log("Purchase ID:", purchaseId);
    //                 // Set the purchase ID as data-id attribute on the save button
    //                 $("#savebtn").attr("data-id", purchaseId);

    //                 // Get payment data from response
    //                 const payments = response.data.service_order_payments;
    //                 console.log("Payment data:", payments);

    //                 // Calculate total amount for reference
    //                 let paymentOptionTotal =
    //                     calculatePaymentOptionsTotalAmount();
    //                 console.log(
    //                     "Total with VAT:",
    //                     $("#item_total_with_vat").val()
    //                 );

    //                 // Reset payment options
    //                 $(".payment-checkbox").prop("checked", false);
    //                 $(".amount-input").addClass("d-none").val("");
    //                 $(".reference-input").addClass("d-none").val("");

    //                 // If payments exist, populate the form
    //                 if (payments && payments.length > 0) {
    //                     payments.forEach(function (payment) {
    //                         console.log("Processing payment:", payment);
    //                         let checkbox = $(
    //                             "#paymentMethod" +
    //                                 payment.paymentType_generalSettingsId
    //                         );

    //                         if (checkbox.length) {
    //                             // Check the checkbox
    //                             checkbox.prop("checked", true);

    //                             // Show and populate amount input
    //                             let amountInput = checkbox
    //                                 .closest(".border-bottom")
    //                                 .find(".amount-input");
    //                             amountInput
    //                                 .removeClass("d-none")
    //                                 .val(payment.amount);

    //                             // Show and populate reference number input
    //                             let referenceInput = checkbox
    //                                 .closest(".border-bottom")
    //                                 .find(".reference-input");
    //                             referenceInput
    //                                 .removeClass("d-none")
    //                                 .val(payment.referenceNumber || "");
    //                         } else {
    //                             console.warn(
    //                                 "Payment method not found:",
    //                                 payment.paymentType_generalSettingsId
    //                             );
    //                         }
    //                     });
    //                 }
    //             } else {
    //                 console.error(
    //                     "Failed to get purchase data:",
    //                     response.message
    //                 );
    //                 Swal.fire({
    //                     icon: "error",
    //                     text: "Failed to load purchase payment data",
    //                     customClass: {
    //                         confirmButton:
    //                             "btn btn-danger waves-effect waves-light",
    //                     },
    //                 });
    //             }
    //         },
    //         error: function (xhr, status, error) {
    //             console.error("AJAX Error:", status, error);
    //             Swal.fire({
    //                 icon: "error",
    //                 text: "An error occurred while loading purchase data",
    //                 customClass: {
    //                     confirmButton:
    //                         "btn btn-danger waves-effect waves-light",
    //                 },
    //             });
    //         },
    //     });
    // });

    $(document).on("input", ".amount-input", function () {
        distributeAmount($(this).val(), $(this).attr("id"));
    });

    function calculatePaymentOptionsTotalAmount() {
        let sum = 0;
        $(".amount-input:not(.d-none)").each(function () {
            sum += parseFloat($(this).val()) || 0;
        });
        return sum.toFixed(2);
    }

    $("#savebtn").click(function (e) {
        let totalAmount = parseFloat($("#item_total_with_vat").val()) || 0;
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
            let isCash = $(this).data("value").toLowerCase() === "cash";

            if (!isCash) {
                // <-- skip reference check for cash
                let referenceVal = $parent
                    .find(".reference-input")
                    .val()
                    .trim();
                if (referenceVal === "") {
                    isReferenceFilled = false;
                    $parent.find(".reference-input").addClass("is-invalid");
                } else {
                    $parent.find(".reference-input").removeClass("is-invalid");
                }
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

        if (isConditionMet) {
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
                    // User clicked "Yes", so save the purchase
                    // IMPORTANT FIX: Check if this is an update or new purchase
                    const purchaseId = $("#edit_purchase_item_bill_id").val();
                    // const purchaseId = $(this).attr("data-id");
                    $("#invoicePaymentOptionModal").modal("hide");
                    if (purchaseId) {
                        updatePurchase(purchaseId);
                    } else {
                        savePurchase();
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
    });

    $(".payment-checkbox").on("change", function () {
        let totalAmount = parseFloat($("#item_total_with_vat").val()) || 0;
        let checkedBoxes = $(".payment-checkbox:checked");
        let splitAmount = checkedBoxes.length
            ? totalAmount / checkedBoxes.length
            : 0;

        $(".amount-input").addClass("d-none").val("");
        $(".reference-input")
            .addClass("d-none")
            .val("")
            .prop("required", false);

        checkedBoxes.each(function () {
            var $parentDiv = $(this).closest(".border-bottom");
            var isCash = $(this).data("value").toLowerCase() === "cash";

            $parentDiv
                .find(".amount-input")
                .removeClass("d-none")
                .val(splitAmount.toFixed(2));

            if (!isCash) {
                $parentDiv
                    .find(".reference-input")
                    .removeClass("d-none")
                    .prop("required", true);
            }
            // For cash: keep reference input hidden
        });
    });

    if ($("#purchase_pdf").data("select2")) {
        $("#purchase_pdf").select2("destroy");
    }
    $("#purchase_pdf")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#purchase_pdf").parent(),
            width: "100%",
            placeholder: "Search Purchase",
            allowClear: true,
            minimumInputLength: 1,
            ajax: {
                url: BASE_URL + "/purchase/search-purchase-by-query",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return { purchaseOrder: params.term };
                },
                processResults: function (data) {
                    return { results: data };
                },
                cache: true,
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            templateResult: formatRepo,
            templateSelection: formatRepoSelection,
        });

    $("#purchase_pdf").on("select2:select", function (e) {
        getPatientById(e.params.data.id);
    });

    $(document).on("click", "#thermalPrintBtn", function (e) {
        e.preventDefault(); // Prevent default anchor behavior
        const selectedValue = $("#purchase_pdf").val(); // Get selected value
        if (!selectedValue) {
            // alert('Please select a vendor before printing.');
            $(".purchase_pdf_error").text(
                "Please select a purchase before printing.",
            );
            return;
        }
        const url =
            thermalPrintUrl +
            "?purchaseItemBillId=" +
            encodeURIComponent(selectedValue);
        window.open(url, "_blank"); // Open URL in a new tab
    });

    $(document).on("click", "#printBtn", function (e) {
        e.preventDefault(); // Prevent default anchor behavior
        const selectedValue = $("#purchase_pdf").val(); // Get selected value
        if (!selectedValue) {
            $(".purchase_pdf_error").text(
                "Please select a purchase  before printing.",
            );
            return;
        }
        const url =
            printUrl +
            "?purchaseItemBillId=" +
            encodeURIComponent(selectedValue);
        window.open(url, "_blank"); // Open URL in a new tab
    });
});

function savePurchase() {
    let itemCount = $("#purchase_table_tbody tr").length;
    if (itemCount > 0) {
        $("#page-loader").show();
        // Serialize data from all forms and convert it to a proper format
        var purchaseFormData = $("#purchase_form").serialize();
        var paymentFormData = $("#paymentForm").serialize();
        var combinedData = purchaseFormData + "&" + paymentFormData;
        // AJAX request
        $.ajax({
            url: BASE_URL + "/purchase/purchase",
            type: "POST",
            data: combinedData, // Properly formatted form data
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
                $("#page-loader").hide();
                if (xhr.status === 422) {
                    $(".error-text").text("");
                    var errors = xhr.responseJSON.errors;
                    // Display errors for fields
                    $.each(errors, function (key, value) {
                        // Check if the error is for the purchase sheet
                        if (
                            key.startsWith("item_quantity.") ||
                            key.startsWith("item_unit.") ||
                            key.startsWith("item_unit_price.") ||
                            key.startsWith("item_amount.") ||
                            key.startsWith("item_discount.") ||
                            key.startsWith("item_vat_percentage.") ||
                            key.startsWith("item_vat_amount.") ||
                            key.startsWith("item_net_amount.") ||
                            key.startsWith("item_expiry_date.") ||
                            key.startsWith("productBatchId.") ||
                            key.startsWith("item_batch_no.")
                        ) {
                            var fieldParts = key.split(".");
                            var fieldIndex = fieldParts[1];
                            var fieldName = fieldParts[0];
                            var targetRow = $("#purchase_table_tbody tr").eq(
                                fieldIndex,
                            );
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
        $("#page-loader").hide();
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
}

// Create function to update purchase
function updatePurchase(purchaseId) {
    let itemCount = $("#purchase_table_tbody tr").filter(function () {
        return $(this).find(".item-sl-td").length > 0;
    }).length;
    if (itemCount > 0) {
        $("#page-loader").show();
        // Serialize data from all forms and convert it to a proper format
        var purchaseFormData = $("#purchase_form").serialize();
        var paymentFormData = $("#paymentForm").serialize();
        var combinedData = purchaseFormData + "&" + paymentFormData;

        // AJAX request - Note the different URL and PUT method
        $.ajax({
            url: BASE_URL + "/purchase/update-purchase/" + purchaseId,
            type: "PUT", // Make sure this is PUT for update
            data: combinedData,
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
                        icon: "error",
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
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
                    // Display errors for fields
                    $.each(errors, function (key, value) {
                        // Handle field errors similar to the save function
                        if (
                            key.startsWith("item_quantity.") ||
                            key.startsWith("item_unit.") ||
                            key.startsWith("item_unit_price.") ||
                            key.startsWith("item_amount.") ||
                            key.startsWith("item_discount.") ||
                            key.startsWith("item_vat_percentage.") ||
                            key.startsWith("item_vat_amount.") ||
                            key.startsWith("item_net_amount.") ||
                            key.startsWith("item_expiry_date.") ||
                            key.startsWith("productBatchId.") ||
                            key.startsWith("item_batch_no.")
                        ) {
                            var fieldParts = key.split(".");
                            var fieldIndex = fieldParts[1];
                            var fieldName = fieldParts[0];
                            var targetRow = $("#purchase_table_tbody tr").eq(
                                fieldIndex,
                            );
                            var targetCell = targetRow.find(
                                `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`,
                            );

                            if (targetCell.length > 0) {
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
                            $("." + key + "_error").text(value[0]);
                        }
                    });
                } else {
                    console.error("Error updating purchase:", xhr.message);
                    var errorMessage =
                        xhr.responseJSON && xhr.responseJSON.message
                            ? xhr.responseJSON.message
                            : "An unexpected error occurred during update. Please try again.";
                    Swal.fire({
                        icon: "error",
                        title: "Update Failed",
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
            icon: "error",
            text: "You must have items in table to update this page.",
            customClass: {
                confirmButton: "btn btn-danger waves-effect waves-light",
            },
        });
    }
}

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

$(document).on("click", "#add_item_btn", function () {
    let selectedData = $("#item_name").select2("data");
    if (!selectedData.length) return;

    let item = selectedData[0];
    console.log("Selected item:", item);

    let batchNo = "";
    if (item.gs1 && item.gs1.is_gs1 && item.gs1.batch) {
        batchNo = item.gs1.batch;
    } else if (item.batchNo) {
        batchNo = item.batchNo;
    }

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

    let gs1Json = item.gs1 ? JSON.stringify(item.gs1) : "";
    let expiryJson = item.gs1.expiry ? JSON.stringify(item.gs1.expiry) : "";

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
                try {
                    // alert($('#purchase_table_tr_count').val());
                    let batchMode = response.data.batch_mode;
                    let index =
                        $("#purchase_table_tr_count").val() > 0
                            ? $("#purchase_table_tr_count").val()
                            : 0;
                    // Prepare the dropdown options based on `units`
                    let options = `<option value="" >Select</option>`;
                    if (response.data.units) {
                        response.data.units.forEach(function (unit) {
                            options += `<option value="${unit.itemUnitId}" data-unit-price="${unit.costPrice}">${unit.unit.unit_name_en}</option>`;
                        });
                    }
                    //    var rowIndex =  $("#purchase_table_tbody tr").length;
                    //     if(rowIndex>0){
                    //     rowIndex = rowIndex/2;
                    //     }
                    let rowIndex = Math.floor(
                        $("#purchase_table_tbody tr").length / 2,
                    );

                    // BATCH SECTION ONLY MODIFIED
                    let batchRowHtml = "";

                    if (batchMode === "batch_group") {
                        batchRowHtml = `
                            <tr class="group">
                                <td  class="item-name-td" colspan="3">
                                    <label>Batch <span class="text-danger">*</span></label>
                                    <select class="form-select batch-select"><option value="">Select Batch</option> </select>
                                    <input type="hidden" name="item_batch_no[${rowIndex}]" class="item_batch_no">
                                    <input type="hidden" name="item_expiry_date[${rowIndex}]" class="item_expiry_date">
                                    <input type="hidden" name="productBatchId[${rowIndex}]" class="productBatchId">
                                </td>
                            </tr>`;
                    } else {
                        batchRowHtml = `
                            <tr class="group">
                                <td class="item-expiry-date-td" colspan="2">
                                    <label>Ex. Date</label>
                                    <input type="text" 
                                        class="form-control item-expiry-date item_expiry_date" 
                                        placeholder="YYYY-MM-DD" 
                                        name="item_expiry_date[${rowIndex}]" 
                                        value='${expiryJson}'>
                                </td>
                                <td class="item-batch-no-td">
                                    <label>Batch No</label>
                                    <input type="text" 
                                        class="form-control item-batch-no" 
                                        placeholder="Batch No" 
                                        name="item_batch_no[${rowIndex}]" 
                                        value="${batchNo}">
                                </td>
                            </tr>`;
                    }

                    //main
                    let purchaseOrderHtml = `<tr>
                    <td class="item-sl-td">
                                ${rowIndex + 1}
                                    
                                </td>
    <td class="item-code-td">
                            ${response.data.itemCode}
                            </td>
                            <td class="item-name-td">
                                <input type="hidden" class="service-id form-control" name="item_id[${rowIndex}]" value="${response.data.itemMasterId}">
                                ${response.data.itemName_en}
                                <input type="hidden" class="service-id form-control" name="purchase_item_id[${rowIndex}]" value="0">
                            </td>
                            <td class="item-quantity-td">
                                <input type="number" class="form-control item-quantity" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="1" min="0">
                            </td>
                            <td class="item-unit-td" style="width: 150px;">
                                <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                ${options}
                                </select>
                            </td>
                            <td class="item-unit-price-td">
                                <input type="text" class="form-control" placeholder="Unit Price" name="item_unit_price[${rowIndex}]" value="" readonly>
                            </td>
                            
                            <td class="item-amount-td">
                                <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="" readonly>
                            </td>
                            <td class="item-discount-td">
                                <input type="text" class="form-control" placeholder="Amount" name="item_discount[${rowIndex}]" value="0">
                            </td><td class="item-discount-in-percentage-td">
                                <input type="text" class="form-control item-discount-in-percentage" placeholder="%" name="item_discount_in_percentage[${rowIndex}]" value="0">
                            </td>
                            <td class="item-vat-percentage-td">
                                <input type="text" class="form-control" placeholder="VAT Percentage" name="item_vat_percentage[${rowIndex}]" value="${response.data.tax.taxValueInPercentage}">
                            </td>
                            <td class="item-vat-amount-td">
                                <input type="text" class="form-control" placeholder="VAT Amount" name="item_vat_amount[${rowIndex}]" value="0" readonly>
                            </td>
                            <td class="item-net-amount-td">
                                <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="0" readonly>
                            </td>
                            
                            <td class="remove-td">
                                <button type="button" class="btn btn-danger remove-row">X</button>
                            </td>
                        </tr>
                    ${batchRowHtml}
                    `;

                    $("#purchase_table_tbody").append(purchaseOrderHtml);

                    $(`#item_unit_${rowIndex}`)
                        .val(response.data.base_unit.itemUnitId)
                        .trigger("change");

                    $(".item-unit").select2({
                        placeholder: "Selection", // Match the placeholder in the select
                        allowClear: true,
                    });

                    flatpickr(".item-expiry-date", {
                        dateFormat: "Y-m-d",
                        allowInput: true,
                    });

                    toggleDiscountColumnsAfterItemAdd();
                    if (batchMode === "batch_group") {
                        let newBatchRow = $("#purchase_table_tbody tr").last();
                        loadItemBatches(
                            response.data.itemMasterId,
                            newBatchRow,
                        );
                    }
                } catch (error) {
                    // console.error("JS Error while appending row:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Selected item has no available unit, which is unexpected",
                        // text: error,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            } else {
                console.error("Service details not found");
            }
        },
        error: function (xhr, status, error) {
            $("#loader-overlay").hide();
            console.error("Error:", error);
        },
    });

    $("#item_name").val("").trigger("change");
});

$(document).on("select2:select select2:clear", ".batch-select", function (e) {
    let row = $(this).closest("tr");

    if (e.type === "select2:select") {
        let data = e.params.data;

        row.find(".item_batch_no").val(data.batchNo || "");
        row.find(".item_expiry_date").val(data.expiredDate || "");
        row.find(".productBatchId").val(data.id || "");
    } else {
        row.find(".item_batch_no").val("");
        row.find(".item_expiry_date").val("");
        row.find(".productBatchId").val("");
    }
});

function loadItemBatches(itemId, rowElement) {
    let dropdown = rowElement.find(".batch-select");

    if (!dropdown.parent().hasClass("position-relative")) {
        dropdown.wrap('<div class="position-relative"></div>');
    }

    dropdown.select2({
        dropdownParent: dropdown.parent(),
        placeholder: "Select Batch",
        width: "100%",
        allowClear: true,
        minimumInputLength: 0,
        ajax: {
            url: BASE_URL + "/item/" + itemId + "/batches",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    search: params.term || "",
                    page: params.page || 1,
                };
            },
            processResults: function (data) {
                return data;
            },
            cache: true,
        },
    });
}
$(document).on(
    "keydown",
    ".item-quantity, .manual-item-quantity",
    function (e) {
        if (
            (e.key === "Backspace" || e.key === "Delete") &&
            (this.value === "0" || this.value === 0)
        ) {
            e.preventDefault();
            this.value = "";
        }
    },
);
$(document).on("input", ".item-quantity, .manual-item-quantity", function () {
    if (this.value === "0") {
        this.value = "";
    }
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
    currentRow.find(".item-amount-td input").val(unitPrice);
});

$(document).ready(function () {
    $("#clinic_select").select2("destroy");
    $("#clinic_select")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#clinic_select").parent(),
            width: "100%",
            placeholder: "Select Branch",
            allowClear: true,
            width: "100%",
        });
});

$(document).on("change", "#clinic_select", function () {
    const selectedClinicId = $(this).val();
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

    $.ajax({
        url:
            BASE_URL + "/purchase/get-address-by-branch-id/" + selectedClinicId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                const clinic = response.data;

                $("#clinic_address").html(
                    clinic.clinicName_en + ",<br>" + clinic.address_en,
                );
                $("#clinic_phone").text(clinic.phone);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error (address): ", status, error);
        },
    });
});

$(document).on("change", "#currency", function () {
    $.ajax({
        // url: BASE_URL + "/get-patient-by-id",
        url:
            BASE_URL +
            "/purchase/get-item-exrate-by-currency-id/" +
            $(this).val(),
        type: "GET",
        success: function (response) {
            if (response.status) {
                $("#ex_rate").val(response.data.currency_exrate);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
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
                $("#invoice_date").val(response.data.date);

                $("#item_vendor_code").append(
                    $("<option>", {
                        value: response.data.vendor.vendorId,
                        text: response.data.vendor.vendor_code,
                    }),
                );
                $("#item_vendor_code")
                    .val(response.data.vendor.vendorId)
                    .trigger("change");

                $("#vendor_id").val(response.data.vendorId);
                $("#vendor_name").val(response.data.vendor.vendor_name_en);
                $("#clinic_select").val(response.data.branchId);
                $("#department_select").val(response.data.departmentId);
                $("#currency").val("3/1").trigger("change");
                $("#item_discount_percentage").val(
                    response.data.discountPercent,
                );
                $("#item_discount_amount").val(response.data.discountAmount);
                $("#item_total_after_discount").val(
                    response.data.totalAmountAfterDiscount,
                );
                $("#item_vat_total_percentage").val(response.data.vatInPercent);
                $("#item_vat_total").val(response.data.vatAmount);

                purchasedItemsTotal = pupulatePurchaseOrderItems(
                    response.data.items,
                );

                $("#item_total").val(response.data.totalAmount);
                $("#item_discount_amount").val(response.data.discountAmount);
                $("#item_total_without_vat").val(
                    response.data.totalAmountAfterDiscount,
                );
                $("#item_vat_total").val(response.data.vatAmount);
                $("#item_total_with_vat").val(response.data.totalWithVatAmount);

                // totalAmountWithVatAndDiscount
            }
            $("#loader-overlay").hide(); 
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
            $("#loader-overlay").hide(); 
        },
    });
}

function pupulatePurchaseOrderItems(purchaseOrderItems) {
    $("#purchase_table_tbody").empty();
    var editPurchaseOrderHtml = "";
    let totalAmountWithoutVatAndDiscount = 0;
    let totalAmountWithVatAndDiscount = 0;
    let indexCount = 1;

    purchaseOrderItems.forEach((purchaseOrderItem, index) => {
        let unitoptions = "";
        if (purchaseOrderItem.item.units) {
            purchaseOrderItem.item.units.forEach(function (unit) {
                unitoptions += `<option value="${unit.itemUnitId}" data-unit-price="${unit.costPrice}">${unit.unit.unit_name_en}</option>`;
            });
        }

        // Calculate the total amount without VAT and discount
        totalAmountWithoutVatAndDiscount += parseFloat(
            purchaseOrderItem.amount || 0,
        );
        totalAmountWithVatAndDiscount += parseFloat(
            purchaseOrderItem.amount_with_vat || 0,
        );
        indexCount = index + 1;
        var rowIndex = $("#purchase_table_tbody tr").length;
        if (rowIndex > 0) {
            rowIndex = rowIndex / 2;
        }
        editPurchaseOrderHtml = `<tr>
         <td class="item-sl-td">
                                ${rowIndex + 1}
                                    
                                </td>
        <td class="item-code-td">
                                ${purchaseOrderItem.item.itemCode}
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="service-id form-control" name="item_id[${rowIndex}]" value="${purchaseOrderItem.itemMasterId}">
                                    ${purchaseOrderItem.item.itemName_en}
                                </td>
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control item-quantity" min="0" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${purchaseOrderItem.quantity}">
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
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="${purchaseOrderItem.amount}">
                                </td>
                                <td class="item-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_discount[${rowIndex}]" value="0">
                                </td>
                                <td class="item-vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="VAT Percentage" name="item_vat_percentage[${rowIndex}]" value="${purchaseOrderItem.vatPercent}">
                                </td>
                                <td class="item-vat-amount-td">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="item_vat_amount[${rowIndex}]" value="${purchaseOrderItem.vatAmount}">
                                </td>
                                <td class="item-net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="${purchaseOrderItem.amountWithVat}">
                                </td>
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>
                            <tr class="group"><td class="item-expiry-date-td" colspan="2">
                                <label>Ex. Date</label>
                                <input type="text" id="item_expiry_date" class="form-control item-expiry-date item_expiry_date" placeholder="YYYY-MM-DD" name="item_expiry_date[${rowIndex}]" value="">
                            </td>
                            <td class="item-batch-no-td">
                               <label>Batch No</label>
                               <input type="text" id="item_batch_no" class="form-control item-batch-no " placeholder="Batch No" name="item_batch_no[${rowIndex}]" value="">
                            </td> </tr>`;

        // Append the generated HTML to the table body
        $("#purchase_table_tbody").append(editPurchaseOrderHtml);

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
        // updateSlColumn();
    });

    $("#item_td_count").val(indexCount);

    return {
        totalAmountWithoutVatAndDiscount: totalAmountWithoutVatAndDiscount,
        totalAmountWithVatAndDiscount: totalAmountWithVatAndDiscount,
    };
}

function initialPageLoad(purchaseItemBillId) {
    $.ajax({
        url: BASE_URL + "/purchase/edit-purchase/" + purchaseItemBillId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                console.log(response.data.purchase_order);

                $("#item_vendor_code").append(
                    $("<option>", {
                        value: response.data.vendor.vendorId,
                        text: response.data.vendor.vendor_code,
                    }),
                );
                $("#item_vendor_code")
                    .val(response.data.vendor.vendorId)
                    .trigger("change");

                $("#invoice_no").val(response.data.invoiceNo);
                $("#vendor_name").val(response.data.vendor.vendor_name_en);
                $("#mode_of_pay")
                    .val(response.data.typeOfTransactionId)
                    .trigger("change");
                $("#invoice_date").val(response.data.invoiceDate);
                $("#purchase_ref_no").val(response.data.purchaserefNo);
                $("#currency").val(response.data.currencyId);
                $("#ex_rate").val(response.data.exRate);
                $("#clinic_select")
                    .val(response.data.clinicId)
                    .trigger("change.select2");

                const departmentSelect = $("#department_select");
                departmentSelect.find("option").remove();
                departmentSelect.append(
                    $("<option>", { value: "", text: "Select" }),
                );

                if (
                    response.data.departments &&
                    response.data.departments.length > 0
                ) {
                    response.data.departments.forEach(function (department) {
                        departmentSelect.append(
                            $("<option>", {
                                value: department.departmentId,
                                text: department.department_name_en,
                            }),
                        );
                    });
                }
                departmentSelect
                    .val(response.data.departmentId)
                    .trigger("change.select2");

                if (response.data.clinic) {
                    $("#clinic_address").html(
                        response.data.clinic.clinicName_en +
                            ",<br>" +
                            response.data.clinic.address_en,
                    );
                    $("#clinic_phone").text(response.data.clinic.phone);
                }

                if (response.data.purchase_order) {
                    if (
                        !$("#po_no").find(
                            'option[value="' +
                                response.data.purchase_order.purchaseOrderId +
                                '"]',
                        ).length
                    ) {
                        $("#po_no").append(
                            $("<option>", {
                                value: response.data.purchase_order
                                    .purchaseOrderId,
                                text: response.data.purchase_order.poNo,
                            }),
                        );
                    }

                    $("#po_no")
                        .val(response.data.purchase_order.purchaseOrderId)
                        .trigger("change");
                }

                $("#currency").val(response.data.currencyId).trigger("change");

                $("#item_total").val(response.data.total);
                $("#item_discount_amount").val(
                    response.data.totalDiscountAmount,
                );
                $("#item_total_without_vat").val(response.data.totalWithoutVat);
                $("#item_vat_total").val(response.data.totalVat);
                $("#item_total_with_vat").val(response.data.totalWithVat);
                $("#vendor_id").val(response.data.vendorId);

                purchasedItemsTotal = pupulatePurchasedItems(
                    response.data.items,
                );

                // Set discount type
                let discountType = response.data.discountType;

                $("#flatDiscount").prop("checked", false);
                $("#percentage").prop("checked", false);

                if (discountType == 0) {
                    $("#flatDiscount").prop("checked", true);
                } else if (discountType == 1) {
                    $("#percentage").prop("checked", true);
                }

                toggleDiscountColumnsAfterItemAdd();

                $("#purchase_table_tr_count").val(
                    $("#purchase_table_tbody tr").length,
                );
            }

            $("#table-loader").hide();
            $("#purchase_update_btn")
                .prop("disabled", false)
                .html('<i class="ti ti-backspace ti-sm me-1_5"></i> Update');
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
            $("#table-loader").hide();
            $("#purchase_update_btn")
                .prop("disabled", false)
                .html('<i class="ti ti-backspace ti-sm me-1_5"></i> Update');
        },
    });
}

function pupulatePurchasedItems(purchasedItems) {
    console.log("Purchased Items:", purchasedItems);
    $("#purchase_table_tbody").empty();
    var editPurchaseOrderHtml = "";
    let totalAmountWithoutVatAndDiscount = 0;
    let totalAmountWithVatAndDiscount = 0;
    let indexCount = 1;

    purchasedItems.forEach((purchasedItem, index) => {
        let unitoptions = "<option value='' data-unit-price=''>Select</option>";
        if (purchasedItem.purchased_items.all_units) {
            purchasedItem.purchased_items.all_units.forEach(function (unit) {
                unitoptions += `<option value="${unit.itemUnitId}" data-unit-price="${unit.costPrice}">${unit.unit.unit_name_en}</option>`;
            });
        }

        // var rowIndex = // Calculate index

        var rowIndex = $("#purchase_table_tbody tr").length;
        if (rowIndex > 0) {
            rowIndex = rowIndex / 2;
        }

        // Get batch mode from the item
        let batchMode = purchasedItem.purchased_items.batch_mode || "";

        editPurchaseOrderHtml = `<tr>
        <td class="item-sl-td">
                                ${rowIndex + 1}
                                </td>
        <td class="item-code-td">
                                ${purchasedItem.purchased_items.itemCode}
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="service-id form-control" name="item_id[${rowIndex}]" value="${
                                        purchasedItem.purchased_items
                                            .itemMasterId
                                    }">
                                    ${purchasedItem.purchased_items.itemName_en}
                                    <input type="hidden" class="service-id form-control" name="purchase_item_id[${rowIndex}]" value="${
                                        purchasedItem.purchaseItemId
                                    }">
                                </td>
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control item-quantity" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${
                                        purchasedItem.quantity
                                    }" min="0">
                                </td>
                                <td class="item-unit-td" style="width: 150px;">
                                    <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                    ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Unit Price" name="item_unit_price[${rowIndex}]" value="${
                                        purchasedItem.unitPrice
                                    }" readonly>
                                </td>
                                
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="${
                                        purchasedItem.itemAmount
                                    }" readonly>
                                </td>
                                <td class="item-discount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_discount[${rowIndex}]" value="${
                                        purchasedItem.discountAmount
                                    }">
                                </td>
                                <td class="item-discount-in-percentage-td">
                                    <input type="text" class="form-control item-discount-in-percentage" placeholder="%" name="item_discount_in_percentage[${rowIndex}]" value="${
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
                                    }" readonly>
                                </td>
                                <td class="item-net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="${
                                        purchasedItem.totalAmountWithVat
                                    }" readonly>
                                </td>
                                
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row" data-id="${
                                        purchasedItem.purchaseItemId
                                    }" data-type="${
                                        purchasedItem.itemMasterId
                                    }">X</button>
                                </td>
                            </tr>
                            `;

        // Build the batch/expiry row HTML based on batch mode
        let batchRowHtml = "";

        if (batchMode === "batch_group") {
            // For batch_group mode: Show select2 dropdown with existing batches
            batchRowHtml = `<tr class="batch-group-row group">
                                <td  class="item-batch-select-td" colspan="3">
                                    <label class="form-label fw-semibold">Batch Group <span class="text-danger">*</span></label>
                                    <select class="form-select batch-select" style="width: 100%;">
                                        <option value="">Select Batch</option>
                                    </select>
                                    <input type="hidden" name="item_batch_no[${rowIndex}]" class="item_batch_no" value="${purchasedItem.batchNo || ""}">
                                    <input type="hidden" name="item_expiry_date[${rowIndex}]" class="item_expiry_date" value="${purchasedItem.expiryDate || ""}">
                                    <input type="hidden" name="productBatchId[${rowIndex}]" class="productBatchId" value="${purchasedItem.productBatchId || ""}">                                   
                                </td>
                            </tr>`;
        } else {
            // For purchase_based mode: Show manual entry fields
            batchRowHtml = `
                            <tr class="batch-row group">
                                <td colspan="3">
                                    <div class="row g-3">

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Expiry Date</label>
                                <input type="date"
                                    class="form-control item-expiry-date item_expiry_date"
                                    name="item_expiry_date[${rowIndex}]"
                                    value="${purchasedItem.expiryDate || ""}">
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Batch No</label>
                                <input type="text"
                                    class="form-control item-batch-no"
                                    placeholder="Enter Batch Number"
                                    name="item_batch_no[${rowIndex}]"
                                    value="${purchasedItem.batchNo || ""}">
                            </div>

                                </div>
                            </td>
                        </tr>`;
        }

        // Append both rows to the table
        $("#purchase_table_tbody").append(editPurchaseOrderHtml);
        $("#purchase_table_tbody").append(batchRowHtml);

        // Initialize select2 for the unit dropdown
        $(`#item_unit_${rowIndex}`).select2({
            placeholder: "Selection",
            allowClear: true,
        });

        // Set the value of the select box based on `purchaseOrderItem.unit_id`
        if (purchasedItem.itemUnitId) {
            $(`#item_unit_${rowIndex}`)
                .val(purchasedItem.itemUnitId)
                .trigger("change.select2");
                console.log(unitoptions);
                console.log("unit", purchasedItem.itemUnitId);
        }

        // If batch_group mode, load the batches into select2
        if (batchMode === "batch_group") {
            let $batchRow = $("#purchase_table_tbody tr").last();
            loadItemBatchesForEdit(
                purchasedItem.purchased_items.itemMasterId,
                $batchRow,
                purchasedItem,
            );
        }

        // flatpickr for manual expiry date, for purchase_based mode
        if (batchMode !== "batch_group") {
            flatpickr(".item-expiry-date", {
                dateFormat: "Y-m-d",
                allowInput: true,
            });
        }
    });

    $("#item_td_count").val(indexCount);

    return {
        totalAmountWithoutVatAndDiscount: totalAmountWithoutVatAndDiscount,
        totalAmountWithVatAndDiscount: totalAmountWithVatAndDiscount,
    };
}

// New function to load batches for edit mode
function loadItemBatchesForEdit(itemId, rowElement, purchasedItem) {
    let dropdown = rowElement.find(".batch-select");

    if (!dropdown.parent().hasClass("position-relative")) {
        dropdown.wrap('<div class="position-relative"></div>');
    }

    if (purchasedItem.productBatchId) {
        let text =
            purchasedItem.batchNo +
            (purchasedItem.expiryDate
                ? ` (Exp: ${purchasedItem.expiryDate})`
                : "");

        dropdown
            .append(new Option(text, purchasedItem.productBatchId, true, true))
            .trigger("change");
    }

    // initialize select2 so user can change batch
    dropdown.select2({
        dropdownParent: dropdown.parent(),
        placeholder: "Select Batch",
        width: "100%",
        allowClear: true,
        ajax: {
            url: BASE_URL + "/item/" + itemId + "/batches",
            dataType: "json",
            delay: 250,
            data: (params) => ({
                search: params.term || "",
                page: params.page || 1,
            }),
            processResults: (data) => data,
        },
    });
}

$(document).on("change", ".item-unit", function () {
    // Get the selected option
    const selectedOption = $(this).find("option:selected");

    // Get the unit price from the selected option's data attribute
    const unitPrice = parseFloat(selectedOption.data("unit-price")) || 0;

    // Find the closest row of the changed dropdown
    const row = $(this).closest("tr");

    // Update the unit price input field
    row.find("input[name^='item_unit_price']").val(unitPrice);

    // Get the quantity, discount amount, and VAT percentage
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

const truncateDecimals = (num, decimals) => {
    const multiplier = Math.pow(10, decimals);
    return Math.floor(num * multiplier) / multiplier;
};

// $(document).on(
//     "input",
//     "input[name^='item_quantity'], input[name^='item_discount'], input[name^='item_vat_percentage']",
//     function () {
//         // Find the closest row of the changed input
//         const row = $(this).closest("tr");

//         // Get the unit price, quantity, discount amount, and VAT percentage from their respective fields
//         const unitPrice =
//             parseFloat(row.find("input[name^='item_unit_price']").val()) || 0;
//         const quantity =
//             parseFloat(row.find("input[name^='item_quantity']").val()) || 0;
//         const discount =
//             parseFloat(row.find("input[name^='item_discount']").val()) || 0;
//         const vatPercentage =
//             parseFloat(row.find("input[name^='item_vat_percentage']").val()) ||
//             0;

//         // Calculate the amount (quantity * unit price) and set the value in item_amount
//         let amount = unitPrice * quantity;
//         row.find("input[name^='item_amount']").val(amount.toFixed(2));

//         // Calculate the total after applying discount (discount is subtracted here)
//         let discountedAmount = amount - discount;

//         // Calculate the VAT amount based on the amount after discount
//         let vatAmount = (discountedAmount * vatPercentage) / 100;
//         vatAmount = truncateDecimals(vatAmount, 2);

//         row.find("input[name^='item_vat_amount']").val(vatAmount.toFixed(2));

//         // Calculate the net amount after VAT is added
//         const netAmount = discountedAmount + vatAmount;
//         row.find("input[name^='item_net_amount']").val(netAmount.toFixed(2));

//         // Update totals
//         updateTotals();
//     }
// );

$(document).on(
    "input",
    "input[name^='item_quantity'], input[name^='item_discount'], input[name^='item_vat_percentage']",
    function () {
        const row = $(this).closest("tr");

        const unitPrice =
            parseFloat(row.find("input[name^='item_unit_price']").val()) || 0;
        const quantity =
            parseFloat(row.find("input[name^='item_quantity']").val()) || 0;
        let discount =
            parseFloat(row.find("input[name^='item_discount']").val()) || 0;
        const vatPercentage =
            parseFloat(row.find("input[name^='item_vat_percentage']").val()) ||
            0;

        // Calculate item amount
        let amount = unitPrice * quantity;
        row.find("input[name^='item_amount']").val(amount.toFixed(2));

        // ✅ Prevent discount greater than amount
        if (discount > amount) {
            discount = amount;
            row.find("input[name^='item_discount']").val(amount.toFixed(2));
        }

        // Calculate discounted amount
        let discountedAmount = amount - discount;

        // Calculate VAT
        let vatAmount = (discountedAmount * vatPercentage) / 100;
        vatAmount = truncateDecimals(vatAmount, 2);
        row.find("input[name^='item_vat_amount']").val(vatAmount.toFixed(2));

        // Calculate net total
        const netAmount = discountedAmount + vatAmount;
        row.find("input[name^='item_net_amount']").val(netAmount.toFixed(2));

        // Update totals
        updateTotals();
    },
);

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
                row.find("input[name^='item_discount_in_percentage']").val(),
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
            originalPercentage,
        );
        // Update totals
        updateTotals();
    },
);

// $('input[name="discountType"]').on('change', function () {
//     // Allow only one to be selected
//     $('input[name="discountType"]').not(this).prop('checked', false);

//     // Show/hide relevant columns
//     toggleDiscountColumns();

//     // Recalculate all rows based on the currently active discount type
//     $('table tbody tr').each(function () {
//         recalculateRow($(this));
//     });
// });

// function updateTotals() {
//     let totalAmount = 0;
//     let totalVatAmount = 0;
//     let totalWithVat = 0;
//     let totalDiscount = 0;
//     let totalWithoutVat = 0;

//     $("#purchase_table_tbody tr").each(function () {
//         const row = $(this);

//         // Get the amount, VAT amount, and net amount for each row
//         const amount =
//             parseFloat(row.find("input[name^='item_amount']").val()) || 0;
//         const vatAmount =
//             parseFloat(row.find("input[name^='item_vat_amount']").val()) || 0;
//         const netAmount =
//             parseFloat(row.find("input[name^='item_net_amount']").val()) || 0;
//         const discountAmount =
//             parseFloat(row.find("input[name^='item_discount']").val()) || 0;

//         totalAmount += amount;
//         totalVatAmount += vatAmount;
//         totalWithVat += netAmount;
//         totalDiscount += discountAmount;
//         totalWithoutVat = totalAmount - totalDiscount;
//     });

//     // Update the totals in the corresponding input fields
//     $("#item_total").val(totalAmount.toFixed(2));
//     $("#item_vat_total").val(totalVatAmount.toFixed(2));
//     $("#item_total_with_vat").val(totalWithVat.toFixed(2));
//     $("#item_discount_amount").val(totalDiscount.toFixed(2));
//     $("#item_total_without_vat").val(totalWithoutVat.toFixed(2));
//     console.log("Totals Updated=>")+totalDiscount;
// }

function getDiscountType() {
    return $("#percentage").is(":checked") ? "percentage" : "flat";
}

function updateTotals() {
    let totalAmount = 0;
    let totalVatAmount = 0;
    let totalWithVat = 0;
    let totalDiscount = 0;
    let totalWithoutVat = 0;

    let discountType = getDiscountType();
    // "percentage" OR "flat"

    $("#purchase_table_tbody tr").each(function () {
        const row = $(this);

        const amount =
            parseFloat(row.find("input[name^='item_amount']").val()) || 0;
        const percentage =
            parseFloat(row.find(".item-discount-in-percentage").val()) || 0;
        const flatDiscount =
            parseFloat(row.find("input[name^='item_discount']").val()) || 0;

        const vatAmount =
            parseFloat(row.find("input[name^='item_vat_amount']").val()) || 0;
        const netAmount =
            parseFloat(row.find("input[name^='item_net_amount']").val()) || 0;

        // Add amount totals
        totalAmount += amount;
        totalVatAmount += vatAmount;
        totalWithVat += netAmount;

        // APPLY DISCOUNT BASED ON SELECTED TYPE
        let rowDiscount = 0;

        if (discountType === "percentage") {
            rowDiscount = amount * (percentage / 100);
        } else {
            rowDiscount = flatDiscount;
        }

        totalDiscount += rowDiscount;
    });

    totalWithoutVat = totalAmount - totalDiscount;

    // Update UI
    $("#item_total").val(totalAmount.toFixed(2));
    $("#item_vat_total").val(totalVatAmount.toFixed(2));
    $("#item_total_with_vat").val(totalWithVat.toFixed(2));
    $("#item_discount_amount").val(totalDiscount.toFixed(2));
    $("#item_total_without_vat").val(totalWithoutVat.toFixed(2));
}

// Remove row and update SL column
$(document).on("click", ".remove-row", function () {
    var $currentRow = $(this).closest("tr");
    var $nextRow = $currentRow.next("tr");
    $currentRow.remove();
    $nextRow.remove();
    var purchasedItemId = $(this).data("id");
    var itemMasterId = $(this).data("type");
    // if (purchasedItemId > 0 && itemMasterId > 0) {
    //     deleteAlreadyExistItem(purchasedItemId, itemMasterId);
    // } else {
    //     //  updateSlColumn();
    updateSlColumn();

    updateTotals();
    // }
});

// function updateSlColumn() {
//     $("#purchase_table_tbody tr").each(function (index, row) {
//         const rowIndex = index + 1; // Update index for display
//         $(row)
//             .find("input, select")
//             .each(function () {
//                 const name = $(this).attr("name");
//                 if (name) {
//                     const updatedName = name.replace(/\[\d+\]/, `[${index}]`);
//                     $(this).attr("name", updatedName);
//                 }
//             });
//     });
// }

function deleteAlreadyExistItem(purchasedItemId, itemMasterId) {
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
                    "/purchase/delete-purchase-item/" +
                    purchasedItemId +
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
                error: function (xhr, status, error) {},
            });
        }
    });
}

function toggleDiscountColumns() {
    const isFlat = $("#flatDiscount").is(":checked");
    if (isFlat) {
        $("#purchase_table_tbody .item-discount-td").show();
        $("#purchase_table_tbody .item-discount-in-percentage-td").hide();
        $("#purchase_table .discount-th").show();
        $("#purchase_table .discount-percentage-th").hide();
    } else {
        $("#purchase_table_tbody .item-discount-in-percentage-td").show();
        $("#purchase_table_tbody .item-discount-td").hide();
        $("#purchase_table .discount-th").hide();
        $("#purchase_table .discount-percentage-th").show();
    }
    recalculatePurchaseTableRow(isFlat);
}

function toggleDiscountColumnsAfterItemAdd() {
    const isFlat = $("#flatDiscount").is(":checked");
    if (isFlat) {
        $("#purchase_table_tbody .item-discount-td").show();
        $("#purchase_table_tbody .item-discount-in-percentage-td").hide();
        $("#purchase_table .discount-th").show();
        $("#purchase_table .discount-percentage-th").hide();
    } else {
        $("#purchase_table_tbody .item-discount-in-percentage-td").show();
        $("#purchase_table_tbody .item-discount-td").hide();
        $("#purchase_table .discount-th").hide();
        $("#purchase_table .discount-percentage-th").show();
    }
    console.log("called");
}

function recalculatePurchaseTableRow(isFlat) {
    if (isFlat) {
        $("#purchase_table_tbody tr").each(function () {
            const row = $(this);
            row.find("input[name^='item_discount']").val(0);
            let unitPrice =
                parseFloat(row.find("input[name^='item_unit_price']").val()) ||
                0;
            let quantity =
                parseFloat(row.find("input[name^='item_quantity']").val()) || 0;
            let discount =
                parseFloat(row.find("input[name^='item_discount']").val()) || 0;
            let vatPercentage =
                parseFloat(
                    row.find("input[name^='item_vat_percentage']").val(),
                ) || 0;

            // Calculate the amount (quantity * unit price) and set the value in item_amount
            let amount = unitPrice * quantity;
            row.find("input[name^='item_amount']").val(amount.toFixed(2));

            // Calculate the total after applying discount (discount is subtracted here)
            let discountedAmount = amount - discount;

            // Calculate the VAT amount based on the amount after discount
            let vatAmount = (discountedAmount * vatPercentage) / 100;
            row.find("input[name^='item_vat_amount']").val(
                vatAmount.toFixed(2),
            );

            // Calculate the net amount after VAT is added
            let netAmount = discountedAmount + vatAmount;
            row.find("input[name^='item_net_amount']").val(
                netAmount.toFixed(2),
            );
        });
    } else {
        $("#purchase_table_tbody tr").each(function () {
            const row = $(this);
            if (!$("#edit_purchase_item_bill_id").val()) {
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
                    row.find("input[name^='item_vat_percentage']").val(),
                ) || 0;
            let discountInPercentage =
                parseFloat(
                    row
                        .find("input[name^='item_discount_in_percentage']")
                        .val(),
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
            row.find("input[name^='item_vat_amount']").val(
                vatAmount.toFixed(2),
            );

            // Calculate the net amount after VAT is added
            let netAmount = discountedAmount + vatAmount;
            row.find("input[name^='item_net_amount']").val(
                netAmount.toFixed(2),
            );

            if (!$("#edit_purchase_item_bill_id").val()) {
                row.find("input[name^='item_discount_in_percentage']").val(0);
            }
        });
    }

    // Update overall totals
    if (!$("#edit_purchase_item_bill_id").val()) {
        $("#item_discount_amount").val(0);
        updateTotals();
        $("#item_discount_amount").val(0);
    }
}

function recalculateFlatDiscountRow() {
    $("#purchase_table_tbody tr").each(function () {
        const row = $(this);

        let unitPrice =
            parseFloat(row.find("input[name^='item_unit_price']").val()) || 0;
        let quantity =
            parseFloat(row.find("input[name^='item_quantity']").val()) || 0;
        let discount =
            parseFloat(row.find("input[name^='item_discount']").val()) || 0;
        let vatPercentage =
            parseFloat(row.find("input[name^='item_vat_percentage']").val()) ||
            0;

        // Calculate and set amount
        let amount = unitPrice * quantity;
        console.log(unitPrice + "*" + quantity);
        row.find("input[name^='item_amount']").val(amount.toFixed(2));

        // Calculate discounted amount
        let discountedAmount = amount - discount;

        // Calculate VAT on discounted amount
        let vatAmount = (discountedAmount * vatPercentage) / 100;
        row.find("input[name^='item_vat_amount']").val(vatAmount.toFixed(2));

        // Calculate net amount (after VAT)
        let netAmount = discountedAmount + vatAmount;
        row.find("input[name^='item_net_amount']").val(netAmount.toFixed(2));
    });

    // Update overall totals
    updateTotals();
}

function updateSlColumn() {
    // Select only main rows (those having serial number cell)
    let mainRows = $("#purchase_table_tbody tr").filter(function () {
        return $(this).find(".item-sl-td").length > 0;
    });

    mainRows.each(function (index, mainRow) {
        const newIndex = index; // index starts from 0

        // Update serial number display
        $(mainRow)
            .find(".item-sl-td")
            .text(newIndex + 1);

        // Update all input/select name attributes in main row
        $(mainRow)
            .find("input, select")
            .each(function () {
                const name = $(this).attr("name");
                if (name) {
                    const updated = name.replace(/\[\d+\]/, `[${newIndex}]`);
                    $(this).attr("name", updated);
                }
            });

        // Also update the next row (expiry/batch row)
        const nextRow = $(mainRow).next("tr");
        nextRow.find("input, select").each(function () {
            const name = $(this).attr("name");
            if (name) {
                const updated = name.replace(/\[\d+\]/, `[${newIndex}]`);
                $(this).attr("name", updated);
            }
        });
    });
}

// Prevent typing minus (-) or scientific notation (e)
$(document).on("keydown", ".item-quantity", function (e) {
    if (e.key === "-" || e.key === "e") {
        e.preventDefault();
    }
});

// Ensure value stays 0 or above
$(document).on("input", ".item-quantity", function () {
    let val = parseFloat($(this).val());
    if (isNaN(val) || val < 0) {
        $(this).val(0); // reset to 0 if invalid or negative
    }
});

// Prevent typing negative sign (-) or 'e' (for scientific notation)
$(document).on("keydown", ".item-discount-in-percentage", function (e) {
    if (e.key === "-" || e.key === "e") {
        e.preventDefault();
    }
});

// Allow decimals but restrict to two digits after decimal
$(document).on("input", ".item-discount-in-percentage", function () {
    let val = $(this).val();

    // Allow empty, ".", "0.", or partial decimals while typing
    if (val === "" || val === "." || /^0\.$/.test(val) || /^\d+\.$/.test(val)) {
        return;
    }

    // Restrict to two decimal places while typing
    if (/^\d+(\.\d{0,2})?$/.test(val) === false) {
        // If more than two decimals are typed, trim them
        val = val.replace(/^(\d+(\.\d{0,2})?).*/, "$1");
        $(this).val(val);
        return;
    }

    // Remove leading zeros (except for "0." cases)
    if (val.length > 1 && val.startsWith("0") && !val.startsWith("0.")) {
        val = val.replace(/^0+/, "");
    }

    let num = parseFloat(val);
    if (!isNaN(num)) {
        if (num < 0) num = 0;
        if (num > 100) num = 100;
        $(this).val(val); // keep typed value (not forced to integer)
    }
});

// On blur, enforce range and fix format
$(document).on("blur", ".item-discount-in-percentage", function () {
    let val = $(this).val();
    let num = parseFloat(val);

    if (isNaN(num)) {
        num = 0;
    } else if (num < 0) {
        num = 0;
    } else if (num > 100) {
        num = 100;
    }

    // Final rounding to two decimals
    $(this).val(num.toFixed(2));
});

$(document).on("input", ".item-discount-in-percentage", function () {
    let value = parseFloat($(this).val()) || 0;

    if (value > 100) {
        $(this).val(100);
        value = 100;
    }
    if (value < 0) {
        $(this).val(0);
        value = 0;
    }
    const row = $(this).closest("tr");
    const unitPrice =
        parseFloat(row.find("input[name^='item_unit_price']").val()) || 0;
    const quantity =
        parseFloat(row.find("input[name^='item_quantity']").val()) || 0;
    const vatPercentage =
        parseFloat(row.find("input[name^='item_vat_percentage']").val()) || 0;

    const amount = unitPrice * quantity;
    row.find("input[name^='item_amount']").val(amount.toFixed(2));

    const discount = (amount * value) / 100;
    const discountedAmount = amount - discount;

    const vatAmount = truncateDecimals((discountedAmount * vatPercentage) / 100, 2);
    row.find("input[name^='item_vat_amount']").val(vatAmount.toFixed(2));

    const netAmount = discountedAmount + vatAmount;
    row.find("input[name^='item_net_amount']").val(netAmount.toFixed(2));


    updateTotals();
});

$(document).on("input", ".item-discount-td input", function () {
    if ($("#flatDiscount").is(":checked")) {
        let $row = $(this).closest("tr");
        let discountInput = $(this);
        let amount = parseFloat($row.find(".item-amount-td input").val()) || 0;
        let discount = parseFloat(discountInput.val()) || 0;

        if (discount > amount) {
            discountInput.val(amount.toFixed(2));
        }
    }
});

$(document).on(
    "keydown",
    ".item-discount-td input, .item-vat-percentage-td input",
    function (e) {
        if (e.key === "-" || e.key === "e") {
            // prevent negative or scientific notation
            e.preventDefault();
        }
    },
);

$(document).on("input", ".reference-input", function () {
    $(this).val(
        $(this)
            .val()
            .replace(/[^a-zA-Z0-9]/g, ""),
    );
});
$(document).on("input", "#ex_rate", function () {
    let val = $(this).val();
    val = val.replace(/[^0-9.]/g, "");
    let parts = val.split(".");
    if (parts.length > 2) {
        val = parts[0] + "." + parts.slice(1).join("");
    }
    $(this).val(val);
});
