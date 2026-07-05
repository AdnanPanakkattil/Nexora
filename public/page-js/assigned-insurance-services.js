$(document).ready(function () {
    $("#service_main_menu").addClass("active open menu-item-animating");
    $("#insurance_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    const tagifyConsultation = document.querySelector("#consultation");
    const tagifyConsultationElement = new Tagify(tagifyConsultation, {
        userInput: false,
    });

    tagifyConsultationElement.on("remove", function (e) {
        const removedIndex = e.detail.index;
        const hiddenInput = document.getElementById(
            "selectedServiceIdConsultation",
        );
        let currentIds = hiddenInput.value
            ? hiddenInput.value.split(",").map((id) => id.trim())
            : [];
        if (removedIndex >= 0 && removedIndex < currentIds.length) {
            currentIds.splice(removedIndex, 1);
        }
        hiddenInput.value = currentIds.join(",");
    });

    const tagifyFollowUp = document.querySelector("#followUp");
    const tagifyFollowUpElement = new Tagify(tagifyFollowUp, {
        userInput: false,
    });

    tagifyFollowUpElement.on("remove", function (e) {
        const removedIndex = e.detail.index;
        const hiddenInput = document.getElementById(
            "selectedServiceIdFollowup",
        );
        let currentIds = hiddenInput.value
            ? hiddenInput.value.split(",").map((id) => id.trim())
            : [];
        if (removedIndex >= 0 && removedIndex < currentIds.length) {
            currentIds.splice(removedIndex, 1);
        }
        hiddenInput.value = currentIds.join(",");
    });

    flatpickr(".activationDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    flatpickr(".deactivationDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });

    $("#assignInsuranceServiceSettingsModal").on("shown.bs.modal", function () {
        $("#searchServiceConsultation").select2({
            placeholder: "Select a Service",
            dropdownParent: $("#assignInsuranceServiceSettingsModal"),
            ajax: {
                url:
                    BASE_URL +
                    "/get-insurance-service-assigned-services/" +
                    $("#insurancePayerId").val(),
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        serviceCodeOrName: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.data,
                    };
                },
                cache: true,
            },
        });
    });

    $("#assignInsuranceServiceSettingsModal").on("shown.bs.modal", function () {
        $("#searchServiceFollowup").select2({
            placeholder: "Select a Service",
            dropdownParent: $("#assignInsuranceServiceSettingsModal"),
            ajax: {
                url:
                    BASE_URL +
                    "/get-insurance-service-assigned-services/" +
                    $("#insurancePayerId").val(),
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        serviceCodeOrName: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.data,
                    };
                },
                cache: true,
            },
        });
    });

    $("#searchServiceConsultation").on("select2:select", function (e) {
        const selectedText = e.params.data.text;
        const selectedId = String(e.params.data.id);
        tagifyConsultationElement.addTags([selectedText]);
        let existingValue = $("#selectedServiceIdConsultation").val();
        let serviceIds = existingValue
            ? existingValue.split(",").map(String)
            : [];
        console.log("Current IDs:", serviceIds);
        console.log("Selected ID:", selectedId);
        console.log("Already exists:", serviceIds.includes(selectedId));
        if (!serviceIds.includes(selectedId)) {
            serviceIds.push(selectedId);
            $("#selectedServiceIdConsultation").val(serviceIds.join(","));
        }
        $(this).val("").trigger("change");
    });

    $("#searchServiceFollowup").on("select2:select", function (e) {
        const selectedText = e.params.data.text;
        const selectedId = String(e.params.data.id);
        tagifyFollowUpElement.addTags([selectedText]);
        let existingValue = $("#selectedServiceIdFollowup").val();
        let serviceIds = existingValue
            ? existingValue.split(",").map(String)
            : [];
        console.log("Current IDs:", serviceIds);
        console.log("Selected ID:", selectedId);
        console.log("Already exists:", serviceIds.includes(selectedId));
        if (!serviceIds.includes(selectedId)) {
            serviceIds.push(selectedId);
            $("#selectedServiceIdFollowup").val(serviceIds.join(","));
        }
        $(this).val("").trigger("change");
    });

    $("#addNewServiceGroupBtn").click(function () {
        $("#serviceGroupModal").modal("show");
        $("#service_group_header").text("Add New Group");
    });

    $("#isPackage").on("change", function () {
        if ($(this).is(":checked")) {
            $(this).val("1");
        } else {
            $(this).val("0");
        }
    });

    $("#assignedServiceSettingsBtn").click(function () {
        $("#assignInsuranceServiceSettingsModal").modal("show");
        $("#loader-overlay").show();
        $.ajax({
            url:
                BASE_URL +
                "/get-already-exist-insurance-service-settings/" +
                $("#insurancePayerId").val(),
            method: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    tagifyConsultationElement.removeAllTags();
                    tagifyFollowUpElement.removeAllTags();
                    $.each(response.data, function (index, item) {
                        console.log(item);
                        if (
                            item.staticKey == "insurance_service_consultation"
                        ) {
                            $("#selectedServiceIdConsultation").val(
                                item.value_en,
                            );
                            if (
                                item.service_names &&
                                item.service_names.length > 0
                            ) {
                                tagifyConsultationElement.addTags(
                                    item.service_names,
                                );
                            }
                        }
                        if (item.staticKey == "insurance_service_followup") {
                            $("#selectedServiceIdFollowup").val(item.value_en);
                            if (
                                item.service_names &&
                                item.service_names.length > 0
                            ) {
                                tagifyFollowUpElement.addTags(
                                    item.service_names,
                                );
                            }
                        }
                    });
                }
            },
            error: function (err) {
                console.error("Error fetching edit data:", err);
            },
        });
    });

    $("#assignedServiceRulesBtn").click(function () {
        $("#contractRuleModal").modal("show");
    });
    let packageIndex = 0;
    let deletedRuleIds = [];

    $("#assignedServicepackageBtn")
        .off("click")
        .on("click", function () {
            let payerId = $("#insurancePayerId").val();
            deletedRuleIds = [];
            $("#loader-overlay").show();
            $.ajax({
                url: BASE_URL + "/get-insurance-package-rules",
                type: "GET",
                data: {
                    insurancePayerId: payerId,
                },
                success: function (res) {
                    $("#loader-overlay").hide();
                    $("#packageTableBody").html("");
                    packageIndex = 0;
                    if (res.data.length > 0) {
                        res.data.forEach(function (item, index) {
                            let row =
                                "<tr data-rule-id='" +
                                item.insurancePackageRuleId +
                                "'>" +
                                "<td>" +
                                (index + 1) +
                                "</td>" +
                                "<td><input type='number' step='0.01' class='form-control' name='packages[" +
                                index +
                                "][percentage]' value='" +
                                item.percentage +
                                "'></td>" +
                                "<td><button type='button' class='btn btn-sm btn-label-danger removePackageRowBtn'><i class='ti ti-trash'></i></button></td>" +
                                "</tr>";
                            $("#packageTableBody").append(row);
                            packageIndex++;
                        });
                    } else {
                        $("#packageTableBody").html(
                            "<tr>" +
                                "<td>1</td>" +
                                "<td><input type='number' step='0.01' class='form-control' name='packages[0][percentage]' placeholder='Percentage'></td>" +
                                "<td><button type='button' class='btn btn-sm btn-label-danger removePackageRowBtn'><i class='ti ti-trash'></i></button></td>" +
                                "</tr>",
                        );
                        packageIndex = 1;
                    }
                    let savedIds = res.savedDeductionCategoryIds
                        ? res.savedDeductionCategoryIds
                              .toString()
                              .split(",")
                              .map((s) => s.trim())
                        : [];
                    loadDeductionCategories(savedIds, function () {
                        $("#contractpackageModal").modal("show");
                    });
                },
            });
        });

    $(document).on("click", "#addPackageRowBtn", function () {
        let rowNumber = packageIndex + 1;
        let newRow =
            "<tr>" +
            "<td>" +
            rowNumber +
            "</td>" +
            "<td><input type='number' step='0.01' class='form-control' name='packages[" + // aj
            packageIndex +
            "][percentage]' placeholder='Percentage'></td>" +
            "<td><button type='button' class='btn btn-sm btn-label-danger removePackageRowBtn'><i class='ti ti-trash'></i></button></td>" +
            "</tr>";
        $("#packageTableBody").append(newRow);
        packageIndex++;
    });

    $(document).on("click", ".removePackageRowBtn", function () {
        let ruleId = $(this).closest("tr").data("rule-id");
        if (ruleId) {
            deletedRuleIds.push(ruleId);
        }
        $(this).closest("tr").remove();
        packageIndex = 0;
        $("#packageTableBody tr").each(function () {
            let rowNumber = packageIndex + 1;
            $(this).find("td:first").text(rowNumber);
            $(this)
                .find("input")
                .attr("name", "packages[" + packageIndex + "][percentage]");
            packageIndex++;
        });
    });

    $("#saveContractPackageBtn")
        .off("click")
        .on("click", function () {
            let isValid = true;
            $("#packageTableBody tr").each(function () {
                let percentage = $(this)
                    .find("input[name*='[percentage]']")
                    .val();
                if (!percentage || percentage.trim() === "") {
                    isValid = false;
                    Swal.fire({
                        icon: "error",
                        text: "Please fill all Percentage fields.",
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                        buttonsStyling: false,
                    });
                    return false;
                }
                if (
                    parseFloat(percentage) > 100 ||
                    parseFloat(percentage) < 0
                ) {
                    isValid = false;
                    Swal.fire({
                        icon: "error",
                        text: "Percentage must be between 0 and 100.",
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                        buttonsStyling: false,
                    });
                    return false;
                }
            });
            if (!isValid) return;
            let selectedCategories = $("#deductionCategorySelect").val();
            if (!selectedCategories || selectedCategories.length === 0) {
                selectedCategories = [];
            }
            console.log($("#deductionCategorySelect").val());
            console.log($("#deductionCategoryId").val());
            let formData = $("#contract_package_form").serialize();
            if (deletedRuleIds.length > 0) {
                formData += "&" + $.param({ deletedRuleIds: deletedRuleIds });
            }
            $("#loader-overlay").show();
            $.ajax({
                url: BASE_URL + "/insurance-package-rules",
                type: "POST",
                data: formData,
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content",
                    ),
                },
                success: function (response) {
                    if (response.status === true) {
                        let payerId = $("#insurancePayerId").val();
                        Swal.fire({
                            icon: "success",
                            text: "Contract package saved successfully!",
                            customClass: {
                                confirmButton:
                                    "btn btn-success waves-effect waves-light",
                            },
                            buttonsStyling: false,
                        }).then(function () {
                            $("#contractpackageModal").modal("hide");
                            packageIndex = 0;
                            deletedRuleIds = [];
                            $("#packageTableBody").html(
                                "<tr>" +
                                    "<td>1</td>" +
                                    "<td><input type='number' step='0.01' class='form-control' name='packages[0][percentage]' placeholder='Percentage'></td>" +
                                    "<td><button type='button' class='btn btn-sm btn-label-danger removePackageRowBtn'><i class='ti ti-trash'></i></button></td>" +
                                    "</tr>",
                            );
                            packageIndex = 1;
                            if (
                                typeof assignedInsuranceServiceTable !==
                                "undefined"
                            ) {
                                assignedInsuranceServiceTable.ajax.reload();
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            text: response.message || "Failed to save package.",
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                            buttonsStyling: false,
                        });
                    }
                },
                error: function (xhr) {
                    let msg = "Something went wrong";
                    if (xhr.responseJSON?.message) {
                        msg = xhr.responseJSON.message;
                    }
                    Swal.fire({
                        icon: "error",
                        text: msg,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                        buttonsStyling: false,
                    });
                },
                complete: function () {
                    $("#loader-overlay").hide();
                },
            });
        });

    function loadDeductionCategories(savedIds, callback) {
        if (
            $("#deductionCategorySelect").hasClass("select2-hidden-accessible")
        ) {
            $("#deductionCategorySelect").select2("destroy");
        }
        $("#loader-overlay").show();
        $.ajax({
            url: BASE_URL + "/get-deduction-categories",
            type: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                let select = $("#deductionCategorySelect");
                select.empty();
                $.each(response.data, function (index, item) {
                    let option = new Option(
                        item.categoryName_en,
                        item.categoryId,
                        false,
                        savedIds.includes(item.categoryId.toString()),
                    );
                    select.append(option);
                });
                select.select2({
                    placeholder: "Select Category",
                    allowClear: true,
                    dropdownParent: $("#contractpackageModal"),
                });
                if (savedIds.length > 0) {
                    select.val(savedIds).trigger("change");
                }
                if (typeof callback === "function") {
                    callback();
                }
            },
        });
    }

    $("#saveContractRulesBtn").click(function () {
        let isValid = true;
        $("#contract_rule_form tbody tr").each(function () {
            let row = $(this);
            let referralType = row
                .find('select[name*="discountTypeReffralCost"]')
                .val();
            let referralInput = row
                .find('input[name*="ruleValueReffralCost"]')
                .val();
            let referralValue = parseFloat(referralInput);
            let netType = row.find('select[name*="discountTypeNetCost"]').val();
            let netInput = row.find('input[name*="ruleValueNetCost"]').val();
            let netValue = parseFloat(netInput);
            if (netType && (netInput === "" || isNaN(netValue))) {
                isValid = false;
                Swal.fire({
                    icon: "error",
                    text: "Please enter Rule Net Cost when a Discount Type is selected.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
                return false;
            }
            if (!netType && netInput !== "") {
                isValid = false;
                Swal.fire({
                    icon: "error",
                    text: "Please select a Discount Type when Rule Net Cost is entered.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
                return false;
            }
            if (
                netType === "percentage" &&
                !isNaN(netValue) &&
                netValue > 100
            ) {
                isValid = false;
                Swal.fire({
                    icon: "error",
                    text: "Net cost percentage cannot be more than 100.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
                return false;
            }
            if (
                referralType &&
                (referralInput === "" || isNaN(referralValue))
            ) {
                isValid = false;
                Swal.fire({
                    icon: "error",
                    text: "Please enter Rule Referral Cost when a Discount Type is selected.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
                return false;
            }
            if (!referralType && referralInput !== "") {
                isValid = false;
                Swal.fire({
                    icon: "error",
                    text: "Please select a Discount Type when Rule Referral Cost is entered.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
                return false;
            }
            if (
                referralType === "percentage" &&
                !isNaN(referralValue) &&
                referralValue > 100
            ) {
                isValid = false;
                Swal.fire({
                    icon: "error",
                    text: "Referral percentage cannot be more than 100.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
                return false;
            }
        });
        if (!isValid) {
            return;
        }
        var formData = $("#contract_rule_form").serialize();
        $("#loader-overlay").show();
        $.ajax({
            url: BASE_URL + "/save-insurance-payer-rules",
            type: "POST",
            data: formData,
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
                        $("#contractRuleModal").modal("hide");
                        assignedInsuranceServiceTable.ajax.reload();
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    text: "Something went wrong. Please try again.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
            complete: function () {
                $("#loader-overlay").hide();
            },
        });
    });

    $("#addNewServiceToCommonBtn").click(function () {
        $("#assignInsuranceServiceModal").modal("show");
        $("#individual_header").text("Add New Individual Service");
        $("#discount_type_div").show();
        $("#dis_div").show();
        $("#netCost_div").show();
        $("#referralCost_div").show();
        $("#service_form")
            .find("input, textarea, select, button")
            .prop("disabled", false);
        $("#ex_arge_modal_footer").show();
        $("#service_form")[0].reset();
        $("#department").selectpicker("val", "");
        $("#netCost").val("");
        $(
            "#serviceType, #taxId, #categoryId, #deductionCategoryId, #appointmentType, #disType",
        )
            .val("")
            .trigger("change");
    });

    var dt_service_group_table = $(".service-group-table");
    var dataTableInstance = null;
    var assignedInsuranceServiceTable = $(
        "#assigned_insurance_service_table",
    ).DataTable({
        processing: true,
        serverSide: true,
        ajax:
            BASE_URL +
            "/assigned-insurance-services/" +
            $("#insurancePayerId").val(),
        columns: [
            {
                data: "checkbox",
                name: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_service" value="' +
                        full.serviceId +
                        '">'
                    );
                },
            },
            { data: "serviceId", name: "serviceId" },
            { data: "medicalCode", name: "medicalCode" },
            { data: "serviceCode", name: "serviceCode" },
            { data: "serviceName_en", name: "serviceName_en" },
            { data: "serviceName_ar", name: "serviceName_ar" },
            { data: "serviceType", name: "serviceType" },
            { data: "Catgeory" },
            { data: "deductionCatgeory" },
            { data: "duration", name: "duration" },
            { data: "cost", name: "cost" },
            { data: "dis", name: "dis" },
            { data: "disType", name: "disType" },
            { data: "netCost", name: "netCost" },
            { data: "referralCost", name: "referralCost" },
            { data: "isPackage", name: "isPackage" },
            { data: "department", name: "department" },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL +
                        "/edit-assigned-insurance-service/" +
                        full.serviceId;
                    var detailsUrl =
                        BASE_URL +
                        "/detail-of-assigned-insurance-service/" +
                        full.serviceId;
                    var deleteUrl =
                        BASE_URL +
                        "/delete-assigned-insurance-service/" +
                        full.serviceId;
                    var assignedServicesUrl =
                        BASE_URL + "/assigned-services/" + full.serviceId;
                    var viewServicePackageUrl =
                        BASE_URL +
                        "/detail-of-service-packages/" +
                        full.serviceId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="' +
                        viewServicePackageUrl +
                        '" class="dropdown-item detail-of-assigned-insurance-service" data-id="' +
                        viewServicePackageUrl +
                        '">View Service Packages</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item detail-of-assigned-insurance-service" data-id="' +
                        detailsUrl +
                        '">Details</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item edit-assigned-insurance-service" data-id="' +
                        editUrl +
                        '">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger item-delete" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    assignedInsuranceServiceTable.on(
        "click",
        ".detail-of-assigned-insurance-service",
        function () {
            var editUrl = $(this).data("id");
            $.ajax({
                url: editUrl,
                method: "GET",
                success: function (response) {
                    if (response.status === true) {
                        $("#assignInsuranceServiceModal").modal("show");
                        $("#ex_arge_modal_footer").hide();
                        $("#discount_type_div").show();
                        $("#dis_div").show();
                        $("#netCost_div").show();
                        $("#referralCost_div").show();
                        $("#individual_header").text(
                            "Details of assigned insurance service",
                        );
                        $("#service_form")
                            .find("input, textarea, select, button")
                            .prop("disabled", true);
                        $("#individual_service_id").val(
                            response.data.serviceId,
                        );
                        $("#employeeId").val(response.data.employeeId);
                        $("#serviceCode").val(response.data.serviceCode);
                        $("#nphiesCode").val(response.data.medicalCode);
                        $("#serviceName_en").val(response.data.serviceName_en);
                        $("#serviceName_ar").val(response.data.serviceName_ar);
                        const deptId = response.data.clinicDepartmentId;
                        $("#department").selectpicker(
                            "val",
                            deptId ? String(deptId) : "",
                        );
                        $("#categoryId").val(response.data.categoryId);
                        $("#appointmentType")
                            .val(response.data.appointmentType)
                            .trigger("change");
                        $("#serviceType")
                            .val(response.data.serviceType)
                            .trigger("change");
                        $("#taxId").val(response.data.taxId).trigger("change");
                        $("#cost").val(response.data.cost);
                        $("#duration").val(response.data.duration);
                        $("#oneDayBookingLimits").val(
                            response.data.oneDayBookingLimits,
                        );
                        $("#disType")
                            .val(response.data.disType)
                            .trigger("change");
                        $("#dis").val(response.data.dis);
                        $("#netCost").val(response.data.netCost);
                        $("#referralCost").val(response.data.referralCost);
                        $("#activationDate").val(response.data.activationDate);
                        $("#deactivationDate").val(
                            response.data.deactivationDate,
                        );
                        if (response.data.isPackage == 1) {
                            $("#isPackage").prop("checked", true);
                        } else {
                            $("#isPackage").prop("checked", false);
                        }
                        $("#categoryId")
                            .val(response.data.categoryId)
                            .trigger("change");
                        $("#deductionCategoryId")
                            .val(response.data.deductionCategoryId)
                            .trigger("change");
                    }
                },
                error: function (err) {
                    console.error("Error fetching edit data:", err);
                },
            });
        },
    );

    assignedInsuranceServiceTable.on(
        "click",
        ".edit-assigned-insurance-service",
        function () {
            var editUrl = $(this).data("id");
            $.ajax({
                url: editUrl,
                method: "GET",
                success: function (response) {
                    if (response.status === true) {
                        $("#assignInsuranceServiceModal").modal("show");
                        $("#ex_arge_modal_footer").show();
                        $("#discount_type_div").show();
                        $("#dis_div").show();
                        $("#netCost_div").show();
                        $("#referralCost_div").show();
                        $("#individual_header").text(
                            "Update assigned insurance service",
                        );
                        $("#service_form")
                            .find("input, textarea, select, button")
                            .prop("disabled", false);

                        $("#individual_service_id").val(
                            response.data.serviceId,
                        );
                        $("#employeeId").val(response.data.employeeId);
                        $("#serviceCode").val(response.data.serviceCode);
                        $("#nphiesCode").val(response.data.medicalCode);
                        $("#serviceName_en").val(response.data.serviceName_en);
                        $("#serviceName_ar").val(response.data.serviceName_ar);
                        const deptId = response.data.clinicDepartmentId;
                        $("#department").selectpicker(
                            "val",
                            deptId ? String(deptId) : "",
                        );
                        $("#categoryId").val(response.data.categoryId);
                        $("#appointmentType")
                            .val(response.data.appointmentType)
                            .trigger("change");
                        $("#serviceType")
                            .val(response.data.serviceType)
                            .trigger("change");
                        $("#taxId").val(response.data.taxId).trigger("change");
                        $("#cost").val(response.data.cost);
                        $("#duration").val(response.data.duration);
                        $("#oneDayBookingLimits").val(
                            response.data.oneDayBookingLimits,
                        );
                        $("#disType")
                            .val(response.data.disType)
                            .trigger("change");
                        $("#dis").val(response.data.dis);
                        $("#netCost").val(response.data.netCost);
                        $("#referralCost").val(response.data.referralCost);
                        $("#activationDate").val(response.data.activationDate);
                        $("#deactivationDate").val(
                            response.data.deactivationDate,
                        );
                        if (response.data.isPackage == 1) {
                            $("#isPackage").prop("checked", true);
                        } else {
                            $("#isPackage").prop("checked", false);
                        }
                        $("#categoryId")
                            .val(response.data.categoryId)
                            .trigger("change");
                        $("#deductionCategoryId")
                            .val(response.data.deductionCategoryId)
                            .trigger("change");
                    }
                },
                error: function (err) {
                    console.error("Error fetching edit data:", err);
                },
            });
        },
    );

    assignedInsuranceServiceTable.on("click", ".item-delete", function () {
        var deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this service?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes!",
            customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton:
                    "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: deleteUrl,
                    method: "DELETE",
                    success: function (response) {
                        if (response.status === true) {
                            if (assignedInsuranceServiceTable) {
                                assignedInsuranceServiceTable.ajax.reload();
                            } else {
                                console.error(
                                    "DataTable instance is not available.",
                                );
                            }
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton:
                                        "btn btn-success waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function (err) {
                        console.error("Error fetching edit data:", err);
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Please verify the service group.",
                    icon: "error",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });

    $("#createSettingsBtn").click(function () {
        var formData = $("#insurance_service_settings_form").serialize();
        var insurancePayerId = $("#insurancePayerId").val();
        $("#loader-overlay").show();
        $.ajax({
            url:
                BASE_URL +
                "/create-or-update-assigned-insurance-service-settings/" +
                insurancePayerId,
            type: "POST",
            data: formData,
            success: function (response) {
                $("#loader-overlay").hide();
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
                }
                $("#largeModal").modal("hide");
            },
            error: function (xhr, status, error) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    console.error("Error:", xhr);
                }
            },
        });
    });

    $(".createServiceBtn").click(function () {
        var formData = $("#service_form").serialize();
        var individualServiceId = $("#individual_service_id").val();
        var insurancePayerId = $("#insurancePayerId").val();
        formData += "&insurancePayerId=" + encodeURIComponent(insurancePayerId);
        var ajaxUrl = individualServiceId
            ? BASE_URL +
              "/update-assigned-service-to-insurance-service/" +
              individualServiceId
            : BASE_URL + "/assign-service-to-insurance-service";
        var method = individualServiceId ? "PUT" : "POST";
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
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
                }
                $("#largeModal").modal("hide");
            },
            error: function (xhr, status, error) {
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    console.error("Error:", xhr);
                }
            },
        });
    });

    $("#select_all").on("click", function () {
        var rows = assignedInsuranceServiceTable
            .rows({ search: "applied" })
            .nodes();
        $('input[type="checkbox"]', rows).prop("checked", this.checked);
        updateSelectedCount();
    });

    $("#assigned_insurance_service_table tbody").on(
        "change",
        'input[type="checkbox"]',
        function () {
            if (!this.checked) {
                var el = $("#select_all").get(0);
                if (el && el.checked && "indeterminate" in el) {
                    el.indeterminate = true;
                }
            }
            updateSelectedCount();
        },
    );

    $("#delete_selected").on("click", function () {
        var selectedIds = $('input[name="select_service"]:checked')
            .map(function () {
                return $(this).val();
            })
            .get();
        console.log(selectedIds);
        if (selectedIds.length > 0) {
            Swal.fire({
                title: "Are you sure?",
                text: "You want to delete this service?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes!",
                customClass: {
                    confirmButton:
                        "btn btn-primary me-3 waves-effect waves-light",
                    cancelButton:
                        "btn btn-label-secondary waves-effect waves-light",
                },
                buttonsStyling: false,
            }).then(function (result) {
                if (result.value) {
                    $.ajax({
                        url:
                            BASE_URL +
                            "/delete-selected-assigned-insurance-services",
                        method: "DELETE",
                        data: {
                            ids: selectedIds,
                        },
                        success: function (response) {
                            if (response.status === true) {
                                assignedInsuranceServiceTable.ajax.reload(
                                    null,
                                    false,
                                );
                                dataTableInstance.ajax.reload();
                                $("#bulk_select").hide();
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
                        error: function (err) {
                            console.error("Error fetching edit data:", err);
                        },
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        title: "Cancelled",
                        text: "Please verify the service common group.",
                        icon: "error",
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    });
                }
            });
        } else {
            alert("No services selected");
        }
    });
});

$("#cost, #dis, #disType").on("input change", function () {
    calculateNetCost();
});

function calculateNetCost() {
    let cost = parseFloat($("#cost").val()) || 0;
    let discount = parseFloat($("#dis").val()) || 0;
    let discountType = $("#disType").val();
    let netCost = cost;
    if (discountType === "flat") {
        netCost = cost - discount;
    } else if (discountType === "percentage") {
        netCost = cost - cost * (discount / 100);
    }
    $("#netCost").val(netCost.toFixed(2));
}

function updateSelectedCount() {
    var selectedCount = $('input[name="select_service"]:checked').length;
    $("#selected_count").text(selectedCount);
    if (selectedCount > 0) {
        $("#bulk_select").show();
        $("#selected_count").text(selectedCount);
    } else {
        $("#bulk_select").hide();
    }
}

$("#serviceName_en").on(
    "input",
    function () {
        this.value = this.value.replace(/[^a-zA-Z ]/g, "");
    },
);

$("#serviceName_ar").on(
    "input",
    function () {
        this.value = this.value.replace(/[^\u0600-\u06FF ]/g, "");
    },
);
