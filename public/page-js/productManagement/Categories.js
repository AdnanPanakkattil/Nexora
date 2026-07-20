$(function () {
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#Categories_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var categoryTable = $("#category_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/category",
            data: function (d) {
                d.type = $("#categoryType").val();
            },
        },
        columns: [
            { data: "categoryId", name: "categoryId" },
            { data: "categoryName_en", name: "categoryName_en" },
            { data: "categoryName_ar", name: "categoryName_ar" },
            { data: "type", name: "type" },
            { data: "actions", name: "actions", orderable: false, searchable: false },
        ],
    });


    // Save 
    $("#CategorySaveBtn").on("click", function (e) {
        e.preventDefault();

        var categoryId = $("#category_id").val();
        var url = categoryId
            ? BASE_URL + "/update-category/" + categoryId
            : BASE_URL + "/category";
        var method = categoryId ? "PUT" : "POST";

        $("#loader-overlay").show();
        $.ajax({
            url: url,
            method: method,
            data: $("#addCategoryForm").serialize(),
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#addCategoryModal").modal("hide");
                    categoryTable.ajax.reload(null, false);
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
                        text: "Failed to save category.",
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
    categoryTable.on("click", ".item-edit", function () {
        var categoryId = $(this).data("id");

        $("#loader-overlay").show();
        $.ajax({
            type: "GET",
            url: BASE_URL + "/edit-category/" + categoryId,
            success: function (response) {
                $("#loader-overlay").hide();
                resetCategoryForm();
                $("#addCategoryForm").find("input, textarea, select").prop("disabled", false);
                $("#category_modal_header").text("Edit Category");
                $("#category_modal_footer").show();
                $("#category_id").val(response.categoryId);
                $("#categoryName_en").val(response.categoryName_en);
                $("#categoryName_ar").val(response.categoryName_ar);
                $("#addCategoryModal").modal("show");

                $("#addCategoryModal").one("shown.bs.modal", function () {
                    $("#type").val(response.type).trigger("change");
                    if (response.type === "insurance_deduction_category") {
                        $(".copayment-maximum-div").show();
                        $("#copaymentMaximum").val(response.copaymentMaximum).trigger("change");
                    } else {
                        $(".copayment-maximum-div").hide();
                        $("#copaymentMaximum").val("").trigger("change");
                    }
                });
            },
            error: function () {
                $("#loader-overlay").hide();
                Swal.fire("Error!", "Unable to fetch category details.", "error");
            },
        });
    });

    // Delete
    categoryTable.on("click", ".item-delete", function (e) {
        e.preventDefault();
        var deleteUrl = $(this).data("id");
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
                    url: deleteUrl,
                    type: "DELETE",
                    success: function (response) {
                        if (response.status) {
                            $("#loader-overlay").hide();
                            categoryTable.ajax.reload(null, false);
                            Swal.fire({
                                icon: "success",
                                text: "Category deleted successfully!",
                                customClass: {
                                    confirmButton: "btn btn-success waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function (err) {
                        $("#loader-overlay").hide();
                        console.error("Error deleting category:", err);
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Category deletion cancelled.",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });

    $("#categoryType").on("change", function () {
        categoryTable.ajax.reload();
    });

    document.getElementById("closebtn").addEventListener("click", function () {
        $("#addCategoryModal").modal("hide");
    });
});