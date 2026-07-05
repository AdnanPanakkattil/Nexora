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
        success: function (response) {
            if (response.status === true) {
                console.log(response.data);
                $("#total_cost").html(
                    `<strong>Total Cost :</strong> ${response.data.totalCost} `,
                );

                $("#total_duration").html(
                    `<strong>Duration :</strong> ${response.data.totalDuration} Minutes`,
                );

                var statusValue = response.data.status;
                var normalizedStatus = (statusValue || "")
                    .toString()
                    .trim()
                    .toLowerCase();
                console.log("Normalized:", normalizedStatus);
            function hideAllAppointmentButtons() {
                $("#appointment_complete_btn_container").hide();
                $("#appointment_print_btn_container").hide();
                $("#appointment_attendees_btn_container").hide();
                $("#appointment_refund_btn_container").hide();
                $("#appointment_processing_btn_container").hide();
                $("#appointment_absent_btn_container").hide();
                $("#appointment_cancel_btn_container").hide();
            }
            hideAllAppointmentButtons();
                if (normalizedStatus === "pending") {
                    $("#appointment_attendees_btn_container").show();
                    $("#appointment_refund_btn_container").show();
                    $("#appointment_cancel_btn_container").show();
                } else if (normalizedStatus === "checkedin") {
                    $("#appointment_refund_btn_container").show();
                    $("#appointment_cancel_btn_container").show();
                } else if (normalizedStatus === "processing") {
                    $("#appointment_refund_btn_container").show();
                    $("#appointment_cancel_btn_container").show();
                } else if (normalizedStatus === "absent") {
                    hideAllAppointmentButtons();
                    $("#appointment_cancel_btn_container").show(); 

                } else if (normalizedStatus === "cancelled") {
                     $("#manage_reservation_card").hide();

                } else {
                    $("#appointment_complete_btn_container").show();
                    // $("#appointment_print_btn_container").show();
                    $("#appointment_attendees_btn_container").show();
                    $("#appointment_refund_btn_container").show();
                    $("#appointment_processing_btn_container").show();
                    $("#appointment_absent_btn_container").show();
                    $("#appointment_cancel_btn_container").show();
                }
                var statusMap = {
                    pending: { class: "bg-warning", label: "Pending" },
                    approved: { class: "bg-success", label: "Approved" },
                    completed: { class: "bg-success", label: "Completed" },
                    rejected: { class: "bg-danger", label: "Rejected" },
                    cancelled: { class: "bg-danger", label: "Cancelled" },
                    absent: { class: "bg-secondary", label: "Absent" },
                    checkedin: { class: "bg-primary", label: "Attendees" },
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

                console.log(response.data.paid);
                var paidValue = response.data.paid; // 1 or 0

                // Map for paid status
                var paidMap = {
                    1: { class: "bg-success", label: "Paid" },
                    0: { class: "bg-warning", label: "Not Paid" },
                };

                // Clear previous content (optional, if it changes dynamically)
                $("#client_paid").empty();

                // If value exists in the map, render badge
                if (paidMap.hasOwnProperty(paidValue)) {
                    var paidClass = paidMap[paidValue].class;
                    var paidLabel = paidMap[paidValue].label;

                    $("#client_paid").html(
                        "<strong>Paid:</strong> " +
                            '<span class="badge ' +
                            paidClass +
                            '">' +
                            paidLabel +
                            "</span>",
                    );
                } else {
                    // Fallback if value is something unexpected
                    $("#client_paid").html("<strong>Paid:</strong> -");
                }

                // Check the paid value and display "Yes" or "No"
                // $("#client_paid").html(
                //     `<strong>Paid:</strong> ${paidValue === 1 ? "Paid" : "Not-Paid"}`
                // );
                console.log(response.data.created_employee);
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

                $("#coupon_code").html(
                    `<strong>Coupon Code :</strong> ${response.data.payment_order?.couponCode ?? ""}`,
                );

                $("#note").html(
                    `<strong>Note :</strong> ${response.data.note ?? ""}`,
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

                // gender based avatar
                var gender = (response.data.client.gender || "").toString().trim().toLowerCase();
                $("#patient_avatar").attr(
                    "src",
                    gender === "female"
                        ? BASE_URL + "/img/femaleavatar.jpeg"
                        : BASE_URL + "/assets/img/avatars/16.jpg"
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
        error: function (xhr, status, error) {},
    });
}

// Global vars to store what action user chose
let selectedAction = null;
let selectedActionUrl = null;
let selectedActionText = null;

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

            // store values for later use
            selectedAction = "absent";
            selectedActionUrl = actionUrl;
            selectedActionText = actionText;

            // setup modal text for Absent
            $("#reasonHead").text("Absent Reason");
            $("#reasonLabel").text("Absent Reason");
            $("#reasonText").attr("placeholder", "Reason for absent");
            $("#actionRequest").text("Absent Request");

            // show modal
            $("#reasonModal").modal("show");
            return; // stop here, don't show Swal yet
        } else if (action === "Cancel Appointment") {
            actionUrl = BASE_URL + "/appointment-cancel/" + appointmentId;
            actionText = "cancel this appointment";

            // store values for later use
            selectedAction = "cancel";
            selectedActionUrl = actionUrl;
            selectedActionText = actionText;

            // setup modal text for Cancel
            $("#reasonHead").text("Cancel Reason");
            $("#reasonLabel").text("Cancel Reason");
            $("#reasonText").attr("placeholder", "Reason for cancel");
            $("#actionRequest").text("Cancel Request");

            // show modal
            $("#reasonModal").modal("show");
            return; // stop here, don't show Swal yet
        } else if (action === "Paid") {
            actionUrl = BASE_URL + "/appointment-paid/" + appointmentId;
            actionText = "Paid the appointment";
        }

        // For actions that do NOT need reason modal – show Swal directly
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
                 $("#loader-overlay").show();
                sendAppointmentRequest(actionUrl, {
                    pre_admission_id: $("#appointment_id").val(),
                    action: action.toLowerCase().replace(" ", "_"),
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

// When user clicks the "Reason Request" button inside the modal
$(document).on("click", "#actionRequest", function () {
    let reason = $("#reasonText").val().trim();
    let appointmentId = $("#appointment_id").val();

    if (!reason) {
        $(".reasonText_error").text("Reason is required");
        return;
    } else {
        $(".reasonText_error").text("");
    }

    // Now show confirm Swal AFTER reason is entered
    Swal.fire({
        title: "Are you sure?",
        text: `You want to ${selectedActionText}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Confirm",
        customClass: {
            confirmButton: "btn btn-primary me-3 waves-effect waves-light",
            cancelButton: "btn btn-label-secondary waves-effect waves-light",
        },
        buttonsStyling: false,
    }).then(function (result) {
        if (result.value) {
             $("#loader-overlay").show();
            // hide modal
            $("#reasonModal").modal("hide");

            // Send AJAX with reason included
            sendAppointmentRequest(selectedActionUrl, {
                pre_admission_id: appointmentId,
                action: selectedAction, // 'cancel' or 'absent'
                reason: reason,
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                title: "Cancelled",
                text: `The ${selectedAction} action has been cancelled.`,
                icon: "info",
                customClass: {
                    confirmButton: "btn btn-info waves-effect waves-light",
                },
            });
        }
    });
});

// Common function for AJAX call
function sendAppointmentRequest(url, data) {
    $.ajax({
        url: url,
        method: "PUT",
        data: data,
        success: function (response) {
            $("#loader-overlay").hide();
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
            $("#loader-overlay").hide(); 
            console.error("Error fetching edit data:", err.message);
            var errorMessage =
                err.responseJSON && err.responseJSON.message
                    ? err.responseJSON.message
                    : "An unexpected error occurred. Please try again.";
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
