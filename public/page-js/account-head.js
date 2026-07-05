$(document).ready(function () {
    $("#accounts_main_menu").addClass("active open menu-item-animating");
    $("#account_head_sub_menu").addClass("active");


    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });


    $("#accountHeadTable").DataTable({
        ajax: {
            url: "/get-account-head",
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
                data: "account_type.accountType",
                className: "text-center",
            },
            {
                data: "accountHeadCode",
                className: "text-center",
            },
            {
                data: "accountHeadName",
                className: "text-center",
            },
        ],
    });

    $.ajax({
        url: "/get-account-types",
        method: "GET",
        success: function (data) {
            var select = $("#selectpickerLiveSearch");
            select
                .empty()
                .append('<option value="">Select Account Type</option>');

            $.each(data, function (key, value) {
                select.append(
                    '<option value="' +
                        value.accountTypeId +
                        '">' +
                        value.accountType +
                        "</option>"
                );
            });

            select.selectpicker("refresh");
        },
    });

    $("#saveBtn").on("click", function () {
        $("#loader-overlay").show();
        $.ajax({
            url: "/accounting/account-head",
            method: "POST",
            data: {
                accountTypeId: $("#selectpickerLiveSearch").val(),
                accountHeadCode: $("#accountHeadCode").val(),
                accountHeadName: $("#accountHead").val(),
                type: $("#type").val(),
                suggestedDescription: $("#accountHeadDesc").val(),
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
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                    buttonsStyling: false,
                }).then(function () {
                    // $("#selectpickerLiveSearch").val("").selectpicker("refresh");
                    // $("#accountHeadCode").val("");
                    // $("#accountHead").val("");
                    // $("#type").val("").selectpicker("refresh");
                    // $("#accountHeadDesc").val("");
            
                    // // Clear error messages
                    // $(".error-text").text("");

                    // $("#accountHeadTable").DataTable().ajax.reload();
                    location.reload();
                });
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    let errors = xhr.responseJSON.errors;
            
                    // Clear all previous errors
                    $(".error-text").text("");
            
                    // Display errors next to relevant fields
                    if (errors.accountTypeId) {
                        $(".accountType_error").text(errors.accountTypeId[0]);
                    }
                    if (errors.accountHeadCode) {
                        $(".accountHeadCode_error").text(errors.accountHeadCode[0]);
                    }
                    if (errors.accountHeadName) {
                        $(".accountHead_error").text(errors.accountHeadName[0]);
                    }
                    if (errors.type) {
                        $(".type_error").text(errors.type[0]);
                    }
                } else {
                    alert("Something went wrong. Please try again.");
                }
            },
        });
    });
});
