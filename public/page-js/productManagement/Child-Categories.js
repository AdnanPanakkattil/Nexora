$(function () {
    // Sidebar menu active state
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#Child_categories_sub_menu").addClass("active");

    // Helper for base URL
    var siteUrl = typeof baseUrl !== 'undefined' ? baseUrl : '';

    // Configure CSRF token for AJAX requests
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    //----------------------------------------------------------------------


    // ----------------Add Child Category Modal-------------------
    $("#addChildCategoryModalBtn").on("click", function () {
        $("#ChildCategoryModal").modal("show");
    })
});