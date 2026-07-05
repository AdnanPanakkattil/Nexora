$(document).ready(function() {
    $('form').on('submit', function(event) {
        event.preventDefault();
        var formData = $(this).serialize();
        var password = $('#password').val();
        var confirmPassword = $('#confirm_password').val();

        // if (password.trim() === '') {
        //     $('#password').next('.text-danger').text('Password is required.');
        //     return;
        // }

        // if (confirmPassword.trim() === '') {
        //     $('#confirm_password').next('.text-danger').text('Confirm Password is required.');
        //     return;
        // }

        // if (password !== confirmPassword) {
        //     $('#confirm_password').next('.text-danger').text('Passwords do not match.');
        //     return;
        // }

        $.ajax({
            url: $(this).attr('action'),
            method: $(this).attr('method'),
            data: formData,
            success: function(response) {
                console.log(response);

                if (response.success === true) {
                    toastr.success('Password has been reset successfully. You can now log in with your new password.'); 
                    setTimeout(function() {
                        window.location.href = "/login";
                    }, 2000);
                } else {
                    showToast('#error_message', response.message, 6000); 
                }
            },
            error: function(xhr) {
                var errors = xhr.responseJSON.errors;
                console.log(errors); 

                if (errors) {
                    for (var key in errors) { console.log($('#' + key).next('.text-danger').text(errors[key][0]));
                        $('#' + key).next('.text-danger').text(errors[key][0]);
                        if (key === 'password') {
                            $('#' + key).closest('.textbox-1').find('.text-danger').text(errors[key][0]);
                        } else{
                            $('#' + key).closest('.confirm-pasword-2').find('.text-danger').text(errors[key][0]);
                        }
                    }
                }
            }
        });
    });

    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000);
});
