$(document).ready(function () {
    $("#service_main_menu").addClass("active open menu-item-animating");
    $("#cash_price_list_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // Trigger file input click when the 'Choose File' button is clicked
    $("#choose-file-btn").on("click", function (e) {
        e.preventDefault();
        $("#fileupload").click();
    });

    // Display file name when a file is selected
    $("#fileupload").on("change", function () {
        let fileName =
            this.files.length > 0 ? this.files[0].name : "No file chosen";
        $("#file-name").text(fileName);
        $("#FileValidationMsg").addClass("d-none");
    });

    // Handle upload button click
    $("#upload_excel_btn").on("click", function (e) {
        e.preventDefault();

        let fileInput = $("#fileupload")[0];
        if (fileInput.files.length === 0) {
            $("#FileValidationMsg")
                .removeClass("d-none")
                .text("Please select a file before uploading.");
            return;
        }

        let formData = new FormData();
        formData.append("file", fileInput.files[0]);
        $("#loader-overlay").show();

        $.ajax({
            url: BASE_URL + "/cash-price-list-excel-import",
            method: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#loader-overlay").hide();
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
                        icon: "error",
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    }).then(function () {
                        location.reload();
                    });
                }
            },
            error: function (xhr, status, error) {
                $("#loader-overlay").hide();
                let errorMessage =
                    "An error occurred while uploading the file.";

                if (xhr.responseJSON) {
                    if (
                        xhr.responseJSON.errors &&
                        xhr.responseJSON.errors.file
                    ) {
                        errorMessage = xhr.responseJSON.errors.file[0];
                    } else if (xhr.responseJSON.message) {
                        errorMessage = xhr.responseJSON.message;
                    }
                }

                Swal.fire({
                    icon: "error",
                    text: errorMessage,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                }).then(function () {
                    location.reload();
                });
            },
        });
    });
});