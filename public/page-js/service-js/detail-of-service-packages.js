$(document).ready(function () {
    $("#service_main_menu").addClass("active open menu-item-animating");
    $("#insurance_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#addNewServicePackageBtn").click(function () {
        $("#addNewServicePackageModal").modal("show");
        // $("#ex_arge_modal_footer").show();
        // $("#individual_header").text("Add New Individual Service");
        // $("#service_form")
        //     .find("input, textarea, select, button")
        //     .prop("disabled", false);
        // $("#service_form")[0].reset();
        getServiceDetyails();
    });

    const tagifyConsultation = document.querySelector("#consultation");
    const tagifyConsultationElement = new Tagify(tagifyConsultation, {
        userInput: false,
    });

    tagifyConsultationElement.on("remove", function (e) {
        const removedIndex = e.detail.index; // index of removed tag
        const hiddenInput = document.getElementById(
            "selectedServiceIdConsultation"
        );

        let currentIds = hiddenInput.value
            ? hiddenInput.value.split(",").map((id) => id.trim())
            : [];
        // Remove the ID at the same index
        if (removedIndex >= 0 && removedIndex < currentIds.length) {
            currentIds.splice(removedIndex, 1); // remove one item at the position
        }

        // Update the hidden input
        hiddenInput.value = currentIds.join(",");
    });

    const tagifyFollowUp = document.querySelector("#followUp");
    const tagifyFollowUpElement = new Tagify(tagifyFollowUp, {
        userInput: false,
    });

    tagifyFollowUpElement.on("remove", function (e) {
        const removedIndex = e.detail.index; // index of removed tag
        const hiddenInput = document.getElementById(
            "selectedServiceIdFollowup"
        );

        let currentIds = hiddenInput.value
            ? hiddenInput.value.split(",").map((id) => id.trim())
            : [];
        // Remove the ID at the same index
        if (removedIndex >= 0 && removedIndex < currentIds.length) {
            currentIds.splice(removedIndex, 1); // remove one item at the position
        }

        // Update the hidden input
        hiddenInput.value = currentIds.join(",");
    });

    flatpickr(".activationDate", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
    });
    flatpickr(".deactivationDate", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true, // Allows manual input if desired
    });
    // $("#assignInsuranceServiceSettingsModal").on("shown.bs.modal", function () {
    //     $("#searchServiceConsultation").select2({
    //         placeholder: "Select a Service",
    //         dropdownParent: $("#assignInsuranceServiceSettingsModal"),
    //         ajax: {
    //             url:
    //                 BASE_URL +
    //                 "/get-insurance-service-assigned-services/" +
    //                 $("#insurancePayerId").val(),
    //             dataType: "json",
    //             delay: 250,
    //             data: function (params) {
    //                 return {
    //                     serviceCodeOrName: params.term,
    //                 };
    //             },
    //             processResults: function (data) {
    //                 return {
    //                     results: $.map(data, function (item) {
    //                         return {
    //                             id: item.serviceId,
    //                             text:
    //                                 item.serviceName_en +
    //                                 " (" +
    //                                 item.serviceCode +
    //                                 ")",
    //                         };
    //                     }),
    //                 };
    //             },
    //             cache: true,
    //         },
    //     });
    // });
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
                    results: data.data 
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
                    results: data.data 
                };
            },
            cache: true,
        },
    });
});
    


    // $("#assignInsuranceServiceSettingsModal").on("shown.bs.modal", function () {
    //     $("#searchServiceFollowup").select2({
    //         placeholder: "Select a Service",
    //         dropdownParent: $("#assignInsuranceServiceSettingsModal"),
    //         ajax: {
    //             url:
    //                 BASE_URL +
    //                 "/get-insurance-service-assigned-services/" +
    //                 $("#insurancePayerId").val(),
    //             dataType: "json",
    //             delay: 250,
    //             data: function (params) {
    //                 return {
    //                     serviceCodeOrName: params.term,
    //                 };
    //             },
    //             processResults: function (data) {
    //                 return {
    //                     results: $.map(data, function (item) {
    //                         return {
    //                             id: item.serviceId,
    //                             text:
    //                                 item.serviceName_en +
    //                                 " (" +
    //                                 item.serviceCode +
    //                                 ")",
    //                         };
    //                     }),
    //                 };
    //             },
    //             cache: true,
    //         },
    //     });
    // });

    // $("#searchServiceConsultation").on("select2:select", function (e) {
    //     const selectedText = e.params.data.text;
    //     const selectedId = e.params.data.id;

    //     tagifyConsultationElement.addTags([selectedText]);
    //     // tagifyFollowUpElement.addTags([selectedText]);

    //     let existingValue = $("#selectedServiceIdConsultation").val();
    //     let serviceIds = existingValue ? existingValue.split(",") : [];

    //     if (!serviceIds.includes(selectedId)) {
    //         serviceIds.push(selectedId);
    //     }

    //     $("#selectedServiceIdConsultation").val(serviceIds.join(","));

    //     $(this).val("").trigger("change");
    // });

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

    // $("#searchServiceFollowup").on("select2:select", function (e) {
    //     const selectedText = e.params.data.text;
    //     const selectedId = e.params.data.id;

    //     // tagifyConsultationElement.addTags([selectedText]);
    //     tagifyFollowUpElement.addTags([selectedText]);

    //     let existingValue = $("#selectedServiceIdFollowup").val();
    //     let serviceIds = existingValue ? existingValue.split(",") : [];

    //     if (!serviceIds.includes(selectedId)) {
    //         serviceIds.push(selectedId);
    //     }

    //     $("#selectedServiceIdFollowup").val(serviceIds.join(","));

    //     $(this).val("").trigger("change");
    // });

    $("#addNewServiceGroupBtn").click(function () {
        $("#serviceGroupModal").modal("show");
        $("#service_group_header").text("Add New Group");
        // $("#insurance_payer_id").val("");
        // loadInsuranceCompanies();
    });

    

    

    

    var dt_service_group_table = $(".service-group-table");
    var dataTableInstance = null;

    var assignedInsuranceServiceTable = $(
        "#assigned_insurance_service_table"
    ).DataTable({
        processing: true,
        serverSide: true,
        ajax:
            BASE_URL +
            "/detail-of-service-packages/" +
            $("#serviceId").val(),
        columns: [
            {
                data: "checkbox",
                name: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_service" value="' +
                        full.clinicServiceDetailsId +
                        '">'
                    );
                },
            },
            { data: "clinicServiceDetailsId", name: "clinicServiceDetailsId" },
            { data: "serviceName_en", name: "serviceName_en" },
            { data: "medicalCode", name: "medicalCode" },
            { data: "serviceCode", name: "serviceCode" },
            { data: "deductionCategory", name: "deductionCategory" },
            { data: 'contract', name: 'contract' },
            { data: 'category', name: 'category' },
            // { data: 'serviceId' },
            { data: "cost", name: "cost" },
            { data: "dis", name: "dis" },
            { data: "netCost", name: "netCost" },

            { 
            data: "disType", 
            name: "disType",
            render: function (data) {
                if (data === 'flat') {
                    return 'Flat';
                } else if (data === 'percentage') {
                    return 'Percentage';
                } else {
                    return '-'; // for empty value
                }
            }
        },
            { data: "duration", name: "duration" },

            {
            data: "active",
            name: "active",
            render: function (data, type, row) {
                return data == 1 ? "Active" : "Inactive";
            }
        },
            
            // { data: 'actions' },
            {
                data: null, // Add this to handle the actions column
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL +
                        "/edit-service-package/" +
                        full.clinicServiceDetailsId;
                    var detailsUrl =
                        BASE_URL +
                        "/detail-of-service-package/" +
                        full.clinicServiceDetailsId;
                    var deleteUrl =
                        BASE_URL +
                        "/delete-service-package/" +
                        full.clinicServiceDetailsId;
                    

                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        

                        '<li><a href="javascript:;" class="dropdown-item detail-of-service-package" data-id="' +
                        detailsUrl +
                        '">Details</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item edit-service-package" data-id="' +
                        editUrl +
                        '">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger delete-service-package" data-id="' +
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
        ".detail-of-service-package",
        function () {
            var editUrl = $(this).data("id");
            $.ajax({
                url: editUrl,
                method: "GET",
                success: function (response) {
                    if (response.status === true) {
                        $("#addNewServicePackageModal").modal("show");
                        $("#ex_arge_modal_footer").hide();
                        $("#discount_type_div").show();
                        $("#dis_div").show();
                        $("#netCost_div").show();
                        $("#referralCost_div").show();
                        $("#individual_header").text(
                            "Details of Service Package"
                        );

                        $('#deductionCategoryId').val(response.data.deductionCategoryId).trigger('change');
                        $('#contractId').val(response.data.contractId).trigger('change');
                        $('#categoryId').val(response.data.categoryId).trigger('change');
                        $('#type').val(response.data.type).trigger('change');
                        $('#taxId').val(response.data.taxId).trigger('change');
                        $('#active').val(response.data.active).trigger('change');
                        $('#serviceType').val(response.data.serviceType).trigger('change');
                        $('#type').val(response.data.type).trigger('change');
                        $("#servicePackageId").val(
                            response.data.clinicServiceDetailsId
                        );
                        console.log(response.data.clinicServiceDetailsId);

                        $("#service_form")
                            .find("input, textarea, select, button")
                            .prop("disabled", true);

                        
                        $("#employeeId").val(response.data.employeeId);
                        $("#serviceCode").val(response.data.serviceCode);
                        $("#nphiesCode").val(response.data.medicalCode);
                        $("#serviceName_en").val(response.data.serviceName_en);
                        $("#serviceName_ar").val(response.data.serviceName_ar);
                        $("#categoryId").val(response.data.categoryId);
                        $("#type").val(response.data.appointmentType);
                        $("#taxId").val(response.data.taxId);
                        $("#cost").val(response.data.cost);
                        $("#duration").val(response.data.duration);
                        $("#oneDayBookingLimits").val(
                            response.data.oneDayBookingLimits
                        );

                        $("#disType").val(response.data.disType);
                        $("#dis").val(response.data.dis);
                        $("#netCost").val(response.data.netCost);
                        $("#referralCost").val(response.data.referralCost);
                        $("#activationDate").val(response.data.activationDate);
                        $("#deactivationDate").val(
                            response.data.deactivationDate
                        );

                        // if (response.data.isPackage == 1) {
                        //     $("#isPackage").prop("checked", true);
                        // } else {
                        //     $("#isPackage").prop("checked", false);
                        // }
                    }
                },
                error: function (err) {
                    console.error("Error fetching edit data:", err);
                },
            });
        }
    );

    assignedInsuranceServiceTable.on(
        "click",
        ".edit-service-package",
        function () {
            var editUrl = $(this).data("id");
            $.ajax({
                url: editUrl,
                method: "GET",
                success: function (response) {
                    if (response.status === true) {
                        $("#addNewServicePackageModal").modal("show");
                        $("#ex_arge_modal_footer").show();
                        $("#discount_type_div").show();
                        $("#dis_div").show();
                        $("#netCost_div").show();
                        $("#referralCost_div").show();
                        $("#individual_header").text(
                            "Update Service Package"
                        );
                        $("#servicePackageId").val(
                            response.data.clinicServiceDetailsId
                        );
                        console.log(response.data.clinicServiceDetailsId);

                        $("#service_form")
                            .find("input, textarea, select, button")
                            .prop("disabled", false);

                        
                        $("#employeeId").val(response.data.employeeId);
                        $("#serviceCode").val(response.data.serviceCode);
                        $("#nphiesCode").val(response.data.medicalCode);
                        $("#serviceName_en").val(response.data.serviceName_en);
                        $("#serviceName_ar").val(response.data.serviceName_ar);
                        $("#categoryId").val(response.data.categoryId);
                        $("#type").val(response.data.appointmentType);
                        $("#taxId").val(response.data.taxId);
                        $("#cost").val(response.data.cost);
                        $("#duration").val(response.data.duration);
                        $("#oneDayBookingLimits").val(
                            response.data.oneDayBookingLimits
                        );

                        $("#disType").val(response.data.disType);
                        $("#dis").val(response.data.dis);
                        $("#netCost").val(response.data.netCost);
                        $("#referralCost").val(response.data.referralCost);
                        $("#activationDate").val(response.data.activationDate);
                        $("#deactivationDate").val(
                            response.data.deactivationDate
                        );

                        if (response.data.isPackage == 1) {
                            $("#isPackage").prop("checked", true);
                        } else {
                            $("#isPackage").prop("checked", false);
                        }

                        $("#categoryId").val(response.data.categoryId);
                        $("#deductionCategoryId").val(
                            response.data.deductionCategoryId
                        );
                    }
                },
                error: function (err) {
                    console.error("Error fetching edit data:", err);
                },
            });
        }
    );

    assignedInsuranceServiceTable.on("click", ".delete-service-package", function () {
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
                                    "DataTable instance is not available."
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
        }
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
                                    false
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

    // var individualServiceId = $("#individual_service_id").val();
    //     var insurancePayerId = $("#insurancePayerId").val();
    //     // formDataArray.push({ name: "clinicServicesGroupId", value: commonServiceId });
    //     formData += "&insurancePayerId=" + encodeURIComponent(insurancePayerId);
    //     // Convert the array back into a query string format
    //     // var formData = $.param(formDataArray);
    //     var ajaxUrl = individualServiceId
    //         ? BASE_URL +
    //           "/update-assigned-service-to-insurance-service/" +
    //           individualServiceId
    //         : BASE_URL + "/assign-service-to-insurance-service";
    //     var method = individualServiceId ? "PUT" : "POST";


    $(".createServicePackageBtn").click(function () {
        var formData = $("#service_package_form").serialize();
        var servicePackageId = $("#servicePackageId").val();
        var serviceId = $("#serviceId").val();
        // formDataArray.push({ name: "clinicServicesGroupId", value: commonServiceId });
        formData += "&serviceId=" + encodeURIComponent(serviceId);
        // Convert the array back into a query string format
        // var formData = $.param(formDataArray);

        var ajaxUrl = servicePackageId
            ? BASE_URL +
              "/update-service-package/" +
              servicePackageId
            : BASE_URL + "/create-service-package";
        var method = servicePackageId ? "PUT" : "POST";
        

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
                $("#largeModal").modal("hide"); // Hide modal on success
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


    // When cost, VAT, discount type, or discount changes → recalc
    $("#cost, #taxId, #disType, #dis").on("input change", function () {
        calculateNetCost();
    });

    // Hide/Show discount field based on type
    $("#disType").on("change", function () {
        if ($(this).val() === "flat" || $(this).val() === "percentage") {
            $("#dis").closest(".col").show();
        } else {
            $("#dis").val(""); // reset discount
            $("#dis").closest(".col").hide();
            calculateNetCost();
        }
    });

    // Initially hide discount input
    $("#dis").closest(".col").hide();
});


function getServiceDetyails() {
    var serviceId = $("#serviceId").val();
    if (!serviceId) {
        alert("Service ID not found!");
        return;
    }

    // Fetch insurance deduction categories and other necessary data
    $.ajax({
        url: BASE_URL + "/get-service-details-for-service-package/" + serviceId,
        method: "GET",
        success: function (response) {
            if (response.status === true) {
                
                $("#serviceName_en").val(response.data.serviceName_en);
                $("#serviceName_ar").val(response.data.serviceName_ar);
                $("#cost").val(response.data.cost);
                $("#duration").val(response.data.duration);
                //
                // Populate the modal fields with fetched data if needed
                // For example:
                // $("#someField").val(response.data.someField);
            } else {
                alert("Failed to fetch service details.");
            }
        },
        error: function (err) {
            console.error("Error fetching service details:", err);
            alert("An error occurred while fetching service details.");
        },
    });

    // Show the modal after fetching data
    $("#addNewServicePackageModal").modal("show");
}
// End of document ready


function calculateNetCost() {
        let cost = parseFloat($("#cost").val()) || 0;
        let taxId = $("#taxId").val();
        let disType = $("#disType").val();
        let discount = parseFloat($("#dis").val()) || 0;

        let vatAmount = 0;
        if (taxId !== "0" && taxId !== " " && taxId !== "") {
            vatAmount = cost * 0.15; // 15% VAT
        }

        let totalWithVat = cost + vatAmount;
        let netCost = totalWithVat;

        if (disType === "flat") {
            netCost = totalWithVat - discount;
        } else if (disType === "percentage") {
            netCost = totalWithVat - (totalWithVat * (discount / 100));
        }

        $("#netCost").val(netCost.toFixed(2));
    }

    $('#serviceName_en,#serviceName_ar').on('keypress', function(e) {
    if (!/[a-zA-Z]/.test(e.key)) {
        e.preventDefault();
    }
});


