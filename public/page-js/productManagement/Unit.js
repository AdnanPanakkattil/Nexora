/**
 * Unit.js — Unit CRUD Frontend Logic
 *
 * ഈ file unit-ന്റെ frontend operations handle ചെയ്യുന്നു:
 *   1. DataTable initialize (server-side)
 *   2. Add/Edit Modal open/close
 *   3. AJAX: Store (create + update)
 *   4. AJAX: Edit (fetch unit data)
 *   5. AJAX: Delete with SweetAlert confirm
 *   6. AJAX: Status toggle (Active/Inactive)
 *   7. AJAX: Reorder (up/down)
 *
 * Backend Routes (prefix: /product-management/units):
 *   GET    /product-management/units           → getData()     → DataTable JSON
 *   POST   /product-management/units/store     → store()       → Create / Update
 *   GET    /product-management/units/edit/{id} → edit()        → Fetch edit data
 *   DELETE /product-management/units/delete/{id}→ destroy()    → Delete
 *   POST   /product-management/units/status/{id}→ toggleStatus()→ Status toggle
 *   POST   /product-management/units/reorder/{id}→ reorder()   → Reorder
 */

$(function () {

    // ============================================================
    // Sidebar Menu Active State
    // ============================================================
    // Sidebar-ൽ Product Management menu active ആക്കുന്നു
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#Units_sub_menu").addClass("active");

    // ============================================================
    // Base URL Helper
    // ============================================================
    // Site base URL fetch ചെയ്യുന്നു (layout-ൽ define ചെയ്ത baseUrl variable)
    var siteUrl = typeof baseUrl !== 'undefined' ? baseUrl : '';

    // ============================================================
    // CSRF Token Setup for all AJAX requests
    // ============================================================
    // POST/DELETE requests-ൽ CSRF token automatic ആയി attach ആകും
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // ============================================================
    // 1. DataTable Initialize
    // ============================================================
    /**
     * #unit_table → Server-side DataTable initialize ചെയ്യുന്നു.
     *
     * Input : AJAX GET /product-management/units
     *         → UnitController@getData() call ആകും
     *
     * Output columns:
     *   - id         : Unit ID
     *   - name_en    : English name
     *   - name_ar    : Arabic name
     *   - short_name : Abbreviation (kg, pcs, etc.)
     *   - status     : Toggle switch (Active/Inactive)
     *   - sort_order : Up/Down reorder buttons + order number
     *   - action     : Edit + Delete dropdown
     */
    var table = $("#unit_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            // DataTable data fetch URL → UnitController@getData()
            url: siteUrl + "/product-management/units",
            type: "GET",
            error: function (xhr, error, code) {
                console.error("DataTables Error: ", error, code, xhr.responseText);
            }
        },
        columns: [
            // Column 0: ID
            { data: "id", name: "id" },

            // Column 1: Unit Name English
            { data: "name_en", name: "name_en" },

            // Column 2: Unit Name Arabic
            { data: "name_ar", name: "name_ar" },

            // Column 3: Short Name — abbreviation display ചെയ്യുന്നു
            {
                data: "short_name",
                name: "short_name",
                orderable: false,
                render: function (data) {
                    // short_name ഇല്ലെങ്കിൽ dash കാണിക്കും
                    return data ? `<span class="badge bg-label-secondary">${data}</span>` : '—';
                }
            },

            // Column 4: Status — Toggle Switch (Active/Inactive)
            // Input: data = 1 (Active) or 0 (Inactive)
            // Output: Bootstrap switch HTML
            {
                data: "status",
                name: "status",
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    // data == 1 ആണെങ്കിൽ switch checked ആകും
                    const checked = data == 1 ? 'checked' : '';
                    return `
                        <label class="switch switch-primary">
                            <input type="checkbox" class="switch-input toggle-status" data-id="${row.id}" ${checked}>
                            <span class="switch-toggle-slider"></span>
                        </label>
                    `;
                }
            },

            // Column 5: Sort Order — Up/Down arrows + order number
            // Input: data = sort_order number, row.id = unit ID
            // Output: Two buttons with up/down arrows and current order number
            {
                data: "sort_order",
                name: "sort_order",
                orderable: true,
                searchable: false,
                render: function (data, type, row) {
                    const orderVal = data ?? 0;
                    return `
                        <div class="d-flex align-items-center gap-1">
                            <button type="button" class="btn btn-sm btn-icon btn-outline-primary reorder-unit"
                                data-id="${row.id}" data-direction="up" title="Move Up">
                                <i class="ti ti-arrow-up"></i>
                            </button>
                            <span class="fw-bold px-2">${orderVal}</span>
                            <button type="button" class="btn btn-sm btn-icon btn-outline-primary reorder-unit"
                                data-id="${row.id}" data-direction="down" title="Move Down">
                                <i class="ti ti-arrow-down"></i>
                            </button>
                        </div>
                    `;
                }
            },

            // Column 6: Actions — Edit / Delete dropdown
            // Input: row.id = unit ID
            // Output: Dropdown with Edit and Delete buttons
            {
                data: null,
                name: "action",
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    return `
                        <div class="d-inline-block">
                            <button type="button"
                                class="btn btn-sm btn-icon btn-text-secondary rounded-pill dropdown-toggle hide-arrow"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="ti ti-dots-vertical fs-5"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-end m-0">
                                <a href="javascript:void(0);" class="dropdown-item edit-unit" data-id="${row.id}">
                                    <i class="ti ti-edit me-2"></i>Edit
                                </a>
                                <div class="dropdown-divider"></div>
                                <a href="javascript:void(0);" class="dropdown-item text-danger delete-unit" data-id="${row.id}">
                                    <i class="ti ti-trash me-2"></i>Delete
                                </a>
                            </div>
                        </div>
                    `;
                }
            },
        ],

        // Default sort by sort_order column (index 5)
        order: [[5, "asc"]],

        language: {
            search: "_INPUT_",
            searchPlaceholder: "Search unit..."
        }
    });

    // ============================================================
    // 2. Reset Form Helper
    // ============================================================
    /**
     * Modal form reset ചെയ്യുന്നു.
     *
     * Input  : None
     * Output : None (form fields clear ആകും, errors hide ആകും, title reset ആകും)
     */
    function resetUnitForm() {
        $("#addUnitForm")[0].reset();     // All input fields clear ചെയ്യുന്നു
        $("#unit_id").val("");            // Hidden ID clear ചെയ്യുന്നു
        $(".error-text").text("");        // Validation errors clear ചെയ്യുന്നു
        $("#unitModalTitle").text("Add Unit"); // Modal title reset ചെയ്യുന്നു
    }

    // ============================================================
    // 3. Open Modal for Add Unit
    // ============================================================
    /**
     * "Add Unit" button click → form reset ചെയ്‌ത് modal open ചെയ്യുന്നു.
     *
     * Input  : Button click event
     * Output : Modal display ആകും (empty form)
     */
    $("#addUnitModalBtn").on("click", function () {
        resetUnitForm();
        $("#addUnitModal").modal("show");
    });

    // ============================================================
    // 4. Store (Create / Update) via AJAX
    // ============================================================
    /**
     * "Save" button click → form data AJAX POST ചെയ്യുന്നു.
     *
     * Input (from form):
     *   - unit_id    : hidden field (empty = create, filled = update)
     *   - unitName_en: English name
     *   - unitName_ar: Arabic name
     *   - short_name : Abbreviation (optional)
     *
     * AJAX URL : POST /product-management/units/store
     *            → UnitController@store()
     *
     * Output:
     *   Success → Modal close, DataTable reload, SweetAlert success
     *   422 Error → Inline validation errors show ചെയ്യുന്നു
     *   Other Error → SweetAlert error
     */
    $("#UnitSaveBtn").on("click", function () {
        // Previous errors clear ചെയ്യുന്നു
        $(".error-text").text("");

        // Form data collect ചെയ്യുന്നു
        var formData = new FormData();
        formData.append("unit_id", $("#unit_id").val());       // ID: update-ൽ filled
        formData.append("unitName_en", $("#unitName_en").val()); // English name
        formData.append("unitName_ar", $("#unitName_ar").val()); // Arabic name
        formData.append("short_name", $("#short_name").val());   // Short name (optional)

        // Loader show ചെയ്യുന്നു
        $("#loader-overlay").show();

        $.ajax({
            url: siteUrl + "/product-management/units/store",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.success) {
                    $("#addUnitModal").modal("hide"); // Modal close ചെയ്യുന്നു
                    resetUnitForm();
                    table.ajax.reload(null, false);   // DataTable refresh ചെയ്യുന്നു
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
                    // Validation errors → specific field-ന്റെ error span-ൽ inject ചെയ്യുന്നു
                    var errors = xhr.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        $("." + key + "_error").text(val[0]);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'An error occurred while saving the unit.'
                    });
                }
            }
        });
    });

    // ============================================================
    // 5. Edit Unit — Fetch data and populate form
    // ============================================================
    /**
     * Edit button click → unit data fetch ചെയ്‌ത് modal-ൽ populate ചെയ്യുന്നു.
     *
     * Input  : data-id attribute (unit ID)
     * AJAX URL: GET /product-management/units/edit/{id}
     *           → UnitController@edit()
     *
     * Output:
     *   Success → form fields fill ആകും, modal open ആകും
     *   Error   → SweetAlert error
     */
    $(document).on("click", ".edit-unit", function () {
        var id = $(this).data("id"); // Unit ID from data attribute
        resetUnitForm();
        $("#unitModalTitle").text("Edit Unit"); // Modal title update ചെയ്യുന്നു
        $("#loader-overlay").show();

        $.ajax({
            url: siteUrl + "/product-management/units/edit/" + id,
            type: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.success && response.data) {
                    var data = response.data;
                    // Form fields-ൽ existing values populate ചെയ്യുന്നു
                    $("#unit_id").val(data.id);           // Hidden ID set (update mode)
                    $("#unitName_en").val(data.name_en);  // English name
                    $("#unitName_ar").val(data.name_ar);  // Arabic name
                    $("#short_name").val(data.short_name); // Short name
                    $("#addUnitModal").modal("show");      // Modal open ചെയ്യുന്നു
                }
            },
            error: function () {
                $("#loader-overlay").hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to fetch unit details.'
                });
            }
        });
    });

    // ============================================================
    // 6. Delete Unit — with SweetAlert confirmation
    // ============================================================
    /**
     * Delete button click → confirm dialog show ചെയ്‌ത് delete ചെയ്യുന്നു.
     *
     * Input  : data-id attribute (unit ID)
     * AJAX URL: DELETE /product-management/units/delete/{id}
     *           → UnitController@destroy()
     *
     * Output:
     *   Confirmed → unit delete ആകും, DataTable reload ആകും
     *   Cancelled → nothing happens
     *   Error     → SweetAlert error
     */
    $(document).on("click", ".delete-unit", function () {
        var id = $(this).data("id"); // Unit ID from data attribute

        Swal.fire({
            title: 'Are you sure?',
            text: "This unit will be permanently deleted!",
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
                    url: siteUrl + "/product-management/units/delete/" + id,
                    type: "DELETE",
                    success: function (response) {
                        $("#loader-overlay").hide();
                        if (response.success) {
                            table.ajax.reload(null, false); // DataTable refresh
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
                            text: 'Failed to delete unit.'
                        });
                    }
                });
            }
        });
    });

    // ============================================================
    // 7. Toggle Status (Active / Inactive)
    // ============================================================
    /**
     * Status switch change → Active/Inactive toggle ചെയ്യുന്നു.
     *
     * Input  : data-id attribute (unit ID), checkbox change event
     * AJAX URL: POST /product-management/units/status/{id}
     *           → UnitController@toggleStatus()
     *
     * Output:
     *   Success → SweetAlert success (status updated)
     *   Error   → DataTable reload, SweetAlert error
     */
    $(document).on("change", ".toggle-status", function () {
        var id = $(this).data("id"); // Unit ID from data attribute

        $.ajax({
            url: siteUrl + "/product-management/units/status/" + id,
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
                // Error ആണെങ്കിൽ DataTable reload ചെയ്‌ത് switch original state-ൽ restore ചെയ്യുന്നു
                table.ajax.reload(null, false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to update status.'
                });
            }
        });
    });

    // ============================================================
    // 8. Reorder Unit (Up / Down)
    // ============================================================
    /**
     * Up/Down arrow button click → unit-ന്റെ sort_order change ചെയ്യുന്നു.
     *
     * Input:
     *   data-id        → unit ID
     *   data-direction → 'up' or 'down'
     *
     * AJAX URL: POST /product-management/units/reorder/{id}
     *           Body: { direction: 'up' | 'down' }
     *           → UnitController@reorder()
     *
     * Output:
     *   Success → DataTable reload (new order reflect ആകും)
     *   Error   → SweetAlert error
     */
    $(document).on("click", ".reorder-unit", function () {
        var id        = $(this).data("id");        // Unit ID
        var direction = $(this).data("direction");  // 'up' or 'down'

        $.ajax({
            url: siteUrl + "/product-management/units/reorder/" + id,
            type: "POST",
            data: { direction: direction }, // Direction server-ലേക്ക് send ചെയ്യുന്നു
            success: function (response) {
                if (response.success) {
                    table.ajax.reload(null, false); // DataTable refresh → new order show ആകും
                }
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to reorder unit.'
                });
            }
        });
    });

});
