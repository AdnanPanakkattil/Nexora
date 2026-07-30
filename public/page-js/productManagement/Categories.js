$(function () {
    // Sidebar menu active state - Start
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#Categories_sub_menu").addClass("active");

    // Configure CSRF token for AJAX requests
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    // Sidebar menu active state - End


    //Add catogery modal upending

    $("#addCategoryModalBtn").on("click", function () {
        $("#addCategoryModal").modal("show");
    })

    //Add catogery modal upending end

    // Initialize DataTable for categories Start

    var table = $("#categoriesTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/product-management/categories",
            type: "GET",
        },
        columns: [
            { data: "id", name: "id" },
            { data: "category_image", name: "category_image" },
            { data: "category_name_en", name: "category_name_en" },
            { data: "category_name_ar", name: "category_name_ar" },
            { data: "status", name: "status", orderable: false, searchable: false },
            {
                data: 'OrderNo',
                name: 'OrderNo',
                orderable: true,
                searchable: false,
                render: function (data, type, row, meta) {
                    var test = meta.row + meta.settings._iDisplayStart + 1;
                    if (row.canEdit) {
                        return `
                    <button type="button" class="btn btn-info increment-category" data-id="${row.categoryId}">
                        <i class="fa-solid fa-arrow-up"></i>
                    </button>
                    ${meta.row + meta.settings._iDisplayStart + 1}
                    <button type="button" class="btn btn-info decrement-category" data-id="${row.categoryId}">
                        <i class="fa-solid fa-arrow-down"></i>
                    </button>
                `;
                    } else {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                }
            },
            { data: "action", name: "action", orderable: false, searchable: false },
        ],
    })

    // Initialize DataTable for categories end

   const input = document.getElementById('memberPhoto');
const preview = document.getElementById('imagePreview');
const removeBtn = document.getElementById('removeImage');
const placeholder = document.getElementById('avatarPlaceholder');

input.addEventListener('change', function () {

    if (this.files && this.files[0]) {

        const reader = new FileReader();

        reader.onload = function (e) {

            preview.src = e.target.result;

            preview.classList.remove('d-none');
            removeBtn.classList.remove('d-none');

            placeholder.classList.add('d-none');
        }

        reader.readAsDataURL(this.files[0]);
    }

});

removeBtn.addEventListener('click', function () {

    input.value = "";

    preview.src = "";
    preview.classList.add('d-none');

    removeBtn.classList.add('d-none');

    placeholder.classList.remove('d-none');

});
});

