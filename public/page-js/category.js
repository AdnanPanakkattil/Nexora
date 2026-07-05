$(function () {
    $("#settings_main_menu").addClass("active open menu-item-animating");
    $("#category_sub_menu").addClass("active");

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

    function initSelect2() {
        if (!$("#type").hasClass("select2-hidden-accessible")) {
            $("#type").select2({ dropdownParent: $("#addCategoryModal"), width: "100%" });
        }
        if (!$("#copaymentMaximum").hasClass("select2-hidden-accessible")) {
            $("#copaymentMaximum").select2({ dropdownParent: $("#addCategoryModal"), width: "100%" });
        }
    }

    function destroySelect2() {
        if ($("#type").hasClass("select2-hidden-accessible")) {
            $("#type").select2("destroy");
        }
        if ($("#copaymentMaximum").hasClass("select2-hidden-accessible")) {
            $("#copaymentMaximum").select2("destroy");
        }
    }

    function resetCategoryForm() {
        $("#addCategoryForm")[0].reset();
        $(".error-text").text("");
        $("#category_id").val("");
        $(".copayment-maximum-div").hide();
        destroySelect2();
    }

    // Toggle copayment div
    $(document).on("change", "#type", function () {
        if ($(this).val() === "insurance_deduction_category") {
            $(".copayment-maximum-div").show();
        } else {
            $(".copayment-maximum-div").hide();
        }
    });

    // Init select2 when modal opens
    $("#addCategoryModal").on("shown.bs.modal", function () {
        initSelect2();
    });

    // Destroy select2 and reset when modal closes
    $("#addCategoryModal").on("hidden.bs.modal", function () {
        resetCategoryForm();
    });

    // Add New
    $("#addNewCategoryBtn").on("click", function () {
        resetCategoryForm();
        $("#addCategoryForm").find("input, textarea, select").prop("disabled", false);
        $("#category_modal_header").text("Add Category");
        $("#category_modal_footer").show();
        $("#addCategoryModal").modal("show");
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

    // Details
    categoryTable.on("click", ".item-details", function () {
        var categoryId = $(this).data("id");

        $("#loader-overlay").show();
        $.ajax({
            type: "GET",
            url: BASE_URL + "/detail-category/" + categoryId,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    resetCategoryForm();
                    $("#category_modal_header").text("Category Details");
                    $("#category_modal_footer").hide();
                    $("#category_id").val(response.data.categoryId);
                    $("#categoryName_en").val(response.data.categoryName_en);
                    $("#categoryName_ar").val(response.data.categoryName_ar);
                    $("#addCategoryModal").modal("show");

                    $("#addCategoryModal").one("shown.bs.modal", function () {
                        $("#type").val(response.data.type).trigger("change");
                        if (response.data.type === "insurance_deduction_category") {
                            $(".copayment-maximum-div").show();
                            $("#copaymentMaximum").val(response.data.copaymentMaximum).trigger("change");
                        } else {
                            $(".copayment-maximum-div").hide();
                        }
                        // Disable all fields after select2 is initialized
                        $("#addCategoryForm").find("input, textarea, select").prop("disabled", true);
                    });
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

$('#categoryName_en').on('input', function () {
    this.value = this.value.replace(/[^a-zA-Z\s/@&-]/g, '');
});

$('#categoryName_ar').on('input', function () {
    this.value = this.value.replace(/[^\u0600-\u06FF\s/@&-]/g, '');
});