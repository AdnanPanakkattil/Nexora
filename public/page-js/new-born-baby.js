$(document).ready(function () {
    $("#loader-overlay").show();
    $("#patient_main_menu").addClass("active open menu-item-animating");
    $("#new_born_baby_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    if ($("#client_id").val()) {
        loadEditNewBornBabyTabData($("#client_id").val());
    } else {
        $("#loader-overlay").hide();
    }

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    flatpickr("#newBorn_birthDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
        maxDate: "today",
        minDate: ninetyDaysAgo,
    });

    if ($("#parentDetails").data("select2")) {
        $("#parentDetails").select2("destroy");
    }
    $("#parentDetails")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#parentDetails").parent(),
            width: "100%",
            placeholder: "Search Patient Details",
            allowClear: true,
            minimumInputLength: 2,
            ajax: {
                url: "/search-parentDetails",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return { query: params.term };
                },
                processResults: function (data) {
                    return {
                        results: data.map((client) => ({
                            id: client.clientId,
                            text: `${client.name}`,
                            name: client.name,
                            idNationalType: client.idNationalType,
                            idNational: client.idNational,
                            clientName_en: client.clientName_en,
                            secondName_en: client.secondName_en,
                            fourthName_en: client.fourthName_en,
                            insurancePayerId: client.insurancePayerId,
                            policyNumber: client.policyNumber,
                            policyHolder: client.policyHolder,
                            policyClassName: client.policyClassName,
                            mobile: client.mobile,
                            birthDate: client.birthDate,
                            gender: client.gender,
                            MaritalStatus: client.maritalStatus,
                            occupation: client.occupation,
                            religion: client.religion,
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
            allowClear: true,
        });

        function formatSearch(client) {
            if (!client.id) return client.text;
            return `
                <div>
                    <strong>${client.name || 'Unknown'} </strong><br>
                    <small>Mobile: ${client.mobile || 'N/A'} | National ID: ${client.idNational || 'N/A'}</small>
                </div>
            `;
        }

        function formatSearchSelection(client) {
            if (!client.id) return client.text;
            return client.name
                ? client.name
                : client.text;
        }

    $("#submitNewBornReg").click(function (e) {
        e.preventDefault();
        var form = $("#new_born_reg_form")[0];
        var formData = new FormData(form);
        $.ajax({
            url: "store-new-born-baby",
            method: "POST",
            data: formData,
            contentType: false,
            processData: false,
            cache: false,
            beforeSend: function () {
                $("#loader-overlay").show();
            },
            complete: function () {
                $("#loader-overlay").hide();
            },
            success: function (response) {
                if (response.status === true) {
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text:
                            response.message ||
                            "Newborn registered successfully.",
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                        buttonsStyling: false,
                    }).then(() => {
                        $("#new_born_reg_form")[0].reset();
                        $("#newBorn_gender").selectpicker("val", "");
                        $("#newBorn_religion").selectpicker("val", "");
                        $("#parentDetails").val(null).trigger("change");
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Failed!",
                        text: response.message || "Unknown error occurred.",
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                        buttonsStyling: false,
                    });
                }
            },
            error: function (xhr) {
                if (xhr.status === 422) {
                    $("#submitNewBornReg").modal("hide");
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

    $("#update_new_born_baby").on("click", function () {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to update this Newborn baby details?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes!",
            customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton:
                    "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.isConfirmed) {
                var clientId = $("#client_id").val();
                var formData = $("#new_born_reg_form").serialize();
                $.ajax({
                    url: BASE_URL + "/new-born-baby-update/" + clientId,
                    method: "PUT",
                    data: formData,
                    beforeSend: function () {
                        $("#loader-overlay").show();
                    },
                    complete: function () {
                        $("#loader-overlay").hide();
                    },
                    success: function (response) {
                        if (response.status === true) {
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton:
                                        "btn btn-success waves-effect waves-light",
                                },
                            }).then(function () {
                                loadEditNewBornBabyTabData(
                                    response.data.clientId,
                                );
                                window.location.href = "/new-born-baby-lists";
                            });
                        } else {
                            Swal.fire({
                                title: "Update Failed!",
                                text: response.message || "An error occurred.",
                                icon: "error",
                                customClass: {
                                    confirmButton:
                                        "btn btn-primary waves-effect waves-light",
                                },
                                buttonsStyling: false,
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        Swal.fire({
                            title: "Error!",
                            text: error,
                            icon: "error",
                            customClass: {
                                confirmButton:
                                    "btn btn-primary waves-effect waves-light",
                            },
                            buttonsStyling: false,
                        });
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Please verify the Newborn Baby details.",
                    icon: "error",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });
});

function loadEditNewBornBabyTabData(clientId) {
    isEditMode = true;
    $("#submitNewBornReg").text("Update").attr("id", "update_new_born_baby");
    $.ajax({
        url: BASE_URL + "/new-born-baby-edit/" + clientId,
        method: "GET",
        beforeSend: function () {
            $("#loader-overlay").show();
        },
        success: function (newBornBabyData) {
            if (newBornBabyData.status) {
                const data = newBornBabyData.data;
                const clientParentId = data.data.clientParentId;
                if (clientParentId) {
                    $.ajax({
                        url: "/search-parentDetails",
                        method: "GET",
                        data: { query: clientParentId },
                        success: function (result) {
                            const parent = result.find(
                                (item) => item.clientId == clientParentId,
                            );
                            if (parent) {
                                const option = new Option(
                                    `${parent.clientName_en} (${parent.clientId}) - ${parent.mobile}`,
                                    parent.clientId,
                                    true,
                                    true,
                                );
                                $("#parentDetails")
                                    .append(option)
                                    .trigger("change");
                            }
                        },
                        error: function () {
                            console.error("Failed to load parent details.");
                        },
                        complete: function () {
                            $("#loader-overlay").hide();
                        },
                    });
                } else {
                    $("#loader-overlay").hide();
                }
                $("#newBorn_firstName_en").val(data.data.clientName_en);
                $("#newBorn_secondName_en").val(data.data.secondName_en);
                $("#newBorn_thirdName_en").val(data.data.thirdName_en);
                $("#newBorn_fourthName_en").val(data.data.fourthName_en);
                $("#newBorn_firstName_ar").val(data.data.clientName);
                $("#newBorn_secondName_ar").val(data.data.secondName_ar);
                $("#newBorn_thirdName_ar").val(data.data.thirdName_ar);
                $("#newBorn_fourthName_ar").val(data.data.fourthName_ar);
                console.log("gender",data.data.gender);
                $("#newBorn_gender").selectpicker("val", data.data.gender);
                $("#newBorn_birthDate").val(data.data.birthDate);
                $("#newBorn_maritalStatus")
                    .val(data.data.maritalStatus)
                    .trigger("change");
                console.log("religion",data.data.religion);
                $("#newBorn_religion").selectpicker("val", data.data.religion);
                console.log("NewBorn Data loaded successfully");
            } else {
                $("#loader-overlay").hide();
                console.error(
                    "Failed to load Newborn Data:",
                    newBornBabyData.message,
                );
            }
        },
        error: function (xhr, status, error) {
            $("#loader-overlay").hide();
            console.error("Error loading Newborn Data:", error);
        },
    });
}
