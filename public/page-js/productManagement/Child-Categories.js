/**
 * Child Categories Management JS Script
 * Handles DataTables initialization, Ajax Form Submission, Edit Modal Population,
 * Image Preview/Upload, Status Toggling, Reordering, and Deletion.
 *
 * Detailed comments explain what each input field does and where each value originates from.
 */

$(function () {
    // ----------------------------------------------------------------------
    // 1. SIDEBAR MENU & AJAX CSRF SETUP
    // ----------------------------------------------------------------------
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#Child_categories_sub_menu").addClass("active");

    // Base URL configuration for site routes
    var siteUrl = typeof baseUrl !== 'undefined' ? baseUrl : '';

    // Automatically attach CSRF Token header to all jQuery AJAX requests
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // Initialize Select2 dropdowns if present
    if ($.fn.select2) {
        $('.select2').select2({
            dropdownParent: $('#ChildCategoryModal')
        });
        $('#filter_sub_category_id').select2();
    }

    // ----------------------------------------------------------------------
    // 2. DATATABLES INITIALIZATION
    // ----------------------------------------------------------------------
    /**
     * Columns & Data Mapping:
     * - id                   : Child Category primary key ID from DB.
     * - child_category_image : Image URL generated from asset(image) in controller.
     * - name_en              : English name of Child Category.
     * - name_ar              : Arabic name of Child Category.
     * - sub_category_name    : Name of parent Sub Category via Eloquent relationship.
     * - category_name        : Name of top-level Category via subCategory->category relationship.
     * - status               : 1 (Active) or 0 (Inactive) toggle switch.
     * - sort_order           : Numerical sort order position inside parent Sub Category.
     * - action               : Action dropdown containing Edit and Delete buttons.
     */
    var table = $("#child_category_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: siteUrl + "/product-management/child-categories",
            type: "GET",
            // Input data sent to server: sub_category_id for filtering table records
            data: function (d) {
                d.sub_category_id = $("#filter_sub_category_id").val();
            },
            error: function (xhr, error, code) {
                console.error("DataTables Error: ", error, code, xhr.responseText);
            }
        },
        columns: [
            { data: "id", name: "id" },
            {
                data: "child_category_image",
                name: "child_category_image",
                orderable: false,
                searchable: false,
                render: function (data) {
                    if (data) {
                        return `<div class="avatar avatar-md"><img src="${data}" alt="Child Category Image" class="rounded-circle" style="width:45px; height:45px; object-fit:cover;"></div>`;
                    }
                    return `<div class="avatar avatar-md"><span class="avatar-initial rounded-circle bg-label-primary"><i class="ti ti-photo"></i></span></div>`;
                }
            },
            { data: "name_en", name: "name_en" },
            { data: "name_ar", name: "name_ar" },
            { data: "sub_category_name", name: "sub_category_name", orderable: false, searchable: false },
            { data: "category_name", name: "category_name", orderable: false, searchable: false },
            {
                data: "status",
                name: "status",
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    const checked = data == 1 ? 'checked' : '';
                    return `
                        <label class="switch switch-primary">
                            <input type="checkbox" class="switch-input toggle-child-status" data-id="${row.id}" ${checked}>
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
                            <button type="button" class="btn btn-sm btn-icon btn-outline-primary reorder-child-category" data-id="${row.id}" data-direction="up" title="Move Up">
                                <i class="ti ti-arrow-up"></i>
                            </button>
                            <span class="fw-bold px-2">${orderVal}</span>
                            <button type="button" class="btn btn-sm btn-icon btn-outline-primary reorder-child-category" data-id="${row.id}" data-direction="down" title="Move Down">
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
                                <a href="javascript:void(0);" class="dropdown-item edit-child-category" data-id="${row.id}">
                                    <i class="ti ti-edit me-2"></i>Edit
                                </a>
                                <div class="dropdown-divider"></div>
                                <a href="javascript:void(0);" class="dropdown-item text-danger delete-child-category" data-id="${row.id}">
                                    <i class="ti ti-trash me-2"></i>Delete
                                </a>
                            </div>
                        </div>
                    `;
                }
            },
        ],
        order: [[7, "asc"]], // Default order by sort_order
        language: {
            search: "_INPUT_",
            searchPlaceholder: "Search child category..."
        }
    });

    // Reload DataTables when user changes the Sub Category filter dropdown
    $("#filter_sub_category_id").on("change", function () {
        table.ajax.reload(null, false);
    });

    // ----------------------------------------------------------------------
    // 3. IMAGE UPLOAD & PREVIEW LOGIC
    // ----------------------------------------------------------------------
    const input         = document.getElementById('memberPhoto');
    const preview       = document.getElementById('imagePreview');
    const removeBtn     = document.getElementById('removeImage');
    const placeholder   = document.getElementById('avatarPlaceholder');
    const uploadContent = document.getElementById('uploadContent');

    /**
     * Reads selected file and sets image preview.
     * Value/Input: File object from input.files[0]
     */
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

    // Drag and Drop File Support
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

    // ----------------------------------------------------------------------
    // 4. RESET FORM LOGIC
    // ----------------------------------------------------------------------
    /**
     * Resets form input fields, clears validation error messages,
     * and resets image preview elements to initial state.
     */
    function resetChildCategoryForm() {
        $("#addChildCategoryForm")[0].reset();
        $("#child_category_id").val(""); // Clear ID for Create mode
        if ($.fn.select2) {
            $("#modal_sub_category_id").val("").trigger("change");
        } else {
            $("#modal_sub_category_id").val("");
        }
        $(".error-text").text(""); // Clear error messages
        if (input) input.value = "";
        preview.src = "";
        preview.classList.add('d-none');
        removeBtn.classList.add('d-none');
        placeholder.classList.remove('d-none');
        $("#childCategoryModalTitle").text("Add Child Category");
    }

    // Open Modal for Creating new Child Category
    $("#addChildCategoryModalBtn").on("click", function () {
        resetChildCategoryForm();
        $("#ChildCategoryModal").modal("show");
    });

    // ----------------------------------------------------------------------
    // 5. SAVE / UPDATE CHILD CATEGORY (AJAX POST)
    // ----------------------------------------------------------------------
    /**
     * Data Payload sent to POST /product-management/child-categories/store:
     * - child_category_id    : ID of category (empty for store, populated for update)
     * - sub_category_id      : Parent Sub Category ID selected in dropdown
     * - childCategoryName_en : English name input text
     * - childCategoryName_ar : Arabic name input text
     * - memberPhoto          : Image file binary object (optional)
     */
    $("#ChildCategorySaveBtn").on("click", function () {
        $(".error-text").text(""); // Reset prior validation errors

        var formData = new FormData();
        formData.append("child_category_id",    $("#child_category_id").val());
        formData.append("sub_category_id",      $("#modal_sub_category_id").val());
        formData.append("childCategoryName_en", $("#childCategoryName_en").val());
        formData.append("childCategoryName_ar", $("#childCategoryName_ar").val());

        if (input && input.files[0]) {
            formData.append("memberPhoto", input.files[0]);
        }

        $("#loader-overlay").show();

        $.ajax({
            url: siteUrl + "/product-management/child-categories/store",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.success) {
                    $("#ChildCategoryModal").modal("hide");
                    resetChildCategoryForm();
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
                    // Display Laravel validation errors under corresponding inputs
                    var errors = xhr.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        $("." + key + "_error").text(val[0]);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'An error occurred while saving the child category.'
                    });
                }
            }
        });
    });

    // ----------------------------------------------------------------------
    // 6. EDIT CHILD CATEGORY (POPULATE MODAL)
    // ----------------------------------------------------------------------
    /**
     * Fetches record details by ID from GET /product-management/child-categories/edit/{id}
     * Populates input fields:
     * - #child_category_id    <- data.id
     * - #modal_sub_category_id <- data.sub_category_id
     * - #childCategoryName_en <- data.name_en
     * - #childCategoryName_ar <- data.name_ar
     * - #imagePreview         <- data.image_url
     */
    $(document).on("click", ".edit-child-category", function () {
        var id = $(this).data("id");
        resetChildCategoryForm();
        $("#childCategoryModalTitle").text("Edit Child Category");
        $("#loader-overlay").show();

        $.ajax({
            url: siteUrl + "/product-management/child-categories/edit/" + id,
            type: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.success && response.data) {
                    var data = response.data;
                    $("#child_category_id").val(data.id);

                    if ($.fn.select2) {
                        $("#modal_sub_category_id").val(data.sub_category_id).trigger("change");
                    } else {
                        $("#modal_sub_category_id").val(data.sub_category_id);
                    }

                    $("#childCategoryName_en").val(data.name_en);
                    $("#childCategoryName_ar").val(data.name_ar);

                    if (data.image_url) {
                        preview.src = data.image_url;
                        preview.classList.remove('d-none');
                        removeBtn.classList.remove('d-none');
                        placeholder.classList.add('d-none');
                    }

                    $("#ChildCategoryModal").modal("show");
                }
            },
            error: function () {
                $("#loader-overlay").hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to fetch child category details.'
                });
            }
        });
    });

    // ----------------------------------------------------------------------
    // 7. DELETE CHILD CATEGORY
    // ----------------------------------------------------------------------
    /**
     * Sends DELETE request to /product-management/child-categories/delete/{id}
     */
    $(document).on("click", ".delete-child-category", function () {
        var id = $(this).data("id");

        Swal.fire({
            title: 'Are you sure?',
            text: "This child category will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
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
                    url: siteUrl + "/product-management/child-categories/delete/" + id,
                    type: "DELETE",
                    success: function (response) {
                        $("#loader-overlay").hide();
                        if (response.success) {
                            table.ajax.reload(null, false);
                            Swal.fire({
                                icon: 'success',
                                title: 'Deleted!',
                                text: response.message,
                                timer: 2000,
                                showConfirmButton: false
                            });
                        }
                    },
                    error: function () {
                        $("#loader-overlay").hide();
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Failed to delete child category.'
                        });
                    }
                });
            }
        });
    });

    // ----------------------------------------------------------------------
    // 8. TOGGLE ACTIVE/INACTIVE STATUS
    // ----------------------------------------------------------------------
    /**
     * Sends POST request to /product-management/child-categories/status/{id}
     */
    $(document).on("change", ".toggle-child-status", function () {
        var id = $(this).data("id");
        $.ajax({
            url: siteUrl + "/product-management/child-categories/status/" + id,
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

    // ----------------------------------------------------------------------
    // 9. REORDER POSITION (UP / DOWN)
    // ----------------------------------------------------------------------
    /**
     * Sends POST request to /product-management/child-categories/reorder/{id}
     * Input data: { direction: 'up' | 'down' }
     */
    $(document).on("click", ".reorder-child-category", function () {
        var id        = $(this).data("id");
        var direction = $(this).data("direction");

        $.ajax({
            url: siteUrl + "/product-management/child-categories/reorder/" + id,
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
                    text: 'Failed to reorder child category.'
                });
            }
        });
    });
});