$(document).ready(function () {
    // $("#appointment_main_menu").addClass("active open menu-item-animating");
    // $("#appointmrent_report_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    initialPageLoad();
});


function initialPageLoad() {
    $.ajax({
        url: BASE_URL + "/op-history-view/" + $("#appointment_id").val(),
        type: "get",
        success: function (response) {
            if (response.status === true) {
                console.log(response);
                $("#total_cost").html(
                    `<strong>Total Cost :</strong> ${response.data.totalCost} `
                );

                $("#total_duration").html(
                    `<strong>Duration :</strong> ${response.data.totalDuration} Minutes`
                );

                var statusValue = response.data.status; 

              
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

                $("#client_mobile").html(
                    `<strong>Mobile :</strong> ${response.data.client.mobile}`
                );

                var paidValue = response.data.client.paid; // Get the paid value from the response

                
                $("#client_paid").html(
                    `<strong>Paid:</strong> ${paidValue === 1 ? "Yes" : "No"}`
                );

                $("#provider_name").text(response.data.provider.firstName_en);
                const appointmentDate = moment(
                    response.data.appointmentDate
                ).format("YYYY-MM-DD h:mm A");
                $("#appointment_date").text(appointmentDate);

                const createdAt = moment(response.data.created_at).format(
                    "YYYY-MM-DD h:mm A"
                );
                $("#created_at").html(
                    `<strong>Created At:</strong> ${createdAt}`
                );

                $("#source").html(
                    `<strong>Source :</strong> ${response.data.source}`
                );

                $("#created_by").html(
                    `<strong>Created by :</strong> ${response.data.created_employee.firstName_en}`
                );

                $("#note").html(
                    `<strong>Note :</strong> ${response.data.note}`
                );

                $("#financial_category").text(response.data.financialCategory);

                $("#service_name").text(
                    response.data.service.clinic_service.serviceName_en
                );

                $("#reservation_id").text(
                    "Reservation ID: " + response.data.reservationId
                );

                $("#file_id").text(response.data.clientId);

                $("#patient_name").text(
                    response.data.client.clientName_en + ' ' +
                    response.data.client.secondName_en
                );

                var madeType = response.data.is_manualAppointment;

                $('#appointment_made_type').text(`${madeType === 1 ? "Manual" : "Not Manual"}`);

                if (response.data.offlinePaymentType === 'card') {
                    var offlinePaymentType = 'By Card';

                } else if (response.data.offlinePaymentType === 'cash') {
                    var offlinePaymentType = 'By Cash';
                }

                $('#offline_payment_type').text(offlinePaymentType)


            }
        },
        error: function (xhr, status, error) { },
    });

   



    $(document).on('click', '#appointment_paid', function () {
        var appointmentId = $("#appointment_id").val();  // Get the appointment ID
    
        // Show confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
           
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, mark as paid',
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'btn btn-primary waves-effect waves-light',
                cancelButton: 'btn btn-label-secondary waves-effect waves-light',
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/appointment-paid/' + appointmentId,  
                    method: 'POST',
                    data: {
                        status: 'paid',  
                    },
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') 
                    },
                    success: function (response) {
                        Swal.fire({
                            text: 'Appointment marked as paid.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-primary waves-effect waves-light',
                            },
                        }).then(() => {
                            location.reload();
                        });
                    },
                    error: function (xhr, status, error) {
                        Swal.fire({
                            text: 'Failed to update appointment status. Please try again.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-primary waves-effect waves-light',
                            },
                        });
                    },
                });
            }
        });
    });
    
    

}


   

