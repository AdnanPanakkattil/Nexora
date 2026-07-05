$(document).ready(function () {
    $("#addClinicBtn").prop("checked", false);

    $("#addClinicBtn").on("change", function () {
        if ($(this).is(":checked")) {
            $("#addProviderClinicModal").modal("show");
        }
    });

    $("#addMoreClinicBtn").on("click", function () {
        $("#addProviderClinicModal").modal("show");
    });

    $("#closebtn").on("click", function () {
        $("#addProviderClinicModal").modal("hide");
    });

    let employeeId = $("#employeeId").val();

    function fetchBranches() {
        $.ajax({
            url: `/getbranchbyemployee/${employeeId}`,
            type: "GET",
            success: function (response) {
                let select = $("#branch");
                select.empty().append('<option value="">Select Branch</option>');

                $.each(response, function (key, value) {
                    select.append(`<option value="${key}">${value}</option>`);
                });
            },
            error: function (xhr) {
                console.log("Error fetching branches", xhr);
            },
        });
    }

    $("#addProviderClinicModal").on("show.bs.modal", function () {
        fetchBranches();
    });

    function loadProviderClinics() {
        $.ajax({
            url: `/getproviderclinics/${employeeId}`,
            type: "GET",
            success: function (response) {
                if (response.length > 0) {
                    $("#clinicDataContainer").show();
                    $("#addClinicBtn").prop("checked", true);
                    $("#addMoreClinicBtnContainer").show();
                } else {
                    $("#clinicDataContainer").hide();
                    $("#addClinicBtn").prop("checked", false);
                    $("#addMoreClinicBtnContainer").hide();
                }
    
                if ($.fn.DataTable.isDataTable("#provider_clinic_table")) {
                    $("#provider_clinic_table").DataTable().clear().destroy();
                }

                $("#provider_clinic_table").DataTable({
                    data: response,
                    columns: [
                        {
                            data: null,
                            render: function (data, type, row, meta) {
                                return meta.row + 1;
                            },
                        },
                        { data: "clinicName_en" },
                        { data: "clinicName_ar" },
                        { data: "branch.identifiedName_en" },
                        {
                            data: null,
                            render: function (data) {
                                return (
                                    '<div class="d-flex align-items-center">' +
                                    '<a href="#" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill delete-record" data-id="' +
                                    data.providerClinicId +
                                    '">' +
                                    '<i class="ti ti-trash ti-md"></i>' +
                                    "</a>" +
                                    "</div>"
                                );
                            },
                        },
                    ],
                });
            },
            error: function (xhr) {
                console.log("Error fetching provider clinics", xhr);
            },
        });
    }

    loadProviderClinics();

    $("#addProviderClinicForm").on("submit", function (e) {
    e.preventDefault();

    // Clear previous errors
    $(".error-text").text("");

    let formData = {
        name_en: $("#clinicNameEn").val(),
        name_ar: $("#clinicNameAr").val(),
        branch_id: $("#branch").val(),
        employee_id: employeeId,
        _token: $('meta[name="csrf-token"]').attr("content"),
    };

    $.ajax({
        url: "/provider-clinic",
        type: "POST",
        data: formData,
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: {
                        confirmButton: "btn btn-success waves-effect waves-light",
                    },
                }).then(() => {
                    $("#addProviderClinicModal").modal("hide");
                    $("#addClinicBtn").prop("checked", false);
                    $("#addProviderClinicForm")[0].reset();
                    $(".error-text").text(""); // clear on success too
                    loadProviderClinics();
                });
            }
        },
        error: function (xhr) {
            // Handle Laravel validation errors (422)
            if (xhr.status === 422 && xhr.responseJSON && xhr.responseJSON.errors) {
                let errors = xhr.responseJSON.errors;

                $.each(errors, function (field, messages) {
                    $("." + field + "_error").text(messages[0]);
                });
            } else {
                let errorMessage = "An error occurred!";
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                Swal.fire({
                    title: "Error!",
                    text: errorMessage,
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger waves-effect waves-light",
                    },
                });
            }
        },
    });
});

    $("#addClinicBtn").on("change", function () {
        if ($(this).is(":checked")) {
            $("#addProviderClinicModal").modal("show");
        } else {
            $.ajax({
                url: `/getproviderclinics/${employeeId}`,
                type: "GET",
                success: function (response) {
                    if (response.length > 0) {
                        Swal.fire({
                            title: "Are you sure?",
                            text: "Turning this off will delete all assigned clinics for this provider!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Yes, delete all!",
                            cancelButtonText: "Cancel",
                            customClass: {
                                confirmButton: "btn btn-danger waves-effect waves-light",
                                cancelButton: "btn btn-secondary waves-effect waves-light",
                            },
                        }).then((result) => {
                            if (result.isConfirmed) {
                                deleteAllProviderClinics();
                            } else {
                                $("#addClinicBtn").prop("checked", true);
                            }
                        });
                    }
                },
                error: function (xhr) {
                    console.log("Error fetching provider clinics", xhr);
                },
            });
        }
    });

    // Function to delete all provider clinics
    function deleteAllProviderClinics() {
        $.ajax({
            url: `/delete-all-provider-clinics/${employeeId}`,
            type: "DELETE",
            data: {
                _token: $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                if (response.success) {
                    Swal.fire({
                        icon: "success",
                        text: "All clinics have been deleted.",
                        customClass: {
                            confirmButton: "btn btn-success waves-effect waves-light",
                        },
                    }).then(() => {
                        $("#addClinicBtn").prop("checked", false);
                        loadProviderClinics();
                    });
                }
            },
            error: function (xhr) {
                let errorMessage = "An error occurred!";
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                Swal.fire({
                    title: "Error!",
                    text: errorMessage,
                    icon: "error",
                    confirmButtonText: "OK",
                });
            },
        });
    }

    $(document).on("click", ".delete-record", function (e) {
        e.preventDefault();
        let providerClinicId = $(this).data("id");
    
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            customClass: {
                confirmButton: "btn btn-danger waves-effect waves-light",
                cancelButton: "btn btn-secondary waves-effect waves-light",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/provider-clinic/${providerClinicId}`,
                    type: "DELETE",
                    data: {
                        _token: $('meta[name="csrf-token"]').attr("content"),
                    },
                    success: function (response) {
                        if (response.success) {
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton: "btn btn-success waves-effect waves-light",
                                },
                            }).then(() => {
                                loadProviderClinics();
                            });
                        }
                    },
                    error: function (xhr) {
                        let errorMessage = "An error occurred!";
                        if (xhr.responseJSON && xhr.responseJSON.message) {
                            errorMessage = xhr.responseJSON.message;
                        }
                        Swal.fire({
                            title: "Error!",
                            text: errorMessage,
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    },
                });
            }
        });
    });
});



