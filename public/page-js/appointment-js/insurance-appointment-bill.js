let amountToDistribute1 = 0;
let totalbalanceAmount = 0;
let totalvalue = 0;

$(document).ready(function () {
    $("#bill_main_menu").addClass("active open menu-item-animating");
    $("#bill_invoice_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
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

    // let grandTotal = 0;
    let patientSelected = false;
    let serviceAdded = false;

    var grandTotal = parseFloat($("#final-total").text().trim()) || 0;

    // $('.payment-checkbox').change(function () {
    //     var selectedCheckboxes = $('.payment-checkbox:checked');
    //     var numberOfSelected = selectedCheckboxes.length;

    //     // Divide equally
    //     var amountToDistribute = numberOfSelected > 0 ? (grandTotal / numberOfSelected).toFixed(2) : 0;

    //     $('.payment-checkbox').each(function () {
    //         var $parentDiv = $(this).closest('div.border-bottom');
    //         var value = $(this).data('value');

    //         if ($(this).is(':checked')) {
    //             // Show amount input and distribute value
    //             $parentDiv.find('.amount-input').removeClass('d-none').val(amountToDistribute);

    //             // Reference number visible only if not cash
    //             if (value !== 'cash') {
    //                 $parentDiv.find('.reference-input').removeClass('d-none');
    //             } else {
    //                 $parentDiv.find('.reference-input').val('').addClass('d-none');
    //             }
    //         } else {
    //             // Reset hidden fields
    //             $parentDiv.find('.amount-input').addClass('d-none').val('');
    //             $parentDiv.find('.reference-input').addClass('d-none').val('');
    //         }
    //     });
    // });

    function getNetAmount() {
        const txt = $("#final-total").text().trim();
        // remove thousand separators if any
        return parseFloat((txt || "0").replace(/[, ]/g, "")) || 0;
    }

    function distributePayments() {
        const total = getNetAmount();
        const $checked = $(".payment-checkbox:checked");
        const n = $checked.length;

        // Reset/show fields per checkbox state first
        $(".payment-checkbox").each(function () {
            const $parent = $(this).closest("div.border-bottom");
            const isChecked = $(this).is(":checked");
            const method = ($(this).data("value") || "")
                .toString()
                .toLowerCase();

            if (isChecked) {
                $parent
                    .find(".amount-input")
                    .removeClass("d-none")
                    .prop("disabled", false);

                if (method !== "cash") {
                    $parent
                        .find(".reference-input")
                        .removeClass("d-none")
                        .prop("disabled", false);
                } else {
                    $parent
                        .find(".reference-input")
                        .val("")
                        .addClass("d-none")
                        .prop("disabled", true);
                }
            } else {
                $parent
                    .find(".amount-input")
                    .addClass("d-none")
                    .val("")
                    .prop("disabled", true);

                $parent
                    .find(".reference-input")
                    .addClass("d-none")
                    .val("")
                    .prop("disabled", true);
            }
        });

        if (n === 0) return;

        // --- Exact distribution in cents ---
        let totalCents = Math.round(total * 100); // e.g. 8.63 => 863
        const base = Math.floor(totalCents / n); // base cents per method
        let remainder = totalCents - base * n; // remaining cents to spread

        // assign amounts to checked methods in DOM order
        $checked.each(function () {
            let cents = base;
            if (remainder > 0) {
                cents += 1;
                remainder -= 1;
            }
            const amount = (cents / 100).toFixed(2);

            const $parent = $(this).closest("div.border-bottom");
            $parent.find(".amount-input").val(amount);
        });
    }

    $(document).on("change", ".payment-checkbox", distributePayments);

    $("#savebtn").click(function (e) {
        let totalAmount = parseFloat($("#final-total").text().trim()) || 0;
        let paymentOptionTotal = calculatePaymentOptionsTotalAmount();
        console.log(
            parseFloat(totalAmount) + "==" + parseFloat(paymentOptionTotal), // chk
        );
        console.log(parseFloat(totalAmount) == parseFloat(paymentOptionTotal)); //chk
        const isConditionMet =
            parseFloat(totalAmount) == parseFloat(paymentOptionTotal);
        let isReferenceFilled = true;
        let checkedBoxes = $(".payment-checkbox:checked");

        checkedBoxes.each(function () {
            let $parent = $(this).closest(".border-bottom");
            let methodName = $(this).data("value"); // 'cash', 'card', etc.aLL

            // CASH NO REFRENCVE CHK ;IF
            if (methodName === "cash") {
                return; // continueING
            }

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
                    saveAppointmentInvoice($("#savebtn").attr("id"));
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

    invoiceIssuedDate();
    fetchNextInvoiceNumber();

    // $('#department').on('change', function () {
    //     updateProviderList();
    // });

    // $('#branchSelect').on('change', function () {
    //     branchSelect = $(this).val();
    //     updateProviderList();
    // });
});

function calculatePaymentOptionsTotalAmount() {
    let sum = 0;
    $(".amount-input:not(.d-none)").each(function () {
        sum += parseFloat($(this).val()) || 0;
    });

    // Display the total sum somewhere (modify this as needed)
    return sum.toFixed(2);
}

function saveAppointmentInvoice(params) {
    let itemCount = $("#insurance_appointment_bill_body tr").length;
    if (itemCount > 0) {
        // Serialize data from all forms and convert it to a proper format
        var invoiceFormData = $("#insurance_appointment_bill_form").serialize();
        var paymentFormData = $(
            "#insurance_appointment_payment_form",
        ).serialize();
        var combinedData = invoiceFormData + "&" + paymentFormData;
        // AJAX request
        $("#loader-overlay").show();
        $.ajax({
            url: BASE_URL + "/appointment-bill-payment",
            type: "POST",
            data: combinedData, // Properly formatted form data
            success: function (response) {
    $("#loader-overlay").hide();
    if (response.status === true) {
        $("#savemodal").hide().off("click"); ;
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
        const url =
            invoiceThermalPrintUrl +
            "?invoiceId=" +
            encodeURIComponent(response.data.invoiceId);
        window.open(url, "_blank");
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        const url =
            invoiceA4PrintUrl +
            "?invoiceId=" +
            encodeURIComponent(response.data.invoiceId);
        window.open(url, "_blank");
    }

    $("#savemodal").hide();
    location.reload(); // Simple reload — blade reads status from DB
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
                $("#loader-overlay").hide();
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

function fetchNextInvoiceNumber() {
    $.ajax({
        url: BASE_URL + "/get-next-invoice-number",
        type: "GET",
        success: function (response) {
            if (response.status && response.nextInvoiceNumber) {
                $("#invoiceId").val(response.nextInvoiceNumber);
            } else {
                console.error("Failed to fetch next invoice number");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching next invoice number:", error);
        },
    });
}

function invoiceIssuedDate() {
    var today = new Date();
    var day = String(today.getDate()).padStart(2, "0");
    var month = String(today.getMonth() + 1).padStart(2, "0");
    var year = today.getFullYear();
    var formattedDate = `${year}-${month}-${day}`;
    $("#dateIssued").val(formattedDate);
    $("#billIssuedDate").val(formattedDate);
}

function updateProviderList() {
    var departmentId = $("#department").val();
    var clinicId = $("#branchSelect").val();
    var $employeeSelect = $("#providerselect");

    $employeeSelect.empty();
    $employeeSelect.append('<option value="">Select Employee</option>');

    if (departmentId && clinicId) {
        $.ajax({
            url: BASE_URL + "/get-employees-by-department/" + departmentId,
            type: "GET",
            dataType: "json",
            data: { clinicId: clinicId },
            success: function (response) {
                if (response.status === true && response.data.length > 0) {
                    var doctors = [];
                    var nurses = [];

                    $.each(response.data, function (index, employee) {
                        if (
                            employee.employee.role === "both" ||
                            employee.employee.role === "doctor"
                        ) {
                            doctors.push(employee);
                        }
                        if (employee.employee.role === "nurse") {
                            nurses.push(employee);
                        }
                    });

                    if (doctors.length > 0) {
                        $employeeSelect.append('<optgroup label="Doctors">');
                        $.each(doctors, function (index, employee) {
                            $employeeSelect.append(
                                $("<option>", {
                                    value: employee.employee.employeeId,
                                    text:
                                        employee.employee.firstName_en +
                                        " " +
                                        employee.employee.secondName_en +
                                        " " +
                                        employee.employee.thirdName_en +
                                        " " +
                                        employee.employee.lastName_en,
                                }),
                            );
                        });
                        $employeeSelect.append("</optgroup>");
                    }

                    if (nurses.length > 0) {
                        $employeeSelect.append('<optgroup label="Nurses">');
                        $.each(nurses, function (index, employee) {
                            $employeeSelect.append(
                                $("<option>", {
                                    value: employee.employee.employeeId,
                                    text:
                                        employee.employee.firstName_en +
                                        " " +
                                        employee.employee.secondName_en +
                                        " " +
                                        employee.employee.thirdName_en +
                                        " " +
                                        employee.employee.lastName_en,
                                }),
                            );
                        });
                        $employeeSelect.append("</optgroup>");
                    }
                } else {
                    $employeeSelect.append(
                        '<option value="" disabled>No employees found for this department and clinic</option>',
                    );
                }
            },
            error: function (xhr, status, error) {
                console.error("Error fetching employees:", error);
                $employeeSelect.append(
                    '<option value="" disabled>Error fetching employees</option>',
                );
            },
        });
    } else if (!departmentId && !clinicId) {
        $employeeSelect.append(
            '<option value="" disabled>Please select both clinic and department</option>',
        );
    } else if (!departmentId) {
        $employeeSelect.append(
            '<option value="" disabled>Please select a department</option>',
        );
    } else if (!clinicId) {
        $employeeSelect.append(
            '<option value="" disabled>Please select a clinic</option>',
        );
    }
}
