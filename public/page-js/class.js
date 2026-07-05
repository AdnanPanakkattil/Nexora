$(document).ready(function () {
    $("#insurance_main_menu").addClass("active open menu-item-animating");
    $("#policy_sub_menu").addClass("active");
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    var policyId = $("#policyId").val();
    var classTable = $("#class_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/assigned-classes/" + policyId,
        order: [[0, "desc"]],
        columns: [
            {
                data: "insuranceClassId",
                name: "insuranceClassId",
            },
            {
                data: "className",
                name: "className",
            },
            {
                data: "network",
                name: "network",
            },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL + "/edit-class/" + full.insuranceClassId;
                    var deleteUrl =
                        BASE_URL + "/delete-class/" + full.insuranceClassId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="' +
                        editUrl +
                        '" class="dropdown-item">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger class-delete" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });
    $("#submitClass").click(function (e) {
        e.preventDefault();
        let btn = $(this);
        btn.prop("disabled", true);
        let form = $("#classForm");
        let formData = form.serialize();
        let classId = $("#classId").val();
        console.log(classId);
        var ajaxUrl = classId
            ? BASE_URL + "/update-class/" + classId
            : BASE_URL + "/store-class";
        var method = classId ? "PUT" : "POST";
        $(".error-text").text("");
        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                btn.prop("disabled", false);
                $("#loader-overlay").hide();
                if (response.status === true) {
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    if (!classId) {
                        form[0].reset();
                        $(".selectpicker").selectpicker("deselectAll");
                        $(".selectpicker").selectpicker("refresh");
                    }

                    $(".error-text").text("");
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            },
            error: function (xhr) {
                btn.prop("disabled", false);
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    let errors = xhr.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        let field = key.replace(/\./g, "_");
                        $("." + field + "_error").text(value[0]);
                    });
                    Swal.fire({
                        icon: "error",
                        text: "Please fix the highlighted errors.",
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                } else {
                    let errorMessage =
                        xhr.responseJSON?.message ||
                        "Something went wrong. Please try again.";
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: errorMessage,
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            },
        });
    });
    $(document).on("input", ".case-input", function () {
        let current = $(this);
        let caseType = current.data("case");
        let field = current.data("field");
        let firstInput = $(
            '.case-input[data-case="' +
                caseType +
                '"][data-field="' +
                field +
                '"]',
        ).first();
        if (current[0] === firstInput[0]) {
            let value = current.val();

            $(
                '.case-input[data-case="' +
                    caseType +
                    '"][data-field="' +
                    field +
                    '"]',
            )
                .not(firstInput)
                .val(value);
        }
    });
    function highlightMasterRows() {
        $(".case-input").each(function () {
            let caseType = $(this).data("case");
            let field = $(this).data("field");
            let first = $(
                '.case-input[data-case="' +
                    caseType +
                    '"][data-field="' +
                    field +
                    '"]',
            ).first();
            if (this === first[0]) {
                $(this).css({
                    background: "#e7f3ff",
                    "font-weight": "bold",
                });
            }
        });
    }
    highlightMasterRows();
    $("#class_table").on("click", ".class-delete", function () {
        let deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            customClass: {
                confirmButton: "btn btn-danger",
                cancelButton: "btn btn-secondary",
            },
        }).then((result) => {
            $("#loader-overlay").show();
            if (result.isConfirmed) {
                $("#loader-overlay").show();
                $.ajax({
                    url: deleteUrl,
                    type: "DELETE",
                    success: function (response) {
                        $("#loader-overlay").hide();
                        if (response.status === true) {
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton: "btn btn-success",
                                },
                            });
                            classTable.ajax.reload();
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
                        let errorMessage =
                            xhr.responseJSON?.message ||
                            "Something went wrong. Please try again.";
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: errorMessage,
                            customClass: { confirmButton: "btn btn-danger" },
                        });
                    },
                });
            }
        });
    });
});

function toggleIcon(el) {
    el.classList.toggle("active");
}

$("#className").on("input", function () {
    this.value = this.value.replace(/[^a-zA-Z ]/g, "");
});