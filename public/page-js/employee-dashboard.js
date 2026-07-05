$(document).ready(function () {
    $("#dashboard_main_menu").addClass("active open menu-item-animating");
    $("#employee_dashboard_sub_menu").addClass("active");

     $("#branch").selectpicker({ dropupAuto: false, liveSearch: true });
    $("#provider").selectpicker({ dropupAuto: false, liveSearch: true });
    $("#category").selectpicker({ dropupAuto: false, liveSearch: true });
 
    $(".selectpicker").selectpicker({ dropupAuto: false });

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
            var providerSelect = reinitSelectpicker("#provider");
            providerSelect.append('<option value="">Select Provider</option>');
            $.each(response.providers, function (index, provider) {
                providerSelect.append(
                    `<option value="${provider.id}">${provider.name}</option>`
                );
            });
            providerSelect.selectpicker({ dropupAuto: false, liveSearch: true });
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
    categorySelect.selectpicker("destroy");   // 1. strip plugin UI
    categorySelect.empty();                   // 2. clear all options
    categorySelect.append('<option value="">Select Category</option>');
    $.each(response.categories, function (index, category) {
        categorySelect.append(
            `<option value="${category.categoryId}">${category.categoryName_en}</option>`
        );
    });
    categorySelect.selectpicker({ dropupAuto: false, liveSearch: true }); // 3. re-init
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
                }
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
                title: "Status"
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
            checkedReservations = checkedReservations.filter((id) => id !== reservationId);
        }
    
        var rows = reservationTable.rows({ page: "current" }).nodes();
        var allChecked = $('input[type="checkbox"]', rows).length === $('input[type="checkbox"]:checked', rows).length;
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
    
    $("#branch, #provider, #startDate, #endDate, #status").on("change", function () {
        reservationTable.ajax.reload();
    });
    
});

// Chart JS

(function () {
    let cardColor, headingColor, legendColor, labelColor, borderColor;
    if (isDarkStyle) {
        cardColor = config.colors_dark.cardColor;
        labelColor = config.colors_dark.textMuted;
        legendColor = config.colors_dark.bodyColor;
        headingColor = config.colors_dark.headingColor;
        borderColor = config.colors_dark.borderColor;
    } else {
        cardColor = config.colors.cardColor;
        labelColor = config.colors.textMuted;
        legendColor = config.colors.bodyColor;
        headingColor = config.colors.headingColor;
        borderColor = config.colors.borderColor;
    }

    const todayIndex = new Date().getDay();

    // Chart Colors
    const chartColors = {
        donut: {
            series1: config.colors.success,
            series2: "#53D28C",
            series3: "#7EDDA9",
            series4: "#A9E9C5",
        },
        bar: {
            series1: config.colors.primary,
            series2: "#8F85F3",
            series3: "#ABA4F6",
        },
    };

    // Earning Reports Bar Chart
    const weeklyEarningReportsEl = document.querySelector(
            "#weeklyEarningReports"
        ),
        weeklyEarningReportsConfig = {
            chart: {
                height: 161,
                parentHeightOffset: 0,
                type: "bar",
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    barHeight: "60%",
                    columnWidth: "38%",
                    startingShape: "rounded",
                    endingShape: "rounded",
                    borderRadius: 4,
                    distributed: true,
                },
            },
            grid: {
                show: false,
                padding: {
                    top: -30,
                    bottom: 0,
                    left: -10,
                    right: -10,
                },
            },
            colors: Array(7)
                .fill(config.colors_label.primary)
                .map((color, index) =>
                    index === todayIndex ? config.colors.primary : color
                ),
            dataLabels: {
                enabled: false,
            },
            series: [
                {
                    data: [40, 65, 50, 45, 90, 55, 70].map((value, index) =>
                        index === todayIndex ? value + 20 : value
                    ),
                },
            ],
            legend: {
                show: false,
            },
            xaxis: {
                categories: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    style: {
                        colors: labelColor,
                        fontSize: "13px",
                        fontFamily: "Public Sans",
                    },
                },
            },
            yaxis: {
                labels: {
                    show: false,
                },
            },
            tooltip: {
                enabled: false,
            },
            responsive: [
                {
                    breakpoint: 1025,
                    options: {
                        chart: {
                            height: 199,
                        },
                    },
                },
            ],
        };

    if (
        typeof weeklyEarningReportsEl !== undefined &&
        weeklyEarningReportsEl !== null
    ) {
        const weeklyEarningReports = new ApexCharts(
            weeklyEarningReportsEl,
            weeklyEarningReportsConfig
        );
        weeklyEarningReports.render();
    }
})();

function reinitSelectpicker(selector) {
    var $el = $(selector);
    try { $el.selectpicker("destroy"); } catch(e) {}
    $el.empty();
    return $el;
}

