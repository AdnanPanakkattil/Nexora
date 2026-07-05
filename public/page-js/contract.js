$(function () {
    $("#settings_main_menu").addClass("active open menu-item-animating");
    $("#contract_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var contractTable = $("#contract_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/contract",
        },
        columns: [
            { data: "contractId", name: "contractId" },
            { data: "contractName_en", name: "contractName_en" },
            { data: "contractName_ar", name: "contractName_ar" },
            { data: "clinicServicesGroupId", name: "clinicServicesGroupId" },
            { data: "actions", name: "actions", orderable: false, searchable: false },
        ],
    });

    function resetContractForm() {
        $("#addContractForm")[0].reset();
        $(".error-text").text("");
        $("#contract_id").val("");
        $("#contractName_en").val("");
        $("#contractName_ar").val("");
        $("#type").val("0").trigger("change");
    }

    $("#addNewContractBtn").on("click", function () {
        resetContractForm();
        $("#addContractForm").find("input, textarea, select").prop("disabled", false);
        $("#contract_modal_header").text("Add Contract");
        $("#contract_modal_footer").show();
        $("#addContractModal").modal("show");
    });

    // Save / Update
    $("#ContractSaveBtn").on("click", function () {
        let contractId = $("#contract_id").val();
        let url = contractId
            ? BASE_URL + "/update-contract/" + contractId
            : BASE_URL + "/contract";
        let method = contractId ? "PUT" : "POST";
        let formData = {
            contractName_en: $("#contractName_en").val(),
            contractName_ar: $("#contractName_ar").val(),
            type: $("#type").val(),
        };

        $("#loader-overlay").show();
        $.ajax({
            url: url,
            method: method,
            data: formData,
            success: function (response) {
                $("#loader-overlay").hide();
                $("#addContractModal").modal("hide");
                contractTable.ajax.reload(null, false);
                Swal.fire({
                    icon: "success",
                    text: response.success,
                    customClass: {
                        confirmButton: "btn btn-success waves-effect waves-light",
                    },
                });
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    let errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $(`.${key}_error`).text(value[0]);
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: "Failed to save the contract. An unexpected error occurred.",
                        customClass: {
                            confirmButton: "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
        });
    });

    // Edit
    contractTable.on("click", ".item-edit", function () {
        let contractId = $(this).data("id");

        $("#loader-overlay").show();
        $.ajax({
            type: "GET",
            url: BASE_URL + "/edit-contract/" + contractId,
            success: function (data) {
                $("#loader-overlay").hide();
                resetContractForm();
                $("#addContractForm").find("input, textarea, select").prop("disabled", false);
                $("#contract_modal_header").text("Edit Contract");
                $("#contract_modal_footer").show();
                $("#contract_id").val(data.contractId);
                $("#contractName_en").val(data.contractName_en);
                $("#contractName_ar").val(data.contractName_ar);
                $("#type").val(data.clinicServicesGroupId).trigger("change");
                $("#addContractModal").modal("show");
            },
            error: function () {
                $("#loader-overlay").hide();
                Swal.fire("Error!", "Unable to fetch contract details.", "error");
            },
        });
    });

    // Details
    contractTable.on("click", ".item-details", function () {
        let contractId = $(this).data("id");

        $("#loader-overlay").show();
        $.ajax({
            type: "GET",
            url: BASE_URL + "/detail-contract/" + contractId,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    resetContractForm();
                    $("#addContractForm").find("input, textarea, select").prop("disabled", true);
                    $("#contract_modal_header").text("Contract Details");
                    $("#contract_modal_footer").hide();
                    $("#contract_id").val(response.data.contractId);
                    $("#contractName_en").val(response.data.contractName_en);
                    $("#contractName_ar").val(response.data.contractName_ar);
                    $("#type").val(response.data.clinicServicesGroupId).trigger("change");
                    $("#addContractModal").modal("show");
                }
            },
            error: function (err) {
                $("#loader-overlay").hide();
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.responseJSON?.message ?? "An unexpected error occurred.",
                    customClass: {
                        confirmButton: "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });

    // Delete
    contractTable.on("click", ".item-delete", function () {
        let contractUrl = $(this).data("id");

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton: "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                $("#loader-overlay").show();
                $.ajax({
                    type: "DELETE",
                    url: contractUrl,
                    success: function () {
                        $("#loader-overlay").hide();
                        contractTable.ajax.reload(null, false);
                        Swal.fire({
                            icon: "success",
                            text: "Contract deleted successfully!",
                            customClass: {
                                confirmButton: "btn btn-success waves-effect waves-light",
                            },
                        });
                    },
                    error: function () {
                        $("#loader-overlay").hide();
                        Swal.fire("Error!", "Unable to delete the contract.", "error");
                    },
                });
            }
        });
    });

    document.getElementById("closebtn").addEventListener("click", function () {
        $("#addContractModal").modal("hide");
    });

    $("#addContractModal").on("hidden.bs.modal", function () {
        resetContractForm();
    });
});

$('#contractName_en').on('input', function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#contractName_ar').on('input', function () {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});