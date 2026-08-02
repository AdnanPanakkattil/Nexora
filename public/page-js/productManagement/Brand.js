$(function () {
    // Sidebar menu active state
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#Brands_sub_menu").addClass("active");

    // Configure CSRF token for AJAX requests
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // Helper: Show loader overlay
    function showLoader() {
        $("#loader-overlay").show();
    }

    // Helper: Hide loader overlay
    function hideLoader() {
        $("#loader-overlay").hide();
    }

    // Helper: Clear validation error messages
    function clearErrors() {
        $(".error-text").text("");
        $(".form-control").removeClass("is-invalid");
    }

    // Helper: Reset modal form state
    function resetBrandForm() {
        $("#addBrandForm")[0].reset();
        $("#brand_id").val("");
        clearErrors();
        $(".modal-title").text("Add Brand");
    }

    //====================================================================================

    //================ Brand Modal Open ====================================================

    $("#addBrandModalBtn").on("click", function () {
        resetBrandForm();
        $("#addBrandModal").modal("show");
    });

    // Clear validation errors when modal is closed
    $("#addBrandModal").on("hidden.bs.modal", function () {
        clearErrors();
    });

    //=====================================================================================

    //================= Brand Data Table ==================================================

    var brandDataTable = $("#brand_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/product-management/brand",
            type: "GET",
            error: function (xhr, error, code) {
                console.error("DataTables Error: ", error, code, xhr.responseText);
            }
        },
        columns: [
            // Column 0: ID
            { data: "id", name: "id" },

            // Column 1: Brand Name (EN)
            { data: "brandName_en", name: "brandName_en" },

            // Column 2: Brand Name (AR)
            { data: "brandName_ar", name: "brandName_ar" },

            // Column 3: Active / Inactive Status Switch
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

            // Column 4: Action Buttons (Edit & Delete)
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
                                <a href="javascript:void(0);" class="dropdown-item edit-brand" data-id="${row.id}">
                                    <i class="ti ti-edit me-2"></i>Edit
                                </a>
                                <div class="dropdown-divider"></div>
                                <a href="javascript:void(0);" class="dropdown-item text-danger delete-brand" data-id="${row.id}">
                                    <i class="ti ti-trash me-2"></i>Delete
                                </a>
                            </div>
                        </div>
                    `;
                }
            },
        ],
        order: [[0, "desc"]],
        language: {
            emptyTable: "No brands found",
            processing: "Loading brands...",
        }
    });

    //=====================================================================================

    //======================= Save (Create / Update) =======================================

    /**
     * Store or Update Brand via AJAX
     * Input fields: brand_id (optional for update), brandName_en, brandName_ar
     * Route: POST /product-management/brand/store
     * Output: JSON response { success: true, message: string }
     */
    $("#BrandSaveBtn").on('click', function () {
        clearErrors();
        showLoader();

        var formData = new FormData();
        formData.append("brand_id", $("#brand_id").val());
        formData.append("brandName_en", $("#brandName_en").val());
        formData.append("brandName_ar", $("#brandName_ar").val());

        $.ajax({
            url: "/product-management/brand/store",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                hideLoader();
                if (response.success) {
                    $("#addBrandModal").modal("hide");
                    resetBrandForm();
                    brandDataTable.ajax.reload(null, false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: response.message,
                        timer: 2000,
                        showConfirmButton: false,
                    });
                }
            },
            error: function (xhr) {
                hideLoader();
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        $("#" + key).addClass("is-invalid");
                        $("." + key + "_error").text(val[0]);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'An error occurred while saving the brand.'
                    });
                }
            }
        });
    });

    //=====================================================================================   

    //======================= Edit Brand ===================================================

    /**
     * Fetch Single Brand Record for Editing
     * Input: data-id from clicked button
     * Route: GET /product-management/brand/edit/{id}
     * Output: Populates form fields and shows edit modal
     */
    $(document).on("click", ".edit-brand", function () {
        var id = $(this).data("id");
        clearErrors();
        showLoader();

        $.ajax({
            url: "/product-management/brand/edit/" + id,
            type: "GET",
            success: function (response) {
                hideLoader();

                if (response.success) {
                    var brand = response.data;

                    $("#brand_id").val(brand.id);
                    $("#brandName_en").val(brand.name_en);
                    $("#brandName_ar").val(brand.name_ar);

                    $(".modal-title").text("Edit Brand");
                    $("#addBrandModal").modal("show");
                }
            },
            error: function () {
                hideLoader();
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to fetch brand details.'
                });
            }
        });
    });

    //=====================================================================================   

    //======================= Soft Delete Brand ============================================

    /**
     * Soft Delete Brand Record (sets is_deleted = 1)
     * Input: data-id from clicked delete button
     * Route: DELETE /product-management/brand/delete/{id}
     * Output: Soft deletes brand and reloads DataTable without removing total row count physically
     */
    $(document).on("click", ".delete-brand", function () {
        var id = $(this).data("id");

        Swal.fire({
            title: 'Are you sure?',
            text: "This brand will be soft deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7367f0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                showLoader();

                $.ajax({
                    url: "/product-management/brand/delete/" + id,
                    type: "DELETE",
                    success: function (response) {
                        hideLoader();

                        if (response.success) {
                            brandDataTable.ajax.reload(null, false);

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
                        hideLoader();
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Failed to delete brand.'
                        });
                    }
                });
            }
        });
    });

    //=====================================================================================   

    //======================= Toggle Brand Status ==========================================

    /**
     * Toggle Active / Inactive Status
     * Input: data-id from switch checkbox
     * Route: POST /product-management/brand/status/{id}
     * Output: Toggles status in database (1 <-> 0)
     */
    $(document).on("change", ".toggle-status", function () {
        var id = $(this).data("id");
        var checkbox = $(this);

        $.ajax({
            url: "/product-management/brand/status/" + id,
            type: "POST",
            success: function (response) {
                if (response.success) {
                    if (typeof toastr !== 'undefined') {
                        toastr.success(response.message);
                    }
                } else {
                    checkbox.prop("checked", !checkbox.prop("checked"));
                    if (typeof toastr !== 'undefined') {
                        toastr.error("Failed to update status");
                    }
                }
            },
            error: function () {
                checkbox.prop("checked", !checkbox.prop("checked"));
                if (typeof toastr !== 'undefined') {
                    toastr.error("Server error while updating status");
                }
            }
        });
    });

});