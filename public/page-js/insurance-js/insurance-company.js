$("#insurance_main_menu").addClass("active open menu-item-animating");
$("#insurance_company_sub_menu").addClass("active");
$.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    },
});
var companyTable = $("#insurance_company_table").DataTable({
    processing: true,
    serverSide: true,
    ajax: BASE_URL + "/insurance-company",
    columns: [
        { data: "insuranceCompanyId", name: "insuranceCompanyId" },
        { data: "insurance_name_ar", name: "insurance_name_ar" },
        { data: "insurance_name_en", name: "insurance_name_en" },
        { data: "payerCode", name: "payerCode" },
        { data: "type", name: "type" },
        {
            data: "actions",
            name: "actions",
            orderable: false,
            searchable: false,
        },
    ],
});
$(document).on("click", "#addCompanyBtn", function () {
    $("#companyForm")[0].reset();
    $("#type_select").selectpicker("val", "");
    $("#company_id").val("");
    $(".error-text").text("");
    $("#companyForm input, #companyForm select").prop("disabled", false);
    $("#insuranceCompanyButtons").show();
    $("#insuranceCompanyModal .modal-title").text("Add Insurance Company");
    $("#insuranceCompanyModal").modal("show");
    $("#typeSelectForCreate").show();
    $("#typeSelectForView").hide();
});
$(document).on("click", ".view-company", function () {
    let id = $(this).data("id");
    $(".error-text").text("");
    $("#loader-overlay").show();
    $.get(BASE_URL + "/insurance-company/" + id)
        .done(function (res) {
            let d = res.data;
            $("#typeSelectForCreate").hide();
            $("#typeSelectForView").show();
            $("#company_id").val(d.insuranceCompanyId);
            $('[name="insurance_name_ar"]').val(d.insurance_name_ar);
            $('[name="insurance_name_en"]').val(d.insurance_name_en);
            $('[name="short_name"]').val(d.short_name);
            $('[name="account_no"]').val(d.account_no);
            $('[name="payerCode"]').val(d.payerCode);
            $('[name="vatNumber"]').val(d.vatNumber);
            let typeText = d.type === "insurance" ? "Insurance" : "TPA Company";
            $("#type_view").val(typeText);
            $("#companyForm input, #companyForm select").prop("disabled", true);
            $("#insuranceCompanyButtons").hide();
            $("#insuranceCompanyModal .modal-title").text(
                "View Insurance Company",
            );
            $("#insuranceCompanyModal").modal("show");
        })
        .fail(function () {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load company details",
            });
        })
        .always(function () {
            $("#loader-overlay").hide();
        });
});
$(document).on("click", ".edit-company", function () {
    let id = $(this).data("id");
    $(".error-text").text("");
    $("#loader-overlay").show();
    $.get(BASE_URL + "/insurance-company/" + id)
        .done(function (res) {
            let d = res.data;
            $("#company_id").val(d.insuranceCompanyId);
            $('[name="insurance_name_ar"]').val(d.insurance_name_ar);
            $('[name="insurance_name_en"]').val(d.insurance_name_en);
            $('[name="short_name"]').val(d.short_name);
            $('[name="account_no"]').val(d.account_no);
            $('[name="payerCode"]').val(d.payerCode);
            $('[name="vatNumber"]').val(d.vatNumber);
            $("#type_select").selectpicker("val", d.type);
            $("#companyForm input, #companyForm select").prop(
                "disabled",
                false,
            );
            $("#saveCompany").show();
            $("#insuranceCompanyButtons").show();
            $("#typeSelectForCreate").show();
            $("#typeSelectForView").hide();
            $("#insuranceCompanyModal .modal-title").text(
                "Edit Insurance Company",
            );
            $("#insuranceCompanyModal").modal("show");
        })
        .fail(function () {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load company details",
            });
        })
        .always(function () {
            $("#loader-overlay").hide();
        });
});
$("#saveCompany").click(function () {
    $(".error-text").text("");
    let id = $("#company_id").val();
    let url = BASE_URL + "/insurance-company";
    let data = $("#companyForm").serialize();
    if (id) {
        url += "/" + id;
        data += "&_method=PUT";
    }
    $("#loader-overlay").show();
    $.ajax({
        url: url,
        type: "POST",
        data: data,
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        success: function (res) {
            $("#loader-overlay").hide();
            $("#insuranceCompanyModal").modal("hide");
            Swal.fire({
                icon: "success",
                text: res.message,
                customClass: {
                    confirmButton: "btn btn-success waves-effect waves-light",
                },
            });
            companyTable.ajax.reload();
        },
        error: function (xhr) {
            $("#loader-overlay").hide();
            if (xhr.status === 422) {
                $.each(xhr.responseJSON.errors, function (key, value) {
                    $("." + key + "_error").text(value[0]);
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: xhr.responseJSON?.message || "Something went wrong",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            }
        },
    });
});
$(document).on("click", ".delete-company", function () {
    let id = $(this).data("id");
    Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this company?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete!",
        customClass: {
            confirmButton: "btn btn-danger me-3 waves-effect waves-light",
            cancelButton: "btn btn-label-secondary waves-effect waves-light",
        },
        buttonsStyling: false,
    }).then((result) => {
        if (result.isConfirmed) {
            $("#loader-overlay").show();
            $.ajax({
                url: BASE_URL + "/insurance-company/" + id,
                type: "POST",
                data: {
                    _method: "DELETE",
                    _token: $('meta[name="csrf-token"]').attr("content"),
                },
                success: function (res) {
                    $("#loader-overlay").hide();
                    Swal.fire({
                        icon: "success",
                        text: res.message,
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    });
                    companyTable.ajax.reload();
                },
                error: function (xhr) {
                    $("#loader-overlay").hide();
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: xhr.responseJSON?.message || "Delete failed",
                    });
                },
            });
        }
    });
});
$(document).on("click", ".tpa-company", function () {
    let id = $(this).data("id");
    window.location.href = BASE_URL + "/tpa-companies/" + id;
});

$("#insurance_name_en").on("input", function () {
    this.value = this.value.replace(/[^a-zA-Z ]/g, "");
});

$("#insurance_name_ar").on("input", function () {
    this.value = this.value.replace(/[^\u0600-\u06FF ]/g, "");
});
