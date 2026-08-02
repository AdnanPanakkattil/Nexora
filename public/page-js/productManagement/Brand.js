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

    //====================================================================================


    //================brand Modal open ====================================================

    $("#addBrandModalBtn").on("click", function () {
        $("#addBrandModal").modal("show");
    });

    //=====================================================================================

    //================= Brand Data Table ==================================================

    var brandDataTable = $("#brand_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/product-management/brand",
            type: "GET",
        },
        columns: [
            { data: "id", name: "id" },
            { data: "brandName_en", name: "brandName_en" },
            { data: "brandName_ar", name: "brandName_ar" },
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

    });

    //=====================================================================================

    


});