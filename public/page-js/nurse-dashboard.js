$(document).ready(function () {
    $("#dashboard_main_menu").addClass("active open menu-item-animating");
    $("#nurse_dashboard_sub_menu").addClass("active");

    $("#nurse-card").hide();

    $("#reservation-btn").on("click", function () {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        $("#reservation-card").show();
        $("#nurse-card").hide();
    });

    $("#nurse-btn").on("click", function () {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        $("#nurse-card").show();
        $("#reservation-card").hide();
    });

    $("#branch").select2({
        placeholder: "Select Branch",
        allowClear: true,
    });

    $("#provider").select2({
        placeholder: "Select Provider",
        allowClear: true,
    });

    $(".selectpicker").selectpicker({
        dropupAuto: false,
    });

    $("#category").select2({
        placeholder: "Select Category",
        allowClear: true,
    });

    $("#branch").change(function () {
        const clinicId = $(this).val();

        if (clinicId) {
            $.ajax({
                url: "/fetch-providers",
                method: "POST",
                data: {
                    clinicId: clinicId,
                    _token: $('meta[name="csrf-token"]').attr("content"),
                },
                success: function (response) {
                    const providerSelect = $("#provider");
                    providerSelect.empty();
                    providerSelect.append(
                        '<option value="">Select Provider</option>'
                    );
                    response.forEach((provider) => {
                        providerSelect.append(
                            `<option value="${provider.employeeId}">${provider.fullName}</option>`
                        );
                    });
                    providerSelect.trigger("change");
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching providers:", error);
                },
            });
        } else {
            $.ajax({
                url: "/fetch-all-providers",
                type: "GET",
                success: function (response) {
                    const providerSelect = $("#provider");
                    providerSelect.empty();
                    providerSelect.append(
                        '<option value="">Select Provider</option>'
                    );
                    $.each(response.providers, function (index, provider) {
                        providerSelect.append(
                            `<option value="${provider.id}">${provider.name}</option>`
                        );
                    });
                    providerSelect.trigger("change");
                },
                error: function () {
                    alert("Error fetching all providers.");
                },
            });
        }
    });

    $.ajax({
        url: "/fetch-all-providers",
        type: "GET",
        success: function (response) {
            const providerSelect = $("#provider");
            providerSelect.empty();
            providerSelect.append('<option value="">Select Provider</option>');
            $.each(response.providers, function (index, provider) {
                providerSelect.append(
                    `<option value="${provider.id}">${provider.name}</option>`
                );
            });
            providerSelect.trigger("change");
        },
        error: function () {
            alert("Error fetching all providers.");
        },
    });

    $.ajax({
        url: "/categories",
        type: "GET",
        success: function (response) {
            const categorySelect = $("#category");
            categorySelect.empty();
            categorySelect.append('<option value="">Select Category</option>');
            $.each(response.categories, function (index, category) {
                categorySelect.append(
                    `<option value="${category.categoryId}">${category.categoryName_en}</option>`
                );
            });
            categorySelect.trigger("change");
        },
        error: function () {
            alert("Error fetching category.");
        },
    });

    var rangePickr = $(".flatpickr-range"),
        dateFormat = "MM/DD/YYYY";

    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");

    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "m/d/Y",
            onClose: function (selectedDates) {
                var startDate = selectedDates[0]
                    ? moment(selectedDates[0]).format("YYYY-MM-DD")
                    : null;
                var endDate = selectedDates[1]
                    ? moment(selectedDates[1]).format("YYYY-MM-DD")
                    : null;
                $(".start_date").val(startDate);
                $(".end_date").val(endDate);
                reservationTable.ajax.reload();
            },
        });
    }

    var checkedReservations = [];

    var reservationTable = $("#reservation").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/fetch-reservations",
            method: "GET",
            data: function (d) {
                d.clinicId = $("#branch").val() || "";
                d.employeeId = $("#provider").val() || "";
                d.startDate = $(".start_date").val() || null;
                d.endDate = $(".end_date").val() || null;
                d.status = $("#status").val() || "All";
            },
        },
        columns: [
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return `<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" value="${full.id}">`;
                },
            },
            { data: "id", title: "ID" },
            { data: "fileNo", title: "File No" },
            { data: "patientName", title: "Patient Name" },
            { data: "mobile", title: "Mobile" },
            { data: "serviceName", title: "Service" },
            { data: "appointmentDate", title: "Appointment Date" },
            { data: "provider", title: "Provider" },
            { data: "totalCost", title: "Total Cost" },
            { data: "paid", title: "Paid" },
            {
                data: "status",
                name: "status",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var className;
                    switch (full.status) {
                        case "pending":
                        case "processing":
                            className = "bg-label-warning";
                            break;
                        case "approved":
                        case "completed":
                            className = "bg-label-success";
                            break;
                        case "refunded":
                        case "transfer":
                            className = "bg-label-info";
                            break;
                        case "cancelled":
                        case "rejected":
                        case "insurance_rejected":
                            className = "bg-label-danger";
                            break;
                        case "absent":
                            className = "bg-label-secondary";
                            break;
                        case "checkedin":
                        case "insurance_approval_request":
                            className = "bg-label-primary";
                            break;
                        default:
                            className = "";
                    }
                    return (
                        '<span class="badge ' +
                        className +
                        '">' +
                        full.status +
                        "</span>"
                    );
                },
                title: "Status",
            },
            { data: "remainingSession", title: "Remaining Session" },
            {
                data: null,
                title: "Actions",
                render: function (data, type, full) {
                    var detailsUrl = BASE_URL + "/detail-of-appointment/" + full.id;
                    var editUrl = BASE_URL + "/edit-appointment/" + full.id;
                    var printUrl = BASE_URL + "/thermalprintreservation/" + full.id;
                    return `
                        <div class="d-flex justify-content-center" >
                        <a href="${detailsUrl}" class="btn btn-icon btn-text-secondary"><i class="ti ti-eye"></i></a>
                        <a href="${editUrl}" class="btn btn-icon btn-text-secondary"><i class="ti ti-pencil"></i></a>
                        <a href="${printUrl}" target="_blank" class="btn btn-icon btn-text-secondary"><i class="ti ti-printer"></i></a>
                        </div>
                    `;
                },
            },
        ],
        drawCallback: function () {
            var rows = reservationTable.rows({ page: "current" }).nodes();

            $('input[type="checkbox"]', rows).each(function () {
                if (checkedReservations.includes(this.value)) {
                    $(this).prop("checked", true);
                } else {
                    $(this).prop("checked", false);
                }
            });

            updateFooter();
        },
    });

    $("#select_all_reservations").on("change", function () {
        var rows = reservationTable.rows({ page: "current" }).nodes();
        var isChecked = this.checked;

        checkedReservations = [];

        $('input[type="checkbox"]', rows).each(function () {
            if (this.id === "select_all_reservations") {
                return;
            }

            $(this).prop("checked", isChecked);
            var reservationId = this.value;

            if (isChecked && reservationId !== "on") {
                checkedReservations.push(reservationId);
            }
        });

        updateFooter();
    });

    $("#reservation").on("change", 'input[type="checkbox"]', function () {
        var reservationId = this.value;

        if (reservationId === "on") return;

        if (this.checked) {
            if (!checkedReservations.includes(reservationId)) {
                checkedReservations.push(reservationId);
            }
        } else {
            checkedReservations = checkedReservations.filter(
                (id) => id !== reservationId
            );
        }

        var rows = reservationTable.rows({ page: "current" }).nodes();
        var allChecked =
            $('input[type="checkbox"]', rows).length ===
            $('input[type="checkbox"]:checked', rows).length;
        $("#select_all_reservations").prop("checked", allChecked);

        updateFooter();
    });

    function updateFooter() {
        var footer = $(".footer");
        var count = checkedReservations.length;

        if (count > 0) {
            footer.show();
            $(".itemz h4").text(count);
        } else {
            footer.hide();
        }
    }

    $("#branch, #provider, #startDate, #endDate, #status").on(
        "change",
        function () {
            reservationTable.ajax.reload();
        }
    );

    let nurseTable;

    if (!$.fn.DataTable.isDataTable("#nurse")) {
        nurseTable = $("#nurse").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: "/nurse-report",
                type: "GET",
            },
            columns: [
                { data: "id", className: "text-center" },
                { data: "fileNo", className: "text-center" },
                { data: "patientName", className: "text-center" },
                { data: "mobile", className: "text-center" },
                { data: "serviceName", className: "text-center" },
                { data: "appointmentDate", className: "text-center" },
                { data: "provider", className: "text-center" },
                { data: "totalCost", className: "text-center" },
                { data: "paid", className: "text-center" },
                {
                    data: "status",
                    name: "status",
                    orderable: false,
                    searchable: false,
                    render: function (data, type, full, meta) {
                        var className;
                        switch (full.status) {
                            case "pending":
                            case "processing":
                                className = "bg-label-warning";
                                break;
                            case "approved":
                            case "completed":
                                className = "bg-label-success";
                                break;
                            case "refunded":
                            case "transfer":
                                className = "bg-label-info";
                                break;
                            case "cancelled":
                            case "rejected":
                            case "insurance_rejected":
                                className = "bg-label-danger";
                                break;
                            case "absent":
                                className = "bg-label-secondary";
                                break;
                            case "checkedin":
                            case "insurance_approval_request":
                                className = "bg-label-primary";
                                break;
                            default:
                                className = "";
                        }
                        return (
                            '<span class="badge ' +
                            className +
                            '">' +
                            full.status +
                            "</span>"
                        );
                    },
                    title: "Status",
                },
                { data: "remainingSession", className: "text-center" },
            ],
        });
    } else {
        nurseTable.ajax.reload();
    }
});
