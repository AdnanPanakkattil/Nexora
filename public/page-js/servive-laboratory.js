$(document).ready(function () {
    // Initialize menu active states
    $("#service_main_menu").addClass("active open menu-item-animating");
    $("#laboratory_main_sub_menu").addClass("active open");
    $("#laboratory_sub_menu").addClass("active");

    // Set CSRF token
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // Initialize variables
    let defaultDesignContent = '';
    let kitCounter = 1;

    // Initialize DataTable
    var table = $('#client_remainder_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: '/get-services',
            type: 'GET'
        },
        columns: [
            { data: 'serviceId', name: 'serviceId' },
            { data: 'serviceCode', name: 'serviceCode' },
            { data: 'serviceName_en', name: 'serviceName_en' },
            { data: 'serviceName_ar', name: 'serviceName_ar' },
            { data: 'category', name: 'category'},
            { data: 'cost', name: 'cost'},
            {
                data: null,
                name: 'actions',
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    return `
                        <i class="fas fa-eye viewbtn" data-service-id="${row.serviceId}" style="cursor: pointer;"></i>
                        <i class="fas fa-pencil-alt editbtn" data-service-id="${row.serviceId}" style="cursor: pointer;"></i>
                    `;
                }
            }
        ]
    });

    initializeEventHandlers();

    populateVatDropdown();
    populateCategoryDropdown();

    function initializeEventHandlers() {
        $(document).on('click', '.viewbtn', handleViewButtonClick);
        $(document).on('click', '.editbtn', handleEditButtonClick);
        $('#addBtn').click(handleAddButtonClick);
        $('#closebtn').click(handleCloseButtonClick);
        $('#addMachineBtn').click(handleSaveMachineClick);
        $('#multikitCheckbox').change(handleMultikitCheckboxChange);
        $('#rankSaveBtn').click(handleRankSaveClick);

        $(document).on('input', '.design-code', function () {
            const newContent = $(this).val();
            $(this).closest('.kit-container').find('.kit-content').html(newContent);
        });
    }

    function handleViewButtonClick() {
        const serviceId = $(this).data('service-id');
        fetchServiceDetails(serviceId);
    }

    function handleEditButtonClick() {
        var serviceId = $(this).data('service-id');
        fetchServiceForEdit(serviceId);
    }

    function fetchServiceForEdit(serviceId) {
        $.ajax({
            url: '/get-service-details/' + serviceId,
            type: 'GET',
            success: function (data) {
                if (data.status) {
                    $('#rankNameEn').val(data.service.serviceName_en);
                    $('#rankNameAr').val(data.service.serviceName_ar);
                    $('#serviceCode').val(data.service.serviceCode);
                    $('#cost').val(data.service.cost);
                    $('#tax').val(data.service.taxId);

                    $('#Category').val([data.service.categoryId]).trigger('change');

                    $('#addeditModal').data('service-id', serviceId);

                    $('#addeditModal').modal('show');
                } else {
                    handleError('Failed to retrieve service details', data);
                }
            },
            error: function (xhr) {
                handleError('Error fetching service details', xhr.responseJSON);
            }
        });
    }

    function fetchServiceDetails(serviceId) {
        $.ajax({
            url: `/get-service-details/${serviceId}`,
            type: 'GET',
            success: function (data) {
                if (data.status) {
                    $('#title').text(data.service.serviceName_en);
                    defaultDesignContent = data.service.default_design;

                    $('.modal-body .bg-white').empty();

                    $('#multikitCheckbox').prop('checked', data.service.is_multiKit === 1);

                    if (data.service.is_multiKit === 1) {
                        $('#value1').val('checked');
                        document.getElementById('test').style.display = 'block';
                        fetchServiceKits(serviceId);
                        $('.modal-body .bg-white').html(defaultDesignContent);
                    } else {
                        $('#value1').val('unchecked');
                        document.getElementById('test').style.display = 'none';

                        $('.modal-body .bg-white').html(defaultDesignContent);
                    }

                    $('#addStatusModal').data('service-id', serviceId);
                    $('#addStatusModal').modal('show');

                    kitCounter = 0;
                } else {
                    handleError('Failed to retrieve service details', data);
                }
            },
            error: function (xhr) {
                handleError('Error fetching service details', xhr.responseJSON);
            }
        });
    }

    function fetchServiceKits(serviceId) {
        $.ajax({
            url: `/get-service-kits/${serviceId}`,
            type: 'GET',
            success: function (response) {
                if (response.status && response.kits.length > 0) {
                    response.kits.forEach((kit, index) => {
                        kitCounter = index + 1;
                        const kitHtml = `
                            <div class="row mt-4 kit-container" 
                                 data-kit-id="${kitCounter}"
                                 data-clinic-services-kit-id="${kit.clinicServicesKitId}">
                                <div class="col-6 mb-3">
                                    <input type="text" class="form-control kit-name" 
                                           id="kitname_${kitCounter}" 
                                           placeholder="Enter machine name"
                                           value="${kit.kit_name || ''}">
                                </div>
                                <div class="col-12 mb-7">
                                    <textarea class="form-control design-code" 
                                       id="code_${kitCounter}" 
                                       placeholder="code" 
                                       style="height: 150px;">${kit.default_design}</textarea>
                                </div>
                                <div class="col-12 kit-content">
                                    ${kit.default_design}
                                </div>
                                <div class="col-12 mt-2">
                                    <button type="button" class="btn btn-danger btn-cancel" 
                                            data-kit-id="${kitCounter}">Delete</button>
                                </div>
                            </div>
                        `;
                        $('.modal-body .bg-white').append(kitHtml);

                        $(`#code_${kitCounter}`).on('input', function () {
                            const newContent = $(this).val();
                            $(this).closest('.kit-container').find('.kit-content').html(newContent);
                        });

                        $(`.btn-cancel[data-kit-id="${kitCounter}"]`).on('click', function () {
                            $(this).closest('.kit-container').remove();
                        });
                    });
                } else {
                    $('.modal-body .bg-white').html(defaultDesignContent);
                }
            },
            error: function (xhr) {
                handleError('Error fetching service kits', xhr.responseJSON);
            }
        });
    }












    function handleAddButtonClick() {
        kitCounter++;
        const newKitHtml = `
            <div class="row mt-4 kit-container" 
                 data-kit-id="${kitCounter}"
                 data-clinic-services-kit-id="new_${kitCounter}">  
                <div class="col-6 mb-3">
                    <input type="text" class="form-control kit-name" 
                           id="kitname_${kitCounter}" 
                           placeholder="Enter machine name">
                </div>
                <div class="col-12 mb-7">
                    <textarea class="form-control design-code" 
                       id="code_${kitCounter}" 
                       placeholder="code" 
                       style="height: 150px;">${defaultDesignContent}</textarea>
                </div>
                <div class="col-12 kit-content">
                    ${defaultDesignContent}
                </div>
                <div class="col-12 mt-2">
                    <button type="button" class="btn btn-danger btn-cancel" 
                            data-kit-id="${kitCounter}">Delete</button>
                </div>
            </div>
        `;
        $('.modal-body .bg-white').append(newKitHtml);

        // Add event listener for the newly added textarea
        $(`#code_${kitCounter}`).on('input', function () {
            const newContent = $(this).val();
            $(this).closest('.kit-container').find('.kit-content').html(newContent);
        });

        // Add event listener for the Cancel button
        $(`.btn-cancel[data-kit-id="${kitCounter}"]`).on('click', function () {
            $(this).closest('.kit-container').remove();
        });
    }







    // function handleSaveMachineClick() {
    //     const serviceId = $('#addStatusModal').data('service-id');
    //     const isMultikit = $('#multikitCheckbox').is(':checked');
    //     // const test1Value = $('#value1').val(); 
    //     // alert(test1Value);
    //     Swal.fire({
    //         title: 'Saving...',
    //         allowOutsideClick: false,
    //         didOpen: () => {
    //             Swal.showLoading();
    //         }
    //     });
    //     $.ajax({
    //         url: '/update-service-multikit',
    //         type: 'POST',
    //         data: {
    //             serviceId: serviceId,
    //             is_multiKit: isMultikit ? 1 : 0
    //         },
    //         success: function (response) {
    //             if (response.status) {
    //                 saveKits(serviceId);
    //             } else {
    //                 handleError('Failed to update service multikit status', response);
    //             }
    //         },
    //         error: function (xhr) {
    //             handleError('Error updating service multikit status', xhr.responseJSON);
    //         }
    //     });
    // }

    // function saveKits(serviceId) {
    //     const kits = [];
    //     let hasNewKits = false;
    //     const test1Value = $('#value1').val(); // Fetch the value from the input field

    //     $('.kit-container').each(function () {
    //         const kitId = $(this).data('kit-id');
    //         const clinicServicesKitId = $(this).data('clinic-services-kit-id');
    //         const kitName = $(`#kitname_${kitId}`).val();
    //         const kitContent = $(this).find('.kit-content').html();

    //         if (kitContent) {
    //             const kitData = {
    //                 kit_name: kitName || '',
    //                 default_design: kitContent
    //             };

    //             // Only include clinicServicesKitId if it's a real ID (not a new_X temporary ID)
    //             if (clinicServicesKitId && !clinicServicesKitId.toString().startsWith('new_')) {
    //                 kitData.clinicServicesKitId = clinicServicesKitId;
    //             } else {
    //                 hasNewKits = true;
    //             }

    //             kits.push(kitData);
    //         }
    //     });

    //     if (kits.length === defaultDesignContent) {
    //         kits.push({
    //             kit_name: '',
    //             default_design: defaultDesignContent

    //         });
    //         //  (1);
    //     }
    //     if (test1Value == 'checked') {
    //         if (!kits.length) {
    //             handleError('add kit');
    //             // alert(1);
    //             return;
    //         }
    //     }



    //     $.ajax({
    //         url: '/save-service-kits',
    //         type: 'POST',
    //         data: {
    //             serviceId: serviceId,
    //             kits: kits,
    //             test1: test1Value
    //         },
    //         success: function (response) {
    //             if (response.status) {
    //                 Swal.fire({
    //                     icon: 'success',
    //                     text: 'Kits saved successfully',
    //                     customClass: {
    //                         confirmButton: 'btn btn-success'
    //                     }
    //                 }).then(function () {
    //                     if (hasNewKits) {
    //                         location.reload();
    //                     } else {
    //                         $('#addStatusModal').modal('hide');
    //                     }
    //                 });
    //             } else {
    //                 handleError('Failed to save kits', response);
    //             }
    //         },
    //         error: function (xhr) {
    //             handleError('Error saving kits', xhr.responseJSON);
    //         }
    //     });
    // }


    function handleSaveMachineClick() {
        const serviceId = $('#addStatusModal').data('service-id');
        const isMultikit = $('#multikitCheckbox').is(':checked');
        const test1Value = $('#value1').val();
        // alert(test1Value);

        Swal.fire({
            title: 'Saving...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    
        const kits = [];
        let hasNewKits = false;
    
        $('.kit-container').each(function () {
            const kitId = $(this).data('kit-id');
            const clinicServicesKitId = $(this).data('clinic-services-kit-id');
            const kitName = $(`#kitname_${kitId}`).val();
            const kitContent = $(this).find('.kit-content').html();
    
            if (kitContent) {
                const kitData = {
                    kit_name: kitName || '',
                    default_design: kitContent
                };
    
                if (clinicServicesKitId && !clinicServicesKitId.toString().startsWith('new_')) {
                    kitData.clinicServicesKitId = clinicServicesKitId;
                } else {
                    hasNewKits = true;
                }
    
                kits.push(kitData);
            }
        });
    
        $.ajax({
            url: '/update-service-and-save-kits',
            type: 'POST',
            data: {
                serviceId: serviceId,
                is_multiKit: isMultikit ? 1 : 0,
                kits: kits,
                test1: test1Value
            },
            success: function (response) {
                if (response.status) {
                    Swal.fire({
                        icon: 'success',
                        text: 'Service and kits saved successfully',
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    }).then(function () {
                        if (hasNewKits) {
                            location.reload();
                        } else {
                            $('#addStatusModal').modal('hide');
                        }
                    });
                } else {
                    handleError('Failed to save service and kits', response);
                }
            },
            error: function (xhr) {
                Swal.fire({
                    icon: 'error',
                    text: 'Please add kit',
                    customClass: {
                       confirmButton: 'btn btn-danger'
                    }
                })
            }
        });
    }
    


    function handleRankSaveClick() {
        var formData = {
            serviceId: $('#addeditModal').data('service-id'),
            name_en: $('#rankNameEn').val(),
            name_ar: $('#rankNameAr').val(),
            serviceCode: $('#serviceCode').val(),
            cost: $('#cost').val(),
            taxId: $('#tax').val(),
            categoryId: $('#Category').val()
        };
       $("#loader-overlay").show();
        $.ajax({
            url: '/update-service',
            type: 'POST',
            data: formData,
            success: function (response) {
                  $("#loader-overlay").hide();
                if (response.status) {
                    $('#addeditModal').modal('hide');
                    table.ajax.reload();

                    Swal.fire({
                        icon: 'success',
                        text: response.message,
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    }).then(function () {
                        location.reload();
                    });
                } else {
                    if (response.errors) {
                        $.each(response.errors, function (key, value) {
                            $('.' + key + '_error').text(value[0]);
                        });
                    }
                    handleError('Failed to update service', response);
                }
            },
            error: function (xhr) {
                   $("#loader-overlay").hide();
                handleError('Error updating service', xhr.responseJSON);
            }
        });
    }

    function handleCloseButtonClick() {
        $('#addStatusModal').modal('hide');
    }

    function handleMultikitCheckboxChange() {
        const isChecked = $(this).is(':checked');
        let test1;
        if (isChecked) {
            $('#test').show();
            test1 = "checked";
        } else {
            $('#test').hide();
            $('.modal-body .bg-white .kit-container').remove();

            kitCounter = 0;

            test1 = "unchecked";
        }
        // alert(test1); 
        $('#value1').val(test1);
    }



    function handleError(message, response = null) {
        let errorMessage = message;

        // Add detailed error message if available
        if (response && response.debug_message) {
            errorMessage += '\n\nDetails: ' + response.debug_message;
        }

        // If there are validation errors, add them
        if (response && response.errors) {
            errorMessage += '\n\nValidation Errors:\n';
            Object.entries(response.errors).forEach(([field, errors]) => {
                errorMessage += `${field}: ${errors.join(', ')}\n`;
            });
        }

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            customClass: {
                confirmButton: 'btn btn-danger'
            }
        });

        console.error('Error details:', {
            message: message,
            response: response
        });
    }

    function populateVatDropdown() {
        $.ajax({
            url: '/get-vat-options',
            type: 'GET',
            success: function (response) {
                var options = '<option value="">Select VAT</option>';
                $.each(response, function (index, vat) {
                    options += `<option value="${vat.taxId}">${vat.taxName_en}</option>`;
                });
                $('#tax').html(options);
            },
            error: function (xhr) {
                handleError('Error fetching VAT options', xhr.responseJSON);
            }
        });
    }

    function populateCategoryDropdown() {
        $.ajax({
            url: '/get-category-options',
            type: 'GET',
            success: function (response) {
                var options = '';
                $.each(response, function (index, category) {
                    options += `<option value="${category.categoryId}">${category.categoryName_en}</option>`;
                });
                $('#Category').html(options);
            },
            error: function (xhr) {
                handleError('Error fetching Category options', xhr.responseJSON);
            }
        });
    }
});