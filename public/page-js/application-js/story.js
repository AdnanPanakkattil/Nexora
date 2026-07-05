let table;
let storyDropzone = null;

$(document).ready(function () {
$("#application_main_menu").addClass("active open menu-item-animating");
    $("#application_stories_sub_menu").addClass("active");
    table = $('#story_table').DataTable({
    processing: true,
    ajax: {
        url : storyRoutes.index,
        type: 'GET',
    },
    columns: [
        { data: 'sl',      orderable: true  },
        {
            data: 'title', 
            orderable: true,
            render: (val) => `<span class="fw-medium">${escHtml(val)}</span>`,
        },
        {
            data: 'images',
            orderable: false,
            render: (images, _, row) => renderImages(images, row.title),
        },
        {
            data: 'created_at',
            orderable: true,
            render: (val, _, row) =>
                `${val}<br><small class="text-muted">${row.created_time}</small>`,
        },
        {
            data: 'is_expired',
            orderable: false,
            render: (expired, _, row) => expired
                ? `<span class="badge bg-label-danger">Expired</span>`
                : `<span class="text-muted" style="font-size:12px;">
                       <i class="ti ti-clock me-1"></i>${escHtml(row.time_left)}
                   </span>`,
        },
        {
            data: 'status',
            orderable: true,
            render: (val) => val === 'published'
                ? `<span class="badge bg-label-success">Published</span>`
                : `<span class="badge bg-label-warning">Draft</span>`,
        },
        {
            data: null,
            orderable: false,
            render: (_, __, row) => renderActions(row),
        },
    ],
    pageLength: 5,
    lengthMenu: [5, 10, 25, 50],
    order: [[0, 'asc']],
});

});

// img uplding helper
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function imageListJson(images) {
    return escHtml(JSON.stringify(images.map(i => i.url)));
}

function renderImages(images, title) {
    if (!images || images.length === 0) {
        return '<span class="text-muted" style="font-size:12px;">No images</span>';
    }

    const imagesAttr = imageListJson(images);
    const titleAttr  = escHtml(title);

    if (images.length === 1) {
        return `
            <div class="avatar avatar-sm open-slider" style="cursor:pointer;"
                 data-title="${titleAttr}"
                 data-images="${imagesAttr}"
                 data-index="0">
                <img src="${escHtml(images[0].url)}" class="rounded">
            </div>`;
    }

    let html = `<ul class="list-unstyled m-0 avatar-group d-flex align-items-center">`;

    images.slice(0, 3).forEach((img, idx) => {
        html += `
            <li class="avatar avatar-sm pull-up open-slider" style="cursor:pointer;"
                data-title="${titleAttr}"
                data-images="${imagesAttr}"
                data-index="${idx}">
                <img src="${escHtml(img.url)}" class="rounded">
            </li>`;
    });

    if (images.length > 3) {
        html += `
            <li class="avatar avatar-sm bg-label-secondary text-center
                        d-flex align-items-center justify-content-center rounded"
                style="width:32px;height:32px;font-size:11px;">
                +${images.length - 3}
            </li>`;
    }

    html += `</ul>`;
    return html;
}

function renderActions(row) {
    const imagesAttr = imageListJson(row.images);
    const titleAttr  = escHtml(row.title);

    return `
        <div class="dropdown">
            <button type="button"
                    class="btn p-0 dropdown-toggle hide-arrow"
                    data-bs-toggle="dropdown">
                <i class="ti ti-dots-vertical"></i>
            </button>
            <div class="dropdown-menu">
                <a class="dropdown-item open-slider" href="#"
                   data-title="${titleAttr}"
                   data-images="${imagesAttr}"
                   data-index="0">
                    <i class="ti ti-eye me-2"></i> View
                </a>
                <a class="dropdown-item delete-story-btn" href="#"
                   data-id="${row.id}">
                    <i class="ti ti-trash me-2"></i> Delete
                </a>
            </div>
        </div>`;
}

function showLoader() {
    $('.loader-wrapper').css('display', 'flex').hide().fadeIn(200);
}

function hideLoader() {
    $('.loader-wrapper').fadeOut(200);
}


/* 
   DROPZONE
 */
(function () {

    Dropzone.autoDiscover = false;

    const previewTemplate = `
        <div class="dz-preview dz-file-preview">
            <div class="dz-details">
                <div class="dz-thumbnail">
                    <img data-dz-thumbnail />
                    <span class="dz-nopreview">No preview</span>
                    <div class="dz-success-mark"></div>
                    <div class="dz-error-mark"></div>
                    <div class="dz-error-message">
                        <span data-dz-errormessage></span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar progress-bar-primary"
                             data-dz-uploadprogress></div>
                    </div>
                </div>
                <div class="dz-filename">
                    <span data-dz-name></span>
                </div>
                <div class="dz-size" data-dz-size></div>
            </div>
            <a class="dz-remove" href="javascript:undefined;" data-dz-remove>
                Remove
            </a>
        </div>`;

    const modal = document.getElementById('createStoryModal');

    if (!modal) return;

    modal.addEventListener('shown.bs.modal', function () {

        if (storyDropzone) return;

        const el = document.querySelector('#storyDropzone');

        if (!el) return;

        storyDropzone = new Dropzone(el, {
            url             : '#',
            autoProcessQueue: false,
            uploadMultiple  : true,
            parallelUploads : 10,
            maxFiles        : 10,
            maxFilesize     : 5,
            acceptedFiles   : 'image/*',
            addRemoveLinks  : true,
            previewTemplate : previewTemplate,
            dictDefaultMessage: '',
            dictRemoveFile  : 'Remove',
        });

    });

    modal.addEventListener('hidden.bs.modal', function () {

        $('#title').val('');
        $('#status').val('published');
        $('#title-error, #images-error').text('');

        if (storyDropzone) {
            storyDropzone.removeAllFiles(true);
            storyDropzone.destroy();
            storyDropzone = null;
        }

    });

})();


// create stry
$(document).on('click', '#StorySaveBtn', function () {

    $('#title-error, #images-error').text('');

    let title  = $('#title').val().trim();
    let status = $('#status').val();
    let files  = storyDropzone ? storyDropzone.getAcceptedFiles() : [];
    let hasErr = false;

    if (!title)        { $('#title-error').text('Title is required.');                 hasErr = true; }
    if (!files.length) { $('#images-error').text('Please upload at least one image.'); hasErr = true; }
    if (hasErr) return;

    let payload = JSON.stringify({
        title : title,
        status: status,
        source: 'admin_panel',
    });

    let fd = new FormData();
    fd.append('title',   title);
    fd.append('payload', payload);
    files.forEach(file => fd.append('images[]', file));

    $("#loader-overlay").show();
    $.ajax({
        url         : storyRoutes.store,
        type        : 'POST',
        data        : fd,
        processData : false,
        contentType : false,
        headers     : { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },

        success: function (res) {
            $("#loader-overlay").hide();
            hideLoader();

            if (!res.success) {
                Swal.fire('Error', 'Something failed', 'error');
                return;
            }

            $('#createStoryModal').modal('hide');

            // Reload DataTable
            table.ajax.reload(null, false);

            Swal.fire({
                icon : 'success',
                title: 'Success',
                text : res.message,
                timer: 1800,
                showConfirmButton: false,
            });
        },

        error: function (err) {
            $("#loader-overlay").hide();
            hideLoader();
            let errors = err.responseJSON?.errors || {};
            $('#title-error').text(errors.title?.[0] ?? '');
            $('#images-error').text(
                errors.images?.[0] ?? errors['images.0']?.[0] ?? ''
            );
        }
    });

});


// delete stry
$(document).on('click', '.delete-story-btn', function (e) {

    e.preventDefault();

    let id = $(this).data('id');

    Swal.fire({
        title          : 'Delete this story?',
        text           : 'All images will also be removed.',
        icon           : 'warning',
        customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton:
                    "btn btn-label-secondary waves-effect waves-light",
            },
        confirmButtonColor: '#d33',
        confirmButtonText : 'Yes, delete',
    }).then(result => {

        if (!result.isConfirmed) return;

        $("#loader-overlay").show();
        $.ajax({
            url    : storyRoutes.destroy + '/' + id,
            type   : 'DELETE',
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },

            success: function (res) {
                $("#loader-overlay").hide();
                hideLoader();

                if (!res.success) {
                    Swal.fire('Error', 'Delete failed', 'error');
                    return;
                }

                // Reload DataTable
                table.ajax.reload(null, false);

                Swal.fire({
                    icon : 'success',
                    title: 'Deleted!',
                    text : res.message,
                    timer: 1500,
                    showConfirmButton: false,
                });
            },

            error: function () {
                $("#loader-overlay").hide();
                hideLoader();
                Swal.fire('Error', 'Delete failed', 'error');
            }
        });

    });

});


/*IMAGE SLIDER */
let sliderImages = [];
let sliderIndex  = 0;

function openSlider(images, title, startIndex) {
    sliderImages = images;
    sliderIndex  = startIndex;
    $('#sliderStoryTitle').text(title);
    buildSliderUI();
    goToSlide(startIndex);
    $('#imageSliderModal').modal('show');
}

function buildSliderUI() {
    $('#sliderDots').html(
        sliderImages.map((_, i) =>
            `<div class="slider-dot" data-idx="${i}"></div>`
        ).join('')
    );
    $('#sliderThumbs').html(
        sliderImages.map((src, i) =>
            `<img src="${src}" class="slider-thumb" data-idx="${i}">`
        ).join('')
    );
}

function goToSlide(i) {
    sliderIndex = (i + sliderImages.length) % sliderImages.length;
    let img = document.getElementById('sliderMainImg');
    img.style.opacity = 0;
    setTimeout(() => {
        img.src = sliderImages[sliderIndex];
        img.style.opacity = 1;
    }, 150);
    $('#sliderCounter').text(`${sliderIndex + 1} / ${sliderImages.length}`);
    $('#sliderDots .slider-dot').removeClass('active')
        .filter(`[data-idx="${sliderIndex}"]`).addClass('active');
    $('#sliderThumbs .slider-thumb').removeClass('active')
        .filter(`[data-idx="${sliderIndex}"]`).addClass('active');
}

$('#sliderPrev').click(() => goToSlide(sliderIndex - 1));
$('#sliderNext').click(() => goToSlide(sliderIndex + 1));

$(document).on('click', '#sliderDots .slider-dot',
    function () { goToSlide(+$(this).data('idx')); });
$(document).on('click', '#sliderThumbs .slider-thumb',
    function () { goToSlide(+$(this).data('idx')); });
$(document).on('keydown', function (e) {
    if (!$('#imageSliderModal').hasClass('show')) return;
    if (e.key === 'ArrowLeft')  goToSlide(sliderIndex - 1);
    if (e.key === 'ArrowRight') goToSlide(sliderIndex + 1);
});
$(document).on('click', '.open-slider', function (e) {
    e.preventDefault();
    let images = JSON.parse($(this).attr('data-images'));
    let title  = $(this).data('title');
    let idx    = parseInt($(this).data('index')) || 0;
    openSlider(images, title, idx);
});