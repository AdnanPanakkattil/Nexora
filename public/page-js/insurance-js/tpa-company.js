$(document).ready(function () {
    $("#insurance_main_menu").addClass("active open menu-item-animating");
    $("#insurance_company_sub_menu").addClass("active");
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    var tpaTable = $("#tpa_company_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/tpa-companies/" + CURRENT_ID,
        columns: [
            { data: "insuranceCompanyId", name: "insuranceCompanyId" },
            { data: "tpaNamear", name: "tpaNamear" },
            { data: "tpaNameen", name: "tpaNameen" },
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
        $("#company_id").val("");
        $('[name="type"]').val("TPA_company");
        $("#masterCompanyId").val(CURRENT_ID);
        $("#tpaCompanyModal").modal("show");
    });
    $(document).on("click", ".edit-tpa-company", function () {
        let id = $(this).data("id");
        $(".error-text").text("");
        $("#loader-overlay").show();
        $.get(BASE_URL + "/tpa-company/" + id)
            .done(function (res) {
                let d = res.data;
                $("#company_id").val(d.insuranceTpaCompanyId);
                $('[name="insurance_name_ar"]').val(d.tpaNamear);
                $('[name="insurance_name_en"]').val(d.tpaNameEn);
                $('[name="short_name"]').val(d.shortName);
                $('[name="account_no"]').val(d.accountNumber);
                $('[name="payerCode"]').val(d.payerCode);
                $('[name="vatNumber"]').val(d.vatNumber);
                $("#masterCompanyId").val(d.insuranceCompanyId);
                $("#tpaCompanyModal").modal("show");
            })
            .fail(function (xhr) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text:
                        xhr.responseJSON?.message ||
                        "Failed to load TPA company details",
                });
            })
            .always(function () {
                $("#loader-overlay").hide();
            });
    });
    $("#saveTpaCompany").click(function () {
        $(".error-text").text("");
        let id = $("#company_id").val();
        let url = BASE_URL + "/insurance-tpa-company/" + CURRENT_ID;
        let data = $("#companyForm").serialize();
        if (id) {
            url = BASE_URL + "/insurance-tpa-company/" + CURRENT_ID + "/" + id;
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
                $("#tpaCompanyModal").modal("hide");
                Swal.fire({
                    icon: "success",
                    text: res.message,
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
                tpaTable.ajax.reload();
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
                        text:
                            xhr.responseJSON?.message || "Something went wrong",
                    });
                }
            },
        });
    });
    $("#tpa_company_table").on("click", ".delete-tpa-company", function () {
        let id = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this TPA company?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes!",
            customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton:
                    "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                $("#loader-overlay").show();
                $.ajax({
                    url: BASE_URL + "/tpa-company/" + id,
                    type: "DELETE",
                    headers: {
                        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                            "content",
                        ),
                    },
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
                            });
                            $("#tpa_company_table").DataTable().ajax.reload();
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: response.message || "Delete failed",
                            });
                        }
                    },
                    error: function (xhr) {
                        $("#loader-overlay").hide();
                        let msg =
                            xhr.responseJSON?.message || "Something went wrong";

                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: msg,
                        });
                    },
                });
            }
        });
    });
});

$("#insurance_name_en").on("input", function () {
    this.value = this.value.replace(/[^a-zA-Z ]/g, "");
});

$("#insurance_name_ar").on("input", function () {
    this.value = this.value.replace(/[^\u0600-\u06FF ]/g, "");
});
