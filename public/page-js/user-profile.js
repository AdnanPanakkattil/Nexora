$("#editUserForm").submit(function (event) {
    event.preventDefault();
    let formData = new FormData(this);

    // Clear all previous error messages
    $(".error-text").text("");

    const profilePicInput = $("#profilePic")[0];
    if (profilePicInput.files.length > 0) {
        formData.append("profile_image", profilePicInput.files[0]);
    }
 $("#loader-overlay").show(); 
    $.ajax({
        url: updateEmployeeUrl,
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        success: function (response) {
             $("#loader-overlay").hide(); 
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Profile updated successfully!",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "btn btn-success waves-effect waves-light",
                },
                buttonsStyling: false,
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = dashboardUrl;
                    // window.location.href = resetPasswordUrl;
                }
            });
        },
        error: function (xhr) {
             $("#loader-overlay").hide(); 
            if (xhr.status === 422) {
                // This is a validation error
                const errors = xhr.responseJSON.errors;
                
                // Loop through all errors and display them
                $.each(errors, function (key, value) {
                    $("." + key + "_error").text(value[0]);
                });
                
                // Scroll to the first error
                $('html, body').animate({
                    scrollTop: $(".error-text:not(:empty):first").offset().top - 100
                }, 500);
            } else {
                // Handle other types of errors with SweetAlert
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Something went wrong!",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "btn btn-danger waves-effect waves-light",
                    },
                    buttonsStyling: false
                });
            }
        },
    });
});

$('#mobilenumber').on('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 9);
});