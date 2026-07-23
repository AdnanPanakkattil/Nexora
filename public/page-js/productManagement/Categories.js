$(function () {
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#Categories_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // Auto-generate slug when typing English category name
    $("#name_en").on("keyup change", function () {
        var text = $(this).val();
        var slug = text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        $("#slug").val(slug);
    });

    // DataTables Initialization
    if ($("#category_table").length > 0) {
        var categoryTable = $("#category_table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: "/categories/data",
                type: "GET"
            },
            columns: [
                { data: "id", name: "id" },
                { data: "image", name: "image", orderable: false, searchable: false },
                { data: "categoryName_en", name: "name_en" },
                { data: "categoryName_ar", name: "name_ar" },
                { data: "slug", name: "slug" },
                { data: "status", name: "status" },
                { data: "is_featured", name: "is_featured" },
                { data: "sort_order", name: "sort_order" },
                { data: "actions", name: "actions", orderable: false, searchable: false }
            ]
        });

        // Delete Handler
        $("#category_table").on("click", ".item-delete", function (e) {
            e.preventDefault();
            var deleteUrl = $(this).data("id");

            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                customClass: {
                    confirmButton: "btn btn-danger me-3 waves-effect waves-light",
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
                            $("#loader-overlay").hide();
                            if (response.status) {
                                categoryTable.ajax.reload(null, false);
                                Swal.fire({
                                    icon: "success",
                                    title: "Deleted!",
                                    text: response.message || "Category deleted successfully!",
                                    customClass: {
                                        confirmButton: "btn btn-success waves-effect waves-light",
                                    },
                                });
                            }
                        },
                        error: function (err) {
                            $("#loader-overlay").hide();
                            Swal.fire({
                                icon: "error",
                                title: "Error!",
                                text: "Failed to delete category.",
                                customClass: {
                                    confirmButton: "btn btn-danger waves-effect waves-light",
                                },
                            });
                        }
                    });
                }
            });
        });
    }

    // Form Submission via AJAX (supports file uploads)
    $("#categoryForm").on("submit", function (e) {
        e.preventDefault();
        var form = $(this);
        var actionUrl = form.attr("action");
        var formData = new FormData(this);

        $("#loader-overlay").show();
        $(".invalid-feedback").remove();
        $(".is-invalid").removeClass("is-invalid");

        $.ajax({
            url: actionUrl,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status) {
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: response.message,
                        customClass: {
                            confirmButton: "btn btn-success waves-effect waves-light",
                        },
                    }).then(() => {
                        if (response.redirect_url) {
                            window.location.href = response.redirect_url;
                        }
                    });
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $.each(errors, function (field, messages) {
                        var input = $('[name="' + field + '"]');
                        input.addClass("is-invalid");
                        input.after('<div class="invalid-feedback">' + messages[0] + '</div>');
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: "An error occurred while saving category.",
                        customClass: {
                            confirmButton: "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            }
        });
    });
});