$(function () {
    $("#application_main_menu").addClass("active open menu-item-animating");
    $("#application_providers_sub_menu").addClass("active");

    
    var thid = $('#thid').data('title');
    var thname = $('#thname').data('title');
    var themail = $('#themail').data('title');
    var thmobile = $('#thmobile').data('title');
    var throle = $('#throle').data('title');
    var thgender = $('#thgender').data('title');
    var thbranches = $('#thbranches').data('title');
    var thactions = $('#thactions').data('title');
    var addNewUser = $('#offcanvasAddUserLabel').data('title');

    var  value_showAll= $('#value_showAll').data('title');
    var value_doctor = $('#value_doctor').data('title');
    var value_nurse = $('#value_nurse').data('title');
  
    $.ajaxSetup({
      headers: {
        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
      },
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
  
    if ($('#dt_user_table').length) {
      var dt_user = $('#dt_user_table').DataTable({
        processing: true,
        ajax: {
          url: BASE_URL + "/application/providers",
          dataSrc: 'data'
        },
        columns: [
          {
            data: null,
            orderable: false,
            searchable: false,
            render: function (data, type, full, meta) {
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
           render: function(data, type, row) {
            const firstName = row.firstName_en || '';
            const secondName = row.secondName_en || '';
            return (firstName + ' ' + secondName).trim();
          }
          },
          { data: 'email', title: themail },
          { data: 'MobileNo', title:thmobile },
          { 
            data: 'role', 
            title: throle, 
            render: function(data, type, row) {
              if (data === 'both') {
                return 'Doctor'; 
              } else if (data === 'superadmin') {
                return 'Superadmin'; 
              } else if (data === 'admin') {
                return 'Employee'; 
              }
              return data; 
            }
          },
          { data: 'gender', title: thgender, render: function(data, type, row) {
            return data === 'm' ? 'Male' : data === 'f' ? 'Female' : data;
          }},
          {
            data: 'branches',
            title: thbranches,
            // render: function (data, type, row) {
            //   let branches = data ? data.split(', ') : [];
            //   return branches.map(branch => `<span class="badge badge-spacing bg-primary">${branch}</span>`).join(' ');
            //   // return branches.map(branch => `<span class="badge" style="margin-right: 5px;">${branch}</span>`).join(' ');
            // }
            render: function (data, type, row) {
              let branches = data ? data.split(', ') : [];
              return branches.map(branch => `<span class="badge bg-primary" style="margin-right: 5px; margin-bottom: 5px;">${branch}</span>`).join(' ');
          }
          
          },
          //actions button
          {
            data: null,
            orderable: false,
            searchable: false,
            title: thactions,
            render: function (data, type, full) {

            let editUrl, detailsUrl, deleteUrl;
              // ROLE BASED URLS
              if (full.role === 'both') {

                editUrl = full.canEdit ? BASE_URL + "/edit-provider-doctor/" + full.employeeId : '#';
                detailsUrl = full.canViewDetails ? BASE_URL + "/show-provider-doctor/" + full.employeeId : '#';
                 deleteUrl = full.canDelete ? BASE_URL + "/delete-doctor/" + full.employeeId : '#';
                workingTimeUrl = full.canAddUserWorkTime ? BASE_URL + "/working-time-doctor/" + full.employeeId : '#';

              } else if (full.role === 'nurse') {

                editUrl = full.canEdit ? BASE_URL + "/edit-provider-nurse/" + full.employeeId : '#';
                detailsUrl = full.canViewDetails ? BASE_URL + "/show-provider-nurse/" + full.employeeId : '#';
                deleteUrl = full.canDelete ? BASE_URL + "/delete-nurse/" + full.employeeId : '#';
                workingTimeUrl = full.canAddUserWorkTime ? BASE_URL + "/working-time-nurse/" + full.employeeId : '#';

              }
              
              // START DROPDOWN
              let actionsHtml = `
                <div class="dropdown">
                  <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                    <i class="ti ti-dots-vertical"></i>
                  </button>
                  <div class="dropdown-menu">
              `;

              // EDIT
              if (full.canEdit) {
                actionsHtml += `
                  <a href="${editUrl}" class="dropdown-item">
                    <i class="ti ti-pencil me-2"></i> Edit
                  </a>
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

              // CLOSE DROPDOWN
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
          '>rt' +
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
            text: `<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">${addNewUser}</span>`,
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
                return 'Details of ' + data['full_name'];
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
            
            // Role Filter
            if (column.index() === 5) {
              var select = $('<select id="UserRole" class="form-select text-capitalize">' +
                `<option value="Show All">${value_showAll}</option>` +
                `<option value="Doctor">${value_doctor}</option>` +
                `<option value="Nurse">${value_nurse}</option>` +
                '</select>')
                .appendTo('.user_role')
                .on('change', function () {
                  var val = $.fn.dataTable.util.escapeRegex(
                    $(this).val()
                  );
                  column.search(val ? '^' + val + '$' : '', true, false).draw();
                });
            }
  
            // Branch Filter
            if (column.index() === 7) {
              var branches = [];
              column.data().unique().sort().each(function (d, j) {
                if (d) {
                  branches = branches.concat(d.split(', '));
                }
              });
              branches = Array.from(new Set(branches));
              var select = $('<select id="UserBranch" class="form-select text-capitalize">' +
                '<option value="">Select Branch</option>' +
                branches.map(branch => `<option value="${branch}">${branch}</option>`).join('') +
                '</select>')
                .appendTo('.user_branch')
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
      $('#user_role').on('change', function () {
        var val = $(this).val();
          if (val === 'all') {
            dt_user.column(5).search('').draw();
          } else {
            var searchVal = val.charAt(0).toUpperCase() + val.slice(1);
            dt_user.column(5).search('^' + searchVal + '$', true, false).draw();
          }
      });
      $('#checkAll').on('click', function () {
        dt_user.rows().select();
      });
  
      $('#btnDeselectAll').on('click', function () {
        dt_user.rows().deselect();
      });
  
    //user delete

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
            $("#loader-overlay").show();
            $.ajax({
              url: deleteUrl,
              method: "DELETE",
              success: function (response) {
                $("#loader-overlay").hide();
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
                $("#loader-overlay").hide();
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
    }
  });