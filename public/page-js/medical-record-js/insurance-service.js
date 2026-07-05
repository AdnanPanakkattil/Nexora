$(document).ready(function () {
    $("#insurance_service_table #insurance_service_tbody input").prop(
        "readonly",
        true,
    );
    $(
        '#insurance_service_table #insurance_service_tbody input[type="number"][name="insurance_service_qty[]"]',
    ).prop("readonly", false);

    flatpickr("#serviceDateOnModal", {
        dateFormat: "Y-m-d",
        allowInput: true,
        defaultDate: "today",
    });

    flatpickr("#medicineStartDateOnModal", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    flatpickr("#discontinueDateOnModal", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });

    if ($("#insurance_service_fixed_discount").is(":checked")) {
        $("#insurance_service_percentage_discount").prop("checked", false);
    } else if ($("#insurance_service_percentage_discount").is(":checked")) {
        $("#insurance_service_fixed_discount").prop("checked", false);
    }

    $("#offcanvasTop").on("hidden.bs.offcanvas", function () {
        if (window._diagnosisAjax) {
            window._diagnosisAjax.abort();
            window._diagnosisAjax = null;
        }

        const $offcanvas = $(this);
        $offcanvas
            .find('input[type="text"], input[type="number"], textarea')
            .val("");
        $offcanvas.find("select").val("").trigger("change");
        $offcanvas.find('input[type="checkbox"]').prop("checked", false);
        $offcanvas.find('input[type="hidden"]').val("");

        const $diag = $("#serviceDiagnosisOnModal");
        if ($diag.hasClass("select2-hidden-accessible")) {
            $diag.select2("destroy");
        }
        $diag.empty();

        // $("#medications_div").hide();
        // $("#medications_a_tag_div").hide();
        $("#body_site_div").hide();
        $("#dental_service_div").hide();
        $offcanvas.find(".error-text").text("");
    });

    $("#offcanvasTop").on("shown.bs.offcanvas", function () {
        let fp = $("#serviceDateOnModal")[0]._flatpickr;
        if (fp) {
            fp.setDate(new Date(), true);
        } else {
            flatpickr("#serviceDateOnModal", {
                dateFormat: "Y-m-d",
                allowInput: true,
                defaultDate: new Date(),
            });
        }

        if (
            $("#searchInsuranceServiceId").hasClass("select2-hidden-accessible")
        ) {
            $("#searchInsuranceServiceId").select2("destroy");
        }

        $("#searchInsuranceServiceId").select2({
            dropdownParent: $("#offcanvasTop"),
            width: "100%",
            placeholder: "Search Service",
            allowClear: true,
            ajax: {
                url: BASE_URL + "/get-insurance-payer-linked-services",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        serviceCodeOrName: params.term,
                        clientId: $("#client_id").val(),
                    };
                },
                processResults: function (data) {
                    return { results: data.data };
                },
                cache: true,
            },
        });

        loadInsuranceDiagnosis();
    });

    $("#searchInsuranceServiceId").on("select2:select", function (e) {
        console.log(e.params.data);
        getServiceDetailsById(e.params.data.id);
    });

    $("#insurance_service_percentage_discount").on("change", function () {
        if ($(this).is(":checked")) {
            $("#fixed_discount").prop("checked", false);
            $("#service_order_table tbody tr").each(function () {
                $(this).find("td:nth-child(5) input").prop("disabled", false);
                $(this).find("td:nth-child(6) input").prop("disabled", true);
            });
        } else {
        }
    });

    $("input[name='insurance_service_discount_type']").on(
        "change",
        function () {
            if ($(this).is(":checked")) {
                $("input[name='insurance_service_discount_type']")
                    .not(this)
                    .prop("checked", false);
            }
        },
    );

    $("#serviceUnitPrice, #serviceQuantity, #serviceDiscountPercentage").on(
        "input",
        function () {
            calculateNetAmount();
        },
    );
    $("#insurance_service_fixed_discount").on("change", function () {
        if ($(this).is(":checked")) {
            $("#percentage_discount").prop("checked", false);
            $("#service_order_table tbody tr").each(function () {
                $(this).find("td:nth-child(5) input").prop("disabled", true);
                $(this).find("td:nth-child(6) input").prop("disabled", false);
            });
        } else {
            $("#service_order_table tbody tr").each(function () {
                $(this).find("td:nth-child(5) input").prop("disabled", false);
            });
        }
    });
    $(document).on("click", "#addInsuranceServiceBtn", function () {
        var serviceName = "";
        var serviceCode = " ";
        var toothNo = " ";
        var serviceName = $("#insuranceServiceId").text().trim();

        if (serviceName) {
            $.ajax({
                url:
                    BASE_URL +
                    "/medicalrecord-insurance-service-details/" +
                    $("#reservationId").val() +
                    "/" +
                    $("#insuranceServiceId").val(),
                type: "get",
                success: function (response) {
                    console.log(response);
                    if (response.status === true && response.data.length > 0) {
                        console.log($("#vat_enabled").val());
                        var service = response.data[0];
                        var serviceCost = service.cost;
                        var serviceCode = service.serviceCode;
                        var vatPercent =
                            $("#vat_enabled").val() == 0
                                ? 0
                                : service.vatPercent;
                        console.log(service);
                        var serviceId = service.insuranceServiceId;
                        console.log(service.insurancePays);
                        var discountPercentageColumn = "";

                        var newRow = `
                            <tr>
                                <td class="insurance-service-name"><input type="hidden" class="service-id" name="insurance_service_id[]" value="${serviceId}">${serviceName}</td>
                                <td class="insurance-service-code">${serviceCode}</td>
                                
                                <td class="insurance-service-qty">
                                
                                <input type="hidden" class="form-control" placeholder="Quantity" name="insurance_service_deductible_rate[]" value="${service.deductibleRate}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="insurance_service_max_copay_limit[]" value="${service.maxCopayLimit}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="insurance_service_vat_percentage[]" value="${service.vatPercentage}">
                                <input type="hidden" class="form-control" name="insurance_service_order_list_id[]" value="null">

                                
                                    <input type="number" class="form-control" placeholder="Quantity" name="insurance_service_qty[]" value="1">
                                </td>
                                <td class="insurance-service-price">
                                    <input type="text" class="form-control" placeholder="Price" name="insurance_service_price[]" value="${service.serviceCost}">
                                </td>
                                <td class="insurance-service-total">
                                    <input type="number" class="form-control" placeholder="Total Amount" name="insurance_service_total[]" value="${service.serviceCost}">
                                </td>
                                <td class="insurance-service-deduction-amount">
                                    <input type="text" class="form-control" placeholder="Insurance Deduction" name="insurance_service_deduction[]" value="${service.insurancePays}">
                                </td>
                                <td class="insurance-service-vat-amount">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="insurance_service_patient_share[]" value="${service.vatAmount}">
                                </td>
                                <td class="insurance-service-net-amount">
                                    <input type="text" class="form-control" placeholder="Net Amount" name="insurance_service_net_amount[]" value="${service.finalClientPayableWithVat}">
                                </td>
                                <td>
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>
                        `;

                        $("#insurance_service_tbody").append(newRow);
                    } else {
                        console.error("Service details not found");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error:", error);
                },
            });
        }
        $("#insuranceServiceId").text("");
        $("#insuranceServiceId").val("");
        setTimeout(function () {
            sumOfNetAmount();
            sumOfTotalAmount();
            sumOfInsuranceDeduction();
            sumOfVat();
        }, 50);
    });
    $(document).on("click", ".remove-row", function () {
        var serviceOrderListId = $(this).data("id");
        var serviceId = $(this).data("type");
        if (serviceOrderListId > 0 && serviceId > 0) {
            deleteAlreadyExistService(serviceOrderListId, serviceId);
        } else {
            $(this).closest("tr").remove();
        }
        sumOfNetAmount();
        sumOfTotalAmount();
        sumOfInsuranceDeduction();
        sumOfVat();
    });
    $(document).on(
        "input",
        "input[name='insurance_service_qty[]']",
        function () {
            var $row = $(this).closest("tr");

            var quantity = parseFloat($(this).val()) || 0;
            var price =
                parseFloat(
                    $row.find("input[name='insurance_service_price[]']").val(),
                ) || 0;
            var serviceCost = quantity * price;
            var deductibleRate =
                parseFloat(
                    $row
                        .find(
                            "input[name='insurance_service_deductible_rate[]']",
                        )
                        .val()
                        .replace("d", ""),
                ) || 0;
            var maxCopayLimit =
                parseFloat(
                    $row
                        .find(
                            "input[name='insurance_service_max_copay_limit[]']",
                        )
                        .val()
                        .replace("m", ""),
                ) || 0;
            var vatPercentage =
                parseFloat(
                    $row
                        .find(
                            "input[name='insurance_service_vat_percentage[]']",
                        )
                        .val()
                        .replace("v", ""),
                ) || 0;
            var deductibleAmount = (serviceCost * deductibleRate) / 100;
            console.log("maxCopayLimit=>" + maxCopayLimit);
            var clientPayableAmount, discountAppliedAmount;
            if (maxCopayLimit > 0) {
                clientPayableAmount = Math.min(deductibleAmount, maxCopayLimit);
                discountAppliedAmount = deductibleAmount - clientPayableAmount;
            } else {
                clientPayableAmount = deductibleAmount;
                discountAppliedAmount = 0;
            }
            var insurancePays = serviceCost - deductibleAmount;
            var vatAmount = (clientPayableAmount * vatPercentage) / 100;
            var finalClientPayableWithVat = clientPayableAmount + vatAmount;
            console.log(clientPayableAmount + "*" + vatPercentage + "/" + 100);
            $row.find("input[name='insurance_service_total[]']").val(
                serviceCost.toFixed(2),
            );
            $row.find("input[name='insurance_service_deduction[]']").val(
                insurancePays.toFixed(2),
            );
            $row.find("input[name='insurance_service_patient_share[]']").val(
                vatAmount.toFixed(2),
            );
            $row.find("input[name='insurance_service_net_amount[]']").val(
                finalClientPayableWithVat.toFixed(2),
            );
            sumOfNetAmount();
            sumOfTotalAmount();
            sumOfInsuranceDeduction();
            sumOfVat();
        },
    );

    $(document).on("click", "#add_services_btn", function () {
        var rowIndex = $("#service_table_tbody tr").length;
        var serviceDateOnModal = $("#serviceDateOnModal").val();
        var medicalServiceTypeOnModal = $(
            "#slctMedicalServiceTypeOnModal",
        ).val();
        var serviceIdOnModal = $("#searchInsuranceServiceId").val();
        var serviceUnitPriceOnModal = $("#serviceUnitPriceOnModal").val();
        var serviceInsuranceDeductionOnModal = $(
            "#serviceInsuranceDeductionOnModal",
        ).val();
        console.log(serviceInsuranceDeductionOnModal);
        var serviceQuantityOnModal = $("#serviceQuantityOnModal").val();
        var serviceNetAmountOnModal = $("#serviceNetAmountOnModal").val();
        var serviceVatPercentageOnModal = $(
            "#serviceVatPercentageOnModal",
        ).val();
        var servicepatientShareAmountOnModal = $(
            "#servicepatientShareAmountOnModal",
        ).val();
        var servicePatientVatAmountOnModal = $(
            "#servicePatientVatAmountOnModal",
        ).val();
        console.log(servicePatientVatAmountOnModal);
        var serviceNameOnModal = $("#serviceNameOnModal").val();
        var serviceCodeOnModal = $("#serviceCodeOnModal").val();
        var deductibleRateOnModal = $("#deductibleRateOnModal").val();
        var deductibleAmountOnModal = $("#deductibleAmountOnModal").val();
        var maxCopayLimitOnModal = $("#maxCopayLimitOnModal").val();
        var serviceDateOnModal = $("#serviceDateOnModal").val();
        var slctMedicalServiceTypeOnModal = $(
            "#slctMedicalServiceTypeOnModal",
        ).val();
        var scientificCodeOnModal = $("#scientificCodeOnModal").val();
        var slctMedicalServiceTypeOnModal = $(
            "#slctMedicalServiceTypeOnModal",
        ).val();
        var scientificCodeAbsenceReasonOnModal = $(
            "#scientificCodeAbsenceReasonOnModal",
        ).val();
        var strengthOnModal = $("#strengthOnModal").val();
        var selectionReasonOnModal = $("#selectionReasonOnModal").val();
        var pharmacistSubsituteOnModal = $("#pharmacistSubsituteOnModal").val();
        var medicineStartDateOnModal = $("#medicineStartDateOnModal").val();
        var discontinueDateOnModal = $("#discontinueDateOnModal").val();
        var txtDurationOnModal = $("#txtDurationOnModal").val();
        var slcDurationUnitOnModal = $("#slcDurationUnitOnModal").val();
        var frequencyOnModal = $("#frequencyOnModal").val();
        var txtPeriodOnModal = $("#txtPeriodOnModal").val();
        var slcPeriodUnitOnModal = $("#slcPeriodUnitOnModal").val();
        var txtDoseQuantityOnModal = $("#txtDoseQuantityOnModal").val();
        var slcDoseOnModal = $("#slcDoseOnModal").val();
        var slcRouteAdminOnModal = $("#slcRouteAdminOnModal").val();
        var timeInstructionOnModal = $("#timeInstructionOnModal").val();
        var refillCountOnModal = $("#refillCountOnModal").val();
        var dosageInstructionOnModal = $("#dosageInstructionOnModal").val();
        var patientInstructionOnModal = $("#patientInstructionOnModal").val();
        var additionalSupportingInfoOnModal = $(
            "#additionalSupportingInfoOnModal",
        ).val();
        var oralRegionOnModal = $("#oralRegionOnModal").val();
        var toothSurfaceOnModal = $("#toothSurfaceOnModal").val();
        var serviceDiagnosisOnModal = $("#serviceDiagnosisOnModal").val();
        var daySupplyOnModal = $("#daySupplyOnModal").val();
        var bodySiteOnModal = $("#bodySiteOnModal").val();
        var subSiteOnModal = $("#subSiteOnModal").val();
        var serviceDiscountPercentageOnModal = $(
            "#serviceDiscountPercentageOnModal",
        ).val();
        var serviceTrHtml = `<tr>
                                <td class="insurance-service-name"><input type="hidden" class="service-id" name="insurance_service_id[]" value="${serviceIdOnModal}">${serviceNameOnModal}</td>
                                <td class="insurance-service-code">${serviceCodeOnModal}</td>
                                <td class="insurance-service-qty">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="insurance_service_deductible_rate[]" value="${deductibleRateOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="insurance_service_max_copay_limit[]" value="${maxCopayLimitOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="insurance_service_vat_percentage[]" value="${serviceVatPercentageOnModal}">
                                <input type="hidden" class="form-control" name="insurance_service_order_list_id[]" value="null">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="insurance_service_Date[]" value="${serviceDateOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="insurance_slct_medical_service_type[]" value="${slctMedicalServiceTypeOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_scientific_code[]" value="${scientificCodeOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_scientific_code_absence_reason[]" value="${scientificCodeAbsenceReasonOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_strength[]" value="${strengthOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_selection_reason[]" value="${selectionReasonOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_pharmacist_subsitute[]" value="${pharmacistSubsituteOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_medicine_start_date[]" value="${medicineStartDateOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_discontinue_date[]" value="${discontinueDateOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_txt_duration[]" value="${txtDurationOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_slct_duration_unit[]" value="${slcDurationUnitOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_frequency[]" value="${frequencyOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_txt_period[]" value="${txtPeriodOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_slc_period_unit[]" value="${slcPeriodUnitOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_txt_dose_quantity[]" value="${txtDoseQuantityOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_slc_dose[]" value="${slcDoseOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_slc_route_admin[]" value="${slcRouteAdminOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_time_instruction[]" value="${timeInstructionOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_refill_count[]" value="${refillCountOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_dosage_instruction[]" value="${dosageInstructionOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_patient_instruction[]" value="${patientInstructionOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_additional_supporting_info[]" value="${additionalSupportingInfoOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_oral_region[]" value="${oralRegionOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_tooth_surface[]" value="${toothSurfaceOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_service_diagnosis[]" value="${serviceDiagnosisOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_day_supply[]" value="${daySupplyOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_body_site[]" value="${bodySiteOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_sub_site[]" value="${subSiteOnModal}">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_medication_id[]" value="">
                                <input type="hidden" class="form-control" placeholder="Quantity" name="ins_service_discount_percentage[]" value="${serviceDiscountPercentageOnModal}">
                                <input type="number" class="form-control" placeholder="Quantity" name="insurance_service_qty[]" value="${serviceQuantityOnModal}">
                                </td>
                                <td class="insurance-service-price">
                                    <input type="text" class="form-control" placeholder="Price" name="insurance_service_price[]" value="${serviceUnitPriceOnModal}">
                                </td>
                                <td class="insurance-service-deduction-amount">
                                    <input type="text" class="form-control" placeholder="Insurance Deduction" name="insurance_service_deduction[]" value="${serviceInsuranceDeductionOnModal}">
                                </td>
                                <td class="insurance-service-vat-amount">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="insurance_service_patient_share[]" value="${servicepatientShareAmountOnModal}">
                                </td>
                                <td class="insurance-service-vat-amount">
                                    <input type="text" class="form-control" placeholder="VAT Amount" name="insurance_service_patient_vat[]" value="${servicePatientVatAmountOnModal}">
                                </td>
                                <td class="insurance-service-net-amount">
                                    <input type="text" class="form-control" placeholder="Net Amount" name="insurance_service_net_amount[]" value="${serviceNetAmountOnModal}">
                                </td>
                                <td>
                                    <button type="button" class="btn btn-danger remove-row">X</button>
                                </td>
                            </tr>
                        `;
        $("#insurance_service_tbody").append(serviceTrHtml);
        var $newRow = $("#insurance_service_tbody tr").last();
    });

    $(document).on("change", "#slctMedicalServiceTypeOnModal", function () {
        const val = $(this).val();
        const showPharmTypes = ["pharmaceuticals", "herbal_and_vitamin"];
        const daySupplyTypes = ["cosmetic", "nutrtion"];
        const dentalServiceTypes = ["dental_services"];
        if (showPharmTypes.includes(val)) {
            $("#pharm_div").show();
            $("#dental_service_div").hide();
            $("#day_supply_div").hide();
            $("#body_site_div").show();
        } else if (daySupplyTypes.includes(val)) {
            $("#day_supply_div").show();
            $("#pharm_div").hide();
            $("#body_site_div").show();
        } else if (dentalServiceTypes.includes(val)) {
            $("#dental_service_div").show();
            $("#day_supply_div").hide();
            $("#pharm_div").hide();
            $("#body_site_div").hide();
        } else {
            $("#pharm_div").hide();
            $("#dental_service_div").hide();
            $("#day_supply_div").hide();
            $("#body_site_div").show();
        }
    });
});

function sumOfNetAmount() {
    var totalNetAmount = 0;
    $("input[name='insurance_service_net_amount[]']").each(function () {
        var netAmount = parseFloat($(this).val()) || 0;
        totalNetAmount += netAmount;
    });
    console.log("Total Net Amount:", totalNetAmount);
    $("#insurance_service_sum_of_net_amount").val(totalNetAmount.toFixed(2));
    $("#insurance_service_net_amount_td").text(totalNetAmount.toFixed(2));
}

function sumOfTotalAmount() {
    var sumOfTotalAmount = 0;
    +$("input[name='insurance_service_total[]']").each(function () {
        var totalAmount = parseFloat($(this).val()) || 0;
        sumOfTotalAmount += totalAmount;
    });
    console.log("Total  Amount:", sumOfTotalAmount);
    $("#insurance_total_sum_td").text(sumOfTotalAmount.toFixed(2));
    $("#insurance_total_sum").val(sumOfTotalAmount.toFixed(2));
}

function sumOfInsuranceDeduction() {
    var sumOfInsuranceDeductionAmount = 0;
    $("input[name='insurance_service_deduction[]']").each(function () {
        var insuranceDeductionAmount = parseFloat($(this).val()) || 0;
        sumOfInsuranceDeductionAmount += insuranceDeductionAmount;
    });
    console.log("Total  Amount:", sumOfInsuranceDeductionAmount);
    $("#insurance_service_deduction_sum_td").text(
        sumOfInsuranceDeductionAmount.toFixed(2),
    );
    $("#insurance_service_deduction_sum").val(
        sumOfInsuranceDeductionAmount.toFixed(2),
    );
}

function sumOfVat() {
    var sumOfVatAmount = 0;
    $("input[name='insurance_service_patient_share[]']").each(function () {
        var vatAmount = parseFloat($(this).val()) || 0;
        sumOfVatAmount += vatAmount;
    });
    console.log("Vat  Amount:", sumOfVatAmount);
    $("#insurance_service_vat_sum_td").text(sumOfVatAmount.toFixed(2));
    $("#insurance_service_total_vat_sum").val(sumOfVatAmount.toFixed(2));
}

function getServiceDetailsById(serviceId) {
    $("#loader-overlay").show();
    $.ajax({
        url:
            BASE_URL +
            "/medicalrecord-insurance-service-details/" +
            $("#reservationId").val() +
            "/" +
            serviceId,
        type: "GET",
        success: function (response) {
            $("#loader-overlay").hide();
            if (response.status) {
                console.log(response);
                const serviceData = response.data[0];
                console.log(serviceData);
                $("#serviceVatPercentageOnModal").val(
                    serviceData.vatPercentage,
                );
                $("#serviceDiscountPercentageOnModal").val(
                    serviceData.insuranceCoverageRate,
                );
                $("#serviceNetAmountOnModal").val(serviceData.patientShareAmt);
                $("#serviceQuantityOnModal").val(1);
                $("#serviceInsuranceDeductionOnModal").val(
                    serviceData.cmpnyDeductable,
                );
                console.log(serviceData);
                $("#serviceUnitPriceOnModal").val(serviceData.cmpnyShareAmt);
                $("#servicepatientShareAmountOnModal").val(
                    serviceData.patientShareAmt,
                );
                $("#servicePatientVatAmountOnModal").val(
                    serviceData.patientShareVatAmt,
                );
                $("#serviceNameOnModal").val(
                    $("#searchInsuranceServiceId option:selected")
                        .text()
                        .trim(),
                );
                $("#serviceCodeOnModal").val(serviceData.serviceCode);
                $("#deductibleRateOnModal").val(serviceData.deductibleRate);
                $("#deductibleAmountOnModal").val(serviceData.deductibleAmount);
                $("#maxCopayLimitOnModal").val(serviceData.maxCopayLimit);
                let netAmount = 0;
                let serviceQuantity = 1;
                netAmount = calculateServiceNetAmount(
                    response.data.disType,
                    response.data.dis,
                    response.data.cost,
                    serviceQuantity,
                    response.data.vatPercentage,
                );
                $("#serviceUnitPrice").val(response.data.cost);
                $("#serviceVatPercentage").val(response.data.vatPercentage);
                $("#serviceNetAmount").val(netAmount);
                $("#serviceQuantity").val(serviceQuantity);
                $("#serviceDiscountPercentage").val(
                    response.data.disType == "flat" ? response.data.dis : 0,
                );
                calculateNetAmount();
            }
        },
    });
}

function calculateServiceNetAmount(
    disType,
    dis,
    cost,
    serviceQuantity,
    taxValueInPercentage,
) {
    let unitPrice = parseFloat(cost) || 0;
    let vatPercent = parseFloat(taxValueInPercentage) || 0;
    let discountAmount = 0;
    let discountPercent = parseFloat(dis) || 0;
    let quantity = parseFloat(serviceQuantity) || 1;
    if (disType == "flat") {
        discountAmount = parseFloat(dis) || 0;
    } else if (disType == "percentage") {
        discountAmount = (unitPrice * discountPercent) / 100;
    }
    let priceAfterDiscount = unitPrice - discountAmount;
    let vatAmount = (priceAfterDiscount * vatPercent) / 100;
    return (netAmount = (priceAfterDiscount + vatAmount) * quantity);
}

function calculateNetAmount() {
    let unitPrice = parseFloat($("#serviceUnitPrice").val()) || 0;
    let quantity = parseFloat($("#serviceQuantity").val()) || 0;
    let discountPercentage =
        parseFloat($("#serviceDiscountPercentage").val()) || 0;
    let grossAmount = unitPrice * quantity;
    let discountAmount = (discountPercentage / 100) * grossAmount;
    let netAmount = grossAmount - discountAmount;
    $("#serviceDiscountAmount").val(discountAmount);
    $("#serviceNetAmount").val(netAmount.toFixed(2));
    console.log(discountPercentage);
}

function deleteAlreadyExistService(serviceOrderListId, serviceId) {
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
                    "/medicalrecords/delete-pending-service/" +
                    serviceOrderListId +
                    "/" +
                    serviceId,
                type: "DELETE",
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
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                },
            });
        }
    });
}

function calculateInsuranceServiceRow($row) {
    var quantity =
        parseFloat($row.find("input[name='insurance_service_qty[]']").val()) ||
        0;
    var price =
        parseFloat(
            $row.find("input[name='insurance_service_price[]']").val(),
        ) || 0;
    var serviceCost = quantity * price;

    var deductibleRate =
        parseFloat(
            (
                $row
                    .find("input[name='insurance_service_deductible_rate[]']")
                    .val() || "0"
            ).replace("d", ""),
        ) || 0;
    var maxCopayLimit =
        parseFloat(
            (
                $row
                    .find("input[name='insurance_service_max_copay_limit[]']")
                    .val() || "0"
            ).replace("m", ""),
        ) || 0;
    var vatPercentage =
        parseFloat(
            (
                $row
                    .find("input[name='insurance_service_vat_percentage[]']")
                    .val() || "0"
            ).replace("v", ""),
        ) || 0;
    var deductibleAmount = (serviceCost * deductibleRate) / 100;
    var clientPayableAmount, discountAppliedAmount;
    if (maxCopayLimit > 0) {
        clientPayableAmount = Math.min(deductibleAmount, maxCopayLimit);
        discountAppliedAmount = deductibleAmount - clientPayableAmount;
    } else {
        clientPayableAmount = deductibleAmount;
        discountAppliedAmount = 0;
    }
    var insurancePays = serviceCost - deductibleAmount;
    console.log();
    let vatAmount = (clientPayableAmount * vatPercentage) / 100;
    vatAmount = truncateDecimals(vatAmount, 2);
    var finalClientPayableWithVat = clientPayableAmount + vatAmount;
    $row.find("input[name='insurance_service_total[]']").val(serviceCost);
    $row.find("input[name='insurance_service_deduction[]']").val(insurancePays);
    $row.find("input[name='insurance_service_patient_share[]']").val(vatAmount);
    $row.find("input[name='insurance_service_net_amount[]']").val(
        finalClientPayableWithVat,
    );
    sumOfNetAmount();
    sumOfTotalAmount();
    sumOfInsuranceDeduction();
    sumOfVat();
    console.log(finalClientPayableWithVat);
}

const truncateDecimals = (num, decimals) => {
    const multiplier = Math.pow(10, decimals);
    return Math.floor(num * multiplier) / multiplier;
};

function loadInsuranceDiagnosis() {
    let diagnosisIds = $("input[name='diagnosisIdTd[]']")
        .map(function () {
            return $(this).val();
        })
        .get();
    console.log("Insurance diagnosis IDs:", diagnosisIds);
    if (!diagnosisIds.length) {
        console.warn("No diagnosis selected yet");
        return;
    }
    appendInsuranceDiagnosisSelectBox(diagnosisIds);
}

function appendInsuranceDiagnosisSelectBox(diagnosisIds, selectedIds = []) {
    const $select = $("#serviceDiagnosisOnModal");
    if ($select.hasClass("select2-hidden-accessible")) {
        $select.select2("destroy");
    }
    $select.find("option").remove();
    $select.empty();
    if (window._diagnosisAjax) {
        window._diagnosisAjax.abort();
        window._diagnosisAjax = null;
    }
    window._diagnosisAjax = $.ajax({
        url: BASE_URL + "/get-diagnosis-list",
        type: "POST",
        data: { diagnosisIds: JSON.stringify(diagnosisIds) },
        success: function (response) {
            window._diagnosisAjax = null;
            if (response.status === true && Array.isArray(response.data)) {
                $select.empty();
                const seen = new Set();
                response.data.forEach(function (item) {
                    if (!seen.has(item.diagnosisListId)) {
                        seen.add(item.diagnosisListId);
                        $select.append(
                            `<option value="${item.diagnosisListId}">${item.diagnosisCode} - ${item.diagnosisName_en}</option>`,
                        );
                    }
                });
                $select.select2({
                    dropdownParent: $("#offcanvasTop"),
                    placeholder: "Select Diagnosis",
                    allowClear: true,
                    width: "resolve",
                });
                if (selectedIds.length) {
                    $select.val(selectedIds).trigger("change");
                }
            }
        },
        error: function (xhr) {
            if (xhr.statusText !== "abort") {
                console.error("Diagnosis load failed:", xhr);
            }
        },
    });
}
