$(document).ready(function() {
    
    $('form').on('submit', function(event) {
        event.preventDefault();
        $('.text-danger').text('');
        var emailOrUsername = $('#email_or_username').val();

        if (emailOrUsername.trim() === '') {
            $('#email_or_username').next('.text-danger').text('This field is required.');
            return;
        }

        $.ajax({
            url: $(this).attr('action'),
            method: $(this).attr('method'),
            data: $(this).serialize(),
            success: function(response) {console.log(response.message);
                if (response.status === 'success') {
                    toastr.success(response.message);
                } else {
                    toastr.success(response.message);
                }
                $('form')[0].reset(); 
            },
            error: function(xhr) {
                var errors = xhr.responseJSON.errors;console.log(errors);
                if (errors) {
                    for (var key in errors) {
                        $('#' + key).next('.text-danger').text(errors[key][0]);
                    }
                }
            }
        });
    });

    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000);
});

