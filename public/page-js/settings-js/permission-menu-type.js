$(function () {
    $("#settings_main_menu").addClass("active open menu-item-animating");
    $("#permission_menu_type_sub_menu").addClass("active");
    // CSRF token setup for AJAX requests
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var permissionMenuTypeTable = $("#permission_menu_type_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/permission-menu-type",
            data: function (d) {
                d.type = "rank"; // Filter by type
            },
        },
        columns: [
            { data: "permissionMenuTypeId", name: "permissionMenuTypeId" },
            {
                data: "permissionMenuTypeName_en",
                name: "permissionMenuTypeName_en",
            },
            {
                data: "permissionMenuTypeName_ar",
                name: "permissionMenuTypeName_ar",
            },
            {
                data: "actions",
                name: "actions",
                orderable: false,
                searchable: false,
            },
        ],
    });

$("#addNewPermissionMenuTypeBtn").on("click", function () {
    $(".error-text").text("");
    $("#permissionMenuTypeForm")[0].reset();
    $("#permissionMenuTypeForm").find("input, textarea, select").prop("disabled", false);
    $("#permission_menu_type_modal_header").text("Add Rank");
    $("#permission_menu_type_modal_footer").show();
    $("#permission_menu_type_id").val("");
    $('input[name="type"]').val("rank");
    $("#addPermissionMenuType").modal("show");
});

   $("#permissionMenuTypeSaveBtn").on("click", function (e) {
    e.preventDefault();
    var permissionMenuTypeFormData = $("#permissionMenuTypeForm").serializeArray();
    var permissionMenuTypeId = $("#permission_menu_type_id").val();
    var ajaxUrl = permissionMenuTypeId
        ? BASE_URL + "/update-permission-menu-type/" + permissionMenuTypeId
        : BASE_URL + "/permission-menu-type";
    var method = permissionMenuTypeId ? "PUT" : "POST";

    $("#loader-overlay").show();  
    $.ajax({
        url: ajaxUrl,
        type: method,
        data: permissionMenuTypeFormData,
        success: function (response) {
            $("#loader-overlay").hide(); 
            $("#addPermissionMenuType").modal("hide");
            Swal.fire({
                icon: "success",
                text: response.message,
                customClass: { confirmButton: "btn btn-success waves-effect waves-light" },
            }).then(function () { location.reload(); });
        },
        error: function (xhr) {
            $("#loader-overlay").hide(); 
            $(".error-text").text("");
            if (xhr.status === 422) {
                var errors = xhr.responseJSON.errors;
                $.each(errors, function (key, value) {
                    $("." + key + "_error").text(value[0]);
                });
            } else {
                Swal.fire({
                    icon: "error",
                    text: "An error occurred while saving.",
                    customClass: { confirmButton: "btn btn-danger waves-effect waves-light" },
                });
            }
        },
    });
});

    // Reset form on modal hide
    $("#addRankModal").on("hidden.bs.modal", function () {
        $("#addRankForm")[0].reset();
    });

  permissionMenuTypeTable.on("click", ".item-edit", function () {
    var editUrl = $(this).data("id");
    $(".error-text").text("");

    $("#loader-overlay").show(); 
    $.ajax({
        url: editUrl,
        method: "GET",
        success: function (response) {
            $("#loader-overlay").hide();  
            if (response.status === true) {
                $("#permissionMenuTypeForm").find("input, textarea, select").prop("disabled", false);
                $("#permission_menu_type_modal_header").text("Edit Rank");
                $("#permission_menu_type_modal_footer").show();
                $("#permission_menu_type_id").val(response.data.permissionMenuTypeId);
                $("#permissionMenuTypeName_en").val(response.data.permissionMenuTypeName_en);
                $("#permissionMenuTypeName_ar").val(response.data.permissionMenuTypeName_ar);
                $("#addPermissionMenuType").modal("show");
            }
        },
        error: function (err) {
            $("#loader-overlay").hide(); 
            console.error("Error fetching edit data:", err);
        },
    });
});

permissionMenuTypeTable.on("click", ".item-details", function () {
    var detailsUrl = $(this).data("id");

    $("#loader-overlay").show();  
    $.ajax({
        url: detailsUrl,
        method: "GET",
        success: function (response) {
            $("#loader-overlay").hide();
            if (response.status === true) {
                $("#permissionMenuTypeForm").find("input, textarea, select").prop("disabled", true);
                $("#permission_menu_type_modal_header").text("Rank Details");
                $("#permission_menu_type_modal_footer").hide();
                $("#permission_menu_type_id").val(response.data.permissionMenuTypeId);
                $("#permissionMenuTypeName_en").val(response.data.permissionMenuTypeName_en);
                $("#permissionMenuTypeName_ar").val(response.data.permissionMenuTypeName_ar);
                $("#addPermissionMenuType").modal("show");
            }
        },
        error: function (err) {
            $("#loader-overlay").hide(); 
            console.error("Error fetching details:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.responseJSON?.message ?? "An unexpected error occurred.",
                customClass: { confirmButton: "btn btn-danger waves-effect waves-light" },
            });
        },
    });
});

    permissionMenuTypeTable.on("click", ".item-delete", function () {
    var deleteUrl = $(this).data("id");
    Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this rank?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!",
        customClass: {
            confirmButton: "btn btn-primary me-3 waves-effect waves-light",
            cancelButton: "btn btn-label-secondary waves-effect waves-light",
        },
        buttonsStyling: false,
    }).then(function (result) {
        if (result.value) {
            $("#loader-overlay").show();
            $.ajax({
                url: deleteUrl,
                method: "DELETE",
                success: function (response) {
                    $("#loader-overlay").hide();  
                    if (response.status === true) {
                        permissionMenuTypeTable.ajax.reload(null, false);
                        Swal.fire({
                            icon: "success",
                            text: "Rank deleted successfully!",
                            customClass: { confirmButton: "btn btn-success waves-effect waves-light" },
                        });
                    }
                },
                error: function (err) {
                    $("#loader-overlay").hide(); 
                    console.error("Error deleting rank:", err);
                },
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                title: "Cancelled",
                text: "Rank deletion cancelled.",
                icon: "error",
                customClass: { confirmButton: "btn btn-success waves-effect waves-light" },
            });
        }
    });
});

    // document.getElementById("closebtn").addEventListener("click", function () {
    //     $("#addRankModal").modal("hide");
    // });
});

$('#permissionMenuTypeName_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#permissionMenuTypeName_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});