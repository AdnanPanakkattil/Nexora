$(function () {
  $("#administration_main_menu").addClass("active open menu-item-animating");
  $("#employee_reg_sub_menu").addClass("active");

  var thid = $('#thid').data('title');
  var thname = $('#thname').data('title');
  var themail = $('#themail').data('title');
  var thmobile = $('#thmobile').data('title');
  var throle = $('#throle').data('title');
  var thgender = $('#thgender').data('title');
  var thactive = $('#active').data('title');
  var thbranch = $('#thbranch').data('title');
  var thaction = $('#thaction').data('title');
  var addUserBtn = $('#offcanvasAddUserLabel').data('title');

  var value_doctor = $('#value_doctor').data('title');
  var value_nurse = $('#value_nurse').data('title');
  var value_employee = $('#value_employee').data('title');
  var value_laboratory = $('#value_laboratory').data('title');
  var value_superAdmin = $('#value_superAdmin').data('title');
  var value_radiology = $('#value_radiology').data('title');
  var value_pharmacy = $('#value_pharmacy').data('title');


  $.ajaxSetup({
    headers: {
      "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    },
  });
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

  let borderColor, bodyBg, headingColor;
  if (typeof isDarkStyle !== 'undefined' && typeof config !== 'undefined') {
    if (isDarkStyle) {
      borderColor = config.colors_dark.borderColor;
      bodyBg = config.colors_dark.bodyBg;
      headingColor = config.colors_dark.headingColor;
    } else {
      borderColor = config.colors.borderColor;
      bodyBg = config.colors.bodyBg;
      headingColor = config.colors.headingColor;
    }
  }

  let dt_user;

  if ($('#dt_user_table').length) {
    dt_user = $('#dt_user_table').DataTable({
      processing: true,
      ajax: {
        url: BASE_URL + "/user",
        dataSrc: function (json) {
          // --- Update counts here when data is loaded ---
          if (json.counts) {
            $('#total_nurse').text(json.counts.nurse);
            $('#total_doctor').text(json.counts.doctor);
            $('#total_laboratory').text(json.counts.laboratory);
            $('#total_employee').text(json.counts.employee);
          }
          return json.data;
        }
      },
      columns: [
        {
          data: null,
          orderable: false,
          searchable: false,
          render: function () {
            return '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1">';
          },
          checkboxes: {
            selectAllRender: '<input type="checkbox" class="form-check-input" id="custom-check">'
          }
        },
        { data: 'employeeId', title: thid },
        {
          data: null,
          title: thname,
          render: function (data, type, row) {
            const firstName = row.firstName_en || '';
            const secondName = row.secondName_en || '';
            return (firstName + ' ' + secondName).trim();
          }
        },
        { data: 'email', title: themail },
        { data: 'MobileNo', title: thmobile },
        {
          data: 'role',
          title: throle,
          render: function (data, type) {
            let displayName = '';
            if (data === 'both') displayName = 'Doctor';
            else if (data === 'superadmin') displayName = 'Super Admin';
            else if (data === 'admin') displayName = 'Employee';
            else if (data === 'nurse') displayName = 'Nurse';
            else if (data === 'laboratory') displayName = 'Laboratory';
            else if (data === 'radiology') displayName = 'Radiology';
            else if (data === 'pharmacy') displayName = 'Pharmacy';
            else displayName = data || '';

            displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

            if (type === 'display') {
              return `<span class="badge bg-secondary" style="margin-right: 5px; margin-bottom: 5px;">${displayName}</span>`;
            }
            return displayName;
          }
        },
        {
          data: 'gender',
          title: thgender,
          render: function (data, type, row) {
            if (type === 'display') {
              return data === 'm' ? 'Male' : data === 'f' ? 'Female' : data;
            }
            if (type === 'filter') {
              if (data === 'm') return 'XMale';
              if (data === 'f') return 'XFemale';
              return data;
            }
            return data === 'm' ? 'Male' : data === 'f' ? 'Female' : data;
          }
        },
        {
          data: 'active',
          title: thactive,
          render: function (data, type) {
            let activeName = '';
            let badgeClass = '';
            if (data == 1 || data === '1' || data === true) {
              activeName = 'Active';
              badgeClass = 'bg-success';
            } else {
              activeName = 'Inactive';
              badgeClass = 'bg-danger';
            }
            if (type === 'display') {
              return `<span class="badge ${badgeClass}" style="margin-right: 5px; margin-bottom: 5px;">${activeName}</span>`;
            }
            return activeName;
          }
        },
        {
          data: 'branches',
          title: thbranch,
          render: function (data, type) {
            let branches = data ? data.split(', ') : [];
            if (type === 'display') {
              return branches.map(branch => `<span class="badge bg-primary" style="margin-right: 5px; margin-bottom: 5px;">${branch}</span>`).join(' ');
            }
            return data;
          }
        },

        {
          data: null,
          orderable: false,
          searchable: false,
          title: thaction,
          render: function (data, type, full) {
            let editUrl, detailsUrl, deleteUrl, workingTimeUrl, switchAccountUrl, providerClinic;

            if (full.role === 'both') {
              editUrl = full.canEdit ? BASE_URL + "/edit-doctor/" + full.employeeId : '#';
              detailsUrl = full.canViewDetails ? BASE_URL + "/show-doctor/" + full.employeeId : '#';
              deleteUrl = full.canDelete ? BASE_URL + "/delete-doctor/" + full.employeeId : '#';
              workingTimeUrl = full.canAddUserWorkTime ? BASE_URL + "/working-time-doctor/" + full.employeeId : '#';
              providerClinic = BASE_URL + "/provider-clinic/" + full.employeeId;
            } else if (full.role === 'admin') {
              editUrl = full.canEdit ? BASE_URL + "/edit-receptionist/" + full.employeeId : '#';
              detailsUrl = full.canViewDetails ? BASE_URL + "/show-receptionist/" + full.employeeId : '#';
              deleteUrl = full.canDelete ? BASE_URL + "/delete-receptionist/" + full.employeeId : '#';
            } else if (full.role === 'nurse') {
              editUrl = full.canEdit ? BASE_URL + "/edit-nurse/" + full.employeeId : '#';
              detailsUrl = full.canViewDetails ? BASE_URL + "/show-nurse/" + full.employeeId : '#';
              deleteUrl = full.canDelete ? BASE_URL + "/delete-nurse/" + full.employeeId : '#';
              workingTimeUrl = full.canAddUserWorkTime ? BASE_URL + "/working-time-nurse/" + full.employeeId : '#';
              providerClinic = BASE_URL + "/provider-clinic/" + full.employeeId;
            } else if (full.role === 'superadmin') {
              editUrl = full.canEdit ? BASE_URL + "/edit-superadmin/" + full.employeeId : '#';
              detailsUrl = full.canViewDetails ? BASE_URL + "/show-superadmin/" + full.employeeId : '#';
              deleteUrl = full.canDelete ? BASE_URL + "/delete-superadmin/" + full.employeeId : '#';
            } else if (full.role === 'pharmacy') {
              editUrl = full.canEdit ? BASE_URL + "/edit-pharmacy/" + full.employeeId : '#';
              detailsUrl = full.canViewDetails ? BASE_URL + "/show-pharmacy/" + full.employeeId : '#';
              deleteUrl = full.canDelete ? BASE_URL + "/delete-pharmacy/" + full.employeeId : '#';
            } else if (full.role === 'laboratory') {
              editUrl = full.canEdit ? BASE_URL + "/edit-laboratory/" + full.employeeId : '#';
              detailsUrl = full.canViewDetails ? BASE_URL + "/show-laboratory/" + full.employeeId : '#';
              deleteUrl = full.canDelete ? BASE_URL + "/delete-laboratory/" + full.employeeId : '#';
            } else if (full.role === 'radiology') {
              editUrl = full.canEdit ? BASE_URL + "/edit-radiology/" + full.employeeId : '#';
              detailsUrl = full.canViewDetails ? BASE_URL + "/show-radiology/" + full.employeeId : '#';
              deleteUrl = full.canDelete ? BASE_URL + "/delete-radiology/" + full.employeeId : '#';
            }

            switchAccountUrl = full.canSwitchIntoAnotherAccnt ? BASE_URL + "/switch-into-user-account/" + full.employeeId : '#';

            // START DROPDOWN MENU
            let actionsHtml = `
    <div class="dropdown">
      <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
        <i class="ti ti-dots-vertical"></i>
      </button>
      <div class="dropdown-menu dropdown-menu-end">
  `;

            // SWITCH ACCOUNT
            if (full.canSwitchIntoAnotherAccnt) {
              actionsHtml += `
      <form method="POST" action="${switchAccountUrl}" class="dropdown-item p-0">
        <input type="hidden" name="_token" value="${csrfToken}">
        <input type="hidden" name="employeeId" value="${full.employeeId}">
        <button class="dropdown-item" type="submit">
          <i class="ti ti-password-user me-2"></i> Switch Account
        </button>
      </form>
    `;
            }

            // DELETE
            if (full.canDelete) {
              actionsHtml += `
      <a href="#" class="dropdown-item delete-record" data-id="${deleteUrl}">
        <i class="ti ti-trash me-2"></i> Delete
      </a>
    `;
            }

            // DETAILS
            if (full.canViewDetails) {
              actionsHtml += `
      <a href="${detailsUrl}" class="dropdown-item">
        <i class="ti ti-eye me-2"></i> View
      </a>
    `;
            }

            // EDIT
            if (full.canEdit) {
              actionsHtml += `
      <a href="${editUrl}" class="dropdown-item">
        <i class="ti ti-pencil me-2"></i> Edit
      </a>
    `;
            }

            // WORK TIME + PROVIDER CLINIC
            if (full.role === 'both' || full.role === 'nurse') {
              if (full.canAddUserWorkTime) {
                actionsHtml += `
        <a href="${workingTimeUrl}" class="dropdown-item">
          <i class="ti ti-clock-24 me-2"></i> Working Time
        </a>
      `;
              }

              actionsHtml += `
      <a href="${providerClinic}" class="dropdown-item">
        <i class="ti ti-brand-nytimes me-2"></i> Provider Clinics
      </a>
    `;
            }

            actionsHtml += `
      </div>
    </div>
  `;

            return actionsHtml;
          }

        }
      ],
      order: [[1, 'desc']],
      dom:
        '<"row"' +
        '<"col-md-2"<"ms-n2"l>>' +
        '<"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-6 mb-md-0 mt-n6 mt-md-0"fB>>' +
        '>rt'+
        '<"row"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        '>',
      language: {
        sLengthMenu: '_MENU_',
        search: '',
        searchPlaceholder: 'Search User',
        loadingRecords: '&nbsp;',
        paginate: {
          next: '<i class="ti ti-chevron-right ti-sm"></i>',
          previous: '<i class="ti ti-chevron-left ti-sm"></i>'
        }
      },
      buttons: [
        {
          text: `<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">${addUserBtn}</span>`,
          className: 'add-new btn btn-primary waves-effect waves-light',
          attr: {
            'data-bs-toggle': 'offcanvas',
            'data-bs-target': '#offcanvasAddUser'
          }
        }
      ],
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Details of ' + (data['firstName_en'] + ' ' + data['secondName_en']).trim();
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col) {
              return col.title !== ''
                ? '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                '<td>' + col.title + ':</td> ' +
                '<td>' + col.data + '</td>' +
                '</tr>' : '';
            }).join('');
            return data ? $('<table class="table"/><tbody />').append(data) : false;
          }
        }
      }
    });
  }

  $('#value_showAll').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    const selectedRoles = $(this).val() || [];
    if (clickedIndex === 0) {
      if (isSelected) {
        $(this).selectpicker('val', ['all']);
        dt_user.column(5).search('').draw();
      } else {
        $(this).selectpicker('val', []);
        dt_user.column(5).search('').draw();
      }
      return;
    }

    if (selectedRoles.includes('all')) {
      const filteredRoles = selectedRoles.filter(role => role !== 'all');
      $(this).selectpicker('val', filteredRoles);
    }

    const currentRoles = $(this).val() || [];

    if (currentRoles.length === 0) {
      dt_user.column(5).search('').draw();
      return;
    }

    const roleMap = {
      doctor: 'Doctor',
      both: 'Doctor',
      superadmin: 'Super Admin',
      'super Admin': 'Super Admin',
      admin: 'Employee',
      employee: 'Employee',
      nurse: 'Nurse',
      laboratory: 'Laboratory',
      radiology: 'Radiology',
      pharmacy: 'Pharmacy'
    };

    const mappedRoles = currentRoles.map(role => roleMap[role.toLowerCase()] || role);
    const regexPattern = mappedRoles.map(r => $.fn.dataTable.util.escapeRegex(r)).join('|');
    dt_user.column(5).search(regexPattern, true, false).draw();
  });

  //  MULTI BRANCH FILTER

  $('#clinicId').on('change', function () {
    const selectedBranches = $(this).val() || [];

    if (selectedBranches.length === 0 || selectedBranches.includes('all')) {
      dt_user.column(8).search('').draw();
      return;
    }

    const regexPattern = selectedBranches.map(b => $.fn.dataTable.util.escapeRegex(b)).join('|');
    dt_user.column(8).search(regexPattern, true, false).draw();
  });


  $('#value_showAll').on('changed.bs.select', function (e, clickedIndex, isSelected) {

    const select = $(this);
    const options = select.find('option');
    const allOption = select.find('option[value="all"]')[0];

    const clickedOption = options[clickedIndex];

    if (clickedOption === allOption) {

      if (isSelected) {
        select.val(['all']);
      } else {
        select.val([]);
      }

    } else {
      $(allOption).prop('selected', false);
      let currentValues = select.val() || [];
      const index = currentValues.indexOf('all');
      if (index !== -1) {
        currentValues.splice(index, 1);
        select.val(currentValues);
      }
    }
  });


  $('.dataTables_filter input').off('keyup.DT input.DT').on('keyup.DT input.DT', function (e) {
    var searchValue = this.value.trim();
    var lowerSearch = searchValue.toLowerCase();
    dt_user.column(6).search('');

    if (lowerSearch === 'male') {
      dt_user.search('').column(6).search('XMale', false, false).draw();
    } else if (lowerSearch === 'female') {
      dt_user.search('').column(6).search('XFemale', false, false).draw();
    } else {

      dt_user.search(searchValue).draw();
    }
  });


  // Delete record handler

  $(document).on("click", ".delete-record", function (e) {
    e.preventDefault();
    var deleteUrl = $(this).data("id");

    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-primary me-3 waves-effect waves-light",
        cancelButton: "btn btn-label-secondary waves-effect waves-light",
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        $.ajax({
          url: deleteUrl,
          method: "DELETE",
          success: function (response) {
            if (response.status === true) {
              dt_user.ajax.reload(null, false);
              Swal.fire({
                icon: "success",
                text: response.message || "Record deleted successfully!",
                customClass: { confirmButton: "btn btn-success waves-effect waves-light" },
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Deletion Failed",
                text: response.message || "Could not delete the record.",
                customClass: { confirmButton: "btn btn-danger waves-effect waves-light" },
              });
            }
          },
          error: function (err) {
            console.error("Error deleting record:", err);
            var errorMessage = err.responseJSON && err.responseJSON.message
              ? err.responseJSON.message
              : "An unexpected error occurred. Please try again.";
            Swal.fire({
              icon: "error",
              title: "Error",
              text: errorMessage,
              customClass: { confirmButton: "btn btn-danger waves-effect waves-light" },
            });
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "The record was not deleted.",
          icon: "error",
          customClass: { confirmButton: "btn btn-success waves-effect waves-light" },
          buttonsStyling: false,
        });
      }
    });
  });
});