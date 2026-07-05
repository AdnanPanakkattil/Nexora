$(document).ready(function () {
    let selectedCompanyId = null;
    let selectedTpaId = null;

    $("#insurance_main_menu").addClass("active open menu-item-animating");
    $("#policy_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    flatpickr("#policyIssueDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    flatpickr("#policyExpiryDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });

    $("#policyModalBtn").click(function (e) {
        e.preventDefault();
        $("#policy_header").text("Add Policy");
        $("#policy_btn").text("Save");
        $("#policy_form")[0].reset();
        $("#policyId").val("");
        $("#clinicId").val("").trigger("change");
        $("#insuranceCompanyId")
            .empty()
            .append('<option value="">Select Insurance Payer</option>');
        $("#insuranceTpaCompanyId")
            .empty()
            .append('<option value="">Select Insurance TPA Company</option>');
        $("#policyStatus").val("active").trigger("change");
        $("#insuranceTpaCompanyIdDiv").hide();
        selectedCompanyId = null;
        selectedTpaId = null;
        $("#policyModal").modal("show");
    });

    $("#policyModal").on("hidden.bs.modal", function () {
        $("#policy_form")[0].reset();
        $("#clinicId").val("").trigger("change");
        $("#insuranceCompanyId")
            .empty()
            .append('<option value="">Select Insurance Payer</option>');
        $("#insuranceTpaCompanyId")
            .empty()
            .append('<option value="">Select Insurance TPA Company</option>');
        $("#policyStatus").val("active").trigger("change");
        $("#insuranceTpaCompanyIdDiv").hide();
        $(".error-text").text("");
        selectedCompanyId = null;
        selectedTpaId = null;
    });

    var policyTable = $("#policy_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/policy",
            data: function (d) {
                d.filterBranchId = $("#filterBranchId").val();
            },
        },
        columns: [
            { data: "policyId", name: "policyId" },
            { data: "branchName", name: "branchName" },
            { data: "insurancePayerName", name: "insurancePayerName" },
            { data: "policyNumber", name: "policyNumber" },
            { data: "policyName", name: "policyName" },
            { data: "policyIssueDate", name: "policyIssueDate" },
            { data: "policyExpiryDate", name: "policyExpiryDate" },
            { data: "policyStatus", name: "policyStatus" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl = BASE_URL + "/edit-policy/" + full.policyId;
                    var deleteUrl =
                        BASE_URL + "/delete-policy/" + full.policyId;
                    var classUrl =
                        BASE_URL + "/assigned-classes/" + full.policyId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="javascript:;" class="dropdown-item policy-edit" data-id="' +
                        editUrl +
                        '">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="' +
                        classUrl +
                        '" class="dropdown-item">Classes</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger policy-delete" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    $("#filterBranchId").on("change", function () {
        policyTable.ajax.reload();
    });

    $("#policy_btn").click(function (e) {
        e.preventDefault();
        let policyId = $("#policyId").val();
        let formData = $("#policy_form").serialize();
        let url = policyId
            ? BASE_URL + "/update-policy/" + policyId
            : BASE_URL + "/store-policy";
        let method = policyId ? "PUT" : "POST";
        $("#loader-overlay").show();
        $.ajax({
            url: url,
            type: method,
            data: formData,
            success: function (res) {
                $("#loader-overlay").hide();
                if (res.status) {
                    policyTable.ajax.reload(null, false);
                    Swal.fire({
                        icon: "success",
                        text: res.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    $("#policyModal").modal("hide");
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    $(".error-text").text("");
                    $.each(xhr.responseJSON.errors, function (key, val) {
                        $("." + key + "_error").text(val[0]);
                    });
                }
            },
        });
    });

    $("#policy_table").on("click", ".policy-edit", function () {
        $.get($(this).data("id"), function (res) {
            if (!res.status) return;
            let data = res.data;
            $("#policy_header").text("Update Policy");
            $("#policy_btn").text("Update");
            $("#policyId").val(data.policyId);
            $("#policyNumber").val(data.policyNumber);
            $("#policyName").val(data.policyName);
            $("#policyIssueDate").val(data.policyIssueDate);
            $("#policyExpiryDate").val(data.policyExpiryDate);
            $("#policyStatus").val(data.policyStatus).trigger("change");
            selectedCompanyId = data.insuranceCompanyId;
            selectedTpaId = data.insuranceTpaCompanyId;
            $("#clinicId").val(data.clinicId).trigger("change");
            $("#policyModal").modal("show");
        });
    });

    $("#clinicId").on("change", function () {
        let clinicId = $(this).val();
        $("#insuranceCompanyId")
            .empty()
            .append('<option value="">Select Insurance Payer</option>');
        $("#insuranceTpaCompanyId")
            .empty()
            .append('<option value="">Select Insurance TPA Company</option>');
        $("#insuranceTpaCompanyIdDiv").hide();
        if (!clinicId) return;
        $("#loader-overlay").show();
        $.get(BASE_URL + "/get-payers-by-clinic/" + clinicId, function (res) {
            $("#loader-overlay").hide();
            if (res.status) {
                $.each(res.data, function (i, payer) {
                    $("#insuranceCompanyId").append(
                        `<option value="${payer.id}" data-type="${payer.type}">${payer.name}</option>`,
                    );
                });

                if (selectedCompanyId) {
                    $("#insuranceCompanyId")
                        .val(selectedCompanyId)
                        .trigger("change");
                }
            }
        });
    });

    $("#insuranceCompanyId").on("change", function () {
        let type = $(this).find("option:selected").data("type");
        let companyId = $(this).val();
        $("#insuranceTpaCompanyId")
            .empty()
            .append('<option value="">Select Insurance TPA Company</option>');
        if (type === "TPA_company") {
            $("#payerType").val("tpa").trigger("change");
            $("#insuranceTpaCompanyIdDiv").show();
            if (!companyId) return;
            $("#loader-overlay").show();
            $.get(
                BASE_URL + "/get-tpa-companies-by-company/" + companyId,
                function (res) {
                    $("#loader-overlay").hide();
                    if (res.status) {
                        $.each(res.data, function (id, name) {
                            $("#insuranceTpaCompanyId").append(
                                `<option value="${id}">${name}</option>`,
                            );
                        });
                        if (selectedTpaId) {
                            $("#insuranceTpaCompanyId")
                                .val(selectedTpaId)
                                .trigger("change");
                            selectedTpaId = null;
                        }
                    }
                },
            );
        } else {
            $("#payerType").val("non-tpa").trigger("change");
            $("#insuranceTpaCompanyIdDiv").hide();
        }
    });

    $("#policy_table").on("click", ".policy-delete", function () {
        var deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this policy?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton:
                    "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.isConfirmed) {
                $("#loader-overlay").show();
                $.ajax({
                    url: deleteUrl,
                    type: "DELETE",
                    success: function (response) {
                        $("#loader-overlay").hide();
                        if (response.status === true) {
                            policyTable.ajax.reload(null, false);
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton:
                                        "btn btn-success waves-effect waves-light",
                                },
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
                    error: function (xhr) {
                        $("#loader-overlay").hide();
                        var errorMessage =
                            xhr.responseJSON && xhr.responseJSON.message
                                ? xhr.responseJSON.message
                                : "An unexpected error occurred. Please try again.";
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: errorMessage,
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                        });
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Policy deletion cancelled",
                    icon: "info",
                    customClass: {
                        confirmButton:
                            "btn btn-secondary waves-effect waves-light",
                    },
                });
            }
        });
    });
});

$("#policyName").on("input", function () {
    this.value = this.value.replace(/[^a-zA-Z ]/g, "");
});
