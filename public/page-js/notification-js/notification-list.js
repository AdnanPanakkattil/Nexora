$(document).ready(function () {
    $("#notification_main_menu").addClass("active open menu-item-animating");

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $('#add_new_notification').on('click', function () {
        window.location.href = BASE_URL + '/notification/create';
    });

    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    let borderColor, bodyBg, headingColor;

    if (isDarkStyle) {
        borderColor = config.colors_dark.borderColor;
        bodyBg = config.colors_dark.bodyBg;
        headingColor = config.colors_dark.headingColor;
    } else {
        borderColor = config.colors.borderColor;
        bodyBg = config.colors.bodyBg;
        headingColor = config.colors.headingColor;
    }

    if ($('#notification-table').length) {
        var notificationTable = $('#notification-table').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: BASE_URL + "/notification/notification-list",
                type: 'GET',
            },

            columns: [
                {
                    data: null,
                    name: 'checkbox', // Give it a proper name
                    orderable: false,
                    searchable: false,
                    render: function (data, type, full, meta) {
                        return '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1">';
                    },
                    checkboxes: {
                        selectAllRender: '<input type="checkbox" class="form-check-input" id="custom-check">'
                    }
                },
                { data: 'notificationId' },
                { data: 'delivery_date' },
                { data: 'delivery_time' },
                { data: 'active',searchable: true },
                {
                    data: "delivery_status",
                    name: "delivery_status",
                    orderable: false,
                    searchable: true
                },

                {
                    data: 'actions',
                    name: 'actions',
                    orderable: false,
                    searchable: false,
                    title: 'Actions'
                }
            ],
            order: [[1, 'desc']],
            // dom:
            //     '<"row"' +
            //     '<"col-md-2"<"ms-n2"l>>' +
            //     '<"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-6 mb-md-0 mt-n6 mt-md-0"fB>>' +
            //     '>t' +
            //     '<"row"' +
            //     '<"col-sm-12 col-md-6"i>' +
            //     '<"col-sm-12 col-md-6"p>' +
            //     '>',
            language: {
                sLengthMenu: '_MENU_',
                search: '',
                searchPlaceholder: 'Search Notification',
                paginate: {
                    next: '<i class="ti ti-chevron-right ti-sm"></i>',
                    previous: '<i class="ti ti-chevron-left ti-sm"></i>'
                }
            },
            buttons: [
                {
                    text: '<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Add New Notification</span>',
                    className: 'add-new btn btn-primary waves-effect waves-light',
                    action: function (e, dt, node, config) {
                        window.location.href = BASE_URL + '/notification/create';
                    }
                }
            ],
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.modal({
                        header: function (row) {
                            var data = row.data();
                            return 'Details of ' + data['name_en'];
                        }
                    }),
                    type: 'column',
                    renderer: function (api, rowIdx, columns) {
                        var data = $.map(columns, function (col, i) {
                            return col.title !== '' ?
                                '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                                '<td>' + col.title + ':</td> ' +
                                '<td>' + col.data + '</td>' +
                                '</tr>' : '';
                        }).join('');

                        return data ? $('<table class="table"/><tbody />').append(data) : false;
                    }
                }
            },
            initComplete: function () {
                this.api().columns().every(function () {
                    var column = this;

                    // Status Filter
                    if (column.index() === 8) {
                        var select = $('<select id="RecordStatus" class="form-select text-capitalize">' +
                            '<option value=""> Show all  </option>' +
                            '<option value="Active">Active</option>' +
                            '<option value="Inactive">Inactive</option>' +
                            '</select>')
                            .appendTo('.record_status')
                            .on('change', function () {
                                var val = $.fn.dataTable.util.escapeRegex(
                                    $(this).val()
                                );
                                column.search(val ? '^' + val + '$' : '', true, false).draw();
                            });
                    }

                    // Country Filter
                    if (column.index() === 6) {
                        var countries = [];
                        column.data().unique().sort().each(function (d, j) {
                            if (d && d !== '-') {
                                countries.push(d);
                            }
                        });
                        countries = Array.from(new Set(countries));
                        var select = $('<select id="RecordCountry" class="form-select text-capitalize">' +
                            '<option value="">Select Country</option>' +
                            countries.map(country => `<option value="${country}">${country}</option>`).join('') +
                            '</select>')
                            .appendTo('.record_country')
                            .on('change', function () {
                                var val = $.fn.dataTable.util.escapeRegex(
                                    $(this).val()
                                );
                                column.search(val ? val : '', true, false).draw();
                            });
                    }
                });
            }
        });



        // Delete functionality
        $(document).on('click', '.item-delete', function (e) {
            e.preventDefault();

            var deleteUrl = $(this).data('id');

            Swal.fire({
                title: "Are you sure?",
                text: "This notification will be permanently deleted.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel",
                customClass: {
                    confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                    cancelButton: "btn btn-label-secondary waves-effect waves-light"
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    $("#loader-overlay").show();
                    $.ajax({
                        url: deleteUrl,
                        type: "DELETE",
                        success: function (response) {
                            $("#loader-overlay").hide();
                            Swal.fire({
                                icon: "success",
                                title: "Deleted!",
                                text: "Notification has been deleted.",
                                timer: 1500,
                                showConfirmButton: false
                            });
                            notificationTable.ajax.reload(null, false);
                        },
                        error: function (xhr) {
                            $("#loader-overlay").hide();
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Something went wrong. Please try again later."
                            });
                        }
                    });
                }
            });
        });
    }
});