$(document).ready(function () {

    

    $("#application_main_menu").addClass("active open menu-item-animating");
    $("#application_meeting_sub_menu").addClass("active");

    const meetingInput = document.getElementById('meetingCode');
    const joinBtn = document.getElementById('joinBtn');

    if (meetingInput && joinBtn) {
        meetingInput.addEventListener('input', function () {
            if (this.value.trim().length > 0) {
                joinBtn.disabled = false;
                joinBtn.classList.replace('text-muted', 'text-primary');
                joinBtn.style.cursor = 'pointer';
            } else {
                joinBtn.disabled = true;
                joinBtn.classList.replace('text-primary', 'text-muted');
                joinBtn.style.cursor = 'default';
            }
        });

        joinBtn.addEventListener('click', function () {
            const value = meetingInput.value.trim();

            if (!value) return;

            if (value.startsWith('http')) {
                window.open(value, '_blank');
            } else {
                window.open('/meeting/join/' + value, '_blank');
            }
        });
    }

    function updateClock() { 
        const now = new Date();

        // Time part: 11:06 AM
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const timeStr = `${hours}:${minutes} ${ampm}`;

        // Date part: Wed, Jan 28
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dayName = days[now.getDay()];
        const monthName = months[now.getMonth()];
        const dayNum = now.getDate();

        const dateStr = `${dayName}, ${monthName} ${dayNum}`;

        const clockElement = document.getElementById('current-time-display');
        if (clockElement) {
            clockElement.innerText = `${timeStr}.${dateStr}`;
        }
    }

    updateClock();
    setInterval(updateClock, 1000);

   function checkMeetingExpiry() {
    const expiryInput = document.getElementById('expiryAt');
    if (!expiryInput) return;

    // ✅ Add this — skip if no value set yet
    if (!expiryInput.value || expiryInput.value.trim() === '') return;

    const expiry = parseInt(expiryInput.value) * 1000;
    const now = Date.now();
    const timeLeft = expiry - now;

    if (timeLeft <= 0) {
        showExpiredPopup();
        return;
    }

    setTimeout(showExpiredPopup, timeLeft);
}
  function showExpiredPopup() {
    const linkText = document.getElementById('generatedLink');

    // ✅ Only mark expired if there's actually a link showing
    if (linkText && linkText.innerText.trim() !== '') {
        linkText.innerText = "Expired";
        linkText.style.color = "red";
    }

    Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Meeting link expired. Please generate a new meeting.',
        confirmButtonText: 'OK',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            location.reload();
        }
    });
}

    checkMeetingExpiry();


});


$(document).ready(function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
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

    if ($('#meeting-table').length) {
        var meetingTable = $('#meeting-table').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: BASE_URL + "/meeting-report",
                type: 'GET',
            },

            columns: [
                {
                    data: null,
                    name: 'checkbox',
                    orderable: false,
                    searchable: false,
                    render: function (data, type, full, meta) {
                        return '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1">';
                    },
                    checkboxes: {
                        selectAllRender: '<input type="checkbox" class="form-check-input" id="custom-check">'
                    }
                },
                { data: 'meetId' },
                { data: 'name' },
                { data: 'email' },
                { data: 'room' },

                {
                    data: 'meeting_link',
                    name: 'meeting_link',
                    orderable: false,
                    searchable: false,
                    render: function (data, type, row) {

                        if (!data) return '-';

                        if (row.status === 'active') {
                            return `
                                <a href="${data}" target="_blank" class="text-primary">
                                    Join Link
                                </a>
                            `;
                        }

                        return '<span class="text-muted">Join Link</span>';
                    }
                },

                {
                    data: 'status',
                    name: 'status',
                    render: function (data) {

                        if (data === 'active') {
                            return '<span class="badge bg-success">Active</span>';
                        }

                        return '<span class="badge bg-danger">Expired</span>';
                    }
                },

                {
                    data: 'expires_at',
                    name: 'expires_at',
                    render: function (data) {

                        if (!data) return '-';

                        let date = new Date(data);

                        let day = ("0" + date.getDate()).slice(-2);
                        let month = ("0" + (date.getMonth() + 1)).slice(-2);
                        let year = date.getFullYear();

                        let hours = ("0" + date.getHours()).slice(-2);
                        let minutes = ("0" + date.getMinutes()).slice(-2);

                        return day + '-' + month + '-' + year + ' ' + hours + ':' + minutes;
                    }
                }


            ],

            language: {
                search: "",
                searchPlaceholder: "Search meeting...",
                lengthMenu: "_MENU_",
                paginate: {
                    next: "›",
                    previous: "‹"
                }
            }

        });
    }

});



