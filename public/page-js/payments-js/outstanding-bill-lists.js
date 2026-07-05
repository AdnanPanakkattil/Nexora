$(document).ready(function () {
    $("#paymnets_main_menu").addClass("active open menu-item-animating");
    $("#outstanding_bill_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: { "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content") },
    });

    // Date range picker
    const fp = flatpickr(".flatpickr-range", {
        mode: "range",
        dateFormat: "Y-m-d",
        onChange: function (selectedDates) {
            $("#startDate").val(selectedDates[0] ? selectedDates[0].toISOString().slice(0, 10) : '');
            $("#endDate").val(selectedDates[1] ? selectedDates[1].toISOString().slice(0, 10) : '');
            outstandingBillTable.ajax.reload();
        }
    });

    var outstandingBillTable = $("#outstanding_bill_table").DataTable({
        processing: true,
        serverSide: true,
      ajax: {
    url: BASE_URL + "/payments/outstanding-bill-lists",
    data: function (d) {
        d.clinicId  = $("#clinicId").val();
        d.startDate = $("#startDate").val();
        d.endDate   = $("#endDate").val();
        d.clientId  = $("#clientId_search").val();
    },
},
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
     columns: [
    { data: "serviceOrderMasterId", name: "som.serviceOrderMasterId", searchable: false },
    { data: "branch",               name: "branchName",               searchable: false },
    { data: "patientName",          name: "patientName",              searchable: false },
    { data: "billDate",             name: "som.createdDateTime",      searchable: false },
    { data: "totalAmount",          name: "som.totalAmount",            searchable: false },
    { data: "paidAmount",           name: "paidAmount",               searchable: false, orderable: false },
    { data: "outstandingAmount",    name: "outstandingAmount",        searchable: false },
    { data: "status",               name: "status",                   searchable: false, orderable: false },
    { data: "createdBy",            name: "createdBy",                searchable: false, orderable: false },
    {
        data: null,
        name: "actions", 
        orderable: false,
        searchable: false,
        render: function (data, type, full, meta) {
            var paymentUrl = BASE_URL + "/payments/billing-payment?clientId=" + full.clientId;
            return (
                '<div class="d-inline-block">' +
                    '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">' +
                        '<i class="ti ti-dots-vertical ti-md"></i>' +
                    '</a>' +
                    '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="' + paymentUrl + '" class="dropdown-item">Make Payment</a></li>' +
                    '</ul>' +
                '</div>'
            );
        },
    },
],
        dom: '<"row"<"col-md-2"<"ms-n2"l>><"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-6 mb-md-0 mt-n6 mt-md-0"f>>>' +
             'r t <"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
       footerCallback: function (row, data, start, end, display) {
    var api = this.api();
    var parse = function (v) {
        return typeof v === 'string' ? parseFloat(v.replace(/[^0-9.-]+/g, '')) || 0
             : typeof v === 'number' ? v : 0;
    };
    var totalSum       = api.column(4, { search: 'applied' }).data().reduce((a, b) => parse(a) + parse(b), 0);
    var paidSum        = api.column(5, { search: 'applied' }).data().reduce((a, b) => parse(a) + parse(b), 0);
    var outstandingSum = api.column(6, { search: 'applied' }).data().reduce((a, b) => parse(a) + parse(b), 0);

    $(api.table().footer()).find('tr.totals-row').remove();
    $(api.table().footer()).append(
        `<tr class="totals-row" style="font-weight:bold; background-color:#f9f9f9;">
            <td colspan="3" style="text-align:right; padding-right:12px;">Totals:</td>
            <td></td>
            <td>${totalSum.toFixed(2)}</td>
            <td>${paidSum.toFixed(2)}</td>
            <td>${outstandingSum.toFixed(2)}</td>
            <td colspan="3"></td>
        </tr>`
    );
},
    });

    // Patient search select2
    $("#clientId_search").select2({
        placeholder: "Select a Patient",
        allowClear: true,
        minimumInputLength: 0,
        width: "100%",
        dropdownParent: $("#clientId_search").parent(),
        ajax: {
            url: BASE_URL + "/billing/search-patient",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return { query: params.term };
            },
            processResults: function (data) {
                return { results: data };
            },
            cache: true,
        },
    });

    $("#clinicId, #clientId_search").on("change", function () {
    outstandingBillTable.ajax.reload();
});
});