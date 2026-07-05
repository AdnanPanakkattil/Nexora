$(document).ready(function () {
    // $("#appointment_main_menu").addClass("active open menu-item-animating");
    // $("#appointmrent_report_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    

    
    $(document).on("click", "#addRowBtn", function () {
        const tableBody = document.getElementById("medical_sheet_tbody");
        const rowCount = tableBody.rows.length + 1;
        // const row = document.createElement("tr");
    
        // Creating cells with input fields for each column
        html = `
        <tr>
        <td>${rowCount}</td>
        <td><input type="text" name="medication_name[]" class="form-control" placeholder="Enter medication name"></td>
        <td><input type="text" name="dose[]" class="form-control" placeholder="Dose (mg, mcg)"></td>
        <td><input type="text" name="route[]" class="form-control" placeholder="Route (PO, GT, SC, IV)"></td>
        <td><input type="text" name="frequency[]" class="form-control" placeholder="Frequency"></td>
        <td><input type="text" name="duration_of_therapy[]" class="form-control" placeholder="Duration"></td>
        </tr>
    `;
    
        // Append the row to the table body
        // tableBody.appendChild(row);
        $("#medical_sheet_tbody").append(html);

    });
       

    

    
});

// Function to populate the medication orders table
function populateMedicationTable(medicationOrders) {
    console.log(medicationOrders);
    const tableBody = $("#medical_sheet_tbody");
    tableBody.empty(); // Clear existing rows

    medicationOrders.forEach((order, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td><input type="text" name="medication_name[]" class="form-control" value="${order.medicationName}" placeholder="Enter medication name"></td>
                <td><input type="text" name="dose[]" class="form-control" value="${order.dose}" placeholder="Dose (mg, mcg)"></td>
                <td><input type="text" name="route[]" class="form-control" value="${order.route}" placeholder="Route (PO, GT, SC, IV)"></td>
                <td><input type="text" name="frequency[]" class="form-control" value="${order.frequemcy}" placeholder="Frequency"></td>
                <td><input type="text" name="duration_of_therapy[]" class="form-control" value="${order.durationOfTherapy}" placeholder="Duration"></td>
            </tr>
        `;
        tableBody.append(row);
    });
}






