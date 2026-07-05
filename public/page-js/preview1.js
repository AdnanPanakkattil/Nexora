$(document).ready(function () {
    var csrfToken = $('meta[name="csrf-token"]').attr('content');

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    });

    let grandTotal = $('#totel-amt').val();


    $('#deletebtn').on('click', function (e) {
        e.preventDefault();

        var serviceOrderMasterId = $(this).data('id');

        Swal.fire({
            title: 'Are you sure?',
            text: "Enter reason for deletion",
            icon: 'warning',
            input: 'text',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to provide a reason for deletion!';
                }
            },
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            customClass: {
                confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
                cancelButton: 'btn btn-label-secondary waves-effect waves-light',
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                // Proceed with deletion if the user confirms and provides a reason
                $.ajax({
                    url: BASE_URL + '/delete-data/' + serviceOrderMasterId,
                    type: 'DELETE',
                    data: {
                        reason: result.value,  // Capture the reason input
                        serviceOrderMasterId: serviceOrderMasterId
                    },
                    success: function (response) {
                        if (response.status === true) {
                            Swal.fire({
                                icon: "success",
                                text: 'Invoice deleted successfully!',
                                customClass: {
                                    confirmButton: "btn btn-success waves-effect waves-light",
                                },
                            }).then(function () {
                                window.location.href = BASE_URL + '/billing/report';
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                text: "Failed to save Service Order",
                                customClass: {
                                    confirmButton: "btn btn-danger waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function (xhr) {
                        Swal.fire({
                            title: 'Error!',
                            text: xhr.responseText,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'Your data is safe!',
                    'info'
                );
            }
        });
    });



    var temporaryArray = [];

    $('.payment-checkbox').change(function () {
        var selectedCheckboxes = $('.payment-checkbox:checked');
        var numberOfSelected = selectedCheckboxes.length;
        var amountToDistribute = numberOfSelected > 0 ? (grandTotal / numberOfSelected).toFixed(2) : 0;
        totalvalue = amountToDistribute * numberOfSelected;
        temporaryArray.length = 0;
        $('.payment-checkbox').each(function () {
            var $parentDiv = $(this).closest('div.border-bottom');
            var value = $(this).data('value');

            if ($(this).is(':checked')) {
                if (value !== 'cash') {
                    $parentDiv.find('.reference-input').removeClass('d-none');
                } else {
                    $parentDiv.find('.reference-input').val(0).addClass('d-none');
                }
                $parentDiv.find('.amount-input').removeClass('d-none').val(amountToDistribute);
            } else {
                $parentDiv.find('.amount-input').addClass('d-none').val('');
                $parentDiv.find('.reference-input').addClass('d-none').val('');
            }
        });

        distributeTotal();
    });



    $(document).on('input', '.amount-input', function () {
        var $currentInput = $(this); // The triggering input field
        var enteredAmount = parseFloat($currentInput.val()) || 0; // Value entered by the user
        var $checkbox = $currentInput.closest('.d-flex').find('.payment-checkbox');
        var selectedCheckboxes = $('.payment-checkbox:checked');
        var totalAssigned = 0;

        // Add the current input's ID and entered amount to the temporary array if not already present
        var inputId = $currentInput.attr('id');
        var existingEntry = temporaryArray.find(item => item.id === inputId);


        if (!existingEntry) {
            temporaryArray.push({ id: inputId, amount: enteredAmount });
        } else {
            existingEntry.amount = enteredAmount; // Update the amount if the entry already exists
        }

        totalbalanceAmount = temporaryArray.reduce((sum, entry) => sum + entry.amount, 0);

        console.log("Total Amount:", totalbalanceAmount);

        // console.log("Temporary array count:", temporaryArray.length);
        var remainingAmount = grandTotal - totalAssigned;


        if (temporaryArray.length == 1) {
            var numberOfOtherInputs = (selectedCheckboxes.length - temporaryArray.length);
            amountToDistribute1 = numberOfOtherInputs > 0 ? ((grandTotal - enteredAmount) / numberOfOtherInputs).toFixed(2) : 0;

        }
        else {
            var numberOfOtherInputs = (selectedCheckboxes.length - temporaryArray.length);
            amountToDistribute1 = numberOfOtherInputs > 0 ? ((grandTotal - totalbalanceAmount) / numberOfOtherInputs).toFixed(2) : 0;

        }



        if (amountToDistribute1 > 0) {

            console.log("The amount is positive:", amountToDistribute1);
        } else if (amountToDistribute1 < 0) {
            Swal.fire({
                icon: "error",
                text: "The amount is wrong",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
            console.log("The amount is negative:", amountToDistribute1);
        } else {
            console.log("The amount is zero:", amountToDistribute1);

        }

        console.log("balance amounts:", amountToDistribute1);

        selectedCheckboxes.each(function () {
            var inputId = $(this).data('value') + '_amount';
            var inputValue = parseFloat($('#' + inputId).val()) || 0;
            totalAssigned += inputValue;
        });

        selectedCheckboxes.each(function () {
            var inputId = $(this).data('value') + '_amount';
            var $inputField = $('#' + inputId);

            if ($inputField.is($currentInput) || temporaryArray.some(item => item.id === inputId)) return;

            $inputField.val(amountToDistribute1);
        });

        console.log("Tracked inputs with amounts:", temporaryArray);

    });



    $('#savebtn').click(function () {
    let selectedPayments = [];
    const inPatientId = $('#inPatientId').val();
    const serviceOrderMasterId = $('#serviceOrderMasterId').val();

    
    let hasError = false;

    // Clear previous error messages
    $('.serviceOrderPayment_error').text('');
    $('.serviceOrderPayment_referenceNumber_error').text('');

    const checkedBoxes = $('.payment-checkbox:checked');
    
    if (checkedBoxes.length === 0) {
        $('.serviceOrderPayment_error').text('Please select at least one payment method.');
        return;
    }

    checkedBoxes.each(function () {
        const $checkbox = $(this);
        const generalSettingsId = $checkbox.val();
        const paymentType = $checkbox.data('value'); 
        const $parent = $checkbox.closest('.border-bottom');

        const amount = $parent.find('.amount-input').val();
        const reference = $parent.find('.reference-input').val();

        if (paymentType !== 'cash' && (!reference || reference.trim() === '')) {
            $parent.find('.reference-input').addClass('is-invalid'); 
            $('.serviceOrderPayment_referenceNumber_error').text('Please fill in all required reference numbers.');
            hasError = true;
            return false; 
        } else {
            $parent.find('.reference-input').removeClass('is-invalid');
        }

        selectedPayments.push({
            generalSettingsId: generalSettingsId,
            paymentType: paymentType,
            amount: amount,
            referenceNumber: reference,
            inPatientId: inPatientId
        });
    });

    if (hasError) return;

   $.ajax({
    url: BASE_URL + '/save-payment',
    method: 'POST',
    data: {
        payments: selectedPayments,
        _token: $('meta[name="csrf-token"]').attr('content')
    },
    success: function (response) {
         Swal.fire({
                icon: "success",
                text: response.message,
                customClass: {
                    confirmButton: "btn btn-success waves-effect waves-light",
                },
                    }).then(() => {
            $('#paymentMethodsModal').modal('hide');
            window.location.href = BASE_URL + '/total-invoice/' + serviceOrderMasterId;
            // location.reload(); 
        });
    },
    error: function (err) {
        Swal.fire({
            title: 'Error!',
            text: err.responseJSON?.message || 'Something went wrong while saving.',
           customClass: {
                    confirmButton: "btn btn-success waves-effect waves-light",
                },
        });
        console.log("Error saving", err);
    }
});

});




    $('.item-delete').on('click', function () {
        const deleteUrl = $(this).data('id');

        if (confirm('Are you sure you want to delete this invoice?')) {
            $.ajax({
                url: deleteUrl,
                type: 'DELETE',
                success: function (response) {
                    console.log('Success response:', response); // Check if this line runs
                    if (response.success) {
                        alert('Invoice deleted successfully.');
                        location.reload(); // Reload the page
                    } else {
                        alert('Error: ' + response.message);
                    }

                },
                error: function (error) {
                    console.log('Error:', error); // Log error details
                    alert('Error deleting invoice.');
                }
            });
        }
    });



    // $('#printbtn').on('click', function(e){
    //     e.preventDefault(); // Prevent default action of the link
    //     $.ajax({
    //         url: "{{ url('/invoice-printinvoice') }}", // URL for the AJAX request
    //         type: "GET", // Use GET request
    //         success: function(response) {
    //             // Handle success, maybe open a new window for print
    //             var printWindow = window.open('', '_blank');
    //             printWindow.document.write(response); // Assuming the response is HTML content
    //             printWindow.document.close();
    //             printWindow.focus();
    //             printWindow.print();
    //         },
    //         error: function(xhr) {
    //             // Handle errors
    //             console.error(xhr.responseText);
    //             alert("Something went wrong!");
    //         }
    //     });
    // });






});

function intialPageLoad(serviceOrderMasterId) {
    $.ajax({
        url: BASE_URL + '/get-data/' + serviceOrderMasterId,
        type: 'GET',
        success: function (response) {
            if (response.status === true) {
                $('.financial-category').text(response.financialCategory);
            } else {
                console.error('Failed to fetch financial category:', response.message);
            }
        },
        error: function (xhr) {
            console.error('An error occurred:', xhr.responseText);
        }
    });
}
