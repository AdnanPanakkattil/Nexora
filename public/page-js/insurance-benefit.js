$(document).ready(function () {
    $("#insurance_main_menu").addClass("active open menu-item-animating");
    $("#insurance_benefit_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#benefitModalBtn").click(function (e) {
        e.preventDefault();
        $("#benefit_header").text("Add Benefit");
        $("#benefit_btn").text("Save");
        $("#benefitId").val("");
        $("#benefit_form")[0].reset();
        $("#department").val(null).trigger("change");
        $(".error-text").text("");
        $("#benefitModal").modal("show");
    });

    $("#benefitModal").on("hidden.bs.modal", function () {
        $("#benefit_form")[0].reset();
        $("#department").val(null).trigger("change");
        $(".error-text").text("");
    });

    var benefitTable = $("#benefit_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/insurance-benefit",
        order: [[3, "asc"]],
        columns: [
            { data: "insuranceBenefitId", name: "insuranceBenefitId" },
            { data: "benefitName", name: "benefitName" },
            { data: "department", name: "department" },
            {
                data: null,
                name: "sort",
                orderable: true,
                searchable: false,
                render: function (data, type, row) {
                    return `
                    <button type="button" class="btn btn-primary" onClick="increment(${row.insuranceBenefitId});" data-id="${row.insuranceBenefitId}"><i class="fa-solid fa-arrow-down"></i></button>
                    ${row.sort}
                    <button type="button" class="btn btn-primary" onClick="decrement(${row.insuranceBenefitId});" data-id="${row.insuranceBenefitId}"><i class="fa-solid fa-arrow-up"></i></button>
                `;
                },
            },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL +
                        "/edit-insurance-benefit/" +
                        full.insuranceBenefitId;
                    var deleteUrl =
                        BASE_URL +
                        "/delete-insurance-benefit/" +
                        full.insuranceBenefitId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="javascript:;" class="dropdown-item benefit-edit" data-id="' +
                        editUrl +
                        '">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger benefit-delete" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    $("#benefit_btn").click(function (e) {
        e.preventDefault();
        let btn = $(this);
        btn.prop("disabled", true);
        let benefitId = $("#benefitId").val();
        let formData = $("#benefit_form").serialize();
        let ajaxUrl = benefitId
            ? BASE_URL + "/update-insurance-benefit/" + benefitId
            : BASE_URL + "/store-insurance-benefit";
        let method = benefitId ? "PUT" : "POST";
        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                btn.prop("disabled", false);
                $("#loader-overlay").hide();
                if (response.status === true) {
                    benefitTable.ajax.reload(null, false);
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    $("#benefitModal").modal("hide");
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
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    let errorMessage =
                        xhr.responseJSON?.message ||
                        "Duplicate or invalid data. Try different values.";
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

    $("#benefit_table").on("click", ".benefit-edit", function () {
        let editUrl = $(this).data("id");
        $("#loader-overlay").show();
        $.ajax({
            url: editUrl,
            type: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#benefit_header").text("Update Benefit");
                    $("#benefit_btn").text("Update");
                    $("#benefitId").val(response.data.insuranceBenefitId);
                    $("#benefitName").val(response.data.benefitName);
                    let departmentIds =
                        response.data.insurance_benefit_department.map(
                            (item) => item.departmentId,
                        );
                    $("#department").val(null).trigger("change");
                    $("#department").val(departmentIds).trigger("change");

                    $(".error-text").text("");

                    $("#benefitModal").modal("show");
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.message,
                    });
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                let errorMessage =
                    xhr.responseJSON?.message || "Something went wrong";
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorMessage,
                });
            },
        });
    });

    $("#benefit_table").on("click", ".benefit-delete", function () {
        let deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            customClass: {
                confirmButton: "btn btn-danger",
                cancelButton: "btn btn-secondary",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                $("#loader-overlay").show();
                $.ajax({
                    url: deleteUrl,
                    type: "DELETE",
                    success: function (response) {
                        $("#loader-overlay").hide();
                        if (response.status === true) {
                            benefitTable.ajax.reload(null, false);
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
                        let errorMessage =
                            xhr.responseJSON?.message || "Something went wrong";
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

    window.increment = function (id) {
        $("#loader-overlay").show();

        $.post(BASE_URL + "/increment-insurance-benefit", {
            benefitId: id,
        })
            .done(function (res) {
                if (res.status) {
                    benefitTable.ajax.reload(function () {
                        $("#loader-overlay").hide();
                    }, false);
                } else {
                    $("#loader-overlay").hide();
                }
            })
            .fail(function () {
                $("#loader-overlay").hide();
            });
    };

    window.decrement = function (id) {
        $("#loader-overlay").show();

        $.post(BASE_URL + "/decrement-insurance-benefit", {
            benefitId: id,
        })
            .done(function (res) {
                if (res.status) {
                    benefitTable.ajax.reload(function () {
                        $("#loader-overlay").hide();
                    }, false);
                } else {
                    $("#loader-overlay").hide();
                }
            })
            .fail(function () {
                $("#loader-overlay").hide();
            });
    };
});

$("#benefitName").on("input", function () {
    this.value = this.value.replace(/[^a-zA-Z ]/g, "");
});
