$(document).ready(function () {
    $("#settings_main_menu").addClass("active open menu-item-animating");
    $("#permission_group_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    
$(document).on("click", ".item-delete", function () {
    var deleteUrl = $(this).data("url");

    Swal.fire({
        title: "Are you sure?",
        text: "This permission group will be deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        if (result.isConfirmed) {
             $("#loader-overlay").show();
            $.ajax({
                url: deleteUrl,
                type: "DELETE",
                success: function (response) {
                        $("#loader-overlay").hide();
                    if (response.status) {
                        Swal.fire("Deleted!", response.message, "success");
                        permissionGroupListTable.ajax.reload();
                    } else {
                        Swal.fire("Error!", response.message, "error");
                    }
                },
                error: function () {
                    $("#loader-overlay").hide();
                    Swal.fire("Error!", "Something went wrong.", "error");
                },
            });
        }
    });
});

    var permissionGroupListTable = $("#permission_group_list_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/permission-group-lists",
        columns: [
            { data: "clinicsPermissionGroupId", name: "clinicsPermissionGroupId" },
            { data: "groupName_en", name: "groupName_en" },
            { data: "groupName_ar", name: "groupName_ar" },
            { data: "createdDateTime", name: "createdDateTime" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
    var editUrl    = BASE_URL + "/edit-permission-group/"   + full.clinicsPermissionGroupId;
    var detailsUrl = BASE_URL + "/detail-of-permission-group/" + full.clinicsPermissionGroupId;
    var deleteUrl  = BASE_URL + "/delete-permission-group/" + full.clinicsPermissionGroupId;

    return (
        '<div class="d-inline-block">' +
        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
        '<li><a href="' + editUrl + '" class="dropdown-item">Edit</a></li>' +
        '<div class="dropdown-divider"></div>' +
        '<li><a href="' + detailsUrl + '" class="dropdown-item">Details</a></li>' +
        '<div class="dropdown-divider"></div>' +
        '<li><a href="javascript:;" class="dropdown-item text-danger item-delete" data-url="' + deleteUrl + '">Delete</a></li>' +
        '</ul>' +
        '</div>'
    );
},
            },
        ],
    });
});

   