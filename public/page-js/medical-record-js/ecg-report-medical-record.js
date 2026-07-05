$(document).ready(function () {
    $("#medical_record_main_menu1").addClass("active open menu-item-animating");
    $("#medical_record_lists_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    flatpickr("#last_menstruation_period", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });

    // Disable auto-discovery to prevent conflicts
    Dropzone.autoDiscover = false;

    function initDropzone(selector, paramName) {
        return new Dropzone(selector, {
            url: BASE_URL + "/medicalrecord-ecg-file-upload",
            method: "POST",
            paramName: paramName,
            uploadMultiple: true, // Enables sending multiple files in a single request
            acceptedFiles: "image/jpeg,image/png,application/pdf",
            addRemoveLinks: true,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (file, response) {
                $("#message").html(
                    '<p style="color: green;">Files uploaded successfully</p>',
                );
            },
            error: function (file, response) {
                let errorMsg = response.error || "File upload failed";
                $("#message").html(
                    '<p style="color: red;">' + errorMsg + "</p>",
                );
            },
        });
    }

    // Initialize ECG file upload dropzone
    var ecgDropzone = initDropzone("#ecg_file_upload_form", "ecg_file");

    function handleBrowse(buttonId, dropzoneInstance) {
        $(buttonId).on("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            dropzoneInstance.hiddenFileInput.click();
        });
    }

    handleBrowse("#btnBrowse1", ecgDropzone);

    function handleDelete(buttonId, dropzoneInstance) {
        $(buttonId).on("click", function (e) {
            e.preventDefault();
            dropzoneInstance.removeAllFiles();
            $("#message").html(
                '<p style="color: red;">Files removed successfully</p>',
            );
        });
    }

    handleDelete("#btnDelete1", ecgDropzone);

    function handleView(buttonId, dropzoneInstance) {
        $(buttonId).on("click", function (e) {
            e.preventDefault();
            const uploadedFiles = dropzoneInstance.files;
            if (uploadedFiles.length > 0) {
                let fileList = uploadedFiles
                    .map((file) => file.name)
                    .join(", ");
                alert("Uploaded files: " + fileList);
            } else {
                alert("No files uploaded.");
            }
        });
    }
    handleView("#btnView1", ecgDropzone);
});

const ecgPdfIconHtml = `
    <div class="dz-image">
        <img src="${BASE_URL}img/pdf-icon.png" data-dz-thumbnail class="subpdfimg" />
    </div>`;

// ECG File Upload Form Configuration
Dropzone.options.ecgFileUploadForm = {
    addRemoveLinks: false,
    previewTemplate: `
    <div class="dz-preview dz-file-preview">
        <div class="subimage">
            <div class="dz-image"><img data-dz-thumbnail /></div>
            <div class="dz-actions mt-2 text-center">
                <button class="btn btn-sm btn-label-secondary dz-view" type="button" onclick="viewEcgFile(event)" data-file-url="" >View</button>
                <button class="btn btn-sm btn-label-danger dz-delete" type="button" onclick="confirmEcgDelete(event)">Delete</button>
            </div>
            <div class="dz-details subimgcontent">
                <div class=""><span data-dz-name></span></div>
            </div>
        </div>
    </div>`,
    init: function () {
        this.on("success", function (file, response) {
            console.log("ECG file upload success:", response);

            const dzImageElement =
                file.previewElement.querySelector(".dz-image");

            if (file.type === "application/pdf") {
                dzImageElement.innerHTML = ecgPdfIconHtml;
            }

            const viewButton = file.previewElement.querySelector(".dz-view");
            if (response.file_url) {
                viewButton.setAttribute("data-file-url", " response.file_url");
                viewButton.disabled = false;
            }

            // Prepare additional data for ECG file
            const formData = new FormData();
            formData.append("ecg_patient_file", file);
            formData.append("ecg_patient_file", file.name);
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");
            formData.append("_token", csrfToken);

            // Add ECG specific data
            formData.append("affectedId", $("#reservation_id").val() || "");
            formData.append("clientId", $("#client_id").val() || "");
            formData.append("file_type", "ecg_report");

            // Make additional AJAX call for ECG file processing
            fetch("/medicalrecord-ecg-file-upload", {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`,
                        );
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("ECG file processing response:", data);
                    if (data.status) {
                        console.log(
                            "ECG file saved successfully:",
                            data.data[0],
                        );

                        const deleteButton =
                            file.previewElement.querySelector(".dz-delete");
                        const viewButton =
                            file.previewElement.querySelector(".dz-view");

                        if (deleteButton)
                            deleteButton.setAttribute(
                                "data-file-id",
                                data.data[0],
                            );
                        if (viewButton)
                            viewButton.setAttribute(
                                "data-file-id",
                                data.data[0],
                            );

                        $("#message").html(
                            '<p style="color: green;">ECG file processed successfully</p>',
                        );
                    } else {
                        console.error("Error saving ECG file:", data.message);
                        $("#message").html(
                            '<p style="color: red;">Error: ' +
                                (data.message || "ECG file processing failed") +
                                "</p>",
                        );
                    }
                })
                .catch((error) => {
                    console.error("Error in ECG file processing:", error);
                    $("#message").html(
                        '<p style="color: red;">Network error: ' +
                            error.message +
                            "</p>",
                    );
                });
        });

        this.on("error", function (file, errorMessage) {
            console.error("ECG Dropzone error:", errorMessage);
            $("#message").html(
                '<p style="color: red;">ECG upload error: ' +
                    errorMessage +
                    "</p>",
            );
        });

        const dropzoneInstance = this;

        // Global function for ECG file delete confirmation
        window.confirmEcgDelete = function (event) {
            const fileElement = event.target.closest(".dz-preview");
            const file = dropzoneInstance
                .getAcceptedFiles()
                .find((f) => f.previewElement === fileElement);
            const fileId = event.target.getAttribute("data-file-id");

            if (!fileId) {
                console.error("ECG File ID not found");
                Swal.fire({
                    title: "Error!",
                    text: "File ID not found. Please refresh the page.",
                    icon: "error",
                });
                return;
            }

            Swal.fire({
                title: "Are you sure?",
                text: "This ECG file will be permanently deleted.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                customClass: {
                    confirmButton: "btn btn-primary waves-effect waves-light",
                    cancelButton: "btn btn-danger waves-effect waves-light",
                },
                buttonsStyling: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    const csrfToken = document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content");

                    fetch(`/medicalrecord-delete-upload-file/${fileId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": csrfToken,
                        },
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(
                                    `HTTP error! status: ${response.status}`,
                                );
                            }
                            return response.json();
                        })
                        .then((data) => {
                            if (data.status) {
                                dropzoneInstance.removeFile(file);
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "ECG file deleted successfully.",
                                    icon: "success",
                                    customClass: {
                                        confirmButton:
                                            "btn btn-primary waves-effect waves-light",
                                    },
                                    buttonsStyling: false,
                                });
                            } else {
                                console.error(
                                    "Error deleting ECG file:",
                                    data.message,
                                );
                                Swal.fire({
                                    title: "Error!",
                                    text:
                                        data.message ||
                                        "Failed to delete ECG file.",
                                    icon: "error",
                                });
                            }
                        })
                        .catch((error) => {
                            console.error("Error in deleting ECG file:", error);
                            Swal.fire({
                                title: "success",
                                text: "ECG file deleted successfully.",
                                icon: "success",
                            });
                        });
                }
            });
        };
    },
};

// Global function for viewing ECG files
function viewEcgFile(event) {
    const fileId = event.target.getAttribute("data-file-id");
    if (!fileId) {
        console.error("ECG File ID not found");
        alert("ECG File ID not found. Please try refreshing the page.");
        return;
    }

    fetch("/view-xray-file/" + fileId, {
        method: "GET",
        headers: {
            "X-CSRF-TOKEN": document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content"),
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                const iframe = document.createElement("iframe");
                iframe.src = data.file_url;
                iframe.width = "100%";
                iframe.height = "600px";
                iframe.style.border = "none";

                const modalContent = document.querySelector(
                    "#file-view-modal .file-view-modal-content",
                );
                modalContent.innerHTML = "";
                modalContent.appendChild(iframe);

                // Update modal title for ECG
                document.getElementById("fileViewModalLabel").textContent =
                    "View ECG File";

                $(".file-view-modal").modal("show");
            } else {
                console.error("Error viewing ECG file:", data.message);
                alert(
                    "Error: " +
                        (data.message || "Could not load ECG file for viewing"),
                );
            }
        })

        .catch((error) => {
            console.error("Error in viewing ECG file:", error);
            alert(
                "Network error occurred while trying to view ECG file: " +
                    error.message,
            );
        });
}
