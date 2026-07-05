$(document).ready(function () {
    $("#zatca_main_menu").addClass("active open menu-item-animating");
    $("#cron_job_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $(".weekly-period, .day-period").hide();

    $('#selectpickerBasic').on('change', function () {
        var selectedType = $(this).val();

        if (selectedType == 'monthly') {
            $(".weekly-period").hide();
            $(".day-period").show();
        } else if (selectedType == 'weekly') {
            $(".day-period").hide();
            $(".weekly-period").show();
        } else if (selectedType == 'daily') {
            $(".weekly-period, .day-period").hide();
        }

        $(".time-period").show();
    });

    $('#departmentSaveBtn').on('click', function (e) {
        e.preventDefault();

        var selectedType = $('#selectpickerBasic').val();
        var selectedDay = $('#day').val();
        var selectedWeekDay = $('#week').val();
        var selectedTime = $('#timepicker').val();
        var defaultValue = $('#defualtvalue').val();

        var requestData = {
            type: selectedType,
            day: selectedType === 'monthly' ? selectedDay : selectedWeekDay,
            time: selectedTime,
            jobType: defaultValue
        };

        $.ajax({
            url: 'zatca-cron-job/store',
            method: 'POST',
            data: requestData,
            success: function (response) {
                Swal.fire({
                    icon: 'success',
                    text: 'Cron Job added successfully!',
                    customClass: {
                      confirmButton: 'btn btn-success waves-effect waves-light',
                    },
                  });
                  location.reload();
            },
            error: function (xhr, status, error) {
                $(".error-text").text("");
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    console.error("Error:", xhr);
                }
            },
        });
    });

    flatpickr("#timepicker", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: false,
    });

    if (!$.fn.dataTable.isDataTable('#contract_table')) {
        $('#contract_table').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: 'zatca/cron-jobs',
            },
            columns: [
                { data: 'type', name: 'type' },
                { data: 'day', name: 'day' },
                { data: 'time', name: 'time' },
                { data: 'jobType', name: 'jobType' },
                {
                    data: 'status',
                    name: 'status',
                    render: function (data, type, row) {
                        const statusText = data == 1 ? 'Active' : 'Non-Active';
                        const statusColor = data == 1 ? 'green' : 'red';
                        return `<span style="display: inline-flex; align-items: center;">
                                    <span style="width: 12px; height: 12px; border-radius: 50%; background-color: ${statusColor}; margin-right: 5px;"></span>
                                    ${statusText}
                                </span>`;
                    }
                },
                { data: 'actions', name: 'actions', orderable: false, searchable: false },
                { data: 'delete', name: 'delete', orderable: false, searchable: false },
            ],
            columnDefs: [
                { targets: 0, orderable: false, searchable: false }
            ]
        });
    }

    $(document).on('click', '.item-delete', function () {
        var deleteUrl = $(this).data('id');

        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-secondary'
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: deleteUrl,
                    type: 'DELETE',
                    data: {
                        _token: $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function (response) {
                        Swal.fire({
                            icon: 'success',
                            text: response.message,
                            customClass: {
                                confirmButton: 'btn btn-success waves-effect waves-light',
                            },
                        });
                        $('#contract_table').DataTable().ajax.reload();
                    },
                    error: function (xhr) {
                        Swal.fire({
                            icon: 'error',
                            text: 'An error occurred. Please try again.',
                            customClass: {
                                confirmButton: 'btn btn-danger waves-effect waves-light',
                            },
                        });
                    }
                });
            }
        });
    });

    $(document).on('change', '.switch-input', function () {
        var checkbox = $(this);
        var isChecked = checkbox.prop('checked');
        var url = isChecked ? checkbox.data('start-url') : checkbox.data('stop-url');
        var jobId = url.split('/').pop(); 

        $.ajax({
            url: url,
            type: 'POST',
            data: {
                id: jobId,
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                Swal.fire({
                    icon: 'success',
                    text: response.message,
                    customClass: {
                        confirmButton: 'btn btn-success waves-effect waves-light',
                    },
                });
                $('#contract_table').DataTable().ajax.reload();
            },
            error: function (xhr) {
                Swal.fire({
                    icon: 'error',
                    text: 'An error occurred. Please try again.',
                    customClass: {
                        confirmButton: 'btn btn-danger waves-effect waves-light',
                    },
                });
                checkbox.prop('checked', !isChecked);
            }
        });
    });
});