$(document).ready(function () {
    $("#xray_main_menu").addClass("active open menu-item-animating");
    $("#x-ray_sub_menu").addClass("active");
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    let clientRemainderTable = $("#client_remainder_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: window.location.href,
            data: function (d) {
                d.clinicId = $("#clinicId").val();
                d.employeeId = $("#employeeId").val();
                d.typeOfBill = $("#typeOfBill").val();
                d.xrayStatus = $("#Status1").val();
                d.startDate = $(".start_date").val();
                d.endDate = $(".end_date").val();
                d.national = $("#createdEmployeeId").val();
                d.clientId = $("#clientId").val();
            },
        },
        columns: [
            {
                data: "serviceOrderMasterId",
                name: "service_order_master.serviceOrderMasterId",
            },
            { data: "clientId", name: "service_order_master.clientId" },
            { data: "patientName", name: "patientName" },
            { data: "idNational", name: "clients.idNational" },
            {
                data: "xrayStatus",
                name: "service_order_master.xrayStatus",
                render: function (data, type, full, meta) {
                    let statusText = full.xrayStatus || "No Status";
                    let badgeClass = getBadgeClass(statusText);

                    return (
                        '<span class="badge ' +
                        badgeClass +
                        ' open-modal-badge" data-service-order-master-id="' +
                        full.serviceOrderMasterId +
                        '">' +
                        statusText +
                        "</span>"
                    );
                },
            },

            { data: "providerName", name: "employees.firstName_en" },
            { data: "typeOfBill", name: "service_order_master.typeOfBill" },
            {
                data: "createdDateTime",
                name: "service_order_master.createdDateTime",
            },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var viewUrl =
                        BASE_URL + "/xray/view/" + full.serviceOrderMasterId;
                    return (
                        '<div class="row justify-content-center align-items-center">' +
                        '<a href="' +
                        viewUrl +
                        '" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill" ><i class="ti ti-eye ti-md"></i></a>' +
                        "</div>"
                    );
                },
            },
        ],
        order: [[0, "desc"]],
    });

    function getBadgeClass(status) {
        switch (status.toLowerCase()) {
            case "new":
                return "bg-label-success";
            case "pending":
                return "bg-label-danger";
            case "onprocessing":
                return "bg-label-warning";
            case "completed":
                return "bg-label-success";
            case "cancelled":
                return "bg-label-danger";
            case "request":
                return "bg-label-warning";
            default:
                return "bg-label-secondary";
        }
    }

    $(document).on("click", ".open-modal-badge", function () {
        var serviceOrderMasterId = $(this).data("service-order-master-id");
        var activity = "clinical_diagnostic_result";

        $("#app-loader").show();
        $.ajax({
            url: BASE_URL + "/fetch-activity-log-xray",
            type: "POST",
            data: {
                serviceOrderMasterId: serviceOrderMasterId,
                activity: activity,
                _token: $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                if (response.success) {
                    var activityLogs = response.data;

                    var modalContent = "";
                    activityLogs.forEach(function (log) {
                        var employeeName = log.employee
                            ? log.employee.firstName_en +
                              " " +
                              log.employee.secondName_en +
                              " " +
                              log.employee.thirdName_en +
                              " " +
                              log.employee.lastName_en
                            : "N/A";

                        var newValueBadge = log.newValue
                            ? `<span class="badge ${getNewValueClass(
                                  log.newValue,
                              )}">${log.newValue}</span>`
                            : "";
                        var dotColor =
                            log.action === "add"
                                ? "timeline-point-success"
                                : "timeline-point-primary";

                        modalContent += `
                            <li class="timeline-item timeline-item-transparent">
                                <span class="timeline-point ${dotColor}"></span>
                                <div class="timeline-event">
                                    <div class="timeline-header mb-3">
                                        <h6 class="mb-0">${employeeName}</h6>
                                        <small class="text-muted">${
                                            log.created_at
                                        }</small>
                                    </div>
                                    <p class="mb-2">
                               ${
                                   log.action === "add"
                                       ? ` ${log.activity} added successfully #${log.affectedId}`
                                       : log.action === "edit"
                                         ? ` ${log.activity} edited successfully #${log.affectedId}`
                                         : log.action === "draft"
                                           ? ` ${log.activity} draft added successfully #${log.affectedId}`
                                           : log.action === "payment"
                                             ? ` ${log.activity} payment processed successfully #${log.affectedId}`
                                             : log.action === "print"
                                               ? ` ${log.activity} printed successfully  #${log.affectedId}`
                                               : `edited ${log.activity}  #${log.affectedId}`
                               }
                                  </p>
                                    <div class="d-flex align-items-center mb-2">
                                        ${newValueBadge}
                                    </div>
                                </div>
                            </li>
                        `;
                    });

                    $("#statusModal").find(".timeline").html(modalContent);
                    $("#statusModal").modal("show");
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
            error: function () {
                alert("Failed to fetch activity logs. Please try again.");
            },
            complete: function () {
                $("#app-loader").hide();
            }
        });
    });

    function getNewValueClass(newValue) {
        switch (newValue.toLowerCase()) {
            case "completed":
                return "bg-success";
            case "request":
                return "bg-warning";
        }
    }

    var rangePickr = $(".flatpickr-range"),
        dateFormat = "YYYY-MM-DD";
    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");

    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "Y-m-d",
            onClose: function (selectedDates, dateStr, instance) {
                if (selectedDates[0] != undefined) {
                    startDateEle.val(
                        moment(selectedDates[0]).format(dateFormat),
                    );
                }
                if (selectedDates[1] != undefined) {
                    endDateEle.val(moment(selectedDates[1]).format(dateFormat));
                }
                clientRemainderTable.ajax.reload();
            },
        });
    }

    $("#clientId").select2({
        placeholder: "Select a Client",
        allowClear: true,
        minimumInputLength: 0,
        ajax: {
            url: BASE_URL + "/appointment-report-get-patient-options",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    clientId: params.term,
                };
            },
            processResults: function (data) {
                return {
                    results: data.results.map((client) => ({
                        id: client.id, // MRN (File ID)
                        text: client.text, // Full name
                        clientMobile: client.mobile,
                        clientIdNational: client.idNational,
                    })),
                };
            },
            cache: true,
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: formatSearch,
        templateSelection: formatSearchSelection,
    });

    function formatSearch(repo) {
        if (!repo.id) {
            return repo.text;
        }
        return $(`
            <div>
                <strong>${repo.text}</strong><br>
                <small>Mobile: ${repo.clientMobile} | ID: ${repo.clientIdNational} | MRN: ${repo.id}</small>
            </div>
        `);
    }

    function formatSearchSelection(repo) {
        return repo.text || repo.id;
    }

    $(
        "#clinicId, #employeeId, #typeOfBill, #Status1, #clientId, #createdEmployeeId",
    ).on("change", function () {
        clientRemainderTable.ajax.reload();
    });

    $(document).on("click", ".view-btn", function (e) {
        e.preventDefault();
        var id = $(this).data("id");
        window.location.href = BASE_URL + "/xray/view/" + id;
    });

    Dropzone.autoDiscover = false;
    function initDropzone(selector, paramName) {
        if (!$(selector).length) {
            return null;
        }
        return new Dropzone(selector, {
            url: BASE_URL + "/xray/upload-files",
            method: "POST",
            paramName: paramName,
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
                let errorMsg = response?.error || "File upload failed";
                $("#message").html(
                    '<p style="color: red;">' + errorMsg + "</p>",
                );
            },
        });
    }
    var xrayDropzone = initDropzone("#xray_file_upload_form", "xray_file");
    var xrayDropzone1 = initDropzone("#xray_result_upload_form", "xray_result");

    function handleDelete(buttonId, dropzoneInstance) {
        $(buttonId).on("click", function (e) {
            e.preventDefault();
            dropzoneInstance.removeAllFiles();
            $("#message").html(
                '<p style="color: red;">Files removed successfully</p>',
            );
        });
    }

    handleDelete("#btnDelete1", xrayDropzone);
    handleDelete("#btnDelete2", xrayDropzone1);

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
    function handleView(buttonId, dropzoneInstance) {
        $(buttonId).on("click", function (e) {
            e.preventDefault();
            const uploadedResults = dropzoneInstance.files;
            if (uploadedResults.length > 0) {
                let fileList = uploadedResults
                    .map((file) => file.name)
                    .join(", ");
                alert("Uploaded files: " + fileList);
            } else {
                alert("No files uploaded.");
            }
        });
    }
    handleView("#btnView1", xrayDropzone);
    handleView("#btnView2", xrayDropzone1);
});

$(document).on("click", "#request_xray_report", function () {
    let hasXrayImage = $('#xray_file_upload_form').parent().find('.dz-preview').length > 0;

    if (!hasXrayImage) {
        Swal.fire({
            icon: 'warning',
            title: 'X-Ray Required',
            text: 'Please upload at least one X-Ray image.',
            customClass: {
                confirmButton: 'btn btn-primary waves-effect waves-light'
            },
            buttonsStyling: false
        });
        return;
    }

    $("#app-loader").show();
    $.ajax({
        type: "GET",
        url: BASE_URL + "/request-xray/" + $("#service_order_masterId").val(),
        data: { xrayForClinicDocumentation: $("#xray_documentation").text() },
        success: function (data) {
            $("#employeeSelect")
                .val(data.data.xrayReportEmployeeId)
                .trigger("change");
            $("#xray-request-modal").modal("show");
        },
        error: function (xhr) {
            Swal.fire({
                title: "Error!",
                text: "Unable to fetch Xray Request details.",
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "btn btn-primary waves-effect waves-light",
                },
                buttonsStyling: false,
            });
        },
        complete: function () {
            $("#app-loader").hide();
        }
    });
});

$(document).on("click", "#submit_xray_report", function () {
    let hasReportFile = $('#xray_result_upload_form').parent().find('.dz-preview').length > 0;
    let hasReportText = $('#xray_documentation').text().trim().length > 0;

    if (!hasReportFile && !hasReportText) {
        Swal.fire({
            icon: 'warning',
            title: 'Clinical Report Required',
            text: 'Please provide a clinical report (text or uploaded file).',
            customClass: {
                confirmButton: 'btn btn-primary waves-effect waves-light'
            },
            buttonsStyling: false
        });
        return;
    }
    $("#app-loader").show();
    $.ajax({
        type: "PUT",
        url: BASE_URL + "/report-xray/" + $("#service_order_masterId").val(),
        data: { xrayForClinicDocumentation: $("#xray_documentation").text() },

        success: function (data) {
            Swal.fire({
                title: "Success!",
                text: "X-ray Report details have been successfully submitted.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "btn btn-primary waves-effect waves-light",
                },
                buttonsStyling: false,
            }).then(() => {
                window.location.href = BASE_URL + "/xray";
            });
        },
        error: function (xhr) {
            Swal.fire(
                "Error!",
                "Unable to fetch X-ray Report details.",
                "error",
            );
        },
        complete: function () {
            $("#app-loader").hide();
        }
    });
});

$(document).ready(function () {

    $("#xrayRequestForm").on("submit", function (e) {
        e.preventDefault();

        // Clear old errors
        $(".error-text").text("");
        $("#employeeSelect").removeClass("is-invalid");

        let selectedEmployee = $("#employeeSelect").val();
        let serviceOrderMasterId = $("#service_order_masterId").val();

        $("#app-loader").show();
        $.ajax({
            type: "PUT",
            url: BASE_URL + "/update-xray/" + serviceOrderMasterId,
            data: {
                employee_id: selectedEmployee
            },

            success: function (response) {
                Swal.fire({
                    title: "Success!",
                    text: "X-Ray request updated successfully.",
                    icon: "success",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "btn btn-primary waves-effect waves-light",
                    },
                    buttonsStyling: false,
                }).then(() => {
                    $("#xray-request-modal").modal("hide");
                    window.location.href = BASE_URL + "/xray";
                });
            },

            error: function (xhr) {
                // Clear previous errors
                $(".error-text").text("");

                // Handle validation errors (422)
                if (xhr.status === 422) {
                    let errors = xhr.responseJSON.errors;

                    if (errors && errors.employee_id) {
                        $("#employeeSelect").addClass("is-invalid");
                        $(".employeeSelect_error").text(errors.employee_id[0]);
                    }
                } else {
                    // Other errors → Swal
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to update X-Ray request.",
                        icon: "error",
                        confirmButtonText: "Retry",
                        customClass: {
                            confirmButton: "btn btn-primary waves-effect waves-light",
                        },
                        buttonsStyling: false,
                    });
                }
            },
            complete: function () {
                $("#app-loader").hide();
            }
        });
    });

    // Remove error on change
    $("#employeeSelect").on("change", function () {
        $(this).removeClass("is-invalid");
        $(".employeeSelect_error").text("");
    });

});

const pdfIconHtml = `
<div class="dz-image">
    <img src="${baseUrl}img/pdf-icon.png" data-dz-thumbnail class="subpdfimg" />
</div>`;

Dropzone.options.xrayFileUploadForm = {
    addRemoveLinks: false,
    previewTemplate: `
<div class="dz-preview dz-file-preview">
    <div class="subimage">
        <div class="dz-image"><img data-dz-thumbnail /></div>
        <div class="dz-actions mt-2 text-center">
            <button class="btn btn-sm btn-label-secondary dz-view" type="button" onclick="viewFile(event)" data-file-url="" disabled>View</button>
            <button class="btn btn-sm btn-label-danger dz-delete" type="button" onclick="confirmDelete(event)">Delete</button>
        </div>
        <div class="dz-details subimgcontent">
            <div class=""><span data-dz-name></span></div>
        </div>
    </div>
</div>`,
    init: function () {
        this.on("success", function (file, response) {
            const dzImageElement =
                file.previewElement.querySelector(".dz-image");

            if (file.type === "application/pdf") {
                dzImageElement.innerHTML = pdfIconHtml;
            }

            const viewButton = file.previewElement.querySelector(".dz-view");
            viewButton.setAttribute("data-file-url", response.file_url);
            viewButton.disabled = false;

            const formData = new FormData();
            formData.append("xray_file", file);
            formData.append("xray_file", file.name);
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");
            formData.append("_token", csrfToken);
            formData.append("affectedId", $("#service_order_masterId").val());

            $("#app-loader").show();
            fetch("/xray/request/upload-files", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        const deleteButton =
                            file.previewElement.querySelector(".dz-delete");
                        const viewButton =
                            file.previewElement.querySelector(".dz-view");

                        deleteButton.setAttribute(
                            "data-file-id",
                            data.xray_file[0],
                        );
                        viewButton.setAttribute(
                            "data-file-id",
                            data.xray_file[0],
                        );
                    } else {
                        console.error("Error saving file:", data.message);
                    }
                })
                .catch((error) =>
                    console.error("Error in saving file:", error),
                )
                .finally(() => {
                    $("#app-loader").hide();
                });
        });

        const dropzoneInstance = this;
        window.confirmDelete = function (event) {
            const fileElement = event.target.closest(".dz-preview");
            const file = dropzoneInstance
                .getAcceptedFiles()
                .find((f) => f.previewElement === fileElement);
            const fileId = event.target.getAttribute("data-file-id");

            Swal.fire({
                title: "Are you sure?",
                text: "This file will be permanently deleted.",
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

                    $("#app-loader").show();
                    fetch(`/delete-xray/uploaded-file/${fileId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": csrfToken,
                        },
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success) {
                                dropzoneInstance.removeFile(file);
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "File deleted successfully.",
                                    icon: "success",
                                    customClass: {
                                        confirmButton:
                                            "btn btn-primary waves-effect waves-light",
                                    },
                                    buttonsStyling: false,
                                });
                            } else {
                                console.error(
                                    "Error deleting file:",
                                    data.message,
                                );
                            }
                        })
                        .catch((error) =>
                            console.error("Error in deleting file:", error),
                        )
                        .finally(() => {
                            $("#app-loader").hide();
                        });
                }
            });
        };
    },
};

Dropzone.options.xrayResultUploadForm = {
    addRemoveLinks: false,
    previewTemplate: `
<div class="dz-preview dz-file-preview">
    <div class="subimage">
        <div class="dz-image"><img data-dz-thumbnail /></div>
        <div class="dz-actions mt-2 text-center">
            <button class="btn btn-sm btn-label-secondary dz-view" type="button" onclick="viewFile1(event)" data-file-url="" disabled>View</button>
            <button class="btn btn-sm btn-label-danger dz-delete" type="button" onclick="confirmDelete1(event)">Delete</button>
        </div>
        <div class="dz-details subimgcontent">
            <div class=""><span data-dz-name></span></div>
        </div>
    </div>
</div>`,
    init: function () {
        this.on("success", function (file, response) {
            const dzImageElement =
                file.previewElement.querySelector(".dz-image");

            if (file.type === "application/pdf") {
                dzImageElement.innerHTML = pdfIconHtml;
            }

            const viewButton = file.previewElement.querySelector(".dz-view");
            viewButton.setAttribute("data-file-url", response.file_url);
            viewButton.disabled = false;

            const formData = new FormData();
            formData.append("xray_result", file);
            formData.append("xray_result_file", file.name);
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");
            formData.append("_token", csrfToken);
            formData.append("affectedId", $("#service_order_masterId").val());

            $("#app-loader").show();
            fetch("/xray/request/upload-files", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        const deleteButton =
                            file.previewElement.querySelector(".dz-delete");
                        const viewButton =
                            file.previewElement.querySelector(".dz-view");

                        deleteButton.setAttribute(
                            "data-file-id",
                            data.xray_result_file[0],
                        );
                        viewButton.setAttribute(
                            "data-file-id",
                            data.xray_result_file[0],
                        );
                    } else {
                        console.error("Error saving file:", data.message);
                    }
                })
                .catch((error) =>
                    console.error("Error in saving file:", error),
                )
                .finally(() => {
                    $("#app-loader").hide();
                });
        });

        const dropzoneInstance = this;
        window.confirmDelete1 = function (event) {
            const fileElement = event.target.closest(".dz-preview");
            const file = dropzoneInstance
                .getAcceptedFiles()
                .find((f) => f.previewElement === fileElement);
            const fileId = event.target.getAttribute("data-file-id");

            Swal.fire({
                title: "Are you sure?",
                text: "This file will be permanently deleted.",
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

                    $("#app-loader").show();
                    fetch(`/delete-xray/uploaded-file/${fileId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": csrfToken,
                        },
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success) {
                                dropzoneInstance.removeFile(file);
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "File deleted successfully.",
                                    icon: "success",
                                    customClass: {
                                        confirmButton:
                                            "btn btn-primary waves-effect waves-light",
                                    },
                                    buttonsStyling: false,
                                });
                            } else {
                                console.error(
                                    "Error deleting file:",
                                    data.message,
                                );
                            }
                        })
                        .catch((error) =>
                            console.error("Error in deleting file:", error),
                        )
                        .finally(() => {
                            $("#app-loader").hide();
                        });
                }
            });
        };
    },
};

function viewFile(event) {
    const fileId = event.target.getAttribute("data-file-id");
    if (fileId) {
        $("#app-loader").show();
        fetch("/view-xray-request-file/" + fileId, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    const iframe = document.createElement("iframe");
                    iframe.src = data.file_url;
                    iframe.width = "100%";
                    iframe.height = "600px";

                    const modalContent = document.getElementById(
                        "file-view-modal-content",
                    );
                    modalContent.innerHTML = "";
                    modalContent.appendChild(iframe);

                    $("#file-view-modal").modal("show");
                } else {
                    console.error("Error viewing file:", data.message);
                }
            })
            .catch((error) => console.error("Error in viewing file:", error))
            .finally(() => {
                $("#app-loader").hide();
            });
    }
}

function viewUploadedFile(event) {
    const mediaFileId = event.currentTarget.getAttribute("data-media-file-id");
    const modalContent = document.getElementById("file-view-modal-content");
    modalContent.innerHTML = "";

    $("#app-loader").show();
    fetch(`/view-xray-file/${mediaFileId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                const fileUrl = data.file_url;

                if (fileUrl.endsWith(".pdf")) {
                    const iframe = document.createElement("iframe");
                    iframe.src = fileUrl;
                    iframe.width = "100%";
                    iframe.height = "600px";
                    iframe.style.border = "none";
                    modalContent.appendChild(iframe);
                } else {
                    const img = document.createElement("img");
                    img.src = fileUrl;
                    img.alt = "File preview";
                    img.style.width = "100%";
                    img.style.height = "auto";
                    modalContent.appendChild(img);
                }

                $("#file-view-modal").modal("show");
            } else {
                alert(data.message || "Failed to load file");
            }
        })
        .catch((error) => {
            console.error("Error fetching file URL:", error);
            alert("An error occurred while loading the file");
        })
        .finally(() => {
            $("#app-loader").hide();
        });
}

function viewFile1(event) {
    const fileId = event.target.getAttribute("data-file-id");
    if (fileId) {
        $("#app-loader").show();
        fetch("/view-xray-request-file-result/" + fileId, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    const iframe = document.createElement("iframe");
                    iframe.src = data.file_url;
                    iframe.width = "100%";
                    iframe.height = "600px";

                    const modalContent = document.getElementById(
                        "file-view-modal-content",
                    );
                    modalContent.innerHTML = "";
                    modalContent.appendChild(iframe);

                    $("#file-view-modal").modal("show");
                } else {
                    console.error("Error viewing file:", data.message);
                }
            })
            .catch((error) => console.error("Error in viewing file:", error))
            .finally(() => {
                $("#app-loader").hide();
            });
    }
}

function viewUploadedFile1(event) {
    const mediaFileId = event.currentTarget.getAttribute("data-media-file-id");
    const modalContent = document.getElementById("file-view-modal-content");
    modalContent.innerHTML = "";

    $("#app-loader").show();
    fetch(`/view-xray-file/${mediaFileId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                const fileUrl = data.file_url;

                if (fileUrl.endsWith(".pdf")) {
                    const iframe = document.createElement("iframe");
                    iframe.src = fileUrl;
                    iframe.width = "100%";
                    iframe.height = "600px";
                    iframe.style.border = "none";
                    modalContent.appendChild(iframe);
                } else {
                    const img = document.createElement("img");
                    img.src = fileUrl;
                    img.alt = "File preview";
                    img.style.width = "100%";
                    img.style.height = "auto";
                    modalContent.appendChild(img);
                }

                $("#file-view-modal").modal("show");
            } else {
                alert(data.message || "Failed to load file");
            }
        })
        .catch((error) => {
            console.error("Error fetching file URL:", error);
            alert("An error occurred while loading the file");
        })
        .finally(() => {
            $("#app-loader").hide();
        });
}

function confirmuploadedDelete(event) {
    let mediaFileId = event.currentTarget.getAttribute("data-media-file-id");

    Swal.fire({
        title: "Are you sure?",
        text: "This X-ray file will be deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-secondary",
        },
        buttonsStyling: false,
    }).then((result) => {
        if (result.isConfirmed) {
            $("#app-loader").show();
            $.ajax({
                url: BASE_URL + "/delete-xray/uploaded-file/" + mediaFileId,
                type: "DELETE",

                success: function (response) {
                    if (response.success) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "File deleted successfully.",
                            icon: "success",
                            customClass: {
                                confirmButton:
                                    "btn btn-primary waves-effect waves-light",
                            },
                        }).then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire("Error!", response.message, "error");
                    }
                },

                error: function () {
                    Swal.fire("Error!", "Failed to delete file.", "error");
                },
                complete: function () {
                    $("#app-loader").hide();
                }
            });
        }
    });
}

function confirmuploadedDelete1(event) {
    let mediaFileId = event.currentTarget.getAttribute("data-media-file-id");

    Swal.fire({
        title: "Are you sure?",
        text: "This X-ray report file will be deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-secondary",
        },
        buttonsStyling: false,
    }).then((result) => {
        if (result.isConfirmed) {
            $("#app-loader").show();
            $.ajax({
                url:
                    BASE_URL +
                    "/delete-xray-result/uploaded-file/" +
                    mediaFileId,
                type: "DELETE",

                success: function (response) {
                    if (response.success) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "File deleted successfully.",
                            icon: "success",
                            customClass: {
                                confirmButton:
                                    "btn btn-primary waves-effect waves-light",
                            },
                        }).then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire("Error!", response.message, "error");
                    }
                },

                error: function () {
                    Swal.fire("Error!", "Failed to delete file.", "error");
                },
                complete: function () {
                    $("#app-loader").hide();
                }
            });
        }
    });
}
