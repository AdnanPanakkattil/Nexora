$(function () {
    $("#room_management_main_menu").addClass("active open menu-item-animating");
    $("#room_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var roomTable = $("#room_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/room",
        },
        columns: [
            { data: "roomManagementId", name: "roomManagementId" },
            { data: "name_en", name: "name_en" },
            { data: "name_ar", name: "name_ar" },
            { data: "type", name: "type" },
            {
                data: "actions",
                name: "actions",
                orderable: false,
                searchable: false,
            },
        ],
    });

    $("#addNewRoomBtn").on("click", function () {
        $(".error-text").text("");
        $("#addRoomModal").modal("show");
        $("#department_id").val("");
        $("#addRoomForm")[0].reset();
        $("#type").val("").trigger("change");
    });

    $("#addRoomForm").on("submit", function (e) {
        e.preventDefault();
        var formData = $(this).serialize();
        var roomId = $("#department_id").val();
        var ajaxUrl = roomId
            ? BASE_URL + "/update-room/" + roomId
            : BASE_URL + "/store-room";
        var method = roomId ? "PUT" : "POST";
        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                $("#addRoomModal").modal("hide");
                $("#loader-overlay").hide();
                roomTable.ajax.reload(null, false);
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            },
            error: function (xhr) {
                $(".error-text").text("");
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    console.error(xhr.responseText);
                }
            },
        });
    });

    roomTable.on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");
        $("#loader-overlay").show();
        $.ajax({
            url: editUrl,
            type: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#addRoomModal").modal("show");
                    $("#department_id").val(response.data.roomManagementId);
                    $("#roomNameEn").val(response.data.name_en);
                    $("#roomNameAr").val(response.data.name_ar);
                    $("#type").val(response.data.type).trigger("change");
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                console.error(xhr.responseText);
            },
        });
    });

    $("#addRoomModal").on("hidden.bs.modal", function () {
        $("#addRoomForm")[0].reset();
        clearErrors();
        $(".error-text").text("");
    });

    roomTable.on("click", ".item-delete", function () {
        var deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this room?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes!",
            customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton:
                    "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.value) {
                $("#loader-overlay").show();
                $.ajax({
                    url: deleteUrl,
                    type: "DELETE",
                    success: function (response) {
                        $("#loader-overlay").hide();
                        if (response.status === true) {
                            roomTable.ajax.reload(null, false);
                            Swal.fire({
                                icon: "success",
                                text: "Room deleted successfully!",
                                customClass: {
                                    confirmButton:
                                        "btn btn-success waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function (xhr) {
                        $("#loader-overlay").hide();
                        console.error(xhr.responseText);
                    },
                });
            }
        });
    });
});

function clearErrors() {
    $(".invalid-feedback").remove();
    $(".is-invalid").removeClass("is-invalid");
}

$("#roomNameEn").on("input", function () {
    this.value = this.value.replace(/[^a-zA-Z0-9\s-]/g, "");
});

$("#roomNameAr").on("input", function () {
    this.value = this.value.replace(/[^\u0600-\u06FF0-9\u0660-\u0669\s-]/g, "");
});
