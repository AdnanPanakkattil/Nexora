$(document).ready(function () {

    $("#product_management_main_menu").addClass(
        "active open menu-item-animating"
    );
    $("#item_master_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    // Trigger file input click when the 'Choose File' button is clicked
    $('#choose-file-btn').on('click', function (e) {
        e.preventDefault(); // Prevent form submission or page reload
        $('#fileupload').click();
    });

    // Display file name when a file is selected
    $('#fileupload').on('change', function () {
        let fileName = this.files.length > 0 ? this.files[0].name : "No file chosen";
        $('#file-name').text(fileName);
        $('#FileValidationMsg').addClass('d-none'); // Hide validation message
    });

    // Handle upload button click
    $('#upload_excel_btn').on('click', function (e) {
        e.preventDefault(); // Prevent form submission or page reload

        let fileInput = $('#fileupload')[0];
        if (fileInput.files.length === 0) {
            $('#FileValidationMsg').removeClass('d-none').text('Please select a file before uploading.');
            return;
        }

        let formData = new FormData();
        formData.append('file', fileInput.files[0]);

        // Sending AJAX POST request with the file
        $.ajax({
            url: BASE_URL + '/item-master-excel-import', // Change this to your upload route
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                // Handle success
                if (response.status == true) {
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    }).then(function () {
                        location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: "error", // Change this to "error" for error messages
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light", // Optional: Change button styling for error
                        },
                    }).then(function () {
                        location.reload();
                    });
                }
            },
            error: function (xhr, status, error) {
                // Handle error
                alert('An error occurred while uploading the file.');
            }
        });
    });


//     $("#download_excel_btn").on("click", function (e) {
//     e.preventDefault();
    
//     let url = BASE_URL + "/item-master-excel-export";
    
//     let link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'item_master_template.xlsx');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// });
// $("#download_excel_btn").on("click", function (e) {
//     e.preventDefault();
//     window.location.href = BASE_URL + "/item-master-excel-export";
// });


});
