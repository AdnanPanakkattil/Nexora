$(document).ready(function () {
    $("#zatca_main_menu").addClass("active open menu-item-animating");
    $("#pool_sales_invoice_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });



    var poolSalesInvoiceTable = $("#pool_sales_invoice_report_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/pool/sales-invoice",
            data: function (d) {
                d.invoiceId = $('#filterServiceOrderMasterId').val();
                d.customerName = $('#filterClientName').val();
                d.provider = $('#filterProvider').val();
                d.client_number = $('#filterClientNumber').val();
                d.discountAmount = $('#filterTotalDisAmount').val();
                d.totalAmountWithVat = $('#filterTotalTaxAmount').val();
                d.totalAmount = $('#filterTotalAmount').val();
             
            }
        },
        columns: [
            { data: "invoiceId", name: "invoiceId" },

            { data: "customerName", name: "customerName" },
            { data: "provider", name: "provider" },
            { data: "client_number", name: "client_number" },
            { data: "zatcaStatus", name: "zatcaStatus" },
            { data: "discountAmount", name: "discountAmount" },
            { data: "totalAmountWithVat", name: "totalAmountWithVat" },
            { data: "totalAmount", name: "totalAmount" },
            {
                data: "actions",
                name: "actions",
                orderable: false,
                searchable: false,
            }
        ]
    });


    $(document).on("click", ".item-delete", function () {
        var deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: deleteUrl,
                    type: "DELETE",
                    success: function (response) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Invoice deleted successfully.",
                            icon: "success",
                            customClass: {
                                confirmButton: "btn btn-success waves-effect waves-light",
                            },
                        });
                        $("#pool_sales_invoice_report_table").DataTable().ajax.reload();
                    },
                    error: function (xhr) {
                        Swal.fire("Error!", "Failed to delete. Please try again.", "error");
                    }
                });
            }
        });
    });





    $('#filterServiceOrderMasterId, #filterMasterIdNumber, #filterClientName, #filterProvider, #filterClientNumber, #filterIdNational, #filterStatus, #filterBillType, #filterTotalDisAmount, #filterTotalTaxAmount, #filterTotalAmount, #filterBillIssuedDate').on('keyup change', function () {
        poolSalesInvoiceTable.draw();
    });


});



