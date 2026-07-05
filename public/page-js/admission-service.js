$(document).ready(function() {
    // Ensure the script runs when the tab is shown
    $('#addAdmissionServiceOrderBtn').on('click', function() {
        // Check if the tab is currently visible
        if ($('#admission_service_order_table').closest('.tab-pane').hasClass('active')) {
            // Create a new table row (tr) with the required structure
            var newRow = `
                <tr>
                    <td><input type="text" class="form-control" placeholder="Search"></td>
                    <td><input type="text" class="form-control" placeholder="Service Code"></td>
                    <td><input type="number" class="form-control" placeholder="Qty"></td>
                    <td><input type="number" class="form-control" placeholder="Price"></td>
                    <td><input type="number" class="form-control" placeholder="Disc %"></td>
                    <td><input type="number" class="form-control" placeholder="Disc Amt"></td>
                    <td><input type="number" class="form-control" placeholder="VAT %"></td>
                    <td><input type="number" class="form-control" placeholder="VAT AMT"></td>
                    <td><input type="number" class="form-control" placeholder="Total Amount"></td>
                    <td><button type="button" class="btn btn-danger remove-row-btn">Remove</button></td>
                </tr>
            `;
            
            // Append the new row to the tbody
            $('#admission_service_order_tbody').append(newRow);
        } else {
            alert('Please select the Service Order tab first.');
        }
    });

    // Event listener for removing a row
    $(document).on('click', '.remove-row-btn', function() {
        $(this).closest('tr').remove();
    });
});
