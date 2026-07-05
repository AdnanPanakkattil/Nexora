$(document).ready(function () {
    $("#notification_main_menu").addClass("active open menu-item-animating");

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    flatpickr(".delivery_datetime", {
        enableTime: true,
        enableSeconds: true,
        dateFormat: "Y-m-d H:i:S",
        allowInput: true,
        time_24hr: true
    });

    // Image Preview on click
    $("#uploadBox").on("click", function (e) {
        if (
            e.target === this ||
            $(e.target).hasClass("upload-icon") ||
            $(e.target).hasClass("upload-text") ||
            $(e.target).hasClass("browse-btn")
        ) {
            $("#customFileInput").click();
        }
    });

    $("#save-notification").on("click", function (e) {
        e.preventDefault();

        let form = $('#notificationForm')[0];
        let formData = new FormData(form);
        $("#loader-overlay").show();
        $.ajax({
            url: BASE_URL + "/notification/store",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: response.message || "Notification saved successfully.",
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton: "btn btn-success"
                        },
                        buttonsStyling: false
                    }).then(() => {
                        window.location.href = BASE_URL + "/notification/notification-list";
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: response.message || "Failed to save notification.",
                        confirmButtonText: "Close",
                        customClass: {
                            confirmButton: "btn btn-danger"
                        },
                        buttonsStyling: false
                    });
                }
            },
            // error: function (xhr) {
            //     let msg = "Something went wrong. Please try again.";
            //     if (xhr.responseJSON && xhr.responseJSON.message) {
            //         msg = xhr.responseJSON.message;
            //     }

            //     Swal.fire({
            //         icon: "error",
            //         title: "Error",
            //         text: msg,
            //         confirmButtonText: "Close",
            //         customClass: {
            //             confirmButton: "btn btn-danger"
            //         },
            //         buttonsStyling: false
            //     });
            // }
            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    $("#notificationForm").modal("hide");
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    console.error("Error:", xhr);
                }
            },
        });
    });
});

// Image Preview Function
function previewImage(event) {
    const container = document.getElementById("imagePreviewContainer");
    container.innerHTML = "";

    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = "Preview";
        img.className = "img-thumbnail";
        img.style.maxWidth = "100%";

        container.appendChild(img);
    };
    reader.readAsDataURL(file);
}

function deleteImage(event, index) {
    event.preventDefault();

    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this image?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        customClass: {
            confirmButton: "btn btn-danger me-2",
            cancelButton: "btn btn-secondary"
        },
        buttonsStyling: false
    }).then((result) => {
        if (result.isConfirmed) {
            $(event.target).closest(".position-relative").remove();

            Swal.fire({
                icon: "success",
                title: "Deleted",
                text: "Image removed successfully.",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "btn btn-success"
                },
                buttonsStyling: false
            });
        }
    });
}

function viewOperativeReportFile(event) {

    let imageUrl = $(event.currentTarget).data("file-url");

    $("#operative-report-file-view-modal-content").html(`
        <div class="text-center">
            <img src="${imageUrl}"
                class="img-fluid rounded"
                style="max-width:100%; max-height:600px;">
        </div>
    `);

    let modal = new bootstrap.Modal(
        document.getElementById('operative-report-file-view-modal')
    );

    modal.show();
}

$('#title_en , #details_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s\-_.,!@#$%^&*()+=<>?/\\|{}[\]:;"']/g, '');
});

$('#title_ar , #details_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s\-_.,!@#$%^&*()+=<>?/\\|{}[\]:;"']/g, '');
});