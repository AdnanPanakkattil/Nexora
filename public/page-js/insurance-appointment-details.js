$(document).ready(function () {
    $("#appointment_main_menu").addClass("active open menu-item-animating");
    $("#appointmrent_report_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    initialPageLoad();
});

function initialPageLoad() {
    $.ajax({
        url: BASE_URL + "/detail-of-appointment/" + $("#appointment_id").val(),
        type: "get",
        beforeSend: function () {
            $("#loader-overlay").show();
        },
        success: function (response) {
            $("#loader-overlay").hide();
            if (response.status === true) {
                console.log(response.data.totalCost);
                $("#total_cost").html(
                    `<strong>Total Cost :</strong> ${response.data.totalCost} `,
                );

                $("#total_duration").html(
                    `<strong>Duration :</strong> ${response.data.totalDuration} Minutes`,
                );

                var statusValue = response.data.status; // Replace this with the actual value from your database

                // Map of status values to badge styles and labels
                var statusMap = {
                    pending: { class: "bg-warning", label: "Pending" },
                    approved: { class: "bg-success", label: "Approved" },
                    completed: { class: "bg-success", label: "Completed" },
                    rejected: { class: "bg-danger", label: "Rejected" },
                    cancelled: { class: "bg-danger", label: "Cancelled" },
                    absent: { class: "bg-secondary", label: "Absent" },
                    checkedin: { class: "bg-primary", label: "Checked In" },
                    refunded: { class: "bg-info", label: "Refunded" },
                    processing: { class: "bg-warning", label: "Processing" },
                    insurance_approval_request: {
                        class: "bg-primary",
                        label: "Insurance Approval Request",
                    },
                    insurance_rejected: {
                        class: "bg-danger",
                        label: "Insurance Rejected",
                    },
                    transfer: { class: "bg-secondary", label: "Transfer" },
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
                            "</span>",
                    );
                }

                $("#client_mobile").html(
                    `<strong>Mobile :</strong> ${response.data.client.mobile}`,
                );

                var paidValue = response.data.client.paid; // Get the paid value from the response

                // Check the paid value and display "Yes" or "No"
                $("#client_paid").html(
                    `<strong>Paid:</strong> ${paidValue === 1 ? "Yes" : "No"}`,
                );

                $("#provider_name").text(response.data.provider.firstName_en);
                const appointmentDate = moment(
                    response.data.appointmentDate,
                ).format("YYYY-MM-DD h:mm A");
                $("#appointment_date").text(appointmentDate);

                const createdAt = moment(response.data.created_at).format(
                    "YYYY-MM-DD h:mm A",
                );
                $("#created_at").html(
                    `<strong>Created At:</strong> ${createdAt}`,
                );

                $("#source").html(
                    `<strong>Source :</strong> ${response.data.source}`,
                );

                $("#created_by").html(
                    `<strong>Created by :</strong> ${response.data.created_employee.firstName_en}`,
                );

                $("#note").html(
                    `<strong>Note :</strong> ${response.data.note}`,
                );

                $("#financial_category").text(response.data.financialCategory);

                $("#service_name").text(
                    response.data.service.clinic_service.serviceName_en,
                );

                $("#reservation_id").text(
                    "Reservation ID: " + response.data.reservationId,
                );

                $("#file_id").text(response.data.clientId);

                $("#patient_name").text(
                    response.data.client.clientName_en +
                        " " +
                        response.data.client.secondName_en,
                );

                var madeType = response.data.is_manualAppointment;

                $("#appointment_made_type").text(
                    `${madeType === 1 ? "Manual" : "Not Manual"}`,
                );

                if (response.data.offlinePaymentType === "card") {
                    var offlinePaymentType = "By Card";
                } else if (response.data.offlinePaymentType === "cash") {
                    var offlinePaymentType = "By Cash";
                }

                $("#offline_payment_type").text(offlinePaymentType);
            }
        },
        error: function (xhr, status, error) {
            $("#loader-overlay").hide();
        },
    });
}

$(document).on(
    "click",
    "#appointment_comlete_btn, #appointment_attendees_btn, #appointment_refund_btn, #appointment_processing_btn, #appointment_absent_btn, #appointment_cancel_btn, #appointment_paid_btn",
    function () {
        let action = $(this).text().trim(); // Determine which button was clicked
        let actionUrl = ""; // Define URL for action
        let actionText = ""; // Define action-specific text
        let appointmentId = $("#appointment_id").val();

        if (action === "Completed") {
            actionUrl = BASE_URL + "/appointment-complete/" + appointmentId;
            actionText = "mark this appointment as complete";
        } else if (action === "Attendees") {
            actionUrl = BASE_URL + "/appointment-attendees/" + appointmentId;
            actionText = "mark this appointment as attended";
        } else if (action === "Refund") {
            actionUrl = BASE_URL + "/appointment-refund/" + appointmentId;
            actionText = "mark this appointment for refund";
        } else if (action === "Processing") {
            actionUrl = BASE_URL + "/appointment-processing/" + appointmentId;
            actionText = "mark this appointment as processing";
        } else if (action === "Absent") {
            actionUrl = BASE_URL + "/appointment-absent/" + appointmentId;
            actionText = "mark this appointment as absent";
        } else if (action === "Cancel Appointment") {
            actionUrl = BASE_URL + "/appointment-cancel/" + appointmentId;
            actionText = "cancel this appointment";
        } else if (action === "Paid") {
            actionUrl = BASE_URL + "/appointment-paid/" + appointmentId;
            actionText = "Paid the appointment";
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
                        pre_admission_id: $("#appointment_id").val(),
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
                        console.error("Error fetching edit data:", err.message);
                        // Extract error message from the response
                        var errorMessage =
                            err.responseJSON && err.responseJSON.message
                                ? err.responseJSON.message
                                : "An unexpected error occurred. Please try again.";
                        // Display the error message in SweetAlert
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
    },
);
