$(document).ready(function () {
    $("#accounts_main_menu").addClass("active open menu-item-animating");
    $("#sub_account_head_sub_menu").addClass("active");


    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#subAccountHeadTable").DataTable({
        ajax: {
            url: "/get-subaccount-head",
            dataSrc: "",
        },
        columns: [
            {
                data: null,
                className: "text-center",
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                },
            },
            {
                data: "account_head.accountHeadName",
                className: "text-center",
            },
            {
                data: "account_head.accountHeadCode",
                className: "text-center",
            },
            {
                data: "subAccountHeadName",
                className: "text-center",
            },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    const editUrl =
                        "/edit-subaccount-head/" + row.subAccountHeadId;
                    const deleteUrl =
                        "/delete-subaccount-head/" + row.subAccountHeadId;

                    return (
                        '<div class="d-flex align-items-center">' +
                        '<a href="' +
                        editUrl +
                        '" id="edit" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill me-1">' +
                        '<i class="ti ti-pencil ti-md"></i>' +
                        "</a>" +
                        '<a href="' +
                        deleteUrl +
                        '" id="delete" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill me-1">' +
                        '<i class="ti ti-trash ti-md"></i>' +
                        "</a>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    $.ajax({
        url: "/getaccounthead",
        method: "GET",
        success: function (data) {
            var select = $("#selectpickerLiveSearch");
            select
                .empty()
                .append('<option value="">Select Account Head</option>');

            $.each(data, function (key, value) {
                select.append(
                    '<option value="' +
                        value.accountHeadId +
                        '">' +
                        value.accountHeadName +
                        "</option>"
                );
            });

            select.selectpicker("refresh");
        },
    });

    $("#saveBtn").on("click", function () {
        let isUpdate = $(this).data("update");
        let id = $(this).data("id");

        const ajaxUrl = isUpdate
            ? `/edit-subaccount-head/${id}`
            : "/accounting/sub-account-head";
        const ajaxType = isUpdate ? "PUT" : "POST";
        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            method: ajaxType,
            data: {
                accountHeadId: $("#selectpickerLiveSearch").val(),
                subAccountHeadCode: $("#subAccountCode").val(),
                subAccountHeadName: $("#subAccountHead").val(),
                type:
                    $('input[name="inlineRadioOptions"]:checked').val() !==
                    "none"
                        ? $('input[name="inlineRadioOptions"]:checked').val()
                        : null,
                referenceId:
                    $('input[name="inlineRadioOptions"]:checked').val() !==
                    "none"
                        ? $("#radio_select").val()
                        : null,
            },

            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                $("#loader-overlay").hide();
                Swal.fire({
                    title: "Success!",
                    text: response.message,
                    icon: "success",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                    buttonsStyling: false,
                }).then(function () {
                    location.reload();
                });
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    let errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    if (errors.accountHeadId)
                        $(".accountHead_error").text(errors.accountHeadId[0]);
                    if (errors.subAccountHeadCode)
                        $(".card_sub_account_code_error").text(
                            errors.subAccountHeadCode[0]
                        );
                    if (errors.subAccountHeadName)
                        $(".subAccountHead_error").text(
                            errors.subAccountHeadName[0]
                        );
                }
            },
        });
    });

    $(document).on("click", "#edit", function (e) {
        e.preventDefault();
        const url = $(this).attr("href");

        $.get(url, function (data) {
            $("#selectpickerLiveSearch")
                .val(data.accountHeadId)
                .selectpicker("refresh");
            $("#subAccountCode").val(data.subAccountHeadCode);
            $("#subAccountHead").val(data.subAccountHeadName);

            $("#saveBtn")
                .text("Update")
                .data("update", true)
                .data("id", data.subAccountHeadId);
        });
    });

    $(document).on("click", "#delete", function (e) {
        e.preventDefault();
        const url = $(this).attr("href");

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            customClass: {
                confirmButton: "btn btn-danger",
                cancelButton: "btn btn-secondary ms-2",
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: url,
                    method: "DELETE",
                    headers: {
                        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                            "content"
                        ),
                    },
                    success: function (res) {
                        Swal.fire({
                            title: "Success!",
                            text: res.message,
                            icon: "success",
                            confirmButtonText: "OK",
                            customClass: {
                                confirmButton: "btn btn-success",
                            },
                            buttonsStyling: false,
                        }).then(function () {
                            $("#subAccountHeadTable").DataTable().ajax.reload();
                        });
                    },
                    error: function () {
                        Swal.fire(
                            "Error",
                            "Could not delete the item",
                            "error"
                        );
                    },
                });
            }
        });
    });

    const $select = $("#radio_select");
    const $wrapper = $("#radio_select_wrapper");
    const $subAccountHeadWrapper = $("#sub_account_head_wrapper");
    const $subAccountCodeWrapper = $("#sub_account_code_wrapper");
    const $subAccountHead = $("#subAccountHead");
    const $subAccountCode = $("#subAccountCode");

    function initSelect2(url, placeholder) {
        $select.select2({
            placeholder: placeholder,
            allowClear: true,
            minimumInputLength: 2,
            ajax: {
                url: url,
                dataType: "json",
                delay: 300,
                data: function (params) {
                    return {
                        search: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.map((item) => ({
                            id:
                                item.regularCustomerId ||
                                item.clientId ||
                                item.vendorId,
                            text:
                                item.customerName ||
                                item.clientName_en ||
                                item.vendor_name_en,
                            code:
                                item.customerNo ||
                                item.clientId ||
                                item.vendor_code,
                        })),
                    };
                },
            },
        });
    }

    $('input[name="inlineRadioOptions"]').change(function () {
        const selectedValue = $(this).val();
        let ajaxUrl = "",
            placeholderText = "";

        switch (selectedValue) {
            case "vendor":
                ajaxUrl = "/get-vendors";
                placeholderText = "Search Vendor";
                break;
            case "customer":
                ajaxUrl = "/get-customers";
                placeholderText = "Search Customer";
                break;
            case "patient":
                ajaxUrl = "/get-clients";
                placeholderText = "Search Patient";
                break;
            default:
                $wrapper.hide();
                $select.empty().select2("destroy");
                $subAccountHeadWrapper.show();
                $subAccountCodeWrapper.show();
                $subAccountHead.val("");
                $subAccountCode.val("");
                return;
        }

        $wrapper.show();
        $subAccountHeadWrapper.hide();
        $subAccountCodeWrapper.hide();
        if ($.fn.select2 && $select.data("select2")) {
            $select.select2("destroy");
        }
        $select.empty();
        initSelect2(ajaxUrl, placeholderText);
    });

    $select.on("select2:select", function (e) {
        $("#subAccountCode").val(e.params.data.code);
        $("#subAccountHead").val(e.params.data.text);
    });
});
