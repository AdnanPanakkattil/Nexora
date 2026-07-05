$(document).ready(function () {
    $("#paymnets_main_menu").addClass("active open menu-item-animating");
    $("#outstanding_invoice_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // Date range picker
    const fp = flatpickr(".flatpickr-range", {
        mode: "range",
        dateFormat: "Y-m-d",
        onChange: function (selectedDates) {
            $("#startDate").val(selectedDates[0] ? selectedDates[0].toISOString().slice(0, 10) : '');
            $("#endDate").val(selectedDates[1] ? selectedDates[1].toISOString().slice(0, 10) : '');
            outstandingInvoiceTable.ajax.reload();
        }
    });

    var outstandingInvoiceTable = $("#outstanding_invoice_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/payments/outstanding-invoice-lists",
            data: function (d) {
                d.clinicId  = $("#clinicId").val();
                d.startDate = $("#startDate").val();
                d.endDate   = $("#endDate").val();
            },
        },
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        columns: [
    { data: "invoiceNo",         name: "invoices.invoiceNo",            searchable: false },
    { data: "branch",            name: "branchName",                    searchable: false },
    { data: "customerName",      name: "customerName",                  searchable: false },
    { data: "invoiceDate",       name: "invoices.invoiceDate",          searchable: false },
    { data: "totalAmount",       name: "invoices.totalAmountWithVat",   searchable: false },
    { data: "paidAmount",        name: "paidAmount",                    searchable: false, orderable: false },
    { data: "outstandingAmount", name: "outstandingAmount",             searchable: false },
    { data: "status",            name: "status",                        searchable: false, orderable: false },
    { data: "createdBy",         name: "createdBy",                     searchable: false, orderable: false },
    { data: "actions",           name: "actions",                       searchable: false, orderable: false },
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

    $("#clinicId").on("change", function () {
        outstandingInvoiceTable.ajax.reload();
    });
});