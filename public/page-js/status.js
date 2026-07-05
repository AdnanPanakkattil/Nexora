$(function () {
    $("#settings_main_menu").addClass("active open menu-item-animating");
    $("#status_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var statusTable = $("#status_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/status",
        },
        columns: [
            { data: "statusId", name: "statusId" },
            { data: "name_en", name: "name_en" },
            { data: "name_ar", name: "name_ar" },
            { data: "actions", name: "actions", orderable: false, searchable: false },
        ],
    });

    function resetStatusForm() {
        $("#addStatusForm")[0].reset();
        $(".error-text").text("");
        $("#status_id").val("");
    }

    $("#addNewStatusBtn").on("click", function () {
        resetStatusForm();
        $("#addStatusForm").find("input, textarea, select").prop("disabled", false);
        $("#status_modal_header").text("Add Status");
        $("#status_modal_footer").show();
        $("#addStatusModal").modal("show");
    });

    $("#statusSaveBtn").on("click", function () {
        var formData = $("#addStatusForm").serialize();
        var id = $("#status_id").val();
        var ajaxUrl = id
            ? BASE_URL + "/update-status/" + id
            : BASE_URL + "/status";
        var method = id ? "PUT" : "POST";

            $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                    $("#loader-overlay").hide();
                if (response.success === true) {
                    $("#addStatusModal").modal("hide");
                    statusTable.ajax.reload(null, false);
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: {
                            confirmButton: "btn btn-success waves-effect waves-light",
                        },
                    });
                }
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
                        text: xhr.responseJSON?.message ?? "An error occurred.",
                        customClass: {
                            confirmButton: "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
        });
    });

    statusTable.on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");

        $("#loader-overlay").show();
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                    $("#loader-overlay").hide();
                if (response.status === true) {
                    resetStatusForm();
                    $("#addStatusForm").find("input, textarea, select").prop("disabled", false);
                    $("#status_modal_header").text("Edit Status");
                    $("#status_modal_footer").show();
                    $("#status_id").val(response.data.statusId);
                    $("#statusNameEn").val(response.data.name_en);
                    $("#statusNameAr").val(response.data.name_ar);
                    $("#addStatusModal").modal("show");
                }
            },
            error: function (err) {
                    $("#loader-overlay").hide();
                console.error("Error fetching edit data:", err);
            },
        });
    });

    statusTable.on("click", ".item-details", function () {
        var detailsUrl = $(this).data("id");

        $("#loader-overlay").show();
        $.ajax({
            url: detailsUrl,
            method: "GET",
            success: function (response) {
                    $("#loader-overlay").hide();
                if (response.status === true) {
                    resetStatusForm();
                    $("#addStatusForm").find("input, textarea, select").prop("disabled", true);
                    $("#status_modal_header").text("Status Details");
                    $("#status_modal_footer").hide();
                    $("#status_id").val(response.data.statusId);
                    $("#statusNameEn").val(response.data.name_en);
                    $("#statusNameAr").val(response.data.name_ar);
                    $("#addStatusModal").modal("show");
                }
            },
            error: function (err) {
                    $("#loader-overlay").hide();
                console.error("Error fetching details:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.responseJSON?.message ?? "An unexpected error occurred.",
                    customClass: {
                        confirmButton: "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });

    statusTable.on("click", ".item-delete", function () {
        var deleteUrl = $(this).data("id");

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton: "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                $("#loader-overlay").show();
                $.ajax({
                    url: deleteUrl,
                    type: "DELETE",
                    success: function (response) {
                            $("#loader-overlay").hide();
                        if (response.success) {
                            statusTable.ajax.reload(null, false);
                            Swal.fire({
                                icon: "success",
                                text: "Status deleted successfully!",
                                customClass: {
                                    confirmButton: "btn btn-success waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function () {
                            $("#loader-overlay").hide();
                        Swal.fire("Error!", "An error occurred while deleting the status.", "error");
                    },
                });
            }
        });
    });

    document.getElementById("closebtn").addEventListener("click", function () {
        $("#addStatusModal").modal("hide");
    });
    $("#addStatusModal").on("hidden.bs.modal", function () {
        resetStatusForm();
    });
});

$('#statusNameEn').on('input', function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#statusNameAr').on('input', function () {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});