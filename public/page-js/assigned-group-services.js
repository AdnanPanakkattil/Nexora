$(document).ready(function () {
    $("#service_main_menu").addClass("active open menu-item-animating");
    $("#group_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // $("#addNewServiceGroupBtn").click(function () {
    //     $("#serviceGroupModal").modal("show");
    //     $('#service_group_header').text('Add New Group');
    //     // $("#insurance_payer_id").val("");
    //     // loadInsuranceCompanies();
    // });
    $("#addNewServiceToGroupBtn").click(function () {
        $("#exLargeModal").modal("show");
        $("#individual_header").text("Add New Individual Service");
    });

    $("#addNewServiceGroupBtn").click(function () {
        $("#groupModal").modal("show");
    });

    var dt_service_group_table = $(".service-group-table");
    var dataTableInstance = null;

    var assignedTemplateServiceTable = $(
        "#assigned_template_services_table"
    ).DataTable({
        processing: true,
        serverSide: true,
        ajax:
            BASE_URL + "/assigned-services-to-template/" + $("#groupId").val(),
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

    // if (dt_service_group_table.length) {

    //     dt_service_group_table.DataTable({
    //         dom: "<'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6 dataTables_pager'p>>",
    //         ajax: {
    //             url: BASE_URL + "/assigned-services-to-template/"+$('#groupId').val(),
    //             type: 'GET'
    //         },
    //         processing: true,
    //         serverSide: true,
    //         columns: [
    //             { data: 'serviceId' },
    //             { data: 'serviceCode' },
    //             { data: 'medicalCode' },
    //             { data: 'serviceName_en' },
    //             { data: 'serviceName_ar' },
    //             { data: 'duration' },
    //             { data: 'categoryId' },
    //             // { data: 'serviceId' },
    //             { data: 'cost' },
    //             // { data: 'disType' },
    //             // { data: 'referralCost' },
    //             // { data: 'serviceId' },
    //             // { data: 'serviceId' },
    //             { data: 'actions' },
    //             // {
    //             //     data: null, // Add this to handle the actions column
    //             //     orderable: false,
    //             //     searchable: false,
    //             //     render: function (data, type, full, meta) {
    //             //         var editUrl = BASE_URL + "/edit-service-group/" + full.serviceId;
    //             //         var detailsUrl = BASE_URL + "/detail-of-service-group/" + full.serviceId;
    //             //         var deleteUrl = BASE_URL + "/delete-service-group/" + full.serviceId;
    //             //         var assignedServicesUrl = BASE_URL + "/assigned-services/" + full.serviceId;

    //             //         return (
    //             //             '<div class="d-inline-block">' +
    //             //             '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
    //             //             '<ul class="dropdown-menu dropdown-menu-end m-0">' +
    //             //             '<li><a href="javascript:;" class="dropdown-item item-details" data-id="'+detailsUrl+'">Details</a></li>' +
    //             //             '<div class="dropdown-divider"></div>' +
    //             //             '<li><a href="javascript:;" class="dropdown-item text-danger item-delete" data-id="' + deleteUrl + '">Delete</a></li>' +
    //             //             "</ul>" +
    //             //             "</div>" +
    //             //             '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon item-edit" data-id="' + editUrl + '"><i class="ti ti-pencil ti-md"></i></a>'+
    //             //             '<a href="' + assignedServicesUrl + '" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill" ><i class="ti ti-eye ti-md"></i></a>'
    //             //         );
    //             //     }
    //             // }
    //         ],
    //         language: {
    //             paginate: {
    //                 next: '<i class="ti ti-chevron-right ti-sm"></i>',
    //                 previous: '<i class="ti ti-chevron-left ti-sm"></i>'
    //             }
    //         },
    //         orderCellsTop: true,
    //         responsive: true
    //         // orderCellsTop: true,
    //             // responsive: true,
    //             // searchDelay: 500
    //     });
    // }

    $(".createServiceBtn").click(function () {
        var formData = $("#service_form").serialize();
        var individualServiceId = $("#individual_service_id").val();
        var commonServiceId = $("#common_service_id").val();
        // formDataArray.push({ name: "clinicServicesGroupId", value: commonServiceId });
        formData +=
            "&clinicServicesGroupId=" + encodeURIComponent(commonServiceId);
        // Convert the array back into a query string format
        // var formData = $.param(formDataArray);
        var ajaxUrl = individualServiceId
            ? BASE_URL +
              "/update-assigned-service-to-group/" +
              individualServiceId
            : BASE_URL + "/assign-service-to-group";
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
                $("#largeModal").modal("hide"); // Hide modal on success
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

    dt_service_group_table.on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");

        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#exLargeModal").modal("show");
                    $("#ex_arge_modal_footer").show();
                    $("#individual_header").text("Update Individual service");

                    $("#service_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", false);

                    $("#individual_service_id").val(response.data.serviceId);
                    $("#employeeId").val(response.data.employeeId);
                    $("#serviceCode").val(response.data.serviceCode);
                    $("#medicalCode").val(response.data.medicalCode);
                    $("#serviceName_en").val(response.data.serviceName_en);
                    $("#serviceName_ar").val(response.data.serviceName_ar);
                    $("#categoryId").val(response.data.categoryId);
                    console.log(response.data);
                    $("#type").val(response.data.appointmentType);
                    $("#taxId").val(response.data.taxId);
                    $("#cost").val(response.data.cost);
                    $("#duration").val(response.data.duration);
                    $("#oneDayBookingLimits").val(
                        response.data.oneDayBookingLimits
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
                            assignedTemplateServiceTable.ajax.reload();
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

    dt_service_group_table.on("click", ".item-details", function () {
        var editUrl = $(this).data("id");

        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#exLargeModal").modal("show");
                    $("#ex_arge_modal_footer").hide();
                    $("#individual_header").text("Details Of Service");

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
                        response.data.oneDayBookingLimits
                    );
                }
            },
            error: function (err) {
                console.error("Error fetching edit data:", err);
            },
        });
    });

    $("#select_all").on("click", function () {
        var rows = assignedTemplateServiceTable
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
        }
    );

    $("#delete_selected").on("click", function () {
        var selectedIds = $('input[name="select_service"]:checked')
            .map(function () {
                return $(this).val();
            })
            .get();
        console.log(selectedIds);
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
                    $.ajax({
                        url:
                            BASE_URL +
                            "/delete-selected-assigned-template-services",
                        method: "DELETE",
                        data: {
                            ids: selectedIds,
                        },
                        success: function (response) {
                            if (response.status === true) {
                                assignedTemplateServiceTable.ajax.reload(
                                    null,
                                    false
                                );
                                dataTableInstance.ajax.reload();

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
    // alert(selectedCount);
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
$("#exLargeModal").on("hidden.bs.modal", function () {
    $("#service_form")[0].reset();
    $("#individual_service_id").val("");
    $(".error-text").text("");
    $("#employeeId").val("").trigger("change");
    $("#categoryId").val("").trigger("change");
    $("#type").val("").trigger("change");
    $("#taxId").val("").trigger("change");
});