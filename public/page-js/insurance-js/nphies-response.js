$(document).ready(function () {
    $("textarea").each(function () {
        try {
            const parsed = JSON.parse($(this).val());
            $(this).val(JSON.stringify(parsed, null, 2));
        } catch (e) {}
    });
    $(document).on("click", ".copy-btn", function () {
        const targetId = $(this).data("target");
        const textarea = document.getElementById(targetId);
        if (textarea) {
            textarea.select();
            textarea.setSelectionRange(0, textarea.value.length);
            document.execCommand("copy");

            // Change button text briefly
            $(this)
                .text("Copied!")
                .delay(1000)
                .queue(function (next) {
                    $(this).html('<i class="ti ti-copy ti-28px me-2"></i>Copy');
                    next();
                });
        }
    });
});
function RecallNphies(nphiesTransactionMasterId, formAction) {
    $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/recall-nphies",
        type: "POST",
        data: {
            nphiesTransactionMasterId: nphiesTransactionMasterId,
            formAction: formAction,
        },
        success: function (response) {
            console.log("Server Response:", response);
            $("#loader-overlay").hide();
            if (response.status === true) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: response.message,
                    customClass: { confirmButton: "btn btn-success" },
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text:
                        response.message ||
                        "Something went wrong while checking bundle status.",
                    customClass: { confirmButton: "btn btn-danger" },
                });
            }
        },
        error: function (xhr) {
            $("#loader-overlay").hide();
            let errorMessage =
                "An unexpected error occurred. Please try again.";
            if (xhr.status === 422) {
                const errors = xhr.responseJSON.errors;
                $(".error-text").text("");
                $.each(errors, function (key, value) {
                    $("." + key + "_error").text(value[0]);
                });
                return;
            } else if (xhr.responseJSON?.message) {
                errorMessage = xhr.responseJSON.message;
            }
            Swal.fire({
                icon: "error",
                title: "Access denied",
                text: errorMessage,
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        },
    });
}
