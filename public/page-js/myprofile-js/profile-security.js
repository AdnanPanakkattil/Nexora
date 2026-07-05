
$("#new_password").on("input", function () {
    const val = $(this).val();
    const checks = {
        length:    val.length >= 8,
        lowercase: /[a-z]/.test(val),
        numSymbol: /[\d\W_]/.test(val),
    };

    $("#req-length").toggleClass("text-success", checks.length).toggleClass("text-danger", !checks.length);
    $("#req-lowercase").toggleClass("text-success", checks.lowercase).toggleClass("text-danger", !checks.lowercase);
    $("#req-numsymbol").toggleClass("text-success", checks.numSymbol).toggleClass("text-danger", !checks.numSymbol);
});

$(document).on("click", "#reset_password", function (e) {
    e.preventDefault();

    const newPass = $("#new_password").val();

    // Client-side pre-check before hitting the server
    const clientErrors = [];
    if (newPass.length < 8)          clientErrors.push("At least 8 characters.");
    if (!/[a-z]/.test(newPass))      clientErrors.push("At least one lowercase letter.");
    if (!/[\d\W_]/.test(newPass))    clientErrors.push("At least one number, symbol, or whitespace.");

    if (clientErrors.length) {
        // $("#new_password").addClass("is-invalid");
        $("#new_password_error").text(clientErrors.join(" "));
        return;
    }

    let form     = $("#formAccount");
    let formData = new FormData(form[0]);

    $(".error-text").text("");
    $(".form-control").removeClass("is-invalid");
    $("#reset_password").prop("disabled", true).text("Updating...");

    $.ajax({
        url: form.attr("action"),
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            $("#reset_password").prop("disabled", false).text("Save changes");
            // reset requirement indicators back to neutral
            $(".req-item").removeClass("text-success text-danger");

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: response.message,
                confirmButtonText: "OK",
                allowOutsideClick: false,
                customClass: { confirmButton: "btn btn-success" },
                buttonsStyling: false,
            }).then(() => form[0].reset());
        },
        error: function (xhr) {
    $("#reset_password").prop("disabled", false).text("Save changes");

    if (xhr.status === 422) {
        let errors = xhr.responseJSON.errors;
        $.each(errors, function (key, value) {
            $("#" + key + "_error").text(value[0]);
            // Removed: $("#" + key).addClass("is-invalid");
        });

        // Removed: Swal.fire({ ... })

    } else {
        Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Something went wrong!",
            confirmButtonText: "OK",
            customClass: { confirmButton: "btn btn-danger" },
            buttonsStyling: false,
        });
    }
},
    });
});