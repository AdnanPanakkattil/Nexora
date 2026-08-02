$(function () {
    // Sidebar menu active state
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#Categories_sub_menu").addClass("active");

    // Helper for base URL
    var siteUrl = typeof baseUrl !== 'undefined' ? baseUrl : '';

    // Configure CSRF token for AJAX requests
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // Initialize DataTable for categories
    var table = $("#category_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: siteUrl + "/product-management/categories",
            type: "GET",
            error: function (xhr, error, code) {
                console.error("DataTables Error: ", error, code, xhr.responseText);
            }
        },
        columns: [
            { data: "id", name: "id" },
            {
                data: "category_image",
                name: "category_image",
                orderable: false,
                searchable: false,
                render: function (data) {
                    if (data) {
                        return `<div class="avatar avatar-md"><img src="${data}" alt="Category Image" class="rounded-circle" style="width:45px; height:45px; object-fit:cover;"></div>`;
                    }
                    return `<div class="avatar avatar-md"><span class="avatar-initial rounded-circle bg-label-primary"><i class="ti ti-photo"></i></span></div>`;
                }
            },
            { data: "name_en", name: "name_en" },
            { data: "name_ar", name: "name_ar" },
            {
                data: "status",
                name: "status",
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    const checked = data == 1 ? 'checked' : '';
                    return `
                        <label class="switch switch-primary">
                            <input type="checkbox" class="switch-input toggle-status" data-id="${row.id}" ${checked}>
                            <span class="switch-toggle-slider"></span>
                        </label>
                    `;
                }
            },
            {
                data: "sort_order",
                name: "sort_order",
                orderable: true,
                searchable: false,
                render: function (data, type, row) {
                    const orderVal = data ?? 0;
                    return `
                        <div class="d-flex align-items-center gap-1">
                            <button type="button" class="btn btn-sm btn-icon btn-outline-primary reorder-category" data-id="${row.id}" data-direction="up" title="Move Up">
                                <i class="ti ti-arrow-up"></i>
                            </button>
                            <span class="fw-bold px-2">${orderVal}</span>
                            <button type="button" class="btn btn-sm btn-icon btn-outline-primary reorder-category" data-id="${row.id}" data-direction="down" title="Move Down">
                                <i class="ti ti-arrow-down"></i>
                            </button>
                        </div>
                    `;
                }
            },
            {
                data: null,
                name: "action",
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    return `
                        <div class="d-inline-block">
                            <button type="button" class="btn btn-sm btn-icon btn-text-secondary rounded-pill dropdown-toggle hide-arrow" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="ti ti-dots-vertical fs-5"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-end m-0">
                                <a href="javascript:void(0);" class="dropdown-item edit-category" data-id="${row.id}">
                                    <i class="ti ti-edit me-2"></i>Edit
                                </a>
                                <div class="dropdown-divider"></div>
                                <a href="javascript:void(0);" class="dropdown-item text-danger delete-category" data-id="${row.id}">
                                    <i class="ti ti-trash me-2"></i>Delete
                                </a>
                            </div>
                        </div>
                    `;
                }
            },
        ],
        order: [[5, "asc"]],

        language: {
            search: "_INPUT_",
            searchPlaceholder: "Search category..."
        }
    });

    // Image Upload & Drag-and-Drop handling
    const input = document.getElementById('memberPhoto');
    const preview = document.getElementById('imagePreview');
    const removeBtn = document.getElementById('removeImage');
    const placeholder = document.getElementById('avatarPlaceholder');
    const uploadContent = document.getElementById('uploadContent');

    function handleFileSelect(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.classList.remove('d-none');
                removeBtn.classList.remove('d-none');
                placeholder.classList.add('d-none');
            };
            reader.readAsDataURL(file);
        }
    }

    if (input) {
        input.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                handleFileSelect(this.files[0]);
            }
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', function () {
            if (input) input.value = "";
            preview.src = "";
            preview.classList.add('d-none');
            removeBtn.classList.add('d-none');
            placeholder.classList.remove('d-none');
        });
    }

    // Drag and Drop events
    if (uploadContent) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadContent.addEventListener(eventName, function (e) {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        uploadContent.addEventListener('dragover', function () {
            uploadContent.classList.add('bg-light');
        });

        uploadContent.addEventListener('dragleave', function () {
            uploadContent.classList.remove('bg-light');
        });

        uploadContent.addEventListener('drop', function (e) {
            uploadContent.classList.remove('bg-light');
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files.length > 0) {
                if (input) {
                    input.files = files;
                }
                handleFileSelect(files[0]);
            }
        });
    }

    // Reset Modal Form
    function resetCategoryForm() {
        $("#addCategoryForm")[0].reset();
        $("#category_id").val("");
        $(".error-text").text("");
        if (input) input.value = "";
        preview.src = "";
        preview.classList.add('d-none');
        removeBtn.classList.add('d-none');
        placeholder.classList.remove('d-none');
        $("#addCategoryModal .modal-title").text("Add Category");
    }

    // Open Modal for Create Category
    $("#addCategoryModalBtn").on("click", function () {
        resetCategoryForm();
        $("#addCategoryModal").modal("show");
    });

    // Save/Update Category via AJAX
    $("#CategorySaveBtn").on("click", function () {
        $(".error-text").text("");

        var formData = new FormData();
        formData.append("category_id", $("#category_id").val());
        formData.append("categoryName_en", $("#categoryName_en").val());
        formData.append("categoryName_ar", $("#categoryName_ar").val());

        if (input && input.files[0]) {
            formData.append("memberPhoto", input.files[0]);
        }

        $("#loader-overlay").show();

        $.ajax({
            url: siteUrl + "/product-management/categories/store",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.success) {
                    $("#addCategoryModal").modal("hide");
                    resetCategoryForm();
                    table.ajax.reload(null, false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: response.message,
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        $("." + key + "_error").text(val[0]);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'An error occurred while saving the category.'
                    });
                }
            }
        });
    });

    // Edit Category
    $(document).on("click", ".edit-category", function () {
        var id = $(this).data("id");
        resetCategoryForm();
        $("#addCategoryModal .modal-title").text("Edit Category");
        $("#loader-overlay").show();

        $.ajax({
            url: siteUrl + "/product-management/categories/edit/" + id,
            type: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.success && response.data) {
                    var data = response.data;
                    $("#category_id").val(data.id);
                    $("#categoryName_en").val(data.name_en);
                    $("#categoryName_ar").val(data.name_ar);

                    if (data.image_url) {
                        preview.src = data.image_url;
                        preview.classList.remove('d-none');
                        removeBtn.classList.remove('d-none');
                        placeholder.classList.add('d-none');
                    }

                    $("#addCategoryModal").modal("show");
                }
            },
            error: function () {
                $("#loader-overlay").hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to fetch category details.'
                });
            }
        });
    });

    // Delete Category
    $(document).on("click", ".delete-category", function () {
        var id = $(this).data("id");

        Swal.fire({
            title: 'Are you sure?',
            text: "This category will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            showDenyButton: false,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
                cancelButton: 'btn btn-label-secondary waves-effect waves-light'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                $("#loader-overlay").show();
                $.ajax({
                    url: siteUrl + "/product-management/categories/delete/" + id,
                    type: "DELETE",
                    success: function (response) {
                        $("#loader-overlay").hide();
                        if (response.success) {
                            table.ajax.reload(null, false);
                            Swal.fire({
                                icon: 'success',
                                title: 'Deleted!',
                                text: response.message,
                                showConfirmButton: true,
                                confirmButtonText: 'OK',
                                buttonsStyling: false
                            });
                        }
                    },
                    error: function () {
                        $("#loader-overlay").hide();
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Failed to delete category.'
                        });
                    }
                });
            }
        });
    });

    // Toggle Status
    $(document).on("change", ".toggle-status", function () {
        var id = $(this).data("id");
        $.ajax({
            url: siteUrl + "/product-management/categories/status/" + id,
            type: "POST",
            success: function (response) {
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Status Updated!',
                        text: response.message,
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            },
            error: function () {
                table.ajax.reload(null, false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to update status.'
                });
            }
        });
    });

    // Reorder Category
    $(document).on("click", ".reorder-category", function () {
        var id = $(this).data("id");
        var direction = $(this).data("direction");

        $.ajax({
            url: siteUrl + "/product-management/categories/reorder/" + id,
            type: "POST",
            data: { direction: direction },
            success: function (response) {
                if (response.success) {
                    table.ajax.reload(null, false);
                }
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to reorder category.'
                });
            }
        });
    });
});
