$(document).ready(function () {
    $("#settings_main_menu").addClass("active open menu-item-animating");
    $("#consent_form_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

$("#addNewConsentFormBtn").click(function () {
    clearErrors();
    $("#consent_form_group_form")[0].reset();
    $("#consent_form_group_form").find("input").prop("disabled", false);
    $("#consent_form_id").val("");
    $("#consent_form_btn").text("Save").show();
    $("#consentFormCloseBtn").show();
    $("#consent_form_type").selectpicker("destroy");
    $("#consent_form_type").prop("disabled", false).val("").selectpicker();

    $("#consentFormModal").modal("show");
});

    // Close button
    $("#consentFormCloseBtn").click(function () {
        $("#consentFormModal").modal("hide");
    });

    // Reset on modal hide
   $("#consentFormModal").on("hidden.bs.modal", function () {
    clearErrors();
    $("#consent_form_group_form")[0].reset();
    $("#consent_form_group_form").find("input").prop("disabled", false);
    $("#consent_form_type").selectpicker("destroy");
    $("#consent_form_type").prop("disabled", false).val("").selectpicker();
    $("#consent_form_btn").show();
});

    let checkedConsentForms = [];

    var consentFormTable = $("#consent_form_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/consent-form",
        columns: [
            {
                data: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_all_consent_form" value="' + full.consentId + '">';
                },
            },
            { data: "consentId", name: "consentId" },
            { data: "consentNameEn", name: "consentNameEn" },
            { data: "consentNameAr", name: "consentNameAr" },
            { data: "consentType", name: "consentType" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var detailsUrl = BASE_URL + "/details-consent-form/" + full.consentId;
                    var editUrl = BASE_URL + "/edit-consent-form/" + full.consentId;
                    var deleteUrl = BASE_URL + "/delete-consent-form/" + full.consentId;
                    var buildUrl = BASE_URL + "/build-consent-form/" + full.consentId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="javascript:;" class="dropdown-item text-info consent-form-build" data-id="' + buildUrl + '">Build</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-primary consent-form-details" data-id="' + detailsUrl + '">Details</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item consent-form-edit" data-id="' + editUrl + '">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger consent-form-delete" data-id="' + deleteUrl + '">Delete</a></li>' +
                        '</ul>' +
                        '</div>'
                    );
                },
            },
        ],
        drawCallback: function () {
            var rows = consentFormTable.rows({ page: "current" }).nodes();
            $('input[type="checkbox"]', rows).each(function () {
                if (checkedConsentForms.includes(this.value)) {
                    $(this).prop("checked", true);
                }
            });
            updateFooter();
        },
    });

    $("#consent_form_table").on("click", ".consent-form-build", function () {
        window.location.href = $(this).data("id");
    });

    $("#select_all_consent_form").on("click", function () {
        var rows = consentFormTable.rows({ page: "current" }).nodes();
        var isChecked = this.checked;
        $('input[type="checkbox"]', rows).each(function () {
            $(this).prop("checked", isChecked);
            var consentId = this.value;
            if (isChecked) {
                if (!checkedConsentForms.includes(consentId)) checkedConsentForms.push(consentId);
            } else {
                checkedConsentForms = checkedConsentForms.filter((id) => id !== consentId);
            }
        });
        updateFooter();
    });

    $("#consent_form_table tbody").on("change", 'input[type="checkbox"]', function () {
        var consentId = this.value;
        if (this.checked) {
            if (!checkedConsentForms.includes(consentId)) checkedConsentForms.push(consentId);
        } else {
            checkedConsentForms = checkedConsentForms.filter((id) => id !== consentId);
        }
        var allCheckboxes = $('input[type="checkbox"]', consentFormTable.rows({ page: "current" }).nodes());
        var allChecked = allCheckboxes.length === allCheckboxes.filter(":checked").length;
        var selectAllCheckbox = $("#select_all_consent_form").get(0);
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = allChecked;
            selectAllCheckbox.indeterminate = !allChecked && allCheckboxes.filter(":checked").length > 0;
        }
        updateFooter();
    });

    function updateFooter() {
        var footer = $(".footer");
        var count = checkedConsentForms.length;
        if (count > 0) {
            footer.show();
            $(".itemz h4").text(count);
        } else {
            footer.hide();
        }
    }
    $(".footer").hide();

    $("#deleteSelectedConsentForms").on("click", function (e) {
        e.preventDefault();
        if (checkedConsentForms.length === 0) {
            Swal.fire("No consent forms selected", "Please select at least one consent form to delete.", "warning");
            return;
        }
        Swal.fire({
            title: "Are you sure?",
            text: "This action will mark the selected consent forms as deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
                cancelButton: "btn btn-danger waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: BASE_URL + "/delete-selected-consent-form",
                    method: "POST",
                    data: {
                        _token: $('meta[name="csrf-token"]').attr("content"),
                        consentIds: checkedConsentForms,
                    },
                    success: function (response) {
                        if (response.success) {
                            Swal.fire({ icon: "success", text: response.message, customClass: { confirmButton: "btn btn-success" } });
                            consentFormTable.ajax.reload();
                            checkedConsentForms = [];
                            updateFooter();
                        } else {
                            Swal.fire("Error!", response.message, "error");
                        }
                    },
                    error: function () {
                        Swal.fire("Error!", "Something went wrong. Please try again.", "error");
                    },
                });
            }
        });
    });

    // Save 
    $("#consent_form_btn").click(function () {
        clearErrors();

        var consentFormId = $("#consent_form_id").val();
        var nameEn = $("#consent_form_name_en").val().trim();
        var nameAr = $("#consent_form_name_ar").val().trim();
        var type = $("#consent_form_type").val();

        var errors = {};
        if (!nameEn) errors.consent_form_name_en = "Consent Form Name English is required.";
        if (!nameAr) errors.consent_form_name_ar = "Consent Form Name Arabic is required.";
        if (!type) errors.consent_form_type = "Consent Form Type is required.";

        if (Object.keys(errors).length > 0) {
            displayValidationErrors(errors);
            return;
        }

        var ajaxUrl = consentFormId ? BASE_URL + "/update-consent-form/" + consentFormId : BASE_URL + "/consent-form";
        var method = consentFormId ? "PUT" : "POST";

        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: $("#consent_form_group_form").serialize(),
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    consentFormTable.ajax.reload(null, false);
                    Swal.fire({ icon: "success", text: response.message, customClass: { confirmButton: "btn btn-success" } });
                    $("#consentFormModal").modal("hide");
                } else {
                    Swal.fire({ icon: "error", text: response.message, customClass: { confirmButton: "btn btn-danger" } });
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    displayErrors(xhr.responseJSON.errors);
                } else {
                    Swal.fire({ icon: "error", text: "An unexpected error occurred.", customClass: { confirmButton: "btn btn-danger" } });
                }
            },
        });
    });

    // Details
$("#consent_form_table").on("click", ".consent-form-details", function () {
    var detailsUrl = $(this).data("id");

     $("#loader-overlay").show();
    $.ajax({
        url: detailsUrl,
        method: "GET",
        success: function (response) {
             $("#loader-overlay").hide();
            if (response.status === true) {
                clearErrors();
                $("#consent_form_group_form")[0].reset();
                $("#consent_form_name_en").val(response.data.consentNameEn).prop("disabled", true);
                $("#consent_form_name_ar").val(response.data.consentNameAr).prop("disabled", true);
                $("#consent_form_id").val(response.data.consentId);
                $("#consent_form_type").selectpicker("destroy");
                $("#consent_form_type").prop("disabled", true).val(response.data.consentType).selectpicker();

                $("#consent_form_btn").hide();
                $("#consentFormCloseBtn").show();
                $("#consentFormModal").modal("show");
            } else {
                Swal.fire({ icon: "error", text: response.message, customClass: { confirmButton: "btn btn-danger" } });
            }
        },
        error: function () {
             $("#loader-overlay").hide();
            Swal.fire({ icon: "error", text: "Failed to fetch Consent Form data.", customClass: { confirmButton: "btn btn-danger" } });
        },
    });
});

    // Edit
   $("#consent_form_table").on("click", ".consent-form-edit", function () {
    var editUrl = $(this).data("id");
     $("#loader-overlay").show();
    $.ajax({
        url: editUrl,
        method: "GET",
        success: function (response) {
             $("#loader-overlay").hide();
            if (response.status === true) {
                clearErrors();
                $("#consent_form_group_form")[0].reset();
                $("#consent_form_group_form").find("input").prop("disabled", false);
                $("#consent_form_id").val(response.data.consentId);
                $("#consent_form_name_en").val(response.data.consentNameEn);
                $("#consent_form_name_ar").val(response.data.consentNameAr);
                $("#consent_form_type").selectpicker("destroy");
                $("#consent_form_type").prop("disabled", false).val(response.data.consentType).selectpicker();

                $("#consent_form_btn").text("Update").show();
                $("#consentFormCloseBtn").show();
                $("#consentFormModal").modal("show");
            } else {
                Swal.fire({ icon: "error", text: response.message, customClass: { confirmButton: "btn btn-danger" } });
            }
        },
        error: function () {
             $("#loader-overlay").hide();
            Swal.fire({ icon: "error", text: "Failed to fetch Consent Form data.", customClass: { confirmButton: "btn btn-danger" } });
        },
    });
});
    // Delete
    $("#consent_form_table").on("click", ".consent-form-delete", function () {
        var deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
                cancelButton: "btn btn-danger waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.isConfirmed) {
                 $("#loader-overlay").show();
                $.ajax({
                    url: deleteUrl,
                    method: "DELETE",
                    success: function (response) {
                         $("#loader-overlay").hide();
                        if (response.status === true) {
                            consentFormTable.ajax.reload(null, false);
                            Swal.fire({ icon: "success", text: response.message, customClass: { confirmButton: "btn btn-success" } });
                        } else {
                            Swal.fire({ icon: "error", text: response.message, customClass: { confirmButton: "btn btn-danger" } });
                        }
                    },
                    error: function () {
                         $("#loader-overlay").hide();
                        Swal.fire({ icon: "error", text: "Failed to delete consent form.", customClass: { confirmButton: "btn btn-danger" } });
                    },
                });
            }
        });
    });

    function clearErrors() {
        $(".error-text").text("");
    }

    function displayErrors(errors) {
        if (errors.consent_form_name_en) $(".consent_form_name_en_error").text(errors.consent_form_name_en[0]);
        if (errors.consent_form_name_ar) $(".consent_form_name_ar_error").text(errors.consent_form_name_ar[0]);
        if (errors.consent_form_type) $(".consent_form_type_error").text(errors.consent_form_type[0]);
    }

    function displayValidationErrors(errors) {
        if (errors.consent_form_name_en) $(".consent_form_name_en_error").text(errors.consent_form_name_en);
        if (errors.consent_form_name_ar) $(".consent_form_name_ar_error").text(errors.consent_form_name_ar);
        if (errors.consent_form_type) $(".consent_form_type_error").text(errors.consent_form_type);
    }

    // Clear error on input
    $("#consent_form_group_form input").on("input", function () {
        var field = $(this).attr("name") + "_error";
        $("." + field).text("");
    });

    $("#consent_form_group_form select").on("change", function () {
        var field = $(this).attr("name") + "_error";
        $("." + field).text("");
    });
});

$('#consent_form_name_en').on('input', function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#consent_form_name_ar').on('input', function () {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});