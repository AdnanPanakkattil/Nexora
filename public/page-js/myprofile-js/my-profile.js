$(function () {
    const BASE_URL = window.location.origin;
    const DEFAULT_AVATAR = BASE_URL + "/assets/img/avatars/1.png";

    let originalAvatar = $('#preview').attr('src');

    if ($('#reset_avatar').length === 0) {
        $('#formAccountSettings').append('<input type="hidden" id="reset_avatar" name="reset_avatar" value="0">');
    }

    const token = $('meta[name="csrf-token"]').attr('content');
    if (token) $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': token } });

    $('#resetAvatar').on('click', function (e) {
        e.preventDefault();
        $('#preview').attr('src', DEFAULT_AVATAR);
        $('#upload').val('');
        $('#reset_avatar').val(1);
    });

    $('#upload').on('change', function () {
        $('#reset_avatar').val(0);
        const input = this;
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = e => $('#preview').attr('src', e.target.result);
            reader.readAsDataURL(input.files[0]);
        }
    });

    $('#cancelBtn').on('click', function (e) {
        e.preventDefault();
        $('#preview').attr('src', originalAvatar);
        $('#reset_avatar').val(0);
        $('#upload').val('');
    });

    $('#update_profile').on('click', function (e) {
        e.preventDefault();

        const $btn = $(this);
        const $form = $("#formAccountSettings");
        const formData = new FormData($form[0]);
        formData.append('reset_avatar', $('#reset_avatar').val());

        if ($('#upload')[0].files.length > 0) {
            formData.set('profile_image', $('#upload')[0].files[0]);
        }

        $btn.prop('disabled', true).text('Updating...');

        $.ajax({
            url: $form.attr('action'),
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $btn.prop('disabled', false).text('Save Changes');

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: response.message || 'Profile updated successfully.',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-success waves-effect waves-light'
                    }
                }).then(() => {
                    window.location.href = BASE_URL + '/my-profile';
                });
            },
            error: function (xhr) {
                $btn.prop('disabled', false).text('Save Changes');

                let errMsg = 'Something went wrong';
                if (xhr.responseJSON && xhr.responseJSON.message) errMsg = xhr.responseJSON.message;

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errMsg,
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-danger waves-effect waves-light'
                    }
                });
            }
        });
    });

    const TIMELINE = (function () {
        let page = 1, loading = false, allActivities = { today: [], other: [] }, displayCount = 4;

        function loadActivities() {
            if (loading) return;
            loading = true;

            $.ajax({
                url: BASE_URL + "/activitylog",
                method: "GET",
                data: { page: page },
                success: function (data) {
                    if (data && Array.isArray(data.data) && data.data.length > 0) {
                        const today = new Date().toISOString().split("T")[0];
                        const todayActivities = data.data.filter(a => a.created_at.startsWith(today));
                        const otherActivities = data.data.filter(a => !a.created_at.startsWith(today));
                        allActivities.today.push(...todayActivities);
                        allActivities.other.push(...otherActivities);
                        renderTimelines();
                        page++;
                    }
                },
                complete: function () { loading = false; }
            });
        }

        function renderTimelines() {
            const activities = [...allActivities.today, ...allActivities.other];
            const activitiesToShow = activities.slice(0, displayCount);
            appendToTimeline("#activity-log-1", activitiesToShow);
            $("#toggle-btn").toggle(activities.length > displayCount);
        }

        function appendToTimeline(selector, activities) {
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

            const $el = $(selector);
            $el.empty();

            if (!activities.length) {
                $el.append('<li class="text-muted">No activities yet.</li>');
                return;
            }

            activities.forEach(activity => {
                const actionMessage = actionMap[activity.action] || activity.action;
                const emp = activity.employee || {};
                const employeeName = [emp.firstName_en, emp.secondName_en, emp.thirdName_en, emp.lastName_en].filter(Boolean).join(" ");
                const timelineItem = `
                    <li class="timeline-item timeline-item-transparent">
                        <span class="timeline-point timeline-point-primary"></span>
                        <div class="timeline-event">
                            <div class="timeline-header mb-3">
                                <h6 class="mb-0">${employeeName} ${actionMessage}</h6>
                                <small class="text-muted">${formatDateWithLineBreak(activity.created_at)}</small>
                            </div>
                            <p class="mb-2">${escapeHtml(activity.activity + ' ' + actionMessage)}</p>
                        </div>
                    </li>
                `;
                $el.append(timelineItem);
            });
        }

        function formatDateWithLineBreak(datetimeString) {
            const isoString = datetimeString.replace(" ", "T");
            const dateObj = new Date(isoString);
            if (isNaN(dateObj)) return datetimeString;
            const formattedDate = dateObj.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
            const formattedTime = dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
            return `${formattedDate}<br>${formattedTime}`;
        }

        function escapeHtml(text) {
            if (!text) return '';
            return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
        }

        $(window).on('scroll.timeline', function () {
            if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) loadActivities();
        });

        $("#toggle-btn").on('click', function () {
            const activities = [...allActivities.today, ...allActivities.other];
            displayCount = ($(this).text().includes("View More")) ? activities.length : 4;
            $(this).html(displayCount > 4 ? 'View Less <span><i class="ti ti-caret-up"></i></span>' : 'View More <span><i class="ti ti-caret-down"></i></span>');
            renderTimelines();
        });

        return { init: loadActivities };
    })();

    TIMELINE.init();

    $('#accountDelete').on('change', function () {
        $('#deleteAccount').prop('disabled', !this.checked);
    });
    // const LOGIN_URL = "{{ route('login') }}";
    $('#deleteAccount').click(function (e) {
        e.preventDefault();
        const isChecked = $('#accountDelete').is(':checked');
        if (!isChecked) {
            Swal.fire({
                icon: 'warning',
                title: 'Please confirm!',
                text: 'You must check the box before deleting your account.'
            });
            return;
        }

        const employeeId = $('#employeeId').val();

        Swal.fire({
            title: 'Are you sure?',
            text: "This action may delete the account!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Delete",
            customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
                cancelButton: "btn btn-danger waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: BASE_URL + "/delete-user-account",
                    type: 'POST',
                    data: {
                        _token: $('meta[name="csrf-token"]').attr('content'),
                        employeeId: employeeId
                    },
                    success: function (response) {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your account has been marked as deleted.',
                            icon: 'success',
                            showCancelButton: false, 
                            confirmButtonText: "OK",
                            customClass: {
                                confirmButton: "btn btn-primary waves-effect waves-light",
                                cancelButton: "btn btn-danger waves-effect waves-light"
                            }
                        }).then(() => {
                            window.location.href = BASE_URL + '/login';
                        });
                    },
                    error: function (xhr) {
                        Swal.fire(
                            'Error!',
                            'Something went wrong. Please try again.',
                            'error'
                        );
                    }
                });
            }
        });
    });

});
