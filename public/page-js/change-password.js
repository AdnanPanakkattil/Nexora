$("#NewPassForm").on("submit", function (e) {
    e.preventDefault();

    // Clear previous error messages
    $(".error-text").text("");
  $("#loader-overlay").show(); 
    $.ajax({
        url: $(this).attr("action"),
        method: "POST",
        data: $(this).serialize(),
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        success: function (response) {
              $("#loader-overlay").hide(); 
            if (response.success) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.message,
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "/dashboard";
                    }
                });
            }
        },
        error: function (xhr) {
              $("#loader-overlay").hide(); 
            if (xhr.status === 422) {
                var errors = xhr.responseJSON.errors;

                $.each(errors, function (key, messages) {
                    if (key === "new_password") {
                        if (
                            messages.includes(
                                "The new password field must match confirm password."
                            )
                        ) {
                            $(".confirm_password_error").text(
                                "Password confirmation does not match."
                            );
                        } else if (
                            messages.includes(
                                "The new password field must be at least 8 characters."
                            )
                        ) {
                            $(".new_password_error").text(
                                "Password must be at least 8 characters."
                            );
                        } else {
                            $(".new_password_error").text(messages[0]);
                        }
                    }

                    if (key === "old_password") {
                        $(".old_password_error").text(messages[0]);
                    }

                    if (key === "confirm_password") {
                        $(".confirm_password_error").text(messages[0]);
                    }

                    if (key === "user") {
                        alert(messages[0]);
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.message,
                });
            }
        },
    });
});
