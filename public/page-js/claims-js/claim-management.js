$(document).ready(function () {
    const submitValue = $("#submitAction").val();
    if (submitValue === "pre-authorization") {
        $("#insurance_main_menu").addClass("active open menu-item-animating");
        $("#pre_authorization_sub_menu").addClass("active");
        $("#request_form").attr("id", "pre_authorization_request_form");
        $("#submit_request_btn").attr("id", "preauthorization_request_btn");
    } else if (submitValue === "resubmission-pre-authorization") {
        $("#insurance_main_menu").addClass("active open menu-item-animating");
        $("#pre_authorization_sub_menu").addClass("active");
    } else if (submitValue === "claim") {
        $("#claim_main_menu").addClass("active open menu-item-animating");
        $("#claims_management_sub_menu").addClass("active");
        $("#request_form").attr("id", "claim_request_form");
        $("#submit_request_btn").attr("id", "claim_request_btn");
    } else if (submitValue === "viewPreAuthorization") {
        $("#insurance_main_menu").addClass("active open menu-item-animating");
        $("#pre_authorization_sub_menu").addClass("active");
    } else if (submitValue === "cancelClaim") {
        $("#claim_main_menu").addClass("active open menu-item-animating");
        $("#claims_submitted_sub_menu").addClass("active");
    }

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var rangePickr = $(".flatpickr-range");
    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");

    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "m/d/Y",
            onClose: function (selectedDates, dateStr, instance) {
                if (selectedDates[0] != undefined) {
                    startDateEle.val(
                        moment(selectedDates[0]).format("MM/DD/YYYY")
                    );
                }
                if (selectedDates[1] != undefined) {
                    endDateEle.val(
                        moment(selectedDates[1]).format("MM/DD/YYYY")
                    );
                }
                rangePickr.trigger("change").trigger("keyup");
            },
        });
    }

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

    let claimManagementTable = $("#claim_management_table").DataTable(
        {
            processing: true,
            serverSide: true,
            ajax: {
                url: "/claims-management",
                data: function (d) {
                    d.payerId = $("#insurancePayer").val();
                    d.startDate = $(".start_date").val();
                    d.endDate = $(".end_date").val();
                    d.clientId = $("#patientselect").val();
                    d.systemStatus = $("#systemStatus").val();
                },
            },
            order: [[2, "desc"]],
            columns: [
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    render: function (data, type, row) {
                        if (row.systemStatus !== "pending") {
                            return ""; 
                        }
                        return (
                            '<input type="checkbox" class="dt-checkboxes form-check-input row-checkbox" name="select_item" value="' +
                            row.preAuthorizationRequestId +
                            '" data-client-id="' +
                            row.clientId +
                            '"data-insurance-payer-id="' +
                            row.insurancePayerId +
                            '">'
                        );
                    },
                },
                {
                    data: "preAuthorizationRequestId",
                    name: "preAuthorizationRequestId",
                    visible: true,
                },
                { data: "payerCode", name: "payerCode" },
                { data: "providerName", name: "providerName" },
                { data: "patientName", name: "patientName" },
                { data: "clientId", name: "clientId" },
                { data: "systemStatus", name: "systemStatus" },
                { data: "created_at", name: "created_at" },
                {
                    data: null,
                    name: "actions",
                    orderable: false,
                    searchable: false,
                    render: function (data, type, full, meta) {
                        console.log(full);
                        var claimSubmitUrl =
                            BASE_URL +
                            "/claim-submit-request/" +
                            full.preAuthorizationRequestId;
                        return (
                            '<div class="d-inline-block">' +
                            '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                            '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                            "<li>" +
                            '<a href="' +
                            claimSubmitUrl +
                            '"class="dropdown-item text-secondary" data-id="' +
                            full.preAuthorizationRequestId +
                            '">Claim Submit</a>'
                        );
                    },
                },
            ],
        }
    );

    $("#claim_search_btn").click(function () {
        claimManagementTable.ajax.reload();
    });

    let checkedItems = [];
    $("#select_all_item").on("click", function () {
        var rows = claimManagementTable.rows({ page: "current" }).nodes();
        var isChecked = this.checked;
        $("input.row-checkbox", rows).each(function () {
            $(this).prop("checked", isChecked);
            var itemId = this.value;
            var clientId = $(this).data("client-id");
            var insurancePayerId = $(this).data("insurance-payer-id");
            console.log($(this).data("insurance-payer-id"));
            if (isChecked) {
                var existingItem = checkedItems.find(
                    (item) => item.preAuthorizationRequestId === itemId
                );
                if (!existingItem) {
                    checkedItems.push({
                        preAuthorizationRequestId: itemId,
                        clientId: clientId,
                        insurancePayerId: insurancePayerId,
                    });
                }
            } else {
                checkedItems = checkedItems.filter(
                    (item) => item.preAuthorizationRequestId !== itemId
                );
            }
        });
        updateFooter();
    });

    $("#claim_management_table tbody").on(
        "change",
        "input.row-checkbox",
        function () {
            var itemId = this.value;
            var clientId = $(this).data("client-id");
            var insurancePayerId = $(this).data("insurance-payer-id");
            console.log($(this).data("insurance-payer-id"));
            if (this.checked) {
                var existingItem = checkedItems.find(
                    (item) => item.preAuthorizationRequestId === itemId
                );
                if (!existingItem) {
                    checkedItems.push({
                        preAuthorizationRequestId: itemId,
                        clientId: clientId,
                        insurancePayerId: insurancePayerId,
                    });
                }
            } else {
                checkedItems = checkedItems.filter(
                    (item) => item.preAuthorizationRequestId !== itemId
                );
            }
            var allCheckboxes = $(
                "input.row-checkbox",
                claimManagementTable.rows({ page: "current" }).nodes()
            );
            var allChecked =
                allCheckboxes.length ===
                allCheckboxes.filter(":checked").length;
            var selectAllCheckbox = $("#select_all_item").get(0);
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = allChecked;
                selectAllCheckbox.indeterminate =
                    !allChecked && allCheckboxes.filter(":checked").length > 0;
            }
            updateFooter();
        }
    );

    function updateFooter() {
        var itemCount = checkedItems.length;
        if (itemCount > 0) {
            $(".footer").show();
            $(".itemz h4").text(itemCount);
        } else {
            $(".footer").hide();
            $(".itemz h4").text(0);
        }
    }

    $("#batch_save_btn").on("click", function (e) {
        e.preventDefault();
        const formElement = document.getElementById("batch_form");
        const formData = new FormData(formElement);
        const selectedItems = checkedItems;
        const selectedIds = selectedItems.map(
            (item) => item.preAuthorizationRequestId
        );
        const clientIds = selectedItems.map((item) => item.clientId);
        const insurancePayerIds = selectedItems.map(
            (item) => item.insurancePayerId
        );
        const uniqueInsurancePayers = [...new Set(insurancePayerIds)];
        if (uniqueInsurancePayers.length > 1) {
            Swal.fire({
                icon: "error",
                text: "Only claims with the same Insurance Payer can be in one batch.",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
                buttonsStyling: false,
            });
            return; 
        }
        selectedItems.forEach((item, index) => {
            formData.append(
                `items[${index}][preAuthorizationRequestId]`,
                item.preAuthorizationRequestId
            );
            formData.append(`items[${index}][clientId]`, item.clientId);
            formData.append(
                `items[${index}][insurancePayerId]`,
                item.insurancePayerId
            );
        });

        selectedIds.forEach((id) => formData.append("preAuthorizationRequestIds[]", id));
        clientIds.forEach((id) => formData.append("clientIds[]", id));
        insurancePayerIds.forEach((id) =>
            formData.append("insurancePayerIds[]", id)
        );
        $.ajax({
            url: BASE_URL + "/set-batch",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    text: "Batch processed successfully.",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                    buttonsStyling: false,
                }).then(() => {
                    $("#batchModal").modal("hide");
                    claimManagementTable.ajax.reload();
                    checkedItems = [];
                    updateFooter();
                });
            },
            error: function (xhr) {
                $(".error-text").text("");
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    console.error("Error:", xhr);
                }
            },
        });
    });

    $("#batch_btn").on("click", function () {
        $(".error-text").text("");
        $("#batch_form")[0].reset();
        $("#batchModal").modal("show");
    });
});
