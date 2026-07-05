$(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#settings_main_menu").addClass("active open menu-item-animating");
    $("#managepayment_sub_menu").addClass("active");

    var managepaymentTable = $("#managepayment_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/managepayment",
            data: function (d) {
                d.groupKey = "paymentType";
            },
        },
        columns: [
            { data: "generalSettingsId", name: "generalSettingsId" },
            { data: "value_en", name: "value_en" },
            { data: "value_ar", name: "value_ar" },
            { data: "actions", name: "actions", orderable: false, searchable: false },
        ],
    });


    $("#addNewManagepaymentBtn").on("click", function () {
        $("#addManagepaymentForm")[0].reset();
        $(".error-text").text("");
        $("#managepayment_id").val("");
        $("#addManagepaymentForm").find("input, textarea, select").prop("disabled", false);
        $("#managepayment_modal_header").text("Add Payment Type");
        $("#managepayment_modal_footer").show();
        $("#addManagepaymentModal").modal("show");
    });

    $("#managepaymentSaveBtn").on("click", function () {
        var formData = $("#addManagepaymentForm").serialize();
        var managepaymentId = $("#managepayment_id").val();
        var ajaxUrl = managepaymentId
            ? BASE_URL + "/managepayment/" + managepaymentId
            : BASE_URL + "/managepayment";
        var method = managepaymentId ? "PUT" : "POST";
   
        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                $("#loader-overlay").hide();
                $("#addManagepaymentModal").modal("hide");
                managepaymentTable.ajax.reload(null, false);
                Swal.fire({
                    icon: "success",
                    text: response.success,
                    customClass: {
                        confirmButton: "btn btn-success waves-effect waves-light",
                    },
                });
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

    managepaymentTable.on("click", ".item-edit", function () {
        var id = $(this).data("id");

        $.get(BASE_URL + "/managepayment/" + id + "/edit", function (data) {
            $("#addManagepaymentForm").find("input, textarea, select").prop("disabled", false);
            $("#managepayment_modal_header").text("Edit Payment Type");
            $("#managepayment_modal_footer").show();
            $(".error-text").text("");
            $("#managepayment_id").val(data.generalSettingsId);
            $("#managepaymentNameEn").val(data.value_en);
            $("#managepaymentNameAr").val(data.value_ar);
            $("#addManagepaymentModal").modal("show");
        });
    });

    managepaymentTable.on("click", ".item-details", function () {
        var id = $(this).data("id");

        $("#loader-overlay").show();
        $.ajax({
            url: BASE_URL + "/managepayment/" + id + "/detail",
            method: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#addManagepaymentForm").find("input, textarea, select").prop("disabled", true);
                    $("#managepayment_modal_header").text("Payment Type Details");
                    $("#managepayment_modal_footer").hide();
                    $("#managepayment_id").val(response.data.generalSettingsId);
                    $("#managepaymentNameEn").val(response.data.value_en);
                    $("#managepaymentNameAr").val(response.data.value_ar);
                    $("#addManagepaymentModal").modal("show");
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

    managepaymentTable.on("click", ".item-delete", function () {
        var id = $(this).data("id");
        var deleteUrl = BASE_URL + "/managepayment/" + id;

        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this payment type?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes!",
            customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton: "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.isConfirmed) {
                $("#loader-overlay").show();
                $.ajax({
                    url: deleteUrl,
                    method: "DELETE",
                    success: function (response) {
                        $("#loader-overlay").hide();
                        if (response.status === true) {
                            managepaymentTable.ajax.reload(null, false);
                            Swal.fire({
                                icon: "success",
                                text: "Payment type deleted successfully!",
                                customClass: {
                                    confirmButton: "btn btn-success waves-effect waves-light",
                                },
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                text: response.message ?? "An error occurred while deleting.",
                                customClass: {
                                    confirmButton: "btn btn-danger waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function (xhr) {
                        $("#loader-overlay").hide();
                        Swal.fire({
                            icon: "error",
                            text: xhr.responseJSON?.message ?? "An error occurred while deleting.",
                            customClass: {
                                confirmButton: "btn btn-danger waves-effect waves-light",
                            },
                        });
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Payment type deletion cancelled.",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });

    document.getElementById("closebtn").addEventListener("click", function () {
        $("#addManagepaymentModal").modal("hide");
    });

    $("#addManagepaymentModal").on("hidden.bs.modal", function () {
        $("#addManagepaymentForm")[0].reset();
        $("#managepayment_id").val("");
        $(".error-text").text("");
    });
});

$('#managepaymentNameEn').on('input', function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#managepaymentNameAr').on('input', function () {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});