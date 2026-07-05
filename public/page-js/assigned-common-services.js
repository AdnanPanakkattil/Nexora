$(document).ready(function () {
    $("#service_main_menu").addClass("active open menu-item-animating");
    $("#common_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#addNewServiceToCommonBtn").click(function () {
        $("#service_form")[0].reset();
        $("#individual_service_id").val("");
        $(".error-text").text("");
        $("#employeeId").val("").trigger("change");
        $("#categoryId").val("").trigger("change");
        $("#type").val("").trigger("change");
        $("#taxId").val("").trigger("change");

        $("#exLargeModal").modal("show");
        $("#individual_header").text("Add New Common Service");
        $("#ex_arge_modal_footer").show();
        $("#service_form")
            .find("input, textarea, select, button")
            .prop("disabled", false);
    });

    var dt_service_group_table = $(".service-group-table");
    var dataTableInstance = null;

    var assignedCommonServiceTable = $(
        "#assigned_common_services_table",
    ).DataTable({
        processing: true,
        serverSide: true,
        ajax:
            BASE_URL +
            "/assigned-services-to-common-services/" +
            $("#groupId").val(),

        dom:
            "<'row mb-2'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        columns: [
            {
                data: "checkbox",
                name: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_service" value="' +
                        full.serviceId +
                        '">'
                    );
                },
            },
            { data: "serviceId", name: "serviceId" },
            { data: "serviceCode", name: "serviceCode" },
            { data: "medicalCode", name: "medicalCode" },
            { data: "serviceName_en", name: "serviceName_en" },
            { data: "serviceName_ar", name: "serviceName_ar" },
            { data: "duration", name: "duration" },
            { data: "categoryId", name: "categoryId" },
            { data: "cost", name: "cost" },
            {
                data: "actions",
                name: "actions",
                orderable: false,
                searchable: false,
            },
        ],
    });

    var nameEnPattern = /[^a-zA-Z0-9\s\-'\.]/;
    var nameArPattern = /[^a-zA-Z0-9\u0600-\u06FF\s\-'\.؟،]/;

    $("#serviceName_en").on("input", function () {
        $(this).val(
            $(this)
                .val()
                .replace(/[^a-zA-Z0-9\s\-'\.]/g, ""),
        );
    });

    $("#serviceName_ar").on("input", function () {
        $(this).val(
            $(this)
                .val()
                .replace(/[^a-zA-Z0-9\u0600-\u06FF\s\-'\.؟،]/g, ""),
        );
    });

    function validateServiceForm() {
        var isValid = true;
        $(".error-text").text("");

        var fields = [
            {
                id: "#employeeId",
                errorClass: ".employeeId_error",
                label: "Employee",
                type: "select",
            },
            {
                id: "#serviceCode",
                errorClass: ".serviceCode_error",
                label: "Service Code",
                type: "text",
            },
            {
                id: "#medicalCode",
                errorClass: ".medicalCode_error",
                label: "IC Code 10",
                type: "text",
            },
            {
                id: "#serviceName_en",
                errorClass: ".serviceName_en_error",
                label: "Service Name (English)",
                type: "name_en",
            },
            {
                id: "#serviceName_ar",
                errorClass: ".serviceName_ar_error",
                label: "Service Name (Arabic)",
                type: "name_ar",
            },
            {
                id: "#categoryId",
                errorClass: ".categoryId_error",
                label: "Category",
                type: "select",
            },
            {
                id: "#type",
                errorClass: ".type_error",
                label: "Service Type",
                type: "select",
            },
            {
                id: "#taxId",
                errorClass: ".taxId_error",
                label: "VAT",
                type: "select",
            },
            {
                id: "#cost",
                errorClass: ".cost_error",
                label: "Price",
                type: "number",
            },
            {
                id: "#duration",
                errorClass: ".duration_error",
                label: "Duration",
                type: "number",
            },
            {
                id: "#oneDayBookingLimits",
                errorClass: ".oneDayBookingLimits_error",
                label: "One Day Booking Limit",
                type: "number",
            },
        ];

        fields.forEach(function (field) {
            var val = $(field.id).val();
            if (
                !val ||
                val.trim() === "" ||
                (val === "0" && field.type === "select")
            ) {
                if (field.type === "select" && (!val || val === "")) {
                    $(field.errorClass).text(field.label + " is required.");
                    isValid = false;
                    return;
                }
                if (field.type !== "select" && (!val || val.trim() === "")) {
                    $(field.errorClass).text(field.label + " is required.");
                    isValid = false;
                    return;
                }
            }

            if (field.type === "name_en" && val && nameEnPattern.test(val)) {
                $(field.errorClass).text(
                    field.label + " must not contain special characters.",
                );
                isValid = false;
            }

            if (field.type === "name_ar" && val && nameArPattern.test(val)) {
                $(field.errorClass).text(
                    field.label + " must not contain special characters.",
                );
                isValid = false;
            }
        });

        return isValid;
    }

    $("#service_group_btn").click(function () {
        var formData = $("#service_group_form").serialize();
        var serviceGroupId = $("#group_id").val();
        var ajaxUrl = serviceGroupId
            ? BASE_URL + "/update-service-group/" + serviceGroupId
            : BASE_URL + "/service-group";
        var method = serviceGroupId ? "PUT" : "POST";

        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                if (response.status === true) {
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    }).then(function () {
                        location.reload();
                    });
                }
                $("#largeModal").modal("hide");
            },
            error: function (xhr, status, error) {
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    console.error("Error:", xhr);
                }
            },
        });
    });

    dt_service_group_table.on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $(".error-text").text("");
                    $("#exLargeModal").modal("show");
                    $("#ex_arge_modal_footer").show();
                    $("#individual_header").text("Update service");

                    $("#service_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", false);

                    $("#individual_service_id").val(response.data.serviceId);
                    $("#employeeId")
                        .val(response.data.employeeId)
                        .trigger("change");
                    $("#serviceCode").val(response.data.serviceCode);
                    $("#medicalCode").val(response.data.medicalCode);
                    $("#serviceName_en").val(response.data.serviceName_en);
                    $("#serviceName_ar").val(response.data.serviceName_ar);
                    $("#categoryId")
                        .val(response.data.categoryId)
                        .trigger("change");
                    $("#type")
                        .val(response.data.appointmentType)
                        .trigger("change");
                    $("#taxId").val(response.data.taxId).trigger("change");
                    $("#cost").val(response.data.cost);
                    $("#duration").val(response.data.duration);
                    $("#oneDayBookingLimits").val(
                        response.data.oneDayBookingLimits,
                    );
                }
            },
            error: function (err) {
                console.error("Error fetching edit data:", err);
            },
        });
    });

    dt_service_group_table.on("click", ".item-details", function () {
        var editUrl = $(this).data("id");

        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $(".error-text").text("");
                    $("#exLargeModal").modal("show");
                    $("#ex_arge_modal_footer").hide();
                    $("#individual_header").text("Detail Of Service");

                    $("#service_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", true);

                    $("#individual_service_id").val(response.data.serviceId);
                    $("#employeeId").val(response.data.employeeId);
                    $("#serviceCode").val(response.data.serviceCode);
                    $("#medicalCode").val(response.data.medicalCode);
                    $("#serviceName_en").val(response.data.serviceName_en);
                    $("#serviceName_ar").val(response.data.serviceName_ar);
                    $("#categoryId").val(response.data.categoryId);
                    $("#type").val(response.data.appointmentType);
                    $("#taxId").val(response.data.taxId);
                    $("#cost").val(response.data.cost);
                    $("#duration").val(response.data.duration);
                    $("#oneDayBookingLimits").val(
                        response.data.oneDayBookingLimits,
                    );
                }
            },
            error: function (err) {
                console.error("Error fetching edit data:", err);
            },
        });
    });

    dt_service_group_table.on("click", ".item-delete", function () {
        var deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this service?",
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
                    method: "DELETE",
                    success: function (response) {
                        $("#loader-overlay").hide();
                        if (response.status === true) {
                            assignedCommonServiceTable.ajax.reload(null, false);
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton:
                                        "btn btn-success waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function (err) {
                        $("#loader-overlay").hide();
                        console.error("Error fetching edit data:", err);
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Please verify the service group.",
                    icon: "error",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });

    $(".createServiceBtn").click(function () {
        if (!validateServiceForm()) {
            return;
        }

        var formData = $("#service_form").serialize();
        var individualServiceId = $("#individual_service_id").val();
        var commonServiceId = $("#common_service_id").val();
        formData +=
            "&clinicServicesGroupId=" + encodeURIComponent(commonServiceId);

        var ajaxUrl = individualServiceId
            ? BASE_URL +
              "/update-assigned-service-to-common-service/" +
              individualServiceId
            : BASE_URL + "/assign-service-to-common-service";
        var method = individualServiceId ? "PUT" : "POST";
        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    }).then(function () {
                        location.reload();
                    });
                }
                $("#largeModal").modal("hide");
            },
            error: function (xhr, status, error) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    console.error("Error:", xhr);
                }
            },
        });
    });

    $("#select_all").on("click", function () {
        var rows = assignedCommonServiceTable
            .rows({ search: "applied" })
            .nodes();
        $('input[type="checkbox"]', rows).prop("checked", this.checked);
        updateSelectedCount();
    });

    $("#assigned_common_services_table tbody").on(
        "change",
        'input[type="checkbox"]',
        function () {
            if (!this.checked) {
                var el = $("#select_all").get(0);
                if (el && el.checked && "indeterminate" in el) {
                    el.indeterminate = true;
                }
            }
            updateSelectedCount();
        },
    );

    $("#delete_selected").on("click", function () {
        var selectedIds = $('input[name="select_service"]:checked')
            .map(function () {
                return $(this).val();
            })
            .get();

        if (selectedIds.length > 0) {
            Swal.fire({
                title: "Are you sure?",
                text: "You want to delete this service?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes!",
                customClass: {
                    confirmButton:
                        "btn btn-primary me-3 waves-effect waves-light",
                    cancelButton:
                        "btn btn-label-secondary waves-effect waves-light",
                },
                buttonsStyling: false,
            }).then(function (result) {
                if (result.value) {
                    $("#loader-overlay").show();
                    $.ajax({
                        url:
                            BASE_URL +
                            "/delete-selected-assigned-common-services",
                        method: "DELETE",
                        data: { ids: selectedIds },
                        success: function (response) {
                            $("#loader-overlay").hide();
                            if (response.status === true) {
                                assignedCommonServiceTable.ajax.reload(
                                    null,
                                    false,
                                );

                                Swal.fire({
                                    icon: "success",
                                    text: response.message,
                                    customClass: {
                                        confirmButton:
                                            "btn btn-success waves-effect waves-light",
                                    },
                                }).then(function () {
                                    location.reload();
                                });
                            }
                        },
                        error: function (err) {
                            $("#loader-overlay").hide();
                            console.error("Error fetching edit data:", err);
                        },
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        title: "Cancelled",
                        text: "Please verify the service common group.",
                        icon: "error",
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    });
                }
            });
        } else {
            alert("No services selected");
        }
    });
});

function updateSelectedCount() {
    var selectedCount = $('input[name="select_service"]:checked').length;
    $("#selected_count").text(selectedCount);
    if (selectedCount > 0) {
        $("#bulk_select").show();
        $("#selected_count").text(selectedCount);
    } else {
        $("#bulk_select").hide();
    }
}
$('#serviceName_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#serviceName_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});