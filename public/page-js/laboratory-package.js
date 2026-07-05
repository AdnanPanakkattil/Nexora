$(function () {
    $("#service_main_menu").addClass("active open menu-item-animating");
    $("#laboratory_main_sub_menu").addClass("active open");
    $("#laboratory-package_sub_menu").addClass("active");

  $.ajaxSetup({
      headers: {
          "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
      },
  });

  $('#client_remainder_table').DataTable({
      processing: true,
      serverSide: true,
      ajax: {
          url: '/get-packages',
          type: 'GET'
      },
      columns: [
          { data: 'serviceId', name: 'serviceId'},
          { data: 'serviceCode', name: 'serviceCode'},
          { data: 'serviceName_en', name: 'serviceName_en'},
          { data: 'serviceName_ar', name: 'serviceName_ar'},
          { data: 'cost', name: 'cost'},
          { data: 'actions', name: 'actions', orderable: false, searchable: false }
      ]
  });
  var isEditing = false;
  var editingId = null;

  function resetForm() {
      $('#addPackageForm')[0].reset();
      $('.error-text').text('');
      isEditing = false;
      editingId = null;
      $('#packageSaveBtn').text('Save');
  }
  $('#addNewPackageBtn').on('click', function () {
    resetForm();
    $('#addPackageModal').modal('show');
    loadLabList();
});

  function loadLabList() {
      $.ajax({
          url: '/get-lab-list',
          type: 'GET',
          success: function(response) {
              var dropdown = $('#select2Primary');
              dropdown.empty();
              $.each(response, function(key, value) {
                  dropdown.append($('<option></option>').attr('value', value.serviceId).text(value.serviceName_en));
              });
              dropdown.trigger('change');
          },
          error: function(xhr, status, error) {
              console.error("Error fetching lab list:", error);
          }
      });
  }

  $(document).ready(function() {
    $.ajax({
        url: '/api/taxes', 
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            let dropdown = $('#departmentDropdown');
            $.each(data, function(index, tax) {
                dropdown.append($('<option>', {
                    value: tax.taxId,
                    text: tax.taxName_en
                }));
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching tax data:', error);
        }
    });
});
  

$('#packageSaveBtn').on('click', function() {
        var formData = {
            serviceName_en: $('#packageNameEn').val(),
            serviceName_ar: $('#packageNameAr').val(),
            serviceCode: $('#serviceCode').val(),
            cost: $('#cost').val(),
            taxId: $('#departmentDropdown').val(),
            labList: $('#select2Primary').val()
        };

        var url = isEditing ? '/update-laboratory-package/' + editingId : '/save-laboratory-package';
        var method = isEditing ? 'PUT' : 'POST';
        $("#loader-overlay").show();
        $.ajax({
            url: url,
            type: method,
            data: formData,
            success: function(response) {
                $("#loader-overlay").hide();
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        text: response.message,
                        customClass: {
                            confirmButton: 'btn btn-success waves-effect waves-light',
                        },
                    }).then(function () {
                        location.reload();
                    });
                    $("#addPackageModal").modal('hide');
                } else {
                    Swal.fire('Error', isEditing ? 'Failed to update laboratory package' : 'Failed to save laboratory package', 'error');
                }
            },
            error: function (xhr, status, error) {
                $("#loader-overlay").hide();
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

$(document).on('click', '.item-delete', function() {
    var id = $(this).data('id');
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $("#loader-overlay").show();
            $.ajax({
                url: '/delete-laboratory-package/' + id,
                type: 'DELETE',
                success: function(response) {
                    $("#loader-overlay").hide();
                    if (response.success) {
                        Swal.fire({
                            icon: "success",
                            text: "Package deleted successfully!",
                            customClass: {
                                confirmButton: "btn btn-success waves-effect waves-light",
                            },
                        }).then(() => {
                            location.reload(); 
                        });
                    } else {
                        Swal.fire('Error', 'Failed to delete laboratory package', 'error');
                    }
                },
                error: function(xhr, status, error) {
                    $("#loader-overlay").hide();
                    console.error("Error deleting laboratory package:", error);
                    Swal.fire('Error', 'An error occurred while deleting the laboratory package', 'error');
                }
            });
        }
    });
});


function loadLabList(callback) {
    $.ajax({
      url: '/get-lab-list',
      type: 'GET',
      success: function(response) {
        var dropdown = $('#select2Primary');
        dropdown.empty();
        $.each(response, function(key, value) {
          dropdown.append($('<option></option>').attr('value', value.serviceId).text(value.serviceName_en));
        });
        dropdown.trigger('change');
        if (callback) callback();
      },
      error: function(xhr, status, error) {
        console.error("Error fetching lab list:", error);
      }
    });
  }

  $(document).on('click', '.item-edit', function() {
    var id = $(this).data('id');
    $("#loader-overlay").show();
    $.ajax({
      url: '/edit-laboratory-package/' + id,
      type: 'GET',
      success: function(response) {
        $("#loader-overlay").hide();
        resetForm();
        $('#packageNameEn').val(response.package.serviceName_en);
        $('#packageNameAr').val(response.package.serviceName_ar);
        $('#serviceCode').val(response.package.serviceCode);
        $('#cost').val(response.package.cost);
        $('#departmentDropdown').val(response.package.taxId);
        
        // Load lab list and set selected values
        loadLabList(function() {
          $('#select2Primary').val(response.selectedLabs).trigger('change');
        });
        
        isEditing = true;
        editingId = id;
        $('#packageSaveBtn').text('Update');
        $('#addPackageModal').modal('show');
      },
      error: function(xhr, status, error) {
        $("#loader-overlay").hide();
        console.error("Error fetching package details:", error);
        Swal.fire('Error', 'Failed to fetch package details', 'error');
      }
    });
  });


});
$('#packageNameEn').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#packageNameAr').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});