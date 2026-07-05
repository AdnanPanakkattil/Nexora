$(document).ready(function () {
    // $("#medical_record_main_menu1").addClass("active open menu-item-animating");
    // $("#medical_record_lists_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $('input[name="transferLocation"]').on("change", function () {
        $('input[name="transferLocation"]').not(this).prop("checked", false);
    });

    Dropzone.autoDiscover = false;

    function initDropzone(selector, paramName) {
        return new Dropzone(selector, {
            url: BASE_URL + "/xray/upload-files",
            method: "POST",
            paramName: paramName,
            acceptedFiles: "image/jpeg,image/png,application/pdf",
            addRemoveLinks: true,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (file, response) {
                $('#message').html('<p style="color: green;">Files uploaded successfully</p>');
            },
            error: function (file, response) {
                let errorMsg = response.error || 'File upload failed';
                $('#message').html('<p style="color: red;">' + errorMsg + '</p>');
            }
        });
    }

    var inpatientDropzone = initDropzone("#inpatient_upload_form", "inpatient_file");

    function handleDelete(buttonId, dropzoneInstance) {
        $(buttonId).on('click', function (e) {
            e.preventDefault();
            dropzoneInstance.removeAllFiles();
            $('#message').html('<p style="color: red;">Files removed successfully</p>');
        });
    }

    handleDelete('#btnDelete1', inpatientDropzone);

    function handleView(buttonId, dropzoneInstance) {
        $(buttonId).on('click', function (e) {
            e.preventDefault();
            const uploadedFiles = dropzoneInstance.files;
            if (uploadedFiles.length > 0) {
                let fileList = uploadedFiles.map(file => file.name).join(', ');
                alert("Uploaded files: " + fileList);
            } else {
                alert("No files uploaded.");
            }
        });
    }
    handleView('#btnView1', inpatientDropzone);
});

const pdfIconHtmlForInpatientFile = `
    <div class="dz-image">
        <img src="${BASE_URL}img/pdf-icon.png" data-dz-thumbnail class="subpdfimg" />
    </div>`;

    Dropzone.options.inpatientUploadForm = {
        addRemoveLinks: false,
        previewTemplate: `
        <div class="dz-preview dz-file-preview">
            <div class="subimage">
                <div class="dz-image"><img data-dz-thumbnail /></div>
                <div class="dz-actions mt-2 text-center">
                    <button class="btn btn-sm btn-label-secondary dz-view" type="button" onclick="viewInPatientFileFile(event)" disabled>View</button>
                    <button class="btn btn-sm btn-label-danger dz-delete" type="button" onclick="confirmDelete(event)">Delete</button>
                </div>
                <div class="dz-details subimgcontent">
                    <div class=""><span data-dz-name></span></div>
                </div>
            </div>
        </div>`,
        init: function () {
            this.on("success", function (file, response) {
                const dzImageElement = file.previewElement.querySelector('.dz-image');
    
                if (file.type === 'application/pdf') {
                    dzImageElement.innerHTML = pdfIconHtmlForInpatientFile;
                }
    
                const viewButton = file.previewElement.querySelector('.dz-view');
                viewButton.disabled = false;
    
                const formData = new FormData();
                formData.append('inpatient_file', file);
                formData.append('inpatient_file', file.name);
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                formData.append('_token', csrfToken);
                formData.append('affectedId', $('#patient_admission_id').val());
                formData.append('clientId', $('#client_id').val());
    
    
                fetch('/inpatient-upload-file', {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status) {
                            console.log('File saved successfully:', data.data[0]);
    
                            const deleteButton = file.previewElement.querySelector('.dz-delete');
                            const viewButton = file.previewElement.querySelector('.dz-view');
    
                            deleteButton.setAttribute('data-file-id', data.data[0]);
                            viewButton.setAttribute('data-file-id', data.data[0]);
                        } else {
                            console.error('Error saving file:', data.message);
                        }
                    })
                    .catch(error => console.error('Error in saving file:', error));
            });
    
            const dropzoneInstance = this;
    
            window.confirmDelete = function (event) {
                const fileElement = event.target.closest('.dz-preview');
                const file = dropzoneInstance.getAcceptedFiles().find(f => f.previewElement === fileElement);
                const fileId = event.target.getAttribute('data-file-id');
    
                Swal.fire({
                    title: "Are you sure?",
                    text: "This file will be permanently deleted.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Delete",
                    customClass: {
                        confirmButton: 'btn btn-primary waves-effect waves-light',
                        cancelButton: 'btn btn-danger waves-effect waves-light'
                    },
                    buttonsStyling: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
                        fetch(`/inpatient-delete-uploaded-file/${fileId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': csrfToken
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.status) {
                                    dropzoneInstance.removeFile(file);
                                    Swal.fire({
                                        title: "Deleted!",
                                        text: "File deleted successfully.",
                                        icon: "success",
                                        customClass: {
                                            confirmButton: 'btn btn-primary waves-effect waves-light'
                                        },
                                        buttonsStyling: false
                                    });
                                } else {
                                    console.error('Error deleting file:', data.message);
                                }
                            })
                            .catch(error => console.error('Error in deleting file:', error));
                    }
                });
            };
        }
    };
    function viewInPatientFileFile(event) {
        const fileId = event.target.getAttribute('data-file-id');
        if (fileId) {
            fetch('/inpatient-view-uploaded-file/' + fileId, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data.data);
                    if (data.status) {
                        const iframe = document.createElement('iframe');
                        iframe.src = data.data;
                        iframe.width = '100%';
                        iframe.height = '600px';
    
                        const modalContent = document.getElementById('inpatient-file-view-modal-content');
                        modalContent.innerHTML = '';
                        modalContent.appendChild(iframe);
    
                        $('#inpatient-file-view-modal').modal('show');
                    } else {
                        console.error('Error viewing file:', data.message);
                    }
                })
                .catch(error => console.error('Error in viewing file:', error));
        }
    }
