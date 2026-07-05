function replayModal(UUId, replaySystemUrl, replayCommunicationMessage, event) {
    if (event) event.preventDefault();
    $("#communicationModal").modal("show");
    $("#replayUUId").val(UUId);
    $("#replaySystemUrl").val(replaySystemUrl);
    $("#replayCommunicationMessage").val(replayCommunicationMessage);
}
function detailsModal(communicationId, UUId, event) {
    if (event) event.preventDefault();
    $("#communicationDetailsModal").modal("show");
    $("#communicationId").val(communicationId);
    $("#detailsUUId").val(UUId);
    $("#commUUID").val("");
    $("#commReplayUUID").val("");
    $("#commType").val("");
    $("#commCategoryType").val("");
    $("#commPriorityType").val("");
    $("#reasonCode").val("");
    $("#eventCode").val("");
    fetchCommunicationDetails(communicationId);
}
function fetchCommunicationDetails(communicationId) {
    $("#loader-overlay").show();
    $.ajax({
        url: "/communications/details/" + communicationId,
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            $("#loader-overlay").hide();
            $("#commUUID").val(response.UUID ?? "");
            $("#commReplayUUID").val(response.replayUUID ?? "");
            $("#commType").val(response.communicationType ?? "");
            $("#commCategoryType").val(
                response.communicationCategoryType ?? "",
            );
            $("#commPriorityType").val(
                response.communicationPriorityType ?? "",
            );
            $("#reasonCode").val(response.reasonCode ?? "");
            $("#eventCode").val(response.eventCode ?? "");
        },
        error: function (xhr) {
            $("#loader-overlay").hide();
            $("#communicationDetailsModal").modal("hide");
            let errorMessage = "Failed to load communication details.";
            if (xhr.status === 422) {
                const errors = xhr.responseJSON.errors;
                $(".error-text").text("");
                $.each(errors, function (key, value) {
                    $("." + key + "_error").text(value[0]);
                });
                return;
            } else if (xhr.responseJSON?.message) {
                errorMessage = xhr.responseJSON.message;
            }
            Swal.fire({
                icon: "error",
                title: "Access denied",
                text: errorMessage,
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        },
    });
}
$(document).ready(function () {
    const submitValue = $("#submitAction").val();
    if (submitValue === "pre-authorization") {
        $("#insurance_main_menu").addClass("active open menu-item-animating");
        $("#pre_authorization_sub_menu").addClass("active");
    } else if (submitValue === "resubmission-pre-authorization") {
        $("#insurance_main_menu").addClass("active open menu-item-animating");
        $("#pre_authorization_sub_menu").addClass("active");
    } else if (submitValue === "claim") {
        $("#claim_main_menu").addClass("active open menu-item-animating");
        $("#claims_management_sub_menu").addClass("active");
    } else if (submitValue === "viewPreAuthorization") {
        $("#insurance_main_menu").addClass("active open menu-item-animating");
        $("#pre_authorization_sub_menu").addClass("active");
    } else if (submitValue === "cancelClaim") {
        $("#claim_main_menu").addClass("active open menu-item-animating");
        $("#claims_submitted_sub_menu").addClass("active");
    }
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    let communicationEntryCount = 0;

    $("#communicationAddModal").click(function () {
        $("#communicationModalForm")[0].reset();
        $("#communicationPriorityType").val("").trigger("change");
        $("#communicationCategoryType").val("").trigger("change");
        $("#communicationItemServices").val(null).trigger("change");
        $("#communicationFileUpload").val("");
        $("#communicationDetailsTable tbody").empty();
        communicationEntryCount = 0;
        $("#communicationModal").modal("show");
    });

    $("#communicationModal").on("shown.bs.modal", function () {
        $("#communicationItemServices").select2("destroy");
        $("#communicationItemServices")
            .wrap('<div class="position-relative"></div>')
            .select2({
                placeholder: "Search client",
                dropdownParent: $("#communicationItemServices").parent(),
                allowClear: true,
                ajax: {
                    url: "/communication-service-search-by-query",
                    dataType: "json",
                    delay: 250,
                    data: function (params) {
                        return {
                            serviceCodeOrName: params.term,
                            formType: $("#submitAction").val(),
                            preAuthorizationRequestId: $(
                                "#preAuthorizationRequestId",
                            ).val(),
                            claimRequestId: $("#claimRequestId").val(),
                        };
                    },
                    processResults: function (data) {
                        return {
                            results: data.map(function (item) {
                                return {
                                    id: item.serviceOrderListId,
                                    text:
                                        "(" +
                                        item.serviceCode +
                                        ") " +
                                        item.serviceName_en,
                                };
                            }),
                        };
                    },
                    cache: true,
                },
            });
    });

    let communicationFiles = {};
    $("#communicationDetailsAppend").click(function () {
        const communicationPriorityType = $("#communicationPriorityType").val();
        const communicationCategoryType = $("#communicationCategoryType").val();
        const communicationFileInput = $("#communicationFileUpload")[0];
        const file = communicationFileInput.files.length
            ? communicationFileInput.files[0]
            : null;
        const communicationDescription = $("#communicationDescription").val();
        console.log(communicationDescription);
        const communicationItemServiceId = $(
            "#communicationItemServices",
        ).val();
        const communicationItemServiceText = $(
            "#communicationItemServices option:selected",
        ).text();
        console.log(communicationDescription);
        if (!communicationDescription && !communicationItemServiceId && !file) {
            console.log(communicationDescription);
            Swal.fire({
                icon: "warning",
                title: "Please fill at least one field.",
                customClass: { confirmButton: "btn btn-warning" },
            });
            return;
        }
        const index = communicationEntryCount;
        communicationEntryCount++;
        if (file) {
            communicationFiles[index] = file;
        }
        const rowHtml = `
        <tr>
            <td>${communicationEntryCount}</td>
            <td>
                ${file ? file.name : ""}
                ${
                    file
                        ? `<input type="hidden" name="entries[${index}][hasFile]" value="1">`
                        : ""
                }
            </td>
            <td>
                ${communicationDescription}
                <input type="hidden" name="entries[${index}][communicationDescription]" value="${communicationDescription}">
            </td>
            <td>
                ${communicationItemServiceText}
                <input type="hidden" name="entries[${index}][communicationItemService]" value="${communicationItemServiceId}">
            </td>
            <td>
                <button type="button" class="btn btn-outline-danger btn-sm remove-communication ">
                    <i class="ti ti-trash"></i>
                </button>
            </td>
        </tr>`;
        $("#communicationDetailsTable tbody").append(rowHtml);
        $("#communicationDescription").val("");
        $("#communicationItemServices").val(null).trigger("change");
        $("#communicationFileUpload").val("");
        $("#communicationDescription").val("").prop("disabled", false);
        $("#communicationFileUpload").val("").prop("disabled", false);
    });
    $("#communicationAdd").click(function () {
        const formData = new FormData();
        formData.set(
            "preAuthorizationRequestId",
            $("#preAuthorizationRequestId").val(),
        );
        formData.set("replayUUId", $("#replayUUId").val());
        formData.set("replaySystemUrl", $("#replaySystemUrl").val());
        formData.set(
            "replayCommunicationMessage",
            $("#replayCommunicationMessage").val(),
        );
        formData.set("claimRequestId", $("#claimRequestId").val());
        formData.set("eligibilityCheckId", $("#eligibilityCheckId").val());
        console.log($("#eligibilityCheckId").val());
        formData.set("submitAction", $("#submitAction").val());
        formData.set(
            "communicationPriorityType",
            $("#communicationPriorityType").val(),
        );
        formData.set(
            "communicationCategoryType",
            $("#communicationCategoryType").val(),
        );
        $("#communicationDetailsTable tbody tr").each(function (index) {
            const row = $(this);
            const description = row
                .find(
                    "input[name^='entries'][name$='[communicationDescription]']",
                )
                .val();
            const service = row
                .find(
                    "input[name^='entries'][name$='[communicationItemService]']",
                )
                .val();
            const hasFile = row
                .find("input[name^='entries'][name$='[hasFile]']")
                .val();
            formData.append(
                `entries[${index}][communicationDescription]`,
                description,
            );
            formData.append(
                `entries[${index}][communicationItemService]`,
                service,
            );
            if (hasFile === "1" && communicationFiles[index]) {
                formData.append(
                    `entries[${index}][communicationFileUpload]`,
                    communicationFiles[index],
                );
            }
        });
        const ajaxUrl = BASE_URL + "/communication-store";
        const method = "POST";
        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $("#loader-overlay").hide();
                Swal.fire({
                    icon: response.status ? "success" : "error",
                    text: response.message,
                    customClass: {
                        confirmButton: `btn btn-${
                            response.status ? "success" : "danger"
                        } waves-effect waves-light`,
                    },
                }).then(function () {
                    location.reload();
                });

                $("#communicationModal").modal("hide");
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                $("#communicationModal").modal("hide");
                let errorMessage =
                    "An unexpected error occurred. Please try again.";
                if (xhr.status === 422) {
                    const errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                    return;
                } else if (xhr.responseJSON?.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                Swal.fire({
                    icon: "error",
                    title: "Access denied",
                    text: errorMessage,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });

    $(document).on("click", ".remove-communication", function () {
        $(this).closest("tr").remove();
        $("#communicationDetailsTable tbody tr").each(function (index) {
            $(this)
                .find("td:first")
                .text(index + 1);
        });
        communicationEntryCount = $(
            "#communicationDetailsTable tbody tr",
        ).length;
    });

    $("#communicationFileUpload").on("change", function () {
        if (this.files.length > 0) {
            $("#communicationDescription").prop("disabled", true).val("");
        } else {
            $("#communicationDescription").prop("disabled", false);
        }
    });

    $("#communicationDescription").on("input", function () {
        if ($(this).val().trim().length > 0) {
            $("#communicationFileUpload").prop("disabled", true).val("");
        } else {
            $("#communicationFileUpload").prop("disabled", false);
        }
    });
});
