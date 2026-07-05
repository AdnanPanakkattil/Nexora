$(document).ready(function () {
    $("#insurance_main_menu").addClass("active open menu-item-animating");
    $("#insurance_payers_sub_menu").addClass("active");
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    const tagifyBasicEl = document.querySelector("#payerCode");
    const TagifyBasic = new Tagify(tagifyBasicEl);
    const buttommodaltitle = $("#insurance_payer_modal_header").data("title");
    $("#openModalBtn").click(function () {
        $("#insurancePayersModal").modal("show");
        $("#insurance_payer_id").val("");
        $("#insurance_payer_modal_header").text(buttommodaltitle);
        loadInsuranceCompanies();
    });
    $("#insurance_payer_btn").click(function () {
        var formData = $("#insurance_payer_form").serialize();
        var insurancePayerId = $("#insurance_payer_id").val();
        var ajaxUrl = insurancePayerId
            ? BASE_URL + "/update-insurance-payer/" + insurancePayerId
            : BASE_URL + "/insurance-payer";
        var method = insurancePayerId ? "PUT" : "POST";
        console.log(formData);
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
                $("#insurancePayersModal").modal("hide");
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
                    $("#insurancePayersModal").modal("hide");
                    console.error("Error fetching edit data:", xhr.message);
                    var errorMessage =
                        xhr.responseJSON && xhr.responseJSON.message
                            ? xhr.responseJSON.message
                            : "An unexpected error occurred. Please try again.";
                    Swal.fire({
                        icon: "error",
                        title: "Access denied",
                        text: errorMessage,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
        });
    });
    var dt_responsive_table = $(".dt-responsive");
    if (dt_responsive_table.length) {
        var dt_responsive = dt_responsive_table.DataTable({
            ajax: {
                url: BASE_URL + "/insurance-payers",
                dataSrc: 'data',
                data: function (d) {
                    d.filterBranchId = $("#filterBranchId").val();
                },
            },
            columns: [
                { data: "insurancePayerId" },
                { data: "CCHINumber" },
                { data: "insurance_name_ar" },
                { data: "insurance_name_en" },
                { data: "identifiedName_en" },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    render: function (data, type, full) {
                        let editUrl =
                            BASE_URL +
                            "/edit-insurance-payer/" +
                            full.insurancePayerId;
                        let deleteUrl =
                            BASE_URL +
                            "/delete-insurance-payer/" +
                            full.insurancePayerId;
                        let detailsUrl =
                            BASE_URL +
                            "/details-of-insurance-payer/" +
                            full.insurancePayerId;
                        let contractUrl =
                            BASE_URL +
                            "/assigned-insurance-services/" +
                            full.insurancePayerId;
                        return `
                <div class="d-inline-block">
                    <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                        <i class="ti ti-dots-vertical ti-md"></i>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end m-0">
                        <li><a href="javascript:;" class="dropdown-item item-edit" data-id="${editUrl}">Edit</a></li>
                        <div class="dropdown-divider"></div>
                        <li><a href="javascript:;" class="dropdown-item item-details" data-id="${detailsUrl}">Details</a></li>
                        <div class="dropdown-divider"></div>
                        <li><a href="${contractUrl}" class="dropdown-item">Contract</a></li>
                        <div class="dropdown-divider"></div>
                        <li><a href="javascript:;" class="dropdown-item text-danger item-delete" data-id="${deleteUrl}">Delete</a></li>
                    </ul>
                </div>
            `;
                    },
                },
            ],
            destroy: true,
            dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end mt-n6 mt-md-0"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
            language: {
                paginate: {
                    next: '<i class="ti ti-chevron-right ti-sm"></i>',
                    previous: '<i class="ti ti-chevron-left ti-sm"></i>',
                },
            },
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.modal({
                        header: function (row) {
                            var data = row.data();
                            return "Details of " + data["full_name"];
                        },
                    }),
                    type: "column",
                    renderer: function (api, rowIdx, columns) {
                        var data = $.map(columns, function (col, i) {
                            return col.title !== ""
                                ? '<tr data-dt-row="' +
                                      col.rowIndex +
                                      '" data-dt-column="' +
                                      col.columnIndex +
                                      '">' +
                                      "<td>" +
                                      col.title +
                                      ":" +
                                      "</td> " +
                                      "<td>" +
                                      col.data +
                                      "</td>" +
                                      "</tr>"
                                : "";
                        }).join("");
                        return data
                            ? $('<table class="table"/><tbody />').append(data)
                            : false;
                    },
                },
            },
        });

     $("#filterBranchId")
        .on("change", function () {
            dt_responsive.ajax.reload();
        });
    }

    dt_responsive_table.on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");
        $("#loader-overlay").show();
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#insurancePayersModal").modal("show");
                    $("#insurance_payer_modal_footer").show();
                    $("#insurance_payer_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", false);
                    $("#insurance_payer_modal_header").text(
                        "Update Insurance Payer",
                    );
                    loadInsuranceCompanies(function () {
                        $("#insuranceCompanyId")
                            .val(response.data.insuranceCompanyId)
                            .trigger("change");
                    });
                    console.log(response.data);
                    $("#CCHINumber").val(response.data.CCHINumber);
                    $("#clinicId")
                        .val(response.data.clinicId)
                        .trigger("change");
                    $("#insurance_payer_id").val(
                        response.data.insurancePayerId,
                    );
                }
            },
            error: function (err) {
                $("#loader-overlay").hide();
                var errorMessage =
                    err.responseJSON && err.responseJSON.message
                        ? err.responseJSON.message
                        : "An unexpected error occurred. Please try again.";
                Swal.fire({
                    icon: "error",
                    title: "Access denied",
                    text: errorMessage,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });
    $("#insurancePayersModal").on("hide.bs.modal", function () {
        var modal = $(this);
        modal.find(".select2").val(null).trigger("change");
        if (TagifyBasic) {
            TagifyBasic.removeAllTags();
        }
        modal.find(".error-text").text("");
        modal.find('input[type="hidden"]').val("");
    });
    dt_responsive_table.on("click", ".item-delete", function () {
        var deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this payer details?",
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
                            dt_responsive.ajax.reload();
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
                        console.error("Error fetching edit data:", err.message);
                        var errorMessage =
                            err.responseJSON && err.responseJSON.message
                                ? err.responseJSON.message
                                : "An unexpected error occurred. Please try again.";
                        Swal.fire({
                            icon: "error",
                            title: "Access denied",
                            text: errorMessage,
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                        });
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Please verify the patient details.)",
                    icon: "error",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });
    dt_responsive_table.on("click", ".item-details", function () {
        var editUrl = $(this).data("id");
        $("#loader-overlay").show();
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    $("#insurancePayersModal").modal("show");
                    $("#insurance_payer_modal_footer").hide();
                    $("#insurance_payer_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", true);
                    $("#insurance_payer_modal_header").text(
                        "Insurance Payer Details",
                    );
                    loadInsuranceCompanies(function () {
                        $("#insuranceCompanyId")
                            .val(response.data.insuranceCompanyId)
                            .trigger("change");
                    });
                    $("#CCHINumber").val(response.data.CCHINumber);
                    $("#clinicId")
                        .val(response.data.clinicId)
                        .trigger("change");
                    $("#insurance_payer_id").val(
                        response.data.insurancePayerId,
                    );
                    $("#insurance_payer_btn").hide();
                }
            },
            error: function (err) {
                $("#loader-overlay").hide();
                var errorMessage =
                    err.responseJSON && err.responseJSON.message
                        ? err.responseJSON.message
                        : "An unexpected error occurred. Please try again.";
                Swal.fire({
                    icon: "error",
                    title: "Access denied",
                    text: errorMessage,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });
});

function loadInsuranceCompanies(callback) {
    $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/get-insurance-companies",
        type: "GET",
        success: function (response) {
            $("#loader-overlay").hide();
            if (response.status) {
                var districtDropdown = $("#insuranceCompanyId");
                districtDropdown.empty();
                districtDropdown.append(
                    "<option value=''> Select Payer </option>",
                );
                $.each(response.data, function (key, value) {
                    districtDropdown.append(
                        '<option value="' + key + '">' + value + "</option>",
                    );
                });

                if (callback) callback();
            } else {
                console.error(
                    "Failed to retrieve insurance companies: ",
                    response.message,
                );
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
}

$("#CCHINumber").on("input", function () {
    this.value = this.value.replace(/\D/g, "");
});;