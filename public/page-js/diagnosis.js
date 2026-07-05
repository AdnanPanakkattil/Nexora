$(function () {
    $("#settings_main_menu").addClass("active open menu-item-animating");
    $("#diagnosis_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var diagnosisTable = $("#diagnosis_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/diagnosis",
        },
        columns: [
            { data: "diagnosisListId", name: "diagnosisListId" },
            { data: "diagnosisCode", name: "diagnosisCode" },
            { data: "diagnosisName_en", name: "diagnosisName_en" },
            { data: "diagnosisName_ar", name: "diagnosisName_ar" },
            { data: "actions", name: "actions", orderable: false, searchable: false },
        ],
    });

    function resetDiagnosisForm() {
        $("#addDiagnosisForm")[0].reset();
        $(".error-text").text("");
        $("#diagnosis_id").val("");
    }

    // Add New
    $("#addNewDiagnosisBtn").on("click", function () {
        resetDiagnosisForm();
        $("#addDiagnosisForm").find("input, textarea, select").prop("disabled", false);
        $("#diagnosis_modal_header").text("Add Diagnosis");
        $("#diagnosis_modal_footer").show();
        $("#addDiagnosisModal").modal("show");
    });

    // Save 
    $("#DiagnosisSaveBtn").on("click", function (e) {
        e.preventDefault();

        var diagnosisId = $("#diagnosis_id").val();
        var formData = {
            diagnosisName_en: $("#diagnosisName_en").val(),
            diagnosisName_ar: $("#diagnosisName_ar").val(),
            diagnosisCode: $("#diagnosisCode").val(),
        };
        var url = diagnosisId
            ? BASE_URL + "/update-diagnosis/" + diagnosisId
            : BASE_URL + "/diagnosis";
        var method = diagnosisId ? "PUT" : "POST";

         $("#loader-overlay").show();
        $.ajax({
            type: method,
            url: url,
            data: formData,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.success) {
                    $("#addDiagnosisModal").modal("hide");
                    diagnosisTable.ajax.reload(null, false);
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: {
                            confirmButton: "btn btn-success waves-effect waves-light",
                        },
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: "Failed",
                        customClass: {
                            confirmButton: "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    $(".error-text").text("");
                    let errors = xhr.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    Swal.fire("Error!", "An unexpected error occurred.", "error");
                }
            },
        });
    });

    // Edit
    diagnosisTable.on("click", ".item-edit", function () {
        var diagnosisId = $(this).data("id");

        $("#loader-overlay").show();
        $.ajax({
            type: "GET",
            url: BASE_URL + "/edit-diagnosis/" + diagnosisId,
            success: function (response) {
                $("#loader-overlay").hide();
                resetDiagnosisForm();
                $("#addDiagnosisForm").find("input, textarea, select").prop("disabled", false);
                $("#diagnosis_modal_header").text("Edit Diagnosis");
                $("#diagnosis_modal_footer").show();
                $("#diagnosis_id").val(response.diagnosisListId);
                $("#diagnosisName_en").val(response.diagnosisName_en);
                $("#diagnosisName_ar").val(response.diagnosisName_ar);
                $("#diagnosisCode").val(response.diagnosisCode);
                $("#addDiagnosisModal").modal("show");
            },
            error: function () {
                $("#loader-overlay").hide();
                Swal.fire("Error!", "Unable to fetch diagnosis details.", "error");
            },
        });
    });

    // Details
    diagnosisTable.on("click", ".item-details", function () {
        var diagnosisId = $(this).data("id");

        $("#loader-overlay").show();
        $.ajax({
            type: "GET",
            url: BASE_URL + "/detail-diagnosis/" + diagnosisId,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    resetDiagnosisForm();
                    $("#addDiagnosisForm").find("input, textarea, select").prop("disabled", true);
                    $("#diagnosis_modal_header").text("Diagnosis Details");
                    $("#diagnosis_modal_footer").hide();
                    $("#diagnosis_id").val(response.data.diagnosisListId);
                    $("#diagnosisName_en").val(response.data.diagnosisName_en);
                    $("#diagnosisName_ar").val(response.data.diagnosisName_ar);
                    $("#diagnosisCode").val(response.data.diagnosisCode);
                    $("#addDiagnosisModal").modal("show");
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
    diagnosisTable.on("click", ".item-delete", function () {
        var diagnosisId = $(this).data("id");

        Swal.fire({
            title: "Are you sure?",
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
                    url: BASE_URL + "/delete-diagnosis/" + diagnosisId,
                    success: function (response) {
                            $("#loader-overlay").hide();
                        if (response.success) {
                            diagnosisTable.ajax.reload(null, false);
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton: "btn btn-success waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function (err) {
                            $("#loader-overlay").hide();
                        console.error("Error deleting diagnosis:", err);
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Diagnosis deletion cancelled.",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });

    // Close Button
    document.getElementById("closebtn").addEventListener("click", function () {
        $("#addDiagnosisModal").modal("hide");
    });

    // Reset on modal hide
    $("#addDiagnosisModal").on("hidden.bs.modal", function () {
        resetDiagnosisForm();
    });

    // Select2 for diagnosis search (kept from original)
    $("#diagnosis").select2({
        placeholder: "Search Diagnosis Code / Description",
        allowClear: true,
        ajax: {
            url: BASE_URL + "/medicalrecords-get-diagnosis-search-options",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return { diagnosisName: params.term };
            },
            processResults: function (data) {
                return {
                    results: $.map(data.data, function (value) {
                        return {
                            id: value.diagnosisListId,
                            text: value.diagnosisName_en,
                            code: value.diagnosisCode,
                        };
                    }),
                };
            },
            cache: true,
        },
    });

    $(document).on("select2:select", "#diagnosis", function (e) {
        var data = e.params.data;
        $(this).find("option:selected").data("code", data.code);
        $(this).find("option:selected").attr("data-code", data.code);
    });
    
    $(document).on("click", "#addDiagnosis", function () {
        var diagnosisDate = $("#diagnosisDate").val();
        var diagnosisType = $("#diagnosisType").val();
        var diagnosisOnAdm = $("#diagnosisOnAdmission").val();
        var conditionOnset = $("#conditionOnset").val();
        var selectedOption = $("#diagnosis option:selected");
        var diagnosisListId = selectedOption.val();
        var diagnosisName = selectedOption.text().trim();
        var diagnosisCode = selectedOption.attr("data-code") || selectedOption.data("code") || "";

        if (!diagnosisListId || diagnosisListId === "" || diagnosisName === "") {
            alert("Please select a diagnosis first.");
            return;
        }

        var newRow = `
            <tr>
                <td>
                    ${diagnosisDate}
                    <input type="hidden" name="diagnosisIdTd[]" class="diagnosisIdTd" value="${diagnosisListId}">
                    <input type="hidden" name="diagnosisOnAdmissionTd[]" class="diagnosisOnAdmissionTd" value="${diagnosisOnAdm}">
                    <input type="hidden" name="conditionOnsetTd[]" class="conditionOnsetTd" value="${conditionOnset}">
                    <input type="hidden" name="diagnosisDateTd[]" class="diagnosisDateTd" value="${diagnosisDate}">
                    <input type="hidden" name="diagnosisTypeTd[]" class="diagnosisTypeTd" value="${diagnosisType}">
                </td>
                <td>${diagnosisType}</td>
                <td>${diagnosisOnAdm}</td>
                <td>${conditionOnset}</td>
                <td>${diagnosisCode}</td>
                <td>${diagnosisName}</td>
                <td>
                    <button type="button" class="btn btn-outline-danger btn-sm remove-diagnosis-row">
                        <i class="ti ti-trash"></i>
                    </button>
                </td>
            </tr>`;

        $("#pre_auth_diagnosis_table_head").show();
        $("#pre_auth_diagnosis_table_body").append(newRow);
        if (typeof syncDiagnosisFromTable === "function") syncDiagnosisFromTable();
        $("#diagnosis").val(null).trigger("change");
        $("#diagnosisDate").val("");
        $("#diagnosisType").val(null).trigger("change");
        $("#diagnosisOnAdmission").val(null).trigger("change");
        $("#conditionOnset").val(null).trigger("change");
    });
    $(document).on("click", ".remove-diagnosis-row", function () {
        $(this).closest("tr").remove();
        if (typeof syncDiagnosisFromTable === "function") syncDiagnosisFromTable();
    });
});

$('#diagnosisName_en').on('input', function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#diagnosisName_ar').on('input', function () {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});