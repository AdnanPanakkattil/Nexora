$(document).ready(function () {
    $("#admission_and_discharge_main_menu").addClass("active open menu-item-animating");
    $("#pre_admission_list_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    initialPageLoad();
});

function initialPageLoad() {
    $.ajax({
        url: BASE_URL + "/admission-and-discharge/preadmission-details/" + $("#pre_admission_id").val(),
        type: "get",
        success: function (response) {
            if (response.status === true) {
                console.log(response.data.status);
                $("#patient_preadmission_id").text(
                    "Preadmission ID #" + response.data.patientPreadmissionId
                );
                $("#file_id").text("File No:" + response.data.clientId);

                $("#birth_date").html(
                    `<strong>Birth Date :</strong> ${response.data.client.birthDate}`
                );
                $("#id_national").html(
                    `<strong>Id National :</strong> ${response.data.client.idNational}`
                );

                if (response.data.clinicUnitId === 8) {
                    var unit = "Day Surgery Unit";
                } else if (response.data.clinicUnitId === 9) {
                    var unit = "Local Surgery Unit";
                }

                $("#unit").html(`<strong>Unit :</strong> ${unit}`);

                $("#surgery_date").html(
                    `<strong>Surgery Date :</strong> ${response.data.surgeryDate}`
                );

                var statusValue = response.data.status; // Replace this with the actual value from your database

                // Map of status values to badge styles and labels
                var statusMap = {
                    pending: { class: "bg-warning", label: "Pending" },
                    cancel: { class: "bg-danger", label: "Canceled" },
                    no_show: { class: "bg-secondary", label: "No Show" },
                    checkedin: { class: "bg-primary", label: "Checked In" },
                    arrived: { class: "bg-info", label: "Arrived" },
                    admitted: { class: "bg-success", label: "Admitted" },
                };

                // Check if the status exists in the map
                if (statusMap[statusValue]) {
                    var badgeClass = statusMap[statusValue].class;
                    var badgeLabel = statusMap[statusValue].label;

                    // Append the badge after the #status element
                    $("#status").after(
                        '<span class="badge ' +
                            badgeClass +
                            '">' +
                            badgeLabel +
                            "</span>"
                    );
                }

                $("#provider_name").html(
                    `<strong>Provider Name:</strong> ${response.data.provider.firstName_en}`
                );

                $("#note").html(`<strong>Note:</strong> ${response.data.note}`);

                $("#patient_name").text(
                    response.data.client.clientName_en + ' ' +
                        response.data.client.secondName_en
                );
            }
        },
        error: function (xhr, status, error) {},
    });
}

$(document).on(
    "click",
    "#preadmission_arrived_btn, #preadmission_no_show_btn, #preadmission_cancel_btn",
    function () {
        let action = $(this).text().trim(); // Determine which button was clicked
        let actionUrl = ""; // Define URL for action
        let actionText = ""; // Define action-specific text

        if (action === "Arrived") {
            actionUrl =
                BASE_URL +
                "/admission-and-discharge/preadmission-arrived/" +
                $("#pre_admission_id").val(); // Example URL for "Arrived"
            actionText = "mark this patient as arrived";
        } else if (action === "No Show") {
            actionUrl =
                BASE_URL +
                "/admission-and-discharge/preadmission-no-show/" +
                $("#pre_admission_id").val(); // Example URL for "No Show"
            actionText = "mark this patient as no-show";
        } else if (action === "Cancel") {
            actionUrl =
                BASE_URL +
                "/admission-and-discharge/preadmission-cancel/" +
                $("#pre_admission_id").val(); // Example URL for "Cancel"
            actionText = "cancel this appointment";
        }

        Swal.fire({
            title: "Are you sure?",
            text: `You want to ${actionText}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Confirm",
            customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton:
                    "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: actionUrl,
                    method: "PUT", // Use the appropriate HTTP method
                    data: {
                        pre_admission_id: $("#pre_admission_id").val(),
                        action: action.toLowerCase().replace(" ", "_"),
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
                            });
                        }
                    },
                    error: function (err) {
                        console.error("Error during action:", err);
                        Swal.fire({
                            icon: "error",
                            text: "An error occurred while processing your request.",
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                        });
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: `The ${action} action has been cancelled.`,
                    icon: "info",
                    customClass: {
                        confirmButton: "btn btn-info waves-effect waves-light",
                    },
                });
            }
        });
    }
);
