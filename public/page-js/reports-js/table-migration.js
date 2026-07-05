$(document).ready(function () {
    $("#reports_main_menu").addClass("active open menu-item-animating");
    $("#gss_report_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: { "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content") },
    });

    // Add More subtable row
    $('#addSubTable').on('click', function () {
        let newRow = `
        <div class="row g-3 subtable-row mt-2">
            <div class="col-4">
                <label class="form-label">Sub Table CSV</label>
                <input type="file" class="form-control" name="sub_csv_files[]" accept=".csv">
            </div>
            <div class="col-4">
                <label class="form-label">Sub Table Name</label>
                <select class="form-select" name="sub_table_names[]">
                    <option value="">-- Select Sub Table --</option>
                    ${$('#table_name').html()} <!-- reuse table options -->
                </select>
            </div>
            <div class="col-2 d-flex align-items-end">
                <button type="button" class="btn btn-danger remove-subtable">Remove</button>
            </div>
        </div>`;
        $('#subtable-wrapper').append(newRow);
    });

    // Remove subtable row
    $(document).on('click', '.remove-subtable', function () {
        $(this).closest('.subtable-row').remove();
    });

    // Upload main + sub tables
    $('#upload_btn').on('click', function (e) {
        e.preventDefault();

        let fileInput = $('#csv_file')[0];
        let tableName = $('#table_name').val();
        let databaseName = $('#database_name').val();

        $('.csv_file_error').text('');
        $('.table_name_error').text('');

        if (!fileInput.files.length) {
            $('.csv_file_error').text('Please select a CSV file.');
            return;
        }
        if (!tableName.trim()) {
            $('.table_name_error').text('Please select a table name.');
            return;
        }

        let formData = new FormData();
        formData.append('csv_file', fileInput.files[0]);
        formData.append('table_name', tableName);
        formData.append('database_name', databaseName);

        // Add subtables
        $('input[name="sub_csv_files[]"]').each(function (index, fileInput) {
            if (fileInput.files.length > 0) {
                formData.append('sub_csv_files['+index+']', fileInput.files[0]);
                formData.append('sub_table_names['+index+']', 
                    $(fileInput).closest('.subtable-row').find('select[name="sub_table_names[]"]').val()
                );
            }
        });

        $.ajax({
            url: BASE_URL + '/migration/table-migration',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.status === true) {
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success waves-effect waves-light" },
                    }).then(() => location.reload());
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-danger waves-effect waves-light" },
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    text: 'An error occurred while uploading the file.',
                    customClass: { confirmButton: "btn btn-danger waves-effect waves-light" },
                });
            }
        });
    });
});
