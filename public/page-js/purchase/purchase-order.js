$(document).ready(function () {
    $("#purchase_main_menu").addClass("active open menu-item-animating");
    $("#purchase_order_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    $("#flatDiscount").prop("checked", true);
    discountTypeFlat();

    // When Flat is clicked
    $("#flatDiscount").on("change", function () {
        reassignZeroToDiscountSectionFields();

        if ($(this).is(":checked")) {
            $("#percentage").prop("checked", false);
            discountTypeFlat();
        } else {
            // prevent unchecking both (optional)
            $(this).prop("checked", true);
        }
    });

    // When Percentage is clicked
    $("#percentage").on("change", function () {
        if ($(this).is(":checked")) {
            $("#flatDiscount").prop("checked", false);
            discountTypePercentage();
        } else {
            // prevent unchecking both (optional)
            $(this).prop("checked", true);
        }
    });

    const tagifyBasicEl = document.querySelector("#payerCode");
    const TagifyBasic = new Tagify(tagifyBasicEl);

    var selectElement = $("#clinic_select");

    // Check if the number of options (excluding the first empty option) is 1
    if (selectElement.find("option").length === 2) {
        // One option + "Select"
        // Set the default value to the only available option
        selectElement
            .val(selectElement.find("option").not(":first").val())
            .trigger("change");
    }

    if ($("#edit_purchase_order_id").val()) {
        $("#table-loader").show();
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

    $("#purchase_order_settings_btn").click(function (e) {
        $("#purchaseOrderSettingsModal").modal("show");
        // $.ajax({
        //     url: BASE_URL + "/purchase/get-purchase-order-settings",
        //     type: "GET",
        //     success: function (response) {
        //         if (response.status) {
        //             console.log(response);
        //             console.log(response.data.invoiceStockCheck == "1");
        //             response.data.manualItemButton == "1"
        //                 ? $("#enableManualItem").prop("checked", true).val(1)
        //                 : $("#enableManualItem").prop("checked", false).val(0);
        //             response.data.invoiceStockCheck == "1"
        //                 ? $("#invoiceOutOfStockCheck").prop("checked", true).val(1)
        //                 : $("#invoiceOutOfStockCheck")
        //                       .prop("checked", false)
        //                       .val(0);
        //         }
        //     },
        //     error: function (xhr, status, error) {
        //         console.error("AJAX Error: ", status, error);
        //     },
        // });
    });

    $("#add_workflow_team_line_btn").click(function (e) {
        $("#purchaseOrderWorkflowTeamLineManagementModal").modal("show");

        // Initialize select2 for lineManagers
        $("#lineManagers").select2({
            placeholder: "Search and select manager",
            allowClear: true,
            dropdownParent: $("#purchaseOrderWorkflowTeamLineManagementModal"), // important for modal
            ajax: {
                url: BASE_URL + "/purchase/get-line-managers",
                type: "GET",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term, // ✅ must match backend
                    };
                },
                processResults: function (data) {
                    return data; // ✅ backend already returns { results: [...] }
                },
                cache: true,
            },
            minimumInputLength: 1,
        });

        $.ajax({
            url: BASE_URL + "/purchase/get-added-line-managers",
            type: "GET",
            success: function (response) {
                if (response.status === true && response.data.length > 0) {
                    let tbody = $("#pending-tasks");
                    tbody.empty(); // clear existing rows

                    response.data.forEach(function (manager, index) {
                        let managerId = manager.employeeId;
                        let managerName =
                            manager.employee.firstName_en +
                            " " +
                            (manager.employee.secondName_en || "") +
                            " " +
                            (manager.employee.thirdName_en || "") +
                            " " +
                            (manager.employee.lastName_en || "");

                        let position = manager.position || index + 1;

                        let newRow = `
                        <input type="hidden" name="lineManagers[${index}][managerId]" value="${managerId}">
                            <input type="hidden" name="lineManagers[${index}][position]" value="${position}">
                        <li class="list-group-item drag-item cursor-move d-flex justify-content-between align-items-center">
                                        <div>
                                            <span class="fw-bold d-block">${managerName.trim()}</span>
                                            <small class="text-dark">#${position}</small>
                                        </div>
                                        <span class="badge bg-success rounded-pill">Success</span>
                                    </li>
                    `;
                        tbody.append(newRow);
                    });
                } else {
                    console.log("No managers found.");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error fetching line managers:", error);
            },
        });
    });

    $("#add_line_managers_btn").on("click", function () {
        let counter = $("#managersTable tbody tr").length;
        let selectedData = $("#lineManagers").select2("data");

        if (selectedData.length === 0) {
            alert("Please select a manager first!");
            return;
        }

        let managerId = selectedData[0].id;
        let managerName = selectedData[0].text;

        // Check if already exists in table
        if (
            $("#managersTable tbody tr[data-id='" + managerId + "']").length > 0
        ) {
            alert("This manager is already added.");
            return;
        }

        counter++; // position will be the row number

        let newRow = `
        <tr data-id="${managerId}">
            <td>${counter}</td>
            <td>
                ${managerName}
                <input type="hidden" name="lineManagers[${counter}][managerId]" value="${managerId}">
                <input type="hidden" name="lineManagers[${counter}][position]" value="${counter}">
            </td>
            <td>
                <button type="button" class="btn btn-outline-danger btn-sm remove-btn">Remove</button>
            </td>
        </tr>
    `;

        $("#managersTable tbody").append(newRow);

        // clear select2
        $("#lineManagers").val(null).trigger("change");
    });

    // Handle row removal
    $(document).on("click", ".remove-btn", function () {
        $(this).closest("tr").remove();

        // Recalculate positions after removal
        $("#managersTable tbody tr").each(function (index) {
            let row = $(this);
            let newPos = index + 1;
            row.find("td:first").text(newPos);
            row.find("input[name$='[position]']").val(newPos);
        });
    });

    $("#save_line_managers_btn").on("click", function () {
        var lineManagersFormData = $("#add_line_manager_form").serializeArray();
        $.ajax({
            url: BASE_URL + "/purchase/add-line-managers",
            type: "POST",
            data: lineManagersFormData,
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

    // $("#purchase_order_save_btn").click(function () {
    //     let itemCount = $("#purchase_order_table_tbody tr").length;
    //     if (itemCount > 0) {
    //         // Extract Quill editor content
    //         var paymentTermsContent = paymenTermsEditor.root.innerHTML;
    //         var deliveryContent = deliveryEditor.root.innerHTML;

    //         // Serialize data from all forms and convert it to a proper format
    //         var purchaseOrderFormData = $(
    //             "#purchase_order_form"
    //         ).serializeArray();

    //         // Add Quill content to the serialized form data
    //         purchaseOrderFormData.push(
    //             { name: "payment_terms", value: paymentTermsContent },
    //             { name: "delivery_terms", value: deliveryContent }
    //         );

    //         // AJAX request
    //         $.ajax({
    //             url: BASE_URL + "/purchase/purchase-order",
    //             type: "POST",
    //             data: purchaseOrderFormData, // Properly formatted form data
    //             success: function (response) {
    //                 if (response.status === true) {
    //                     Swal.fire({
    //                         icon: "success",
    //                         text: response.message,
    //                         customClass: {
    //                             confirmButton:
    //                                 "btn btn-success waves-effect waves-light",
    //                         },
    //                     }).then(function () {
    //                         location.reload();
    //                     });
    //                 } else {
    //                     Swal.fire({
    //                     icon: "error",
    //                     text: response.message,
    //                     customClass: {
    //                         confirmButton:
    //                             "btn btn-danger waves-effect waves-light",
    //                     },
    //                 });
    //                 }
    //             },
    //             error: function (xhr, status, error) {
    //                 if (xhr.status === 422) {
    //                     $(".error-text").text("");
    //                     var errors = xhr.responseJSON.errors;
    //                     // Display errors for medication sheet fields
    //                     $.each(errors, function (key, value) {
    //                         // Check if the error is for the medication sheet
    //                         if (
    //                             key.startsWith("item_quantity.") ||
    //                             key.startsWith("item_unit.") ||
    //                             key.startsWith("item_unit_price.") ||
    //                             key.startsWith("item_amount.") ||
    //                             key.startsWith("item_vat_percentage.") ||
    //                             key.startsWith("item_vat_amount.") ||
    //                             key.startsWith("item_net_amount.")
    //                         ) {
    //                             var fieldParts = key.split(".");
    //                             var fieldIndex = fieldParts[1];
    //                             var fieldName = fieldParts[0];
    //                             var targetRow = $(
    //                                 "#purchase_order_table_tbody tr"
    //                             ).eq(fieldIndex);
    //                             // Adjust selection for input or select fields
    //                             var targetCell = targetRow.find(
    //                                 `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`
    //                             );

    //                             // Append error message below the field
    //                             if (targetCell.length > 0) {
    //                                 // Check if the target is a select2 element
    //                                 if (targetCell.is("select")) {
    //                                     var select2Container =
    //                                         targetCell.next(
    //                                             ".select2-container"
    //                                         );
    //                                     if (select2Container.length > 0) {
    //                                         select2Container.after(
    //                                             `<span class="text-danger error-text">${value[0]}</span>`
    //                                         );
    //                                     }
    //                                 } else {
    //                                     targetCell.after(
    //                                         `<span class="text-danger error-text">${value[0]}</span>`
    //                                     );
    //                                 }
    //                             }
    //                         } else {
    //                             // For other errors, handle them as per your existing logic
    //                             $("." + key + "_error").text(value[0]);
    //                         }
    //                     });
    //                 } else {
    //                     console.error("Error fetching edit data:", xhr.message);
    //                 // $("#branchModel").modal("hide");

    //                 // Extract error message from the response
    //                 var errorMessage =
    //                 xhr.responseJSON && xhr.responseJSON.message
    //                         ? xhr.responseJSON.message
    //                         : "An unexpected error occurred. Please try again.";
    //                 // Display the error message in SweetAlert
    //                 Swal.fire({
    //                     icon: "error",
    //                     title: "Access denied",
    //                     text: errorMessage,
    //                     customClass: {
    //                         confirmButton:
    //                             "btn btn-danger waves-effect waves-light",
    //                     },
    //                 });
    //                 }
    //             },
    //         });
    //     } else {
    //         Swal.fire({
    //             icon: "error", // Change this to "error" for error messages
    //             text: "You must have items in table to save this page.",
    //             customClass: {
    //                 confirmButton: "btn btn-danger waves-effect waves-light", // Optional: Change button styling for error
    //             },
    //         }).then(function () {
    //             location.reload();
    //         });
    //     }
    // });

    // $("#purchase_order_update_btn").click(function () {
    //     let itemCount = $("#purchase_order_table_tbody tr").length;
    //     if (itemCount > 0) {
    //         // Extract Quill editor content
    //         var paymentTermsContent = paymenTermsEditor.root.innerHTML;
    //         var deliveryContent = deliveryEditor.root.innerHTML;

    //         // Serialize data from all forms and convert it to a proper format
    //         var preAdmissionFormData = $(
    //             "#purchase_order_form"
    //         ).serializeArray();

    //         // Add Quill content to the serialized form data
    //         preAdmissionFormData.push(
    //             { name: "payment_terms", value: paymentTermsContent },
    //             { name: "delivery_terms", value: deliveryContent }
    //         );

    //         // AJAX request
    //         $.ajax({
    //             url:
    //                 BASE_URL +
    //                 "/purchase/update-purchase-order/" +
    //                 $("#edit_purchase_order_id").val(),
    //             type: "PUT",
    //             data: preAdmissionFormData, // Properly formatted form data
    //             success: function (response) {
    //                 if (response.status === true) {
    //                     Swal.fire({
    //                         icon: "success",
    //                         text: response.message,
    //                         customClass: {
    //                             confirmButton:
    //                                 "btn btn-success waves-effect waves-light",
    //                         },
    //                     }).then(function () {
    //                         location.reload();
    //                     });
    //                 }
    //             },
    //             error: function (xhr, status, error) {
    //                 if (xhr.status === 422) {
    //                     $(".error-text").text("");
    //                     var errors = xhr.responseJSON.errors;
    //                     // Display errors for medication sheet fields
    //                     $.each(errors, function (key, value) {
    //                         // Check if the error is for the medication sheet
    //                         if (
    //                             key.startsWith("item_quantity.") ||
    //                             key.startsWith("item_unit.") ||
    //                             key.startsWith("item_unit_price.") ||
    //                             key.startsWith("item_amount.") ||
    //                             key.startsWith("item_vat_percentage.") ||
    //                             key.startsWith("item_vat_amount.") ||
    //                             key.startsWith("item_net_amount.")
    //                         ) {
    //                             var fieldParts = key.split(".");
    //                             var fieldIndex = fieldParts[1];
    //                             var fieldName = fieldParts[0];
    //                             var targetRow = $(
    //                                 "#purchase_order_table_tbody tr"
    //                             ).eq(fieldIndex);
    //                             // Adjust selection for input or select fields
    //                             var targetCell = targetRow.find(
    //                                 `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`
    //                             );

    //                             // Append error message below the field
    //                             if (targetCell.length > 0) {
    //                                 // Check if the target is a select2 element
    //                                 if (targetCell.is("select")) {
    //                                     var select2Container =
    //                                         targetCell.next(
    //                                             ".select2-container"
    //                                         );
    //                                     if (select2Container.length > 0) {
    //                                         select2Container.after(
    //                                             `<span class="text-danger error-text">${value[0]}</span>`
    //                                         );
    //                                     }
    //                                 } else {
    //                                     targetCell.after(
    //                                         `<span class="text-danger error-text">${value[0]}</span>`
    //                                     );
    //                                 }
    //                             }
    //                         } else {
    //                             // For other errors, handle them as per your existing logic
    //                             $("." + key + "_error").text(value[0]);
    //                         }
    //                     });
    //                 } else {
    //                     console.error("Error fetching edit data:", xhr.message);
    //                 // $("#branchModel").modal("hide");

    //                 // Extract error message from the response
    //                 var errorMessage =
    //                 xhr.responseJSON && xhr.responseJSON.message
    //                         ? xhr.responseJSON.message
    //                         : "An unexpected error occurred. Please try again.";
    //                 // Display the error message in SweetAlert
    //                 Swal.fire({
    //                     icon: "error",
    //                     title: "Access denied",
    //                     text: errorMessage,
    //                     customClass: {
    //                         confirmButton:
    //                             "btn btn-danger waves-effect waves-light",
    //                     },
    //                 });
    //                 }
    //             },
    //         });
    //     } else {
    //         Swal.fire({
    //             icon: "error", // Change this to "error" for error messages
    //             text: "You must have items in table to save this page.",
    //             customClass: {
    //                 confirmButton: "btn btn-danger waves-effect waves-light", // Optional: Change button styling for error
    //             },
    //         }).then(function () {
    //             location.reload();
    //         });
    //     }
    // });

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
                                    clinic.address_en,
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

    $(document).ready(function () {
        const initialBranchId = $("#clinic_select").val();
        fetchAndSetClinicAddress(initialBranchId);
    });

    $(document).on("change", "#clinic_select", function () {
        const selectedClinicId = $(this).val();
        fetchAndSetClinicAddress(selectedClinicId);
    });

    // Purchase Order Save Button - Show Payment Modal
    $("#purchase_order_save_btn").click(function () {
        $(".error-text").text("");
        $("#invoicePaymentOptionModal").modal("show");
    });

    // Purchase Order Update Button - Show Payment Modal and Load Payment Data
    $("#purchase_order_update_btn").click(function (e) {
        e.preventDefault();
        $(".error-text").text("");
        $("#invoicePaymentOptionModal").modal("show");

        // Get the purchase order ID from hidden field
        const purchaseOrderId = $("#edit_purchase_order_id").val();

        // Load payment data for this purchase order
        $.ajax({
            url: BASE_URL + "/purchase/edit-purchase-order/" + purchaseOrderId,
            type: "GET",
            success: function (response) {
                if (response.status) {
                    console.log("Purchase Order ID:", purchaseOrderId);
                    // Set the purchase order ID as data-id attribute on the save button
                    $("#savebtn").attr("data-id", purchaseOrderId);

                    // Get payment data from response
                    const payments = response.data.service_order_payments;
                    console.log("Payment data:", payments);

                    // Calculate total amount for reference
                    // let paymentOptionTotal =
                    //     calculatePaymentOptionsTotalAmount();
                    // console.log(
                    //     "Total with VAT:",
                    //     $("#item_total_with_vat").val()
                    // );

                    // Reset payment options
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

                                let paymentTypeValue = (
                                    checkbox.data("value") || ""
                                ).toLowerCase();
                                if (paymentTypeValue !== "cash") {
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
                } else {
                    console.error(
                        "Failed to get purchase order data:",
                        response.message,
                    );
                    Swal.fire({
                        icon: "error",
                        text: "Failed to load purchase order payment data",
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
                Swal.fire({
                    icon: "error",
                    text: "An error occurred while loading purchase order data",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });

    // Payment Save Button Handler
    $("#savebtn").click(function (e) {
        let totalAmount = parseFloat($("#item_total_with_vat").val()) || 0;
        let paymentOptionTotal = calculatePaymentOptionsTotalAmount();
        console.log(
            parseFloat(totalAmount) + "==" + parseFloat(paymentOptionTotal),
        );
        const isConditionMet =
            parseFloat(totalAmount) == parseFloat(paymentOptionTotal);
        let isReferenceFilled = true;
        let checkedBoxes = $(".payment-checkbox:checked");

        checkedBoxes.each(function () {
            let $parent = $(this).closest(".border-bottom");
            let paymentType = ($(this).data("value") || "").toLowerCase();
            let isCash = paymentType === "cash";

            // Cash does not need reference
            if (!isCash) {
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

        if (isConditionMet) {
            $("#invoicePaymentOptionModal").modal("hide");
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
                    const purchaseOrderId = $("#edit_purchase_order_id").val();

                    if (purchaseOrderId) {
                        updatePurchaseOrder(purchaseOrderId);
                    } else {
                        savePurchaseOrder();
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
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

    // Payment checkbox handler
    $(".payment-checkbox").on("change", function () {
        let totalAmount = parseFloat($("#item_total_with_vat").val()) || 0;
        let checkedBoxes = $(".payment-checkbox:checked");

        // Reset all
        $(".amount-input").addClass("d-none").val("");
        $(".reference-input")
            .addClass("d-none")
            .val("")
            .removeClass("is-invalid");

        let numChecked = checkedBoxes.length;

        if (numChecked > 0) {
            let amounts = [];
            let baseAmount = totalAmount / numChecked;

            // First n-1 amounts
            for (let i = 0; i < numChecked - 1; i++) {
                amounts.push(parseFloat(baseAmount.toFixed(2)));
            }

            // Last one = balance
            let sumSoFar = amounts.reduce((a, b) => a + b, 0);
            let lastAmount = parseFloat((totalAmount - sumSoFar).toFixed(2));
            amounts.push(lastAmount);

            // Assign amounts
            checkedBoxes.each(function (index) {
                let $parent = $(this).closest(".border-bottom");
                let paymentType = ($(this).data("value") || "").toLowerCase();
                let isCash = paymentType === "cash";

                $parent
                    .find(".amount-input")
                    .removeClass("d-none")
                    .val(amounts[index].toFixed(2));

                // Show reference only if not cash
                if (!isCash) {
                    $parent.find(".reference-input").removeClass("d-none");
                }
            });
        }
    });

    // Amount input handler
    $(document).on("input", ".amount-input", function () {
        distributeAmount($(this).val(), $(this).attr("id"));
    });

    // Calculate payment options total amount
    function calculatePaymentOptionsTotalAmount() {
        let sum = 0;
        $(".amount-input:not(.d-none)").each(function () {
            sum += parseFloat($(this).val()) || 0;
        });
        return sum.toFixed(2);
    }

    // Save Purchase Order Function
    function savePurchaseOrder() {
        let itemCount = $("#purchase_order_table_tbody tr").length;
        if (itemCount > 0) {
            $("#page-loader").show();
            // Extract Quill editor content
            var paymentTermsContent = paymenTermsEditor.root.innerHTML;
            var deliveryContent = deliveryEditor.root.innerHTML;

            // Serialize data from all forms
            var purchaseOrderFormData = $(
                "#purchase_order_form",
            ).serializeArray();
            var paymentFormData = $("#paymentForm").serializeArray();

            // Add Quill content to the serialized form data
            purchaseOrderFormData.push(
                { name: "payment_terms", value: paymentTermsContent },
                { name: "delivery_terms", value: deliveryContent },
            );

            // Combine both form data arrays
            var combinedData = purchaseOrderFormData.concat(paymentFormData);

            // AJAX request
            $.ajax({
                url: BASE_URL + "/purchase/purchase-order",
                type: "POST",
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
                        });
                    }
                },
                error: function (xhr, status, error) {
                    $("#page-loader").hide();
                    if (xhr.status === 422) {
                        $(".error-text").text("");
                        var errors = xhr.responseJSON.errors;
                        $.each(errors, function (key, value) {
                            if (key === "clinic_select") {
                                value[0] = "The Clinic field is required.";
                            }
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
                                    "#purchase_order_table_tbody tr",
                                ).eq(fieldIndex);
                                var targetCell = targetRow.find(
                                    `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`,
                                );

                                if (targetCell.length > 0) {
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
                                $("." + key + "_error").text(value[0]);
                            }
                        });
                    } else {
                        console.error(
                            "Error saving purchase order:",
                            xhr.message,
                        );
                        var errorMessage =
                            xhr.responseJSON && xhr.responseJSON.message
                                ? xhr.responseJSON.message
                                : "An unexpected error occurred. Please try again.";
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
                icon: "error",
                text: "You must have items in table to save this page.",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        }
    }

    // Update Purchase Order Function
    function updatePurchaseOrder(purchaseOrderId) {
        let itemCount = $("#purchase_order_table_tbody tr").length;
        if (itemCount > 0) {
            $("#page-loader").show();
            // Extract Quill editor content
            var paymentTermsContent = paymenTermsEditor.root.innerHTML;
            var deliveryContent = deliveryEditor.root.innerHTML;

            // Serialize data from all forms
            var purchaseOrderFormData = $(
                "#purchase_order_form",
            ).serializeArray();
            var paymentFormData = $("#paymentForm").serializeArray();

            // Add Quill content to the serialized form data
            purchaseOrderFormData.push(
                { name: "payment_terms", value: paymentTermsContent },
                { name: "delivery_terms", value: deliveryContent },
            );

            // Combine both form data arrays
            var combinedData = purchaseOrderFormData.concat(paymentFormData);

            // AJAX request
            $.ajax({
                url:
                    BASE_URL +
                    "/purchase/update-purchase-order/" +
                    purchaseOrderId,
                type: "PUT",
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
                        $.each(errors, function (key, value) {
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
                                    "#purchase_order_table_tbody tr",
                                ).eq(fieldIndex);
                                var targetCell = targetRow.find(
                                    `input[name="${fieldName}[${fieldIndex}]"], select[name="${fieldName}[${fieldIndex}]"]`,
                                );

                                if (targetCell.length > 0) {
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
                                $("." + key + "_error").text(value[0]);
                            }
                        });
                    } else {
                        console.error(
                            "Error updating purchase order:",
                            xhr.message,
                        );
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

    // Distribute amount function (if not already defined elsewhere)
    var manualEntries = {}; // Global variable to store manual entries

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
        let splitAmount =
            autoSplitCount > 0 ? remainingAmount / autoSplitCount : 0;

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

    $("#item_vendor_code").select2("destroy");
    $("#item_vendor_code")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#item_vendor_code").parent(),
            width: "100%",
            placeholder: "Search Vendor Code",
            allowClear: true,
            minimumInputLength: 1,
            ajax: {
                url: BASE_URL + "/purchase/search-item-vendor-by-query-code",
                // url: BASE_URL + "/search-patient-by-query",

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
            templateResult: venodorCodeformatRepo,
            templateSelection: vendorCodeformatRepoSelection,
        });

    function venodorCodeformatRepo(repo) {
        if (repo.loading) {
            return repo.text - repo.name;
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

    function vendorCodeformatRepoSelection(repo) {
        if (!repo.id) {
            return repo.text;
        }
        return repo.text; // show only vendor code, not name
    }

    $("#item_vendor_code").on("select2:select", function (e) {
        // getPatientById(e.params.data.id);
        let selectedId = e.params.data.id;
        // Set the selected option in #item_vendor_name
        // $("#item_vendor_name").val(selectedId).trigger('change');
        // Call the function to fetch patient details
        getVendorById(selectedId);
    });

    $("#item_vendor_name").select2("destroy");
    $("#item_vendor_name")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#item_vendor_name").parent(),
            width: "100%",
            placeholder: "Search Vendor Name",
            allowClear: true,
            minimumInputLength: 1,
            ajax: {
                url: BASE_URL + "/purchase/search-item-vendor-by-query-name",
                // url: BASE_URL + "/search-patient-by-query",

                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        itemVendorName: params.term,
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
            templateResult: vendorNameFormatRepo,
            templateSelection: vendorNameFormatRepoSelection,
        });

    function vendorNameFormatRepo(repo) {
        if (repo.loading) {
            return repo.text;
        }

        var markup =
            "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" +
            repo.name +
            "</div>";

        markup += "</div></div>";

        return markup;
    }

    function vendorNameFormatRepoSelection(repo) {
        return repo.name || repo.text || repo.id;
    }

    $("#item_vendor_name").on("select2:select", function (e) {
        let vendorSelectName = $("#item_vendor_name");
        let vendorNameId = e.params.data.id;
        let vendorNameName = e.params.data.text;

        // Find if the option already exists
        let existingOption = vendorSelectName.find(
            'option[value="' + vendorNameId + '"]',
        );

        if (existingOption.length) {
            // Update the text of the existing option
            existingOption.text(vendorNameName);
        } else {
            // Append a new option if not exists
            vendorSelectName.append(
                $("<option>", {
                    value: vendorNameId,
                    text: vendorNameName,
                }),
            );
        }

        // Set it as selected
        vendorSelectName.val(vendorNameId).trigger("change");

        console.log("Selected ID:", vendorNameId);
        console.log("Selected Data:", vendorNameName);

        // getPatientById(e.params.data.id);
        console.log("Selected ID:", e.params.data.id);
        console.log("Selected Data:", e.params.data.name);

        let vendorSelect = $("#item_vendor_code");
        let vendorId = e.params.data.id;
        let vendorName = e.params.data.text + "-" + e.params.data.name;

        // Check if the option already exists in the dropdown
        if (!vendorSelect.find('option[value="' + vendorId + '"]').length) {
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
    });

    $("#purchase_order_pdf").select2("destroy");
    $("#purchase_order_pdf")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#purchase_order_pdf").parent(),
            width: "100%",
            placeholder: "Search Purchase Order",
            allowClear: true,
            minimumInputLength: 1,
            ajax: {
                url: BASE_URL + "/purchase/search-purchase-order-by-query",
                // url: BASE_URL + "/search-patient-by-query",

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

    $("#purchase_order_pdf").on("select2:select", function (e) {
        getPatientById(e.params.data.id);
    });

    // $("#item_name").select2({
    //     placeholder: "Search Item Name",
    //     allowClear: true,
    //     minimumInputLength: 3,
    //     ajax: {
    //         url: BASE_URL + "/purchase/search-item-name-by-query",
    //         dataType: "json",
    //         delay: 250,
    //         data: function (params) {
    //             return {
    //                 itemName: params.term,
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
                    var sourceBranch = $("#clinic_select").val();
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

        console.log($("#item_name").text().trim());

        var itemCurrentStock = fullText.match(/Stock :\s*([\w-]+)/);
        // console.log(itemCurrentStock[1]);
        var stock = itemCurrentStock[1];
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
                    // Prepare the dropdown options based on `units`
                    let options = `<option value="" >Select</option>`;
                    if (response.data.units) {
                        response.data.units.forEach(function (unit) {
                            options += `<option value="${unit.itemUnitId}" data-unit-price="${unit.costPrice}" data-selling-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
                        });
                    }
                    var rowIndex = $("#purchase_order_table_tbody tr").length; // Calculate index
                    purchaseOrderHtml = `<tr>
                    <td class="item-sl-td test">
                                ${rowIndex + 1}
                                    
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="service-id form-control" name="item_id[${rowIndex}]" value="${
                                        response.data.itemMasterId
                                    }">
                                    ${response.data.itemName_en}
                                    <input type="hidden" class="form-control" name="sl_no[${rowIndex}]" value="${
                                        rowIndex + 1
                                    }">
                                <input type="hidden" class="service-id form-control" name="purchase_order_item_id[${rowIndex}]" value="0">

                                </td>
                                <td class="item-code-td">
                                    ${response.data.itemCode}
                                </td>
                                <td class="item-stock-td">
                                    ${stock}
                                </td>
                                <td class="item-quantity-td">
                                    <input type="number" id="item_quantity_${rowIndex}" class="form-control item-quantity" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="1">
                                    
                                </td>
                                <td class="item-unit-td" style="width: 120px;">
                                    <select id="item_unit_${rowIndex}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                        ${options}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="VAT %" name="item_unit_price[${rowIndex}]" value="0">
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="item_amount[${rowIndex}]" value="0" readonly>
                                </td>
                                <td class="item-sell-price-td">
                                    <input type="text" class="form-control" placeholder="Sell Price" name="item_selling_price[${rowIndex}]" value="0" readonly>
                                </td>
                                <td class="item-discount-td">
                                <input type="text" class="form-control item-discount" placeholder="Amount" name="item_discount[${rowIndex}]" value="0">
                            </td><td class="item-discount-in-percentage-td">
                                <input type="text" class="form-control item-discount-in-percentage" placeholder="%" name="item_discount_in_percentage[${rowIndex}]" value="0" " min="0" max="100" >
                            </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_percentage[${rowIndex}]" value="${
                                        response.data.tax.taxValueInPercentage
                                    }">
                                    
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="Percentage" name="item_vat_amount[${rowIndex}]" value="0" readonly>
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Total Amount" name="item_net_amount[${rowIndex}]" value="0" readonly>
                                </td>
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>`;

                    $("#purchase_order_table_tbody").append(purchaseOrderHtml);

                    $(`#item_unit_${rowIndex}`)
                        .val(response.data.base_unit.itemUnitId)
                        .trigger("change");

                    $(`#item_unit_${rowIndex}`).select2({
                        placeholder: "Selection", // Match the placeholder in the select
                        allowClear: true,
                    });
                    toggleDiscountColumnsAfterItemAdd();

                    updateSlColumn();
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
        $("#item_name").text("");
    });
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
    let selectedOption = $(this).find("option:selected");
    let unitPrice = selectedOption.data("unit-price");
    let sellingPrice = selectedOption.data("selling-price"); // ← FIXED

    let currentRow = $(this).closest("tr");
    currentRow.find(".item-unit-price-td input").val(unitPrice);
    currentRow.find(".item-sell-price-td input").val(sellingPrice);
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
                currentRow
                    .find(".item-unit option:selected")
                    .data("unit-price"),
            ) || 0;

        let quantity =
            parseFloat(currentRow.find(".item-quantity-td input").val()) || 0;

        let vatPercentage =
            parseFloat(currentRow.find(".vat-percentage-td input").val()) || 0;

        // Calculate base amount
        let amount = unitPrice * quantity;
        currentRow.find(".item-amount-td input").val(amount.toFixed(2));

        // -------------------
        // DISCOUNT LOGIC
        // -------------------
        let discountAmount = 0;

        // Check which discount is active
        let isFlatDiscount = currentRow.find(".flat-discount").is(":checked");
        let isPercentageDiscount = currentRow
            .find(".percentage-discount")
            .is(":checked");

        if (isPercentageDiscount) {
            let discountPercentage =
                parseFloat(
                    currentRow.find(".percentage-discount-value").val(),
                ) || 0;

            discountAmount = (amount * discountPercentage) / 100;
        }

        if (isFlatDiscount) {
            discountAmount =
                parseFloat(currentRow.find(".flat-discount-value").val()) || 0;
        }

        // Prevent discount > amount
        discountAmount = Math.min(discountAmount, amount);

        currentRow
            .find(".discount-amount-td input")
            .val(discountAmount.toFixed(2));

        // -------------------
        // VAT CALCULATION (AFTER DISCOUNT)
        // -------------------
        let taxableAmount = amount - discountAmount;

        let vatAmount = (taxableAmount * vatPercentage) / 100;
        currentRow.find(".vat-amount-td input").val(vatAmount.toFixed(2));

        // -------------------
        // NET AMOUNT
        // -------------------
        let netAmount = taxableAmount + vatAmount;
        currentRow.find(".net-amount-td input").val(netAmount.toFixed(2));
    },
);

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

$(document).on(
    "change keyup input",
    ".item-quantity-td input, .item-unit-price-td input, .vat-percentage-td input",
    function () {
        const row = $(this).closest("tr");
        const isFlat = $("#flatDiscount").is(":checked");
        if (isFlat) {
            calculateRowValues(row);
            calculateFlatDiscountTableTotals();
        } else {
            calculateDiscountPercentage(row);
            calculatePercentageDiscountTableTotals();
        }
    },
);


$(document).on("input", ".reference-input", function () {
    let val = $(this).val();
    val = val.replace(/[^a-zA-Z0-9\s\-]/g, "");
    $(this).val(val);
});

$(document).on("keydown", ".reference-input", function (e) {
    const blocked = ['!','@','#','$','%','^','&','*','(',')','+','=','[',']','{','}','|','\\',':',';','"',"'",'<','>',',','.','?','/','`','~'];
    if (blocked.includes(e.key)) {
        e.preventDefault();
    }
});

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

        let itemDiscountPercentage =
            parseFloat(
                $(this).find(".item-discount-in-percentage-td input").val(),
            ) || 0;

        // 1. Gross amount
        let amount = quantity * unitPrice;
        let discountAmount = 0;
        // 2. Discount
        $("#flatDiscount").on("change", function () {
            if ($(this).is(":checked")) {
                discountAmount = (amount * itemDiscountPercentage) / 100;
            }
        });

        $("#percentageDiscount").on("change", function () {
            if ($(this).is(":checked")) {
                discountAmount = itemDiscountPercentage;
            }
        });

        // 3. Taxable amount
        let taxableAmount = amount - discountAmount;

        // 4. VAT
        let vatAmount = (taxableAmount * vatPercentage) / 100;

        // 5. Net amount
        let netAmount = taxableAmount + vatAmount;

        // Update fields
        $(this).find(".item-amount-td input").val(amount.toFixed(2));
        $(this)
            .find(".discount-amount-td input")
            .val(discountAmount.toFixed(2));
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
        (totalAfterDiscount + totalVatAmount).toFixed(2),
    );
    $("#item_vat_total_percentage").val(totalVatPercentage.toFixed(2));
}

// Remove row and recalculate totals
$(document).on("click", ".remove-row", function () {
    $(this).closest("tr").remove();
    var purchaseOrderitem = $(this).data("id");
    var itemMasterId = $(this).data("type");
    if (purchaseOrderitem > 0 && itemMasterId > 0) {
        deleteAlreadyExistItem(purchaseOrderitem, itemMasterId);
    } else {
        calculateTableTotals();
        updateSlColumn();
    }
});

function initialPageLoad(editPurchaseOrderId) {
    $.ajax({
        url: BASE_URL + "/purchase/edit-purchase-order/" + editPurchaseOrderId,
        type: "GET",
        success: function (response) {
            if (response.status === true) {
                $("#po_no").val("#" + response.data.poNo);

                $("#order_date").val(response.data.date);
                $("#delivery_date").val(response.data.deliveryDate);
                $("#attention").val(response.data.attention);
                $("#enquiry_no").val(response.data.enquiryNo);

                $("#clinic_select")
                    .val(response.data.clinicId)
                    .trigger("change");
                var savedDepartmentId = response.data.departmentId;
                $("#loader-overlay").show();
                $.ajax({
                    url:
                        BASE_URL +
                        "/purchase/get-item-department-by-branch-id/" +
                        response.data.clinicId,

                    type: "GET",

                    success: function (deptResponse) {
                        $("#loader-overlay").hide();
                        if (deptResponse.status) {
                            const departmentSelect = $("#department_select");

                            departmentSelect
                                .find("option")
                                .not(":first")
                                .remove();

                            deptResponse.data.forEach(function (department) {
                                departmentSelect.append(
                                    $("<option>", {
                                        value: department.departmentId,

                                        text: department.department_name_en,
                                    }),
                                );
                            });

                            // Now set the saved department value

                            departmentSelect
                                .val(savedDepartmentId)
                                .trigger("change");
                        }
                    },

                    error: function (xhr, status, error) {
                        console.error(
                            "AJAX Error loading departments: ",
                            status,
                            error,
                        );
                    },
                });
                $("#receiver_note").val(response.data.receiverNote);
                $("#item_discount_percentage").val(
                    response.data.discountPercent,
                );
                $("#item_discount_amount").val(response.data.discountAmount);
                $("#item_total_after_discount").val(
                    response.data.totalamountAfterAiscount,
                );
                $("#item_vat_total_percentage").val(response.data.vatInPercent);
                $("#item_vat_total").val(response.data.vatAmount);
                $("#item_total_with_vat").val(response.data.totalWithVatAmount);

                $("#item_vendor_name").append(
                    $("<option>", {
                        value: response.data.vendor.vendorId, // Set the value as the vendorId
                        text: response.data.vendor.vendor_name_en, // Set the text as the vendor name
                    }),
                );
                // Set the newly added or existing option as selected
                $("#item_vendor_name")
                    .val(response.data.vendor.vendorId)
                    .trigger("change");

                $("#item_vendor_code").append(
                    $("<option>", {
                        value: response.data.vendor.vendorId, // Set the value as the vendorId
                        text: response.data.vendor.vendor_code, // Set the text as the vendor name
                    }),
                );
                // Set the newly added or existing option as selected
                $("#item_vendor_code")
                    .val(response.data.vendor.vendorId)
                    .trigger("change");

                // Bind Payment Terms
                if (response.data.payment_terms) {
                    $("#paymen_terms_editor p").text(
                        response.data.paymentTerms,
                    ); // Set the text inside the editor
                    $("#payment_terms").val(response.data.paymentTerms); // Set the hidden input value
                }

                // Bind Delivery Terms
                if (response.data.delivery_terms) {
                    $("#delivery_editor p").text(response.data.deliveryTerms); // Set the text inside the editor
                    $("#delivery_terms").val(response.data.deliveryTerms); // Set the hidden input value
                }

                totalNetAmount = pupulatePurchaseOrderItems(
                    response.data.items,
                );

                $("#item_total").val(response.data.totalAmount);
                $("#item_discount_percentage").val(
                    response.data.discountPercent,
                );
                $("#item_discount_amount").val(response.data.discountAmount);
                $("#item_discount_amount").val(response.data.discountAmount);
                $("#item_total_after_discount").val(
                    response.data.totalAmountAfterDiscount,
                );
                $("#item_vat_total_percentage").val(response.data.vatInPercent);
                $("#item_vat_total").val(response.data.vatAmount);
                $("#item_total_with_vat").val(response.data.totalWithVatAmount);

                if (response.data.discountType == 0) {
                    $("#flatDiscount").prop("checked", true);
                    $("#percentage").prop("checked", false);
                    discountTypeFlat();
                } else {
                    $("#percentage").prop("checked", true);
                    $("#flatDiscount").prop("checked", false);
                    discountTypePercentage();
                }

                $;
            }
            $("#table-loader").hide();
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
                unitoptions += `<option value="${unit.itemUnitId}" data-unit-price="${unit.costPrice}" data-selling-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
            });
        }
        // Accumulate the total net amount
        totalNetAmount += parseFloat(purchaseOrderItem.amount_with_vat || 0);
        var rowIndex = $("#purchase_order_table_tbody tr").length; // Calculate index

        editPurchaseOrderHtml = `<tr>
        <td class="item-sl-td">
                                ${rowIndex + 1}
                                
                                
                                    
                                </td>
                                <td class="item-name-td">
                                    <input type="hidden" class="service-id form-control" name="item_id[${rowIndex}]" value="${
                                        purchaseOrderItem.itemMasterId
                                    }">
                                    ${purchaseOrderItem.item.itemName_en}
                                    <input type="hidden" class="form-control" name="sl_no[${rowIndex}]" value="${
                                        rowIndex + 1
                                    }">
        <input type="hidden" class="service-id form-control" name="purchase_order_item_id[${rowIndex}]" value="${
            purchaseOrderItem.purchaseOrderItemId
        }">
                                </td>
                                <td class="item-code-td">
                                ${purchaseOrderItem.item.itemCode}
                                </td>
                                <td class="item-stock-td">
                                ${purchaseOrderItem.stockQuantity ?? 0}
                                </td>
                                <td class="item-quantity-td">
                                    <input type="number" class="form-control item-quantity" placeholder="Quantity" name="item_quantity[${rowIndex}]" value="${
                                        purchaseOrderItem.quantity
                                    }" >
                                </td>
                                <td class="item-unit-td" style="width: 120px;">
                                    <select id="item_unit_${index}" name="item_unit[${rowIndex}]" placeholder="Selection" class="select2 form-select form-select-lg item-unit" data-allow-clear="true">
                                    ${unitoptions}
                                    </select>
                                </td>
                                <td class="item-unit-price-td">
                                    <input type="text" class="form-control" placeholder="Unit Price" name="item_unit_price[${rowIndex}]" value="${
                                        purchaseOrderItem.unitPrice
                                    }" >
                                </td>
                                <td class="item-amount-td">
                                    <input type="text" class="form-control" placeholder="Amount" name="item_amount[${rowIndex}]" value="${
                                        purchaseOrderItem.amount
                                    }" readonly>
                                </td>
                                <td class="item-sell-price-td">
                                    <input type="text" class="form-control" placeholder="Sell Price" name="item_selling_price[${rowIndex}]" value="${purchaseOrderItem.sellingPrice}" readonly>
                                </td>
                                <td class="item-discount-td">
                                <input type="text" class="form-control item-discount" placeholder="Amount" name="item_discount[${rowIndex}]" value="${purchaseOrderItem.discountAmount}">
                            </td><td class="item-discount-in-percentage-td">
                                <input type="text" class="form-control item-discount-in-percentage" placeholder="%" name="item_discount_in_percentage[${rowIndex}]" value="${purchaseOrderItem.discountPercentage}" min="0" max="100">
                            </td>
                                <td class="vat-percentage-td">
                                    <input type="text" class="form-control" placeholder="VAT Percentage" name="item_vat_percentage[${rowIndex}]" value="${
                                        purchaseOrderItem.vatPercent
                                    }">
                                </td>
                                <td class="vat-amount-td">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="item_vat_amount[${rowIndex}]" value="${
                                        purchaseOrderItem.vatAmount
                                    }" readonly>
                                </td>
                                <td class="net-amount-td">
                                    <input type="text" class="form-control" placeholder="Net Amount" name="item_net_amount[${rowIndex}]" value="${
                                        purchaseOrderItem.amountWithVat
                                    }" readonly>
                                </td>
                                <td class="remove-td">
                                    <button type="button" class="btn btn-danger remove-row" data-id="${
                                        purchaseOrderItem.purchaseOrderItemId
                                    }" data-type="${
                                        purchaseOrderItem.itemMasterId
                                    }">X</button>
                                </td>
                            </tr>`;

        // Append the generated HTML to the table body
        $("#purchase_order_table_tbody").append(editPurchaseOrderHtml);

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
            // console.log('itemUnitId=>'+purchaseOrderItemitemUnit);
        }
        // $purchaseOrderItem?->itemUnit?->unit?->unit_name_en
    });

    return totalNetAmount;
}

$(document).on("change", ".item-unit-td select", function () {
    calculateRowTotals();
    calculateTableTotals();
});

// Remove row and update SL column
// $(document).on("click", ".remove-row", function () {
//     $(this).closest("tr").remove();
//     updateSlColumn();
// });

// Update SL column sequence
// function updateSlColumn() {
//     $("#purchase_order_table_tbody tr").each(function (index) {
//         $(this)
//             .find(".item-sl-td")
//             .text(index + 1);
//     });
// }

$(document).on("click", "#thermalPrintBtn", function (e) {
    e.preventDefault(); // Prevent default anchor behavior
    const selectedValue = $("#purchase_order_pdf").val(); // Get selected value
    if (!selectedValue) {
        // alert('Please select a vendor before printing.');
        $(".purchase_order_pdf_error").text(
            "Please select a purchase order before printing.",
        );
        return;
    }
    const url =
        thermalPrintUrl +
        "?purchaseOrderId=" +
        encodeURIComponent(selectedValue);
    window.open(url, "_blank"); // Open URL in a new tab
});

$(document).on("click", "#printBtn", function (e) {
    e.preventDefault(); // Prevent default anchor behavior
    const selectedValue = $("#purchase_order_pdf").val(); // Get selected value
    if (!selectedValue) {
        $(".purchase_order_pdf_error").text(
            "Please select a purchase order before printing.",
        );
        return;
    }
    const url =
        printUrl + "?purchaseOrderId=" + encodeURIComponent(selectedValue);
    window.open(url, "_blank"); // Open URL in a new tab
});

// Update SL column sequence
function updateSlColumn() {
    $("#purchase_order_table_tbody tr").each(function (index) {
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
        // $(this)
        //     .find(".item-remark-td input")
        //     .attr("name", `item_remark[${index}]`);
    });
}

function deleteAlreadyExistItem(purchaseOrderitem, itemMasterId) {
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
                    "/purchase/delete-purchase-order-item/" +
                    purchaseOrderitem +
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

// Prevent typing negative sign (-) or 'e' (for scientific notation)
$(document).on("keydown", ".item_discount_percentage", function (e) {
    if (e.key === "-" || e.key === "e") {
        e.preventDefault();
    }
});

// Ensure value is between 0 and 100 and remove leading zeros
$(document).on("input", ".item_discount_percentage", function () {
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

$(document).on("input", ".vat-percentage-td input", function () {
    let value = $(this).val();

    // Allow only digits and one dot
    value = value.replace(/[^0-9.]/g, ""); // Remove all except digits and dot
    value = value.replace(/(\..*)\./g, "$1"); // Prevent more than one dot

    // Allow only two digits after the decimal
    value = value.replace(/^(\d+)(\.\d{0,2})?.*$/, "$1$2");

    // Update the field
    $(this).val(value);
});

$(document).on("input", ".item-discount-in-percentage", function () {
    let value = this.value;

    value = value.replace(/[^0-9.]/g, "");

    if ((value.match(/\./g) || []).length > 1) {
        value = value.substring(0, value.length - 1);
    }

    this.value = value;
});

$(document).on("input", ".item-discount", function () {
    let value = this.value;
    value = value.replace(/[^0-9.]/g, "");
    if ((value.match(/\./g) || []).length > 1) {
        value = value.substring(0, value.length - 1);
    }

    // Cap at 100% of the row's amount
    const row = $(this).closest("tr");
    const unitPrice =
        parseFloat(row.find("input[name^='item_unit_price']").val()) || 0;
    const quantity =
        parseFloat(row.find("input[name^='item_quantity']").val()) || 0;
    const maxDiscount = unitPrice * quantity;

    if (parseFloat(value) > maxDiscount) {
        value = maxDiscount.toFixed(2);
    }

    this.value = value;
});

// function discountTypeFlat() {
//     console.log("Flat discount selected");
//     $("#purchase_order_table .discount-percentage-th").hide();
//     $("#purchase_order_table .discount-th").show();
//     toggleDiscountColumnsAfterItemAdd();
//     // your code
// }

// function discountTypePercentage() {
//     console.log("Percentage discount selected");
//     $("#purchase_order_table .discount-th").hide();
//     $("#purchase_order_table .discount-percentage-th").show();
//     toggleDiscountColumnsAfterItemAdd();
//     // your code
// }

function discountTypeFlat() {
    console.log("Flat discount selected");

    // Before hiding, save percentage values
    $("#purchase_order_table tbody tr").each(function (index) {
        var percentageValue = $(this)
            .find(".item-discount-in-percentage")
            .val();
        $(this)
            .find(".item-discount-in-percentage")
            .data("saved-value", percentageValue);

        // Restore previously saved flat discount value
        var savedFlatValue = $(this).find(".item-discount").data("saved-value");
        if (savedFlatValue !== undefined) {
            $(this).find(".item-discount").val(savedFlatValue);
        }
    });

    $("#purchase_order_table .discount-percentage-th").hide();
    $("#purchase_order_table .discount-th").show();
    toggleDiscountColumnsAfterItemAdd();
}

function discountTypePercentage() {
    console.log("Percentage discount selected");

    // Before hiding, save flat discount values
    $("#purchase_order_table tbody tr").each(function (index) {
        var flatValue = $(this).find(".item-discount").val();
        $(this).find(".item-discount").data("saved-value", flatValue);

        // Restore previously saved percentage value
        var savedPercentageValue = $(this)
            .find(".item-discount-in-percentage")
            .data("saved-value");
        if (savedPercentageValue !== undefined) {
            $(this)
                .find(".item-discount-in-percentage")
                .val(savedPercentageValue);
        }
    });

    $("#purchase_order_table .discount-th").hide();
    $("#purchase_order_table .discount-percentage-th").show();
    toggleDiscountColumnsAfterItemAdd();
}

function toggleDiscountColumnsAfterItemAdd() {
    const isFlat = $("#flatDiscount").is(":checked");
    if (isFlat) {
        $("#purchase_order_table_tbody .item-discount-td").show();
        $("#purchase_order_table_tbody .item-discount-in-percentage-td").hide();
        $("#purchase_order_table .discount-th").show();
        $("#purchase_order_table .discount-percentage-th").hide();
        calculateFlatDiscountTableTotals();
    } else {
        $("#purchase_order_table_tbody .item-discount-in-percentage-td").show();
        $("#purchase_order_table_tbody .item-discount-td").hide();
        $("#purchase_order_table .discount-th").hide();
        $("#purchase_order_table .discount-percentage-th").show();
        calculatePercentageDiscountTableTotals();
    }
    console.log("called");
    recalculateAllRows();
}

$(document).on("blur input", ".item-discount", function () {
    const row = $(this).closest("tr");
    calculateRowValues(row);
    calculateFlatDiscountTableTotals();
});

const truncateDecimals = (num, decimals) => {
    const multiplier = Math.pow(10, decimals);
    return Math.floor(num * multiplier) / multiplier;
};

function calculateRowValues(row) {
    const unitPrice = parseFloat(row.find("input[name^='item_unit_price']").val()) || 0;
    const quantity = parseFloat(row.find("input[name^='item_quantity']").val()) || 0;
    let discount = parseFloat(row.find(".item-discount").val()) || 0;
    const vatPercentage = parseFloat(row.find("input[name^='item_vat_percentage']").val()) || 0;
    let amount = unitPrice * quantity;
    row.find("input[name^='item_amount']").val(amount.toFixed(2));

    if (discount > amount) {
        discount = amount;
        row.find(".item-discount").val(discount.toFixed(2));
    }
    let discountedAmount = amount - discount;
    let vatAmount = truncateDecimals((discountedAmount * vatPercentage) / 100, 2);
    row.find("input[name^='item_vat_amount']").val(vatAmount.toFixed(2));

    let netTotal = discountedAmount + vatAmount;
    row.find("input[name^='item_net_amount']").val(netTotal.toFixed(2));

    calculateFlatDiscountTableTotals();
}

$(document).on("blur input", ".vat-percentage-td input", function () {
    const row = $(this).closest("tr");
    const isFlat = $("#flatDiscount").is(":checked");
    if (isFlat) {
        calculateRowValues(row);
        calculateFlatDiscountTableTotals();
    } else {
        calculateDiscountPercentage(row);
        calculatePercentageDiscountTableTotals();
    }
});

function calculateFlatDiscountTableTotals() {
    let totalAmount = 0;
    let discountAmount = 0;
    let totalVatAmount = 0;
    let sumOfVatPercentages = 0;
    $("#purchase_order_table_tbody tr").each(function () {
        const rowAmount = parseFloat($(this).find(".item-amount-td input").val()) || 0;
        const rowDiscount = parseFloat($(this).find(".item-discount-td input").val()) || 0;
        const rowVatPct = parseFloat($(this).find(".vat-percentage-td input").val()) || 0;
        totalAmount += rowAmount;
        discountAmount += rowDiscount;
        sumOfVatPercentages += rowVatPct;
        const discountedRowAmount = rowAmount - rowDiscount;
        const rowVatAmount = truncateDecimals((discountedRowAmount * rowVatPct) / 100, 2);
        totalVatAmount += rowVatAmount;

        $(this).find(".vat-amount-td input").val(rowVatAmount.toFixed(2));
        $(this).find(".net-amount-td input").val((discountedRowAmount + rowVatAmount).toFixed(2));
    });

    const totalAfterDiscount = totalAmount - discountAmount;
    const totalWithVat = totalAfterDiscount + totalVatAmount;
    $("#item_total").val(totalAmount.toFixed(2));
    $("#item_discount_amount").val(discountAmount.toFixed(2));
    $("#item_total_after_discount").val(totalAfterDiscount.toFixed(2));
    $("#item_vat_total_percentage").val(sumOfVatPercentages.toFixed(2));
    $("#item_vat_total").val(totalVatAmount.toFixed(2));
    $("#item_total_with_vat").val(totalWithVat.toFixed(2));
}

// Trigger when typing or leaving the field
$(document).on(
    "blur input",
    "input[name^='item_discount_in_percentage']",
    function () {
        const row = $(this).closest("tr");
        calculateDiscountPercentage(row);
        calculatePercentageDiscountTableTotals();
    },
);

function calculateDiscountPercentage(row) {
    const unitPrice = parseFloat(row.find("input[name^='item_unit_price']").val()) || 0;
    const quantity = parseFloat(row.find("input[name^='item_quantity']").val()) || 0;
    const vatPercentage = parseFloat(row.find("input[name^='item_vat_percentage']").val()) || 0;
    let discountPercentage = parseFloat(row.find("input[name^='item_discount_in_percentage']").val());
    if (isNaN(discountPercentage)) discountPercentage = 0;
    let amount = unitPrice * quantity;
    row.find("input[name^='item_amount']").val(amount.toFixed(2));
    if (discountPercentage > 100) {
        discountPercentage = 100;
        row.find("input[name^='item_discount_in_percentage']").val(100);
    }
    let discount = (amount * discountPercentage) / 100;
    let discountedAmount = amount - discount;
    let vatAmount = truncateDecimals((discountedAmount * vatPercentage) / 100, 2);
    row.find("input[name^='item_vat_amount']").val(vatAmount.toFixed(2));
    let netAmount = discountedAmount + vatAmount;
    row.find("input[name^='item_net_amount']").val(netAmount.toFixed(2));

    calculatePercentageDiscountTableTotals();
}

function calculatePercentageDiscountTableTotals() {
    let totalAmount = 0;
    let totalDiscountAmount = 0;
    let totalVatAmount = 0;
    let sumOfVatPercentages = 0;
    $("#purchase_order_table_tbody tr").each(function () {
        const amount = parseFloat($(this).find(".item-amount-td input").val()) || 0;
        const discountPct = parseFloat($(this).find(".item-discount-in-percentage-td input").val()) || 0;
        const vatPct = parseFloat($(this).find(".vat-percentage-td input").val()) || 0;
        totalAmount += amount;
        const discountAmount = (amount * discountPct) / 100;
        totalDiscountAmount += discountAmount;
        const discountedAmount = amount - discountAmount;
        const vatAmount = truncateDecimals((discountedAmount * vatPct) / 100, 2);
        totalVatAmount += vatAmount;
        sumOfVatPercentages += vatPct;
    });

    const totalAfterDiscount = totalAmount - totalDiscountAmount;
    const totalWithVat = totalAfterDiscount + totalVatAmount;
    $("#item_total").val(totalAmount.toFixed(2));
    $("#item_discount_amount").val(totalDiscountAmount.toFixed(2));
    $("#item_total_after_discount").val(totalAfterDiscount.toFixed(2));
    $("#item_vat_total_percentage").val(sumOfVatPercentages.toFixed(0));
    $("#item_vat_total").val(totalVatAmount.toFixed(2));
    $("#item_total_with_vat").val(totalWithVat.toFixed(2));
}

function recalculateAllRows() {
    $("#purchase_order_table_tbody tr").each(function () {
        const row = $(this);

        const unitPrice =
            parseFloat(row.find("input[name^='item_unit_price']").val()) || 0;
        const quantity =
            parseFloat(row.find("input[name^='item_quantity']").val()) || 0;
        let discount =
            parseFloat(row.find("input[name^='item_discount']").val()) || 0;
        const discountPercentage =
            parseFloat(
                row.find("input[name^='item_discount_in_percentage']").val(),
            ) || 0;
        const vatPercentage =
            parseFloat(row.find("input[name^='item_vat_percentage']").val()) ||
            0;

        // Amount
        const amount = unitPrice * quantity;
        row.find("input[name^='item_amount']").val(amount.toFixed(2));

        // If % discount is present, convert to flat
        if (discountPercentage > 0) {
            discount = (amount * discountPercentage) / 100;
            // row.find("input[name^='item_discount']").val(discount.toFixed(2));
        }

        // Prevent discount > amount
        if (discount > amount) {
            discount = amount;
            row.find("input[name^='item_discount']").val(discount.toFixed(2));
        }

        const discountedAmount = amount - discount;

        // VAT
        let vatAmount = (discountedAmount * vatPercentage) / 100;
        vatAmount = truncateDecimals(vatAmount, 2);
        row.find("input[name^='item_vat_amount']").val(vatAmount.toFixed(2));

        // Net Amount
        const netAmount = discountedAmount + vatAmount;
        row.find("input[name^='item_net_amount']").val(netAmount.toFixed(2));
    });

    // Recalculate totals after updating all rows
    // calculateFlatDiscountTableTotals();
}

function reassignZeroToDiscountSectionFields() {
    var flatDiscount = $("#flatDiscount").is(":checked") ? true : false;
    $("#purchase_order_table_tbody tr").each(function () {
        const row = $(this);
        if (flatDiscount) {
            row.find("input[name^='item_discount']").val(0);
        } else {
            row.find("input[name^='item_discount_in_percentage']").val(0);
        }
    });

    // Recalculate totals after updating all rows
    // calculateFlatDiscountTableTotals();
}

$(document).on(
    "input paste keyup",
    ".item-discount-in-percentage",
    function (e) {
        let value = parseFloat($(this).val());

        // If value is empty or not a number, set to 0
        if (isNaN(value) || $(this).val() === "") {
            return;
        }

        // If value is less than 0, set to 0
        if (value < 0) {
            $(this).val(0);
            return;
        }

        // If value is greater than 100, set to 100
        if (value > 100) {
            $(this).val(100);

            // Optional: Show a warning message
            // alert('Discount percentage cannot exceed 100%');
            // Or use a toast notification
        }
    },
);

// Handle paste event separately to ensure immediate validation
$(document).on("paste", ".item-discount-in-percentage", function (e) {
    let $input = $(this);

    // Use setTimeout to get the pasted value after it's inserted
    setTimeout(function () {
        let value = parseFloat($input.val());

        if (isNaN(value) || $input.val() === "") {
            return;
        }

        if (value < 0) {
            $input.val(0);
        } else if (value > 100) {
            $input.val(100);
        }

        // Trigger calculation if you have one
        // calculateTableTotals();
    }, 10);
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
