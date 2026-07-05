$(document).ready(function () {
    $("#room_management_main_menu").addClass("active open menu-item-animating");
    $("#room_admit_or_discharge_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var admissionAndDischargeTable = $("#admissionAndDischarge-table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/room-admitted-or-discharge-list",
            data: function (d) {
                d.room_type = $('#roomFilter').val();
                let selectedStatus = $('#statusFilterDropdown').val();
                d.status = selectedStatus === 'all' ? '' : selectedStatus;
            },
        },
        columns: [
            { data: "roomBookingId", name: "roomBookingId" },
            { data: "inPatientId", name: "inPatientId" },
            { data: "patientAdmissionId", name: "patientAdmissionId" },
            { data: "patient_name", name: "patient_name" },
            { data: "gender", name: "gender" },
            { data: "room_type", name: "room_type" },
            { data: "floor", name: "floor" },
            { data: "booking_from", name: "booking_from" },
            { data: "booking_to", name: "booking_to" },
            {
                data: 'status',
                name: 'status',
                render: function (data, type, row) {
                    if (data === 'discharged') {
                        return '<span class="badge bg-label-danger me-1">Discharged</span>';
                    } else if (data === 'admitted') {
                        return '<span class="badge bg-label-success me-1">Admitted</span>';
                    } else {
                        return '<span class="badge bg-label-secondary me-1">' + data + '</span>';
                    }
                }
            },
        ],
    });

    $('#roomFilter').on('change', function () {
        admissionAndDischargeTable.ajax.reload();
    });

    $('#statusFilterDropdown').on('change', function () {
        admissionAndDischargeTable.ajax.reload();
    });

});
