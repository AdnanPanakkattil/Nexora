$(document).ready(function () {
    $("#notification_main_menu").addClass("active open menu-item-animating");

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    let borderColor, bodyBg, headingColor;

    if (isDarkStyle) {
        borderColor = config.colors_dark.borderColor;
        bodyBg = config.colors_dark.bodyBg;
        headingColor = config.colors_dark.headingColor;
    } else {
        borderColor = config.colors.borderColor;
        bodyBg = config.colors.bodyBg;
        headingColor = config.colors.headingColor;
    }

    flatpickr(".delivery_datetime", {
        enableTime: true,
        enableSeconds: true,
        dateFormat: "Y-m-d H:i:S",
        allowInput: true,
        time_24hr: true
    });

    $(document).ready(function () {
        $("#update-notification").on("click", function (e) {
            e.preventDefault();

            let formData = new FormData($("#edit-notification-form")[0]);
            let updateUrl = window.location.pathname.replace("/edit", "/update"); // dynamically form update route

            $.ajax({
                url: updateUrl,
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    $("#loader-overlay").hide();

                    if (response.status === true) {
                        Swal.fire({
                            icon: "success",
                            title: "Updated!",
                            text: response.message,
                            showCancelButton: false,
                            showDenyButton: false,
                            confirmButtonText: "OK",
                            customClass: {
                                confirmButton: "btn btn-success waves-effect waves-light",
                            },
                            buttonsStyling: false
                        }).then(function () {
                            window.location.href = "/notification/notification-list";
                        });

                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error!",
                            text: response.message || "Failed to update notification",
                            confirmButtonText: "OK",
                            showCancelButton: false,
                            showDenyButton: false,
                            customClass: {
                                confirmButton: "btn btn-primary waves-effect waves-light",
                            },
                            buttonsStyling: false
                        });
                    }
                },
                error: function (xhr) {
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

});