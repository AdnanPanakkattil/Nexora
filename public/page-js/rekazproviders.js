$(document).ready(function () {
    $("#rekaz_main_menu").addClass("active open menu-item-animating");
    $("#provider_rekaz_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#rekazReferenceId").select2({
        dropdownParent: $("#rekazProvidersModal"),
        placeholder: "Select Rekaz Reference",
        allowClear: true,
        ajax: {
            url: BASE_URL + "/get-rekaz-providers-list",
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

    $("#addNewRekazProvidersBtn").click(function () {
        $("#rekazProvidersModal").modal("show");
        $("#rekaz_providers_header").text("Add New Rekaz Providers");
        enableForm();
        $("#createRekazProvidersBtn").text("Save");
        $("#rekaz_providers_form")[0].reset();
        $("#employees").val("").trigger("change");
        $("#rekazReferenceId").val(null).trigger("change");
        clearErrors();
        $("#employeeId").val("");
    });

    $("#rekazProvidersModal").on("hidden.bs.modal", function () {
        enableForm();
        $("#createRekazProvidersBtn").text("Save");
    });

    var rekazProvidersTable = $("#rekaz_providers_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/rekaz-providers",
        columns: [
            {
                data: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_all_rekaz_providers" value="' +
                        full.employeeId +
                        '">'
                    );
                },
            },
            {
                data: "employeeId",
                name: "employeeId",
            },
            {
                data: "providerName",
                name: "providerName",
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
                        BASE_URL + "/view-rekaz-providers/" + full.employeeId;
                    // var editUrl =
                    //     BASE_URL + "/edit-rekaz-providers/" + full.employeeId;
                    var deleteUrl =
                        BASE_URL + "/delete-rekaz-providers/" + full.employeeId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="javascript:;" class="dropdown-item rekaz-providers-view" data-id="' +
                        viewUrl +
                        '">View</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        // '<li><a href="javascript:;" class="dropdown-item rekaz-providers-edit" data-id="' +
                        // editUrl +
                        // '">Edit</a></li>' +
                        // '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger rekaz-providers-delete" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    $("#createRekazProvidersBtn").click(function () {
        clearErrors();
        var employeeId = $("#employeeId").val();
        var formData = $("#rekaz_providers_form").serialize();
        var ajaxUrl = employeeId
            ? BASE_URL + "/update-rekaz-providers/" + employeeId
            : BASE_URL + "/rekaz-providers";
        var method = employeeId ? "PUT" : "POST";
        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    rekazProvidersTable.ajax.reload(null, false);
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    $("#rekazProvidersModal").modal("hide");
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
                    $("#rekazProvidersModal").modal("hide");
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
        if (errors.employees) {
            $(".employees_error").text(errors.employees[0]);
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

    $("#rekaz_providers_form input").on("input", function () {
        var inputField = $(this);
        inputField.removeClass("is-invalid");
        inputField.next(".invalid-feedback").remove();
    });

    $("#rekaz_providers_form select").on("change", function () {
        var selectField = $(this);
        selectField.removeClass("is-invalid");
        selectField.next(".invalid-feedback").remove();
    });

    $("#rekaz_providers_table").on(
        "click",
        ".rekaz-providers-view",
        function () {
            var viewUrl = $(this).data("id");
            $("#loader-overlay").show();
            $.ajax({
                url: viewUrl,
                method: "GET",
                success: function (response) {
                    $("#loader-overlay").hide();
                    if (response.status === true) {
                        $("#rekazProvidersModal").modal("show");
                        $("#rekaz_providers_header").text(
                            "View Rekaz Provider",
                        );
                        disableForm();
                        $("#employees")
                            .val(response.data.employeeId)
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
                    $("#rekazProvidersModal").modal("hide");
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
        },
    );

    $("#rekaz_providers_table").on(
        "click",
        ".rekaz-providers-delete",
        function () {
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
                                rekazProvidersTable.ajax.reload(null, false);
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
        },
    );
});

function enableForm() {
    $("#rekazProvidersModal").find("input, textarea").prop("readonly", false);
    $("#rekazProvidersModal").find("select").prop("disabled", false);
    $("#createRekazProvidersBtnDiv").show();
}

function disableForm() {
    $("#rekazProvidersModal").find("input, textarea").prop("readonly", true);
    $("#rekazProvidersModal").find("select").prop("disabled", true);
    $("#createRekazProvidersBtnDiv").hide();
}
