$(function () {
    $("#settings_main_menu").addClass("active open menu-item-animating");
    $("#department_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#departmentDropdown").select2({
        dropdownParent: $("#addDepartmentModal"),
        width: "100%"
    });

    document.getElementById("addDepartmentForm").setAttribute("novalidate", true);

    var departmentTable = $("#department_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/department",
            data: function (d) {
                d.type = "department";
            },
        },
        columns: [
            { data: "employeesFeatureId", name: "employeesFeatureId" },
            { data: "name_en", name: "name_en" },
            { data: "name_ar", name: "name_ar" },
            { data: "speciality_name_en", name: "speciality_name_en" },
            { data: "actions", name: "actions", orderable: false, searchable: false },
        ],
    });

    function loadSpecialties(selectedSpecialtyId = null, disabled = false) {
        $.ajax({
            url: BASE_URL + "/specialties",
            method: "GET",
            success: function (response) {
                if (response.status) {
                    var dropdown = $("#departmentDropdown");
                    dropdown.empty();
                    dropdown.append('<option value="">Select Speciality</option>');

                    $.each(response.data, function (index, speciality) {
                        var selected = selectedSpecialtyId &&
                            selectedSpecialtyId == speciality.employeesFeatureId
                            ? "selected" : "";
                        dropdown.append(
                            '<option value="' + speciality.employeesFeatureId + '" ' + selected + '>' +
                            speciality.name_en + '</option>'
                        );
                    });

                    dropdown.prop("disabled", disabled).trigger("change");

                    dropdown.select2({
                        dropdownParent: $("#addDepartmentModal"),
                        width: "100%"
                    });

                    $(".speciality_employeesFeatureId_error").text("");
                }
            },
            error: function (error) {
                console.log("Error fetching specialties:", error);
            },
        });
    }

    
    $("#departmentSaveBtn").on("click", function () {
        $("#addDepartmentForm")[0].reset();
        $("#department_id").val("");
        $(".error-text").text("");
        $("#addDepartmentForm").find("input, textarea, select").prop("disabled", false);
        $("#department_modal_header").text("Add Department");
        $("#department_modal_footer").show();
        loadSpecialties();
        $("#addDepartmentModal").modal("show");
    });

    $("#addDepartmentForm").on("submit", function (e) {
        e.preventDefault();
        $(".error-text").text("");

        var hasError = false;

        if (!$("#departmentDropdown").val()) {
            $(".speciality_employeesFeatureId_error").text("The speciality is required.");
            hasError = true;
        }
        if (!$("#departmentNameEn").val().trim()) {
            $(".name_en_error").text("The name in English is required.");
            hasError = true;
        }
        if (!$("#departmentNameAr").val().trim()) {
            $(".name_ar_error").text("The name in Arabic is required.");
            hasError = true;
        }
        if (hasError) return;

        var formData = $(this).serialize();
        var employeesFeatureId = $("#department_id").val();
        var ajaxUrl = employeesFeatureId
            ? BASE_URL + "/update-department/" + employeesFeatureId
            : BASE_URL + "/department";
        var method = employeesFeatureId ? "PUT" : "POST";

        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status) {
                    departmentTable.ajax.reload(null, false);
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: {
                            confirmButton: "btn btn-success waves-effect waves-light",
                        },
                    });
                    $("#addDepartmentModal").modal("hide");
                    $("#addDepartmentForm")[0].reset();
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
                        text: "An error occurred while processing the department.",
                        customClass: {
                            confirmButton: "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
        });
    });

    // Edit
    departmentTable.on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");

         $("#loader-overlay").show();
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                 $("#loader-overlay").hide();
                if (response.status === true) {
                    $(".error-text").text("");
                    $("#addDepartmentForm").find("input, textarea, select").prop("disabled", false);
                    $("#department_modal_header").text("Edit Department");
                    $("#department_modal_footer").show();
                    $("#department_id").val(response.data.employeesFeatureId);
                    $("#departmentNameEn").val(response.data.name_en);
                    $("#departmentNameAr").val(response.data.name_ar);
                    loadSpecialties(response.data.speciality_employeesFeatureId);
                    $("#addDepartmentModal").modal("show");
                }
            },
            error: function (err) {
                 $("#loader-overlay").hide();
                console.error("Error fetching edit data:", err);
            },
        });
    });

    // Details
    departmentTable.on("click", ".item-details", function () {
        var detailsUrl = $(this).data("id");

        $("#loader-overlay").show();
        $.ajax({
            url: detailsUrl,
            method: "GET",
            success: function (response) {
                    $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#addDepartmentForm").find("input, textarea, select").prop("disabled", true);
                    $("#department_modal_header").text("Department Details");
                    $("#department_modal_footer").hide();
                    $("#department_id").val(response.data.employeesFeatureId);
                    $("#departmentNameEn").val(response.data.name_en);
                    $("#departmentNameAr").val(response.data.name_ar);
                    loadSpecialties(response.data.speciality_employeesFeatureId, true);
                    $("#addDepartmentModal").modal("show");
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
    departmentTable.on("click", ".item-delete", function () {
        var deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this department?",
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
                            departmentTable.ajax.reload(null, false);
                            Swal.fire({
                                icon: "success",
                                text: "Department deleted successfully!",
                                customClass: {
                                    confirmButton: "btn btn-success waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function (err) {
                        $("#loader-overlay").hide();
                        console.error("Error deleting department:", err);
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Department deletion cancelled.",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });

    // Close Button
    $("#closebtn").on("click", function () {
        $("#addDepartmentModal").modal("hide");
    });

    // Reset Modal
    $("#addDepartmentModal").on("hidden.bs.modal", function () {
        $("#addDepartmentForm")[0].reset();
        $("#department_id").val("");
        $(".error-text").text("");
        $("#departmentDropdown").val("").trigger("change");
    });

    // Clear Errors
    $(document).on("change", "#departmentDropdown", function () {
        $(".speciality_employeesFeatureId_error").text("");
    });

    $("#departmentNameEn").on("input", function () {
        $(".name_en_error").text("");
    });

    $("#departmentNameAr").on("input", function () {
        $(".name_ar_error").text("");
    });
});

$('#departmentNameEn').on('input', function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#departmentNameAr').on('input', function () {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});