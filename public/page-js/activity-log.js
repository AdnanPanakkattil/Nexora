let page = 1;
let loading = false;
let allActivities = {
    today: [],
    other: []
};
let displayCount = 8;

function loadActivities() {
    if (loading) return;
    loading = true;

    $.ajax({
        url: BASE_URL + "/activitylog",
        method: 'GET',
        data: { page: page },
        success: function (data) {
            if (data.data.length > 0) {
                const today = new Date().toISOString().split('T')[0];

                const todayActivities = data.data.filter(activity =>
                    activity.created_at.startsWith(today)
                );
                const otherActivities = data.data.filter(activity =>
                    !activity.created_at.startsWith(today)
                );

                allActivities.today = [...allActivities.today, ...todayActivities];
                allActivities.other = [...allActivities.other, ...otherActivities];

                $('#activity-log-1').empty();
                $('#activity-log-2').empty();
                
                renderTimelines();

                page++;
                loading = false;
            }
        },
        error: function () {
            loading = false;
        }
    });
}

function renderTimelines() {

    $('#activity-log-1').html('');
    $('#activity-log-2').html('');

    // today activities
    appendToTimeline('#activity-log-1', allActivities.today.slice(0, displayCount));

    const allActivitiesList = [...allActivities.today, ...allActivities.other];

    appendToTimeline('#activity-log-2', allActivitiesList.slice(0, displayCount));

    if (allActivitiesList.length > displayCount) {
        $('#toggle-btn').show();
    } else {
        $('#toggle-btn').hide();
    }
}

function appendToTimeline(selector, activities) {
    activities.forEach((activity, index) => {
        const actionMap = {
            add: "added successfully",
            edit: "edited successfully",
            delete: "deleted successfully",
            payment: "payment processed successfully",
            merge: "merged successfully",
            login: "logged in successfully",
            assign: "assigned successfully",
            assign_update: "assignment updated successfully",
            assign_delete: "assignment deleted successfully",
            print: "printed successfully",
            draft: "draft saved successfully"
        };

        

        const actionMessage = actionMap[activity.action] || activity.action;
        const formattedActivity =  activity.activity;
        const finalMessage = `${formattedActivity} ${actionMessage}`;
        const affectedId =  activity.affectedId;
        const id =  activity.activityId;
        
        


       const viewDataLink = (activity.action === "edit" ) && formattedActivity === "billing"

    ? `<a href="/view-billing-edit/${id}" class="text-primary">View Data</a>`
    : activity.action === "delete"  && formattedActivity === "billing"
    ? `<a href="/view-billing-delete/${affectedId}" class="text-primary">View Data</a>`
    : activity.action === "delete"  && formattedActivity === "rank"
    ? `<a href="/view-rank-delete/${id}" class="text-primary">View Data</a>`
    : activity.action === "edit"  && formattedActivity === "rank"
     ? `<a href="/view-rank-edit/${id}" class="text-primary">View Data</a>`
     : activity.action === "edit"  && formattedActivity === "position"
     ? `<a href="/view-rank-edit/${id}" class="text-primary">View Data</a>`
      : activity.action === "delete"  && formattedActivity === "position"
    ? `<a href="/view-rank-edit/${id}" class="text-primary">View Data</a>`

    : activity.action === "edit"  && formattedActivity === "speciality"
     ? `<a href="/view-rank-edit/${id}" class="text-primary">View Data</a>`
      : activity.action === "delete"  && formattedActivity === "speciality"
    ? `<a href="/view-rank-edit/${id}" class="text-primary">View Data</a>`

    : activity.action === "edit"  && formattedActivity === "managepayment"
     ? `<a href="/view-rank-edit/${id}" class="text-primary">View Data</a>`
      : activity.action === "delete"  && formattedActivity === "managepayment"
    ? `<a href="/view-rank-edit/${id}" class="text-primary">View Data</a>`

    : activity.action === "edit"  && formattedActivity === "status"
     ? `<a href="/view-rank-edit/${id}" class="text-primary">View Data</a>`
      : activity.action === "delete"  && formattedActivity === "status"
    ? `<a href="/view-rank-edit/${id}" class="text-primary">View Data</a>`

    : activity.action === "edit"  && formattedActivity === "department"
     ? `<a href="/view-department-edit/${id}" class="text-primary">View Data</a>`
      : activity.action === "delete"  && formattedActivity === "department"
    ? `<a href="/view-department-edit/${id}" class="text-primary">View Data</a>`

    : activity.action === "edit"  && formattedActivity === "contract"
     ? `<a href="/view-department-edit/${id}" class="text-primary">View Data</a>`
      : activity.action === "delete"  && formattedActivity === "contract"
    ? `<a href="/view-department-delete/${id}" class="text-primary">View Data</a>`

    : activity.action === "edit"  && formattedActivity === "diagnosis"
     ? `<a href="/view-department-edit/${id}" class="text-primary">View Data</a>`
      : activity.action === "delete"  && formattedActivity === "diagnosis"
    ? `<a href="/view-department-delete/${id}" class="text-primary">View Data</a>`

    : activity.action === "edit"  && formattedActivity === "category"
     ? `<a href="/view-department-edit/${id}" class="text-primary">View Data</a>`
      : activity.action === "delete"  && formattedActivity === "category"
    ? `<a href="/view-department-delete/${id}" class="text-primary">View Data</a>`

    : activity.action === "edit"  && formattedActivity === "nationality"
     ? `<a href="/view-department-edit/${id}" class="text-primary">View Data</a>`

     : activity.action === "edit"  && formattedActivity === "doctor_updated"
     ? `<a href="/view-administation-edit/${id}" class="text-primary">View Data</a>`
      : activity.action === "delete"  && formattedActivity === "doctor_deleted"
    ? `<a href="/view-administation-delete/${id}" class="text-primary">View Data</a>`

    : activity.action === "edit"  && formattedActivity === "nurse_updated"
     ? `<a href="/view-administation-edit/${id}" class="text-primary">View Data</a>`
      : activity.action === "delete"  && formattedActivity === "nurse_deleted"
    ? `<a href="/view-administation-delete/${id}" class="text-primary">View Data</a>`

    : activity.action === "edit"  && formattedActivity === "employ_updated"
     ? `<a href="/view-administation-edit/${id}" class="text-primary">View Data</a>`
      : activity.action === "delete"  && formattedActivity === "employ_deleted"
    ? `<a href="/view-administation-delete/${id}" class="text-primary">View Data</a>`

    : activity.action === "edit"  && formattedActivity === "superadmin_updated"
     ? `<a href="/view-administation-edit/${id}" class="text-primary">View Data</a>`
      : activity.action === "delete"  && formattedActivity === "superadmin_deleted"
    ? `<a href="/view-administation-delete/${id}" class="text-primary">View Data</a>`

    : activity.action === "edit"  && formattedActivity === "pharmacist_updated"
     ? `<a href="/view-administation-edit/${id}" class="text-primary">View Data</a>`
      : activity.action === "delete"  && formattedActivity === "pharmacist_deleted"
    ? `<a href="/view-administation-delete/${id}" class="text-primary">View Data</a>`

    : activity.action === "edit"  && formattedActivity === "laboratory_updated"
    ? `<a href="/view-administation-edit/${id}" class="text-primary">View Data</a>`
     : activity.action === "delete"  && formattedActivity === "laboratory_deleted"
   ? `<a href="/view-administation-delete/${id}" class="text-primary">View Data</a>`

   : activity.action === "edit"  && formattedActivity === "radilogist_updated"
    ? `<a href="/view-administation-edit/${id}" class="text-primary">View Data</a>`
     : activity.action === "delete"  && formattedActivity === "radilogist_deleted"
   ? `<a href="/view-administation-delete/${id}" class="text-primary">View Data</a>`

   : activity.action === "edit"  && formattedActivity === "patient_details"
    ? `<a href="/view-patient-edit/${id}" class="text-primary">View Data</a>`
     : activity.action === "delete"  && formattedActivity === "patient_details"
   ? `<a href="/view-patient-delete/${id}" class="text-primary">View Data</a>`

   : activity.action === "edit"  && formattedActivity === "patient_id_data"
    ? `<a href="/view-patient-edit/${id}" class="text-primary">View Data</a>`
     : activity.action === "delete"  && formattedActivity === "patient_id_data"
   ? `<a href="/view-patient-delete/${id}" class="text-primary">View Data</a>`

   : activity.action === "edit"  && formattedActivity === "patient_birth_informations"
    ? `<a href="/view-patient-edit/${id}" class="text-primary">View Data</a>`
     : activity.action === "delete"  && formattedActivity === "patient_birth_informations"
   ? `<a href="/view-patient-delete/${id}" class="text-primary">View Data</a>`

   : activity.action === "edit"  && formattedActivity === "patient_financial_informations"
    ? `<a href="/view-patient-edit/${id}" class="text-primary">View Data</a>`
     : activity.action === "delete"  && formattedActivity === "patient_financial_informations"
   ? `<a href="/view-patient-delete/${id}" class="text-primary">View Data</a>`

   : activity.action === "edit"  && formattedActivity === "patient_address_informations"
    ? `<a href="/view-patient-edit/${id}" class="text-primary">View Data</a>`
     : activity.action === "delete"  && formattedActivity === "patient_address_informations"
   ? `<a href="/view-patient-delete/${id}" class="text-primary">View Data</a>`

   : activity.action === "edit"  && formattedActivity === "patient_otherdata_informations"
    ? `<a href="/view-patient-edit/${id}" class="text-primary">View Data</a>`
     : activity.action === "delete"  && formattedActivity === "patient_otherdata_informations"
   ? `<a href="/view-patient-delete/${id}" class="text-primary">View Data</a>`

   : activity.action === "edit"  && formattedActivity === "patient"
    ? `<a href="/view-patient-edit/${id}" class="text-primary">View Data</a>`
     : activity.action === "delete"  && formattedActivity === "patient"
   ? `<a href="/view-patient-delete/${id}" class="text-primary">View Data</a>`

   : activity.action === "edit"  && formattedActivity === "branch"
    ? `<a href="/view-branch-edit/${id}" class="text-primary">View Data</a>`
     : activity.action === "delete"  && formattedActivity === "branch"
   ? `<a href="/view-branch-delete/${id}" class="text-primary">View Data</a>`

   : activity.action === "edit"  && formattedActivity === "individual_service"
    ? `<a href="/view-branch-edit/${id}" class="text-primary">View Data</a>`
     : activity.action === "delete"  && formattedActivity === "individual_service"
   ? `<a href="/view-branch-delete/${id}" class="text-primary">View Data</a>`

   : activity.action === "edit"  && formattedActivity === "common_service"
   ? `<a href="/view-rank-edit/${id}" class="text-primary">View Data</a>`
    : activity.action === "delete"  && formattedActivity === "common_service"
  ? `<a href="/view-rank-edit/${id}" class="text-primary">View Data</a>`

  : activity.action === "edit"  && formattedActivity === "template_service"
  ? `<a href="/view-rank-edit/${id}" class="text-primary">View Data</a>`
   : activity.action === "delete"  && formattedActivity === "template_service"
 ? `<a href="/view-rank-edit/${id}" class="text-primary">View Data</a>`

 : activity.action === "edit"  && formattedActivity === "xray_service"
    ? `<a href="/view-branch-edit/${id}" class="text-primary">View Data</a>`
     : activity.action === "delete"  && formattedActivity === "xray_service"
   ? `<a href="/view-branch-delete/${id}" class="text-primary">View Data</a>`

   : activity.action === "edit"  && formattedActivity === "laboratory_service"
   ? `<a href="/view-branch-edit/${id}" class="text-primary">View Data</a>`
    : activity.action === "delete"  && formattedActivity === "laboratory_service"
  ? `<a href="/view-branch-delete/${id}" class="text-primary">View Data</a>`

  : activity.action === "edit"  && formattedActivity === "lab_package"
   ? `<a href="/view-branch-edit/${id}" class="text-primary">View Data</a>`
    : activity.action === "delete"  && formattedActivity === "lab_package"
  ? `<a href="/view-branch-delete/${id}" class="text-primary">View Data</a>`

  : activity.action === "edit"  && formattedActivity === "lab_service_multikit"
   ? `<a href="/view-multikit-edit/${id}" class="text-primary">View Data</a>`
    : activity.action === "delete"  && formattedActivity === "lab_service_multikit"
  ? `<a href="/view-multikit-delete/${id}" class="text-primary">View Data</a>`

    : '';

     
     
    

    
        const timelineItem = `
            <li class="timeline-item timeline-item-transparent">
                <span class="timeline-point timeline-point-primary"></span>
                <div class="timeline-event">
                    <div class="timeline-header mb-3">
                        <h6 class="mb-0">
                            ${activity.employee.firstName_en} 
                            ${activity.employee.secondName_en || ''} 
                            ${activity.employee.thirdName_en || ''} 
                            ${activity.employee.lastName_en || ''} 
                            ${actionMessage}
                        </h6>
                        <small class="text-muted">
                            ${formatDateWithLineBreak(activity.created_at)}
                        </small>
                    </div>
                    <p class="mb-2">${finalMessage}</p>
                    ${viewDataLink} 
                </div>
            </li>
        `;
        $(selector).append(timelineItem);
    });
}

function formatDateWithLineBreak(datetimeString) {
    const utcString = datetimeString.replace(' ', 'T') + 'Z';
    const dateObj = new Date(utcString);
    
    const formattedDate = dateObj.toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata"
    });
    const formattedTime = dateObj.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
    return `${formattedDate}<br>${formattedTime}`;
}
$(document).ready(() => {
    const updateDateTime = () => {
        const now = new Date();
        const formattedDateTime = now.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        $("#current-date-time").html(formattedDateTime);
        $("#value").html('Show all');
    };
    
    updateDateTime();
    setInterval(updateDateTime, 1000);

    loadActivities();

    $('#toggle-btn').click(function() {
        if ($(this).text().includes('View More')) {
            displayCount += 8;
        } else {
            displayCount = 8;
            $(this).html('View More <span><i class="ti ti-caret-down"></i></span>');
        }
        renderTimelines();
    });

    $(window).scroll(() => {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
            loadActivities();
        }
    });





    
});