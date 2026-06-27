$(document).ready(function () {
    $("#addSiteMapForm").on("submit", function (e) {
        e.preventDefault();

        // Clear previous error messages
        $(".invalid-feedback").remove();
        $(".form-control").removeClass("is-invalid");

        let sitemapXml = $("#sitemap_xml").val().trim();

        let errors = {};

        if (!sitemapXml)
            errors.sitemap_xml = "SiteMap.xml content is required.";

        // Display error messages if any
        if (Object.keys(errors).length > 0) {
            for (let field in errors) {
                let errorMessage = errors[field];
                let inputField = $("#" + field);

                let errorDiv = $("<div>")
                    .addClass("invalid-feedback")
                    .text(errorMessage);

                inputField.addClass("is-invalid").after(errorDiv);
            }

            let errorMessages = Object.values(errors).join("\n");

            Swal.fire({
                title: "Error!",
                text: errorMessages,
                icon: "error",
                customClass: {
                    confirmButton: "btn btn-primary waves-effect waves-light",
                },
                buttonsStyling: false,
            });
            return;
        }

        // Submit the form if no errors
        let formData = new FormData(this);
        $.ajax({
            url: sitemapStoreUrl,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    Swal.fire({
                        title: "Good job!",
                        text: "SiteMap created successfully!",
                        icon: "success",
                        customClass: {
                            confirmButton:
                                "btn btn-primary waves-effect waves-light",
                        },
                        buttonsStyling: false,
                    }).then(() => {
                        window.location.href = sitemapIndexUrl;
                    });
                }
            },
            error: function (xhr) {
                if (xhr.status === 422) {
                    $(".invalid-feedback").remove();
                    let errors = xhr.responseJSON.errors;
                    for (let field in errors) {
                        let errorMessage = errors[field][0];
                        let inputField = $("#" + field);
                        let errorDiv = $("<div>")
                            .addClass("invalid-feedback")
                            .text(errorMessage);
                        inputField.after(errorDiv);
                        inputField.addClass("is-invalid");
                    }
                } else {
                    console.log(
                        "Error saving department: " +
                            (xhr.responseJSON.message || "Unknown error")
                    );
                }
            },
        });
    });
});
