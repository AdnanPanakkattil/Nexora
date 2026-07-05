$(function () {
    $("#settings_main_menu").addClass("active open menu-item-animating");
    $("#speciality_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var specialityTable = $("#speciality_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/speciality",
            data: function (d) {
                d.type = "speciality";
            },
        },
        columns: [
            { data: "employeesFeatureId", name: "employeesFeatureId" },
            { data: "name_en", name: "name_en" },
            { data: "name_ar", name: "name_ar" },
            { data: "insuranceType", name: "insuranceType" },
            { data: "actions", name: "actions", orderable: false, searchable: false },
        ],
    });

    // Open modal for Add
    $("#addNewSpecialityBtn").on("click", function () {
        $(".error-text").text("");
        $("#addSpecialityForm")[0].reset();
        $("#addSpecialityForm").find("input, textarea, select").prop("disabled", false);
        $("#speciality_modal_header").text("Add Speciality");
        $("#speciality_modal_footer").show();
        $("#speciality_id").val("");
        $('input[name="type"]').val("speciality");
        $("#insurance_type").val("").trigger("change");
        $("#addSpecialityModal").modal("show");
    });

    // Save
    $("#specialitySaveBtn").on("click", function () {
        var formData = $("#addSpecialityForm").serialize();
        var employeesFeatureId = $("#speciality_id").val();
        var ajaxUrl = employeesFeatureId
            ? BASE_URL + "/update-speciality/" + employeesFeatureId
            : BASE_URL + "/speciality";
        var method = employeesFeatureId ? "PUT" : "POST";
  
         $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                 $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#addSpecialityModal").modal("hide");
                    specialityTable.ajax.reload(null, false);
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

    // Reset form on modal hide
    $("#addSpecialityModal").on("hidden.bs.modal", function () {
        $(".error-text").text("");
        $("#addSpecialityForm")[0].reset();
        $("#speciality_id").val("");
    });

    // Edit
    specialityTable.on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");
        $(".error-text").text("");
        $("#loader-overlay").show();
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                 $("#loader-overlay").hide();
                if (response.status === true && response.data.type === "speciality") {
                    $("#addSpecialityForm").find("input, textarea, select").prop("disabled", false);
                    $("#speciality_modal_header").text("Edit Speciality");
                    $("#speciality_modal_footer").show();
                    $("#speciality_id").val(response.data.employeesFeatureId);
                    $("#specialityNameEn").val(response.data.name_en);
                    $("#specialityNameAr").val(response.data.name_ar);
                    $('input[name="type"]').val("speciality");
                    $("#insurance_type").val(response.data.insuranceType ?? "").trigger("change");
                    $("#addSpecialityModal").modal("show");
                }
            },
            error: function (err) {
                  $("#loader-overlay").hide();
                console.error("Error fetching edit data:", err);
            },
        });
    });

    // Details
    specialityTable.on("click", ".item-details", function () {
        var detailsUrl = $(this).data("id");
    
         $("#loader-overlay").show();
        $.ajax({
            url: detailsUrl,
            method: "GET",
            success: function (response) {
                 $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#addSpecialityForm").find("input, textarea, select").prop("disabled", true);
                    $("#speciality_modal_header").text("Speciality Details");
                    $("#speciality_modal_footer").hide();
                    $("#speciality_id").val(response.data.employeesFeatureId);
                    $("#specialityNameEn").val(response.data.name_en);
                    $("#specialityNameAr").val(response.data.name_ar);
                    $("#insurance_type").val(response.data.insuranceType ?? "").trigger("change");
                    $("#addSpecialityModal").modal("show");
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

    // Delete
    specialityTable.on("click", ".item-delete", function () {
        var deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this speciality?",
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
                        if (response.status === true) {
                            specialityTable.ajax.reload(null, false);
                            $("#loader-overlay").hide();
                            Swal.fire({
                                icon: "success",
                                text: "Speciality deleted successfully!",
                                customClass: {
                                    confirmButton: "btn btn-success waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function (err) {
                        $("#loader-overlay").hide();
                        console.error("Error deleting speciality:", err);
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Speciality deletion cancelled.",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });

    document.getElementById("closebtn").addEventListener("click", function () {
        $("#addSpecialityModal").modal("hide");
    });
});

$('#specialityNameEn').on('input', function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#specialityNameAr').on('input', function () {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});