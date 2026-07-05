$(document).ready(function () {

    $("#nphies_main_menu").addClass(
        "active open menu-item-animating"
    );
    $("#sbs_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    
    // Trigger file input click when the 'Choose File' button is clicked
    $('#choose-file-import-btn').on('click', function (e) {
        e.preventDefault(); // Prevent form submission or page reload
        $('#sbschapterexcelfileupload').click();
    });

    $('#sbschapterexcelfileupload').on('change', function () {
        let fileName = this.files.length > 0 ? this.files[0].name : "No file chosen";
        $('#file-name').text(fileName);
        $('#FileValidationMsg').addClass('d-none'); // Hide validation message
    });

    $('#sbs_chapter_upload_excel_file_btn').on('click', function (e) {
        e.preventDefault(); 

        let fileInput = $('#sbschapterexcelfileupload')[0];
        if (fileInput.files.length === 0) {
            $('#SBSChapterExcelFileValidationMsg').removeClass('d-none').text('Please select appropriate Excel file before uploading.');
            return;
        }

        let formData = new FormData();
        formData.append('file', fileInput.files[0]);

        $.ajax({
            url: BASE_URL + '/sbs-chapter-excel-import', 
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                // Handle success
                if (response.status == true) {
                    Swal.fire({
                        icon: "warning",
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-warning waves-effect waves-light",
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
                alert('An error occurred while uploading the file.');
            }
        });
    });


});
