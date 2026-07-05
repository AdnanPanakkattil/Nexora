$(document).ready(function () {
    $("#claim_main_menu").addClass("active open menu-item-animating");
    $("#claims_management_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $('#send-message').click(function (e) {
    e.preventDefault();

    let message = $("#chat-message").val().trim();
    let fileInput = $('#attach-doc')[0];
    let file = fileInput.files[0];
    let preAuthorizationRequestId = $("#preAuthorizationRequestId").val();

    if (!message && !file) {
        return; // No message or file, do nothing
    }

    let formData = new FormData();
    formData.append('preAuthorizationRequestId', preAuthorizationRequestId);

    if (message) {
        formData.append('message', message);
    }

    if (file) {
        formData.append('file', file);
    }

$.ajax({
    url: BASE_URL + '/send-message/' + preAuthorizationRequestId,
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
        console.log("Message sent:", response);
        $("#chat-message").val("");
        $('#attach-doc').val('');
        $('#file-preview').addClass('d-none');
        $('#file-name').text('');

        // Pass correct file path to append function
        appendMessage(response.content, response.filePath);
    },
    error: function (xhr) {
        console.error("Send error:", xhr.responseText);
    }
});

});


function appendMessage(message, filePath) {
    let now = new Date();
    let hours = now.getHours() % 12 || 12;
    let minutes = now.getMinutes().toString().padStart(2, "0");
    let ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    let timeStr = `${hours}:${minutes} ${ampm}`;

    let fileHtml = '';
    if (filePath) {
        let fileUrl = BASE_URL + '/storage/' + filePath;
        fileHtml = `<p class="mb-0"><img src="${fileUrl}" style="max-width: 200px; border-radius: 5px; cursor:pointer;" onclick="window.open('${fileUrl}', '_blank')"></p>`;
    }

    let messageHtml = `
        <li class="chat-message chat-message-right">
            <div class="d-flex overflow-hidden">
                <div class="chat-message-wrapper flex-grow-1">
                    <div class="chat-message-text">
                        ${message ? `<p class="mb-0">${escapeHtml(message)}</p>` : ''}
                        ${fileHtml}
                    </div>
                    <div class="text-end text-muted mt-1">
                        <i class="ti ti-checks ti-16px text-success me-1"></i>
                        <small>${timeStr}</small>
                    </div>
                </div>
                <div class="user-avatar flex-shrink-0 ms-4">
                    <div class="avatar avatar-sm">
                        <img src="../../assets/img/avatars/1.png" alt="Avatar" class="rounded-circle" />
                    </div>
                </div>
            </div>
        </li>
    `;

    $(".chat-history").append(messageHtml);
    $('.chat-history').scrollTop($('.chat-history')[0].scrollHeight);
}



function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}



$('#attach-doc').on('change', function() {
    const file = this.files[0];

 $('#chat-message').hide();
    if (file) {
        $('#file-name').text(file.name);
        $('#file-preview').removeClass('d-none');
    } else {
        $('#file-preview').addClass('d-none');
        $('#file-name').text('');
    }
});

$('#remove-file').on('click', function() {
    $('#attach-doc').val(''); // clear file input
    $('#file-preview').addClass('d-none');
    $('#file-name').text('');
});


});
