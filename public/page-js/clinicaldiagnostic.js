$(document).ready(function () {
    $("#laboratory_main_menu").addClass("active open menu-item-animating");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    let isEditMode = false;
    let currentServiceName = "";
    let selectedServiceOrderId = null;

    // Initialize DataTable
    let clientRemainderTable = $("#client_remainder_table").DataTable({

        processing: true,
        serverSide: true,
        ajax: {
            url: window.location.href,
            // data: function (d) {
            //     d.clinicId = $('#clinicId').val();
            //     d.employeeId = $('#employeeId').val();
            //     d.typeOfBill = $('#typeOfBill').val();
            //     d.laboratoryStatus = $('#Status1').val();
            //     d.startDate = $(".start_date").val();
            //     d.endDate = $(".end_date").val();
            //     d.national = $('#createdEmployeeId').val();
            //     d.clientId = $('#clientId').val();
            // }
            data: function (d) {
                d.clinicId = $("#clinicId").val();
                d.employeeId = $("#employeeId").val();
                d.typeOfBill = $("#typeOfBill").val();
                d.laboratoryStatus = $("#Status1").val();
                d.startDate = $(".start_date").val();
                d.endDate = $(".end_date").val();
                d.startCompletedDate = $(".start_completed_date").val(); // NEW
                d.endCompletedDate = $(".end_completed_date").val(); // NEW
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
            { data: "mobile", name: "clients.mobile" },
            {
                data: "laboratoryStatus",
                name: "service_order_master.laboratoryStatus",
                render: function (data, type, full, meta) {
                    let statusText = full.laboratoryStatus || "No Status";

                    if (statusText.toLowerCase() === "onprocessing") {
                        statusText = "on processing";
                    }
                    let badgeClass = getBadgeClass(statusText);
                    if (statusText === "on processing") {
                        badgeClass = "bg-label-success";
                    }

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
                data: "labCollectDateTime",
                name: "service_order_master.labCollectDateTime",
            },
            {
                data: "labCompletedDateTime",
                name: "service_order_master.labCompletedDateTime",
            },
            { data: "duration", name: "duration" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
          render: function (data, type, full, meta) {
    return '<div class="action-icons">' +
        '<i class="ti ti-eye ti-md view-btn" data-id="' + full.serviceOrderMasterId + '"></i>' +
        '<i class="ti ti-pencil ti-md edit-btn" data-id="' + full.serviceOrderMasterId + '"></i>' +
        '</div>';
},
            },
        ],
        order: [[9, "desc"]],
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
            default:
                return "bg-label-secondary";
        }
    }

$(document).on("click", ".edit-btn", function (e) {

    e.preventDefault();
    e.stopPropagation();

    let serviceOrderMasterId = $(this).data("id");

    let rowData = clientRemainderTable
        .row($(this).closest("tr"))
        .data();

    let status = (rowData.laboratoryStatus || "").toLowerCase();

if (status === "new") {

    selectedServiceOrderId = serviceOrderMasterId;

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to start the processing?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Later",
            customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
                cancelButton: "btn btn-danger waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then((result) => {

        if (result.isConfirmed) {

            $.ajax({
                url: BASE_URL + "/update-lab-status",
                type: "POST",
                data: {
                    serviceOrderMasterId: selectedServiceOrderId,
                    laboratoryStatus: "onprocessing",
                    _token: $('meta[name="csrf-token"]').attr("content")
                },

                success: function (response) {

                    clientRemainderTable.ajax.reload(null, false);

                    Swal.fire({
                        icon: "success",
                        text: "Status updated successfully",
                        customClass: {
                            confirmButton: "btn btn-success waves-effect waves-light",
                        },
                    });

                    selectedServiceOrderId = null;
                },

                error: function () {

                    Swal.fire({
                        icon: "error",
                        text: "Failed to update status",
                        customClass: {
                            confirmButton: "btn btn-danger waves-effect waves-light",
                        },
                    });
                }

            });

        }

    });

    return;
}
 // ON PROCESSING
    if (status === "onprocessing") {
        window.location.href =
            `${BASE_URL}/laboratory-laboratory-result/${serviceOrderMasterId}/modify`;
        return;
    }
  
    if (status === "completed") {
       window.location.href = `${BASE_URL}/laboratory-laboratory-result/${serviceOrderMasterId}/modify`;
        return;
    }

   
    openEditModal(serviceOrderMasterId);
});


    $(document).on("click", ".open-modal-badge", function () {
        var serviceOrderMasterId = $(this).data("service-order-master-id");
        var activity = "clinical_diagnostic_result";

        console.log("Service Order Master ID:", serviceOrderMasterId);

        $.ajax({
            url: BASE_URL + "/fetch-activity-log-lab",
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
                            ? `<span class="badge ${getNewValueClass(log.newValue)}">${log.newValue}</span>`
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
                                        <small class="text-muted">${log.created_at}</small>
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
                                               : ` ${log.activity} edited successfully #${log.affectedId}`
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
        });
    });

    function getNewValueClass(newValue) {
        switch (newValue.toLowerCase()) {
            case "paid":
                return "bg-success";
            case "pending":
                return "bg-warning";
        }
    }

    // Date Range Picker Implementation
    var rangePickr = $(".flatpickr-range");
    var dateFormat = "YYYY-MM-DD";
    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");

    if (rangePickr.length) {
        var fpInstance = rangePickr.flatpickr({
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
                // Show/hide clear button
                if (selectedDates.length > 0) {
                    $(".flatpickr-clear-btn").show();
                } else {
                    $(".flatpickr-clear-btn").hide();
                }
                clientRemainderTable.ajax.reload();
            },
            onChange: function (selectedDates) {
                if (selectedDates.length > 0) {
                    $(".flatpickr-clear-btn").show();
                } else {
                    $(".flatpickr-clear-btn").hide();
                }
            },
        });

        $(document).on("click", ".flatpickr-clear-btn", function () {
            fpInstance.clear();
            startDateEle.val("");
            endDateEle.val("");
            $(this).hide();
            clientRemainderTable.ajax.reload();
        });
    }

    // Select2 Implementation
    $("#clientId").select2("destroy");
    $("#clientId")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#clientId").parent(),
            width: "100%",
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

    // Kit selection functionality
    function loadKitOptions(serviceId) {
        const kitDropdown = $("#kitDropdown");
        kitDropdown.empty().hide();

        // First check if this service has multiple kits
        $.ajax({
            url: `${BASE_URL}/check-multi-kit/${serviceId}`,
            method: "GET",
            success: function (response) {
                if (response.is_multiKit === 1) {
                    // If it's a multi-kit service, fetch and show the kits
                    $.ajax({
                        url: `${BASE_URL}/get-service-kits/${serviceId}`,
                        method: "GET",
                        success: function (response) {
                            // console.log(response.kits);
                            kitDropdown.empty().show();
                            kitDropdown.append(
                                '<option value="">default</option>',
                            );
                            response.kits.forEach(function (kit) {
                                // console.log(kit.clinicServicesKitId);
                                $("#kitDropdown").append(
                                    `<option value="${kit.clinicServicesKitId}">${kit.kit_name}</option>`,
                                );
                            });
                            $("#kit-selection-container").show();
                            $("#kitDropdownlabel").show();
                        },
                        error: function (xhr) {
                            console.error("Error loading kits:", xhr);
                            toastr.error("Failed to load kits");
                        },
                    });
                } else {
                    $("#kit-selection-container").hide();
                    $("#kitDropdownlabel").hide();
                }
            },
            error: function (xhr) {
                console.error("Error checking multi-kit status:", xhr);
                toastr.error("Failed to check kit status");
            },
        });
    }

    // Modal event handlers

    // Kit selection change handler
    // Kit selection change handler

    // $('#filebtn').click(function() {
    //     // Show the addfileModal
    //     $('#addfileModal').modal('show');
    //     $('#addStatusModal').modal('hide');

    //     const serviceOrderMasterId = $('#serviceOrderMasterId').val(); // Assuming this is the correct ID
    //     const serviceId = $('#serviceId').val();

    //     // Fetch media files based on serviceOrderMasterId and serviceId
    //     $.ajax({
    //         url: `${BASE_URL}/fetch-media-files`,
    //         method: 'GET',
    //         data: {
    //             serviceOrderMasterId: serviceOrderMasterId,
    //             serviceId: serviceId
    //         },

    //         error: function(xhr, status, error) {
    //             $('#addfileModal .modal-body').html('<p>Error fetching files. Please try again.</p>');
    //         }
    //     });
    // });

    $("#filebtn").click(function () {
        $("#addfileModal").modal("show");
        $("#addStatusModal").modal("hide");
        const serviceOrderMasterId = $("#serviceOrderMasterId").val();
        const serviceId = $("#hiddenServiceId").val();
        Dropzone.forElement("#xray_file_upload_form").removeAllFiles();

        $.ajax({
            url: `${BASE_URL}/fetch-media-files`,
            method: "GET",
            data: {
                serviceOrderMasterId: serviceOrderMasterId,
                serviceId: serviceId,
            },
            success: function (response) {
                if (response.success) {
                    const mediaContainer1 = $(".previos-images");
                    $(".previos-images").empty();
                    // $('.previos-images')
                    // Loop through `mediaFiles` and append images
                    response.mediaFiles.forEach((mediaFile) => {
                        const imgPath =
                            "http://behighcarev3.local/storage/" +
                            mediaFile.fileNamePath;

                        // const imgPath = '/storage/' + mediaFile.fileNamePath;
                        const imgTag = `
                           


                            <div class="mt-3 media-file">
    <div class="dz-preview-container">

        <div class="dz-preview dz-file-preview">
            <div class="subimage">
                <div class="pdfimg">
<img src="${imgPath}" data-dz-thumbnail alt="" class="subpdfimg" />
                </div>
                <div class="dz-actions mt-2 text-center">
                   <button class="btn btn-sm btn-label-secondary dz-view" type="button" onclick="viewUploadedFile(event)" data-media-file-id="${mediaFile.mediafilesId}">View</button>
                                <button class="btn btn-sm btn-label-danger dz-delete" type="button" onclick="confirmuploadedDelete(event)" data-media-file-id="${mediaFile.mediafilesId}">Delete</button>
                </div>
                
            </div>
        </div>

    </div>
</div>
                        `;
                        mediaContainer1.append(imgTag);
                    });
                } else {
                    $("#addfileModal").modal("show");
                }
            },
            error: function () {
                $("#addfileModal .modal-body").html(
                    "<p>Error fetching files. Please try again.</p>",
                );
            },
        });
    });

    window.confirmuploadedDelete = function (event) {
        const fileElement = event.target.closest(".media-file");
        const mediaFileId =
            event.currentTarget.getAttribute("data-media-file-id");

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

                fetch(`/delete-laboratory/uploaded-file/${mediaFileId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken,
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.success) {
                            fileElement.remove();

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

                            Dropzone.forElement(
                                "#xray1_file_upload_form",
                            ).removeAllFiles(); // Reload the page after deletion
                        } else {
                            console.error("Error deleting file:", data.message);
                        }
                    })
                    .catch((error) =>
                        console.error("Error in deleting file:", error),
                    );
            }
        });
    };

    // $('#filebtn').click(function() {
    //     $('#addfileModal').modal('show');
    //     $('#addStatusModal').modal('hide');
    // });

    // Modal close handler
    $("#closebtn").on("click", function () {
        $("#addStatusModal").modal("hide");
    });

    // Initialize handlers when modal is shown
    $("#addStatusModal").on("shown.bs.modal", function () {});

    // Print button handler
    $("#printbtn").on("click", function () {
        const serviceOrderMasterId = $("#serviceOrderMasterId").val();
        if (!serviceOrderMasterId) {
            toastr.error("Service order ID not found");
            return;
        }

        const printUrl = `${BASE_URL}/laboratory/print-laboratory/${serviceOrderMasterId}`;
        const printWindow = window.open(printUrl, "_blank");

        if (printWindow) {
            printWindow.focus();
        } else {
            toastr.error("Please allow pop-ups for this site to print");
        }
    });

    $(document).on("change", "#kitDropdown", function () {
        const selectedKitId = $(this).val();
        const serviceId = $("#serviceId").val();

        if (selectedKitId) {
            // If a specific kit is selected, fetch the kit design
            $.ajax({
                url: BASE_URL + "/get-service-kits-id/" + serviceId,
                method: "GET",
                data: { kitId: selectedKitId },
                success: function (response) {
                    $("#addStatusModal .modal-body .bg-white")
                        .empty()
                        .html(response.default_design);

                    // Then fetch the results to populate them
                    $.ajax({
                        url: `${BASE_URL}/get-service-design/${serviceId}/${$("#serviceOrderMasterId").val()}`,
                        method: "GET",
                        success: function (resultResponse) {
                            // Populate results in input fields
                            if (
                                resultResponse.resultInputIds &&
                                resultResponse.results
                            ) {
                                resultResponse.resultInputIds.forEach(
                                    (inputId, index) => {
                                        $(`#${inputId}`).val(
                                            resultResponse.results[index] || "",
                                        );
                                    },
                                );
                            }

                            // Populate statuses if they exist
                            if (
                                resultResponse.statusInputIds &&
                                resultResponse.statuses
                            ) {
                                resultResponse.statusInputIds.forEach(
                                    (inputId, index) => {
                                        $(`#${inputId}`).val(
                                            resultResponse.statuses[index] ||
                                                "",
                                        );
                                    },
                                );
                            }

                            // Populate select fields if they exist
                            if (
                                resultResponse.resultSelectIds &&
                                resultResponse.results
                            ) {
                                resultResponse.resultSelectIds.forEach(
                                    (selectId, index) => {
                                        $(`#${selectId}`).val(
                                            resultResponse.results[index] || "",
                                        );
                                    },
                                );
                            }

                            // Populate textarea fields if they exist
                            if (
                                resultResponse.textAreaIds &&
                                resultResponse.results
                            ) {
                                resultResponse.textAreaIds.forEach(
                                    (selectId, index) => {
                                        $(`#${selectId}`).val(
                                            resultResponse.results[index] || "",
                                        );
                                    },
                                );
                            }

                            // Populate fields by name if they exist
                            if (
                                resultResponse.nameInputIds &&
                                resultResponse.results
                            ) {
                                resultResponse.nameInputIds.forEach(
                                    (name, index) => {
                                        $(`input[name="${name}"]`).val(
                                            resultResponse.results[index] || "",
                                        );
                                    },
                                );
                            }
                            if (
                                response.resultTextareaIds &&
                                response.results
                            ) {
                                response.resultTextareaIds.forEach(
                                    (textareaId, index) => {
                                        $(`#${textareaId}`).val(
                                            response.results[index] || "",
                                        );
                                    },
                                );
                            }

                            if (response.statusSelectIds && response.statuses) {
                                response.statusSelectIds.forEach(
                                    (inputId, index) => {
                                        $(`#${inputId}`).val(
                                            response.statuses[index] || "",
                                        );
                                    },
                                );
                            }
                        },
                        error: function (xhr) {
                            console.error("Error loading results:", xhr);
                            toastr.error("Failed to load results");
                        },
                    });
                },
                error: function (xhr) {
                    console.error("Error loading kit design:", xhr);
                    toastr.error("Failed to load kit design");
                },
            });
        } else {
            // If "default" is selected, fetch and display the main service design
            $.ajax({
                url: `${BASE_URL}/get-service-design/${serviceId}/${$("#serviceOrderMasterId").val()}`,
                method: "GET",
                success: function (response) {
                    $("#addStatusModal .modal-body .bg-white").html(
                        response.design,
                    );

                    // Populate all the fields with existing results
                    // if (response.resultInputIds && response.results) {
                    //     response.resultInputIds.forEach((inputId, index) => {
                    //         $(`#${inputId}`).val(response.results[index] || '');
                    //     });
                    // }

                    response.test.forEach(function (item) {
                        // Normalize the parameterName by replacing hyphens with underscores
                        var normalizedParameterName =
                            item.parameterName.replace(/-/g, "_");

                        // Find the matching nameInputId where the normalized parameterName matches part of the nameInputId
                        response.resultInputIds.forEach(
                            function (resultInputIds) {
                                if (
                                    resultInputIds.includes(
                                        normalizedParameterName,
                                    )
                                ) {
                                    // Bind matched result with the correct nameInputId
                                    console.log(
                                        item.result + " -> " + resultInputIds,
                                    );

                                    // Set the value of the input with id 'nameInputId' to item.result
                                    $("#" + resultInputIds).val(item.result);
                                    $(`input[name="${resultInputIds}"]`).val(
                                        item.result || "",
                                    );

                                    // Exit the inner loop once matched
                                    return false;
                                }
                            },
                        );
                    });

                    if (response.statusSelectIds && response.statuses) {
                        response.statusSelectIds.forEach((inputId, index) => {
                            $(`#${inputId}`).val(
                                response.statuses[index] || "",
                            );
                        });
                    }

                    if (response.statusInputIds && response.statuses) {
                        response.statusInputIds.forEach((inputId, index) => {
                            $(`#${inputId}`).val(
                                response.statuses[index] || "",
                            );
                        });
                    }

                    if (response.resultSelectIds && response.results) {
                        response.resultSelectIds.forEach((selectId, index) => {
                            $(`#${selectId}`).val(
                                response.results[index] || "",
                            );
                        });
                    }

                    if (response.textAreaIds && response.results) {
                        response.textAreaIds.forEach((selectId, index) => {
                            $(`#${selectId}`).val(
                                response.results[index] || "",
                            );
                        });
                    }
                    if (response.resultTextareaIds && response.results) {
                        response.resultTextareaIds.forEach(
                            (textareaId, index) => {
                                $(`#${textareaId}`).val(
                                    response.results[index] || "",
                                );
                            },
                        );
                    }

                    response.test.forEach(function (item) {
                        var normalizedParameterName =
                            item.parameterName.replace(/-/g, "_");

                        response.nameInputIds.forEach(function (nameInputId) {
                            if (nameInputId.includes(normalizedParameterName)) {
                                console.log(item.result + " -> " + nameInputId);

                                $("#" + nameInputId).val(item.result);
                                $(`input[name="${nameInputId}"]`).val(
                                    item.result || "",
                                );

                                return false;
                            }
                        });
                    });
                },
                error: function (xhr) {
                    $("#addStatusModal .modal-body .bg-white").html(
                        '<div class="alert alert-danger">Error loading default design. Please try again.</div>',
                    );
                    console.error("Error loading default design:", xhr);
                    toastr.error("Failed to load default design");
                },
            });
        }
    });

    $(document).on(
        "click",
        ".view-btn, .open-status-modal-detail, .open-status-modal-modify",
        function () {
            isEditMode =
                $(this).hasClass("edit-btn") ||
                $(this).hasClass("open-status-modal-modify");

            if (
                !$(this).hasClass("open-status-modal-detail") &&
                !$(this).hasClass("open-status-modal-modify")
            ) {
                const serviceOrderMasterId = $(this).data("id");
                const action = isEditMode ? "modify" : "detail";
               window.open(
                `${BASE_URL}/laboratory-laboratory-result/${serviceOrderMasterId}/${action}`,
                "_blank"
                         );
                return;
            }

            const serviceId = $(this).data("service-id");

            $("#hiddenServiceId").val(serviceId);
            $("#serviceId").val(serviceId);
            $("#addStatusModal .modal-body .bg-white").html(
                '<div class="text-center">Loading...</div>',
            );
            $("#addStatusModal").modal("show");
            $("#addStatusModal").data("service-id", serviceId);

            // $('#modifyBtn').toggle(isEditMode);

            loadKitOptions(serviceId);

            // Load kit options before loading service design
            $.ajax({
                url: `${BASE_URL}/get-service-design/${serviceId}/${$("#serviceOrderMasterId").val()}`,
                method: "GET",
                success: function (response) {
                    currentServiceName = response.serviceName;
                    $("#title").text(response.serviceName);

                    $("#clinicServicesKitIdInput").val(""); // Add this line

                    if (response.clinicServicesKitId) {
                        $("#clinicServicesKitIdInput").val(
                            response.clinicServicesKitId,
                        ); // Add this line
                    }

                    if (response.clinicServicesKitId == 0) {
                        $("#addStatusModal .modal-body .bg-white").html(
                            response.design,
                        );
                    } else {
                        $("#kitDropdown")
                            .val(response.clinicServicesKitId)
                            .change();
                    }

                    if (response.resultInputIds && response.results) {
                        response.resultInputIds.forEach((inputId, index) => {
                            $(`#${inputId}`).val(response.results[index] || "");
                        });
                    }

                    // if (resultResponse.statusSelectIds && resultResponse.statuses) {
                    //     resultResponse.statusSelectIds.forEach((inputId, index) => {
                    //         $(`#${inputId}`).val(resultResponse.statuses[index] || '');
                    //     });
                    // }

                    if (response.statusSelectIds && response.statuses) {
                        response.statusSelectIds.forEach((inputId, index) => {
                            $(`#${inputId}`).val(
                                response.statuses[index] || "",
                            );
                        });
                    }

                    if (response.statusInputIds && response.statuses) {
                        response.statusInputIds.forEach((inputId, index) => {
                            $(`#${inputId}`).val(
                                response.statuses[index] || "",
                            );
                        });
                    }

                    if (response.resultSelectIds && response.results) {
                        response.resultSelectIds.forEach((selectId, index) => {
                            $(`#${selectId}`).val(
                                response.results[index] || "",
                            );
                        });
                    }

                    if (response.textAreaIds && response.results) {
                        response.textAreaIds.forEach((selectId, index) => {
                            $(`#${selectId}`).val(
                                response.results[index] || "",
                            );
                        });
                    }

                    if (response.nameInputIds && response.results) {
                        response.nameInputIds.forEach((name, index) => {
                            $(`input[name="${name}"]`).val(
                                response.results[index] || "",
                            );
                        });
                    }

                    if (response.resultTextareaIds && response.results) {
                        response.resultTextareaIds.forEach(
                            (textareaId, index) => {
                                $(`#${textareaId}`).val(
                                    response.results[index] || "",
                                );
                            },
                        );
                    }
                },
                error: function (xhr) {
                    $("#addStatusModal .modal-body .bg-white").html(
                        '<div class="alert alert-danger">Error loading form content. Please try again.</div>',
                    );
                },
            });
        },
    );

            $(document).on("click", "#modifyBtn", function (e) {
                e.preventDefault();

        const serviceOrderMasterId = $("#serviceOrderMasterId").val();
        const serviceId = $("#addStatusModal").data("service-id");
        const selectedKitId = $("#kitDropdown").val();
        const formData = [];

        // const unitValues = [];

        // First condition: Only execute if there are elements with id starting with 'result_'
        if ($('input[id^="result_"], select[id^="result_"]').length > 0) {
            $('input[id^="result_"], select[id^="result_"]').each(
                function (index) {
                    const paramName = $(this).attr("id").replace("result_", "");
                    const paramNametype2 = paramName.replace(/_/g, "-");
                    const resultValue = $(this).val();
                    const statusValue = $(`#status_${paramName}`).val();
                    // const statusValue2 = $(`select[name='lab[${paramNametype2}][status]']`).val();

                    const parameterNameValue =
                    $(`input[name='lab[${paramName}][name]']`).val();                //    const unitValue = $(`input[name='lab[${paramNametype2}][unit]']`).val();

                    let unitValue =
                        $(`input[name='lab[${paramName}][unit]']`).val() ||
                        $(`#unit_${paramName}`).val() ||
                        $(`#unit_${paramName}`).text() ||
                        "";

unitValue = String(unitValue || "").replace(/<br\s*\/?>/gi, " ").trim();


                    // let refRangeValue = "";
                    // const refRangeInput = $(`#ref_Range_${paramNametype2}`);
                    // const refRangeDiv = $(`#ref_range_${paramNametype2}`);

                    // if (refRangeInput.length > 0) {
                    //     refRangeValue =
                    //         refRangeInput.val() || refRangeInput.text();
                    // } else if (refRangeDiv.length > 0) {
                    //     refRangeValue = refRangeDiv.text();
                    // }

                    // refRangeValue = refRangeValue.replace(/<br\s*\/?>/gi, " ");

  let refRangeValue =
    $(`input[name='lab[${paramName}][ref_Range]']`).val() ||
    $(`#ref_range_${paramName}`).val() ||
    "";

refRangeValue = String(refRangeValue || "")
    .replace(/<br\s*\/?>/gi, " ")
    .trim();

                    if (resultValue || statusValue) {
                        formData.push({
                            serviceOrderMasterId: serviceOrderMasterId,
                            serviceId: serviceId,
                            parameterName: paramNametype2,
                            result: resultValue || "",
                            status: statusValue || "",
                            unit: unitValue || "",
                            refRange: refRangeValue || "",
                            clinicServicesKitId: selectedKitId,
                            idKey: paramNametype2,
                        });
                    }
                },
            );
        } else if ($('input[name^="lab["][name$="[result]"]').length > 0) {
            $('input[name^="lab["][name$="[result]"]').each(function () {
                const nameAttr = $(this).attr("name");
                const paramName = nameAttr
                    .match(/\[([^\]]+)\]/g)[0]
                    .replace(/\[|\]/g, "");
                const paramNametype2 = paramName.replace(/_/g, "-");
                const resultValue = $(this).val();
                const statusValue = $(
                    `input[name="lab[${paramNametype2}][status]"]`,
                ).val();
              const parameterNameValue =
            $(`input[name='lab[${paramName}][name]']`).val();
   
let unitValue =
    $(`input[name="lab[${paramNametype2}][unit]"]`).val() ||
    $(`#unit_${paramNametype2}`).val() ||
    $(`#unit_${paramNametype2}`).text() ||
    "";

unitValue = String(unitValue || "").trim();
              let refRangeValue =
    $(`input[name="lab[${paramName}][ref_Range]"]`).val() ||
    $(`#ref_range_${paramName}`).val() ||
    "";
                refRangeValue = refRangeValue.replace(/<br\s*\/?>/gi, " ");

                if (resultValue || statusValue) {
                    formData.push({
                        serviceOrderMasterId: serviceOrderMasterId,
                        serviceId: serviceId,
                        parameterName: paramNametype2,
                        result: resultValue || "",
                        status: statusValue || "",
                        unit: unitValue || "",
                        refRange: refRangeValue || "",
                        clinicServicesKitId: selectedKitId,
                        idKey: paramNametype2,
                    });
                }
            });
        } else {
            // New condition for input, select, and textarea elements
            $(
                'input[id^="result_"], select[id^="result_"], textarea[id^="result_"]',
            ).each(function (index) {
                const paramName = $(this).attr("id").replace("result_", "");
                const paramNametype2 = paramName.replace(/_/g, "-");
                const resultValue = $(this).val(); // This works for input, select, and textarea
                const statusValue = $(`#status_${paramName}`).val() || "";
                const parameterNameValue =
                $(`input[name='lab[${paramName}][name]']`).val();
 
let unitValue =
    $(`input[name='lab[${paramNametype2}][unit]']`).val() ||
    $(`input[name='lab[${paramName}][unit]']`).val() ||
    $(`#unit_${paramNametype2}`).val() ||
   $(`#unit_${paramNametype2}`).text() ||
    "";

unitValue = String(unitValue || "")
    .replace(/<br\s*\/?>/gi, " ")
    .trim();

                let refRangeValue = "";
                const refRangeInput = $(`#ref_Range_${paramNametype2}`);
                const refRangeDiv = $(`#ref_range_${paramNametype2}`);

                if (refRangeInput.length > 0) {
                    refRangeValue = refRangeInput.val() || refRangeInput.text();
                } else if (refRangeDiv.length > 0) {
                    refRangeValue = refRangeDiv.text();
                }

                refRangeValue = refRangeValue.replace(/<br\s*\/?>/gi, " ");

                if (resultValue || statusValue) {
                    formData.push({
                        serviceOrderMasterId: serviceOrderMasterId,
                        serviceId: serviceId,
                        parameterName: paramNametype2,
                        result: resultValue || "",
                        status: statusValue || "",
                        unit: unitValue || "",
                        refRange: refRangeValue || "",
                        clinicServicesKitId: selectedKitId,
                        idKey: paramNametype2,
                    });
                }
            });
        }

        const originalContent = $("#addStatusModal .modal-body .bg-white").html();

        $("#addStatusModal .modal-body .bg-white").html(`
            <div class="d-flex flex-column justify-content-center align-items-center" style="height:200px">
                <div class="spinner-border text-primary"></div>
                <h5 class="mt-3">Updating Results...</h5>
            </div>
        `);


        $.ajax({
            url: `${BASE_URL}/create-results`,
            method: "POST",
            data: {
                updates: formData,
                _token: $('meta[name="csrf-token"]').attr("content"),
            },

            success: function (response) {
                      
                if (response.success) {
                      // Close the Bootstrap modal first
        $("#addStatusModal").modal("hide");
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
                     $("#addStatusModal .modal-body .bg-white").html(originalContent);
                    toastr.error(response.message || "Error updating results");
                    console.error("Update error:", response);
                }
            },
            error: function (xhr) {
                $("#addStatusModal .modal-body .bg-white").html(originalContent);
                const errorMessage =
                    xhr.responseJSON?.message || "Error updating results";
                toastr.error(errorMessage);
                console.error("Update error:", xhr);
            },
   
   
        });
    });

    Dropzone.autoDiscover = false;

    function initDropzone(selector, paramName) {
        return new Dropzone(selector, {
            url: BASE_URL + "/lab/upload-files",
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
                let errorMsg = response.error || "File upload failed";
                $("#message").html(
                    '<p style="color: red;">' + errorMsg + "</p>",
                );
            },
        });
    }

    var xrayDropzone = initDropzone("#xray_file_upload_form", "lab_file");

    function handleBrowse(buttonId, dropzoneInstance) {
        $(buttonId).on("click", function (e) {
            e.preventDefault();
            dropzoneInstance.hiddenFileInput.click();
        });
    }

    handleBrowse("#btnBrowse1", xrayDropzone);

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

    $("#commentbtn").on("click", function () {
        // Get the serviceOrderMasterId value
        var serviceOrderMasterId = $("#MasterId").val();

        // Show the modal first
        $("#comment-modal").modal("show");

        // Fetch the labComment based on serviceOrderMasterId
        $.ajax({
            url: "/fetch-lab-comment", // Your endpoint to get labComment
            type: "GET",
            data: { serviceOrderMasterId: serviceOrderMasterId },
            success: function (response) {
                // Populate the labComment in the modal (adjust as needed)
                $("#comments").text(response.labComment);
            },
            error: function (error) {
                console.log("Error fetching lab comment:", error);
                // Optionally, show an error message in the modal
                $("#comment-modal .modal-body").text("Error fetching comment.");
            },
        });
    });

    document
        .getElementById("commentsave")
        .addEventListener("click", function () {
            const masterId = document.getElementById("MasterId").value;
            const comments = document.getElementById("comments").value;

            // Check if the MasterId and comments are available
            if (masterId && comments) {
                // Send an AJAX request to save the comment
                fetch("/save-comment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"), // CSRF token for Laravel
                    },
                    body: JSON.stringify({
                        masterId: masterId,
                        comments: comments,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.success) {
                            Swal.fire({
                                title: "Success!",
                                text: "The comment was saved successfully.",
                                icon: "success",
                                confirmButtonText: "OK",
                                customClass: {
                                    confirmButton:
                                        "btn btn-primary waves-effect waves-light",
                                },
                                buttonsStyling: false,
                            });
                            $("#comment-modal").modal("hide"); // Close the modal
                        } else {
                            Swal.fire({
                                title: "Failed to Save Comment",
                                text: "There was an error saving the comment.",
                                icon: "error",
                                confirmButtonText: "OK",
                            });
                        }
                    });
            } else {
            }
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
                <button class="btn btn-sm btn-label-secondary dz-view" type="button" onclick="viewFile(event)" disabled>View</button>
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
            viewButton.disabled = false;

            const formData = new FormData();
            formData.append("lab_file", file);
            formData.append("lab_file", file.name);
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");
            formData.append("_token", csrfToken);
            formData.append("affectedId", $("#serviceOrderMasterId").val());
            formData.append("serviceId", $("#hiddenServiceId").val());

            fetch("/lab/upload-files", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        console.log("File saved successfully:", data);

                        const deleteButton =
                            file.previewElement.querySelector(".dz-delete");
                        const viewButton =
                            file.previewElement.querySelector(".dz-view");

                        deleteButton.setAttribute(
                            "data-file-id",
                            data.lab_file[0],
                        );
                        viewButton.setAttribute(
                            "data-file-id",
                            data.lab_file[0],
                        );
                    } else {
                        console.error("Error saving file:", data.message);
                    }
                })
                .catch((error) =>
                    console.error("Error in saving file:", error),
                );
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

                    fetch(`/delete-laboratory/uploaded-file/${fileId}`, {
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
                        );
                }
            });
        };
    },
};

function viewFile(event) {
    const fileId = event.target.getAttribute("data-file-id");
    if (fileId) {
        fetch("/view-lab-file/" + fileId, {
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
            .catch((error) => console.error("Error in viewing file:", error));
    }
}

function viewUploadedFile(event) {
    const mediaFileId = event.currentTarget.getAttribute("data-media-file-id");
    const modalContent = document.getElementById("file-view-modal-content");
    modalContent.innerHTML = "";

    fetch(`/view-lab-file/${mediaFileId}`)
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
        });
}

function status(status, result, ref_range) {
    var resultVal = $(result).val();
    var refRange = $(ref_range).val();
    var strArray = refRange.split(" - ");
    if (
        parseFloat(strArray[0]) <= parseFloat(resultVal) &&
        parseFloat(strArray[1]) >= parseFloat(resultVal)
    ) {
        //6.86 - 8.86
        $(status).val("normal");
    } else if (parseFloat(strArray[0]) >= parseFloat(resultVal)) {
        $(status).val("low");
    } else if (parseFloat(strArray[1]) <= parseFloat(resultVal)) {
        $(status).val("high");
    } else {
        $(status).val("");
    }
}

function statusV2(status, result, ref_range) {
    var resultVal = $(result).val();
    var refRange = $(ref_range).val();
    var strArray = refRange.split(" - ");
    if (
        parseFloat(strArray[0]) <= parseFloat(resultVal) &&
        parseFloat(strArray[1]) >= parseFloat(resultVal)
    ) {
        //6.86 - 8.86
        $(status).val("normal");
    } else if (parseFloat(strArray[0]) >= parseFloat(resultVal)) {
        $(status).val("low");
    } else if (parseFloat(strArray[1]) <= parseFloat(resultVal)) {
        $(status).val("high");
    } else {
        $(status).val("");
    }
}

function status_Rheumatoid_Factor(status, result, ref_range) {
    var resultVal = $(result).val();
    var refRange = 40;
    if (parseFloat(resultVal) < parseFloat(refRange)) {
        //6.86 - 8.86
        $(status).val("normal");
    } else {
        $(status).val("high");
    }
}
function status_Ck_Mb(status, result, ref_range) {
    var resultVal = $(result).val();
    var refRange = 16;
    if (parseFloat(resultVal) < parseFloat(refRange)) {
        //6.86 - 8.86
        $(status).val("normal");
    } else {
        $(status).val("high");
    }
}

function Widal(status, result, ref_range) {
    var resultVal = $(result).val();
    var refRange = "1/40";
    if (refRange == resultVal) {
        //6.86 - 8.86
        $(status).val("Negative");
    } else {
        $(status).val("Positive");
    }
}
function status_m_and_f(status, result, ref_range_male, ref_range_female) {
    var gender = $("#gender").val();
    if (gender == "m") {
        refRange = ref_range_male;
    } else if (gender == "f") {
        refRange = ref_range_female;
    }

    console.log(refRange);

    var resultVal = $(result).val();
    var strArray = refRange.split(" - ");
    if (
        parseFloat(strArray[0]) <= parseFloat(resultVal) &&
        parseFloat(strArray[1]) >= parseFloat(resultVal)
    ) {
        //6.86 - 8.86
        $(status).val("normal");
    } else if (parseFloat(strArray[0]) >= parseFloat(resultVal)) {
        $(status).val("low");
    } else if (parseFloat(strArray[1]) <= parseFloat(resultVal)) {
        $(status).val("high");
    } else {
        $(status).val("test");
    }
}

function cholesterol(status, result) {
    // var gender=$('#gender').val();
    var resultVal = $(result).val();
    if (parseFloat(resultVal) > parseFloat(200)) {
        $(status).val("high");
    } else {
        $(status).val("Normal");
    }
}

function aso_Titer(status, result) {
    var resultVal = $(result).val();
    if (parseFloat(resultVal) > parseFloat(200)) {
        $(status).val("Positive");
    } else {
        $(status).val("Negative");
    }
}

function bleedingTime(status, result) {
    // var gender=$('#gender').val();
    var resultVal = $(result).val();
    if (parseFloat(resultVal) > parseFloat(5)) {
        $(status).val("high");
    } else {
        $(status).val("Normal");
    }
}

function lipase(status, result) {
    // var gender=$('#gender').val();
    var resultVal = $(result).val();
    if (parseFloat(resultVal) < parseFloat(95)) {
        $(status).val("Normal");
    } else {
        $(status).val("High");
    }
}
function hiv_and_hcv(status, result) {
    var resultVal = $(result).val();
    if (parseFloat(resultVal) < parseFloat(0.9)) {
        //6.86 - 8.86
        $(status).val("Negative");
    } else if (
        parseFloat(resultVal) >= parseFloat(0.9) &&
        parseFloat(resultVal) < parseFloat(1.0)
    ) {
        $(status).val("Borderline");
    } else if (parseFloat(resultVal) >= parseFloat(1.0)) {
        $(status).val("Positive");
    }
}

function atg(status, result) {
    var resultVal = $(result).val();
    if (parseFloat(resultVal) < parseFloat(100)) {
        //6.86 - 8.86
        $(status).val("Negative");
    } else if (
        parseFloat(resultVal) >= parseFloat(100) &&
        parseFloat(resultVal) < parseFloat(150)
    ) {
        $(status).val("Borderline");
    } else if (parseFloat(resultVal) >= parseFloat(150)) {
        $(status).val("Positive");
    }
}
function rubella_igg(status, result) {
    var resultVal = $(result).val();
    if (parseFloat(resultVal) < parseFloat(5)) {
        //6.86 - 8.86
        $(status).val("Negative");
    } else if (
        parseFloat(resultVal) >= parseFloat(5) &&
        parseFloat(resultVal) <= parseFloat(10)
    ) {
        $(status).val("Equivocal");
    } else if (parseFloat(resultVal) > parseFloat(10)) {
        $(status).val("Positive");
    }
}
function rubella_igm(status, result) {
    var resultVal = $(result).val();
    if (parseFloat(resultVal) < parseFloat(20)) {
        //6.86 - 8.86
        $(status).val("Negative");
    } else if (
        parseFloat(resultVal) >= parseFloat(20) &&
        parseFloat(resultVal) <= parseFloat(25)
    ) {
        $(status).val("Equivocal");
    } else if (parseFloat(resultVal) > parseFloat(25)) {
        $(status).val("Positive");
    }
}
function toxoplasma_igg(status, result) {
    var resultVal = $(result).val();
    if (parseFloat(resultVal) < parseFloat(7.2)) {
        //6.86 - 8.86
        $(status).val("Negative");
    } else if (
        parseFloat(resultVal) >= parseFloat(7.2) &&
        parseFloat(resultVal) <= parseFloat(8.8)
    ) {
        $(status).val("Equivocal");
    } else if (parseFloat(resultVal) > parseFloat(8.8)) {
        $(status).val("Positive");
    }
}
function urea_breath_test(status, result) {
    var resultVal = $(result).val();
    if (resultVal <= 3) {
        //3 p
        $(status).val("Positive");
    } else {
        $(status).val("Negative");
    }
}
function toxoplasma_igm(status, result) {
    var resultVal = $(result).val();
    if (parseFloat(resultVal) < parseFloat(6)) {
        //6.86 - 8.86
        $(status).val("Negative");
    } else if (
        parseFloat(resultVal) >= parseFloat(6) &&
        parseFloat(resultVal) <= parseFloat(8)
    ) {
        $(status).val("Equivocal");
    } else if (parseFloat(resultVal) > parseFloat(8)) {
        $(status).val("Positive");
    }
}

function anti_nuclear_antibody_serum(status, result) {
    var resultVal = $(result).val();
    if (parseFloat(resultVal) < parseFloat(1.0)) {
        //6.86 - 8.86
        $(status).val("Negative");
    } else if (
        parseFloat(resultVal) >= parseFloat(1.0) &&
        parseFloat(resultVal) <= parseFloat(1.2)
    ) {
        $(status).val("Borderline");
    } else if (parseFloat(resultVal) > parseFloat(1.2)) {
        $(status).val("Positive");
    }
}

function hbaic(status, result) {
    // var gender=$('#gender').val();
    var resultVal = $(result).val();
    if (parseFloat(resultVal) < parseFloat(5.7)) {
        $(status).val("Normal");
    } else {
        $(status).val("High");
    }
}
function accp(status, result) {
    var resultVal = $(result).val();
    if (parseFloat(resultVal) < parseFloat(20)) {
        //6.86 - 8.86
        $(status).val("Non-reactive");
    } else if (parseFloat(resultVal) >= parseFloat(20)) {
        $(status).val("Reactive");
    }
}
function hbs_ag(status, result) {
    var resultVal = $(result).val();
    if (parseFloat(resultVal) < parseFloat(0.9)) {
        //6.86 - 8.86
        $(status).val("Negative");
    } else if (
        parseFloat(resultVal) >= parseFloat(0.9) &&
        parseFloat(resultVal) <= parseFloat(1.0)
    ) {
        $(status).val("Borderline");
    } else if (parseFloat(resultVal) >= parseFloat(1.0)) {
        $(status).val("Positive");
    }
}
function cholesterol_LDL(status, result) {
    var resultVal = $(result).val();
    if (parseFloat(resultVal) < parseFloat(100)) {
        //6.86 - 8.86
        $(status).val("Normal");
    } else if (
        parseFloat(resultVal) >= parseFloat(100) &&
        parseFloat(resultVal) <= parseFloat(159)
    ) {
        $(status).val("Marginal");
    } else if (
        parseFloat(resultVal) >= parseFloat(160) &&
        parseFloat(resultVal) <= parseFloat(189)
    ) {
        $(status).val("high");
    } else if (parseFloat(resultVal) >= parseFloat(190)) {
        $(status).val("Very High");
    }
}
function cholesterol_HDL(status, result) {
    var resultVal = $(result).val();
    if (parseFloat(resultVal) < parseFloat(40)) {
        //6.86 - 8.86
        $(status).val("Low (heart risk)");
    } else if (
        parseFloat(resultVal) >= parseFloat(40) &&
        parseFloat(resultVal) <= parseFloat(60)
    ) {
        $(status).val("Moderate");
    } else if (
        parseFloat(resultVal) >= parseFloat(40) &&
        parseFloat(resultVal) <= parseFloat(60)
    ) {
        $(status).val("Normal");
    }
}

function triglycerides(status, result) {
    var resultVal = $(result).val();
    if (
        parseFloat(resultVal) >= parseFloat(40) &&
        parseFloat(resultVal) <= parseFloat(150)
    ) {
        //6.86 - 8.86
        $(status).val("Normal");
    } else if (
        parseFloat(resultVal) >= parseFloat(150) &&
        parseFloat(resultVal) <= parseFloat(200)
    ) {
        $(status).val("Borderline");
    } else if (
        parseFloat(resultVal) >= parseFloat(200) &&
        parseFloat(resultVal) <= parseFloat(500)
    ) {
        $(status).val("High");
    } else if (parseFloat(resultVal) > parseFloat(500)) {
        $(status).val("Very High");
    }
}

function amh(status, result) {
    var resultVal = $(result).val();
    if (parseFloat(resultVal) < parseFloat(0.3)) {
        //6.86 - 8.86
        $(status).val("Very Low");
    } else if (
        parseFloat(resultVal) >= parseFloat(0.3) &&
        parseFloat(resultVal) <= parseFloat(0.6)
    ) {
        $(status).val("Low");
    } else if (
        parseFloat(resultVal) >= parseFloat(0.7) &&
        parseFloat(resultVal) <= parseFloat(0.9)
    ) {
        $(status).val("Normal Low");
    } else if (
        parseFloat(resultVal) >= parseFloat(1) &&
        parseFloat(resultVal) <= parseFloat(2.9)
    ) {
        $(status).val("Normal");
    } else if (
        parseFloat(resultVal) >= parseFloat(3) &&
        parseFloat(resultVal) <= parseFloat(6)
    ) {
        $(status).val("High");
    } else {
        $(status).val("Too High");
    }
}

function Vitamin_D3(status, result) {
    var resultVal = $(result).val();
    if (parseFloat(resultVal) < parseFloat(20)) {
        //6.86 - 8.86
        $(status).val("Deficient");
    } else if (
        parseFloat(resultVal) >= parseFloat(20) &&
        parseFloat(resultVal) <= parseFloat(29)
    ) {
        $(status).val("Insufficient");
    } else if (
        parseFloat(resultVal) >= parseFloat(30) &&
        parseFloat(resultVal) <= parseFloat(100)
    ) {
        $(status).val("Sufficient");
    } else if (parseFloat(resultVal) >= parseFloat(100)) {
        $(status).val("High or Toxic");
    }
}
