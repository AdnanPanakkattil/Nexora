let amountToDistribute1 = 0;
let totalbalanceAmount = 0;
let totalvalue = 0;
let alreadyPaidAmount = 0;
let balanceToPay = 0;

function updateInvoiceCalculations() {
    let totalAmount = 0;
    let totalDiscount = 0;
    let totalVAT = 0;

    const financialCategory = $("#financialcategory").val();

    $("#service_div tr").each(function () {
        const quantity = parseFloat($(this).find(".quantity").val()) || 0;

        const price = parseFloat($(this).find(".cost").val()) || 0;

        const rowTotal = quantity * price;

        totalAmount += rowTotal;

        if (financialCategory == "insurance") {
            const insuranceDeduction =
                parseFloat($(this).find(".insurance-discount-percent").val()) ||
                0;

            totalDiscount += insuranceDeduction;
        } else {
            const discountPercent =
                parseFloat($(this).find(".discount-percent").val()) || 0;

            const flat = parseFloat($(this).find(".flat").val()) || 0;

            const vatPercent = parseFloat($(this).find(".vat").val()) || 0;

            const discountAmount =
                parseFloat($(this).find(".discount-amount").val()) || 0;

            const vatAmount =
                parseFloat($(this).find(".vat-amount").val()) || 0;

            totalDiscount += discountAmount;
            totalVAT += vatAmount;
        }
    });

    const grandTotal = totalAmount - totalDiscount + totalVAT;

    $("#total-amount").text(totalAmount.toFixed(2));
    $("#discount-amount").text(totalDiscount.toFixed(2));
    console.log("total vat", totalVAT);
    $("#vat-amount").text(totalVAT.toFixed(2));
    $("#already-paid").text(alreadyPaidAmount.toFixed(2));
    const balanceAmount = Math.max(0, grandTotal - alreadyPaidAmount);
    $("#balance-amount").text(balanceAmount.toFixed(2));
    $("#final-total").text(grandTotal.toFixed(2));
}
function loadAlreadyPaidAmount() {
    const serviceOrderMasterId = window.location.pathname.split("/").pop();

    $("#loader-overlay").show();

    $.get(`/service-order-payments/${serviceOrderMasterId}`)
        .done(function (response) {
            if (response.status) {
                alreadyPaidAmount = response.data.reduce(
                    (sum, payment) => sum + parseFloat(payment.amount || 0),
                    0,
                );

                console.log("Already Paid Loaded:", alreadyPaidAmount);

                updateInvoiceCalculations();
            }
        })
        .fail(function (xhr) {
            console.error("Failed to load payments", xhr);
        })
        .always(function () {
            $("#loader-overlay").hide();
        });
}

$(document).ready(function () {
    loadAlreadyPaidAmount();
    $(document).on("input", ".discount-percent", function () {
        let val = parseFloat(this.value);

        if (isNaN(val) || val < 0) {
            this.value = 0;
        } else if (val > 100) {
            this.value = 100;
        }
    });

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    if (
        localStorage.getItem("serviceOrderList") &&
        localStorage.getItem("serviceOrderPayment")
    ) {
        localStorage.removeItem("serviceOrderList");
        localStorage.removeItem("serviceOrderPayment");
        localStorage.removeItem("data");
    }

    $("#providerselect").on("click", function () {
        updateProviderList();
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
    function updatePaymentAmounts() {
        balanceToPay = Math.max(
            0,
            parseFloat(grandTotal || 0) - parseFloat(alreadyPaidAmount || 0),
        );

        const checked = $(".payment-checkbox:checked");

        if (!checked.length) {
            return;
        }

        const amountPerMethod = (balanceToPay / checked.length).toFixed(2);

        checked.each(function () {
            $(this)
                .closest("div.border-bottom")
                .find(".amount-input")
                .val(amountPerMethod)
                .removeClass("d-none");
        });

        $("#totalAmountDisplay").val(balanceToPay);
    }
    let grandTotal = 0;
    let patientSelected = false;
    let serviceAdded = false;
    function calculateTotal() {
        grandTotal = 0;

        var financialCategory = $("#financialcategory").val();
        var vatEnabled = $("#selectnationality").val() !== "0";

        $("tbody#service_div tr").each(function () {
            var quantity = parseFloat($(this).find(".quantity").val()) || 0;
            var cost = parseFloat($(this).find(".cost").val()) || 0;

            var totalBeforeDiscount = quantity * cost;

            if (financialCategory == "insurance") {
                var insuranceDeduction =
                    parseFloat(
                        $(this).find(".insurance-discount-percent").val(),
                    ) || 0;

                insuranceDeduction = Math.min(
                    insuranceDeduction,
                    totalBeforeDiscount,
                );

                var total = totalBeforeDiscount - insuranceDeduction;

                $(this).find(".insurance-total").val(total.toFixed(2));

                grandTotal += total;
            } else {
                var discountPercent = Math.min(
                    100,
                    Math.max(
                        0,
                        parseFloat($(this).find(".discount-percent").val()) ||
                            0,
                    ),
                );

                $(this).find(".discount-percent").val(discountPercent);

                var vatPercent = vatEnabled
                    ? parseFloat($(this).find(".vat").val()) || 0
                    : 0;

                var flat = parseFloat($(this).find(".flat").val()) || 0;

                var discountAmount =
                    discountPercent > 0
                        ? (totalBeforeDiscount * discountPercent) / 100
                        : flat;

                discountAmount = Math.min(discountAmount, totalBeforeDiscount);

                if (flat > totalBeforeDiscount) {
                    flat = totalBeforeDiscount;
                    $(this).find(".flat").val(flat.toFixed(2));
                }

                $(this).find(".discount-amount").val(discountAmount.toFixed(2));

                var totalAfterDiscount = Math.max(
                    0,
                    totalBeforeDiscount - discountAmount,
                );

                var vatAmount = vatEnabled
                    ? (totalAfterDiscount * vatPercent) / 100
                    : 0;
                vatAmount = roundToTwo(vatAmount);
                vatAmount = roundIfNeeded(vatAmount);
                console.log("vat", vatAmount);
                $(this).find(".vat-amount").val(vatAmount);

                var total = totalAfterDiscount + vatAmount;

                $(this).find(".total").val(total.toFixed(2));

                grandTotal += total;

                if (!vatEnabled) {
                    $(this).find(".vat").val(0).prop("disabled", true);

                    $(this).find(".vat-amount").prop("disabled", true);
                } else {
                    $(this).find(".vat").prop("disabled", false);

                    $(this).find(".vat-amount").prop("disabled", false);
                }
            }
        });

        grandTotal = roundIfNeeded(grandTotal);
        grandTotal = roundToTwo(grandTotal);

        $(".invoice-item-price").val(grandTotal);

        updatePaymentAmounts();

        updateInvoiceCalculations();
    }

    $(".payment-checkbox").change(function () {
        var selectedCheckboxes = $(".payment-checkbox:checked");
        var numberOfSelected = selectedCheckboxes.length;
        balanceToPay = Math.max(
            0,
            parseFloat(grandTotal || 0) - parseFloat(alreadyPaidAmount || 0),
        );

        var amountToDistribute =
            numberOfSelected > 0
                ? (balanceToPay / numberOfSelected).toFixed(2)
                : 0;

        totalvalue = amountToDistribute * numberOfSelected;
        temporaryArray.length = 0;
        $(".payment-checkbox").each(function () {
            var $parentDiv = $(this).closest("div.border-bottom");
            var value = $(this).data("value");

            if ($(this).is(":checked")) {
                if (value !== "cash") {
                    $parentDiv.find(".reference-input").removeClass("d-none");
                }
                $parentDiv
                    .find(".amount-input")
                    .removeClass("d-none")
                    .val(amountToDistribute);
            } else {
                $parentDiv.find(".amount-input").addClass("d-none").val("");
                if (value !== "cash") {
                    $parentDiv
                        .find(".reference-input")
                        .addClass("d-none")
                        .val("");
                }
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

    $(document).on("input", ".reference-input", function () {
        this.value = this.value.replace(/[^0-9]/g, "");
    });

    $(document).on(
        "input",
        ".quantity, .cost, .discount-percent, .insurance-discount-percent, .vat, .flat",
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
                url: BASE_URL + "/search-service",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        query: params.term,
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
    $(document).on("click", "#addbtn, #addmanuel", function (e) {
        if (this.id === "addbtn" && !$("#serviceId").val()) {
            e.preventDefault();
            Swal.fire({
                icon: "error",
                text: "Please select a service first.",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
            return;
        }
        serviceAdded = true;
        if (this.id === "addbtn") {
            $.ajax({
                url: BASE_URL + "/get-service-details/" + $("#serviceId").val(),
                type: "get",
                success: function (response) {
                    if (response.status === true) {
                        var service = response.service;
                        var vatEnabled = $("#selectnationality").val() !== "0";
                        var vatPercent = vatEnabled ? "15" : "0";
                        var selectedServiceId = $("#serviceId").val();
                        var newRow = `
                          <tr>
                             <td class="selected-service-name">${service.serviceName_en || ""} 
                             <input type="hidden" class="1 form-control selected-service-id" value="${selectedServiceId}">
                             </td>  
                             <td class="selected-service-code">${service.serviceCode || ""} </td>
                             <td><input type="number" class="form-control quantity" id="w" value="1"></td>
                             <td><input type="text" class="1 form-control cost" value="${service.cost || 0}" id="w" disabled></td>
                             <td><input type="text" class="2 form-control discount-percent" id="w" ${$("#percentage").is(":checked") ? "" : "disabled"}></td>
                             <td><input type="text" class="3 form-control discount-amount" id="w" ${$("#flatDiscount").is(":checked") ? "" : "readonly"}></td>
                             <td><input type="text" class="form-control flat" value="0" id="w"></td>
                              <td><input type="text" class="4 form-control vat" id="w"  value="${vatEnabled ? vatPercent : "0"}" readonly></td>
                             <td><input type="text" class="5 form-control vat-amount" id="w" value="0" readonly></td>
                             <td><input type="text" class="6 form-control total" readonly id="w"></td>
                             <td><button type="button" class="btn btn-danger remove-row" id="removebtn1" >X</button></td>
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
                <td><input type="text" class="form-control discount-percent" value="0" id="w" ${$("#percentage").is(":checked") ? "" : "disabled"}></td>
                <td><input type="text" class="form-control discount-amount" value="0" id="w" ${$("#flatDiscount").is(":checked") ? "" : "readonly"}></td>
                 <td><input type="text" class="form-control flat" value="0" id="w"></td>
                <td><input type="text" class="form-control vat" value="${vatEnabled ? vatPercent : "0"}" id="w" readonly></td>
                <td><input type="text" class="form-control vat-amount" value="0" id="w" readonly></td>
                <td><input type="text" class="form-control total" value="" id="w" readonly></td>
                <td><button type="button" class="btn btn-danger remove-row" id="removebtn1" >X</button></td>
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

    $(document).on("click", "#removebtn1", function () {
        $(this).closest("tr").remove();
        calculateTotal();
    });

    $(".remove-row").on("click", function () {
        var row = $(this).closest("tr");
        var serviceId = row.find(".addedServiceId").val();
        var manualServiceCode = row.find(".manualServiceCode").text();
        var masterId = $("#masterid").val();

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Delete?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel",
            customClass: {
                confirmButton: "btn btn-success waves-effect waves-light",
                cancelButton: "btn btn-danger waves-effect waves-light",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/delete-service-order",
                    type: "POST",
                    data: {
                        masterId: masterId,
                        serviceId: serviceId,
                        manualServiceCode: manualServiceCode,
                    },
                    headers: {
                        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                            "content",
                        ),
                    },
                    success: function (response) {
                        if (response.success) {
                            row.remove();

                            Swal.fire({
                                title: "Deleted!",
                                text: "The row has been deleted.",
                                icon: "success",
                                customClass: {
                                    confirmButton:
                                        "btn btn-success waves-effect waves-light",
                                },
                            });
                            calculateTotal();
                            updateInvoiceCalculations();
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: "The deletion failed.",
                                icon: "error",
                                customClass: {
                                    confirmButton:
                                        "btn btn-danger waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function () {
                        Swal.fire({
                            title: "Error",
                            text: "An error occurred while deleting.",
                            icon: "error",
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                        });
                    },
                });
            } else {
                Swal.fire({
                    title: "Cancelled",
                    text: "The row is safe.",
                    icon: "info",
                    customClass: {
                        confirmButton:
                            "btn btn-primary waves-effect waves-light",
                    },
                });
            }
        });
    });

    function updateProviderList() {
        var departmentId = $("#department").val();
        var clinicId = $("#branchSelect").val();
        var $employeeSelect = $("#providerselect");

        $employeeSelect.empty();
        $employeeSelect.append('<option value="">Select Employee</option>');

        if (departmentId) {
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
                            $employeeSelect.append(
                                '<optgroup label="Doctors">',
                            );
                            $.each(doctors, function (index, employee) {
                                $employeeSelect.append(
                                    $("<option>", {
                                        value: employee.employee.employeeId,
                                        text: employee.employee.firstName_en,
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
                                        text: employee.employee.firstName_en,
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
        } else {
            $employeeSelect.append(
                '<option value="" disabled>Please select a department</option>',
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

    $("#invoiceId").prop("readonly", true);
    // $('#patientselect').select2({
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
                url: BASE_URL + "/search-patient",
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
    var patientId = $("#selectedPatientId").val();
    var patientName = $("#selectedPatientName").val();

    if (patientId && patientName) {
        console.log("Pre-selecting patient:", patientId, patientName);
        var option = new Option(patientName, patientId, true, true);

        $("#patientselect").append(option).trigger("change");
    }
    $("#patientselect").on("select2:select", function (e) {
        var data = e.params.data;
        if (data.id) {
            patientSelected = true;
            $.ajax({
                url: BASE_URL + "/get-patient-details/" + data.id,
                type: "GET",
                success: function (response) {
                    console.log("Patient details:", response);
                    if (response.status && response.data.length > 0) {
                        var client = response.data[0];
                        $(".card-body .d-flex .fw-normal1")
                            .eq(0)
                            .text(
                                client.clientName_en
                                    ? client.clientName_en +
                                          " " +
                                          (client.secondName_en || "")
                                    : "",
                            );
                        $(".card-body .d-flex .fw-normal3")
                            .eq(0)
                            .text(
                                client.clientName_en
                                    ? client.thirdName_en +
                                          " " +
                                          (client.secondName_en || "")
                                    : "",
                            );
                        $(".card-body .d-flex .fw-normal2")
                            .eq(0)
                            .text(
                                client.clientName
                                    ? client.clientName +
                                          " " +
                                          (client.secondName_ar || "")
                                    : "",
                            );
                        $(".card-body .d-flex .fw-normal4")
                            .eq(0)
                            .text(
                                client.clientName
                                    ? client.thirdName_ar +
                                          " " +
                                          (client.fourthName_ar || "")
                                    : "",
                            );
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
                error: function (xhr, status, error) {
                    console.error("Error:", error);
                },
            });
        }
    });

    $(document).ready(function () {
        $("#updatebtn").on("click", function (e) {
            var totalAmount = $("#totalAmountDisplay").val();

            // Validate reference number for non-cash payments
            var missingReference = false;
            $(".payment-checkbox:checked").each(function () {
                var value = $(this).data("value");
                if (value !== "cash") {
                    var $parentDiv = $(this).closest("div.border-bottom");
                    var reference = $parentDiv
                        .find(".reference-input")
                        .val()
                        .trim();
                    if (!reference) {
                        missingReference = true;
                        return false; // break out of each loop
                    }
                }
            });

            if (missingReference) {
                Swal.fire({
                    icon: "error",
                    text: "Please enter reference number for non-cash payments.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
                return;
            }

            const checkedCount = $(".payment-checkbox:checked").length;
            const isConditionMet =
                checkedCount > 0 &&
                (parseFloat(grandTotal) ===
                    parseFloat(amountToDistribute1) +
                        parseFloat(totalbalanceAmount) ||
                    temporaryArray.length === 1 ||
                    parseFloat(balanceToPay) === parseFloat(totalAmount) ||
                    parseFloat(balanceToPay) === parseFloat(totalvalue) ||
                    parseFloat(balanceToPay) ===
                        parseFloat(totalvalue / checkedCount) * checkedCount);
            if (amountToDistribute1 >= 0) {
                if (isConditionMet) {
                    e.preventDefault();
                    handleUpdate("updatebtn");
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
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            }
        });

        // New click handler for draftbtn
        $("#draftbtn").on("click", function (e) {
            e.preventDefault();
            handleUpdate("draftbtn");
        });

        function handleUpdate(buttonId) {
            var serviceOrderList = [];

            $("#service_div tr").each(function () {
                var row = $(this);
                var isManual = row.find(".name").data("manual") === true;
                var serviceId = isManual ? null : $("#serviceId").val();
                var selectedServiceId = isManual
                    ? null
                    : row.find(".selected-service-id").val()
                      ? row.find(".selected-service-id").val()
                      : row.find(".addedServiceId").val();

                var test =
                    selectedServiceId == null ||
                    selectedServiceId == "undefined"
                        ? row.find(".name").val()
                            ? row.find(".name").val()
                            : row.find(".manualServiceName1").text()
                        : null;
                var code =
                    selectedServiceId == null ||
                    selectedServiceId == "undefined"
                        ? row.find(".manualServiceCode").text()
                            ? row.find(".manualServiceCode").text()
                            : row.find(".code").val()
                        : null;

                var data = {
                    qty: row.find(".quantity").val(),
                    serviceId: selectedServiceId || null,
                    manualServiceName: test,
                    manualServiceCode: code,
                    taxCost: row.find(".vat-amount").val(),
                    netCost: row.find(".cost").val(),
                    disAmount: row.find(".discount-amount").val(),
                    discountPercentage: row.find(".discount-percent").val(),
                    cost: row.find(".total").val(),
                    flatAmount: row.find(".flat").val(),
                    manuelTaxCost: row.find(".vat-amount").val(),
                    manuelTaxPercentage: row.find(".vat").val(),
                };
                serviceOrderList.push(data);
            });

            var data = {
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
                status:
                    buttonId === "draftbtn" ? "pending" : $("#status").val(),
                serviceOrderList: serviceOrderList,
            };

            if (buttonId === "updatebtn") {
                var serviceOrderPayment = [];
                var uniquePayments = {};

                $(".payment-checkbox:checked").each(function () {
                    var $parentDiv = $(this).closest("div.border-bottom");
                    var id = $(this).attr("id").replace("paymentMethod", "");
                    var amount = $parentDiv.find(".amount-input").val();
                    var value = $(this).data("value"); // gets 'cash', 'card', etc.
                    var reference =
                        value === "cash"
                            ? ""
                            : $parentDiv.find(".reference-input").val();

                    var key = id + "-" + amount + "-" + reference;
                    if (!uniquePayments[key]) {
                        uniquePayments[key] = {
                            paymentType_generalSettingsId: id,
                            amount: amount,
                            referenceNumber: reference,
                        };
                    }
                });

                data.serviceOrderPayment = Object.values(uniquePayments);
            }

            const urlParts = window.location.pathname.split("/");
            const serviceOrderMasterId = urlParts[urlParts.length - 1];

            const endpoint =
                buttonId === "draftbtn"
                    ? BASE_URL + "/billing/draftupdate/" + serviceOrderMasterId
                    : BASE_URL + "/billing/update/" + serviceOrderMasterId;

            $.ajax({
                url: endpoint,
                method: "PUT",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    console.log("Server response:", response);
                    if (response.status) {
                        Swal.fire({
                            icon: "success",
                            text:
                                buttonId === "draftbtn"
                                    ? "Draft saved successfully!"
                                    : "Bill updated successfully!",
                            confirmButtonText: "OK",
                            customClass: {
                                confirmButton:
                                    "btn btn-success waves-effect waves-light",
                            },
                        }).then(function () {
                            window.location.href =
                                BASE_URL +
                                "/invoice/preview/" +
                                serviceOrderMasterId;
                        });
                    }
                },
                error: function (xhr, status, error) {
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
                            $("." + key + "_error").text(value[0]);
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
    });

    $("#paymentMethodsModal").on("shown.bs.modal", function () {
        $(".error-text").text("");
        const urlParts = window.location.pathname.split("/");
        const serviceOrderMasterId = urlParts[urlParts.length - 1];

        let totalAmount = 0;
        alreadyPaidAmount = 0;
        $("#loader-overlay").show();
        $.ajax({
            url: `/service-order-payments/${serviceOrderMasterId}`,
            method: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status) {
                    console.log("Data:", response.data);

                    totalAmount = 0;

                    $(".payment-checkbox").prop("checked", false);
                    $(".amount-input").addClass("d-none").val("");
                    $(".reference-input").addClass("d-none").val("");

                    response.data.forEach((payment) => {
                        const checkboxName = `${payment.paymentType_generalSettingsId}_checkbox`;

                        const amountName = `${payment.paymentType_generalSettingsId}_amount`;

                        const referenceName = `${payment.paymentType_generalSettingsId}_referance`;

                        const checkbox = $(`[name="${checkboxName}"]`);

                        if (checkbox.length) {
                            checkbox.prop("checked", true);
                        }

                        const amountInput = $(`[name="${amountName}"]`);
                        const referenceInput = $(`[name="${referenceName}"]`);

                        if (amountInput.length) {
                            amountInput
                                .removeClass("d-none")
                                .val(payment.amount);

                            const paymentAmount = parseFloat(
                                payment.amount || 0,
                            );
                            totalAmount += paymentAmount;
                            alreadyPaidAmount += paymentAmount;
                        }

                        if (referenceInput.length && payment.referenceNumber) {
                            referenceInput
                                .removeClass("d-none")
                                .val(payment.referenceNumber);
                        }
                    });

                    const checkedCount = $(".payment-checkbox:checked").length;

                    alreadyPaidAmount = totalAmount;

                    balanceToPay = Math.max(
                        0,
                        parseFloat(grandTotal || 0) -
                            parseFloat(alreadyPaidAmount || 0),
                    );

                    if (checkedCount > 0) {
                        const amountPerMethod = (
                            balanceToPay / checkedCount
                        ).toFixed(2);

                        $(".payment-checkbox:checked").each(function () {
                            $(this)
                                .closest("div.border-bottom")
                                .find(".amount-input")
                                .val(amountPerMethod)
                                .removeClass("d-none");
                        });
                    }

                    updateInvoiceCalculations();

                    $("#totalAmountDisplay").val(balanceToPay);

                    console.log("Grand Total:", grandTotal);
                    console.log("Already Paid:", alreadyPaidAmount);
                    console.log("Balance To Pay:", balanceToPay);
                } else {
                    alert(response.message);
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                console.error("Failed to fetch payments:", xhr);
                alert("An error occurred while fetching payment details.");
            },
        });
    });

    $(document).ready(function () {
        function loadBranchDetails(branchId) {
            if (branchId) {
                $.get(
                    BASE_URL + "/get-branch-details/" + branchId,
                    function (response) {
                        if (response.status) {
                            $("#branch_name").html(
                                response.data.clinicName_en +
                                    "<br>" +
                                    response.data.address_en,
                            );

                            $("#branch_phone").text(
                                response.data.phone ??
                                    response.data.clinicMobile,
                            );
                        }
                    },
                );
            }
        }
        let branchId = $("#branchSelect").val();
        loadBranchDetails(branchId);
        $(document).on("change", "#branchSelect", function () {
            loadBranchDetails($(this).val());
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
            (e.which === 190 || e.which === 110) &&
            $(this).val().indexOf(".") === -1
        ) {
            return true;
        }
        if (
            (e.which >= 48 && e.which <= 57) ||
            (e.which >= 96 && e.which <= 105)
        )
            return true;
        e.preventDefault();
    },
);

function roundToTwo(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

function roundIfNeeded(num) {
    return Number(num.toFixed(2));
}
