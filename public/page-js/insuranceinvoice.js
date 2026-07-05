let amountToDistribute1 = 0;
let totalbalanceAmount = 0;
let totalvalue = 0;

$(document).ready(function () {
    $("#bill_main_menu").addClass("active open menu-item-animating");
    $("#bill_insurance_invoice_sub_menu").addClass("active");
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

    let grandTotal = 0;
    let patientSelected = false;
    let serviceAdded = false;
    const truncateDecimals = (num, decimals) => {
        const multiplier = Math.pow(10, decimals);
        return Math.floor(num * multiplier) / multiplier;
    };
    function calculateTotal() {
        grandTotal = 0;
        var vatEnabled = $("#selectnationality").val() !== "0";
        $("tbody#service_div tr").each(function () {
            var quantity = parseFloat($(this).find(".quantity").val()) || 0;
            var cost = parseFloat($(this).find(".cost").val()) || 0;
            var discountPercent =
                parseFloat($(this).find(".discount-percent").val()) || 0;
            var vatPercent = vatEnabled
                ? parseFloat($(this).find(".vat").val()) || 0
                : 0;
            var flat = parseFloat($(this).find(".flat").val()) || 0;
            var totalBeforeDiscount = quantity * cost;
            var discountAmount =
                discountPercent > 0
                    ? (totalBeforeDiscount * discountPercent) / 100
                    : flat;
            $(this).find(".discount-amount").val(discountAmount.toFixed(2));
            var totalAfterDiscount = totalBeforeDiscount - discountAmount;
            var vatAmount = vatEnabled
                ? (totalAfterDiscount * vatPercent) / 100
                : 0;
            vatAmount = truncateDecimals(vatAmount, 2);
            $(this).find(".vat-amount").val(vatAmount);
            var total = totalAfterDiscount + vatAmount;
            total = truncateDecimals(total, 2);
            $(this).find(".total").val(total);
            grandTotal += total;
            if (!vatEnabled) {
                $(this).find(".vat").val(0).prop("disabled", true);
                $(this).find(".vat-amount").prop("disabled", true);
            } else {
                $(this).find(".vat").prop("disabled", false);
                $(this).find(".vat-amount").prop("disabled", false);
            }
        });

        $(".invoice-item-price").val(grandTotal);
        updateInvoiceCalculations();
        redistributePaymentAmounts();

        function redistributePaymentAmounts() {
            var selectedCheckboxes = $(".payment-checkbox:checked");
            var numberOfSelected = selectedCheckboxes.length;
            if (numberOfSelected === 0) return;
            temporaryArray.length = 0;
            amountToDistribute1 = 0;
            totalbalanceAmount = 0;
            var amountPerMethod = (grandTotal / numberOfSelected).toFixed(2);
            totalvalue = amountPerMethod * numberOfSelected;
            selectedCheckboxes.each(function () {
                var $parentDiv = $(this).closest("div.border-bottom");
                $parentDiv.find(".amount-input").val(amountPerMethod);
            });
            $(".amount-input:visible").val(amountPerMethod);
        }
    }

    function updateInvoiceCalculations() {
        let totalAmount = 0;
        let totalDiscount = 0;
        let totalVAT = 0;
        $("#service_div tr").each(function () {
            const quantity = parseFloat($(this).find(".quantity").val()) || 0;
            const price = parseFloat($(this).find(".cost").val()) || 0;
            const discountPercent =
                parseFloat($(this).find(".discount-percent").val()) || 0;
            const vatPercent = parseFloat($(this).find(".vat").val()) || 0;
            const flat = parseFloat($(this).find(".flat").val()) || 0;
            const rowTotal = quantity * price;
            const discountAmount =
                discountPercent > 0 ? (rowTotal * discountPercent) / 100 : flat;
            const vatAmount = ((rowTotal - discountAmount) * vatPercent) / 100;
            totalAmount += rowTotal;
            totalDiscount += discountAmount;
            totalVAT += vatAmount;
        });

        const grandTotal = totalAmount - totalDiscount + totalVAT;
        $(".invoice-calculations .d-flex:nth-child(1) .fw-medium").text(
            totalAmount.toFixed(2),
        );
        $(".invoice-calculations .d-flex:nth-child(2) .fw-medium").text(
            totalDiscount.toFixed(2),
        );
        $(".invoice-calculations .d-flex:nth-child(3) .fw-medium").text(
            totalVAT.toFixed(2),
        );
        $(".invoice-calculations .d-flex:nth-child(5) .fw-medium").text(
            grandTotal.toFixed(2),
        );
    }

    $(".payment-checkbox").change(function () {
        var selectedCheckboxes = $(".payment-checkbox:checked");
        var numberOfSelected = selectedCheckboxes.length;
        var amountToDistribute =
            numberOfSelected > 0
                ? (grandTotal / numberOfSelected).toFixed(2)
                : 0;
        totalvalue = amountToDistribute * numberOfSelected;
        temporaryArray.length = 0;
        $(".payment-checkbox").each(function () {
            var $parentDiv = $(this).closest("div.border-bottom");
            var value = $(this).data("value");
            if ($(this).is(":checked")) {
                if (value !== "cash") {
                    $parentDiv.find(".reference-input").removeClass("d-none");
                } else {
                    $parentDiv
                        .find(".reference-input")
                        .val(0)
                        .addClass("d-none");
                }
                $parentDiv
                    .find(".amount-input")
                    .removeClass("d-none")
                    .val(amountToDistribute);
            } else {
                $parentDiv.find(".amount-input").addClass("d-none").val("");
                $parentDiv.find(".reference-input").addClass("d-none").val("");
            }
        });
        distributeTotal();
    });

    var temporaryArray = [];
    $(document).on("input", ".amount-input", function () {
        var $currentInput = $(this);
        var enteredAmount = parseFloat($currentInput.val()) || 0;
        var $checkbox = $currentInput
            .closest(".d-flex")
            .find(".payment-checkbox");
        var selectedCheckboxes = $(".payment-checkbox:checked");
        var totalAssigned = 0;
        var inputId = $currentInput.attr("id");
        var existingEntry = temporaryArray.find((item) => item.id === inputId);
        if (!existingEntry) {
            temporaryArray.push({ id: inputId, amount: enteredAmount });
        } else {
            existingEntry.amount = enteredAmount;
        }
        totalbalanceAmount = temporaryArray.reduce(
            (sum, entry) => sum + entry.amount,
            0,
        );
        console.log("Total Amount:", totalbalanceAmount);
        var remainingAmount = grandTotal - totalAssigned;
        if (temporaryArray.length == 1) {
            var numberOfOtherInputs =
                selectedCheckboxes.length - temporaryArray.length;
            amountToDistribute1 =
                numberOfOtherInputs > 0
                    ? (
                          (grandTotal - enteredAmount) /
                          numberOfOtherInputs
                      ).toFixed(2)
                    : 0;
        } else {
            var numberOfOtherInputs =
                selectedCheckboxes.length - temporaryArray.length;
            amountToDistribute1 =
                numberOfOtherInputs > 0
                    ? (
                          (grandTotal - totalbalanceAmount) /
                          numberOfOtherInputs
                      ).toFixed(2)
                    : 0;
        }
        if (amountToDistribute1 > 0) {
            console.log("The amount is positive:", amountToDistribute1);
        } else if (amountToDistribute1 < 0) {
            Swal.fire({
                icon: "error",
                text: "The amount is wrong",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
            console.log("The amount is negative:", amountToDistribute1);
        } else {
            console.log("The amount is zero:", amountToDistribute1);
        }
        console.log("balance amounts:", amountToDistribute1);
        selectedCheckboxes.each(function () {
            var inputId = $(this).data("value") + "_amount";
            var inputValue = parseFloat($("#" + inputId).val()) || 0;
            totalAssigned += inputValue;
        });
        selectedCheckboxes.each(function () {
            var inputId = $(this).data("value") + "_amount";
            var $inputField = $("#" + inputId);
            if (
                $inputField.is($currentInput) ||
                temporaryArray.some((item) => item.id === inputId)
            )
                return;
            $inputField.val(amountToDistribute1);
        });
        console.log("Tracked inputs with amounts:", temporaryArray);
    });

    $(document).on(
        "input",
        ".quantity, .cost, .discount-percent, .vat, .flat",
        calculateTotal,
    );

    calculateTotal();

    $(".form-check-input").change(function () {
        var inputField = $(this)
            .closest(".d-flex")
            .siblings('input[type="text"]');
        if ($(this).is(":checked")) {
            inputField.removeClass("d-none");
        } else {
            inputField.addClass("d-none");
        }
    });

    if ($("#serviceId").data("select2")) {
        $("#serviceId").select2("destroy");
    }

    $("#serviceId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#serviceId").parent(),
            width: "100%",
            placeholder: "Search Service",
            allowClear: true,
            minimumInputLength: 2,
            ajax: {
                url: BASE_URL + "/insurance-search-service",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        query: params.term,
                        clientId: $("#patientselect").val(),
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.data,
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
    $("#serviceId").prop("disabled", true);

    $(document).on("click", "#addbtn, #addmanuel", function (e) {
        if (!$("#patientselect").val()) {
            $(".serviceOrderList_error").text("Please select patient");
            return;
        }
        $(".serviceOrderList_error").text("");
        serviceAdded = true;
        if (this.id === "addbtn") {
            var selectedServiceId = $("#serviceId").val();
            if (!selectedServiceId) {
                $(".serviceOrderList_error").text("Please select a service");
                return;
            }
            $.ajax({
                url:
                    BASE_URL +
                    "/insurance-get-service-details/" +
                    selectedServiceId,
                type: "get",
                success: function (response) {
                    if (response.status === true) {
                        var service = response.data[0];
                        const test = selectedServiceId;
                        var vatEnabled = $("#selectnationality").val() !== "0";
                        var vatPercent = vatEnabled ? "15" : "0";
                        var newRow = `
                        <tr>
                            <td class="selected-service-name">${
                                service.serviceName_en ||
                                service.serviceName ||
                                ""
                            } <input type="hidden" value="${test}"> </td>
                            <td class="selected-service-code">${
                                service.serviceCode || ""
                            } </td>
                            <td><input type="number" class="form-control quantity" id="w" value="1"></td>
                            <td><input type="text" class="1 form-control cost" value="${
                                service.cost || 0
                            }" id="w" disabled></td>
                            <td><input type="text" class="2 form-control discount-percent" id="w" ${
                                $("#percentage").is(":checked")
                                    ? ""
                                    : "disabled"
                            }></td>
                            <td><input type="text" class="3 form-control discount-amount" id="w" ${
                                $("#flatDiscount").is(":checked")
                                    ? ""
                                    : "readonly"
                            }></td>
                            <td><input type="text" class="form-control flat" value="0" id="w"></td>
                            <td><input type="text" class="4 form-control vat" id="w"  value="${
                                vatEnabled ? vatPercent : "0"
                            }"></td>
                            <td><input type="text" class="5 form-control vat-amount" id="w" value="0"></td>
                            <td><input type="text" class="6 form-control total" readonly id="w"></td>
                            <td><button type="button" class="btn btn-danger remove-row">X</button></td>
                        </tr>
                    `;
                        $("#service_div").append(newRow);
                        $("#serviceId").val(null).trigger("change");
                        calculateTotal();
                        toggleDiscountFields();
                    } else {
                        console.error("Service details not found");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error:", error);
                },
            });
        } else if (this.id === "addmanuel") {
            var vatEnabled = $("#selectnationality").val() !== "0";
            var vatPercent = vatEnabled ? "15" : "0";
            var newRow = `
            <tr>
                <td><input type="text" class="form-control name" id="w" data-manual="true"></td>
                <td><input type="text" class="form-control code" id="w"></td>
                <td><input type="number" class="form-control quantity" value="1" id="w"></td>
                <td><input type="text" class="form-control cost" value="0" id="w"></td>
                <td><input type="text" class="form-control discount-percent" value="0" id="w" ${
                    $("#percentage").is(":checked") ? "" : "disabled"
                }></td>
                <td><input type="text" class="form-control discount-amount" value="0" id="w" ${
                    $("#flatDiscount").is(":checked") ? "" : "readonly"
                }></td>
                <td><input type="text" class="form-control flat" value="0" id="w"></td>
                <td><input type="text" class="form-control vat" value="${
                    vatEnabled ? vatPercent : "0"
                }" id="w"></td>
                <td><input type="text" class="form-control vat-amount" value="0" id="w" readonly></td>
                <td><input type="text" class="form-control total" value="" id="w" readonly></td>
                <td><button type="button" class="btn btn-danger remove-row">X</button></td>
            </tr>
        `;
            $("#service_div").append(newRow);
            calculateTotal();
            toggleDiscountFields();
        }
    });

    $(document).on("input", "#service_div input", function () {
        calculateTotal();
        updateInvoiceCalculations();
    });

    $(document).on("click", ".remove-row", function () {
        $(this).closest("tr").remove();
        calculateTotal();
        updateInvoiceCalculations();
    });

    function formatName(emp) {
        return [
            emp.firstName_en,
            emp.secondName_en,
            emp.thirdName_en,
            emp.lastName_en,
        ]
            .filter((item) => item && item !== "null")
            .join(" ");
    }

    function updateProviderList() {
        var departmentId = $("#department").val();
        var clinicId = $("#branchSelect").val();
        var $employeeSelect = $("#providerselect");
        $employeeSelect.empty();
        $employeeSelect.append('<option value="">Select Employee</option>');
        if (departmentId && clinicId) {
            $.ajax({
                url:
                    BASE_URL +
                    "/insurance-get-employees-by-department/" +
                    departmentId,
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
                            $employeeSelect.append(
                                '<optgroup label="Doctors">',
                            );
                            $.each(doctors, function (index, employee) {
                                var name = formatName(employee.employee);

                                $employeeSelect.append(
                                    $("<option>", {
                                        value: employee.employee.employeeId,
                                        text: name,
                                    }),
                                );
                            });
                            $employeeSelect.append("</optgroup>");
                        }
                        if (nurses.length > 0) {
                            $employeeSelect.append('<optgroup label="Nurses">');
                            $.each(nurses, function (index, employee) {
                                var name = formatName(employee.employee);
                                $employeeSelect.append(
                                    $("<option>", {
                                        value: employee.employee.employeeId,
                                        text: name,
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

    $("#department").on("change", function () {
        updateProviderList();
    });

    $("#branchSelect").on("change", function () {
        branchSelect = $(this).val();
        updateProviderList();
    });

    $(".form-check-input").on("change", function () {
        if ($(this).is(":checked")) {
            $(".form-check-input").not(this).prop("checked", false);
        }
    });

    let previousDiscountPercent = {};
    let previousFlat = {};

    function toggleDiscountFields() {
        var isFlat = $("#flatDiscount").is(":checked");
        var isPercentage = $("#percentage").is(":checked");
        if (isFlat) {
            $("#discPercentHeader").hide();
            $("#discAmountHeader").hide();
            $("#discFlatHeader").show();
            $("#service_div tr").each(function (index) {
                previousDiscountPercent[index] = $(this)
                    .find(".discount-percent")
                    .val();
                $(this).find("td:nth-child(5)").hide();
                $(this).find("td:nth-child(6)").hide();
                $(this).find("td:nth-child(7)").show();
                $(this).find(".discount-percent").val(0).prop("disabled", true);
                $(this).find(".discount-amount").prop("disabled", false);
                if (previousFlat[index] !== undefined) {
                    $(this)
                        .find(".flat")
                        .val(previousFlat[index])
                        .prop("disabled", false);
                } else {
                    $(this).find(".flat").prop("disabled", false);
                }
            });
            $("#discount-type").val("flat");
        } else if (isPercentage) {
            $("#discPercentHeader").show();
            $("#discAmountHeader").show();
            $("#discFlatHeader").hide();
            $("#service_div tr").each(function (index) {
                previousFlat[index] = $(this).find(".flat").val();
                $(this).find("td:nth-child(5)").show();
                $(this).find("td:nth-child(6)").show();
                $(this).find("td:nth-child(7)").hide();
                $(this).find(".flat").val(0).prop("disabled", true);
                if (previousDiscountPercent[index] !== undefined) {
                    $(this)
                        .find(".discount-percent")
                        .val(previousDiscountPercent[index])
                        .prop("disabled", false);
                } else {
                    $(this).find(".discount-percent").prop("disabled", false);
                }
                $(this).find(".discount-amount").prop("readonly", true);
            });
            $("#discount-type").val("percentage");
        }
        calculateTotal();
    }

    toggleDiscountFields();

    $(document).ready(function () {
        $("#flatDiscount").prop("checked", true);
        $("#percentage").prop("checked", false);
        $("#flatDiscount, #percentage").change(function () {
            if ($(this).is(":checked")) {
                if (this.id === "flatDiscount") {
                    $("#percentage").prop("checked", false);
                } else {
                    $("#flatDiscount").prop("checked", false);
                }
            }
            toggleDiscountFields();
        });
    });

    var today = new Date();
    var day = String(today.getDate()).padStart(2, "0");
    var month = String(today.getMonth() + 1).padStart(2, "0");
    var year = today.getFullYear();
    var formattedDate = `${year}-${month}-${day}`;
    $("#dateIssued").val(formattedDate);

    var paymentProcessed = false;
    $("#savebtn").click(function (e) {
        const isConditionMet =
            parseFloat(grandTotal) ===
                parseFloat(amountToDistribute1) +
                    parseFloat(totalbalanceAmount) ||
            temporaryArray.length === 1 ||
            parseFloat(grandTotal) === parseFloat(totalvalue);
        if (amountToDistribute1 >= 0) {
            if (isConditionMet) {
                $("#saveType").val("save");
                e.preventDefault();
                $(".error-text").text("");
                Swal.fire({
                    title: "Are you sure?",
                    text: "Do you want to save?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, save it!",
                    cancelButtonText: "No, cancel",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                        cancelButton: "btn btn-danger waves-effect waves-light",
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        saveInvoice($(this).attr("id"));
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
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            }
        } else {
            Swal.fire({
                icon: "error",
                text: "The amount is wrong",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        }
    });

    function saveInvoice(buttonid) {
        var serviceOrderList = [];
        var serviceOrderPayment = [];
        $("#service_div tr").each(function () {
            var row = $(this);
            var isManual = row.find(".name").data("manual") === true;
            var serviceId = isManual ? null : $("#serviceId").val();
            var quantity = parseFloat(row.find(".quantity").val()) || 0;
            var cost = parseFloat(row.find(".cost").val()) || 0;
            var discountPercent =
                parseFloat(row.find(".discount-percent").val()) || 0;
            var flat = parseFloat(row.find(".flat").val()) || 0;
            var totalBeforeDiscount = quantity * cost;
            var discountAmount =
                discountPercent > 0
                    ? (totalBeforeDiscount * discountPercent) / 100
                    : flat;
            var data = {
                qty: row.find(".quantity").val(),
                serviceId: row.find(".selected-service-name input").val(),
                manualServiceName: isManual ? row.find(".name").val() : null,
                manualServiceCode: isManual ? row.find(".code").val() : null,
                taxCost: row.find(".vat-amount").val(),
                netCost: row.find(".cost").val(),
                disAmount: discountAmount.toFixed(2),
                discountPercentage: row.find(".discount-percent").val(),
                cost: row.find(".total").val(),
                flatAmount: row.find(".flat").val(),
                manuelTaxCost: row.find(".vat-amount").val(),
                manuelTaxPercentage: row.find(".vat").val(),
            };
            serviceOrderList.push(data);
        });
        var serviceOrderPayment = [];
        if (buttonid !== "draftbtn") {
            $(".payment-checkbox:checked").each(function () {
                var $parentDiv = $(this).closest("div.border-bottom");
                var id = $(this).attr("id").replace("paymentMethod", "");
                var amount = $parentDiv.find(".amount-input").val();
                var reference = $parentDiv.find(".reference-input").val();
                serviceOrderPayment.push({
                    paymentType_generalSettingsId: id,
                    amount: amount,
                    referenceNumber: reference,
                });
            });
        }
        console.log(serviceOrderPayment);
        var data = {
            typeOfBill: $("#billtype").val(),
            masterIdNumber: $("#invoiceId").val(),
            financialCategory: $("#financialcategory").val(),
            providerEmployeeId: $("#providerselect").val(),
            clinicId: $("#branchSelect").val(),
            clientId: $("#patientselect").val(),
            totalAmount: $("#final-total").text().replace("$", ""),
            totalTaxAmount: $("#vat-amount").text().replace("$", ""),
            totalDisAmount: $("#discount-amount").text().replace("$", ""),
            netAmount: $("#total-amount").text().replace("$", ""),
            employeesFeatureId: $("#department").val(),
            billIssuedDate: $("#dateIssued").val(),
            discount_type: $("#discount-type").val(),
            insurancePayerId: $("#insurancePayerId").val(),
            status:
                buttonid === "savebtn"
                    ? $("#status").val()
                    : $("#status1").val(),
            serviceOrderList: serviceOrderList,
            serviceOrderPayment: serviceOrderPayment,
        };
        var url =
            buttonid === "savebtn"
                ? "/insurance-save-bill"
                : "/insurance-draft-bill";
        $.ajax({
            url: BASE_URL + url,
            type: "POST",
            data: data,
            success: function (response) {
                if (response.status === true) {
                    Swal.fire({
                        icon: "success",
                        text: "Patient Invoice saved successfully",
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    }).then(function () {
                        window.location.href =
                            BASE_URL +
                            "/insurance-bill-preview/" +
                            response.data;
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: "Failed to save Service Order",
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
            error: function (xhr) {
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        if (key.startsWith("serviceOrderPayment.")) {
                            const index = key.split(".")[1];
                            $(
                                `.serviceOrderPayment_referenceNumber_error`,
                            ).text(value[0]);
                        } else {
                            $(`.${key}_error`).text(value[0]);
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: "An error occurred: " + xhr.responseText,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
        });
    }

    $("#savemodal").click(function () {
        $(".error-text").text("");
        $("#paymentMethodsModal").modal("show");
    });

    $("#draftbtn").click(function (e) {
        $("#saveType").val("draft");
        e.preventDefault();
        $(".error-text").text("");
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to save this as a draft?",
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
                saveInvoice($(this).attr("id"));
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    icon: "info",
                    text: "Draft not saved.",
                    customClass: {
                        confirmButton:
                            "btn btn-primary waves-effect waves-light",
                    },
                });
            }
        });
    });

    function fetchNextInvoiceNumber() {
        $.ajax({
            url: BASE_URL + "/insurance-next-invoice-number",
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

    fetchNextInvoiceNumber();
    $("#invoiceId").prop("readonly", true);
    $("#patientselect").select2("destroy");
    $("#patientselect")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#patientselect").parent(),
            width: "100%",
            placeholder: "Search Patient",
            allowClear: true,
            minimumInputLength: 2,
            ajax: {
                url: BASE_URL + "/insurance-search-patient",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        query: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.map(function (item) {
                            return {
                                id: item.id,
                                text: item.text,
                            };
                        }),
                    };
                },
                cache: true,
            },
        });
    $("#insurancePayerDiv").hide();
    $("#patientselect").on("select2:select", function (e) {
        var data = e.params.data;
        if (data.id) {
            patientSelected = true;
            $("#serviceId").prop("disabled", false);
            $("#insurancePayerDiv").hide();
            $("#loader-overlay").show();
            $.ajax({
                url: BASE_URL + "/insurance-get-patient-details/" + data.id,
                type: "GET",
                success: function (response) {
                    $("#loader-overlay").hide();
                    console.log("Patient details:", response);
                    if (response.status && response.data.length > 0) {
                        var client = response.data[0];
                        if (client.insuranceCompanyName) {
                            $("#insurancePayer").val(
                                client.insuranceCompanyName,
                            );
                            $("#insurancePayerDiv").show();
                        } else {
                            $("#insurancePayer").val("");
                            $("#insurancePayerDiv").hide();
                        }
                        $("#serviceId").prop("disabled", false);
                        var fullNameEn = [
                            client.clientName_en,
                            client.secondName_en,
                            client.thirdName_en,
                            client.fourthName_en,
                        ]
                            .filter(function (part) {
                                return part && part !== "null";
                            })
                            .join(" ");
                        $("#patientFullName").text(fullNameEn);
                        var fullNameAr = [
                            client.clientName,
                            client.secondName_ar,
                            client.thirdName_ar,
                            client.fourthName_ar,
                        ]
                            .filter(function (part) {
                                return part && part !== "null";
                            })
                            .join(" ");
                        $("#patientFullNameAr").text(fullNameAr);
                        $(".card-body .d-flex .fw-normal")
                            .eq(2)
                            .text(client.birthDate || "");
                        $(".card-body .d-flex .fw-normal")
                            .eq(3)
                            .text(client.nationalityName || "");
                        $(".card-body .d-flex .fw-normal")
                            .eq(4)
                            .text(client.mobile || "");
                        if (client.isEnable_Vat !== undefined) {
                            $("#selectnationality").val(client.isEnable_Vat);
                        } else {
                            $("#selectnationality").val("N/A");
                        }
                        calculateTotal();
                    } else {
                        console.error("Patient details not found");
                    }
                },
                error: function (xhr) {
                    $("#loader-overlay").hide();
                    console.log(xhr.responseJSON);
                    if (
                        xhr.status === 404 &&
                        xhr.responseJSON?.message ===
                            "Insurance policy not found"
                    ) {
                        $("#insurancePayer").val("");
                        $("#insurancePayerDiv").hide();
                        Swal.fire({
                            icon: "warning",
                            title: "Insurance Policy Missing!",
                            text: "This patient does not have an insurance policy.",
                            customClass: {
                                confirmButton:
                                    "btn btn-warning waves-effect waves-light",
                            },
                        });
                        $("#patientFullName").text("#########");
                        $("#patientFullNameAr").text("#########");
                        $(".card-body .d-flex .fw-normal")
                            .eq(2)
                            .text("#########");
                        $(".card-body .d-flex .fw-normal")
                            .eq(3)
                            .text("#########");
                        $(".card-body .d-flex .fw-normal")
                            .eq(4)
                            .text("#########");
                        $("#patientselect").val(null).trigger("change");
                        $("#serviceId").prop("disabled", true);
                        patientSelected = false;
                        return;
                    }
                    if (
                        xhr.status === 404 &&
                        xhr.responseJSON?.message === "Client not found"
                    ) {
                        Swal.fire({
                            icon: "error",
                            title: "Patient Not Found!",
                            text: "The selected patient could not be found.",
                        });
                        $("#patientselect").val(null).trigger("change");
                        $("#serviceId").prop("disabled", true);
                        patientSelected = false;
                        return;
                    }
                    console.error("Error:", xhr);
                },
            });
        }
    });

    $("#patientselect").on("select2:clear", function () {
        patientSelected = false;
        $("#serviceId").prop("disabled", true);
        $("#serviceId").val(null).trigger("change");
    });

    $("#previewbtn").click(function (e) {
        e.preventDefault();
        var data = {
            masterIdNumber: $("#invoiceId").val(),
            _token: $('meta[name="csrf-token"]').attr("content"),
        };
        $.ajax({
            url: BASE_URL + "/fetch-service-order-master-id",
            data: data,
            success: function (response) {
                if (response.status === true) {
                    var serviceOrderMasterId = response.serviceOrderMasterId;
                    console.log(
                        "Service Order Master ID:",
                        serviceOrderMasterId,
                    );
                    window.location.href =
                        BASE_URL + "/invoice-preview/" + serviceOrderMasterId;
                } else {
                    Swal.fire({
                        icon: "error",
                        text: "Failed to fetch Service Order Master ID",
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    text: "An error occurred: " + xhr.responseText,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });
});

$(document).on(
    "keydown",
    ".discount-percent, .discount-amount, .flat",
    function (e) {
        if (e.ctrlKey || e.metaKey) return true;
        if ([8, 9, 13, 27, 37, 38, 39, 40, 46].indexOf(e.which) !== -1)
            return true;
        if (
            (e.which >= 48 && e.which <= 57) ||
            (e.which >= 96 && e.which <= 105)
        )
            return true;
        e.preventDefault();
    },
);

$(document).on("input", ".discount-percent", function () {
    let val = $(this).val();
    val = val.replace(/[^0-9.]/g, "");
    let parts = val.split(".");
    if (parts.length > 2) {
        val = parts[0] + "." + parts[1];
        parts = val.split(".");
    }
    if (val.endsWith(".")) {
        $(this).val(val);
        return;
    }
    if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
    }
    val = parts.join(".");
    if (val.length > 1 && val.startsWith("0") && !val.startsWith("0.")) {
        val = val.replace(/^0+/, "") || "0";
    }
    let num = parseFloat(val);
    if (!isNaN(num)) {
        if (num > 100) val = "100";
    }
    $(this).val(val);
});

$(document).on("input", ".flat", function () {
    let row = $(this).closest("tr");
    let qty = parseFloat(row.find(".quantity").val()) || 0;
    let cost = parseFloat(row.find(".cost").val()) || 0;
    let maxAllowed = qty * cost;
    let discount = parseFloat($(this).val()) || 0;
    if (discount > maxAllowed) {
        $(this).val(maxAllowed.toFixed(2));
    }
});

$(document).on("change", "#branchSelect", function () {
    let branchId = $(this).val();
    if (branchId !== "") {
        $.ajax({
            url: BASE_URL + "/insurance-get-branch-details/" + branchId,
            type: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#branch_name").html(
                        response.data.clinicName_en +
                            "<br>" +
                            response.data.address_en,
                    );
                    $("#branch_phone").text(response.data.clinicMobile);
                } else {
                    $("#branch_name").html("");
                    $("#branch_phone").text("");
                }
            },
            error: function (xhr) {
                console.log(xhr.responseText);
            },
        });
    } else {
        $("#branch_name").html("");
        $("#branch_phone").text("");
    }
});
