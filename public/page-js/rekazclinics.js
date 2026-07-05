$(document).ready(function () {
    $("#rekaz_main_menu").addClass("active open menu-item-animating");
    $("#branch_rekaz_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#rekazReferenceId").select2({
        dropdownParent: $("#rekazClinicsModal"),
        placeholder: "Select Rekaz Reference",
        allowClear: true,
        ajax: {
            url: BASE_URL + "/get-rekaz-clinics-list",
            dataType: "json",
            delay: 250,

            beforeSend: function () {
                $("#loader-overlay").show();
            },

            data: function (params) {
                return {
                    q: params.term,
                    page: params.page || 1,
                };
            },

            processResults: function (data, params) {
                console.log("Select2 Response:", data);

                params.page = params.page || 1;

                return {
                    results: data.results,
                    pagination: {
                        more: data.pagination?.more || false,
                    },
                };
            },

            complete: function () {
                $("#loader-overlay").hide();
            },

            error: function (xhr) {
                $("#loader-overlay").hide();
                console.log(xhr.responseText);
            },

            cache: true,
        },
    });

    $("#addNewRekazClinicsBtn").click(function () {
        $("#rekazClinicsModal").modal("show");
        $("#rekaz_clinics_header").text("Add New Rekaz Clinics");
        enableForm();
        $("#createRekazClinicsBtn").text("Save");
        $("#rekaz_clinics_form")[0].reset();
        $("#clinics").val("").trigger("change");
        $("#rekazReferenceId").val(null).trigger("change");
        clearErrors();
        $("#clinicId").val("");
    });

    $("#rekazClinicsModal").on("hidden.bs.modal", function () {
        enableForm();
        $("#createRekazClinicsBtn").text("Save");
    });

    var rekazClinicsTable = $("#rekaz_clinics_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/rekaz-clinics",
        columns: [
            {
                data: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_all_rekaz_clinics" value="' +
                        full.clinicId +
                        '">'
                    );
                },
            },
            {
                data: "clinicId",
                name: "clinicId",
            },
            {
                data: "clinicName",
                name: "clinicName",
            },
            {
                data: "rekazReferenceId",
                name: "rekazReferenceId",
            },
            {
                data: "rekazReferenceName",
                name: "rekazReferenceName",
            },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var viewUrl =
                        BASE_URL + "/view-rekaz-clinics/" + full.clinicId;
                    // var editUrl =
                    //     BASE_URL + "/edit-rekaz-clinics/" + full.clinicId;
                    var deleteUrl =
                        BASE_URL + "/delete-rekaz-clinics/" + full.clinicId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="javascript:;" class="dropdown-item rekaz-clinics-view" data-id="' +
                        viewUrl +
                        '">View</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        // '<li><a href="javascript:;" class="dropdown-item rekaz-clinics-edit" data-id="' +
                        // editUrl +
                        // '">Edit</a></li>' +
                        // '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger rekaz-clinics-delete" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    $("#createRekazClinicsBtn").click(function () {
        clearErrors();
        var clinicId = $("#clinicId").val();
        var formData = $("#rekaz_clinics_form").serialize();
        var ajaxUrl = clinicId
            ? BASE_URL + "/update-rekaz-clinics/" + clinicId
            : BASE_URL + "/rekaz-clinics";
        var method = clinicId ? "PUT" : "POST";
        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    rekazClinicsTable.ajax.reload(null, false);
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    $("#rekazClinicsModal").modal("hide");
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    displayErrors(xhr.responseJSON.errors);
                } else {
                    $("#rekazClinicsModal").modal("hide");
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
                    });
                }
            },
        });
    });

    function clearErrors() {
        $(".error-text").text("");
        $(".form-control").removeClass("is-invalid");
    }

    function displayErrors(errors) {
        if (errors.clinics) {
            $(".clinics_error").text(errors.clinics[0]);
        }
        if (errors.rekazReferenceId) {
            $(".rekazReferenceId_error").text(errors.rekazReferenceId[0]);
        }
    }

    function displayValidationErrors(errors) {
        for (let field in errors) {
            if (errors.hasOwnProperty(field)) {
                let errorMessage = errors[field];
                let inputField = $("#" + field);
                inputField.next(".invalid-feedback").remove();
                let errorDiv = $("<div>")
                    .addClass("invalid-feedback")
                    .text(errorMessage);
                inputField.after(errorDiv);
            }
        }
    }

    $("#rekaz_clinics_form input").on("input", function () {
        var inputField = $(this);
        inputField.removeClass("is-invalid");
        inputField.next(".invalid-feedback").remove();
    });

    $("#rekaz_clinics_form select").on("change", function () {
        var selectField = $(this);
        selectField.removeClass("is-invalid");
        selectField.next(".invalid-feedback").remove();
    });

    $("#rekaz_clinics_table").on("click", ".rekaz-clinics-view", function () {
        var viewUrl = $(this).data("id");
        $("#loader-overlay").show();
        $.ajax({
            url: viewUrl,
            method: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#rekazClinicsModal").modal("show");
                    $("#rekaz_clinics_header").text("View Rekaz Clinic");
                    disableForm();
                    $("#clinics")
                        .val(response.data.clinicId)
                        .trigger("change");
                    if (response.data.rekazReferenceId) {
                        var displayText =
                            response.data.rekazReferenceName ||
                            response.data.rekazReferenceId;
                        var rekazOption = new Option(
                            displayText,
                            response.data.rekazReferenceId,
                            true,
                            true,
                        );
                        $("#rekazReferenceId")
                            .append(rekazOption)
                            .trigger("change");
                    } else {
                        $("#rekazReferenceId").val(null).trigger("change");
                    }
                    clearErrors();
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                $("#rekazClinicsModal").modal("hide");
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
                });
            },
        });
    });

    $("#rekaz_clinics_table").on("click", ".rekaz-clinics-delete", function () {
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
                            rekazClinicsTable.ajax.reload(null, false);
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton: "btn btn-success",
                                },
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                text: response.message,
                                customClass: {
                                    confirmButton: "btn btn-danger",
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
                            title: "Access denied",
                            text: errorMessage,
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                        });
                    },
                });
            }
        });
    });
});

function enableForm() {
    $("#rekazClinicsModal").find("input, textarea").prop("readonly", false);
    $("#rekazClinicsModal").find("select").prop("disabled", false);
    $("#createRekazClinicsBtnDiv").show();
}

function disableForm() {
    $("#rekazClinicsModal").find("input, textarea").prop("readonly", true);
    $("#rekazClinicsModal").find("select").prop("disabled", true);
    $("#createRekazClinicsBtnDiv").hide();
}
